# P0 | VHH_CYS_PREFLIGHT_CHECK 

## 

✅ ****

## 1. 

### P0
****: `core/preflight/vhh_cys_check.py`

****:
- `run_vhh_cys_preflight_check`: VHH Cys（P0，）
- `detect_cys_positions`: Cys，IMGT/Kabat/AHo
- `check_core_cys_pair`: 

****:
- ：IMGT 23  104（Kabat23104）
-  → `status=fail`, `action=abort`
- Cys（≥3） → `status=pass`, `severity=warning`
- 2Cys → `status=pass`, `severity=info`
- `policy.auto_mutate_extra_cys=false`（，""）

### Classic Panel
****: `core/humanize/vhh_classic_panel.py`

****:
- `generate_vhh_classic_panel`P0
- `action=abort`，blocked variants（`blocked_reason`，`sequence_final`）
- variant`preflight_ref`

****:
- P0
- `action=abort`，`sequence_final`
- variants`preflight_ref`

### 
****: `scripts/generate_vhh_reports_from_panel_json.py`

****:
- **Client CRO Report**: "Pre-flight Quality Gate"
  - Core disulfide pair: PASS/FAIL
  - Extra cysteines: NONE/DETECTED (Warning)
  - FAIL，""

- **Developer Audit Report**: "P0 | VHH_CYS_PREFLIGHT_CHECK"
  - （IMGT/Kabat/AHo）
  - detected_cys_positions / extra_cys_positions
  - 
  - action=abort
  - Policy

## 2. JSON

### 
```json
{
  "preflight_checks": {
    "vhh_cys_check": {
      "status": "pass|fail",
      "severity": "info|warning|error",
      "core_pair_required": true,
      "core_pair_present": true,
      "core_pair_positions": {
        "imgt": [23, 104],
        "kabat": [23, 104],
        "aho": [23, 104]
      },
      "detected_cys_positions": {
        "imgt": [...],
        "kabat": [...],
        "aho": [...]
      },
      "extra_cys_positions": {
        "imgt": [...],
        "kabat": [...],
        "aho": [...]
      },
      "action": "continue|abort",
      "policy": {
        "extra_cys_handling": "warn_only",
        "auto_mutate_extra_cys": false
      },
      "messages": [
        {
          "code": "VHH_CYS_CORE_PAIR_MISSING|VHH_CYS_EXTRA_DETECTED|VHH_CYS_OK",
          "text_en": "...",
          "text_zh": "..."
        }
      ]
    }
  }
}
```

### Variant
```json
{
  "preflight_ref": {
    "vhh_cys_check_status": "pass|fail",
    "vhh_cys_check_severity": "info|warning|error"
  },
  "blocked_reason": {  // action=abort
    "code": "P0_PREFLIGHT_FAILED",
    "details": ["VHH_CYS_CORE_PAIR_MISSING"]
  }
}
```

## 3. 

****: `tests/test_preflight_vhh_cys.py`

****:
1. ✅ `test_standard_vhh_two_cys_core_pair`: VHH（2Cys，）
2. ✅ `test_missing_core_pair`: 
3. ✅ `test_no_cys_at_all`: Cys
4. ✅ `test_extra_cys_with_core_pair`: Cys（≥3Cys，）
5. ✅ `test_numbering_mapping_gap`: /gap
6. ✅ `test_p0_non_bypassable_in_classic_panel`: P0
7. ✅ `test_regression_sequence_consistency`: 

****:
- ✅ P0：action=abort，sequence_final
- ✅ ：Core disulfide pairExtra cysteines
- ✅ ：，sequence_finalbyte-level

## 4. 

### 
- P0VHH
- `action=abort`，humanization panel`sequence_final`
- variants`preflight_ref`

### 
- ， → `action=abort`
- Kabat，IMGT，""

### 
- `policy.auto_mutate_extra_cys=false`
- mutations"Cys"

## 5. 

### 
```python
from core.humanize.vhh_classic_panel import generate_vhh_classic_panel

query = {
    "segments": {...},
    "numbering_maps": {...},
}

result = generate_vhh_classic_panel(query)

# preflight
preflight = result["preflight_checks"]["vhh_cys_check"]
if preflight["action"] == "continue":
    # variants
    variants = result["classic_panel"]
    for variant in variants:
        print(variant["sequence_final"])  # 
```

### 
```python
result = generate_vhh_classic_panel(query)

preflight = result["preflight_checks"]["vhh_cys_check"]
if preflight["action"] == "abort":
    # variantsblocked_reason
    variants = result["classic_panel"]
    for variant in variants:
        assert "sequence_final" not in variant
        assert "blocked_reason" in variant
        assert variant["blocked_reason"]["code"] == "P0_PREFLIGHT_FAILED"
```

## 6. 

✅ ****
- P0 ✅
- Classic Panel ✅
-  ✅
- （7）✅
- JSON ✅
-  ✅

**！**

