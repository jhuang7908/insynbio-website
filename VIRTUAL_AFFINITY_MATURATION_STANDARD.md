# Virtual Affinity Maturation Standard — V1.2

**AbEngineCore Module** | **Version:** 1.2 | **Date:** 2026-04-02  
**Status:** ACTIVE — V1.2 adds 2D decision matrix, AF structure stratification, Scenario B/A updates, BioChatter Phase -1  
**Applies to:** All virtual affinity maturation projects (VH/VL, VHH, short peptide, protein antigen)

---

## 1. 

（Virtual Affinity Maturation, VAM） CDR -（ΔΔG），，。

### 

1. **** —  2-6  ΔΔG， 1  6 
2. **** — 、、，
3. **** —  >2 Å ， ΔΔG 
4. **** — ，

---

## 2. 

### 2.1 

|  |  |  | Python  |  |
|------|------|---------|------------|---------|
| **EvoEF2** | 2020 | `tools/EvoEF2_src/EvoEF2.exe` | `AffinityEnergyToolkit.run_evoef2` |  (Tier-1) |
| **PRODIGY** | 2.4.0 | pip: `prodigy-prot` | `AffinityEnergyToolkit.run_prodigy` |  (Tier-1) |
| **OpenMM MM/GBSA** | 8.5.0 | pip: `openmm` | `AffinityEnergyToolkit.run_mmgbsa` |  (Tier-3) |
| **ThermoMPNN** | GitHub | `tools/ThermoMPNN/` | `AffinityEnergyToolkit.run_thermompnn` |  |
| **AntiFold** | 0.3.1 | `tools/AntiFold/` | `AffinityEnergyToolkit.run_antifold` |  |
| **ESM-IF1** | fair-esm 2.0 | pip: `fair-esm` | `AffinityEnergyToolkit.run_esm_if1` |  |
| **HADDOCK3** | 2026.3.0 | WSL Ubuntu-22.04: `haddock3` | CLI via WSL |  |
| **AF2-Multimer** | v3 | ColabFold  |  |  |

### 2.2  API

```python
from core.structure.affinity_energy_toolkit import AffinityEnergyToolkit

tk = AffinityEnergyToolkit(
    complex_pdb="path/to/complex.pdb",
    ab_chains=["H", "L"],   # VH, VL chain IDs
    ag_chains=["A"],         # antigen chain ID(s)
)

# 
mutation = [{"chain": "H", "resi": 99, "wt": "Y", "mut": "A"}]

result = tk.run_evoef2(mutation)       # ~1s,   returns {"ddg": float, ...}
result = tk.run_prodigy(mutation)      # ~4s,   returns {"ddg": float, "dg": float, ...}
result = tk.run_mmgbsa(mutation)       # ~3min, returns {"ddg": float, ...}
result = tk.run_thermompnn(mutation)   # ~6s,   returns {"ddg": float, ...}
result = tk.run_antifold(mutation)     # ~10s,  returns {"ddg": float, ...}
result = tk.run_esm_if1(mutation)      # ~20s,  returns {"ddg": float, ...}
```

### 2.3 CLI 

```bash
# （EvoEF2 + PRODIGY）
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb \
    --ab-chains H L --ag-chains A \
    --mutations H:Y99A H:K100R \
    --tools evoef2 prodigy

# 
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb \
    --ab-chains H L --ag-chains A \
    --mutations H:Y99A \
    --tools all
```

---

## 3. 

### 3.1 （V1.2 ）

**Step 1 — （1： + ）**

```python
if antigen_length <= 30 and antibody_type == 'VHH':
    scenario = 'A-VHH'  #  + VHH（ A +  C ）
elif antigen_length <= 30:
    scenario = 'A-VHL'  #  + VH/VL
elif antibody_type == 'VHH':
    scenario = 'C'      #  + VHH
else:
    scenario = 'B'      #  + VH/VL
```

**Step 2 — （2：structure_source_tier）**

