# Germline Assets 迁移指南

## 概述

从 2025-12-13 开始，所有 germline 资产已统一迁移到 `data/germlines/v1_clean/` 目录。

**重要原则**：
- ❌ **任何模块不得再从 `output/` 读取 germline**
- ✅ **统一只从 `data/germlines/v1_clean/` 读取**

## 统一加载接口

### 使用 `core.germline_assets_loader` 模块

所有模块应通过 `core.germline_assets_loader` 模块加载 germline 数据：

```python
from core.germline_assets_loader import (
    load_clean_germline_assets,
    load_all_clean_germline_assets,
    load_germline_by_id,
    load_canonical_proxy_clusters,
    load_canonical_proxy_lookup,
    get_germline_assets_path,
    validate_germline_assets_directory,
)

# 加载所有 clean germline assets
all_assets = load_all_clean_germline_assets(include_canonical_proxy=False)

# 加载带 canonical_proxy 注解的版本
all_assets_with_proxy = load_all_clean_germline_assets(include_canonical_proxy=True)

# 按 ID 加载单条记录
asset = load_germline_by_id("M99641|IGHV1-18*01|Homo", include_canonical_proxy=True)

# 加载 canonical proxy lookup table
lookup_table = load_canonical_proxy_lookup()

# 获取文件路径
jsonl_path = get_germline_assets_path(include_canonical_proxy=True)
```

## 目录结构

```
data/germlines/v1_clean/
├── germline_assets_clean.jsonl                    # Clean germline assets
├── germline_assets_clean_with_canonical_proxy.jsonl  # 带 canonical_proxy 注解
├── manifest.json                                  # 版本信息和元数据
├── clusters/
│   ├── cdr1_cluster_assignments.csv
│   ├── cdr1_cluster_summary.csv
│   ├── cdr1_representatives.fasta
│   ├── cdr2_cluster_assignments.csv
│   ├── cdr2_cluster_summary.csv
│   └── cdr2_representatives.fasta
└── qc/
    └── canonical_proxy_qc.csv
```

## 已更新的模块

### 核心模块
- ✅ `core/germline_assets_loader.py` - 新增统一加载接口

### 脚本
- ✅ `scripts/build_canonical_proxy_layer.py` - 更新默认路径
- ✅ `scripts/build_canonical_proxy_assets.py` - 更新所有路径
- ✅ `scripts/verify_canonical_proxy_output.py` - 更新路径
- ✅ `scripts/check_clean_germline_assets.py` - 更新路径
- ✅ `scripts/example_use_canonical_proxy.py` - 使用统一加载接口

### 待更新模块

以下模块需要在使用时更新：

1. **Scaffold 选择模块**
   - `scripts/stage12_germline_selection.py` - 如果从 germline assets 加载 scaffold
   - `core/germline_library_provenance.py` - 更新默认路径

2. **报告生成模块**
   - 所有报告生成脚本应使用 `load_clean_germline_assets()` 加载数据

3. **分析模块**
   - Vernier / CMC / Immunogenicity 分析应使用统一接口

## 迁移检查清单

在更新任何模块时，请检查：

- [ ] 是否从 `output/` 读取 germline 相关文件？
- [ ] 是否直接硬编码路径？
- [ ] 是否使用 `core.germline_assets_loader` 模块？
- [ ] 是否验证目录结构完整性（使用 `validate_germline_assets_directory()`）？

## 验证

运行以下命令验证目录结构：

```python
from core.germline_assets_loader import validate_germline_assets_directory

is_valid, errors = validate_germline_assets_directory()
if not is_valid:
    print("❌ 目录结构不完整:")
    for error in errors:
        print(f"  - {error}")
else:
    print("✅ 目录结构完整")
```

## 向后兼容性

**注意**：`output/` 目录中的文件可能仍然存在（作为中转站），但**所有新代码必须从 `data/germlines/v1_clean/` 读取**。

如果发现旧代码仍从 `output/` 读取，请立即更新。













