# VHH人源化策略：FR优先 + CDR优化

**版本**: v2.2.0  
**策略生效日期**: 2025-01-20  
**设计原则**: 正式文档，可用于客户和内部说明

---

## 一、设计原则

### 核心理念

**VHH人源化 = 先选好人类FR骨架，再在这个骨架族群里做CDR几何和developability的"微优化"，而不是让CDR先决定生死。**

### 三阶段策略

#### Stage 1: FR框架人源化优先

**目标**: 基于羊驼VHH scaffold → human VH3 VHH-SAFE模板库，优先选择FR1+FR2+FR3 identity高、FR2 hallmark合理的模板。

**实现方式**:
- 优先按`framework_identity`排序
- 确保FR2 hallmark位置（37, 44, 45, 47）符合VHH特征
- 例如：EGFR VHH案例中，羊驼scaffold identity可达88.8%，说明FR匹配非常好

**关键点**: FR匹配是基础，不应该被CDR1/2的"unknown canonical"全盘否决。

#### Stage 2: 在选定FR的族群里优化CDR兼容性

**目标**: CDR只作为**打分因子/排序因子**，而不是"硬筛选门槛"。

**实现方式**:
- 对canonical class不明确（Unknown）的CDR，**允许通过**，但给warning
- 对罕见长度组合（例如非常短/非常长CDR1/2），**允许通过**，但降低得分
- CDR兼容性得分用于排序，不用于硬筛选

**评分权重**:
- FR identity: **0.6**（主要因子）
- CDR compatibility: **0.15**（优化因子）
- Developability: **0.25**（优化因子）

#### Stage 3: 在FR固定 + CDR不改的前提下，再做CMC/developability优化

**目标**: 避免Developability score低（如0.29，Grade C），但框架和CDR却"理论良好"的自相矛盾情况。

**实现方式**:
- 在FR和CDR确定后，评估developability风险
- 提供CMC修复建议
- 在报告中明确标注developability风险等级

---

## 二、技术实现

### 2.1 模板选择流程

```python
# 伪代码
def select_human_templates_fr_priority():
    # Stage 1: 按FR identity排序
    candidates = sorted_by_framework_identity(all_templates)
    
    # Stage 2: 计算CDR兼容性得分（不筛选）
    for candidate in candidates:
        cdr_score = calculate_cdr_compatibility(candidate)
        # 允许所有候选通过，包括Unknown CDR
        
    # Stage 3: 综合评分（FR权重0.6，CDR权重0.15）
    final_score = 0.6 * fr_identity + 0.15 * cdr_score + 0.25 * dev_score
    
    # 返回排序后的候选列表
    return sorted_by_final_score(candidates)
```

### 2.2 CDR处理策略

#### Unknown CDR处理

- **允许通过**: 不因Unknown CDR而过滤模板
- **记录警告**: 在`quality_flags['cdr_warnings']`中记录
- **降低得分**: CDR兼容性得分可能较低，但不影响进入候选列表

#### 罕见长度CDR处理

- **允许通过**: 不因罕见长度而过滤
- **降低得分**: 在CDR兼容性计算中应用惩罚因子
- **记录警告**: 提示需要实验验证

### 2.3 评分公式

**默认评分公式**:
```
combined_score = 0.6 × framework_identity 
               + 0.15 × cdr_compatibility_score 
               + 0.25 × developability_score
```

**权重说明**:
- `framework_identity` (0.6): FR匹配是基础，权重最高
- `cdr_compatibility_score` (0.15): CDR只作为优化因子
- `developability_score` (0.25): Developability风险评估

**可配置**: 通过`config.yaml`中的`scoring.profiles`可以自定义权重。

---

## 三、与旧策略的对比

### 旧策略（CDR优先筛选）

- ❌ CDR兼容性得分 < 0.7 的模板被硬筛选过滤
- ❌ Unknown CDR导致优秀FR模板被排除
- ❌ 可能出现"FR匹配好但CDR不明确"导致无候选的情况

### 新策略（FR优先）

- ✅ 所有FR匹配的模板都进入候选（不进行CDR硬筛选）
- ✅ Unknown CDR允许通过，但记录warning
- ✅ CDR只用于排序，不决定生死
- ✅ 确保在FR匹配良好的情况下总能找到候选模板

---

## 四、使用示例

### 4.1 基本使用

```python
from core.vhh_humanization import humanize_vhh

# 使用FR优先策略（默认）
result = humanize_vhh(
    seq="QVQLVESGGG...",
    panel="all",
    top_k=5
)

# 检查CDR警告
if result.get('quality_flags', {}).get('cdr_warnings'):
    print("CDR警告:", result['quality_flags']['cdr_warnings'])
```

