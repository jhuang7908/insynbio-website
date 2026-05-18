# Affinity Energy Calculation Tools — 
## Virtual Affinity Maturation 

****: v1.0 | ****: `affmat` (conda) | ****: 2026-03-26

---

## ：

|  |  |  |  Toolkit  |
|------|---------|---------|---------------|
| **EvoEF2** | `tools/EvoEF2_src/EvoEF2.exe` | ΔΔG +  | ✅ |
| **ThermoMPNN** | `tools/ThermoMPNN/` | ΔΔG + ΔTm | ✅ |
| **AntiFold** | `tools/AntiFold/` | CDR  | ✅ |
| **ProteinMPNN** | `tools/ProteinMPNN/` | （ ΔΔG） | ❌ |
| **EpiScan** | `tools/EpiScan/` |  /  | ❌ |
| **PRODIGY** | pip: `prodigy_prot` | ΔG  + Kd | ✅ |
| **ESM-IF1** | pip: `fair-esm 2.0.0` |  ΔΔG  | ✅ |
| **OpenMM** | pip: `openmm 8.5.0` | MM/GBSA  | ✅ |
| **AbLang** | pip: `ablang` |  | ❌ |

> **ProteinMPNN**：， ΔΔG 。 CDR ，。  
> **EpiScan**：T ，，。  
> **AbLang**： `scripts/affinity_maturation/ablang_score.py`（L2 ）。

---

## ：ΔΔG  vs 

|  |  | ΔΔG  |  |  |  |
|------|------|---------|------|--------|---------|
| **EvoEF2** |  | r ≈ 0.50–0.60 | **< 5 s** | MIT ✅ | Layer 1  CDR  |
| **PRODIGY** |  +  | r ≈ 0.74 | **< 2 s** | MIT ✅ |  ΔG 、cross-species  |
| **OpenMM MM/GBSA** |  +  | r ≈ 0.55–0.65 | **1–3 min** | MIT ✅ | ， |
| **ESM-IF1** |  | r ≈ 0.45–0.55 | **< 2 s** | MIT ✅ | - |
| **ThermoMPNN** | GNN +  | r ≈ 0.55–0.60 | **< 10 s** | MIT ✅ | ΔΔG + ΔTm， |
| **AntiFold** |  | r ≈ 0.40–0.50 | **< 1 s** | MIT ✅ | CDR ，CDR  |

> ****：Pearson r  ΔΔG （SKEMPI2/ProTherm/Ssym）。  
> ****： `affmat` conda 。  
> Python：`d:\Users\NextVivo\miniconda3\envs\affmat\python.exe`

---

## 、EvoEF2（Layer 1 ）

### 
EvoEF2（Evolutionary Energy Function 2，Huang et al. 2020）****，：
- Van der Waals （12-6 LJ ）
- （ + ）
- 
- （Lazaridis–Karplus ）
- （Ramachandran ）
- 

**ComputeBinding ：**
1. `BuildMutant` — （，< 3 s）
2. `ComputeBinding --split=A,BC` — 
3. ΔΔG = ΔG_bind_mut − ΔG_bind_WT

**EvoEF2  Toolkit ：**
|  |  |
|------|------|
|  | `BuildMutant` —  PDB |
| ** ΔΔG ** | `ComputeBinding` — Layer 1  |

### 
- **Pearson r ≈ 0.50–0.60**（SKEMPI2 -）
- MUE ≈ 1.1 kcal/mol，
- ：Huang et al., Bioinformatics 2020

### 
- ** CDR **（100+ ，< 10 min）— Layer 1 
-  ΔΔG > +0.5 kcal/mol 
- 

### 
|  |  |
|------|------|
| （BuildMutant + ComputeBinding） | < 5 s |
| 100  | < 10 min |
| 50  | < 15 min |

### 

**Python API：**
```python
result = tk.run_evoef2(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_dg=None,           # auto-computed WT if None
    split="A,BC",         # antibody chain A vs antigen chains BC
)
# result["dg"]  = -15.3 kcal/mol
# result["ddg"] = -2.1 kcal/mol (vs WT)
```

**：**
```bash
# 
tools\EvoEF2_src\EvoEF2.exe --command=BuildMutant --pdb=complex.pdb \
    --mutant_file=individual_list.txt

# （individual_list.txt : YA67F;  chain A, Tyr67→Phe）
tools\EvoEF2_src\EvoEF2.exe --command=ComputeBinding --pdb=complex_Model_0001.pdb \
    --split=A,BC
```

