# VHH QA v3.4/v3.5 

****: 20251210  
****: v3.3.0  
****: v3.4.0, v3.5.0

---

## 、

### ❌ 1: final_score

****:
```python
final_score = combined - 0.20 * structural_risk - hallmark_penalty
```

****:
1. `structural_risk`（score 0~1）
2. `0.20`
3. `hallmark_penalty = 0.15`

****: 
- 
- 
- 

---

### ❌ 2: ranking sanity，

****:
```python
if fr_gap >= 0.10 and comb_gap <= 0.03:
    errors.append("Ranking sanity violated...")
```

****:
1. heuristic
2. pairwise consistency
3. isotonic regression

****:
- 
- 
- 

---

### ❌ 3: 

****:
- `structural_risk`（0~1）
- grafting impact

****:
1. **FR2 hydrophilic patch**（37/44/45/47）
2. **Graftinginterface**（ΔΔG proxy）
3. **CDR3 anchor residues**（95/96/101/102）

****:
- VHH，CDR3 anchor
- 
- 

---

## 、v3.4

### 🎯 ： + 

---

### 1: （Distribution Calibration）

#### 1.1 

****: `core/vhh_qa_data_calibration.py`

****:
```python
class VHHDataCalibration:
    """
    VHH，QA
    """
    
    def __init__(self, calibration_db_path: str):
        """
        
        
        ：
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
        self._compute_distributions
    
    def _compute_distributions(self):
        """/"""
        # structural_risk
        success_risks = [c["structural_risk"] for c in self.db["successful_cases"]]
        self.success_risk_median = np.median(success_risks)
        self.success_risk_p75 = np.percentile(success_risks, 75)
        
        # structural_risk
        failed_risks = [c["structural_risk"] for c in self.db["failed_cases"]]
        self.failed_risk_median = np.median(failed_risks)
        self.failed_risk_p25 = np.percentile(failed_risks, 25)
        
        # 
        self._calibrate_weights
    
    def _calibrate_weights(self):
        """
        
        
        ：
        - median risk = 0.2，median risk = 0.6
        - risk = 0.4，""
        - final_score
        """
        risk_diff = self.failed_risk_median - self.success_risk_median
        
        # ：risk0.1final_score
        # ：weight * risk_diff >= 0.1
        self.structural_risk_weight = max(0.1, 0.1 / risk_diff) if risk_diff > 0 else 0.2
        
        # Hallmark penalty
        success_with_hallmark = sum(1 for c in self.db["successful_cases"] 
                                   if c.get("has_hallmark", True))
        failed_without_hallmark = sum(1 for c in self.db["failed_cases"] 
                                     if not c.get("has_hallmark", True))
        
        total_success = len(self.db["successful_cases"])
        total_failed = len(self.db["failed_cases"])
        
        if total_success > 0 and total_failed > 0:
            hallmark_success_rate = success_with_hallmark / total_success
            hallmark_failure_rate = failed_without_hallmark / total_failed
            
            # Hallmark
            hallmark_impact = hallmark_failure_rate - (1 - hallmark_success_rate)
            self.hallmark_penalty = max(0.05, min(0.25, hallmark_impact))
        else:
            self.hallmark_penalty = 0.15  # 
    
    def get_calibrated_weights(self) -> Dict[str, float]:
        """"""
        return {
            "structural_risk_weight": self.structural_risk_weight,
            "hallmark_penalty": self.hallmark_penalty,
            "success_risk_median": self.success_risk_median,
            "failed_risk_median": self.failed_risk_median,
            "calibration_source": "VHH_historical_database"
        }
```

#### 1.2 final_score

****: `core/vhh_qa_validation_v3_4.py`

```python
def compute_final_score_v3_4(
    candidate: Dict[str, Any],
    calibration: Optional[VHHDataCalibration] = None
) -> float:
    """
    v3.4: final_score
    
    Args:
        candidate: 
        calibration: （，；）
    """
    scores = candidate.get("alignment_scores", {}) or candidate.get("scores", {})
    base = scores.get("combined_score", 0) or scores.get("combined", 0)
    
    # structural_risk
    structural_risk = _compute_layered_structural_risk(candidate)
    
    # 
    if calibration:
        weights = calibration.get_calibrated_weights
        structural_risk_weight = weights["structural_risk_weight"]
        hallmark_penalty = weights["hallmark_penalty"]
    else:
        # 
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
        actual_hallmark_penalty = hallmark_penalty * 0.33  # penalty
    
    final = base - structural_risk_weight * structural_risk - actual_hallmark_penalty
    
    # candidatescores
    if "scores" not in candidate:
        candidate["scores"] = {}
    candidate["scores"]["final"] = final
    candidate["scores"]["structural_risk"] = structural_risk
    candidate["scores"]["structural_risk_weight"] = structural_risk_weight
    candidate["scores"]["hallmark_penalty"] = actual_hallmark_penalty
    
    return final
```

