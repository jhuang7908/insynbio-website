# Germline Assets 

## 

 2025-12-13 ， germline  `data/germlines/v1_clean/` 。

****：
- ❌ ** `output/`  germline**
- ✅ ** `data/germlines/v1_clean/` **

## 

###  `core.germline_assets_loader` 

 `core.germline_assets_loader`  germline ：

```python
from core.germline_assets_loader import (
    load_clean_germline_assets,
    load_all_clean_germline_assets,
    load_germline_by_id,
    load_canonical_proxy_clusters,
    load_canonical_proxy_lookup,
    get_germline_assets_path,
    validate_germline_assets_directory,
)

#  clean germline assets
all_assets = load_all_clean_germline_assets(include_canonical_proxy=False)

#  canonical_proxy 
all_assets_with_proxy = load_all_clean_germline_assets(include_canonical_proxy=True)

#  ID 
asset = load_germline_by_id("M99641|IGHV1-18*01|Homo", include_canonical_proxy=True)

#  canonical proxy lookup table
lookup_table = load_canonical_proxy_lookup

# 
jsonl_path = get_germline_assets_path(include_canonical_proxy=True)
```

## 

```
data/germlines/v1_clean/
├── germline_assets_clean.jsonl                    # Clean germline assets
├── germline_assets_clean_with_canonical_proxy.jsonl  #  canonical_proxy 
├── manifest.json                                  # 
├── clusters/
│   ├── cdr1_cluster_assignments.csv
│   ├── cdr1_cluster_summary.csv
│   ├── cdr1_representatives.fasta
│   ├── cdr2_cluster_assignments.csv
│   ├── cdr2_cluster_summary.csv
│   └── cdr2_representatives.fasta
└── qc/
    └── canonical_proxy_qc.csv
```

## 

### 
- ✅ `core/germline_assets_loader.py` - 

### 
- ✅ `scripts/build_canonical_proxy_layer.py` - 
- ✅ `scripts/build_canonical_proxy_assets.py` - 
- ✅ `scripts/verify_canonical_proxy_output.py` - 
- ✅ `scripts/check_clean_germline_assets.py` - 
- ✅ `scripts/example_use_canonical_proxy.py` - 

### 

：

1. **Scaffold **
   - `scripts/stage12_germline_selection.py` -  germline assets  scaffold
   - `core/germline_library_provenance.py` - 

2. ****
   -  `load_clean_germline_assets` 

3. ****
   - Vernier / CMC / Immunogenicity 

## 

，：

- [ ]  `output/`  germline ？
- [ ] ？
- [ ]  `core.germline_assets_loader` ？
- [ ] （ `validate_germline_assets_directory`）？

## 

：

```python
from core.germline_assets_loader import validate_germline_assets_directory

is_valid, errors = validate_germline_assets_directory
if not is_valid:
    print("❌ :")
    for error in errors:
        print(f"  - {error}")
else:
    print("✅ ")
```

## 

****：`output/` ，** `data/germlines/v1_clean/` **。

 `output/` ，。