**：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A --ag-chains B \
    --tools evoef2 prodigy \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" \
    --output results/L1_scan.csv
```

**：**
- `tools/EvoEF2_src/EvoEF2.exe` — 
- `scripts/affinity_maturation/evoef2_scan.py` — VGRW_SR_R2  L1 
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_evoef2`

---

## 、PRODIGY

### 
PRODIGY（**Pro**tein Binding Energy Prediction）**（Interfacial Contacts, ICs）**。

**：**
1.  5.5 Å 
2. ：charged-charged (CC)、charged-polar (CP)、charged-apolar (CA)、polar-polar (PP)、apolar-polar (AP)、apolar-apolar (AA)
3. （NIS）
4.  ΔG_bind：

```
ΔG = -0.09459·IC_CC + 0.19640·IC_CP - 0.22460·IC_CA
   + 0·IC_PP + -0.18550·IC_AA + 0.34580·f_NIS_charged + 0.10950·f_NIS_apolar - 6.4
```

5. Kd = exp(ΔG / RT)，R = 1.987 cal/mol/K

### 
- ****：144 -（ITC/SPR ）
- **Pearson r ≈ 0.74**，RMSE ≈ 0.9 kcal/mol
- ****：Vangone & Bonvin, eLife 2015；Xue et al., Bioinformatics 2016
- ****：；（< 50 aa），

### 
- ****
- （human/mouse）****
-  ΔG （kcal/mol） Kd（nM）

### 
|  |  |
|------|------|
|  ΔG | < 2 s |
| 20  | < 1 min |
|  CDR （100 ） | < 5 min |

### 

**CLI：**
```bash
conda activate affmat
prodigy complex.pdb --selection A,B C --temperature 25
```

**Python API：**
```python
from core.structure.affinity_energy_toolkit import AffinityEnergyToolkit

tk = AffinityEnergyToolkit(pdb, ab_chains=["A","B"], ag_chains=["C"], evoef2_exe=...)
result = tk.run_prodigy([{"chain":"A","resi":67,"wt":"Y","mut":"F"}])
# result["dg"]    = -12.5 kcal/mol
# result["kd_nM"] = 0.8 nM
# result["ddg"]   = -1.3 kcal/mol (vs WT)
```

**：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools prodigy \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --output results/prodigy_scan.csv
```

**：**
- `scripts/affinity_maturation/prodigy_score.py` — 
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_prodigy`

---

## 、OpenMM MM/GBSA

### 
** / （Molecular Mechanics / Generalized Born Surface Area）**。

**：**
1. EvoEF2  → PDBFixer  → 
2. AMBER ff14SB  + OBC2 
3. Langevin （300 K）（ 300 ）
4. ****（Single-Trajectory Approximation）：

```
ΔG_bind ≈ E_complex - E_antibody - E_antigen
```

****，。

**（AMBER ff14SB + OBC2）：**
- ：bonds + angles + dihedrals + impropers
- ：electrostatics (PME) + VdW (LJ 12-6)
- ： + SASA 

### 
- **Pearson r ≈ 0.55–0.65**（SKEMPI2 ， + ）
-  GB/SA  MD  r ≈ 0.70+， 10–100×
- MUE ≈ 2–4 kcal/mol（， ΔΔG  ~ 1–2 kcal/mol）
- ****：； MD ；

### 
-  L1（EvoEF2） L2（PRODIGY/ThermoMPNN）****
- （E_complex, E_ab, E_ag）
- ΔΔG 

### 
|  | CPU | GPU (CUDA) |
|------|-----|-----------|
| （300 ） | 1–3 min | 15–30 s |
| 8  | ~20 min | ~3 min |
| 50  | ~2.5 h | ~25 min |

> ****：（> 200 aa） `--ag-residue-range C:520:620` ，。

### 

**Python API：**
```python
result = tk.run_mmgbsa(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_dg=-30.88,              # WT ΔG_bind (from previous WT run)
    minimization_steps=300,
    residue_range={"chain":"C","start":520,"end":620},  # optional antigen truncation
)
# result["dg"]        = -34.08 kcal/mol
# result["ddg"]       = -3.20 kcal/mol
# result["e_complex"] = -6172.61 kcal/mol
```

