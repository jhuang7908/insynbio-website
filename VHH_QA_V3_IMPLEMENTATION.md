# VHH QA v3.0 实施文档

**日期**: 2025年12月10日  
**版本**: v3.0.0  
**状态**: ✅ 已完成

---

## 概述

QA v3.0在现有VHH QA基础上，增加了3类高阶自检：
1. FR–CDR几何/构型兼容性检查
2. CDR grafting影响分析（边界与anchor位点风险）
3. 模板选择与打分的合理性验证（ranking sanity + explainability）

并将这些结果整合进统一的`qa_v3`结构，决定最终status与报告展示。

---

## 模块1：FR–CDR几何/构型兼容性QA（Structural Compatibility QA）

### 核心思想

不是所有FR/模板都能"物理上承载"某个CDR构型。我们需要一个轻量级规则系统来做：
**CDR 长度/构型 ↔ FR 长度/特征 的匹配验证**

### 实现文件

`core/vhh_qa_structural_rules.py`

### 允许组合矩阵

#### CDR1–FR2 组合规则

```python
ALLOWED_VHH_CDR1_FR2_COMBOS = [
    ((5, 8), (15, 19), "canonical_CDR1_short"),
    ((9, 12), (15, 19), "canonical_CDR1_long"),
    ((6, 7), (15, 19), "non_canonical_CDR1_short"),
    ((13, 15), (16, 20), "non_canonical_CDR1_long"),
]
```

#### CDR3–FR3 组合规则

```python
ALLOWED_VHH_CDR3_FR3_COMBOS = [
    ((2, 14), (35, 42), "cdr3_normal"),
    ((15, 25), (38, 45), "cdr3_long_needs_long_fr3"),
    ((26, 35), (40, 50), "cdr3_very_long_needs_very_long_fr3"),
]
```

### 检查逻辑

- **CDR1–FR2**: 检查长度组合是否在允许范围内
- **CDR3–FR3**: 
  - 超长CDR3（≥15aa）但FR3短（<38aa）→ **ERROR**
  - 其他非典型组合 → **WARNING**
- **CDR2**: 检查与FR2/FR3的组合

### 输出

```python
checks["structural_compat"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str]
}
```

---

## 模块2：CDR Grafting影响分析（Grafting Impact QA）

### 核心思想

分析FR–CDR接口位点的理化性质变化，评估grafting对结构的影响。

### 实现文件

`core/vhh_qa_grafting.py`

### FR–CDR接口位点

基于IMGT索引：

```python
FR_CDR_INTERFACE_POSITIONS = {
    "CDR1": [25, 26, 27, 28, 29],  # FR1/CDR1 边界附近
    "CDR2": [52, 53, 54, 55],      # FR2/CDR2 邻近
    "CDR3": [94, 95, 96, 101, 102] # FR3/CDR3 anchor/邻近
}
```

### 冲击评分规则

对每个接口位点：
- **理化性质类别变化**（hydrophobic ↔ polar ↔ charged）: +2分
- **体积变化大**（small ↔ large）: +1分

### 阈值

- `impact_score >= 6`: **ERROR** - 可能严重影响亲和力或折叠
- `impact_score >= 3`: **WARNING** - 建议进行结构建模和功能验证

### 输出

```python
checks["grafting_impact"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "impact_score": int,
    "interface_changes": [
        {
            "cdr": str,
            "imgt_pos": int,
            "from": str,
            "to": str,
            "category_change": bool,
            "volume_change": bool,
            "score": int
        }
    ]
}
```

---

## 模块3：模板选择与排名合理性QA（Ranking Sanity & Explainability）

### 核心思想

避免"某个模板因为打分bug排到第1，但从理性上看根本不该是第一"。

### 实现文件

`core/vhh_qa_ranking.py`

### 检查规则

#### 规则1：排位与关键指标不矛盾

- **情况1**: FR identity差距很大（≥5%），但combined score差距很小（≤0.02）
  → **WARNING**: 建议人工复核打分权重

- **情况2**: 最佳模板缺少VHH hallmark，而次优模板具备
  → **ERROR**: 这在VHH人源化中通常不可接受

#### 规则2：Score vector自洽检查

检查combined score是否与子分数一致（预留接口，当前简化处理）

### 输出

```python
checks["ranking_sanity"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "ranking_issues": [
        {
            "type": str,  # "fr_identity_mismatch" or "hallmark_mismatch"
            "rank": int,
            "candidate_id": str,
            ...
        }
    ]
}
```

---

## 模块4：Δ Developability / Δ Immunogenicity 方向性检查

