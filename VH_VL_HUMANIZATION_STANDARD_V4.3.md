# VH/VL  V4.3
**：MANDATORY —  VH/VL **  
**：4.3 | ：2026-02-18**  
**：458 **  
**⚠️  VHH ，**

---

## 0. 

```
Phase 1   CDR 
Phase 2  （4）
Phase 3   + Vernier 
Phase 4   + 
Phase 5  （QC）
```

 Phase 。（Phase 3）（Phase 4）。

---

## Phase 1： CDR 

### 1.1 
- ****：Anarcii（IMGT ）
- ****：anarci_shim

### 1.2 CDR （IMGT ）

| CDR | IMGT  |  |
|-----|------------|------|
| H1  | 27–38      |  |
| H2  | 56–65      |  |
| H3  | 105–117    | ， |
| L1  | 27–38      |  + VH/VL  |
| L2  | 56–65      | （kappa ，） |
| L3  | 105–117    | ， |

### 1.3 CDR （Union ）
，：

|  | Union CDR1 | Union CDR2 | Union CDR3 |
|----|-----------|-----------|-----------|
| VH | 26–38（ IMGT  pos 26） | 55–65 | 105–117 |
| VL | 27–38 | 56–65 | 105–117 |

****：Union ，，。

### 1.4  Germline 
-  V （ IMGT pos 104  Cys）
-  IGHV / IGKV / IGLV ，
-  SHM （4B12  germline ）

---

## Phase 2：（4）

****： CDR、""。

###  2.1：CDR 

****： germline  H1、H2、L1 ****。  
****：`data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json`（VH3 ）  
****： Anarcii ， JSON，。

> ****：CDR ， CDR 。

****： `data/humanization_assay/vernier_framework_patterns.json`， `H1-X|H2-Y|L1-Z`  458 （ > 0）。

###  2.2：

****： 458  VH/VL 。  
****：`data/humanization_assay/vh_vl_pairing_report.md`

|  |  |  |
|------|------|------|
| **** | Natural + Engineered  |  +  |
| **** | Engineered ，Natural  |  |
| **** |  | CMC  |

**Top 20 **（ `vh_vl_pairing_report.md`）

###  2.3：Vernier Zone 

****：Tier ， Vernier 。

| Tier | VH （IMGT） | VL （IMGT） |  |
|------|---------------|---------------|------|
| T1   | 71            | 71            | 3.0× |
| T2   | 2,27,28,29,30,69,93,94 | 36,46  | 2.0× |
| T3   | 48,49,67,73,78 | 2,4,49,69,98  | 1.0× |

：
- ：`weight × 2.0`
- ：`weight × 0.5`
- ：`0`

> ****：Vernier  = ，，。

###  2.4：（CDR ）

****： Union CDR  FR （FR1+FR2+FR3）。  
****：Vernier 。

### 

```
Combined = Vernier% × 0.6 + FR_identity% × 0.3 + GoldenBonus% × 0.1
```

****：Top-3 VH  + Top-3 VK ，。

---

## Phase 3： + Vernier 

### 3.1 
- ****：ImmuneBuilder / ABodyBuilder2
- ****：4B12 VH + VL 
- ****：`.pdb` 

### 3.2 

|  |  |  |
|------|------|----------|
| **SASA（Å²）** |  Vernier  | / |
| **Contact Number** | 4.5 Å  | / |
| **VH/VL （°）** | VH  VL  |  |
| **Vernier→CDR （Å）** |  Vernier  CDR  |  |

### 3.3 

|  |  |  |
|------|---------|-----------|
| SASA | < 20 Å² | > 50 Å² |
| Contact Number | > 28 | < 15 |
| Dist to CDR | < 4.5 Å（ CDR） | — |

---

## Phase 4：

### 4.1 

1. **Gly/Pro **：Vernier  G  P → 
2. **Cys **： Cys → 
3. **Tier 1 **：VH 71、VH 94、VL 71、VL 49
4. ****：SASA < 20 Å² → 
5. **CDR **：Dist to CDR < 4.5 Å → 
6. ****：（ VH94 Arg – H3 Asp）

