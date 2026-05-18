# VHH QA v3.0 

****: 20251210  
****: v3.0.0  
****: ✅ 

---

## 

QA v3.0VHH QA，3：
1. FR–CDR/
2. CDR grafting（anchor）
3. （ranking sanity + explainability）

`qa_v3`，status。

---

## 1：FR–CDR/QA（Structural Compatibility QA）

### 

FR/""CDR。：
**CDR / ↔ FR / **

### 

`core/vhh_qa_structural_rules.py`

### 

#### CDR1–FR2 

```python
ALLOWED_VHH_CDR1_FR2_COMBOS = [
    ((5, 8), (15, 19), "canonical_CDR1_short"),
    ((9, 12), (15, 19), "canonical_CDR1_long"),
    ((6, 7), (15, 19), "non_canonical_CDR1_short"),
    ((13, 15), (16, 20), "non_canonical_CDR1_long"),
]
```

#### CDR3–FR3 

```python
ALLOWED_VHH_CDR3_FR3_COMBOS = [
    ((2, 14), (35, 42), "cdr3_normal"),
    ((15, 25), (38, 45), "cdr3_long_needs_long_fr3"),
    ((26, 35), (40, 50), "cdr3_very_long_needs_very_long_fr3"),
]
```

### 

- **CDR1–FR2**: 
- **CDR3–FR3**: 
  - CDR3（≥15aa）FR3（<38aa）→ **ERROR**
  -  → **WARNING**
- **CDR2**: FR2/FR3

### 

```python
checks["structural_compat"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str]
}
```

---

## 2：CDR Grafting（Grafting Impact QA）

### 

FR–CDR，grafting。

### 

`core/vhh_qa_grafting.py`

### FR–CDR

IMGT：

```python
FR_CDR_INTERFACE_POSITIONS = {
    "CDR1": [25, 26, 27, 28, 29],  # FR1/CDR1 
    "CDR2": [52, 53, 54, 55],      # FR2/CDR2 
    "CDR3": [94, 95, 96, 101, 102] # FR3/CDR3 anchor/
}
```

### 

：
- ****（hydrophobic ↔ polar ↔ charged）: +2
- ****（small ↔ large）: +1

### 

- `impact_score >= 6`: **ERROR** - 
- `impact_score >= 3`: **WARNING** - 

### 

```python
checks["grafting_impact"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "impact_score": int,
    "interface_changes": [
        {
            "cdr": str,
            "imgt_pos": int,
            "from": str,
            "to": str,
            "category_change": bool,
            "volume_change": bool,
            "score": int
        }
    ]
}
```

---

## 3：QA（Ranking Sanity & Explainability）

### 

"bug1，"。

### 

`core/vhh_qa_ranking.py`

### 

#### 1：

- **1**: FR identity（≥5%），combined score（≤0.02）
  → **WARNING**: 

- **2**: VHH hallmark，
  → **ERROR**: VHH

#### 2：Score vector

combined score（，）

### 

```python
checks["ranking_sanity"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "ranking_issues": [
        {
            "type": str,  # "fr_identity_mismatch" or "hallmark_mismatch"
            "rank": int,
            "candidate_id": str,
            ...
        }
    ]
}
```

---

## 4：Δ Developability / Δ Immunogenicity 

### 

：
- **Δ Developability ≥ 0**
- **Δ Immunogenicity ≤ 0**

### 

#### Developability

- `delta < -0.1`: **WARNING** - ，
- `delta < -0.05`: **WARNING** - ，CMC

#### Immunogenicity

- `delta > 0`: **ERROR** - ，
- `delta == 0 and risk == "high"`: **WARNING** - high

### 

```python
checks["delta_risk"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "delta_details": {
        "developability": {
            "original": float,
            "humanized": float,
            "delta": float
        },
        "immunogenicity": {
            "original": str,  # "low"/"medium"/"high"
            "humanized": str,
            "delta": int  # 
        }
    }
}
```

---

## 5：qa_v3

### qa_v3

```python
qa_v3 = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "checks": {
        "integrity": {...},          # v2//CDR
        "structural_compat": {...},  # 1
        "grafting_impact": {...},    # 2
        "ranking_sanity": {...},     # 3
        "delta_risk": {...},         # 4
    },
    "summary_score": {
        "biological_feasibility": float,   # 0–100
        "risk_level": "low/medium/high",
    }
}
```

### Summary Score

**（0-100）**:
- : 100
- error10（50）
- warning3（30）
- grafting impact_score >= 6: 20
- grafting impact_score >= 3: 10

****:
- `biological_feasibility >= 80`: "low"
- `biological_feasibility >= 60`: "medium"
- `biological_feasibility < 60`: "high"

### Status

```python
if not qa_v3["ok"]:
    result["status"] = "FAILED_QA_V3"
else:
    result["status"] = "OK"
```

---

## 

### humanize_vhh_with_qa

```python
from core.vhh_qa_validation import validate_vhh_humanization_result_v3

# QA - v3.0
qa_result = validate_vhh_humanization_result_v3(json_data, strict=strict_qa)
result["qa"] = qa_result  # 
result["qa_v3"] = qa_result  # v3.0
```

### 

`status != "OK"`，QA。

`OK`，CRO：
- ""
- "FR–CDR"
- "Δ Developability / Δ Immunogenicity "

---

## 

### 

1. ✅ `core/vhh_qa_structural_rules.py` - 
2. ✅ `core/vhh_qa_grafting.py` - Grafting
3. ✅ `core/vhh_qa_ranking.py` - 

### 

1. ✅ `core/vhh_qa_validation.py` - `validate_vhh_humanization_result_v3`
2. ✅ `core/vhh_humanization_with_qa.py` - v3.0

---

## 

### 

```python
from core.vhh_qa_validation import validate_vhh_humanization_result_v3

result = {
    "sequence_analysis": {
        "original_regions": {...},
        "humanized_regions": {...}
    },
    "best_match": {...},
    "candidates": [...],
    "original_developability": {"score": 0.85},
    "original_immunogenicity": {"fr_immuno_risk": "low"},
    ...
}

qa_v3 = validate_vhh_humanization_result_v3(result, strict=True)

print(f"QA: {'' if qa_v3['ok'] else ''}")
print(f": {qa_v3['summary_score']['biological_feasibility']}")
print(f": {qa_v3['summary_score']['risk_level']}")

# 
for check_name, check_result in qa_v3["checks"].items:
    if not check_result.get("ok", True):
        print(f"{check_name}: ")
        for error in check_result.get("errors", []):
            print(f"  ❌ {error}")
```

---

## 

✅ **QA v3.0**

1. ✅ FR–CDR/
2. ✅ CDR grafting
3. ✅ 
4. ✅ Δ Developability/Immunogenicity
5. ✅ qa_v3

****: ✅ 

---

****: 1.0  
****: 20251210

















