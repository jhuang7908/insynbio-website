# VHH QA v3.4/v3.5 改进计划

**日期**: 2025年12月10日  
**当前版本**: v3.3.0  
**目标版本**: v3.4.0, v3.5.0

---

## 一、问题分析

### ❌ 问题1: final_score权重体系过于启发式

**当前实现**:
```python
final_score = combined - 0.20 * structural_risk - hallmark_penalty
```

**问题**:
1. `structural_risk`的定义不够严格（score 0~1的来源未定义）
2. `0.20`的权重太随意（不是基于分布校准）
3. `hallmark_penalty = 0.15`也需要生物物理来源

**影响**: 
- 权重缺乏科学依据
- 无法适应不同数据分布
- 难以解释和调试

---

### ❌ 问题2: ranking sanity规则依赖阈值，而非学习型模型

**当前实现**:
```python
if fr_gap >= 0.10 and comb_gap <= 0.03:
    errors.append("Ranking sanity violated...")
```

**问题**:
1. 仍然是heuristic（经验阈值）
2. 没有考虑pairwise consistency
3. 没有使用isotonic regression校准

**影响**:
- 阈值可能不适合所有场景
- 无法学习数据中的模式
- 缺乏相对排序稳定性判断

---

### ❌ 问题3: 结构风险没有分层

**当前实现**:
- `structural_risk`是一维量（0~1）
- 只捕获了grafting impact的近似

**缺失的维度**:
1. **FR2 hydrophilic patch完整性**（37/44/45/47）
2. **Grafting在interface上的能量变化**（ΔΔG proxy）
3. **CDR3 anchor residues**（95/96/101/102）是否匹配模板几何结构

**影响**:
- 对VHH来说，CDR3 anchor是生死线
- 无法区分不同来源的结构风险
- 可能导致关键风险被忽略

---

## 二、v3.4改进计划

### 🎯 目标：基于数据分布校准的权重体系 + 分层结构风险

---

### 改进1: 引入经验数据分布校准（Distribution Calibration）

#### 1.1 数据收集模块

**文件**: `core/vhh_qa_data_calibration.py`

**功能**:
```python
class VHHDataCalibration:
    """
    基于历史VHH数据库统计，校准QA阈值和权重
    """
    
    def __init__(self, calibration_db_path: str):
        """
        加载校准数据库
        
        数据库结构：
        {
            "successful_cases": [
                {
                    "structural_risk": float,
                    "has_hallmark": bool,
                    "cdr3_anchor_match": bool,
                    "final_outcome": "success"
                },
                ...
            ],
            "failed_cases": [
                {
                    "structural_risk": float,
                    "has_hallmark": bool,
                    "cdr3_anchor_match": bool,
                    "final_outcome": "failed",
                    "failure_reason": str
                },
                ...
            ]
        }
        """
        self.db = self._load_calibration_db(calibration_db_path)
        self._compute_distributions()
    
    def _compute_distributions(self):
        """计算成功/失败案例的分布统计"""
        # 成功案例的structural_risk分布
        success_risks = [c["structural_risk"] for c in self.db["successful_cases"]]
        self.success_risk_median = np.median(success_risks)
        self.success_risk_p75 = np.percentile(success_risks, 75)
        
        # 失败案例的structural_risk分布
        failed_risks = [c["structural_risk"] for c in self.db["failed_cases"]]
        self.failed_risk_median = np.median(failed_risks)
        self.failed_risk_p25 = np.percentile(failed_risks, 25)
        
        # 计算校准权重
        self._calibrate_weights()
    
    def _calibrate_weights(self):
        """
        基于分布差异校准权重
        
        原理：
        - 如果成功案例的median risk = 0.2，失败案例的median risk = 0.6
        - 则risk差异 = 0.4，这是"有意义的差异"
        - 权重应该使得这个差异能够显著影响final_score
        """
        risk_diff = self.failed_risk_median - self.success_risk_median
        
        # 目标：使得risk差异能够产生至少0.1的final_score差异
        # 即：weight * risk_diff >= 0.1
        self.structural_risk_weight = max(0.1, 0.1 / risk_diff) if risk_diff > 0 else 0.2
        
        # Hallmark penalty校准
        success_with_hallmark = sum(1 for c in self.db["successful_cases"] 
                                   if c.get("has_hallmark", True))
        failed_without_hallmark = sum(1 for c in self.db["failed_cases"] 
                                     if not c.get("has_hallmark", True))
        
        total_success = len(self.db["successful_cases"])
        total_failed = len(self.db["failed_cases"])
        
        if total_success > 0 and total_failed > 0:
            hallmark_success_rate = success_with_hallmark / total_success
            hallmark_failure_rate = failed_without_hallmark / total_failed
            
            # Hallmark缺失的失败率差异
            hallmark_impact = hallmark_failure_rate - (1 - hallmark_success_rate)
            self.hallmark_penalty = max(0.05, min(0.25, hallmark_impact))
        else:
            self.hallmark_penalty = 0.15  # 默认值
    
    def get_calibrated_weights(self) -> Dict[str, float]:
        """返回校准后的权重"""
        return {
            "structural_risk_weight": self.structural_risk_weight,
            "hallmark_penalty": self.hallmark_penalty,
            "success_risk_median": self.success_risk_median,
            "failed_risk_median": self.failed_risk_median,
            "calibration_source": "VHH_historical_database"
        }
```

