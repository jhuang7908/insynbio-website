# De Novo CDR Design & Patent Escape Standard (V5.0)

> **Version history:** V1.0 (initial) → V3.0 (OASis/promb integration, AF2 Colab handoff) → V4.0 (gate restructuring, T0.0 PTM, conditional ImmuneBuilder/AbLang) → **V5.0** (T1.5 interface clash gate, three-question tool framework, adaptive routing engine, multi-CDR/CDR3 extended pipeline, HADDOCK3 integration rules)
>
> **Source of changes:** VGRW-SR-R2 HER2 VHH De Novo Design case (April 2026) — full pipeline execution + 27-candidate T1.5 validation + multi-CDR design discussion with owner.

---

## 1. 核心理念与应用场景 (Core Philosophy & Applications)

本标准定义了 InSynBio 平台针对抗体（VH/VL 及 VHH）进行**全自动 CDR 重写与专利逃逸（Patent Escape / FTO）**的工业级计算管线。

**核心目标：**
1. **突破专利壁垒 (FTO)：** 通过大幅降低序列同源性（通常目标 < 75% 或避开专利 Claim 范围），生成具有完全自主知识产权的全新抗体序列。
2. **化学可行性优先 (Chemistry First)：** V4.0 的核心改变是将 PTM 化学修饰检查提升为管线的**第一道门控**，而非后处理步骤。MPNN 不理解化学，只理解结构——这是计算设计的根本盲点，必须用专门的序列门控弥补。
3. **保持特异性与亲和力 (Specificity & Affinity)：** 通过结构门控（RMSD、表位重叠度）确保结合姿态不漂移，并通过 VAM 引擎进行亲和力兜底。
4. **极致算价比 (Cost-Efficiency)：** 门控顺序由代价最低到最高，最昂贵的计算仅在分子通过所有廉价门控后执行。

**V5.0 核心改变 vs V4.0：**

| 改变项 | V4.0 | V5.0 | 依据 |
|-------|------|------|------|
| 结合界面检查 | 无 | **T1.5 EvoEF2 Clash 必须** | 27 候选实测：26 PASS / 1 FAIL (0.46Å overlap)。2s/条替代 3min ImmuneBuilder |
| 工具选型原则 | 按经验配 | **三问题框架（§2b）** | 每个工具精确回答一个物理问题，不越界使用 |
| 多 CDR / CDR3 | 未明确 | **扩展管线（§6）** | CDR3 骨架高度可变，必须 ImmuneBuilder + HADDOCK3 |
| 管线路由 | 条件判断函数 | **完整决策树（§9）** | 5 种场景 × 8 种工具组合 = 自动路由 |
| 断点续算 | 部分支持 | **全步骤 checkpoint/resume** | 每步完成即存状态，Ctrl+C 安全中断 |

**V4.0 核心改变 vs V3.0（仍然有效）：**

| 改变项 | V3.0 | V4.0 | 依据 |
|-------|------|------|------|
| PTM 检查时机 | 后处理（管线结束后） | **第一道门控 T0.0** | VGRW-SR-R2: 73%序列因PTM失败，但已进入所有下游计算 |
| ImmuneBuilder | 始终运行 | **条件运行** | VGRW-SR-R2: 27/27全部通过，RMSD从未超过阈值的54%。浪费81分钟 |
| AbLang T1 | 始终运行 | **条件运行** | VGRW-SR-R2: 118/118全部通过，分值范围仅-0.41到-0.32。零过滤效果 |
| MPNN 温度 | [0.2, 0.3, 0.5] | **[0.3, 0.5, 0.8, 1.0]** | 旧设置导致82%序列冗余，只有18%唯一CDR2 |
| MPNN bias_AA | 无 | **per-residue PTM avoidance** | 在已知会产生DA/NA的位置惩罚D和N |
| CDR Root 掩码 | 不固定（未明确） | **不应硬编码固定** | MPNN 自身已将结构锚点固定（0%突变率）。硬固定减少搜索空间，无益处 |
| PRODIGY | 用于结合能 | **已废弃** | 精度不足以区分候选分子；改用 MM/GBSA |

---

## 2. 三问题框架 (Three-Question Tool Framework) — V5.0 核心

**V5.0 最重要的规则：每个工具只回答一个物理问题。不越界使用。**

| 序号 | 物理问题 | 工具 | 输入 | 输出 | 何时需要 |
|------|---------|------|------|------|---------|
| Q1 | **这条序列能折叠吗？** | ImmuneBuilder / ESMFold | 单体氨基酸序列 | 3D 结构（含骨架） | CDR3 / 多CDR / 框架改变 |
| Q2 | **折叠后的侧链在抗原界面能塞进去吗？** | EvoEF2 BuildMutant + fast_clash_check | WT复合物 PDB + 突变列表 | 重打包后的复合物 PDB + clash count | **始终运行** |
| Q3 | **侧链塞进去后，结合模式正确吗？能量有多少？** | HADDOCK3 / MM/GBSA | 复合物 PDB | ΔG_bind, epitope map | 15-param eval; CDR3需HADDOCK3 |

