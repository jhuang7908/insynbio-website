# VHH QA v3.2 

****: 20251210  
****: v3.2.0  
****: 30

---

## 、

### 

```
: 30
: 26
: 4
: 86.7%
```

### 

|  |  |  |  |  |
|---------|------|------|------|--------|
|  (P01-P10) | 10 | 8 | 2 | 80% |
|  (N01-N08) | 8 | 8 | 0 | 100% |
|  (N09-N20) | 12 | 10 | 2 | 83.3% |

---

## 、

### ✅ 1: Ranking Sanity - Error

****: `test_N12_fr_identity_ranking_mismatch`

****: ✅ ****

****:
- FR identity>=0.10combined<=0.03，error
- "Ranking sanity violated"
- `qa_v3["ok"] == False`

****: ✅ scoring model

### ✅ 2: CDR-FR - Fail

****: `test_N18_cdr_fr_combo_not_in_allowed_matrix`

****: ✅ ****

****:
- CDR1<5aaFR2<13aa，fail
- """"
- `qa_v3["ok"] == False`

****: ✅ VHH

---

## 、

### ⚠️ 1: test_P04_minor_developability_drop_warning

****:   
****: ok=True，developability（-0.05）warning

****:
- warnings"developability"""
- warning，warning

****:
- Delta riskwarning
- -0.05warning

****:
1. `core/vhh_qa_validation.py`developability delta
2. -0.05warning（-0.05-0.1）
3. warning

### ⚠️ 2: test_P06_edge_case_fr3_slightly_short

****:   
****: ok=True，FR3（36aa）CDR3（14aa）warning

****:
- FR3=36aa, CDR3=14aa
- structural compatibilityerrorwarning

****:
- 
- warningerror

****:
1. `core/vhh_qa_structural_rules.py`CDR3-FR3
2. FR3=36aa, CDR3=14aawarning

### ⚠️ 3: test_P08_second_template_slightly_better_warning

****:   
****: ok=True，ranking warningfail

****:
- ，secondFR identity (0.86) best (0.82)，0.04
- combined score0.01
- v3.2，

****:
- ：warning
- ：，

****:
1. ranking sanity，0.04FR identitywarning
2. ，FR identity0.03-0.05（warning）
3. QA，0.04warning

### ⚠️ 4: test_P10_safe_mode_conservative_pass

****:   
****: ok=True，safe mode

****:
- 3FR，humanized_regions
- mutations.listregions，QA

****:
- ：mutations.list，humanized_regions
- humanized_regionsmutations

****:
1. humanized_regionsmutations.list
2. ：
   ```python
   # mutations.listhumanized_regions
   for mutation in result["mutations"]["list"]:
       region = mutation["region"]
       pos = mutation["position"]  # 1-based IMGT
       new_aa = mutation["to"]
       # 
   ```

---

## 、

### ✅ 

1. **** (100%)
   - ✅ FR4
   - ✅ CDR
   - ✅ 
   - ✅ CDR3
   - ✅ VHH hallmark
   - ✅ CDR3+FR3
   - ✅ grafting impact

2. **** 
   - ✅ CDR3/FR3
   - ✅ （v3.2）
   - ⚠️ warning

3. **Delta** (100%)
   - ✅ Immunogenicity
   - ✅ Developability
   - ✅ warning

4. **Ranking** 
   - ✅ Hallmark
   - ✅ （v3.2）
   - ⚠️ warning

5. **Fallback** (100%)
   - ✅ Fallback warning
   - ✅ fallback+

---

## 、

### 🔴 

#### 1.  - test_P10

****: 
- `test_P10_safe_mode_conservative_pass`mutations.listhumanized_regions
- QA，

****: 
- ，safe mode

****:
```python
# ，mutations.listhumanized_regions
# IMGT
IMGT_REGION_STARTS = {
    "FR1": 1, "CDR1": 27, "FR2": 39, "CDR2": 56,
    "FR3": 66, "CDR3": 105, "FR4": 118
}

for mutation in result["mutations"]["list"]:
    region = mutation["region"]
    imgt_pos = mutation["position"]  # 1-based IMGT
    new_aa = mutation["to"]
    
    # （0-based）
    region_start = IMGT_REGION_STARTS.get(region, 0)
    local_idx = imgt_pos - region_start
    
    # humanized_regions
    if 0 <= local_idx < len(result["sequence_analysis"]["humanized_regions"][region]):
        region_seq = list(result["sequence_analysis"]["humanized_regions"][region])
        region_seq[local_idx] = new_aa
        result["sequence_analysis"]["humanized_regions"][region] = "".join(region_seq)
```

