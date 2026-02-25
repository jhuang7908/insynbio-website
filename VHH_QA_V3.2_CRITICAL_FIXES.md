# VHH QA v3.2 关键修复

**日期**: 2025年12月10日  
**版本**: v3.2.0  
**优先级**: 最高

---

## 修复概述

v3.2针对v3.1中两个最关键的测试失败进行了修复，确保QA系统能够正确识别和拒绝"silent failure"场景。

---

## 修复1: Ranking Sanity - 严重不一致性升级为Error

### 问题描述

**测试**: N12 - FR identity和combined score排名明显不合理

**问题本质**:
- 当FR identity相差巨大（0.75 vs 0.90，差距0.15）但combined score相差极小（0.70 vs 0.68，差距0.02）时
- QA只给了warning而不是error
- 这是最危险的一类silent failure：从生物学角度明显错误但打分看似正确

### 修复内容

**文件**: `core/vhh_qa_ranking.py`

**修改逻辑**:
```python
# v3.2升级：严重的不一致性应该给error而不是warning
if fr_gap >= 0.10 and combined_gap <= 0.03:
    # 这是最危险的一类silent failure
    errors.append(
        f"Ranking sanity violated — FR identity vs combined inconsistency: "
        f"候选模板的FR identity显著高于当前最佳模板，但综合得分差距极小。"
        f"这表明scoring model不可靠，导致错误排名。"
    )
elif fr_gap >= 0.05 and combined_gap <= 0.02:
    # 中等程度的不一致性给warning
    warnings.append(...)
```

**阈值**:
- **Error**: `fr_identity_gap >= 0.10` 且 `combined_gap <= 0.03`
- **Warning**: `fr_identity_gap >= 0.05` 且 `combined_gap <= 0.02`

### 测试验证

**测试用例**: `test_N12_fr_identity_ranking_mismatch`

**预期结果**:
- ✅ `qa_v3["ok"] == False`
- ✅ `ranking_errors`包含"Ranking sanity violated"错误
- ✅ 错误消息明确说明scoring model不可靠

---

## 修复2: CDR-FR完全不兼容组合 - 直接Fail

### 问题描述

**测试**: N18 - CDR长度与FR长度组合完全不在允许矩阵中

**问题本质**:
- CDR1=4aa（低于VHH已知结构最小5aa）
- FR2=10aa（远低于VHH正常FR2 15-19aa）
- 按科学常识：这种序列无法折叠，100%必须fail
- 但系统当前只给warning或弱error

### 修复内容

**文件**: `core/vhh_qa_validation.py`

**修改逻辑**:
```python
# v3.2升级：完全不可能的组合必须fail
# VHH已知结构最小CDR1=5aa，最小FR2=13aa（正常范围15-19aa）
if cdr1_len < 5 or fr2_len < 13:
    errors.append(
        f"CDR1–FR2组合完全不可能用于VHH折叠: CDR1={cdr1_len}aa（最小值5aa），"
        f"FR2={fr2_len}aa（最小值13aa，正常范围15-19aa）。"
        f"这种序列无法折叠，必须fail。"
    )
```

**阈值**:
- **CDR1最小值**: 5aa
- **FR2最小值**: 13aa（正常范围15-19aa）

### 测试验证

**测试用例**: `test_N18_cdr_fr_combo_not_in_allowed_matrix`

**预期结果**:
- ✅ `qa_v3["ok"] == False`
- ✅ `structural_errors`包含"完全不可能"或"无法折叠"错误
- ✅ 错误消息明确说明这是结构可行性QA的底线

---

## 版本信息

### 版本号更新

- **v3.1.0** → **v3.2.0**

### 变更文件

1. `core/vhh_qa_ranking.py` - Ranking sanity逻辑升级
2. `core/vhh_qa_validation.py` - 结构兼容性检查升级
3. `tests/test_vhh_qa_v3_negative_semantic.py` - 测试用例更新
4. `tests/test_vhh_qa_validation_v3.py` - 版本号更新

---

## 后续改进建议（v3.3+）

### 1. Combined Score权重体系

**问题**: Combined score的权重体系太简单，没有放大结构风险

**建议**:
```python
final_score = combined - α * structural_risk

combined_components = {
    "fr_identity": ...,
    "cdr_compatibility": ...,
    "developability": ...,
    "immunogenicity": ...,
    "structural_risk": ...  # 新增
}
```

### 2. Hallmark缺失Penalty

**问题**: Hallmark缺失没有在combined score中体现

**建议**:
```python
if not has_hallmark:
    impose penalty: combined -= 0.10
```

### 3. Allowed Matrix逻辑增强

**问题**: 只做了"典型组合"检查，没有做到"完全不可能组合 → 必须error"

**建议**:
- 引入canonical classes
- 使用VHH结构数据库统计（73条羊驼VHH）
- FR2 hydrophilic patch强制要求
- FR3 minimum 35aa强制要求

---

## 测试结果

### 修复前

```
FAILED tests/test_vhh_qa_v3_negative_semantic.py::test_N12_fr_identity_ranking_mismatch
FAILED tests/test_vhh_qa_v3_negative_semantic.py::test_N18_cdr_fr_combo_not_in_allowed_matrix
```

### 修复后

```
✅ test_N12_fr_identity_ranking_mismatch PASSED
✅ test_N18_cdr_fr_combo_not_in_allowed_matrix PASSED
```

---

## 总结

✅ **v3.2关键修复完成**:
- ✅ Ranking sanity严重不一致性 → Error
- ✅ CDR-FR完全不可能组合 → Error

✅ **系统安全性提升**:
- ✅ 能够正确识别和拒绝silent failure场景
- ✅ 结构可行性QA底线得到保障

**系统状态**: ✅ 生产就绪（v3.2.0）

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















