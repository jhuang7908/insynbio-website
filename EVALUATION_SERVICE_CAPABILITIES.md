# InSynBio 抗体评估模块 — 服务能力说明

**系统**: InSynBio AbEngineCore v1.0  
**模块**: `core/evaluation` + 相关 Pipeline 组件  
**日期**: 2026-02-23  

本文档基于现有 evaluation 模块实现，说明**可提供的抗体评估服务**及**各服务支持程度**（✅ 已实现 / ⚠️ 部分实现 / ❌ 未实现 / 📋 规划中）。

> **重新规划**: 面向全人源化抗体客户的模块重构设计见 [EVALUATION_MODULE_REDESIGN.md](EVALUATION_MODULE_REDESIGN.md) — 移除 delta_vs_mouse，新增多抗体 vs 同一抗原比较、结构驱动亲和力成熟、AI 可开发性/CMC 建议。

---

## 一、ANARCI 切分，IMGT 与 Kabat 变化

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **ANARCI 编号** | ✅ 已实现 | 使用 ANARCI/ANARCI 对 VH/VL 序列进行编号；支持 IMGT、Kabat  schemes |
| **IMGT 编号** | ✅ 已实现 | 作为 pipeline 内部标准（`config/vh_vl_humanization_v44.json` 中 `numbering_scheme: IMGT`）；CDR 区间按 IMGT 定义（26–38 / 55–65 / 105–117） |
| **Kabat 编号** | ✅ 已实现 | 客户报告与克隆设计统一使用 Kabat；通过 `core/humanization/kabat_utils.kabat_from_anarcii()` 转换，插入码按 `(pos, ins)` 保留 |
| **双编号 QA** | ✅ 已实现 | Phase 1 HARD GATE：ANARCI(IMGT) + ANARCI(Kabat) 独立编号，按 `sequence_index` 对齐，插入码一致性校验 |
| **Vernier 22 位点双编号** | ✅ 已实现 | 22 个 Vernier 位点均有 IMGT + Kabat 对应表，用于 Phase 4 回突决策与内部审计 |

**可提供服务**：VH/VL 序列的 IMGT、Kabat 编号与 FR/CDR 切分；双 scheme 一致性 QA；Vernier 位点 IMGT↔Kabat 对照表。

---

## 二、工业化胚系模板检索

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **胚系候选筛选** | ✅ 已实现 | 基于 CDR 长度门控、FR 同源性、黄金配对等步骤（`run_vhvl_v44_pipeline` 内） |
| **黄金配对 (Golden Pairs)** | ✅ 已实现 | 基于 **842 临床抗体 germline 库**（384 natural + 458 engineered）VH/VL 共现频率；配对频率用于框架选择 |
| **临床胚系统计** | ✅ 已实现 | `thera_germline_mapping.csv`、`thera_representatives_by_germline.yaml` 用于临床胚系使用频率与代表抗体 |
| **胚系身份分析** | ✅ 已实现 | AbEvaluator `germline` 模块：最近 VH 胚系、FR/CDR 分段、identity%、SHM 数；数据源包括 `vernier_index_lookup.json`、`human_VH3_germlines.json` |
| **配对检索** | ✅ 已实现 | 内部 `pairing_lookup_*.json` 记录 VH-VL 配对命中；客户报告仅给出“已完成内部门禁核查”结论 |

**可提供服务**：工业化风格的胚系模板检索与 VH/VL 黄金配对推荐；临床胚系频率参考；最近胚系与 identity 报告。

---

## 三、抗体结构建模 & 抗原抗体复合物建模

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **抗体 Fab 结构建模** | ✅ 已实现 | ImmuneBuilder ABodyBuilder2：从 VH+VL 序列预测 Fab 结构；支持记录 **pLDDT**（预测置信度） |
| **VHH 结构建模** | ✅ 已实现 | NanoBodyBuilder2：VHH 单域抗体结构预测 |
| **抗原抗体复合物建模** | ✅ 已实现 / 📋 可扩展 | **AlphaFold2**（含 ColabFold）可用于 Ab-Ag 复合物从头建模；可输出 ipTM、pTM、**pLDDT** 等预测质量指标 |
| **结构预测质量指标** | ✅ 已实现 | **pLDDT**（per-residue 与 mean）、ipTM、pTM；PipelineQA 对 pLDDT 做物理范围校验（70–100 为高置信） |

**可提供服务**：VH/VL 或 VHH 的 Fab 结构预测（ABodyBuilder2）；**抗原抗体复合物**可由 AlphaFold2 建模；结构预测均含 pLDDT 等质量指标。

---

## 四、抗体结构相关指数 & 抗原抗体复合物解析

### 4.1 抗体（单体 Fab）结构指标（`structure_13param`）

