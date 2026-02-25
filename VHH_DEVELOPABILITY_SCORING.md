# VHH-SAFE模板Developability评分

## 概述

为Human VH3 VHH-SAFE模板库添加了developability（可开发性）评分，用于评估模板的CMC风险和聚集性风险。该评分会影响模板选择时的排序。

## 实现模块

### 1. `core/vhh_developability.py`

核心developability分析模块，提供以下功能：

- **`analyze_developability()`**: 分析VHH框架的developability
  - CMC liabilities扫描（N-糖基化、脱酰胺、异构化、氧化）
  - FR2和FR3区域聚集性风险评估
  - 计算总体developability得分（0-1）

- **`_assess_fr2_risk()`**: 评估FR2区域的聚集性风险
  - 疏水残基比例
  - 连续疏水残基patches
  - 电荷不平衡
  - 高风险模式检测

- **`_assess_fr3_risk()`**: 评估FR3区域的聚集性风险

### 2. `scripts/score_vhh_safe_templates.py`

为模板库添加developability评分的脚本：

```bash
python scripts/score_vhh_safe_templates.py
```

**功能**：
- 读取 `human_vh3_vhh_safe_templates.json`
- 为每个模板计算developability评分
- 添加 `developability` 字段到每个模板
- 保存更新后的JSON文件
- 输出统计信息

**输出字段**：
```json
{
  "developability": {
    "score": 0.410,  // 0-1，越高越好
    "liabilities": [
      {
        "type": "deamidation",
        "position": 61,
        "motif": "NS",
        "risk": "high",
        "description": "Deamidation site: NS"
      }
    ],
    "fr2_risk": 0.3,  // FR2聚集性风险（0-1）
    "fr3_risk": 0.2,  // FR3聚集性风险（0-1）
    "cmc_summary": {
      "total_flags": 5,
      "risk_level": "medium"
    },
    "notes": "Low risk profile"
  }
}
```

## 评分算法

### Developability得分计算

1. **基础得分**: 从0.5开始

2. **扣分规则**:
   - 每个高风险liability位点: -0.08
   - 每个中风险liability位点: -0.04
   - FR2风险: -0.15 × fr2_risk
   - FR3风险: -0.10 × fr3_risk

3. **奖励规则**:
   - 无高风险位点: +0.2
   - 无中风险位点: +0.1
   - FR2风险 < 0.3: +0.1
   - FR3风险 < 0.3: +0.05

4. **最终得分**: 限制在0-1范围内

### 综合评分公式

在模板选择时，综合得分计算为：

```
综合得分 = 0.6 × structure_match_score + 0.4 × dev_score
```

其中：
- `structure_match_score = framework_identity × cdr_compatibility_score × key_position_score`
- `dev_score = developability.score`

## 使用示例

### 为模板库添加评分

```bash
python scripts/score_vhh_safe_templates.py
```

### 在模板选择中使用

Developability评分会自动影响模板排序：

```python
from core.vhh_humanization import humanize_vhh

result = humanize_vhh(seq, panel='A', top_k=5)

# 查看最佳匹配的developability得分
best = result['best_match']
print(f"Developability得分: {best['developability_score']:.3f}")
print(f"综合得分: {best['combined_score']:.3f}")

# 查看所有候选模板的developability得分
for cand in result['candidates']:
    scores = cand['alignment_scores']
    print(f"{cand['template_id']}: "
          f"identity={scores['framework_identity']:.1%}, "
          f"dev={scores.get('developability_score', 0.5):.3f}, "
          f"combined={scores.get('combined_score', 0):.3f}")
```

## 风险评估

### CMC Liabilities

- **N-糖基化位点**: NXS/T模式（X ≠ P）
- **脱酰胺位点**: NG, NS, NN模式
- **异构化位点**: DP, DS, DG, DT模式
- **氧化位点**: M, W残基

### 聚集性风险

- **FR2风险**: 
  - 疏水残基比例 > 60%: 高风险
  - 连续疏水残基 ≥ 4: 高风险
  - 电荷不平衡 > 30%: 高风险

- **FR3风险**:
  - 疏水残基比例 > 55%: 高风险
  - 连续疏水残基 ≥ 5: 高风险

## 统计信息

运行评分脚本后，会输出统计信息：

```
[统计] Developability评分:
  平均分: 0.200
  最高分: 0.410
  最低分: 0.000

[统计] 得分分布:
  高分 (≥0.8): 0 (0%)
  中分 (0.6-0.8): 0 (0%)
  低分 (<0.6): 90 (100%)

[统计] Liabilities:
  总风险位点数: 630
  有风险的模板数: 90 (100%)
  平均每个模板风险位点数: 7.00
```

## 注意事项

1. **评分相对性**: Developability得分是相对评分，用于模板之间的比较，不是绝对标准。

2. **默认值**: 如果模板没有developability字段，会使用默认值0.5（中等得分）。

3. **权重调整**: 综合评分中结构匹配和developability的权重（60%:40%）可以根据实际需求调整。

4. **Fallback模板**: 对于developability得分很低的模板，可以在逻辑上默认放在后面，或额外扣分。

## 相关文件

- **核心模块**: `core/vhh_developability.py`
- **评分脚本**: `scripts/score_vhh_safe_templates.py`
- **模板文件**: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`
- **人源化模块**: `core/vhh_humanization.py`
- **CMC扫描模块**: `core/cmc/generic_cmc_scanner.py`


















