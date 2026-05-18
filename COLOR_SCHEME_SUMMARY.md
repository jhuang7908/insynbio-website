# 🎨  — 

## ✅ 

### 
- ✨ **color_scheme_manager.py** — 8  + 
- 🎨 **colorize_interface_pdb.py** — ，
- 📚 **visualize_interface_contacts.py** — ，

### 
- 📖 **COLOR_SCHEME_QUICK_START.md** — 3 
- 📖 **COLOR_SCHEME_GUIDE.md** — （8  + ）
- 📖 **INTERFACE_VISUALIZATION_GUIDE.md** — 
- 📖 **INTERFACE_VIZ_QUICK_REF.md** — 

---

## 🎨 8 

| # |  |  |  |
|---|------|---------|------|
| 1 | 🌈 Rainbow |  | ， |
| 2 | 🔬 Scientific |  | （→） |
| 3 | 📊 Publication | **** | ， ⭐ |
| 4 | 🌙 Dark |  | ， |
| 5 | 🔥 Thermal |  | → |
| 6 | 🍰 Pastel |  | ， |
| 7 | ⬜ Grayscale | **** | ， ⭐ |
| 8 | 🎯 Contrasting |  | CMY ， |

---

## 💡 

### 1️⃣ （1 ）
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme publication \        # ← 
    --ab_chains A --ag_chain B \
    --output result.pdb
```

### 2️⃣ （3 ）
```bash
# 
python scripts/color_scheme_manager.py template my_colors.json

#  JSON 
# {
#   "cdr": { "color_name": "Crimson", "hex_code": "#DC143C", ... },
#   "framework": { "color_name": "SteelBlue", ... },
#   ...
# }

# 
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_colors.json \
    --ab_chains A --ag_chain B \
    --output result.pdb
```

### 3️⃣ 
```bash
# 
python scripts/color_scheme_manager.py list

# 
python scripts/color_scheme_manager.py show publication

# 
python scripts/color_scheme_manager.py export ./schemes/
```

---

## 🎯 

### 📰 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme publication \
    --pdb complex.pdb --ab_chains A --ag_chain B --output figure.pdb
```
**：** Publication   
**：** ，

---

### 🖨️ 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme grayscale \
    --pdb complex.pdb --ab_chains A --ag_chain B --output print.pdb
```
**：** Grayscale   
**：** ，

---

### 🎤 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme scientific \
    --pdb complex.pdb --ab_chains A --ag_chain B --output talk.pdb
```
**：** Scientific   
**：** 

---

### 💻 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme dark \
    --pdb complex.pdb --ab_chains A --ag_chain B --output dark.pdb
```
**：** Dark   
**：** ，

---

### 🌈 
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb --ab_chains A --ag_chain B --output result.pdb
```
**：** Rainbow   
**：** ，

---

## 🛠️ 

###  1：Nature Methods 
```json
{
  "scheme_name": "Nature Methods",
  "roles": {
    "cdr": {
      "color_name": "Crimson",
      "hex_code": "#DC143C",
      "pymol_name": "red"
    },
    "framework": {
      "color_name": "Steel Blue",
      "hex_code": "#4682B4",
      "pymol_name": "blue"
    },
    "antigen": {
      "color_name": "Forest Green",
      "hex_code": "#228B22",
      "pymol_name": "green"
    },
    "other": {
      "color_name": "Light Gray",
      "hex_code": "#D3D3D3",
      "pymol_name": "lightgray"
    }
  }
}
```

###  2：
```json
{
  "scheme_name": "Deuteranopia",
  "roles": {
    "cdr": { "hex_code": "#0173B2", "pymol_name": "blue" },      // 
    "framework": { "hex_code": "#DE8F05", "pymol_name": "orange" }, // 
    "antigen": { "hex_code": "#CC78BC", "pymol_name": "magenta" },  // 
    "other": { "hex_code": "#999999", "pymol_name": "gray" }
  }
}
```

---

## 📊 

### HEX 

**：**
```
: #0000FF , #0033CC , #4682B4 , #87CEEB 
: #00FFFF , #00CED1 , #20B2AA 
```

**：**
```
: #FF0000 , #DC143C , #FF6347 
: #FFA500 , #FF8800 , #FFB347 
: #FFFF00 , #FFD700 , #FFFF99 
```

**：**
```
: #FFFFFF, : #DDDDDD, : #888888, : #333333, : #000000
```

**：**
```
: #FF00FF , #FF1493 , #9932CC 
: #800080 , #EE82EE 
```

---

## 🐍 Python 

```python
from color_scheme_manager import SchemeManager
from colorize_interface_pdb import InterfaceColorizer

#  1：
scheme = SchemeManager.get_scheme("publication")

#  2：
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

## 🎨 

### B-factor 

 4  B-factor ：

```
CDR        90–99 
Framework  50–59 
Antigen    70–79 
           0–20  
```

PyMOL  `spectrum` ：
```
spectrum b, color1 color2 color3 color4, min, max
```

### 

（1-3），。

---

## 🚀 

### 
```bash
#!/bin/bash
for scheme in rainbow scientific publication dark thermal pastel grayscale contrasting
do
    python scripts/colorize_interface_pdb.py \
        --pdb my_complex.pdb \
        --scheme $scheme \
        --ab_chains A --ag_chain B \
        --output interface_${scheme}.pdb
    echo "✅ Generated: interface_${scheme}.pdb"
done
```

### 
```bash
for pdb in complex1.pdb complex2.pdb complex3.pdb
do
    python scripts/colorize_interface_pdb.py \
        --pdb $pdb \
        --scheme publication \
        --ab_chains A --ag_chain B \
        --output ${pdb%.pdb}_colored.pdb
done
```

---

## 📈 

|  |  |
|------|------|
|  PDB | < 1  |
|  | < 0.1  |
|  8  | < 1  |
|  | < 0.5  |

**：** < 50 MB（ PDB ）

---

## ✨ 

✅ **8 ** —   
✅ ** JSON ** — 5   
✅ **PyMOL + ChimeraX ** —   
✅ **** —  PDB ， B-factor  
✅ **** —   
✅ **** — 

---

## 📚 

|  |  |
|------|------|
| **COLOR_SCHEME_QUICK_START.md** | ⚡ 3  |
| **COLOR_SCHEME_GUIDE.md** | 📖  +  |
| **INTERFACE_VISUALIZATION_GUIDE.md** | 🎨  |
| **INTERFACE_VIZ_QUICK_REF.md** | 📋  |

---

## 🎯 

1. **：**
   ```bash
   python scripts/color_scheme_manager.py show publication
   ```

2. **：**
   -  → Publication
   -  → Grayscale
   -  → Dark / Scientific

3. **：**
   ```bash
   python scripts/color_scheme_manager.py template my_scheme.json
   #  --scheme-config
   ```

4. ****

---

**：** 2026-03-27  
**：** ✅   
**：** 
