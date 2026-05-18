# CURSOR_REPORT_ENGINE v4.1 

## 

CURSOR_REPORT_ENGINE v4.1 （VHH / VH / VL /  / ）。

## 

### 1. 

- **Client Report（，）**： / PI / BD 
  - 、、
  - 、、
  -  "（WHY）"， "（HOW）"

- **Developer Report（，）**： / 
  -  Client Report 
  - 、、、

### 2. 

v4.1 ：

1. ✅ **target **：， "Unknown" 
2. ✅ **FR4 Identity**： 0.0% ，
3. ✅ ** N/A**：，
4. ✅ ****： Seq1/Seq2/Seq3 ，
5. ✅ ****： SUMMARY 

### 3. Client Report （13 ）

0. 
1.  QC
2. IMGT 
3. Germline  + 
4. Vernier Zone 
5. VHH / VH Hallmark 
6. CMC Liabilities
7. （Immunogenicity）
8. Developability
9. （Tier 0 / 1 / 2 / 3）
10. （Seq1 / Seq2 / Seq3）
11. 
12. 
13. Glossary

### 4. 

- **Tier 0**：CDR 、VHH hallmark、 Vernier、Cys 
- **Tier 1**： FR  +  CMC / 
- **Tier 2**： / CMC / ， paratope
- **Tier 3（/）**：，

### 5. 

- **Seq1**： +  Tier 1
- **Seq2**：Seq1 + 2–4  Tier 2（ Tier 2， Seq2=Seq1，）
- **Seq3**：Seq1 + 2–4  Tier 3（ Tier 3， Seq3=Seq1，）

## 

### 

```bash
python scripts/generate_dual_report_v4_1.py \
    --input "projects/{PROJECT_ID}/cro_report/raw/raw_result_*.json" \
    --output "projects/{PROJECT_ID}/reports_v4_1_final" \
    --project-id {PROJECT_ID}
```

### Python 

```python
from scripts.generate_dual_report_v4_1 import run_full_report_pipeline

result = run_full_report_pipeline(
    project_id="EGFR_7D12_VHH",
    raw_result_path=Path("projects/EGFR_7D12_VHH/cro_report/raw/raw_result_20251210_183604.json"),
    output_dir=Path("projects/EGFR_7D12_VHH/reports_v4_1_final"),
)
```

## 

 `projects/{PROJECT_ID}/reports_v4_1_final/`：

1. `{PROJECT_ID}_Client_Report_YYYYMMDD_HHMMSS.md` - 
2. `{PROJECT_ID}_Developer_Report_YYYYMMDD_HHMMSS.md` - 
3. `REPORT_GENERATION_SUMMARY.md` - 
4. `FINAL_EVALUATION.md` - 
5. `figures/` - 

## 

，：

```bash
python scripts/plot_vhh_report_figures_v1.py \
    --input "projects/{PROJECT_ID}/cro_report/raw/raw_result_*.json" \
    --output_dir "projects/{PROJECT_ID}/reports_v4_1_final/figures" \
    --project-id {PROJECT_ID}
```

## 

- **v3.0**：，
- **v4.1**：，，

---

****：v4.1  
****：2025-12-11
















