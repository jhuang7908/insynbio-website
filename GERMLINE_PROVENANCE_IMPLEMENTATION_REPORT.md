# GermlineProvenanceIMGT

****: v1.0  
****: 2025-12-12  
****: ✅ 

---

## 📋 

4，germlineprovenanceIMGT，germline、hash、IMGTANARCI provenance。

****: ""，"JSON"。

****: 4/4  ✅ (100%)

---

## 🎯 1：「germline 」

### 
- ****: `core/germline_library_provenance.py`
- ****: ~200

### 

#### 1. `calculate_file_sha256(file_path)`
- ****: SHA256
- ****: `hashlib.sha256`，（4096/）
- ****: ✅ ，hardcode

#### 2. `load_germline_library_with_provenance`
- ****: germlineprovenance
- ****:
  - 
  - SHA256
  - entry_count（JSON）
  - provenance

#### 3. `build_germline_library_provenance`
- ****: JSON`germline_library_provenance`
- ****: `prepare_json_data`

### 

```json
{
  "germline_library_provenance": {
    "library_name": "human_VH3_germline_library",
    "source": "internal_consensus_scaffold",
    "format": "json",
    "path": "",
    "absolute_path": "",
    "version": "v1.0",
    "entry_count": 128,
    "sha256": "SHA256",
    "loaded_at": "2025-12-12T18:40:00Z"
  }
}
```

### 

- ✅ **sha256**: ，hardcode
- ✅ **entry_count**: ，hardcode
- ✅ ****: 
- ✅ **hash**: sha256

---

## 🎯 2：「germline  IMGT 」

### 
- ****: `core/segmentation/germline_numbering.py`
- ****: ~400

### 

#### 1. `number_germline_sequence_anarcii(sequence, template_id, scheme)`
- ****: ANARCIgermlineIMGT
- ****:
  - ANARCIANARCI fallback
  - IMGT（FR1: 1-26, CDR1: 27-38, FR2: 39-55, CDR2: 56-65, FR3: 66-104, CDR3: 105-117, FR4: 118-128）
  - positionsboundaries

#### 2. `number_germline_templates(json_data, template_ids)`
- ****: germlineIMGT
- ****:
  - selected
  - ranked_top10
- ****: germline

### 

```json
{
  "germline_numbering": {
    "numberings": {
      "HUMAN_VH3_SCF_24": {
        "template_id": "HUMAN_VH3_SCF_24",
        "scheme": "imgt",
        "positions": [
          {"pos": "1", "aa": "E"},
          {"pos": "2", "aa": "V"},
          ...
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
}
```

### 

- ✅ **scheme**: `scheme == "imgt"`
- ✅ **boundaries**: boundaries
- ✅ ****: selectedranked_top10

---

## 🎯 3：「IMGT  ANARCI 」

### 
- ****: `core/segmentation/germline_numbering.py`

### 

- ****: ANARCI
- ****: `anarcii.__version__`（hardcode）
- **Fallback**: fallbackANARCI，`"fallback:anarci"`
- **Provenance**: `numbering_provenance`

### 

```json
{
  "germline_numbering": {
    "numbering_provenance": {
      "method": "anarcii",
      "scheme": "imgt",
      "package": "anarcii",
      "package_version": "anarcii.__version__",
      "python": "sys.version_info",
      "command_signature": "anarcii_number(sequence, scheme='imgt')",
      "executed_at": "2025-12-12T18:41:00Z"
    }
  }
}
```

### 

- ✅ **method**: `method == "anarcii"`
- ✅ **package**: `package == "anarcii"`
- ✅ **version**: `package_version``"not_installed"`
- ✅ ****: `segmentation_provenance.method`

---

## 🎯 4：QA

### 
- ****: `core/segmentation/json_validator.py`

### 

#### 1. `validate_germline_library_proof` - Rule A
****:
- `germline_library_provenance`
- `sha256`
- sha256

#### 2. `validate_germline_numbering_proof` - Rule B & C
****:
- `germline_numbering`
- `scheme == "imgt"`
- `numbering_provenance.method == "anarcii"`
- `numbering_provenance.package == "anarcii"`
- `numbering_provenance.package_version``"not_installed"`

### 

#### Rule A: germlineprovenance
```python
assert "germline_library_provenance" in json_data
assert json_data["germline_library_provenance"]["sha256"]
```

