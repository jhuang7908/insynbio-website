# VHH QA v3.4 实施指南（Cursor 指令版）

**日期**: 2025年12月10日  
**目标版本**: v3.4.0  
**工作目录**: `D:\InSynBio-AI-Research\Antibody_Engineer_Suite`

---

## 指令 0：切分支，锁定工作区

### 步骤 0.1：检查当前状态

```powershell
cd D:\InSynBio-AI-Research\Antibody_Engineer_Suite
git status
```

### 步骤 0.2：创建并切换到新分支

```powershell
git checkout -b feature/vhh_qa_v3_4
```

---

## 指令 1：新建校准模块 `core/vhh_qa_data_calibration.py`

### 步骤 1.1：创建文件

在 Cursor 左侧 Explorer 中，定位到 `core/` 目录，新建文件：`core/vhh_qa_data_calibration.py`

### 步骤 1.2：写入完整代码

```python
"""
VHH QA数据校准模块

基于历史VHH数据库统计，校准QA阈值和权重
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional, List
import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parents[1]


class VHHDataCalibration:
    """
    基于历史VHH数据库统计，校准QA阈值和权重
    """
    
    def __init__(self, calibration_db_path: Optional[str] = None):
        """
        初始化校准器
        
        Args:
            calibration_db_path: 校准数据库JSON文件路径（可选）
                                如果为None，使用默认值或内置默认权重
        """
        self.calibration_db_path = calibration_db_path
        self.db = None
        self.success_risk_median = 0.2
        self.success_risk_p75 = 0.3
        self.failed_risk_median = 0.6
        self.failed_risk_p25 = 0.5
        self.structural_risk_weight = 0.20
        self.hallmark_penalty = 0.15
        
        if calibration_db_path:
            self.db = self._load_calibration_db(calibration_db_path)
            self._compute_distributions()
        else:
            # 使用默认值（向后兼容）
            self._use_default_weights()
    
    def _load_calibration_db(self, db_path: str) -> Dict[str, Any]:
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
        db_file = Path(db_path)
        if not db_file.exists():
            # 如果文件不存在，使用默认值
            return {"successful_cases": [], "failed_cases": []}
        
        with open(db_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _compute_distributions(self):
        """计算成功/失败案例的分布统计"""
        if not self.db:
            self._use_default_weights()
            return
        
        # 成功案例的structural_risk分布
        success_cases = self.db.get("successful_cases", [])
        if success_cases:
            success_risks = [c.get("structural_risk", 0.2) for c in success_cases]
            self.success_risk_median = float(np.median(success_risks))
            self.success_risk_p75 = float(np.percentile(success_risks, 75))
        else:
            self.success_risk_median = 0.2
            self.success_risk_p75 = 0.3
        
        # 失败案例的structural_risk分布
        failed_cases = self.db.get("failed_cases", [])
        if failed_cases:
            failed_risks = [c.get("structural_risk", 0.6) for c in failed_cases]
            self.failed_risk_median = float(np.median(failed_risks))
            self.failed_risk_p25 = float(np.percentile(failed_risks, 25))
        else:
            self.failed_risk_median = 0.6
            self.failed_risk_p25 = 0.5
        
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
        
        if risk_diff > 0:
            # 目标：使得risk差异能够产生至少0.1的final_score差异
            # 即：weight * risk_diff >= 0.1
            self.structural_risk_weight = max(0.1, 0.1 / risk_diff)
        else:
            self.structural_risk_weight = 0.20  # 默认值
        
        # Hallmark penalty校准
        success_cases = self.db.get("successful_cases", [])
        failed_cases = self.db.get("failed_cases", [])
        
        if success_cases and failed_cases:
            success_with_hallmark = sum(1 for c in success_cases 
                                       if c.get("has_hallmark", True))
            failed_without_hallmark = sum(1 for c in failed_cases 
                                         if not c.get("has_hallmark", True))
            
            total_success = len(success_cases)
            total_failed = len(failed_cases)
            
            hallmark_success_rate = success_with_hallmark / total_success if total_success > 0 else 0.9
            hallmark_failure_rate = failed_without_hallmark / total_failed if total_failed > 0 else 0.3
            
            # Hallmark缺失的失败率差异
            hallmark_impact = hallmark_failure_rate - (1 - hallmark_success_rate)
            self.hallmark_penalty = max(0.05, min(0.25, hallmark_impact))
        else:
            self.hallmark_penalty = 0.15  # 默认值
    
    def _use_default_weights(self):
        """使用默认权重（当没有校准数据时）"""
        self.structural_risk_weight = 0.20
        self.hallmark_penalty = 0.15
    
    def get_calibrated_weights(self) -> Dict[str, float]:
        """
        返回校准后的权重
        
        Returns:
            包含校准权重的字典
        """
        return {
            "structural_risk_weight": self.structural_risk_weight,
            "hallmark_penalty": self.hallmark_penalty,
            "success_risk_median": self.success_risk_median,
            "failed_risk_median": self.failed_risk_median,
            "calibration_source": "VHH_historical_database" if self.db else "default"
        }
```

