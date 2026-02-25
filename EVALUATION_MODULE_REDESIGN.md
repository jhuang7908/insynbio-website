# InSynBio Evaluation 模块 — 重新规划

**版本**: v2.0 设计草案  
**日期**: 2026-02-23  
**适用场景**: 全人源化抗体（转基因小鼠/全人库），无鼠抗对照

---

## 一、设计原则变更

| 原设计 | 新设计 |
|--------|--------|
| 人源化 vs 鼠源结构比较（`delta_vs_mouse`） | **移除** — 客户抗体均为全人源化，无鼠抗 |
| 单抗体评估 | 支持**多抗体 vs 同一抗原**的比较评估 |
| 结构驱动亲和力成熟（未实现） | 规划：基于结构的设计工具（内部实现，对外不暴露具体工具名） |
| AI CMC（未实现） | 规划：以评估结果为输入，输出 AI 可开发性/CMC 建议 |

---

## 二、模块结构规划（新）

### 2.1 保留并增强的模块

| 模块 | 用途 | 输入 | 输出 |
|------|------|------|------|
| **structure_13param** | 抗体 Fab 13 参数结构评估 | PDB | VH-VL 夹角、界面、Vernier SASA、pLDDT 等 |
| **developability** | 可开发性/CMC 序列分析 | VH+VL 序列 | pI、GRAVY、SAP、CDR 风险 |
| **cdr_scan** | CDR 化学修饰风险 | 序列 | 脱酰胺、氧化、糖基化等 |
| **germline** | 胚系身份与 842 库检索 | 序列 | 最近胚系、identity%、黄金配对 |
| **binding_site** | 抗原抗体界面解析 | PDB + 抗原链 | BSA、H 键、盐桥、paratope/epitope |
| **immunogenicity** | InSynBio 免疫原性 In silico | 序列 + 可选 PDB | 风险位点、聚类、建议 |

### 2.2 移除的模块

| 模块 | 原因 |
|------|------|
| **delta_vs_mouse** | 客户抗体均为全人源化，无鼠抗对照；不再需要人源化 vs 鼠源结构比较 |

### 2.3 新增模块

#### A. 多抗体 vs 同一抗原比较（`compare_ab_vs_antigen`）

**用途**: 比较多个抗体与**同一抗原**的结合差异，支持竞争/协同/表位区分分析。

| 输入 | 输出 |
|------|------|
| 多个 Ab-Ag 复合物 PDB（同一抗原，不同抗体） | 各抗体 paratope/epitope、epitope 重叠度、BSA/SC 对比、竞争位点分析 |

**典型场景**:
- 多个候选抗体 vs 同一靶点
- 表位分 bin（竞争/非竞争）
- 优先选结合界面更优的候选

#### B. 结构驱动亲和力成熟（`structure_driven_affinity_maturation`）

**用途**: 基于 Ab-Ag 复合物结构，生成序列设计候选（突变建议或重设计序列）。

**实现方式**: 内部调用结构驱动的序列设计工具（如逆向折叠/掩码生成），**对外不暴露具体工具名**（如 ProteinMPNN 等），统一称为「结构驱动亲和力成熟」。

| 输入 | 输出 |
|------|------|
| Ab-Ag 复合物 PDB、设计区域（如 CDR-H3）、固定位点 | 候选突变位点、或重设计序列列表（经可开发性初筛） |

**对外表述**: 结构驱动亲和力成熟服务；**不披露**底层 ProteinMPNN 等工具名。

#### C. AI 可开发性 / CMC 建议（`ai_developability_suggestions`）

**用途**: 以现有评估结果（developability、cdr_scan、binding_site、immunogenicity 等）为输入，生成 AI 驱动的可开发性/CMC 优化建议。

| 输入 | 输出 |
|------|------|
| 已有 evaluation 结果（pI、SAP、CDR 风险、界面指标、免疫原性等） | 优先级排序的 CMC 风险、位点级建议、可选突变方向（结合规则+AI 推理） |

