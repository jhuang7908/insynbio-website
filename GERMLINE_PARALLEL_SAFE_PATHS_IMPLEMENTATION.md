# Germline 选择阶段 A/B/C 并行路径实现总结

## 实现目标

按照用户要求，实现 Germline 选择阶段的 A/B/C 三条并行路径，每条路径独立重新运算并给出一个最优模板。

## 核心决策

1. **Germline 选择阶段必须并行给出 A / B / C 三个模板**
2. **每个 SAFE 方案（A、B、C）各自独立重新运算一次**
3. **每个方案只允许一个最优模板**
4. **Germline 选择阶段只做"框架匹配评分"，不做完整人源化评估**
5. **该阶段评分目标：framework compatibility**
6. **不引入免疫原性 / CMC / developability 综合评分**
7. **客户报告默认只对"一个选定模板"做深入分析**
8. **默认分析对象：SAFE_A 的最优模板**

---

## 实现细节

### 1. 硬过滤规则（已存在，保持不变）

在 germline 选择阶段之前，如果序列长度 < MIN_IMGT_VH_LENGTH (70aa)，则：
- ❌ 不进入 germline 排名
- ✅ 单独保存在 `fr_only_templates.json`，用于特殊研究
- ❌ 不参与任何"标准人源化/客户交付"流程

**实现位置**: `filter_imgt_compatible_templates_before_numbering()`

---

### 2. 辅助函数：提取 SAFE 方案

**新增函数**: `extract_safe_plan_from_template_id()`

```python
def extract_safe_plan_from_template_id(template_id: str) -> Optional[str]:
    """
    从 template_id 中提取 SAFE 方案（A/B/C）
    
    模板ID格式: "HUMAN_VH3_SCF_10_SAFE_A"
    返回: 'A', 'B', 'C' 或 None
    """
```

**用途**: 从 template_id 中识别该模板属于哪个 SAFE 方案。

---

### 3. Step 5 修改：支持 SAFE 方案过滤

**修改函数**: `step5_align_target_vs_germlines()`

**新增参数**: `safe_plan_filter: Optional[str] = None`

- 如果提供 `safe_plan_filter`（'A', 'B', 'C'），则只处理该方案的模板
- 如果为 `None`，则处理所有模板（用于并行路径）

**在主流程中**: 调用时传入 `safe_plan_filter=None`，处理所有模板，后续在 Step 6 中按方案分组。

---

### 4. Step 6 重构：并行路径选择

#### 4.1 新增函数：`step6_rank_and_select_best_template_for_safe_plan()`

对单个 SAFE 方案路径进行排序与选择最优模板。

**输入**:
- `candidates`: 该 SAFE 方案的候选列表
- `safe_plan`: SAFE 方案标识（'A', 'B', 'C'）
- `objective`: 优化目标（默认 "maximize_framework_identity"）
- `library_data`: 可选的库数据，用于提取模板的额外信息

**输出**: 该 SAFE 方案的完整选择结果字典，包含：
- `candidate_count`: 候选数量
- `alignment_provenance`: 对齐方法证明
- `ranked_candidates`: 所有候选的排名列表（包含 region_counts）
- `selected`: 选中的最优模板信息（包含 template_id, rank, framework_identity, parent_scaffold, natural_germline_sources）

**评分策略**:
- ✅ 只做 `framework_identity` (IMGT FR-only) 评分
- ❌ 不做免疫原性评分
- ❌ 不做 CMC / developability 综合评分
- ❌ 不做亲和性预测

#### 4.2 新增函数：`step6_parallel_safe_paths_selection()`

并行处理 A/B/C 三条 SAFE 路径，每条路径独立排序并选一个最优模板。

**流程**:
1. 按 SAFE 方案分组候选（A/B/C）
2. 对每个 SAFE 方案独立调用 `step6_rank_and_select_best_template_for_safe_plan()`
3. 返回包含 `SAFE_A`, `SAFE_B`, `SAFE_C` 三个路径的完整结果

