# Germline 选择两阶段实现计划

## 目标

将 germline 选择拆分成两个阶段：
- **Stage 1**: 从 scaffold 库中选择最佳 scaffold
- **Stage 2**: 基于选中的 scaffold，生成 SAFE_A/B/C 三个固定工程化版本

## 实现步骤

### 1. 修改 Step 3：加载 Scaffold 库（而不是 SAFE 模板库）

- 修改 `step3_load_germline_library` 或创建新的 `step3_load_scaffold_library`
- 加载 `human_vh3_scaffolds.json`
- 返回 scaffold 数据和 provenance

### 2. Stage 1：Scaffold 选择

创建新函数：
- `stage1_select_best_scaffold()`
  - 输入：目标 VHH 的 IMGT 编号、scaffold 库
  - 对每个 scaffold 的 consensus 序列进行 IMGT 编号
  - 与目标 VHH 进行比对（IMGT position-level FR identity，mask CDR）
  - 输出：top10 scaffolds, selected_scaffold, region_counts/mismatches

JSON 输出：
- `scaffold_library_provenance`
- `scaffold_alignment_provenance`
- `scaffold_ranked_top10`
- `scaffold_selected`

### 3. Stage 2：SAFE A/B/C 生成

创建新函数：
- `stage2_generate_safe_variants()`
  - 输入：selected_scaffold
  - 对选中的 scaffold 应用 SAFE_A/B/C 工程化规则
  - 生成三个固定版本（不做再比对）
  - 输出：每个版本的 template_id, FR-only 序列, diff_vs_scaffold, physiology_explanations

JSON 输出：
- `safe_strategy_definitions`
- `safe_variants` (A/B/C 三个模板的序列与差异表)
- `safe_variant_explanations`

### 4. 更新主流程

修改 `main()` 函数：
- Step 3: 加载 scaffold 库
- Stage 1: Scaffold 选择
- Stage 2: SAFE A/B/C 生成
- 停止在 germline 选择阶段（不进入后续 CMC/免疫原性/开发性章节）

### 5. 更新报告渲染

修改 `render_md_from_json()`：
- 拆成两部分：Scaffold 选择 + SAFE A/B/C 策略差异
- 明确声明 A/B/C 是"工程化强度选择"，不是再次人源化方案

### 6. 更新审计逻辑

修改 `audit_result.py`：
- 验证 scaffold 库存在与版本（sha256）
- 验证 ANARCII + IMGT 编号 provenance
- 验证 scaffold 比对是 IMGT position-level
- 验证 safe_variants 的 diff_vs_scaffold 与序列一致（可反向复现）

## 关键函数签名

```python
def stage1_select_best_scaffold(
    target_numbering_rows: List[Dict[str, Any]],
    target_boundaries: Dict[str, List[int]],
    scaffold_library: List[Dict[str, Any]],
    min_length: int = 70,
) -> Dict[str, Any]:
    """
    Stage 1: 从 scaffold 库中选择最佳 scaffold
    
    Returns:
        {
            "scaffold_library_provenance": {...},
            "scaffold_alignment_provenance": {...},
            "scaffold_ranked_top10": [...],
            "scaffold_selected": {...}
        }
    """

def stage2_generate_safe_variants(
    selected_scaffold: Dict[str, Any],
    scaffold_numbering: Dict[str, Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Stage 2: 基于选中的 scaffold 生成 SAFE_A/B/C 三个固定工程化版本
    
    Returns:
        {
            "safe_strategy_definitions": {...},
            "safe_variants": {
                "SAFE_A": {...},
                "SAFE_B": {...},
                "SAFE_C": {...}
            },
            "safe_variant_explanations": {...}
        }
    """
```

## 注意事项

1. **Scaffold 库格式**：`human_vh3_scaffolds.json` 是列表，每个元素包含 `scaffold_id`, `consensus` (fr1, fr2, fr3, fr4, framework_full), `n_members`, `member_ids`

2. **SAFE 工程化规则**：从 `SAFE_PLAN_DEFINITIONS` 获取，需要基于完整框架序列进行 IMGT 编号才能准确定位 FR2 中的位置

3. **不做再比对**：Stage 2 直接生成三个版本，不进行比对选择

4. **证据链完整性**：所有步骤必须有 provenance 和 evidence













