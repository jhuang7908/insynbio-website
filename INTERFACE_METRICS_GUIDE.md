# Antibody-Antigen Interface Metrics — 

****: v1.0  
****: InSynBio AbEngineCore v1.0  
****: `core/evaluation/interface_metrics.py`  
****: -（VH/VL  VHH）  

---

## 

，。：  
①   
② /  
③   
④   

---

## ：

### 1.1 BSA — （Buried Surface Area）

****: Å²  
****: `BSA = SASA(Ab_isolated) + SASA(Ag_isolated) − SASA(complex)`  
 SASA  Shrake-Rupley ， 1.4 Å。

****  
BSA ""，。  
- ，、，（ΔG）。  
- BSA （< 1000 Å²）。  
-  1400–2200 Å²。

|  |  |
|------|------|
| `bsa_total_A2` | （ + ） |
| `bsa_polar_A2` | （N、O、S），H/ |
| `bsa_nonpolar_A2` | （C）， |

****  
|  |  BSA |
|----------|---------|
|  | 800–1200 Å² |
|  | 1400–2200 Å² |
|  | > 2500 Å² |

****  
- BSA < 1200 Å² →  CDR3 、； CDR 。  
- BSA  > 60% →  pH ，（ pH）（FcRn ）。

---

### 1.2 Paratope / Epitope 

****  
- **Paratope**:  ≤ 5 Å 。  
- **Epitope**:  ≤ 5 Å 。

****  
- Paratope ""，。 paratope  15–25 （VH ）。  
- Epitope ，-，（blocking activity）。

****  
- Paratope VH : VL （ VH > 85%） VL ， VL 。  
- Epitope （ PD-L1  IgV ），—— Ag 。

---

### 1.3 VH / VL 

****: Paratope  VH  VL （%）。

****  
 VH （CDR H3 、），VL 。  
：VH 55–70%，VL 30–45%。

****  
- VH  > 80%： VH CDR ；VL 。  
- VL  > 50%： VHH ；VL CDR1/CDR3 。

---

### 1.4  CDR  BSA 

****:  CDR （H1/H2/H3/L1/L2/L3）， SASA 。

