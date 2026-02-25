# QA信息在报告中的暴露说明

**日期**: 2025年12月10日  
**文件**: `scripts/generate_egfr_cro_report_cn_enhanced.py`

---

## 概述

本次更新在JSON和HTML报告中暴露QA验证信息，包括warnings和errors，确保用户能够了解人源化结果的质量状态。

---

## JSON报告中的QA信息

### 位置

QA信息被添加到JSON数据的顶层：

```json
{
  "qa": {
    "ok": true/false,
    "errors": [...],
    "warnings": [...]
  }
}
```

### 实现

在 `prepare_json_data()` 函数中：

```python
"qa": result.get("qa", {})  # 添加QA验证结果（包含warnings和errors）
```

---

## HTML报告中的QA信息

### 1. 完整报告（status == "OK" 或 "OK_SAFE_MODE"）

#### 方法局限性部分

**位置**: 报告第9部分（在"湿式实验建议"之后）

**功能**:
- 显示所有QA warnings
- 如果warning包含"fallback"关键字，用醒目标记显示

**实现**:
- 函数: `generate_method_limitations_section(qa_result: dict)`
- 调用位置: `generate_full_html_report()` 中

**显示样式**:

1. **Fallback警告**（醒目标记）:
   - 黄色背景 (`#fff3cd`)
   - 橙色左边框 (`#f39c12`)
   - 加粗标题："⚠️ 重要提示："
   - 额外说明文字

2. **普通警告**:
   - 灰色背景 (`#f8f9fa`)
   - 灰色左边框 (`#6c757d`)
   - 标准列表项样式

**示例HTML**:
```html
<div class="section">
    <h2 class="section-title">9. 方法局限性</h2>
    <div class="info-box">
        <p>以下QA验证警告提示了本分析方法可能存在的局限性，建议在结构建模和实验验证前予以关注：</p>
    </div>
    <ul>
        <!-- Fallback警告 - 醒目标记 -->
        <li style="...醒目标记样式...">
            <strong>⚠️ 重要提示：</strong>
            <span>模板使用了fallback编号或FR2代位序列，建议在结构建模前人工复核。</span>
            <p>建议在结构建模前人工复核模板选择，确认fallback机制的使用是否合理。</p>
        </li>
        <!-- 普通警告 -->
        <li style="...普通样式...">
            <span>FR2片段过短（<10 aa），可能切分错误</span>
        </li>
    </ul>
</div>
```

---

### 2. 失败报告（status == "FAILED_QA" 或 "FAILED"）

#### QA验证错误详情

**位置**: 失败报告的错误框中

**功能**:
- 逐条列出所有QA errors
- 根据错误类型添加分类标签和样式

**实现**:
- 函数: `generate_cro_html_report_failed_cn()`
- 错误分类:
  1. **突变计划错误**: 包含"FR 区真实氨基酸差异数"或"不一致"
  2. **CDR策略违反**: 包含"CDR"和"差异"或"突变"
  3. **数据一致性错误**: 包含"不一致"或"自洽"
  4. **其他错误**: 默认样式

**显示样式**:

每种错误类型都有：
- 红色背景 (`#fee`)
- 红色左边框 (`#e74c3c`)
- 分类标签（如"突变计划错误："）
- 错误详情

**示例HTML**:
```html
<h3 style="color: #e74c3c; margin-top: 20px;">QA验证错误详情：</h3>
<ul>
    <!-- 突变计划错误 -->
    <li style="...红色样式...">
        <strong>突变计划错误：</strong>
        <span>FR区真实氨基酸差异数 (21) 与突变列表中的FR突变数 (17) 不一致...</span>
    </li>
    <!-- CDR策略违反 -->
    <li style="...红色样式...">
        <strong>CDR策略违反：</strong>
        <span>CDR1 区发现氨基酸差异（位置4: N->Q），违反VHH人源化CDR保留的硬约束。</span>
    </li>
    <!-- 数据一致性错误 -->
    <li style="...红色样式...">
        <strong>数据一致性错误：</strong>
        <span>humanized_sequence 与按 FR1-CDR1-FR2-CDR2-FR3-CDR3-FR4 重建得到的序列不一致...</span>
    </li>
</ul>
```

---

## 错误分类

### 1. 突变计划错误

**关键词**: "FR 区真实氨基酸差异数"、"不一致"、"突变计划"

**示例**:
- `"FR区真实氨基酸差异数 (21) 与突变列表中的FR突变数 (17) 不一致，突变计划可能不完整或记录错误。"`
- `"突变记录 FR1 位置3 (Q->X) 与实际FR序列差异不匹配，请检查突变计划与序列是否一致。"`

### 2. CDR策略违反

**关键词**: "CDR" + ("差异" 或 "突变")

**示例**:
- `"CDR1 区发现氨基酸差异（位置4: N->Q），违反VHH人源化CDR保留的硬约束。"`
- `"CDR1 区长度在原始与人源化序列之间不一致（原始=6aa, 人源化=7aa），违反VHH FR-only策略。"`

### 3. 数据一致性错误

**关键词**: "不一致"、"自洽"

**示例**:
- `"humanized_sequence 与按 FR1-CDR1-FR2-CDR2-FR3-CDR3-FR4 重建得到的序列不一致，存在内部自洽性问题。"`

---

## 使用示例

### 检查JSON中的QA信息

```python
import json

with open("report.json", "r", encoding="utf-8") as f:
    data = json.load(f)

qa = data.get("qa", {})
if qa.get("ok"):
    print("QA验证通过")
    if qa.get("warnings"):
        print("警告:", qa["warnings"])
else:
    print("QA验证失败")
    print("错误:", qa.get("errors", []))
```

### 在HTML报告中查看

1. **完整报告**: 查看第9部分"方法局限性"
2. **失败报告**: 查看"QA验证错误详情"部分

---

## 总结

✅ **JSON报告**: QA信息添加到顶层 `qa` 字段  
✅ **HTML完整报告**: 第9部分"方法局限性"显示warnings，fallback警告用醒目标记  
✅ **HTML失败报告**: 逐条列出errors，按类型分类显示  

**状态**: ✅ 已完成并测试

---

**文档版本**: 1.0  
**最后更新**: 2025年12月10日

