### 4.2 

**：VH/VL **
- ： L1 ≥ 11， L1 ≤ 10（ > 5°）
- ：**** VH 71、VH 94、VL 49（，）

**：L1-VL71 **
- ： L1  ≠  L1 
- ：**** VL 71（VL71  L1 ，r=0.55）

**：VH **
- ： VH 71
- ： VH 73、VH 78；，****
- ：VH71–VH73  r=0.75，VH71–VH78 r=0.61

**：H2-VH71 **
- ： H2-10， H2-9
- ： VH 71

**：**
-  VH 48  VH 67 （r=−0.45），

### 4.3 

| / |  |  |
|----------------|------------|------|
| VH 71 | VH 73, VH 78 | Cluster 1  |
| VL 71 | VL 36 | Cluster 2  |
| VH 48 | VH 67 |  |
| VH 94 | VH 93, VL 4 | Cluster 3 / CDR3  |

### 4.4 

1.  germline 
2. Union CDR （Phase 1.3）， CDR
3. 
4. ****： CDR1/CDR2/CDR3

---

## Phase 5：（QC）

### 5.1 

|  | Pass  |  |
|------|---------|---------|
| CDR RMSD | < 0.5 Å（vs ） | ImmuneBuilder  |
| VH/VL  | < 3°（vs ） |  |

### 5.2 Vernier （ 458 ）

** P5–P95 **（ `vernier_framework_patterns.json` ）：

|  |  |
|------|------|
| VH_71 | Contact Number  P5–P95  = Pass |
| VH_94 |  |
| VL_71 |  |
| VL_49 |  |

-  P5：→， → 
-  P95：→， → 

### 5.3 

|  |  |  |
|--------|------|------|
| SAP  | SAP  |  |
| pI |  | （， 5–9） |

### 5.4 

|  |  |  |
|------|---------|---------|
| N- | N-X-S/T（X≠P）in CDR  FR | （CDR ，FR ） |
|  | NG、NS  |  |
|  | DG、DS  |  |
|  |  Met（SASA>50）、Trp in CDR3 |  |
|  Cys |  Cys |  |

### 5.5 （IEDB MHC-II）

1. ****：IEDB T-cell epitope prediction API
2. ****：27  HLA-DRB1 alleles，9-mer/15-mer 
3. ****：MHC-II 
4. ****： germline 100% 
5. ****： epitope

---

## 

|  |  |  Phase |
|---------|------|-----------|
| `data/humanization_assay/vernier_framework_patterns.json` | CDR 、P5/P95  | 2.1, 5.2 |
| `data/humanization_assay/vh_vl_pairing_report.md` |  | 2.2 |
| `data/humanization_assay/vernier_correlation_report.md` | Vernier  | 4.2 |
| `data/humanization_assay/structure_metrics_summary.json` |  | 3.2  |
| `data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json` | VH3  | 2.1 |
| `data/germlines/human_ig_aa/IGHV_aa.json` |  VH germline  | 2.1 |
| `data/germlines/human_ig_aa/IGKV_aa.json` |  IGKV germline  | 2.1 |

---

## 

### 
- ✅  Phase 1→2→3→4→5 ，
- ✅ Phase 2.1 ， Anarcii， JSON
- ✅ Phase 2.3  Tier  Vernier 
- ✅ Phase 3  Phase 4
- ✅ Phase 4  SASA/Contact Number，
- ✅  `humanization_proposal.json`，
- ✅ Phase 4.4 ：CDR 
- ✅  `vernier_framework_patterns.json` 

### 
- ❌  VHH 、
- ❌ 
- ❌ （SASA、Contact Number ）
- ❌  Union CDR 
- ❌  Anarcii
- ❌ AI （ germline ）

---

*：V4.3 | ：2026-02-18*  
*：Antibody Engineer Suite 458- + ML *  
*：`config/vh_vl_humanization_v43.json`*
