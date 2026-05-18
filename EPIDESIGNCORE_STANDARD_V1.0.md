# InSynBio EpiDesignCore — pMHC-TCR 

****: InSynBio EpiDesignCore v1.0  
****: InSynBio  
****: ACTIVE — OWNER-CONTROLLED  
****: 2026-04-01  
****: 1.0.0  
****: InSynBio AbEngineCore v1.0

---

## 、

EpiDesignCore  InSynBio ****， AbEngineCore， InSynBio 。

```
InSynBio 
├── AbEngineCore          ← （VH/VL 、VHH 、CMC）
└── EpiDesignCore         ← （pMHC-TCR 、）
```

### 1.1 EpiDesignCore 

|  |  |  |  |
|------|------|---------|------|
| **PeptideDesigner** | HLA class-I （8-11 aa） | AfDesign / BindCraft | ACTIVE |
| **pMHC-Validator** | HLA  | MHCflurry / NetMHCpan | ACTIVE |
| **TCR-Assessor** | TCR  | NetTCR / PRIME | ACTIVE |
| **EpiDock** | -pMHC /  | HADDOCK3 | ACTIVE |
| **EpiEnergy** |  | OpenMM MM/GBSA | ACTIVE |

### 1.2  AbEngineCore 

|  | AbEngineCore | EpiDesignCore |
|------|-------------|---------------|
|  | （VH/VL、VHH） | （8-11 aa）、T  |
|  |  | HLA  + TCR  |
|  | CDR 、 | 、 |
|  | B  /  | T  / MHC-I  |
|  | EvoEF2, ThermoMPNN, AntiFold | AfDesign, BindCraft, MHCflurry |

---

## 、

### 2.1 HLA class-I 

```

      ↓
8-11 aa 
      ↓
TAP 
      ↓
HLA class-I 
  ├── P2 anchor → B pocket（HLA allele ）
  ├── P9 anchor → F pocket（C）
  └── P4-P8    → （TCR ）
      ↓
pMHC 
      ↓
TCR αβ  pMHC（CDR3α + CDR3β  P4-P8）
      ↓
CD8+ T  → 
```

### 2.2 

```
：  P1   P2   P3   P4   P5   P6   P7   P8   P9
        |    |    |    |    |    |    |    |    |
：       ←——— TCR  ———→  
        |    ↓         |                       ↓
        |  B pocket    |                    F pocket
        |  (HLA)   |                    (HLA)
        |              ↓
        |         AfDesign （P3-P8）
        |
        ↓ P1 N（Tyr/Gly/Met）

：
- P2, P9:  HLA allele （anchor ，）
- P1:     （N Tyr/Gly/Met）
- P3-P8:  （ TCR ，AfDesign ）
```

### 2.3  HLA Allele  Anchor 

| HLA Allele |  | P2  | P9  |  PDB |
|-----------|---------|---------|---------|---------|
| **A\*02:01** | ~40% | Leu, Met, Val | Val, Leu | 1OGA, 3MRE |
| **A\*01:01** | ~16% | Thr, Ser | Tyr | 1W72 |
| **A\*03:01** | ~14% | Val, Leu | Lys, Arg | 1FZK |
| **A\*24:02** | ~20% | Tyr, Phe | Phe, Leu | 1AHO |
| **B\*07:02** | ~12% | Pro | Leu | 1IPF |
| **B\*35:01** | ~8% | Pro | Tyr/Phe | 1A1M |

> ** HLA-A\*02:01**：、（PDB > 1000  pMHC ）、 TCR 。

---

## 、

 EpiDesignCore ，：

| PDB |  | HLA | TCR |  /  |  |
|-----|--------|-----|-----|------------|---------|
| **1AO7** | LLFGYPVYV | A\*02:01 | A6 | HTLV-1 Tax | ， |
| **2NX5** | GILGFVFTL | A\*02:01 | JM22 |  M1 |  |
| **3QEU** | NLVPMVATV | A\*02:01 | RA14 | CMV pp65 |  |
| **1BD2** | LLFGYPVYV | A\*02:01 | B7 | HTLV-1 Tax |  TCR  |
| **4MNQ** | ELAGIGILTV | A\*02:01 | 1G4 |  NY-ESO-1 |  |
| **5HHN** | SIINFEKL | H-2Kb | OT-I | OVA |  |

---

## 、Phase 

EpiDesignCore ，**，**。

### Phase 1：

****： HLA allele、 TCR、

**：**