#### 1.2 更新final_score计算

**文件**: `core/vhh_qa_validation_v3_4.py`

```python
def compute_final_score_v3_4(
    candidate: Dict[str, Any],
    calibration: Optional[VHHDataCalibration] = None
) -> float:
    """
    v3.4: 使用校准权重的final_score计算
    
    Args:
        candidate: 候选模板字典
        calibration: 数据校准器（如果提供，使用校准权重；否则使用默认值）
    """
    scores = candidate.get("alignment_scores", {}) or candidate.get("scores", {})
    base = scores.get("combined_score", 0) or scores.get("combined", 0)
    
    # 获取structural_risk（需要从分层风险计算）
    structural_risk = _compute_layered_structural_risk(candidate)
    
    # 获取校准权重
    if calibration:
        weights = calibration.get_calibrated_weights()
        structural_risk_weight = weights["structural_risk_weight"]
        hallmark_penalty = weights["hallmark_penalty"]
    else:
        # 默认值（向后兼容）
        structural_risk_weight = 0.20
        hallmark_penalty = 0.15
    
    # Hallmark penalty
    flags = candidate.get("flags", {}) or {}
    template = candidate.get("template", {})
    if isinstance(template, dict):
        template_flags = template.get("flags", {}) or {}
        flags = {**flags, **template_flags}
    
    actual_hallmark_penalty = 0.0
    if not flags.get("has_vhh_hallmark", True):
        actual_hallmark_penalty = hallmark_penalty
    elif flags.get("reduced_hallmark", False):
        actual_hallmark_penalty = hallmark_penalty * 0.33  # 减少的penalty
    
    final = base - structural_risk_weight * structural_risk - actual_hallmark_penalty
    
    # 更新candidate的scores
    if "scores" not in candidate:
        candidate["scores"] = {}
    candidate["scores"]["final"] = final
    candidate["scores"]["structural_risk"] = structural_risk
    candidate["scores"]["structural_risk_weight"] = structural_risk_weight
    candidate["scores"]["hallmark_penalty"] = actual_hallmark_penalty
    
    return final
```

---

### 改进2: 分层结构风险（Layered Structural Risk）

#### 2.1 定义分层风险结构

**文件**: `core/vhh_qa_structural_risk_layered.py`