****  
CDR H3 （30–50%  BSA），。 CDR """"：  
- CDR H1/H2： VH ，。  
- CDR L1/L3： VL （ hapten ）。  
- CDR L2：， CDR。

****  
-  CDR H3  < 3：，。  
- "dominant_cdr_by_contacts"  CDR， CDR。

---

## ：

### 2.1 （H-bonds）

****: （N、O）-（N、O） < 3.5 Å，-。

****  
， H  **−1  −5 kcal/mol** 。  
-  H ，—— H 。  
- H  kon/koff ： H  koff（ KD ）。

****  
|  | H  |
|----------|---------|
| / | < 5 |
|  | 8–20 |
| （pM ） | > 20 |

****  
- H  < 5：，pH ，。  
- ， H （ Ser/Thr/Asn）。

---

### 2.2 （Salt Bridges）

****: （Arg、Lys）（NZ、NE、NH1、NH2）（Asp、Glu）（OD1、OD2、OE1、OE2） < 4.0 Å。

****  
， **−1  −3 kcal/mol**（， −0.5 kcal/mol）。  
 **pH **：  
-  pH（7.4）：。  
-  pH（5.5–6.0）：Asp/Glu ， → 。  
-  FcRn  IgG  pH （sweeping antibody）。

****  
-  = 0： pH ， pH 。  
-  ≥ 3： pH 。  
- Arg  Lys （， H ）。

---

### 2.3 （Hydrophobic Contacts）

****: （Ala、Val、Ile、Leu、Met、Phe、Trp、Pro、Tyr） < 4.5 Å。

****  
-（ ΔG  50–80%）。：  
- 。  
- ， →  → ΔG 。  
- （ SC）。

****  
-  > 15：；"stickiness"。  
- （developability）， patch（> 400 Å² ）。

---

### 2.4 （Van der Waals Contacts）

****:  3.6–4.5 Å （< 3.6 Å ，> 4.5 Å ）。

****  
VdW ， < 0.1 kcal/mol，。VdW ：，（"lock and key"）。

****  
- VdW  H  → ""，。  
- ，（ Val→Ile、Gly→Ala） VdW ，。

---

### 2.5 π-π （π-π Stacking）

****: （Phe、Tyr、Trp、His） < 5.5 Å， < 30° 60–90°（T ）。

****  
π-π ， **−1  −2 kcal/mol**，/。  
- **（< 30°）**: ，，。  
- **T （60–90°）**: -，。  
Trp  π-π  cation-π ， CDR 。

****  
- CDR H3  Trp （ π ，）。  
-  Phe-Phe ， Phe → Trp 。

---

### 2.6 Cation-π 

****: Arg/Lys （NZ、NE、NH1、NH2） < 6.0 Å。

****  
Cation-π （**−2  −5 kcal/mol**）， π 。  
- Arg （Tyr、Trp、Phe） cation-π -。  
- ，cation-π  pH （ π ）。  
- （nM ） CDR H3 Arg  Tyr/Trp  cation-π 。

****  
- Cation-π  ≥ 2：， pH 。  
- ， Arg  Trp（ Lys  Phe） cation-π 。

---

## ：

### 3.1 Paratope / Epitope 

****:  Arg、Lys（+1 each） Asp、Glu（-1 each）。

****  
-  **** （kon ）：-。  
- Paratope  pI ： paratope （、）。

---

### 3.2 （Charge Complementarity）

****: `CC = −(q_paratope × q_epitope)`  
CC > 0：（ ↔ ，）  
CC < 0：  
CC = 0：  

****  
：  
1. ****（> 20 Å）：，（ kon， 10–100 ）。  
2. ****：。  

****  
| CC  |  |
|--------|------|
| > +2 | ，kon ， |
| 0  +2 | ， |
| < 0 | ， |

****  
- CC ： CDR ； pI 。  
-  BSA  CC：，，" kon、 koff"。

---

## ：

> ****: ，。 ΔG  MM-GBSA/MM-PBSA  FEP （ MD ，）。

### 4.1 ΔG_BSA（Chothia, 1974）

****: `ΔG_BSA = −0.0057 × BSA (Å²)` [：kcal/mol]  
：Chothia & Janin 1975，。

****

| ΔG_BSA (kcal/mol) | KD（，25°C） |
|--------------------|----------------|
| −5  −7 | 100 nM – 1 μM |
| −8  −10 | 1–100 nM |
| −11  −14 | 10 pM – 1 nM |

### 4.2 ΔG /（Lo Conte et al., 1999）

****:  
- `ΔG_nonpolar = −0.013 × BSA_nonpolar` (，，)  
- `ΔG_polar = +0.026 × BSA_polar` (，，)  
- `ΔG_total = ΔG_nonpolar + ΔG_polar`

****  
 BSA ""（desolvation），。 BSA ，。  

****  
- `ΔG_polar / ΔG_total` > 0.5 → ，；  
  。

---

## ：（Shape Complementarity, SC）

****: Lawrence & Colman, 1993  
****:   
****: 0 1

****  
SC ，"-"(lock-and-key) ""(induced fit) 。  
- SC  → ，，koff ，。  
- SC  → ，。

****  
|  |  SC |
|-------------|---------|
| - | 0.70–0.76 |
| - | 0.64–0.72 |
|  | 0.70–0.76 |
| -VHH | 0.66–0.74 |

****  
- SC < 0.55：， CDR loop 。  
- SC ≥ 0.70（ excellent）：， CDR 。

---

## ：（Blocking Analysis）

****: `blocking_ref` （-）。  
****: Epitope 。

****  
（competitive blocking）：  
- **PD-1/PD-L1 **： epitope  PD-L1  PD-1 。  
- **VEGF **： VEGFR 。  
- **IL-6R **： IL-6 。

****  
|  |  |
|------|------|
| `blocking_ref_overlap` |  epitope  |
| `blocking_ref_count` |  |
| `is_competitive_blocker` | True =  |

---

## 

```
                    ┌──────────────────────────────────┐
                    │               │
                    └──────────────────────────────────┘
    BSA               1400–2200 Å²
    H-bonds           ≥ 10
    Salt bridges      1–4（pH ）
    Hydrophobic       10–25 
    SC score          ≥ 0.64
    CC score          > 0
    ΔG_BSA            < −8 kcal/mol（ nM ）
    Paratope          15–25 （VH ，55–70%）
    CDR H3            （dominant_cdr_by_contacts = H3）
    is_blocker        True（-）
```

---

## （Flags）

|  |  |  |
|------|----------|----------|
| `WARN:small_BSA` | BSA < 1200 Å² | ； |
| `WARN:large_BSA` | BSA > 2500 Å² |  |
| `WARN:few_hbonds` | H  < 5 | ； CDR  |
| `INFO:no_salt_bridges` |  = 0 | pH ； pH  |
| `WARN:low_SC` | SC < 0.55 | ； |
| `INFO:excellent_SC` | SC ≥ 0.70 |  |

---

## 

1. Chothia, C. & Janin, J. (1975). Principles of protein-protein recognition. *Nature*, 256, 705–708.  
2. Lawrence, M.C. & Colman, P.M. (1993). Shape complementarity at protein-protein interfaces. *J Mol Biol*, 234, 946–950.  
3. Lo Conte, L., Chothia, C. & Janin, J. (1999). The atomic structure of protein-protein recognition sites. *J Mol Biol*, 285, 2177–2198.  
4. Sheinerman, F.B., Norel, R. & Honig, B. (2000). Electrostatic aspects of protein-protein interactions. *Curr Opin Struct Biol*, 10, 153–159.  
5. Dougherty, D.A. (1996). Cation-π interactions in chemistry and biology. *Science*, 271, 163–168.  
6. Hunter, C.A. & Sanders, J.K.M. (1990). The nature of π-π interactions. *J Am Chem Soc*, 112, 5525–5534.  
7. Ramaraj, T. et al. (2012). Antigen-antibody interface properties. *Protein Eng Des Sel*, 25, 409–418.

---

* InSynBio AbEngineCore v1.0 ，。*  
*， `docs/` 。*
