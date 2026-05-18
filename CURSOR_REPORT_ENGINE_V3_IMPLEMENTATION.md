# CURSOR_REPORT_ENGINE v3.0 

**：** 2025-12-10  
**：** ✅ 

---

## 

### 1.  ✅

- **`.cursorrules`**: Cursor 
- **`docs/CURSOR_REPORT_ENGINE_V3.md`**: 

### 2. （Tier 0-3）✅

**：** `core/vhh_mutation_tier_classifier.py`

**：**
- `classify_mutation_tier`: 
- `classify_all_mutations`: 
- `generate_three_final_sequences`: 

**：**
- **Tier 0**: CDR 、VHH hallmark、Vernier 、Cys 
- **Tier 1**:  FR mismatch、 CMC、
- **Tier 2**: /CMC/， paratope
- **Tier 3（/）**: CDR aromatic enrichment、apex rigidification、electrostatic steering

### 3.  ✅

**：** `scripts/generate_dual_report_v3.py`

**：**
- `generate_client_report`:  Client Report
- `generate_developer_report`:  Developer Report

**：**
- Client Report: 、、
- Developer Report: 、、

### 4.  ✅

**Client Report ：** `reports/templates/vhh_client_report_template.md`
-  13 
- 
- 
- 
-  Glossary

**Developer Report ：** `reports/templates/vhh_developer_report_template.md`
-  Client Report 
- 
- 
-  Pseudocode
-  Debug-Friendly Logs

### 5.  ✅

**：** `core/vhh_mutation_tier_classifier.py::generate_three_final_sequences`

**：**
- **Seq1**: Base Humanized · Mandatory Tier 1 Only
- **Seq2**: Safety-Optimized · Tier 1 + 2–4  Tier 2
- **Seq3**: Affinity-Optimized · Tier 1 + T2/T3（≤4 ）

---

## 

### 1.  ⏳

**：**  `scripts/plot_vhh_report_figures_v1.py` 

**：**
- （//）
- （alpha 0.3–0.8）
- 
-  10 

**：**
1. IMGT 
2. Germline mismatch ""
3. Vernier zone 
4. Hallmark 
5. CMC Liabilities （//）
6. MHC-II （： + ）
7. Aggregation hotspot 
8. pI / hydrophobicity 
9. （/）
10. Affinity hotspot 

### 2.  ⏳

**：**  `_build_glossary` 

**：** ：
- FR / CDR 
- Vernier zone
- Hallmark residues（VH / VHH）
- CMC liabilities（、、）
- MHC-II epitope
- Aggregation risk
- Affinity optimization 
- Tier 

### 3.  ⏳

**：**  `scripts/generate_dual_report_v3.py` 

**：**
- `_calculate_pi`:  Bio.SeqUtils.IsoelectricPoint
- `_calculate_gravy`:  Bio.SeqUtils.ProtParam
- `_build_germline_section`:  Germline 
- `_build_hallmark_section`:  Hallmark 
- `_build_cmc_section`:  CMC 
- `_build_immunogenicity_section`: 
- `_build_developability_section`:  Developability 
- `_build_qa_summary`:  QA 

---

## 

### 

```bash
#  Client Report  Developer Report
python scripts/generate_dual_report_v3.py \
    --input result.json \
    --output reports/output \
    --project-id EGFR_7D12_VHH

#  Client Report
python scripts/generate_dual_report_v3.py \
    --input result.json \
    --output reports/output \
    --project-id EGFR_7D12_VHH \
    --client-only

#  Developer Report
python scripts/generate_dual_report_v3.py \
    --input result.json \
    --output reports/output \
    --project-id EGFR_7D12_VHH \
    --developer-only
```

### 

```python
from core.vhh_mutation_tier_classifier import (
    classify_all_mutations,
    generate_three_final_sequences,
)

# 
tiered_mutations = classify_all_mutations(
    mutations=mutations_list,
    sequence=sequence,
    segmentation=segmentation,
    cmc_risks=cmc_risks,
    immunogenicity_risks=immuno_risks,
)

# 
three_sequences = generate_three_final_sequences(
    original_sequence=sequence,
    tiered_mutations=tiered_mutations,
)
```

---

## 

### Client Report 

- [x] 
- [x]  13 
- [x] " +  + "
- [ ] 
- [x] 
- [x] ///
- [x]  Glossary

### Developer Report 

- [x]  Client Report 
- [x] （、、）
- [x] （、、）
- [x]  debug-friendly logs
- [x] 

### 

- [x]  EXACTLY 3 
- [x] Seq1 = Base Humanized（ Tier 1）
- [x] Seq2 = Safety-Optimized（Tier 1 + 2–4  Tier 2）
- [x] Seq3 = Affinity-Optimized（Tier 1 + T2/T3 ≤4 ）

### 

- [x] （Tier 0/1/2/3）
- [x] Tier 0 
- [x] Tier 1 
- [x] Tier 3  warning

---

## 

1. ****：
2. ****：，
3. ****：
4. ****：

---

## 

- **v3.0** (2025-12-10): ，
















