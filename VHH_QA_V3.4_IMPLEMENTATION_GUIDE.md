# VHH QA v3.4 （Cursor ）

****: 20251210  
****: v3.4.0  
****: `D:\InSynBio-AI-Research\Antibody_Engineer_Suite`

---

##  0：，

###  0.1：

```powershell
cd D:\InSynBio-AI-Research\Antibody_Engineer_Suite
git status
```

###  0.2：

```powershell
git checkout -b feature/vhh_qa_v3_4
```

---

##  1： `core/vhh_qa_data_calibration.py`

###  1.1：

 Cursor  Explorer ， `core/` ，：`core/vhh_qa_data_calibration.py`

###  1.2：

```python
"""
VHH QA

VHH，QA
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional, List
import numpy as np

PROJECT_ROOT = Path(__file__).resolve.parents[1]


class VHHDataCalibration:
    """
    VHH，QA
    """
    
    def __init__(self, calibration_db_path: Optional[str] = None):
        """
        
        
        Args:
            calibration_db_path: JSON
                                None，
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
            self._compute_distributions
        else:
            # 
            self._use_default_weights
    
    def _load_calibration_db(self, db_path: str) -> Dict[str, Any]:
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
        db_file = Path(db_path)
        if not db_file.exists:
            # ，
            return {"successful_cases": [], "failed_cases": []}
        
        with open(db_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _compute_distributions(self):
        """/"""
        if not self.db:
            self._use_default_weights
            return
        
        # structural_risk
        success_cases = self.db.get("successful_cases", [])
        if success_cases:
            success_risks = [c.get("structural_risk", 0.2) for c in success_cases]
            self.success_risk_median = float(np.median(success_risks))
            self.success_risk_p75 = float(np.percentile(success_risks, 75))
        else:
            self.success_risk_median = 0.2
            self.success_risk_p75 = 0.3
        
        # structural_risk
        failed_cases = self.db.get("failed_cases", [])
        if failed_cases:
            failed_risks = [c.get("structural_risk", 0.6) for c in failed_cases]
            self.failed_risk_median = float(np.median(failed_risks))
            self.failed_risk_p25 = float(np.percentile(failed_risks, 25))
        else:
            self.failed_risk_median = 0.6
            self.failed_risk_p25 = 0.5
        
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
        
        if risk_diff > 0:
            # ：risk0.1final_score
            # ：weight * risk_diff >= 0.1
            self.structural_risk_weight = max(0.1, 0.1 / risk_diff)
        else:
            self.structural_risk_weight = 0.20  # 
        
        # Hallmark penalty
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
            
            # Hallmark
            hallmark_impact = hallmark_failure_rate - (1 - hallmark_success_rate)
            self.hallmark_penalty = max(0.05, min(0.25, hallmark_impact))
        else:
            self.hallmark_penalty = 0.15  # 
    
    def _use_default_weights(self):
        """"""
        self.structural_risk_weight = 0.20
        self.hallmark_penalty = 0.15
    
    def get_calibrated_weights(self) -> Dict[str, float]:
        """
        
        
        Returns:
            
        """
        return {
            "structural_risk_weight": self.structural_risk_weight,
            "hallmark_penalty": self.hallmark_penalty,
            "success_risk_median": self.success_risk_median,
            "failed_risk_median": self.failed_risk_median,
            "calibration_source": "VHH_historical_database" if self.db else "default"
        }
```

###  1.3：

：

```powershell
python -c "from core.vhh_qa_data_calibration import VHHDataCalibration; print('✅ ')"
```

---

##  2： `core/vhh_qa_structural_risk_layered.py`

###  2.1：

 `core/` ：`core/vhh_qa_structural_risk_layered.py`

###  2.2：

