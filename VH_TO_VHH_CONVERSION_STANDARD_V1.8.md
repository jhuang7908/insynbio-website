# VH → VHH  (VH → VHH Conversion Standard)

**：** V1.8.17  
**：** 2026-05-16  
**：** OFFICIAL STANDARD -   
**：** V1.8.16 ，(1) Stealth  CDR3  net_basic/pI （NONE/MINIMAL/STANDARD/FULL ）。（6 CD3  ABodyBuilder2 Fv + ShrakeRupley）：Stealth K  VH+VL （SASA ≈94 Å²）， VL ——Stealth  charge ， BSA→SASA 。(2) Y91/F91 + W103 ：n=130 VHH  r=−0.23 。Hallmark + VL-SASA 。（2026-05-16）  
**：** V1.8.16（ SASA ）← V1.8.15（VL  + K72）← V1.8.14← V1.8.13（pI ）← V1.8.12（3-Tier ）

---

## 🔬 §1a. [V1.8.15] VH-VL 

### 

 Fv ，VH  VL  **850 Å²** （Buried Surface Area, BSA）。Zone 1 （k45, k47, k37）****，，""。

**（NanoBodyBuilder2 ）：**

>  VL ，****（SASA ）。" VL"，****—— VHH 、Fc ""，。

 VH→VHH ****，""。 GRAVY：GRAVY ****。

### VL-

**Zone 1：FR2 （，）**

| Kabat | VH+VL  |  VL （VHH ）| VHH  | Hallmark  |
|---|---|---|---|---|
| **k45** | ****， VL CL/VL-FR2 ；BSA ~100–140 Å² | ****， | **R**| L45R：+，； |
| **k47** | ****，W  VL  F/Y ；BSA ~150–200 Å² | ****， | **G**| W47G：，；G ， |
| **k44** | ，G/Q  | ； G， | **E**| G44E：， k45R ""， |
| **k37** | ****，V  VH-VL  |  k45/k47 | **F**| V37F：F  VHH （ CDR3 ），；**** |

**Zone 2：FR3 （，CDR3 ）**

| Kabat | VH+VL  |  VL  | VHH  |  |
|---|---|---|---|---|
| k89 | ， VL FR3  | ， | **V/L** |  Stealth K89L  |
| k91 |  |  | Y| VHH  Y； |

**Zone 3：CDR3 **

- CDR3 ≥ 18 aa → loop  Zone 1 ，****（ 200–300 Å²）
-  Hallmark ，； VH cohort（n=36） CDR3  Hallmark
-  CDR3（< 18 aa） drape  → Zone 1 ****

### 

|  |  |  |  |
|---|---|---|---|
| ****（Zone 1 k45/k47）|  BSA→SASA  | k45→R, k47→G | ****（V1.8.15 ）|
| ****（Zone 1 k44/k45）|  VL-interface | k44→E + k45→R  |  |
| ****| - | Stealth K→Q/D/R/T | （Tier 1）|
| ****（Zone 3）| CDR3  VL-interface  | —（ CDR3）| （CDR3 < 18  Zone 1 ）|
| ****（Zone 1 k37）|  V37 " VL""" | k37→F | （， NanoBodyBuilder2 SASA ）|

### §1a.1 VL-（V1.8.15 ）

> ****：AbNatiV Δ  pI ****，"k45=L  CDR3 "，：
> - AbNatiV ，IGHV3 +  L45  → 
> - pI ，
> 
> ** VL  BSA→SASA **（buried→surface transition）。 PASS 。
>
> **（V1.8.13 CD3 panel）**：Teplizumab/Otelixizumab Tier 1 AbNatiV PASS →  → k45=L, k47=W → NanoBodyBuilder2 ：k45/k47  SASA，Zone 1 。
>
> ** QC（V1.8.16 ）**： NanoBodyBuilder2 ， k45/k47/k37  SASA。V1.8.16 SASA  §1a.2。

**：**

```
 →  Tier 2 Hallmark（ Tier 1 metrics  PASS）：
  1. k45  = L（，VL ）
  2. CDR3 < 18 aa（ CDR3 drape ）
  3. Tier 1  k45（ k45  L）
```

