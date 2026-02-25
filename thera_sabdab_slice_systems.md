# Thera-SAbDab Slice Systems Documentation

## 概述

Thera-SAbDab 数据集中存在两个不同的 slice（切片）系统，用于不同的分析目的：

## 系统 1: Reference Slices (Slice 1-7)

**位置**: `data/thera_sabdab/out/slice_ids/`

**生成脚本**: `scripts/build_reference_slices.py`

**文件格式**: 文本文件 (`.txt`)，每行一个抗体 ID

**用途**: 标准参考切片，用于各种下游分析（人源化基线、自然人类比较、VHH 设计、双特异性工程、Fc-Target 设计、Phase I 扩展、严格排除）

**包含的切片**:
- `slice_1_standard_humanized.txt` - Standard Humanized Baseline
- `slice_2_natural_human.txt` - Natural Human Comparison
- `slice_3_vhh_design.txt` - VHH Design Reference
- `slice_4_bispecific_engineering.txt` - Bispecific Engineering
- `slice_5_fc_target_design.txt` - Fc-Target Design
- `slice_6_phase1_expansion.txt` - Phase I Expansion
- `slice_7_exclusion.txt` - Strict Exclusion

**元数据**: `data/thera_sabdab/out/reference_slices.json` (完整 JSON 格式，包含所有元模型信息)

## 系统 2: Engineering Modality Slices (Slice 8-10)

**位置**: `data/thera_sabdab/slices/`

**生成脚本**: `scripts/export_engineering_slices.py`

**文件格式**: Excel (`.xlsx`) + JSON 摘要 (`.json`)

**用途**: 工程模态特定切片，专注于特定治疗模态的工程化抗体

**包含的切片**:
- `thera_slice_ADC_engineering.xlsx` + `.json` - ADC Engineering Set (Slice 8)
- `thera_slice_fusion_engineering.xlsx` + `.json` - Fusion Engineering Set (Slice 9)
- `thera_slice_radiolabeled_engineering.xlsx` + `.json` - Radiolabeled Engineering Set (Slice 10)

**过滤条件**:
- **Slice 8 (ADC)**: `modality == "ADC"` AND `phase_bucket ∈ {"phase_II_plus", "phase_I"}` AND `human_origin_mode != "non_human"`
- **Slice 9 (Fusion)**: `modality == "fusion"` AND `phase_bucket ∈ {"phase_II_plus", "phase_I"}`
- **Slice 10 (Radiolabeled)**: `modality == "radiolabeled"` AND `phase_bucket ∈ {"phase_II_plus", "phase_I"}`

## 主要区别

| 特性 | Reference Slices (1-7) | Engineering Slices (8-10) |
|------|------------------------|---------------------------|
| **数据格式** | 文本文件 (ID 列表) | Excel + JSON (完整数据) |
| **存储位置** | `out/slice_ids/` | `slices/` |
| **数据内容** | 仅抗体 ID | 完整序列和元数据 |
| **用途** | 参考集定义和过滤 | 工程模态分析和导出 |
| **输入数据** | `antibody_meta_models.json` | `qc_only_pass.xlsx` + `antibody_meta_models.json` |

## 使用建议

### 何时使用 Reference Slices (1-7)
- 需要快速获取符合特定条件的抗体 ID 列表
- 进行集合运算（交集、并集、差集）
- 作为其他分析的输入过滤器
- 需要轻量级、易于脚本处理的格式

### 何时使用 Engineering Slices (8-10)
- 需要完整的序列数据和元数据
- 进行详细的工程模态分析
- 需要 Excel 格式进行进一步处理
- 需要统计摘要信息（JSON）

## 生成命令

### Reference Slices (1-7)
```bash
python scripts/build_reference_slices.py \
  --meta_models_json data/thera_sabdab/out/antibody_meta_models.json \
  --output_dir data/thera_sabdab/out
```

### Engineering Slices (8-10)
```bash
python scripts/export_engineering_slices.py \
  --in_xlsx data/thera_sabdab/out/qc_only_pass.xlsx \
  --meta_models_json data/thera_sabdab/out/antibody_meta_models.json \
  --output_dir data/thera_sabdab/slices
```

## 数据流

```
thera_export.xlsx
    ↓
prepare_thera_dataset.py (--mode qc_only)
    ↓
qc_only_pass.xlsx
    ↓
build_antibody_meta_model.py
    ↓
antibody_meta_models.json
    ↓
    ├─→ build_reference_slices.py → slice_ids/ (Slice 1-7)
    └─→ export_engineering_slices.py → slices/ (Slice 8-10)
```

## 注意事项

1. **输入文件**: `export_engineering_slices.py` 默认使用 `qc_only_pass.xlsx`，确保该文件已生成
2. **数据一致性**: 两个系统都基于相同的 `antibody_meta_models.json`，确保元模型已更新
3. **文件命名**: Reference Slices 使用 `slice_N_description.txt`，Engineering Slices 使用 `thera_slice_MODALITY_engineering.xlsx`
4. **更新频率**: 当原始数据更新时，需要重新生成两个系统的所有切片