### 步骤 1.3：验证导入

在终端运行：

```powershell
python -c "from core.vhh_qa_data_calibration import VHHDataCalibration; print('✅ 导入成功')"
```

---

## 指令 2：新建分层结构风险模块 `core/vhh_qa_structural_risk_layered.py`

### 步骤 2.1：创建文件

在 `core/` 目录下新建文件：`core/vhh_qa_structural_risk_layered.py`

### 步骤 2.2：写入完整代码

```python
"""
VHH分层结构风险计算模块

将结构风险分为三个维度：
1. FR2 hydrophilic patch完整性
2. Grafting在interface上的能量变化
3. CDR3 anchor residues匹配度
"""

from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

# IMGT区域边界（从v3.3导入）
IMGT_REGIONS = {
    "FR1": {"start": 1, "end": 26},
    "CDR1": {"start": 27, "end": 38},
    "FR2": {"start": 39, "end": 55},
    "CDR2": {"start": 56, "end": 65},
    "FR3": {"start": 66, "end": 104},
    "CDR3": {"start": 105, "end": 117},
    "FR4": {"start": 118, "end": 128},
}

# VHH hallmark位置（IMGT编号）
VHH_HALLMARK_POSITIONS = [37, 44, 45, 47]

# CDR3 anchor位置（IMGT编号）
CDR3_ANCHOR_POSITIONS = [95, 96, 101, 102]


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
    orig_fr2 = orig_regions.get("FR2", "")
    hum_fr2 = hum_regions.get("FR2", "")
    
    if not orig_fr2 or not hum_fr2:
        return 1.0  # 缺失FR2，风险最高
    
    # FR2从IMGT 39开始
    fr2_start = IMGT_REGIONS["FR2"]["start"]  # 39
    
    # 检查每个hallmark位置的保留情况
    preserved_count = 0
    for pos in VHH_HALLMARK_POSITIONS:
        # 转换为FR2内的索引（0-based）
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
    try:
        from core.vhh_qa_grafting import qa_grafting_impact
        
        _, _, impact_details = qa_grafting_impact(orig_regions, hum_regions)
        impact_normalized = impact_details.get("impact_score_normalized", 0)
        
        # 归一化到0~1风险分数
        # impact_normalized通常在0~1之间，但可能超过1
        risk = min(1.0, impact_normalized / 0.4)  # 0.4是error阈值
        return risk
    except ImportError:
        # 如果qa_grafting_impact不存在，返回默认值
        return 0.5


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
    orig_fr3 = orig_regions.get("FR3", "")
    hum_fr3 = hum_regions.get("FR3", "")
    
    if not orig_fr3 or not hum_fr3:
        return 1.0  # 缺失FR3，风险最高
    
    # FR3从IMGT 66开始
    fr3_start = IMGT_REGIONS["FR3"]["start"]  # 66
    
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
        if not template_fr3 and isinstance(template_info, dict):
            # 尝试从template的其他字段获取FR3
            template_regions = template_info.get("regions", {})
            template_fr3 = template_regions.get("FR3", "")
        
        if template_fr3:
            # 检查101/102位置
            for pos in [101, 102]:
                local_idx = pos - fr3_start
                if 0 <= local_idx < len(template_fr3) and 0 <= local_idx < len(hum_fr3):
                    template_aa = template_fr3[local_idx]
                    hum_aa = hum_fr3[local_idx]
                    
                    # 如果humanized的anchor与模板不匹配，风险极高
                    if template_aa != hum_aa:
                        risk = max(risk, 0.8)
    
    return max(0.0, min(1.0, risk))


def _is_hydrophilic_improvement(orig_aa: str, hum_aa: str) -> bool:
    """
    判断新残基是否比原残基更亲水（improvement）
    
    简单的亲水性判断：
    - 亲水残基：D, E, K, R, H, N, Q, S, T, Y
    - 疏水残基：A, V, L, I, M, F, W, P
    """
    hydrophilic = set("DEKRHNQSTY")
    hydrophobic = set("AVLIMFWP")
    
    orig_is_hydrophilic = orig_aa in hydrophilic
    hum_is_hydrophilic = hum_aa in hydrophilic
    
    # 如果从疏水变为亲水，或保持亲水，算improvement
    if orig_aa in hydrophobic and hum_aa in hydrophilic:
        return True
    if orig_aa in hydrophilic and hum_aa in hydrophilic:
        return True
    
    return False
```