**：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex_repaired.pdb --ab-chains A --ag-chains B \
    --tools mmgbsa \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" "A:67:Y:F+A:70:K:R" \
    --mmgbsa-steps 300 \
    --ag-residue-range B:520:620 \
    --output results/mmgbsa_scan.csv
```

**：**
- `scripts/affinity_maturation/openmm_mmgbsa_v5.py` — （PAG1/HER2 ）
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_mmgbsa`
- `projects/mumab4d5_VGRW_SR_R2/affinity_maturation/openmm_v5_results.csv` — 

**：**
```
variant,e_complex,e_vhh,e_ag,mmgbsa_bind,mmgbsa_ddg,error
WT,-6185.62,-4048.35,-2106.39,-30.88,0.0,
K70R,-6320.76,-4179.83,-2101.66,-39.28,-8.4,
```

---

## 、ESM-IF1 (fair-esm 2.0.0)

### 
ESM-IF1（Inverse Folding with Equivariant Structure Encoder，Hsu et al. 2022） Meta AI ****， GVP-GNN + Transformer。

**：**
- ****： → （AlphaFold）
- ****： → 
- ESM-IF1  P(sequence | backbone)，，

**ΔΔG ：**
```
ΔΔG_proxy = −RT × [log P(mut | backbone) − log P(wt | backbone)]
           = −RT × Δ(log-likelihood)
```

-  =  → 
-  = - → 

****：**** ΔΔG ，** ΔΔG**。 PRODIGY/MM/GBSA 。

****：`esm_if1_gvp4_t16_142M_UR50` (142M ，Apache 2.0)

### 
- ：51.4%（PDB benchmark， ProteinMPNN）
- ΔΔG ：Pearson r ≈ 0.45–0.55（Ssym ）
-  ΔΔG ：，r ≈ 0.30–0.40

### 
- **-**：
-  AntiFold 
- -

### 
|  | CPU | GPU |
|------|-----|-----|
|  | ~30 s（ 142 MB） |  |
|  | ~10 s | ~3 s |
|  | < 2 s | < 0.5 s |
| 100  | ~3 min | < 30 s |

### 

**Python API：**
```python
result = tk.run_esm_if1(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_logp=None,  # auto-computed if None
)
# result["ddg"]      = -0.45  (ΔΔG proxy, kcal/mol)
# result["wt_logp"]  = -1.23
# result["mut_logp"] = -0.47
```

**：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools esm_if1 \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --output results/esm_scan.csv
```

**：**
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_esm_if1`
- `tools/ThermoMPNN/protein_mpnn_utils.py` —  encoder 

---

## 、ThermoMPNN

### 
ThermoMPNN（Dieckhaus et al., PNAS 2024） **ProteinMPNN ** ΔΔG 。

****：Megascale （Tsuboyama et al., Nature 2023）
- ~350,000  ΔΔG （，DSF/CD）
-  >1,400 

**：**
```
PDB → ProteinMPNN Encoder (GNN, 48)
                ↓ 
         Fine-tuned MLP Head
                ↓
         ΔΔG (kcal/mol) + ΔTm (°C)
```

- Encoder： ProteinMPNN v_48_020.pt ， backbone noise σ = 0.20 Å
- Head： Megascale 
- ：****（ ΔΔG ），

### 
- **Pearson r ≈ 0.55–0.60**（Ssym、ProTherm ）
-  ΔTm （RMSE ≈ 2–3 °C）
-  ΔΔG：，（/ ΔΔG  ~70%）

### 
- ****：
- （ GPU ）
-  EvoEF2 ：EvoEF2 ，ThermoMPNN ，

### 
|  | CPU | GPU |
|------|-----|-----|
|  | ~5 s | ~3 s |
|  | ~5–10 s | ~1 s |
| 100  | ~2 min | < 30 s |

### 

**Python API：**
```python
result = tk.run_thermompnn(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    model_weights="vanilla_model_weights/v_48_020.pt",
)
# result["ddg"] = -0.82 kcal/mol (ΔΔG_stability)
```

**：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools thermompnn \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --thermompnn-dir tools/ThermoMPNN \
    --output results/thermo_scan.csv