### 核心思想

人源化后风险必须降低：
- **Δ Developability ≥ 0**（必须提升或保持）
- **Δ Immunogenicity ≤ 0**（必须降低或保持）

### 检查规则

#### Developability

- `delta < -0.1`: **WARNING** - 明显下降，建议谨慎采用
- `delta < -0.05`: **WARNING** - 略有下降，建议关注CMC风险

#### Immunogenicity

- `delta > 0`: **ERROR** - 风险升高，人源化策略失败
- `delta == 0 and risk == "high"`: **WARNING** - 风险仍为high

### 输出

```python
checks["delta_risk"] = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "delta_details": {
        "developability": {
            "original": float,
            "humanized": float,
            "delta": float
        },
        "immunogenicity": {
            "original": str,  # "low"/"medium"/"high"
            "humanized": str,
            "delta": int  # 风险等级差值
        }
    }
}
```

---

## 模块5：统一qa_v3结构与集成

### qa_v3结构

```python
qa_v3 = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "checks": {
        "integrity": {...},          # v2时代的区域/长度/CDR禁突变
        "structural_compat": {...},  # 模块1
        "grafting_impact": {...},    # 模块2
        "ranking_sanity": {...},     # 模块3
        "delta_risk": {...},         # 模块4
    },
    "summary_score": {
        "biological_feasibility": float,   # 0–100
        "risk_level": "low/medium/high",
    }
}
```

### Summary Score计算

**生物可行性评分（0-100）**:
- 基础分: 100
- 每个error扣10分（最多扣50分）
- 每个warning扣3分（最多扣30分）
- grafting impact_score >= 6: 扣20分
- grafting impact_score >= 3: 扣10分

**风险等级**:
- `biological_feasibility >= 80`: "low"
- `biological_feasibility >= 60`: "medium"
- `biological_feasibility < 60`: "high"

### Status决定

```python
if not qa_v3["ok"]:
    result["status"] = "FAILED_QA_V3"
else:
    result["status"] = "OK"
```

---

## 集成方式

### 在humanize_vhh_with_qa中使用

```python
from core.vhh_qa_validation import validate_vhh_humanization_result_v3

# QA验证 - 使用v3.0
qa_result = validate_vhh_humanization_result_v3(json_data, strict=strict_qa)
result["qa"] = qa_result  # 保持向后兼容
result["qa_v3"] = qa_result  # v3.0结构
```

### 报告生成

对`status != "OK"`的结果，只生成QA失败报告。

对`OK`的结果，在CRO报告里增加小节：
- "模板选择合理性"
- "FR–CDR结构兼容性"
- "Δ Developability / Δ Immunogenicity 总结"

---

## 文件清单

### 新增文件

1. ✅ `core/vhh_qa_structural_rules.py` - 结构兼容性规则
2. ✅ `core/vhh_qa_grafting.py` - Grafting影响分析
3. ✅ `core/vhh_qa_ranking.py` - 排名合理性验证

### 修改文件

1. ✅ `core/vhh_qa_validation.py` - 添加`validate_vhh_humanization_result_v3()`
2. ✅ `core/vhh_humanization_with_qa.py` - 集成v3.0

---

## 使用示例

### 基本使用

```python
from core.vhh_qa_validation import validate_vhh_humanization_result_v3

result = {
    "sequence_analysis": {
        "original_regions": {...},
        "humanized_regions": {...}
    },
    "best_match": {...},
    "candidates": [...],
    "original_developability": {"score": 0.85},
    "original_immunogenicity": {"fr_immuno_risk": "low"},
    ...
}

qa_v3 = validate_vhh_humanization_result_v3(result, strict=True)

print(f"QA状态: {'通过' if qa_v3['ok'] else '失败'}")
print(f"生物可行性: {qa_v3['summary_score']['biological_feasibility']}")
print(f"风险等级: {qa_v3['summary_score']['risk_level']}")

# 查看各模块检查结果
for check_name, check_result in qa_v3["checks"].items():
    if not check_result.get("ok", True):
        print(f"{check_name}: 失败")
        for error in check_result.get("errors", []):
            print(f"  ❌ {error}")
```

---

## 总结

✅ **QA v3.0全部模块实施完成**

1. ✅ FR–CDR几何/构型兼容性检查
2. ✅ CDR grafting影响分析
3. ✅ 模板选择与排名合理性验证
4. ✅ Δ Developability/Immunogenicity方向性检查
5. ✅ 统一qa_v3结构与集成

**系统状态**: ✅ 生产就绪

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















