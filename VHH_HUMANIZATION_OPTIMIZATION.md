# VHH人源化系统优化方案

## 概述

本文档记录了对VHH人源化系统的优化升级，目标是让系统"更稳、更准、更好用、更能卖钱"。

## 一、匹配与人源化算法优化

### 1. CDR兼容性软过滤（已完成）

**改进前**：
- 使用固定阈值0.7进行硬过滤
- 没有fallback机制

**改进后**：
- **硬过滤阈值**（`hard_min_cdr_score = 0.3`）：低于此分数的模板直接排除（除非极端CDR3模式）
- **软过滤阈值**（`soft_min_cdr_score = 0.5`）：低于此分数的模板不作为首选，只能出现在backup列表
- **Fallback机制**：如果primary列表为空，自动使用backup列表，并标记`cdr_compatibility_fallback = True`

**实现逻辑**：
```python
# 将候选分为primary和backup
primary = [t for t in candidates if t["cdr_compatibility"]["score"] >= soft_min]
backup = [t for t in candidates if t["cdr_compatibility"]["score"] < soft_min]

if not primary:
    # fallback：允许使用backup，但标记
    primary = backup
    quality_flags["cdr_compatibility_fallback"] = True
```

**效果**：
- 普通VHH会自然落到"框架+构型"都不错的模板
- 特殊VHH会触发`cdr_compatibility_fallback`标志，提示需要人工审查

### 2. 显式综合评分公式（已完成）

**改进前**：
- 公式：`0.6 * structure_match_score + 0.4 * dev_score`
- 其中`structure_match_score = framework_identity × cdr_compatibility_score × key_position_score`
- 没有显式展示评分细节

**改进后**：
- **新公式**：`combined_score = 0.5 * framework_identity + 0.25 * cdr_compatibility_score + 0.25 * dev_score`
- **Fallback惩罚**：
  - 模板fallback：`combined_score *= 0.8`
  - 编号fallback：`combined_score *= 0.9`
- **显式评分详情**：在结果中直接展示所有评分组件

**输出格式**：
```json
{
  "scoring": {
    "framework_identity": 0.91,
    "cdr_compatibility_score": 0.78,
    "key_position_score": 0.95,
    "developability_score": 0.83,
    "fallback_penalty_factor": 1.0,
    "combined_score": 0.71
  }
}
```

**优势**：
- 评分过程完全透明
- 便于调试和优化
- 便于向用户解释

### 3. 极端CDR3特例模式（已完成）

**触发条件**：
- CDR3长度 >= 20
- 或CDR3中Cys数量 >= 3

**特殊处理**：
- 强制`top_k >= 10`（增加候选数量）
- 要求`cdr_compatibility_score >= 0.4`才能进入primary
- 输出显式风险标志

**输出格式**：
```json
{
  "risk_flags": {
    "long_cdr3": true,
    "noncanonical_disulfide_suspected": true
  }
}
```

**效果**：
- 高价值或高风险项目提前标红
- 有助于整体风控

## 二、Developability / 免疫原性模块升级

### 1. 模板分级系统（已完成）

**分级标准**：

| 等级 | 条件 | 说明 |
|------|------|------|
| **A级** | `dev_score >= 0.8` 且无高危liabilities | 最佳模板，优先使用 |
| **B级** | `0.6 <= dev_score < 0.8` 或有个别可控风险 | 可用，但需注意风险 |
| **C级** | `dev_score < 0.6` 或有≥2个高危位点 | 高风险，需谨慎使用 |

**实现**：
```python
def grade_developability(score: float, liabilities: List[Dict[str, Any]]) -> str:
    high_risk_count = sum(1 for liab in liabilities 
                          if liab.get('risk') == 'high' 
                          and liab.get('type') in ['deamidation', 'isomerization', 'oxidation'])
    
    if score >= 0.8 and high_risk_count == 0:
        return 'A'
    if score < 0.6 or high_risk_count >= 2:
        return 'C'
    return 'B'
```

**模板JSON格式**：
```json
{
  "developability": {
    "score": 0.83,
    "grade": "A",
    "liabilities": [...],
    "notes": "Mild oxidation risk at FR3-M98"
  }
}
```

**模板选择策略**：
- 默认优先选A级模板
- 若只剩B/C级，自动在报告中增加"Developability risk: medium/high"字段

### 2. FR区静态免疫原性屏蔽（已完成）

