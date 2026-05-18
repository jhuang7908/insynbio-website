# De Novo CDR Design & Patent Escape Standard (V5.0)

> **Version history:** V1.0 (initial) → V3.0 (OASis/promb integration, AF2 Colab handoff) → V4.0 (gate restructuring, T0.0 PTM, conditional ImmuneBuilder/AbLang) → **V5.0** (T1.5 interface clash gate, three-question tool framework, adaptive routing engine, multi-CDR/CDR3 extended pipeline, HADDOCK3 integration rules)
>
> **Source of changes:** VGRW-SR-R2 HER2 VHH De Novo Design case (April 2026) — full pipeline execution + 27-candidate T1.5 validation + multi-CDR design discussion with owner.

---

## 1.  (Core Philosophy & Applications)

 InSynBio （VH/VL  VHH）** CDR （Patent Escape / FTO）**。

**：**
1. ** (FTO)：** （ < 75%  Claim ），。
2. ** (Chemistry First)：** V4.0  PTM ****，。MPNN ，——，。
3. ** (Specificity & Affinity)：** （RMSD、）， VAM 。
4. ** (Cost-Efficiency)：** ，。

**V5.0  vs V4.0：**

|  | V4.0 | V5.0 |  |
|-------|------|------|------|
|  |  | **T1.5 EvoEF2 Clash ** | 27 ：26 PASS / 1 FAIL (0.46Å overlap)。2s/ 3min ImmuneBuilder |
|  |  | **（§2b）** | ， |
|  CDR / CDR3 |  | **（§6）** | CDR3 ， ImmuneBuilder + HADDOCK3 |
|  |  | **（§9）** | 5  × 8  =  |
|  |  | ** checkpoint/resume** | ，Ctrl+C  |

**V4.0  vs V3.0：**

|  | V3.0 | V4.0 |  |
|-------|------|------|------|
| PTM  |  | ** T0.0** | VGRW-SR-R2: 73%PTM， |
| ImmuneBuilder |  | **** | VGRW-SR-R2: 27/27，RMSD54%。81 |
| AbLang T1 |  | **** | VGRW-SR-R2: 118/118，-0.41-0.32。 |
| MPNN  | [0.2, 0.3, 0.5] | **[0.3, 0.5, 0.8, 1.0]** | 82%，18%CDR2 |
| MPNN bias_AA |  | **per-residue PTM avoidance** | DA/NADN |
| CDR Root  |  | **** | MPNN （0%）。， |
| PRODIGY |  | **** | ； MM/GBSA |

---

## 2.  (Three-Question Tool Framework) — V5.0 

**V5.0 ：。。**

|  |  |  |  |  |  |
|------|---------|------|------|------|---------|
| Q1 | **？** | ImmuneBuilder / ESMFold |  | 3D  | CDR3 / CDR /  |
| Q2 | **？** | EvoEF2 BuildMutant + fast_clash_check | WT PDB +  |  PDB + clash count | **** |
| Q3 | **，？？** | HADDOCK3 / MM/GBSA |  PDB | ΔG_bind, epitope map | 15-param eval; CDR3HADDOCK3 |

**：**
- ImmuneBuilder **** Q2（，）
- EvoEF2 **** Q1
- PRODIGY ****（；V4.0 ）
- HADDOCK3  CDR3/CDR  Phase 4 

**：**

|  | Q1 ImmuneBuilder | Q2 EvoEF2 Clash | Q3 / |
|---------|:-------:|:-------:|:-------:|
|  CDR2（≤10 ，） | SKIP | **** | MM/GBSA (15-param) |
|  CDR1  CDR2（>10 ）| RUN | **** | MM/GBSA (15-param) |
|  CDR3  | **** | **** | **HADDOCK3 ** |
|  CDR（CDR1+2+3）| **** | **** | **HADDOCK3 ** |
|  | **** | **** | **HADDOCK3 ** |

---

## 3.  (V5.0 Pipeline Architecture)

