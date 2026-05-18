# InSynBio  — 

****: InSynBio AbEngineCore v1.0  
****: `core/evaluation` +  Pipeline   
****: 2026-02-23  

 evaluation ，********（✅  / ⚠️  / ❌  / 📋 ）。

> ****:  [EVALUATION_MODULE_REDESIGN.md](EVALUATION_MODULE_REDESIGN.md) —  delta_vs_mouse， vs 、、AI /CMC 。

---

## 、ANARCI ，IMGT  Kabat 

|  |  |  |
|------|----------|------|
| **ANARCI ** | ✅  |  ANARCI/ANARCI  VH/VL ； IMGT、Kabat  schemes |
| **IMGT ** | ✅  |  pipeline （`config/vh_vl_humanization_v44.json`  `numbering_scheme: IMGT`）；CDR  IMGT （26–38 / 55–65 / 105–117） |
| **Kabat ** | ✅  |  Kabat； `core/humanization/kabat_utils.kabat_from_anarcii` ， `(pos, ins)`  |
| ** QA** | ✅  | Phase 1 HARD GATE：ANARCI(IMGT) + ANARCI(Kabat) ， `sequence_index` ， |
| **Vernier 22 ** | ✅  | 22  Vernier  IMGT + Kabat ， Phase 4  |

****：VH/VL  IMGT、Kabat  FR/CDR ； scheme  QA；Vernier  IMGT↔Kabat 。

---

## 、

|  |  |  |
|------|----------|------|
| **** | ✅  |  CDR 、FR 、（`run_vhvl_v44_pipeline` ） |
| ** (Golden Pairs)** | ✅  |  **842  germline **（384 natural + 458 engineered）VH/VL ； |
| **** | ✅  | `thera_germline_mapping.csv`、`thera_representatives_by_germline.yaml`  |
| **** | ✅  | AbEvaluator `germline` ： VH 、FR/CDR 、identity%、SHM ； `vernier_index_lookup.json`、`human_VH3_germlines.json` |
| **** | ✅  |  `pairing_lookup_*.json`  VH-VL ；“” |

****： VH/VL ；； identity 。

---

## 、 & 

|  |  |  |
|------|----------|------|
| ** Fab ** | ✅  | ImmuneBuilder ABodyBuilder2： VH+VL  Fab ； **pLDDT** |
| **VHH ** | ✅  | NanoBodyBuilder2：VHH  |
| **** | ✅  / 📋  | **AlphaFold2**（ ColabFold） Ab-Ag ； ipTM、pTM、**pLDDT**  |
| **** | ✅  | **pLDDT**（per-residue  mean）、ipTM、pTM；PipelineQA  pLDDT （70–100 ） |

****：VH/VL  VHH  Fab （ABodyBuilder2）；**** AlphaFold2 ； pLDDT 。

---

## 、 & 

### 4.1 （ Fab）（`structure_13param`）

|  |  | / |
|------|------|-----------|
| **pLDDT** |  | 0–100；> 80 ，> 90  |
| `vh_vl_angle_deg` | VH-VL  | °（ 55–110） |
| `interface_n_pairs` | VH-VL  |  |
| `interface_mean_dist_A` |  | Å |
| `interface_min_dist_A` |  | Å |
| `vernier_sasa_total` | Vernier 22  SASA | Å² |
| `vernier_sasa_per_residue` |  Vernier  SASA | Å² |
| `vernier_packing` | Vernier （4.5 Å） |  |
| `vernier_cdr_distances` | Vernier ↔  CDR  | Å |
| `canonical` | CDR （/） | H1-13-1  |
| `canonical_north` | North （phi/psi） | Standard / Outlier |
| `vernier_dual_numbering` | 22 Vernier  IMGT+Kabat  | JSON |

### 4.2  vs （`delta_vs_mouse`）

|  |  |  |
|------|------|------|
| `angle_delta` |  vs  VH-VL  | < 3° |
| `cdr_rmsd` |  CDR  Cα RMSD |  CDR |
| `cdr_rmsd_max` |  CDR RMSD | < 1.5 Å |
| `cdr_rmsd_pass` | CDR  | PASS/FAIL |

### 4.3 （`binding_site` / `interface_metrics`）

**** Ab-Ag  PDB， ID。

