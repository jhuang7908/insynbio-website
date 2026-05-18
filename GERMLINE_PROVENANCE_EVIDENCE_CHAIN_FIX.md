# Germline Provenance 

****: 2025-12-12  
****: germline_library_provenancegermline_numberingJSON

---

## 

### 
1. **A（germlineprovenance）**: JSON`germline_library_provenance`
2. **B（germline IMGT）**: JSON`germline_numbering`

### 
- ，`prepare_json_data`error，
- JSON
- ，

---

## 

### 1. 

****: `core/json_data_preparer.py`

****:
- try-excepterror
- ，
- 

```python
# 1：germline_library_provenance
# ：，
from core.germline_library_provenance import build_germline_library_provenance
json_data["germline_library_provenance"] = build_germline_library_provenance(json_data)

# germline_library_provenancesha256
if not json_data["germline_library_provenance"].get("sha256"):
    raise ValueError("germline_library_provenance.sha256 ")

# 23：germlineIMGT
# ：，
from core.segmentation.germline_numbering import number_germline_templates
json_data["germline_numbering"] = number_germline_templates(json_data)

# germline_numberingnumbering_provenance
if "error" in json_data["germline_numbering"]:
    raise ValueError("germline_numbering")

numbering_provenance = json_data["germline_numbering"].get("numbering_provenance")
if not numbering_provenance:
    raise ValueError("germline_numbering.numbering_provenance ")

if numbering_provenance.get("method") != "anarcii":
    method = numbering_provenance.get("method", "unknown")
    if not method.startswith("fallback:"):
        raise ValueError(f"method = '{method}' != 'anarcii'")
```

### 2. 

****: `scripts/run_egfr_full_pipeline_v4_1.py`

****:
- JSON`validate_json_for_delivery`
- ，

```python
# JSON
prepared_result = prepare_json_data(result, "REPORT")

# ：JSONgermline_library_provenancegermline_numbering
from core.segmentation.json_validator import validate_json_for_delivery
is_valid, errors = validate_json_for_delivery(prepared_result, strict=True)

if not is_valid:
    print(f"❌ JSON，：")
    for error in errors:
        print(f"  - {error}")
    raise ValueError("JSON：germline_library_provenancegermline_numbering")

# 
json.dump(prepared_result, ...)
```

### 3. 

****: `core/segmentation/json_validator.py`

****:
- ，""vs""
- error，

---

## 

### 
```json
{
  "germline": {...},
  // ❌  germline_library_provenance
  // ❌  germline_numbering
}
```

### 
```json
{
  "germline": {...},
  "germline_library_provenance": {
    "library_name": "human_VH3_germline_library",
    "version": "v1.0",
    "path": "...",
    "entry_count": 128,
    "sha256": "<runtime_computed>",
    "loaded_at": "2025-12-12T19:10:00Z"
  },
  "germline_numbering": {
    "numberings": {...},
    "numbering_provenance": {
      "method": "anarcii",
      "scheme": "imgt",
      "package": "anarcii",
      "package_version": "2.x.x",
      "executed_at": "2025-12-12T19:11:00Z"
    }
  }
}
```

---

## QA

### Rule A: Germline library proof
```python
assert "germline_library_provenance" in json_data
assert json_data["germline_library_provenance"]["sha256"]
```

### Rule B: Germline IMGT numbering proof
```python
assert "germline_numbering" in json_data
assert json_data["germline_numbering"]["scheme"] == "imgt"
```

### Rule C: ANARCI proof
```python
assert json_data["germline_numbering"]["numbering_provenance"]["method"] == "anarcii"
```

** → **

---

## 

|  |  |
|--------|----------|
| germline  | ✅  |
| germline IMGT （ANARCI） | ✅  |
|  | ✅  |

---

## 

**""，"JSON"。**

provenanceANARCIJSON，QA，。

---

****:
1. `core/json_data_preparer.py` - ，
2. `scripts/run_egfr_full_pipeline_v4_1.py` - 
3. `core/segmentation/json_validator.py` - 