#### 2. Developability Delta Warning - test_P04

****:
- `test_P04_minor_developability_drop_warning`
- -0.05developabilitywarning，warning

****:
- ，

****:
```python
# core/vhh_qa_validation.py
# -0.05warning（-0.05-0.1）
if delta_dev < DELTA_DEV_THRESHOLDS["warning_major"]:  # -0.1
    delta_warnings.append(...)
elif delta_dev < DELTA_DEV_THRESHOLDS["warning_minor"]:  # -0.05
    delta_warnings.append(
        f" developability  (Δ={delta_dev:.3f})，CMC。"
    )
```

#### 3.  - test_P06

****:
- `test_P06_edge_case_fr3_slightly_short`
- FR3=36aa, CDR3=14aa，warning

****:
- ，

****:
```python
# core/vhh_qa_structural_rules.py
# FR3=36aa, CDR3=14aa
# ：CDR3(2-14)FR3(35-42)，36aa
# warning，error
```

### 🟡 

#### 4. Ranking Sanity

****:
- `test_P08_second_template_slightly_better_warning`
- （0.04）

****:
- ，

****:
```python
# core/vhh_qa_ranking.py
# 0.03-0.05FR identitywarning
if fr_gap >= 0.10 and combined_gap <= 0.03:
    # Error: 
elif fr_gap >= 0.05 and combined_gap <= 0.02:
    # Warning: 
elif fr_gap >= 0.03 and combined_gap <= 0.01:
    # Info: 
```

#### 5. Combined Score

****:
- combined scorestructural risk
- Hallmarkpenalty

****:
- 

****:
```python
# combined score
final_score = combined - α * structural_risk

if not has_hallmark:
    final_score -= 0.10  # Hallmarkpenalty

combined_components = {
    "fr_identity": ...,
    "cdr_compatibility": ...,
    "developability": ...,
    "immunogenicity": ...,
    "structural_risk": ...,  # 
    "hallmark_penalty": ...  # 
}
```

#### 6. Allowed Matrix

****:
- ""，""

****:
- 

****:
```python
# core/vhh_qa_structural_rules.py
# ""
IMPOSSIBLE_COMBOS = [
    (cdr1_len < 5, "CDR1VHH"),
    (fr2_len < 13, "FR2VHH"),
    (cdr3_len > 35, "CDR3VHH"),
    (fr3_len < 35, "FR3VHH"),
]

for condition, message in IMPOSSIBLE_COMBOS:
    if condition:
        errors.append(f": {message}")
```

### 🟢 

#### 7. 

****: 30，86.7%

****:
- 
- 
- 

#### 8. 

****:
- 
- 
- 

#### 9. 

****:
- QA
- 
- 

---

## 、

### v3.1.0 → v3.2.0 

|  | v3.1.0 | v3.2.0 |  |
|------|--------|--------|------|
| Ranking Sanity | Warning | **Error** | ✅  |
| CDR-FR | Warning | **Error** | ✅  |
|  | 83.3% (25/30) | 86.7% (26/30) | ✅  |

---

## 、

### ✅ 

1. ****: N12N18
2. ****: silent failure
3. ****: 30

### ⚠️ 

1. ****: 1（P10），
2. **Warning**: 3（P04, P06, P08），warning
3. ****: Ranking sanity，

### 📊 

****: v3.2.0  
****: 86.7% (26/30)  
****: ✅   
****: ✅ 

---

## 、

### 

1. ⚠️ `test_P10_safe_mode_conservative_pass`
2. ⚠️ `test_P04_minor_developability_drop_warning`warning
3. ⚠️ `test_P06_edge_case_fr3_slightly_short`
4. ⚠️ `test_P08_second_template_slightly_better_warning`ranking sanity

### 

4. ⚠️ Ranking Sanity
5. ⚠️ Combined Score
6. ⚠️ Allowed Matrix

### 

7. 📝 
8. 📝 
9. 📝 

---

****: 1.0  
****: 20251210

