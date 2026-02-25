# Framework Selection Module

## Overview

The Framework Selection module provides automated selection of human antibody frameworks (VH/VL) and FR4/J segments for antibody humanization and CDR grafting pipelines.

## Key Definitions

### Framework Definition
- **Framework = FR1–FR3 only** (derived from V germline)
- **CDR3 is excluded** by definition
- **FR4/J is NOT part of the framework** - it is a separate compatibility component selected by rules

### Selection Criteria

1. **Primary: FR1–FR3 Identity**
   - Calculated as sequence identity between query FR1-FR3 and framework FR1-FR3
   - Range: 0.0 (no match) to 1.0 (perfect match)
   - **Framework = FR1–FR3 only** (CDR3 and FR4 excluded by definition)

2. **Secondary: Canonical Envelope Match**
   - Checks if query CDR1/CDR2 canonical classes match framework canonical envelope
   - Bonus: +0.05 if both CDR1 and CDR2 match
   - Status: "TODO" if canonical data unavailable (does not crash)
   - No invention: Missing canonical data is marked as TODO

3. **Tertiary: Tags Bonus**
   - Small bonus (+0.02 per tag) for frameworks with requested tags (e.g., `high_solubility`, `compact`)
   - Only applied when explicitly requested by selection rules

4. **CDR3 Length Risk Penalty**
   - Uses framework's `cdr3_policy` to assess CDR3 length risk
   - Penalty calculation:
     - Preferred range (≤ preferred_max): 0.0 penalty
     - Caution range: Linear penalty from 0.0 to 0.05
     - High risk (≥ high_risk_min): Penalty 0.05 + (excess × 0.01), capped at 0.15
   - Penalty is **subtracted** from total score
   - **CDR3 is NOT used in framework identity** - only for risk assessment

## Module Structure

### `core/framework_selection/selector.py`

Production-grade framework selection engine:

- `load_framework_library()`: Loads VH/VL frameworks from YAML
- `compute_query_features()`: Extracts features from ANARCII numbering (CDR-H3 length, etc.)
- `extract_query_fr1_fr3()`: Extracts FR1-FR3 sequence from ANARCII numbering using IMGT ranges
- `calculate_fr_identity()`: Computes FR1-FR3 identity score (0.0 to 1.0)
- `compute_cdr3_risk_penalty()`: Calculates CDR3 length risk penalty based on framework's cdr3_policy
- `check_canonical_match()`: Checks canonical envelope compatibility
- `score_candidates()`: Scores and ranks framework candidates with:
  - FR identity (primary)
  - Canonical match bonus (secondary)
  - Tags bonus (tertiary, if requested)
  - CDR3 risk penalty (subtracted)
- `select_top3_and_final()`: Selects Top3 candidates and applies rules for final selection
- `select_frameworks()`: Main production entry point

### `core/framework_selection/report_renderer.py`

Report rendering:

- `render_framework_selection_section_cn()`: Renders Chinese section
- `render_framework_selection_section_en()`: Renders English section

## Selection Rules

Rules are defined in `core/policies/framework_selection_rules.yaml`:

1. **default_success**: Prefer tier1 frameworks (VH3-23, VK1-39) with default J segments
2. **long_h3**: If CDR-H3 > 18, use hJH6 for VH FR4
3. **high_concentration_or_aggregation**: Allow lambda switch, prefer high_solubility tags
4. **pi_tuning**: Prefer pI_tuning-tagged frameworks, optionally try hJK2
5. **scfv_bispecific**: Prefer compact-tagged frameworks

## Output Format

```python
{
    "top3_vh": [
        {
            "framework_id": "VH:IGHV3-23*01",
            "fr_sequence_fr1_fr3": "...",
            "canonical": {...},
            "tags": [...],
            "_score": 0.95,
            "_score_details": {
                "fr_identity": 0.92,
                "canonical_match": True,
                "canonical_status": "✓ Match",
                "tags_bonus": 0.0,
                "total_score": 0.97
            }
        },
        ...
    ],
    "top3_vl": [...],
    "final_choice": {
        "VH": "VH:IGHV3-23*01",
        "VL": "VL:IGKV1-39*01",
        "FR4_VH": "hJH4",
        "FR4_VL": "hJK1"
    },
    "triggered_rules": [
        {"id": "long_h3", "reason": "..."}
    ],
    "notes": [...]
}
```

## Integration

The module is integrated into CRO report generation:

- **CN reports**: `scripts/generate_egfr_cro_report_cn.py`
- **EN reports**: `scripts/generate_egfr_cro_report.py`

The "Framework Selection Rationale" section is inserted after the "Humanization Results" section and before "Scoring Details".

## Constraints

1. **No invention**: Missing canonical data is marked as "TODO", never invented
2. **FR4 exclusion**: FR4 is **never** used in FR identity calculations - it is selected separately after framework selection
3. **CDR3 exclusion**: CDR3 is **never** used in framework identity - only for risk penalty assessment
4. **Determinism**: Same input always yields same ordering (stable sort by score descending, then framework_id)
5. **Fail-safe**: Missing data does not crash; gracefully handles TODO values
6. **FR4 separation**: FR4/J segments are loaded from separate file and selected by rules, not by framework identity

## Testing

See `tests/test_framework_selection.py` for:
- Determinism tests
- FR4 exclusion tests
- Missing canonical handling tests

## Future Enhancements

- Extract query canonical classes from ANARCII output
- Compute predicted pI from sequence
- Assess aggregation risk from sequence features
- Detect format (scFv, bispecific) from input metadata
