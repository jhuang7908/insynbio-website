# VH/VL CMC 相关进展记录

**最后更新**: 2026-02-21

---

## 进展过程（按时间）

| 序号 | 日期 | 事项 | 产出 |
|:---:|:---|:---|:---|
| 1 | 前期 | 用户要求「措施建议」含突变与实验优化 | — |
| 2 | 前期 | 实现 5.3 节措施建议 | `render_vhvl_v44_reports.py` 新增 `_liability_recommendations`，客户报告 5.3、内部 developability 报告 |
| 3 | 前期 | 用户指出 CMC 除 pI 外还有很多性质 | — |
| 4 | 前期 | 编写 CMC 设计扩展设计文档 | `docs/CMC_DESIGN_EXTENSION.md`（SSOT、`design_v3_liabilities` 规格） |
| 5 | 前期 | 用户要求 SSOT 统一 | 设计文档补充 SSOT 规则 |
| 6 | 前期 | 实现 `design_v3_liabilities` | `core/cmc/cmc_design.py` |
| 7 | 前期 | fix 流程集成 liability 设计 | `verify_vhvl_v44_project.py` 新增 `_run_cmc_liability_design_if_needed`，在 pI 设计后调用 |
| 8 | 前期 | 报告注明 CDR-H2 NYS（N-gly） | `render_vhvl_v44_reports.py` 5.0 节补充「化学修饰风险」目的 |
| 9 | 2026-02-21 | 报告时间过长：削减 PDF | `verify_vhvl_v44_project.py` 6 个 focused 内部报告不再生成 PDF，仅 JSON+MD |
| 10 | 2026-02-21 | 建立本进展记录 | `docs/PROGRESS_VHVL_CMC.md`（含进展过程） |

---

## 已完成

### 1. CMC 5.3 措施建议（突变与实验优化）

| 内容 | 位置 |
|:---|:---|
| 客户报告新增 **5.3 措施建议** | `scripts/render_vhvl_v44_reports.py` → 报告第五章 |
| 内部报告新增 **措施建议** | `scripts/verify_vhvl_v44_project.py` → `internal/developability_{id}.md` |

**效果**：按 liability 类型（N-glycosylation、deamidation、isomerization、free_Cys）自动生成「突变建议」和「实验优化」表格。

### 2. CMC 设计扩展（design_v3_liabilities）

| 内容 | 位置 |
|:---|:---|
| 核心实现 | `core/cmc/cmc_design.py` → `design_v3_liabilities()` |
| fix 集成 | `scripts/verify_vhvl_v44_project.py` → `_run_cmc_liability_design_if_needed()` |
| 设计文档 | `docs/CMC_DESIGN_EXTENSION.md` |

**规则**：FR-only、保守突变（N→Q、D→E）、CDR/Vernier 不变、SSOT 从 `results.json` 读写。

### 3. 报告 5.0 节注明化学修饰风险

- 5.0 CMC 突变表中目的列补充「化学修饰风险」。

### 4. 报告生成提速

- 6 个 focused 内部报告（germline、cmc、developability、immunogenicity、structures、pairing_lookup）仅输出 JSON + MD，不再生成 PDF。
- 仍保留：客户交付 PDF、内部快照 PDF、V44 Audit PDF。
- 预计耗时减少约 70–80%。

### 5. SSOT 规则

- 数据源：`projects/<id>_Redesign/<id>_results.json`
- CMC 设计只从 `results.json` 读取，产出写回 `results.json`

---

## 待办

| 项目 | 状态 |
|:---|:---|
| CMC 配置项（liability_design.enabled） | 未开始 |

---

## 验证

| 检查项 | 位置 |
|:---|:---|
| 5.3 措施建议 | `projects/9c1_Redesign/reports/9c1_Client_zh.md` 第 5.3 节 |
| 5.0 化学修饰注明 | 同报告 5.0 节 CMC 突变表 |
| 内部措施建议 | `projects/9c1_Redesign/internal/developability_9c1.md` 底部 |
| fix 耗时 | 运行 `fix 9c1` 对比优化前后 |
