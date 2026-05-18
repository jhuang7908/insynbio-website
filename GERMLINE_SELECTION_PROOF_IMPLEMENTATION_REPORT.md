# Germline Selection Proof 

## 📋 

 `germline_selection_proof`  `germline.candidates[].scores.overall` ，。

****: 2025-12-12  
****: v1.0  
****: ✅ 

---

## 🎯 

### 
1.  `prepare_json_data` ， `germline_selection_proof`
2.  `germline.candidates[].scores.overall` （ 0.0 ）
3. 

### 
- **1**: `germline.candidates[].scores.overall`  `0.000`
- **2**:  `germline_selection_proof` 
- **3**: 

---

## 🔧 

### 1. ：`core/json_data_preparer.py`

#### 1.1 `build_germline_selection_proof_from_data(data)`
****:  data  `germline_selection_proof`

****:
```python
1.  data["candidates"] ：
   - template_id
   - alignment_scores.scoring_details.combined_score
   - tie-breaker （framework_identity, key_position_score, cdr_compatibility_score, developability_score）

2.  combined_score 

3.  ranked_top10（10）

4.  data["best_match"]["template"]["template_id"]  rank

5.  consistency_checks：
   - best_match_template_id_equals_selected
   - best_match_score_equals_selected
   - germline_table_overall_populated
```

****:
```json
{
  "objective": "maximize_combined_score",
  "score_source_path": "candidates[].alignment_scores.scoring_details.combined_score",
  "tie_breakers": [...],
  "eligible_candidate_count": 10,
  "ranked_top10": [...],
  "selected": {
    "template_id": "...",
    "rank": 1,
    "combined_score": 0.688
  },
  "consistency_checks": {...}
}
```

#### 1.2 `fix_germline_candidates_overall(data)`
****:  `germline.candidates[].scores.overall` 

****:
```python
1.  data["germline"]["candidates"]

2.  germline_cand：
   -  id  data["candidates"]  template_id  candidate
   - ： scores.overall = candidate.alignment_scores.scoring_details.combined_score
   - ： comment_short  "[NO_MATCH_IN_CANDIDATES]"
```

****:
- ✅  `candidates[].alignment_scores.scoring_details.combined_score` 
- ✅  `germline.candidates[].scores.overall`
- ✅ 

#### 1.3 `prepare_json_data(result, purpose)`
****:  JSON 

****:
```
1.  result 
2.  germline ，（ build_germline_candidates）
3.  fix_germline_candidates_overall 
4.  build_germline_selection_proof_from_data  proof
5.  JSON 
```

---

### 2. ：`core/segmentation/json_validator.py`

#### 2.1 ：`validate_germline_selection_consistency(json_data)`
****:  `germline_selection_proof`  `germline` 

****（ `germline.selected.scores.overall > 0` ）:

|  |  |  |
|------|--------|----------|
| 1 | `germline_selection_proof.selected.template_id == germline.selected.id` | template_id  |
| 2 | `germline_selection_proof.selected.combined_score == germline.selected.scores.overall` | score  |
| 3 | `germline.candidates[0].scores.overall != 0` | Top1  overall  0 |

****:  `validate_json_for_delivery` ，

---

### 3. 

#### 3.1 `core/vhh_humanization_with_qa.py`
****:
```python
# 
from scripts.generate_egfr_cro_report_cn_enhanced import prepare_json_data

# 
from core.json_data_preparer import prepare_json_data
```

#### 3.2 `scripts/run_egfr_full_pipeline_v4_1.py`
****:
```python
# JSON prepare_json_data
from core.json_data_preparer import prepare_json_data
prepared_result = prepare_json_data(result, "REPORT")

#  prepared_result 
json.dump(prepared_result, ...)
generate_client_report(prepared_result, ...)
generate_developer_report(prepared_result, ...)
```

#### 3.3 `core/vhh_humanization.py`
****:
-  `germline_selection_proof` 
-  `germline` 
- ：`germline_selection_proof`  `prepare_json_data` 

---

## 📊 