```
1.1   HLA allele（ HLA-A*02:01）
1.2  ：
     - Mode A： HLA （ TCR ）
     - Mode B：（ TCR + HLA，）
     - Mode C：（ HLA， TCR ）
1.3   /  PDB：
     - HLA apo （Mode A ）
     - TCR:pMHC （Mode B/C ）
1.4  PDB ：
     - （HETATM HOH）
     - 
     - ：A=HLA α, B=β2m, C=, D=TCR α, E=TCR β
1.5   anchor 
```

****：`phase1_target_definition.json`（ allele、PDB、、）

---

### Phase 2：AfDesign / BindCraft 

****： 100-500 

#### 2A：Mode A — HLA Binder 

```python
from colabdesign import mk_afdesign_model

model = mk_afdesign_model(protocol="binder")
model.prep_inputs(
    pdb="HLA_A0201_apo.pdb",
    chain="A",                 # HLA alpha chain
    binder_len=9,              # 9-mer  HLA-A*02:01 
    hotspot="7,24,45,59,63,66,70,74,77,80,84,97,99,114,116,147,152,156,159,163,167,171"
    # HLA-A*02:01 （Kabat/PDB ）
)

# Anchor （P2=Leu/Met, P9=Val/Leu for A*02:01）
model.opt["fix_seq"] = {1: "L", 8: "V"}  # 0-index: pos1=P2, pos8=P9

model.design_3stage(
    soft=100, temp=1.0,    # 1：
    hard=100, temp=0.1,    # 2：
    soft_=100, temp=0.01   # 3：
)
```

#### 2B：Mode B —  Partial 

```python
model = mk_afdesign_model(protocol="partial")
model.prep_inputs(
    pdb="1AO7.pdb",            # TCR:pMHC 
    chain="C",                  # （C）
    rm_extra_seq=True
)

#  TCR （D,E） HLA （A,B），（C）
model.prep_partial(
    rm_aa="C",                  #  C ，
    fix_pos=[0, 1, 8],          #  P1,P2,P9（anchor ）
)

model.design_3stage(soft=200, temp=1.0, hard=200, temp=0.1, soft_=100, temp=0.01)
```

#### 2C：

```python
#  N ，
candidates = []
for seed in range(100):           # 100 
    model.restart(seed=seed)
    model.design_3stage(...)
    seq = model.get_seqs[0]
    score = model.get_loss
    candidates.append({"seq": seq, "af_score": score, "seed": seed})

# 
import json
with open("phase2_candidates.json", "w") as f:
    json.dump(candidates, f, indent=2)
```

**（Gate 2）：**

|  |  |  |
|------|------|------|
| AF2 pLDDT | ≥ 70 | < 70 →  |
| AF2 ipTM（-HLA） | ≥ 0.5 | < 0.5 →  |
| （NW ） | < 90%  | > 90% →  |
|  | ≥ 50  | < 50 →  |

****：`phase2_candidates.json`（≥ 50 ，、AF2 ）

---

### Phase 3：HLA （pMHC-Validator）

****： NetMHCpan / MHCflurry 

#### 3.1 MHCflurry（，）

```python
from mhcflurry import Class1PresentationPredictor

predictor = Class1PresentationPredictor.load

# 
peptides = [c["seq"] for c in candidates]
result = predictor.predict(
    peptides=peptides,
    alleles=["HLA-A*02:01"] * len(peptides),
    include_affinity_percentile=True
)

# 
strong_binders = result[result["affinity_percentile"] < 0.5]   # Rank < 0.5% = 
weak_binders   = result[result["affinity_percentile"] < 2.0]   # Rank < 2.0% = 
```

#### 3.2 

|  | Rank（%） | （nM） |  |
|------|----------|------------|------|
| **（SB）** | < 0.5% | < ~50 nM | ✅  Phase 4 |
| **（WB）** | 0.5-2.0% | 50-500 nM | ⚠️  |
| **（NB）** | > 2.0% | > 500 nM | ❌  |

**（Gate 3）：**
-  ≥ 20 ， Phase 4
-  SB < 20： Phase 2， anchor 

****：`phase3_hla_filtered.csv`（、Rank%、）

---

### Phase 4：TCR （TCR-Assessor）

****： HLA  TCR 

#### 4.1 

|  |  |  TCR |  |
|------|------|----------------|------|
| **NetTCR-2.2** |  + pan-allele | （ TCR ） | `pip install nettcr` |
| **PRIME** |  |  | web / local |
| **ERGO-II** | TCR-epitope  |  TCR CDR3  | GitHub |
| **NetMHC-Immunogenicity** | HLA  |  | DTU web |

#### 4.2  TCR 

