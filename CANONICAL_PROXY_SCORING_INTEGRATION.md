# Canonical Proxy 评分集成文档

## 概述

Canonical Proxy 评分已成功集成到 scaffold/germline 候选排序系统中，作为额外的排序判别因子。

## 版本信息

- **集成日期**: 2025-12-13
- **版本**: scaffold-ranking-canonical-proxy-v1
- **Germline Asset 版本**: v1_clean

## 配置冻结

### 核心参数（已冻结，不得随意修改）

在 `data/germlines/v1_clean/manifest.json` 中：

```json
{
  "canonical_proxy": {
    "agg_mode": "min",
    "weight": 0.10,
    "formula": "0.6 * percentile + 0.4 * rep_identity",
    "enabled": true
  },
  "scaffold_ranking": {
    "canonical_proxy_enabled": true,
    "germline_asset_version": "v1_clean"
  }
}
```

**重要**：这些参数已冻结，任何修改都需要：
1. 更新 manifest.json 版本号
2. 记录变更原因
3. 重新验证排序稳定性

## 实现细节

### 1. 评分公式

```python
canonical_proxy_agg = min(proxy_cdr1, proxy_cdr2)  # 保守版
total_score_new = total_score_old + 0.10 * canonical_proxy_agg
```

### 2. 数据来源

- **Germline Assets**: `data/germlines/v1_clean/germline_assets_clean_with_canonical_proxy.jsonl`
- **Canonical Proxy Clusters**: `data/germlines/v1_clean/clusters/`

### 3. 匹配逻辑

Scaffold 的 `member_ids` 与 germline assets 的 `sequence_id` 通过前缀匹配：
- Scaffold member_id: `"M99652|IGHV3-11*01|Homo sapiens|..."`
- Germline sequence_id: `"M99652|IGHV3-11*01|Homo"`
- 匹配方式：提取前两部分（如 `"M99652|IGHV3-11*01"`）进行匹配

## 验收结果

### 验证通过

- ✅ proxy_agg 验证通过: 10/10
- ✅ score_diff 验证通过: 10/10
- ✅ 排名变化: 5/10（说明 canonical_proxy 确实影响了排序）

### 典型影响

- **HUMAN_VH3_SCF_24**: rank 9 → 5（提升 4 位，proxy_agg=0.9538）
- **HUMAN_VH3_SCF_13**: rank 10 → 7（提升 3 位，proxy_agg=0.8895）
- **HUMAN_VH3_SCF_30**: rank 5 → 10（下降 5 位，proxy_agg=0.6308）

## 工程风险点

### 风险点 1：Canonical Proxy 只能"同版本 germline 库"比较

**问题**：
- 如果未来换库（如加入 VHH 专用 germline、不同物种），canonical_proxy 的 `cluster_percentile` 会变
- 不同版本的 germline 库之间不能直接比较 canonical_proxy 分数

**解决方案**：
- 在 scaffold 结果中保存 `germline_asset_version = "v1_clean"`
- 所有输出（报告、JSON）都能追溯版本
- 如果更换 germline 库，必须重新生成 canonical_proxy clusters

### 风险点 2：权重校准不要靠感觉

**当前状态**：
- 权重 0.10 是合理起点
- 已验证在 EGFR VHH 上工作正常

**未来校准建议**：
- 在完整跑通 EGFR VHH 后，做一次"敏感性扫描"：
  - weight ∈ {0.05, 0.10, 0.15, 0.20}
  - 观察 top1 是否频繁翻转
  - 避免系统不稳定

**注意**：这不是现在必须做的功能，只是把校准思路记录在开发任务里。

## 报告集成

### 报告章节

在 scaffold 选择章节加入固定表格，包含：
- proxy_cdr1 / proxy_cdr2 / proxy_agg
- canonical_proxy_weight
- score_diff
- rank_old → rank_new（如发生变化）

### 固定解释句式

> canonical_proxy 作为序列层面的 canonical 构型稳定性代理指标，用于在候选 scaffold 评分接近时提供额外的排序判别力；当前配置为 agg=min，权重 0.10。

## 文件清单

### 新增文件
- `core/scoring/canonical_proxy.py` - Canonical Proxy 评分模块
- `scripts/test_canonical_proxy_scoring.py` - 测试和验收脚本
- `scripts/show_canonical_proxy_debug.py` - Debug 表显示脚本
- `scripts/generate_scaffold_ranking_report_section.py` - 报告章节生成脚本

### 修改文件
- `scripts/stage12_germline_selection.py` - 集成 canonical_proxy 评分
- `core/config.py` - 添加 `CanonicalProxyConfig`
- `config.yaml` - 添加 canonical_proxy 配置项
- `data/germlines/v1_clean/manifest.json` - 冻结配置和版本

## Git 提交建议

```bash
git add core/scoring/canonical_proxy.py
git add scripts/stage12_germline_selection.py
git add scripts/test_canonical_proxy_scoring.py
git add scripts/show_canonical_proxy_debug.py
git add scripts/generate_scaffold_ranking_report_section.py
git add core/config.py
git add config.yaml
git add data/germlines/v1_clean/manifest.json
git commit -m "feat: integrate canonical_proxy scoring into scaffold ranking

- Add canonical_proxy scoring module (core/scoring/canonical_proxy.py)
- Integrate canonical_proxy into stage1_select_scaffold
- Add configuration (config.yaml, core/config.py)
- Freeze parameters in manifest.json (agg_mode=min, weight=0.10)
- Add debug table generation for validation
- Add report section generation

Version: scaffold-ranking-canonical-proxy-v1
Germline Asset Version: v1_clean"

git tag scaffold-ranking-canonical-proxy-v1
```

## 使用示例

### 运行测试

```bash
python scripts/test_canonical_proxy_scoring.py \
  --input "projects/EGFR_7D12_VHH/input/egfr_vhh.fasta" \
  --scaffold "data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json" \
  --output "output/canonical_proxy_scoring_debug.csv"
```

### 生成报告章节

```bash
python scripts/generate_scaffold_ranking_report_section.py \
  --input "output/result_stage12.json" \
  --output "output/scaffold_ranking_report_section.md"
```

## 后续工作

1. ✅ 集成完成
2. ✅ 验收通过
3. ⏳ 报告渲染集成（将 `scaffold_ranking_report_section.md` 集成到主报告）
4. ⏳ 敏感性扫描（权重校准，可选）













