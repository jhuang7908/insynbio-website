## Framework Library Inventory (One-pager)

### VH （FR1–FR3 / Canonical /  / ）

| VH | family | germline | canonical(CDR1) | canonical(CDR2) | tags |  |
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

### VL （：CDR-L1 ）

| VL | family | germline | CDR-L1 length(mode/range) | canonical(CDR2) | tags |  |
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

### FR4/J 

|  |  | / |  |
|---|---|---|---|
| FR4/J | IGHJ1*01 | FR4=`WGQGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J | IGHJ2*01 | FR4=`WGRGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J | IGHJ3*01 | FR4=`WGQGTMVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J | IGHJ4*01 | FR4=`WGQGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
| FR4/J | IGHJ5*01 | FR4=`WGQGTLVTVSS` (len=11) | from `data/ighj_curated_fr4.json` |
|  | Heavy J default | `hJH4` | from `core/policies/framework_selection_rules.yaml` (allele TODO; mapping to IGHJ* TODO) |
|  | If CDR-H3_length > 18 | switch heavy J → `hJH6` | from `core/policies/framework_selection_rules.yaml` |
|  | Light J default | `hJK1` | from `core/policies/framework_selection_rules.yaml` (allele TODO) |

### （/）

|  |  |  | / |
|---|---|---|---|
| （recommended_pairs） | VH3  → VL | `VK1-39`, `VK3-20` | from `core/data/framework_library/pairing_policy.yaml` |
| （allowed_pairs） |  λ  | if `high_concentration_formulation==true` or `aggregation_risk==true` → allow `IGLV2-14` | from `core/data/framework_library/pairing_policy.yaml` |
| （discouraged_pairs） | TODO | TODO | reason TODO（///） |