```python
# 1： PRIME 
#  pMHC  + T

# 2： TCR 
# ：P4-P8 /（TCR CDR3 ）

def tcr_contact_score(peptide):
    """ TCR （P4-P8）"""
    tcr_face = peptide[3:8]  # P4-P8（0-index）
    preferred = set("RKDEFYWH")  # TCR CDR3 
    score = sum(1 for aa in tcr_face if aa in preferred) / len(tcr_face)
    return score

# 3： VDJdb  TCR 
#  VDJdb（https://vdjdb.cdr3.net/）
#  BLAST/Smith-Waterman  P4-P8  TCR 
```

#### 4.3  TCR 

```python
#  TCR （ VDJdb / ）
#  ERGO-II  TCR-epitope 

tcr_cdr3a = "CAVSDSNYQLIW"   # TCR α CDR3
tcr_cdr3b = "CASIRSSYEQYF"  # TCR β CDR3

#  ERGO-II
ergo_score = predict_tcr_binding(
    cdr3a=tcr_cdr3a,
    cdr3b=tcr_cdr3b,
    epitope=peptide,
    mhc="HLA-A*02:01"
)
```

**（Gate 4）：**

|  |  |  |
|------|------|------|
| TCR （P4-P8） | ≥ 0.4 | < 0.4 →  |
| PRIME / NetTCR  |  50%  |  50% →  |
|  | < 70% （hPepDB） | ≥ 70% →  |

****：`phase4_tcr_filtered.csv`（、HLA rank、TCR 、）

---

### Phase 5：（EpiDock + EpiEnergy）

****： Top-20 

#### 5.1 HADDOCK3 （EpiDock）

**（ Mode ）：**

```toml
#  × HLA （pMHC_dock.cfg）
run_dir = "run_pMHC"

[topoaa]
mol1 = "HLA_A0201.pdb"           # HLA
mol2 = "designed_peptide.pdb"    # （ RDKit/obabel  3D）

[rigidbody]
sampling = 500                    # ，
epsilon = 10.0

[flexref]
# （，）
ligand_mol_fix = false

[emref]
# 

[clustfcc]
clust_cutoff = 0.7

[seletopclusts]
top_models = 4
```

**AIR ：**

```
# pMHC_air.tbl — HLA-A*02:01 × 9-mer
#  P2  B pocket，P9  F pocket
assign (segid A and resi 7 and name ND2)  # Asn7 of HLA-A (B pocket)
       (segid B and resi 2)               # P2 of peptide
       2.0 2.0 0

assign (segid A and resi 116 and name O)  # HLA F pocket 
       (segid B and resi 9)               # P9 of peptide
       2.0 2.0 0
```

#### 5.2 MM/GBSA （EpiEnergy）

```python
# OpenMM MM/GBSA -HLA 
#  affmat  OpenMM 

from scripts.affinity_maturation.mmgbsa_calc import compute_mmgbsa

result = compute_mmgbsa(
    complex_pdb="pMHC_complex_top1.pdb",
    ligand_chain="C",     # 
    receptor_chains=["A", "B"],  # HLA α + β2m
    n_frames=100
)
# result["dG_bind"] = （kcal/mol）
# ：HLA  ΔG ≈ -8 ~ -12 kcal/mol
```

**（Gate 5）：**

|  |  |  |
|------|------|------|
| HADDOCK score | < -20（-HLA） | ≥ -20 →  |
| MM/GBSA ΔG | < -6 kcal/mol | ≥ -6 →  |
| P2/P9 anchor  |  anchor  |  →  AIR  |
|  | （extended） |  →  |

****：`phase5_structural_validated.csv` + Top-5  PDB 

---

## 、

```
Phase 2      Phase 3       Phase 4       Phase 5 
    ↓                 ↓                 ↓                 ↓
AfDesign/BindCraft  MHCflurry         TCR-Assessor     HADDOCK3 + MM/GBSA
 500   →   50-100   →   20-30   →   Top 5-10 
                    (Rank < 0.5%)      (TCR score 50%)  (ΔG < -6 kcal/mol)

：
  - EpiDesignCore_Report_Client.md   
  - EpiDesignCore_Report_Dev.md      
  - Top5_candidates.fasta             
  - Top5_pMHC_structures/            （ PDB）
```

---

## 、

### 6.1 

