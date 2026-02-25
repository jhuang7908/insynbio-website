# VHH Slice-3 Analysis Extensions

This document summarizes the new artifacts and standardized numbering methodology introduced for the VHH Slice-3 analysis.

## 1. Standardized Numbering (IMGT)
- **Primary coordinate system**: IMGT is the ONLY authoritative coordinate system used in reports and the pipeline.
- **Reference Document**: `docs/report_numbering_immunization_methods.md` (English & Chinese).
- **Kabat usage**: Reserved for legacy cross-reference only.

## 2. CDR3 Engineering Feature Vector
The VHH Slice-3 master table has been extended with a high-dimensional engineering feature vector for CDR3 sequences to support downstream CMC and immunogenicity risk assessment.

- **Master Table**: `data/slice3_vhh_paper_grade_master_table_plus_cdr3_features.csv`
- **Computed Features**:
  - `cdr3_len`: CDR3 length (IMGT 105-117).
  - `cdr3_hydrophobic_frac`: Fraction of residues in {A,I,L,M,F,W,V,Y}.
  - `cdr3_aromatic_frac`: Fraction in {F,W,Y}.
  - `cdr3_gly_frac`, `cdr3_pro_frac`, `cdr3_gp_frac`.
  - `cdr3_cys_count`: Count of extra Cysteines (potential disulfide/aggregation risk).
  - `cdr3_ngly_motifs`: Count of N-glycosylation motifs (NXS/T, X!=P).
  - `cdr3_max_hydrophobic_run`: Longest consecutive hydrophobic patch.
  - `cdr3_net_charge_est`: Estimated charge at physiological pH ((K+R+H) - (D+E)).

- **Risk Assessment**:
  - **Summary**: `output/slice3_cdr3_feature_summary.md` (grouped by humanization strategy).
  - **Red-flag list**: `output/slice3_cdr3_feature_redflags.csv` (records exceeding engineering thresholds).

## 3. IMGT Position Sets (SSOT)
A single source of truth (SSOT) for IMGT position sets has been established to ensure consistency across the pipeline.

- **YAML Source**: `core/data/position_sets/imgt_position_sets.yaml`
- **Key Position Sets**:
  - `imgt_anchor_positions`: FR/CDR boundaries and key structural anchors.
  - `vhh_hallmark_positions`: Positions 37, 44, 45, 47.
  - `vernier_anchor_positions`: Positions 28, 29, 94.
  - `surface_plasticity_positions_v1`: Data-driven whitelist of high-entropy framework positions (computed from human VH germline distribution).
- `surface_plasticity_positions_v1_strict`: Derived set excluding positions present in any North-Dunbrack canonical-dependent set (v2-lite), used for safer resurfacing planning.
- **Generation Audit**: `output/position_sets_generation_audit.md` detailing the entropy calculation and exclusion logic.

## 4. Automation Scripts
- `scripts/build_cdr3_feature_vector.py`: Generates the extended master table and CDR3 summaries.
- `scripts/build_imgt_position_sets.py`: Generates the YAML position sets and audit logs.
- `scripts/infer_nd_dependent_positions_slice3_v2_lite.py`: Infers North–Dunbrack canonical-dependent positions (v2-lite).
- `scripts/apply_vhh_decision_tree_v1.py`: Applies the VHH humanization decision tree, now integrated with ND-dependent structural guardrails and tiered back-mutation plans.
