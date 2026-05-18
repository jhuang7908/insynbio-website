# CDR（Canonical Structure）

## 

，**CDR（Canonical Structure）**。CDRCDR，CDR，。

## CDR？

### 1. 

- **CDR**：（FR126、FR255）CDR
- ****：CDR，：
  - 
  - 
  - 

### 2. 

（IgG），：

1. **CDR**：CDR
2. ****：CDR
3. **CDR**：CDR
4. ****：

## CDR

### CDR1

：

|  |  |  |
|---------|---------|------|
| 8-10aa | canonical_1 | ， |
| 11-12aa | canonical_2 |  |
| 13-15aa | canonical_3 |  |
| <8aa  >15aa | non_canonical |  |

****：
- FR126（CDR1）
- CDR127

### CDR2

：

|  |  |  |
|---------|---------|------|
| 7-9aa | canonical_1 |  |
| 10-12aa | canonical_2 |  |
| 13-15aa | canonical_3 |  |
| <7aa  >15aa | non_canonical |  |

****：
- FR255（CDR2）
- CDR256

### CDR3

CDR3，：

|  |  |  |
|---------|---------|------|
| 3-7aa | short | CDR3 |
| 8-12aa | canonical_1 |  |
| 13-18aa | canonical_2 |  |
| 19-25aa | long | CDR3（VHH） |
| 26-35aa | very_long | CDR3（VHH） |

**VHH**：
- VHHCDR3（15-25aa）
- （C...C）
- 

## 

### ：`core/cdr_canonical.py`

：

1. **`classify_cdr_canonical`** - CDR
2. **`classify_all_cdrs`** - CDR
3. **`match_canonical_compatibility`** - CDR

### 

`core/vhh_humanization.py`：

```python
# 1. CDR
vhh_cdrs = {'CDR1': '...', 'CDR2': '...', 'CDR3': '...'}

# 2. CDR
cdr_canonical = classify_all_cdrs(vhh_cdrs)
# : {
#   'CDR1': {'canonical_class': 'canonical_1', 'length': 8, ...},
#   'CDR2': {'canonical_class': 'canonical_1', 'length': 8, ...},
#   'CDR3': {'canonical_class': 'long', 'length': 20, ...}
# }

# 3. 
compatibility = match_canonical_compatibility(cdr_canonical)
# : {
#   'compatibility_score': 0.9,
#   'warnings': ['CDR3(20aa)，']
# }
```

## 

### 

1. ****：FR1/FR2/FR3identityHuman
2. **CDR**：CDR
3. ****：CDR，

### （CDR）

：

1. **CDR**：
   - VHHCDR
   - Human
   - identity

2. ****：
   - CDR
   -  = framework_identity × cdr_compatibility_score

3. ****：
   - FR126、FR255
   - CDR

## 

```python
from core.cdr_canonical import classify_all_cdrs, match_canonical_compatibility

# VHHCDR
cdrs = {
    'CDR1': 'GYTFTSYY',      # 8aa
    'CDR2': 'IDPEDGGT',      # 8aa
    'CDR3': 'VR'              # 2aa
}

# 
canonical = classify_all_cdrs(cdrs)
print(f"CDR1: {canonical['CDR1']['canonical_class']}")
print(f"CDR2: {canonical['CDR2']['canonical_class']}")
print(f"CDR3: {canonical['CDR3']['canonical_class']}")

# 
compatibility = match_canonical_compatibility(canonical)
print(f": {compatibility['compatibility_score']}")
if compatibility['warnings']:
    for warning in compatibility['warnings']:
        print(f": {warning}")
```

## 

1. **VHH**：
   - VHHCDR3，
   - CDR3

2. ****：
   - 
   - 
   - 

3. ****：
   - 
   - 

## 

- **CDR**: `core/cdr_canonical.py`
- ****: `core/vhh_humanization.py`
- **Scaffold**: `core/vhh_scaffolds/03_engineered/nvhh_h1.json`

## 

1. ****：
   - （FR1-26, FR2-55）
   - Chothia/IMGT

2. **-**：
   - HumanCDR
   - 

3. ****：
   - AlphaFold2
   - CDR


















