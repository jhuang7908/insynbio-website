# 50  scFv-like ：ANARCI 、Linker 、ESMFold 

## 

|  |  |  |
|------|------|------|
| **ANARCI ** | ✅ |  linker  VH、VL  ANARCI （ anarcii ） |
| **Linker ** | ✅ | （G4S、EAAAK）， VH / VL  |
| **ESMFold ** | ✅ |  FASTA ， ESMFold  |

## ：

 `antibody_meta_models.json`  sequence  **hash**，。 Thera-SAbDab （ `HeavySequence` / `LightSequence`） CSV 。

- ****（ BiTE：VH-linker-VL）： `full_sequence`， `HeavySequence`。
- ****： `heavy_sequence`  `light_sequence`， G4S3  linker  ESMFold。

## 

### 1.  CSV

：

- `antibody_id`（ `Therapeutic`）
- ：
  - `full_sequence`：（VH-linker-VL）
  - `heavy_sequence`  `light_sequence`（ `HeavySequence` / `LightSequence`）

（ ID，）：

`data/design_rules/scfv_like_50_sequences_template.csv`

 Thera-SAbDab  Excel  50 ， CSV 。

### 2. 

```bash
#  CSV 
python scripts/scfv_like_50_linker_anarci_esmfold.py \
  --seq-csv data/design_rules/scfv_like_50_sequences.csv \
  --out-dir data/design_rules/scfv_like_50_pipeline
```

：

- `--skip-anarcii`： linker  FASTA ， ANARCI。
- `--id-json <path>`： ID （JSON  `antibody_ids`）。 50  scFv-like；「 linker 」。

###  linker （99 ）

 Thera-SAbDab 「 Format  linker/scFv」（/// + scFv、BiTE、Tandem、Mixed mAb+scFv ）：

```bash
# （ data/thera_sabdab/thera_export.xlsx）
python scripts/build_multispecific_linker_list.py --csv
```

：

- `data/design_rules/multispecific_linker_from_export.json`：99  ID + format_raw。
- `data/design_rules/multispecific_linker_from_export.csv`（ `--csv` ）。

** 99 ** linker  ESMFold ：

```bash
python scripts/scfv_like_50_linker_anarci_esmfold.py \
  --seq-csv data/thera_sabdab/thera_export.xlsx \
  --id-json data/design_rules/multispecific_linker_from_export.json \
  --out-dir data/design_rules/multispecific_linker_pipeline
```

### 3. 

- `out-dir/linker_split_results.json`： antibody_id  linker （linker 、、ANARCI ）。
- `out-dir/esmfold_input.fasta`：， ESMFold 。

### 4. ESMFold 

 Colab  ESMFold  `esmfold_input.fasta` ，：

```python
# ： PDB
import esm
model, alphabet = esm.pretrained.esm2_v2_8M_UR50D  #  esm2_t36_3B_UR50D
#  FASTA， sequence  model ， PDB
```

## Linker 

 linker（ `functional_domains.json` ）：

- **G4S**：`(GGGGS)+`
- **EAAAK**：`EAAAK` / `EAAAKA`

 50  linker， `scripts/scfv_like_50_linker_anarci_esmfold.py`  `LINKER_PATTERNS` 。