|  |  | Phase 0  |  |
|------|----------|-------------|----------|
|  PDB | PDB_exp |  |  ≤ 2.5 Å，R-free ≤ 0.30 |
| AF2-Multimer ipTM > 0.75 | AF2_high | （≥ 3），HADDOCK3  | pLDDT_interface > 70 |
| AF2-Multimer ipTM 0.60–0.75 | AF2_mid | HADDOCK3  | EvoEF2  |
| AF2-Multimer ipTM < 0.60 | AF2_low | HADDOCK3  | ， |
| AlphaFold 3（AF3） | AF3 | PAE  |  PAE < 10 Å²； HADDOCK3 |
| HADDOCK3  | HADDOCK3_refined |  |  ≥ 60%；VHH  Sampling ≥ 100 |

> **BioChatter **（InSynBio/Therasik ）： Phase -1 BioChatter ， `{scenario, structure_tier, antibody_format, recommended_phase0_path}`， Phase 0 。


### 3.2  A — （≤30 aa）（V1.2 ）

****: 、-MHC、PAG1 

#### 3.2.1  A-VHH（ + VHH ）

|  |  |  |  |
|------|------|------|--------|
|  | AF2-Multimer → **HADDOCK3 **（Sampling ≥ 100） | ，AF2 ； | **** |
| Tier-1  | EvoEF2（ ≥ 3  × 19 AA） | PRODIGY ；CDR3  | **** |
| Tier-1  | PRODIGY |  | **** |
| Tier-2  | ThermoMPNN（ΔΔG > +0.5 → ） | VHH  | **** |
| Tier-2  | AntiFold（VHH ） AbLang |  |  |
| Tier-3  | MM/GBSA（500+ steps， WT ） |  | **** |

**（A-VHH）**:
- **Hallmark  (Kabat 37/44/45/47) **
-  → EvoEF2 ， MM/GBSA 
-  C  EvoEF2  Phase 4.5 

#### 3.2.2  A-VH/VL（ +  VH/VL ）

|  |  |  |  |
|------|------|------|--------|
|  | AF2-Multimer → **HADDOCK3 ** | ，AF2  | **** |
|  | （CDR-H1/H2/H3 + CDR-L1/L2/L3）， | VH/VL  | **** |
| Tier-1  | EvoEF2（ ≥ 3  × 19 AA） | — | **** |
| Tier-1  | PRODIGY |  | **** |
| Tier-2  | ThermoMPNN（ΔΔG > +0.5 → ） | VH/VL  | **** |
| Tier-2  | AbLang（heavy + light ） | VH/VL  |  |
| Tier-3  | MM/GBSA（500+ steps， WT ） |  | **** |

**（A-VH/VL）**:
- Vernier （Kabat VH: 2/27/29/71/73/78/93/94；VL: 36/46/47/48/49/64/66/68/69/71）
-  → EvoEF2 ， MM/GBSA 
-  ≥ 2  CDR ， CDR （Phase 4.5 ）
- EvoEF2 |ΔΔG| > 5 kcal/mol →  artifact，

**PAG1 （A-VHH ）**:
- PRODIGY 36  ΔΔG  1.08–1.86 kcal/mol → 
- EvoEF2 vs MM/GBSA  40% → 
- AntiFold/ESM-IF1 ΔΔG  ±0.05 →  ΔΔG

### 3.3  B — （>30 aa）+ VH/VL （V1.2  V1.1 ）

****: PD-L1、EGFR、HER2、TNFα

|  |  |  |  |
|------|------|------|--------|
|  |  §3.1 2 （PDB_exp ；AF2_mid → HADDOCK3 ；AF2_low → HADDOCK3 ；AF3 → PAE ） |  ΔΔG  | **** |
|  | EvoEF2 --Optimize |  |  |
| Tier-1  | EvoEF2（** ≥ 3  × 19 AA **） | ' CDR × 19 aa'； | **** |
| Tier-1  | ESM-2 （ < 3 ） | EvoEF2 =0  |  |
| Tier-1  | PRODIGY |  |  |
| Tier-2  | ThermoMPNN（ΔΔG > +0.5 → ） |  | **** |
| Tier-2  | AntiFold  AbLang（Δlog-lik/ΔlogP > 0.5 → ） |  |  |
| Tier-3  | MM/GBSA（500 steps，** WT **，） | ； ΔΔG  | **** |
|  | MM/GBSA （Cβ–Cβ ≤ 25 Å  top ，Phase 4.5） |  Epistasis |  |
|  | AF2-Multimer  | ipTM  >0.03 |  |

