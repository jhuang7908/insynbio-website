# Virtual Affinity Maturation — Computational Methods Review
## 免费开源工具质量与计算成本对比

**版本**: v2.1 | **日期**: 2026-03-31  
**适用场景**: 基于**结构 + AI 推理**的**虚拟亲和力成熟**（定点/小组合突变）；界面 ΔΔG 预测。**基于结构的突变成熟不需要 MPNN**（逆折叠）。**ProteinMPNN / AbMPNN / IgMPNN 仅在大规模 CDR 改写类项目中使用**，与结构驱动定点成熟是**两条工作线**。

**v2.1 补充**  
- 明确：**MPNN = 大规模 CDR 序列改写**；**基于结构的亲和力成熟 = 不用 MPNN**。

**v2.0 相对 v1.0 的变更**  
- 明确工程定位：**保守 CDR、结构热点驱动**的突变扫描与组合，而非 MPNN 广撒网改序列。  
- 突变筛选**强制并联** **AbLang**（抗体自然态 / 伪似然打分）。  
- 增补 **L1 / L2 / L3 三级能量与打分表**。  
- 增补 **CMC / developability 门控**（与 AbEvaluator 体系对齐）。

---

## 一、方法分类总览（结构驱动 · 定点成熟）

本项目的**结构驱动**虚拟亲和力成熟强调**结构生物学可解释性**与**可制造性**，分为五层；**全程不包含**逆折叠类 **ProteinMPNN**（与 **ThermoMPNN** 名称相近但用途不同，见 §2.1）。

```
① 结构 + 界面分析     → 接触残基、BSA、hot-spot（AI/人工推理）
② L1 快速能量预筛     → 大量单点 ΔΔG 代理（EvoEF2 等）
③ 抗体自然态打分      → AbLang 伪似然 / 相对 WT 的序列合理性
④ L2/L3 结构与能量精筛 → ThermoMPNN、AF2-Multimer、可选 MM/GBSA
⑤ CMC 门控            → pI、聚集、电荷斑、ADI、化学风险位点
```

**MPNN 何时用、何时不用**  
- **基于结构的定点/小组合突变**（界面热点、ΔΔG 扫描、AF2 验证）：**不使用** ProteinMPNN / AbMPNN / IgMPNN；序列由**白名单位点 + 氨基酸枚举**产生即可。  
- **大规模 CDR 改写**（整段 CDR 或大范围 redesign、批量采样序列）：在此类**独立项目线**中使用 **ProteinMPNN**（及可选 AntiFold、dyMEAN 等），且**仍须** AbLang + CMC 门控。  
- **ThermoMPNN**：名称含 MPNN，实为 **ΔΔG / ΔTm 预测**，用于 L2 打分，**不属于**「逆折叠改 CDR」工具。

---

## 二、核心方法对比表

### 2.1 ΔΔG 结合能预测工具

| 工具 | 类别 | 速度 | 精度 | 许可证 | 是否本地 | 备注 |
|------|------|------|------|--------|---------|------|
| **EvoEF2** | 物理力场 | ★★★★★ | ★★★ | MIT | ✅ 已集成 | 本地 exe，秒级出结果 |
| **FoldX** | 半经验力场 | ★★★★ | ★★★★ | 学术免费 ⚠️ | ✅ 本地 | 商业用途须付费 |
| **Rosetta ddg_monomer** | 物理力场 | ★★★ | ★★★★ | 学术免费 ⚠️ | ✅ 本地 | 商业须许可证 |
| **ESM-IF1 ΔΔG** | 蛋白语言模型 | ★★★★ | ★★★★ | MIT | ✅ 本地/GPU | Meta AI，开源无限制 |
| **SASA-ΔΔG** | 经验/几何 | ★★★★★ | ★★ | 自实现，无限制 | ✅ 本地 | 快速预筛选 |
| **OpenMM MM/GBSA** | 分子力学 | ★★ | ★★★★★ | MIT | ✅ 本地 | 最准但最慢 |
| **PRODIGY** | ML+结构特征 | ★★★★ | ★★★ | 免费 web | 🌐 Web | 仅适合界面 ΔG 绝对值 |
| **mCSM-AB2** | 图神经网络 | ★★★★ | ★★★★ | 免费 web ⚠️ | 🌐 Web | 专为抗体优化，学术免费 |
| **DDGun3D** | ML | ★★★ | ★★★ | 免费 web | 🌐 Web | 基于序列+结构 |
| **ThermoMPNN** | GNN（架构源自 ProteinMPNN）| ★★★★ | ★★★★ | MIT | ✅ 本地 | **ΔΔG + ΔTm 打分**；**不是**逆折叠改序列，结构成熟 L2 **照常使用** |