### 步骤 2.3：验证导入

```powershell
python -c "from core.vhh_qa_structural_risk_layered import compute_layered_structural_risk, StructuralRiskComponents; print('✅ 导入成功')"
```

---

## 指令 3：新建 v3.4 QA 验证入口 `core/vhh_qa_validation_v3_4.py`

### 步骤 3.1：创建文件

在 `core/` 目录下新建文件：`core/vhh_qa_validation_v3_4.py`

### 步骤 3.2：写入完整代码

```python
"""
VHH人源化结果QA验证模块 v3.4

v3.4升级：
- 基于数据分布校准的权重体系
- 分层结构风险（FR2/grafting/CDR3 anchor）
- CDR3 anchor风险作为生死线检查
"""

from typing import Dict, List, Any, Optional
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

# 导入v3.3的基础功能（复用）
from core.vhh_qa_validation_v3_3 import (
    validate_vhh_humanization_result_v3_3,
    _create_warning,
    auto_build_mutations_from_regions
)

# 导入v3.4新模块
from core.vhh_qa_data_calibration import VHHDataCalibration
from core.vhh_qa_structural_risk_layered import (
    compute_layered_structural_risk,
    StructuralRiskComponents
)


def compute_final_score_v3_4(
    candidate: Dict[str, Any],
    calibration: Optional[VHHDataCalibration] = None
) -> float:
    """
    v3.4: 使用校准权重的final_score计算
    
    Args:
        candidate: 候选模板字典
        calibration: 数据校准器（如果提供，使用校准权重；否则使用默认值）
    
    Returns:
        final score
    """
    scores = candidate.get("alignment_scores", {}) or candidate.get("scores", {})
    base = scores.get("combined_score", 0.0) or scores.get("combined", 0.0)
    
    # 获取structural_risk（应该已经在候选中计算并写入）
    structural_risk = scores.get("structural_risk", 0.0)
    
    # 如果还没有structural_risk，尝试从risk_components计算
    if structural_risk == 0.0:
        risk_components = scores.get("structural_risk_components", {})
        if risk_components:
            structural_risk = risk_components.get("total_risk", 0.0)
    
    # 获取校准权重
    if calibration:
        weights = calibration.get_calibrated_weights()
        structural_risk_weight = weights["structural_risk_weight"]
        hallmark_penalty_base = weights["hallmark_penalty"]
    else:
        structural_risk_weight = 0.20
        hallmark_penalty_base = 0.15
    
    # Hallmark penalty
    actual_hallmark_penalty = 0.0
    flags = candidate.get("flags", {}) or {}
    template = candidate.get("template", {})
    if isinstance(template, dict):
        template_flags = template.get("flags", {}) or {}
        flags = {**flags, **template_flags}
    
    if not flags.get("has_vhh_hallmark", True):
        actual_hallmark_penalty = hallmark_penalty_base
    elif flags.get("reduced_hallmark", False):
        actual_hallmark_penalty = hallmark_penalty_base * 0.33
    
    final = base - structural_risk_weight * structural_risk - actual_hallmark_penalty
    
    # 更新candidate的scores
    if "scores" not in candidate:
        candidate["scores"] = {}
    candidate["scores"]["final"] = final
    candidate["scores"]["structural_risk"] = structural_risk
    candidate["scores"]["structural_risk_weight"] = structural_risk_weight
    candidate["scores"]["hallmark_penalty"] = actual_hallmark_penalty
    
    return final


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
    - CDR3 anchor风险作为生死线检查
    
    Args:
        result: 人源化结果字典
        strict: 是否严格模式（默认True，有error即失败）
        calibration: 数据校准器（可选）
    
    Returns:
        qa_v3_4结构（兼容v3.3格式，新增structural_risk_components）
    """
    # 先运行v3.3的基础检查（复用）
    qa_v3_3 = validate_vhh_humanization_result_v3_3(result, strict=False)
    
    errors = qa_v3_3.get("errors", [])
    warnings = qa_v3_3.get("warnings", [])
    
    # 获取序列分析结果
    seq_analysis = result.get("sequence_analysis", {})
    orig_regions = seq_analysis.get("original_regions", {}) or {}
    hum_regions = seq_analysis.get("humanized_regions", {}) or {}
    template_info = result.get("best_match", {}).get("template", {})
    
    # === v3.4: 计算分层结构风险（顶层） ===
    risk_components = compute_layered_structural_risk(
        orig_regions, hum_regions, template_info
    )
    
    # 将risk_components写入result
    if "qa" not in result:
        result["qa"] = {}
    result["qa"]["structural_risk_components"] = risk_components.to_dict()
    
    # === v3.4: CDR3 anchor生死线检查 ===
    if risk_components.cdr3_anchor_risk >= 0.7:
        errors.append(
            f"CDR3 anchor residues风险过高 ({risk_components.cdr3_anchor_risk:.2f})，"
            "这是VHH折叠的生死线。模板101/102位置与humanized不匹配，"
            "可能导致结构不稳定或无法折叠。"
        )
    
    # === v3.4: 更新所有候选模板的structural_risk + final_score ===
    candidates = result.get("candidates", [])
    for cand in candidates:
        # 获取候选模板的区域信息（如果可用）
        # 注意：这里假设candidates中可能包含orig_regions和hum_regions
        # 如果没有，使用全局的orig_regions和hum_regions
        cand_orig_regions = cand.get("orig_regions", orig_regions)
        cand_hum_regions = cand.get("hum_regions", hum_regions)
        
        # 如果candidates中没有单独的区域信息，使用全局的
        if not cand_orig_regions or not cand_hum_regions:
            cand_orig_regions = orig_regions
            cand_hum_regions = hum_regions
        
        # 计算候选模板的分层结构风险
        cand_risk_components = compute_layered_structural_risk(
            cand_orig_regions, cand_hum_regions, cand.get("template", {})
        )
        
        # 更新candidate的scores
        if "scores" not in cand:
            cand["scores"] = {}
        cand["scores"]["structural_risk_components"] = cand_risk_components.to_dict()
        cand["scores"]["structural_risk"] = cand_risk_components.total_risk
        
        # 使用校准权重计算final_score
        compute_final_score_v3_4(cand, calibration)
    
    # === 构建qa_v3_4结果（兼容v3.3格式） ===
    qa_v3_4 = {
        "ok": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "checks": qa_v3_3.get("checks", {}),
        "summary_score": qa_v3_3.get("summary_score", {}),
        "structural_risk_components": risk_components.to_dict(),  # v3.4新增
        "meta": {
            "version": "3.4.0",
            "ruleset": "VHH_QA_V3.4_CALIBRATED",
            "calibration_used": calibration is not None
        }
    }
    
    # 如果v3.3有其他字段，也保留
    for key in ["mutation_map", "conformation_risk_summary", "experimental_recommendations"]:
        if key in qa_v3_3:
            qa_v3_4[key] = qa_v3_3[key]
    
    return qa_v3_4
```

