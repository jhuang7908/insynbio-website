# InSynBio EpiDesignCore — pMHC-TCR 抗原短肽设计标准

**系统全称**: InSynBio EpiDesignCore v1.0  
**所有者**: InSynBio（由项目负责人发起和授权所有变更）  
**状态**: ACTIVE — OWNER-CONTROLLED  
**创建日期**: 2026-04-01  
**当前版本**: 1.0.0  
**平行系统**: InSynBio AbEngineCore v1.0

---

## 一、系统定位

EpiDesignCore 是 InSynBio 免疫表位工程平台的**核心设计引擎**，与 AbEngineCore（抗体工程）平行，共同构成 InSynBio 生物治疗设计平台的两翼。

```
InSynBio 生物治疗设计平台
├── AbEngineCore          ← 抗体工程（VH/VL 人源化、VHH 人源化、CMC评估）
└── EpiDesignCore         ← 免疫表位工程（pMHC-TCR 短肽设计、抗原呈递模拟）
```

### 1.1 EpiDesignCore 模块构成

| 模块 | 描述 | 核心工具 | 状态 |
|------|------|---------|------|
| **PeptideDesigner** | HLA class-I 结合短肽从头设计（8-11 aa） | AfDesign / BindCraft | ACTIVE |
| **pMHC-Validator** | HLA 结合亲和力验证与过滤 | MHCflurry / NetMHCpan | ACTIVE |
| **TCR-Assessor** | TCR 识别潜力评估 | NetTCR / PRIME | ACTIVE |
| **EpiDock** | 短肽-pMHC / 三元复合物对接验证 | HADDOCK3 | ACTIVE |
| **EpiEnergy** | 短肽结合能精确计算 | OpenMM MM/GBSA | ACTIVE |

### 1.2 与 AbEngineCore 的边界划分

| 维度 | AbEngineCore | EpiDesignCore |
|------|-------------|---------------|
| 目标分子 | 抗体（VH/VL、VHH） | 短肽（8-11 aa）、T 细胞表位 |
| 靶点 | 蛋白抗原（表面） | HLA 沟槽 + TCR 接触面 |
| 设计方法 | CDR 人源化、定点突变成熟 | 从头序列生成、三元复合物优化 |
| 免疫机制 | B 细胞 / 抗体介导 | T 细胞 / MHC-I 介导 |
| 主要工具 | EvoEF2, ThermoMPNN, AntiFold | AfDesign, BindCraft, MHCflurry |

---

## 二、生物学框架

### 2.1 HLA class-I 呈递机制（设计基础）

```
胞质蛋白酶体降解
      ↓
8-11 aa 短肽
      ↓
TAP 转运至内质网
      ↓
HLA class-I 沟槽装载
  ├── P2 anchor → B pocket（HLA allele 特异性）
  ├── P9 anchor → F pocket（C端固定）
  └── P4-P8    → 暴露于沟槽上方（TCR 接触面）
      ↓
pMHC 复合物运输至细胞表面
      ↓
TCR αβ 识别 pMHC（CDR3α + CDR3β 主要接触 P4-P8）
      ↓
CD8+ T 细胞激活 → 细胞毒性免疫应答
```

### 2.2 肽位置功能图

```
位置：  P1   P2   P3   P4   P5   P6   P7   P8   P9
        |    |    |    |    |    |    |    |    |
角色： 末端  锚定  接头  ←——— TCR 接触面 ———→  锚定
        |    ↓         |                       ↓
        |  B pocket    |                    F pocket
        |  (HLA固定)   |                    (HLA固定)
        |              ↓
        |         AfDesign 可设计区域（P3-P8）
        |
        ↓ P1 N端（通常Tyr/Gly/Met）

设计自由度分配：
- P2, P9: 由 HLA allele 约束（anchor 固定，低自由度）
- P1:     弱约束（N端偏好 Tyr/Gly/Met）
- P3-P8:  高自由度（主要 TCR 识别面，AfDesign 优化重点）
```

### 2.3 支持的 HLA Allele 与 Anchor 规则

