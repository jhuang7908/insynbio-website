# v5.2 Core Gates 

## 

v5.2 Core Gates ， v5.2 。

****： v5.2 ， fail，、、。

---

## Gate 

### Gate 1: CDR3 
- ****： query  CDR3  humanized VH  CDR3  100% identical
- ****：`FAIL_GATE_CDR3_MODIFIED`

### Gate 2: FR4  curated IGHJ
- ****：
  - humanized VH  IMGT 118-128 
  -  118-128  11 aa  ∈ curated FR4 
  - provenance = curated FR4（ query、 V）
- ****：`FAIL_GATE_FR4_SOURCE`

### Gate 3: FR4  motif
- ****：
  - FR4  = 11 aa
  - fr4_aa  `^WG.G`（WGQG / WGRG / WGxG）
- ****：`FAIL_GATE_FR4_FORMAT`

### Gate 4: IMGT 
- ****：
  - anarcii(IMGT) 
  - IMGT 118-128 
  -  out_of_domain / gap
- ****：`FAIL_GATE_IMGT_INTEGRITY`

---

## API 

### 

```python
from core.gates.v52_core_gates import (
    run_v52_core_gates,
    build_imgt_numbering_dict_from_rows,
)
from core.segmentation.anarcii_adapter import run_anarcii_imgt

# 1.  query  humanized  IMGT 
query_regions, query_rows, query_provenance = run_anarcii_imgt(query_seq)
humanized_regions, humanized_rows, humanized_provenance = run_anarcii_imgt(humanized_seq)

# 2.  IMGT numbering dict（，）
query_imgt_numbering = build_imgt_numbering_dict_from_rows(query_rows)
humanized_imgt_numbering = build_imgt_numbering_dict_from_rows(humanized_rows)

# 3.  Gate 
gate_result = run_v52_core_gates(
    query_seq=query_seq,
    humanized_seq=humanized_seq,
    query_imgt_numbering=query_imgt_numbering,
    humanized_imgt_numbering=humanized_imgt_numbering,
)

# 4. 
if not gate_result.passed:
    # Gate ，
    raise ValueError(f"v5.2 Core Gate failed: {gate_result.failed_gate}\n{gate_result.message}")
else:
    #  Gate ，
    print("✅ All gates passed")
```

### GateResult 

```python
@dataclass
class GateResult:
    passed: bool  # True  Gate 
    failed_gate: Optional[str] = None  # ，（ "FAIL_GATE_FR4_SOURCE"）
    message: Optional[str] = None  # 
    details: Optional[Dict[str, Any]] = None  # （ Gate ）
```

---

## 

###  1: 

（ `humanize_vhh`, `graft_cdrs_to_template`）， Gate ：

```python
def humanize_vhh(seq: str, ...) -> dict:
    # ...  ...
    
    humanized_seq = graft_cdrs_to_template(...)
    
    # ✅ ： v5.2 Core Gates
    from core.gates.v52_core_gates import run_v52_core_gates
    from core.segmentation.anarcii_adapter import run_anarcii_imgt
    
    #  humanized  IMGT 
    humanized_regions, humanized_rows, _ = run_anarcii_imgt(humanized_seq)
    humanized_pos_to_aa = {row["pos"]: row["aa"] for row in humanized_rows if row.get("aa") and row.get("aa") != "-"}
    humanized_imgt_numbering = {"pos_to_aa": humanized_pos_to_aa}
    
    #  Gate 
    gate_result = run_v52_core_gates(
        query_seq=seq,
        humanized_seq=humanized_seq,
        query_imgt_numbering=query_imgt_numbering,  # 
        humanized_imgt_numbering=humanized_imgt_numbering,
    )
    
    # ❌ Gate fail → 、、
    if not gate_result.passed:
        result['error'] = f"v5.2 Core Gate failed: {gate_result.failed_gate}"
        result['gate_failure'] = {
            'failed_gate': gate_result.failed_gate,
            'message': gate_result.message,
            'details': gate_result.details,
        }
        return result  # ，
    
    # ✅  ALL_GATES_PASS == True 
    result['humanized_sequence'] = humanized_seq
    result['gate_result'] = {
        'passed': True,
        'details': gate_result.details,
    }
    
    # ：FR2 hallmark 、CMC / developability、
    ...
```

###  2: 

， Gate ：

```python
def generate_report(result: dict) -> str:
    #  Gate 
    if result.get('gate_failure'):
        # Gate ，
        return f"Report generation skipped: {result['gate_failure']['failed_gate']}"
    
    if not result.get('gate_result', {}).get('passed', False):
        # Gate ，
        return "Report generation skipped: v5.2 Core Gates not passed"
    
    # Gate ，
    ...
```

###  3: API 

 API ，Gate ：

```python
@app.route('/api/humanize', methods=['POST'])
def humanize_api:
    result = humanize_vhh(...)
    
    if result.get('gate_failure'):
        return jsonify({
            'success': False,
            'error': 'v5.2_core_gate_failed',
            'failed_gate': result['gate_failure']['failed_gate'],
            'message': result['gate_failure']['message'],
        }), 400  # Bad Request
    
    return jsonify({
        'success': True,
        'humanized_sequence': result['humanized_sequence'],
        'gate_result': result['gate_result'],
    }), 200
```

---

## 

### ❌ Gate fail 

1. ****： humanized_sequence
2. ****： CMC、developability、immunogenicity 
3. ****：
4. ****： UI 

### ✅ Gate pass 

1. ****：
   - FR2 hallmark 
   - CMC / developability 
   - Immunogenicity 
   - 

---

## 

### 

1. **FAIL_GATE_CDR3_MODIFIED**
   - ：CDR3 
   - ：， CDR3 

2. **FAIL_GATE_FR4_SOURCE**
   - ：FR4  curated 
   - ： `data/ighj_curated_fr4.json`  FR4

3. **FAIL_GATE_FR4_FORMAT**
   - ：FR4  motif 
   - ： FR4  11 aa， WGxG

4. **FAIL_GATE_IMGT_INTEGRITY**
   - ：IMGT  IMGT 118-128 
   - ：，

---

## 

 Gate ：

```bash
python scripts/test_v52_core_gates.py
```

---

## 

 v5.2  7 ：

> v5.2 ：
> - ❌ " FR4 / J"
> - ❌  J 
> - ❌ " case"

** Gate ，。**