### 步骤 3.3：验证导入

```powershell
python -c "from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4, compute_final_score_v3_4; print('✅ 导入成功')"
```

---

## 指令 4：在现有VHH pipeline中挂上v3.4

### 步骤 4.1：找到主入口文件

检查 `core/vhh_humanization_with_qa.py`，找到QA验证的调用位置。

### 步骤 4.2：更新 `core/vhh_humanization_with_qa.py`

在文件顶部添加导入：

```python
from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4
from core.vhh_qa_data_calibration import VHHDataCalibration
```

找到 `humanize_vhh_with_qa` 函数中调用QA验证的位置（大约在第74-75行），修改为：

```python
# QA验证 - 使用v3.4（最新版本）
qa_v3_4_result = validate_vhh_humanization_result_v3_4(json_data, strict=strict_qa)

# 同时运行v3.3以保持兼容性
from core.vhh_qa_validation_v3_3 import validate_vhh_humanization_result_v3_3
qa_v3_3_result = validate_vhh_humanization_result_v3_3(json_data, strict=strict_qa)

# 同时运行v3.2以保持兼容性
from core.vhh_qa_validation import validate_vhh_humanization_result_v3
qa_v3_result = validate_vhh_humanization_result_v3(json_data, strict=strict_qa)

# 统一接口结构：result["qa"]["v3_4"] = qa_v3_4（最新）
# 同时保持v2/v3兼容性
qa_v2_result = validate_vhh_humanization_result(json_data, strict=False)

result["qa"] = {
    "v2": qa_v2_result,  # v2.0结果
    "v3": qa_v3_result,  # v3.2结果（兼容）
    "v3_3": qa_v3_3_result,  # v3.3结果（兼容）
    "v3_4": qa_v3_4_result  # v3.4结果（最新）
}

# 向后兼容：直接访问result["qa"]时返回v3.4结果（最新版本）
result["qa"]["ok"] = qa_v3_4_result.get("ok", False)
result["qa"]["errors"] = qa_v3_4_result.get("errors", [])
# v3.4的warnings转换为字符串列表以保持兼容
warnings_list = []
for w in qa_v3_4_result.get("warnings", []):
    if isinstance(w, dict):
        warnings_list.append(w.get("message", str(w)))
    else:
        warnings_list.append(str(w))
result["qa"]["warnings"] = warnings_list
```

