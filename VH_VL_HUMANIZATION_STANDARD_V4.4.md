# VH/VL  V4.4（Checklist ）

**：MANDATORY —  V4.3 **  
**：4.4 | ：2026-02-18**  
**：V4.3 ； Checklist **

**⚠️  VHH ，**

---

##  V4.3 

- ****： [`VH_VL_HUMANIZATION_STANDARD_V4.3.md`](./VH_VL_HUMANIZATION_STANDARD_V4.3.md) ，。
- ****： V4.4 /、 Checklist 。

****：[`../config/vh_vl_humanization_v44.json`](../config/vh_vl_humanization_v44.json)

---

## V4.4 

|  |  |
|------|----------|
| **** | 2.0 ： IGHV_aa/IGKV_aa， FR4 |
| **CDR ** | CDR3  105–117；FR4 ， 105–150  |
| **Vernier-CDR ** |  `in_cdr_union`；Phase 4  in_cdr_union=true  BM  |
| **** | same-class ，“” |
| **VL ** | VL =0 ， |
| **QC ** | Phase 5.2b： CDR canonical class  |
| **L2 ** | 2.1  L2 ：kappa CDR2  7 aa， |
| **** | CDR RMSD  0.5 Å  1.5 Å |
| **SAP/IEDB** | SAP ；IEDB  API ；（pLDDT） |
| **** | ： PDB  SASA ，； Parker ， | **[V4.4 ]** |
| ** (Option A)** | （ pI > 8.5），（ IGHV3-23）， CDR （RMSD < 1.5 Å） |

---

##  Checklist（V4.4）

，。

### Phase 1

| # |  | / |
|---|------|-----------|
| 1.1 | CDR ：IMGT + Kabat + Chothia Union  | CDR1/2/3 ，Union 26–38 / 55–65 / 105–117 |
| 1.2 | North canonical class  458  | `cdr_subtype`，`vernier_framework_patterns.json`  |

### Phase 2

| # |  | / |
|---|------|-----------|
| **2.0** | ****： IGHV_aa.json / IGKV_aa.json； FR4（ WGQGT/FGGGT ） |  ID、、 10 aa  **[NEW V4.4]** |
| 2.1 | CDR ：H1/H2/L1 ；**L2 **（kappa  7 aa，） | /；L2  **[L2  V4.4]** |
| 2.2 | ：458  VH/VL  | golden_pair, golden_pair_freq_pct |
| 2.3 | Vernier ：T1×3 + T2×2 + T3×1；** in_cdr_union** | vernier_diff_vh/vk， in_cdr_union **[V4.4]** |
| 2.4 | FR Identity（Union CDR ） | fr_id_pct |
| 2.5 | ：、 | human_review_decision |
| **2.6** | **Option A (Fallback)**:  pI/，（ IGHV3-23）， CDR （RMSD < 1.5 Å） | fallback_germline_used, cdr_rmsd_check **[V4.4 Strategy]** |

### Phase 3

| # |  | / |
|---|------|-----------|
| 3.1 | （ABodyBuilder2）；**** | 4b12_mouse.pdb；pLDDT/ranking **[V4.4]** |
| 3.2a | VH/VL  | vh_vl_angle_deg |
| 3.2b | Vernier SASA  | vernier_sasa |
| 3.2c | Vernier Contact Number  | vernier_packing |
| 3.2d | Vernier→CDR  | vernier_cdr_dist |

### Phase 4

| # |  | / |
|---|------|-----------|
| 4.1 | HC1： G/P/C →  |  |
| 4.2 | HC1-inv： P →  | （ VH_69） |
| 4.3 | HC2：Cys  →  |  |
| 4.4 | HC4：SASA &lt; 20 → （** same-class **） |  **[V4.4]** |
| 4.5 | HC5：CDR  &lt; 4.5 Å → ；**in_cdr_union=true ** |  **[V4.4]** |
| 4.6 | HC6： →  |  |
| 4.SC1 | SC1：VH/VL （Δ&gt;3°  VH_71 ） |  |
| 4.SC2 | SC2：L1→VL_71  | VL_71  |
| 4.SC3 | SC3：VH （VH_71/73/78） |  |
| 4.SC4 | SC4：H2 →VH_71  | VH_71  |
| 4.SC5 | SC5：VH48/VH67  |  VH_48  VH_67 |
| 4.7 | ：→CDR →BM →**FR4 ** |  VH/VL  **[V4.4]** |
| 4.8 | CDR ： CDR  | qc_pass_cdr_integrity |
| **4.9** | **VL **： VL BM （ 0） | vl_bm_count, per_position_reasoning **[NEW V4.4]** |

### Phase 5

| # |  | / |
|---|------|-----------|
| 5.1 | （ABodyBuilder2） | humanized_4b12.pdb |
| 5.2 | CDR RMSD &lt; **1.5** Å（ CDR） | qc_5_2_cdr_rmsd **[ 1.5 V4.4]** |
| **5.2b** | **Canonical class **： H1/H2/L1  | canonical_class_mouse vs humanized **[NEW V4.4]** |
| 5.3 | VH/VL  ≤ 3° | qc_5_3_angle |
| 5.4 | Vernier  P5–P95（WARN ） | qc_5_4_packing **[V4.4]** |
| 5.5 | SAP：； CDR/FR  | qc_5_5 **[V4.4]** |
| 5.6 | pI Fab 5.5–8.5 | qc_5_6_pI |
| 5.7 | （ SASA ） | qc_5_7_liabilities |
| 5.8 | IEDB MHC-II；** API HTTP **；****： PDB  SASA ， | qc_5_8_iedb, iedb_http_status, structure_recompute_sasa **[V4.4]** |

---

## 

- **MUST DO**： `config/vh_vl_humanization_v44.json`  `compliance_rules.must_do` 。
- **MUST NOT DO**： `compliance_rules.must_not_do` 。

****： V4.4 ； V4.3 ， V4.4。
