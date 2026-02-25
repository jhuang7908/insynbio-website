# VH/VL V4.4 标准执行契约（Execution Contract）
**系统**：InSynBio AbEngineCore / Antibody Engineer Suite  
**适用范围**：所有 VH/VL 鼠抗人源化项目（输入序列 → 报告 → 交付包）  
**目标**：无论什么项目、什么 agent 运行，**输出形态一致、质量门禁一致、审计证据一致**；并且对“已离线完成的库”**只查表，不重复运算**。

> 权威规则来源仍为：`config/vh_vl_humanization_v44.json` 与 V4.4 标准文档（不在此处重复写算法细节）。

---

## 1) 资产范围与数目（必须了解的事实）

### 1.1 临床/治疗抗体（~800+）
- **在本套件里，项目侧“临床/治疗抗体”统计与切分/胚系分析结果已离线完成**，用于“查表+引用证据”。  
  - 关键报告/汇总示例：`data/humanization_assay/categorized_germline_analysis.txt`
- `data/thera_sabdab/out/thera_profile.json` 显示 Thera/SAbDab 原始汇总 `n_total=1133`（包含更多原始条目/缺失项等）；  
  **项目执行时不得对该库做全量重算**（编号/结构/逐条重新切分）。

### 1.2 458 基因工程人源化序列（Engineered 458）
**这 458 条是“结构与 Vernier 位点分析”最关键的离线资产**：
- Vernier 索引映射：`data/humanization_assay/vernier_index_lookup.json`（**458 条**）
- 结构与指标汇总：`data/humanization_assay/structure_metrics_summary.json`（**458 条**）
- 结构/框架模式分布：`data/humanization_assay/vernier_framework_patterns.json`（来源为 458 结构汇总）

---

## 2) Hard Rules（不可违反）

- **固定项目目录**：任何项目只允许写入 `projects/<id>_Redesign/` 下的固定子目录（见第 3 节）。
- **库只读复用**：`data/humanization_assay/` 与 `data/thera_sabdab/out/` 视为“离线产出资产”，执行时只能读取、查询、引用，不得在每个项目里重复运算生成这些结果。
- **禁止库级重算**（最常见错误）：
  - 在每个项目里对 ~800+ 临床抗体全量 ANARCI 编号 / 切分 / germline 统计。
  - 在每个项目里对 458 工程库全量结构重建、SASA/packing/Vernier 再计算以获得基线分布。
- **算法/内部细节不外泄**：客户报告不得出现阈值、候选排名、TopK 表、百分比/分数、内部工具链细节等（以 V4.4 配置的“禁词/替换/门禁”执行）。

---

## 3) 项目固定目录契约（Folder Contract）

对任意项目 ID：`<id>`（建议小写、下划线）

```
projects/<id>_Redesign/
  <id>_results.json                 # single source of truth（内部）
  <id>_sequences.fasta              # 客户交付（包含 mouse + final）
  reports/
    <id>_Client_zh.md
    <id>_Client_zh.pdf              # 若被占用，可生成 <id>_Client_zh__new.pdf 供打包
    <id>_V44_Audit.md               # 内部审计（逐条 checklist + 证据）
  structures/
    <id>_mouse.pdb
    <id>_humanized_v1.pdb
    <id>_humanized_v2.pdb
    <id>_humanized_v3.pdb
  internal/
    phase4_backmutation_<id>.json   # Vernier 22 位点逐位决策日志（内部）
```

交付目录（客户包）固定为：

```
delivery_<id>/
  README.md
  reports/<id>_Client_zh.pdf
  sequences/<id>_sequences.fasta
  structures/<id>_mouse.pdb
  structures/<id>_humanized_final.pdb
```

---

## 4) Phase 合同：查表 vs 必算边界（Checklist → Compute/Lookup → Evidence）

### Phase 1 — 输入 + 双编号 QA（Hard Gate）
- **必须计算（仅对本项目输入）**：序列合法性 + Dual-scheme numbering（IMGT+Kabat）一致性门禁。
- **证据**：写入审计报告（PASS/FAIL）与 results 内部字段。

### Phase 2 — 胚系选择（以“查表+缓存”为主）
- **必须查表**（不重算）：
  - 临床/工程库 germline 统计与先例：来自 `data/humanization_assay/` 与 `data/thera_sabdab/out/`。
- **仅允许对“本项目输入”做编号**；对人类 germline 库不得每项目全量编号。
- **必须使用预计算缓存**（避免每项目编号数百条 germline）：
  - `data/germlines/human_ig_aa/_cache/IGHV_kabat_cache.json`
  - `data/germlines/human_ig_aa/_cache/IGKV_kabat_cache.json`
  - 缓存生成命令：`python scripts/build_germline_kabat_cache.py`

### Phase 3 — 结构建模（必算）
- 至少生成鼠源与最终候选的人源化结构（ABodyBuilder2 / AlphaFold2 体系），并记录路径。

### Phase 4 — Vernier（必算 + 必落盘）
- 必须生成 `phase4_backmutation_<id>.json`，`backmutation_decisions` **必须 22 行**（VH14 + VL8）。
- 客户报告必须包含 Vernier 小节：
  - 有相关突变 → 逐条列出（仅位点与 AA 变化）
  - 无相关突变 → 明确声明“已计算/已核查，未发现需要结构补偿性突变”

### Phase 5 — QC（必算）
- developability / liabilities / immunogenicity / 结构 QC（CDR RMSD、夹角、canonical、Vernier 门禁结论）必须完成并写入内部结果。

### Phase 6 — 交付门禁（Hard Gate）
- 必须执行：`python scripts/verify_vhvl_v44_project.py <id> projects/<id>_Redesign`
- 必须通过：客户报告防泄露、交付目录白名单、结构/编号自检、Phase4 日志存在且 22 行。

---

## 5) “9C1 最终版本一致”的含义（Compatibility Target）

一致的不是“具体数值”，而是：
- 同一 V4.4 门禁（dual numbering、Phase4 逐位日志、报告禁词、交付白名单）
- 同一输出结构（固定目录 + single source of truth + 客户/审计分离）
- 同一客户报告表达策略（结论/建议可见；核心算法因子不可见）