**关键约束：**
- ImmuneBuilder **不能**回答 Q2（它在真空中预测，不知道抗原存在）
- EvoEF2 **不能**回答 Q1（它不预测骨架）
- PRODIGY **不能**用于最终排名（精度不够；V4.0 起已废弃）
- HADDOCK3 只在 CDR3/多CDR 或 Phase 4 路由时启动（算力太贵用于常规筛选）

**场景速查表：**

| 设计范围 | Q1 ImmuneBuilder | Q2 EvoEF2 Clash | Q3 对接/能量 |
|---------|:-------:|:-------:|:-------:|
| 单 CDR2（≤10 突变，框架固定） | SKIP | **必须** | MM/GBSA (15-param) |
| 单 CDR1 或 CDR2（>10 突变）| RUN | **必须** | MM/GBSA (15-param) |
| 含 CDR3 的任何设计 | **必须** | **必须** | **HADDOCK3 必须** |
| 多 CDR（CDR1+2+3）| **必须** | **必须** | **HADDOCK3 必须** |
| 框架区改造 | **必须** | **必须** | **HADDOCK3 必须** |

---

## 3. 自动化管线全景图 (V5.0 Pipeline Architecture)

```
输入: WT 复合物 PDB + CDR 设计掩码 (mask_strategy.json)
         │
         ▼
  ┌─────────────────┐
  │ MPNN V2 生成    │  T=[0.3,0.5,0.8,1.0], N=150/T, bias_AA PTM 惩罚
  └────────┬────────┘
           │ ~600 条原始序列
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T0.0: 精确去重 + PTM/化学修饰门控  (<1 秒, 必须首先)  │
  │  • 精确去重（去掉 ~60-82% 重复）                      │
  │  • N-G/D-G CDR 区域 → FAIL                          │
  │  • N-X-S/T 新糖基化位点 → FAIL                       │
  │  • D-A/D-S/D-T CDR 区域 → FAIL                      │
  │  • 正则 Cys 缺失 → FAIL                              │
  └────────┬────────────────────────────────────────────┘
           │ ~25-30% 通过 (纯化学可行序列)
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T0: OASis 9-mer 人源性覆盖率                         │
  │  coverage >= WT × 0.80 AND CDR identity < 0.70      │
  └────────┬────────────────────────────────────────────┘
           │ ~30% 通过
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T1: AbLang 自然度  [条件运行 — §9 路由决策]           │
  │  仅当: 多CDR设计 OR CDR3 OR 框架区改变               │
  │  SKIP: 单CDR非CDR3设计 (通过率100%, 无过滤效果)       │
  └────────┬────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T0.5: Hamming 聚类去冗余                             │
  │  保留 15-50 个代表性序列                              │
  └────────┬────────────────────────────────────────────┘
           │ 15-50 条候选
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ T2: ImmuneBuilder 折叠质控 [条件运行 — §9 路由决策]   │
  │  运行: CDR3 / 多CDR / >10位点 / 框架改变              │
  │  SKIP: 单CDR2 ≤10位点 + 框架固定 (RMSD恒<1.5 Å)     │
  │  ★ 仅回答 Q1："这条序列能折叠吗？"                    │
  │  ★ 不能回答 Q2/Q3（它不知道抗原存在）                  │
  └────────┬────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────────┐
  │ T1.5: EvoEF2 结合界面物理门控 [V5.0 新增 — 始终运行]    │
  │  ★ 仅回答 Q2："侧链在抗原界面能塞进去吗？"              │
  │  流程:                                                  │
  │    1. EvoEF2 BuildMutant (在复合物环境重打包侧链, ~2s)   │
  │    2. Bio.PDB vdW clash count (overlap > 0.4 Å)         │
  │    3. 表位重叠度 vs WT (5 Å contact set)                │
  │  门控: clash_count ≤ 0 AND epitope_overlap ≥ 0.70       │
  │  实测: 27 候选 → 26 PASS / 1 FAIL (0.46Å overlap)      │
  │  速度: ~2s/条 (vs ImmuneBuilder ~3min/条)               │
  └────────┬───────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ 多目标打分排名                                        │
  │  S_seq(专利多样性) + S_struct(结构保守) +             │
  │  S_nat(AbLang) + S_oasis + S_cmc + S_ag              │
  └────────┬────────────────────────────────────────────┘
           │ Top 5 候选
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ 15参数精细评估 (AffinityEnergyToolkit)               │
  │  EvoEF2, MM/GBSA (OpenMM), ThermoMPNN,              │
  │  AntiFold, ESM-IF1 — 与 WT 对比 ΔΔG                 │
  │  ★ 回答 Q3："结合模式对不对？能量多少？"               │
  └────────┬────────────────────────────────────────────┘
           ▼
  ┌─────────────────────────────────────────────────────┐
  │ Phase 4: 路由决策                                    │
  │  表位重叠 ≥ 70% + ΔG ≤ WT → 直接交付                │
  │  表位重叠 ≥ 70% + ΔG > WT → 触发 VAM               │
  │  表位重叠 < 70%            → 淘汰，回退 Phase 1       │
  │  CDR3 / 多CDR 设计 → 必须经 HADDOCK3 复合物对接      │
  └─────────────────────────────────────────────────────┘
```