**：**
- CDR3 ≥ 18 aa → drape （Zone 3 ）
- k45  R/A →  Hallmark（ VHH-compatible）

### §1a.2 [V1.8.16]  SASA （ §1a.1 CDR3 ）

****：V1.8.15  CDR3 （CDR3 < 18 aa →  drape → ）。， CDR3 ≥ 18 aa 。V1.8.16  NanoBodyBuilder2  + BioPython ShrakeRupley  SASA，****，。

****：`scripts/structure_sasa_v1816.py`

**SASA （§1a.2，）：**

```
 NanoBodyBuilder2 ：
  IF k45  (L/V/I/M/A/F/W)
  AND k45 SASA > 50 Å²（，CD3 panel n=6 ）
  →  Hallmark（L45R + G44E + W47G）
  → ， k45(R) SASA 
```

****：
- L  SASA ~170 Å²；50 Å² ≈ 30% 
- ：k45=R（ VHH） SASA  ~60–90 Å²（R ， SASA ）
- """"

** §1a.1 **：
- §1a.1（CDR3 ），****
- §1a.2（SASA ）****， CDR3 ≥ 18 aa  drape 

**Zone 1 SASA （V1.8.16 CD3 panel n=6 + V1.8.13 ）：**

> ****：k45=R SASA（~80–127 Å²） k45=L（，~100 Å²）， R 。SASA ****，—— SASA ，（L），（R）。

|  /  | k45 aa | k45 SASA | k47 aa | k47 SASA |  |
|------------|--------|---------|--------|---------|-----|
| Teplizumab V1.8.13（k45 ）| **L** | **99.5 Å²** | **W** | **83.8 Å²** | ❌ ， |
| Teplizumab V1.8.15（k45→R）| **R** | 127.1 Å² | **G** | 29.9 Å² | ✅ Zone 1  |
| SP34 V1.8.15 | **R** | 103.8 Å² | **G** | 41.6 Å² | ✅ Zone 1  |
| OKT3 V1.8.15 | **R** | 79.6 Å² | **G** | 41.5 Å² | ✅ Zone 1  |
| Visilizumab V1.8.15 | **R** | 93.2 Å² | **G** | 42.8 Å² | ✅ Zone 1  |
| Otelixizumab V1.8.15 | **R** | 96.5 Å² | **G** | 50.0 Å² | ✅ Zone 1  |
| Foralumab V1.8.15 | **R** | 100.4 Å² | **G** | 43.1 Å² | ✅ Zone 1  |

****：k45=L SASA=99.5 Å² > 50 Å²  ✓；k45=R SASA=127 Å²  R ∉ ， ✓。 50 Å² ， cohort 。

---

## 📋 1. 

 VH （ mAb、 mAb、）、、 **VHH (Single-domain Antibody)** 。

**：**
- **Path C1**: （ VH）。
- **Path C2**: （ VH，， VHH ）。

### §2.3 [V1.8.10] CDR 

> ****：`cdr_graft_to_scaffold`  VH  CDR  VHH ，"VHH "（VHH FR + VH CDR）， Path A（VHH ）， VH 。  
> ****：`AutonomousHumanVH_Cohort_v1`（n=36 PDB ） VH ， VHH 。  

**：**
- `cdr_graft_to_scaffold` **** Path C。  
-  `enable_scaffold_graft=True` ， graft 。  
-  Path C  `keep_framework_and_camelize`（ VH  + ）。

---

## 🧬 1b. [V1.8.12] 3-Tier 

> ** Phase 2/3/4.5 **，，IGHV + CDR3。

### Tier 1: Stealth + pI- (CDR3-length scaled)

**[V1.8.13] pI  (Pre-Engineering pI Prediction)**：， Stealth + Hallmark  pI。
-  `predicted_pI > 9.5 (FAIL)` →  2× K→D
-  `predicted_pI ∈ (9.0, 9.5] (WARN)` →  1× K→D
- K→D ：K72 > K74 > K83 > K94 > K13 > K19（ K， FR）
- **pI- Stealth  Tier 1 **， Hallmark K45R（+0.1–0.2 pI ） pI 

| CDR3  | Tier 1  | Stealth  |
|-----------|------------|----------------|
| < 10 aa | LIGHT | K13, K19 |
| 10–14 aa | STANDARD | K13, K19, **K72**, K74, K83, K94 |
| 15–17 aa | DEEP | K13, K19, K72, K74, K83, K94 |
| ≥ 18 aa | STRICT-DEEP | K13, K19, K72, K74, K83, K94 |

> Stealth ：K94→R, K74→T, K83→Q, K13→Q, K19→Q, K72→D（ pI）。 K-（=K ）。
>
> **[V1.8.15] K72  STANDARD **：K72  FR3  K，（pI  + ），IGHV3-23 germline tolerance 。 DEEP/STRICT-DEEP ， CDR3 10–14 aa  K72 ，V1.8.15  STANDARD。

### Tier 2: Hallmark Package（CDR3 ）

| CDR3  | Hallmark  |  |
|-----------|-------------|------|
| < 18 aa | **** K45R + G44E + W47G  |  CDR3 "drape" ，VL  |
| ≥ 18 aa | **** |  CDR3  VL （100% -CDR3  VH cohort  Hallmark） |

> ** [V1.8.13]**：Tier 1 pI- Tier 2 ， K45R  pI  WARN 。

### Tier 3: FAIC（IGHV ，-IGHV3 ）

|  |  | IGHV3 cohort  |  |
|-----|------|-----------------|------|
| K68 | T | 92% |  |
| K89 | V | 81% | FR3 VL  |
| K18 | L | 97% | FR1  |
| K77 | T | 85% | FR3  |

- -IGHV3 （IGHV1/2/4/6）
-  CDR ； IGHV3 

### 

```
Cys-gate → Tier 1 (Stealth + pI-corr) → metrics_pass? STOP
                                        → Tier 2 (Hallmark, if CDR3<18) → metrics_pass? STOP
                                        → Tier 3 (FAIC, if non-IGHV3) → report final verdict
```

---

## 🛠️ 2.  (Phase 1–5.7)

### Phase 1:  AbNatiV Δ 
， VH "VHH "。
- **AbNatiV Δ **： $\Delta = \text{Score}_{VHH2} - \text{Score}_{VH2}$。
- **[V1.8.14] IGHV- 4**（：vhh_master_benchmarks_v3 n=160 reverse-engineering ）：

  **IGHV3 **（Clinical_VHH 36/36 + EngVH 21/24 + Autonomous 53/57  IGHV3）：
    - **$\Delta \ge 0$**: **EXCELLENT** —  VHH 
    - **$-0.130 \le \Delta < 0$**: **PASS**（Clinical_VHH IGHV3 p10=-0.115；EngVH IGHV3 p10=-0.122； -0.12→-0.13  Tixentamig ）
    - **$-0.200 \le \Delta < -0.130$**: **WARN**
    - **$\Delta < -0.200$**: **FAIL** — Neg_Control IGHV3  -0.139

  **-IGHV3（IGHV1/4/unknown）**：
    -  n=0； `low_confidence`， QC 
    -  **$\Delta < -0.300$**  `FAIL_lowconf_strict`（IGHV1 Neg_Control  -0.371）
    - $-0.300 \le \Delta < -0.200$: `WARN_lowconf_strict`
    - $\Delta \ge -0.200$: `WARN_lowconf` / `PASS_lowconf` 
- ****：
    - （≥ -0.120）：Clinical_VHH 87.2%，Engineered_Human_VH 87.5% ✓
    - （< -0.120）：Neg_Control_VH 80% ✓
    -  -0.074  20.5%  VHH  50% 
- **CDR3 **：CDR3 < 8 aa  VH 。

---

### Phase 2: Hallmark  (Kabat 44, 45, 47)
**[V1.8.6 ]**  `AutonomousHumanVH_Cohort_v1`（n=36 Kabat ） hallmark 。

#### 2.1  Hallmark — 

|  |  | cohort  |  |
|------|------|------------|---------|
| **Kabat 45** | L → R | R45: 86%（ cohort）；100%（EXCELLENT tier） |  R  A  VHH-， |

#### 2.2 Rescue Hallmark — 

**：** CDR3  ≥ 15 aa **AND**  > 6.5 Å

|  |  | cohort  |  |
|------|------|------------|------|
| Kabat 44 | Q/G → E | E44: 56% | ，rescue-only |
| Kabat 47 | W → F | W47: 56% |  VH ，rescue-only |
| Kabat 37 | V → F | — |  compactness FAIL  |

> **V1.8.5 ：**  K44E/K47F  hallmark， IMGT （IMGT 44/47 ≠ Kabat 44/47），。 hallmark  Kabat scheme 。

---

### Phase 3: Stealth  (Solubility Engineering)
**[V1.8.6 K ]** Stealth  **K** ， VH  K 。

|  |  | CDR3  | K  | CDR2  |
|------|------|--------------|--------|-----------|
| Kabat 94 | K → R |  | ✓ =K | — |
| Kabat 35 | K → N | CDR3 ≥ 10 aa | ✓ =K | — |
| Kabat 50 | K → D | CDR3 ≥ 10 aa | ✓ =K | CDR2 < 17 aa |
| Kabat 89 | K → L | CDR3 ≥ 17 aa | ✓ =K | — |

> **V1.8.5 ：** "Kabat 50 R/K "（=R/K  R/K），。V1.8.6  K ：=K  → ； K  → （ R、S、T ）。

> **VHH vs.  VH ：** VHH Stealth  VH Stealth 。 VH  K （ S50、V89）， VHH Stealth 。

---

### Phase 4:  CDR 
 NanoBodyBuilder2  VHH 。
- **CDR Cα RMSD**： CDR1/2/3  $< 1.5$ Å。
- ** SASA**： Hallmark ， VH-VL 。

---

### Phase 4.5: sdAb  (sdAb Adaptation)
**[V1.8.7 ]**

|  | V1.8.6  | V1.8.7  |  |
|------|------------|------------|---------|
| **L18S** |  |  | — |
| **F68Y** |  K68=F  |  | — |
| **pI-tune** | K72D ( pI > 9.0) | **Adaptive Fallback** |  K72  K， K73Q, K13Q, K19Q  |

- **[V1.8.11] pI **：Phase 4.5 pI tuning  `pI > 8.5`  `pI > 9.0`（ PASS/WARN ）。
- **pI **:  pI > 9.0， K72D； Kabat 72  K，（K73 > K13 > K19） `K/R -> Q` 。
- **[V1.8.10] Path C Liability Gate**:  source_class，CDR  Cys（ C100A）（C -> S） HCAb 。

---

### Phase 5: 
- **[V1.8.14] pI （ Clinical_VHH n=39 ）**：
  - PASS: pI ≤ 9.4（ Caplacizumab=9.07、Envafolimab=9.03、Gefurulimab=9.17、Tarperprumig=9.36 / VHH）
  - WARN: 9.4 < pI ≤ 9.6
  - FAIL: pI > 9.6（ Clinical_VHH  9.36 + 0.24 ）
  - ** V1.8.11  9.0/9.5**（reverse-engineering  8 / VHH  WARN）
  - **V1.8.13 pI **： predicted_pI > 9.4（WARN） > 9.6（FAIL）
- **[V1.8.11] GRAVY**：GRAVY  VHH-specific （VHH  VH ）。 CMC ：PASS ≤ 0.0；WARN 0.0–0.1；FAIL > 0.1。
- **[V1.8.11] Radius of Gyration ($R_g$)**（CDR3 ）：PASS ≤ 7.0 Å；WARN 7.0–7.5 Å；FAIL > 7.5 Å（ Clinical_VHH p90 = 6.22，EngVH p90 = 6.81）。
- **PTM **:  N- (NxS/T)。

---

### Phase 5.5: Expressibility Verdict Gate（[V1.8.11] ）

****：CDR3 、CDR3 、AbNatiV Δ ，"//"。

|  | FAIL | WARN | PASS | EXCELLENT |
|------|------|------|------|-----------|
| **CDR3 length** | < 8 aa | 8–9 aa | ≥ 10 aa | ≥ 10 aa |
| **CDR3 Rg** | > 7.5 Å | 7.0–7.5 Å | ≤ 7.0 Å | ≤ 6.0 Å |
| **AbNatiV Δ (IGHV3)** | < −0.200 | −0.200 ≤ Δ < −0.130 | ≥ −0.130 | ≥ 0 |
| **AbNatiV Δ (-IGHV3, low-conf)** | < −0.300 | −0.300 ≤ Δ < −0.130 | ≥ −0.130 | ≥ 0 |
| **pI** | > 9.6 | 9.4 < pI ≤ 9.6 | ≤ 9.4 | ≤ 8.5 |
| **GRAVY** | > 0.1 | 0.0–0.1 | ≤ 0.0 | ≤ −0.1 |

**[V1.8.14 ]**:  AbNatiV Δ EXCELLENT (≥0)  pI ≤ 9.4 →  PASS（：Caplacizumab、Envafolimab  VHH ）。

**（`expressibility_verdict`）：**
-  FAIL → `FAIL`（/；，）
-  FAIL， ≥1 WARN → `WARN`（/CMC QC ）
-  PASS → `PASS`
-  PASS  Δ ≥ 0 + CDR3 ≥ 10 + compactness ≤ 6.0 → `EXCELLENT`

>  `expressibility_verdict`  JSON  HTML ；`FAIL` ""。

---

## 📊 3.  (Benchmark Reference)

**[V1.8.11] ：vhh_master_benchmarks_v3（n=160）。 = Clinical_VHH (n=39) + Engineered_Human_VH (n=24)； = Negative_Control_VH (n=10  VH)。**

|  | Clinical_VHH (n=39) | Engineered_Human_VH (n=24) | Neg_Control_VH (n=10) | V1.8.11  |
|------|--------------------|-----------------------------|----------------------|-------------|
| **pI** |  8.64；p90 9.08； [4.66, 9.36] |  8.34；p90 9.44 |  8.59 | PASS ≤9.0；WARN ≤9.5；FAIL >9.5 |
| **AbNatiV Δ** |  +0.02；p10 −0.14 |  −0.07；p25 −0.10 |  −0.17； ≤ −0.09 | EXCELLENT ≥0；PASS ≥−0.12；WARN ≥−0.20；FAIL <−0.20 |
| **GRAVY** |  −0.293； −0.002 |  −0.324 |  −0.305 | PASS ≤0.0；WARN ≤0.1；FAIL >0.1（ VHH ，CMC ） |
| **CDR3 Rg** |  5.68；p90 6.22；max 7.82 |  5.72；p90 6.81 |  5.28；max 6.06 | PASS ≤7.0；WARN ≤7.5；FAIL >7.5（， VHH ） |
| **pI** | 7.5–9.5 | 5.5–9.0 | Target 5.5–8.5 |
| **NanoBERT PLL** | ~-2.5 | ~-3.5 | WARN < -4.0 |

**Kabat （cohort n=36，V1.8.6 ）：**

|  |  |  | Deep EngVH  |
|------|---------|------|----------------|
| K18 | L | 97% | L18S  |
| K37 | V | 89% | rescue-only |
| K44 | Q | 56%，E 33% | rescue-only（E ） |
| K45 | L | 56%，R 25% | ** hallmark（L→R）** |
| K47 | W | 56%，F 19% | rescue-only |
| K50 | S | 39%，R 25%，T 17% | K  Stealth（ K50  D） |
| K68 | T | 92% | F68Y  K68=F  |
| K89 | V | 81% | K  Stealth（ K89  L） |
| K94 | R | 53%，K 22% | K  Stealth（ K94  R） |

---

## ⚠️ 4. 

1. ****： VH/VL  (V4.4/V5.0)  VH → VHH 。
2. ** QA**： `validate_mask_coords`  `verify_cdr_preservation` 。
3. **Expressibility Verdict **： JSON  `expressibility_verdict` ；FAIL 。
4. ****： AbNatiV Δ 、CDR3 /compactness、`expressibility_verdict` 。
5. ****： hallmark  Stealth  `AutonomousHumanVH_Cohort_v1`（n=36 Kabat ）。

---

## 🔄 5. 

|  |  |  |
|------|------|---------|
| V1.7 | 2026-03 |  |
| V1.8.0 | 2026-04 | Phase 1 AbNatiV Δ  |
| V1.8.4 | 2026-05-10 | CDR3 compactness ；pI ；mandatory hallmark  |
| V1.8.5 | 2026-05-14 | K50 R/K ；F68Y A/P/T  |
| V1.8.6 | 2026-05-14 | hallmark （K45R ）；L18S ；F68Y  K68=F；Stealth K ；[NEW] Expressibility Verdict Gate（CDR3+compactness+AbNatiV Δ ） |
| V1.8.7 | 2026-05-15 | Adaptive pI Tuning Fallback (K73Q); Path C2 CDR Cys-Gate (C100AS) |
| V1.8.8 | 2026-05-15 |  Smart-CMC （、CDR ） |
| **V1.8.9** | **2026-05-16** | **(1)  CDR2  (IMGT 56-74)；(2) Kabat  (IMGT 39-40)；(3)  QA ** |
| **V1.8.10** | **2026-05-16** | \cdr_graft_to_scaffold\  opt-in；\keep_framework_and_camelize\  |
| **V1.8.11** | **2026-05-16** | （vhh_master_benchmarks_v3 n=160）；pI/AbNatiV 4；GRAVY/Rg  |
| **V1.8.12** | **2026-05-16** | 3-Tier  (Stealth → Hallmark → FAIC)；IGHV-family-aware + CDR3-length-aware； |
| **V1.8.13** | **2026-05-16** | Pre-Engineering pI ；Tier 1 Stealth + pI-；predicted_pI>9.0 → 1× K→D；predicted_pI>9.5 → 2× K→D； K45R pI  |
| **V1.8.14** | **2026-05-16** | （n=160 reverse-engineering ）：pI PASS≤9.4 (Caplacizumab/EnvafolimabVHH)；AbNatiV Δ IGHV3 PASS≥-0.13；-IGHV3  low-confidence （FAIL<-0.30）； AbNatiV +  pI  PASS。Clinical_VHH PASS 69.2%→89.7% |
|| **V1.8.15** | **2026-05-16** | **[Option A]** K72  STANDARD Stealth （CDR3 10–14 aa）。**[Option B]** VL-（§1a.1）： k45_orig=L + CDR3<18 + k45  Tier 1  →  Tier 2 Hallmark。：CD3 panel n=6，Teplizumab/Otelixizumab  k45L→R + k47W→G；SP34/Visilizumab  K72D；。****：§1a VL-（Zone 1 FR2  / Zone 2 FR3  / Zone 3 CDR3 ）。 |
|| **V1.8.16** | **2026-05-16** |  SASA （§1a.2）：NanoBodyBuilder2  + BioPython ShrakeRupley  k45/k47/k37 SASA；（Teplizumab k45=L SASA=99.5 Å² vs k45=R SASA=127.1 Å²）；：（R）（L）；CD3 panel n=6  PASS（Zone 1 ）。 |
|| **V1.8.17** | **2026-05-16** | **(1) Stealth **： CDR3- **net_basic/pI **（NONE ≤2 / MINIMAL 3–4 / STANDARD 5–6 / FULL ≥7  pI≥9.0）。（6 CD3 Fv ABodyBuilder2 ）： Stealth K  VH+VL  SASA ≈94 Å²（， VL ），Stealth  charge ， BSA→SASA 。**(2) Y91/F91 + W103 **（，）：n=130 VHH （r=−0.23, p=0.008） CDR3-drape （ΔSASA ≈−8 Å²），。Hallmark（L45R/W47G/G44E） VL-SASA （50 Å²）****。 |

---

**：** InSynBio Antibody Engineering Team  
**：**  (LOCKED)  