| HLA Allele | 人群频率 | P2 偏好 | P9 偏好 | 参考 PDB |
|-----------|---------|---------|---------|---------|
| **A\*02:01** | ~40%（欧洲） | Leu, Met, Val | Val, Leu | 1OGA, 3MRE |
| **A\*01:01** | ~16% | Thr, Ser | Tyr | 1W72 |
| **A\*03:01** | ~14% | Val, Leu | Lys, Arg | 1FZK |
| **A\*24:02** | ~20%（亚洲） | Tyr, Phe | Phe, Leu | 1AHO |
| **B\*07:02** | ~12% | Pro | Leu | 1IPF |
| **B\*35:01** | ~8% | Pro | Tyr/Phe | 1A1M |

> **默认优先选用 HLA-A\*02:01**：人群覆盖率最高、晶体结构最丰富（PDB > 1000 条 pMHC 结构）、公共 TCR 数据库最完整。

---

## 三、三元复合物参考结构库

每次运行 EpiDesignCore 前，必须从以下列表选择参考结构：

| PDB | 肽序列 | HLA | TCR | 来源 / 疾病 | 推荐用途 |
|-----|--------|-----|-----|------------|---------|
| **1AO7** | LLFGYPVYV | A\*02:01 | A6 | HTLV-1 Tax | 经典体系，设计基准 |
| **2NX5** | GILGFVFTL | A\*02:01 | JM22 | 流感 M1 | 高亲和力参考 |
| **3QEU** | NLVPMVATV | A\*02:01 | RA14 | CMV pp65 | 病毒抗原 |
| **1BD2** | LLFGYPVYV | A\*02:01 | B7 | HTLV-1 Tax | 多 TCR 比较 |
| **4MNQ** | ELAGIGILTV | A\*02:01 | 1G4 | 肿瘤 NY-ESO-1 | 肿瘤抗原 |
| **5HHN** | SIINFEKL | H-2Kb | OT-I | OVA（鼠） | 鼠模型验证 |

---

## 四、Phase 工作流

EpiDesignCore 的完整设计流程分为五个阶段，**必须按顺序执行，不可跳过**。

### Phase 1：靶点定义与结构准备

**目标**：确定 HLA allele、目标 TCR（如有）、下载参考结构

**必执行步骤：**

```
1.1  确定 HLA allele（默认 HLA-A*02:01）
1.2  确定设计模式：
     - Mode A：仅 HLA 结合设计（无 TCR 约束）
     - Mode B：三元复合物设计（固定 TCR + HLA，设计肽）
     - Mode C：序贯设计（先 HLA，再 TCR 优化）
1.3  下载 / 准备参考 PDB：
     - HLA apo 结构（Mode A 用）
     - TCR:pMHC 三元复合物（Mode B/C 用）
1.4  PDB 预处理：
     - 去除水分子（HETATM HOH）
     - 保留关键配体（若有）
     - 链命名规范化：A=HLA α链, B=β2m, C=肽, D=TCR α, E=TCR β
1.5  记录参考肽序列与 anchor 位置
```

**交付物**：`phase1_target_definition.json`（含 allele、PDB、链分配、设计模式）

---

### Phase 2：AfDesign / BindCraft 序列生成

**目标**：生成 100-500 条候选肽序列

#### 2A：Mode A — HLA Binder 设计

```python
from colabdesign import mk_afdesign_model

model = mk_afdesign_model(protocol="binder")
model.prep_inputs(
    pdb="HLA_A0201_apo.pdb",
    chain="A",                 # HLA alpha chain
    binder_len=9,              # 9-mer 为 HLA-A*02:01 最优
    hotspot="7,24,45,59,63,66,70,74,77,80,84,97,99,114,116,147,152,156,159,163,167,171"
    # HLA-A*02:01 沟槽关键残基（Kabat/PDB 编号）
)

# Anchor 约束（P2=Leu/Met, P9=Val/Leu for A*02:01）
model.opt["fix_seq"] = {1: "L", 8: "V"}  # 0-index: pos1=P2, pos8=P9

model.design_3stage(
    soft=100, temp=1.0,    # 阶段1：软约束探索
    hard=100, temp=0.1,    # 阶段2：硬约束收敛
    soft_=100, temp=0.01   # 阶段3：精化
)
```

