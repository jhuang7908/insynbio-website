# Germline Assets 

## ✅ ：

****: 2025-12-13  
****: v1_clean

## 

### 1. 

****: `core/germline_assets_loader.py`

 germline ：

- `load_clean_germline_assets` - 
- `load_all_clean_germline_assets` - 
- `load_germline_by_id` -  ID 
- `load_canonical_proxy_clusters` -  clusters
- `load_canonical_proxy_lookup` -  lookup table
- `get_germline_assets_path` - 
- `validate_germline_assets_directory` - 

### 2. 

：

- ✅ `scripts/build_canonical_proxy_layer.py` - 
- ✅ `scripts/build_canonical_proxy_assets.py` - 
- ✅ `scripts/verify_canonical_proxy_output.py` - 
- ✅ `scripts/check_clean_germline_assets.py` - 
- ✅ `scripts/example_use_canonical_proxy.py` - 

### 3. 

```
data/germlines/v1_clean/
├── germline_assets_clean.jsonl                    ✅
├── germline_assets_clean_with_canonical_proxy.jsonl  ✅
├── manifest.json                                  ✅
├── clusters/
│   ├── cdr1_cluster_assignments.csv              ✅
│   ├── cdr1_cluster_summary.csv                  ✅
│   ├── cdr1_representatives.fasta                ✅
│   ├── cdr2_cluster_assignments.csv              ✅
│   ├── cdr2_cluster_summary.csv                  ✅
│   └── cdr2_representatives.fasta                ✅
└── qc/
    └── canonical_proxy_qc.csv                     ✅
```

### 4. 

 `scripts/verify_germline_assets_migration.py` ：

- ✅ 
- ✅ manifest.json 
- ✅ Clean assets  (443 )
- ✅ Proxy assets  (443 )
- ✅ Canonical proxy lookup 

## 

### 

```python
from core.germline_assets_loader import (
    load_all_clean_germline_assets,
    load_germline_by_id,
    load_canonical_proxy_lookup,
)

#  clean assets
assets = load_all_clean_germline_assets(include_canonical_proxy=False)

#  canonical_proxy 
assets_with_proxy = load_all_clean_germline_assets(include_canonical_proxy=True)

#  ID 
asset = load_germline_by_id("M99641|IGHV1-18*01|Homo", include_canonical_proxy=True)

#  lookup table
lookup = load_canonical_proxy_lookup
```

### 

```python
from core.germline_assets_loader import validate_germline_assets_directory

is_valid, errors = validate_germline_assets_directory
if not is_valid:
    for error in errors:
        print(f"❌ {error}")
```

## 

### ✅ 

1. ** `data/germlines/v1_clean/` **
2. ** `core.germline_assets_loader` **
3. ** `output/`  germline **

### ❌ 

1. ** `output/` **
2. ** `output/germline_assets_clean.jsonl`**
3. ****

## 

 germline ，：

1. **Scaffold **
   - `scripts/stage12_germline_selection.py` -  germline assets 

2. ****
   -  `load_clean_germline_assets`

3. ****
   - Vernier / CMC / Immunogenicity 

## 

```bash
# 
python scripts/verify_germline_assets_migration.py

# 
python -c "from core.germline_assets_loader import validate_germline_assets_directory; is_valid, errors = validate_germline_assets_directory; print('✅ ' if is_valid else f'❌ {len(errors)} ')"
```

## 

✅ ****  
✅ ****  
✅ ****  
✅ **""**

， `data/germlines/v1_clean/`  germline ， `output/` 。













