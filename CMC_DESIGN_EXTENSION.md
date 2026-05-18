# CMC （ pI ）

## 0. SSOT—— 

** SSOT**：`projects/<id>_Redesign/<id>_results.json`。

|  |  |  |  |
|:---|:---|:---|:---|
| 、 | `results.json` | `results.json` |  `internal/*.json`  |
| developability（pI、GRAVY、liabilities ） |  AbEvaluator  evaluation →  `results.developability` | `results.json` |  `internal/developability_*.json`  |
| CMC  | `results`  +  |  `results.json` |  |

****：
- CMC （pI、liability）**** `results.json`  `developability` / `sequences` / evaluation 。
- **** `results.json`， render/export  internal。
- `internal/developability_{id}.json`  **export **，。

## 1. 

|  |  |  |
|:---|:---|:---|
| pI | `design_v3_pi`：FR  K/R→Q/E  pI | pI > 8.5  `fix`  |
| GRAVY、instability、 | ， | — |
| / | ， | — |
| liabilities（N-、、、 Cys） |  + 5.3  | — |

## 2. 

 CMC 「 pI」/ liabilities ，。

## 3. 

- **FR **：FR  liability ；CDR  + 。
- ****：、（ NYS→NQS），。
- ** CDR **： `verify_cdr_preservation` 。
- ** Vernier**： pI ， CDR 。
- ****：/ liability ， FR-only vs  CDR 。

## 4.  liability 

|  |  |  |  |
|:---|:---|:---|:---|
| N-glycosylation | NxS/T (x≠P) | N→Q  S→T（NYS→NQS ） | FR：；CDR：， SPR  |
| deamidation | NG, NS | N→Q  S→A | FR：；CDR： |
| isomerization | DG, DS | D→E | FR：；CDR： |
| free_Cys_candidate | C | C→S  C→A |  Cys； |

## 5. 

### 5.1  `design_v3_liabilities`

****：liabilities  `results.developability.liabilities`（ evaluation/cdr_scan ，SSOT）， `{type, pattern, pos, severity}`；pos  VH+VL  0-based offset， chain + Kabat 。

```python
def design_v3_liabilities(
    v2_vh: str,
    v2_vl: str,
    mouse_vh_kd: Dict,
    mouse_vl_kd: Dict,
    liabilities: List[Dict],  # from cdr_scan / developability
    fr_only: bool = True,     #  FR 
) -> Tuple[str, str, List[Dict[str, Any]]]:
    """
    Apply liability-mitigating mutations where safe (FR-only by default).
    Returns (v3_vh, v3_vl, mutations_list).
    """
```

- ：v2 、 Kabat、liabilities 。
-  liability： pattern/pos， Kabat (chain, pos)。
-  `fr_only=True`  CDR，「」，。
-  FR：， CDR 。
- ： + （ rationale）。

### 5.2  pI 

- ****： `design_v3_pi`（ pI>8.5）， `design_v3_liabilities`（ pI ）。
- ****： v3 = v2 + pI  + liability ； 5.0 。

### 5.3 

 `vh_vl_humanization_v44.json` ：

```json
{
  "cmc_design": {
    "pi_max": 8.5,
    "liability_design": {
      "enabled": true,
      "fr_only": true,
      "types": ["N-glycosylation", "deamidation", "isomerization"]
    }
  }
}
```

## 6. （fix ）

|  |  |
|:---|:---|
| pI > 8.5 |  `design_v3_pi` |
|  HIGH/MEDIUM liabilities  `liability_design.enabled` |  `design_v3_liabilities` |
|  |  pI， liabilities， |

## 7. 

|  |  |
|:---|:---|
| 1 |  `design_v3_liabilities`， FR-only  N-glycosylation、deamidation、isomerization |
| 2 |  fix ， pI  |
| 3 |  5.0  |
| 4 | CDR  liability 「」， |

## 8. 

- **CDR  liability**：NYS  CDR-H2 ，；。
- ** liability **：，（ N-glycosylation > deamidation）。
- ** Cys**：`free_Cys_candidate`  Cys， cdr_scan ，。
