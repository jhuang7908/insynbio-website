# VHHQA

****: 20251210  
****: v2.4.0  
****: `core/vhh_qa_validation.py`

---

## 

4QA，""。，（semantic-level）。

---

## 1：FR/CDR（Semantic-level QA）

### 

#### 1.1 VHH Hallmark

****: FR2

****:
- VHH hallmark：37, 44, 45, 47（IMGT）
- ：44, 45, 47
- VHH≥2hallmark，≥2

****: `_check_vhh_hallmark_preservation`

****:
- hallmark（44, 45, 47）
- VHHhuman（47W）

****:
- Hallmark<2

****:
```
"VHH hallmark: [44, 45, 47]。FR2，hallmark37/44/45/47。"
"VHH hallmark47（FR2）VHHWhumanX，47（W），。。"
```

#### 1.2 CDRFR

****: VHHCDR

****:
- CDR1FR
- CDR

****: `_check_cdr_canonical_compatibility`

****:
- CDR18aa（FR）
- CDR

****:
```
"CDR18aa，FR。FR1。"
"CDR1（6aa），FR。"
```

#### 1.3 CDR3 Anchor Residues

****: CDR3 anchor residuesFR3（IMGT 95-102）

****:
- FR3anchor
- Anchor

****: `_check_cdr3_anchor_residues`

****:
- FR3，CDR3 anchor residues（IMGT 95-102）

****:
- Anchor（>2）

****:
```
"FR3（30aa），CDR3 anchor residues（IMGT 95-102，FR330-37）。CDR3 anchor residuesFR3，。"
```

---

## 2：Immunogenicity/DevelopabilityΔ

### 

****: 

****:
- **Δ Immunogenicity < 0**
- **Δ Developability ≥ 0**

****: `_check_developability_immunogenicity_delta`

### 2.1 Developability

****:
- ：A > B > C
- ：0.1

****:
- Developability（BC）

****:
- Developability>0.1

****:
```
"Developability：BC。developability，。"
```

### 2.2 Immunogenicity

****:
- ：low < medium < high

****:
- Immunogenicity（lowmediumhigh）

****:
- Immunogenicityhigh

****:
```
"Immunogenicity：lowhigh。immunogenicity，。"
```

---

## 3：FRQA

### 

****: ，identity

****: `_check_fr_selection_strategy`

#### 3.1 VHH Hallmark

****:
- VHH≥2hallmark，≥2
- top-1FR2VHH hallmark → fail

****:
- VHH≥2hallmark，<2

****:
```
"VHH3VHH hallmark，1（≥2）。FR2，VHH hallmark。VHH hallmark。"
```

#### 3.2 FR IdentityCDR

****:
- FR identity（>0.85），CDR（<0.7），FR2/FR3CDR

****:
- FR identity > 0.85  CDR < 0.7

****:
```
"FR identity（95.0%），CDR（0.65），FR2/FR3CDR。。"
```

---

## 4：CDR GraftingIMGT

### 

****: CDR graftingIMGT，

****: `_check_imgt_coordinate_consistency`

#### 4.1 FR1（CDR1）

****:
- FR1IMGT26
- ：26aa（IMGT 1-26）

****:
- FR1>2aa

****:
```
"FR1：=24aa，=24aa，26aa（IMGT 1-26）。CDR1（IMGT 27）。"
```

#### 4.2 FR2（CDR2）

****:
- FR2IMGT55
- ：17aa（IMGT 39-55）

****:
- FR2>2aa

****:
```
"FR2：=15aa，=15aa，17aa（IMGT 39-55）。CDR2（IMGT 56）。"
```

#### 4.3 FR3（CDR3Anchor）

****:
- FR3IMGT104
- ：39aa（IMGT 66-104）
- CDR3 anchor residues（IMGT 95-102）

****:
- FR3>3aa

