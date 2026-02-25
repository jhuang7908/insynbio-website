# Thera-SAbDab Dataset Upgrade Guide

This guide describes how to upgrade from test data (5 therapeutics) to a real Thera-SAbDab comparison dataset.

## Overview

The upgrade process involves:
1. **Manual download** of full Thera-SAbDab export
2. **Automated QC + germline mapping** using `prepare_thera_dataset.py`
3. **External canonical tool** run on QC-passed sequences
4. **Validation** of canonical TSV output
5. **Comparison** using `compare_canonical_to_thera_sabdab.py`

---

## Step-by-Step Instructions

### A. Data Replacement (Manual Action)

#### A.1: Download Full Thera-SAbDab Export

1. Visit: https://opig.stats.ox.ac.uk/webapps/thera-sabdab/
2. Navigate to the **"Downloads"** tab
3. Click **"Download a spreadsheet of all therapeutic sequences/structures (xlsx/csv)"**
4. Save the downloaded file as: `data/thera_sabdab/thera_export.xlsx` (overwrite existing test file)

#### A.2: Verification Checkpoint

The `prepare_thera_dataset.py` script will **fail-fast** if:
- File has ≤ 100 rows (indicates test data or incomplete export)
- Missing VH/VL sequence columns

**Expected**: Full export should have **>200 therapeutics** with VH/VL sequences.

---

### B. Automated Processing: QC + Germline Mapping

Run the preparation script:

```powershell
python scripts/prepare_thera_dataset.py
```

#### What It Does:

1. **QC Validation**:
   - Validates VH/VL sequences (20 aa letters + optional gaps)
   - Length checks (80-150 aa for VH, 70-130 aa for VL)
   - Removes entries with both chains missing or invalid

2. **ANARCII IMGT Numbering**:
   - Numbers all VH/VL sequences using ANARCII (IMGT scheme)
   - Extracts FR1-FR3 sequences from numbering results

3. **Germline Matching**:
   - Matches therapeutic FR1-FR3 to framework library germlines
   - Uses sequence identity (best match)
   - Aligns with framework library germline names (e.g., `IGHV3-23*01`)

4. **Representative Selection**:
   - Selects 3-5 therapeutics per germline
   - Prioritizes high identity scores
   - (Future: prioritize canonical class diversity)

#### Outputs:

1. **`data/thera_sabdab/thera_qc_pass.xlsx`**:
   - Columns: `Name`, `INN`, `VH`, `VL`, `vh_germline`, `vl_germline`, `vh_identity`, `vl_identity`, `qc_flags`, `qc_pass`
   - Only therapeutics that passed QC and have at least one germline match

2. **`data/thera_sabdab/thera_germline_mapping.csv`**:
   - Columns: `chain`, `germline`, `count`
   - Statistics on germline usage in therapeutics

3. **`data/thera_sabdab/thera_representatives_by_germline.yaml`**:
   - Structure:
     ```yaml
     vh:
       IGHV3-23*01:
         - INN: rituximab
           Name: Rituximab
           identity: 0.95
         - ...
     vl:
       IGKV1-39*01:
         - INN: rituximab
           Name: Rituximab
           identity: 0.92
         - ...
     ```

---

### C. Canonical TSV Generation (External Tool)

#### C.1: Run Canonical Tool

Process `data/thera_sabdab/thera_qc_pass.xlsx` VH/VL sequences using your canonical tool (e.g., SCALOP).

**Input**: Sequences from `thera_qc_pass.xlsx` (VH and VL columns)

**Output**: `data/thera_sabdab/thera_canonical.tsv`

#### C.2: TSV Format Requirements (4-Column Minimal Contract)

| Column | Description | Example |
| :--- | :--- | :--- |
| `id` | **Use INN (lowercase)** | `rituximab` |
| `cdr` | Loop identifier | `H1`, `H2`, `L1`, `L2`, `L3` |
| `class` | Canonical class | `H1-13-1` |
| `confidence` | Tool confidence | `0.88` |

