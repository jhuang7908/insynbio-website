# 🎨  — 

## ✨ 

### （3 ）

|  |  |  |
|------|------|------|
| 🎨 **** | `scripts/color_scheme_manager.py` | 8  +  |
| 🖼️ **** | `scripts/colorize_interface_pdb.py` |  PDB  |
| 👁️ **** | `scripts/preview_color_schemes.py` |  HTML  |

### （4 ）

|  |  |  |
|------|------|------|
| ⚡  | `COLOR_SCHEME_QUICK_START.md` | 3  |
| 📖  | `COLOR_SCHEME_GUIDE.md` | 8  +  +  |
| 📊  | `COLOR_SCHEME_SUMMARY.md` |  +  |
| 📋  | `INTERFACE_VIZ_QUICK_REF.md` |  |

---

## 🚀 （5 ）

### 1️⃣  HTML 
```bash
python scripts/preview_color_schemes.py
# ：color_schemes_preview.html
# 
```

### 2️⃣ 
```bash
# Publication 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb \
    --scheme publication \
    --ab_chains A --ag_chain B \
    --output interface_pub.pdb

# Grayscale 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb \
    --scheme grayscale \
    --ab_chains A --ag_chain B \
    --output interface_print.pdb

# Dark 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb \
    --scheme dark \
    --ab_chains A --ag_chain B \
    --output interface_dark.pdb
```

### 3️⃣  PyMOL 
```
File → Open → interface_pub.pdb
#  .pml ，：
spectrum b, magenta blue orange gray, 5, 95
show surface; set transparency, 0.3
```

---

## 🎨 8 

```
🌈 Rainbow       → ，
🔬 Scientific    → （→）
📊 Publication   → ， ⭐ 
🌙 Dark          → ，
🔥 Thermal       → （→）
🍰 Pastel        → ，
⬜ Grayscale     → ， ⭐ 
🎯 Contrasting   → ，
```

---

## 🛠️ （3 ）

### Step 1: 
```bash
python scripts/color_scheme_manager.py template my_scheme.json
```

### Step 2:  JSON
 `my_scheme.json` （ 4 ）：
```json
{
  "scheme_name": "My Custom",
  "roles": {
    "cdr": { "color_name": "Red", "hex_code": "#FF0000", ... },
    "framework": { "color_name": "Blue", "hex_code": "#0000FF", ... },
    "antigen": { "color_name": "Green", "hex_code": "#00AA00", ... },
    "other": { "color_name": "Gray", "hex_code": "#CCCCCC", ... }
  }
}
```

### Step 3: 
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_scheme.json \
    --ab_chains A --ag_chain B \
    --output result.pdb
```

---

## 📊 

|  |  |  |
|------|---------|------|
| 📰 **** | Publication | `--scheme publication` |
| 🖨️ **** | Grayscale | `--scheme grayscale` |
| 🎤 **** | Scientific | `--scheme scientific` |
| 💻 **** | Dark | `--scheme dark` |
| 🔬 **** | Rainbow | `--scheme rainbow` |
| 💧 **** | Thermal | `--scheme thermal` |
| 🎨 **** | Pastel | `--scheme pastel` |
| 🎯 **** | Contrasting | `--scheme contrasting` |

---

## 💡 

✅ **** —  B-factor， PDB   
✅ **** — PyMOL + ChimeraX   
✅ **** —   
✅ **** —  PDB   
✅ **** — JSON ，  
✅ **** —  BioPython  

---

## 📁 

```
Antibody_Engineer_Suite/
├── scripts/
│   ├── color_scheme_manager.py          ← 
│   ├── colorize_interface_pdb.py        ← 
│   ├── visualize_interface_contacts.py  ← 
│   ├── preview_color_schemes.py         ← HTML 
│   └── demo_interface_visualization.py  ← 
│
└── docs/
    ├── COLOR_SCHEME_QUICK_START.md      ← 3 
    ├── COLOR_SCHEME_GUIDE.md            ← 
    ├── COLOR_SCHEME_SUMMARY.md          ← 
    ├── INTERFACE_VIZ_QUICK_REF.md       ← 
    └── INTERFACE_VISUALIZATION_GUIDE.md ← 
```

---

## 🔍 

### 
```bash
# 
python scripts/color_scheme_manager.py list

# 
python scripts/color_scheme_manager.py show publication

# 
python scripts/color_scheme_manager.py template my_scheme.json

# 
python scripts/color_scheme_manager.py export ./color_schemes/
```

###  PDB
```bash
# 
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme publication \
    --ab_chains A --ag_chain B \
    --output result.pdb

# 
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_scheme.json \
    --ab_chains A --ag_chain B \
    --output result.pdb
```

### 
```bash
#  HTML 
python scripts/preview_color_schemes.py [output.html]

# 
# file:///path/to/color_schemes_preview.html
```

---

## 🐍 Python 

```python
from color_scheme_manager import SchemeManager, ColorScheme
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
colorizer.compute_interfaces(["A"], "B")
colorizer.assign_bfactors(["A"], "B")
colorizer.save_colored_pdb("output.pdb")

# 
scheme.print_summary
print(f"PyMOL: {scheme.to_pymol_spectrum}")
```

---

## 🎯  & 

### Q:  PyMOL ？
**A:**  `spectrum` ：
```
spectrum b, red cyan yellow white, 5, 95
```
。

### Q: （ epitope？
**A:**  JSON， role：
```json
"epitope": {
  "bfactor_min": 85,
  "bfactor_max": 89,
  "color_name": "Purple",
  ...
}
```

### Q: ？
**A:**  shell ：
```bash
for pdb in *.pdb; do
    python scripts/colorize_interface_pdb.py \
        --pdb "$pdb" --scheme publication \
        --ab_chains A --ag_chain B \
        --output "${pdb%.pdb}_colored.pdb"
done
```

### Q: HEX ？
**A:**  https://htmlcolorcodes.com/ 

---

## 📈 

|  |  |  |
|------|------|------|
|  PDB | < 1  | < 50 MB |
|  HTML  | < 2  | < 100 MB |
|  | < 0.1  |  |
|  8  | < 1  | < 50 MB |

---

## ✅ 

- [x] 8 
- [x] JSON 
- [x] PyMOL + ChimeraX 
- [x] HTML 
- [x] 
- [x] （ BioPython）
- [x] 
- [x] Python  API
- [x]  Lint 
- [x] 

---

## 🎉 

、：

1. **8 ** — 
2. **** — 5 
3. **** — PyMOL、ChimeraX、HTML 
4. **** — 
5. **** — 

**：**
```bash
python scripts/preview_color_schemes.py
#  HTML 
```

---

**：** 2026-03-27  
**：** ✅   
**：** v1.0

？！
