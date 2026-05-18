# VHH 

 VHH 。

## 

### 

1.  VHH  pipeline， `result.json`
2.  Python ：
   ```bash
   pip install python-docx matplotlib numpy
   ```

### 

#### Windows

```batch
REM 
scripts\generate_full_report.bat result.json reports\output EGFR_7D12_VHH

REM  Python 
python scripts\generate_full_report.py result.json reports\output EGFR_7D12_VHH
```

#### Linux/macOS

```bash
#  Shell 
bash scripts/generate_full_report.sh result.json reports/output EGFR_7D12_VHH

#  Python 
python scripts/generate_full_report.py result.json reports/output EGFR_7D12_VHH
```

### 

：

####  1: 

```bash
python scripts/plot_vhh_report_figures_v1.py \
    --input result.json \
    --output_dir reports/output \
    --project-id EGFR_7D12_VHH
```

****：
- `reports/output/EGFR_7D12_VHH/figures/fig2_mutation_heatmap.png`
- `reports/output/EGFR_7D12_VHH/figures/fig3_developability_radar.png`
- `reports/output/EGFR_7D12_VHH/figures/fig5_ranking_stability.png`
- `reports/output/EGFR_7D12_VHH/figures/fig6_cmc_risk_bar.png`

####  2: 

```bash
python scripts/generate_vhh_report_v1.py \
    --input result.json \
    --output_dir reports/output \
    --project-id EGFR_7D12_VHH
```

****：
- `reports/output/EGFR_7D12_VHH/report_v1.md` - Markdown 
- `reports/output/EGFR_7D12_VHH/report_v1.docx` - Word 

## 

```
reports/output/
└── EGFR_7D12_VHH/
    ├── report_v1.md              # Markdown 
    ├── report_v1.docx            # Word 
    └── figures/
        ├── fig2_mutation_heatmap.png
        ├── fig3_developability_radar.png
        ├── fig5_ranking_stability.png
        └── fig6_cmc_risk_bar.png
```

## 

：

1. **** - 
2. **** - 、
3. **IMGT ** - FR/CDR 
4. **Germline FR  Vernier ** - 
5. **Hallmark  VHH ** - VHH 
6. **** - Conservative/Balanced/Aggressive 
7. **CMC Liabilities  Developability** - 
8. **** - T-cell 
9. **（Back-mutation）** - 
10. **QA （v3.5）** - 
11. **（Process Replay Log）** - Pipeline 
12. **** - 

## 

###  1: 

，：
-  Word 
- （PNG ，）
- Markdown 

****：
- ✅ `report_v1.docx` - 
- ✅ `figures/` - 
- ✅ ：`report_v1.md` - 

###  2: 

 Markdown ：
- （Git）
- 
- 

###  3: 

Markdown ：
-  LaTeX
- 
- 

## 

### 

 `reports/templates/vhh_full_report_template.md` 。

 `{{placeholder}}` ，：
- `{{project_id}}` - ID
- `{{input_sequence}}` - 
- `{{qa_summary_section}}` - QA 

### 

 `scripts/plot_vhh_report_figures_v1.py` ， `main` 。

## 

###  1: 

****： `matplotlib not installed`

****：
```bash
pip install matplotlib numpy
```

###  2: DOCX 

****： `python-docx not installed`

****：
```bash
pip install python-docx
```

****： DOCX ，Markdown 。

###  3: 

****： "N/A" 

****：
-  `result.json` 
- 
- （ pipeline ）

###  4: ID

****： `unknown_project`

****：
-  `result.json`  `project_id` 
- ID：`--project-id EGFR_7D12_VHH`

## 

1. ****： `report_v1.md` ， `report_v1.docx`

2. ****：ID， `EGFR_7D12_VHH`  `project1`

3. ****：

4. ****：，：
   - 
   - 
   - QA 
   - 

## 

```bash
# 1.  pipeline
python -m core.vhh_humanization_with_qa \
    --sequence "QVQLVESGGGLVQVGGSLRLSRALS..." \
    --output result.json

# 2. 
python scripts/generate_full_report.py \
    result.json \
    reports/output \
    EGFR_7D12_VHH

# 3. 
ls -la reports/output/EGFR_7D12_VHH/

# 4. 
# Windows:
start reports\output\EGFR_7D12_VHH\report_v1.docx

# Linux/macOS:
open reports/output/EGFR_7D12_VHH/report_v1.docx
```

## 

- [ README](../reports/README.md)
- [](../reports/templates/README.md)
- [](../scripts/plot_vhh_report_figures_v1.py)

















