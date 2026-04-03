# InSynBio AbEngineCore — 治理宪章

**系统全称**: InSynBio AbEngineCore v1.0  
**所有者**: InSynBio（由项目负责人发起和授权所有变更）  
**状态**: ACTIVE — OWNER-CONTROLLED  
**创建日期**: 2026-02-20  
**当前版本**: 1.1.0

---

## 一、系统定位

AbEngineCore 是 InSynBio 抗体工程平台的**核心规则引擎**，包含：

| 模块 | 描述 | 适用类型 |
|------|------|---------|
| **HumanizationEngine** | VH/VL 人源化五阶段流程（Checklist v4.4） | 人源化抗体 |
| **VHH HumanizationEngine** | VHH Tier系统人源化流程 | 纳米抗体 |
| **AbEvaluator** | 13参数结构评估 + CDR扫描 + 可开发性 | 所有抗体类型 |
| **ChecklistRunner** | 自动执行 checklist_v4_4，不可跳过 | 人源化抗体 |
| **AffinityMaturationEngine** | 6-tool ΔΔG pipeline + HADDOCK3 精修 | 亲和力成熟 |
| **EpiDesignCore** | pMHC-TCR 肽段抗原设计 | 肽段设计 |

**数据基础**: 842条临床治疗性抗体（自然库384 + 工程化库458）

---

## 二、所有权与权限模型

### 所有者权限（仅项目负责人）
- ✅ 发起版本升级请求
- ✅ 审批并合并规则变更
- ✅ 增减核心锁定文件清单
- ✅ 授权 AI 执行特定修改任务
- ✅ 废弃旧版本

### AI 权限（默认状态）
- ✅ 按现行 Checklist 执行人源化流程
- ✅ 读取所有配置文件，用于项目分析
- ✅ 生成报告、运行 QC、提出建议
- ✅ 在项目目录（`projects/`）内创建新文件
- ✅ **向 `EVOLUTION_LOG.md` 追加** `[OBSERVATION]` 或 `[PROPOSAL]` 条目
- ❌ **禁止修改任何核心锁定文件**（见第三节）
- ❌ **禁止自行升级版本号或修改 CHANGELOG**
- ❌ **禁止绕过或跳过 Checklist 任何步骤**
- ❌ **禁止创建与核心规则矛盾的"临时逻辑"**
- ❌ **禁止修改或删除 `EVOLUTION_LOG.md` 中已有条目**（只可追加）

### AI 获得授权后可执行
- 当所有者明确说："**升级**[规则/配置]"或"**修改**[标准/核心文件]"
- 修改必须：记录在 CHANGELOG、更新版本号、通知所有者确认

---

## 三、核心锁定文件清单（LOCKED FILES）

以下文件 **未经所有者明确指令，AI 绝对不得修改**：

### 配置文件（Config）
- `config/vh_vl_humanization_v44.json` — VH/VL 人源化规则 V4.4
- `config/vh_vl_humanization_v43.json` — V4.3（历史存档）
- `config/tier_system_config.json` — VHH Tier 系统配置
- `config/abenginecore_registry.json` — 版本注册表

### 标准文档（Standards）
- `docs/ABENGINECORE_GOVERNANCE.md` — 本文件
- `docs/VH_VL_HUMANIZATION_STANDARD_V4.4.md`
- `docs/VH_VL_HUMANIZATION_STANDARD_V4.3.md`
- `docs/VHH_HUMANIZATION_DESIGN_STANDARD.md`
- `docs/VIRTUAL_AFFINITY_MATURATION_STANDARD.md`
- `docs/EPIDESIGNCORE_STANDARD_V1.0.md`
- `docs/STANDARDS_INDEX.md`
- `docs/CURSOR_REPORT_ENGINE_V3.md`

### 数据基础（Data — 只读）
- `data/humanization_assay/` — 全目录（842条临床抗体分析结果）

### 核心脚本（Core Scripts）
- `scripts/structure_metrics_humanization.py`
- `scripts/ml_vernier_analysis.py`
- `core/structure/affinity_energy_toolkit.py` — VAM 统一 API

### 追加专用文件（APPEND-ONLY）
- `docs/EVOLUTION_LOG.md` — Agent 学习日志（可追加，不可改/删已有条目）

---

## 三-B、进化机制（Evolution Protocol）

AbEngineCore 允许 AI 从案例分析中学习，但**所有学习必须经过提案→审批流程**，不得直接修改标准。

### 文件分类

| 分类 | 标记 | Agent 权限 | 含义 |
|------|------|-----------|------|
| 🔒 LOCKED | frozen | 只读 | 标准、配置、治理文件 |
| 📝 APPEND-ONLY | learnable | 追加 | Evolution Log |
| ⚙️ TUNABLE | via-proposal | 提案后执行 | 工具阈值、场景参数 |
| 🔧 PROJECT | free | 自由 | 项目文件、delivery |

