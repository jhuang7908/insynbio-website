# Virtual Affinity Maturation Standard — V1.2

**AbEngineCore Module** | **Version:** 1.2 | **Date:** 2026-04-02  
**Status:** ACTIVE — V1.2 adds 2D decision matrix, AF structure stratification, Scenario B/A updates, BioChatter Phase -1  
**Applies to:** All virtual affinity maturation projects (VH/VL, VHH, short peptide, protein antigen)

---

## 1. 系统概述

虚拟亲和力成熟系统（Virtual Affinity Maturation, VAM）通过计算方法预测 CDR 单点或组合突变对抗体-抗原结合亲和力的影响（ΔΔG），筛选出高置信候选突变，减少实验验证量。

### 核心原则

1. **多结构优于多工具** — 在 2-6 个不同来源的结构上计算 ΔΔG，比在 1 个结构上叠加 6 个工具更可靠
2. **工具按功能分层** — 结合能工具、稳定性工具、序列适配工具各司其职，不可混用排名
3. **结构质量是天花板** — 结构坐标误差 >2 Å 时，任何 ΔΔG 计算都不可信
4. **场景驱动选择** — 按抗原大小和抗体形式选择工具组合，没有万能方案

---

## 2. 工具链

### 2.1 工具清单与安装位置

| 工具 | 版本 | 安装位置 | Python 调用 | 功能分类 |
|------|------|---------|------------|---------|
| **EvoEF2** | 2020 | `tools/EvoEF2_src/EvoEF2.exe` | `AffinityEnergyToolkit.run_evoef2()` | 结合能 (Tier-1) |
| **PRODIGY** | 2.4.0 | pip: `prodigy-prot` | `AffinityEnergyToolkit.run_prodigy()` | 结合能 (Tier-1) |
| **OpenMM MM/GBSA** | 8.5.0 | pip: `openmm` | `AffinityEnergyToolkit.run_mmgbsa()` | 结合能 (Tier-3) |
| **ThermoMPNN** | GitHub | `tools/ThermoMPNN/` | `AffinityEnergyToolkit.run_thermompnn()` | 稳定性否决 |
| **AntiFold** | 0.3.1 | `tools/AntiFold/` | `AffinityEnergyToolkit.run_antifold()` | 序列适配 |
| **ESM-IF1** | fair-esm 2.0 | pip: `fair-esm` | `AffinityEnergyToolkit.run_esm_if1()` | 序列适配 |
| **HADDOCK3** | 2026.3.0 | WSL Ubuntu-22.04: `haddock3` | CLI via WSL | 结构精修 |
| **AF2-Multimer** | v3 | ColabFold 外部 | 外部提交 | 结构预测 |

### 2.2 统一 API

```python
from core.structure.affinity_energy_toolkit import AffinityEnergyToolkit

tk = AffinityEnergyToolkit(
    complex_pdb="path/to/complex.pdb",
    ab_chains=["H", "L"],   # VH, VL chain IDs
    ag_chains=["A"],         # antigen chain ID(s)
)

# 单突变
mutation = [{"chain": "H", "resi": 99, "wt": "Y", "mut": "A"}]

result = tk.run_evoef2(mutation)       # ~1s,   returns {"ddg": float, ...}
result = tk.run_prodigy(mutation)      # ~4s,   returns {"ddg": float, "dg": float, ...}
result = tk.run_mmgbsa(mutation)       # ~3min, returns {"ddg": float, ...}
result = tk.run_thermompnn(mutation)   # ~6s,   returns {"ddg": float, ...}
result = tk.run_antifold(mutation)     # ~10s,  returns {"ddg": float, ...}
result = tk.run_esm_if1(mutation)      # ~20s,  returns {"ddg": float, ...}
```

### 2.3 CLI 接口

```bash
# 快速扫描（EvoEF2 + PRODIGY）
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb \
    --ab-chains H L --ag-chains A \
    --mutations H:Y99A H:K100R \
    --tools evoef2 prodigy

# 全工具扫描
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb \
    --ab-chains H L --ag-chains A \
    --mutations H:Y99A \
    --tools all
```

---

## 3. 场景分类与工具选择规则

### 3.1 场景判定（V1.2 二维决策矩阵）

**Step 1 — 主场景判定（轴1：抗原大小 + 抗体格式）**

