# VHH 报告生成完整工作流

本文档说明如何使用报告生成系统生成完整的 VHH 人源化工程报告。

## 快速开始

### 前提条件

1. 已完成 VHH 人源化 pipeline，得到 `result.json`
2. 已安装必需的 Python 包：
   ```bash
   pip install python-docx matplotlib numpy
   ```

### 一键生成（推荐）

#### Windows

```batch
REM 使用批处理脚本
scripts\generate_full_report.bat result.json reports\output EGFR_7D12_VHH

REM 或使用 Python 脚本
python scripts\generate_full_report.py result.json reports\output EGFR_7D12_VHH
```

#### Linux/macOS

```bash
# 使用 Shell 脚本
bash scripts/generate_full_report.sh result.json reports/output EGFR_7D12_VHH

# 或使用 Python 脚本
python scripts/generate_full_report.py result.json reports/output EGFR_7D12_VHH
```

### 分步生成

如果需要分步执行：

#### 步骤 1: 生成图表

```bash
python scripts/plot_vhh_report_figures_v1.py \
    --input result.json \
    --output_dir reports/output \
    --project-id EGFR_7D12_VHH
```

**输出**：
- `reports/output/EGFR_7D12_VHH/figures/fig2_mutation_heatmap.png`
- `reports/output/EGFR_7D12_VHH/figures/fig3_developability_radar.png`
- `reports/output/EGFR_7D12_VHH/figures/fig5_ranking_stability.png`
- `reports/output/EGFR_7D12_VHH/figures/fig6_cmc_risk_bar.png`

#### 步骤 2: 生成报告

```bash
python scripts/generate_vhh_report_v1.py \
    --input result.json \
    --output_dir reports/output \
    --project-id EGFR_7D12_VHH
```

**输出**：
- `reports/output/EGFR_7D12_VHH/report_v1.md` - Markdown 格式报告
- `reports/output/EGFR_7D12_VHH/report_v1.docx` - Word 格式报告

## 输出文件结构

```
reports/output/
└── EGFR_7D12_VHH/
    ├── report_v1.md              # Markdown 报告（可读性强）
    ├── report_v1.docx            # Word 报告（可直接编辑）
    └── figures/
        ├── fig2_mutation_heatmap.png
        ├── fig3_developability_radar.png
        ├── fig5_ranking_stability.png
        └── fig6_cmc_risk_bar.png
```

## 报告内容

生成的报告包含以下章节：

1. **背景与目标** - 项目概述
2. **输入序列与基本特征** - 序列信息、物化性质
3. **IMGT 切分结果** - FR/CDR 区域划分
4. **Germline FR 选择与 Vernier 分析** - 模板选择过程
5. **Hallmark 与 VHH 特异结构** - VHH 特征保留情况
6. **人源化策略与序列对比（三方案）** - Conservative/Balanced/Aggressive 对比
7. **CMC Liabilities 与 Developability** - 开发性风险评估
8. **免疫原性分析** - T-cell 表位预测
9. **亲和力维持与优化（Back-mutation）** - 亲和力优化建议
10. **QA 总结（v3.5）** - 质量保证验证结果
11. **工程过程追踪（Process Replay Log）** - Pipeline 执行日志
12. **综合结论与建议** - 最终建议

## 使用场景

### 场景 1: 客户交付

生成完整的报告包，包含：
- 专业的 Word 文档（可直接编辑和标注）
- 所有可视化图表（PNG 格式，高分辨率）
- Markdown 源文件（便于版本控制）

**交付清单**：
- ✅ `report_v1.docx` - 主报告
- ✅ `figures/` - 所有图表
- ✅ 可选：`report_v1.md` - 源文件

### 场景 2: 内部审查

使用 Markdown 格式便于：
- 版本控制（Git）
- 代码审查
- 自动化处理

### 场景 3: 学术发表

Markdown 格式便于：
- 转换为 LaTeX
- 集成到论文中
- 保持格式一致性

## 自定义报告

### 修改模板

编辑 `reports/templates/vhh_full_report_template.md` 来自定义报告格式。

模板使用 `{{placeholder}}` 格式的占位符，例如：
- `{{project_id}}` - 项目ID
- `{{input_sequence}}` - 输入序列
- `{{qa_summary_section}}` - QA 总结

### 添加自定义图表

在 `scripts/plot_vhh_report_figures_v1.py` 中添加新的图表函数，然后在 `main()` 中调用。

## 故障排除

### 问题 1: 图表生成失败

**症状**：提示 `matplotlib not installed`

**解决**：
```bash
pip install matplotlib numpy
```

### 问题 2: DOCX 导出失败

**症状**：提示 `python-docx not installed`

**解决**：
```bash
pip install python-docx
```

**注意**：即使 DOCX 导出失败，Markdown 报告仍会正常生成。

### 问题 3: 数据字段缺失

**症状**：报告中某些部分显示为 "N/A" 或空

**解决**：
- 检查 `result.json` 是否包含所有必需的字段
- 查看脚本输出的警告信息
- 某些字段缺失是正常的（取决于 pipeline 配置）

### 问题 4: 项目ID未自动识别

**症状**：输出目录为 `unknown_project`

**解决**：
- 确保 `result.json` 中包含 `project_id` 字段
- 或手动指定项目ID：`--project-id EGFR_7D12_VHH`

## 最佳实践

1. **版本控制**：将 `report_v1.md` 纳入版本控制，但排除 `report_v1.docx`（二进制文件）

2. **命名规范**：使用有意义的项目ID，例如 `EGFR_7D12_VHH` 而不是 `project1`

3. **定期备份**：重要项目的报告应定期备份

4. **质量检查**：生成报告后，检查：
   - 所有图表是否正确生成
   - 序列是否正确显示
   - QA 结果是否准确
   - 数字和百分比是否正确

## 示例工作流

```bash
# 1. 运行人源化 pipeline
python -m core.vhh_humanization_with_qa \
    --sequence "QVQLVESGGGLVQVGGSLRLSRALS..." \
    --output result.json

# 2. 生成完整报告
python scripts/generate_full_report.py \
    result.json \
    reports/output \
    EGFR_7D12_VHH

# 3. 检查输出
ls -la reports/output/EGFR_7D12_VHH/

# 4. 打开报告查看
# Windows:
start reports\output\EGFR_7D12_VHH\report_v1.docx

# Linux/macOS:
open reports/output/EGFR_7D12_VHH/report_v1.docx
```

## 相关文档

- [报告生成系统 README](../reports/README.md)
- [模板自定义指南](../reports/templates/README.md)（待创建）
- [图表生成说明](../scripts/plot_vhh_report_figures_v1.py)

