#### 2B：Mode B — 三元复合物 Partial 设计

```python
model = mk_afdesign_model(protocol="partial")
model.prep_inputs(
    pdb="1AO7.pdb",            # TCR:pMHC 三元复合物
    chain="C",                  # 肽链（C链）
    rm_extra_seq=True
)

# 固定 TCR 链（D,E）和 HLA 链（A,B），只设计肽（C链）
model.prep_partial(
    rm_aa="C",                  # 清除 C 链序列（肽），从头生成
    fix_pos=[0, 1, 8],          # 固定 P1,P2,P9（anchor 位置）
)

model.design_3stage(soft=200, temp=1.0, hard=200, temp=0.1, soft_=100, temp=0.01)
```

#### 2C：生成多样性候选集

```python
# 运行 N 次独立优化，收集多样序列
candidates = []
for seed in range(100):           # 100 次独立运行
    model.restart(seed=seed)
    model.design_3stage(...)
    seq = model.get_seqs()[0]
    score = model.get_loss()
    candidates.append({"seq": seq, "af_score": score, "seed": seed})

# 保存候选集
import json
with open("phase2_candidates.json", "w") as f:
    json.dump(candidates, f, indent=2)
```

**阶段质量门控（Gate 2）：**

| 指标 | 阈值 | 动作 |
|------|------|------|
| AF2 pLDDT（肽区域） | ≥ 70 | < 70 → 丢弃 |
| AF2 ipTM（肽-HLA界面） | ≥ 0.5 | < 0.5 → 丢弃 |
| 序列多样性（NW 相似度） | < 90% 相似于已知已设计肽 | > 90% → 标记为冗余 |
| 候选数量 | ≥ 50 条通过 | < 50 → 降低阈值或增加采样 |

**交付物**：`phase2_candidates.json`（≥ 50 条，含序列、AF2 分数）

---

### Phase 3：HLA 结合亲和力验证（pMHC-Validator）

**目标**：用 NetMHCpan / MHCflurry 过滤强结合肽

#### 3.1 MHCflurry（本地运行，推荐）

```python
from mhcflurry import Class1PresentationPredictor

predictor = Class1PresentationPredictor.load()

# 批量预测
peptides = [c["seq"] for c in candidates]
result = predictor.predict(
    peptides=peptides,
    alleles=["HLA-A*02:01"] * len(peptides),
    include_affinity_percentile=True
)

# 过滤
strong_binders = result[result["affinity_percentile"] < 0.5]   # Rank < 0.5% = 强结合
weak_binders   = result[result["affinity_percentile"] < 2.0]   # Rank < 2.0% = 弱结合
```

#### 3.2 过滤标准

| 分级 | Rank（%） | 亲和力（nM） | 处理 |
|------|----------|------------|------|
| **强结合（SB）** | < 0.5% | < ~50 nM | ✅ 进入 Phase 4 |
| **弱结合（WB）** | 0.5-2.0% | 50-500 nM | ⚠️ 保留备用 |
| **非结合（NB）** | > 2.0% | > 500 nM | ❌ 丢弃 |

**阶段质量门控（Gate 3）：**
- 强结合候选数量 ≥ 20 条，才可进入 Phase 4
- 若 SB < 20：返回 Phase 2，调整 anchor 约束或增加采样

**交付物**：`phase3_hla_filtered.csv`（含序列、Rank%、预测亲和力）

---

### Phase 4：TCR 识别潜力评估（TCR-Assessor）

**目标**：从 HLA 结合肽中筛选 TCR 可识别候选

#### 4.1 工具选择

| 工具 | 方法 | 是否需要目标 TCR | 安装 |
|------|------|----------------|------|
| **NetTCR-2.2** | 序列 + pan-allele | 否（泛 TCR 打分） | `pip install nettcr` |
| **PRIME** | 肽免疫原性 | 否 | web / local |
| **ERGO-II** | TCR-epitope 匹配 | 需要 TCR CDR3 序列 | GitHub |
| **NetMHC-Immunogenicity** | HLA 提呈免疫原性 | 否 | DTU web |

#### 4.2 无目标 TCR 的通用打分（推荐）

