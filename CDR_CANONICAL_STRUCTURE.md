# CDR构型（Canonical Structure）识别和匹配

## 概述

在抗体人源化过程中，**CDR构型（Canonical Structure）**是一个关键因素。不同长度的CDR和关键位置的残基决定了CDR的三维构象，而CDR构型必须与框架兼容，否则可能导致结构不稳定。

## 为什么需要考虑CDR构型？

### 1. 结构稳定性

- **CDR构型由框架决定**：框架的某些关键位置（如FR1的26位、FR2的55位）影响CDR的构型
- **构型不匹配**：如果CDR构型与框架不兼容，可能导致：
  - 结构不稳定
  - 抗原结合能力下降
  - 表达困难

### 2. 正常抗体人源化的常见做法

在传统抗体（IgG）人源化中，标准流程包括：

1. **识别CDR构型**：基于CDR长度和关键残基
2. **选择兼容框架**：选择能支持该CDR构型的人源框架
3. **CDR移植**：将CDR移植到选定的框架
4. **结构验证**：通过建模或实验验证构型兼容性

## CDR构型分类

### CDR1构型

基于长度分类：

| 长度范围 | 构型类别 | 说明 |
|---------|---------|------|
| 8-10aa | canonical_1 | 最常见，标准构型 |
| 11-12aa | canonical_2 | 中等长度 |
| 13-15aa | canonical_3 | 较长 |
| <8aa 或 >15aa | non_canonical | 非典型构型 |

**关键位置**：
- FR1位置26（CDR1前一个位置）
- CDR1起始位置27

### CDR2构型

基于长度分类：

| 长度范围 | 构型类别 | 说明 |
|---------|---------|------|
| 7-9aa | canonical_1 | 最常见 |
| 10-12aa | canonical_2 | 中等长度 |
| 13-15aa | canonical_3 | 较长 |
| <7aa 或 >15aa | non_canonical | 非典型构型 |

**关键位置**：
- FR2位置55（CDR2前一个位置）
- CDR2起始位置56

### CDR3构型

CDR3的构型最复杂，主要基于长度：

| 长度范围 | 构型类别 | 说明 |
|---------|---------|------|
| 3-7aa | short | 短CDR3 |
| 8-12aa | canonical_1 | 标准长度 |
| 13-18aa | canonical_2 | 中等长度 |
| 19-25aa | long | 长CDR3（VHH常见） |
| 26-35aa | very_long | 超长CDR3（VHH特有） |

**VHH特殊特征**：
- VHH的CDR3通常较长（15-25aa）
- 可能包含非经典二硫键（C...C模式）
- 可能包含疏水区域

## 当前实现

### 模块：`core/cdr_canonical.py`

提供以下功能：

1. **`classify_cdr_canonical()`** - 识别单个CDR的构型
2. **`classify_all_cdrs()`** - 识别所有CDR的构型
3. **`match_canonical_compatibility()`** - 评估CDR构型兼容性

### 集成到人源化流程

在`core/vhh_humanization.py`中：

```python
# 1. 提取CDR
vhh_cdrs = {'CDR1': '...', 'CDR2': '...', 'CDR3': '...'}

# 2. 识别CDR构型
cdr_canonical = classify_all_cdrs(vhh_cdrs)
# 结果: {
#   'CDR1': {'canonical_class': 'canonical_1', 'length': 8, ...},
#   'CDR2': {'canonical_class': 'canonical_1', 'length': 8, ...},
#   'CDR3': {'canonical_class': 'long', 'length': 20, ...}
# }

# 3. 评估兼容性
compatibility = match_canonical_compatibility(cdr_canonical)
# 结果: {
#   'compatibility_score': 0.9,
#   'warnings': ['CDR3长度较长(20aa)，可能影响结构稳定性']
# }
```

## 匹配策略

### 当前策略（框架优先）

1. **框架匹配**：基于FR1/FR2/FR3的identity选择最佳Human模板
2. **CDR构型检查**：识别CDR构型并评估兼容性
3. **警告提示**：如果CDR构型非典型，给出警告

### 改进方向（CDR构型优先）

未来可以实现的策略：

1. **CDR构型优先匹配**：
   - 先识别VHH的CDR构型
   - 筛选能支持该构型的Human框架
   - 在兼容框架中选择identity最高的

2. **构型兼容性评分**：
   - 将CDR构型兼容性纳入排序
   - 综合得分 = framework_identity × cdr_compatibility_score

3. **框架关键位置检查**：
   - 检查FR1位置26、FR2位置55等关键位置
   - 确保这些位置支持目标CDR构型

## 使用示例

```python
from core.cdr_canonical import classify_all_cdrs, match_canonical_compatibility

# VHH的CDR序列
cdrs = {
    'CDR1': 'GYTFTSYY',      # 8aa
    'CDR2': 'IDPEDGGT',      # 8aa
    'CDR3': 'VR'              # 2aa（较短）
}

# 识别构型
canonical = classify_all_cdrs(cdrs)
print(f"CDR1: {canonical['CDR1']['canonical_class']}")
print(f"CDR2: {canonical['CDR2']['canonical_class']}")
print(f"CDR3: {canonical['CDR3']['canonical_class']}")

# 评估兼容性
compatibility = match_canonical_compatibility(canonical)
print(f"兼容性得分: {compatibility['compatibility_score']}")
if compatibility['warnings']:
    for warning in compatibility['warnings']:
        print(f"警告: {warning}")
```

## 注意事项

1. **VHH的特殊性**：
   - VHH的CDR3通常较长，这是正常的
   - 长CDR3可能需要特殊的框架支持

2. **构型识别限制**：
   - 当前实现主要基于长度
   - 更精确的识别需要关键位置残基信息
   - 理想情况下需要结构数据

3. **兼容性评估**：
   - 当前是启发式评估
   - 实际兼容性需要通过结构建模或实验验证

## 相关文件

- **CDR构型模块**: `core/cdr_canonical.py`
- **人源化模块**: `core/vhh_humanization.py`
- **Scaffold定义**: `core/vhh_scaffolds/03_engineered/nvhh_h1.json`

## 未来改进

1. **更精确的构型识别**：
   - 基于关键位置残基（如FR1-26, FR2-55）
   - 参考Chothia/IMGT构型数据库

2. **框架-构型兼容性矩阵**：
   - 建立Human框架与CDR构型的兼容性矩阵
   - 基于已知结构数据

3. **结构预测集成**：
   - 集成AlphaFold2或其他结构预测工具
   - 验证CDR移植后的结构稳定性


