```python
"""
VHH

：
1. FR2 hydrophilic patch
2. Graftinginterface
3. CDR3 anchor residues
"""

from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

# IMGT（v3.3）
IMGT_REGIONS = {
    "FR1": {"start": 1, "end": 26},
    "CDR1": {"start": 27, "end": 38},
    "FR2": {"start": 39, "end": 55},
    "CDR2": {"start": 56, "end": 65},
    "FR3": {"start": 66, "end": 104},
    "CDR3": {"start": 105, "end": 117},
    "FR4": {"start": 118, "end": 128},
}

# VHH hallmark（IMGT）
VHH_HALLMARK_POSITIONS = [37, 44, 45, 47]

# CDR3 anchor（IMGT）
CDR3_ANCHOR_POSITIONS = [95, 96, 101, 102]


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
    orig_fr2 = orig_regions.get("FR2", "")
    hum_fr2 = hum_regions.get("FR2", "")
    
    if not orig_fr2 or not hum_fr2:
        return 1.0  # FR2，
    
    # FR2IMGT 39
    fr2_start = IMGT_REGIONS["FR2"]["start"]  # 39
    
    # hallmark
    preserved_count = 0
    for pos in VHH_HALLMARK_POSITIONS:
        # FR2（0-based）
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
    try:
        from core.vhh_qa_grafting import qa_grafting_impact
        
        _, _, impact_details = qa_grafting_impact(orig_regions, hum_regions)
        impact_normalized = impact_details.get("impact_score_normalized", 0)
        
        # 0~1
        # impact_normalized0~1，1
        risk = min(1.0, impact_normalized / 0.4)  # 0.4error
        return risk
    except ImportError:
        # qa_grafting_impact，
        return 0.5


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
    orig_fr3 = orig_regions.get("FR3", "")
    hum_fr3 = hum_regions.get("FR3", "")
    
    if not orig_fr3 or not hum_fr3:
        return 1.0  # FR3，
    
    # FR3IMGT 66
    fr3_start = IMGT_REGIONS["FR3"]["start"]  # 66
    
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
        if not template_fr3 and isinstance(template_info, dict):
            # templateFR3
            template_regions = template_info.get("regions", {})
            template_fr3 = template_regions.get("FR3", "")
        
        if template_fr3:
            # 101/102
            for pos in [101, 102]:
                local_idx = pos - fr3_start
                if 0 <= local_idx < len(template_fr3) and 0 <= local_idx < len(hum_fr3):
                    template_aa = template_fr3[local_idx]
                    hum_aa = hum_fr3[local_idx]
                    
                    # humanizedanchor，
                    if template_aa != hum_aa:
                        risk = max(risk, 0.8)
    
    return max(0.0, min(1.0, risk))


def _is_hydrophilic_improvement(orig_aa: str, hum_aa: str) -> bool:
    """
    （improvement）
    
    ：
    - ：D, E, K, R, H, N, Q, S, T, Y
    - ：A, V, L, I, M, F, W, P
    """
    hydrophilic = set("DEKRHNQSTY")
    hydrophobic = set("AVLIMFWP")
    
    orig_is_hydrophilic = orig_aa in hydrophilic
    hum_is_hydrophilic = hum_aa in hydrophilic
    
    # ，，improvement
    if orig_aa in hydrophobic and hum_aa in hydrophilic:
        return True
    if orig_aa in hydrophilic and hum_aa in hydrophilic:
        return True
    
    return False
```

###  2.3：

```powershell
python -c "from core.vhh_qa_structural_risk_layered import compute_layered_structural_risk, StructuralRiskComponents; print('✅ ')"
```

---

##  3： v3.4 QA  `core/vhh_qa_validation_v3_4.py`

###  3.1：

 `core/` ：`core/vhh_qa_validation_v3_4.py`

###  3.2：

