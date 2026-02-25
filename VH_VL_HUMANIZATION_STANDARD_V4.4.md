# VH/VL 抗体人源化设计标准 V4.4（Checklist 优化版）

**状态：MANDATORY — 替代 V4.3 作为当前执行标准**  
**版本：4.4 | 日期：2026-02-18**  
**基础：V4.3 全文有效；本文档为增量修订与 Checklist 扩展**

**⚠️ 与 VHH 流程完全独立，禁止混用**

---

## 与 V4.3 的关系

- **正文规则**：以 [`VH_VL_HUMANIZATION_STANDARD_V4.3.md`](./VH_VL_HUMANIZATION_STANDARD_V4.3.md) 为准，全部保留。
- **本文档**：仅描述 V4.4 新增/修订条目、完整 Checklist 及机器可读配置引用。

**配置文件（权威）**：[`../config/vh_vl_humanization_v44.json`](../config/vh_vl_humanization_v44.json)

---

## V4.4 修订摘要

| 类别 | 修订内容 |
|------|----------|
| **数据质量** | 2.0 胚系序列验证：必须来自 IGHV_aa/IGKV_aa，末端不得含 FR4 |
| **CDR 边界** | CDR3 严格 105–117；FR4 单独管理，禁止用 105–150 等错误上限 |
| **Vernier-CDR 重叠** | 差异表必须含 `in_cdr_union`；Phase 4 对 in_cdr_union=true 位点跳过 BM 决策 |
| **回复突变逻辑** | same-class 位点必须做结构评估，不得仅凭“同类”即接受人源 |
| **VL 声明** | VL 回复突变数=0 时，必须显式声明并逐位说明理由 |
| **QC 扩展** | Phase 5.2b：人源化结构 CDR canonical class 必须与鼠源一致 |
| **L2 说明** | 2.1 硬过滤排除 L2 的原因文档化：kappa CDR2 恒为 7 aa，无区分度 |
| **阈值修正** | CDR RMSD 通过阈值由 0.5 Å 改为 1.5 Å（临床常用） |
| **SAP/IEDB** | SAP 优先结构法；IEDB 需记录 API 状态码；预测质量（pLDDT）需记录 |
| **免疫原性结构增补** | 有结构后须再算一次：用人源化 PDB 做 SASA 表面亲水性过滤，对漏斗底部风险位点做结构验证；序列级 Parker 为首轮，结构级为增补 | **[V4.4 增补]** |
| **骨架回退 (Option A)** | 若自动筛选无法满足理化性质（如 pI > 8.5），允许强制使用金标准骨架（如 IGHV3-23），前提是 CDR 构型兼容（RMSD < 1.5 Å） |

---

## 完整 Checklist（V4.4）

执行时须逐项勾选，报告内须可追溯证据。

### Phase 1

| # | 条目 | 证据/输出 |
|---|------|-----------|
| 1.1 | CDR 识别：IMGT + Kabat + Chothia Union 定义 | CDR1/2/3 范围表，Union 26–38 / 55–65 / 105–117 |
| 1.2 | North canonical class 与 458 库构型匹配 | `cdr_subtype`，`vernier_framework_patterns.json` 记录数 |

### Phase 2

| # | 条目 | 证据/输出 |
|---|------|-----------|
| **2.0** | **胚系序列验证**：序列来自 IGHV_aa.json / IGKV_aa.json；末端无 FR4（无 WGQGT/FGGGT 等） | 序列 ID、长度、末 10 aa 检查 **[NEW V4.4]** |
| 2.1 | CDR 门控：H1/H2/L1 长度严格匹配；**L2 排除**（kappa 恒 7 aa，无筛选信息量） | 通过/排除列表；L2 排除说明 **[L2 说明 V4.4]** |
| 2.2 | 黄金配对：458 库 VH/VL 共现频率 | golden_pair, golden_pair_freq_pct |
| 2.3 | Vernier 打分：T1×3 + T2×2 + T3×1；**每位点标注 in_cdr_union** | vernier_diff_vh/vk，含 in_cdr_union **[V4.4]** |
| 2.4 | FR Identity（Union CDR 掩蔽） | fr_id_pct |
| 2.5 | 人工审核：自反应风险、临床先例 | human_review_decision |
| **2.6** | **Option A (Fallback)**: 若自动筛选结果 pI/免疫原性不达标，可强制选用金标准骨架（如 IGHV3-23），需验证 CDR 构型兼容性（RMSD < 1.5 Å） | fallback_germline_used, cdr_rmsd_check **[V4.4 Strategy]** |

