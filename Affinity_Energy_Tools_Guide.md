# Affinity Energy Calculation Tools — 技术指南
## Virtual Affinity Maturation 工具链完整参考

**版本**: v1.0 | **环境**: `affmat` (conda) | **日期**: 2026-03-26

---

## 总览：工具安装位置

| 工具 | 安装位置 | 用途类型 | 本 Toolkit 收录 |
|------|---------|---------|---------------|
| **EvoEF2** | `tools/EvoEF2_src/EvoEF2.exe` | ΔΔG + 突变构建 | ✅ |
| **ThermoMPNN** | `tools/ThermoMPNN/` | ΔΔG + ΔTm | ✅ |
| **AntiFold** | `tools/AntiFold/` | CDR 逆折叠 | ✅ |
| **ProteinMPNN** | `tools/ProteinMPNN/` | 序列设计（非 ΔΔG） | ❌（见注） |
| **EpiScan** | `tools/EpiScan/` | 表位预测 / 免疫原性 | ❌（见注） |
| **PRODIGY** | pip: `prodigy_prot` | ΔG 绝对值 + Kd | ✅ |
| **ESM-IF1** | pip: `fair-esm 2.0.0` | 逆折叠 ΔΔG 代理 | ✅ |
| **OpenMM** | pip: `openmm 8.5.0` | MM/GBSA 精确能量 | ✅ |
| **AbLang** | pip: `ablang` | 抗体序列自然性打分 | ❌（见注） |

> **ProteinMPNN**：序列设计工具，不用于 ΔΔG 预测。适用于 CDR 大规模重设计，与结构驱动定点成熟是两条不同工作线。  
> **EpiScan**：T 细胞表位扫描工具（免疫原性评估），属于开发性评估，不属于亲和力能量计算。  
> **AbLang**：已用于 `scripts/affinity_maturation/ablang_score.py`（L2 序列自然性门控）。

---

## 选择矩阵：ΔΔG 工具精度 vs 速度

| 工具 | 类型 | ΔΔG 精度 | 速度 | 许可证 | 主要用途 |
|------|------|---------|------|--------|---------|
| **EvoEF2** | 半经验物理力场 | r ≈ 0.50–0.60 | **< 5 s** | MIT ✅ | Layer 1 全 CDR 快速扫描 |
| **PRODIGY** | 接触统计 + 线性回归 | r ≈ 0.74 | **< 2 s** | MIT ✅ | 快速 ΔG 绝对值、cross-species 比较 |
| **OpenMM MM/GBSA** | 物理力场 + 隐式溶剂 | r ≈ 0.55–0.65 | **1–3 min** | MIT ✅ | 精确能量验证，最终候选评估 |
| **ESM-IF1** | 蛋白语言模型逆折叠 | r ≈ 0.45–0.55 | **< 2 s** | MIT ✅ | 序列-结构兼容性过滤 |
| **ThermoMPNN** | GNN + 迁移学习 | r ≈ 0.55–0.60 | **< 10 s** | MIT ✅ | ΔΔG + ΔTm，稳定性评分 |
| **AntiFold** | 抗体专用逆折叠 | r ≈ 0.40–0.50 | **< 1 s** | MIT ✅ | CDR 序列兼容性，CDR 重设计 |

> **精度参考**：Pearson r 值均为与实验 ΔΔG 数据（SKEMPI2/ProTherm/Ssym）的相关系数。  
> **运行环境**：所有工具均在 `affmat` conda 环境中运行。  
> Python：`d:\Users\NextVivo\miniconda3\envs\affmat\python.exe`

---

## 零、EvoEF2（Layer 1 基础层）

### 机理
EvoEF2（Evolutionary Energy Function 2，Huang et al. 2020）是一个**半经验物理能量函数**，包含：
- Van der Waals 相互作用（12-6 LJ 势）
- 氢键（距离 + 角度项）
- 静电相互作用（距离依赖介电常数）
- 溶剂化（Lazaridis–Karplus 隐式溶剂）
- 骨架扭转角（Ramachandran 分布先验）
- 侧链旋转构象概率（骨架依赖旋转异构体库）

**ComputeBinding 工作流：**
1. `BuildMutant` — 构建突变体侧链（旋转异构体优化，< 3 s）
2. `ComputeBinding --split=A,BC` — 计算界面结合能
3. ΔΔG = ΔG_bind_mut − ΔG_bind_WT

