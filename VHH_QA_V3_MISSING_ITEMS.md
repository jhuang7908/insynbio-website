# VHH QA v3.0 缺项补充文档

**日期**: 2025年12月10日  
**版本**: v3.0.2  
**状态**: ✅ 已完成

---

## 补充概述

针对CRO报告的核心需求，补充了3个关键缺项：
1. 序列标号（mutation map）
2. 构象风险总结（Conformation Risk Summary）
3. 实验建议（Experimental Recommendations）

---

## 缺项1：序列标号（Mutation Map）✅

### 功能描述

生成完整的突变映射表，包括：
- FR1–FR2–FR3–FR4 的序号（IMGT位置范围）
- 每个突变的 IMGT 位置
- 每个突变的分类

### 实现文件

`core/vhh_qa_mutation_map.py`

### 突变分类

1. **germline_adoption**: 采用germline序列
   - 判断：人源化后氨基酸与模板germline序列一致

2. **structure_preserving**: 结构保守性突变
   - 判断：保守性氨基酸替换（BLOSUM62高分替换）

3. **risk_induced**: 风险诱导突变
   - 判断：引入高风险氨基酸（deamidation, oxidation, isomerization hotspots）

4. **deviation_from_germline**: 偏离germline
   - 判断：为了保留VHH特征而偏离germline序列

### 输出结构

```python
mutation_map = {
    "regions": {
        "FR1": {
            "start": 1,
            "end": 26,
            "sequence": "...",
            "mutations": [
                {
                    "region": "FR1",
                    "imgt_position": 5,
                    "from": "A",
                    "to": "S",
                    "category": "structure_preserving",
                    "local_position": 5
                }
            ]
        },
        ...
    },
    "mutations_by_category": {
        "germline_adoption": [...],
        "structure_preserving": [...],
        "risk_induced": [...],
        "deviation_from_germline": [...]
    },
    "summary": {
        "total_mutations": 15,
        "by_category": {
            "germline_adoption": 8,
            "structure_preserving": 5,
            "risk_induced": 1,
            "deviation_from_germline": 1
        },
        "by_region": {
            "FR1": 3,
            "FR2": 5,
            "FR3": 7,
            "FR4": 0
        }
    }
}
```

### 集成位置

在`validate_vhh_humanization_result_v3()`中自动生成，包含在`qa_v3["mutation_map"]`中。

---

## 缺项2：构象风险总结（Conformation Risk Summary）✅

### 功能描述

生成CRO可读的构象风险总结，包括：
- CDR3 anchor（IMGT 101/102）稳定性
- FR2 hydrophilic patch保留情况
- CDR1 torsion compatibility
- Overall structural feasibility

### 实现文件

`core/vhh_qa_conformation_risk.py`

### 评估指标

#### 1. CDR3 Anchor稳定性

**评估方法**:
- 检查anchor位置（IMGT 101-102）的保守性
- 保守残基加分，高风险残基扣分

**输出**:
```python
{
    "stability": "high/medium/low",
    "score": 85.0,  # 0-100
    "details": {
        "anchor_sequence": "AA",
        "anchor_positions": "IMGT 101-102",
        "fr3_length": 39
    }
}
```

#### 2. FR2 Hydrophilic Patch保留情况

**评估方法**:
- 检查VHH hallmark位置（44, 45）的亲水性
- 计算亲水性残基保留比例

**输出**:
```python
{
    "retention": "high/medium/low",
    "score": 75.0,  # 0-100
    "details": {
        "hydrophilic_count": 1,
        "total_hallmarks": 2,
        "retention_ratio": 0.5
    }
}
```

#### 3. CDR1 Torsion Compatibility

**评估方法**:
- 基于CDR1长度（rule set v3.0）
- 检查FR1末尾和FR2起始的边界残基兼容性

**输出**:
```python
{
    "compatibility": "acceptable/marginal/poor",
    "score": 80.0,  # 0-100
    "details": {
        "cdr1_length": 8,
        "fr1_end": "A",
        "fr2_start": "M",
        "rule_set": "v3.0"
    }
}
```

#### 4. Overall Structural Feasibility

**计算方法**:
- 综合CDR3 anchor、FR2 patch、CDR1 torsion的分数
- 考虑structural_compat和grafting_impact（如果有qa_v3结果）

**输出**:
```python
{
    "score": 85.0,  # 0-100
    "level": "high/medium/low"
}
```

### 输出结构

```python
conformation_risk_summary = {
    "cdr3_anchor_stability": {...},
    "fr2_hydrophilic_patch": {...},
    "cdr1_torsion_compatibility": {...},
    "overall_structural_feasibility": {
        "score": 85.0,
        "level": "high"
    }
}
```

### 集成位置

在`validate_vhh_humanization_result_v3()`中自动生成，包含在`qa_v3["conformation_risk_summary"]`中。

---

## 缺项3：实验建议（Experimental Recommendations）✅

### 功能描述