```python
"""
VHHQA v3.4

v3.4：
- 
- （FR2/grafting/CDR3 anchor）
- CDR3 anchor
"""

from typing import Dict, List, Any, Optional
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve.parents[1]

# v3.3
from core.vhh_qa_validation_v3_3 import (
    validate_vhh_humanization_result_v3_3,
    _create_warning,
    auto_build_mutations_from_regions
)

# v3.4
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
    v3.4: final_score
    
    Args:
        candidate: 
        calibration: （，；）
    
    Returns:
        final score
    """
    scores = candidate.get("alignment_scores", {}) or candidate.get("scores", {})
    base = scores.get("combined_score", 0.0) or scores.get("combined", 0.0)
    
    # structural_risk
    structural_risk = scores.get("structural_risk", 0.0)
    
    # structural_risk，risk_components
    if structural_risk == 0.0:
        risk_components = scores.get("structural_risk_components", {})
        if risk_components:
            structural_risk = risk_components.get("total_risk", 0.0)
    
    # 
    if calibration:
        weights = calibration.get_calibrated_weights
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
    
    # candidatescores
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
    VHHQA v3.4
    
    v3.4：
    - 
    - （FR2/grafting/CDR3 anchor）
    - CDR3 anchor
    
    Args:
        result: 
        strict: （True，error）
        calibration: 
    
    Returns:
        qa_v3_4（v3.3，structural_risk_components）
    """
    # v3.3
    qa_v3_3 = validate_vhh_humanization_result_v3_3(result, strict=False)
    
    errors = qa_v3_3.get("errors", [])
    warnings = qa_v3_3.get("warnings", [])
    
    # 
    seq_analysis = result.get("sequence_analysis", {})
    orig_regions = seq_analysis.get("original_regions", {}) or {}
    hum_regions = seq_analysis.get("humanized_regions", {}) or {}
    template_info = result.get("best_match", {}).get("template", {})
    
    # === v3.4:  ===
    risk_components = compute_layered_structural_risk(
        orig_regions, hum_regions, template_info
    )
    
    # risk_componentsresult
    if "qa" not in result:
        result["qa"] = {}
    result["qa"]["structural_risk_components"] = risk_components.to_dict
    
    # === v3.4: CDR3 anchor ===
    if risk_components.cdr3_anchor_risk >= 0.7:
        errors.append(
            f"CDR3 anchor residues ({risk_components.cdr3_anchor_risk:.2f})，"
            "VHH。101/102humanized，"
            "。"
        )
    
    # === v3.4: structural_risk + final_score ===
    candidates = result.get("candidates", [])
    for cand in candidates:
        # 
        # ：candidatesorig_regionshum_regions
        # ，orig_regionshum_regions
        cand_orig_regions = cand.get("orig_regions", orig_regions)
        cand_hum_regions = cand.get("hum_regions", hum_regions)
        
        # candidates，
        if not cand_orig_regions or not cand_hum_regions:
            cand_orig_regions = orig_regions
            cand_hum_regions = hum_regions
        
        # 
        cand_risk_components = compute_layered_structural_risk(
            cand_orig_regions, cand_hum_regions, cand.get("template", {})
        )
        
        # candidatescores
        if "scores" not in cand:
            cand["scores"] = {}
        cand["scores"]["structural_risk_components"] = cand_risk_components.to_dict
        cand["scores"]["structural_risk"] = cand_risk_components.total_risk
        
        # final_score
        compute_final_score_v3_4(cand, calibration)
    
    # === qa_v3_4（v3.3） ===
    qa_v3_4 = {
        "ok": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "checks": qa_v3_3.get("checks", {}),
        "summary_score": qa_v3_3.get("summary_score", {}),
        "structural_risk_components": risk_components.to_dict,  # v3.4
        "meta": {
            "version": "3.4.0",
            "ruleset": "VHH_QA_V3.4_CALIBRATED",
            "calibration_used": calibration is not None
        }
    }
    
    # v3.3，
    for key in ["mutation_map", "conformation_risk_summary", "experimental_recommendations"]:
        if key in qa_v3_3:
            qa_v3_4[key] = qa_v3_3[key]
    
    return qa_v3_4
```

###  3.3：

```powershell
python -c "from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4, compute_final_score_v3_4; print('✅ ')"
```

---

##  4：VHH pipelinev3.4

###  4.1：

 `core/vhh_humanization_with_qa.py`，QA。

###  4.2： `core/vhh_humanization_with_qa.py`

：

```python
from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4
from core.vhh_qa_data_calibration import VHHDataCalibration
```

 `humanize_vhh_with_qa` QA（74-75），：

