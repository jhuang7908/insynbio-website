# ESMFold 

 **ESMFold  / ** ，。

---

## 1.  / （scFv linker ）

|  |  |  |  |
|------|------|------|------|
| **scripts/scfv_like_50_linker_anarci_esmfold.py** | Linker 、ANARCI、 ESMFold  FASTA | CSV/Excel（ ID + ） | `linker_split_results.json`、**esmfold_input.fasta** |
| **scripts/run_esmfold_batch_from_fasta.py** |  FASTA  ESMFold（API ） |  FASTA（， VH-linker-VL） |  PDB +  summary CSV |
| **scripts/run_esmfold_lunsekimig.py** | Lunsekimig (VHH)  84  scFv  | CSV（antibody_id, sequence） |  `Lunsekimig1.pdb`  |

- 84 「」 FASTA：`data/design_rules/multispecific_linker_pipeline/esmfold_input_two_sided_84.fasta`  
-  84 ：「84 」。

---

## 2.  ESMFold 

### 2.1  ESMFold API（ GPU）

|  |  |  |
|------|----------|------|
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/h3only_mpnn_temp_sweep/20260129_083507/T0.05/run_esmfold.py** | FASTA：`>id`， `VH:VL` |  VH+G4S3+VL  API， `{id}.pdb` |
| **projects/pembrolizumab/design_rounds/round2_codesign_H3L3/run_esmfold_round2.py** | CSV：`id, vh_seq, vl_seq` | API ； full_seq=vh+vl（ linker）， pLDDT/ |
| **projects/pembrolizumab/run_esmfold_comparison.py** |  |  ESMFold API |
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/run_vl_esmfold.py** | VL  |  ESMFold API |

### 2.2  ESMFold（fair-esm）

|  |  |  |
|------|----------|------|
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/run_esmfold_gate1.py** | FASTA：`>id`， `VH:VL` |  `esm.pretrained.esmfold_v1`， pLDDT、clash、interface contacts ， Top10 |

### 2.3 （ ESMFold  PDB）

|  |  |
|------|------|
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/superpose_vh_structures.py** |  ESMFold  VH  |
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/h3only_mpnn_temp_sweep/.../calc_vh_only_rmsd.py** |  ESMFold PDB  VH， RMSD |
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/h3only_mpnn_temp_sweep/.../analyze_esmfold_structures.py** |  ESMFold  |
| **projects/pembrolizumab/calc_domain_rmsd.py** | ESMFold  Fv  RMSD  |

---

## 3. 84 

- **FASTA**：`data/design_rules/multispecific_linker_pipeline/esmfold_input_two_sided_84.fasta`  
   **VH + (G4S)3 + VL**， linker。

****：：

```bash
python scripts/run_esmfold_batch_from_fasta.py \
  --fasta data/design_rules/multispecific_linker_pipeline/esmfold_input_two_sided_84.fasta \
  --out-dir data/design_rules/multispecific_linker_pipeline/esmfold_predictions \
  --method api
```

 API ： FASTA（id + ）， `requests.post("https://api.esmatlas.com/foldSequence/v1/pdb/", data=sequence)`， `{id}.pdb`（ `run_esmfold.py`）。

---

## 3.1 Lunsekimig（VHH/nanobody） 84  scFv 

**Lunsekimig (SAR443765)**  TSLP/IL-13  NANOBODY®，（VH-only）， 84  VH-linker-VL scFv  ESMFold ，PDB 。

1. ****：Thera-SAbDab ；Lunsekimig1、Lunsekimig2（ Lunsekimig3）。
2. ** CSV**：`data/design_rules/lunsekimig_esmfold_sequences.csv`， `antibody_id`, `sequence`。
3. ****（ 84 ）：

```bash
python scripts/run_esmfold_lunsekimig.py
#  CSV /  / API  local
python scripts/run_esmfold_lunsekimig.py --csv data/design_rules/lunsekimig_esmfold_sequences.csv --out-dir data/design_rules/multispecific_linker_pipeline/esmfold_predictions --method api
```

 `esmfold_input_lunsekimig.fasta`  `run_esmfold_batch_from_fasta.py`， `Lunsekimig1.pdb`、`Lunsekimig2.pdb`  84  scFv  PDB  `esmfold_predictions/`。

---

## 4. API 

- **ESMFold API**：`https://api.esmatlas.com/foldSequence/v1/pdb/`，POST body = 。
- ****：`pip install fair-esm`，`esm.pretrained.esmfold_v1`，`model.infer_pdb(sequence)`。

「84 、、(G4S)3 linker、」：  
**round1_H2_H3edge/.../T0.05/run_esmfold.py**（API + FASTA）， **run_esmfold_gate1.py**（ + ）。  
84  FASTA ， API/， VH:VL 。
