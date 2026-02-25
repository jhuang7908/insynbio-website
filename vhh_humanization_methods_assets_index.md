## VHH Humanization — Methods / Assets Index (IMGT-only)

Workspace root: `d:\InSynBio-AI-Research\Antibody_Engineer_Suite`

This index catalogs **dependencies (“plugins”)**, **databases/assets**, **analysis scripts**, and **key outputs** used in this project for VHH humanization (SR/BM/Native), immunogenicity (IEDB MHC-II), developability/CMC, canonical (North–Dunbrack proxy), and structure-based surface evidence.

---

## 1) Required dependencies (“plugins”) & what they do

- **ANARCI** *(paper name; python package name is `anarcii` in this repo environment)*
  - **Purpose**: IMGT numbering + FR/CDR segmentation (authoritative coordinate system in this repo).
  - **Used by**: `core/numbering/imgt_anarcii.py` (wrapper around ANARCI/`anarcii`) and all downstream scripts needing IMGT position mapping.
  - **Why it matters**: All hallmark/vernier/anchors/ND-dependent logic depends on IMGT numbering correctness.

- **IEDB Tools API (mhcii endpoint)**
  - **Purpose**: In silico MHC-II binding prediction (15-mer, step=1) producing `rank` / `percentile_rank`.
  - **Endpoint**: `https://tools-cluster-interface.iedb.org/tools_api/mhcii/`
  - **Used by**:
    - `scripts/run_slice3_mhcii_immunogenicity_sr_vs_bm.py`
    - `scripts/evaluate_7d12_4krl_variants.py`
  - **Caching**: On-disk TSV caches (see `output/7D12/iedb_cache/` and slice-3 caches inside scripts).

- **Shannon entropy (built-in; no external service)**
  - **Purpose**: Data-driven “surface plasticity” proxy from germline diversity at each IMGT position.
  - **Used by**: `scripts/build_imgt_position_sets.py` (entropy over human VH germline distributions).

- **SciPy / NumPy**
  - **Purpose**: numerical ops, clustering, and in-house SASA implementation dependencies (KD-tree).
  - **Used by**:
    - clustering reports (scipy)
    - structure SASA script (KDTree): `scripts/compute_7d12_4krl_surface_hydrophilicity.py`

---

## 2) Canonical position sets (SSOT) & how they’re generated

- **SSOT YAML (single source of truth)**
  - **File**: `core/data/position_sets/imgt_position_sets.yaml`
  - **Contains**:
    - `imgt_position_sets.imgt_anchor_positions` (anchors)
    - `imgt_position_sets.vhh_hallmark_positions` (VHH hallmark; IMGT 37/44/45/47)
    - `imgt_position_sets.vernier_anchor_positions` (vernier anchors; IMGT 28/29/94)
    - `imgt_position_sets.surface_plasticity_positions_v1` (entropy-driven whitelist)
    - `north_dunbrack.dependent_positions_v2_lite` (optional; slice3-derived proxy sets)

- **Build SSOT YAML**
  - **Script**: `scripts/build_imgt_position_sets.py`
  - **Method**:
    - parse human germline `imgt_map` residues by IMGT position
    - compute Shannon entropy per position within FR ranges (FR1 1–26; FR2 39–55; FR3 66–104)
    - select top-entropy positions (top 30%) → `surface_plasticity_positions_v1`
    - exclude anchors/hallmark/vernier (and ND placeholders)
  - **Audit**: `output/position_sets_generation_audit.md`

- **ND-dependent v2-lite inference**
  - **Script**: `scripts/infer_nd_dependent_positions_slice3_v2_lite.py`
  - **Output**:
    - `output/nd_dependent_slice3_v2_lite_by_class.csv`
    - `output/nd_dependent_slice3_v2_lite_summary.md`
    - `output/nd_dependent_slice3_v2_lite_audit.md`
  - **Writes to**: `core/data/position_sets/imgt_position_sets.yaml` under `north_dunbrack.dependent_positions_v2_lite`

- **Strict surface whitelist (for safer SR)**
  - **Script**: `scripts/build_strict_surface_set.py`
  - **Definition**: `surface_plasticity_positions_v1_strict = surface_plasticity_positions_v1 − (ND-dependent core/candidate union)`
  - **Output**: `output/surface_plasticity_positions_v1_strict.yaml`

- **FR4/J parts library (human J-region patterns)**
  - **File**: `core/data/framework_library/fr4_j_segments.yaml`
  - **Purpose**: defines hJH4 / hJH6 FR4/J sequences used as compatibility parts (not framework).

---

## 3) Template libraries (human / camelid) used for matching & classification

- **Human VH template library (VH3-focused; includes FR segments and IMGT maps)**
  - **File**: `data/germlines/vhh_v1/vhh_germline_assets_clean.jsonl`
  - **Used for**:
    - “most human-like residue” targets at IMGT positions (SR/BM substitution targets)
    - template matching for observed strategy inference (FR1–FR3)