```python
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class StructuralRiskComponents:
    """结构风险的分层组件"""
    fr2_hydrophilic_patch_risk: float  # 0~1, FR2 hydrophilic patch完整性
    grafting_interface_risk: float      # 0~1, Grafting在interface上的能量变化
    cdr3_anchor_risk: float            # 0~1, CDR3 anchor residues匹配度
    
    @property
    def total_risk(self) -> float:
        """
        加权组合总风险
        
        权重：
        - FR2 risk: 0.3（重要但可容忍）
        - Grafting risk: 0.3（重要但可容忍）
        - CDR3 anchor risk: 0.4（生死线，权重最高）
        """
        return (
            0.3 * self.fr2_hydrophilic_patch_risk +
            0.3 * self.grafting_interface_risk +
            0.4 * self.cdr3_anchor_risk
        )
    
    def to_dict(self) -> Dict[str, float]:
        """转换为字典"""
        return {
            "fr2_hydrophilic_patch_risk": self.fr2_hydrophilic_patch_risk,
            "grafting_interface_risk": self.grafting_interface_risk,
            "cdr3_anchor_risk": self.cdr3_anchor_risk,
            "total_risk": self.total_risk
        }


def compute_layered_structural_risk(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str],
    template_info: Optional[Dict[str, Any]] = None
) -> StructuralRiskComponents:
    """
    计算分层结构风险
    
    Args:
        orig_regions: 原始序列区域
        hum_regions: 人源化序列区域
        template_info: 模板信息（用于anchor匹配）
    
    Returns:
        StructuralRiskComponents
    """
    # 1. FR2 hydrophilic patch风险
    fr2_risk = _compute_fr2_hydrophilic_patch_risk(orig_regions, hum_regions)
    
    # 2. Grafting interface风险
    grafting_risk = _compute_grafting_interface_risk(orig_regions, hum_regions)
    
    # 3. CDR3 anchor风险（关键）
    anchor_risk = _compute_cdr3_anchor_risk(orig_regions, hum_regions, template_info)
    
    return StructuralRiskComponents(
        fr2_hydrophilic_patch_risk=fr2_risk,
        grafting_interface_risk=grafting_risk,
        cdr3_anchor_risk=anchor_risk
    )


def _compute_fr2_hydrophilic_patch_risk(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str]
) -> float:
    """
    计算FR2 hydrophilic patch完整性风险
    
    VHH hallmark位置：37, 44, 45, 47
    这些位置形成hydrophilic patch，对单域折叠至关重要
    """
    VHH_HALLMARK_POSITIONS = [37, 44, 45, 47]
    
    orig_fr2 = orig_regions.get("FR2", "")
    hum_fr2 = hum_regions.get("FR2", "")
    
    if not orig_fr2 or not hum_fr2:
        return 1.0  # 缺失FR2，风险最高
    
    # 检查每个hallmark位置的保留情况
    preserved_count = 0
    for pos in VHH_HALLMARK_POSITIONS:
        # 转换为FR2内的索引（FR2从IMGT 39开始）
        fr2_start = 39
        local_idx = pos - fr2_start
        
        if 0 <= local_idx < len(orig_fr2) and 0 <= local_idx < len(hum_fr2):
            orig_aa = orig_fr2[local_idx]
            hum_aa = hum_fr2[local_idx]
            
            # 如果保留或变为更hydrophilic的残基，算保留
            if orig_aa == hum_aa:
                preserved_count += 1
            elif _is_hydrophilic_improvement(orig_aa, hum_aa):
                preserved_count += 1
    
    # 风险 = 1 - 保留比例
    risk = 1.0 - (preserved_count / len(VHH_HALLMARK_POSITIONS))
    return max(0.0, min(1.0, risk))


def _compute_grafting_interface_risk(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str]
) -> float:
    """
    计算grafting在interface上的能量变化风险（ΔΔG proxy）
    
    使用现有的qa_grafting_impact，但转换为0~1的风险分数
    """
    from core.vhh_qa_grafting import qa_grafting_impact
    
    _, _, impact_details = qa_grafting_impact(orig_regions, hum_regions)
    impact_normalized = impact_details.get("impact_score_normalized", 0)
    
    # 归一化到0~1风险分数
    # impact_normalized通常在0~1之间，但可能超过1
    risk = min(1.0, impact_normalized / 0.4)  # 0.4是error阈值
    return risk


def _compute_cdr3_anchor_risk(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str],
    template_info: Optional[Dict[str, Any]] = None
) -> float:
    """
    计算CDR3 anchor residues匹配度风险（生死线）
    
    CDR3 anchor位置：IMGT 95, 96, 101, 102
    这些位置在FR3中，对CDR3构型至关重要
    
    如果模板101/102为某种类型，humanized也要保持一致
    否则structural_risk ≥ 0.7 → 必须fail
    """
    CDR3_ANCHOR_POSITIONS = [95, 96, 101, 102]  # IMGT位置
    
    orig_fr3 = orig_regions.get("FR3", "")
    hum_fr3 = hum_regions.get("FR3", "")
    
    if not orig_fr3 or not hum_fr3:
        return 1.0  # 缺失FR3，风险最高
    
    # FR3从IMGT 66开始
    fr3_start = 66
    
    # 检查每个anchor位置的匹配情况
    mismatches = 0
    critical_mismatches = 0  # 101/102是关键位置
    
    for pos in CDR3_ANCHOR_POSITIONS:
        local_idx = pos - fr3_start
        
        if 0 <= local_idx < len(orig_fr3) and 0 <= local_idx < len(hum_fr3):
            orig_aa = orig_fr3[local_idx]
            hum_aa = hum_fr3[local_idx]
            
            if orig_aa != hum_aa:
                mismatches += 1
                # 101/102是关键位置
                if pos in [101, 102]:
                    critical_mismatches += 1
    
    # 风险计算
    if critical_mismatches > 0:
        # 关键位置不匹配，风险极高
        risk = 0.7 + (critical_mismatches * 0.15)  # 至少0.7，每个关键mismatch +0.15
    else:
        # 非关键位置不匹配，风险较低
        risk = mismatches * 0.2  # 每个mismatch +0.2
    
    # 如果模板信息可用，检查模板的anchor类型
    if template_info:
        template_fr3 = template_info.get("fr3_sequence", "")
        if template_fr3:
            template_anchor_101 = template_fr3[101 - fr3_start] if 101 - fr3_start < len(template_fr3) else None
            template_anchor_102 = template_fr3[102 - fr3_start] if 102 - fr3_start < len(template_fr3) else None
            
            hum_anchor_101 = hum_fr3[101 - fr3_start] if 101 - fr3_start < len(hum_fr3) else None
            hum_anchor_102 = hum_fr3[102 - fr3_start] if 102 - fr3_start < len(hum_fr3) else None
            
            # 如果humanized的anchor与模板不匹配，风险极高
            if template_anchor_101 and hum_anchor_101 and template_anchor_101 != hum_anchor_101:
                risk = max(risk, 0.8)
            if template_anchor_102 and hum_anchor_102 and template_anchor_102 != hum_anchor_102:
                risk = max(risk, 0.8)
    
    return max(0.0, min(1.0, risk))
```