**原理**：
- CDR的免疫原性需要case by case分析（大坑）
- FR区可以预先做评估（相对安全）

**实现**：
- 对每个Human VHH-SAFE模板的`framework_full`进行HLA hotspot计数
- 基于简化的HLA-II结合motif模式：
  - 带电残基密集区域（DERK连续3+）
  - 芳香族残基密集区域（FWY连续2+）
  - 已知的常见HLA-II结合motif

**输出格式**：
```json
{
  "immunogenicity": {
    "fr_hotspot_count": 2,
    "fr_immuno_risk": "low",  // 'low', 'medium', 'high'
    "hotspots": [
      {
        "position": 45,
        "motif": "DER",
        "type": "charged_cluster",
        "risk": "medium"
      }
    ],
    "recommendation": "FR区免疫原性风险低，适合用于人源化"
  }
}
```

**风险评估**：
- **low**: 无热点或热点很少
- **medium**: 1个高危热点或3+个中危热点
- **high**: 2+个高危热点或5+个总热点

**模板选择规则**：
- 首选`fr_immuno_risk=low`
- 如果选到了medium/high，在报告中标注"FR免疫原性待进一步验证"

### 3. 模板排序优化

**改进前**：
- 仅按综合得分排序

**改进后**：
- 多因子排序：
  1. Developability等级（A > B > C）
  2. FR免疫原性风险（low > medium > high）
  3. 综合得分

**实现**：
```python
def sort_key(item):
    combined = calculate_combined_score(item)
    dev_grade = template.get('developability', {}).get('grade', 'C')
    fr_immuno_risk = template.get('immunogenicity', {}).get('fr_immuno_risk', 'low')
    
    grade_priority = {'A': 3, 'B': 2, 'C': 1}.get(dev_grade, 1)
    immuno_priority = {'low': 3, 'medium': 2, 'high': 1}.get(fr_immuno_risk, 1)
    
    return (grade_priority, immuno_priority, combined)
```

## 三、结果输出增强

### 新增字段

**quality_flags**：
```json
{
  "quality_flags": {
    "cdr_compatibility_fallback": false,
    "extreme_cdr3_mode": false,
    "developability_risk": "low",
    "fr_immuno_risk": "low"
  }
}
```

**best_match新增字段**：
```json
{
  "developability": {
    "score": 0.83,
    "grade": "A",
    "risk": "low",
    "notes": []
  },
  "immunogenicity": {
    "fr_immuno_risk": "low",
    "fr_hotspot_count": 2,
    "notes": []
  },
  "scoring": {
    "framework_identity": 0.91,
    "cdr_compatibility_score": 0.78,
    "developability_score": 0.83,
    "combined_score": 0.71
  }
}
```

## 四、使用示例

### 运行模板评分（包含分级和免疫原性）

```bash
python scripts/score_vhh_safe_templates.py
```

**输出**：
- 更新`human_vh3_vhh_safe_templates.json`，添加：
  - `developability.grade`（A/B/C）
  - `immunogenicity`字段

### 人源化（自动使用分级和免疫原性信息）

```python
from core.vhh_humanization import humanize_vhh

result = humanize_vhh(
    seq="VHH_SEQUENCE",
    panel="A",
    top_k=3
)

# 查看结果
print("Developability等级:", result['best_match']['developability']['grade'])
print("FR免疫原性风险:", result['best_match']['immunogenicity']['fr_immuno_risk'])
print("质量标志:", result['quality_flags'])
```

## 五、优势总结

### 1. 更稳
- CDR兼容性软过滤，避免过度过滤
- Fallback机制，确保总能返回结果
- 极端CDR3特例处理，提前识别高风险项目

### 2. 更准
- 显式评分公式，过程透明
- 多因子排序（等级+风险+得分）
- FR区免疫原性预筛选

### 3. 更好用
- 详细的质量标志和风险提示
- 分级系统，便于用户理解
- 完整的评分详情

### 4. 更能卖钱
- 专业的风险评估
- 透明的评分机制
- 完整的质量保证体系

## 六、后续优化方向

1. **CDR免疫原性分析**（case by case，需要完整HLA预测）
2. **机器学习模型**（基于历史数据预测成功率）
3. **结构预测集成**（AlphaFold2预测，更精准的构型匹配）
4. **能量计算**（结合自由能变化预测）


