基于QA v3.0结果生成实验建议，包括：
- 是否需要再优化（directed evolution）
- 是否建议酵母展示验证
- 是否需要多模板对照
- 是否需要测 ΔTm / ΔΔG

### 实现文件

`core/vhh_qa_experimental_recommendations.py`

### 建议类型

#### 1. Directed Evolution

**触发条件**:
- Grafting impact normalized score ≥ 0.4
- Structural compatibility有ERROR

**优先级**: high

**建议内容**: "高结构风险或grafting impact，建议通过directed evolution优化"

#### 2. 酵母展示验证

**触发条件**:
- Biological feasibility < 80
- Ranking sanity有ERROR
- Grafting impact normalized score ≥ 0.2

**优先级**: high (feasibility < 70) 或 medium

**建议内容**: "生物可行性评分较低或存在结构风险，建议通过酵母展示验证结合活性和亲和性"

#### 3. 多模板对照

**触发条件**:
- Ranking sanity有ERROR或WARNING

**优先级**: medium

**建议内容**: "模板排名存在可疑问题，建议进行多模板对照实验"

#### 4. 热力学分析（ΔTm / ΔΔG）

**触发条件**:
- Overall structural feasibility < 70
- Grafting impact normalized score ≥ 0.3

**优先级**: high (feasibility < 60) 或 medium

**建议内容**: "构象风险较高，建议通过热力学分析（ΔTm/ΔΔG）评估结构稳定性"

### 输出结构

```python
experimental_recommendations = {
    "directed_evolution": {
        "recommended": True/False,
        "priority": "high/medium/low",
        "reason": "...",
        "details": [...]
    },
    "yeast_display_validation": {...},
    "multi_template_comparison": {...},
    "thermodynamic_analysis": {...},
    "summary": {
        "overall_risk": "low/medium/high",
        "critical_issues": [...],
        "recommended_actions": [
            {
                "action": "directed_evolution",
                "priority": "high",
                "recommended": True
            },
            ...
        ]
    }
}
```

### 集成位置

在`validate_vhh_humanization_result_v3()`中自动生成，包含在`qa_v3["experimental_recommendations"]`中。

---

## 完整qa_v3结构（更新后）

```python
qa_v3 = {
    "ok": bool,
    "errors": [str],
    "warnings": [str],
    "checks": {
        "integrity": {...},
        "structural_compat": {...},
        "grafting_impact": {...},
        "ranking_sanity": {...},
        "delta_risk": {...}
    },
    "summary_score": {
        "biological_feasibility": float,
        "risk_level": "low/medium/high"
    },
    "metadata": {...},
    "mutation_map": {  # 新增
        "regions": {...},
        "mutations_by_category": {...},
        "summary": {...}
    },
    "conformation_risk_summary": {  # 新增
        "cdr3_anchor_stability": {...},
        "fr2_hydrophilic_patch": {...},
        "cdr1_torsion_compatibility": {...},
        "overall_structural_feasibility": {...}
    },
    "experimental_recommendations": {  # 新增
        "directed_evolution": {...},
        "yeast_display_validation": {...},
        "multi_template_comparison": {...},
        "thermodynamic_analysis": {...},
        "summary": {...}
    }
}
```

---

## 文件清单

### 新增文件

1. ✅ `core/vhh_qa_mutation_map.py` - 突变映射生成
2. ✅ `core/vhh_qa_conformation_risk.py` - 构象风险总结
3. ✅ `core/vhh_qa_experimental_recommendations.py` - 实验建议生成

### 修改文件

1. ✅ `core/vhh_qa_validation.py` - 集成3个新模块到qa_v3结构

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
    "mutations": {"list": [...]},
    "best_match": {"template": {...}},
    ...
}

qa_v3 = validate_vhh_humanization_result_v3(result, strict=True)

# 访问mutation map
mutation_map = qa_v3["mutation_map"]
print(f"总突变数: {mutation_map['summary']['total_mutations']}")
print(f"Germline adoption: {mutation_map['summary']['by_category']['germline_adoption']}")

# 访问构象风险总结
conformation_risk = qa_v3["conformation_risk_summary"]
print(f"CDR3 anchor稳定性: {conformation_risk['cdr3_anchor_stability']['stability']}")
print(f"Overall structural feasibility: {conformation_risk['overall_structural_feasibility']['score']}/100")

# 访问实验建议
recommendations = qa_v3["experimental_recommendations"]
if recommendations["yeast_display_validation"]["recommended"]:
    print(f"建议进行酵母展示验证: {recommendations['yeast_display_validation']['reason']}")
```

---

## 总结

✅ **3个缺项全部补充完成**

1. ✅ 序列标号（mutation map）- 完整的突变映射和分类
2. ✅ 构象风险总结 - CRO可读的构象风险评估
3. ✅ 实验建议 - 基于QA结果的实验建议

**CRO报告完整性**: ✅ 已完善  
**系统状态**: ✅ 生产就绪

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