```python
if antigen_length <= 30 and antibody_type == 'VHH':
    scenario = 'A-VHH'  # 短肽 + VHH（适用场景 A + 场景 C 双重规则）
elif antigen_length <= 30:
    scenario = 'A-VHL'  # 短肽 + VH/VL（六环联合扫描）
elif antibody_type == 'VHH':
    scenario = 'C'      # 蛋白抗原 + VHH
else:
    scenario = 'B'      # 蛋白抗原 + VH/VL
```

**Step 2 — 结构来源质量层级（轴2：structure_source_tier）**

| 来源 | 质量层级 | Phase 0 路径 | 附加要求 |
|------|----------|-------------|----------|
| 实验共晶 PDB | PDB_exp | 直接使用 | 分辨率 ≤ 2.5 Å，R-free ≤ 0.30 |
| AF2-Multimer ipTM > 0.75 | AF2_high | 多模型共识（≥ 3），HADDOCK3 可选 | pLDDT_interface > 70 |
| AF2-Multimer ipTM 0.60–0.75 | AF2_mid | HADDOCK3 精修推荐 | EvoEF2 结果需多结构交叉验证 |
| AF2-Multimer ipTM < 0.60 | AF2_low | HADDOCK3 精修强制 | 标注置信度警告，下游结果附不确定性说明 |
| AlphaFold 3（AF3） | AF3 | PAE 界面均值检查 | 界面 PAE < 10 Å²；不达标退回 HADDOCK3 |
| HADDOCK3 精修后 | HADDOCK3_refined | 直接使用 | 第一簇集中度 ≥ 60%；VHH 项目 Sampling ≥ 100 |

> **BioChatter 自动化入口**（InSynBio/Therasik 产品线）：上述两步由 Phase -1 BioChatter 自动完成，输出结构化 `{scenario, structure_tier, antibody_format, recommended_phase0_path}`，驱动后续 Phase 0 路径选择。


### 3.2 场景 A — 短肽抗原（≤30 aa）（V1.2 按抗体格式细分）

**典型靶标**: 线性表位、短肽-MHC、PAG1 类小分子肽

#### 3.2.1 子场景 A-VHH（短肽 + VHH 纳米抗体）

| 步骤 | 工具 | 作用 | 必要性 |
|------|------|------|--------|
| 结构获取 | AF2-Multimer → **HADDOCK3 精修**（Sampling ≥ 100） | 肽段柔性大，AF2 不够可靠；低采样产生假阳性界面 | **必须** |
| Tier-1 粗筛 | EvoEF2（全界面接触数 ≥ 3 的残基 × 19 AA） | PRODIGY 短肽无鉴别力；CDR3 为主扫描区 | **必须** |
| Tier-1 方向确认 | PRODIGY | 短肽无鉴别力 | **跳过** |
| Tier-2 稳定性 | ThermoMPNN（ΔΔG > +0.5 → 排除） | VHH 热稳定性至关重要 | **必须** |
| Tier-2 序列 | AntiFold（VHH 预训练）或 AbLang | 排除不自然序列 | 推荐 |
| Tier-3 精算 | MM/GBSA（500+ steps，每批含 WT 对照） | 最终候选确认 | **必须** |

**特殊规则（A-VHH）**:
- **Hallmark 位点 (Kabat 37/44/45/47) 绝不可突变**
- 带电残基突变 → EvoEF2 不可信，必须 MM/GBSA 验证
- 同时适用场景 C 的 EvoEF2 盲区规则和 Phase 4.5 双点验证

#### 3.2.2 子场景 A-VH/VL（短肽 + 传统 VH/VL 抗体）

| 步骤 | 工具 | 作用 | 必要性 |
|------|------|------|--------|
| 结构获取 | AF2-Multimer → **HADDOCK3 精修** | 肽段柔性大，AF2 界面精度不足 | **必须** |
| 扫描范围 | 六环联合分析（CDR-H1/H2/H3 + CDR-L1/L2/L3），以接触图谱决定实际扫描位点 | VH/VL 六环协同结合短肽 | **必须** |
| Tier-1 粗筛 | EvoEF2（界面接触数 ≥ 3 的残基 × 19 AA） | — | **必须** |
| Tier-1 方向确认 | PRODIGY | 短肽无鉴别力 | **跳过** |
| Tier-2 稳定性 | ThermoMPNN（ΔΔG > +0.5 → 排除） | VH/VL 折叠稳定性 | **必须** |
| Tier-2 序列 | AbLang（heavy + light 双链评分） | VH/VL 六链序列自然性评估 | 推荐 |
| Tier-3 精算 | MM/GBSA（500+ steps，每批含 WT 对照） | 最终候选确认 | **必须** |