```

**：**
- `tools/ThermoMPNN/` — （MIT）
- `tools/ThermoMPNN/vanilla_model_weights/v_48_020.pt` — （σ=0.20）
- `tools/ThermoMPNN/model_utils.py` — 

**：**
|  |  |  |
|------|---------|---------|
| `v_48_002.pt` | σ=0.002 | ， |
| `v_48_010.pt` | σ=0.010 |  |
| **`v_48_020.pt`** | σ=0.020 | **** |
| `v_48_030.pt` | σ=0.030 |  |

---

## 、AntiFold

### 
AntiFold（Høie et al., 2024, Oxford Protein Informatics Group）** CDR **（141M ）。

**：**
- OAS（Observed Antibody Space） ~10M 
- SAbDab（Structural Antibody Database）
-  VH/VL  VHH  + CDR 

** ESM-IF1 ：**
|  | ESM-IF1 | AntiFold |
|------|---------|---------|
|  |  | **** |
| CDR  | ~50% | **60–70%** |
| CDR-H3  |  | **** |
|  |  |  Ig  |

**ΔΔG ：**  ESM-IF1 ：
```
ΔΔG_proxy = −RT × Δ(AntiFold log-likelihood)
```

****：`tools/AntiFold/models/model.pt`（，141M ）

### 
- CDR-H1/H2 ：65–70%
- CDR-H3 ：55–60%
-  ΔΔG ：r ≈ 0.40–0.50

### 
- **CDR **： CDR 
- ****：， CDR 
- ： VH/VL -CDR 
- VHH → VH ： CDR 

### 
|  | CPU | GPU |
|------|-----|-----|
|  | ~5 s | ~3 s |
|  | < 1 s | < 0.2 s |
| 100  | ~2 min | < 30 s |

### 

**Python API：**
```python
result = tk.run_antifold(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_logp=None,  # auto-computed
)
# result["ddg"]      = -0.31 kcal/mol (CDR compatibility proxy)
# result["wt_logp"]  = -0.85
# result["mut_logp"] = -0.33
```

**：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools antifold \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --output results/antifold_scan.csv
```

**：**
- `tools/AntiFold/` — （MIT）
- `tools/AntiFold/models/model.pt` — 

---

## 、

### 

```
╔══════════════════════════════════════════════════════════════════╗
║  Layer 1 — （ CDR，100+ ，< 30 min）               ║
║  : EvoEF2 ComputeBinding + PRODIGY + ThermoMPNN              ║
║  : WT complex PDB                                            ║
║  : ΔΔG_EvoEF2 + ΔG_PRODIGY + ΔΔG_ThermoMPNN               ║
║  : ΔΔG_EvoEF2 ≤ +0.5 AND PRODIGY_ΔG  AND ThermoMPNN < 0║
╠══════════════════════════════════════════════════════════════════╣
║  Layer 2 — （top 15–20 ，< 2 h）                 ║
║  : AbLang  + ESM-IF1 + AntiFold                        ║
║        （+ AbEvaluator CMC : pI, SAP, ）           ║
║  : AbLang_Δlogp > -0.3 AND AntiFold_ΔΔG < 0                 ║
╠══════════════════════════════════════════════════════════════════╣
║  Layer 3 — （top 5–10 ，1–3 h）                    ║
║  : OpenMM MM/GBSA（300+ ）                           ║
║        + AF2-Multimer （ipTM  WT）                   ║
║  :  ΔΔG  +  QA                           ║
╚══════════════════════════════════════════════════════════════════╝
```

###  CLI 

```bash
conda activate affmat

# Layer 1: 
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools prodigy thermompnn \
    --mutation-yaml scripts/affinity_maturation/config.yaml \
    --output results/L1_scan.csv

# Layer 2: （ top 15 ）
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools esm_if1 antifold prodigy \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" "A:67:Y:F+A:70:K:R" \
    --output results/L2_scan.csv

# Layer 3: （ 5 ）
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools mmgbsa \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" \
    --mmgbsa-steps 500 --ag-residue-range C:1:100 \
    --output results/L3_mmgbsa.csv --json-output
```

### run_all 