** B （V1.2 ）**:
- ****： EvoEF2 （ ≥ 3）， CDR 
- **EvoEF2 **：=0  VH/VL ，EvoEF2  →  ESM-2 
- **MM/GBSA **： WT，ΔΔG ； ≥ 3 
- **Vernier **（VH: 2/27/29/71/73/78/93/94；VL: 36/46/47/48/49/64/66/68/69/71） VH/VL 

****: EvoEF2 Pearson r ≈ 0.50–0.58, MM/GBSA r ≈ 0.55–0.70 vs SKEMPI2 

### 3.4  C — VHH 

****:  + VHH/sdAb

|  |  |  |  |
|------|------|------|--------|
|  | AF2-Multimer   HADDOCK3 (Sampling ≥ 100， ≥ 60%) | VHH ； | **** |
| Tier-1  | EvoEF2（ ≥ 3  × 19 AA ） |  CDR3  CDR2/FR2 （：G49、E51  CDR3 ） | **** |
| Tier-1  | ESM-2 （ < 3 /） | EvoEF2 =0 ，ESM-2  |  |
| Tier-2  | ThermoMPNN（ΔΔG > +0.5 → ） | VHH  | **** |
| Tier-2  | AntiFold（VHH ） AbLang（，Python ） | ；AntiFold  AbLang | **** |
| CMC  | pI （ R/K ≥ 3 ，Phase 3 ） |  pI  |  |
| Tier-3  | MM/GBSA（500 steps， WT ，） | ； ΔΔG  | **** |
|  | MM/GBSA （Cβ–Cβ ≤ 25 Å  top ， Phase 4.5） |  Epistasis： |  |

**VHH （V1.1 ）**:
- **Hallmark  (Kabat 37/44/45/47) ** —  VHH 
- ****： ≥ 3 （ CDR1/CDR2/FR2 ） 19-AA 。'CDR3 only'（VGRW-SR-R2 ：G49 FR2、E51 CDR2 ， CDR3 ）
- **EvoEF2 **： = 0 （/）EvoEF2  →  ESM-2  +  MM/GBSA， L1
- ** Epistasis **： top  Cβ–Cβ ≤ 25 Å，——（ < −5 kcal/mol ）
-  ≤ 30 aa →  A  HADDOCK3 
-  VHH humanization ：Framework  humanness + binding

---

## 4. （6 Phase）