**EvoEF2 在本 Toolkit 的双重角色：**
| 角色 | 作用 |
|------|------|
| 突变构建器 | `BuildMutant` — 为所有其他工具提供突变体 PDB |
| **独立 ΔΔG 计算器** | `ComputeBinding` — Layer 1 快速扫描 |

### 精度
- **Pearson r ≈ 0.50–0.60**（SKEMPI2 抗体-抗原子集）
- MUE ≈ 1.1 kcal/mol（绝对值偏差），相对排序可靠
- 参考文献：Huang et al., Bioinformatics 2020

### 适用场景
- **全 CDR 单点突变扫描**（100+ 突变，< 10 min）— Layer 1 核心
- 快速淘汰 ΔΔG > +0.5 kcal/mol 的无益突变
- 生成突变组合候选列表（传入后续高精度工具）

### 计算耗时
| 任务 | 时间 |
|------|------|
| 单突变（BuildMutant + ComputeBinding） | < 5 s |
| 100 个单点突变全扫 | < 10 min |
| 50 个双点突变组合 | < 15 min |

### 调用方式

**Python API：**
```python
result = tk.run_evoef2(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_dg=None,           # auto-computed WT if None
    split="A,BC",         # antibody chain A vs antigen chains BC
)
# result["dg"]  = -15.3 kcal/mol
# result["ddg"] = -2.1 kcal/mol (vs WT)
```

**命令行直接调用：**
```bash
# 构建突变体
tools\EvoEF2_src\EvoEF2.exe --command=BuildMutant --pdb=complex.pdb \
    --mutant_file=individual_list.txt

# 计算结合能（individual_list.txt 内容如: YA67F; 表示 chain A, Tyr67→Phe）
tools\EvoEF2_src\EvoEF2.exe --command=ComputeBinding --pdb=complex_Model_0001.pdb \
    --split=A,BC
```

**脚本调用：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A --ag-chains B \
    --tools evoef2 prodigy \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" \
    --output results/L1_scan.csv
```

**相关文件：**
- `tools/EvoEF2_src/EvoEF2.exe` — 可执行文件（已编译）
- `scripts/affinity_maturation/evoef2_scan.py` — VGRW_SR_R2 项目专用 L1 扫描脚本
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_evoef2()`

---

## 一、PRODIGY

### 机理
PRODIGY（**Pro**tein Binding Energy Prediction）基于**界面接触（Interfacial Contacts, ICs）计数**方法。

**计算步骤：**
1. 以 5.5 Å 截断距离统计所有跨链残基对接触数
2. 按接触类型分类：charged-charged (CC)、charged-polar (CP)、charged-apolar (CA)、polar-polar (PP)、apolar-polar (AP)、apolar-apolar (AA)
3. 计算非界面溶剂暴露残基（NIS）中极性和带电比例
4. 线性回归模型预测 ΔG_bind：

```
ΔG = -0.09459·IC_CC + 0.19640·IC_CP - 0.22460·IC_CA
   + 0·IC_PP + -0.18550·IC_AA + 0.34580·f_NIS_charged + 0.10950·f_NIS_apolar - 6.4
```

5. Kd = exp(ΔG / RT)，R = 1.987 cal/mol/K

### 精度
- **训练集**：144 个蛋白-蛋白复合物（ITC/SPR 实验值）
- **Pearson r ≈ 0.74**（测试集），RMSE ≈ 0.9 kcal/mol
- **参考文献**：Vangone & Bonvin, eLife 2015；Xue et al., Bioinformatics 2016
- **局限**：对含金属离子或非标准残基的复合物精度下降；小抗原（< 50 aa）接触数少，误差偏大

### 适用场景
- 所有候选突变体的**快速初筛**（全扫描）
- 跨物种（human/mouse）同一抗体结合强度**横向比较**
- 获得 ΔG 绝对值（kcal/mol）和 Kd（nM）估算

### 计算耗时
| 任务 | 时间 |
|------|------|
| 单个复合物 ΔG | < 2 s |
| 20 个突变体扫描 | < 1 min |
| 全 CDR 扫描（100 突变） | < 5 min |

### 调用方式

**CLI（直接）：**
```bash
conda activate affmat
prodigy complex.pdb --selection A,B C --temperature 25
```

