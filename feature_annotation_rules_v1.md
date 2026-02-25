# Feature Annotation Rules v1

## 概述

特征标注模块（Feature Annotation）为抗体序列的每个残基生成标签（tags），**仅做标签匹配，不做任何打分、风险判断或建议**。

## 设计原则

1. **Tagging-only**: 只输出标签，不输出任何 risk/score/recommendation
2. **Machine-readable**: 输出格式为结构化JSON，便于下游模块复用
3. **确定性**: 相同输入重复运行结果一致（tags排序稳定）
4. **严格验证**: 输出长度必须与输入一致，否则抛出异常

## 输入要求

输入对象为单条链的 mapping 结果（dual_map JSON），必须包含：

- `variable_domain_sequence`: str - V区序列
- `variable_domain`: dict - 包含 `v_start`, `v_end`, `v_length` 或 `variable_domain_length`
- `dual_map`: List[Dict] - 长度等于 `v_length`
- `imgt_numbering`: Dict[str, str] - IMGT编号字典
- `kabat_numbering`: Dict[str, str] - Kabat编号字典
- `chain_type`: str - 链类型 ("H", "K", "L")

## 输出格式

```json
{
  "chain": "VH",
  "length": 125,
  "residues": [
    {
      "index": 0,
      "residue": "Q",
      "imgt_position": "1",
      "kabat_position": "1",
      "region": "FR1",
      "tags": ["FR1", "chem_sensitive", "framework_anchor"]
    },
    ...
  ]
}
```

## 标签规则

### 1. Region 标签（必有）

每个残基必须且只能有一个 region 标签：

- `FR1`: IMGT positions 1-26
- `CDR1`: IMGT positions 27-38
- `FR2`: IMGT positions 39-55
- `CDR2`: IMGT positions 56-65
- `FR3`: IMGT positions 66-104
- `CDR3`: IMGT positions 105-117
- `FR4`: IMGT positions 118-128

**规则**: 根据 `imgt_position` 从 `dual_map` 中解析，使用 `get_region_from_imgt_pos()` 函数。

### 2. Vernier Zone

**定义**: 影响CDR构象的框架残基位置。

**VH positions**: [4, 6, 23, 24, 26, 48, 49, 67, 69, 71, 73, 78, 93]

**VL positions**: [4, 6, 23, 24, 26, 48, 49, 67, 69, 71, 73, 78]

**规则**: 按 IMGT positions 列表匹配，命中则添加 `vernier` 标签。

### 3. VH Hallmark Framework Positions

**定义**: VH特有的结构身份标签位置（VH only）。

**Positions**: [42, 49, 50, 52, 54]

**规则**: 
- 仅对 `chain_type == "H"` 的序列生效
- 按 IMGT positions 列表匹配，命中则添加 `vh_hallmark` 标签

### 4. CDR 边界残基（Boundary markers）

**定义**: FR↔CDR 交界处的残基。

**规则**:
- **CDR起始边界**: FR → CDR 的第一个CDR残基
  - CDR1起始: IMGT position 27
  - CDR2起始: IMGT position 56
  - CDR3起始: IMGT position 105
- **CDR结束边界**: CDR → FR 的最后一个CDR残基
  - CDR1结束: IMGT position 38（需检查实际序列中是否存在）
  - CDR2结束: IMGT position 65（需检查实际序列中是否存在）
  - CDR3结束: CDR3范围内的最大IMGT位置（需从 `dual_map` 中动态检测）

命中则添加 `cdr_boundary` 标签。

### 5. CDR 核心残基（Core positions）

**定义**: CDR中间位置的核心残基（排除边界）。

**规则**: 每条CDR取中间1-3个residue
- **CDR1**: 中间位置（约 IMGT 30-35）
- **CDR2**: 中间位置（约 IMGT 60-62）
- **CDR3**: 中间位置（约 IMGT 110-112，但需根据实际长度调整）

**计算方法**:
```python
region_length = region_end - region_start + 1
mid_start = region_start + region_length // 4
mid_end = region_end - region_length // 4
```

命中且**不是边界**则添加 `cdr_core` 标签。

### 6. CDR3 关键位置

**定义**: CDR3内的所有残基（或仅核心位点）。

**规则**: 所有 CDR3 residue 都打 `cdr3_key` 标签。

**实现**: `region == "CDR3"` 且 `imgt_position` 不为 None。

### 7. 化学敏感位点

**定义**: 容易发生化学修饰或降解的残基类型。

**残基类型**: N, D, G, M, W, C

**规则**: 根据残基类型（`aa`）匹配，命中则添加 `chem_sensitive` 标签。

**注意**: 这只是标签，不判断是否真的发生问题。

## 标签处理

1. **去重**: 使用 `set()` 去重
2. **排序**: 使用 `sorted()` 保证稳定性（同输入重复运行结果一致）
3. **空列表**: 如果没有任何标签（不应该发生，因为至少应有 region 标签），tags 为空列表 `[]`

## 长度一致性验证

**严格保证**:
```
len(residues) == v_length == len(variable_domain_sequence) == len(dual_map)
```

如果不一致，抛出 `ValueError` 异常。

## Excel 导出

`export_feature_matrix()` 函数将标注结果导出为 pandas DataFrame，用于 Excel 输出。

**列名**:
- `index`: 0-based index
- `residue`: 氨基酸
- `imgt_position`: IMGT位置
- `kabat_position`: Kabat位置
- `region`: 区域
- `tags`: 标签（用 `; ` 连接）

## 使用示例

```python
from core.features.annotate import annotate_features, export_feature_matrix

# 从 dual_map JSON 读取
with open("pd1_6jbt_mouse_vh_dualmap.json", "r") as f:
    mapping_result = json.load(f)

# 生成特征标注
annotated = annotate_features(mapping_result, "VH")

# 导出为 DataFrame（用于Excel）
df = export_feature_matrix(annotated)
```

## 约束

1. **不引入重型依赖**: 仅使用标准库和已有依赖（pandas用于Excel导出）
2. **向后兼容**: 不改变既有清洗/编号字段含义
3. **可序列化**: 输出必须可 JSON 序列化
4. **只做标签**: 不输出任何 risk/score/recommendation

## 版本

- **Version**: v1
- **创建日期**: 2025-01-15
- **所有者**: antibody_engineering
- **审核者**: computational_structures