```python
# 方案1：用 PRIME 评估肽的免疫原性
# 基于 pMHC 稳定性 + T细胞激活模型

# 方案2：检查肽的 TCR 接触面属性
# 规则：P4-P8 区域偏好带电/芳香族氨基酸（TCR CDR3 偏好互作）

def tcr_contact_score(peptide):
    """简化 TCR 接触面打分（P4-P8）"""
    tcr_face = peptide[3:8]  # P4-P8（0-index）
    preferred = set("RKDEFYWH")  # TCR CDR3 偏好接触的氨基酸
    score = sum(1 for aa in tcr_face if aa in preferred) / len(tcr_face)
    return score

# 方案3：与 VDJdb 公共 TCR 数据库比对
# 下载 VDJdb（https://vdjdb.cdr3.net/）
# 用 BLAST/Smith-Waterman 比对 P4-P8 与已知 TCR 表位
```

#### 4.3 有目标 TCR 的精准打分

```python
# 当已知目标 TCR 序列（来自 VDJdb / 实验数据）时
# 使用 ERGO-II 预测 TCR-epitope 结合概率

tcr_cdr3a = "CAVSDSNYQLIW"   # TCR α CDR3
tcr_cdr3b = "CASIRSSYEQYF"  # TCR β CDR3

# 运行 ERGO-II
ergo_score = predict_tcr_binding(
    cdr3a=tcr_cdr3a,
    cdr3b=tcr_cdr3b,
    epitope=peptide,
    mhc="HLA-A*02:01"
)
```

**阶段质量门控（Gate 4）：**

| 指标 | 阈值 | 动作 |
|------|------|------|
| TCR 接触面打分（P4-P8） | ≥ 0.4 | < 0.4 → 降级至备用列表 |
| PRIME / NetTCR 分数 | 前 50% 分位 | 后 50% → 丢弃 |
| 无自身肽同源性 | < 70% 相似于人自身肽（hPepDB） | ≥ 70% → 标记免疫耐受风险 |

**交付物**：`phase4_tcr_filtered.csv`（含序列、HLA rank、TCR 打分、综合排名）

---

### Phase 5：结构验证与能量精筛（EpiDock + EpiEnergy）

**目标**：对 Top-20 候选肽进行结构级验证

#### 5.1 HADDOCK3 对接验证（EpiDock）

**设置方法（基于 Mode 选择）：**

```toml
# 短肽 × HLA 对接配置（pMHC_dock.cfg）
run_dir = "run_pMHC"

[topoaa]
mol1 = "HLA_A0201.pdb"           # HLA（无肽）
mol2 = "designed_peptide.pdb"    # 候选肽（用 RDKit/obabel 生成 3D）

[rigidbody]
sampling = 500                    # 肽小分子，增加采样
epsilon = 10.0

[flexref]
# 允许肽骨架柔性（肽不同于蛋白，骨架需要松弛）
ligand_mol_fix = false

[emref]
# 能量最小化

[clustfcc]
clust_cutoff = 0.7

[seletopclusts]
top_models = 4
```

**AIR 文件（方向性约束）：**

```
# pMHC_air.tbl — HLA-A*02:01 × 9-mer
# 强制 P2 进入 B pocket，P9 进入 F pocket
assign (segid A and resi 7 and name ND2)  # Asn7 of HLA-A (B pocket)
       (segid B and resi 2)               # P2 of peptide
       2.0 2.0 0

assign (segid A and resi 116 and name O)  # HLA F pocket 关键残基
       (segid B and resi 9)               # P9 of peptide
       2.0 2.0 0
```

#### 5.2 MM/GBSA 结合能计算（EpiEnergy）

```python
# OpenMM MM/GBSA 计算短肽-HLA 结合能
# 复用 affmat 环境中已有的 OpenMM 配置

from scripts.affinity_maturation.mmgbsa_calc import compute_mmgbsa

result = compute_mmgbsa(
    complex_pdb="pMHC_complex_top1.pdb",
    ligand_chain="C",     # 肽链
    receptor_chains=["A", "B"],  # HLA α + β2m
    n_frames=100
)
# result["dG_bind"] = 结合自由能（kcal/mol）
# 参考：HLA 高亲和力肽 ΔG ≈ -8 ~ -12 kcal/mol
```

