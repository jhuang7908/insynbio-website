# EGFR VHH 

****: v1.0  
****: 2025-12-12  
****: Single Source of Truth, Evidence-first, Fail-fast

---

## 📋 

### 1. Single Source of Truth
- **JSON **
- MD/HTML  JSON ，、""

### 2. Evidence-first
-  `*_provenance + evidence`
-  provenance  evidence ，

### 3. Fail-fast
-  fallback、、，
- """"

---

## 🗂️ 

### 
```
projects/EGFR_7D12_VHH/
├── input/
│   └── egfr_vhh.fasta          # （ VHH AA）
├── output/
│   ├── result.json             #  JSON
│   ├── report.md               # MD（JSON）
│   └── audit.md                # 
└── ...
```

### Germline
- `core/data/germline_library_vh3_v1.json`

---

## 🔄 （6）

### Step 1：

****:
-  FASTA
- //
-  20AA（ X，）

**JSON **:
```json
{
  "input_provenance": {
    "source_file": "projects/EGFR_7D12_VHH/input/egfr_vhh.fasta",
    "sha256": "<runtime>",
    "sequence_id": "EGFR_7D12_VHH",
    "length": 117,
    "aa_alphabet_check": {"valid": true, "invalid_chars": []},
    "loaded_at": "2025-12-12T19:10:00Z"
  }
}
```

**Fail **: `valid=false`  FASTA 

---

### Step 2： IMGT （ANARCI，）

****:
-  `anarcii`（ `anarci`） IMGT  + FR/CDR 

**JSON **:
```json
{
  "segmentation": {
    "scheme": "imgt",
    "regions": {"FR1":"...", "CDR1":"...", ...},
    "boundaries": {"FR1":[1,26], ...},
    "numbering_first_20": [{"pos":"1","aa":"E"}, ...],
    "reconstruction_check": {"matches_input": true}
  },
  "segmentation_provenance": {
    "method": "anarcii",
    "package": "anarcii",
    "package_version": "<anarcii.__version__>",
    "scheme": "imgt",
    "executed_at": "..."
  }
}
```

**Fail **:
- `method != "anarcii"`  fallback
- `reconstruction_check.matches_input != true`

---

### Step 3：germline 

****:
-  germline 
- 
-  sha256

**JSON **:
```json
{
  "germline_library_provenance": {
    "library_name": "human_VH3_germline_library",
    "source": "internal_consensus_scaffold",
    "version": "v1.0",
    "path": "core/data/germline_library_vh3_v1.json",
    "entry_count": 128,
    "sha256": "<runtime>",
    "loaded_at": "..."
  }
}
```

**Fail **: 、`entry_count=0`、`sha256` 

---

### Step 4： germline  IMGT （ANARCI，/）

****:
-  `anarcii + IMGT`  germline 
- ：
  - TopN （ 50）
  -  selected 

**JSON **:
```json
{
  "germline_numbering": {
    "numberings": {
      "HUMAN_VH3_SCF_24_SAFE_A": {
        "template_id": "HUMAN_VH3_SCF_24_SAFE_A",
        "scheme": "imgt",
        "positions_first_20": [{"pos":"1","aa":"E"}, ...],
        "boundaries": {"FR1":[1,26], ...}
      }
    },
    "numbering_provenance": {
      "method": "anarcii",
      "package": "anarcii",
      "package_version": "<anarcii.__version__>",
      "scheme": "imgt",
      "executed_at": "..."
    }
  }
}
```

**Fail **: `numbering_provenance.method != "anarcii"`  `boundaries` 

---

### Step 5： vs  germline  IMGT 

****:
-  IMGT position-level identity
- mask （ FR1/FR2/FR3/FR4 ；CDR ）
-  match/total 

**JSON **:
```json
{
  "germline_alignment_provenance": {
    "algorithm": "imgt_position_identity",
    "scheme": "imgt",
    "mask_regions": ["CDR1","CDR2","CDR3"],
    "gap_policy": "disallow",
    "executed_at": "..."
  },
  "germline_candidates": [
    {
      "template_id": "HUMAN_VH3_SCF_24_SAFE_A",
      "region_counts": {
        "FR1": {"match": 23, "total": 26},
        "FR2": {"match": 10, "total": 17},
        "FR3": {"match": 32, "total": 39},
        "FR4": {"match": 11, "total": 11}
      },
      "framework_identity": 0.817,
      "evidence": {
        "imgt_positions_compared": 93,
        "first_10_mismatches": [{"pos":"44","query":"E","ref":"Q"}]
      }
    }
  ]
}
```

**Fail **:
- `imgt_positions_compared == 0`（ IMGT position-level ）
- 

---

### Step 6：（ + ）

****:
-  objective： framework_identity（ combined_score，）
- tie-breakers 
-  Top10
-  selected  rank

**JSON **:
```json
{
  "germline_selection_proof": {
    "objective": "maximize_framework_identity",
    "score_source_path": "germline_candidates[].framework_identity",
    "tie_breakers": [
      "germline_candidates[].region_counts.FR2.match",
      "germline_candidates[].region_counts.FR3.match"
    ],
    "eligible_candidate_count": 128,
    "ranked_top10": [
      {"template_id":"HUMAN_VH3_SCF_24_SAFE_A", "rank":1, "framework_identity":0.817}
    ],
    "selected": {"template_id":"HUMAN_VH3_SCF_24_SAFE_A", "rank":1, "framework_identity":0.817},
    "consistency_checks": {
      "selected_in_ranked_top10": true
    }
  },
  "germline": {
    "selected": {"id":"HUMAN_VH3_SCF_24_SAFE_A", "framework_identity":0.817, "reason":"..."},
    "top_candidates": [...]
  }
}
```

**Fail **:
- `selected`  Top10
- `eligible_candidate_count=0`
-  selected 

---

## 📄 MD  JSON 

### ：MD  JSON 

- MD （identity、match/total、rank、template_id、hash、version） JSON 
- MD " 0.000" JSON 

### ：

 MD ， `md_json_consistency_check`：
-  MD  template_id/identity/top1  JSON
-  → fail

---

## ✅  Validator

 `result.json`  `report.md` ，：

1. `validate_input_provenance`
2. `validate_segmentation_provenance`
3. `validate_germline_library_provenance`
4. `validate_germline_numbering_provenance`
5. `validate_alignment_provenance`
6. `validate_selection_proof`
7. `validate_md_matches_json`

** → **

---

## 🚀 

### 

```bash
python scripts/run_egfr_vhh_end_to_end.py \
  --input projects/EGFR_7D12_VHH/input/egfr_vhh.fasta \
  --germline core/data/germline_library_vh3_v1.json \
  --out projects/EGFR_7D12_VHH/output/
```

### 

```bash
python scripts/audit_result.py \
  --json projects/EGFR_7D12_VHH/output/result.json \
  --md   projects/EGFR_7D12_VHH/output/report.md
```

---

## 📁 

### 

1. **`scripts/run_egfr_vhh_end_to_end.py`** - 
   - Step 1-6 
   - provenance
   - Fail-fast

2. **`scripts/audit_result.py`** - 
   - 7
   - MDJSON

### 

- `core/germline_library_provenance.py` - provenance
- `core/segmentation/germline_numbering.py` - Germline
- `core/segmentation/anarcii_adapter.py` - IMGT
- `core/json_data_preparer.py` - JSON

---

## ✨ 

### 1. Evidence-first
- ✅ provenance
- ✅ evidence
- ✅ provenance

### 2. Fail-fast
- ✅ 
- ✅ 
- ✅ 

### 3. Single Source of Truth
- ✅ JSON
- ✅ MDJSON
- ✅ 

---

## 📊 

### result.json（JSON）
6provenanceevidence

### report.md（MD）
JSON，JSON

### audit.md


---

****: ✅   
****: v1.0













