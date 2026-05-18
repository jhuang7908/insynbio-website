# 

 125  + 。

---

## 、（ 125 ）

|  |  |  |  |
|----------|------|--------------|----------|
| **TCE（CD3 ）** | 65 | BCMA-CD3, CD20-CD3, PSMA-CD3, CD123-CD3, CD19-CD3 | IgG-like 36 / scFv-like 29 |
| **** | 24 | PD-L1+4-1BB, LAG3+CTLA4, PD-1+CTLA4 |  IgG-like |
| **** | 9 | EGFR+MET, HER2 , PD-L1+CD47 | IgG-like  |
| **** | 27 | 、 |  |

****：TCE （52%），（19%）。

---

## 、125 

### 2.1  × 

- **TCE**：IgG-like  scFv-like ，/CMC 
- ****： IgG-like （Fc 、）
- ****： IgG-like （KiH、CrossMab、DVD-Ig）

### 2.2 TCE （Top 5）

|  | CD3  |  |
|----------|------------|--------|
| BCMA | 8 |  |
| CD20 | 4 | B  |
| PSMA | 3 |  |
| CD123 | 3 | AML |
| CD19 | 2 | B-ALL |

### 2.3 （functional_domains.json）

- **Linker**：G4S1/3/5/6、EAAAK3
- **KiH**：Knob-in-hole 
- **Binder**：FMC63(CD19)、c11D5.3(BCMA)、m971(CD22)、SS1(MSLN)、YP7(GPC3)、OKT3(CD3)
- ****：Tandem VHH、KiH IgG

---

## 、（ + ）

```

    ↓
（TCE /  / ）
    ↓
（ 125 ：IgG-like vs scFv-like）
    ↓
（ 125 ）
    ↓

    ├─ scFv-like：Tandem scFv + Linker（G4S3 ）→ ESMFold 
    ├─ IgG-like：KiH + CrossMab → ColabFold 
    └─ Tandem VHH：VHH1-linker-VHH2 →  design_bispecific.py
    ↓
 / （AbEngineCore）
```

---

## 、

|  |  |  |
|------|------|------|
| **125 ** | slice_4  ID  |  format_raw、、linker 、Fc  → JSON |
| **→** |  | （TCE→IgG/scFv ；→IgG） |
| **** |  |  125 ， |
| **scFv ** |  |  125  scFv ， |
| **ESMFold ** |  ColabFold  |  scFv  ESMFold  |

---

## 、

1. **P0**： 125  JSON（format、targets、phase、fc_isotype、format_raw）
2. **P1**： design_bispecific.py，「→」+「」
3. **P2**： 125  scFv ， ESMFold 
4. **P3**： AbEngineCore /

---

## 、

- `data/thera_sabdab/out/reference_slices.json` → slice_4_bispecific_engineering
- `data/thera_sabdab/out/antibody_meta_models.json` → format、target、clinical、fc
- `data/design_rules/functional_domains.json` → linkers、KiH、binders
- `data/design_rules/bispecific_125_knowledge.json` → 125 （ `scripts/build_bispecific_125_knowledge.py` ）