| 指标 | 含义 | 单位/范围 |
|------|------|-----------|
| **pLDDT** | 预测局部距离差测试（结构置信度） | 0–100；> 80 高置信，> 90 极高 |
| `vh_vl_angle_deg` | VH-VL 域间夹角 | °（典型 55–110） |
| `interface_n_pairs` | VH-VL 界面接触对数 | 原子对 |
| `interface_mean_dist_A` | 界面原子平均距离 | Å |
| `interface_min_dist_A` | 界面最小距离 | Å |
| `vernier_sasa_total` | Vernier 22 位点总 SASA | Å² |
| `vernier_sasa_per_residue` | 每 Vernier 位点 SASA | Å² |
| `vernier_packing` | Vernier 位点接触数（4.5 Å） | 整数 |
| `vernier_cdr_distances` | Vernier ↔ 各 CDR 最小距离 | Å |
| `canonical` | CDR 构型类别（基于序列/长度） | H1-13-1 等 |
| `canonical_north` | North 标准构型（phi/psi） | Standard / Outlier |
| `vernier_dual_numbering` | 22 Vernier 位点 IMGT+Kabat 双编号表 | JSON |

### 4.2 人源化 vs 鼠源结构差异（`delta_vs_mouse`）

| 指标 | 含义 | 门禁 |
|------|------|------|
| `angle_delta` | 人源化 vs 鼠源 VH-VL 夹角差 | < 3° |
| `cdr_rmsd` | 各 CDR 的 Cα RMSD | 每 CDR |
| `cdr_rmsd_max` | 最大 CDR RMSD | < 1.5 Å |
| `cdr_rmsd_pass` | CDR 构型保真门禁 | PASS/FAIL |

### 4.3 抗原抗体复合物解析（`binding_site` / `interface_metrics`）

需提供**已有** Ab-Ag 复合物 PDB，并指定抗原链 ID。

| 类别 | 指标 | 含义 |
|------|------|------|
| **界面几何** | BSA | 埋藏表面积 (Å²) |
| | paratope / epitope 残基列表 | 抗体/抗原侧接触残基 |
| | 各 CDR 接触数、BSA 贡献 | 按 H1/H2/H3/L1/L2/L3 |
| | VH vs VL 贡献比例 | % |
| **非共价相互作用** | H-bonds | 氢键数 |
| | salt bridges | 盐桥数 |
| | hydrophobic contacts | 疏水接触 |
| | Van der Waals | VdW 接触 |
| | π-π stacking | 芳香环堆积 |
| | cation-π | 阳离子-π |
| **电荷** | paratope/epitope 净电荷 | 整数 |
| | charge complementarity | 电荷互补性 |
| **结合能估计** | ΔG_BSA | 经验 ΔG (kcal/mol) |
| **形状互补** | SC score | 0–1（抗体典型 0.64–0.72） |
| **阻断分析** | blocking_ref | 抗原关键位点（如 PD-1/PD-L1）重叠分析 |

**可提供服务**：Fab 13 参数结构评估；人源化 vs 鼠源 delta；已有或 AlphaFold2 预测的复合物 PDB 的界面指标与阻断分析。

---

## 五、抗体可开发性 / CMC 分析

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **pI** | ✅ 已实现 | Fab 序列等电点（BioPython）；门禁 5.5–8.5 |
| **GRAVY** | ✅ 已实现 | 疏水性均值 |
| **instability index** | ✅ 已实现 | 不稳定指数；> 40 触发 WARN |
| **net_charge_pH7** | ✅ 已实现 | pH 7 净电荷 |
| **SAP 代理** | ✅ 已实现 | 9-mer 最大疏水片段分数、7-mer 最大净电荷；用于聚集倾向初筛 |
| **TAP 五项指标** | ✅ 已实现 | 完整复现 Raybould 2019 算法：Total CDR Length, PSH, PPC, PNC, SFvCSP；含临床抗体阈值对照 |
| **CDR 风险扫描** | ✅ 已实现 | `cdr_scan`：脱酰胺(NG/NS)、异构化(DG/DS)、氧化(M/W)、糖基化(NxS/T)、游离 Cys |
| **CMC 设计** | ✅ 已实现 | `core/cmc/cmc_design.py`：pI>8.5 时 FR-only 降 pI 设计 v3；Vernier 位点 CMC 风险位点扫描 |

**可提供服务**：pI、GRAVY、不稳定指数、净电荷、SAP 风险、CDR 化学修饰风险、pI 降低设计建议。

---