**特殊规则（A-VH/VL）**:
- Vernier 位点（Kabat VH: 2/27/29/71/73/78/93/94；VL: 36/46/47/48/49/64/66/68/69/71）不建议突变
- 带电残基突变 → EvoEF2 不可信，必须 MM/GBSA 验证
- 六环中有 ≥ 2 个以上 CDR 参与结合时，考虑双 CDR 联合双点验证（Phase 4.5 逻辑）
- EvoEF2 |ΔΔG| > 5 kcal/mol → 可能是结构 artifact，标记为需多结构验证

**PAG1 实测数据支撑（A-VHH 参考）**:
- PRODIGY 36 突变 ΔΔG 范围仅 1.08–1.86 kcal/mol → 无鉴别力
- EvoEF2 vs MM/GBSA 一致率仅 40% → 需双工具交叉验证
- AntiFold/ESM-IF1 ΔΔG 范围 ±0.05 → 无法预测结合 ΔΔG

### 3.3 场景 B — 蛋白抗原（>30 aa）+ VH/VL 抗体（V1.2 同步 V1.1 改进）

**典型靶标**: PD-L1、EGFR、HER2、TNFα

| 步骤 | 工具 | 作用 | 必要性 |
|------|------|------|--------|
| 结构获取 | 按 §3.1 轴2 质量层级处理（PDB_exp 直接用；AF2_mid → HADDOCK3 推荐；AF2_low → HADDOCK3 强制；AF3 → PAE 检查） | 结构质量是 ΔΔG 计算的天花板 | **必须** |
| 结构预弛豫 | EvoEF2 --Optimize | 消除局部碰撞 | 推荐 |
| Tier-1 粗筛 | EvoEF2（**全界面接触数 ≥ 3 的残基 × 19 AA 穷举**） | 原'全 CDR × 19 aa'规则已更新；接触图谱决定扫描位点 | **必须** |
| Tier-1 补充 | ESM-2 全序列保守性扫描（接触数 < 3 的位点） | EvoEF2 对接触数=0 位点无分辨力 | 推荐 |
| Tier-1 确认 | PRODIGY | 接触计数法方向确认 | 推荐 |
| Tier-2 稳定性 | ThermoMPNN（ΔΔG > +0.5 → 强制排除） | 否决不稳定突变 | **必须** |
| Tier-2 序列 | AntiFold 或 AbLang（Δlog-lik/ΔlogP > 0.5 → 排除） | 序列可开发性过滤 | 推荐 |
| Tier-3 精算 | MM/GBSA（500 steps，**每批必须含 WT 对照**，批次间绝对值不可比较） | 最终排名；同批次内 ΔΔG 有效 | **必须** |
| 双点验证 | MM/GBSA 双点协同（Cβ–Cβ ≤ 25 Å 的 top 候选对，Phase 4.5） | 捕捉 Epistasis | 推荐 |
| 验证 | AF2-Multimer 重新预测突变序列 | ipTM 不应下降 >0.03 | 推荐 |

**场景 B 特殊规则（V1.2 新增）**:
- **扫描范围**：以界面接触图谱决定 EvoEF2 扫描列表（接触数 ≥ 3），不再用 CDR 定义限定范围
- **EvoEF2 盲区**：接触数=0 的 VH/VL 框架残基，EvoEF2 结果无效 → 改用 ESM-2 评估
- **MM/GBSA 批次规则**：每批同时计算 WT，ΔΔG 只在批次内比较；跨批次需 ≥ 3 次重复取均值
- **Vernier 位点**（VH: 2/27/29/71/73/78/93/94；VL: 36/46/47/48/49/64/66/68/69/71）突变需额外评估 VH/VL 界面稳定性

**预期精度**: EvoEF2 Pearson r ≈ 0.50–0.58, MM/GBSA r ≈ 0.55–0.70 vs SKEMPI2 实验值

### 3.4 场景 C — VHH 纳米抗体

**典型靶标**: 任何抗原 + VHH/sdAb

