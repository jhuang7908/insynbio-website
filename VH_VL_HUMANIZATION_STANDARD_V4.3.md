# VH/VL 抗体人源化设计标准 V4.3
**状态：MANDATORY — 所有 VH/VL 人源化项目必须遵守**  
**版本：4.3 | 日期：2026-02-18**  
**数据基础：458 个工程化治疗抗体结构数据库**  
**⚠️ 与 VHH 流程完全独立，禁止混用**

---

## 0. 流程总览

```
Phase 1  序列分段与 CDR 测定
Phase 2  人类框架筛选（4步协议）
Phase 3  鼠源结构建模 + Vernier 结构计算
Phase 4  回复突变决策 + 序列拼接
Phase 5  质量控制（QC）
```

每个 Phase 不可跳过。结构计算（Phase 3）必须先于回复突变决策（Phase 4）。

---

## Phase 1：序列分段与 CDR 测定

### 1.1 编号工具
- **工具**：Anarcii（IMGT 方案）
- **备用**：anarci_shim（兼容层）

### 1.2 CDR 长度测定（IMGT 定义）

| CDR | IMGT 位置范围 | 用途 |
|-----|------------|------|
| H1  | 27–38      | 框架筛选门槛 |
| H2  | 56–65      | 框架筛选门槛 |
| H3  | 105–117    | 直接移植，不参与框架筛选 |
| L1  | 27–38      | 框架筛选门槛 + VH/VL 夹角决定因素 |
| L2  | 56–65      | 记录用（kappa 链长度不变，不作筛选） |
| L3  | 105–117    | 直接移植，不参与框架筛选 |

### 1.3 CDR 移植边界（Union 并集定义）
移植时采用所有主流定义的并集，确保不遗漏任何抗原接触残基：

| 链 | Union CDR1 | Union CDR2 | Union CDR3 |
|----|-----------|-----------|-----------|
| VH | 26–38（比 IMGT 多保护 pos 26） | 55–65 | 105–117 |
| VL | 27–38 | 56–65 | 105–117 |

**规则**：Union 范围内的所有位点，全部从鼠源移植，禁止人源化突变。

### 1.4 鼠源 Germline 归因
- 使用 V 区序列（截止 IMGT pos 104 的保守 Cys）
- 对比小鼠 IGHV / IGKV / IGLV 数据库，取最高同源性
- 记录 SHM 位点（4B12 与鼠源 germline 的框架区差异）

---

## Phase 2：人类框架筛选（4步协议）

**核心原则**：找到天然能容纳鼠源 CDR、界面稳定的"黄金搭档"。

### 步骤 2.1（硬门槛）：CDR 长度匹配

**规则**：人类 germline 的天然 H1、H2、L1 长度必须与鼠抗**完全一致**。  
**数据源**：`data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json`（VH3 预计算）  
**操作**：单次批量 Anarcii 调用（所有候选一起），结果缓存到 JSON，禁止逐条重复调用。

> **理由**：CDR 长度决定骨架基础，强行改变长度导致 CDR 构象崩塌。

**验证**：查询 `data/humanization_assay/vernier_framework_patterns.json`，确认目标构型 `H1-X|H2-Y|L1-Z` 在 458 数据库中有记录（数量 > 0）。

### 步骤 2.2（优先级）：黄金配对数据库查询

**规则**：优先选择在 458 工程化抗体库中高频出现的 VH/VL 组合。  
**数据源**：`data/humanization_assay/vh_vl_pairing_report.md`

| 等级 | 条件 | 说明 |
|------|------|------|
| **首选** | Natural + Engineered 双高频 | 进化稳定性 + 工程适应性 |
| **次选** | Engineered 高频，Natural 不常见 | 已被临床证明可成药 |
| **禁选** | 两个数据库都没有 | CMC 风险极高 |

**Top 20 黄金配对**（见 `vh_vl_pairing_report.md`）

### 步骤 2.3：Vernier Zone 序列打分

**规则**：Tier 加权打分，优先选择 Vernier 位点天然匹配鼠抗的框架。

| Tier | VH 位点（IMGT） | VL 位点（IMGT） | 权重 |
|------|---------------|---------------|------|
| T1   | 71            | 71            | 3.0× |
| T2   | 2,27,28,29,30,69,93,94 | 36,46  | 2.0× |
| T3   | 48,49,67,73,78 | 2,4,49,69,98  | 1.0× |

