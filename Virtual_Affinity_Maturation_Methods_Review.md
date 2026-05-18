# Virtual Affinity Maturation — Computational Methods Review
## 

****: v2.1 | ****: 2026-03-31  
****: ** + AI ******（/）； ΔΔG 。** MPNN**。**ProteinMPNN / AbMPNN / IgMPNN  CDR **，****。

**v2.1 **  
- ：**MPNN =  CDR **；** =  MPNN**。

**v2.0  v1.0 **  
- ：** CDR、**， MPNN 。  
- **** **AbLang**（ / ）。  
-  **L1 / L2 / L3 **。  
-  **CMC / developability **（ AbEvaluator ）。

---

## 、（ · ）

************，；**** **ProteinMPNN**（ **ThermoMPNN** ， §2.1）。

```
①  +      → 、BSA、hot-spot（AI/）
② L1      →  ΔΔG （EvoEF2 ）
③       → AbLang  /  WT 
④ L2/L3  → ThermoMPNN、AF2-Multimer、 MM/GBSA
⑤ CMC             → pI、、、ADI、
```

**MPNN 、**  
- **/**（、ΔΔG 、AF2 ）：**** ProteinMPNN / AbMPNN / IgMPNN；** + **。  
- ** CDR **（ CDR  redesign、）：**** **ProteinMPNN**（ AntiFold、dyMEAN ），**** AbLang + CMC 。  
- **ThermoMPNN**： MPNN， **ΔΔG / ΔTm **， L2 ，****「 CDR」。

---

## 、

### 2.1 ΔΔG 

|  |  |  |  |  |  |  |
|------|------|------|------|--------|---------|------|
| **EvoEF2** |  | ★★★★★ | ★★★ | MIT | ✅  |  exe， |
| **FoldX** |  | ★★★★ | ★★★★ |  ⚠️ | ✅  |  |
| **Rosetta ddg_monomer** |  | ★★★ | ★★★★ |  ⚠️ | ✅  |  |
| **ESM-IF1 ΔΔG** |  | ★★★★ | ★★★★ | MIT | ✅ /GPU | Meta AI， |
| **SASA-ΔΔG** | / | ★★★★★ | ★★ | ， | ✅  |  |
| **OpenMM MM/GBSA** |  | ★★ | ★★★★★ | MIT | ✅  |  |
| **PRODIGY** | ML+ | ★★★★ | ★★★ |  web | 🌐 Web |  ΔG  |
| **mCSM-AB2** |  | ★★★★ | ★★★★ |  web ⚠️ | 🌐 Web | ， |
| **DDGun3D** | ML | ★★★ | ★★★ |  web | 🌐 Web | + |
| **ThermoMPNN** | GNN（ ProteinMPNN）| ★★★★ | ★★★★ | MIT | ✅  | **ΔΔG + ΔTm **；****， L2 **** |

> ⚠️ = ；✅ = ；🌐 =  Web 

---

### 2.2  / （「 CDR 」）

> **。** ** CDR **。

|  |  |  |  |  |  |
|------|------|------|--------|--------|----------|
| **ProteinMPNN** | GNN  | ★★★★★ | ★★★★ | MIT | ** CDR /  redesign** |
| **AbMPNN / IgMPNN** |  | ★★★★ | ★★★★ | MIT | ， |
| **AntiFold** |  | ★★★★ | ★★★★ | MIT | CDR  redesign |
| **dyMEAN** | CDR  | ★★★ | ★★★★★ | MIT | CDR loop  |
| **ESM-IF1** | Transformer | ★★★★ | ★★★★ | MIT | /；**** ΔΔG ，**** |
| **LigandMPNN** | GNN +  | ★★★★ | ★★★ | MIT | ， |

---

### 2.3 ：AbLang

|  |  |
|------|------|
| **** | **AbLang** — （ SAbDab ），** / log P**。 |
| **** | ** VH/VL  VHH**  **WT** ：「」**、**。 |
| **** |  **ΔlogP**（mut − WT）、 **perplexity** 。 |
| ** EvoEF2 ** | ****：EvoEF2 「」，AbLang 「/」；。 |
| **** |  API ； LICENSE 。 |

> ：<https://github.com/TobiasHeOl/AbLang>（AbLang）； **IgLM**  LM ，。

---

### 2.4 

|  |  |  |  |  |
|------|------|------|------|--------|
| **ColabFold (AF2-Multimer)** |  | ★★★ | ★★★★★ | MIT |  |
| **ESMFold** |  | ★★★★★ | ★★★★ | MIT |  MSA， |
| **OmegaFold** |  | ★★★★★ | ★★★★ | MIT |  MSA |
| **OpenFold** | AF2  | ★★★ | ★★★★★ | Apache 2.0 |  AF2 |
| **NanoBodyBuilder2** | VHH  | ★★★★ | ★★★★★ | MIT | ImmuneBuilder  |
| **ABodyBuilder2** | VH/VL  | ★★★★ | ★★★★★ | MIT |  |

---

### 2.5 

|  |  |  |  |
|------|------|--------|------|
| **FreeSASA** | SASA  | MIT | ，C  |
| **PDBePISA** |  |  web |  |
| **ProDy (Python)** | /B- | MIT | Python  |
| **Bio.PDB (Biopython)** |  | MIT |  |
| **MDAnalysis** | / | GPL |  MD  |

---

## 、（L1 / L2 / L3）

### 3.1 

|  |  |  |  |
|------|----------|----------|----------|
| **L1** | – /  |  | ΔΔG_bind 、 |
| **L2** | – /  |  | ΔΔG、ΔTm、 web ML |
| **L3** | – /  |  | ipTM、、 MM/GBSA |

### 3.2 L1 — 

|  |  /  |  Gate（，） |
|------|-------------|---------------------------|
|  | **EvoEF2** `ComputeBinding` | ΔΔG_bind < **−0.3** kcal/mol  |
|  | EvoEF2 /  | ΔΔG_fold **** −1.0 kcal/mol |
| ： |  SASA-ΔΔG |  L1 ， tie-break |

### 3.3 L2 — （Top 20–50 ）

|  |  /  |  Gate |
|------|-------------|-------------------|
|  /  | **ThermoMPNN** | ΔΔG  **ΔTm** ； 15–20 |
|  | **AbLang** ΔlogP | ** WT **（ ΔlogP ≥ −0.2～−0.3，） |
|  | **ESM-IF1**  ΔΔG |  EvoEF2 / ThermoMPNN  |
|  | mCSM-AB2 Web | ， Web  |

### 3.4 L3 — （ 3–8 ）

|  |  /  |  Gate |
|------|-------------|-------------------|
|  | **ColabFold AF2-Multimer** | **ipTM ≥ **；（ + ） |
|  | EvoEF2 on ** PDB**（/） | ΔΔG_bind  L1/L2  |
|  | OpenMM MM/GBSA |  1–3 ； |

### 3.5 AbLang 

| EvoEF2 ΔΔG_bind | AbLang vs WT |  |
|-----------------|-------------|----------|
|  |  | **** |
|  |  | ****： L3  |
|  |  | **** |
|  |  | ****：， L3 /  |

---

## 、 vs （ L ）

```
（ΔΔG Pearson r vs ，）
 ↑
 │  OpenMM MM/GBSA ████████████ r≈0.65 | →  L3
 │  Rosetta ddg    ███████████  r≈0.60 | → L3 
 │  mCSM-AB2       ██████████   r≈0.58 | → L2 
 │  ThermoMPNN     █████████    r≈0.55 | → L2
 │  ESM-IF1 ΔΔG    █████████    r≈0.55 | → L2 
 │  FoldX          ████████     r≈0.50 | → L2 
 │  EvoEF2         ███████      r≈0.45 | → L1 
 │  SASA-ΔΔG       █████        r≈0.30 | → L1 
 └────────────────────────────────────────────────────→
                            
```

**AbLang**  ΔΔG Pearson r；****，。

---

## 、CMC / Developability （ AbEvaluator ）

「」**** CMC ，****。

### 5.1 （VH/VL  VHH）

|  |  |  |
|------|--------------|----------|
|  | pI、（pH7）、GRAVY | ； **ΔpI、Δ**  |
|  /  | SAP、（9-mer）、（7-mer） | ****；VHH  ADI / human_sdab_ADI |
|  | （N-G、N-S）、（D  motif）、（M、W） | ；CDR  **FAIL ** |
|  | 、、CDR / |  engineering （ hallmark ） |

### 5.2 

```
L1/L2/L2.5 
    →  AbEvaluator（ CMC ） developability 
    →  ** FAIL** → 「」
    → WARN → ，
```

 **STANDARDS_INDEX** / **AbEngineCore**  VHH  gate。

---

## 、（ AI + AbLang + CMC；**** MPNN）

```
 0 —  AI 
──────────────────────────────────────────────
:  PDB（ AF2-Multimer）+ /
: （ +  reasoning）；/

 1 — L1  + AbLang 
──────────────────────────────────────────────
: EvoEF2（+  SASA ）+ **AbLang**
: Top 30–60（ ΔΔG  AbLang ）

 2 — L2  + CMC 
──────────────────────────────────────────────
: ThermoMPNN + AbLang  + **AbEvaluator CMC **
: Top 10–20 ； 3–6 ****

 3 — L3  + CMC 
──────────────────────────────────────────────
: ColabFold + EvoEF2( PDB) + ** CMC **
:  3–8  + （ +  + CMC）
```

---

## 、

|  |  |  |  |
|------|--------|---------|------|
| **EvoEF2** | MIT | ✅  |  `tools/EvoEF2_src/` |
| **ColabFold / AF2** | MIT + Apache | ✅  | ；ColabFold API  |
| **ESMFold / ESM-IF1** | MIT | ✅  | Meta AI  |
| **ThermoMPNN** | MIT | ✅  | |
| **AntiFold** | MIT | ✅  |  |
| **OpenMM** | MIT | ✅  | |
| **FreeSASA** | MIT | ✅  | |
| **ABodyBuilder2** | MIT | ✅  | ImmuneBuilder |
| **AbLang** |  |  |  |
| **ProteinMPNN** | MIT | ✅  | ** CDR **；**** |
| **FoldX** |  | ❌  | |
| **Rosetta** |  | ❌  | |
| **mCSM-AB2** | Web  | ⚠️  Web | / |

---

## 、 Benchmark 

### EvoEF2
- ****: SKEMPI 2.0（7,085 ）
- ****: ΔΔG Pearson r ≈ 0.45，MUE ≈ 1.1 kcal/mol
- ****: ，（VdW///）， `ComputeBinding`  ΔΔG_bind
- ****: `EvoEF2 --command=ComputeBinding --pdb=complex.pdb`

### ThermoMPNN
- ****: Megascale （~350K ）+ ProTherm
- ****: Pearson r ≈ 0.55（Ssym benchmark）； ΔΔG  ΔTm
- ****: `pip install thermompnn`

### ESM-IF1
- ****: Native recovery 51.4%（ ProteinMPNN）；ΔΔG  r ≈ 0.55
- ****: `pip install fair-esm`

### MM/GBSA via OpenMM
- ****: ，r ≈ 0.65–0.70（ ns  MD）
- ****: L3 ，

### ProteinMPNN / AbMPNN / IgMPNN
- ****：****。 + 19 。  
- ****：** CDR **（ redesign、）。**** AbLang + CMC。  
- ** ThermoMPNN **： **ΔΔG/ΔTm **， L2 ****。

---

## 、（：PAG-1 ）

```
Step 1   +  AI 
        : Bio.PDB / PISA + 
        :  + （、Stealth、hallmark ）

Step 2  L1：EvoEF2  + AbLang
        : ΔΔG_bind < −0.3  AbLang  WT 

Step 3  L2：ThermoMPNN + AbLang + AbEvaluator  CMC
        : Top 15–20 ； CMC FAIL

Step 4  （3–6 ）
        :  + epistasis ； Step 2–3 

Step 5  L3：ColabFold AF2-Multimer + EvoEF2 on  PDB
        : ipTM ≥ ；

Step 6  CMC  + 
        :  + L1/L2/L3  + AbLang  + CMC  + 
```

---

## 、

|  |  |
|------|------|
| EvoEF2 | https://github.com/tommyhuangthu/EvoEF2 |
| ThermoMPNN | https://github.com/Kuhlman-Lab/ThermoMPNN |
| ESM-IF1 / ESM | https://github.com/facebookresearch/esm |
| **AbLang** | https://github.com/TobiasHeOl/AbLang |
| ColabFold | https://github.com/sokrypton/ColabFold |
| ABodyBuilder2 | https://github.com/oxpig/ImmuneBuilder |
| ProteinMPNN | https://github.com/dauparas/ProteinMPNN |
| AntiFold | https://github.com/oxpig/AntiFold |
| OpenMM MM/GBSA | https://github.com/openmm/openmm |
| SKEMPI2 benchmark | https://life.bsc.es/pid/skempi2 |
| mCSM-AB2 (web) | https://biosig.lab.uq.edu.au/mcsm_ab2 |

---

## ：v1.0 → v2.0 

|  | v1.0 | v2.0 / v2.1 |
|------|------|------|
|  | ProteinMPNN  2  | ** MPNN**；MPNN **** CDR  |
|  |  | **AbLang** |
|  |  | **L1/L2/L3 ** + AbLang  |
| CMC |  | ** + ** |
|  |  | ** AI + **  0 |