**Python API：**
```python
from core.structure.affinity_energy_toolkit import AffinityEnergyToolkit

tk = AffinityEnergyToolkit(pdb, ab_chains=["A","B"], ag_chains=["C"], evoef2_exe=...)
result = tk.run_prodigy([{"chain":"A","resi":67,"wt":"Y","mut":"F"}])
# result["dg"]    = -12.5 kcal/mol
# result["kd_nM"] = 0.8 nM
# result["ddg"]   = -1.3 kcal/mol (vs WT)
```

**脚本调用：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools prodigy \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --output results/prodigy_scan.csv
```

**相关文件：**
- `scripts/affinity_maturation/prodigy_score.py` — 现有项目专用脚本
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_prodigy()`

---

## 二、OpenMM MM/GBSA

### 机理
基于**分子力学 / 广义波恩表面积（Molecular Mechanics / Generalized Born Surface Area）**方法。

**计算流程：**
1. EvoEF2 构建突变体侧链 → PDBFixer 添加氢原子 → 修复缺失残基
2. AMBER ff14SB 力场 + OBC2 隐式溶剂（广义波恩）构建体系
3. Langevin 动力学（300 K）能量最小化（默认 300 步）
4. **单轨迹近似**（Single-Trajectory Approximation）计算：

```
ΔG_bind ≈ E_complex - E_antibody - E_antigen
```

所有三个能量均取自**同一最小化后**的复合物坐标（去除对方链后单点计算），避免了重新平衡的计算开销。

**能量项组成（AMBER ff14SB + OBC2）：**
- 键合项：bonds + angles + dihedrals + impropers
- 非键合项：electrostatics (PME) + VdW (LJ 12-6)
- 隐式溶剂：广义波恩静电溶剂化 + SASA 非极性项

### 精度
- **Pearson r ≈ 0.55–0.65**（SKEMPI2 数据集，单点 + 最小化）
- 标准 GB/SA 完整 MD 可达 r ≈ 0.70+，但计算成本高 10–100×
- MUE ≈ 2–4 kcal/mol（绝对值误差大，相对 ΔΔG 误差 ~ 1–2 kcal/mol）
- **局限**：忽略构象熵；单点最小化不如 MD 采样准确；无显式水分子

### 适用场景
- 经 L1（EvoEF2）和 L2（PRODIGY/ThermoMPNN）筛选后的**最终候选精细验证**
- 获取能量分解（E_complex, E_ab, E_ag）用于机理分析
- ΔΔG 计算最终排序（最高计算精度的免费工具）

### 计算耗时
| 任务 | CPU | GPU (CUDA) |
|------|-----|-----------|
| 单个突变体（300 步） | 1–3 min | 15–30 s |
| 8 个候选 | ~20 min | ~3 min |
| 50 个候选 | ~2.5 h | ~25 min |

> **截断技巧**：对大抗原（> 200 aa）使用 `--ag-residue-range C:520:620` 截取结合位点附近域，可大幅加速。

### 调用方式

**Python API：**
```python
result = tk.run_mmgbsa(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_dg=-30.88,              # WT ΔG_bind (from previous WT run)
    minimization_steps=300,
    residue_range={"chain":"C","start":520,"end":620},  # optional antigen truncation
)
# result["dg"]        = -34.08 kcal/mol
# result["ddg"]       = -3.20 kcal/mol
# result["e_complex"] = -6172.61 kcal/mol
```

**脚本调用：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex_repaired.pdb --ab-chains A --ag-chains B \
    --tools mmgbsa \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" "A:67:Y:F+A:70:K:R" \
    --mmgbsa-steps 300 \
    --ag-residue-range B:520:620 \
    --output results/mmgbsa_scan.csv
```

**相关文件：**
- `scripts/affinity_maturation/openmm_mmgbsa_v5.py` — 当前最新版本（PAG1/HER2 项目）
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_mmgbsa()`
- `projects/mumab4d5_VGRW_SR_R2/affinity_maturation/openmm_v5_results.csv` — 示例输出

**参考输出格式：**
```
variant,e_complex,e_vhh,e_ag,mmgbsa_bind,mmgbsa_ddg,error
WT,-6185.62,-4048.35,-2106.39,-30.88,0.0,
K70R,-6320.76,-4179.83,-2101.66,-39.28,-8.4,
```

---

## 三、ESM-IF1 (fair-esm 2.0.0)

### 机理
ESM-IF1（Inverse Folding with Equivariant Structure Encoder，Hsu et al. 2022）是 Meta AI 开发的**逆折叠模型**，架构为 GVP-GNN + Transformer。