### 进化流程（四步）

```
┌─────────────────────────────────────────────────────┐
│  案例分析过程中，Agent 发现规则可优化              │
│                                                     │
│  Step 1: OBSERVE                                    │
│    → 向 EVOLUTION_LOG.md 追加 [OBSERVATION]         │
│    → 记录来源案例、观察内容、影响范围              │
│    → 状态: LOGGED                                   │
│                                                     │
│  Step 2: PROPOSE (如需修改标准)                     │
│    → 向 EVOLUTION_LOG.md 追加 [PROPOSAL]            │
│    → 写明建议修改、目标文件、预期效果              │
│    → 状态: PROPOSED                                 │
│    → ⚠️ 此时不得修改任何 LOCKED 文件                │
│                                                     │
│  Step 3: APPROVE (所有者审批)                       │
│    → 所有者说"批准"/"升级"/"确认执行"              │
│    → Agent 将条目状态改为 APPROVED                  │
│                                                     │
│  Step 4: EXECUTE                                    │
│    → Agent 执行修改（含版本号更新 + CHANGELOG）     │
│    → 将条目状态改为 EXECUTED                        │
│    → 必须同步更新 STANDARDS_INDEX 版本历史          │
└─────────────────────────────────────────────────────┘
```

### 自动学习场景

以下情况 Agent **应当主动**记录 `[OBSERVATION]`（无需等待所有者指令）：
- 某工具在特定抗原/抗体场景下性能显著偏离预期（如 PRODIGY 对短肽失效）
- 两工具的相关性或不一致性超出标准预期
- 新的 PDB 解析问题或兼容性 bug
- 计算耗时与标准中记录的基准差异 >50%
- HADDOCK3 或 AF2 配置需要场景特异性调整

以下情况 Agent **必须写 `[PROPOSAL]` 而非直接修改**：
- 修改任何 ΔΔG 阈值（如 ThermoMPNN 否决阈值从 0.5 改为 0.8）
- 修改场景分类规则（如将 30 aa 阈值改为 50 aa）
- 添加或移除推荐工具
- 修改工作流 Phase 数量或顺序
- 修改 Checklist 任何步骤

---

## 四、升级流程（Owner-Initiated Only）

```
所有者发起请求
    │
    ▼
AI 起草变更方案（Draft PR）
    │  包含：
    │  • 变更内容说明
    │  • 受影响的 Checklist 条目
    │  • 向后兼容性分析
    │  • 建议新版本号
    ▼
所有者审核 + 明确批准（"确认执行"）
    │
    ▼
AI 执行修改
    │  必须同步：
    │  • 更新版本号（semver）
    │  • 写入 CHANGELOG（本文件第五节）
    │  • 更新 abenginecore_registry.json
    │  • 更新 STANDARDS_INDEX.md 版本历史
    ▼
所有者验收确认
```

### 版本号规则（Semantic Versioning）

| 类型 | 版本变化 | 示例 |
|------|---------|------|
| 新增模块或重大规则变更 | Major +1 | v1.0 → v2.0 |
| 现有规则修订/阈值调整 | Minor +1 | v1.0 → v1.1 |
| 文档修正/描述优化 | Patch +1 | v1.0.0 → v1.0.1 |

---

## 五、CHANGELOG（所有者授权变更记录）

| 日期 | 版本 | 变更内容 | 授权人 |
|------|------|---------|--------|
| 2026-04-01 | v1.1.0 | 新增 AffinityMaturationEngine + EpiDesignCore 模块；新增进化机制（§三-B）；EVOLUTION_LOG.md 追加专用文件；锁定文件清单扩展 | InSynBio |
| 2026-02-20 | v1.0.0 | 系统初始化：HumanizationEngine + AbEvaluator + ChecklistRunner 治理框架建立 | InSynBio |

---

## 六、紧急锁定声明

如 AI 在未授权情况下修改了任何核心锁定文件，所有者应：

1. `git diff` 核查变更内容
2. `git checkout -- <file>` 还原锁定文件
3. 在 CHANGELOG 记录事件
4. 强化对应的 Cursor Rule

---

## 七、适用范围

本治理宪章适用于 `D:\InSynBio-AI-Research\Antibody_Engineer_Suite` 工作区内的所有项目，
包括但不限于：VH/VL 人源化、VHH 人源化、全人源化抗体评估、多特异性抗体分析。

**任何新项目必须通过 AbEngineCore 接口调用规则，不得自行重新实现核心逻辑。**

---

*本文件受自身治理约束，未经所有者授权不得修改。*
