# Framework Library Canonical Structure Pipeline

This document describes the reproducible pipeline for assigning and analyzing canonical structures for the antibody framework library within the `Antibody_Engineer_Suite`.

## 1. Overview
The pipeline consists of four main stages:
1. **Export**: Extracting sequences from framework library YAMLs to FASTA format.
2. **External Tool Run**: Running canonical classification tools (e.g., SCALOP) on the exported FASTA.
3. **Assignment**: Writing the tool results back into the framework YAMLs with full audit trails.
4. **Comparison**: Statistically comparing the framework library's canonical distribution against therapeutic antibodies (Thera-SAbDab).

---

## 2. Input Files
- **VH Frameworks**: `core/data/framework_library/vh_frameworks.with_cdr12.canonical_input.yaml`
- **VL Frameworks**: `core/data/framework_library/vl_frameworks.with_cdr12.canonical_input.yaml`
- **Thera-SAbDab Metadata**: `Thera-SAbDab_Export.csv` (or `.xlsx`, manually downloaded from SAbDab)
- **Thera-SAbDab Results**: `thera_results.tsv` (Tool output for Thera sequences)

---

## 3. Workflow & Example Commands (Windows PowerShell)

### Step 1: Export Canonical Input FASTA
Extracts sequences using the `canonical_input.sequence_ungapped` field.
```powershell
python scripts/export_canonical_input_fasta.py `
  --vh_yaml core/data/framework_library/vh_frameworks.with_cdr12.canonical_input.yaml `
  --vl_yaml core/data/framework_library/vl_frameworks.with_cdr12.canonical_input.yaml `
  --out_dir output/framework_library/canonical
```
**Output**: 
- `output/framework_library/canonical/framework_vh_canonical_input.fasta`
- `output/framework_library/canonical/framework_vl_canonical_input.fasta`

### Step 2: Run External Tool (Manual/External)
Process the FASTA files using your preferred tool (e.g., SCALOP). The output must be a **TSV following the minimal 4-column contract**: `id`, `cdr`, `class`, `confidence`.

**TSV Format Requirements:**
- **`id`**: Must correspond to the `framework_id` from the FASTA header. If the tool outputs the full header (e.g., `IGHV3-23*01_FR|IGHV3-23*01|VH`), the script will extract the first part before `|` as the `framework_id`.
- **`cdr`**: Loop identifier: `H1`, `H2`, `L1`, `L2`, or `L3`.
- **`class`**: Canonical class label (e.g., `H1-13-1`).
- **`confidence`**: Tool-specific confidence score. If unavailable, use `unknown` (the column must exist, but cells can be empty/NaN).

**Example TSV snippet:**
```tsv
id	cdr	class	confidence
IGHV1-2*02_FR	H1	H1-13-1	0.95
IGHV1-2*02_FR	H2	H2-10-1	0.92
```

### Step 3: Assign Results back to YAML
Updates the framework library with assigned canonical classes.
```powershell
python scripts/assign_canonical_from_tool_output.py `
  --vh_yaml core/data/framework_library/vh_frameworks.with_cdr12.canonical_input.yaml `
  --vl_yaml core/data/framework_library/vl_frameworks.with_cdr12.canonical_input.yaml `
  --vh_tsv output/framework_library/canonical/vh_canonical.tsv `
  --vl_tsv output/framework_library/canonical/vl_canonical.tsv `
  --tool_name SCALOP `
  --tool_version 0.0.0 `
  --out_dir output/framework_library/canonical
```
**Output**: 
- `output/framework_library/canonical/vh_frameworks.canonical_assigned.yaml`
- `output/framework_library/canonical/vl_frameworks.canonical_assigned.yaml`
- `output/framework_library/canonical/assign_canonical_audit.json`

### Step 4: Prepare Thera-SAbDab Dataset

#### 4.1: Download Full Thera-SAbDab Export (Manual)
1. Visit: https://opig.stats.ox.ac.uk/webapps/thera-sabdab/
2. Navigate to "Downloads" tab
3. Download "Download a spreadsheet of all therapeutic sequences/structures (xlsx/csv)"
4. Save as: `data/thera_sabdab/thera_export.xlsx` (overwrite test file)

**Checkpoint**: The script will fail-fast if row count ≤ 100 (indicates test/incomplete data).

#### 4.2: Run QC + Germline Mapping
```powershell
python scripts/prepare_thera_dataset.py
```