---

### 2: （Layered Structural Risk）

#### 2.1 

****: `core/vhh_qa_structural_risk_layered.py`

```python
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class StructuralRiskComponents:
    """"""
    fr2_hydrophilic_patch_risk: float  # 0~1, FR2 hydrophilic patch
    grafting_interface_risk: float      # 0~1, Graftinginterface
    cdr3_anchor_risk: float            # 0~1, CDR3 anchor residues
    
    @property
    def total_risk(self) -> float:
        """
        
        
        ：
        - FR2 risk: 0.3
        - Grafting risk: 0.3
        - CDR3 anchor risk: 0.4（，）
        """
        return (
            0.3 * self.fr2_hydrophilic_patch_risk +
            0.3 * self.grafting_interface_risk +
            0.4 * self.cdr3_anchor_risk
        )
    
    def to_dict(self) -> Dict[str, float]:
        """"""
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
    
    
    Args:
        orig_regions: 
        hum_regions: 
        template_info: （anchor）
    
    Returns:
        StructuralRiskComponents
    """
    # 1. FR2 hydrophilic patch
    fr2_risk = _compute_fr2_hydrophilic_patch_risk(orig_regions, hum_regions)
    
    # 2. Grafting interface
    grafting_risk = _compute_grafting_interface_risk(orig_regions, hum_regions)
    
    # 3. CDR3 anchor
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
    FR2 hydrophilic patch
    
    VHH hallmark：37, 44, 45, 47
    hydrophilic patch，
    """
    VHH_HALLMARK_POSITIONS = [37, 44, 45, 47]
    
    orig_fr2 = orig_regions.get("FR2", "")
    hum_fr2 = hum_regions.get("FR2", "")
    
    if not orig_fr2 or not hum_fr2:
        return 1.0  # FR2，
    
    # hallmark
    preserved_count = 0
    for pos in VHH_HALLMARK_POSITIONS:
        # FR2（FR2IMGT 39）
        fr2_start = 39
        local_idx = pos - fr2_start
        
        if 0 <= local_idx < len(orig_fr2) and 0 <= local_idx < len(hum_fr2):
            orig_aa = orig_fr2[local_idx]
            hum_aa = hum_fr2[local_idx]
            
            # hydrophilic，
            if orig_aa == hum_aa:
                preserved_count += 1
            elif _is_hydrophilic_improvement(orig_aa, hum_aa):
                preserved_count += 1
    
    #  = 1 - 
    risk = 1.0 - (preserved_count / len(VHH_HALLMARK_POSITIONS))
    return max(0.0, min(1.0, risk))


def _compute_grafting_interface_risk(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str]
) -> float:
    """
    graftinginterface（ΔΔG proxy）
    
    qa_grafting_impact，0~1
    """
    from core.vhh_qa_grafting import qa_grafting_impact
    
    _, _, impact_details = qa_grafting_impact(orig_regions, hum_regions)
    impact_normalized = impact_details.get("impact_score_normalized", 0)
    
    # 0~1
    # impact_normalized0~1，1
    risk = min(1.0, impact_normalized / 0.4)  # 0.4error
    return risk


def _compute_cdr3_anchor_risk(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str],
    template_info: Optional[Dict[str, Any]] = None
) -> float:
    """
    CDR3 anchor residues
    
    CDR3 anchor：IMGT 95, 96, 101, 102
    FR3，CDR3
    
    101/102，humanized
    structural_risk ≥ 0.7 → fail
    """
    CDR3_ANCHOR_POSITIONS = [95, 96, 101, 102]  # IMGT
    
    orig_fr3 = orig_regions.get("FR3", "")
    hum_fr3 = hum_regions.get("FR3", "")
    
    if not orig_fr3 or not hum_fr3:
        return 1.0  # FR3，
    
    # FR3IMGT 66
    fr3_start = 66
    
    # anchor
    mismatches = 0
    critical_mismatches = 0  # 101/102
    
    for pos in CDR3_ANCHOR_POSITIONS:
        local_idx = pos - fr3_start
        
        if 0 <= local_idx < len(orig_fr3) and 0 <= local_idx < len(hum_fr3):
            orig_aa = orig_fr3[local_idx]
            hum_aa = hum_fr3[local_idx]
            
            if orig_aa != hum_aa:
                mismatches += 1
                # 101/102
                if pos in [101, 102]:
                    critical_mismatches += 1
    
    # 
    if critical_mismatches > 0:
        # ，
        risk = 0.7 + (critical_mismatches * 0.15)  # 0.7，mismatch +0.15
    else:
        # ，
        risk = mismatches * 0.2  # mismatch +0.2
    
    # ，anchor
    if template_info:
        template_fr3 = template_info.get("fr3_sequence", "")
        if template_fr3:
            template_anchor_101 = template_fr3[101 - fr3_start] if 101 - fr3_start < len(template_fr3) else None
            template_anchor_102 = template_fr3[102 - fr3_start] if 102 - fr3_start < len(template_fr3) else None
            
            hum_anchor_101 = hum_fr3[101 - fr3_start] if 101 - fr3_start < len(hum_fr3) else None
            hum_anchor_102 = hum_fr3[102 - fr3_start] if 102 - fr3_start < len(hum_fr3) else None
            
            # humanizedanchor，
            if template_anchor_101 and hum_anchor_101 and template_anchor_101 != hum_anchor_101:
                risk = max(risk, 0.8)
            if template_anchor_102 and hum_anchor_102 and template_anchor_102 != hum_anchor_102:
                risk = max(risk, 0.8)
    
    return max(0.0, min(1.0, risk))
```

