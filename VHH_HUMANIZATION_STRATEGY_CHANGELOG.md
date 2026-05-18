# VHH

****: v2.2.0  
****: 2025-01-20  
****: 

---

## 

 **"CDR"**  **"FR + CDR"** 。

---

## 

### 1. 

#### （v2.1.0）
- ❌ CDR < 0.7 ****
- ❌ Unknown CDRFR
- ❌ "FRCDR"

#### （v2.2.0）
- ✅ **FR**（CDR）
- ✅ Unknown CDR****，warning
- ✅ CDR****，
- ✅ FR

### 2. 

#### 
```
combined_score = 0.5 × FR Identity 
               + 0.25 × CDR Compatibility 
               + 0.25 × Developability
```

#### （FR）
```
combined_score = 0.6 × FR Identity      
               + 0.15 × CDR Compatibility 
               + 0.25 × Developability
```

### 3. 

#### 3.1 `core/vhh_humanization.py`

****:
```python
# （0.7）
if compatibility['compatibility_score'] < 0.7:
    continue  # ，
```

****:
```python
# FR：CDR，
cdr_compatibility_score = compatibility['compatibility_score']
# ，Unknown CDR
```

#### 3.2 `config.yaml`

****:
```yaml
scoring_weights:
  framework_identity: 0.5
  cdr_compatibility: 0.25
  developability: 0.25
```

****:
```yaml
scoring_weights:
  framework_identity: 0.6  # FR
  cdr_compatibility: 0.15   # CDR
  developability: 0.25
```

### 4. 

- ✅  `docs/VHH_HUMANIZATION_FR_PRIORITY_STRATEGY.md` - 
- ✅ ，FR
- ✅ /

---

## 

### 

1. ****: EGFR VHHFRCDR
2. ****: FR，
3. ****: Unknown CDRFR

### 

1. **CDR**: Unknown CDR，warning
2. ****: Unknown CDR，

---

## 

### 

- ✅ `scoring_weights`，
- ✅ 

### API

- ✅ `humanize_vhh`
- ✅ ，`quality_flags['cdr_warnings']`

### 

- ✅ 
- ✅ 

---

## 

### 

1. ****: `config.yaml`
2. ****: 
3. **CDR**: `cdr_warnings`

### 

1. ****: 
2. **CDR**: CDR
3. ****: CDR，

---

## 

### EGFR VHH

- ****: CDR0.00，
- ****: ✅ 5，FR identity 88.8%

### 

- ✅ VHH：
- ✅ Unknown CDR：，warning
- ✅ CDR3：，warning

---

## 

- **v2.2.0** (2025-01-20): FR
- **v2.1.0** : CDR

---

****:   
****: VHH


