---

## 4. 关键设计决策说明 (Key Design Decisions)

### 4.1 ROOT 位置：不应硬编码固定

**结论：ROOT 位置不应写入 MPNN mask 的 fixed_pdb_residues。**

依据（VGRW-SR-R2 观测）：
- MPNN 凭借其结构模型已自动将结构锚点固定（CDR2 C 端 10 个位点的突变率均为 0%）
- 将 ROOT 硬编码到 mask 中会**减少搜索空间**，从 17 个可变位点缩减到 5-7 个，限制多样性
- 真正的问题不是 MPNN 突变了 ROOT，而是 MPNN **不理解化学修饰风险**

**正确使用方式：**
1. 每个新项目运行一次 `_cdr2_root_analysis.py` 分析结构
2. 将结果输出到 `config/cdr_root_analysis.json`（包含 `root_positions_linear` 和 `conservative_map`）
3. 该文件由 **T0.0 QC 门控读取**（`sequence_liability_qc.py`），用于发出 WARNING 当 ROOT 位置被突变
4. 不需要写入 MPNN mask

### 4.2 T0.0 PTM 门控：为何必须是第一道门控

在 VGRW-SR-R2 项目中：
- 400 条序列中 **292 条（73%）因 PTM 失败 QC**
- 失败发生在 lin 51+52（Y57→D/N，P58→A）创造了 DA 异构化或 NAS 糖基化位点
- 这 292 条序列中有许多通过了 T0 OASis 和 T1 AbLang，进入了 T2 ImmuneBuilder
- **结果：81 分钟 ImmuneBuilder 计算全部浪费在注定失败的分子上**

PTM 检查的计算代价：**400 条序列 <1 秒**。必须首先执行。

### 4.3 条件运行 ImmuneBuilder（仅回答 Q1）

| 设计范围 | RMSD 预期 | ImmuneBuilder 价值 | 决策 |
|---------|----------|-------------------|------|
| 单 CDR2（≤10 位点），框架固定 | <1.5 Å | 零 | SKIP |
| CDR1+CDR2 双 CDR | 1.5-3.0 Å | 中 | RUN |
| 含 CDR3 的任何设计 | 0.5-5.0+ Å | 高 | RUN |
| 框架区工程化 | 不可预测 | 必须 | RUN |

### 4.4 T1.5 EvoEF2 结合界面物理门控（回答 Q2）— V5.0 新增

**规则：T1.5 始终运行。无条件。**

| 项目 | 值 |
|------|---|
| 工具 | EvoEF2 `BuildMutant` → `core/evaluation/fast_clash_check.py` |
| 代价 | ~2 秒/条（CPU，串行） |
| 输入 | WT 复合物 PDB（需去除 H 原子） + 突变列表 |
| 输出 | clash_count, clash_severity, epitope_overlap, volume_score |

**为什么不能用 ImmuneBuilder 代替 T1.5？**

| 对比 | ImmuneBuilder | EvoEF2 BuildMutant |
|------|-------------|-------------------|
| 预测环境 | 单体（真空） | 复合物（含抗原） |
| 侧链约束 | 无（抗原不存在） | 有（抗原原子参与能量函数） |
| 骨架 | 重新预测（CDR2-only 时完全多余） | 保持 WT 骨架（正确，因为 CDR2 骨架不动） |
| 速度 | ~3 min | ~2 s |
| 物理正确性 | 低（诱导契合无法体现） | 高（rotamer 在抗原约束下优化） |

**V5.0 原则：T1.5 是 Q2 的唯一正确答案。ImmuneBuilder 只负责 Q1。两者不互替。**

**门控阈值：**

| 门控 | 阈值 | 依据 |
|------|------|------|
| clash_count | ≤ 0 | 任何 vdW overlap > 0.4 Å 意味着侧链无法物理容纳 |
| epitope_overlap | ≥ 0.70 | 低于 70% 表示结合足迹已偏移 |
| volume_score (Level-0) | VOL_LARGE (≥80 Ų) → FAIL | 无需结构即可识别的超大侧链 |

**实测数据（VGRW-SR-R2, 27 候选, CDR2-only）：**
- 26/27 PASS (zero clash, epitope 80-100%)
- 1/27 FAIL: denovo_0272 (1 clash pair, 0.46 Å overlap)
- 10/27 实现 100% 表位保留（全部 15 个 HER2 接触残基不变）
- 总计 38.9 秒 vs ImmuneBuilder ~66 分钟

