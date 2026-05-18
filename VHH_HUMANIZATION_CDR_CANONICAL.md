# VHHCDR

## 

### ✅ 

1. **CDR** (`core/cdr_canonical.py`)
   - CDR
   - CDR1/CDR2/CDR3
   - VHH（CDR3、）

2. ****
   - CDR
   - （CDR3）

3. ****
   - CDR
   - CDR

### ⚠️ ：

****：
```
1. （FR1/FR2/FR3 identity）
   ↓
2. CDR
   ↓
3. 
   ↓
4. CDR
```

****：
- ✅ （identity）
- ✅ CDR
- ⚠️ **CDR**

## 

### 

（IgG），：

1. **CDR**
   - CDR
   - Chothia/IMGT

2. ****
   - CDR
   - （FR1-26, FR2-55）

3. **CDR**
   - CDR
   - CDR

4. ****
   - 
   - 

### ？

- ****：CDR，
- ****：
- ****：

## 

### ？

1. **VHH**
   - VHHCDR3
   - 
   - 

2. ****
   - identity
   - （FR1-26, FR2-55）

3. ****
   - CDR
   - 
   - 

### 

1. ****
   - identity
   - 

2. ****
   - 
   - 

3. ****
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
       if t['cdr_compatibility']['compatibility_score'] > 0.7
   ]
   ```

2. ****
   ```python
   #  = framework_identity × cdr_compatibility_score
   combined_score = (
       alignment_scores['framework_identity'] * 
       cdr_compatibility['compatibility_score']
   )
   ```

3. ****
   - FR126、FR255
   - CDR

### 

1. ****
   - CDR
   - 

2. ****
   - AlphaFold2
   - CDR

3. ****
   - 
   - 

## 

### 

```python
from core.vhh_humanization import humanize_vhh

result = humanize_vhh(vhh_seq, panel='A', top_k=5)

# CDR
if result['success']:
    # CDR
    for cdr_name, canonical_info in result['cdr_canonical'].items:
        print(f"{cdr_name}: {canonical_info['canonical_class']}")
    
    # 
    best = result['best_match']
    if 'cdr_compatibility' in result['candidates'][0]:
        compat = result['candidates'][0]['cdr_compatibility']
        if compat['warnings']:
            print(":", compat['warnings'])
    
    # ，
    for cand in result['candidates']:
        if 'cdr_compatibility' in cand:
            score = cand['cdr_compatibility']['compatibility_score']
            if score < 0.8:
                print(f": {cand['template_id']}  ({score:.1%})")
```

### 

CDR（CDR3），：

1. ****
   ```python
   result = humanize_vhh(vhh_seq, panel='A', top_k=10, return_all_templates=True)
   ```

2. ****
   ```python
   sorted_candidates = sorted(
       result['candidates'],
       key=lambda x: x.get('cdr_compatibility', {}).get('compatibility_score', 0),
       reverse=True
   )
   ```

3. ****
   - identity
   - CDR
   - VHH hallmark

## 

### 

- ✅ **CDR**：CDR
- ⚠️ ****：，CDR
- ✅ ****：CDR

### 

|  |  | VHH |
|------|--------------|--------------|
| CDR | ✅  | ✅  |
|  | ✅  | ⚠️  |
|  | ✅  | ⚠️  |
|  | ✅  | ⚠️  |

### 

1. ****：VHH
2. **CDR**：CDR，
3. ****：


















