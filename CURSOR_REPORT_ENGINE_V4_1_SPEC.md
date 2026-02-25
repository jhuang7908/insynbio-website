# CURSOR_REPORT_ENGINE v4.1 规范文档

## 概述

CURSOR_REPORT_ENGINE v4.1 是专门为抗体工程（VHH / VH / VL / 双抗 / 物种转换等）生成报告的引擎。

## 核心特性

### 1. 双报告机制

- **Client Report（客户报告，灰箱）**：面向外部客户 / PI / BD 合作方
  - 专业、结构完整、可直接用于客户会议
  - 不暴露算法细节、模型名称、数据库名称
  - 只解释 "为什么这么评估（WHY）"，不暴露 "怎么算出来（HOW）"

- **Developer Report（开发者报告，透明）**：面向内部工程人员 / 算法维护者
  - 包含 Client Report 的所有可见内容
  - 额外包含所有内部数据结构、算法参数、依赖模型、可复现信息

### 2. 已知问题修复

v4.1 修复了以下已知问题：

1. ✅ **target 提取**：从多个路径尝试提取，如果缺失则显示 "Unknown" 并给出建议
2. ✅ **FR4 Identity**：不再使用 0.0% 占位符，如果无法计算则明确说明
3. ✅ **免疫原性 N/A**：如果数据缺失，明确解释原因并建议补充测试
4. ✅ **三条序列相同**：如果 Seq1/Seq2/Seq3 相同，明确说明原因
5. ✅ **图表生成提示**：在 SUMMARY 中明确说明图表状态和生成命令

### 3. Client Report 结构（13 个必需章节）

0. 概览
1. 输入序列 QC
2. IMGT 切分结果
3. Germline 匹配结果 + 解释
4. Vernier Zone 分析
5. VHH / VH Hallmark 检查
6. CMC Liabilities
7. 免疫原性（Immunogenicity）
8. Developability
9. 突变分级（Tier 0 / 1 / 2 / 3）
10. 三条最终序列（Seq1 / Seq2 / Seq3）
11. 可选突变菜单
12. 最终建议
13. Glossary（术语解释）

### 4. 突变分级规则

- **Tier 0（禁止）**：CDR 核心、VHH hallmark、关键 Vernier、Cys 配对
- **Tier 1（必须）**：安全的人源化 FR 突变 + 严重 CMC / 免疫原性修复突变
- **Tier 2（强烈推荐）**：显著降低免疫原性 / CMC / 聚集风险，且不影响 paratope
- **Tier 3（探索/亲和性）**：以亲和性改进为主的突变，风险可控

### 5. 三条最终序列构造规则

- **Seq1**：原始序列 + 全部 Tier 1
- **Seq2**：Seq1 + 2–4 个最佳 Tier 2（若无 Tier 2，则 Seq2=Seq1，并在文字中解释）
- **Seq3**：Seq1 + 2–4 个精选 Tier 3（若无 Tier 3，则 Seq3=Seq1，并在文字中解释）

## 使用方法

### 命令行调用

```bash
python scripts/generate_dual_report_v4_1.py \
    --input "projects/{PROJECT_ID}/cro_report/raw/raw_result_*.json" \
    --output "projects/{PROJECT_ID}/reports_v4_1_final" \
    --project-id {PROJECT_ID}
```

### Python 调用

```python
from scripts.generate_dual_report_v4_1 import run_full_report_pipeline

result = run_full_report_pipeline(
    project_id="EGFR_7D12_VHH",
    raw_result_path=Path("projects/EGFR_7D12_VHH/cro_report/raw/raw_result_20251210_183604.json"),
    output_dir=Path("projects/EGFR_7D12_VHH/reports_v4_1_final"),
)
```

## 输出文件

所有报告文件保存在 `projects/{PROJECT_ID}/reports_v4_1_final/`：

1. `{PROJECT_ID}_Client_Report_YYYYMMDD_HHMMSS.md` - 客户报告
2. `{PROJECT_ID}_Developer_Report_YYYYMMDD_HHMMSS.md` - 开发者报告
3. `REPORT_GENERATION_SUMMARY.md` - 报告生成总结
4. `FINAL_EVALUATION.md` - 最终评估报告
5. `figures/` - 图表文件目录（需要单独运行绘图脚本）

## 图表生成

报告生成后，需要单独运行绘图脚本生成图表：

```bash
python scripts/plot_vhh_report_figures_v1.py \
    --input "projects/{PROJECT_ID}/cro_report/raw/raw_result_*.json" \
    --output_dir "projects/{PROJECT_ID}/reports_v4_1_final/figures" \
    --project-id {PROJECT_ID}
```

## 版本历史

- **v3.0**：初始版本，双报告机制
- **v4.1**：修复已知问题，增强灰箱模式，完善三条序列说明

---

**文档版本**：v4.1  
**最后更新**：2025-12-11
















