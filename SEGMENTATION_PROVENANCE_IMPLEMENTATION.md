# IMGT切分方法学溯源实施文档

## 概述

本文档描述了IMGT切分方法学溯源（segmentation_provenance）模块的实施，该模块用于追踪和验证VHH序列切分的方法、参数和证据。

## 实施内容

### 1. 切分适配器 (`core/segmentation/anarcii_adapter.py`)

创建了统一的IMGT切分适配器，提供以下功能：

- **主要函数**: `run_anarcii_imgt(seq, species, chain, allow_partial, max_mismatches)`
- **返回值**: `(segmentation, numbering, provenance)`
  - `segmentation`: FR/CDR区域切分结果
  - `numbering`: IMGT编号结果
  - `provenance`: 方法学溯源信息

**Fallback机制**:
1. 优先使用 `anarcii`（ANARCII包）
2. Fallback 1: 使用 `anarci`（ANARCI包）
3. Fallback 2: 使用 `regex_minimal`（启发式切分）

所有fallback都会被记录到provenance中。

### 2. Provenance数据结构

```json
{
  "segmentation_provenance": {
    "method": "anarcii" | "fallback:anarci" | "fallback:regex_minimal",
    "scheme": "imgt",
    "implementation": {
      "package": "anarcii" | "anarci" | "regex_minimal",
      "version": "x.y.z",
      "python": "3.11.6",
      "platform": "Windows-10",
      "commit": "git_sha_if_available"
    },
    "parameters": {
      "species": "camelid",
      "chain": "H",
      "allow_partial": true,
      "max_mismatches": 0,
      "fallbacks": ["anarci", "regex_minimal"],
      "fallbacks_used": ["fallback:anarci"]  // 如果使用了fallback
    },
    "evidence": {
      "numbering_first_10": [
        {"pos": "1", "aa": "E"},
        {"pos": "2", "aa": "V"}
      ],
      "boundaries": {
        "FR1": [1, 26],
        "CDR1": [27, 38],
        "FR2": [39, 55],
        "CDR2": [56, 65],
        "FR3": [66, 104],
        "CDR3": [105, 117],
        "FR4": [118, 128]
      }
    }
  }
}
```

### 3. 集成到人源化流程

修改了 `core/vhh_humanization.py`：

- 在切分步骤使用新的适配器 `run_anarcii_imgt()`
- 自动收集provenance信息并保存到 `result['segmentation_provenance']`
- 保持向后兼容（如果适配器失败，会回退到原有方法）

### 4. JSON质量门禁 (`core/segmentation/json_validator.py`)

创建了严格的JSON验证器，实施以下硬性规则：

**验证规则**:
1. ✅ 必须存在 `segmentation_provenance.method`
2. ✅ 必须存在 `segmentation_provenance.scheme == "imgt"`
3. ✅ 必须存在 `implementation.package` 与 `implementation.version`
4. ✅ 必须存在 `evidence.boundaries`
5. ✅ 若 `method` 是 `anarcii`，则 `implementation.package` 必须为 `anarcii`

**验证函数**:
- `validate_segmentation_provenance(json_data)`: 验证provenance字段
- `validate_json_for_delivery(json_data, strict=True)`: 验证整个JSON是否满足可交付要求

**行为**:
- 如果验证失败且 `strict=True`，会抛出 `SegmentationProvenanceValidationError`
- 不允许生成"可交付报告"直到所有验证通过

### 5. 报告生成集成

修改了 `scripts/generate_dual_report_v3.py`：

- 在 `generate_client_report()` 和 `generate_developer_report()` 函数开头添加验证调用
- 如果验证失败，会阻止报告生成并抛出异常
- 保持向后兼容（如果验证器本身出错，会记录警告但继续）

## 使用示例

### 基本使用

```python
from core.segmentation.anarcii_adapter import run_anarcii_imgt

# 进行切分并获取provenance
segmentation, numbering, provenance = run_anarcii_imgt(
    seq="QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVITADSGSTTYADSVKGRFTISRDDARNTVYLQMNSLKPEDTAVYYCAAGGVGWPYFDYWGQGTQVTVSS",
    species="camelid",
    chain="H"
)

# provenance会自动包含在result中
result['segmentation_provenance'] = provenance
```

### 验证JSON

```python
from core.segmentation.json_validator import validate_json_for_delivery

# 验证JSON是否满足可交付要求
try:
    is_valid, errors = validate_json_for_delivery(result, strict=True)
    if is_valid:
        print("✅ JSON验证通过，可以生成报告")
    else:
        print("❌ JSON验证失败:")
        for error in errors:
            print(f"  - {error}")
except SegmentationProvenanceValidationError as e:
    print(f"❌ 验证失败: {e}")
    # 不允许生成报告
```

## 文件结构

```
core/segmentation/
├── __init__.py                    # 模块初始化
├── anarcii_adapter.py             # 切分适配器（带provenance）
└── json_validator.py              # JSON质量门禁验证器

core/vhh_humanization.py           # 已修改，使用新适配器
scripts/generate_dual_report_v3.py # 已修改，添加验证调用
```

## 测试

运行验证器测试：

```bash
python core/segmentation/json_validator.py
```

测试用例包括：
1. 完整的provenance（应该通过）
2. 缺少method（应该失败）
3. method与package不匹配（应该失败）

## 关键点

1. **方法追踪**: `method` 字段明确记录使用的切分方法（`anarcii`、`fallback:anarci`、`fallback:regex_minimal`）
2. **可复现性**: `implementation` 字段记录包版本、Python版本、平台信息，确保可复现
3. **证据链**: `evidence` 字段包含前10个位置的编号和区域边界，提供可验证的证据
4. **Fallback记录**: 如果使用了fallback，会在 `parameters.fallbacks_used` 中明确记录
5. **硬性约束**: JSON验证器实施硬性规则，不满足要求时禁止生成可交付报告

## 向后兼容性

- 如果新适配器失败，会回退到原有的 `imgt_number_anarcii()` 方法
- 如果验证器本身出错，会记录警告但继续生成报告（向后兼容）
- 旧的JSON数据（没有provenance）在非严格模式下可以通过验证

## 未来改进

1. 支持更多fallback方法
2. 添加provenance的版本控制
3. 支持provenance的合并和比较
4. 添加provenance的可视化展示