#### 2.2 更新QA验证逻辑

**文件**: `core/vhh_qa_validation_v3_4.py`

```python
def validate_vhh_humanization_result_v3_4(
    result: Dict[str, Any],
    strict: bool = True,
    calibration: Optional[VHHDataCalibration] = None
) -> Dict[str, Any]:
    """
    VHH人源化结果QA验证 v3.4
    
    v3.4升级：
    - 基于数据分布校准的权重体系
    - 分层结构风险（FR2/grafting/CDR3 anchor）
    """
    # ... (复用v3.3的基础检查)
    
    # === v3.4: 计算分层结构风险 ===
    orig_regions = seq_analysis.get("original_regions", {}) or {}
    hum_regions = seq_analysis.get("humanized_regions", {}) or {}
    template_info = result.get("best_match", {}).get("template", {})
    
    structural_risk_components = compute_layered_structural_risk(
        orig_regions, hum_regions, template_info
    )
    
    # 检查CDR3 anchor风险（生死线）
    if structural_risk_components.cdr3_anchor_risk >= 0.7:
        errors.append(
            f"CDR3 anchor residues风险过高 ({structural_risk_components.cdr3_anchor_risk:.2f})，"
            "这是VHH折叠的生死线。模板101/102位置与humanized不匹配，"
            "可能导致结构不稳定或无法折叠。"
        )
    
    # === v3.4: 使用校准权重计算final_score ===
    candidates = result.get("candidates", [])
    if candidates:
        for cand in candidates:
            # 计算分层结构风险
            cand_orig_regions = ...  # 从candidate获取
            cand_hum_regions = ...   # 从candidate获取
            cand_risk_components = compute_layered_structural_risk(
                cand_orig_regions, cand_hum_regions, cand.get("template", {})
            )
            
            # 更新candidate的structural_risk
            if "scores" not in cand:
                cand["scores"] = {}
            cand["scores"]["structural_risk"] = cand_risk_components.total_risk
            cand["scores"]["structural_risk_components"] = cand_risk_components.to_dict()
            
            # 使用校准权重计算final_score
            compute_final_score_v3_4(cand, calibration)
    
    # ... (其余逻辑)
```