### Phase 3

| # | 条目 | 证据/输出 |
|---|------|-----------|
| 3.1 | 鼠源结构建模（ABodyBuilder2）；**记录预测质量指标（若有）** | 4b12_mouse.pdb；pLDDT/ranking **[V4.4]** |
| 3.2a | VH/VL 夹角 | vh_vl_angle_deg |
| 3.2b | Vernier SASA 逐位 | vernier_sasa |
| 3.2c | Vernier Contact Number 逐位 | vernier_packing |
| 3.2d | Vernier→CDR 最短距离 | vernier_cdr_dist |

### Phase 4

| # | 条目 | 证据/输出 |
|---|------|-----------|
| 4.1 | HC1：鼠源 G/P/C → 保留鼠源 | 决策表 |
| 4.2 | HC1-inv：人源引入新 P → 回复突变 | 决策表（如 VH_69） |
| 4.3 | HC2：Cys 二硫 → 保留 | 决策表 |
| 4.4 | HC4：SASA &lt; 20 → 保留（**含 same-class 位点**） | 决策表 **[V4.4]** |
| 4.5 | HC5：CDR 距离 &lt; 4.5 Å → 保留；**in_cdr_union=true 不触发** | 决策表 **[V4.4]** |
| 4.6 | HC6：深埋盐桥 → 保留 | 决策表 |
| 4.SC1 | SC1：VH/VL 夹角红线（Δ&gt;3° 则强制保留 VH_71 等） | 夹角偏差值 |
| 4.SC2 | SC2：L1→VL_71 类型约束 | VL_71 检查 |
| 4.SC3 | SC3：VH 核心联动（VH_71/73/78） | 联动表 |
| 4.SC4 | SC4：H2 长度→VH_71 类型 | VH_71 检查 |
| 4.SC5 | SC5：VH48/VH67 拮抗 | 若改 VH_48 则查 VH_67 |
| 4.7 | 序列拼接：胚系验证→CDR 移植→BM 应用→**FR4 单独追加** | 最终 VH/VL 序列 **[V4.4]** |
| 4.8 | CDR 自检：鼠源 CDR 序列与人源化序列完全一致 | qc_pass_cdr_integrity |
| **4.9** | **VL 回复突变声明**：显式写出 VL BM 数量（含 0）及每位点处置理由 | vl_bm_count, per_position_reasoning **[NEW V4.4]** |

### Phase 5

| # | 条目 | 证据/输出 |
|---|------|-----------|
| 5.1 | 人源化结构建模（ABodyBuilder2） | humanized_4b12.pdb |
| 5.2 | CDR RMSD &lt; **1.5** Å（每 CDR） | qc_5_2_cdr_rmsd **[阈值 1.5 V4.4]** |
| **5.2b** | **Canonical class 验证**：人源化结构 H1/H2/L1 与鼠源一致 | canonical_class_mouse vs humanized **[NEW V4.4]** |
| 5.3 | VH/VL 夹角偏差 ≤ 3° | qc_5_3_angle |
| 5.4 | Vernier 压缩 P5–P95（WARN 时注明可能为预测偏差） | qc_5_4_packing **[V4.4]** |
| 5.5 | SAP：优先结构法；序列代理时区分 CDR/FR 补丁 | qc_5_5 **[V4.4]** |
| 5.6 | pI Fab 5.5–8.5 | qc_5_6_pI |
| 5.7 | 化学风险位点（建议 SASA 过滤） | qc_5_7_liabilities |
| 5.8 | IEDB MHC-II；**记录 API HTTP 状态码**；有结构时**须再算一次**：用人源化 PDB 做 SASA 表面亲水性过滤，对漏斗底部风险位点做结构验证 | qc_5_8_iedb, iedb_http_status, structure_recompute_sasa **[V4.4]** |

---

## 合规性

- **MUST DO**：按 `config/vh_vl_humanization_v44.json` 中 `compliance_rules.must_do` 执行。
- **MUST NOT DO**：按 `compliance_rules.must_not_do` 禁止。

**版本选择**：新项目以 V4.4 为准；已有 V4.3 项目可沿用至结题，新分析建议升级到 V4.4。
