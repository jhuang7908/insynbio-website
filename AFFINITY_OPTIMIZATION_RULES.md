# VHH： vs Case by Case

## 

**case by case，？**

**：**

- ****：VHH
- **Case by case**：

## 、（，）

### 1. （100%）

**VHH**，：

#### 1：FR1-26
- ****：IMGT position 26
- ****：（CDR1）
- ****：，，
- ****：VHH

#### 2：FR2-55
- ****：IMGT position 55
- ****：（CDR2）
- ****：，
- ****：VHH

#### 3：FR3-104
- ****：IMGT position 104
- ****：（CDR3）
- ****：，
- ****：VHH

#### 4：Vernier Zone
- ****：27, 29, 30, 48, 49, 71, 73, 78, 94
- ****：（CDR）
- ****：，
- ****：VHH

### 2. CDR（，）

****，CDR：

#### 1：
- ****：CDRAILMFWYV
- ****：
- ****：
  - A → V, L, I
  - F → Y, W, L
  - W → F, Y
- ****：VHHCDR

#### 2：
- ****：CDRDERK
- ****：
- ****：
  - D ↔ E
  - K ↔ R
- ****：VHHCDR

#### 3：
- ****：CDRFWY
- ****：
- ****：
  - F ↔ Y, W
  - Y ↔ F, W
- ****：VHHCDR

### 3. 

IMGT：

```python
POSITION_SPECIFIC_RULES = {
    26: {"importance": "high", "role": "CDR1", "restore_if_changed": True},
    37: {"importance": "high", "role": "VHH hallmark", "restore_if_changed": True},
    44: {"importance": "high", "role": "VHH hallmark", "restore_if_changed": True},
    45: {"importance": "high", "role": "VHH hallmark", "restore_if_changed": True},
    47: {"importance": "high", "role": "VHH hallmark", "restore_if_changed": True},
    55: {"importance": "high", "role": "CDR2", "restore_if_changed": True},
    104: {"importance": "medium", "role": "CDR3", "restore_if_changed": True},
    # ... Vernier zone
}
```

**，VHH。**

## 、Case by Case

### 1. CDR3

CDR3，case by case：
- ****：2-35aa
- ****：
- ****：VHHCDR3

### 2. 

，：
- 
- 

### 3. -CDR

-CDR：
- ，

## 、

### ：`identify_optimization_sites`

```python
def identify_optimization_sites(
    vhh_imgt_map: Dict[int, str],
    humanized_imgt_map: Dict[int, str],
    framework_identity: float,
) -> Dict[str, List[Dict[str, Any]]]:
    """
    
    
    、，VHH
    """
    # 1. （26, 55, 104）
    # 2. Vernier zone
    # 3. CDR
    # 4. 
    # ：、CDR、Vernier zone
```

### 

```python
from core.affinity_optimization_rules import identify_optimization_sites
from core.numbering.imgt_anarcii import imgt_number_anarcii, build_pos_to_aa_map

# 1. IMGT
vhh_rows = imgt_number_anarcii(vhh_seq)
vhh_map = build_pos_to_aa_map(vhh_rows)

humanized_rows = imgt_number_anarcii(humanized_seq)
humanized_map = build_pos_to_aa_map(humanized_rows)

# 2. 
sites = identify_optimization_sites(vhh_map, humanized_map, framework_identity)

# 3. ：
# - framework_restoration: 
# - cdr_optimization: CDR
# - vernier_zone: Vernier zone
```

## 、

### 

|  |  |  |
|---------|--------|-----------|
| **** | 100% | ✅  |
| **** | 100% | ✅  |
| **CDR** | 90% | ✅  |
| **Vernier zone** | 80% | ✅  |

### Case by Case

|  |  |  |
|---------|--------|-----------|
| **CDR3** | 50% | ⚠️  |
| **** | 10% | ❌  |
| **-CDR** | 20% | ⚠️  |

## 、

### 

```
1. （identify_optimization_sites）
   ↓
2. （generate_systematic_mutation_suggestions）
   ↓
3. Case by case
   ├─ CDR3
   ├─ 
   └─ 
   ↓
4. 
   ↓
5. 
```

### 

1. ****：VHH
2. ****：，
3. ****：
4. ****：case by case

## 、

### 

```python
#  core/affinity_optimization_rules.py 

NEW_RULE = OptimizationRule(
    rule_id="NEW_RULE_ID",
    rule_name="",
    description="",
    applicable_regions=["CDR1", "CDR2"],
    priority="medium",
    confidence="high",
)
```

### 

- 
- 
- 

## 

**：，**

1. ****：100%，
2. ****：100%，
3. **CDR**：90%，
4. **Case by case**：CDR3

**Python，。**


