### 4.5 MPNN 采样 V2：为何提高温度

旧版 T=[0.2, 0.3, 0.5]：
- MPNN 在低温下给出"高置信度"输出，每次采样都几乎相同
- 400 条序列中只有 73 条唯一 CDR2（18% 多样性）
- 5 个有效突变位点各自只有 1-2 个氨基酸选择

新版 T=[0.3, 0.5, 0.8, 1.0]：
- 更高熵，更宽的氨基酸选择分布
- 配合精确去重，相同样本量可得到更多真正多样的候选
- 配合 `bias_AA_per_residue` 的 PTM 惩罚，避免熵增带来的化学毒性

---

## 5. 门控阈值表 (V5.0 Gate Thresholds)

### 5.1 T0.0 — 化学修饰前置过滤（必须首先，始终运行）

| 检查项 | 判断标准 | 等级 | 备注 |
|-------|---------|------|------|
| 精确去重 | 序列完全相同 | 去除 | 节省所有下游计算 |
| 新 NG 脱酰胺（CDR 区） | CDR 中出现新 N-G motif | **FAIL** | 最不稳定的脱酰胺位点 |
| 新 NA/NS/NT 脱酰胺（CDR 区） | CDR 中出现新 N-A/S/T motif | WARN | 中等风险，标记但不淘汰 |
| 新异构化（CDR 区） | CDR 中出现新 D-G/A/S/T | **FAIL** | DA 最常见（VGRW-SR-R2 46.8% 失败） |
| 新 N-糖基化 | N-X-S/T（X≠P）vs WT | **FAIL** | 糖基化影响药代动力学 |
| 正则 Cys 缺失 | C21/C95（VHH）或 C22/C92（VH）消失 | **FAIL** | 破坏二硫键 |
| 新 Cys | 出现新的半胱氨酸 | **FAIL** | 不成对 Cys 影响折叠/聚集 |

**工具：** `core/evaluation/sequence_liability_qc.py`（纯正则表达式，~ms）

### 5.2 T0 — 人源性与专利多样性

| 门控 | 工具 | 阈值 | 等级 |
|------|------|------|------|
| OASis 9-mer 覆盖率 | promb (human-oas) | ≥ WT × 0.80 | FAIL |
| CDR 身份比 vs WT | 序列比对 | < 0.70 | FAIL |

### 5.3 T1 — AbLang 自然度（**条件运行**）

**运行条件：** 多 CDR 设计 OR 含 CDR3 OR 框架区改变

**跳过条件：** 单 CDR（非 CDR3），框架固定 → 100% 通过率，无过滤效果

| 门控 | 工具 | 阈值 |
|------|------|------|
| 自然度 pseudo-logP | AbLang heavy | ≥ WT score × 1.5 |

### 5.4 T2 — ImmuneBuilder 折叠质控（**条件运行，仅 Q1**）

**运行条件：** 多 CDR OR 含 CDR3 OR 可变位点 >10 OR 框架改变 OR MPNN 最高温度 ≥ 1.0

**跳过条件：** 单 CDR2 ≤10 位点 + 框架固定（预测 RMSD 始终 <1.5 Å）

| 门控 | 阈值 |
|------|------|
| 全局骨架 RMSD | ≤ 2.5 Å |
| CDR 局部 RMSD（被设计 CDR） | ≤ 3.0 Å |

### 5.5 T1.5 — EvoEF2 结合界面 Clash（**始终运行，Q2**）

见 §4.4。阈值：`clash_count ≤ 0`，`epitope_overlap ≥ 0.70`。

**工具：** `core/evaluation/fast_clash_check.py`（`FastClashChecker` 类 + `from_mask_json()` 工厂函数）

### 5.6 最终评估 — 15 参数（始终运行，作用于 Top 5）

| 参数 | 工具 | 方向 |
|------|------|------|
| P1. CDR 序列多样性 vs WT | Hamming | 越高越好（专利逃逸） |
| P2. 全局序列身份 vs WT | 序列比对 | — |
| P3. 全局结构 RMSD | ImmuneBuilder/BioPDB | 越低越好 |
| P4. CDR 局部 RMSD | ImmuneBuilder/BioPDB | 越低越好 |
| P5. AbLang 自然度 | AbLang | 越高越好 |
| P6. OASis 覆盖率 | promb | 越高越好 |
| P7. EvoEF2 ΔΔG_bind | EvoEF2 | 越低越好（ΔΔG<0=有益） |
| P8. MM/GBSA ΔΔG_bind | OpenMM（500步）| 越低越好（替代 PRODIGY） |
| P9. 表位重叠度 | 5Å 接触残基集合 | ≥ 0.70 |
| P10. ThermoMPNN ΔΔG_fold | ThermoMPNN | 越低越好 |
| P11. AntiFold logP | AntiFold | 越高越好 |
| P12. ESM-IF1 logP | ESM-IF1 | 越高越好 |
| P13. pI | ProtParam | 6.5-8.5 甜区 |
| P14. 不稳定性指数 | ProtParam | <45 合格，<40 优选 |
| P15. 疏水斑块（9-mer）| KD 滑动窗口 | <2.5 合格 |