更新QA通过判断：

```python
# QA通过（使用v3.4结果）
if qa_v3_4_result["ok"]:
    result["status"] = "OK"
    v3_4_warnings = qa_v3_4_result.get("warnings", [])
    if v3_4_warnings:
        major_warnings = [w for w in v3_4_warnings if isinstance(w, dict) and w.get("level") == "major"]
        if major_warnings:
            logger.warning(f"QA主要警告: {[w.get('message') for w in major_warnings]}")
    return result

# QA不通过
logger.warning(f"标准模式QA验证失败: {qa_v3_4_result['errors']}")
```

更新status：

```python
# 所有模式都失败
result["status"] = "FAILED_QA_V3_4"
```

---

## 指令 5：快速本地验证（不依赖真实DB先跑通）

### 步骤 5.1：创建测试脚本

新建文件：`tests/manual_test_vhh_qa_v3_4.py`

```python
"""
手动测试VHH QA v3.4（不依赖真实数据库）
"""

from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4
from core.vhh_qa_data_calibration import VHHDataCalibration


def make_minimal_result_skeleton():
    """构造最小化测试数据"""
    return {
        "sequence_analysis": {
            "original_regions": {
                "FR1": "EVQLVESGGGLVQPGGSLRLSCAAS",
                "CDR1": "GFNIKDTY",
                "FR2": "MHWVRQRPGKGLEWVSA",
                "CDR2": "YISYSGST",
                "FR3": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC",
                "CDR3": "AAGGVGWPYFDY",
                "FR4": "WGQGTQVTVSS"
            },
            "humanized_regions": {
                "FR1": "EVQLVESGGGLVQPGGSLRLSCAAS",
                "CDR1": "GFNIKDTY",
                "FR2": "MHWVRQRPGKGLEWVSA",
                "CDR2": "YISYSGST",
                "FR3": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC",
                "CDR3": "AAGGVGWPYFDY",
                "FR4": "WGQGTQVTVSS"
            }
        },
        "best_match": {
            "humanized_sequence": "EVQLVESGGGLVQPGGSLRLSCAASGFNIKDTYMHWVRQRPGKGLEWVSAYISYSGSTYYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYCAAGGVGWPYFDYWGQGTQVTVSS",
            "template": {
                "id": "TEMPLATE_001",
                "flags": {"has_vhh_hallmark": True},
                "fr3_sequence": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC"
            },
            "developability": {"score": 0.65, "score_type": "aggregate"},
            "immunogenicity": {"fr_immuno_risk": "low"}
        },
        "original_developability": {"score": 0.60},
        "original_immunogenicity": {"fr_immuno_risk": "low"},
        "candidates": [
            {
                "template_id": "HUMAN_VH3_SCF_24",
                "scores": {
                    "fr_identity": 0.82,
                    "combined": 0.70
                },
                "flags": {"has_vhh_hallmark": True},
                "template": {
                    "id": "HUMAN_VH3_SCF_24",
                    "flags": {"has_vhh_hallmark": True},
                    "fr3_sequence": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC"
                }
            }
        ],
        "mutations": {"list": []}
    }


def main():
    print("=" * 80)
    print("VHH QA v3.4 手动测试")
    print("=" * 80)
    
    # 构造测试数据
    dummy_result = make_minimal_result_skeleton()
    
    # 测试1：不使用校准（默认权重）
    print("\n测试1: 不使用校准（默认权重）")
    out1 = validate_vhh_humanization_result_v3_4(dummy_result, strict=True, calibration=None)
    print(f"✅ OK: {out1['ok']}")
    print(f"📊 Structural Risk Components: {out1.get('structural_risk_components', {})}")
    print(f"❌ Errors: {len(out1.get('errors', []))}")
    print(f"⚠️  Warnings: {len(out1.get('warnings', []))}")
    
    # 测试2：使用默认校准器（无数据库）
    print("\n测试2: 使用默认校准器（无数据库）")
    calibration = VHHDataCalibration(calibration_db_path=None)
    out2 = validate_vhh_humanization_result_v3_4(dummy_result, strict=True, calibration=calibration)
    print(f"✅ OK: {out2['ok']}")
    print(f"📊 Calibrated Weights: {calibration.get_calibrated_weights()}")
    
    # 测试3：CDR3 anchor高风险场景
    print("\n测试3: CDR3 anchor高风险场景")
    high_risk_result = make_minimal_result_skeleton()
    # 修改FR3的101/102位置，使其不匹配
    fr3_list = list(high_risk_result["sequence_analysis"]["humanized_regions"]["FR3"])
    # FR3从IMGT 66开始，101-66=35, 102-66=36
    if len(fr3_list) > 36:
        fr3_list[35] = "X"  # 101位置
        fr3_list[36] = "Y"  # 102位置
    high_risk_result["sequence_analysis"]["humanized_regions"]["FR3"] = "".join(fr3_list)
    out3 = validate_vhh_humanization_result_v3_4(high_risk_result, strict=True, calibration=None)
    print(f"✅ OK: {out3['ok']}")
    print(f"📊 CDR3 Anchor Risk: {out3.get('structural_risk_components', {}).get('cdr3_anchor_risk', 0):.2f}")
    print(f"❌ Errors: {out3.get('errors', [])}")
    
    print("\n" + "=" * 80)
    print("测试完成")
    print("=" * 80)


if __name__ == "__main__":
    main()
```

