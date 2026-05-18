# VHH-SAFEDevelopability

## 

Human VH3 VHH-SAFEdevelopability，CMC。。

## 

### 1. `core/vhh_developability.py`

developability，：

- **`analyze_developability`**: VHHdevelopability
  - CMC liabilities（N-、、、）
  - FR2FR3
  - developability（0-1）

- **`_assess_fr2_risk`**: FR2
  - 
  - patches
  - 
  - 

- **`_assess_fr3_risk`**: FR3

### 2. `scripts/score_vhh_safe_templates.py`

developability：

```bash
python scripts/score_vhh_safe_templates.py
```

****：
-  `human_vh3_vhh_safe_templates.json`
- developability
-  `developability` 
- JSON
- 

****：
```json
{
  "developability": {
    "score": 0.410,  // 0-1，
    "liabilities": [
      {
        "type": "deamidation",
        "position": 61,
        "motif": "NS",
        "risk": "high",
        "description": "Deamidation site: NS"
      }
    ],
    "fr2_risk": 0.3,  // FR2（0-1）
    "fr3_risk": 0.2,  // FR3（0-1）
    "cmc_summary": {
      "total_flags": 5,
      "risk_level": "medium"
    },
    "notes": "Low risk profile"
  }
}
```

## 

### Developability

1. ****: 0.5

2. ****:
   - liability: -0.08
   - liability: -0.04
   - FR2: -0.15 × fr2_risk
   - FR3: -0.10 × fr3_risk

3. ****:
   - : +0.2
   - : +0.1
   - FR2 < 0.3: +0.1
   - FR3 < 0.3: +0.05

4. ****: 0-1

### 

，：

```
 = 0.6 × structure_match_score + 0.4 × dev_score
```

：
- `structure_match_score = framework_identity × cdr_compatibility_score × key_position_score`
- `dev_score = developability.score`

## 

### 

```bash
python scripts/score_vhh_safe_templates.py
```

### 

Developability：

```python
from core.vhh_humanization import humanize_vhh

result = humanize_vhh(seq, panel='A', top_k=5)

# developability
best = result['best_match']
print(f"Developability: {best['developability_score']:.3f}")
print(f": {best['combined_score']:.3f}")

# developability
for cand in result['candidates']:
    scores = cand['alignment_scores']
    print(f"{cand['template_id']}: "
          f"identity={scores['framework_identity']:.1%}, "
          f"dev={scores.get('developability_score', 0.5):.3f}, "
          f"combined={scores.get('combined_score', 0):.3f}")
```

## 

### CMC Liabilities

- **N-**: NXS/T（X ≠ P）
- ****: NG, NS, NN
- ****: DP, DS, DG, DT
- ****: M, W

### 

- **FR2**: 
  -  > 60%: 
  -  ≥ 4: 
  -  > 30%: 

- **FR3**:
  -  > 55%: 
  -  ≥ 5: 

## 

，：

```
[] Developability:
  : 0.200
  : 0.410
  : 0.000

[] :
   (≥0.8): 0 (0%)
   (0.6-0.8): 0 (0%)
   (<0.6): 90 (100%)

[] Liabilities:
  : 630
  : 90 (100%)
  : 7.00
```

## 

1. ****: Developability，，。

2. ****: developability，0.5。

3. ****: developability（60%:40%）。

4. **Fallback**: developability，，。

## 

- ****: `core/vhh_developability.py`
- ****: `scripts/score_vhh_safe_templates.py`
- ****: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`
- ****: `core/vhh_humanization.py`
- **CMC**: `core/cmc/generic_cmc_scanner.py`


