打分公式：
- 完全匹配：`weight × 2.0`
- 同理化学类别：`weight × 0.5`
- 不匹配：`0`

> **理由**：Vernier 位点天然匹配 = 零回复突变，活性最稳，结构风险最低。

### 步骤 2.4：框架区序列同源性（CDR 掩蔽）

**规则**：在 Union CDR 掩蔽后的 FR 区域（FR1+FR2+FR3）计算序列同源性。  
**作用**：Vernier 相同分数下的决定性因素。

### 综合打分公式

```
Combined = Vernier% × 0.6 + FR_identity% × 0.3 + GoldenBonus% × 0.1
```

**输出**：Top-3 VH 候选 + Top-3 VK 候选，供人工确认。

---

## Phase 3：鼠源结构建模 + Vernier 结构计算

### 3.1 结构建模
- **工具**：ImmuneBuilder / ABodyBuilder2
- **输入**：4B12 VH + VL 序列
- **输出**：`.pdb` 文件

### 3.2 必须计算的结构指标

| 指标 | 含义 | 决策关联 |
|------|------|----------|
| **SASA（Å²）** | 每个 Vernier 位点的溶剂可及表面积 | 决定保留/人源化 |
| **Contact Number** | 4.5 Å 内重原子接触数（堆积密度） | 空洞/碰撞检测 |
| **VH/VL 夹角（°）** | VH 与 VL 主轴夹角 | 红线判断基础 |
| **Vernier→CDR 距离（Å）** | 每个 Vernier 位点到最近 CDR 原子距离 | 接触位点保护 |

### 3.3 结构阈值

| 指标 | 保留鼠源 | 可尝试人源 |
|------|---------|-----------|
| SASA | < 20 Å²（深埋）必须保留 | > 50 Å²（充分暴露）可尝试 |
| Contact Number | > 28（高堆积）倾向保留 | < 15（低堆积）可尝试 |
| Dist to CDR | < 4.5 Å（直接接触 CDR）必须保留 | — |

---

## Phase 4：回复突变决策

### 4.1 硬约束（绝对保留鼠源）

1. **Gly/Pro 规则**：Vernier 位点为 G 或 P → 保留（影响骨架构象）
2. **Cys 规则**：涉及二硫键的 Cys → 保留
3. **Tier 1 默认保留**：VH 71、VH 94、VL 71、VL 49
4. **深埋位点**：SASA < 20 Å² → 保留
5. **CDR 直接接触**：Dist to CDR < 4.5 Å → 保留
6. **埋藏盐桥**：成对保留（如 VH94 Arg – H3 Asp）

### 4.2 结构软约束（基于计算结果）

**规则一：VH/VL 夹角红线**
- 条件：鼠抗 L1 ≥ 11，所选人框 L1 ≤ 10（夹角变化 > 5°）
- 决策：**强制保留** VH 71、VH 94、VL 49（界面核心三巨头，协同处理）

**规则二：L1-VL71 绑定**
- 条件：鼠抗 L1 构型 ≠ 所选人框 L1 构型
- 决策：**强制保留** VL 71（VL71 由 L1 长度环境决定，r=0.55）

**规则三：VH 核心模块联动**
- 条件：决定保留 VH 71
- 决策：同步检查 VH 73、VH 78；若鼠源与人源不同，**一并保留**
- 数据：VH71–VH73 相关性 r=0.75，VH71–VH78 r=0.61

**规则四：H2-VH71 修正**
- 条件：鼠抗 H2-10，人框 H2-9
- 决策：保留 VH 71

**规则五：结构拮抗**
- 注意 VH 48 与 VH 67 负相关（r=−0.45），禁止同时引入大体积残基

### 4.3 联动查表

| 若保留/修改此位点 | 必须同步检查 | 原因 |
|----------------|------------|------|
| VH 71 | VH 73, VH 78 | Cluster 1 联动 |
| VL 71 | VL 36 | Cluster 2 联动 |
| VH 48 | VH 67 | 结构拮抗（负相关） |
| VH 94 | VH 93, VL 4 | Cluster 3 / CDR3 根部 |

### 4.4 序列拼接规则

1. 以人类 germline 序列为底
2. Union CDR 范围（Phase 1.3）内，替换为鼠源 CDR
3. 应用回复突变列表（逐点替换）
4. **自检**：验证最终序列中包含完整鼠源 CDR1/CDR2/CDR3（精确字符串匹配）

---

## Phase 5：质量控制（QC）

### 5.1 结构保真度

