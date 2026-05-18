# VHH

## 

VHH，"、、、"。

## 、

### 1. CDR

****：
- 0.7
- fallback

****：
- ****（`hard_min_cdr_score = 0.3`）：（CDR3）
- ****（`soft_min_cdr_score = 0.5`）：，backup
- **Fallback**：primary，backup，`cdr_compatibility_fallback = True`

****：
```python
# primarybackup
primary = [t for t in candidates if t["cdr_compatibility"]["score"] >= soft_min]
backup = [t for t in candidates if t["cdr_compatibility"]["score"] < soft_min]

if not primary:
    # fallback：backup，
    primary = backup
    quality_flags["cdr_compatibility_fallback"] = True
```

****：
- VHH"+"
- VHH`cdr_compatibility_fallback`，

### 2. 

****：
- ：`0.6 * structure_match_score + 0.4 * dev_score`
- `structure_match_score = framework_identity × cdr_compatibility_score × key_position_score`
- 

****：
- ****：`combined_score = 0.5 * framework_identity + 0.25 * cdr_compatibility_score + 0.25 * dev_score`
- **Fallback**：
  - fallback：`combined_score *= 0.8`
  - fallback：`combined_score *= 0.9`
- ****：

****：
```json
{
  "scoring": {
    "framework_identity": 0.91,
    "cdr_compatibility_score": 0.78,
    "key_position_score": 0.95,
    "developability_score": 0.83,
    "fallback_penalty_factor": 1.0,
    "combined_score": 0.71
  }
}
```

****：
- 
- 
- 

### 3. CDR3

****：
- CDR3 >= 20
- CDR3Cys >= 3

****：
- `top_k >= 10`
- `cdr_compatibility_score >= 0.4`primary
- 

****：
```json
{
  "risk_flags": {
    "long_cdr3": true,
    "noncanonical_disulfide_suspected": true
  }
}
```

****：
- 
- 

## 、Developability / 

### 1. 

****：

|  |  |  |
|------|------|------|
| **A** | `dev_score >= 0.8` liabilities | ， |
| **B** | `0.6 <= dev_score < 0.8`  | ， |
| **C** | `dev_score < 0.6` ≥2 | ， |

****：
```python
def grade_developability(score: float, liabilities: List[Dict[str, Any]]) -> str:
    high_risk_count = sum(1 for liab in liabilities 
                          if liab.get('risk') == 'high' 
                          and liab.get('type') in ['deamidation', 'isomerization', 'oxidation'])
    
    if score >= 0.8 and high_risk_count == 0:
        return 'A'
    if score < 0.6 or high_risk_count >= 2:
        return 'C'
    return 'B'
```

**JSON**：
```json
{
  "developability": {
    "score": 0.83,
    "grade": "A",
    "liabilities": [...],
    "notes": "Mild oxidation risk at FR3-M98"
  }
}
```

****：
- A
- B/C，"Developability risk: medium/high"

### 2. FR

****：
- CDRcase by case
- FR

****：
- Human VHH-SAFE`framework_full`HLA hotspot
- HLA-IImotif：
  - （DERK3+）
  - （FWY2+）
  - HLA-IImotif

****：
```json
{
  "immunogenicity": {
    "fr_hotspot_count": 2,
    "fr_immuno_risk": "low",  // 'low', 'medium', 'high'
    "hotspots": [
      {
        "position": 45,
        "motif": "DER",
        "type": "charged_cluster",
        "risk": "medium"
      }
    ],
    "recommendation": "FR，"
  }
}
```

****：
- **low**: 
- **medium**: 13+
- **high**: 2+5+

****：
- `fr_immuno_risk=low`
- medium/high，"FR"

### 3. 

****：
- 

****：
- ：
  1. Developability（A > B > C）
  2. FR（low > medium > high）
  3. 

****：
```python
def sort_key(item):
    combined = calculate_combined_score(item)
    dev_grade = template.get('developability', {}).get('grade', 'C')
    fr_immuno_risk = template.get('immunogenicity', {}).get('fr_immuno_risk', 'low')
    
    grade_priority = {'A': 3, 'B': 2, 'C': 1}.get(dev_grade, 1)
    immuno_priority = {'low': 3, 'medium': 2, 'high': 1}.get(fr_immuno_risk, 1)
    
    return (grade_priority, immuno_priority, combined)
```

## 、

### 

**quality_flags**：
```json
{
  "quality_flags": {
    "cdr_compatibility_fallback": false,
    "extreme_cdr3_mode": false,
    "developability_risk": "low",
    "fr_immuno_risk": "low"
  }
}
```

**best_match**：
```json
{
  "developability": {
    "score": 0.83,
    "grade": "A",
    "risk": "low",
    "notes": []
  },
  "immunogenicity": {
    "fr_immuno_risk": "low",
    "fr_hotspot_count": 2,
    "notes": []
  },
  "scoring": {
    "framework_identity": 0.91,
    "cdr_compatibility_score": 0.78,
    "developability_score": 0.83,
    "combined_score": 0.71
  }
}
```

## 、

### 

```bash
python scripts/score_vhh_safe_templates.py
```

****：
- `human_vh3_vhh_safe_templates.json`，：
  - `developability.grade`（A/B/C）
  - `immunogenicity`

### 

```python
from core.vhh_humanization import humanize_vhh

result = humanize_vhh(
    seq="VHH_SEQUENCE",
    panel="A",
    top_k=3
)

# 
print("Developability:", result['best_match']['developability']['grade'])
print("FR:", result['best_match']['immunogenicity']['fr_immuno_risk'])
print(":", result['quality_flags'])
```

## 、

### 1. 
- CDR，
- Fallback，
- CDR3，

### 2. 
- ，
- （++）
- FR

### 3. 
- 
- ，
- 

### 4. 
- 
- 
- 

## 、

1. **CDR**（case by case，HLA）
2. ****
3. ****（AlphaFold2，）
4. ****


















