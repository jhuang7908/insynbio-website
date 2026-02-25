# VHH QA验证模块测试覆盖说明

**日期**: 2025年12月10日  
**测试文件**: `tests/test_vhh_qa_validation.py`  
**测试总数**: 12个测试用例

---

## 测试覆盖概览

### 原有测试（7个）

1. ✅ `test_rebuild_v_region_includes_fr4` - 测试序列重建包含FR4
2. ✅ `test_rebuild_v_region_missing_fr4` - 测试FR4缺失处理
3. ✅ `test_rebuild_v_region_empty_regions` - 测试空区域处理
4. ✅ `test_rebuild_v_region_none_values` - 测试None值处理
5. ✅ `test_validate_vhh_humanization_result_fr4_missing` - 测试FR4缺失检测
6. ✅ `test_validate_vhh_humanization_result_cdr_mutation` - 测试CDR突变检测
7. ✅ `test_validate_vhh_humanization_result_success` - 测试QA验证通过情况

### 新增测试（5个）

8. ✅ `test_validate_vhh_humanization_result_fallback_warning` - **E1: fallback标记检查**
9. ✅ `test_validate_vhh_humanization_result_fr_mutations_mismatch` - **E2: FR差异数和突变数不一致**
10. ✅ `test_validate_vhh_humanization_result_sequence_inconsistency` - **E3: full_sequence与rebuilt序列不一致**
11. ✅ `test_validate_vhh_humanization_result_cdr_difference_error` - **E4: CDR差异检测**
12. ✅ `test_validate_vhh_humanization_result_cdr_length_mismatch` - **E4: CDR长度不一致**

---

## 新增测试用例详情

### 测试1: fallback标记检查

**测试函数**: `test_validate_vhh_humanization_result_fallback_warning`

**目的**: 验证模板fallback标记检查功能

**测试场景**:
- 模板使用了 `uses_fallback_numbering: True`
- 应该产生warning但不导致QA失败

**验证点**:
- ✅ `qa["ok"]` 为 `True`（fallback只是warning）
- ✅ warnings中包含"fallback"关键词

**关键代码**:
```python
"template": {
    "flags": {
        "uses_fallback_numbering": True,
        "uses_fallback_fr2": False,
    }
}
```

---

### 测试2: FR差异数和突变数不一致

**测试函数**: `test_validate_vhh_humanization_result_fr_mutations_mismatch`

**目的**: 验证突变计划一致性检查功能

**测试场景**:
- FR1实际只有1个差异（E->A）
- 但mutations.list中有2个突变记录
- 其中一个突变（Q->X）在序列中不存在

**验证点**:
- ✅ `qa["ok"]` 为 `False`
- ✅ errors中包含"FR 区真实氨基酸差异数"或"不一致"或"不匹配"或"突变计划"

**关键代码**:
```python
"humanized_regions": {
    "FR1": "AVQLVESGGGLVQPGGSLRLSCAAS",  # 只有位置0: E->A (1个差异)
    ...
},
"mutations": {
    "list": [
        {"region": "FR1", "position": 1, "from": "E", "to": "A"},
        {"region": "FR1", "position": 3, "from": "Q", "to": "X"},  # 不存在
    ]
}
```

**预期错误**:
- `"FR区真实氨基酸差异数 (1) 与突变列表中的FR突变数 (2) 不一致，突变计划可能不完整或记录错误。"`
- `"突变记录 FR1 位置3 (Q->X) 与实际FR序列差异不匹配，实际序列: Q->Q，请检查突变计划与序列是否一致。"`

---

### 测试3: full_sequence与rebuilt序列不一致

**测试函数**: `test_validate_vhh_humanization_result_sequence_inconsistency`

**目的**: 验证序列自洽性检查功能

**测试场景**:
- `humanized_regions` 重建的序列与 `best_match.humanized_sequence` 不一致
- 长度差异 > 3 aa

**验证点**:
- ✅ `qa["ok"]` 为 `False`
- ✅ errors中包含"不一致"或"自洽"