| 步骤 | 工具 | 作用 | 必要性 |
|------|------|------|--------|
| 结构获取 | AF2-Multimer (多模型取共识) 或 HADDOCK3 (Sampling ≥ 100，第一簇集中度 ≥ 60%) | VHH 结构精度高；低采样对接产生假阳性界面 | **必须** |
| Tier-1 粗筛 | EvoEF2（全界面接触数 ≥ 3 的残基 × 19 AA 穷举） | 仅扫 CDR3 将遗漏 CDR2/FR2 关键位点（实测：G49、E51 均为 CDR3 外位点） | **必须** |
| Tier-1 补充 | ESM-2 全序列保守性扫描（接触数 < 3 的变构/框架位点） | EvoEF2 对接触数=0 位点完全无分辨力，ESM-2 评估进化可替换性 | 推荐 |
| Tier-2 稳定性 | ThermoMPNN（ΔΔG > +0.5 → 强制排除） | VHH 热稳定性至关重要 | **必须** |
| Tier-2 序列 | AntiFold（VHH 预训练）或 AbLang（等效备选，Python 兼容性更好） | 排除不自然序列；AntiFold 不可用时用 AbLang | **必须** |
| CMC 预筛 | pI 快速估算（界面含 R/K ≥ 3 个时，Phase 3 前执行） | 避免对注定因 pI 超标失败的带电替换做无效精算 | 推荐 |
| Tier-3 精算 | MM/GBSA（500 steps，每批必须含 WT 对照，批次间绝对值不可比较） | 最终排名；同批次内 ΔΔG 相对排序有效 | **必须** |
| 双点验证 | MM/GBSA 双点协同（Cβ–Cβ ≤ 25 Å 的 top 候选对，见 Phase 4.5） | 捕捉 Epistasis：单点不利的突变组合后可能强协同 | 推荐 |

**VHH 特殊规则（V1.1 更新）**:
- **Hallmark 位点 (Kabat 37/44/45/47) 绝不可突变** — 这些位点维持 VHH 折叠
- **扫描范围扩展**：对所有界面接触数 ≥ 3 的残基（含 CDR1/CDR2/FR2 边界）做 19-AA 穷举扫描。原'CDR3 only'规则已撤销（VGRW-SR-R2 实战：G49 FR2、E51 CDR2 是最终候选，均在 CDR3 以外）
- **EvoEF2 盲区规则**：接触数 = 0 的残基（变构/内部框架）EvoEF2 无效 → 改用 ESM-2 进化扫描 + 直接 MM/GBSA，跳过 L1
- **正向 Epistasis 警示**：若两个 top 单点候选 Cβ–Cβ ≤ 25 Å，应进行双点验证——单点均不利时仍可能强协同（非加和项 < −5 kcal/mol 定义为强协同）
- 若抗原 ≤ 30 aa → 同时适用场景 A 的 HADDOCK3 精修规则
- 与 VHH humanization 联合评估：Framework 突变需同时检查 humanness + binding

---

## 4. 标准工作流（6 Phase）