---

## 6. MPNN V2 采样规范

### 6.1 采样参数

| 参数 | V3.0 | V4.0 | 变更原因 |
|------|------|------|---------|
| 温度 | [0.2, 0.3, 0.5] | **[0.3, 0.5, 0.8, 1.0]** | 旧版 82% 冗余；高温提高多样性 |
| 每温度样本数 | 200 | **150** | 配合更高温度，单位样本多样性更高 |
| 总样本数 | 400 (2T×200) | 600 (4T×150) | 但去重后有效序列更多 |
| 立即去重 | 否 | **是（MPNN输出后立即）** | 避免对重复序列计算 T0 OASis |
| bias_AA_per_residue | 无 | **PTM 位置惩罚** | D:-1.5, N:-1.0 在 TIP 位置 |

### 6.2 PTM 惩罚设置

在 CDR **TIP 位置**（非 ROOT 的可设计位置）对以下氨基酸施加 logit 惩罚：

```json
{
  "D": -1.5,
  "N": -1.0
}
```

**原理：** MPNN 生成的 D/N 本身无害，但当相邻位点为 G/A/S/T 时会形成 PTM 热点。由于 MPNN 无法预知相邻氨基酸的化学后果，在已知高风险位置降低 D/N 的先验概率是合理的预防措施。

**工具：** `projects/_template/helpers/mpnn_sampling.py`（`MPNNSampler` 类）

### 6.3 ROOT 位置处理

- **不**在 MPNN mask 中固定 ROOT 位置
- 可选：对 ROOT 位置施加保守偏置（favored AA set，通过 `conservative_map` 配置）
- ROOT 位置的突变通过 T0.0 QC 发出 WARNING，而非 FAIL（保守替换允许）
- 运行 `_cdr2_root_analysis.py` 生成 `config/cdr_root_analysis.json` 供 T0.0 读取

---

## 7. 多 CDR / CDR3 扩展管线 — V5.0 新增

### 7.1 CDR3 为什么特殊

| CDR | 长度 | 构型 | 骨架灵活性 | MPNN 覆盖 | ImmuneBuilder 必要性 |
|-----|------|------|----------|----------|-------------------|
| CDR1 | ~10 aa | β-turn，两端被 β-sheet 锚定 | 极低 | 好 | 通常不需要 |
| CDR2 | ~17 aa | flat loop，β-strand 延伸 | 低 | 好 | 单 CDR 不需要 |
| CDR3 | 6-24 aa | **顶端游离，长度可变** | **极高** | 骨架不可靠 | **必须** |

CDR3 特殊性：
- 长度变化 = 新拓扑结构（MPNN 无法预知）
- 可能形成新二硫键（VHH CDR3 特有的 Hallmark）
- 与 CDR1 有直接空间接触（VHH 特有）
- MPNN 生成的 CDR3 骨架构型**无法从 WT 直接推断**

### 7.2 含 CDR3 的管线流程（必须步骤增加）

```
MPNN (multi-CDR, T=[0.3, 0.5, 0.8, 1.0])
  ↓
T0.0: 精确去重 + PTM 门控          [<1s — 去掉化学废物]
  ↓
T0:   OASis 人源性覆盖率           [~2 min]
  ↓
T1:   AbLang 自然度                [~10 min — 多CDR时必须运行]
  ↓
T0.5: Hamming 聚类去冗余           [<1s]
  ↓
T2:   ImmuneBuilder 折叠质控       [~3 min/条 — Q1: 能折叠吗？]
      → 全局 RMSD ≤ 2.5 Å
      → CDR3 局部 RMSD ≤ 4.0 Å
      ★ 此时仍为单体预测。侧链在真空中。
  ↓
T1.5: EvoEF2 侧链 Clash            [~2s/条 — Q2: 侧链能塞进界面吗？]
      ★ 注意：对于 CDR3 骨架大幅偏移的候选，
        EvoEF2 BuildMutant 效力有限（仅 repack 侧链，不调骨架）。
        需配合 HADDOCK3 进行后续验证。
  ↓
HADDOCK3 复合物对接               [~30-60 min/条 — Q3: 结合姿态和能量]
      ★ 含 CDR3 时必须。刚性叠合不再可靠。
      ★ 让新 CDR3 在抗原表面重新寻找正确结合姿态。
  ↓
15-param 评估 + Final Rank
```