| 指标 | Pass 标准 | 数据来源 |
|------|---------|---------|
| CDR RMSD | < 0.5 Å（vs 鼠源结构） | ImmuneBuilder 建模 |
| VH/VL 夹角偏差 | < 3°（vs 鼠源结构） | 结构计算 |

### 5.2 Vernier 堆积评分（参考区间来自 458 数据库）

**针对目标构型的 P5–P95 参考区间**（从 `vernier_framework_patterns.json` 实时读取）：

| 位点 | 说明 |
|------|------|
| VH_71 | Contact Number 落在 P5–P95 区间内 = Pass |
| VH_94 | 同上 |
| VL_71 | 同上 |
| VL_49 | 同上 |

- 低于 P5（空洞）：大残基→小残基，结构失稳 → 保留鼠源
- 高于 P95（碰撞）：小残基→大残基，折叠失败 → 保留鼠源

### 5.3 表面性质

| 检查项 | 方法 | 标准 |
|--------|------|------|
| SAP 疏水斑 | SAP 算法 | 无异常大疏水斑 |
| pI | 序列计算 | 记录（无硬阈值，可接受范围 5–9） |

### 5.4 序列化学风险扫描

| 类别 | 位点规则 | 严重程度 |
|------|---------|---------|
| N-糖基化 | N-X-S/T（X≠P）in CDR 或暴露 FR | 高（CDR 中禁止，FR 中警告） |
| 脱酰胺 | NG、NS 连续 | 中 |
| 异构化 | DG、DS 连续 | 中 |
| 氧化风险 | 暴露 Met（SASA>50）、Trp in CDR3 | 中 |
| 游离 Cys | 非二硫键 Cys | 高 |

### 5.5 免疫原性预测（IEDB MHC-II）

1. **工具**：IEDB T-cell epitope prediction API
2. **参数**：27 个高频 HLA-DRB1 alleles，9-mer/15-mer 窗口
3. **去假阳性**：MHC-II 位置聚类过滤
4. **种系过滤**：与人类 germline 100% 匹配的肽段排除（自身肽）
5. **报告**：只报告非种系来源的高分 epitope

---

## 标准参考数据

| 数据文件 | 用途 | 使用 Phase |
|---------|------|-----------|
| `data/humanization_assay/vernier_framework_patterns.json` | CDR 构型验证、P5/P95 参考区间 | 2.1, 5.2 |
| `data/humanization_assay/vh_vl_pairing_report.md` | 黄金配对查表 | 2.2 |
| `data/humanization_assay/vernier_correlation_report.md` | Vernier 共变规则来源 | 4.2 |
| `data/humanization_assay/structure_metrics_summary.json` | 个体抗体结构数据 | 3.2 参考 |
| `data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json` | VH3 预计算编号 | 2.1 |
| `data/germlines/human_ig_aa/IGHV_aa.json` | 全体 VH germline 序列 | 2.1 |
| `data/germlines/human_ig_aa/IGKV_aa.json` | 全体 IGKV germline 序列 | 2.1 |

---

## 合规规则

### 必须做
- ✅ 按 Phase 1→2→3→4→5 顺序执行，不得跳步
- ✅ Phase 2.1 使用预计算缓存，单次批量 Anarcii，结果保存 JSON
- ✅ Phase 2.3 使用 Tier 加权 Vernier 打分
- ✅ Phase 3 必须完成结构建模后才能进行 Phase 4
- ✅ Phase 4 决策必须基于实际计算的 SASA/Contact Number，不得凭经验
- ✅ 生成 `humanization_proposal.json`，人工确认后方可执行拼接
- ✅ Phase 4.4 自检：CDR 精确字符串匹配
- ✅ 参考区间从 `vernier_framework_patterns.json` 实时读取（针对目标构型）

### 禁止做
- ❌ 与 VHH 流程混用任何规则、数据或模块
- ❌ 跳过结构建模直接做回复突变决策
- ❌ 使用经验规则替代结构计算（SASA、Contact Number 必须实算）
- ❌ 对 Union CDR 范围内的位点做人源化突变
- ❌ 单条逐序列调用 Anarcii（性能红线）
- ❌ AI 生成氨基酸序列（只能使用鼠源或人源 germline 中已有的氨基酸）

---

*版本：V4.3 | 生成日期：2026-02-18*  
*基于：Antibody Engineer Suite 458-抗体结构数据库 + ML 分析*  
*配置文件：`config/vh_vl_humanization_v43.json`*