**阶段质量门控（Gate 5）：**

| 指标 | 阈值 | 动作 |
|------|------|------|
| HADDOCK score | < -20（肽-HLA） | ≥ -20 → 标记低可信 |
| MM/GBSA ΔG | < -6 kcal/mol | ≥ -6 → 丢弃 |
| P2/P9 anchor 接触确认 | 两个 anchor 均在口袋内 | 否 → 调整 AIR 重跑 |
| 肽骨架构型 | 伸展型（extended）占主导 | 非伸展 → 预警 |

**交付物**：`phase5_structural_validated.csv` + Top-5 对接姿态 PDB 文件

---

## 五、完整筛选漏斗

```
Phase 2 输出     Phase 3 输出      Phase 4 输出      Phase 5 输出
    ↓                 ↓                 ↓                 ↓
AfDesign/BindCraft  MHCflurry         TCR-Assessor     HADDOCK3 + MM/GBSA
生成 500 条候选  →  保留 50-100 条  →  保留 20-30 条  →  验证 Top 5-10 候选
                    (Rank < 0.5%)      (TCR score 前50%)  (ΔG < -6 kcal/mol)

最终输出：
  - EpiDesignCore_Report_Client.md   （客户交付报告）
  - EpiDesignCore_Report_Dev.md      （内部技术报告）
  - Top5_candidates.fasta             （候选肽序列）
  - Top5_pMHC_structures/            （对接姿态 PDB）
```

---

## 六、工具依赖与环境

### 6.1 环境清单

| 工具 | 环境 | 安装方式 | 用途 |
|------|------|---------|------|
| **ColabDesign / AfDesign** | `haddock3`（WSL） | `pip install git+https://github.com/sokrypton/ColabDesign.git` | Phase 2 序列生成 |
| **BindCraft**（推荐替代 AfDesign） | 独立 env | `git clone https://github.com/martinpacesa/BindCraft` | Phase 2 增强版 |
| **MHCflurry 2.0** | `affmat` | `pip install mhcflurry && mhcflurry-downloads fetch` | Phase 3 HLA 验证 |
| **NetMHCpan 4.1** | WSL | DTU 官网下载（学术免费） | Phase 3 备选验证 |
| **NetTCR-2.2** | `affmat` | `pip install nettcr` | Phase 4 TCR 评估 |
| **HADDOCK3** | WSL（已有） | 已配置 | Phase 5 对接 |
| **OpenMM** | `affmat`（已有） | 已配置 | Phase 5 能量 |
| **RDKit / OpenBabel** | `affmat` | `conda install -c conda-forge rdkit openbabel` | 肽 3D 结构生成 |

### 6.2 当前工作区工具覆盖状态

```
D:\InSynBio-AI-Research\Antibody_Engineer_Suite\
├── tools/
│   ├── EvoEF2_src/          ✅（AbEngineCore 共用）
│   ├── ThermoMPNN/          ✅（AbEngineCore 共用）
│   ├── AntiFold/            ✅（AbEngineCore 共用）
│   └── ProteinMPNN/         ✅（AbEngineCore 共用）
│
├── [待安装 for EpiDesignCore]
│   ├── ColabDesign/         ⬜ pip install (WSL)
│   ├── BindCraft/           ⬜ git clone (WSL)
│   └── mhcflurry_models/    ⬜ mhcflurry-downloads fetch (affmat)
│
└── scripts/
    └── epi_design/          ⬜ 待创建（EpiDesignCore 脚本目录）
```

---

## 七、设计模式决策树

```
用户输入
│
├── 已知目标 TCR（有 CDR3 序列或结构）？
│   ├── 是 → Mode B（三元复合物 partial 设计）
│   │         + Phase 4 使用 ERGO-II 精准打分
│   └── 否 → 继续 ↓
│
├── 有已知结合肽需要优化（活性成熟）？
│   ├── 是 → Mode C 序贯（固定 P2/P9，优化 P3-P8）
│   └── 否 → Mode A（从头 HLA binder 设计）
│
├── HLA Allele 指定？
│   ├── 指定 → 按 §2.3 选择 anchor 约束
│   └── 未指定 → 默认 HLA-A*02:01
│
└── 肽长度？
    ├── 9-mer → HLA-A 最优（anchor P2/P9）
    ├── 8-mer → HLA-B 常见（P2/P8 anchor）
    └── 10/11-mer → 需调整 anchor 位置（P2/P10 或 P2/P11）
```