```
PHASE -1— BioChatter 
│  : InSynBio / Therasik  BioChatter 
│  : sequence_parser → structure_quality_analyzer → scenario_classifier
│
│  []  antibody_type:
│    VHH : Kabat 44=G, 45=L/M/V, 47=G/W
│    VH/VL : ，Kabat 44=G， VL 
│
│  []  AF2 JSON  ipTM/pLDDT； PDB header /R-free；
│             AF3 PAE  PAE  →  structure_source_tier（ §3.1 2）
│
│  [ P6] SKEMPI2/BindingDB （ ≥ 70%）;
│     ≥ 5  → Phase 2 EvoEF2 
│     →  EvoEF2/MM/GBSA，
│
│  [RAG  P7] PubMed/bioRxiv ;
│    （'EvoEF2  anti-HER2 VHH r≈0.45， L1  −0.8'）
│
│  : {scenario, structure_tier, antibody_format, skempi_hits, threshold_calibration}
│
PHASE 0 —  + 
│  :  +  + （ Phase -1 ）
│  : antigen_length + antibody_type → §3.1 
│  : ipTM > 0.6, pLDDT_interface > 65, BSA > 500 Å²
│  （HADDOCK3）:  ≥ 60%；VHH  Sampling ≥ 100
│  AF3 :  PAE  < 10 Å²（ → HADDOCK3 ）
│   → HADDOCK3 （ Sampling）
│
├── PHASE 1 — Alanine Scan 
│   : EvoEF2
│   :  CDR  → Ala
│   :  (ΔΔG_Ala > +1.0 kcal/mol)
│   : ~2 min
│
├── PHASE 2 — 
│   : EvoEF2 [+ PRODIGY ( B/C)]
│   :  × 19  (~100-200 )
│   : ΔΔG < −0.5 , ΔΔG > +2.0 
│   : 30-80 
│   : ~15 min
│
│   [V1.1 ] =0 /，EvoEF2  →  Phase 2.5 ESM-2 
│
├── PHASE 2.5— ESM-2 
│   :  < 3 /（EvoEF2 L1 ）
│   : ESM-2（fair-esm，masked logP，conda: affmat）
│   :  × 19 AA（VHH 120aa → 2280 ）
│   : ΔlogP > −3 （，）
│   : ΔlogP ； EvoEF2  Phase 3
│   : ~5–10 min（ESM-2 8M/150M，CPU ）
│
│   [V1.1 pI ]  R/K  ≥ 3 ，Phase 2  pI ， pI  > 0.5 
│
├── PHASE 3 —  + 
│   : ThermoMPNN + AntiFold
│   : ThermoMPNN ΔΔG > +0.5 →  
│         AntiFold Δlog-lik > 0.5 →  
│   : 15-30 
│   : ~20 min
│
├── PHASE 4 — MM/GBSA 
│   : OpenMM MM/GBSA (500 minimization steps)
│   : Phase-3  ×  (2-6 )
│   : ΔΔG < −1.0 + ≥2  → 
│   : 5-10 
│   : 2-8 
│
├── PHASE 4.5— （Epistasis Scan）
│   : Phase-4  ≥ 2  top ， Cβ–Cβ  ≤ 25 Å
│   : OpenMM MM/GBSA（ Phase 4 ：Amber14，obc2，500 steps）
│   :  WT / A / B / A+B
│   :
│      = ΔΔG(A+B) − [ΔΔG(A) + ΔΔG(B)]
│     < −5 kcal/mol → （Epistasis），
│     −5 ~ +2 → 
│     > +2 → ，
│   :  MM/GBSA （ΔΔG > 0），（：VGRW-SR-R2 G49A+F112L）
│   : ~15–30 min（4 ）
│
├── PHASE 5 — AF2-Multimer 
│   : ColabFold AF2-Multimer
│   : Phase-4  (3-8 )
│   : ipTM ≥ WT_ipTM − 0.03, 
│   : 3-8 
│
└── PHASE 6 — 
    :  (CSV/JSON)
          ΔΔG  (HTML)
           (SPR/BLI/ELISA)
```

---

## 5. 

### 5.1 EvoEF2

```
: tools/EvoEF2_src/EvoEF2.exe
: AffinityEnergyToolkit.run_evoef2(mutations, wt_dg=None, split=None)

:  (VDW + H-bond + electrostatics + solvation + rotamer)
: Pearson r ≈ 0.50-0.60 vs SKEMPI2; MUE ≈ 1.1 kcal/mol
: < 1 s /  (CPU)
: MIT 

:
  --command=ComputeBinding  
  --command=BuildMutant     ( PDB)
  --split=AB,C              (,)

:
  -  (K/R/D/E/H) :  → 
  - |ΔΔG| > 5 kcal/mol:  →  artifact
  - :  loop/ →  HADDOCK3 
  - =0 （V1.1）: ， 19  ΔΔG → ， ESM-2 
```

### 5.2 PRODIGY

```
Python : prodigy-prot 2.4.0 (pip)
: AffinityEnergyToolkit.run_prodigy(mutations, wt_dg=None)

:  (ICs)  ML 
: Pearson r ≈ 0.73 vs PDBbind ( ΔG)
: ~4 s / 
: Apache 2.0

:  > 50 aa 
:  ≤ 30 aa (，)
```

### 5.3 OpenMM MM/GBSA

