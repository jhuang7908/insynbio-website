# VHH人源化模块文档

## 概述

`core/vhh_humanization.py` 提供VHH序列到human-VHH的人源化功能，使用Human VH3 VHH-SAFE模板面板进行CDR移植。

## 核心函数

### `humanize_vhh()`

主入口函数，将VHH序列人源化为human-VHH。

```python
from core.vhh_humanization import humanize_vhh

result = humanize_vhh(
    seq="QVQLVQPGAELRKPGALLKVSCKASGYTFTSYYIDWVRQAPGQGLGWVGRIDPEDGGTNYAQKFQGRVTLTADTSTSTAYVELSSLRSEDTAVCYCVR",
    panel="A",
    top_k=3,
    species="alpaca",
    return_all_templates=False
)
```

#### 参数说明

- `seq` (str): VHH氨基酸序列
- `panel` (str): 方案选择
  - `'A'`: 最温和方案（44→Q, 45→R）
  - `'B'`: 中度方案（37→Y/S, 44→Q, 45→R, 47→G）
  - `'C'`: 强VHH模式（37=Y, 44=Q, 45=R, 47=G）
  - `'all'`: **同时计算所有三种方案**，返回每种方案的最佳结果
- `top_k` (int): 返回前k个最佳模板（默认3）
- `species` (str): 源物种（目前仅支持'alpaca'）
- `return_all_templates` (bool): 是否返回所有候选模板（默认False）

#### 返回值结构

```python
{
    'success': bool,              # 是否成功
    'input': {...},                # 输入信息
    'best_match': {...},           # 全局最佳匹配结果（综合得分最高）
    'best_by_plan': {              # 仅当panel='all'时存在
        'A': {...},                # 方案A的最佳结果
        'B': {...},                # 方案B的最佳结果
        'C': {...},                # 方案C的最佳结果
    },
    'candidates': [...],           # 候选模板列表（按综合得分排序）
    'cdrs': {...},                 # 提取的CDR序列
    'cdr_canonical': {...},        # CDR构型分类结果
    'key_positions': {...},        # 关键位置残基
    'error': str,                  # 错误信息（如果失败）
}
```

**注意**：当`panel='all'`时：
- `best_match`：全局最佳匹配（所有方案中综合得分最高的）
- `best_by_plan`：每种方案的最佳结果（A、B、C各一个）
- `candidates`：所有方案的候选模板混合，按综合得分排序

## ⚠️ 重要说明：亲和性验证

**当前实现无法直接预测结合亲和性**。人源化后必须通过实验验证：

1. **Display技术验证**（推荐）：
   - **酵母展示（Yeast Display）**：适合高亲和性筛选和优化
   - **噬菌体展示（Phage Display）**：适合大规模筛选和亲和性成熟
   - 快速、成本低、通量高

2. **为什么需要Display技术**：
   - 人源化可能显著影响亲和性（下降10-100倍很常见）
   - 框架变化可能影响CDR构象
   - 必须通过实验验证结合活性

3. **工作流程建议**：
   ```
   人源化设计 → Display验证 → 亲和性优化（如需要） → 表达纯化 → 详细表征
   ```

详见 `docs/VHH_HUMANIZATION_AFFINITY_AND_DISPLAY.md`

## 使用示例

详见 `scripts/test_vhh_humanization.py`

## 相关文件

- 核心模块: `core/vhh_humanization.py`
- 测试脚本: `scripts/test_vhh_humanization.py`
- 数据文件: `data/germlines/human_ig_aa/vh_scaffolds/`