> ⚠️ = 学术免费但商业须授权；✅ = 可商业使用的开源工具；🌐 = 仅限 Web 服务

---

### 2.2 逆折叠 / 序列生成（仅「大规模 CDR 改写」项目线）

> **结构驱动的虚拟亲和力成熟不使用本节工具。** 本节仅在客户立项为**整段 CDR 或大范围序列空间探索**时启用。

| 工具 | 类别 | 速度 | 多样性 | 许可证 | 使用场景 |
|------|------|------|--------|--------|----------|
| **ProteinMPNN** | GNN 逆折叠 | ★★★★★ | ★★★★ | MIT | **大规模 CDR / 界面批量 redesign** |
| **AbMPNN / IgMPNN** | 抗体专用逆折叠 | ★★★★ | ★★★★ | MIT | 同上，抗体微调权重 |
| **AntiFold** | 抗体逆折叠 | ★★★★ | ★★★★ | MIT | CDR 结构感知 redesign（大改场景） |
| **dyMEAN** | CDR 生成 | ★★★ | ★★★★★ | MIT | CDR loop 重生成类项目 |
| **ESM-IF1** | Transformer | ★★★★ | ★★★★ | MIT | 大改项目中序列/界面辅助；**结构定点成熟**中仅可作 ΔΔG 等辅助，**非**序列主引擎 |
| **LigandMPNN** | GNN + 配体感知 | ★★★★ | ★★★ | MIT | 小分子配体共设计，与亲和力成熟主流程正交 |

---

### 2.3 抗体序列自然态：AbLang（突变筛选必检）

| 项目 | 说明 |
|------|------|
| **工具** | **AbLang** — 在抗体序列（如 SAbDab 等）上训练的抗体语言模型，输出**逐残基伪似然 / log P**。 |
| **用途** | 对**突变体全长 VH/VL 或 VHH** 与 **WT** 对比：界面能量「变好」但序列落在**低概率、非自然抗体流形**上的突变应降权或剔除。 |
| **常用指标** | 突变位点或突变窗口的 **ΔlogP**（mut − WT）、或全序列 **perplexity** 相对变化。 |
| **与 EvoEF2 关系** | **并联**：EvoEF2 偏「物理界面」，AbLang 偏「进化/库统计」；二者冲突时优先人工复核结构。 |
| **实现** | 以官方仓库为准本地或轻量 API 调用；具体许可证以仓库 LICENSE 为准（学术与商业部署前须核对）。 |

> 参考：<https://github.com/TobiasHeOl/AbLang>（AbLang）；同类思路可用 **IgLM** 等抗体 LM 作交叉验证，但须在报告中注明模型与版本。

---

### 2.4 结构预测验证工具

| 工具 | 用途 | 速度 | 精度 | 许可证 |
|------|------|------|------|--------|
| **ColabFold (AF2-Multimer)** | 复合物结构预测 | ★★★ | ★★★★★ | MIT | 已在用 |
| **ESMFold** | 单链快速预测 | ★★★★★ | ★★★★ | MIT | 无 MSA，秒级 |
| **OmegaFold** | 单链预测 | ★★★★★ | ★★★★ | MIT | 无 MSA |
| **OpenFold** | AF2 开源复现 | ★★★ | ★★★★★ | Apache 2.0 | 完全开源 AF2 |
| **NanoBodyBuilder2** | VHH 专用建模 | ★★★★ | ★★★★★ | MIT | ImmuneBuilder 系列 |
| **ABodyBuilder2** | VH/VL 专用 | ★★★★ | ★★★★★ | MIT | 已在项目中集成 |

---

### 2.5 界面分析工具

| 工具 | 用途 | 许可证 | 备注 |
|------|------|--------|------|
| **FreeSASA** | SASA 计算 | MIT | 快速，C 库 |
| **PDBePISA** | 界面残基识别 | 免费 web | 黄金标准界面分析 |
| **ProDy (Python)** | 接触图/B-因子分析 | MIT | Python 库 |
| **Bio.PDB (Biopython)** | 距离接触分析 | MIT | 基础工具 |
| **MDAnalysis** | 轨迹/界面分析 | GPL | 需 MD 数据 |

