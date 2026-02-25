# Germline Provenance 证据链补齐方案

**日期**: 2025-12-12  
**目标**: 确保germline_library_provenance和germline_numbering字段强制写入业务JSON

---

## 问题分析

### 审计缺口
1. **A项（germline库provenance）**: 业务JSON中完全缺失`germline_library_provenance`字段
2. **B项（germline IMGT编号）**: 业务JSON中完全缺失`germline_numbering`字段

### 根本原因
- 代码已实现，但`prepare_json_data()`中失败时只记录error，不阻止流程
- 保存JSON前未强制验证这些字段存在
- 验证器已实现，但未在保存前调用

---

## 修复方案

### 1. 强制生成（不允许失败）

**文件**: `core/json_data_preparer.py`

**修改**:
- 移除try-except中的error记录逻辑
- 如果生成失败，直接抛出异常
- 添加字段完整性检查

```python
# 指令1：构建germline_library_provenance（证明库真实存在）
# 强制要求：必须成功，失败则抛出异常
from core.germline_library_provenance import build_germline_library_provenance
json_data["germline_library_provenance"] = build_germline_library_provenance(json_data)

# 验证germline_library_provenance必须包含sha256
if not json_data["germline_library_provenance"].get("sha256"):
    raise ValueError("germline_library_provenance.sha256 缺失或为空")

# 指令2和3：对germline模板进行IMGT编号
# 强制要求：必须成功，失败则抛出异常
from core.segmentation.germline_numbering import number_germline_templates
json_data["germline_numbering"] = number_germline_templates(json_data)

# 验证germline_numbering必须包含numbering_provenance
if "error" in json_data["germline_numbering"]:
    raise ValueError("germline_numbering生成失败")

numbering_provenance = json_data["germline_numbering"].get("numbering_provenance")
if not numbering_provenance:
    raise ValueError("germline_numbering.numbering_provenance 缺失")

if numbering_provenance.get("method") != "anarcii":
    method = numbering_provenance.get("method", "unknown")
    if not method.startswith("fallback:"):
        raise ValueError(f"method = '{method}' != 'anarcii'")
```

### 2. 保存前强制验证

**文件**: `scripts/run_egfr_full_pipeline_v4_1.py`

**修改**:
- 在保存JSON之前调用`validate_json_for_delivery()`
- 验证失败时直接抛出异常，阻止保存

```python
# 准备JSON数据
prepared_result = prepare_json_data(result, "REPORT")

# 强制验证：在保存JSON之前验证germline_library_provenance和germline_numbering
from core.segmentation.json_validator import validate_json_for_delivery
is_valid, errors = validate_json_for_delivery(prepared_result, strict=True)

if not is_valid:
    print(f"❌ JSON验证失败，不允许保存：")
    for error in errors:
        print(f"  - {error}")
    raise ValueError("JSON验证失败：germline_library_provenance或germline_numbering缺失或不完整")

# 只有验证通过才保存
json.dump(prepared_result, ...)
```

### 3. 验证器增强

**文件**: `core/segmentation/json_validator.py`

**修改**:
- 增强错误信息，明确标注"字段不存在"vs"字段不完整"
- 检查error字段，如果存在则直接失败

---

## 预期效果

### 修复前
```json
{
  "germline": {...},
  // ❌ 缺失 germline_library_provenance
  // ❌ 缺失 germline_numbering
}
```

### 修复后
```json
{
  "germline": {...},
  "germline_library_provenance": {
    "library_name": "human_VH3_germline_library",
    "version": "v1.0",
    "path": "...",
    "entry_count": 128,
    "sha256": "<runtime_computed>",
    "loaded_at": "2025-12-12T19:10:00Z"
  },
  "germline_numbering": {
    "numberings": {...},
    "numbering_provenance": {
      "method": "anarcii",
      "scheme": "imgt",
      "package": "anarcii",
      "package_version": "2.x.x",
      "executed_at": "2025-12-12T19:11:00Z"
    }
  }
}
```

---

## QA门禁规则

### Rule A: Germline library proof
```python
assert "germline_library_provenance" in json_data
assert json_data["germline_library_provenance"]["sha256"]
```

### Rule B: Germline IMGT numbering proof
```python
assert "germline_numbering" in json_data
assert json_data["germline_numbering"]["scheme"] == "imgt"
```

### Rule C: ANARCII proof
```python
assert json_data["germline_numbering"]["numbering_provenance"]["method"] == "anarcii"
```

**不满足任一条 → 不生成报告**

---

## 修改后的审计预期结果

| 审计项 | 预期结论 |
|--------|----------|
| germline 库存在与版本 | ✅ 通过 |
| germline IMGT 编号（ANARCII） | ✅ 通过 |
| 总体结论 | ✅ 全部通过 |

---

## 关键总结

**当前不是"算法没实现"，而是"证据没写入业务JSON"。**

只要把库级provenance和ANARCII编号结果写进业务JSON，并加QA门禁，即可一次性补齐证据链并通过审计。

---

**修改文件清单**:
1. `core/json_data_preparer.py` - 强制生成，不允许失败
2. `scripts/run_egfr_full_pipeline_v4_1.py` - 保存前强制验证
3. `core/segmentation/json_validator.py` - 增强验证器错误信息