****:
```
"FR3：=35aa，=35aa，39aa（IMGT 66-104）。CDR3（IMGT 105）CDR3 anchor residues（IMGT 95-102），。"
```

---

## 

### 

#### `_get_aa_at_imgt_position(regions, imgt_pos)`

IMGTregions。

****:
- `regions`: 
- `imgt_pos`: IMGT（1-based）

****: ，None

### 

```python
# IMGT
IMGT_REGIONS = {
    "FR1": {"start": 1, "end": 26},
    "CDR1": {"start": 27, "end": 38},
    "FR2": {"start": 39, "end": 55},
    "CDR2": {"start": 56, "end": 65},
    "FR3": {"start": 66, "end": 104},
    "CDR3": {"start": 105, "end": 117},
    "FR4": {"start": 118, "end": 128},
}

# VHH hallmark
VHH_HALLMARK_POSITIONS = {
    37: {"region": "FR2", "typical_vhh": ["F", "Y", "V"], "typical_human": ["V", "I", "L"]},
    44: {"region": "FR2", "typical_vhh": ["E", "Q", "D"], "typical_human": ["G"]},
    45: {"region": "FR2", "typical_vhh": ["R", "K"], "typical_human": ["L"]},
    47: {"region": "FR2", "typical_vhh": ["W"], "typical_human": ["W"]},  # 
}

# CDR3 anchor residuesFR3
CDR3_ANCHOR_RANGE = (95, 102)  # IMGT
```

---

## 

 `validate_vhh_humanization_result` ，：

```python
# === QA ===

# === 1：FR/CDR（semantic-level QA） ===
_check_vhh_hallmark_preservation(orig_regions, hum_regions, errors, warnings)
_check_cdr_canonical_compatibility(result, errors, warnings)
_check_cdr3_anchor_residues(orig_regions, hum_regions, errors, warnings)

# === 2：immunogenicity/developabilityΔ ===
_check_developability_immunogenicity_delta(result, errors, warnings)

# === 3：FRQA ===
_check_fr_selection_strategy(result, errors, warnings)

# === 4：CDR graftingIMGT ===
_check_imgt_coordinate_consistency(orig_regions, hum_regions, errors, warnings)
```

---

## 

，：

1. ****: <50aa，，
2. ****: （FR2>=10aa, FR3>=20aa）
3. ****: VHH（≥2hallmark），

---

## 

：

```
============================= test session starts =============================
collected 12 items

✅  (12/12)
============================= 12 passed in 2.88s ==============================
```

---

## 

### 1：

****: 
- ✅ VHH hallmarkFR2
- ✅ CDRCDR
- ✅ CDR3 anchor

### 2：

****:
- ✅ Developability
- ✅ Immunogenicity

### 3：

****:
- ✅ Hallmark
- ✅ FR identityCDR

### 4：IMGTQAOK

****:
- ✅ FR1/FR2/FR3
- ✅ CDR3 anchor

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
    "best_match": {
        "developability": {"grade": "B", "score": 0.75},
        "immunogenicity": {"fr_immuno_risk": "low"},
        "scoring": {"framework_identity": 0.9},
        "cdr_compatibility": {"compatibility_score": 0.85}
    },
    "original_developability": {"grade": "A", "score": 0.85},
    "original_immunogenicity": {"fr_immuno_risk": "low"},
    ...
}

qa_result = validate_vhh_humanization_result(result, strict=True)

if not qa_result["ok"]:
    print("QA:")
    for error in qa_result["errors"]:
        print(f"  ❌ {error}")

if qa_result["warnings"]:
    print("QA:")
    for warning in qa_result["warnings"]:
        print(f"  ⚠️ {warning}")
```

---

## 

4QA，：

1. ✅ ****: VHH hallmark、CDR、CDR3 anchor
2. ✅ ****: Developability、Immunogenicity
3. ✅ ****: identity，hallmark
4. ✅ ****: IMGT，

****: ✅ 

---

****: 1.0  
****: 20251210

