**关键代码**:
```python
"humanized_regions": {
    "FR1": "EVQLVESGGGLVQPGGSLRLSCAAS",
    ...
},
"best_match": {
    "humanized_sequence": "XXXXXXXXXXXX"  # 与重建序列完全不一致
}
```

---

### 测试4: CDR差异检测

**测试函数**: `test_validate_vhh_humanization_result_cdr_difference_error`

**目的**: 验证防御式CDR差异检查功能

**测试场景**:
- CDR1区域有氨基酸差异（N->Q）
- 违反VHH FR-only策略

**验证点**:
- ✅ `qa["ok"]` 为 `False`
- ✅ errors中包含"CDR1 区发现氨基酸差异"

**关键代码**:
```python
"original_regions": {
    "CDR1": "GFWYNH",
    ...
},
"humanized_regions": {
    "CDR1": "GFWYQH",  # 位置4: N->Q (CDR差异，违反FR-only策略)
    ...
}
```

---

### 测试5: CDR长度不一致

**测试函数**: `test_validate_vhh_humanization_result_cdr_length_mismatch`

**目的**: 验证CDR长度一致性检查功能

**测试场景**:
- CDR1区域长度不一致（原始6aa，人源化7aa）
- 违反VHH FR-only策略

**验证点**:
- ✅ `qa["ok"]` 为 `False`
- ✅ errors中包含"CDR1 区长度"和"不一致"

**关键代码**:
```python
"original_regions": {
    "CDR1": "GFWYNH",  # 6 aa
    ...
},
"humanized_regions": {
    "CDR1": "GFWYNHX",  # 7 aa (长度不一致)
    ...
}
```

---

## 测试结果

```
============================= test session starts =============================
collected 12 items

tests/test_vhh_qa_validation.py::test_rebuild_v_region_includes_fr4 PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_missing_fr4 PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_empty_regions PASSED
tests/test_vhh_qa_validation.py::test_rebuild_v_region_none_values PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fr4_missing PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_mutation PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_success PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fallback_warning PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_fr_mutations_mismatch PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_sequence_inconsistency PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_difference_error PASSED
tests/test_vhh_qa_validation.py::test_validate_vhh_humanization_result_cdr_length_mismatch PASSED

============================= 12 passed in 2.66s ==============================
```

**测试通过率**: 100% (12/12)

---

## 测试覆盖的功能点

| 功能点 | 测试用例 | 状态 |
|--------|---------|------|
| **E1: fallback标记检查** | `test_validate_vhh_humanization_result_fallback_warning` | ✅ |
| **E2: 突变计划一致性** | `test_validate_vhh_humanization_result_fr_mutations_mismatch` | ✅ |
| **E3: 序列自洽性** | `test_validate_vhh_humanization_result_sequence_inconsistency` | ✅ |
| **E4: CDR差异检测** | `test_validate_vhh_humanization_result_cdr_difference_error` | ✅ |
| **E4: CDR长度检查** | `test_validate_vhh_humanization_result_cdr_length_mismatch` | ✅ |

---

## 测试数据完整性

所有新增测试用例都包含完整的区域数据：

- ✅ FR1-FR4（所有框架区域）
- ✅ CDR1-CDR3（所有互补决定区域）
- ✅ `best_match.humanized_sequence`（用于序列一致性检查）
- ✅ `mutations.list`（用于突变一致性检查）
- ✅ `template.flags`（用于fallback检查）

---

## CI锁定

这些测试用例确保以下问题被CI锁定：

1. ✅ **fallback标记** → 必须产生warning
2. ✅ **FR差异数和突变数不一致** → 必须产生error
3. ✅ **full_sequence与rebuilt序列不一致** → 必须产生error
4. ✅ **CDR差异** → 必须产生error
5. ✅ **CDR长度不一致** → 必须产生error

---

## 总结

新增的5个测试用例全面覆盖了增强的QA验证功能：

- ✅ **E1**: fallback标记检查（warning）
- ✅ **E2**: 突变计划一致性检查（error）
- ✅ **E3**: 序列自洽性检查（error）
- ✅ **E4**: CDR差异检测（error，2个测试用例）

**测试状态**: ✅ 全部通过  
**覆盖范围**: ✅ 100%  
**CI就绪**: ✅ 是

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