#### 2.2 QA

****: `core/vhh_qa_validation_v3_4.py`

```python
def validate_vhh_humanization_result_v3_4(
    result: Dict[str, Any],
    strict: bool = True,
    calibration: Optional[VHHDataCalibration] = None
) -> Dict[str, Any]:
    """
    VHHQA v3.4
    
    v3.4：
    - 
    - （FR2/grafting/CDR3 anchor）
    """
    # ... (v3.3)
    
    # === v3.4:  ===
    orig_regions = seq_analysis.get("original_regions", {}) or {}
    hum_regions = seq_analysis.get("humanized_regions", {}) or {}
    template_info = result.get("best_match", {}).get("template", {})
    
    structural_risk_components = compute_layered_structural_risk(
        orig_regions, hum_regions, template_info
    )
    
    # CDR3 anchor
    if structural_risk_components.cdr3_anchor_risk >= 0.7:
        errors.append(
            f"CDR3 anchor residues ({structural_risk_components.cdr3_anchor_risk:.2f})，"
            "VHH。101/102humanized，"
            "。"
        )
    
    # === v3.4: final_score ===
    candidates = result.get("candidates", [])
    if candidates:
        for cand in candidates:
            # 
            cand_orig_regions = ...  # candidate
            cand_hum_regions = ...   # candidate
            cand_risk_components = compute_layered_structural_risk(
                cand_orig_regions, cand_hum_regions, cand.get("template", {})
            )
            
            # candidatestructural_risk
            if "scores" not in cand:
                cand["scores"] = {}
            cand["scores"]["structural_risk"] = cand_risk_components.total_risk
            cand["scores"]["structural_risk_components"] = cand_risk_components.to_dict
            
            # final_score
            compute_final_score_v3_4(cand, calibration)
    
    # ... 
```

---

## 、v3.5

### 🎯 ：（Ranking Stability Model）

---

### 3: 

#### 3.1 

****: `core/vhh_qa_ranking_stability.py`

