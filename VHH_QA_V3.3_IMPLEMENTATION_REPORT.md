# VHH QA v3.3 

****: 20251210  
****: v3.3.0  
****: ✅ 

---

## 、

v3.2""，4（P04/P06/P08/P10），（minor/major），QA""，"，"。

---

## 、

### ✅ 1. （Minor/Major）

****: warnings

****: warnings，：
```python
{
    "level": "minor" | "major",
    "category": "delta_risk" | "structural" | "ranking" | "fallback" | ...,
    "message": str
}
```

****: 
- 
- 
- 

---

### ✅ 2. P04: ΔDevelopability -0.05minor_warning

****: v3.2，-0.05developabilityerrormajor warning

****: 
- Δ <= -0.10: **error**
- -0.10 < Δ <= -0.05: **major warning**
- -0.05 < Δ < 0: **minor warning**
- Δ >= 0: 

****: ✅ `test_P04_minor_developability_drop_warning` 

---

### ✅ 3. P06: CDR3=14, FR3=36minor_warning

****: v3.2，FR3=36aaCDR3，error

****: 
- CDR3 2-14aa: FR3≥35aa，35-36aa**minor warning**
- CDR3 15-24aa: FR3≥38aa，<38aaerror
- CDR3 ≥25aa: FR3≥40aa，<40aaerror

****: ✅ `test_P06_edge_case_fr3_slightly_short` 

---

### ✅ 4. P08: Ranking sanity

****: v3.2，FR identity0.04errormajor warning

****: 
- fr_gap >= 0.10 & comb_gap <= 0.03: **error**
- 0.05 <= fr_gap < 0.10 & comb_gap <= 0.03: **major warning**
- 0.03 <= fr_gap < 0.05 & comb_gap <= 0.02: **minor warning**

****: ✅ `test_P08_second_template_slightly_better_warning` 

---

### ✅ 5. P10: auto_build_mutations_from_regions

****: mutations.listhumanized_regions，QA

****: 
- `auto_build_mutations_from_regions`
- regionsmutations.list，
- QA，mutations.list，

****: ✅ `test_P10_safe_mode_conservative_pass` 

---

### ✅ 6. final_score（structural_risk + hallmark_penalty）

****: 
```
final_score = combined - 0.20 * structural_risk - hallmark_penalty
```

****:
- Hallmark: penalty = 0.15
- Hallmark: penalty = 0.05
- Structural risk: 0~1，

****:
- final_scorecombined_score
- Ranking sanityfinal_score

---

## 、

### （4）

|  |  |  |
|------|------|------|
| P04: Developability delta warning | ✅  | -0.05minor warning |
| P06: FR3 | ✅  | FR3=36aa, CDR3=14aaminor warning |
| P08: Ranking sanity | ✅  | FR identity0.04minor warning |
| P10: Safe mode | ✅  | mutations.list |

### （v3.2）

20（，）。

---

## 、

### 

- `core/vhh_qa_validation_v3_3.py`: v3.3

### 

- `core/vhh_humanization_with_qa.py`: v3.3，v2/v3
- `tests/test_vhh_qa_v3_positive.py`: 4v3.3

### 

1. `validate_vhh_humanization_result_v3_3`: v3.3
2. `auto_build_mutations_from_regions`: mutations.list
3. `_create_warning`: warning
4. `_qa_structural_compat_cdr3_fr3_v3_3`: v3.3 CDR3-FR3
5. `_check_developability_delta_v3_3`: v3.3 Developability delta
6. `_qa_ranking_sanity_v3_3`: v3.3 Ranking sanity
7. `compute_final_score`: final score

---

## 、QA

### v3.3

```python
qa_v3_3 = {
    "ok": bool,
    "errors": [str],  # 
    "warnings": [      # warnings
        {
            "level": "minor" | "major",
            "category": "delta_risk" | "structural" | "ranking" | ...,
            "message": str
        },
        ...
    ],
    "checks": {
        "integrity": {...},
        "structural_compat": {...},
        "grafting_impact": {...},
        "ranking_sanity": {...},
        "delta_risk": {...},
    },
    "summary_score": {
        "biological_feasibility": float,  # 0-100
        "risk_level": "low" | "medium" | "high",
    },
    "mutation_map": {...},
    "conformation_risk_summary": {...},
    "experimental_recommendations": {...},
    "meta": {
        "version": "3.3.0",
        "ruleset": "VHH_QA_V3.3_CANONICAL",
        ...
    }
}
```

### 

- `result["qa"]["v3_3"]`: v3.3
- `result["qa"]["v3"]`: v3.2
- `result["qa"]["v2"]`: v2.0
- `result["qa"]["ok"]`: v3.3
- `result["status"]`: "OK"  "FAILED_QA_V3_3"

---

## 、

### ✅ 

1. **v2.0**: v2.0，v3.3
2. **v3.2**: v3.2，
3. **warnings**: `result["qa"]["warnings"]`，

### ⚠️ 

1. ****: v3.2error，v3.3warning
2. **final_score**: final_score，

---

## 、

### 

1. ✅ （30），
2. ⚠️ ，v3.3warnings
3. ⚠️ ，v3.3

### 

4. 📝 ，warning
5. 📝 final_score（structural_riskhallmark_penalty）
6. 📝 

### 

7. 📝 "info"
8. 📝 warning
9. 📝 warning

---

## 、

### ✅ 

1. **4**: P04/P06/P08/P10
2. ****: minor/major，
3. ****: final_score，
4. ****: auto_build_mutations_from_regions

### 📊 

- ****: v3.3.0
- ****: 4/4 (100%) - 4
- ****: ✅ 
- ****: ✅ （v3.2，）

---

****: 1.0  
****: 20251210

