**关键区别 vs 基础管线（单 CDR2）：**
- T1 AbLang：**必须运行**（多 CDR 自然度可能下降）
- T2 ImmuneBuilder：**必须运行**（CDR3 骨架不可预知）
- HADDOCK3：**必须运行**（替代刚性叠合的 epitope_overlap）
- T1.5 EvoEF2 Clash：仍然运行，但其价值主要在 CDR1/CDR2 部分

### 7.3 VH/VL 多 CDR 抗体设计：同心圆策略

针对 VH/VL 抗体，必须采用**由内向外的同心圆成对重写**策略：

1. **循环 1：核心区（H3 + L3）**
   - 固定框架、H1/L1、H2/L2
   - MPNN 掩码生成 H3/L3
   - 同时运行 ImmuneBuilder + HADDOCK3（CDR3 包含在设计中）

2. **循环 2：支撑区（H2 + L2）**
   - 锁定循环 1 产出的新 H3/L3
   - 条件运行 ImmuneBuilder；T1.5 Clash 始终运行

3. **循环 3：外围区（H1 + L1）**
   - 锁定所有内部 CDR
   - **可能跳过 ImmuneBuilder**（如 H1/L1 改变位点 ≤10 且框架固定）
   - T1.5 Clash 始终运行

### 7.4 HADDOCK3 集成规则

| 条件 | HADDOCK3 | 替代 |
|------|---------|------|
| 含 CDR3 重新设计 | **必须**（本地 WSL） | AF2-Multimer（Colab 手工上传） |
| 多 CDR 联合设计 | **必须** | AF2-Multimer |
| 单 CDR2 ≤10 突变 | 不需要 | EvoEF2 + MM/GBSA 足够 |
| Phase 4 路由需 VAM | 推荐 | MM/GBSA 最低保证 |

**HADDOCK3 运行环境：** WSL Ubuntu-22.04（本地可运行，无需上传）
**AF2-Multimer 运行环境：** Colab（需手工上传序列，自动化受限）

---

## 8. 工程鲁棒性规范 (Checkpointing & Resume)

所有关键循环步骤必须实现 append-only JSONL 检查点，每条序列计算完立即写入并 `flush()`。

### 项目目录结构 (V5.0)

```
projects/denovo_{target}_{date}/
├── project_manifest.json          # 全局状态清单
├── config/
│   ├── mask_strategy.json         # CDR 掩码定义
│   ├── denovo_ranking_weights.json
│   └── cdr_root_analysis.json     # 可选：结构分析输出（ROOT/TIP 分类）
├── phase1_generation/
│   ├── mpnn_raw_sequences.fasta   # MPNN 原始输出（含重复）
│   ├── mpnn_sampling_report.json  # 采样多样性统计
│   ├── t00_passed.fasta           # T0.0 后幸存序列
│   ├── t0_oasis_blast.jsonl       # T0 过滤记录
│   ├── t1_ablang_scores.jsonl     # T1 记录（可选）
│   └── t05_clustered.fasta        # 聚类后幸存序列
├── phase2_structure/
│   ├── structures/                # ImmuneBuilder PDB 文件（条件生成）
│   ├── t2_monomer_qc.jsonl        # T2 结构门控记录
│   ├── t2_skip_log.jsonl          # T2 跳过记录（条件运行时）
│   └── t15_interface_gate.jsonl   # T1.5 Clash 门控记录（V5.0）
├── phase3_complex/
│   └── t3_complex_qc.jsonl
├── reports/
│   ├── t00_ptm_gate.json          # T0.0 完整 QC 结果（V5.0）
│   ├── t15_interface_gate_report.json  # T1.5 Clash 完整报告（V5.0）
│   ├── denovo_multi_objective_rank.json
│   ├── comprehensive_15param_eval.json
│   └── final_recommendation.md
├── pipeline_v2_status.json        # 全步骤 checkpoint 状态（V5.0）
└── run_all_v2.py                  # V2 自动化管线入口
```

---

## 9. 自动路由决策引擎 (Adaptive Routing Engine) — V5.0 新增

管线不再使用"一刀切"固定流程。启动时读取 `mask_strategy.json`，自动判断启用哪些步骤。

### 9.1 完整决策树

```python
def route_pipeline(mask: dict, settings: dict) -> dict[str, bool]:
    """
    根据项目 mask_strategy.json 自动决定每个步骤是否运行。
    返回 {step_id: should_run}。
    """
    dm            = mask["design_mask"]
    redesign_cdrs = dm.get("redesign_cdrs", [])
    n_positions   = len(dm.get("designable_pdb_residues", []))
    fix_framework = dm.get("fix_framework", True)
    has_cdr3      = "CDR3" in redesign_cdrs
    multi_cdr     = len(redesign_cdrs) >= 2
    temps         = settings.get("mpnn", {}).get("temperatures", [0.5])

    return {
        # 始终运行（无条件）
        "mpnn_generate":   True,
        "t00_ptm_gate":    True,
        "t0_oasis":        True,
        "t05_cluster":     True,
        "t15_clash":       True,      # V5.0: EvoEF2 Clash 始终运行
        "multi_rank":      True,
        "eval15":          True,
        "final_rank":      True,

        # 条件运行
        "t1_ablang":       (multi_cdr or has_cdr3 or not fix_framework),
        "t2_immunebuilder": (
            not fix_framework
            or has_cdr3
            or multi_cdr
            or n_positions > 10
            or max(temps) >= 1.0
        ),
        "haddock3":        (has_cdr3 or multi_cdr),
    }
```

