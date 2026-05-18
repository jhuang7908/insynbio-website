# VHH Classic Panel  - 

## 

✅ ****

## 1. 

### 
- **`scripts/generate_vhh_reports_from_panel_json.py`**
  - Classic Panel JSON
  - ：`--panel-json`, `--outdir`, `--project-name`, `--pdf`
  - 

### 

#### A) Client CRO Report
****: `{project_name}_VHH_Client_CRO_Report.md`

****:
1. **（Decision Summary）**
   - Top 1（scaffold × J region）
   - Top 2
   - （canonical、）

2. **（Query Overview）**
   - CDR1/2/3
   - VHH（Cys）

3. **（Canonical Compatibility）**
   - scaffoldcanonical
   - 

4. **（Humanization Results Table）**
   - 8variant
   - canonical + 
   - ：scaffold_id, j_region_id, , Hallmark, Vernier, Canonical, 

5. **（Mutation Summary）**
   - Hallmark
   - Vernier
   - 

6. **（Boundary Statement）**
   - in silico
   - 

****:
- ❌ SHA256、mutations_rules、core/、tests/、byte-level、unit test
- ❌ 、
- ❌ diff、
- ❌ 

#### B) Developer Audit Report
****: `{project_name}_VHH_Developer_Audit_Report.md`

****:
1. **（Run Metadata & Provenance）**
   - JSON
   - Pipeline
   - ScaffoldJ RegionSHA256（provenance）

2. **（Numbering & Boundary Proof）**
   - CDR（、、proxy class）
   - CDR3
   - QA

3. **（Rules Applied）**
   - Rulebook
   - 
   - 
   - **Hallmark**:
     - （44/45MVP）
     - 
     - （37/47/49）
   - **Vernier**:
     - （27-30, 49, 71, 73, 78, 93, 94）
     - （query vs scaffoldCDR）
     - （Tuning vs Anchor）

4. **Variant（Per-Variant Full Mutation Log）**
   - 8variant，：
     - `sequence_grafted_pre_mutation`
     - `sequence_final`
     - `mutations[]`（ID、、From/To、、、、）
     - `mutation_summary`
     - `qa`
     - `canonical`

5. **Canonical（Canonical Layer Proof）**
   - （SHA256）
   - canonicalsequence_final

****:
- ✅ HallmarkVernier
- ✅ SHA256（JSONprovenance）
- ✅ variant（0"none"）

### 
- **`tests/test_generate_vhh_reports.py`**
  - `test_load_panel_json`: JSON
  - `test_sort_variants_for_client`: Variant
  - `test_generate_client_cro_report`: 
  - `test_generate_developer_audit_report`: 
  - `test_client_report_no_technical_details`: 
  - `test_developer_report_contains_required_sections`: 
  - `test_reports_cdr_consistency`: CDR
  - `test_variant_count_consistency`: Variant

****: 8 ✅

### 
- **`scripts/verify_reports.py`**
  - 
  - 、、CDR、variant

## 2. 

### 
```bash
python scripts/generate_vhh_reports_from_panel_json.py \
  --panel-json output/regression_test_7d12/classic_panel_rulebook_v1/vhh_classic_panel.json \
  --outdir output/7D12 \
  --project-name 7D12
```

### PDF（，pandoc）
```bash
python scripts/generate_vhh_reports_from_panel_json.py \
  --panel-json output/regression_test_7d12/classic_panel_rulebook_v1/vhh_classic_panel.json \
  --outdir output/7D12 \
  --project-name 7D12 \
  --pdf
```

### 
```bash
python scripts/verify_reports.py
```

## 3. 

### 
- `output/7D12/7D12_VHH_Client_CRO_Report.md`
- `output/7D12/7D12_VHH_Developer_Audit_Report.md`
- `output/7D12/7D12_VHH_Client_CRO_Report.pdf` 
- `output/7D12/7D12_VHH_Developer_Audit_Report.pdf` 

## 4. 

### ✅ 
- Client CRO Report
- Developer Audit Report

### ✅ 
- ：sha256, mutations_rules, core/, tests/, byte-level, unit test
- 、Query、Canonical、、、

### ✅ 
- HallmarkVernier
- SHA256（JSON）
- variant（0"none"）

### ✅ 
- CDR1/2/3JSON
- Variant8（4 scaffolds × 2 J regions）
- CDR

## 5. 

### 
1. ****: canonical_risk_level (low → medium → high)
2. ****: mutation_count 

### 
- ****: JSON
- ****: Markdown
- ****: JSON

### 
- 
-  `/mnt/data/` 
- 

### 
- JSON
- 
- 

## 6. 

### Client CRO Report
```
# 7D12 VHH Classic Panel 

## 1. （Decision Summary）
###  Top 1
- Scaffold: IGHV3-30*01
- J Region: IGHJ4
- Canonical: MEDIUM
- : ...

## 2. （Query Overview）
- CDR1: GFWYNH
- CDR1: 6 aa
- ...

## 3. （Canonical Compatibility）
| Scaffold | Canonical |  |
|----------|---------------|------|
| IGHV3-23*01 | MEDIUM | ... |

## 4. （Humanization Results Table）
| Scaffold | J Region |  | Hallmark | Vernier | Canonical |  |
|----------|----------|--------|----------|---------|---------------|----------|
| ... | ... | ... | ... | ... | ... | ... |

## 5. （Mutation Summary）
- Hallmark: 8/8 variant
- Vernier: 8/8 variant

## 6. （Boundary Statement）
...
```

### Developer Audit Report
```
# 7D12 VHH Classic Panel 

## 1. （Run Metadata & Provenance）
- JSON: ...
- Scaffold SHA256: ...
- J Region SHA256: ...

## 2. （Numbering & Boundary Proof）
- CDR
- QA

## 3. （Rules Applied）
### 3.1 Hallmark（FR2 44/45）
- 
- 
- 

### 3.2 Vernier
- 
- 
- 

## 4. Variant（Per-Variant Full Mutation Log）
### 4.1 IGHV3-23*01 × IGHJ4
- 
- 
- 
- QA
- Canonical

### 4.2 ... (8variant)

## 5. Canonical（Canonical Layer Proof）
- （SHA256）
```

## 7. 

✅ ****
-  ✅
- Client CRO Report✅
- Developer Audit Report✅
- （8）✅
-  ✅
-  ✅

**！**