```
: WT  PDB + CDR  (mask_strategy.json)
         │
         ▼
  ┌─────────────────┐
  │ MPNN V2     │  T=[0.3,0.5,0.8,1.0], N=150/T, bias_AA PTM 
  └────────┬────────┘
           │ ~600 
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T0.0:  + PTM/  (<1 , )  │
  │  • （ ~60-82% ）                      │
  │  • N-G/D-G CDR  → FAIL                          │
  │  • N-X-S/T  → FAIL                       │
  │  • D-A/D-S/D-T CDR  → FAIL                      │
  │  •  Cys  → FAIL                              │
  └────────┬────────────────────────────────────────────┘
           │ ~25-30%  
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T0: OASis 9-mer                          │
  │  coverage >= WT × 0.80 AND CDR identity < 0.70      │
  └────────┬────────────────────────────────────────────┘
           │ ~30% 
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T1: AbLang   [ — §9 ]           │
  │  : CDR OR CDR3 OR                │
  │  SKIP: CDRCDR3 (100%, )       │
  └────────┬────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T0.5: Hamming                              │
  │   15-50                               │
  └────────┬────────────────────────────────────────────┘
           │ 15-50 
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T2: ImmuneBuilder  [ — §9 ]   │
  │  : CDR3 / CDR / >10 /               │
  │  SKIP: CDR2 ≤10 +  (RMSD<1.5 Å)     │
  │  ★  Q1："？"                    │
  │  ★  Q2/Q3                  │
  └────────┬────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────────┐
  │ T1.5: EvoEF2  [V5.0  — ]    │
  │  ★  Q2："？"              │
  │  :                                                  │
  │    1. EvoEF2 BuildMutant (, ~2s)   │
  │    2. Bio.PDB vdW clash count (overlap > 0.4 Å)         │
  │    3.  vs WT (5 Å contact set)                │
  │  : clash_count ≤ 0 AND epitope_overlap ≥ 0.70       │
  │  : 27  → 26 PASS / 1 FAIL (0.46Å overlap)      │
  │  : ~2s/ (vs ImmuneBuilder ~3min/)               │
  └────────┬───────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────┐
  │                                         │
  │  S_seq + S_struct +             │
  │  S_nat(AbLang) + S_oasis + S_cmc + S_ag              │
  └────────┬────────────────────────────────────────────┘
           │ Top 5 
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ 15 (AffinityEnergyToolkit)               │
  │  EvoEF2, MM/GBSA (OpenMM), ThermoMPNN,              │
  │  AntiFold, ESM-IF1 —  WT  ΔΔG                 │
  │  ★  Q3："？？"               │
  └────────┬────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ Phase 4:                                     │
  │   ≥ 70% + ΔG ≤ WT →                 │
  │   ≥ 70% + ΔG > WT →  VAM               │
  │   < 70%            → ， Phase 1       │
  │  CDR3 / CDR  →  HADDOCK3       │
  └─────────────────────────────────────────────────────┘
```

---

## 4.  (Key Design Decisions)

### 4.1 ROOT ：

**：ROOT  MPNN mask  fixed_pdb_residues。**

（VGRW-SR-R2 ）：
- MPNN （CDR2 C  10  0%）
-  ROOT  mask ****， 17  5-7 ，
-  MPNN  ROOT， MPNN ****

**：**
1.  `_cdr2_root_analysis.py` 
2.  `config/cdr_root_analysis.json`（ `root_positions_linear`  `conservative_map`）
3.  **T0.0 QC **（`sequence_liability_qc.py`）， WARNING  ROOT 
4.  MPNN mask

### 4.2 T0.0 PTM ：

 VGRW-SR-R2 ：
- 400  **292 （73%） PTM  QC**
-  lin 51+52（Y57→D/N，P58→A） DA  NAS 
-  292  T0 OASis  T1 AbLang， T2 ImmuneBuilder
- **：81  ImmuneBuilder **

PTM ：**400  <1 **。。