---

## 三、v3.5改进计划

### 🎯 目标：相对排序稳定性模型（Ranking Stability Model）

---

### 改进3: 引入相对排序稳定性模型

#### 3.1 定义排序稳定性模型

**文件**: `core/vhh_qa_ranking_stability.py`

```python
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import numpy as np
from sklearn.isotonic import IsotonicRegression

@dataclass
class RankingStabilityResult:
    """排序稳定性分析结果"""
    is_stable: bool
    stability_score: float  # 0~1, 越高越稳定
    swap_risk: float        # 0~1, 如果best和second互换的风险
    consistency_issues: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_stable": self.is_stable,
            "stability_score": self.stability_score,
            "swap_risk": self.swap_risk,
            "consistency_issues": self.consistency_issues
        }


def analyze_ranking_stability(
    candidates: List[Dict[str, Any]],
    calibration: Optional[VHHDataCalibration] = None
) -> RankingStabilityResult:
    """
    分析排序稳定性
    
    原理：
    1. 计算best和second互换后的风险变化
    2. 如果差异 < 阈值 → ranking unstable
    3. 使用pairwise consistency判断
    4. 可选：使用isotonic regression校准score consistency
    """
    if len(candidates) < 2:
        return RankingStabilityResult(
            is_stable=True,
            stability_score=1.0,
            swap_risk=0.0,
            consistency_issues=[]
        )
    
    best = candidates[0]
    second = candidates[1]
    
    # 1. 计算互换后的风险变化
    swap_risk = _compute_swap_risk(best, second, calibration)
    
    # 2. Pairwise consistency检查
    consistency_issues = _check_pairwise_consistency(candidates)
    
    # 3. 计算稳定性分数
    stability_score = 1.0 - swap_risk
    if consistency_issues:
        stability_score -= len(consistency_issues) * 0.1
    
    stability_score = max(0.0, min(1.0, stability_score))
    
    # 4. 判断是否稳定
    is_stable = stability_score >= 0.7 and swap_risk < 0.3
    
    return RankingStabilityResult(
        is_stable=is_stable,
        stability_score=stability_score,
        swap_risk=swap_risk,
        consistency_issues=consistency_issues
    )


def _compute_swap_risk(
    best: Dict[str, Any],
    second: Dict[str, Any],
    calibration: Optional[VHHDataCalibration] = None
) -> float:
    """
    计算best和second互换后的风险变化
    
    如果互换后风险显著增加，说明当前排序是合理的
    如果互换后风险变化很小，说明排序不稳定
    """
    # 获取当前final_score
    best_final = best.get("scores", {}).get("final", 0)
    second_final = second.get("scores", {}).get("final", 0)
    
    current_gap = best_final - second_final
    
    # 模拟互换：计算如果second成为best的风险
    # 这里使用structural_risk作为风险代理
    best_risk = best.get("scores", {}).get("structural_risk", 0)
    second_risk = second.get("scores", {}).get("structural_risk", 0)
    
    # 如果second的risk显著高于best，说明互换风险大（当前排序合理）
    risk_diff = second_risk - best_risk
    
    # 如果risk差异小但final_score差异也小，说明排序不稳定
    if abs(risk_diff) < 0.1 and abs(current_gap) < 0.05:
        swap_risk = 0.5  # 中等风险
    elif risk_diff > 0.2:
        swap_risk = 0.1  # 低风险（互换明显更差）
    elif risk_diff < -0.1:
        swap_risk = 0.8  # 高风险（second实际上更好？）
    else:
        swap_risk = 0.3  # 中等风险
    
    return swap_risk


def _check_pairwise_consistency(
    candidates: List[Dict[str, Any]]
) -> List[str]:
    """
    检查pairwise consistency
    
    对于每对候选模板，检查：
    - 如果A的FR identity > B，但A的final_score < B，这是不一致的
    - 如果A的structural_risk < B，但A的final_score < B，这也是不一致的
    """
    issues = []
    
    for i in range(len(candidates)):
        for j in range(i + 1, len(candidates)):
            a = candidates[i]
            b = candidates[j]
            
            a_scores = a.get("scores", {}) or a.get("alignment_scores", {})
            b_scores = b.get("scores", {}) or b.get("alignment_scores", {})
            
            a_fr = a_scores.get("fr_identity", 0) or a_scores.get("framework_identity", 0)
            b_fr = b_scores.get("fr_identity", 0) or b_scores.get("framework_identity", 0)
            
            a_final = a_scores.get("final", 0)
            b_final = b_scores.get("final", 0)
            
            # 检查不一致性
            if a_fr > b_fr + 0.05 and a_final < b_final - 0.02:
                issues.append(
                    f"候选模板 {a.get('template_id', f'#{i+1}')} 的FR identity ({a_fr:.2f}) "
                    f"显著高于 {b.get('template_id', f'#{j+1}')} ({b_fr:.2f})，"
                    f"但final_score更低 ({a_final:.3f} vs {b_final:.3f})，排序不一致。"
                )
    
    return issues


def calibrate_score_consistency(
    candidates: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    使用isotonic regression校准score consistency
    
    确保combined_score和final_score的单调性
    """
    # 提取combined_score和final_score
    combined_scores = []
    final_scores = []
    
    for cand in candidates:
        scores = cand.get("scores", {}) or cand.get("alignment_scores", {})
        combined = scores.get("combined_score", 0) or scores.get("combined", 0)
        final = scores.get("final", combined)
        
        combined_scores.append(combined)
        final_scores.append(final)
    
    if len(combined_scores) < 3:
        return {"calibrated": False, "reason": "insufficient_data"}
    
    # 使用isotonic regression校准
    try:
        ir = IsotonicRegression(out_of_bounds='clip')
        calibrated_final = ir.fit_transform(combined_scores, final_scores)
        
        # 检查校准后的单调性
        is_monotonic = all(calibrated_final[i] >= calibrated_final[i+1] 
                          for i in range(len(calibrated_final)-1))
        
        return {
            "calibrated": True,
            "is_monotonic": is_monotonic,
            "calibration_model": ir,
            "calibrated_scores": calibrated_final.tolist()
        }
    except Exception as e:
        return {"calibrated": False, "reason": str(e)}
```