```
┌─────────────────────────────────────────────────────────────┐
│                    humanize_vhh                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  result = {                                          │   │
│  │    candidates: [...],                                │   │
│  │    best_match: {...},                                │   │
│  │    germline: { candidates: [...], selected: {...} }  │   │
│  │  }                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              prepare_json_data(result)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1.  germline ，                      │   │
│  │  2. fix_germline_candidates_overall                 │   │
│  │     └─>  scores.overall                          │   │
│  │  3. build_germline_selection_proof_from_data       │   │
│  │     └─>  germline_selection_proof                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              prepared_result (JSON)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  {                                                     │   │
│  │    candidates: [...],                                 │   │
│  │    best_match: {...},                                 │   │
│  │    germline: {                                        │   │
│  │      candidates: [                                    │   │
│  │        { scores: { overall: 0.688 } }  ✅       │   │
│  │      ]                                                │   │
│  │    },                                                 │   │
│  │    germline_selection_proof: { ... }  ✅       │   │
│  │  }                                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────┐                      ┌──────────────┐
│ JSON  │                      │      │
└──────────────┘                      └──────────────┘
```

---

## ✅ 

### 

#### 1. 
```bash
✅ prepare_json_data imported successfully
✅ validate_germline_selection_consistency imported successfully
```

#### 2. 
- ✅ `germline.candidates[].scores.overall`  `0.0`  `combined_score` 
- ✅  `[NO_MATCH_IN_CANDIDATES]` 
- ✅ `germline.selected.scores.overall` 

#### 3. Proof 
- ✅ `germline_selection_proof.ranked_top10`  `combined_score` 
- ✅ `germline_selection_proof.selected.rank` 
- ✅ `germline_selection_proof.consistency_checks` 

#### 4. 
- ✅  `validate_json_for_delivery`
- ✅ ，

---

## 📈 

### 
```json
{
  "germline": {
    "candidates": [
      {
        "id": "HUMAN_VH3_SCF_24_SAFE_A",
        "scores": {
          "overall": 0.0  ❌ 
        }
      }
    ]
  },
  "germline_selection_proof": null  ❌ 
}
```

### 
```json
{
  "germline": {
    "candidates": [
      {
        "id": "HUMAN_VH3_SCF_24_SAFE_A",
        "scores": {
          "overall": 0.688  ✅ 
        }
      }
    ],
    "selected": {
      "scores": {
        "overall": 0.688  ✅ 
      }
    }
  },
  "germline_selection_proof": {
    "objective": "maximize_combined_score",
    "ranked_top10": [...],  ✅ 
    "selected": {
      "template_id": "HUMAN_VH3_SCF_24_SAFE_A",
      "rank": 1,
      "combined_score": 0.688
    },
    "consistency_checks": {
      "best_match_template_id_equals_selected": true,
      "best_match_score_equals_selected": true,
      "germline_table_overall_populated": true
    }
  }
}
```

---

## 🔍 

### Lint 
- ✅  lint 
- ✅ 
- ✅ 

### 
- ✅ ，
- ✅ 
- ✅ 

---

## 📝 

### 
1. `core/json_data_preparer.py` - JSON （223 ）
   - `build_germline_selection_proof_from_data`
   - `fix_germline_candidates_overall`
   - `prepare_json_data`

### 
1. `core/segmentation/json_validator.py`
   -  `validate_germline_selection_consistency`
   -  `validate_json_for_delivery`

2. `core/vhh_humanization_with_qa.py`
   -  `prepare_json_data` 

3. `scripts/run_egfr_full_pipeline_v4_1.py`
   -  JSON  `prepare_json_data`
   -  `prepared_result` 

4. `core/vhh_humanization.py`
   -  `germline_selection_proof` 
   - 

---

## 🎓 

### 
```python
from core.json_data_preparer import prepare_json_data

# JSON
result = humanize_vhh(...)
prepared_result = prepare_json_data(result, "REPORT")

#  prepared_result 
json.dump(prepared_result, ...)
generate_report(prepared_result, ...)
```

### 
```python
from core.segmentation.json_validator import validate_json_for_delivery

# JSON
is_valid, errors = validate_json_for_delivery(prepared_result, strict=True)
if not is_valid:
    print(":", errors)
```

---

## 🚀 

### 
1. 
2. ： candidate 
3. ：

### 
1.  scoring profile
2.  `germline_selection_proof` 
3. 

---

## 📚 

- `core/germline_data_builder.py` - Germline 
- `core/germline_selection_provenance.py` - Germline （，）
- `core/segmentation/json_validator.py` - JSON 

---

## ✨ 

：

1. ✅ ** `germline.candidates[].scores.overall`  0.0 **
   -  `candidates[].alignment_scores.scoring_details.combined_score` 

2. ✅ ** `germline_selection_proof` **
   - 、、

3. ✅ ****
   - 
   - 

4. ✅ ****
   -  JSON  `prepare_json_data` 
   - 

****: ✅ ，。

---

****: 2025-12-12  
****: v1.0