### 4.3  ImmuneBuilder（ Q1）

|  | RMSD  | ImmuneBuilder  |  |
|---------|----------|-------------------|------|
|  CDR2（≤10 ）， | <1.5 Å |  | SKIP |
| CDR1+CDR2  CDR | 1.5-3.0 Å |  | RUN |
|  CDR3  | 0.5-5.0+ Å |  | RUN |
|  |  |  | RUN |

### 4.4 T1.5 EvoEF2 （ Q2）— V5.0 

**：T1.5 。。**

|  |  |
|------|---|
|  | EvoEF2 `BuildMutant` → `core/evaluation/fast_clash_check.py` |
|  | ~2 /（CPU，） |
|  | WT  PDB（ H ） +  |
|  | clash_count, clash_severity, epitope_overlap, volume_score |

** ImmuneBuilder  T1.5？**

|  | ImmuneBuilder | EvoEF2 BuildMutant |
|------|-------------|-------------------|
|  |  |  |
|  |  |  |
|  | （CDR2-only ） |  WT （， CDR2 ） |
|  | ~3 min | ~2 s |
|  |  | （rotamer ） |

**V5.0 ：T1.5  Q2 。ImmuneBuilder  Q1。。**

**：**

|  |  |  |
|------|------|------|
| clash_count | ≤ 0 |  vdW overlap > 0.4 Å  |
| epitope_overlap | ≥ 0.70 |  70%  |
| volume_score (Level-0) | VOL_LARGE (≥80 Ų) → FAIL |  |

**（VGRW-SR-R2, 27 , CDR2-only）：**
- 26/27 PASS (zero clash, epitope 80-100%)
- 1/27 FAIL: denovo_0272 (1 clash pair, 0.46 Å overlap)
- 10/27  100% （ 15  HER2 ）
-  38.9  vs ImmuneBuilder ~66 

### 4.5 MPNN  V2：

 T=[0.2, 0.3, 0.5]：
- MPNN ""，
- 400  73  CDR2（18% ）
- 5  1-2 

 T=[0.3, 0.5, 0.8, 1.0]：
- ，
- ，
-  `bias_AA_per_residue`  PTM ，

---

## 5.  (V5.0 Gate Thresholds)

### 5.1 T0.0 — （，）

|  |  |  |  |
|-------|---------|------|------|
|  |  |  |  |
|  NG （CDR ） | CDR  N-G motif | **FAIL** |  |
|  NA/NS/NT （CDR ） | CDR  N-A/S/T motif | WARN | ， |
| （CDR ） | CDR  D-G/A/S/T | **FAIL** | DA （VGRW-SR-R2 46.8% ） |
|  N- | N-X-S/T（X≠P）vs WT | **FAIL** |  |
|  Cys  | C21/C95（VHH） C22/C92（VH） | **FAIL** |  |
|  Cys |  | **FAIL** |  Cys / |

**：** `core/evaluation/sequence_liability_qc.py`（，~ms）

### 5.2 T0 — 

|  |  |  |  |
|------|------|------|------|
| OASis 9-mer  | promb (human-oas) | ≥ WT × 0.80 | FAIL |
| CDR  vs WT |  | < 0.70 | FAIL |

### 5.3 T1 — AbLang （****）

**：**  CDR  OR  CDR3 OR 

**：**  CDR（ CDR3）， → 100% ，

|  |  |  |
|------|------|------|
|  pseudo-logP | AbLang heavy | ≥ WT score × 1.5 |

### 5.4 T2 — ImmuneBuilder （**， Q1**）

**：**  CDR OR  CDR3 OR  >10 OR  OR MPNN  ≥ 1.0

**：**  CDR2 ≤10  + （ RMSD  <1.5 Å）

|  |  |
|------|------|
|  RMSD | ≤ 2.5 Å |
| CDR  RMSD（ CDR） | ≤ 3.0 Å |