**工作原理：**
- **正向问题**：给定序列 → 预测结构（AlphaFold）
- **逆向问题**：给定结构骨架 → 预测最可能的序列
- ESM-IF1 学习 P(sequence | backbone)，即给定蛋白质骨架坐标，序列的对数似然

**ΔΔG 代理计算：**
```
ΔΔG_proxy = −RT × [log P(mut | backbone) − log P(wt | backbone)]
           = −RT × Δ(log-likelihood)
```

- 负值 = 突变后序列更符合结构骨架 → 通常更稳定
- 正值 = 突变破坏了序列-结构兼容性 → 通常不利

**注意**：这是**稳定性** ΔΔG 代理，**不是直接的结合 ΔΔG**。需配合 PRODIGY/MM/GBSA 使用。

**模型**：`esm_if1_gvp4_t16_142M_UR50` (142M 参数，Apache 2.0)

### 精度
- 原生序列恢复率：51.4%（PDB benchmark，类似 ProteinMPNN）
- ΔΔG 稳定性预测：Pearson r ≈ 0.45–0.55（Ssym 数据集）
- 结合 ΔΔG 相关性：定性，r ≈ 0.30–0.40

### 适用场景
- **结构-序列兼容性过滤**：快速淘汰破坏骨架的突变
- 与 AntiFold 联用作为逆折叠一致性检验
- 非抗体蛋白-蛋白界面突变初筛

### 计算耗时
| 任务 | CPU | GPU |
|------|-----|-----|
| 模型加载（首次） | ~30 s（下载 142 MB） | 同左 |
| 模型加载（缓存） | ~10 s | ~3 s |
| 单个结构评分 | < 2 s | < 0.5 s |
| 100 个突变 | ~3 min | < 30 s |

### 调用方式

**Python API：**
```python
result = tk.run_esm_if1(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_logp=None,  # auto-computed if None
)
# result["ddg"]      = -0.45  (ΔΔG proxy, kcal/mol)
# result["wt_logp"]  = -1.23
# result["mut_logp"] = -0.47
```

**脚本调用：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools esm_if1 \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --output results/esm_scan.csv
```

**相关文件：**
- `core/structure/affinity_energy_toolkit.py` → `AffinityEnergyToolkit.run_esm_if1()`
- `tools/ThermoMPNN/protein_mpnn_utils.py` — 共享 encoder 架构参考

---

## 四、ThermoMPNN

### 机理
ThermoMPNN（Dieckhaus et al., PNAS 2024）基于 **ProteinMPNN 骨干网络迁移学习**的 ΔΔG 预测器。

**训练数据**：Megascale 数据集（Tsuboyama et al., Nature 2023）
- ~350,000 个点突变的 ΔΔG 实验值（热稳定性，DSF/CD）
- 覆盖 >1,400 个蛋白家族

**架构：**
```
PDB结构 → ProteinMPNN Encoder (GNN, 48层)
                ↓ 特征向量
         Fine-tuned MLP Head
                ↓
         ΔΔG (kcal/mol) + ΔTm (°C)
```

- Encoder：从 ProteinMPNN v_48_020.pt 迁移，冻结 backbone noise σ = 0.20 Å
- Head：针对 Megascale 训练的回归层
- 多突变：**加和假设**（单突变 ΔΔG 相加），适用于非相互作用位点

### 精度
- **Pearson r ≈ 0.55–0.60**（Ssym、ProTherm 验证集）
- 对热稳定性 ΔTm 预测准确（RMSE ≈ 2–3 °C）
- 对结合 ΔΔG：定量性弱，但方向性好（正/负 ΔΔG 分类准确率 ~70%）

### 适用场景
- **双重筛选**：同时优化亲和力和热稳定性（避免亲和力突变破坏稳定性）
- 扫描大量单突变候选（快速 GPU 批量推断）
- 与 EvoEF2 结合：EvoEF2 偏物理，ThermoMPNN 偏学习，互补验证

### 计算耗时
| 任务 | CPU | GPU |
|------|-----|-----|
| 模型加载 | ~5 s | ~3 s |
| 单个突变 | ~5–10 s | ~1 s |
| 100 个突变（批量） | ~2 min | < 30 s |

### 调用方式

**Python API：**
```python
result = tk.run_thermompnn(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    model_weights="vanilla_model_weights/v_48_020.pt",
)
# result["ddg"] = -0.82 kcal/mol (ΔΔG_stability)
```

**脚本调用：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools thermompnn \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --thermompnn-dir tools/ThermoMPNN \
    --output results/thermo_scan.csv
```

