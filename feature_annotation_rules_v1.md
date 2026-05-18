# Feature Annotation Rules v1

## 

（Feature Annotation）（tags），**，、**。

## 

1. **Tagging-only**: ， risk/score/recommendation
2. **Machine-readable**: JSON，
3. ****: （tags）
4. ****: ，

## 

 mapping （dual_map JSON），：

- `variable_domain_sequence`: str - V
- `variable_domain`: dict -  `v_start`, `v_end`, `v_length`  `variable_domain_length`
- `dual_map`: List[Dict] -  `v_length`
- `imgt_numbering`: Dict[str, str] - IMGT
- `kabat_numbering`: Dict[str, str] - Kabat
- `chain_type`: str -  ("H", "K", "L")

## 

```json
{
  "chain": "VH",
  "length": 125,
  "residues": [
    {
      "index": 0,
      "residue": "Q",
      "imgt_position": "1",
      "kabat_position": "1",
      "region": "FR1",
      "tags": ["FR1", "chem_sensitive", "framework_anchor"]
    },
    ...
  ]
}
```

## 

### 1. Region 

 region ：

- `FR1`: IMGT positions 1-26
- `CDR1`: IMGT positions 27-38
- `FR2`: IMGT positions 39-55
- `CDR2`: IMGT positions 56-65
- `FR3`: IMGT positions 66-104
- `CDR3`: IMGT positions 105-117
- `FR4`: IMGT positions 118-128

****:  `imgt_position`  `dual_map` ， `get_region_from_imgt_pos` 。

### 2. Vernier Zone

****: CDR。

**VH positions**: [4, 6, 23, 24, 26, 48, 49, 67, 69, 71, 73, 78, 93]

**VL positions**: [4, 6, 23, 24, 26, 48, 49, 67, 69, 71, 73, 78]

****:  IMGT positions ， `vernier` 。

### 3. VH Hallmark Framework Positions

****: VH（VH only）。

**Positions**: [42, 49, 50, 52, 54]

****: 
-  `chain_type == "H"` 
-  IMGT positions ， `vh_hallmark` 

### 4. CDR （Boundary markers）

****: FR↔CDR 。

****:
- **CDR**: FR → CDR CDR
  - CDR1: IMGT position 27
  - CDR2: IMGT position 56
  - CDR3: IMGT position 105
- **CDR**: CDR → FR CDR
  - CDR1: IMGT position 38
  - CDR2: IMGT position 65
  - CDR3: CDR3IMGT（ `dual_map` ）

 `cdr_boundary` 。

### 5. CDR （Core positions）

****: CDR。

****: CDR1-3residue
- **CDR1**: （ IMGT 30-35）
- **CDR2**: （ IMGT 60-62）
- **CDR3**: （ IMGT 110-112，）

****:
```python
region_length = region_end - region_start + 1
mid_start = region_start + region_length // 4
mid_end = region_end - region_length // 4
```

**** `cdr_core` 。

### 6. CDR3 

****: CDR3。

****:  CDR3 residue  `cdr3_key` 。

****: `region == "CDR3"`  `imgt_position`  None。

### 7. 

****: 。

****: N, D, G, M, W, C

****: （`aa`）， `chem_sensitive` 。

****: ，。

## 

1. ****:  `set` 
2. ****:  `sorted` 
3. ****: （， region ），tags  `[]`

## 

****:
```
len(residues) == v_length == len(variable_domain_sequence) == len(dual_map)
```

， `ValueError` 。

## Excel 

`export_feature_matrix`  pandas DataFrame， Excel 。

****:
- `index`: 0-based index
- `residue`: 
- `imgt_position`: IMGT
- `kabat_position`: Kabat
- `region`: 
- `tags`: （ `; ` ）

## 

```python
from core.features.annotate import annotate_features, export_feature_matrix

#  dual_map JSON 
with open("pd1_6jbt_mouse_vh_dualmap.json", "r") as f:
    mapping_result = json.load(f)

# 
annotated = annotate_features(mapping_result, "VH")

#  DataFrame（Excel）
df = export_feature_matrix(annotated)
```

## 

1. ****: （pandasExcel）
2. ****: /
3. ****:  JSON 
4. ****:  risk/score/recommendation

## 

- **Version**: v1
- ****: 2025-01-15
- ****: antibody_engineering
- ****: computational_structures








