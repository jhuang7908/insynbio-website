# Germline  A/B/C 

## 

， Germline  A/B/C ，。

## 

1. **Germline  A / B / C **
2. ** SAFE （A、B、C）**
3. ****
4. **Germline ""，**
5. **：framework compatibility**
6. ** / CMC / developability **
7. **""**
8. **：SAFE_A **

---

## 

### 1. （，）

 germline ， < MIN_IMGT_VH_LENGTH (70aa)，：
- ❌  germline 
- ✅  `fr_only_templates.json`，
- ❌ "/"

****: `filter_imgt_compatible_templates_before_numbering`

---

### 2. ： SAFE 

****: `extract_safe_plan_from_template_id`

```python
def extract_safe_plan_from_template_id(template_id: str) -> Optional[str]:
    """
     template_id  SAFE （A/B/C）
    
    ID: "HUMAN_VH3_SCF_10_SAFE_A"
    : 'A', 'B', 'C'  None
    """
```

****:  template_id  SAFE 。

---

### 3. Step 5 ： SAFE 

****: `step5_align_target_vs_germlines`

****: `safe_plan_filter: Optional[str] = None`

-  `safe_plan_filter`（'A', 'B', 'C'），
-  `None`，

****:  `safe_plan_filter=None`，， Step 6 。

---

### 4. Step 6 ：

#### 4.1 ：`step6_rank_and_select_best_template_for_safe_plan`

 SAFE 。

****:
- `candidates`:  SAFE 
- `safe_plan`: SAFE （'A', 'B', 'C'）
- `objective`: （ "maximize_framework_identity"）
- `library_data`: ，

****:  SAFE ，：
- `candidate_count`: 
- `alignment_provenance`: 
- `ranked_candidates`: （ region_counts）
- `selected`: （ template_id, rank, framework_identity, parent_scaffold, natural_germline_sources）

****:
- ✅  `framework_identity` (IMGT FR-only) 
- ❌ 
- ❌  CMC / developability 
- ❌ 

#### 4.2 ：`step6_parallel_safe_paths_selection`

 A/B/C  SAFE ，。

****:
1.  SAFE （A/B/C）
2.  SAFE  `step6_rank_and_select_best_template_for_safe_plan`
3.  `SAFE_A`, `SAFE_B`, `SAFE_C` 

****:
```json
{
  "germline_selection": {
    "SAFE_A": {
      "candidate_count": 30,
      "alignment_provenance": {
        "scheme": "imgt",
        "method": "anarcii",
        "mask_regions": ["CDR1", "CDR2", "CDR3"]
      },
      "ranked_candidates": [
        {
          "template_id": "HUMAN_VH3_SCF_10_SAFE_A",
          "rank": 1,
          "framework_identity": 0.7544,
          "region_counts": {
            "FR1": {"match": 22, "total": 25},
            "FR2": {"match": 15, "total": 18},
            "FR3": {"match": 30, "total": 39},
            "FR4": {"match": 10, "total": 10}
          }
        }
      ],
      "selected": {
        "template_id": "HUMAN_VH3_SCF_10_SAFE_A",
        "rank": 1,
        "framework_identity": 0.7544,
        "parent_scaffold": "HUMAN_VH3_SCF_10",
        "natural_germline_sources": [
          "IGHV3-23*01",
          "IGHV3-23*04"
        ]
      }
    },
    "SAFE_B": { "......" },
    "SAFE_C": { "......" }
  }
}
```

---

### 5. 

****: `main`  Step 5  Step 6

**Step 5 **:
-  `step5_align_target_vs_germlines`  `safe_plan_filter=None`
- ， SAFE 

**Step 6 **:
-  `step6_parallel_safe_paths_selection`  `step6_rank_and_select_best_template`
- 
-  A/B/C 

****:
-  `germline_selection_proof`  `germline` 
-  SAFE_A 

---

### 6. 

****: `render_md_from_json`

****:
1. ** SAFE **
   - ：template_id, framework_identity, parent_scaffold, 

2. ** SAFE_A **
   - ID、、Framework Identity
   - Parent Scaffold、Natural Germline Sources
   - Top 10 
   - （FR1/FR2/FR3/FR4）

3. ****
   - "SAFE_B  SAFE_C ，；。"

---

## 

✅ **A/B/C  selected.template_id **

✅ ****（ ID ，""）

✅ **Germline **: `framework_identity` (IMGT FR-only)

✅ ****: 、CMC、developability、

✅ **JSON **: `germline_selection`  `SAFE_A`/`SAFE_B`/`SAFE_C` 

✅ **， SAFE_A**

---

## 

1. **scripts/run_egfr_vhh_end_to_end.py**
   -  `extract_safe_plan_from_template_id` 
   -  `step5_align_target_vs_germlines`  `safe_plan_filter` 
   -  `step6_rank_and_select_best_template_for_safe_plan` 
   -  `step6_parallel_safe_paths_selection` 
   -  `step6_rank_and_select_best_template` 
   -  `main` 
   -  `render_md_from_json`  SAFE_A

---

## 

：

```bash
python scripts/run_egfr_vhh_end_to_end.py \
    --input projects/EGFR_7D12_VHH/input/EGFR_7D12_VHH.fasta \
    --germline data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json \
    --out projects/EGFR_7D12_VHH/output/
```

** JSON **:
- `germline_selection`:  SAFE_A/SAFE_B/SAFE_C 
- `germline_selection_proof`: （ SAFE_A ）
- `germline`: （ SAFE_A ）

****:
- 
-  SAFE_A 
- SAFE_B  SAFE_C 

---

## 

**Germline  A/B/C ""，； IMGT FR ，。，。**