## 六、InSynBio 免疫原性 In silico Evaluation（仅参考）

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **MHC-II T 细胞表位** | ✅ 已实现 | 27 等位基因 IEDB 预测（在线 API 或本地 NetMHCII-4.0/MHCflurry2）；15-mer 滑动窗口 |
| **漏斗式过滤** | ✅ 已实现 | (a) FR-only；(b) Parker 亲水性 > -0.5；(c) 胚系耐受（IGHV/IGKV/IGLV）；(d) 聚类分析 |
| **表面免疫原性** | ✅ 已实现 | Parker 亲水性、SASA 表面埋藏度（`core/immunogenicity/surface_immuno.py`） |
| **客户报告格式** | ✅ 已实现 | `format_immunogenicity_section()`：仅输出 risk level、n_high、n_medium、n_tolerated、n_clusters、recommended action |

**可提供服务**：InSynBio 免疫原性 In silico Evaluation — MHC-II 风险预测、风险位点与聚类；建议后续湿实验（如 PBMC T 细胞增殖）。**仅作参考**，不作为审批依据；最终需实验验证。

---

## 客户类型说明

| 客户类型 | 适用服务 | 不适用 / 可省略 |
|----------|----------|-----------------|
| **转基因人源化小鼠来源抗体** | ANARCI/IMGT/Kabat、842 胚系检索、结构建模、可开发性/CMC、InSynBio 免疫原性 In silico | **无 Vernier Zone** 分析、**无人源化相关**分析（如 delta_vs_mouse、Vernier 回突、人源化框架选择） |
| **鼠源抗体人源化** | 全量服务，含 Vernier Zone、delta_vs_mouse、黄金配对、CMC 设计等 | — |

---

## 七、结构驱动亲和力成熟

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **AI  affinity 预测** | ❌ 未实现 | 无内置 AI 亲和力预测模块 |
| **ProteinMPNN** | ⚠️ 部分 | `tools/ProteinMPNN/` 存在，用于序列设计，非专门亲和力成熟 |
| **其他 AI 亲和力工具** | ❌ 未实现 | 未集成 AlphaFold-Multimer、IgFold、ESMFold 等用于 Ab-Ag 亲和力预测 |

**可提供服务**：当前**不提供** 结构驱动亲和力成熟服务。后续可规划基于结构的突变设计与排序。

---

## 八、AI 可开发性 / CMC 分析建议

| 能力 | 支持状态 | 说明 |
|------|----------|------|
| **规则驱动 CMC 建议** | ✅ 已实现 | `core/cmc/cmc_design.py`：基于 pI、Vernier 位点、FR-only 突变的 CMC 设计 |
| **AI 驱动的 CMC 优化** | ❌ 未实现 | 无机器学习/深度学习 CMC 预测或优化 |
| **聚集/稳定性 AI 预测** | ❌ 未实现 | SAP、TANGO 等为规则/物理模型，非 AI 模型 |

**可提供服务**：基于规则的 CMC 设计（pI 降低、位点替换建议）；**不提供** AI 驱动的可开发性/CMC 优化建议。

---

## 九、服务能力总览表

| 类别 | 可提供服务 | 限制 |
|------|------------|------|
| 1. ANARCI/IMGT/Kabat | 双编号、FR/CDR 切分、Vernier 22 位点对照 | 依赖 ANARCI；转基因小鼠客户无需 Vernier |
| 2. 胚系模板检索 | 842 抗体 germline 库、黄金配对、临床胚系参考 | 需预置 thera_sabdab 等数据 |
| 3. 结构建模 | Fab (ABodyBuilder2)、VHH (NanoBodyBuilder2)、Ab-Ag 复合物 (AlphaFold2)；pLDDT 等质量指标 | — |
| 4. 结构/界面指标 | 13 参数、delta_vs_mouse、复合物界面解析 | 复合物解析需已有 PDB |
| 5. 可开发性/CMC | pI、SAP、CDR 风险、CMC 设计 | 规则驱动 |
| 6. InSynBio 免疫原性 In silico | MHC-II 漏斗、风险位点、报告 | 仅参考，需实验验证 |
| 7. 结构驱动亲和力成熟 | — | **未实现** |
| 8. AI CMC 建议 | — | **未实现** |

---

## 十、调用方式示例

```bash
# 全人抗体评估
python Abenginecore/abenginecore.py evaluate my_ab --type fully_human \
  --pdb human.pdb \
  --modules structure_13param developability immunogenicity germline cdr_scan

# 人源化抗体评估（需 mouse 对照）
python Abenginecore/abenginecore.py evaluate my_ab --type humanized \
  --pdb humanized.pdb --ref-pdb mouse.pdb \
  --modules structure_13param delta_vs_mouse developability immunogenicity

# 含抗原链的复合物界面分析（需在代码中指定 antigen_chain）
# 当前 CLI 未暴露 antigen_chain，需通过 Python API 调用 binding_site 模块
```