---

## 八、已知局限与替代策略

| 局限 | 原因 | 替代方案 |
|------|------|---------|
| AfDesign 对短肽收敛慢 | AF2 对 < 10 aa 独立预测质量低 | 在 pMHC 上下文中运行（Mode B > Mode A） |
| AF2 对 TCR:pMHC 三元复合物精度有限 | AF2 非专门为 pMHC-TCR 训练 | 用 AlphaFold3 server 或 RFdiffusion 验证 |
| NetTCR 对罕见表位泛化差 | 训练数据偏向常见病毒表位 | 补充 PRIME + VDJdb 同源比对 |
| MM/GBSA 未计熵贡献 | 隐式溶剂模型 | 加入 MD 采样（NVT 200 ns）后 MM/GBSA |

---

## 九、治理规则（平行于 AbEngineCore）

### 9.1 所有者权限
- ✅ 发起版本升级请求
- ✅ 审批并合并规则变更
- ✅ 增减核心锁定文件清单
- ✅ 授权 AI 执行特定修改任务

### 9.2 AI 默认权限
- ✅ 按现行流程执行 Phase 1-5
- ✅ 读取所有配置文件用于分析
- ✅ 生成报告、运行过滤、提出建议
- ✅ 在 `projects/` 目录下创建项目文件
- ❌ **禁止修改核心锁定文件**
- ❌ **禁止跳过任何阶段门控（Gate 2-5）**
- ❌ **禁止绕过 HLA 亲和力验证直接输出候选肽**
- ❌ **禁止混用 AbEngineCore 和 EpiDesignCore 的打分标准**

### 9.3 核心锁定文件（LOCKED FILES）

以下文件未经所有者明确指令，AI 不得修改：

- `docs/EPIDESIGNCORE_STANDARD_V1.0.md` — 本文件
- `config/epidesigncore_config.json`（待创建）— 系统配置
- `config/hla_anchor_rules.json`（待创建）— HLA anchor 规则库

---

## 十、版本历史（CHANGELOG）

| 日期 | 版本 | 变更内容 | 授权人 |
|------|------|---------|--------|
| 2026-04-01 | v1.0.0 | 系统初始化：EpiDesignCore 框架建立，Phase 1-5 工作流，五模块定义，与 AbEngineCore 边界划分 | InSynBio |

---

## 十一、快速参考卡（Quick Reference）

### 9-mer 肽设计（HLA-A\*02:01）核心参数

```
肽长度:    9 aa
Anchor:   P2 = Leu/Met/Val（B pocket）
          P9 = Val/Leu/Ile（F pocket）
TCR面:    P4-P8（高自由度，AfDesign 优化重点）
HLA PDB:  1OGA（apo），3MRE（有肽参考）
TCR PDB:  1AO7（Tax/A6），2NX5（流感/JM22）

MHCflurry 过滤: Rank < 0.5% = 强结合
MM/GBSA 目标:  ΔG < -6 kcal/mol
```

### Phase 耗时估算

| Phase | 任务 | 估算耗时 |
|-------|------|---------|
| Phase 1 | 靶点定义 + PDB 准备 | 30 min |
| Phase 2 | AfDesign × 100 runs | 2-4 h（GPU）/ 8-16 h（CPU） |
| Phase 3 | MHCflurry 批量预测 | < 5 min（500 条） |
| Phase 4 | NetTCR + VDJdb 比对 | 15-30 min |
| Phase 5 | HADDOCK3 Top-20 对接 | 2-6 h（已有 WSL 环境） |
| 报告生成 | EpiDesignCore 报告 | 30 min |
| **总计** | **完整流程** | **约 1-2 天** |

---

*本文件受 EpiDesignCore 治理约束，未经所有者授权不得修改。*  
*系统平行关系：EpiDesignCore v1.0 ‖ AbEngineCore v1.0*
