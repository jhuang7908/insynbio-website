# VH/VL V4.4 （Execution Contract）
****：InSynBio AbEngineCore / Antibody Engineer Suite  
****： VH/VL （ →  → ）  
****：、 agent ，**、、**；“”**，**。

> ：`config/vh_vl_humanization_v44.json`  V4.4 。

---

## 1) 

### 1.1 /（~800+）
- **，“/”/**，“+”。  
  - /：`data/humanization_assay/categorized_germline_analysis.txt`
- `data/thera_sabdab/out/thera_profile.json`  Thera/SAbDab  `n_total=1133`（/）；  
  ****（//）。

### 1.2 458 （Engineered 458）
** 458 “ Vernier ”**：
- Vernier ：`data/humanization_assay/vernier_index_lookup.json`（**458 **）
- ：`data/humanization_assay/structure_metrics_summary.json`（**458 **）
- /：`data/humanization_assay/vernier_framework_patterns.json`（ 458 ）

---

## 2) Hard Rules

- ****： `projects/<id>_Redesign/` （ 3 ）。
- ****：`data/humanization_assay/`  `data/thera_sabdab/out/` “”，、、，。
- ****：
  -  ~800+  ANARCI  /  / germline 。
  -  458 、SASA/packing/Vernier 。
- **/**：、、TopK 、/、（ V4.4 “//”）。

---

## 3) （Folder Contract）

 ID：`<id>`（、）

```
projects/<id>_Redesign/
  <id>_results.json                 # single source of truth
  <id>_sequences.fasta              # （ mouse + final）
  reports/
    <id>_Client_zh.md
    <id>_Client_zh.pdf              # ， <id>_Client_zh__new.pdf 
    <id>_V44_Audit.md               # （ checklist + ）
  structures/
    <id>_mouse.pdb
    <id>_humanized_v1.pdb
    <id>_humanized_v2.pdb
    <id>_humanized_v3.pdb
  internal/
    phase4_backmutation_<id>.json   # Vernier 22 
```

：

```
delivery_<id>/
  README.md
  reports/<id>_Client_zh.pdf
  sequences/<id>_sequences.fasta
  structures/<id>_mouse.pdb
  structures/<id>_humanized_final.pdb
```

---

## 4) Phase ： vs （Checklist → Compute/Lookup → Evidence）

### Phase 1 —  +  QA（Hard Gate）
- ****： + Dual-scheme numbering（IMGT+Kabat）。
- ****：（PASS/FAIL） results 。

### Phase 2 — （“+”）
- ****：
  - / germline ： `data/humanization_assay/`  `data/thera_sabdab/out/`。
- **“”**； germline 。
- ****（ germline）：
  - `data/germlines/human_ig_aa/_cache/IGHV_kabat_cache.json`
  - `data/germlines/human_ig_aa/_cache/IGKV_kabat_cache.json`
  - ：`python scripts/build_germline_kabat_cache.py`

### Phase 3 — 
- （ABodyBuilder2 / AlphaFold2 ），。

### Phase 4 — Vernier（ + ）
-  `phase4_backmutation_<id>.json`，`backmutation_decisions` ** 22 **（VH14 + VL8）。
-  Vernier ：
  -  → （ AA ）
  -  → “/，”

### Phase 5 — QC
- developability / liabilities / immunogenicity /  QC（CDR RMSD、、canonical、Vernier ）。

### Phase 6 — （Hard Gate）
- ：`python scripts/verify_vhvl_v44_project.py <id> projects/<id>_Redesign`
- ：、、/、Phase4  22 。

---

## 5) “9C1 ”（Compatibility Target）

“”，：
-  V4.4 （dual numbering、Phase4 、、）
- （ + single source of truth + /）
- （/；）