### 步骤 5.2：运行测试

```powershell
python -m tests.manual_test_vhh_qa_v3_4
```

**预期输出**:
- 没有异常报错
- 输出中包含 `structural_risk_components` 字典
- errors/warnings 结构正常
- 测试3应该检测到CDR3 anchor高风险并产生error

---

## 指令 6：整理单元测试 + 提交代码

### 步骤 6.1：创建单元测试文件

新建文件：`tests/test_vhh_qa_v3_4.py`

```python
"""
VHH QA v3.4 单元测试
"""

import pytest
from core.vhh_qa_validation_v3_4 import (
    validate_vhh_humanization_result_v3_4,
    compute_final_score_v3_4
)
from core.vhh_qa_data_calibration import VHHDataCalibration
from core.vhh_qa_structural_risk_layered import (
    compute_layered_structural_risk,
    StructuralRiskComponents
)


def make_minimal_result_skeleton():
    """构造最小化测试数据骨架"""
    return {
        "sequence_analysis": {
            "original_regions": {
                "FR1": "EVQLVESGGGLVQPGGSLRLSCAAS",
                "CDR1": "GFNIKDTY",
                "FR2": "MHWVRQRPGKGLEWVSA",
                "CDR2": "YISYSGST",
                "FR3": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC",
                "CDR3": "AAGGVGWPYFDY",
                "FR4": "WGQGTQVTVSS"
            },
            "humanized_regions": {
                "FR1": "EVQLVESGGGLVQPGGSLRLSCAAS",
                "CDR1": "GFNIKDTY",
                "FR2": "MHWVRQRPGKGLEWVSA",
                "CDR2": "YISYSGST",
                "FR3": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC",
                "CDR3": "AAGGVGWPYFDY",
                "FR4": "WGQGTQVTVSS"
            }
        },
        "best_match": {
            "humanized_sequence": "EVQLVESGGGLVQPGGSLRLSCAASGFNIKDTYMHWVRQRPGKGLEWVSAYISYSGSTYYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYCAAGGVGWPYFDYWGQGTQVTVSS",
            "template": {
                "id": "TEMPLATE_001",
                "flags": {"has_vhh_hallmark": True},
                "fr3_sequence": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC"
            },
            "developability": {"score": 0.65, "score_type": "aggregate"},
            "immunogenicity": {"fr_immuno_risk": "low"}
        },
        "original_developability": {"score": 0.60},
        "original_immunogenicity": {"fr_immuno_risk": "low"},
        "candidates": [],
        "mutations": {"list": []}
    }


def test_cdr3_anchor_risk_high_should_fail():
    """测试：CDR3 anchor风险 >= 0.7 时应该fail"""
    result = make_minimal_result_skeleton()
    
    # 修改FR3的101/102位置，使其不匹配（高风险）
    fr3_list = list(result["sequence_analysis"]["humanized_regions"]["FR3"])
    # FR3从IMGT 66开始，101-66=35, 102-66=36
    if len(fr3_list) > 36:
        fr3_list[35] = "X"  # 101位置
        fr3_list[36] = "Y"  # 102位置
    result["sequence_analysis"]["humanized_regions"]["FR3"] = "".join(fr3_list)
    
    qa_v3_4 = validate_vhh_humanization_result_v3_4(result, strict=True)
    
    assert qa_v3_4["ok"] is False, "CDR3 anchor风险>=0.7应该fail"
    assert len(qa_v3_4["errors"]) > 0, "应该有error"
    assert any("CDR3 anchor" in e for e in qa_v3_4["errors"]), "应该有CDR3 anchor相关的error"


def test_hallmark_penalty_applied():
    """测试：hallmark缺失时hallmark_penalty正常生效"""
    candidate = {
        "scores": {
            "combined": 0.70,
            "structural_risk": 0.3
        },
        "flags": {"has_vhh_hallmark": False},
        "template": {"flags": {}}
    }
    
    final_score = compute_final_score_v3_4(candidate, calibration=None)
    
    # 应该应用hallmark_penalty (0.15)
    expected_final = 0.70 - 0.20 * 0.3 - 0.15
    assert abs(final_score - expected_final) < 0.01, f"Final score应该考虑hallmark penalty: {final_score} vs {expected_final}"


def test_calibration_weights_applied():
    """测试：提供calibration时，structural_risk_weight应该变化"""
    candidate = {
        "scores": {
            "combined": 0.70,
            "structural_risk": 0.3
        },
        "flags": {"has_vhh_hallmark": True},
        "template": {"flags": {}}
    }
    
    # 不使用校准
    final_score_default = compute_final_score_v3_4(candidate, calibration=None)
    
    # 使用校准（默认校准器，无数据库，应该使用默认权重）
    calibration = VHHDataCalibration(calibration_db_path=None)
    final_score_calibrated = compute_final_score_v3_4(candidate, calibration=calibration)
    
    # 默认校准器应该使用默认权重，所以结果应该相同
    assert abs(final_score_default - final_score_calibrated) < 0.01, "默认校准应该使用默认权重"


def test_layered_structural_risk_components():
    """测试：分层结构风险组件计算"""
    orig_regions = {
        "FR2": "MHWVRQRPGKGLEWVSA",
        "FR3": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC"
    }
    hum_regions = {
        "FR2": "MHWVRQRPGKGLEWVSA",
        "FR3": "YYADSVKGRFTISRDNSKNTLYLQMGSLRAEDMAVYYC"
    }
    
    risk_components = compute_layered_structural_risk(orig_regions, hum_regions)
    
    assert isinstance(risk_components, StructuralRiskComponents)
    assert 0 <= risk_components.fr2_hydrophilic_patch_risk <= 1
    assert 0 <= risk_components.grafting_interface_risk <= 1
    assert 0 <= risk_components.cdr3_anchor_risk <= 1
    assert 0 <= risk_components.total_risk <= 1
    assert "total_risk" in risk_components.to_dict()


def test_structural_risk_components_in_result():
    """测试：结果中应该包含structural_risk_components"""
    result = make_minimal_result_skeleton()
    
    qa_v3_4 = validate_vhh_humanization_result_v3_4(result, strict=True)
    
    assert "structural_risk_components" in qa_v3_4, "应该包含structural_risk_components"
    components = qa_v3_4["structural_risk_components"]
    assert "fr2_hydrophilic_patch_risk" in components
    assert "grafting_interface_risk" in components
    assert "cdr3_anchor_risk" in components
    assert "total_risk" in components
```