### 5.5 T1.5 — EvoEF2  Clash（**，Q2**）

 §4.4。：`clash_count ≤ 0`，`epitope_overlap ≥ 0.70`。

**：** `core/evaluation/fast_clash_check.py`（`FastClashChecker`  + `from_mask_json` ）

### 5.6  — 15 （， Top 5）

|  |  |  |
|------|------|------|
| P1. CDR  vs WT | Hamming |  |
| P2.  vs WT |  | — |
| P3.  RMSD | ImmuneBuilder/BioPDB |  |
| P4. CDR  RMSD | ImmuneBuilder/BioPDB |  |
| P5. AbLang  | AbLang |  |
| P6. OASis  | promb |  |
| P7. EvoEF2 ΔΔG_bind | EvoEF2 | （ΔΔG<0=） |
| P8. MM/GBSA ΔΔG_bind | OpenMM（500）| （ PRODIGY） |
| P9.  | 5Å  | ≥ 0.70 |
| P10. ThermoMPNN ΔΔG_fold | ThermoMPNN |  |
| P11. AntiFold logP | AntiFold |  |
| P12. ESM-IF1 logP | ESM-IF1 |  |
| P13. pI | ProtParam | 6.5-8.5  |
| P14.  | ProtParam | <45 ，<40  |
| P15. （9-mer）| KD  | <2.5  |

---

## 6. MPNN V2 

### 6.1 

|  | V3.0 | V4.0 |  |
|------|------|------|---------|
|  | [0.2, 0.3, 0.5] | **[0.3, 0.5, 0.8, 1.0]** |  82% ； |
|  | 200 | **150** | ， |
|  | 400 (2T×200) | 600 (4T×150) |  |
|  |  | **（MPNN）** |  T0 OASis |
| bias_AA_per_residue |  | **PTM ** | D:-1.5, N:-1.0  TIP  |

### 6.2 PTM 

 CDR **TIP **（ ROOT ） logit ：

```json
{
  "D": -1.5,
  "N": -1.0
}
```

**：** MPNN  D/N ， G/A/S/T  PTM 。 MPNN ， D/N 。

**：** `projects/_template/helpers/mpnn_sampling.py`（`MPNNSampler` ）

### 6.3 ROOT 

- **** MPNN mask  ROOT 
- ： ROOT （favored AA set， `conservative_map` ）
- ROOT  T0.0 QC  WARNING， FAIL
-  `_cdr2_root_analysis.py`  `config/cdr_root_analysis.json`  T0.0 

---

## 7.  CDR / CDR3  — V5.0 

### 7.1 CDR3 

| CDR |  |  |  | MPNN  | ImmuneBuilder  |
|-----|------|------|----------|----------|-------------------|
| CDR1 | ~10 aa | β-turn， β-sheet  |  |  |  |
| CDR2 | ~17 aa | flat loop，β-strand  |  |  |  CDR  |
| CDR3 | 6-24 aa | **，** | **** |  | **** |

CDR3 ：
-  = （MPNN ）
- （VHH CDR3  Hallmark）
-  CDR1 （VHH ）
- MPNN  CDR3 ** WT **

### 7.2  CDR3 

```
MPNN (multi-CDR, T=[0.3, 0.5, 0.8, 1.0])
  ↓
T0.0:  + PTM           [<1s — ]
  ↓
T0:   OASis            [~2 min]
  ↓
T1:   AbLang                 [~10 min — CDR]
  ↓
T0.5: Hamming            [<1s]
  ↓
T2:   ImmuneBuilder        [~3 min/ — Q1: ？]
      →  RMSD ≤ 2.5 Å
      → CDR3  RMSD ≤ 4.0 Å
      ★ 。。
  ↓
T1.5: EvoEF2  Clash            [~2s/ — Q2: ？]
      ★ ： CDR3 ，
        EvoEF2 BuildMutant （ repack ，）。
         HADDOCK3 。
  ↓
HADDOCK3                [~30-60 min/ — Q3: ]
      ★  CDR3 。。
      ★  CDR3 。
  ↓
15-param  + Final Rank
```