```python
# QA - v3.4
qa_v3_4_result = validate_vhh_humanization_result_v3_4(json_data, strict=strict_qa)

# v3.3
from core.vhh_qa_validation_v3_3 import validate_vhh_humanization_result_v3_3
qa_v3_3_result = validate_vhh_humanization_result_v3_3(json_data, strict=strict_qa)

# v3.2
from core.vhh_qa_validation import validate_vhh_humanization_result_v3
qa_v3_result = validate_vhh_humanization_result_v3(json_data, strict=strict_qa)

# ：result["qa"]["v3_4"] = qa_v3_4
# v2/v3
qa_v2_result = validate_vhh_humanization_result(json_data, strict=False)

result["qa"] = {
    "v2": qa_v2_result,  # v2.0
    "v3": qa_v3_result,  # v3.2
    "v3_3": qa_v3_3_result,  # v3.3
    "v3_4": qa_v3_4_result  # v3.4
}

# ：result["qa"]v3.4
result["qa"]["ok"] = qa_v3_4_result.get("ok", False)
result["qa"]["errors"] = qa_v3_4_result.get("errors", [])
# v3.4warnings
warnings_list = []
for w in qa_v3_4_result.get("warnings", []):
    if isinstance(w, dict):
        warnings_list.append(w.get("message", str(w)))
    else:
        warnings_list.append(str(w))
result["qa"]["warnings"] = warnings_list
```

QA：

```python
# QA（v3.4）
if qa_v3_4_result["ok"]:
    result["status"] = "OK"
    v3_4_warnings = qa_v3_4_result.get("warnings", [])
    if v3_4_warnings:
        major_warnings = [w for w in v3_4_warnings if isinstance(w, dict) and w.get("level") == "major"]
        if major_warnings:
            logger.warning(f"QA: {[w.get('message') for w in major_warnings]}")
    return result

# QA
logger.warning(f"QA: {qa_v3_4_result['errors']}")
```

status：

```python
# 
result["status"] = "FAILED_QA_V3_4"
```

---

##  5：（DB）

###  5.1：

：`tests/manual_test_vhh_qa_v3_4.py`

```python
"""
VHH QA v3.4
"""

from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4
from core.vhh_qa_data_calibration import VHHDataCalibration


def make_minimal_result_skeleton:
    """"""
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


def main:
    print("=" * 80)
    print("VHH QA v3.4 ")
    print("=" * 80)
    
    # 
    dummy_result = make_minimal_result_skeleton
    
    # 1：
    print("\n1: ")
    out1 = validate_vhh_humanization_result_v3_4(dummy_result, strict=True, calibration=None)
    print(f"✅ OK: {out1['ok']}")
    print(f"📊 Structural Risk Components: {out1.get('structural_risk_components', {})}")
    print(f"❌ Errors: {len(out1.get('errors', []))}")
    print(f"⚠️  Warnings: {len(out1.get('warnings', []))}")
    
    # 2：
    print("\n2: ")
    calibration = VHHDataCalibration(calibration_db_path=None)
    out2 = validate_vhh_humanization_result_v3_4(dummy_result, strict=True, calibration=calibration)
    print(f"✅ OK: {out2['ok']}")
    print(f"📊 Calibrated Weights: {calibration.get_calibrated_weights}")
    
    # 3：CDR3 anchor
    print("\n3: CDR3 anchor")
    high_risk_result = make_minimal_result_skeleton
    # FR3101/102，
    fr3_list = list(high_risk_result["sequence_analysis"]["humanized_regions"]["FR3"])
    # FR3IMGT 66，101-66=35, 102-66=36
    if len(fr3_list) > 36:
        fr3_list[35] = "X"  # 101
        fr3_list[36] = "Y"  # 102
    high_risk_result["sequence_analysis"]["humanized_regions"]["FR3"] = "".join(fr3_list)
    out3 = validate_vhh_humanization_result_v3_4(high_risk_result, strict=True, calibration=None)
    print(f"✅ OK: {out3['ok']}")
    print(f"📊 CDR3 Anchor Risk: {out3.get('structural_risk_components', {}).get('cdr3_anchor_risk', 0):.2f}")
    print(f"❌ Errors: {out3.get('errors', [])}")
    
    print("\n" + "=" * 80)
    print("")
    print("=" * 80)


if __name__ == "__main__":
    main
```

###  5.2：

```powershell
python -m tests.manual_test_vhh_qa_v3_4
```

****:
- 
-  `structural_risk_components` 
- errors/warnings 
- 3CDR3 anchorerror

---

##  6： + 

###  6.1：

：`tests/test_vhh_qa_v3_4.py`

