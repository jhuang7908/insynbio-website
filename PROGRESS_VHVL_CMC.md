# VH/VL CMC 

****: 2026-02-21

---

## 

|  |  |  |  |
|:---:|:---|:---|:---|
| 1 |  | 「」 | — |
| 2 |  |  5.3  | `render_vhvl_v44_reports.py`  `_liability_recommendations`， 5.3、 developability  |
| 3 |  |  CMC  pI  | — |
| 4 |  |  CMC  | `docs/CMC_DESIGN_EXTENSION.md`（SSOT、`design_v3_liabilities` ） |
| 5 |  |  SSOT  |  SSOT  |
| 6 |  |  `design_v3_liabilities` | `core/cmc/cmc_design.py` |
| 7 |  | fix  liability  | `verify_vhvl_v44_project.py`  `_run_cmc_liability_design_if_needed`， pI  |
| 8 |  |  CDR-H2 NYS（N-gly） | `render_vhvl_v44_reports.py` 5.0 「」 |
| 9 | 2026-02-21 | ： PDF | `verify_vhvl_v44_project.py` 6  focused  PDF， JSON+MD |
| 10 | 2026-02-21 |  | `docs/PROGRESS_VHVL_CMC.md` |

---

## 

### 1. CMC 5.3 

|  |  |
|:---|:---|
|  **5.3 ** | `scripts/render_vhvl_v44_reports.py` →  |
|  **** | `scripts/verify_vhvl_v44_project.py` → `internal/developability_{id}.md` |

****： liability （N-glycosylation、deamidation、isomerization、free_Cys）「」「」。

### 2. CMC （design_v3_liabilities）

|  |  |
|:---|:---|
|  | `core/cmc/cmc_design.py` → `design_v3_liabilities` |
| fix  | `scripts/verify_vhvl_v44_project.py` → `_run_cmc_liability_design_if_needed` |
|  | `docs/CMC_DESIGN_EXTENSION.md` |

****：FR-only、（N→Q、D→E）、CDR/Vernier 、SSOT  `results.json` 。

### 3.  5.0 

- 5.0 CMC 「」。

### 4. 

- 6  focused （germline、cmc、developability、immunogenicity、structures、pairing_lookup） JSON + MD， PDF。
- ： PDF、 PDF、V44 Audit PDF。
-  70–80%。

### 5. SSOT 

- ：`projects/<id>_Redesign/<id>_results.json`
- CMC  `results.json` ， `results.json`

---

## 

|  |  |
|:---|:---|
| CMC （liability_design.enabled） |  |

---

## 

|  |  |
|:---|:---|
| 5.3  | `projects/9c1_Redesign/reports/9c1_Client_zh.md`  5.3  |
| 5.0  |  5.0  CMC  |
|  | `projects/9c1_Redesign/internal/developability_9c1.md`  |
| fix  |  `fix 9c1`  |
