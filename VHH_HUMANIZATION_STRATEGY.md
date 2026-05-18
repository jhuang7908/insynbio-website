# VHH

## 🎯 

### 1. CDR ✅
- ，VHHCDRHuman
- CDR（：0.7）
- VHHCDR

### 2.  ✅
- CDR：
  - **FR1-26**: CDR1
  - **FR2-55**: CDR2
  - **FR3-104**: CDR3
- VHHHuman
- 

### 3.  ✅
- ****: ` = framework_identity × cdr_compatibility_score × key_position_score`
- 、CDR
- ，

****:
```
: 3
  1. HUMAN_VH3_SCF_03_SAFE_A:
     identity: 55.0% | CDR: 95.0% | : 100.0%
     : 0.522
```

## ： + CDR + 

### 

```
VHH
    ↓
1. IMGT（FRCDR）
    ↓
2. （scaffoldidentity）
    ↓
3. CDR（CDR1/CDR2/CDR3）
    ↓
4. Human（identity）
    ↓
5. CDR（，）
    ↓
6. CDR（VHHCDRHuman）
    ↓

```

### 

1. ****：
   - FR1/FR2/FR3identity
   - identity

2. **CDR**：
   - ✅ ：CDR
   - ✅ ：
   - ✅ ****：（<0.7）

3. ****：
   - CDR
   - VHH（CDR3、）
   - 
   - ✅ ****：（FR1-26, FR2-55, FR3-104）

4. ****：
   - ✅ ****：identity、CDR、
   - ，

## 

### （IgG）

```
1. CDR
    ↓
2. CDR
    ↓
3. identity
    ↓
4. CDR
```

****：
- ：**CDR** →  → 
- VHH：**** →  → CDR

## ？

### 1. VHH

- ****：VHHCDR
- **CDR3**：VHHCDR3（2-35aa），
- ****：VHH，

### 2. 

- identity → （FR1-26, FR2-55）
-  → CDR
- 

### 3. 

- CDR
- 
- 

## 

1. ****：，
2. ****：CDR
3. ****：

## 

1. ****：
   - 
   - 

2. ****：
   - 
   - 

3. ****：
   - 
   - 

## 

### 

1. ****
   ```python
   # select_human_templates
   # 
   compatible_templates = [
       t for t in candidates
       if t['cdr_compatibility']['compatibility_score'] > threshold
   ]
   ```

2. ****
   ```python
   #  = framework_identity × cdr_compatibility_score
   combined_score = (
       framework_identity * 
       cdr_compatibility_score
   )
   ```

### 

1. **-**
   - HumanCDR
   - 

2. ****
   - FR126、FR255
   - CDR

3. ****
   - AlphaFold2
   - CDR

## 

### VHH（CDR）

- ✅ 
- ✅ 

### VHH（CDR3、）

1. ****
   ```python
   result = humanize_vhh(seq, panel='A', top_k=10, return_all_templates=True)
   ```

2. ****
   ```python
   for cand in result['candidates']:
       if cand.get('cdr_compatibility', {}).get('warnings'):
           print(f"{cand['template_id']}: {cand['cdr_compatibility']['warnings']}")
   ```

3. ****
   - 
   - identityCDR

## 

### 

- ✅ **CDR**：
- ✅ ****：
- ⚠️ ****：

### 

|  |  | VHH |
|------|---------|------------|
| CDR | ✅  | ✅  |
|  | ✅  | ✅ **** |
|  | ⚠️  | ✅  |
|  | ✅  | ✅  |
|  | ✅  | ✅ **** |
|  | ✅  | ✅ **** |

### 

1. **VHH**： + CDR + 
2. ****：identity、CDR、
3. **CDR**：CDR

