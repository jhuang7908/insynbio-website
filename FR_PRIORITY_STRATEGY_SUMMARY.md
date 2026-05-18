# FR

****: 2025-01-20  
****: v2.2.0  
****: ✅ 

---

## 、

### 

> **VHH = FR，CDRdevelopability""，CDR。**

### 

1. **Stage 1: FR**
   - VHH scaffold → human VH3 VHH-SAFE
   - FR1+FR2+FR3 identity、FR2 hallmark
   - ：EGFR VHH，scaffold identity88.8%

2. **Stage 2: FRCDR**
   - CDR**/**，""
   - Unknown CDR，****，warning
   - CDR，****，

3. **Stage 3: FR + CDR，CMC/developability**
   - Developability scoreCDR""

---

## 、

### 2.1 

#### ：`select_human_templates`

****:
```python
# ：CDR < 0.7 
if compatibility['compatibility_score'] < 0.7:
    continue  # 
```

****:
```python
# FR：FR
cdr_compatibility_score = compatibility['compatibility_score']
# ，CDR
```

#### 

****:
```
combined_score = 0.5 × FR Identity 
               + 0.25 × CDR Compatibility 
               + 0.25 × Developability
```

****:
```
combined_score = 0.6 × FR Identity      
               + 0.15 × CDR Compatibility 
               + 0.25 × Developability
```

### 2.2 

**`config.yaml`**:
```yaml
parameters:
  scoring:
    active_profile: "default"
    profiles:
      default:
        framework_identity: 0.6  # 
        cdr_compatibility: 0.15  # 
        developability: 0.25
```

### 2.3 

- ✅ `quality_flags['cdr_warnings']`: CDR
- ✅ Unknown CDR
- ✅ FR

---

## 、

### EGFR VHH

****:
- ❌ ：CDR0.00，
- ❌ 

****:
- ✅ ：5
- ✅ FR identity: 80%
- ✅ : 0.688
- ✅ CDR

### 

- ✅ VHH：
- ✅ Unknown CDR：，warning
- ✅ CDR3：，warning
- ✅ FR：

---

## 、

### 

1. **`docs/VHH_HUMANIZATION_FR_PRIORITY_STRATEGY.md`**
   - 
   - 
   - 、、

2. **`docs/VHH_HUMANIZATION_STRATEGY_CHANGELOG.md`**
   - 
   - 
   - 

3. **`docs/FR_PRIORITY_STRATEGY_SUMMARY.md`** 
   - 

### 

- ✅ ：FR
- ✅ ：FR

---

## 、

### 

- ****: `scripts/generate_egfr_cro_report.py`
- ****: `projects/EGFR_7D12_VHH/cro_report/EGFR_VHH_Humanization_CRO_Report_*.html`
- ****: FR、CDR

### 

- ****: `scripts/generate_egfr_cro_report_cn.py`
- ****: `projects/EGFR_7D12_VHH/cro_report/EGFR_VHHCRO_*.html`
- ****: ，CRO

---

## 、/

### 

> "VHH'FR + CDR'：
> 
> ****：VHHFR（identity > 85%），。
> 
> ****：FR，CDR。CDR，，。
> 
> ****：FRCDR，developability，CMC。
> 
> CDR，FR，CDR。"

### 

> "FR：
> - FR identity0.6
> - CDR0.15
> - CDR，FR
> - Unknown CDR，warning
> - EGFR VHHFR（88.8%）CDR"

---

## 、

### 

- **EGFR VHH**:  → （5）
- **FR**: 100%（CDR）

### 

- **FR Identity**: 0.6（，0.1）
- **CDR Compatibility**: 0.15（，0.1）
- **Developability**: 0.25

### 

- ✅ linter
- ✅ 
- ✅ 

---

## 、

### 

1. ✅ EGFR VHH
2. ✅ 
3. ✅ CDR

### 

1. CDR
2. Unknown CDR
3. developability

### 

1. 
2. CDR
3. 

---

****: 2025-01-20  
****: v2.2.0 (FR-Priority Strategy)  
****: ✅ 


