### 9.2 五种典型场景

| 场景 | 示例 | T1 | T2 | T1.5 | HADDOCK3 | 预计总耗时 |
|------|------|:---:|:---:|:----:|:--------:|-----------|
| A: 单 CDR2 ≤10 突变 | VGRW-SR-R2 | SKIP | SKIP | ✓ | × | ~60 min |
| B: 单 CDR1/CDR2 >10 突变 | 高温采样 | SKIP | ✓ | ✓ | × | ~120 min |
| C: 含 CDR3 单环 | CDR3 patent escape | ✓ | ✓ | ✓ | ✓ | ~4-6 h |
| D: 多 CDR（如 CDR1+CDR3） | 联合重写 | ✓ | ✓ | ✓ | ✓ | ~6-12 h |
| E: 框架+CDR 全面改造 | De novo scaffold | ✓ | ✓ | ✓ | ✓ | ~12-24 h |

### 9.3 决策函数详解

```python
def need_structure_prediction(mask: dict, settings: dict) -> bool:
    """Q1: 需要 ImmuneBuilder 吗？"""
    dm = mask["design_mask"]
    if not dm.get("fix_framework", True):  return True   # 框架变了
    if "CDR3" in dm["redesign_cdrs"]:      return True   # CDR3 骨架不确定
    if len(dm["redesign_cdrs"]) >= 2:      return True   # 多 CDR 协同
    if len(dm.get("designable_pdb_residues", [])) > 10:
                                           return True   # 大量突变
    if max(settings.get("mpnn",{}).get("temperatures",[0.5])) >= 1.0:
                                           return True   # 高熵采样
    return False

def need_ablang(mask: dict) -> bool:
    """需要 T1 AbLang 吗？"""
    dm = mask["design_mask"]
    if not dm.get("fix_framework", True):  return True
    if "CDR3" in dm["redesign_cdrs"]:      return True
    if len(dm["redesign_cdrs"]) >= 2:      return True
    return False

def need_haddock3(mask: dict) -> bool:
    """Q3: 需要 HADDOCK3 全对接吗？"""
    dm = mask["design_mask"]
    if "CDR3" in dm["redesign_cdrs"]:      return True   # CDR3 骨架移位，刚性叠合无效
    if len(dm["redesign_cdrs"]) >= 2:      return True   # 多 CDR 重排
    return False
```

---

## 10. 工具清单与环境配置 (V5.0)

| 工具 | 物理问题 | 用途 | 环境 | 条件 |
|------|---------|------|------|------|
| ProteinMPNN | — | CDR 序列生成（V2 设置） | `tools/ProteinMPNN/` | 必须 |
| sequence_liability_qc.py | — | T0.0 PTM 化学修饰门控 | 任意 Python 3.10+ | 必须，首先 |
| OASis (promb) | — | 9-mer 人源性覆盖率 | `anarcii` env | 必须 |
| AbLang | — | 自然度打分 | `affmat` env | 条件（§9） |
| ImmuneBuilder | **Q1 折叠** | VHH/Ab 单体折叠质控 | `anarcii` env | 条件（§9） |
| **fast_clash_check.py** | **Q2 界面** | EvoEF2 侧链 repack + vdW clash | `affmat` env | **始终** (V5.0) |
| EvoEF2 | Q2 + Q3 | BuildMutant + ΔΔG_bind | `affmat` env | 始终 |
| OpenMM MM/GBSA | **Q3 能量** | ΔΔG_bind（精确，替代PRODIGY）| `affmat` env | 15-param |
| ThermoMPNN | Q3 稳定性 | ΔΔG_fold 稳定性 | `affmat` env | 15-param |
| AntiFold | Q3 适应度 | 逆折叠适应度 | `affmat` env | 15-param |
| ESM-IF1 | Q3 适应度 | 逆折叠适应度 | `affmat` env | 15-param |
| **HADDOCK3** | **Q3 对接** | 复合物对接（CDR3/多CDR 必须）| WSL Ubuntu-22.04 | 条件（§9） |
| AF2-Multimer | Q3 对接 | 复合物结构预测（Colab 手工） | Google Colab | 可选替代 |
| ~~PRODIGY~~ | ~~Q3~~ | ~~结合能~~ | — | **已废弃**（V4.0 起）|

---

## Appendix A: 条件运行决策函数 (Decision Logic) — 已移至 §9