```python
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import numpy as np
from sklearn.isotonic import IsotonicRegression

@dataclass
class RankingStabilityResult:
    """"""
    is_stable: bool
    stability_score: float  # 0~1, 
    swap_risk: float        # 0~1, bestsecond
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
    
    
    ：
    1. bestsecond
    2.  <  → ranking unstable
    3. pairwise consistency
    4. ：isotonic regressionscore consistency
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
    
    # 1. 
    swap_risk = _compute_swap_risk(best, second, calibration)
    
    # 2. Pairwise consistency
    consistency_issues = _check_pairwise_consistency(candidates)
    
    # 3. 
    stability_score = 1.0 - swap_risk
    if consistency_issues:
        stability_score -= len(consistency_issues) * 0.1
    
    stability_score = max(0.0, min(1.0, stability_score))
    
    # 4. 
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
    bestsecond
    
    ，
    ，
    """
    # final_score
    best_final = best.get("scores", {}).get("final", 0)
    second_final = second.get("scores", {}).get("final", 0)
    
    current_gap = best_final - second_final
    
    # ：secondbest
    # structural_risk
    best_risk = best.get("scores", {}).get("structural_risk", 0)
    second_risk = second.get("scores", {}).get("structural_risk", 0)
    
    # secondriskbest，
    risk_diff = second_risk - best_risk
    
    # riskfinal_score，
    if abs(risk_diff) < 0.1 and abs(current_gap) < 0.05:
        swap_risk = 0.5  # 
    elif risk_diff > 0.2:
        swap_risk = 0.1  # 
    elif risk_diff < -0.1:
        swap_risk = 0.8  # （second？）
    else:
        swap_risk = 0.3  # 
    
    return swap_risk


def _check_pairwise_consistency(
    candidates: List[Dict[str, Any]]
) -> List[str]:
    """
    pairwise consistency
    
    ，：
    - AFR identity > B，Afinal_score < B，
    - Astructural_risk < B，Afinal_score < B，
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
            
            # 
            if a_fr > b_fr + 0.05 and a_final < b_final - 0.02:
                issues.append(
                    f" {a.get('template_id', f'#{i+1}')} FR identity ({a_fr:.2f}) "
                    f" {b.get('template_id', f'#{j+1}')} ({b_fr:.2f})，"
                    f"final_score ({a_final:.3f} vs {b_final:.3f})，。"
                )
    
    return issues


def calibrate_score_consistency(
    candidates: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    isotonic regressionscore consistency
    
    combined_scorefinal_score
    """
    # combined_scorefinal_score
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
    
    # isotonic regression
    try:
        ir = IsotonicRegression(out_of_bounds='clip')
        calibrated_final = ir.fit_transform(combined_scores, final_scores)
        
        # 
        is_monotonic = all(calibrated_final[i] >= calibrated_final[i+1] 
                          for i in range(len(calibrated_final)-1))
        
        return {
            "calibrated": True,
            "is_monotonic": is_monotonic,
            "calibration_model": ir,
            "calibrated_scores": calibrated_final.tolist
        }
    except Exception as e:
        return {"calibrated": False, "reason": str(e)}
```

#### 3.2 ranking sanity

****: `core/vhh_qa_validation_v3_5.py`

```python
def _qa_ranking_sanity_v3_5(
    candidates: List[Dict[str, Any]],
    errors: List[str],
    warnings: List[Dict[str, str]],
    calibration: Optional[VHHDataCalibration] = None
) -> Dict[str, Any]:
    """
    v3.5：ranking sanity
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
    
    # 1. 
    stability_result = analyze_ranking_stability(candidates, calibration)
    sanity_details["stability_analysis"] = stability_result.to_dict
    
    # 2. Score consistency
    consistency_result = calibrate_score_consistency(candidates)
    sanity_details["score_consistency"] = consistency_result
    
    # 3. errors/warnings
    if not stability_result.is_stable:
        if stability_result.swap_risk >= 0.7:
            errors.append(
                f"： "
                f"(swap_risk={stability_result.swap_risk:.2f})，"
                "。。"
            )
        else:
            warnings.append(_create_warning(
                "major",
                "ranking",
                f" (stability_score={stability_result.stability_score:.2f})，"
                f"。"
            ))
    
    # 4. Pairwise consistency
    if stability_result.consistency_issues:
        for issue in stability_result.consistency_issues:
            warnings.append(_create_warning(
                "major",
                "ranking",
                issue
            ))
    
    # 5. Score consistency
    if consistency_result.get("calibrated") and not consistency_result.get("is_monotonic"):
        warnings.append(_create_warning(
            "minor",
            "ranking",
            "Score，。"
        ))
    
    return sanity_details
```

---

## 、

### v3.4（2）

**Week 1**:
- [ ] 
- [ ] 
- [ ] final_score
- [ ] 

**Week 2**:
- [ ] QA
- [ ] 
- [ ] 
- [ ] 

### v3.5（2）

**Week 1**:
- [ ] 
- [ ] pairwise consistency
- [ ] isotonic regression
- [ ] 

**Week 2**:
- [ ] ranking sanity
- [ ] 
- [ ] 
- [ ] 

---

## 、

### 

：

1. ****（100）:
   - structural_risk
   - has_hallmark
   - cdr3_anchor_match
   - final_outcome = "success"

2. ****（50）:
   - structural_risk
   - has_hallmark
   - cdr3_anchor_match
   - final_outcome = "failed"
   - failure_reason

### 

- VHH
- VHH（SAbDab）
- VHH

---

## 、

### 

1. ****: ，
   - ****: bootstrap

2. ****: 
   - ****: 

3. ****: v3.4/v3.5
   - ****: ，

### 

1. ****: /failures
   - ****: ，A/B

2. ****: 
   - ****: 

---

## 、

### v3.4

1. ✅ 
2. ✅ （FR2/grafting/CDR3 anchor）
3. ✅ CDR3 anchor

### v3.5

1. ✅ 
2. ✅ Pairwise consistency
3. ✅ Isotonic regression

### 

- ****: 
- ****: 
- ****: 
- ****: 

---

****: 1.0  
****: 20251210

