|  |  |  |
|------|------|------|
| **** | BSA |  (Å²) |
| | paratope / epitope  | / |
| |  CDR 、BSA  |  H1/H2/H3/L1/L2/L3 |
| | VH vs VL  | % |
| **** | H-bonds |  |
| | salt bridges |  |
| | hydrophobic contacts |  |
| | Van der Waals | VdW  |
| | π-π stacking |  |
| | cation-π | -π |
| **** | paratope/epitope  |  |
| | charge complementarity |  |
| **** | ΔG_BSA |  ΔG (kcal/mol) |
| **** | SC score | 0–1（ 0.64–0.72） |
| **** | blocking_ref | （ PD-1/PD-L1） |

****：Fab 13 ； vs  delta； AlphaFold2  PDB 。

---

## 、 / CMC 

|  |  |  |
|------|----------|------|
| **pI** | ✅  | Fab （BioPython）； 5.5–8.5 |
| **GRAVY** | ✅  |  |
| **instability index** | ✅  | ；> 40  WARN |
| **net_charge_pH7** | ✅  | pH 7  |
| **SAP ** | ✅  | 9-mer 、7-mer ； |
| **TAP ** | ✅  |  Raybould 2019 ：Total CDR Length, PSH, PPC, PNC, SFvCSP； |
| **CDR ** | ✅  | `cdr_scan`：(NG/NS)、(DG/DS)、(M/W)、(NxS/T)、 Cys |
| **CMC ** | ✅  | `core/cmc/cmc_design.py`：pI>8.5  FR-only  pI  v3；Vernier  CMC  |

****：pI、GRAVY、、、SAP 、CDR 、pI 。

---

## 、InSynBio  In silico Evaluation

|  |  |  |
|------|----------|------|
| **MHC-II T ** | ✅  | 27  IEDB （ API  NetMHCII-4.0/MHCflurry2）；15-mer  |
| **** | ✅  | (a) FR-only；(b) Parker  > -0.5；(c) （IGHV/IGKV/IGLV）；(d)  |
| **** | ✅  | Parker 、SASA （`core/immunogenicity/surface_immuno.py`） |
| **** | ✅  | `format_immunogenicity_section`： risk level、n_high、n_medium、n_tolerated、n_clusters、recommended action |

****：InSynBio  In silico Evaluation — MHC-II 、；（ PBMC T ）。****，；。

---

## 

|  |  |  /  |
|----------|----------|-----------------|
| **** | ANARCI/IMGT/Kabat、842 、、/CMC、InSynBio  In silico | ** Vernier Zone** 、****（ delta_vs_mouse、Vernier 、） |
| **** | ， Vernier Zone、delta_vs_mouse、、CMC  | — |

---

## 、

|  |  |  |
|------|----------|------|
| **AI  affinity ** | ❌  |  AI  |
| **ProteinMPNN** | ⚠️  | `tools/ProteinMPNN/` ，， |
| ** AI ** | ❌  |  AlphaFold-Multimer、IgFold、ESMFold  Ab-Ag  |

****：**** 。。

---

## 、AI  / CMC 

|  |  |  |
|------|----------|------|
| ** CMC ** | ✅  | `core/cmc/cmc_design.py`： pI、Vernier 、FR-only  CMC  |
| **AI  CMC ** | ❌  | / CMC  |
| **/ AI ** | ❌  | SAP、TANGO /， AI  |

****： CMC （pI 、）；**** AI /CMC 。

---

## 、

|  |  |  |
|------|------------|------|
| 1. ANARCI/IMGT/Kabat | 、FR/CDR 、Vernier 22  |  ANARCI； Vernier |
| 2.  | 842  germline 、、 |  thera_sabdab  |
| 3.  | Fab (ABodyBuilder2)、VHH (NanoBodyBuilder2)、Ab-Ag  (AlphaFold2)；pLDDT  | — |
| 4. / | 13 、delta_vs_mouse、 |  PDB |
| 5. /CMC | pI、SAP、CDR 、CMC  |  |
| 6. InSynBio  In silico | MHC-II 、、 | ， |
| 7.  | — | **** |
| 8. AI CMC  | — | **** |

---

## 、

```bash
# 
python Abenginecore/abenginecore.py evaluate my_ab --type fully_human \
  --pdb human.pdb \
  --modules structure_13param developability immunogenicity germline cdr_scan

# （ mouse ）
python Abenginecore/abenginecore.py evaluate my_ab --type humanized \
  --pdb humanized.pdb --ref-pdb mouse.pdb \
  --modules structure_13param delta_vs_mouse developability immunogenicity

# （ antigen_chain）
#  CLI  antigen_chain， Python API  binding_site 
```
