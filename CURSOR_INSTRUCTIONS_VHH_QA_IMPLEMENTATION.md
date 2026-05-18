# VHHQA（Cursor）

## 

VHHQA，：
1. QACRO
2. FR4
3. CDR（VHH FR-only）
4. ，""

## 

### 1. QA

** `core/vhh_qa_validation.py`， `validate_vhh_humanization_result` ：**

```python
def validate_vhh_humanization_result(result: dict, strict: bool = True) -> dict:
    """
    VHH。
    
    ：
    - FR1–FR4 & CDR1–3
    - （±3 aa）
    - CDR""（VHH FR-only）
    - CDR3（2-35 aa）
    - FR2 hallmark
    - FR4
    
    Returns:
        {
          "ok": bool,
          "errors": [str],
          "warnings": [str]
        }
    """
```

** `humanize_vhh` QA：**

```python
result = humanize_vhh(...)
qa = validate_vhh_humanization_result(result)
result["qa"] = qa

if not qa["ok"]:
    result["status"] = "FAILED_QA"
    result["success"] = False
    result["error"] = f"QA: {', '.join(qa['errors'])}"
else:
    result["status"] = "OK"
```

### 2. V

**：**

```python
V_REGION_ORDER = ["FR1", "CDR1", "FR2", "CDR2", "FR3", "CDR3", "FR4"]

def rebuild_v_region_from_regions(regions: dict) -> str:
    """IMGTFR/CDR，FR4。"""
    seq_parts = []
    for region in V_REGION_ORDER:
        part = regions.get(region, "")
        if part is None:
            part = ""
        seq_parts.append(part)
    return "".join(seq_parts)
```

**：**

- `graft_cdrs_to_template` 
- `core/vhh_scaffolds/graft_engine.py` 
- 

**：**

```python
def test_rebuild_v_region_includes_fr4:
    regions = {
        "FR1": "AAAA",
        "CDR1": "BBBB",
        "FR2": "CCCC",
        "CDR2": "DDDD",
        "FR3": "EEEE",
        "CDR3": "FFFF",
        "FR4": "GGGG",
    }
    seq = rebuild_v_region_from_regions(regions)
    assert seq == "AAAABBBBCCCCDDDDEEEEFFFFGGGG"
```

### 3. CDR

**mutation plan，CDRhard filter：**

```python
def calculate_mutations(original_seq: str, humanized_seq: str, mode: str = "VHH_FR_ONLY") -> dict:
    """
    （VHH FR-only：CDR）
    
    Returns:
        {
            "mutations": [list],  # FR
            "cdr_differences": [list]  # CDR（，）
        }
    """
    mutations = []
    cdr_differences = []
    
    for i in range(min(len(original_seq), len(humanized_seq))):
        if original_seq[i] != humanized_seq[i]:
            position = i + 1
            region = get_region_for_position(position)
            
            mutation = {
                'position': position,
                'from': original_seq[i],
                'to': humanized_seq[i],
                'region': region
            }
            
            if mode == "VHH_FR_ONLY":
                if region.startswith("CDR"):
                    # VHH：，
                    cdr_differences.append(mutation)
                else:
                    mutations.append(mutation)
    
    return {
        "mutations": mutations,
        "cdr_differences": cdr_differences
    }
```

**mutations：**

```python
def apply_mutations_to_regions(original_regions, mutation_plan):
    regions = deepcopy(original_regions)
    for m in mutation_plan["mutations"]:
        if m["region"].startswith("CDR"):
            continue  # ，
        # ... regionAA ...
    return regions
```

**QACDR：**

```python
cdr_mut = [m for m in mut_list if m.get("region", "").startswith("CDR")]
if cdr_mut:
    errors.append(
        f" {len(cdr_mut)} CDR，'FR-only'。"
    )
```

### 4. Safe_mode

**safe_mode：**

```python
def humanize_vhh_with_qa(seq: str, ..., enable_safe_mode: bool = True):
    # ：
    result = humanize_vhh(seq, ...)
    qa = validate_vhh_humanization_result(result)
    result["qa"] = qa
    
    if qa["ok"]:
        result["status"] = "OK"
        return result
    
    # QA，safe_mode
    if enable_safe_mode:
        safe_result = _try_safe_mode(seq, ...)  # 
        safe_qa = validate_vhh_humanization_result(safe_result)
        
        if safe_qa["ok"]:
            safe_result["status"] = "OK_SAFE_MODE"
            safe_result["fallback_reason"] = "Standard mode failed QA"
            return safe_result
    
    # 
    result["status"] = "FAILED_QA"
    return result
```

**Safe_mode：**
- A
- CMC/
- ： + 

### 5. 

**CRO，status：**

```python
def generate_cro_report(result: dict):
    status = result.get("status", "UNKNOWN")
    
    # ：OK
    if status not in ["OK", "OK_SAFE_MODE"]:
        # 
        qa_result = result.get("qa", {})
        return generate_qa_failure_report(result, qa_result)
    
    # 
    return generate_full_cro_report(result)
```

**：**

```python
def generate_cro_html_report_cn_enhanced(result: dict, output_id: str) -> str:
    """
    CRO
    
    **： status == "OK"  "OK_SAFE_MODE" **
    """
    status = result.get("status", "UNKNOWN")
    if status not in ["OK", "OK_SAFE_MODE"]:
        raise ValueError(
            f" status={status} CRO。"
            f" generate_cro_html_report_failed_cn 。"
        )
    # ...  ...
```

**：**

- 
- QA
- ："，/"
- （、mAb、）

## 

**：**
-  status != "OK" 
- QA""
- ""
- mutation planCDR
- FR4

## 

：
- `test_rebuild_v_region_includes_fr4` - FR4
- `test_validate_vhh_humanization_result_fr4_missing` - QAFR4
- `test_validate_vhh_humanization_result_cdr_mutation` - QACDR
- `test_generate_full_report_only_for_ok_status` - OK
- `test_generate_full_report_raises_for_failed_qa` - FAILED_QA

## 

- [ ]  `core/vhh_qa_validation.py` 
- [ ]  `validate_vhh_humanization_result` 
- [ ]  `rebuild_v_region_from_regions` 
- [ ] 
- [ ]  `calculate_mutations` VHH_FR_ONLY
- [ ]  `humanize_vhh` QA
- [ ] safe_mode
- [ ] status
- [ ] 
- [ ] 

## 

，：
1. ✅ 
2. ✅ FR4
3. ✅ CDR
4. ✅ ，
5. ✅ safe_mode

