```
PHASE -1（可选）— BioChatter 智能输入分类层
│  适用: InSynBio / Therasik 产品线接入 BioChatter 时启用
│  工具链: sequence_parser → structure_quality_analyzer → scenario_classifier
│
│  [自动分类] 从序列识别 antibody_type:
│    VHH 标志: Kabat 44=G, 45=L/M/V, 47=G/W（疏水核心缺失）
│    VH/VL 标志: 包含轻链序列，Kabat 44=G，含 VL 框架特征
│
│  [结构质量] 自动解析 AF2 JSON 提取 ipTM/pLDDT；解析 PDB header 提取分辨率/R-free；
│             AF3 PAE 矩阵提取界面 PAE 均值 → 输出 structure_source_tier（见 §3.1 轴2）
│
│  [实验数据预查询 P6] SKEMPI2/BindingDB 查询同源系统（同源度 ≥ 70%）已知突变数据;
│    若查到 ≥ 5 条同系统数据 → Phase 2 EvoEF2 结果旁附实验基准值
│    若查到当前扫描位点直接实验数据 → 跳过该位点的 EvoEF2/MM/GBSA，直接引用
│
│  [RAG 阈值校准 P7] PubMed/bioRxiv 检索该抗原系统工具精度报告;
│    输出系统特异性阈值建议（如'EvoEF2 在 anti-HER2 VHH r≈0.45，建议 L1 阈值调至 −0.8'）
│
│  输出: {scenario, structure_tier, antibody_format, skempi_hits, threshold_calibration}
│
PHASE 0 — 场景分类 + 质量门
│  输入: 抗体序列 + 抗原序列 + 复合体结构（或 Phase -1 输出）
│  判定: antigen_length + antibody_type → §3.1 二维矩阵场景分类
│  质量门: ipTM > 0.6, pLDDT_interface > 65, BSA > 500 Å²
│  对接收敛门（HADDOCK3）: 第一簇集中度 ≥ 60%；VHH 项目 Sampling ≥ 100
│  AF3 专用门: 界面 PAE 均值 < 10 Å²（不达标 → HADDOCK3 精修）
│  若不达标 → HADDOCK3 精修（增大 Sampling）或获取实验结构
│
├── PHASE 1 — Alanine Scan 热点定位
│   工具: EvoEF2
│   范围: 全部 CDR 界面残基 → Ala
│   输出: 热点位点 (ΔΔG_Ala > +1.0 kcal/mol)
│   耗时: ~2 min
│
├── PHASE 2 — 全氨基酸粗筛
│   工具: EvoEF2 [+ PRODIGY (场景 B/C)]
│   范围: 热点位点 × 19 种氨基酸 (~100-200 突变)
│   筛选: ΔΔG < −0.5 保留, ΔΔG > +2.0 排除
│   输出: 30-80 候选
│   耗时: ~15 min
│
│   [V1.1 盲区注意] 接触数=0 的变构/框架位点，EvoEF2 无效 → 进入 Phase 2.5 ESM-2 路线
│
├── PHASE 2.5（可选）— ESM-2 全序列进化保守性扫描
│   适用: 接触数 < 3 的框架区/变构位点（EvoEF2 L1 结果不可信时）
│   工具: ESM-2（fair-esm，masked logP，conda: affmat）
│   范围: 全序列 × 19 AA（VHH 120aa → 2280 评估点）
│   阈值: ΔlogP > −3 的位点纳入候选（保守度较低，可耐受替换）
│   输出: ΔlogP 热点图；与 EvoEF2 结果取并集后进入 Phase 3
│   耗时: ~5–10 min（ESM-2 8M/150M，CPU 可运行）
│
│   [V1.1 pI 预筛] 若界面 R/K 残基 ≥ 3 个，Phase 2 完成后立即预估 pI 偏移，对 pI 偏移 > 0.5 的候选提前排除
│
├── PHASE 3 — 稳定性 + 序列过滤
│   工具: ThermoMPNN + AntiFold
│   否决: ThermoMPNN ΔΔG > +0.5 → 排除 (不稳定)
│         AntiFold Δlog-lik > 0.5 → 排除 (不可表达风险)
│   输出: 15-30 候选
│   耗时: ~20 min
│
├── PHASE 4 — MM/GBSA 物理精算
│   工具: OpenMM MM/GBSA (500 minimization steps)
│   范围: Phase-3 候选 × 多结构 (2-6 个)
│   筛选: ΔΔG < −1.0 + ≥2 结构一致 → 高置信
│   输出: 5-10 候选
│   耗时: 2-8 小时
│
├── PHASE 4.5（可选）— 双点协同验证（Epistasis Scan）
│   适用条件: Phase-4 输出 ≥ 2 个 top 候选，且任意两者 Cβ–Cβ 距离 ≤ 25 Å
│   工具: OpenMM MM/GBSA（同 Phase 4 参数：Amber14，obc2，500 steps）
│   计算内容: 同批次计算 WT / 单点A / 单点B / 双点A+B
│   判定:
│     非加和项 = ΔΔG(A+B) − [ΔΔG(A) + ΔΔG(B)]
│     < −5 kcal/mol → 强协同（Epistasis），优先推进
│     −5 ~ +2 → 加和效应
│     > +2 → 拮抗，不推荐组合
│   注意: 单点 MM/GBSA 均不利（ΔΔG > 0）时，双点仍可能强协同（实例：VGRW-SR-R2 G49A+F112L）
│   耗时: ~15–30 min（4 变体）
│
├── PHASE 5 — AF2-Multimer 结构验证
│   工具: ColabFold AF2-Multimer
│   范围: Phase-4 最终候选 (3-8 个)
│   检查: ipTM ≥ WT_ipTM − 0.03, 结合模式不变
│   输出: 3-8 实验验证候选
│
└── PHASE 6 — 交付
    输出: 突变候选排名表 (CSV/JSON)
          ΔΔG 多工具对比报告 (HTML)
          推荐实验验证方案 (SPR/BLI/ELISA)
```

---

## 5. 工具详细参数

### 5.1 EvoEF2