**相关文件：**
- `tools/ThermoMPNN/` — 已克隆仓库（MIT）
- `tools/ThermoMPNN/vanilla_model_weights/v_48_020.pt` — 推荐权重（σ=0.20）
- `tools/ThermoMPNN/model_utils.py` — 模型加载和推断接口

**可用权重文件：**
| 文件 | 骨架噪声 | 推荐场景 |
|------|---------|---------|
| `v_48_002.pt` | σ=0.002 | 高精度，低多样性 |
| `v_48_010.pt` | σ=0.010 | 平衡 |
| **`v_48_020.pt`** | σ=0.020 | **默认推荐** |
| `v_48_030.pt` | σ=0.030 | 高多样性 |

---

## 五、AntiFold

### 机理
AntiFold（Høie et al., 2024, Oxford Protein Informatics Group）是专门针对**抗体 CDR 区域**优化的逆折叠模型（141M 参数）。

**训练数据：**
- OAS（Observed Antibody Space）数据库 ~10M 条抗体序列
- SAbDab（Structural Antibody Database）结构对
- 专注于 VH/VL 和 VHH 框架区 + CDR 环区

**与 ESM-IF1 的关键区别：**
| 特性 | ESM-IF1 | AntiFold |
|------|---------|---------|
| 训练数据 | 通用蛋白质 | **抗体专用** |
| CDR 恢复率 | ~50% | **60–70%** |
| CDR-H3 专项 | 一般 | **优化** |
| 框架区偏好 | 通用骨架 | 抗体 Ig 折叠 |

**ΔΔG 计算：** 与 ESM-IF1 相同的对数似然差值代理：
```
ΔΔG_proxy = −RT × Δ(AntiFold log-likelihood)
```

**模型文件**：`tools/AntiFold/models/model.pt`（已下载，141M 参数）

### 精度
- CDR-H1/H2 原生序列恢复率：65–70%
- CDR-H3 恢复率：55–60%（远高于通用模型）
- 结合 ΔΔG 相关性：r ≈ 0.40–0.50（定性方向性）

### 适用场景
- **CDR 突变兼容性过滤**：判断突变是否符合抗体 CDR 序列空间
- **抗体序列设计**：固定框架区，对 CDR 进行逆折叠设计
- 人源化验证：突变是否破坏 VH/VL 框架-CDR 相互作用
- VHH → VH 改造：新 CDR 序列的兼容性评分

### 计算耗时
| 任务 | CPU | GPU |
|------|-----|-----|
| 模型加载 | ~5 s | ~3 s |
| 单个复合物评分 | < 1 s | < 0.2 s |
| 100 个突变 | ~2 min | < 30 s |

### 调用方式

**Python API：**
```python
result = tk.run_antifold(
    mutations=[{"chain":"A","resi":67,"wt":"Y","mut":"F"}],
    wt_logp=None,  # auto-computed
)
# result["ddg"]      = -0.31 kcal/mol (CDR compatibility proxy)
# result["wt_logp"]  = -0.85
# result["mut_logp"] = -0.33
```

**脚本调用：**
```bash
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools antifold \
    --mutations "WT" "A:67:Y:F" "A:102:K:R" \
    --output results/antifold_scan.csv
```

**相关文件：**
- `tools/AntiFold/` — 已克隆仓库（MIT）
- `tools/AntiFold/models/model.pt` — 已下载预训练权重

---

## 六、工作流集成

### 推荐三层漏斗流程

```
╔══════════════════════════════════════════════════════════════════╗
║  Layer 1 — 快速扫描（全 CDR，100+ 候选，< 30 min）               ║
║  工具: EvoEF2 ComputeBinding + PRODIGY + ThermoMPNN              ║
║  输入: WT complex PDB                                            ║
║  输出: ΔΔG_EvoEF2 + ΔG_PRODIGY + ΔΔG_ThermoMPNN               ║
║  筛选: ΔΔG_EvoEF2 ≤ +0.5 AND PRODIGY_ΔG 更负 AND ThermoMPNN < 0║
╠══════════════════════════════════════════════════════════════════╣
║  Layer 2 — 中等精度评估（top 15–20 候选，< 2 h）                 ║
║  工具: AbLang 自然性 + ESM-IF1 + AntiFold                        ║
║        （+ AbEvaluator CMC 门控: pI, SAP, 脱酰胺风险）           ║
║  筛选: AbLang_Δlogp > -0.3 AND AntiFold_ΔΔG < 0                 ║
╠══════════════════════════════════════════════════════════════════╣
║  Layer 3 — 高精度验证（top 5–10 候选，1–3 h）                    ║
║  工具: OpenMM MM/GBSA（300+ 步最小化）                           ║
║        + AF2-Multimer 结构验证（ipTM 对比 WT）                   ║
║  输出: 最终 ΔΔG 排名 + 结构 QA 通过列表                          ║
╚══════════════════════════════════════════════════════════════════╝
```

