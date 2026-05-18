# 🎨  — 

**：** 2026-03-27  
**：** ✅   
**：** v1.0

---

## 📦 

### 🔧 （3 ）

```
scripts/
├── color_scheme_manager.py          ← 
│   • 8 （Rainbow, Scientific, Publication, Dark, Thermal, Pastel, Grayscale, Contrasting）
│   •  JSON 
│   • /
│   • CLI （list, show, template, export）
│
├── colorize_interface_pdb.py        ← PDB 
│   •  (--scheme)
│   •  (--scheme-config)
│   • B-factor 
│   • PyMOL/Chimera 
│
└── preview_color_schemes.py         ← HTML 
    •  HTML 
    •  8 
    •  PyMOL 
    • 
```

### 📚 （5 ）

```
docs/
├── COLOR_SCHEME_QUICK_START.md       ← ⚡ 3 
│   • 5 
│   • 8 
│   • 
│   • Python 
│
├── COLOR_SCHEME_GUIDE.md             ← 📖 
│   •  RGB 
│   • 
│   • （Nature Methods, ）
│   • B-factor 
│   • 
│
├── COLOR_SCHEME_SUMMARY.md           ← 📊 
│   • 
│   • 8 
│   • 
│   • 
│
├── COLOR_SCHEME_DELIVERY_CHECKLIST.md ← ✅ 
│   • 
│   • 
│   • 
│
└── INTERFACE_VISUALIZATION_GUIDE.md  ← 🎨 
    INTERFACE_VIZ_QUICK_REF.md         ← 📋 
```

### 🚀 

```
quickstart_color_schemes.sh  ← 
•  HTML 
• 
• 
• 
```

---

## 🎨 8 

| # |  | PyMOL  |  | B-factor  |
|---|------|-----------|---------|--------------|
| 1 | 🌈 Rainbow | red→cyan→yellow→white | 、 | 5-95 |
| 2 | 🔬 Scientific | red→green→blue→white | 、 | 5-95 |
| 3 | 📊 Publication | magenta→blue→orange→gray | **** ⭐ | 5-95 |
| 4 | 🌙 Dark | magenta→cyan→yellow→black | 、 | 5-95 |
| 5 | 🔥 Thermal | red→orange→green→blue |  | 5-95 |
| 6 | 🍰 Pastel | →→→ |  | 5-95 |
| 7 | ⬜ Grayscale | →→→ | **** ⭐ | 5-95 |
| 8 | 🎯 Contrasting | →→→ |  | 5-95 |

---

## 🚀 

###  1：
```bash
cd Antibody_Engineer_Suite
bash quickstart_color_schemes.sh
```

###  2：（1 ）
```bash
# Publication 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme publication \
    --ab_chains A --ag_chain B \
    --output interface_pub.pdb

# Grayscale 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme grayscale \
    --ab_chains A --ag_chain B \
    --output interface_print.pdb
```

###  3：（3 ）
```bash
# 
python scripts/color_scheme_manager.py template my_scheme.json

#  my_scheme.json（ 4 ）

# 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme-config my_scheme.json \
    --ab_chains A --ag_chain B \
    --output interface_custom.pdb
```

###  4：HTML 
```bash
python scripts/preview_color_schemes.py
#  color_schemes_preview.html
```

---

## 💡 

### ✅ 
- 8 
- 
- PyMOL/Chimera 

### ✅ 
- JSON ，
-  RGB/HEX 
-  PyMOL/Chimera 

### ✅ 
-  PDB（B-factor ）
- PyMOL （.pml）
- ChimeraX （.cxc）
- HTML 

### ✅ 
- Python API 
- 
- 

---

## 📊 

### 📰 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme publication \
    --pdb complex.pdb --ab_chains A --ag_chain B \
    --output figure_for_paper.pdb
```
✅   
✅   
✅ 

### 🖨️ 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme grayscale \
    --pdb complex.pdb --ab_chains A --ag_chain B \
    --output bw_print.pdb
```
✅   
✅   
✅ 

### 🎤 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme scientific \
    --pdb complex.pdb --ab_chains A --ag_chain B \
    --output seminar.pdb
```
✅   
✅   
✅ 

### 💻 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme dark \
    --pdb complex.pdb --ab_chains A --ag_chain B \
    --output presentation.pdb
```
✅   
✅   
✅ 

---

## 🔧 CLI 

### 
```bash
# 
python scripts/color_scheme_manager.py list

# 
python scripts/color_scheme_manager.py show publication

# 
python scripts/color_scheme_manager.py template my_colors.json

#  JSON
python scripts/color_scheme_manager.py export ./schemes/
```

### 
```bash
# 
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme publication \
    --ab_chains A,B \
    --ag_chain C \
    --output result.pdb

# 
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_scheme.json \
    --ab_chains A,B \
    --ag_chain C \
    --output result.pdb

# 
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme publication \
    --contact_dist 5.0 \
    --ab_chains A --ag_chain B \
    --output result.pdb
```

### 
```bash
#  HTML 
python scripts/preview_color_schemes.py

# 
python scripts/preview_color_schemes.py my_preview.html
```

---

## 🐍 Python API 

```python
from color_scheme_manager import SchemeManager
from colorize_interface_pdb import InterfaceColorizer

# 
scheme = SchemeManager.get_scheme("publication")

# 
scheme = SchemeManager.load_custom_scheme("my_scheme.json")

# 
colorizer = InterfaceColorizer(
    "complex.pdb",
    color_scheme=scheme
)

# 
colorizer.compute_interfaces(["A", "B"], "C")
colorizer.assign_bfactors(["A", "B"], "C")
colorizer.save_colored_pdb("output.pdb")

# 
scheme.print_summary
print(f"PyMOL command: {scheme.to_pymol_spectrum}")
```

---

## 📈 

|  |  |
|------|-----|
|  PDB  | < 1  |
| HTML  | < 2  |
|  | < 50 MB |
|  PDB  | |
| Python  | 3.7+ |
|  | BioPython|
|  | Linux / macOS / Windows |

---

## ✅ 

- [x] 8 
- [x] JSON 
- [x] CLI 
- [x] Python API 
- [x] PyMOL + ChimeraX 
- [x] HTML 
- [x] （5 ）
- [x] 
- [x]  Lint 
- [x] 

---

## 🎯 

1. **：**
   ```bash
   python scripts/preview_color_schemes.py
   ```
    HTML 

2. **：**
   - 📰  → Publication
   - 🖨️  → Grayscale
   - 🎤  → Dark / Scientific

3. **：**
   ```bash
   python scripts/color_scheme_manager.py template my_scheme.json
   ```

4. **：**
   -  humanization 
   -  CMC 
   - 

---

## 📖 

|  |  |  |
|------|---------|------|
| COLOR_SCHEME_QUICK_START.md | 3 min ⚡ | 、 |
| COLOR_SCHEME_GUIDE.md | 15 min 📖 | 、 |
| COLOR_SCHEME_SUMMARY.md | 10 min 📊 | 、 |
| COLOR_SCHEME_DELIVERY_CHECKLIST.md | 5 min ✅ | 、 |

---

## 🎉 

、：

✨ **8 ** —   
✨ **** — 5   
✨ **** — PyMOL、Chimera、HTML  
✨ **** —   
✨ **** —  BioPython  

**！** 🚀

---

**：** 2026-03-27  
**：** 2026-03-27  
**：** ✅   
**：** 1.0.0

---

**？** 。
