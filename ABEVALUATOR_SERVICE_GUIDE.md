# AbEvaluator 

****: v1.0 | ****: 2026-02-23

## 、

AbEvaluator  InSynBio ，。

|  |  |
|----------|----------|
| / | structure_13param, developability, tap, germline, immunogenicity, cdr_scan |
|  |  + delta_vs_mouse |
| Ab-Ag  | binding_site, structure_13param |

## 、

|  |  |  |
|------|------|------|
| structure_13param | 13  | PDB |
| tap | TAP  | PDB + cdr_seqs |
| binding_site |  | PDB + antigen_chain |
| delta_vs_mouse |  vs  | PDB + ref_pdb |
| developability | pI、GRAVY、SAP |  |
| cdr_scan | CDR  |  |
| germline |  |  |
| immunogenicity | MHC-II +  | （ PDB） |

## 、

**CLI**: `python Abenginecore/abenginecore.py evaluate <project_name> --pdb <path> --modules <list> -o out.json`  
****: `python scripts/run_ab_evaluator.py --project <name> --pdb <path> -o out.json`  
**API**:  [ABEVALUATOR_CLI_REFERENCE.md](ABEVALUATOR_CLI_REFERENCE.md)

## 、

**** **** 。 AbEvaluator ，、、、、， InSynBio （3–5 ）。  

 [ANTIBODY_EVALUATION_DETAIL_SERVICE.md](ANTIBODY_EVALUATION_DETAIL_SERVICE.md)。

## 、

- [ABEVALUATOR_CLI_REFERENCE.md](ABEVALUATOR_CLI_REFERENCE.md) —  CLI   
- [ANTIBODY_EVALUATION_DETAIL_SERVICE.md](ANTIBODY_EVALUATION_DETAIL_SERVICE.md) —   
- [InSynBio_Service_Description_zh.md](InSynBio_Service_Description_zh.md) —   
- [EVALUATION_SERVICE_CAPABILITIES.md](EVALUATION_SERVICE_CAPABILITIES.md) — 