#### Rule B: germline IMGT
```python
assert "germline_numbering" in json_data
assert json_data["germline_numbering"]["scheme"] == "imgt"
```

#### Rule C: ANARCI
```python
assert json_data["germline_numbering"]["numbering_provenance"]["method"] == "anarcii"
```

### 

- ****: `validate_json_for_delivery`
- ****: ，raise，
- ****: 

---

## 🔗 

### 1. `prepare_json_data` 

****: `core/json_data_preparer.py`

****:
1. germline
2. `germline.candidates[].scores.overall`
3. `germline_selection_proof`
4. **`germline_library_provenance`（1）**
5. **germlineIMGT（23）**

### 2. `validate_json_for_delivery` 

****: `core/segmentation/json_validator.py`

****:
1. `validate_segmentation_provenance`
2. `validate_germline_selection_consistency`
3. **`validate_germline_library_proof` - 4 Rule A**
4. **`validate_germline_numbering_proof` - 4 Rule B & C**

---

## 📁 

### 

1. **`core/germline_library_provenance.py`** (~200)
   - `calculate_file_sha256`
   - `load_germline_library_with_provenance`
   - `build_germline_library_provenance`

2. **`core/segmentation/germline_numbering.py`** (~400)
   - `number_germline_sequence_anarcii`
   - `number_germline_templates`

### 

1. **`core/json_data_preparer.py`**
   - 1（`germline_library_provenance`）
   - 23（`germline_numbering`）

2. **`core/segmentation/json_validator.py`**
   - `validate_germline_library_proof`
   - `validate_germline_numbering_proof`
   - `validate_json_for_delivery`

---

## ✅ 

### 
- ✅ `germline_library_provenance` - 
- ✅ `germline_numbering` - 
- ✅ `validation_functions` - 

### Lint
- ✅ 
- ✅ 
- ✅ 

---

## 📊 

```
┌─────────────────────────────────────────┐
│  Step 1: humanize_vhh                 │
│                               │
│  - candidates[]                         │
│  - best_match                           │
│  - germline                      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Step 2: prepare_json_data(result)      │
│  ├─ germline_library_provenance     │
│  │  └─ 1: provenance              │
│  ├─ germlineIMGT          │
│  │  ├─ 2: IMGT                  │
│  │  └─ 3: ANARCI provenance        │
│  └─ prepared_result                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Step 3: validate_json_for_delivery   │
│  ├─ Rule A: provenance            │
│  ├─ Rule B: IMGT                │
│  └─ Rule C: ANARCI             │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Step 4: JSON              │
│  (is_valid == True)            │
└─────────────────────────────────────────┘
```

---

## 🎓 

### 

`prepare_json_data`，：

```python
from core.json_data_preparer import prepare_json_data

# JSON
result = humanize_vhh(...)
prepared_result = prepare_json_data(result, "REPORT")

# prepared_result：
# - germline_library_provenance (1)
# - germline_numbering (23)
```

### 

`validate_json_for_delivery`：

```python
from core.segmentation.json_validator import validate_json_for_delivery

# JSON
is_valid, errors = validate_json_for_delivery(prepared_result, strict=True)

if not is_valid:
    print(":", errors)
    # 
```

---

## ✨ 

### Provenance

- ✅ ****: SHA256
- ✅ **IMGT**: positionsboundaries
- ✅ **ANARCI**: package_version，method

### 

- ✅ **SHA256**: sha256
- ✅ ****: germlinetarget
- ✅ **Scheme**: imgt scheme

### 

- ✅ ****: 3，fail
- ✅ ****: ，
- ✅ ****: 

---

## 📋 

### 1
- ✅ sha256（hardcode）
- ✅ entry_count（hardcode）
- ✅ provenanceJSON

### 2
- ✅ IMGT
- ✅ positions
- ✅ boundaries
- ✅ selectedtop10

### 3
- ✅ methodJSON
- ✅ package_versionimport
- ✅ fallback
- ✅ provenanceJSON

### 4
- ✅ Rule A
- ✅ Rule B
- ✅ Rule C
- ✅ fail

---

## 🚀 

### 
- [ ] 
- [ ] 
- [ ] 

### 
- [ ] API
- [ ] 
- [ ] 

### 
- [ ] 
- [ ] 
- [ ] 

---

## 📝 

****: ✅ 4

****: lint，

****: 

****: 

****: 

---

****: 2025-12-12  
****: v1.0













