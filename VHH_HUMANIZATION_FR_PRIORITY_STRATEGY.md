# VHH：FR + CDR

****: v2.2.0  
****: 2025-01-20  
****: ，

---

## 、

### 

**VHH = FR，CDRdevelopability""，CDR。**

### 

#### Stage 1: FR

****: VHH scaffold → human VH3 VHH-SAFE，FR1+FR2+FR3 identity、FR2 hallmark。

****:
- `framework_identity`
- FR2 hallmark（37, 44, 45, 47）VHH
- ：EGFR VHH，scaffold identity88.8%，FR

****: FR，CDR1/2"unknown canonical"。

#### Stage 2: FRCDR

****: CDR**/**，""。

****:
- canonical class（Unknown）CDR，****，warning
- （/CDR1/2），****，
- CDR，

****:
- FR identity: **0.6**
- CDR compatibility: **0.15**
- Developability: **0.25**

#### Stage 3: FR + CDR，CMC/developability

****: Developability score（0.29，Grade C），CDR""。

****:
- FRCDR，developability
- CMC
- developability

---

## 、

### 2.1 

```python
# 
def select_human_templates_fr_priority:
    # Stage 1: FR identity
    candidates = sorted_by_framework_identity(all_templates)
    
    # Stage 2: CDR
    for candidate in candidates:
        cdr_score = calculate_cdr_compatibility(candidate)
        # ，Unknown CDR
        
    # Stage 3: （FR0.6，CDR0.15）
    final_score = 0.6 * fr_identity + 0.15 * cdr_score + 0.25 * dev_score
    
    # 
    return sorted_by_final_score(candidates)
```

### 2.2 CDR

#### Unknown CDR

- ****: Unknown CDR
- ****: `quality_flags['cdr_warnings']`
- ****: CDR，

#### CDR

- ****: 
- ****: CDR
- ****: 

### 2.3 

****:
```
combined_score = 0.6 × framework_identity 
               + 0.15 × cdr_compatibility_score 
               + 0.25 × developability_score
```

****:
- `framework_identity` (0.6): FR，
- `cdr_compatibility_score` (0.15): CDR
- `developability_score` (0.25): Developability

****: `config.yaml``scoring.profiles`。

---

## 、

### （CDR）

- ❌ CDR < 0.7 
- ❌ Unknown CDRFR
- ❌ "FRCDR"

### （FR）

- ✅ FR（CDR）
- ✅ Unknown CDR，warning
- ✅ CDR，
- ✅ FR

---

## 、

### 4.1 

```python
from core.vhh_humanization import humanize_vhh

# FR
result = humanize_vhh(
    seq="QVQLVESGGG...",
    panel="all",
    top_k=5
)

# CDR
if result.get('quality_flags', {}).get('cdr_warnings'):
    print("CDR:", result['quality_flags']['cdr_warnings'])
```

### 4.2 

`config.yaml`：

```yaml
parameters:
  scoring:
    active_profile: "fr_priority"
    profiles:
      fr_priority:
        framework_identity: 0.7  # FR
        cdr_compatibility: 0.1    # CDR
        developability: 0.2
```

---

## 、

### 5.1 CDR

，Unknown CDRCDR，：

1. **Risk Assessment**: CDR
2. **CDR Analysis**: Unknown CDR
3. **Recommendations**: 

### 5.2 

- **FR**: FR identityFR2 hallmark
- **CDR**: Unknown CDR，
- **Developability**: FRCDR，

---

## 、/

### 6.1 

> "VHH'FR + CDR'：
> 
> ****：VHHFR（identity > 85%），。
> 
> ****：FR，CDR。CDR，，。
> 
> ****：FRCDR，developability，CMC。
> 
> CDR，FR，CDR。"

### 6.2 

> "FR：
> - FR identity0.6
> - CDR0.15
> - CDR，FR
> - Unknown CDR，warning
> - EGFR VHHFR（88.8%）CDR"

---

## 、

### 7.1 

|  |  |  |
|------|--------|------|
| `framework_identity` | 0.6 | FR |
| `cdr_compatibility` | 0.15 | CDR |
| `developability` | 0.25 | Developability |
| `hard_min_cdr_score` | 0.3 | CDR3CDR |
| `soft_min_cdr_score` | 0.5 | （FR） |

### 7.2 

- `config.yaml`: `parameters.scoring.profiles.default`
- : `VHH_PARAMETERS__SCORING__PROFILES__DEFAULT__FRAMEWORK_IDENTITY`

---

## 、

- **v2.2.0** (2025-01-20): FR
  - CDR
  - （FR 0.6, CDR 0.15, Dev 0.25）
  - Unknown CDR
  - 

- **v2.1.0** : CDR
  - CDR < 0.7 
  - FRCDR

---

## 、

### Q1: Unknown CDR？

**A**: VHHCDR，Unknown CDR。FR，CDR。Unknown CDR，FR。

### Q2: CDR（0.15）？

**A**: FR，。CDR，FR，。

### Q3: CDR？

**A**: `quality_flags['cdr_warnings']`，"Unknown""non_canonical"，。

### Q4: CDR3？

**A**: CDR3（≥20aaCys≥3）`extreme_cdr3_mode`，（top_k≥10），CDR。

---

****: ，。


