### 全流程 CLI 示例

```bash
conda activate affmat

# Layer 1: 快速扫描
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools prodigy thermompnn \
    --mutation-yaml scripts/affinity_maturation/config.yaml \
    --output results/L1_scan.csv

# Layer 2: 中等精度（选 top 15 候选）
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools esm_if1 antifold prodigy \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" "A:67:Y:F+A:70:K:R" \
    --output results/L2_scan.csv

# Layer 3: 精细验证（最终 5 候选）
python scripts/affinity_energy_cli.py \
    --pdb complex.pdb --ab-chains A B --ag-chains C \
    --tools mmgbsa \
    --mutations "WT" "A:67:Y:F" "A:70:K:R" \
    --mmgbsa-steps 500 --ag-residue-range C:1:100 \
    --output results/L3_mmgbsa.csv --json-output
```

### run_all() 一键运行

```python
from core.structure.affinity_energy_toolkit import AffinityEnergyToolkit

tk = AffinityEnergyToolkit(
    complex_pdb="complex.pdb",
    ab_chains=["A", "B"],
    ag_chains=["C"],
    evoef2_exe="tools/EvoEF2_src/EvoEF2.exe",
    thermompnn_dir="tools/ThermoMPNN",
)

mutations_list = [
    [],                                                    # WT
    [{"chain":"A","resi":67,"wt":"Y","mut":"F"}],          # Y67F
    [{"chain":"A","resi":70,"wt":"K","mut":"R"}],          # K70R
    [{"chain":"A","resi":67,"wt":"Y","mut":"F"},
     {"chain":"A","resi":70,"wt":"K","mut":"R"}],          # Y67F+K70R
]

results = tk.run_all(
    mutations_list=mutations_list,
    tools=["prodigy", "mmgbsa", "thermompnn"],
    minimization_steps=300,
    output_csv="results/full_scan.csv",
)
```

---

## 七、输出 CSV 格式

`run_all()` 输出的合并 CSV 包含所有工具结果，字段前缀对应工具名：

| 字段 | 来源 | 含义 |
|------|------|------|
| `variant` | — | 突变标识（如 "A67F+A70K"） |
| `prodigy_dg` | PRODIGY | ΔG_bind (kcal/mol) |
| `prodigy_ddg` | PRODIGY | ΔΔG vs WT (kcal/mol) |
| `prodigy_kd_nM` | PRODIGY | 预测 Kd (nM) |
| `prodigy_n_contacts` | PRODIGY | 界面接触数 |
| `mmgbsa_dg` | OpenMM | ΔG_bind (kcal/mol) |
| `mmgbsa_ddg` | OpenMM | ΔΔG vs WT (kcal/mol) |
| `mmgbsa_e_complex` | OpenMM | 复合物总能量 (kcal/mol) |
| `esm_ddg` | ESM-IF1 | ΔΔG_proxy (-RT×Δlogp) |
| `esm_wt_logp` | ESM-IF1 | WT 序列对数似然 |
| `thermo_ddg` | ThermoMPNN | ΔΔG_stability (kcal/mol) |
| `af_ddg` | AntiFold | CDR 对数似然 ΔΔG_proxy |
| `*_elapsed` | 各工具 | 计算耗时 (s) |
| `*_error` | 各工具 | 错误信息（成功时为 null） |

---

## 七-补、互补工具（不在本 Toolkit 中，但在 tools/ 下）

### ProteinMPNN（`tools/ProteinMPNN/`）
**用途**：给定骨架坐标，生成多样化的蛋白质序列（逆折叠序列设计）。  
**与本 Toolkit 区别**：ProteinMPNN 是**大规模序列改写工具**，不直接预测 ΔΔG。  
适用场景：CDR 全序列重设计（非定点突变）、scaffold 序列多样性探索。