```
Python : openmm 8.5.0 (pip)
: AffinityEnergyToolkit.run_mmgbsa(mutations, wt_dg=None, minimization_steps=500)

:  (Amber ff14SB) +  (OBC2 GBSA)
      ΔG_bind = E_complex − E_antibody − E_antigen
: Pearson r ≈ 0.55-0.70 (BM5 benchmark)
: ~3 min /  (200 steps), ~8 min (500 steps)
: MIT

:
  minimization_steps: 200  / 500  / 1000 
  platform:  CUDA → CPU → Reference

:
  -  ( + )
  -  ±2 kcal/mol  
  - ，
  -  WT （V1.1）:  WT，ΔΔG = ΔG(mutant) − ΔG(WT)
  - （V1.1）:  ±5–50 kcal/mol； ≥3 
```

### 5.4 ThermoMPNN

```
: tools/ThermoMPNN/
: ThermoMPNN_default.pt
: AffinityEnergyToolkit.run_thermompnn(mutations, checkpoint=None)

: ProteinMPNN  ΔΔG_stability 
      :  (ΔΔG_fold / ΔTm)
: Pearson r ≈ 0.63-0.70 vs Ssym 
: ~6 s / 

⚠️ : ThermoMPNN  (ΔΔG_stability)， (ΔΔG_binding)
   PAG1 : ThermoMPNN vs MM/GBSA r = −0.786 
   :  — ΔΔG > +0.5 kcal/mol  → 
   :  ThermoMPNN ΔΔG 
```

### 5.5 AntiFold

```
: tools/AntiFold/
: ESM-2 antibody fine-tune 
: AffinityEnergyToolkit.run_antifold(mutations)

:  CDR ，
      ΔΔG_proxy = −RT × (log P(mut) − log P(wt))
:  ； ΔΔG_binding 
: ~10 s / 

: / CDR 
      VHH  ( VHH )
: 

AbLang （V1.1）:  AntiFold  Python ， AbLang 
  : pip install ablang（conda: anarcii）
  : （pseudo-log-likelihood），ΔlogP < −0.3 ，< −1.0 
  : AbLang  AntiFold ，，

PAG1 : ΔΔG  ±0.05 kcal/mol →  ΔΔG 
          AntiFold vs ESM-IF1 r = +0.732 → ，
```

### 5.6 ESM-IF1

```
Python : fair-esm 2.0.0 (pip),  torch-scatter 2.1.2
: AffinityEnergyToolkit.run_esm_if1(mutations, wt_logp=None)

: GVP-GNN + Transformer  (142M )
      ， log-likelihood
: Pearson r ≈ 0.45-0.55 vs ΔΔG_stability (Ssym)
: ~20 s /  (CPU)

 AntiFold : ，，
:  B/C  AntiFold ；ESM-IF1 
```

### 5.7 HADDOCK3

```
: WSL Ubuntu-22.04, pip: haddock3 2026.3.0
: wsl -d Ubuntu-22.04 -- bash -c "haddock3 config.cfg"

: 
  - topoaa: CNS 
  - rigidbody:  + AIR 
  - flexref:  (+ MD)
  - emref:  + 
  - clustfcc: 
  - caprieval: CAPRI  (fnat, irmsd, DockQ)

: , AF2 
: projects/pag1_haddock3/haddock3_pag1.cfg
AIR : projects/pag1_haddock3/ambig_restraints.tbl

PAG1 :
  - 100 , 38  42 
  - 11  cluster, Cluster-5  (fnat=0.737, irmsd=1.19 Å)
  -  ΔΔG 

VHH （V1.1）:
  - Sampling ≥ 100（fast-40 ， VGRW-SR-R2 VHH–HER2）
  - :  ≥ 60%（ Sampling  200 ）
```

### 5.8 ESM-2

```
Python : fair-esm (pip install fair-esm，conda: affmat)
: esm2_t6_8M_UR50D（，≤200 aa） esm2_t30_150M_UR50D
: masked token logP；ΔlogP = logP(mut) − logP(wt)
: ΔlogP > −3.0 → ，；ΔlogP < −5.0 → ，
: ~5–10 min（8M model，CPU，VHH 120aa ）

: （ESM-2）， masked token 
 EvoEF2 : ——EvoEF2 ，ESM-2 
:  < 3 /， EvoEF2 
```

