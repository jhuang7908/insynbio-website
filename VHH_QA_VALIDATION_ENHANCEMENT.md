# VHH QA

****: 20251210  
****: v2.3.0  
****: `core/vhh_qa_validation.py`

---

## 

 `validate_vhh_humanization_result` 4：

1. **E1:  fallback ** - fallbackFR2
2. **E2: ** - 
3. **E3: ** -  `humanized_sequence` regions
4. **E4:  CDR ** - CDR（CDR）

---

## 

### E1:  fallback 

****: fallback，。

****:
- `result.quality_flags.uses_fallback_numbering`
- `result.quality_flags.uses_fallback_fr2`
- `result.best_match.template.flags.uses_fallback_numbering`
- `result.best_match.template.flags.uses_fallback_fr2`

****: fallback，warning（QA）。

****:
```python
warnings.append(
    "fallbackFR2，。"
)
```

---

### E2: 

****: ，。

****:
1. ****: FR = FR
2. ****: 

****:
-  `_collect_fr_differences` FR
- IMGT（1-based）（0-based）
- （，region）

****:
```python
errors.append(
    f"FR ({len(fr_diffs)}) FR "
    f"({len(fr_mutations)}) ，。"
)
```

---

### E3: 

****:  `humanized_sequence` regions，。

****:
1.  `humanized_regions` 
2.  `best_match.humanized_sequence` 
3.  > 3 aa，

****:
```python
errors.append(
    "humanized_sequence  FR1-CDR1-FR2-CDR2-FR3-CDR3-FR4 "
    "，。"
)
```

---

### E4:  CDR 

****: CDR，CDR。

****:
1. ****: CDR
2. ****: CDR（VHH FR-only）

****:
```python
errors.append(
    f"{region} （={len(o)}aa, "
    f"={len(h)}aa），VHH FR-only。"
)

errors.append(
    f"{region} （{i+1}: {o[i]}->{h[i]}），"
    "VHHCDR。"
)
```

---

## 

### `_collect_fr_differences`

****: FR。

****:
```python
def _collect_fr_differences(
    orig_regions: Dict[str, str],
    hum_regions: Dict[str, str]
) -> List[Tuple[str, int, str, str]]:
```

****: ， `(region_name, local_idx, orig_aa, hum_aa)`
- `region_name`: （"FR1", "FR2", "FR3", "FR4"）
- `local_idx`: （0-based）
- `orig_aa`: 
- `hum_aa`: 

---

## IMGT

****: mutations `position` 1-basedIMGT，（0-based）。

****:
```python
region_start_positions = {
    "FR1": 1,   # IMGT 1-26
    "CDR1": 27, # IMGT 27-38
    "FR2": 39,  # IMGT 39-55
    "CDR2": 56, # IMGT 56-65
    "FR3": 66,  # IMGT 66-104
    "CDR3": 105, # IMGT 105-117
    "FR4": 118, # IMGT 118+
}
```

****:
```python
local_idx = pos - region_start  # （0-based）
```

---

## 

### 

****: `tests/test_vhh_qa_validation_enhanced.py`

****:
1. ✅ `test_fallback_warning` - fallback
2. ✅ `test_mutation_consistency_check` - 
3. ✅ `test_mutation_inconsistency_error` - 
4. ✅ `test_sequence_consistency_check` - 
5. ✅ `test_sequence_inconsistency_error` - 
6. ✅ `test_cdr_difference_detection` - CDR

### 

```
============================= test session starts =============================
collected 13 items

tests/test_vhh_qa_validation.py::test_rebuild_v_region_includes_fr4 PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_missing_fr4 PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_empty_regions PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_none_values PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fr4_missing PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_mutation PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_success PASSED
tests/test_vhh_qa_validation_enhanced.py::test_fallback_warning PASSED
tests/test_vhh_qa_validation_enhanced.py::test_mutation_consistency_check PASSED
tests/test_vhh_qa_validation_enhanced.py::test_mutation_inconsistency_error PASSED
tests/test_vhh_qa_validation_enhanced.py::test_sequence_consistency_check PASSED
tests/test_vhh_qa_validation_enhanced.py::test_sequence_inconsistency_error PASSED
tests/test_vhh_qa_validation_enhanced.py::test_cdr_difference_detection PASSED

============================= 13 passed in 2.63s ==============================
```

****: 100% (13/13)

---

## 

✅ ****

- （，）
- 
- 

---

## 

### 

```python
from core.vhh_qa_validation import validate_vhh_humanization_result

result = {
    "sequence_analysis": {
        "original_regions": {...},
        "humanized_regions": {...}
    },
    "mutations": {
        "list": [...]
    },
    "best_match": {
        "humanized_sequence": "...",
        "template": {
            "flags": {
                "uses_fallback_numbering": True  # warning
            }
        }
    },
    "quality_flags": {}
}

qa_result = validate_vhh_humanization_result(result, strict=True)

if not qa_result["ok"]:
    print("QA:")
    for error in qa_result["errors"]:
        print(f"  - {error}")

if qa_result["warnings"]:
    print("QA:")
    for warning in qa_result["warnings"]:
        print(f"  - {warning}")
```

---

## 

VHHQA4：

1. ✅ **fallback** - fallback
2. ✅ **** - 
3. ✅ **** - 
4. ✅ **CDR** - CDR

****: 100%  
****: ✅   
****: ✅ 

---

****: 1.0  
****: 20251210

















