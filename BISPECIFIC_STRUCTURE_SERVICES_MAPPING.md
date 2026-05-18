# ： →  → 

 ESMFold / ImmuneBuilder ，。

---

## 、

### 1.1 ESMFold（scFv-like ）

|  |  |  |
|------|------|------------|
| scFv （VH-linker-VL） | PDB + pLDDT | 、CDR 、VH-VL  |
| Tandem scFv（scFv1-linker-scFv2） |  PDB | 、linker 、domain  |

****（， structure_metrics_humanization  BioPython）：

|  |  |  |
|------|------|------------|
| **pLDDT** |  | 、 |
| **VH-VL ** |  | 、 |
| **Vernier packing** |  | 、 |
| **interface_min_dist** |  |  |
| **CDR ** | canonical  | CDR 、 outlier |

**scFv **：、 Fc， **VH-VL **  **linker  domain **。

---

### 1.2 ImmuneBuilder（IgG-like）

|  |  |  |
|------|------|------------|
| VH + VL | Fab PDB |  Fab  |
| ： Fab  |  | 、 |

****：

|  |  |  |
|------|------|------------|
| **pLDDT** |  |  |
| **VH-VL ** |  |  |
| **interface ** | 、 |  |
| **Vernier packing** |  | 、 |

**IgG-like **： Fc， Fc ； ****（KiH ）、** Fab **。

---

## 、

### 2.1 

|  |  |  |
|------|----------|---------------------|
| **** | 、？ | pLDDT、VH-VL 、interface 、Vernier packing →  |
| **** | 、？ | CDR 、pLDDT  →  CDR  |
| **Linker ** | linker /？ | Tandem scFv  →  domain 、linker / |
| **** | KiH ？ | ， |
| **** | 、CMC ？ | pI、 patch、（+） |
| **** | ？ |  |

### 2.2  vs 

|  |  |
|--------|--------------|
| 、 | 、（ Ab-Ag ） |
| CDR  outlier |  |
| linker  domain  |  linker  |
|  |  |

---

## 、 → 

### 3.1 scFv-like （ESMFold）

|  |  |  |  |
|------|------|------|----------|
| **scFv ** | scFv  | PDB + pLDDT + VH-VL  + interface  | /， |
| **Tandem scFv ** | scFv1-linker-scFv2  |  PDB +  +  | linker 、 |
| **** |  +  | pI、SAP、CDR  |  CMC  |
| **** |  | 、、 |  |

### 3.2 IgG-like （ImmuneBuilder）

|  |  |  |  |
|------|------|------|----------|
| ** Fab ** | VH + VL |  + 13  |  |
| **** |  Fab  | 、 | 、 |
| **** |  | pI、SAP、CDR  | CMC  |
| **** |  |  |  |

### 3.3  Ab-Ag （ColabFold ）

|  |  |  |  |
|------|------|------|----------|
| **** |  PDB | BSA、H-bond、、SC score | 、 |
| **** |  +  |  |  |

---

## 、

|  |  |  |  |
|----------|------|------------|----------|
| **TCE（CD3 ）** | scFv  IgG 、linker  | scFv/IgG 、、 | ESMFold / ImmuneBuilder |
| **** |  |  Fab 、 | ImmuneBuilder |
| **** | IgG 、Fc  | Fab 、 | ImmuneBuilder |
| **Linker ** | 、 | Tandem scFv 、domain  | ESMFold |
| **** |  |  + 13  +  |  |

---

## 、

|  |  |  |
|--------|------|----------|
| **** | PDB + pLDDT + VH-VL  + interface + CDR  | 、 |
| **** | pI、SAP、CDR 、CMC  |  CMC 、 |
| **** | 、、、 |  |
| **125 ** | 、、 |  |

---

## 、

|  |  |  |
|------|------|------|
| scFv ESMFold  |  |  ESMFold， PDB |
| Tandem scFv  |  |  structure_metrics  VH-VL， domain-domain |
|  |  |  Fab， |
| 125  |  | bispecific_125_knowledge.json， design_bispecific |