```
二进制: tools/EvoEF2_src/EvoEF2.exe
调用方式: AffinityEnergyToolkit.run_evoef2(mutations, wt_dg=None, split=None)

机理: 半经验物理能量函数 (VDW + H-bond + electrostatics + solvation + rotamer)
精度: Pearson r ≈ 0.50-0.60 vs SKEMPI2; MUE ≈ 1.1 kcal/mol
速度: < 1 s / 突变 (CPU)
许可: MIT (免费商用)

参数:
  --command=ComputeBinding  (计算结合能)
  --command=BuildMutant     (构建突变体 PDB)
  --split=AB,C              (抗体链,抗原链)

已知限制:
  - 带电残基 (K/R/D/E/H) 突变: 局部势能函数对长程静电不敏感 → 不可信
  - |ΔΔG| > 5 kcal/mol: 可能是输入结构的局部碰撞导致 → 标记为 artifact
  - 刚性骨架假设: 对柔性 loop/肽段不适用 → 需 HADDOCK3 预弛豫
  - 接触数=0 盲区（V1.1）: 与抗原无直接接触的残基，所有 19 种替换输出相同 ΔΔG → 结果无效，改用 ESM-2 扫描
```

### 5.2 PRODIGY

```
Python 包: prodigy-prot 2.4.0 (pip)
调用方式: AffinityEnergyToolkit.run_prodigy(mutations, wt_dg=None)

机理: 基于界面接触数量 (ICs) 的 ML 回归模型
精度: Pearson r ≈ 0.73 vs PDBbind (绝对 ΔG)
速度: ~4 s / 突变
许可: Apache 2.0

适用: 蛋白抗原 > 50 aa (接触面积足够大)
不适用: 短肽抗原 ≤ 30 aa (接触数变化太小，无鉴别力)
```

### 5.3 OpenMM MM/GBSA

```
Python 包: openmm 8.5.0 (pip)
调用方式: AffinityEnergyToolkit.run_mmgbsa(mutations, wt_dg=None, minimization_steps=500)

机理: 全原子力场 (Amber ff14SB) + 隐式溶剂 (OBC2 GBSA)
      ΔG_bind = E_complex − E_antibody − E_antigen
精度: Pearson r ≈ 0.55-0.70 (BM5 benchmark)
速度: ~3 min / 突变 (200 steps), ~8 min (500 steps)
许可: MIT

参数:
  minimization_steps: 200 (快速筛选) / 500 (精算) / 1000 (高精度)
  platform: 自动回退 CUDA → CPU → Reference

已知行为:
  - 对带电突变最准确 (含完整静电 + 溶剂化)
  - 每次运行有 ±2 kcal/mol 随机噪声 (隐式溶剂限制)
  - 绝对值不可信，相对排名有参考价值
  - 批次内 WT 对照（V1.1）: 每次计算必须在同批次包含 WT，ΔΔG = ΔG(mutant) − ΔG(WT同批)
  - 跨批次比较禁止（V1.1）: 基线绝对值批次间波动 ±5–50 kcal/mol；跨批排名需 ≥3 次独立重复取均值
```

### 5.4 ThermoMPNN

```
目录: tools/ThermoMPNN/
模型: ThermoMPNN_default.pt
调用方式: AffinityEnergyToolkit.run_thermompnn(mutations, checkpoint=None)

机理: ProteinMPNN 架构微调于实验 ΔΔG_stability 数据
      预测: 突变引起的热稳定性变化 (ΔΔG_fold / ΔTm)
精度: Pearson r ≈ 0.63-0.70 vs Ssym (稳定性)
速度: ~6 s / 突变

⚠️ 关键认知: ThermoMPNN 预测的是稳定性 (ΔΔG_stability)，不是结合亲和力 (ΔΔG_binding)
   PAG1 实测: ThermoMPNN vs MM/GBSA r = −0.786 (负相关)
   正确用法: 作为否决工具 — ΔΔG > +0.5 kcal/mol 的突变不稳定 → 排除
   错误用法: 直接用 ThermoMPNN ΔΔG 排名亲和力候选
```

### 5.5 AntiFold

```
目录: tools/AntiFold/
模型: ESM-2 antibody fine-tune (预训练权重自动下载)
调用方式: AffinityEnergyToolkit.run_antifold(mutations)

机理: 抗体 CDR 区域的逆折叠模型，给定骨架坐标预测序列概率分布
      ΔΔG_proxy = −RT × (log P(mut) − log P(wt))
精度: 定性 (序列适配度)；与实验 ΔΔG_binding 无直接相关
速度: ~10 s / 突变

适用: 排除不自然/不可表达的 CDR 序列设计
      VHH 项目特别有用 (有 VHH 专用预训练)
不适用: 直接预测结合亲和力变化

AbLang 备选（V1.1）: 若 AntiFold 因 Python 版本兼容性无法安装，用 AbLang 替代
  安装: pip install ablang（conda: anarcii）
  评估: 伪对数似然（pseudo-log-likelihood），ΔlogP < −0.3 为警告，< −1.0 为强警告
  等效性: AbLang 与 AntiFold 均基于大规模抗体序列预训练，逻辑等效，可互换

PAG1 实测: ΔΔG 范围 ±0.05 kcal/mol → 对结合 ΔΔG 无鉴别力
          AntiFold vs ESM-IF1 r = +0.732 → 两者高度冗余，选一个即可
```