** vs （ CDR2）：**
- T1 AbLang：****（ CDR ）
- T2 ImmuneBuilder：****（CDR3 ）
- HADDOCK3：****（ epitope_overlap）
- T1.5 EvoEF2 Clash：， CDR1/CDR2 

### 7.3 VH/VL  CDR ：

 VH/VL ，****：

1. ** 1：（H3 + L3）**
   - 、H1/L1、H2/L2
   - MPNN  H3/L3
   -  ImmuneBuilder + HADDOCK3（CDR3 ）

2. ** 2：（H2 + L2）**
   -  1  H3/L3
   -  ImmuneBuilder；T1.5 Clash 

3. ** 3：（H1 + L1）**
   -  CDR
   - ** ImmuneBuilder**（ H1/L1  ≤10 ）
   - T1.5 Clash 

### 7.4 HADDOCK3 

|  | HADDOCK3 |  |
|------|---------|------|
|  CDR3  | ****（ WSL） | AF2-Multimer（Colab ） |
|  CDR  | **** | AF2-Multimer |
|  CDR2 ≤10  |  | EvoEF2 + MM/GBSA  |
| Phase 4  VAM |  | MM/GBSA  |

**HADDOCK3 ：** WSL Ubuntu-22.04（，）
**AF2-Multimer ：** Colab（，）

---

## 8.  (Checkpointing & Resume)

 append-only JSONL ， `flush`。

###  (V5.0)

```
projects/denovo_{target}_{date}/
├── project_manifest.json          # 
├── config/
│   ├── mask_strategy.json         # CDR 
│   ├── denovo_ranking_weights.json
│   └── cdr_root_analysis.json     # ：（ROOT/TIP ）
├── phase1_generation/
│   ├── mpnn_raw_sequences.fasta   # MPNN 
│   ├── mpnn_sampling_report.json  # 
│   ├── t00_passed.fasta           # T0.0 
│   ├── t0_oasis_blast.jsonl       # T0 
│   ├── t1_ablang_scores.jsonl     # T1 
│   └── t05_clustered.fasta        # 
├── phase2_structure/
│   ├── structures/                # ImmuneBuilder PDB 
│   ├── t2_monomer_qc.jsonl        # T2 
│   ├── t2_skip_log.jsonl          # T2 
│   └── t15_interface_gate.jsonl   # T1.5 Clash （V5.0）
├── phase3_complex/
│   └── t3_complex_qc.jsonl
├── reports/
│   ├── t00_ptm_gate.json          # T0.0  QC （V5.0）
│   ├── t15_interface_gate_report.json  # T1.5 Clash （V5.0）
│   ├── denovo_multi_objective_rank.json
│   ├── comprehensive_15param_eval.json
│   └── final_recommendation.md
├── pipeline_v2_status.json        #  checkpoint （V5.0）
└── run_all_v2.py                  # V2 
```

---

## 9.  (Adaptive Routing Engine) — V5.0 

""。 `mask_strategy.json`，。

### 9.1 

```python
def route_pipeline(mask: dict, settings: dict) -> dict[str, bool]:
    """
     mask_strategy.json 。
     {step_id: should_run}。
    """
    dm            = mask["design_mask"]
    redesign_cdrs = dm.get("redesign_cdrs", [])
    n_positions   = len(dm.get("designable_pdb_residues", []))
    fix_framework = dm.get("fix_framework", True)
    has_cdr3      = "CDR3" in redesign_cdrs
    multi_cdr     = len(redesign_cdrs) >= 2
    temps         = settings.get("mpnn", {}).get("temperatures", [0.5])

    return {
        # 
        "mpnn_generate":   True,
        "t00_ptm_gate":    True,
        "t0_oasis":        True,
        "t05_cluster":     True,
        "t15_clash":       True,      # V5.0: EvoEF2 Clash 
        "multi_rank":      True,
        "eval15":          True,
        "final_rank":      True,

        # 
        "t1_ablang":       (multi_cdr or has_cdr3 or not fix_framework),
        "t2_immunebuilder": (
            not fix_framework
            or has_cdr3
            or multi_cdr
            or n_positions > 10
            or max(temps) >= 1.0
        ),
        "haddock3":        (has_cdr3 or multi_cdr),
    }
```

