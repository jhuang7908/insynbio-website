# CMC 设计扩展设计（非 pI 性质）

## 0. SSOT（单一数据源）—— 必须遵守

**每次运行都应有统一的 SSOT**：`projects/<id>_Redesign/<id>_results.json`。

| 数据 | 读取来源 | 写入目标 | 禁止 |
|:---|:---|:---|:---|
| 序列、版本 | `results.json` | `results.json` | 从 `internal/*.json` 或手工文件读入序列 |
| developability（pI、GRAVY、liabilities 等） | 来自 AbEvaluator 的 evaluation → 合并到 `results.developability` | `results.json` | 独立维护 `internal/developability_*.json` 作为输入源 |
| CMC 突变列表 | `results` 中已有突变 + 本次设计产出 | 合并写回 `results.json` | 分散在多个脚本输出中 |

**规则**：
- CMC 设计（pI、liability）**只从** `results.json` 中的 `developability` / `sequences` / evaluation 读取输入。
- 设计产出的序列与突变**必须写回** `results.json`，再由 render/export 导出报告与 internal。
- `internal/developability_{id}.json` 仅为 **export 的派生输出**，不得作为设计的输入源。

## 1. 现状

| 维度 | 当前行为 | 触发条件 |
|:---|:---|:---|
| pI | `design_v3_pi`：FR 内 K/R→Q/E 降 pI | pI > 8.5 时 `fix` 自动触发 |
| GRAVY、instability、净电荷 | 仅评估，报告指标 | — |
| 疏水/电荷斑块 | 仅评估，报告指标 | — |
| liabilities（N-糖基化、脱酰胺、异构化、游离 Cys） | 仅评估 + 5.3 措施建议（突变与实验） | — |

## 2. 扩展目标

将 CMC 设计从「仅 pI」扩展到可自动提议/应用与 liabilities 相关的序列修改，在可控风险下降低化学修饰风险。

## 3. 设计原则

- **FR 优先**：FR 内 liability 位点可自动设计；CDR 内需人工确认 + 结合验证。
- **保守替换**：采用业界常见、文献支持的突变（如 NYS→NQS），避免激进修改。
- **不破坏 CDR 保留**：所有设计必须通过 `verify_cdr_preservation` 硬门。
- **不触碰 Vernier**：与 pI 设计一致，避免影响 CDR 构象。
- **可配置**：按项目/风险偏好选择是否启用 liability 设计，以及 FR-only vs 含 CDR 建议。

## 4. 各 liability 类型的设计规则

| 类型 | 常见模体 | 候选突变 | 位点策略 |
|:---|:---|:---|:---|
| N-glycosylation | NxS/T (x≠P) | N→Q 或 S→T（NYS→NQS 等） | FR：自动设计；CDR：仅建议，需 SPR 验证 |
| deamidation | NG, NS | N→Q 或 S→A | FR：自动设计；CDR：仅建议 |
| isomerization | DG, DS | D→E（保留负电荷） | FR：自动设计；CDR：仅建议 |
| free_Cys_candidate | C | C→S 或 C→A | 需确认非二硫键 Cys；通常仅建议 |

## 5. 模块设计

### 5.1 新增函数 `design_v3_liabilities`

**输入**：liabilities 必须来自 `results.developability.liabilities`（即 evaluation/cdr_scan 产出，SSOT），格式为 `{type, pattern, pos, severity}`；pos 为 VH+VL 串联的 0-based offset，需解析为 chain + Kabat 位点。

```python
def design_v3_liabilities(
    v2_vh: str,
    v2_vl: str,
    mouse_vh_kd: Dict,
    mouse_vl_kd: Dict,
    liabilities: List[Dict],  # from cdr_scan / developability
    fr_only: bool = True,     # 仅修改 FR 内位点
) -> Tuple[str, str, List[Dict[str, Any]]]:
    """
    Apply liability-mitigating mutations where safe (FR-only by default).
    Returns (v3_vh, v3_vl, mutations_list).
    """
```

- 输入：v2 序列、鼠源 Kabat、liabilities 列表。
- 对每条 liability：解析 pattern/pos，映射到 Kabat (chain, pos)。
- 若 `fr_only=True` 且位点在 CDR，跳过或仅加入「建议」列表，不修改序列。
- 若位点在 FR：按上表应用候选突变，验证 CDR 保留后采纳。
- 输出：修改后序列 + 突变列表（含 rationale）。

### 5.2 与 pI 设计的衔接

- **顺序**：先 `design_v3_pi`（若 pI>8.5），再 `design_v3_liabilities`（在 pI 设计后的序列上）。
- **合并**：最终 v3 = v2 + pI 突变 + liability 突变；突变列表合并到报告 5.0 节。

### 5.3 配置项（可选）

在 `vh_vl_humanization_v44.json` 或项目配置中：

```json
{
  "cmc_design": {
    "pi_max": 8.5,
    "liability_design": {
      "enabled": true,
      "fr_only": true,
      "types": ["N-glycosylation", "deamidation", "isomerization"]
    }
  }
}
```

## 6. 触发逻辑（fix 命令）

| 条件 | 行为 |
|:---|:---|
| pI > 8.5 | 执行 `design_v3_pi` |
| 存在 HIGH/MEDIUM liabilities 且 `liability_design.enabled` | 执行 `design_v3_liabilities` |
| 两者都满足 | 先 pI，再 liabilities，合并突变 |

## 7. 实现阶段

| 阶段 | 内容 |
|:---|:---|
| 1 | 实现 `design_v3_liabilities`，支持 FR-only 的 N-glycosylation、deamidation、isomerization |
| 2 | 在 fix 流程中集成，与 pI 设计串联 |
| 3 | 配置项与报告 5.0 合并展示 |
| 4 | （可选）CDR 内 liability 作为「建议突变」输出，不自动应用 |

## 8. 风险与限制

- **CDR 内 liability**：NYS 等在 CDR-H2 中常见，突变可能影响结合；必须实验验证。
- **多 liability 冲突**：同一位点可能涉及多种风险，需优先级规则（如 N-glycosylation > deamidation）。
- **二硫键 Cys**：`free_Cys_candidate` 需排除已配对 Cys，当前 cdr_scan 无法区分，建议不自动设计。