```python
from core.structure.affinity_energy_toolkit import AffinityEnergyToolkit

tk = AffinityEnergyToolkit(
    complex_pdb="complex.pdb",
    ab_chains=["A", "B"],
    ag_chains=["C"],
    evoef2_exe="tools/EvoEF2_src/EvoEF2.exe",
    thermompnn_dir="tools/ThermoMPNN",
)

mutations_list = [
    [],                                                    # WT
    [{"chain":"A","resi":67,"wt":"Y","mut":"F"}],          # Y67F
    [{"chain":"A","resi":70,"wt":"K","mut":"R"}],          # K70R
    [{"chain":"A","resi":67,"wt":"Y","mut":"F"},
     {"chain":"A","resi":70,"wt":"K","mut":"R"}],          # Y67F+K70R
]

results = tk.run_all(
    mutations_list=mutations_list,
    tools=["prodigy", "mmgbsa", "thermompnn"],
    minimization_steps=300,
    output_csv="results/full_scan.csv",
)
```

---

## 、 CSV 

`run_all`  CSV ，：

|  |  |  |
|------|------|------|
| `variant` | — | （ "A67F+A70K"） |
| `prodigy_dg` | PRODIGY | ΔG_bind (kcal/mol) |
| `prodigy_ddg` | PRODIGY | ΔΔG vs WT (kcal/mol) |
| `prodigy_kd_nM` | PRODIGY |  Kd (nM) |
| `prodigy_n_contacts` | PRODIGY |  |
| `mmgbsa_dg` | OpenMM | ΔG_bind (kcal/mol) |
| `mmgbsa_ddg` | OpenMM | ΔΔG vs WT (kcal/mol) |
| `mmgbsa_e_complex` | OpenMM |  (kcal/mol) |
| `esm_ddg` | ESM-IF1 | ΔΔG_proxy (-RT×Δlogp) |
| `esm_wt_logp` | ESM-IF1 | WT  |
| `thermo_ddg` | ThermoMPNN | ΔΔG_stability (kcal/mol) |
| `af_ddg` | AntiFold | CDR  ΔΔG_proxy |
| `*_elapsed` |  |  (s) |
| `*_error` |  | （ null） |

---

## -、（ Toolkit ， tools/ ）

### ProteinMPNN（`tools/ProteinMPNN/`）
****：，。  
** Toolkit **：ProteinMPNN ****， ΔΔG。  
：CDR 、scaffold 。

```python
# ： top-k 
#  tools/ProteinMPNN/protein_mpnn_run.py
python tools/ProteinMPNN/protein_mpnn_run.py \
    --pdb_path complex.pdb \
    --chain_id_jsonl chain_id.jsonl \
    --out_folder mpnn_output/ \
    --num_seq_per_target 100 \
    --sampling_temp "0.1"
```