### 9.2 

|  |  | T1 | T2 | T1.5 | HADDOCK3 |  |
|------|------|:---:|:---:|:----:|:--------:|-----------|
| A:  CDR2 ≤10  | VGRW-SR-R2 | SKIP | SKIP | ✓ | × | ~60 min |
| B:  CDR1/CDR2 >10  |  | SKIP | ✓ | ✓ | × | ~120 min |
| C:  CDR3  | CDR3 patent escape | ✓ | ✓ | ✓ | ✓ | ~4-6 h |
| D:  CDR（ CDR1+CDR3） |  | ✓ | ✓ | ✓ | ✓ | ~6-12 h |
| E: +CDR  | De novo scaffold | ✓ | ✓ | ✓ | ✓ | ~12-24 h |

### 9.3 

```python
def need_structure_prediction(mask: dict, settings: dict) -> bool:
    """Q1:  ImmuneBuilder ？"""
    dm = mask["design_mask"]
    if not dm.get("fix_framework", True):  return True   # 
    if "CDR3" in dm["redesign_cdrs"]:      return True   # CDR3 
    if len(dm["redesign_cdrs"]) >= 2:      return True   #  CDR 
    if len(dm.get("designable_pdb_residues", [])) > 10:
                                           return True   # 
    if max(settings.get("mpnn",{}).get("temperatures",[0.5])) >= 1.0:
                                           return True   # 
    return False

def need_ablang(mask: dict) -> bool:
    """ T1 AbLang ？"""
    dm = mask["design_mask"]
    if not dm.get("fix_framework", True):  return True
    if "CDR3" in dm["redesign_cdrs"]:      return True
    if len(dm["redesign_cdrs"]) >= 2:      return True
    return False

def need_haddock3(mask: dict) -> bool:
    """Q3:  HADDOCK3 ？"""
    dm = mask["design_mask"]
    if "CDR3" in dm["redesign_cdrs"]:      return True   # CDR3 ，
    if len(dm["redesign_cdrs"]) >= 2:      return True   #  CDR 
    return False
```

---

## 10.  (V5.0)

|  |  |  |  |  |
|------|---------|------|------|------|
| ProteinMPNN | — | CDR （V2 ） | `tools/ProteinMPNN/` |  |
| sequence_liability_qc.py | — | T0.0 PTM  |  Python 3.10+ | ， |
| OASis (promb) | — | 9-mer  | `anarcii` env |  |
| AbLang | — |  | `affmat` env | （§9） |
| ImmuneBuilder | **Q1 ** | VHH/Ab  | `anarcii` env | （§9） |
| **fast_clash_check.py** | **Q2 ** | EvoEF2  repack + vdW clash | `affmat` env | **** (V5.0) |
| EvoEF2 | Q2 + Q3 | BuildMutant + ΔΔG_bind | `affmat` env |  |
| OpenMM MM/GBSA | **Q3 ** | ΔΔG_bind（，PRODIGY）| `affmat` env | 15-param |
| ThermoMPNN | Q3  | ΔΔG_fold  | `affmat` env | 15-param |
| AntiFold | Q3  |  | `affmat` env | 15-param |
| ESM-IF1 | Q3  |  | `affmat` env | 15-param |
| **HADDOCK3** | **Q3 ** | （CDR3/CDR ）| WSL Ubuntu-22.04 | （§9） |
| AF2-Multimer | Q3  | （Colab ） | Google Colab |  |
| ~~PRODIGY~~ | ~~Q3~~ | ~~~~ | — | ****（V4.0 ）|

---

## Appendix A:  (Decision Logic) —  §9

