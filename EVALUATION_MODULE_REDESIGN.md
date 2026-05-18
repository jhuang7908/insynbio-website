# InSynBio Evaluation  — 

****: v2.0   
****: 2026-02-23  
****: （/），

---

## 、

|  |  |
|--------|--------|
|  vs （`delta_vs_mouse`） | **** — ， |
|  | ** vs ** |
|  | ：（，） |
| AI CMC | ：， AI /CMC  |

---

## 、

### 2.1 

|  |  |  |  |
|------|------|------|------|
| **structure_13param** |  Fab 13  | PDB | VH-VL 、、Vernier SASA、pLDDT  |
| **developability** | /CMC  | VH+VL  | pI、GRAVY、SAP、CDR  |
| **cdr_scan** | CDR  |  | 、、 |
| **germline** |  842  |  | 、identity%、 |
| **binding_site** |  | PDB +  | BSA、H 、、paratope/epitope |
| **immunogenicity** | InSynBio  In silico |  +  PDB | 、、 |

### 2.2 

|  |  |
|------|------|
| **delta_vs_mouse** | ，； vs  |

### 2.3 

#### A.  vs （`compare_ab_vs_antigen`）

****: ****，//。

|  |  |
|------|------|
|  Ab-Ag  PDB（，） |  paratope/epitope、epitope 、BSA/SC 、 |

****:
-  vs 
-  bin（/）
- 

#### B. （`structure_driven_affinity_maturation`）

****:  Ab-Ag ，。

****: （/），****（ ProteinMPNN ），「」。

|  |  |
|------|------|
| Ab-Ag  PDB、（ CDR-H3）、 | 、 |

****: ；**** ProteinMPNN 。

#### C. AI  / CMC （`ai_developability_suggestions`）

****: （developability、cdr_scan、binding_site、immunogenicity ）， AI /CMC 。

|  |  |
|------|------|
|  evaluation （pI、SAP、CDR 、、） |  CMC 、、（+AI ） |

****:
- ： developability （pI、SAP、CDR ）
- AI ： LLM/，
- ：（、、）

---

## 、

```
                    ┌─────────────────────┐
                    │  PDB /  /   │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌──────────────────┐
│structure_13   │    │ developability  │    │ germline         │
│binding_site   │    │ cdr_scan        │    │ immunogenicity   │
└───────┬───────┘    └────────┬────────┘    └────────┬─────────┘
        │                     │                      │
        └─────────────────────┼──────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ ai_developability   │
                    │ _suggestions        │
                    │        │
                    └─────────────────────┘

        ┌─────────────────────────────────────────────┐
        │ compare_ab_vs_antigen                        │
        │ ( PDB，)                         │
        └─────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────┐
        │ structure_driven_affinity_maturation         │
        │ (Ab-Ag PDB +  → )            │
        │ ，                      │
        └─────────────────────────────────────────────┘
```

---

## 、CLI / API 

### 4.1 

- `evaluate --type humanized`  `delta_vs_mouse` 
- `--ref-pdb` （ delta_vs_mouse）

### 4.2 

```text
#  vs 
evaluate compare-antigen --antigen AG.pdb --antigen-chain A \
  --ab-pdbs ab1.pdb ab2.pdb ab3.pdb --output comparison.json

# 
evaluate affinity-design --complex AbAg.pdb --design-region CDR-H3 \
  --fixed-positions fixed.json --num 50 --output candidates.fasta

# AI 
evaluate ai-cmc-suggestions --eval-result project_eval.json --output suggestions.md
```

### 4.3 

- `evaluate --type fully_human`
- `evaluate --type humanized` ，**** `delta_vs_mouse`， structure_13param、developability、germline、immunogenicity 

---

## 、

|  |  |  |
|------|------|--------|
| **P0** |  `delta_vs_mouse`， CLI |  |
| **P1** |  `compare_ab_vs_antigen`（ interface_metrics） |  |
| **P2** | （ tools，） |  |
| **P3** |  `ai_developability_suggestions`（+ LLM） | – |

---

## 、（-facing）

|  |  |
|----------|--------------|
| `structure_13param` |  13  |
| `binding_site` |  |
| `compare_ab_vs_antigen` |  vs  |
| `structure_driven_affinity_maturation` | ****（ MPNN ） |
| `ai_developability_suggestions` | **AI /CMC ** |
| `immunogenicity` | InSynBio  In silico Evaluation |

---

## 、 pipeline 

- ** pipeline**（`run_vhvl_v44_pipeline` / `fix`）：→； delta_vs_mouse ， pipeline 。
- **Evaluation **：****， delta_vs_mouse；、、AI CMC 。