**输出结构**:
```json
{
  "germline_selection": {
    "SAFE_A": {
      "candidate_count": 30,
      "alignment_provenance": {
        "scheme": "imgt",
        "method": "anarcii",
        "mask_regions": ["CDR1", "CDR2", "CDR3"]
      },
      "ranked_candidates": [
        {
          "template_id": "HUMAN_VH3_SCF_10_SAFE_A",
          "rank": 1,
          "framework_identity": 0.7544,
          "region_counts": {
            "FR1": {"match": 22, "total": 25},
            "FR2": {"match": 15, "total": 18},
            "FR3": {"match": 30, "total": 39},
            "FR4": {"match": 10, "total": 10}
          }
        }
      ],
      "selected": {
        "template_id": "HUMAN_VH3_SCF_10_SAFE_A",
        "rank": 1,
        "framework_identity": 0.7544,
        "parent_scaffold": "HUMAN_VH3_SCF_10",
        "natural_germline_sources": [
          "IGHV3-23*01",
          "IGHV3-23*04"
        ]
      }
    },
    "SAFE_B": { "...同结构..." },
    "SAFE_C": { "...同结构..." }
  }
}
```

---

### 5. 主流程修改

**修改位置**: `main()` 函数中的 Step 5 和 Step 6

**Step 5 修改**:
- 调用 `step5_align_target_vs_germlines()` 时传入 `safe_plan_filter=None`
- 处理所有符合标准的模板，不按 SAFE 方案过滤

**Step 6 修改**:
- 调用 `step6_parallel_safe_paths_selection()` 替代旧的 `step6_rank_and_select_best_template()`
- 传入所有候选和库数据
- 获得包含 A/B/C 三个路径的完整结果

**向后兼容**:
- 保留旧的 `germline_selection_proof` 和 `germline` 字段
- 默认使用 SAFE_A 的结果填充这些字段（用于向后兼容）

---

### 6. 报告生成修改

**修改函数**: `render_md_from_json()`

**新增内容**:
1. **三个 SAFE 路径的最优模板摘要表**
   - 显示每个路径的：template_id, framework_identity, parent_scaffold, 候选数

2. **默认展开 SAFE_A 的详细结果**
   - 模板ID、排名、Framework Identity
   - Parent Scaffold、Natural Germline Sources
   - Top 10 候选排名
   - 区域匹配详情（FR1/FR2/FR3/FR4）

3. **说明文字**
   - "SAFE_B 与 SAFE_C 作为可选工程化框架已计算，但未在本报告中展开；可按客户需求进行同等深度分析。"

---

## 验收条件

✅ **A/B/C 三个 selected.template_id 必须都存在**

✅ **三条路径必须是独立排序结果**（允许 ID 相同，但必须是"算出来的"）

✅ **Germline 选择阶段唯一评分目标**: `framework_identity` (IMGT FR-only)

✅ **不引入其他评分**: 免疫原性、CMC、developability、亲和性预测

✅ **JSON 结构完整**: `germline_selection` 包含 `SAFE_A`/`SAFE_B`/`SAFE_C` 三个路径的完整结果

✅ **报告显示三个路径摘要，但只展开 SAFE_A**

---

## 文件修改清单

1. **scripts/run_egfr_vhh_end_to_end.py**
   - 新增 `extract_safe_plan_from_template_id()` 函数
   - 修改 `step5_align_target_vs_germlines()` 支持 `safe_plan_filter` 参数
   - 新增 `step6_rank_and_select_best_template_for_safe_plan()` 函数
   - 新增 `step6_parallel_safe_paths_selection()` 函数
   - 保留旧的 `step6_rank_and_select_best_template()` 用于向后兼容
   - 修改 `main()` 函数使用新的并行路径逻辑
   - 修改 `render_md_from_json()` 显示三个路径摘要但只展开 SAFE_A

---

## 使用示例

运行端到端流程：

```bash
python scripts/run_egfr_vhh_end_to_end.py \
    --input projects/EGFR_7D12_VHH/input/EGFR_7D12_VHH.fasta \
    --germline data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json \
    --out projects/EGFR_7D12_VHH/output/
```

**输出 JSON 结构**:
- `germline_selection`: 包含 SAFE_A/SAFE_B/SAFE_C 三个路径的完整结果
- `germline_selection_proof`: 向后兼容字段（使用 SAFE_A 的结果）
- `germline`: 向后兼容字段（使用 SAFE_A 的结果）

**输出报告**:
- 显示三个路径的最优模板摘要表
- 详细展开 SAFE_A 的结果
- SAFE_B 和 SAFE_C 仅作为可选路径说明

---

## 一句话总结

**Germline 选择阶段就是 A/B/C 三条并行"工程化框架选择"，每条路径必须独立重算并给出一个最优模板；这一步只做 IMGT FR 匹配评分，不做人源化或成药性评分。完整评估只对一个选定模板展开，其余作为可选路径保留。**