### 4.2 自定义评分权重

在`config.yaml`中配置：

```yaml
parameters:
  scoring:
    active_profile: "fr_priority"
    profiles:
      fr_priority:
        framework_identity: 0.7  # 进一步提高FR权重
        cdr_compatibility: 0.1    # 进一步降低CDR权重
        developability: 0.2
```

---

## 五、报告说明

### 5.1 报告中的CDR警告

在生成的报告中，如果检测到Unknown CDR或其他CDR问题，会在以下位置显示：

1. **Risk Assessment部分**: 列出所有CDR警告
2. **CDR Analysis部分**: 标注Unknown CDR状态
3. **Recommendations部分**: 建议实验验证

### 5.2 报告口径一致性

- **FR匹配**: 明确说明FR identity和FR2 hallmark状态
- **CDR状态**: 明确标注Unknown CDR，说明已允许通过但需验证
- **Developability**: 在FR和CDR确定后评估，避免自相矛盾

---

## 六、客户/内部说明模板

### 6.1 对客户说明

> "我们的VHH人源化采用'FR优先 + CDR优化'的三阶段策略：
> 
> **第一阶段**：优先选择与您VHH的FR框架匹配度最高的人类模板（通常identity > 85%），确保结构基础稳定。
> 
> **第二阶段**：在FR匹配良好的模板中，评估CDR兼容性。对于构型不明确的CDR，我们允许通过但会标注警告，建议通过实验验证。
> 
> **第三阶段**：在FR和CDR确定后，评估developability风险，提供CMC修复建议。
> 
> 这种策略确保即使在CDR构型不明确的情况下，也能找到FR匹配良好的候选模板，避免因CDR问题导致无候选的情况。"

### 6.2 内部技术说明

> "FR优先策略的核心是：
> - FR identity权重0.6（主要因子）
> - CDR兼容性权重0.15（优化因子）
> - 不进行CDR硬筛选，所有FR匹配的模板都进入候选
> - Unknown CDR允许通过，记录warning
> - 确保EGFR VHH这类FR匹配好（88.8%）但CDR不明确的案例能够成功人源化"

---

## 七、配置参数

### 7.1 关键参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `framework_identity`权重 | 0.6 | FR匹配权重（主要因子） |
| `cdr_compatibility`权重 | 0.15 | CDR兼容性权重（优化因子） |
| `developability`权重 | 0.25 | Developability权重（优化因子） |
| `hard_min_cdr_score` | 0.3 | 极端CDR3模式下的最低CDR得分（仅用于极端情况） |
| `soft_min_cdr_score` | 0.5 | 已废弃（FR优先策略下不再使用） |

### 7.2 配置位置

- `config.yaml`: `parameters.scoring.profiles.default`
- 环境变量: `VHH_PARAMETERS__SCORING__PROFILES__DEFAULT__FRAMEWORK_IDENTITY`

---

## 八、版本历史

- **v2.2.0** (2025-01-20): 正式实施FR优先策略
  - 移除CDR硬筛选
  - 调整评分权重（FR 0.6, CDR 0.15, Dev 0.25）
  - 允许Unknown CDR通过
  - 更新文档和报告生成逻辑

- **v2.1.0** (之前): CDR优先筛选策略
  - CDR兼容性得分 < 0.7 的模板被过滤
  - 可能导致FR匹配好但CDR不明确时无候选

---

## 九、常见问题

### Q1: 为什么允许Unknown CDR通过？

**A**: VHH的CDR构型可能比传统抗体更多样化，Unknown CDR不一定意味着不兼容。FR匹配是结构基础，CDR构型可以通过实验验证。允许Unknown CDR通过，确保在FR匹配良好的情况下总能找到候选。

### Q2: CDR权重为什么这么低（0.15）？

**A**: FR匹配是结构稳定性的基础，权重应该最高。CDR只作为优化因子，用于在FR匹配良好的模板中进一步排序，不应该决定模板的生死。

### Q3: 如何知道CDR是否需要实验验证？

**A**: 检查报告中的`quality_flags['cdr_warnings']`，如果包含"Unknown"或"non_canonical"警告，建议进行实验验证。

### Q4: 极端CDR3如何处理？

**A**: 极端CDR3（长度≥20aa或Cys≥3）会触发`extreme_cdr3_mode`，系统会自动增加候选数量（top_k≥10），但不会进行CDR硬筛选。

---

**文档维护**: 本策略文档为正式设计原则，修改需经过技术评审。


