**Important**:
- `id` should match the `INN` field from `thera_qc_pass.xlsx` (lowercase)
- Each therapeutic should have **at least H1, H2, L1, L2** (L3 optional but recommended)
- All 4 columns **must exist** (confidence can be "unknown" if unavailable)

#### C.3: Validation

```powershell
python scripts/validate_thera_canonical_tsv.py
```

This script checks:
- ✅ Required columns present (`id`, `cdr`, `class`, `confidence`)
- ✅ Row count ≈ therapeutics × 5 (at least 3-5 CDRs per therapeutic)
- ✅ Valid CDR values (`H1`, `H2`, `L1`, `L2`, `L3` only)
- ✅ ID format consistency

**Fail-fast**: Script exits with error if validation fails.

---

### D. Comparison (Step 4.4)

Once canonical TSV is validated, run the comparison:

```powershell
python scripts/compare_canonical_to_thera_sabdab.py `
  --framework_vh_yaml output/framework_library/canonical/vh_frameworks.canonical_assigned.yaml `
  --framework_vl_yaml output/framework_library/canonical/vl_frameworks.canonical_assigned.yaml `
  --thera_csv_or_xlsx data/thera_sabdab/thera_qc_pass.xlsx `
  --thera_canonical_tsv data/thera_sabdab/thera_canonical.tsv `
  --out_dir output/framework_library/canonical/compare_thera
```

**Outputs**:
- `canonical_coverage_summary.csv`
- `canonical_frequency_framework.csv`
- `canonical_frequency_thera.csv`
- `canonical_distribution_distance.csv` (only H1/H2/L1/L2)
- `canonical_distribution_distance_caution.csv` (L3, if present)
- `REPORT_canonical_compare.md`

---

## Troubleshooting

### Issue: "CRITICAL: Thera-SAbDab export has only X rows"

**Cause**: Still using test data or incomplete export.

**Solution**: Download the full spreadsheet from Thera-SAbDab website (should have >200 rows).

### Issue: "VH_NO_GERMLINE_MATCH" or "VL_NO_GERMLINE_MATCH"

**Cause**: Therapeutic sequence doesn't match any framework library germline (FR1-FR3 identity too low).

**Solution**: This is expected for some therapeutics. They will be excluded from comparison but logged in `qc_flags`.

### Issue: "TSV has X rows, expected at least Y"

**Cause**: Canonical tool output is incomplete (missing CDRs for some therapeutics).

**Solution**: Check canonical tool logs, ensure all therapeutics in `thera_qc_pass.xlsx` were processed.

### Issue: "Missing required column: confidence"

**Cause**: Canonical tool output doesn't include confidence column.

**Solution**: Add confidence column (can use "unknown" if tool doesn't provide it).

---

## Summary Checklist

- [ ] Downloaded full Thera-SAbDab export (>100 rows)
- [ ] Saved as `data/thera_sabdab/thera_export.xlsx`
- [ ] Ran `prepare_thera_dataset.py` successfully
- [ ] Verified `thera_qc_pass.xlsx` has reasonable QC pass rate (>50%)
- [ ] Ran canonical tool on `thera_qc_pass.xlsx` sequences
- [ ] Generated `thera_canonical.tsv` with 4-column contract
- [ ] Validated TSV using `validate_thera_canonical_tsv.py`
- [ ] Ran `compare_canonical_to_thera_sabdab.py`
- [ ] Reviewed `REPORT_canonical_compare.md`

---

## Notes

- **ANARCII Required**: The preparation script requires ANARCII for IMGT numbering. Install with: `pip install anarcii`
- **Framework Library Dependency**: Germline matching uses `fr_sequence_fr1_fr3` from framework library YAML files
- **Representative Selection**: Currently prioritizes identity scores. Future versions may prioritize canonical class diversity.
- **L3 Caution**: L3 canonical classes are included in frequency reports but excluded from strict JSD calculations (see report disclaimer).
