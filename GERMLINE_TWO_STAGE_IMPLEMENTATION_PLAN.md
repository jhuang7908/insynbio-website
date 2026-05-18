# Germline 

## 

 germline ：
- **Stage 1**:  scaffold  scaffold
- **Stage 2**:  scaffold， SAFE_A/B/C 

## 

### 1.  Step 3： Scaffold （ SAFE ）

-  `step3_load_germline_library`  `step3_load_scaffold_library`
-  `human_vh3_scaffolds.json`
-  scaffold  provenance

### 2. Stage 1：Scaffold 

：
- `stage1_select_best_scaffold`
  - ： VHH  IMGT 、scaffold 
  -  scaffold  consensus  IMGT 
  -  VHH （IMGT position-level FR identity，mask CDR）
  - ：top10 scaffolds, selected_scaffold, region_counts/mismatches

JSON ：
- `scaffold_library_provenance`
- `scaffold_alignment_provenance`
- `scaffold_ranked_top10`
- `scaffold_selected`

### 3. Stage 2：SAFE A/B/C 

：
- `stage2_generate_safe_variants`
  - ：selected_scaffold
  -  scaffold  SAFE_A/B/C 
  - 
  - ： template_id, FR-only , diff_vs_scaffold, physiology_explanations

JSON ：
- `safe_strategy_definitions`
- `safe_variants` (A/B/C )
- `safe_variant_explanations`

### 4. 

 `main` ：
- Step 3:  scaffold 
- Stage 1: Scaffold 
- Stage 2: SAFE A/B/C 
-  germline （ CMC//）

### 5. 

 `render_md_from_json`：
- ：Scaffold  + SAFE A/B/C 
-  A/B/C ""，

### 6. 

 `audit_result.py`：
-  scaffold （sha256）
-  ANARCI + IMGT  provenance
-  scaffold  IMGT position-level
-  safe_variants  diff_vs_scaffold 

## 

```python
def stage1_select_best_scaffold(
    target_numbering_rows: List[Dict[str, Any]],
    target_boundaries: Dict[str, List[int]],
    scaffold_library: List[Dict[str, Any]],
    min_length: int = 70,
) -> Dict[str, Any]:
    """
    Stage 1:  scaffold  scaffold
    
    Returns:
        {
            "scaffold_library_provenance": {...},
            "scaffold_alignment_provenance": {...},
            "scaffold_ranked_top10": [...],
            "scaffold_selected": {...}
        }
    """

def stage2_generate_safe_variants(
    selected_scaffold: Dict[str, Any],
    scaffold_numbering: Dict[str, Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Stage 2:  scaffold  SAFE_A/B/C 
    
    Returns:
        {
            "safe_strategy_definitions": {...},
            "safe_variants": {
                "SAFE_A": {...},
                "SAFE_B": {...},
                "SAFE_C": {...}
            },
            "safe_variant_explanations": {...}
        }
    """
```

## 

1. **Scaffold **：`human_vh3_scaffolds.json` ， `scaffold_id`, `consensus` (fr1, fr2, fr3, fr4, framework_full), `n_members`, `member_ids`

2. **SAFE **： `SAFE_PLAN_DEFINITIONS` ， IMGT  FR2 

3. ****：Stage 2 ，

4. ****： provenance  evidence