---

## 三、分级能量与打分表（L1 / L2 / L3）

### 3.1 总览

| 级别 | 时间尺度 | 主要目的 | 典型输出 |
|------|----------|----------|----------|
| **L1** | 毫秒–秒 / 全库扫描 | 便宜剔除明显不利突变 | ΔΔG_bind 代理、几何过滤 |
| **L2** | 秒–分钟 / 数十候选 | 排序与稳定性兼顾 | ΔΔG、ΔTm、可选 web ML |
| **L3** | 分钟–小时 / 个位数 | 构象与界面一致性 | ipTM、精修后能量、可选 MM/GBSA |

### 3.2 L1 — 快速预筛（每突变体）

| 指标 | 工具 / 方法 | 建议 Gate（示例，项目可调） |
|------|-------------|---------------------------|
| 界面结合自由能变化 | **EvoEF2** `ComputeBinding` | ΔΔG_bind < **−0.3** kcal/mol 进入下一层 |
| 单体稳定性粗筛 | EvoEF2 / 同包单体项 | ΔΔG_fold **优于** −1.0 kcal/mol（避免明显解折叠） |
| 可选：埋藏面积代理 | 自实现 SASA-ΔΔG | 与 L1 同跑，作 tie-break |

### 3.3 L2 — 中等精度（Top 20–50 单点或少量组合）

| 指标 | 工具 / 方法 | 建议 Gate（示例） |
|------|-------------|-------------------|
| 结合 / 稳定性 | **ThermoMPNN** | ΔΔG 与 **ΔTm** 均不显著劣于亲本；综合分排名前 15–20 |
| 抗体自然态 | **AbLang** ΔlogP（突变区或全链） | **不低于 WT 或降幅在预设容差内**（如平均 ΔlogP ≥ −0.2～−0.3，以校准为准） |
| 可选交叉验证 | **ESM-IF1** 界面 ΔΔG | 与 EvoEF2 / ThermoMPNN 方向一致则加分 |
| 参考（非商用主依赖） | mCSM-AB2 Web | 仅作辅助排序，报告注明 Web 条款 |

### 3.4 L3 — 高精度（最终 3–8 条序列）

| 指标 | 工具 / 方法 | 建议 Gate（示例） |
|------|-------------|-------------------|
| 复合物置信度 | **ColabFold AF2-Multimer** | **ipTM ≥ 亲本**；界面残基接触模式与亲本一致（人工 + 距离矩阵） |
| 精修后能量 | EvoEF2 on **突变体复合物 PDB**（侧链/刚体优化后） | ΔΔG_bind 排序与 L1/L2 不矛盾 |
| 可选 | OpenMM MM/GBSA | 仅最终 1–3 个候选；耗时在报价中单独列出 |

### 3.5 AbLang 与能量打分的联合决策表（推荐）

| EvoEF2 ΔΔG_bind | AbLang vs WT | 建议动作 |
|-----------------|-------------|----------|
| 有利（更负） | 自然态持平或改善 | **优先合成** |
| 有利 | 自然态明显下降 | **降级**：需 L3 结构或改选其他氨基酸类型 |
| 不利 | 任意 | **剔除** |
| 边缘 | 自然态明显改善 | **保留观察**：可能补偿误差，靠 L3 / 实验 |

---

## 四、精度 vs 计算成本（与 L 级对应）

```
精度（ΔΔG Pearson r vs 实验值，文献综合估计）
 ↑
 │  OpenMM MM/GBSA ████████████ r≈0.65 | → 典型 L3
 │  Rosetta ddg    ███████████  r≈0.60 | → L3 可选
 │  mCSM-AB2       ██████████   r≈0.58 | → L2 参考
 │  ThermoMPNN     █████████    r≈0.55 | → L2
 │  ESM-IF1 ΔΔG    █████████    r≈0.55 | → L2 可选
 │  FoldX          ████████     r≈0.50 | → L2 可选（授权）
 │  EvoEF2         ███████      r≈0.45 | → L1 主力
 │  SASA-ΔΔG       █████        r≈0.30 | → L1 辅助
 └────────────────────────────────────────────────────→
   毫秒        秒          分钟       小时
```

