# VHH QA v3.2 

****: 20251210  
****: v3.2.0  
****: 

---

## 

v3.2v3.1，QA"silent failure"。

---

## 1: Ranking Sanity - Error

### 

****: N12 - FR identitycombined score

****:
- FR identity（0.75 vs 0.90，0.15）combined score（0.70 vs 0.68，0.02）
- QAwarningerror
- silent failure：

### 

****: `core/vhh_qa_ranking.py`

****:
```python
# v3.2：errorwarning
if fr_gap >= 0.10 and combined_gap <= 0.03:
    # silent failure
    errors.append(
        f"Ranking sanity violated — FR identity vs combined inconsistency: "
        f"FR identity，。"
        f"scoring model，。"
    )
elif fr_gap >= 0.05 and combined_gap <= 0.02:
    # warning
    warnings.append(...)
```

****:
- **Error**: `fr_identity_gap >= 0.10`  `combined_gap <= 0.03`
- **Warning**: `fr_identity_gap >= 0.05`  `combined_gap <= 0.02`

### 

****: `test_N12_fr_identity_ranking_mismatch`

****:
- ✅ `qa_v3["ok"] == False`
- ✅ `ranking_errors`"Ranking sanity violated"
- ✅ scoring model

---

## 2: CDR-FR - Fail

### 

****: N18 - CDRFR

****:
- CDR1=4aa（VHH5aa）
- FR2=10aa（VHHFR2 15-19aa）
- ：，100%fail
- warningerror

### 

****: `core/vhh_qa_validation.py`

****:
```python
# v3.2：fail
# VHHCDR1=5aa，FR2=13aa（15-19aa）
if cdr1_len < 5 or fr2_len < 13:
    errors.append(
        f"CDR1–FR2VHH: CDR1={cdr1_len}aa（5aa），"
        f"FR2={fr2_len}aa（13aa，15-19aa）。"
        f"，fail。"
    )
```

****:
- **CDR1**: 5aa
- **FR2**: 13aa（15-19aa）

### 

****: `test_N18_cdr_fr_combo_not_in_allowed_matrix`

****:
- ✅ `qa_v3["ok"] == False`
- ✅ `structural_errors`""""
- ✅ QA

---

## 

### 

- **v3.1.0** → **v3.2.0**

### 

1. `core/vhh_qa_ranking.py` - Ranking sanity
2. `core/vhh_qa_validation.py` - 
3. `tests/test_vhh_qa_v3_negative_semantic.py` - 
4. `tests/test_vhh_qa_validation_v3.py` - 

---

## （v3.3+）

### 1. Combined Score

****: Combined score，

****:
```python
final_score = combined - α * structural_risk

combined_components = {
    "fr_identity": ...,
    "cdr_compatibility": ...,
    "developability": ...,
    "immunogenicity": ...,
    "structural_risk": ...  # 
}
```

### 2. HallmarkPenalty

****: Hallmarkcombined score

****:
```python
if not has_hallmark:
    impose penalty: combined -= 0.10
```

### 3. Allowed Matrix

****: ""，" → error"

****:
- canonical classes
- VHH（73VHH）
- FR2 hydrophilic patch
- FR3 minimum 35aa

---

## 

### 

```
FAILED tests/test_vhh_qa_v3_negative_semantic.py::test_N12_fr_identity_ranking_mismatch
FAILED tests/test_vhh_qa_v3_negative_semantic.py::test_N18_cdr_fr_combo_not_in_allowed_matrix
```

### 

```
✅ test_N12_fr_identity_ranking_mismatch PASSED
✅ test_N18_cdr_fr_combo_not_in_allowed_matrix PASSED
```

---

## 

✅ **v3.2**:
- ✅ Ranking sanity → Error
- ✅ CDR-FR → Error

✅ ****:
- ✅ silent failure
- ✅ QA

****: ✅ （v3.2.0）

---

****: 1.0  
****: 20251210

