```python
"""
VHH QA v3.4 
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


def make_minimal_result_skeleton:
    """"""
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


def test_cdr3_anchor_risk_high_should_fail:
    """：CDR3 anchor >= 0.7 fail"""
    result = make_minimal_result_skeleton
    
    # FR3101/102，
    fr3_list = list(result["sequence_analysis"]["humanized_regions"]["FR3"])
    # FR3IMGT 66，101-66=35, 102-66=36
    if len(fr3_list) > 36:
        fr3_list[35] = "X"  # 101
        fr3_list[36] = "Y"  # 102
    result["sequence_analysis"]["humanized_regions"]["FR3"] = "".join(fr3_list)
    
    qa_v3_4 = validate_vhh_humanization_result_v3_4(result, strict=True)
    
    assert qa_v3_4["ok"] is False, "CDR3 anchor>=0.7fail"
    assert len(qa_v3_4["errors"]) > 0, "error"
    assert any("CDR3 anchor" in e for e in qa_v3_4["errors"]), "CDR3 anchorerror"


def test_hallmark_penalty_applied:
    """：hallmarkhallmark_penalty"""
    candidate = {
        "scores": {
            "combined": 0.70,
            "structural_risk": 0.3
        },
        "flags": {"has_vhh_hallmark": False},
        "template": {"flags": {}}
    }
    
    final_score = compute_final_score_v3_4(candidate, calibration=None)
    
    # hallmark_penalty (0.15)
    expected_final = 0.70 - 0.20 * 0.3 - 0.15
    assert abs(final_score - expected_final) < 0.01, f"Final scorehallmark penalty: {final_score} vs {expected_final}"


def test_calibration_weights_applied:
    """：calibration，structural_risk_weight"""
    candidate = {
        "scores": {
            "combined": 0.70,
            "structural_risk": 0.3
        },
        "flags": {"has_vhh_hallmark": True},
        "template": {"flags": {}}
    }
    
    # 
    final_score_default = compute_final_score_v3_4(candidate, calibration=None)
    
    # （，，）
    calibration = VHHDataCalibration(calibration_db_path=None)
    final_score_calibrated = compute_final_score_v3_4(candidate, calibration=calibration)
    
    # ，
    assert abs(final_score_default - final_score_calibrated) < 0.01, ""


def test_layered_structural_risk_components:
    """："""
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
    assert "total_risk" in risk_components.to_dict


def test_structural_risk_components_in_result:
    """：structural_risk_components"""
    result = make_minimal_result_skeleton
    
    qa_v3_4 = validate_vhh_humanization_result_v3_4(result, strict=True)
    
    assert "structural_risk_components" in qa_v3_4, "structural_risk_components"
    components = qa_v3_4["structural_risk_components"]
    assert "fr2_hydrophilic_patch_risk" in components
    assert "grafting_interface_risk" in components
    assert "cdr3_anchor_risk" in components
    assert "total_risk" in components
```

###  6.2：

```powershell
python -m pytest tests/test_vhh_qa_v3_4.py -v
```

###  6.3：

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

##  7： v3.5 

###  7.1： `core/vhh_qa_validation_v3_4.py` TODO

```python
# TODO(v3.5):
# -  ranking stability  (analyze_ranking_stability, calibrate_score_consistency)
# -  validate_vhh_humanization_result_v3_4  ranking sanity 
# - heuristic
# - pairwise consistency
# - isotonic regression
```

---

## 

，：

```powershell
# 1. 
ls core/vhh_qa_data_calibration.py
ls core/vhh_qa_structural_risk_layered.py
ls core/vhh_qa_validation_v3_4.py
ls tests/test_vhh_qa_v3_4.py

# 2. 
python -m pytest tests/test_vhh_qa_v3_4.py -v

# 3. 
python -m tests.manual_test_vhh_qa_v3_4

# 4. 
python -c "from core.vhh_qa_validation_v3_4 import validate_vhh_humanization_result_v3_4; print('✅ v3.4')"
```

---

## 

```
core/
├── vhh_qa_data_calibration.py          # ：
├── vhh_qa_structural_risk_layered.py   # ：
├── vhh_qa_validation_v3_4.py          # ：v3.4 QA
└── vhh_humanization_with_qa.py         # ：v3.4

tests/
├── manual_test_vhh_qa_v3_4.py          # ：
└── test_vhh_qa_v3_4.py                 # ：
```

---

****: 1.0  
****: 20251210

