|  |  |  |  |
|------|------|---------|------|
| **ColabDesign / AfDesign** | `haddock3`（WSL） | `pip install git+https://github.com/sokrypton/ColabDesign.git` | Phase 2  |
| **BindCraft**（ AfDesign） |  env | `git clone https://github.com/martinpacesa/BindCraft` | Phase 2  |
| **MHCflurry 2.0** | `affmat` | `pip install mhcflurry && mhcflurry-downloads fetch` | Phase 3 HLA  |
| **NetMHCpan 4.1** | WSL | DTU  | Phase 3  |
| **NetTCR-2.2** | `affmat` | `pip install nettcr` | Phase 4 TCR  |
| **HADDOCK3** | WSL |  | Phase 5  |
| **OpenMM** | `affmat` |  | Phase 5  |
| **RDKit / OpenBabel** | `affmat` | `conda install -c conda-forge rdkit openbabel` |  3D  |

### 6.2 

```
D:\InSynBio-AI-Research\Antibody_Engineer_Suite\
├── tools/
│   ├── EvoEF2_src/          ✅（AbEngineCore ）
│   ├── ThermoMPNN/          ✅（AbEngineCore ）
│   ├── AntiFold/            ✅（AbEngineCore ）
│   └── ProteinMPNN/         ✅（AbEngineCore ）
│
├── [ for EpiDesignCore]
│   ├── ColabDesign/         ⬜ pip install (WSL)
│   ├── BindCraft/           ⬜ git clone (WSL)
│   └── mhcflurry_models/    ⬜ mhcflurry-downloads fetch (affmat)
│
└── scripts/
    └── epi_design/          ⬜ （EpiDesignCore ）
```

---

## 、

```

│
├──  TCR（ CDR3 ）？
│   ├──  → Mode B（ partial ）
│   │         + Phase 4  ERGO-II 
│   └──  →  ↓
│
├── ？
│   ├──  → Mode C （ P2/P9， P3-P8）
│   └──  → Mode A（ HLA binder ）
│
├── HLA Allele ？
│   ├──  →  §2.3  anchor 
│   └──  →  HLA-A*02:01
│
└── ？
    ├── 9-mer → HLA-A （anchor P2/P9）
    ├── 8-mer → HLA-B （P2/P8 anchor）
    └── 10/11-mer →  anchor （P2/P10  P2/P11）
```

---

## 、

|  |  |  |
|------|------|---------|
| AfDesign  | AF2  < 10 aa  |  pMHC （Mode B > Mode A） |
| AF2  TCR:pMHC  | AF2  pMHC-TCR  |  AlphaFold3 server  RFdiffusion  |
| NetTCR  |  |  PRIME + VDJdb  |
| MM/GBSA  |  |  MD （NVT 200 ns） MM/GBSA |

---

## 、（ AbEngineCore）

### 9.1 
- ✅ 
- ✅ 
- ✅ 
- ✅  AI 

### 9.2 AI 
- ✅  Phase 1-5
- ✅ 
- ✅ 、、
- ✅  `projects/` 
- ❌ ****
- ❌ **（Gate 2-5）**
- ❌ ** HLA **
- ❌ ** AbEngineCore  EpiDesignCore **

### 9.3 （LOCKED FILES）

，AI ：

- `docs/EPIDESIGNCORE_STANDARD_V1.0.md` — 
- `config/epidesigncore_config.json`— 
- `config/hla_anchor_rules.json`— HLA anchor 

---

## 、（CHANGELOG）

|  |  |  |  |
|------|------|---------|--------|
| 2026-04-01 | v1.0.0 | ：EpiDesignCore ，Phase 1-5 ，， AbEngineCore  | InSynBio |

---

## 、（Quick Reference）

### 9-mer （HLA-A\*02:01）

```
:    9 aa
Anchor:   P2 = Leu/Met/Val（B pocket）
          P9 = Val/Leu/Ile（F pocket）
TCR:    P4-P8（，AfDesign ）
HLA PDB:  1OGA（apo），3MRE
TCR PDB:  1AO7（Tax/A6），2NX5（/JM22）

MHCflurry : Rank < 0.5% = 
MM/GBSA :  ΔG < -6 kcal/mol
```

### Phase 

| Phase |  |  |
|-------|------|---------|
| Phase 1 |  + PDB  | 30 min |
| Phase 2 | AfDesign × 100 runs | 2-4 h（GPU）/ 8-16 h（CPU） |
| Phase 3 | MHCflurry  | < 5 min（500 ） |
| Phase 4 | NetTCR + VDJdb  | 15-30 min |
| Phase 5 | HADDOCK3 Top-20  | 2-6 h（ WSL ） |
|  | EpiDesignCore  | 30 min |
| **** | **** | ** 1-2 ** |

---

* EpiDesignCore ，。*  
*：EpiDesignCore v1.0 ‖ AbEngineCore v1.0*