```python
def need_structure_prediction(mask: dict, settings: dict) -> bool:
    """
    Returns False for single non-CDR3 CDR with ≤10 mutable positions
    and fixed framework. ImmuneBuilder RMSD will always be <1.5 Å.
    Lesson: VGRW-SR-R2 27/27 pass (100%), max RMSD 1.36 Å / 2.5 Å limit.
    """
    dm            = mask["design_mask"]
    redesign_cdrs = dm.get("redesign_cdrs", [])
    n_positions   = len(dm.get("designable_pdb_residues", []))
    fix_framework = dm.get("fix_framework", True)
    temps         = settings.get("mpnn", {}).get("temperatures", [0.5])

    if not fix_framework:          return True   # framework changes → unpredictable
    if "CDR3" in redesign_cdrs:    return True   # CDR3 is conformationally variable
    if len(redesign_cdrs) >= 2:    return True   # inter-CDR cooperativity
    if n_positions > 10:           return True   # extensive mutations
    if max(temps) >= 1.0:          return True   # high-entropy sampling
    return False


def need_ablang(mask: dict) -> bool:
    """
    Returns False for single-CDR non-CDR3 with fixed framework.
    Lesson: VGRW-SR-R2 T1 score range -0.41 to -0.32 (very narrow). 0% kill rate.
    """
    dm            = mask["design_mask"]
    redesign_cdrs = dm.get("redesign_cdrs", [])
    fix_framework = dm.get("fix_framework", True)

    if not fix_framework:          return True
    if "CDR3" in redesign_cdrs:    return True
    if len(redesign_cdrs) >= 2:    return True
    return False
```

**：** `projects/_template/run_pipeline.py`  `projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py` 。

---

## Appendix B: （V5.0 vs V3.0）

 CDR2 VHH （≤10 ，）：

|  | V3.0 | V5.0 |  |
|------|------|------|------|
| MPNN （82%） | ~5 min | ~3 min | ~2 min |
| T0.0 PTM（→） | 0 min | <1 s |  |
| T1 AbLang（100%） | ~10 min | SKIP | **10 min** |
| T2 ImmuneBuilder（100%） | ~81 min | SKIP | **81 min** |
| T1.5 EvoEF2 Clash |  | +39 s |  1/27 clash |
| T3 PRODIGY | ~15 min | SKIP→MM/GBSA | **15 min** |
| **** | **~169 min** | **~62 min** | **~107 min (63%)** |

** 63% ，**（PTM  + Clash  + ）。

---

## Appendix C:  PTM 

| PTM  | Motif | CDR  |  |
|---------|-------|------------|---------|
| （Deamidation） | N-G, N-S, N-T, N-A |  CDR | bias_AA  N；T0.0  |
| （Isomerization） | D-G, D-S, D-T, D-A |  CDR | bias_AA  D；T0.0  |
| N- | N-X-S/T（X≠P） |  | T0.0  |
|  | M | CDR TIP | WARN； |
|  | W（CDR TIP） | CDR2 TIP | WARN； |

**VGRW-SR-R2 ：**
- Y57（lin 51）→ D/N（99.8%）
- P58（lin 52）→ A（99.2%）
- ：D+A → DA （FAIL）；N+A+S_next → NAS （FAIL）
- 397/400 
- **：** bias_AA  lin 51  D（-1.5） N（-1.0）

---

## Appendix D: V5.0 

```bash
#  A（ CDR2 ≤10 ）—  ~62 
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py

# 
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py --list

# 
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py --from t15_clash

# 
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py --step t00_ptm_gate

#  T1.5
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/t15_interface_gate.py --all_clustered

# Ctrl+C ，
```

---

*Document Version: 5.0*
*Date: 2026-04-03*
*Author: InSynBio AI Research (VGRW-SR-R2 case data + multi-CDR design discussion)*
*Supersedes: V4.0 (2026-04-03)*
*Evolution Log: APPROVED entry 2026-04-03 — owner instruction ""*
