# VHH：

## 

** vs **

- **Phage Display**：（10⁹-10¹²），""
- **Yeast Display**：，

****，、。

## ？

### 1. 

|  |  |  |  |
|------|--------|---------|--------|
| **Phage Display** | 10⁹-10¹² |  | <0.1% |
| **Yeast Display** | 10-50 | 1-2 | 10-30% |

### 2. 

- ****：，
- ****：，

### 3. 

- ****：
- ****：

## 

### 1. 

****：，CDR

****：
- **FR1-26**：CDR1，CDR1
- **FR2-55**：CDR2，CDR2
- **FR3-104**：CDR3，CDR3
- **Vernier zone**：27, 29, 30, 48, 49, 71, 73, 78, 94

****：
```python
# identity < 85%，
if framework_identity < 0.85:
    # FR1-26, FR2-55, FR3-104
    # 
    # 
```

### 2. CDR

****：

****：
- ****（AILMFWYV）：
- ****（DERK）：
- ****（FWY）：π-π

****：
```python
# CDR
for residue in cdr_sequence:
    if residue in key_types:
        # 
        alternatives = get_conservative_alternatives(residue)
        # 
```

### 3. 

****：，

****：
1. ****：
2. ****：CDR2-3
3. ****： + CDR（2-3）

****：
- （>3）
- 
- 

## 

### 

```
（10-50）
├─ （3-5）
│  ├─ （FR1-26, FR2-55, FR3-104）
│  └─ 
├─ CDR（5-15）
│  ├─ CDR1
│  ├─ CDR2
│  ├─ CDR3
│  └─ （2）
└─ （2-3）
   └─  + CDR
```

### 

1. ****：（FR1-26, FR2-55）
2. ****：CDR1/CDR2，FR3-104
3. ****：CDR3，

## 

### 

```bash
python scripts/generate_affinity_optimization_suggestions.py \
    --sequence "QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVITADSGSTTYADSVKGRFTISRDDARNTVYLQMNSLKPEDTAVYYCAAGGVGWPYFDYWGQGTQVTVSS" \
    --panel A \
    --yeast-library \
    --max-mutations 3
```

### 

```json
{
  "mutation_suggestions": {
    "strategy": "targeted",
    "mutations": [
      {
        "position": 26,
        "from": "S",
        "to": "A",
        "region": "FR1",
        "rationale": "FR1-26，CDR",
        "priority": "high",
        "expected_impact": "positive"
      }
    ],
    "hotspots": [...],
    "summary": {
      "total_mutations": 8,
      "high_priority": 2,
      "medium_priority": 6
    }
  },
  "yeast_display_library": {
    "library_size": 10,
    "variants": [
      {
        "variant_id": "framework_26_StoA",
        "sequence": "...",
        "mutations": [...],
        "priority": "high",
        "rationale": "：..."
      }
    ]
  }
}
```

## 

### 

```
1. 
   ↓
2. 
   ├─ 
   ├─ CDR
   └─ 
   ↓
3. （10-50）
   ↓
4. 
   ├─ 
   └─ 
   ↓
5. 
   ├─ 
   └─ 
   ↓
6. 
   ↓
7. （SPR/BLI）
```

### Phage Display

|  | Phage Display | Yeast Display |
|------|--------------|---------------------|
| **** | 10⁹-10¹² | 10-50 |
| **** |  |  |
| **** | <0.1% | 10-30% |
| **** |  | 1-2 |
| **** |  |  |
| **** |  |  |
| **** | （""） |  |

## 

1. ****：，
2. ****：，
3. ****：
4. ****：，
5. ****：、、

## 

1. ****：≤3
2. ****：
3. ****： → ，
4. ****：

## 

1. ****：AlphaFold2，
2. ****：
3. ****：，
4. ****：，


