**AbLang** 不提供标准 ΔΔG Pearson r；其价值在**序列流形**，与上表互补。

---

## 五、CMC / Developability 门控（与 AbEvaluator 对齐）

所有进入「推荐合成」列表的突变体（含组合）**必须通过** CMC 一层，**不得低于项目基线**（通常为亲本或已锁定的人源化分子）。

### 5.1 推荐检查项（VH/VL 或 VHH）

| 类别 | 指标（示例） | 门控思路 |
|------|--------------|----------|
| 理化 | pI、净电荷（pH7）、GRAVY | 落在项目规定区间；相对亲本突变 **ΔpI、Δ电荷** 可接受 |
| 聚集 / 表面 | SAP、疏水斑（9-mer）、电荷斑（7-mer） | **不显著劣于**亲本；VHH 注意 ADI / human_sdab_ADI |
| 化学风险 | 脱酰胺（N-G、N-S）、异构化（D 在特定 motif）、氧化（M、W） | 新引入风险位点须标注；CDR 内高风险须 **FAIL 或需实验豁免** |
| 结构 | 二硫、脯氨酸、CDR 长度/规范簇 | 不改变已验证的 engineering 约束（如 hallmark 残基） |

### 5.2 与打分漏斗的衔接

```
L1/L2/L2.5 通过后
    → 跑 AbEvaluator（或等价 CMC 脚本）生成 developability 表
    → 任一 **硬门控 FAIL** → 不得进入「客户推荐短名单」
    → WARN → 写入报告，由客户决定是否仍合成
```

具体阈值引用项目内 **STANDARDS_INDEX** / **AbEngineCore** 或 VHH 模块中的现行 gate。

---

## 六、推荐工作流（结构 AI + AbLang + CMC；**不含**逆折叠 MPNN）

```
层 0 — 结构与 AI 推理定库
──────────────────────────────────────────────
输入: 复合物 PDB（对接或 AF2-Multimer）+ 表位/接触表
输出: 允许突变位点白名单（如界面 + 结构 reasoning）；锚定位/禁忌位清单

层 1 — L1 能量扫描 + AbLang 初筛
──────────────────────────────────────────────
工具: EvoEF2（+ 可选 SASA 代理）+ **AbLang（全序列或突变窗口）**
输出: Top 30–60（同时满足 ΔΔG 与 AbLang 容差）

层 2 — L2 精排 + CMC 初检
──────────────────────────────────────────────
工具: ThermoMPNN + AbLang 复核 + **AbEvaluator CMC 快速表**
输出: Top 10–20 单点；设计 3–6 个**空间相容**组合

层 3 — L3 结构验证 + CMC 终审
──────────────────────────────────────────────
工具: ColabFold + EvoEF2(精修 PDB) + **完整 CMC 报告**
输出: 短名单 3–8 条 + 交付包（结构图 + 打分表 + CMC）
```

---

## 七、工具授权对比（商业可用性）

| 工具 | 许可证 | 商业可用 | 注释 |
|------|--------|---------|------|
| **EvoEF2** | MIT | ✅ 是 | 已在 `tools/EvoEF2_src/` |
| **ColabFold / AF2** | MIT + Apache | ✅ 是 | 开源核心；ColabFold API 有使用条款 |
| **ESMFold / ESM-IF1** | MIT | ✅ 是 | Meta AI 发布 |
| **ThermoMPNN** | MIT | ✅ 是 | |
| **AntiFold** | MIT | ✅ 是 | 仅作可选模块 |
| **OpenMM** | MIT | ✅ 是 | |
| **FreeSASA** | MIT | ✅ 是 | |
| **ABodyBuilder2** | MIT | ✅ 是 | ImmuneBuilder |
| **AbLang** | 以官方仓库为准 | 部署前核对 | 突变筛选推荐必检 |
| **ProteinMPNN** | MIT | ✅ 是 | **仅大规模 CDR 改写项目**；结构定点成熟**不用** |
| **FoldX** | 学术免费 | ❌ 须授权 | |
| **Rosetta** | 学术免费 | ❌ 须授权 | |
| **mCSM-AB2** | Web 免费 | ⚠️ 仅 Web | 学术/非商业条款 |

---

## 八、各工具性能 Benchmark 摘要（节选）

