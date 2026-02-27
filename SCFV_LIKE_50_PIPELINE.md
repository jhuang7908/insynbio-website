# 50 条 scFv-like 双抗：ANARCII 切分、Linker 识别、ESMFold 造模

## 可行性

| 步骤 | 可行 | 说明 |
|------|------|------|
| **ANARCII 切分** | ✅ | 对 linker 切分后的 VH、VL 分别跑 ANARCII 编号（需安装 anarcii 包） |
| **Linker 序列识别** | ✅ | 用已知模式（G4S、EAAAK）正则匹配，切出 VH / VL 段 |
| **ESMFold 造模** | ✅ | 整链序列导出 FASTA 后，用 ESMFold 单链预测即可 |

## 前提：序列来源

当前 `antibody_meta_models.json` 只有 sequence 的 **hash**，没有序列本身。需要从 Thera-SAbDab 原始表（含 `HeavySequence` / `LightSequence`）或你导出的 CSV 提供序列。

- 若为**单链**（如 BiTE：VH-linker-VL）：表里可只有一列 `full_sequence`，或把整链放在 `HeavySequence`。
- 若为**两条链**：提供 `heavy_sequence` 和 `light_sequence`，脚本会按 G4S3 拼接成一条链再跑 linker 识别和 ESMFold。

## 用法

### 1. 准备序列 CSV

列名需包含：

- `antibody_id`（或 `Therapeutic`）
- 以下二选一：
  - `full_sequence`：单链（VH-linker-VL）
  - `heavy_sequence` 与 `light_sequence`（或 `HeavySequence` / `LightSequence`）

模板（仅 ID，序列需自行填入）：

`data/design_rules/scfv_like_50_sequences_template.csv`

从 Thera-SAbDab 原始 Excel 中筛出这 50 条，导出为 CSV 后覆盖或另存为上述文件即可。

### 2. 运行流程

```bash
# 序列 CSV 路径按你实际文件修改
python scripts/scfv_like_50_linker_anarci_esmfold.py \
  --seq-csv data/design_rules/scfv_like_50_sequences.csv \
  --out-dir data/design_rules/scfv_like_50_pipeline
```

可选：

- `--skip-anarcii`：只做 linker 识别和 FASTA 导出，不跑 ANARCII。
- `--id-json <path>`：指定要处理的抗体 ID 列表（JSON 中需有 `antibody_ids`）。不指定时默认用 50 条 scFv-like；若用「所有代 linker 的多特异」列表见下文。

### 所有代 linker 的多特异（99 条）

从 Thera-SAbDab 导出中筛出「多特异且 Format 含 linker/scFv」的抗体列表（双/三/四/五特异 + scFv、BiTE、Tandem、Mixed mAb+scFv 等）：

```bash
# 生成列表（读 data/thera_sabdab/thera_export.xlsx）
python scripts/build_multispecific_linker_list.py --csv
```

输出：

- `data/design_rules/multispecific_linker_from_export.json`：99 条抗体 ID + format_raw。
- `data/design_rules/multispecific_linker_from_export.csv`（加 `--csv` 时）。

对**全部 99 条**跑 linker 拆分与 ESMFold 输入：

```bash
python scripts/scfv_like_50_linker_anarci_esmfold.py \
  --seq-csv data/thera_sabdab/thera_export.xlsx \
  --id-json data/design_rules/multispecific_linker_from_export.json \
  --out-dir data/design_rules/multispecific_linker_pipeline
```

### 3. 输出

- `out-dir/linker_split_results.json`：每条 antibody_id 的 linker 识别结果（linker 名称、切分长度、ANARCII 是否成功等）。
- `out-dir/esmfold_input.fasta`：整链序列，供 ESMFold 批量造模。

### 4. ESMFold 造模

本地或 Colab 用 ESMFold 读取 `esmfold_input.fasta` 即可，例如：

```python
# 示例：逐条预测并保存 PDB
import esm
model, alphabet = esm.pretrained.esm2_v2_8M_UR50D()  # 或 esm2_t36_3B_UR50D
# 读 FASTA，对每条 sequence 调用 model 预测，写 PDB
```

## Linker 模式

脚本中默认识别的 linker（与 `functional_domains.json` 一致）：

- **G4S**：`(GGGGS)+`
- **EAAAK**：`EAAAK` / `EAAAKA`

若 50 条里出现其它 linker（如含突变或非标准长度），可在 `scripts/scfv_like_50_linker_anarci_esmfold.py` 的 `LINKER_PATTERNS` 中增加正则。