### 5.6 ESM-IF1

```
Python 包: fair-esm 2.0.0 (pip), 依赖 torch-scatter 2.1.2
调用方式: AffinityEnergyToolkit.run_esm_if1(mutations, wt_logp=None)

机理: GVP-GNN + Transformer 逆折叠模型 (142M 参数)
      给定蛋白骨架坐标，预测序列 log-likelihood
精度: Pearson r ≈ 0.45-0.55 vs ΔΔG_stability (Ssym)
速度: ~20 s / 突变 (CPU)

与 AntiFold 的关系: 机理类似，精度相近，高度冗余
推荐: 场景 B/C 选 AntiFold (抗体专用)；ESM-IF1 作为通用备选
```

### 5.7 HADDOCK3

```
安装: WSL Ubuntu-22.04, pip: haddock3 2026.3.0
调用: wsl -d Ubuntu-22.04 -- bash -c "haddock3 config.cfg"

机理: 信息驱动蛋白对接
  - topoaa: CNS 拓扑生成
  - rigidbody: 刚性体对接 + AIR 约束
  - flexref: 半柔性精修 (界面侧链+骨架 MD)
  - emref: 能量最小化精修 + 显式水分子
  - clustfcc: 接触相似度聚类
  - caprieval: CAPRI 质量评估 (fnat, irmsd, DockQ)

适用: 短肽抗原结构精修, AF2 低置信度界面优化
配置模板: projects/pag1_haddock3/haddock3_pag1.cfg
AIR 模板: projects/pag1_haddock3/ambig_restraints.tbl

PAG1 实测:
  - 100 模型, 38 分 42 秒
  - 11 个 cluster, Cluster-5 最佳 (fnat=0.737, irmsd=1.19 Å)
  - 精修后结构更适合做 ΔΔG 计算

VHH 纳米抗体对接注意（V1.1）:
  - Sampling ≥ 100（fast-40 采样导致界面姿态偏差，实测于 VGRW-SR-R2 VHH–HER2）
  - 质量门: 第一簇集中度 ≥ 60%（不达标则增大 Sampling 至 200 或更换起始构型）
```

### 5.8 ESM-2（进化语言模型全序列扫描）

```
Python 包: fair-esm (pip install fair-esm，conda: affmat)
模型推荐: esm2_t6_8M_UR50D（快速，≤200 aa）或 esm2_t30_150M_UR50D（高精度）
核心指标: masked token logP；ΔlogP = logP(mut) − logP(wt)
阈值: ΔlogP > −3.0 → 进化上可替换，纳入候选；ΔlogP < −5.0 → 高度保守，不建议突变
耗时: ~5–10 min（8M model，CPU，VHH 120aa 全序列扫描）

机理: 蛋白质进化语言模型（ESM-2），通过 masked token 预测评估任意位点的氨基酸可替换性
与 EvoEF2 关系: 互补工具——EvoEF2 评估界面结合能，ESM-2 评估序列进化适应性
适用场景: 接触数 < 3 的变构/框架位点，以及 EvoEF2 结果可疑的位点
```

---

## 6. 多结构策略

### 6.1 结构来源

| 来源 | 数量 | 适用场景 |
|------|------|---------|
| AF2-Multimer rank 1-3 | 3 | 所有场景 |
| HADDOCK3 Cluster-1 top-3 | 3 | 场景 A (短肽) |
| 实验结构 (X-ray/cryo-EM) | 1 | 若有，作为金标准 |
| EvoEF2 Optimize 弛豫 | 与上述并行 | 推荐用于 AF2 结构 |

### 6.2 共识判定规则

```
在 N 个结构上分别计算 EvoEF2 + MM/GBSA ΔΔG:

高置信 (推荐实验验证):
  - ≥ (N-1)/N 结构 ΔΔG 同方向
  - EvoEF2 与 MM/GBSA 在 ≥1 个结构上一致

中置信 (备选候选):
  - ≥ N/2 结构 ΔΔG 同方向
  - 任一工具 |ΔΔG| > 1.0

低置信 (待进一步验证):
  - 结构间 ΔΔG 方向不一致
  - 或仅单工具支持
```

