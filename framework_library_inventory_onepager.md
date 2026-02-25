## Framework Library Inventory (One-pager)

### VH 框架列表（FR1–FR3 / Canonical / 标签 / 典型场景）

| VH条目 | family | germline | canonical(CDR1) | canonical(CDR2) | tags | 典型场景 |
|---|---|---|---|---|---|---|
| VH:IGHV1-18*01 | IGHV1 | IGHV1-18*01 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-18*02 | IGHV1 | IGHV1-18*02 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-18*03 | IGHV1 | IGHV1-18*03 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-18*04 | IGHV1 | IGHV1-18*04 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-2*01 | IGHV1 | IGHV1-2*01 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-2*02 | IGHV1 | IGHV1-2*02 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-2*04 | IGHV1 | IGHV1-2*04 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-2*05 | IGHV1 | IGHV1-2*05 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-2*06 | IGHV1 | IGHV1-2*06 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-2*07 | IGHV1 | IGHV1-2*07 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-24*01 | IGHV1 | IGHV1-24*01 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |
| VH:IGHV1-3*01 | IGHV1 | IGHV1-3*01 | L=TODO; class=TODO | L=TODO; class=TODO | (none) | TODO |

### VL 框架列表（重点：CDR-L1 长度）

| VL条目 | family | germline | CDR-L1 length(mode/range) | canonical(CDR2) | tags | 典型场景 |
|---|---|---|---|---|---|---|
| VL:IGKV1-12*01 | IGKV1 | IGKV1-12*01 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-12*02 | IGKV1 | IGKV1-12*02 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-13*01 | IGKV1 | IGKV1-13*01 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-13*02 | IGKV1 | IGKV1-13*02 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-16*01 | IGKV1 | IGKV1-16*01 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-16*02 | IGKV1 | IGKV1-16*02 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-17*01 | IGKV1 | IGKV1-17*01 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-17*02 | IGKV1 | IGKV1-17*02 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |
| VL:IGKV1-17*03 | IGKV1 | IGKV1-17*03 | mode=TODO; range=TODO | L=TODO; class=TODO | (none) | TODO |

### FR4/J 最小集合与切换规则

| 类别 | 条目 | 序列/规则 | 备注 |
|---|---|---|---|
| FR4/J最小集合 | IGHJ1*01 | FR4=`WGQGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J最小集合 | IGHJ2*01 | FR4=`WGRGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J最小集合 | IGHJ3*01 | FR4=`WGQGTMVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J最小集合 | IGHJ4*01 | FR4=`WGQGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J最小集合 | IGHJ5*01 | FR4=`WGQGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| 切换规则 | Heavy J default | `hJH4` | from `core/policies/framework_selection_rules.yaml` (allele TODO; mapping to IGHJ* TODO) |
| 切换规则 | If CDR-H3_length > 18 | switch heavy J → `hJH6` | from `core/policies/framework_selection_rules.yaml` |
| 切换规则 | Light J default | `hJK1` | from `core/policies/framework_selection_rules.yaml` (allele TODO) |

### 配对策略要点（推荐/禁忌）

| 类型 | 规则 | 内容 | 原因/备注 |
|---|---|---|---|
| 推荐（recommended_pairs） | VH3 主力框架 → VL | `VK1-39`, `VK3-20` | from `core/data/framework_library/pairing_policy.yaml` |
| 允许（allowed_pairs） | 条件触发 λ 切换 | if `high_concentration_formulation==true` or `aggregation_risk==true` → allow `IGLV2-14` | from `core/data/framework_library/pairing_policy.yaml` |
| 禁忌（discouraged_pairs） | TODO | TODO | reason TODO（装配/聚集/电荷/空间受限） |

