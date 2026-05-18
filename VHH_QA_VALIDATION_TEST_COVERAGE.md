# VHH QA

****: 20251210  
****: `tests/test_vhh_qa_validation.py`  
****: 12

---

## 

### （7）

1. ✅ `test_rebuild_v_region_includes_fr4` - FR4
2. ✅ `test_rebuild_v_region_missing_fr4` - FR4
3. ✅ `test_rebuild_v_region_empty_regions` - 
4. ✅ `test_rebuild_v_region_none_values` - None
5. ✅ `test_validate_vhh_humanization_result_fr4_missing` - FR4
6. ✅ `test_validate_vhh_humanization_result_cdr_mutation` - CDR
7. ✅ `test_validate_vhh_humanization_result_success` - QA

### （5）

8. ✅ `test_validate_vhh_humanization_result_fallback_warning` - **E1: fallback**
9. ✅ `test_validate_vhh_humanization_result_fr_mutations_mismatch` - **E2: FR**
10. ✅ `test_validate_vhh_humanization_result_sequence_inconsistency` - **E3: full_sequencerebuilt**
11. ✅ `test_validate_vhh_humanization_result_cdr_difference_error` - **E4: CDR**
12. ✅ `test_validate_vhh_humanization_result_cdr_length_mismatch` - **E4: CDR**

---

## 

### 1: fallback

****: `test_validate_vhh_humanization_result_fallback_warning`

****: fallback

****:
-  `uses_fallback_numbering: True`
- warningQA

****:
- ✅ `qa["ok"]`  `True`（fallbackwarning）
- ✅ warnings"fallback"

****:
```python
"template": {
    "flags": {
        "uses_fallback_numbering": True,
        "uses_fallback_fr2": False,
    }
}
```

---

### 2: FR

****: `test_validate_vhh_humanization_result_fr_mutations_mismatch`

****: 

****:
- FR11（E->A）
- mutations.list2
- （Q->X）

****:
- ✅ `qa["ok"]`  `False`
- ✅ errors"FR """""""

****:
```python
"humanized_regions": {
    "FR1": "AVQLVESGGGLVQPGGSLRLSCAAS",  # 0: E->A (1)
    ...
},
"mutations": {
    "list": [
        {"region": "FR1", "position": 1, "from": "E", "to": "A"},
        {"region": "FR1", "position": 3, "from": "Q", "to": "X"},  # 
    ]
}
```

****:
- `"FR (1) FR (2) ，。"`
- `" FR1 3 (Q->X) FR，: Q->Q，。"`

---

### 3: full_sequencerebuilt

****: `test_validate_vhh_humanization_result_sequence_inconsistency`

****: 

****:
- `humanized_regions`  `best_match.humanized_sequence` 
-  > 3 aa

****:
- ✅ `qa["ok"]`  `False`
- ✅ errors""""

****:
```python
"humanized_regions": {
    "FR1": "EVQLVESGGGLVQPGGSLRLSCAAS",
    ...
},
"best_match": {
    "humanized_sequence": "XXXXXXXXXXXX"  # 
}
```

---

### 4: CDR

****: `test_validate_vhh_humanization_result_cdr_difference_error`

****: CDR

****:
- CDR1（N->Q）
- VHH FR-only

****:
- ✅ `qa["ok"]`  `False`
- ✅ errors"CDR1 "

****:
```python
"original_regions": {
    "CDR1": "GFWYNH",
    ...
},
"humanized_regions": {
    "CDR1": "GFWYQH",  # 4: N->Q (CDR，FR-only)
    ...
}
```

---

### 5: CDR

****: `test_validate_vhh_humanization_result_cdr_length_mismatch`

****: CDR

****:
- CDR1（6aa，7aa）
- VHH FR-only

****:
- ✅ `qa["ok"]`  `False`
- ✅ errors"CDR1 """

****:
```python
"original_regions": {
    "CDR1": "GFWYNH",  # 6 aa
    ...
},
"humanized_regions": {
    "CDR1": "GFWYNHX",  # 7 aa 
    ...
}
```

---

## 

```
============================= test session starts =============================
collected 12 items

tests/test_vhh_qa_validation.py::test_rebuild_v_region_includes_fr4 PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_missing_fr4 PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_empty_regions PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_none_values PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fr4_missing PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_mutation PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_success PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fallback_warning PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fr_mutations_mismatch PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_sequence_inconsistency PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_difference_error PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_length_mismatch PASSED

============================= 12 passed in 2.66s ==============================
```

****: 100% (12/12)

---

## 

|  |  |  |
|--------|---------|------|
| **E1: fallback** | `test_validate_vhh_humanization_result_fallback_warning` | ✅ |
| **E2: ** | `test_validate_vhh_humanization_result_fr_mutations_mismatch` | ✅ |
| **E3: ** | `test_validate_vhh_humanization_result_sequence_inconsistency` | ✅ |
| **E4: CDR** | `test_validate_vhh_humanization_result_cdr_difference_error` | ✅ |
| **E4: CDR** | `test_validate_vhh_humanization_result_cdr_length_mismatch` | ✅ |

---

## 

：

- ✅ FR1-FR4
- ✅ CDR1-CDR3
- ✅ `best_match.humanized_sequence`
- ✅ `mutations.list`
- ✅ `template.flags`（fallback）

---

## CI

CI：

1. ✅ **fallback** → warning
2. ✅ **FR** → error
3. ✅ **full_sequencerebuilt** → error
4. ✅ **CDR** → error
5. ✅ **CDR** → error

---

## 

5QA：

- ✅ **E1**: fallback（warning）
- ✅ **E2**: （error）
- ✅ **E3**: （error）
- ✅ **E4**: CDR（error，2）

****: ✅   
****: ✅ 100%  
**CI**: ✅ 

---

****: 1.0  
****: 20251210

