### EvoEF2（已集成）
- **数据集**: SKEMPI 2.0（7,085 突变点）
- **性能**: ΔΔG Pearson r ≈ 0.45，MUE ≈ 1.1 kcal/mol
- **优势**: 毫秒级速度，完整能量分解（VdW/静电/氢键/溶剂化），支持 `ComputeBinding` 模式直接计算 ΔΔG_bind
- **命令**: `EvoEF2 --command=ComputeBinding --pdb=complex.pdb`

### ThermoMPNN
- **数据集**: Megascale 数据集（~350K 突变）+ ProTherm
- **性能**: Pearson r ≈ 0.55（Ssym benchmark）；同时预测 ΔΔG 和 ΔTm（热稳定性）
- **安装**: `pip install thermompnn`

### ESM-IF1
- **性能**: Native recovery 51.4%（类 ProteinMPNN）；ΔΔG 预测 r ≈ 0.55
- **安装**: `pip install fair-esm`

### MM/GBSA via OpenMM
- **性能**: 最高精度，r ≈ 0.65–0.70（常配合 ns 级 MD）
- **适用**: L3 最终候选，不适合扫描

### ProteinMPNN / AbMPNN / IgMPNN（逆折叠）
- **与结构定点成熟的关系**：**不使用**。定点突变的序列空间由结构白名单 + 19 种氨基酸（或子集）枚举即可。  
- **使用场景**：**大规模 CDR 改写**（整段或大范围 redesign、批量采样）。启用后**必须**通过 AbLang + CMC。  
- **勿与 ThermoMPNN 混淆**：后者为 **ΔΔG/ΔTm 打分**，结构成熟流程的 L2 **可用**。

---

## 九、本项目推荐组合（示例：PAG-1 或同类项目）

```
Step 1  界面热点 + 结构 AI 白名单
        工具: Bio.PDB / PISA + 人工表位注释
        输出: 可突变位点 + 禁忌位（锚定、Stealth、hallmark 等）

Step 2  L1：EvoEF2 单点扫描 + AbLang
        筛选: ΔΔG_bind < −0.3 且 AbLang 不低于 WT 容差

Step 3  L2：ThermoMPNN + AbLang + AbEvaluator 快速 CMC
        筛选: Top 15–20 单突变；剔除 CMC FAIL

Step 4  组合突变（3–6 组）
        策略: 空间分隔 + epistasis 检查；每组重复 Step 2–3 轻量版

Step 5  L3：ColabFold AF2-Multimer + EvoEF2 on 突变 PDB
        指标: ipTM ≥ 亲本；接触模式一致

Step 6  CMC 终审 + 交付
        内容: 序列 + L1/L2/L3 打分表 + AbLang 对比 + CMC 卡 + 结构图
```

---

## 十、参考资源

| 资源 | 链接 |
|------|------|
| EvoEF2 | https://github.com/tommyhuangthu/EvoEF2 |
| ThermoMPNN | https://github.com/Kuhlman-Lab/ThermoMPNN |
| ESM-IF1 / ESM | https://github.com/facebookresearch/esm |
| **AbLang** | https://github.com/TobiasHeOl/AbLang |
| ColabFold | https://github.com/sokrypton/ColabFold |
| ABodyBuilder2 | https://github.com/oxpig/ImmuneBuilder |
| ProteinMPNN | https://github.com/dauparas/ProteinMPNN |
| AntiFold | https://github.com/oxpig/AntiFold |
| OpenMM MM/GBSA | https://github.com/openmm/openmm |
| SKEMPI2 benchmark | https://life.bsc.es/pid/skempi2 |
| mCSM-AB2 (web) | https://biosig.lab.uq.edu.au/mcsm_ab2 |

---

## 附录：v1.0 → v2.0 对照

| 主题 | v1.0 | v2.0 / v2.1 |
|------|------|------|
| 主序列设计手段 | ProteinMPNN 列为层 2 核心 | **结构成熟不用 MPNN**；MPNN **仅**大规模 CDR 改写项目线 |
| 抗体序列质量 | 未单列 | **AbLang（必检）** |
| 打分 | 三层文字描述 | **L1/L2/L3 表格式** + AbLang 联合决策表 |
| CMC | 未系统写入 | **第五节 + 漏斗嵌入** |
| 结构定位 | 通用四类流程 | **结构 AI + 白名单位点** 显式层 0 |