---

## 7. 文件索引

| 文件 | 位置 | 内容 |
|------|------|------|
| 统一 API | `core/structure/affinity_energy_toolkit.py` | 6 工具封装 + `run_all()` |
| CLI | `scripts/affinity_energy_cli.py` | 命令行接口 |
| 多突变扫描 | `scripts/pag1_multi_mutation_scan.py` | PAG1 36突变模板脚本 |
| 相关性分析 | `scripts/pag1_correlation_analysis.py` | 工具间相关性 + HTML 报告 |
| HADDOCK3 Pipeline | `scripts/pag1_haddock3_pipeline.py` | AF2→HADDOCK3→ΔΔG |
| 工具技术指南 | `docs/Affinity_Energy_Tools_Guide.md` | 6 工具机理详解 |
| **本标准** | `docs/VIRTUAL_AFFINITY_MATURATION_STANDARD.md` | 系统规则和工作流 |
| PAG1 扫描数据 | `projects/PAG-1 project/mutation_scan_results/` | CSV + JSON + HTML 报告 |
| HADDOCK3 结果 | `projects/pag1_haddock3/run/` | 精修模型 + 聚类 + 评分 |

---

## 8. PAG1 Benchmark 总结

基于 7m_humanPAG1 复合体（VH+VL vs 32 aa PAG1）的 36 突变 × 6 工具实测：

### 工具间相关性矩阵 (Pearson r, n=36 全突变 / n=10 MM/GBSA 子集)

|  | EvoEF2 | PRODIGY | ThermoMPNN | AntiFold | ESM-IF1 | MM/GBSA |
|--|--------|---------|------------|----------|---------|---------|
| EvoEF2 | 1.000 | −0.267 | −0.039 | +0.200 | +0.069 | +0.366 |
| PRODIGY | | 1.000 | +0.259 | −0.019 | −0.148 | −0.661 |
| ThermoMPNN | | | 1.000 | −0.088 | +0.069 | **−0.786** |
| AntiFold | | | | 1.000 | **+0.732** | −0.384 |
| ESM-IF1 | | | | | 1.000 | −0.159 |
| MM/GBSA | | | | | | 1.000 |

### 关键结论

- **EvoEF2 + MM/GBSA 一致时最可信** — Y99A 是唯一双工具支持的候选 (−12.9 / −4.82)
- **PRODIGY 对短肽 (<30 aa) 完全失效** — ΔΔG 范围仅 0.78 kcal/mol
- **ThermoMPNN 与 MM/GBSA 负相关** — 测量不同物理量 (稳定性 vs 结合能)
- **AntiFold ≈ ESM-IF1** — r = 0.73, 高度冗余, 选一个即可
- **带电残基突变** — EvoEF2 不可信, 必须用 MM/GBSA

---

## 9. 版本历史

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-04-02 | 1.2 | 二维决策矩阵（场景×结构来源质量）、AF结构分层规则（含AF3）、场景A按抗体格式细分（A-VHH/A-VHL）、场景B同步V1.1改进、Phase -1 BioChatter智能分类+SKEMPI2预查询+RAG阈值校准 |
| 2026-04-02 | 1.1 | VGRW-SR-R2 实战升级：扫描范围扩展至全界面接触位点、HADDOCK3 VHH 采样门控、EvoEF2 接触数=0 盲区规则、ESM-2 Phase 2.5、CMC pI 预筛、Phase 4.5 双点协同验证、AbLang 备选 AntiFold、MM/GBSA 跨批次比较禁止 |
| 2026-04-01 | 1.0 | 初始版本 — 基于 PAG1 benchmark 建立三场景工具选择规则 |

---

## 10. 后续演习计划

| 演习 | 目的 | 状态 |
|------|------|------|
| PAG1 短肽 (已完成) | 验证短肽场景工具表现 | ✅ 完成 |
| 蛋白抗原 (SKEMPI2 校正) | 在有实验数据的抗体-蛋白复合体上校正工具参数 | 待执行 |
| VHH 纳米抗体 | 验证 AntiFold VHH 模型 + CDR3 长 loop 处理 | 待执行 |
| SKEMPI2 批量校正 | 拟合 ΔΔG_corrected = a × ΔΔG_raw + b | 待执行 |