```python
# 典型使用：为某链生成 top-k 序列设计
# 见 tools/ProteinMPNN/protein_mpnn_run.py
python tools/ProteinMPNN/protein_mpnn_run.py \
    --pdb_path complex.pdb \
    --chain_id_jsonl chain_id.jsonl \
    --out_folder mpnn_output/ \
    --num_seq_per_target 100 \
    --sampling_temp "0.1"
```

### EpiScan（`tools/EpiScan/`）
**用途**：预测抗原-抗体复合物中抗原的**T 细胞表位**（免疫原性扫描）。  
**与本 Toolkit 区别**：EpiScan 属于**开发性（Developability）评估**而非亲和力能量预测。  
**环境要求**：Python 3.7 + PyTorch 1.11（与 `affmat` 环境不兼容，需单独环境）。  
参考：[EpiScan web server](http://www.episcan.net:8023/)

### AbLang（pip: `ablang`）
**用途**：抗体序列的**伪似然打分**（pseudo-perplexity），评估突变是否符合天然抗体序列空间。  
**在项目中的位置**：`scripts/affinity_maturation/ablang_score.py`（L2 层序列自然性门控）。

```python
from ablang import pretrained
ab_model = pretrained("heavy")  # or "light"
# 计算每个突变相对 WT 的序列合理性下降量
scores = ab_model([wt_seq, mut_seq], mode="likelihood")
delta_logp = scores[1] - scores[0]  # > -0.3 为通过
```

**相关文档**：`docs/Virtual_Affinity_Maturation_Methods_Review.md` — 包含 AbLang 在 L2 门控中的完整描述和阈值说明（Δlog-p ≥ −0.3/residue）。

---

## 八、文件索引

### 核心 Python 模块
| 文件 | 功能 |
|------|------|
| `core/structure/affinity_energy_toolkit.py` | **统一 API**（本文档对应实现，含 EvoEF2/PRODIGY/MM-GBSA/ESM-IF1/ThermoMPNN/AntiFold） |
| `scripts/affinity_energy_cli.py` | **CLI 入口**（支持所有 6 个工具，支持 `--mutation-yaml`） |

### 项目专用脚本（`scripts/affinity_maturation/`）
| 文件 | 功能 |
|------|------|
| `evoef2_scan.py` | EvoEF2 全 CDR 扫描（L1 层，VGRW_SR_R2 项目） |
| `prodigy_score.py` | PRODIGY 突变体扫描（VGRW_SR_R2 项目） |
| `openmm_mmgbsa_v5.py` | MM/GBSA v5（HER2 结合位点截断版，最新） |
| `ablang_score.py` | AbLang L2 序列自然性门控 |
| `combo_design.py` | 突变组合生成（位点独立性 + 距离约束） |
| `cmc_gate.py` | CMC 可开发性门控（pI, SAP, 脱酰胺） |
| `generate_report.py` | 汇总报告生成（Markdown） |
| `config.yaml` | 项目配置（突变列表、路径、门禁阈值） |

### 工具目录（`tools/`）
| 目录 | 工具 | 状态 | 本 Toolkit 收录 |
|------|------|------|----------------|
| `tools/EvoEF2_src/` | EvoEF2（突变构建 + ΔΔG 扫描） | ✅ 编译完成 | ✅ run_evoef2() |
| `tools/ThermoMPNN/` | ThermoMPNN（ΔΔG + ΔTm） | ✅ 已克隆 | ✅ run_thermompnn() |
| `tools/AntiFold/` | AntiFold（抗体 CDR 逆折叠） | ✅ 模型已下载 | ✅ run_antifold() |
| `tools/ProteinMPNN/` | ProteinMPNN（CDR 序列设计） | ✅ 模型已下载 | ❌ 独立工作线 |
| `tools/EpiScan/` | EpiScan（T 细胞表位扫描） | ✅ 已克隆 | ❌ 需 Python 3.7 独立环境 |

### 相关文档（`docs/`）
| 文档 | 内容 |
|------|------|
| `docs/Affinity_Energy_Tools_Guide.md` | **本文档** — 工具 API + 机理 + 精度 |
| `docs/Virtual_Affinity_Maturation_Methods_Review.md` | 方法论综述（v2.1）— 含 MPNN 用途区分、三层扫描策略、AbLang L2 门控阈值 |

### 环境
```bash
# 所有工具的运行环境
conda activate affmat
# 或直接使用完整路径：
d:\Users\NextVivo\miniconda3\envs\affmat\python.exe

# 关键包版本
OpenMM       8.5.0
PyTorch      2.11.0+cpu
NumPy        1.26.4  (固定，AntiFold 兼容性)
fair-esm     2.0.0
antifold     0.3.1
```

---

## 附录：PAG1 尺度突变扫描 — 耗时与精度对照

**系统特征**：PAG1 为短抗原肽（约 30+ aa），与 VH/VL 的 AlphaFold-Multimer 复合物总原子数远小于「全长抗原 + 抗体」体系。以下耗时按**单突变体、CPU、affmat 环境**估算；GPU 可缩短 ESM-IF1 / ThermoMPNN / AntiFold；MM/GBSA 在 CPU 上仍占主导。

### 单工具：精度（与实验 ΔΔG / 结合相关）与典型耗时

| 工具 | 文献/基准上的精度（粗粒度） | PAG1 扫描单突变约耗时 | 100 个单点突变总耗时量级 |
|------|------------------------------|------------------------|---------------------------|
| **EvoEF2** ComputeBinding | r ≈ 0.50–0.60（SKEMPI2），MUE ~1 kcal/mol；**排序优于绝对值** | ~2–6 s | ~5–12 min |
| **PRODIGY** | r ≈ 0.74（蛋白–蛋白）；**小界面接触数少，绝对 Kd 更噪，ΔΔG 排序仍可用** | ~0.5–2 s | ~2–5 min |
| **ThermoMPNN** | r ≈ 0.55–0.60（稳定性 ΔΔG）；**对「结合」为间接指标** | ~1–8 s（视实现与是否批处理） | ~3–15 min |
| **ESM-IF1** | r ≈ 0.45–0.55（稳定性代理）；**非直接结合能** | 首次加载模型 ~10–30 s，之后每突变 ~1–3 s | 首跑 +100 突 ~5–20 min |
| **AntiFold** | CDR 序列兼容性代理，**定性** | 首载 ~5 s，之后每突变 ~0.5–2 s | ~2–8 min |
| **OpenMM MM/GBSA** | r ≈ 0.55–0.65；**单层漏斗里最重、相对最物理** | ~20–90 s（小复合物、~300 步最小化） | ~35 min–2.5 h |

### PAG1 场景下的精度注意点

1. **结构来源**：复合物来自 AF2-Multimer 预测而非晶体；所有能量/统计方法都继承**界面几何误差**，与 SKEMPI2 上报告的 r 相比，实际项目里**不确定性更大**。  
2. **PRODIGY 与小抗原**：界面残基对少，IC/NIS 特征方差大，**不宜过度解读绝对 ΔG/Kd**；更适合与 WT 比 **ΔΔG 趋势**或与 EvoEF2/ThermoMPNN **交叉验证**。  
3. **ThermoMPNN / ESM-IF1 / AntiFold**：主要反映**突变对抗体（或整体）序列–结构合理性 / 稳定性**，**不保证**与结合亲和力单调一致；适合作 **过滤与排序辅助**，不能单独当「亲和力金标准」。  
4. **推荐用法**：PAG1 虚拟扫描用 **EvoEF2 + PRODIGY + ThermoMPNN（+ AntiFold/ESM-IF1）** 做广扫；**MM/GBSA 只对 Top 10–30** 做精算，成本与收益最平衡。

### 与「HER2 截断 MM/GBSA」对比

`openmm_mmgbsa_v5.py` 一类流程针对**大抗原截断**；PAG1 **无需截断**，PDBFixer + 最小化步数相同时，**每个突变体的 MM/GBSA 时间通常短于** VHH–HER2 域 IV 案例，但仍显著慢于 EvoEF2/PRODIGY。

---

## 九、参考文献

| 工具 | 参考文献 |
|------|---------|
| PRODIGY | Vangone & Bonvin, *eLife* 2015; Xue et al., *Bioinformatics* 2016 |
| OpenMM | Eastman et al., *PLOS Comp. Biol.* 2017; AMBER ff14SB: Maier et al. 2015 |
| ESM-IF1 | Hsu et al., *ICML* 2022 |
| ThermoMPNN | Dieckhaus et al., *PNAS* 2024; Megascale: Tsuboyama et al., *Nature* 2023 |
| AntiFold | Høie et al., *bioRxiv* 2024 |
| EvoEF2 | Huang et al., *Bioinformatics* 2020 |
| ProteinMPNN | Dauparas et al., *Science* 2022 |
| SKEMPI2 | Jankauskaitė et al., *Bioinformatics* 2019 |