#### 3.2 更新ranking sanity检查

**文件**: `core/vhh_qa_validation_v3_5.py`

```python
def _qa_ranking_sanity_v3_5(
    candidates: List[Dict[str, Any]],
    errors: List[str],
    warnings: List[Dict[str, str]],
    calibration: Optional[VHHDataCalibration] = None
) -> Dict[str, Any]:
    """
    v3.5升级：使用排序稳定性模型的ranking sanity检查
    """
    from core.vhh_qa_ranking_stability import (
        analyze_ranking_stability,
        calibrate_score_consistency
    )
    
    sanity_details = {
        "ranking_issues": [],
        "score_consistency": {},
        "stability_analysis": {}
    }
    
    if not candidates or len(candidates) < 2:
        return sanity_details
    
    # 1. 排序稳定性分析
    stability_result = analyze_ranking_stability(candidates, calibration)
    sanity_details["stability_analysis"] = stability_result.to_dict()
    
    # 2. Score consistency校准
    consistency_result = calibrate_score_consistency(candidates)
    sanity_details["score_consistency"] = consistency_result
    
    # 3. 根据稳定性结果生成errors/warnings
    if not stability_result.is_stable:
        if stability_result.swap_risk >= 0.7:
            errors.append(
                f"排序不稳定：最佳模板和次优模板互换后风险变化极小 "
                f"(swap_risk={stability_result.swap_risk:.2f})，"
                "当前排序可能不正确。建议重新评估模板选择策略。"
            )
        else:
            warnings.append(_create_warning(
                "major",
                "ranking",
                f"排序稳定性较低 (stability_score={stability_result.stability_score:.2f})，"
                f"建议人工复核模板选择。"
            ))
    
    # 4. Pairwise consistency问题
    if stability_result.consistency_issues:
        for issue in stability_result.consistency_issues:
            warnings.append(_create_warning(
                "major",
                "ranking",
                issue
            ))
    
    # 5. Score consistency问题
    if consistency_result.get("calibrated") and not consistency_result.get("is_monotonic"):
        warnings.append(_create_warning(
            "minor",
            "ranking",
            "Score一致性校准后仍存在非单调性，建议检查评分模型。"
        ))
    
    return sanity_details
```

