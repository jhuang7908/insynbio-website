# VHH

## 

`core/vhh_humanization.py` VHHhuman-VHH，Human VH3 VHH-SAFECDR。

## 

### `humanize_vhh`

，VHHhuman-VHH。

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

#### 

- `seq` (str): VHH
- `panel` (str): 
  - `'A'`: （44→Q, 45→R）
  - `'B'`: （37→Y/S, 44→Q, 45→R, 47→G）
  - `'C'`: VHH（37=Y, 44=Q, 45=R, 47=G）
  - `'all'`: ****，
- `top_k` (int): k（3）
- `species` (str): （'alpaca'）
- `return_all_templates` (bool): （False）

#### 

```python
{
    'success': bool,              # 
    'input': {...},                # 
    'best_match': {...},           # 
    'best_by_plan': {              # panel='all'
        'A': {...},                # A
        'B': {...},                # B
        'C': {...},                # C
    },
    'candidates': [...],           # 
    'cdrs': {...},                 # CDR
    'cdr_canonical': {...},        # CDR
    'key_positions': {...},        # 
    'error': str,                  # 
}
```

****：`panel='all'`：
- `best_match`：
- `best_by_plan`：（A、B、C）
- `candidates`：，

## ⚠️ ：

****。：

1. **Display**：
   - **（Yeast Display）**：
   - **（Phage Display）**：
   - 、、

2. **Display**：
   - （10-100）
   - CDR
   - 

3. ****：
   ```
    → Display →  →  → 
   ```

 `docs/VHH_HUMANIZATION_AFFINITY_AND_DISPLAY.md`

## 

 `scripts/test_vhh_humanization.py`

## 

- : `core/vhh_humanization.py`
- : `scripts/test_vhh_humanization.py`
- : `data/germlines/human_ig_aa/vh_scaffolds/`

