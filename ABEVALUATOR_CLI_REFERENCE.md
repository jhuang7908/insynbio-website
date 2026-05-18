# AbEvaluator 

****: v1.0 | ****: 2026-02-23  
****: InSynBio AbEngineCore —  CLI

---

## 、

|  |  |
|------|------|
| ** CLI** | `python Abenginecore/abenginecore.py evaluate <project_name> [options]` |
| **** | `python scripts/run_ab_evaluator.py [options]` |

---

## 、

|  |  |  |  |
|------|------|------|--------|
| `project_name` | ✓ |  | — |
| `--type` | | ：`fully_human` / `humanized` / `mouse_parent` | `fully_human` |
| `--pdb` | | PDB  | — |
| `--ref-pdb` | |  PDB（`humanized`  delta_vs_mouse ） | — |
| `--vh-chain` | | VH  ID | `H` |
| `--vl-chain` | | VL  ID | `L` |
| `--vh-seq` | | VH  | — |
| `--vl-seq` | | VL  | — |
| `--antigen-chain` | |  ID（`binding_site` ） | — |
| `--cdr-json` | | CDR  JSON （`tap` ） | — |
| `--modules` | |  |  |
| `--out`, `-o` | |  JSON  | stdout |
| `--use-iedb` | |  IEDB  API |  |
| `--no-strict-qa` | |  QA （ WARN） |  |

---

## 、

|  |  |  |  |
|------|------|------|----------|
| `structure_13param` | 13  | PDB |  |
| `tap` | TAP （PSH/PPC/PNC/SFvCSP/CDR Length） | PDB + cdr_seqs |  |
| `developability` | pI、GRAVY、SAP、CMC  |  |  |
| `cdr_scan` | CDR  |  |  |
| `germline` | 、identity% |  |  |
| `immunogenicity` | MHC-II +  | （ PDB） |  |
| `binding_site` | 、BSA、H 、 | PDB + antigen_chain | humanized / fully_human |
| `delta_vs_mouse` |  vs  | PDB + ref_pdb | humanized |

---

## 、

### 4.1 

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --vh-seq "QVQLVQSGAEVKKPGASVKVSCKASGYTFT..." \
  --vl-seq "DIQMTQSPSSLSASVGDRVTITC..." \
  --modules developability cdr_scan germline immunogenicity \
  -o my_ab_eval.json
```

### 4.2 （PDB + ）

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb path/to/antibody.pdb \
  --vh-seq "QVQL..." --vl-seq "DIQM..." \
  --modules structure_13param developability germline cdr_scan immunogenicity \
  -o my_ab_eval.json
```

### 4.3  + TAP（ cdr_seqs）

```bash
#  cdr_seqs.json: {"H1":"GFTFSSYD","H2":"...","H3":"...","L1":"...","L2":"...","L3":"..."}
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb antibody.pdb \
  --vh-seq "QVQL..." --vl-seq "DIQM..." \
  --cdr-json cdr_seqs.json \
  --modules tap structure_13param developability immunogenicity \
  -o my_ab_eval.json
```

### 4.4 （ delta）

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type humanized \
  --pdb humanized.pdb \
  --ref-pdb mouse.pdb \
  --modules structure_13param delta_vs_mouse developability immunogenicity \
  --no-strict-qa \
  -o my_ab_eval.json
```

### 4.5 Ab-Ag 

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb complex.pdb \
  --antigen-chain C \
  --modules binding_site structure_13param developability \
  -o my_ab_eval.json
```

### 4.6  IEDB 

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb antibody.pdb \
  --vh-seq "QVQL..." --vl-seq "DIQM..." \
  --modules immunogenicity developability \
  --use-iedb \
  -o my_ab_eval.json
```

---

## 、

```json
{
  "project_name": "my_ab",
  "ab_type": "fully_human",
  "overall_status": "PASS",
  "modules_run": ["structure_13param", "developability", "germline"],
  "overall_flags": [],
  "results": {
    "structure_13param": { "status": "PASS", "metrics": {...} },
    "developability": { "pI_fab_estimate": 7.2, "GRAVY": -0.31, ... },
    "germline": { "closest_vh_germline": "IGHV3-23*01", ... },
    "_qa": { "status": "PASS", "n_pass": 5, "n_warn": 0, "n_fail": 0 }
  }
}
```

---

## 、cdr_seqs JSON 

`--cdr-json`  JSON ：

```json
{
  "H1": "GFTFSSYD",
  "H2": "ISYDGSNKYYADSVKG",
  "H3": "ARDYYYGMDV",
  "L1": "QSISSY",
  "L2": "AAS",
  "L3": "QQSYSTPLT"
}
```

---

## 、

- [ABEVALUATOR_SERVICE_GUIDE.md](ABEVALUATOR_SERVICE_GUIDE.md) —   
- [EVALUATION_SERVICE_CAPABILITIES.md](EVALUATION_SERVICE_CAPABILITIES.md) —   
- [ABENGINECORE_CLI_USAGE.md](../Abenginecore/ABENGINECORE_CLI_USAGE.md) —  AbEngineCore 
