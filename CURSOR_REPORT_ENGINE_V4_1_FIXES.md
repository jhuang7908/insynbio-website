# CURSOR_REPORT_ENGINE v4.1 

**：** 2025-12-11 07:30:24  
**：** v4.1  

---

## 

### ✅  1：FR4 Identity 

**：** FR4 Identity  0.0% 

**：**
1.  IMGT residue_table  FR4 identity
2.  germline  FR4 identity
3. ， ""
4. Developer Report  "FR4 identity source = residue_table/germline_alignment"

**：**
- `_get_fr_identity_v4_1`  `(identity_str, source_str)`
- ：
  1. `alignment_scores.fr4_identity`
  2. IMGT residue_table
  3. （germline_alignment）
  4. ， ""

**：**
- ✅ Client Report ：`FR4 Identity: `
- ✅ Developer Report ：`FR4 identity source：unknown`

---

### ✅  2：

**：** ，

**：**
-  `num_tier2 == 0 and num_tier3 == 0` ，
- ："， Seq1/Seq2/Seq3 ，。"

**：**
- `_build_sequences_identical_note` 
- ：`⚠️ **：** ...`

**：**
- ✅ Client Report  193 

---

### ✅  3：target  immunogenicity 

**：** target  immunogenicity ，

**：**
1. **target ：**
   - ："，，。"

2. **immunogenicity  N/A ：**
   - ："， PBMC 。"

**：**
- `_extract_target_v4_1`  `(target_str, warning_str)`
- `_get_immuno_risk_explanation_v4_1` 
- `_build_immunogenicity_section_v4_1`  N/A 

**：**
- ✅ Client Report  5  target 
- ✅ （，，）

---

## 

### 

1. **`_get_fr_identity_v4_1(result, fr_name)`**
   - ：`tuple[str, str]` → `(identity_str, source_str)`
   -  FR4 identity
   -  0.0% 

2. **`_extract_target_v4_1(result)`**
   - ：`str` → `tuple[str, str]` → `(target_str, warning_str)`
   - 

3. **`_get_immuno_risk_explanation_v4_1(result)`**
   - 
   - 

4. **`_build_sequences_identical_note(sequences_identical, tiered_mutations)`**
   - 
   - 

5. **`_build_developer_report_data_v4_1(result, project_id)`**
   -  `fr4_identity_source` 

6. **`_build_germline_section_v4_1(result)`**
   -  `_get_fr_identity_v4_1` 

7. **`_build_immunogenicity_section_v4_1(result)`**
   -  N/A 

### 

1. **`reports/templates/vhh_developer_report_template.md`**
   -  "FR4 identity source" 

---

## 

### ：EGFR_7D12_VHH

**：** `projects/EGFR_7D12_VHH/cro_report/raw/raw_result_20251210_183604.json`

**：**
- ✅ Client Report：`EGFR_7D12_VHH_Client_Report_20251211_073023.md`
- ✅ Developer Report：`EGFR_7D12_VHH_Developer_Report_20251211_073024.md`

**：**
1. ✅ **target **：
2. ✅ **FR4 Identity**： ""（ 0.0% ）
3. ✅ **FR4 identity source**： Developer Report  "unknown"
4. ✅ ****：
5. ✅ ** N/A **：（，）

---

## 

```bash
python scripts/generate_dual_report_v4_1.py \
    --input "projects/EGFR_7D12_VHH/cro_report/raw/raw_result_20251210_183604.json" \
    --output "projects/EGFR_7D12_VHH/reports_v4_1_final" \
    --project-id EGFR_7D12_VHH
```

---

**：** 2025-12-11 07:30:24  
**：** ✅ 
