- **Camelid scaffold library (Vicugna consensus scaffolds)**
  - **File**: `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json`
  - **Used for**:
    - alpaca best-hit identity for FR1–FR3 (observed strategy)

- **Camelid J-region (IGHJ)**
  - **File**: `data/germlines/vicugna_pacos_ig_aa/IGHJ_aa.fasta`
  - **Used for**:
    - FR4/J comparison (camelid-vs-human FR4 evidence in observed-strategy analyses)

- **Framework library (human framework positions for mutation burden attribution)**
  - **File**: `core/data/framework_library/vh_frameworks.with_cdr12.canonical_input.yaml`
  - **Used for**:
    - mapping human framework residues at IMGT positions
    - mutation burden (anchors/vernier/hallmark) and template selection logic

---

## 4) Core analysis pipelines (Slice-3)

- **Observed strategy inference (FR1–FR4; human vs alpaca libraries; includes FR4/J matching)**
  - **Script**: `scripts/run_slice3_observed_strategy_association.py`
  - **Outputs**:
    - `reports/slice3_vhh_observed_strategy_labels.csv`
    - `reports/slice3_vhh_observed_strategy_association.md`

- **Immunogenicity (IEDB MHC-II) SR vs BM (slice3; audit-ready)**
  - **Script**: `scripts/run_slice3_mhcii_immunogenicity_sr_vs_bm.py`
  - **Outputs**:
    - peptide-level: `reports/slice3_vhh_mhcii_predictions.parquet` (cols include `rank`, `peptide`, `core_peptide`, `start`, `allele`, `variant`)
    - summary: `reports/slice3_vhh_immunogenicity_features.csv`
    - delta: `reports/slice3_vhh_sr_vs_bm_delta_table.csv`
    - audit: `output/iedb_mhcii_audit.md`
    - mutation log: `output/slice3_vhh_variant_mutations_immuno.jsonl`

- **Developability / CMC (Native/SR/BM; slice3; audit-ready)**
  - **Script**: `scripts/run_slice3_vhh_developability_native_sr_bm.py`
  - **Outputs**:
    - `reports/slice3_vhh_developability_features_native_sr_bm.csv` (uses `score`, `risk_tier`, penalties, liabilities, patch metrics)
    - `reports/slice3_vhh_sr_vs_bm_developability_delta.csv`
    - `reports/slice3_vhh_developability_cluster_report.md`
    - audit: `output/developability_audit.md`
    - mutation log: `output/slice3_vhh_variant_mutations.jsonl`

---

## 5) 7D12 (4KRL) end-to-end assets

- **Structure**
  - **PDB**: `output/7D12/4KRL.pdb`
  - **mmCIF**: `output/7D12/4KRL.cif`

- **Decision-tree recompute (native/sr/bm sequences + mutation lists)**
  - **Mutation log**: `output/7D12/7d12_4krl_variant_mutations.jsonl`

- **7D12 immunogenicity & developability evaluation**
  - **Script**: `scripts/evaluate_7d12_4krl_variants.py`
  - **Outputs**:
    - `output/7D12/7d12_4krl_eval_table.csv`
    - `output/7D12/7d12_4krl_eval_summary.md`
    - `output/7D12/7d12_4krl_eval_audit.md`
    - cache: `output/7D12/iedb_cache/`

- **Structure-based surface hydrophilicity evidence (supports SR)**
  - **Script**: `scripts/compute_7d12_4krl_surface_hydrophilicity.py`
  - **Outputs**:
    - `output/7D12/7d12_4krl_per_residue_surface_metrics.csv`
    - `output/7D12/7d12_4krl_surface_hydrophilicity.md`

---

## 6) “All-in-one” tables / reports

- **Clinical + strategy + functional mutation table (Slice-3)**
  - **Script**: `scripts/generate_comprehensive_vhh_functional_table.py`
  - **Outputs**:
    - `reports/slice3_vhh_comprehensive_functional_library.csv`
    - `reports/slice3_vhh_comprehensive_functional_library.md`

- **Final master summary + 7D12 plan**
  - **Script**: `scripts/generate_final_deliverables.py`
  - **Output**: `reports/FINAL_VHH_MASTER_ANALYSIS_AND_7D12_PLAN.md`

---

## 7) Notes / limitations (important for interpretation)

- **IMGT-only**: All key position logic assumes IMGT positions from **ANARCI**; do not mix Kabat/Chothia coordinates.
- **Shannon entropy surface proxy**: `surface_plasticity_positions_v1` is sequence-statistical; it is not guaranteed to be surface-exposed for a specific structure.
- **Strict surface**: `v1_strict` removes ND-dependent positions, but still may include some buried sites; structure relSASA filtering is recommended when a structure is available (e.g., 7D12 4KRL).
- **IEDB predictions**: binding prediction ≠ clinical ADA; treat as risk signals and prioritize experimental validation for critical candidates.