---

## 6. 

### 6.1 

|  |  |  |
|------|------|---------|
| AF2-Multimer rank 1-3 | 3 |  |
| HADDOCK3 Cluster-1 top-3 | 3 |  A  |
|  (X-ray/cryo-EM) | 1 | ， |
| EvoEF2 Optimize  |  |  AF2  |

### 6.2 

```
 N  EvoEF2 + MM/GBSA ΔΔG:

 :
  - ≥ (N-1)/N  ΔΔG 
  - EvoEF2  MM/GBSA  ≥1 

 :
  - ≥ N/2  ΔΔG 
  -  |ΔΔG| > 1.0

 :
  -  ΔΔG 
  - 
```

---

## 7. 

|  |  |  |
|------|------|------|
|  API | `core/structure/affinity_energy_toolkit.py` | 6  + `run_all` |
| CLI | `scripts/affinity_energy_cli.py` |  |
|  | `scripts/pag1_multi_mutation_scan.py` | PAG1 36 |
|  | `scripts/pag1_correlation_analysis.py` |  + HTML  |
| HADDOCK3 Pipeline | `scripts/pag1_haddock3_pipeline.py` | AF2→HADDOCK3→ΔΔG |
|  | `docs/Affinity_Energy_Tools_Guide.md` | 6  |
| **** | `docs/VIRTUAL_AFFINITY_MATURATION_STANDARD.md` |  |
| PAG1  | `projects/PAG-1 project/mutation_scan_results/` | CSV + JSON + HTML  |
| HADDOCK3  | `projects/pag1_haddock3/run/` |  +  +  |

---

## 8. PAG1 Benchmark 

 7m_humanPAG1 （VH+VL vs 32 aa PAG1） 36  × 6 ：

###  (Pearson r, n=36  / n=10 MM/GBSA )

|  | EvoEF2 | PRODIGY | ThermoMPNN | AntiFold | ESM-IF1 | MM/GBSA |
|--|--------|---------|------------|----------|---------|---------|
| EvoEF2 | 1.000 | −0.267 | −0.039 | +0.200 | +0.069 | +0.366 |
| PRODIGY | | 1.000 | +0.259 | −0.019 | −0.148 | −0.661 |
| ThermoMPNN | | | 1.000 | −0.088 | +0.069 | **−0.786** |
| AntiFold | | | | 1.000 | **+0.732** | −0.384 |
| ESM-IF1 | | | | | 1.000 | −0.159 |
| MM/GBSA | | | | | | 1.000 |

### 

- **EvoEF2 + MM/GBSA ** — Y99A  (−12.9 / −4.82)
- **PRODIGY  (<30 aa) ** — ΔΔG  0.78 kcal/mol
- **ThermoMPNN  MM/GBSA ** —  ( vs )
- **AntiFold ≈ ESM-IF1** — r = 0.73, , 
- **** — EvoEF2 ,  MM/GBSA

---

## 9. 

|  |  |  |
|------|------|------|
| 2026-04-02 | 1.2 | （×）、AF（AF3）、A（A-VHH/A-VHL）、BV1.1、Phase -1 BioChatter+SKEMPI2+RAG |
| 2026-04-02 | 1.1 | VGRW-SR-R2 ：、HADDOCK3 VHH 、EvoEF2 =0 、ESM-2 Phase 2.5、CMC pI 、Phase 4.5 、AbLang  AntiFold、MM/GBSA  |
| 2026-04-01 | 1.0 |  —  PAG1 benchmark  |

---

## 10. 

|  |  |  |
|------|------|------|
| PAG1   |  | ✅  |
|  (SKEMPI2 ) | - |  |
| VHH  |  AntiFold VHH  + CDR3  loop  |  |
| SKEMPI2  |  ΔΔG_corrected = a × ΔΔG_raw + b |  |
