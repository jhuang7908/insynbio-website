# Thera-SAbDab Slice Systems Documentation

## 

Thera-SAbDab  slice，：

##  1: Reference Slices (Slice 1-7)

****: `data/thera_sabdab/out/slice_ids/`

****: `scripts/build_reference_slices.py`

****:  (`.txt`)， ID

****: ，（、、VHH 、、Fc-Target 、Phase I 、）

****:
- `slice_1_standard_humanized.txt` - Standard Humanized Baseline
- `slice_2_natural_human.txt` - Natural Human Comparison
- `slice_3_vhh_design.txt` - VHH Design Reference
- `slice_4_bispecific_engineering.txt` - Bispecific Engineering
- `slice_5_fc_target_design.txt` - Fc-Target Design
- `slice_6_phase1_expansion.txt` - Phase I Expansion
- `slice_7_exclusion.txt` - Strict Exclusion

****: `data/thera_sabdab/out/reference_slices.json` ( JSON ，)

##  2: Engineering Modality Slices (Slice 8-10)

****: `data/thera_sabdab/slices/`

****: `scripts/export_engineering_slices.py`

****: Excel (`.xlsx`) + JSON  (`.json`)

****: ，

****:
- `thera_slice_ADC_engineering.xlsx` + `.json` - ADC Engineering Set (Slice 8)
- `thera_slice_fusion_engineering.xlsx` + `.json` - Fusion Engineering Set (Slice 9)
- `thera_slice_radiolabeled_engineering.xlsx` + `.json` - Radiolabeled Engineering Set (Slice 10)

****:
- **Slice 8 (ADC)**: `modality == "ADC"` AND `phase_bucket ∈ {"phase_II_plus", "phase_I"}` AND `human_origin_mode != "non_human"`
- **Slice 9 (Fusion)**: `modality == "fusion"` AND `phase_bucket ∈ {"phase_II_plus", "phase_I"}`
- **Slice 10 (Radiolabeled)**: `modality == "radiolabeled"` AND `phase_bucket ∈ {"phase_II_plus", "phase_I"}`

## 

|  | Reference Slices (1-7) | Engineering Slices (8-10) |
|------|------------------------|---------------------------|
| **** |  (ID ) | Excel + JSON  |
| **** | `out/slice_ids/` | `slices/` |
| **** |  ID |  |
| **** |  |  |
| **** | `antibody_meta_models.json` | `qc_only_pass.xlsx` + `antibody_meta_models.json` |

## 

###  Reference Slices (1-7)
-  ID 
- （、、）
- 
- 、

###  Engineering Slices (8-10)
- 
- 
-  Excel 
- （JSON）

## 

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

## 

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

## 

1. ****: `export_engineering_slices.py`  `qc_only_pass.xlsx`，
2. ****:  `antibody_meta_models.json`，
3. ****: Reference Slices  `slice_N_description.txt`，Engineering Slices  `thera_slice_MODALITY_engineering.xlsx`
4. ****: ，