---

## 四、实施时间表

### v3.4（预计2周）

**Week 1**:
- [ ] 创建数据校准模块
- [ ] 实现分层结构风险计算
- [ ] 更新final_score计算逻辑
- [ ] 单元测试

**Week 2**:
- [ ] 集成到QA验证流程
- [ ] 更新测试用例
- [ ] 文档更新
- [ ] 完整测试套件验证

### v3.5（预计2周）

**Week 1**:
- [ ] 创建排序稳定性模型
- [ ] 实现pairwise consistency检查
- [ ] 集成isotonic regression
- [ ] 单元测试

**Week 2**:
- [ ] 更新ranking sanity检查
- [ ] 更新测试用例
- [ ] 文档更新
- [ ] 完整测试套件验证

---

## 五、数据需求

### 校准数据库

需要收集以下数据：

1. **成功案例**（至少100个）:
   - structural_risk值
   - has_hallmark标志
   - cdr3_anchor_match标志
   - final_outcome = "success"

2. **失败案例**（至少50个）:
   - structural_risk值
   - has_hallmark标志
   - cdr3_anchor_match标志
   - final_outcome = "failed"
   - failure_reason

### 数据来源

- 内部VHH人源化项目历史数据
- 公开VHH结构数据库（SAbDab）
- 文献报道的VHH人源化案例

---

## 六、风险评估

### 技术风险

1. **数据不足**: 如果校准数据库样本量不足，校准可能不准确
   - **缓解**: 使用bootstrap方法估计置信区间

2. **计算复杂度**: 分层风险计算和排序稳定性分析可能增加计算时间
   - **缓解**: 使用缓存和并行计算

3. **向后兼容性**: v3.4/v3.5的权重变化可能影响现有结果
   - **缓解**: 提供向后兼容模式，允许使用默认权重

### 业务风险

1. **阈值变化**: 校准后的阈值可能导致更多/更少的failures
   - **缓解**: 逐步部署，A/B测试

2. **解释性**: 分层风险和排序稳定性模型可能难以向用户解释
   - **缓解**: 提供详细的报告和可视化

---

## 七、总结

### v3.4关键改进

1. ✅ 基于数据分布校准的权重体系
2. ✅ 分层结构风险（FR2/grafting/CDR3 anchor）
3. ✅ CDR3 anchor风险作为生死线检查

### v3.5关键改进

1. ✅ 相对排序稳定性模型
2. ✅ Pairwise consistency检查
3. ✅ Isotonic regression校准

### 预期效果

- **更科学的权重**: 基于数据而非经验
- **更精确的风险评估**: 分层识别不同来源的风险
- **更稳定的排序**: 减少排序不一致性
- **更好的解释性**: 明确的风险来源和排序依据

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