### 步骤 6.2：运行测试

```powershell
python -m pytest tests/test_vhh_qa_v3_4.py -v
```

### 步骤 6.3：提交代码

```powershell
git status
git add core/vhh_qa_data_calibration.py
git add core/vhh_qa_structural_risk_layered.py
git add core/vhh_qa_validation_v3_4.py
git add tests/manual_test_vhh_qa_v3_4.py
git add tests/test_vhh_qa_v3_4.py
git add core/vhh_humanization_with_qa.py
git commit -m "Add VHH QA v3.4 with layered structural risk and calibrated scoring"
```

---

## 指令 7：预留 v3.5 的扩展位

### 步骤 7.1：在 `core/vhh_qa_validation_v3_4.py` 底部添加TODO

```python
# TODO(v3.5):
# - 引入 ranking stability 模块 (analyze_ranking_stability, calibrate_score_consistency)
# - 在 validate_vhh_humanization_result_v3_4 中追加 ranking sanity 部分
# - 使用相对排序稳定性模型替代heuristic阈值
# - 实现pairwise consistency检查
# - 集成isotonic regression校准
```

---

## 验证清单

完成所有步骤后，运行以下验证：

```powershell
# 1. 检查所有新文件是否存在
ls core/vhh_qa_data_calibration.py
ls core/vhh_qa_structural_risk_layered.py
ls core/vhh_qa_validation_v3_4.py
ls tests/test_vhh_qa_v3_4.py

# 2. 运行单元测试
python -m pytest tests/test_vhh_qa_v3_4.py -v

# 3. 运行手动测试
python -m tests.manual_test_vhh_qa_v3_4

# 4. 检查导入
python -c "from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4; print('✅ v3.4导入成功')"
```

---

## 文件结构总结

```
core/
├── vhh_qa_data_calibration.py          # 新增：数据校准模块
├── vhh_qa_structural_risk_layered.py   # 新增：分层结构风险
├── vhh_qa_validation_v3_4.py          # 新增：v3.4 QA验证入口
└── vhh_humanization_with_qa.py         # 修改：集成v3.4

tests/
├── manual_test_vhh_qa_v3_4.py          # 新增：手动测试脚本
└── test_vhh_qa_v3_4.py                 # 新增：单元测试
```

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















