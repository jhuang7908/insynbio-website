# Rulebook v1.0 

## 

✅ ****

## 1. Rulebook 

### 
- ****: `core/humanize/rulebook_v1.py`
- ****: `core/humanize/mutations_rules.py` 
- ****: `core/humanize/vhh_classic_panel.py` 

### 
：
- `rule_id`: 
- `layer`:  (A/B)
- `target_region`:  (FR2/Vernier)
- `purpose`: 
- `evidence_level`: 
- `trigger_conditions`: 
- `action`: 
- `default_mode`:  (MVP/EXPERT)
- `risk_level`:  (LOW/MEDIUM/HIGH)
- `rationale_template`: 
- `rationale_explanation`: 
- `excluded_positions`: 
- `excluded_rationale`: 

## 2. 

### Layer A (Hard Rule) - Hallmark

****:
- `HALLMARK_FR2_44`: G44E
- `HALLMARK_FR2_45`: L45R

****:
- ✅ `rationale_explanation`: 44/45MVP
- ✅ `excluded_positions`: [37, 47, 49] - 
- ✅ `excluded_rationale`: 37/47/49，V2

**** (HALLMARK_FR2_44):
```
rationale_explanation: 
"Position 44 (Kabat) is selected as MVP minimal strong evidence set because:
1. High conservation in VHH sequences (E/Q frequency >80%)
2. Direct impact on aggregation risk (hydrophilic interface)
3. Low structural risk (FR2 surface position)
4. Positions 37/47/49 have higher variability and are reserved for V2 expansion"

excluded_positions: [37, 47, 49]
excluded_rationale: 
"Positions 37, 47, 49 show higher variability across VHH sequences and may have 
context-dependent effects. They are reserved for V2 expansion with additional 
structural validation."
```

### Layer B (Conditional Rule) - Vernier

****:

#### a) Vernier-Anchor 
- `rule_id`: `VERNIER_ANCHOR`
- `default_mode`: `EXPERT` 
- `risk_level`: `MEDIUM`
- （expert_mode）

#### b) Vernier-Tuning 
- `rule_id`: `VERNIER_TUNING`
- `default_mode`: `MVP` 
- `risk_level`: `LOW`
- : 27-30, 49, 71, 73, 78, 93, 94

## 3. 

### JSON

 (`mutations[]`) ：
```json
{
  "rule_id": "HALLMARK_FR2_44",
  "layer": "A",
  "risk_level": "low",
  "purpose": "Maintain VHH hydrophilic FR2 interface to reduce aggregation risk",
  "evidence_level": "rule_based",
  "trigger_explanation": "Query Kabat 44: E | Scaffold Kabat 44: G | Condition: {...}",
  "numbering": {
    "kabat": 44,
    "imgt": "44"
  },
  "from_aa": "G",
  "to_aa": "E",
  "rationale": "..."
}
```

### Markdown

**Rulebook Summary** ：
- Rulebook
- 
- （MVP）
- 

****:
```markdown
## Rulebook Summary

**Rulebook Version**: v1.0
**Mode**: MVP

**Triggered Rules**:
- HALLMARK_FR2_44
- HALLMARK_FR2_45
- VERNIER_TUNING

**Disabled High-Risk Rules** (not enabled in current mode):
- **VERNIER_ANCHOR** (Layer B, Risk: medium): Not enabled in mvp mode (requires expert_mode)

**Total Mutations Applied**: 44
```

### JSON

```json
{
  "rulebook_summary": {
    "rulebook_version": "v1.0",
    "mode": "mvp",
    "triggered_rules": [...],
    "available_rules": [...],
    "disabled_high_risk_rules": [...],
    "total_mutations": 44
  }
}
```

## 4. 

### 
- ✅ MVP， `sequence_final` 
- ✅ 
- ✅ ，

### 
- ✅ `test_rulebook_mvp_mode_no_sequence_change`: MVP
- ✅ `test_rulebook_expert_mode_vernier_anchor`: expert
- ✅ `test_rulebook_mutations_include_all_fields`: 

****: 21 ✅

## 5. 

### 
1. ✅ `core/humanize/rulebook_v1.py` - Rulebook
2. ✅ `core/humanize/mutations_rules.py` - 
3. ✅ `core/humanize/vhh_classic_panel.py` - 
4. ✅ `scripts/run_vhh_classic_panel.py` - 
5. ✅ `tests/test_rulebook_v1.py` - 

### 
1. ✅ `output/regression_test_7d12/classic_panel_rulebook_v1/vhh_classic_panel.json`
2. ✅ `output/regression_test_7d12/classic_panel_rulebook_v1/vhh_classic_panel.md`

### 
1. ✅ `scripts/verify_rulebook_v1_requirements.py` - 

## 6. 

### 
```bash
$ python scripts/verify_rulebook_v1_requirements.py
================================================================================
Rulebook v1.0 
================================================================================

1. ...
  ✅ 

2. Layer A...
  ✅ Layer A

3. Layer B...
  ✅ Layer B

4. JSON...
  ✅ JSON

5. Markdown...
  ✅ Markdown Rulebook Summary 

================================================================================
✅ ！
================================================================================
```

### 
```bash
$ pytest tests/test_rulebook_v1.py tests/test_vhh_classic_panel.py -q
.....................                                                    [100%]
21 passed in 78.48s
```

## 7. 

### 
- ✅  `purpose`  `rationale_explanation`
- ✅ ，
- ✅ `trigger_explanation`  query vs scaffold 

### 
- ✅ 
- ✅ Rulebook Summary 
- ✅ 

### 
- ✅ Layer A: （Hallmark，MVP）
- ✅ Layer B: （Vernier，Anchor/Tuning）
- ✅ : MVP/EXPERT 

### 
- ✅ MVP，`sequence_final` 
- ✅ 
- ✅ ，

## 8. 

### Classic Panel (MVP)
```bash
python scripts/run_vhh_classic_panel.py input.json --output-dir output
```

### Classic Panel (Expert)
```bash
python scripts/run_vhh_classic_panel.py input.json --output-dir output --expert-mode
```

### Rulebook Summary
```python
import json
with open("output/vhh_classic_panel.json", encoding="utf-8") as f:
    data = json.load(f)
    
summary = data["rulebook_summary"]
print(f"Mode: {summary['mode']}")
print(f"Triggered: {summary['triggered_rules']}")
print(f"Disabled: {[r['rule_id'] for r in summary['disabled_high_risk_rules']]}")
```

## 9. 

### V2 
1. **Layer C**: 
2. **Hallmark**: 37, 47, 49
3. **Canonical**: CDR canonical
4. ****: 

## 10. 

✅ ****
- Rulebook ✅
-  (A/B) ✅
-  ✅
-  ✅
-  ✅
- 7D12 ✅

**！**