```python
def need_structure_prediction(mask: dict, settings: dict) -> bool:
    """
    Returns False for single non-CDR3 CDR with ≤10 mutable positions
    and fixed framework. ImmuneBuilder RMSD will always be <1.5 Å.
    Lesson: VGRW-SR-R2 27/27 pass (100%), max RMSD 1.36 Å / 2.5 Å limit.
    """
    dm            = mask["design_mask"]
    redesign_cdrs = dm.get("redesign_cdrs", [])
    n_positions   = len(dm.get("designable_pdb_residues", []))
    fix_framework = dm.get("fix_framework", True)
    temps         = settings.get("mpnn", {}).get("temperatures", [0.5])

    if not fix_framework:          return True   # framework changes → unpredictable
    if "CDR3" in redesign_cdrs:    return True   # CDR3 is conformationally variable
    if len(redesign_cdrs) >= 2:    return True   # inter-CDR cooperativity
    if n_positions > 10:           return True   # extensive mutations
    if max(temps) >= 1.0:          return True   # high-entropy sampling
    return False


def need_ablang(mask: dict) -> bool:
    """
    Returns False for single-CDR non-CDR3 with fixed framework.
    Lesson: VGRW-SR-R2 T1 score range -0.41 to -0.32 (very narrow). 0% kill rate.
    """
    dm            = mask["design_mask"]
    redesign_cdrs = dm.get("redesign_cdrs", [])
    fix_framework = dm.get("fix_framework", True)

    if not fix_framework:          return True
    if "CDR3" in redesign_cdrs:    return True
    if len(redesign_cdrs) >= 2:    return True
    return False
```

**工具：** `projects/_template/run_pipeline.py` 和 `projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py` 包含上述函数的完整实现。

---

## Appendix B: 预期算力节省（V5.0 vs V3.0）

以单 CDR2 VHH 设计（≤10 位点，框架固定）为例：

| 步骤 | V3.0 | V5.0 | 节省 |
|------|------|------|------|
| MPNN 冗余（82%重复） | ~5 min | ~3 min | ~2 min |
| T0.0 PTM（不存在→事后发现） | 0 min | <1 s | 阻止下游浪费 |
| T1 AbLang（100%通过） | ~10 min | SKIP | **10 min** |
| T2 ImmuneBuilder（100%通过） | ~81 min | SKIP | **81 min** |
| T1.5 EvoEF2 Clash（新增） | 不存在 | +39 s | 发现 1/27 clash |
| T3 PRODIGY（精度不足） | ~15 min | SKIP→MM/GBSA | **15 min** |
| **总计** | **~169 min** | **~62 min** | **~107 min (63%)** |

**节省 63% 算力，输出质量更好**（PTM 淘汰 + Clash 淘汰 + 侧链在复合物环境中更正确）。

---

## Appendix C: 常见 PTM 陷阱与规避

| PTM 类型 | Motif | CDR 位置风险 | 规避策略 |
|---------|-------|------------|---------|
| 脱酰胺（Deamidation） | N-G（最快）, N-S, N-T, N-A | 任何 CDR | bias_AA 惩罚 N；T0.0 门控 |
| 天冬氨酸异构化（Isomerization） | D-G, D-S, D-T, D-A | 任何 CDR | bias_AA 惩罚 D；T0.0 门控 |
| N-糖基化 | N-X-S/T（X≠P） | 整体序列 | T0.0 门控 |
| 甲硫氨酸氧化 | M（暴露位置） | CDR TIP | WARN；可接受保守替换 |
| 色氨酸氧化 | W（CDR TIP） | CDR2 TIP | WARN；结合位点不建议替换 |

**VGRW-SR-R2 根因分析：**
- Y57（lin 51）→ D/N（99.8%突变）
- P58（lin 52）→ A（99.2%突变）
- 两者组合：D+A → DA 异构化（FAIL）；N+A+S_next → NAS 糖基化（FAIL）
- 397/400 序列受影响
- **解决方案：** bias_AA 在 lin 51 位置惩罚 D（-1.5）和 N（-1.0）

---

## Appendix D: V5.0 运行命令速查

```bash
# 场景 A（单 CDR2 ≤10 突变）— 全自动 ~62 分钟
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py

# 查看当前进度
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py --list

# 从某步重新开始
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py --from t15_clash

# 仅运行某个步骤
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/run_all_v2.py --step t00_ptm_gate

# 单独运行 T1.5（全部聚类候选）
conda run -n affmat python projects/denovo_HER2_VGRW_SR_R2/t15_interface_gate.py --all_clustered

# Ctrl+C 中断后，重新运行同一命令即可从断点续算
```

---

*Document Version: 5.0*
*Date: 2026-04-03*
*Author: InSynBio AI Research (VGRW-SR-R2 case data + multi-CDR design discussion)*
*Supersedes: V4.0 (2026-04-03)*
*Evolution Log: APPROVED entry 2026-04-03 — owner instruction "你来总结定规矩吧"*
