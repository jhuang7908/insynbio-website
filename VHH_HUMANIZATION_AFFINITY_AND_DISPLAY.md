# VHHDisplay

## 、

### 1. ？

VHH，**（Binding Affinity）**，：

#### 1.1 -CDR

```
VHH: [] + [CDR] → 
:  [Human] + [CDR] → ？
```

****：
- **CDR**：（FR1-26, FR2-55, FR3-104）CDR
- **/**：Human/，CDR
- ****：

#### 1.2 CDR

CDR，：
- ****：，3D
- ****：HumanVHHCDR
- **CDR3**：VHHCDR3，

#### 1.3 

：
- ****：10-100
- ****：
- ****：，

### 2. 

#### 2.1 

****：

1. ****：
   - identity → CDR → 
   - **，**

2. **CDR**：
   - CDR
   - （FR1-26, FR2-55, FR3-104）
   - ****，****

3. **Developability**：
   - CMC
   - 

#### 2.2 

****，：

1. ****：
   - 3D
   - CDR

2. ****：
   - " → "
   - 

3. ****：
   - 3D
   - 

### 3. 

#### 3.1 

```python
# 
def predict_affinity_impact(vhh_seq, humanized_seq):
    # 1. （AlphaFold2）
    vhh_structure = alphafold2.predict(vhh_seq)
    humanized_structure = alphafold2.predict(humanized_seq)
    
    # 2. CDR
    cdr_rmsd = compare_cdr_conformation(vhh_structure, humanized_structure)
    
    # 3. 
    affinity_impact = predict_from_structure(cdr_rmsd)
    
    return affinity_impact
```

#### 3.2 

：
- ：VHH、、
- ：（fold change）

#### 3.3 

```python
# 
combined_score = (
    0.4 * structure_match_score + 
    0.3 * developability_score +
    0.3 * predicted_affinity_score  # 
)
```

## 、VHHDisplay？

### 1. Display

#### 1.1 

****：，，？

****：Display（/）：
- ****：
- ****：ELISA
- ****：

#### 1.2 

，：

```
VHH: KD = 1 nM
: KD = 10-100 nM (10-100)
```

**Display**：
- ****：，
- ****：
- ****：，

#### 1.3 

|  |  |  |  |
|------|------|-----|------|
| **Display** | 1-2 |  | （10³-10⁶） |
| **** | 2-3 |  | （<10） |

### 2.  vs 

#### 2.1 （Yeast Display）

****：
- ****：，
- ****：（pH、、）
- ****：
- ****：（KD < 100 nM）

****：
- VHH
- （Affinity Maturation）
- 

#### 2.2 （Phage Display）

****：
- ****：10⁹-10¹²
- ****：，
- ****：
- ****：，

****：
- 
- （panning）
- （Epitope Mapping）

### 3. 

#### 3.1 

```
1. 
   ↓
2. Display（/）
   ├─ 
   ├─ 
   └─ 
   ↓
3. 
   ├─ 
   ├─ 
   └─ 
   ↓
4. 
   ├─ 
   └─ 
   ↓
5. 
   ├─ SPR/BLI
   ├─ 
   └─ 
```

#### 3.2 Display？

****：
1. ****：2-3
2. ****：，
3. ****：，

**Display**：
1. ****：
2. ****：
3. ****：，

### 4. 

#### 4.1 1：VHH

```
VHH: KD = 2.5 nM
1: KD = 250 nM (100)
2: KD = 50 nM (20)
3: KD = 5 nM (2) ✓ 

→ Display，3
→ ，KD = 3 nM 
```

#### 4.2 2：Display

```
: KD = 100 nM (40)
↓
（CDR3）
↓
（3）
↓
: KD = 8 nM (80%)
```

## 、

### 1. 

```python
result['warnings'] = [
    "⚠️ ：，Display",
    "⚠️ CDR1：",
    "⚠️ ：3"
]
```

### 2. 

，：

```python
def assess_affinity_risk(vhh_seq, human_template):
    risk_factors = []
    
    # 1. identity → 
    if framework_identity < 0.7:
        risk_factors.append("identity，")
    
    # 2. CDR → 
    if cdr_canonical['CDR1']['canonical_class'] == 'non_canonical':
        risk_factors.append("CDR1，")
    
    # 3.  → 
    if key_position_score < 0.9:
        risk_factors.append("，CDR")
    
    return {
        'risk_level': 'high' if len(risk_factors) >= 2 else 'medium',
        'risk_factors': risk_factors,
        'recommendation': 'Display'
    }
```

### 3. 

：
- ****
- ****（Display）
- 

## 、

### 

1. ****（10-100）
2. ****
3. ****（Display）

### Display

1. ****：
2. ****：，
3. ****：，、、

### 

```
 → Display →  →  → 
```

****：，Display****，。


