**实现方向**:
- 规则层：基于现有 developability 规则（pI、SAP、CDR 风险）
- AI 层：可选 LLM/规则引擎，将多维度指标整合为可操作建议
- 输出：结构化建议（风险等级、位点、推荐动作）

---

## 三、模块依赖与调用顺序

```
                    ┌─────────────────────┐
                    │  PDB / 序列 / 抗原  │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌──────────────────┐
│structure_13   │    │ developability  │    │ germline         │
│binding_site   │    │ cdr_scan        │    │ immunogenicity   │
└───────┬───────┘    └────────┬────────┘    └────────┬─────────┘
        │                     │                      │
        └─────────────────────┼──────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ ai_developability   │
                    │ _suggestions        │
                    │ (消费上述结果)       │
                    └─────────────────────┘

        ┌─────────────────────────────────────────────┐
        │ compare_ab_vs_antigen                        │
        │ (多 PDB，同一抗原链)                         │
        └─────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────┐
        │ structure_driven_affinity_maturation         │
        │ (Ab-Ag PDB + 设计区域 → 候选序列)            │
        │ 内部工具，对外不披露名称                      │
        └─────────────────────────────────────────────┘
```

---

## 四、CLI / API 调整建议

### 4.1 移除

- `evaluate --type humanized` 中的 `delta_vs_mouse` 模块
- `--ref-pdb` 参数（若仅用于 delta_vs_mouse）

### 4.2 新增

```text
# 多抗体 vs 同一抗原比较
evaluate compare-antigen --antigen AG.pdb --antigen-chain A \
  --ab-pdbs ab1.pdb ab2.pdb ab3.pdb --output comparison.json

# 结构驱动亲和力成熟（不暴露内部工具）
evaluate affinity-design --complex AbAg.pdb --design-region CDR-H3 \
  --fixed-positions fixed.json --num 50 --output candidates.fasta

# AI 可开发性建议（基于已有评估结果）
evaluate ai-cmc-suggestions --eval-result project_eval.json --output suggestions.md
```

### 4.3 保留

- `evaluate --type fully_human`（全人抗体）
- `evaluate --type humanized` 保留类型，但**不再运行** `delta_vs_mouse`，仅运行 structure_13param、developability、germline、immunogenicity 等

---

## 五、实施优先级

| 阶段 | 内容 | 工作量 |
|------|------|--------|
| **P0** | 移除 `delta_vs_mouse`，更新文档与 CLI | 小 |
| **P1** | 实现 `compare_ab_vs_antigen`（复用 interface_metrics） | 中 |
| **P2** | 封装结构驱动亲和力成熟（内部调用现有 tools，对外统一命名） | 中 |
| **P3** | 实现 `ai_developability_suggestions`（规则+可选 LLM） | 中–大 |

---

## 六、对外服务命名（客户-facing）

| 内部模块 | 对外服务名称 |
|----------|--------------|
| `structure_13param` | 抗体结构 13 参数评估 |
| `binding_site` | 抗原抗体界面解析 |
| `compare_ab_vs_antigen` | 多抗体 vs 同一抗原比较 |
| `structure_driven_affinity_maturation` | **结构驱动亲和力成熟**（不披露 MPNN 等工具名） |
| `ai_developability_suggestions` | **AI 可开发性/CMC 建议** |
| `immunogenicity` | InSynBio 免疫原性 In silico Evaluation |

---

## 七、与现有 pipeline 的关系

- **人源化 pipeline**（`run_vhvl_v44_pipeline` / `fix`）：继续用于鼠源→人源化项目；其内部的 delta_vs_mouse 可保留，因该 pipeline 有鼠抗对照。
- **Evaluation 模块**：面向**全人源化抗体客户**，不再提供 delta_vs_mouse；新增多抗体比较、结构驱动亲和力成熟、AI CMC 建议。
