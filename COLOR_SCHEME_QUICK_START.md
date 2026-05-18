# 🎨  —  (3)

## 🚀 

###  1：
```bash
python scripts/color_scheme_manager.py list
```

：
```
Available Color Schemes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • rainbow      → Classic rainbow (red→cyan→yellow)
  • scientific   → Scientific (white→blue→green→yellow→red)
  • publication  → Publication quality (gray→blue→green→red)
  • dark         → Dark theme (black→cyan→magenta→white)
  • thermal      → Thermal gradient (blue→green→orange→red)
  • pastel       → Soft pastel colors
  • grayscale    → Grayscale (B&W printing friendly)
  • contrasting  → High contrast (cyan/yellow/magenta)
```

###  2：
```bash
#  Rainbow
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb --ab_chains A --ag_chain B \
    --output interface.pdb

# Publication 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb --ab_chains A --ag_chain B \
    --scheme publication \
    --output interface_pub.pdb

# Dark 
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb --ab_chains A --ag_chain B \
    --scheme dark \
    --output interface_dark.pdb
```

###  3： PyMOL 
```
File → Open → interface_pub.pdb
#  .pml ，：
spectrum b, magenta blue orange gray, 5, 95
show surface; set transparency, 0.3
```

---

## 🎨 8 

|  |  |  |
|------|------|---------|
| 🌈 **Rainbow** |  | 、 |
| 🔬 **Scientific** |  | 、 |
| 📊 **Publication** |  | **** ⭐ |
| 🌙 **Dark** |  | 、 |
| 🔥 **Thermal** |  |  |
| 🍰 **Pastel** |  |  |
| ⬜ **Grayscale** |  | **** ⭐ |
| 🎯 **Contrasting** |  |  |

---

## 🛠️ 3 

###  1 ：
```bash
python scripts/color_scheme_manager.py template my_scheme.json
```

###  2 ： `my_scheme.json`

 4 ：

```json
{
  "scheme_name": "My Custom",  // ← 
  "roles": {
    "cdr": {
      "color_name": "Red",     // ← 
      "hex_code": "#FF0000",   // ← （HEX ）
      "pymol_name": "red"      // ← （PyMOL ）
    },
    "framework": {
      "color_name": "Blue",
      "hex_code": "#0000FF",
      "pymol_name": "blue"
    },
    "antigen": {
      "color_name": "Green",
      "hex_code": "#00AA00",
      "pymol_name": "green"
    },
    "other": {
      "color_name": "Gray",
      "hex_code": "#CCCCCC",
      "pymol_name": "gray"
    }
  }
}
```

###  3 ：
```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb \
    --scheme-config my_scheme.json \
    --ab_chains A --ag_chain B \
    --output interface_custom.pdb
```

---

## 📋 

### 
```
red, green, blue, yellow, cyan, magenta, 
white, black, gray, orange, purple
```

### 
```
pink, teal, navy, maroon, olive, lime,
aqua, salmon, khaki, gold, plum, violet
```

### PyMOL 
```
firebrick, crimson, darkorange, steelblue,
cadetblue, mediumaquamarine, darkseagreen
```

 HEX ：
```
"#FF0000"  
"#00FF00"  
"#0000FF"  
"#FFFF00"  
"#00FFFF"  
"#FF00FF"  
```

---

## 💾 

```python
from color_scheme_manager import SchemeManager
from colorize_interface_pdb import InterfaceColorizer

# 
scheme = SchemeManager.get_scheme("publication")

# 
colorizer = InterfaceColorizer(
    "complex.pdb",
    color_scheme=scheme
)

# 
colorizer.compute_interfaces(["A"], "B")
colorizer.assign_bfactors(["A"], "B")
colorizer.save_colored_pdb("output.pdb")
```

---

## ✨ 

### 
```bash
for s in rainbow scientific publication dark thermal pastel grayscale contrasting
do
    python scripts/colorize_interface_pdb.py \
        --pdb complex.pdb --scheme $s \
        --ab_chains A --ag_chain B \
        --output interface_${s}.pdb
done
```

 PyMOL 。

###  JSON
```bash
python scripts/color_scheme_manager.py export ./schemes/
```

### 
```bash
python scripts/color_scheme_manager.py show publication
```

：
```
============================================================
Scheme: publication
Type: publication
Description: Publication quality scheme
============================================================

Magenta    (B-factor 90–99)
  • PyMOL:    magenta
  • Chimera:  magenta
  • Hex:      #CC0066
  • Role:     CDR regions

...
```

---

## 🎯 

### 📰 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme publication \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output figure.pdb
```

### 🖨️ 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme grayscale \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output print.pdb
```

### 🎤 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme dark \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output presentation.pdb
```

### 🔬 
```bash
python scripts/colorize_interface_pdb.py \
    --scheme scientific \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output seminar.pdb
```

---

📖 **：** `docs/COLOR_SCHEME_GUIDE.md`

：2026-03-27
