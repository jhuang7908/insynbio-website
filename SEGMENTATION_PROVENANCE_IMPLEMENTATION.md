# IMGT

## 

IMGT（segmentation_provenance），VHH、。

## 

### 1.  (`core/segmentation/anarcii_adapter.py`)

IMGT，：

- ****: `run_anarcii_imgt(seq, species, chain, allow_partial, max_mismatches)`
- ****: `(segmentation, numbering, provenance)`
  - `segmentation`: FR/CDR
  - `numbering`: IMGT
  - `provenance`: 

**Fallback**:
1.  `anarcii`（ANARCI）
2. Fallback 1:  `anarci`（ANARCI）
3. Fallback 2:  `regex_minimal`

fallbackprovenance。

### 2. Provenance

```json
{
  "segmentation_provenance": {
    "method": "anarcii" | "fallback:anarci" | "fallback:regex_minimal",
    "scheme": "imgt",
    "implementation": {
      "package": "anarcii" | "anarci" | "regex_minimal",
      "version": "x.y.z",
      "python": "3.11.6",
      "platform": "Windows-10",
      "commit": "git_sha_if_available"
    },
    "parameters": {
      "species": "camelid",
      "chain": "H",
      "allow_partial": true,
      "max_mismatches": 0,
      "fallbacks": ["anarci", "regex_minimal"],
      "fallbacks_used": ["fallback:anarci"]  // fallback
    },
    "evidence": {
      "numbering_first_10": [
        {"pos": "1", "aa": "E"},
        {"pos": "2", "aa": "V"}
      ],
      "boundaries": {
        "FR1": [1, 26],
        "CDR1": [27, 38],
        "FR2": [39, 55],
        "CDR2": [56, 65],
        "FR3": [66, 104],
        "CDR3": [105, 117],
        "FR4": [118, 128]
      }
    }
  }
}
```

### 3. 

 `core/vhh_humanization.py`：

-  `run_anarcii_imgt`
- provenance `result['segmentation_provenance']`
- （，）

### 4. JSON (`core/segmentation/json_validator.py`)

JSON，：

****:
1. ✅  `segmentation_provenance.method`
2. ✅  `segmentation_provenance.scheme == "imgt"`
3. ✅  `implementation.package`  `implementation.version`
4. ✅  `evidence.boundaries`
5. ✅  `method`  `anarcii`， `implementation.package`  `anarcii`

****:
- `validate_segmentation_provenance(json_data)`: provenance
- `validate_json_for_delivery(json_data, strict=True)`: JSON

****:
-  `strict=True`， `SegmentationProvenanceValidationError`
- ""

### 5. 

 `scripts/generate_dual_report_v3.py`：

-  `generate_client_report`  `generate_developer_report` 
- ，
- （，）

## 

### 

```python
from core.segmentation.anarcii_adapter import run_anarcii_imgt

# provenance
segmentation, numbering, provenance = run_anarcii_imgt(
    seq="QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVITADSGSTTYADSVKGRFTISRDDARNTVYLQMNSLKPEDTAVYYCAAGGVGWPYFDYWGQGTQVTVSS",
    species="camelid",
    chain="H"
)

# provenanceresult
result['segmentation_provenance'] = provenance
```

### JSON

```python
from core.segmentation.json_validator import validate_json_for_delivery

# JSON
try:
    is_valid, errors = validate_json_for_delivery(result, strict=True)
    if is_valid:
        print("✅ JSON，")
    else:
        print("❌ JSON:")
        for error in errors:
            print(f"  - {error}")
except SegmentationProvenanceValidationError as e:
    print(f"❌ : {e}")
    # 
```

## 

```
core/segmentation/
├── __init__.py                    # 
├── anarcii_adapter.py             # （provenance）
└── json_validator.py              # JSON

core/vhh_humanization.py           # ，
scripts/generate_dual_report_v3.py # ，
```

## 

：

```bash
python core/segmentation/json_validator.py
```

：
1. provenance
2. method
3. methodpackage

## 

1. ****: `method` （`anarcii`、`fallback:anarci`、`fallback:regex_minimal`）
2. ****: `implementation` 、Python、，
3. ****: `evidence` 10，
4. **Fallback**: fallback， `parameters.fallbacks_used` 
5. ****: JSON，

## 

- ， `imgt_number_anarcii` 
- ，
- JSON（provenance）

## 

1. fallback
2. provenance
3. provenance
4. provenance













