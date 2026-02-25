# InSynBio AbEngineCore — 治理宪章

**系统全称**: InSynBio AbEngineCore v1.0  
**所有者**: InSynBio（由项目负责人发起和授权所有变更）  
**状态**: ACTIVE — OWNER-CONTROLLED  
**创建日期**: 2026-02-20  
**当前版本**: 1.0.0

---

## 一、系统定位

AbEngineCore 是 InSynBio 抗体工程平台的**核心规则引擎**，包含：

| 模块 | 描述 | 适用类型 |
|------|------|---------|
| **HumanizationEngine** | VH/VL 人源化五阶段流程（Checklist v4.4） | 人源化抗体 |
| **VHH HumanizationEngine** | VHH Tier系统人源化流程 | 纳米抗体 |
| **AbEvaluator** | 13参数结构评估 + CDR扫描 + 可开发性 | 所有抗体类型 |
| **ChecklistRunner** | 自动执行 checklist_v4_4，不可跳过 | 人源化抗体 |

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
- ❌ **禁止修改任何核心锁定文件**（见第三节）
- ❌ **禁止自行升级版本号或修改 CHANGELOG**
- ❌ **禁止绕过或跳过 Checklist 任何步骤**
- ❌ **禁止创建与核心规则矛盾的"临时逻辑"**

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
- `docs/STANDARDS_INDEX.md`
- `docs/CURSOR_REPORT_ENGINE_V3.md`

### 数据基础（Data — 只读）
- `data/humanization_assay/` — 全目录（842条临床抗体分析结果）

### 核心脚本（Core Scripts）
- `scripts/structure_metrics_humanization.py`
- `scripts/ml_vernier_analysis.py`

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