### EpiScan（`tools/EpiScan/`）
****：-**T **。  
** Toolkit **：EpiScan **（Developability）**。  
****：Python 3.7 + PyTorch 1.11（ `affmat` ，）。  
：[EpiScan web server](http://www.episcan.net:8023/)

### AbLang（pip: `ablang`）
****：****（pseudo-perplexity），。  
****：`scripts/affinity_maturation/ablang_score.py`（L2 ）。

```python
from ablang import pretrained
ab_model = pretrained("heavy")  # or "light"
#  WT 
scores = ab_model([wt_seq, mut_seq], mode="likelihood")
delta_logp = scores[1] - scores[0]  # > -0.3 
```

****：`docs/Virtual_Affinity_Maturation_Methods_Review.md` —  AbLang  L2 （Δlog-p ≥ −0.3/residue）。

---

## 、

###  Python 
|  |  |
|------|------|
| `core/structure/affinity_energy_toolkit.py` | ** API**（， EvoEF2/PRODIGY/MM-GBSA/ESM-IF1/ThermoMPNN/AntiFold） |
| `scripts/affinity_energy_cli.py` | **CLI **（ 6 ， `--mutation-yaml`） |

### （`scripts/affinity_maturation/`）
|  |  |
|------|------|
| `evoef2_scan.py` | EvoEF2  CDR （L1 ，VGRW_SR_R2 ） |
| `prodigy_score.py` | PRODIGY （VGRW_SR_R2 ） |
| `openmm_mmgbsa_v5.py` | MM/GBSA v5（HER2 ，） |
| `ablang_score.py` | AbLang L2  |
| `combo_design.py` | （ + ） |
| `cmc_gate.py` | CMC （pI, SAP, ） |
| `generate_report.py` | （Markdown） |
| `config.yaml` | （、、） |

### （`tools/`）
|  |  |  |  Toolkit  |
|------|------|------|----------------|
| `tools/EvoEF2_src/` | EvoEF2（ + ΔΔG ） | ✅  | ✅ run_evoef2 |
| `tools/ThermoMPNN/` | ThermoMPNN（ΔΔG + ΔTm） | ✅  | ✅ run_thermompnn |
| `tools/AntiFold/` | AntiFold（ CDR ） | ✅  | ✅ run_antifold |
| `tools/ProteinMPNN/` | ProteinMPNN（CDR ） | ✅  | ❌  |
| `tools/EpiScan/` | EpiScan（T ） | ✅  | ❌  Python 3.7  |

### （`docs/`）
|  |  |
|------|------|
| `docs/Affinity_Energy_Tools_Guide.md` | **** —  API +  +  |
| `docs/Virtual_Affinity_Maturation_Methods_Review.md` | （v2.1）—  MPNN 、、AbLang L2  |

### 
```bash
# 
conda activate affmat
# ：
d:\Users\NextVivo\miniconda3\envs\affmat\python.exe

# 
OpenMM       8.5.0
PyTorch      2.11.0+cpu
NumPy        1.26.4  (，AntiFold )
fair-esm     2.0.0
antifold     0.3.1
```

---

## ：PAG1  — 

****：PAG1 （ 30+ aa）， VH/VL  AlphaFold-Multimer 「 + 」。**、CPU、affmat **；GPU  ESM-IF1 / ThermoMPNN / AntiFold；MM/GBSA  CPU 。

### ：（ ΔΔG / ）

|  | / | PAG1  | 100  |
|------|------------------------------|------------------------|---------------------------|
| **EvoEF2** ComputeBinding | r ≈ 0.50–0.60（SKEMPI2），MUE ~1 kcal/mol；**** | ~2–6 s | ~5–12 min |
| **PRODIGY** | r ≈ 0.74（–）；**， Kd ，ΔΔG ** | ~0.5–2 s | ~2–5 min |
| **ThermoMPNN** | r ≈ 0.55–0.60（ ΔΔG）；**「」** | ~1–8 s | ~3–15 min |
| **ESM-IF1** | r ≈ 0.45–0.55；**** |  ~10–30 s， ~1–3 s |  +100  ~5–20 min |
| **AntiFold** | CDR ，**** |  ~5 s， ~0.5–2 s | ~2–8 min |
| **OpenMM MM/GBSA** | r ≈ 0.55–0.65；**、** | ~20–90 s（、~300 ） | ~35 min–2.5 h |

### PAG1 

1. ****： AF2-Multimer ；/****， SKEMPI2  r ，****。  
2. **PRODIGY **：，IC/NIS ，** ΔG/Kd**； WT  **ΔΔG ** EvoEF2/ThermoMPNN ****。  
3. **ThermoMPNN / ESM-IF1 / AntiFold**：**– / **，****； ****，「」。  
4. ****：PAG1  **EvoEF2 + PRODIGY + ThermoMPNN（+ AntiFold/ESM-IF1）** ；**MM/GBSA  Top 10–30** ，。

### 「HER2  MM/GBSA」

`openmm_mmgbsa_v5.py` ****；PAG1 ****，PDBFixer + ，** MM/GBSA ** VHH–HER2  IV ， EvoEF2/PRODIGY。

---

## 、

|  |  |
|------|---------|
| PRODIGY | Vangone & Bonvin, *eLife* 2015; Xue et al., *Bioinformatics* 2016 |
| OpenMM | Eastman et al., *PLOS Comp. Biol.* 2017; AMBER ff14SB: Maier et al. 2015 |
| ESM-IF1 | Hsu et al., *ICML* 2022 |
| ThermoMPNN | Dieckhaus et al., *PNAS* 2024; Megascale: Tsuboyama et al., *Nature* 2023 |
| AntiFold | Høie et al., *bioRxiv* 2024 |
| EvoEF2 | Huang et al., *Bioinformatics* 2020 |
| ProteinMPNN | Dauparas et al., *Science* 2022 |
| SKEMPI2 | Jankauskaitė et al., *Bioinformatics* 2019 |