**Input**: 
- `data/thera_sabdab/thera_export.xlsx` (must have >100 rows)

**Output**:
- `data/thera_sabdab/thera_qc_pass.xlsx` (QC-passed therapeutics with germline assignments)
- `data/thera_sabdab/thera_germline_mapping.csv` (germline usage statistics)
- `data/thera_sabdab/thera_representatives_by_germline.yaml` (3-5 representatives per germline)

**Processing**:
- QC: Validates VH/VL sequences (20 aa + gaps, length checks)
- ANARCII IMGT numbering for all sequences
- FR1-FR3 extraction and germline matching (best identity)
- Representative selection prioritizing canonical diversity

#### 4.3: Run Canonical Tool on Thera Sequences (External)
Process `thera_qc_pass.xlsx` VH/VL sequences using your canonical tool (e.g., SCALOP).

**Output**: `data/thera_sabdab/thera_canonical.tsv` (4-column minimal contract)

**TSV Requirements**:
- **`id`**: Use INN (lowercase, e.g., `rituximab`)
- **`cdr`**: H1, H2, L1, L2, L3
- **`class`**: Canonical class (e.g., `H1-13-1`)
- **`confidence`**: Tool confidence score

**Validation**:
```powershell
python scripts/validate_thera_canonical_tsv.py
```

This checks:
- Required columns present
- Row count ≈ therapeutics × 5 (at least H1/H2/L1/L2/L3)
- Valid CDR values

#### 4.4: Compare with Thera-SAbDab
Generates statistical reports and distribution distance (JSD).
```powershell
python scripts/compare_canonical_to_thera_sabdab.py `
  --framework_vh_yaml output/framework_library/canonical/vh_frameworks.canonical_assigned.yaml `
  --framework_vl_yaml output/framework_library/canonical/vl_frameworks.canonical_assigned.yaml `
  --thera_csv_or_xlsx data/thera_sabdab/thera_qc_pass.xlsx `
  --thera_canonical_tsv data/thera_sabdab/thera_canonical.tsv `
  --out_dir output/framework_library/canonical/compare_thera
```
**Output**: `output/framework_library/canonical/compare_thera/`

---

## 4. Explanation of Boundaries (The "Synthetic CDR3" Rule)
The framework library is defined by **FR1-FR3** identity. However, canonical tools often require a complete variable domain (VH or VL).
- **Synthetic CDR3/FR4**: The input FASTA contains a placeholder CDR3 (e.g., `AAAAAAAAAAA`) and a consensus FR4.
- **Mandatory Disclaimer**: **synthetic CDR3 placeholder, do not interpret H3/L3.**
- **Strong Comparison**: Results for **H1, H2, L1, L2** are considered highly reliable.
- **Caution**: **L3** results are recorded but should be treated with extreme caution and are excluded from strict distribution comparisons.
- **Excluded**: **H3** is excluded from all statistical comparisons as it lacks a discrete canonical classification system.

---

## 5. Output File Descriptions
| File | Description |
| :--- | :--- |
| `*.canonical_assigned.yaml` | Framework library updated with `canonical` block. |
| `assign_canonical_audit.json` | Contains SHA256 hashes, success/failure counts, and error reasons for traceability. |
| `canonical_coverage_summary.csv` | Unique classes found in library vs therapeutics. |
| `canonical_distribution_distance.csv` | Jensen-Shannon Divergence (JSD) per CDR (lower = more similar to therapeutics). |
| `REPORT_canonical_compare.md` | Human-readable executive summary of the distribution comparison. |

---

## 6. Common Errors & Troubleshooting
- **RuntimeError: Missing 'canonical_input.sequence_ungapped'**: The source YAML is incomplete. Ensure you are using the correct `.canonical_input.yaml` file.
- **RuntimeError: Missing VH/VL sequences in Thera-SAbDab**: The Thera-SAbDab CSV/XLSX export must contain sequence columns (e.g., "VH", "VL", "Heavy", "Light"). Check your export settings on the SAbDab website.
- **Non-zero exit code in Task 2**: This indicates that one or more frameworks failed to get a result for required CDRs (H1/H2 or L1/L2). Check `assign_canonical_audit.json` for specific failure reasons.
- **ImportError / DLL load failed**: This is often a Python environment issue. Ensure dependencies (`pandas`, `PyYAML`, `openpyxl`) are installed in your active environment.
