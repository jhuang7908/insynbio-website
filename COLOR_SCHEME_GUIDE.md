# 

## 🎨 

### 

```bash
# 
python scripts/color_scheme_manager.py list

# 
python scripts/color_scheme_manager.py show rainbow
python scripts/color_scheme_manager.py show publication
```

---

## 8 

### 1️⃣ **Rainbow** 🌈 
：
```
CDR (B=95)         🔴 
Framework (B=55)   🔵 
Antigen (B=75)     🟡 
Other (B=5)        ⚪ 
```
**：** 、

**PyMOL：**
```
spectrum b, red cyan yellow white, 5, 95
```

---

### 2️⃣ **Scientific** 🔬
：
```
CDR (B=95)         🔴  
Framework (B=55)   🔵  
Antigen (B=75)     🟢  
Other (B=5)        ⚪  
```
**：** 、

---

### 3️⃣ **Publication** 📊
：
```
CDR (B=95)         💜  (#CC0066)
Framework (B=55)   🔵  ( #0033CC)
Antigen (B=75)     🟠  (#FF8800)
Other (B=5)        ⚫ 
```
**：** 、（！）

---

### 4️⃣ **Dark** 🌙
：
```
CDR (B=95)         💜  
Framework (B=55)   🔵  
Antigen (B=75)     🟡  
Other (B=5)        ⬛ 
```
**：** 、

---

### 5️⃣ **Thermal** 🔥
：→
```
CDR (B=95)         🔴  
Framework (B=55)   🟢  
Antigen (B=75)     🟠  
Other (B=5)        🔵  
```
**：** 

---

### 6️⃣ **Pastel** 🍰
：
```
CDR (B=95)         🍑 
Framework (B=55)   🧊 
Antigen (B=75)     🧅 
Other (B=5)        🩶 
```
**：** 、

---

### 7️⃣ **Grayscale** ⬜
：
```
CDR (B=95)         ⬛  (darkest)
Framework (B=55)   🩶 
Antigen (B=75)     🩶 
Other (B=5)        ⚪ 
```
**：** B&W 、

---

### 8️⃣ **Contrasting** 🎯
：
```
CDR (B=95)         💜  (#FF00FF)
Framework (B=55)   🔵  (#00FFFF)
Antigen (B=75)     🟡  (#FFFF00)
Other (B=5)        ⚪ 
```
**：** 、

---

## 🎨 

###  1： Publication 

```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme publication \
    --ab_chains A \
    --ag_chain B \
    --output interface_pub.pdb
```

 PyMOL ：
```
spectrum b, magenta blue orange gray, 5, 95
```

###  2： Dark 

```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme dark \
    --ab_chains A \
    --ag_chain B \
    --output interface_dark.pdb
```

###  3： Grayscale 

```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme grayscale \
    --ab_chains A \
    --ag_chain B \
    --output interface_bw.pdb
```

---

## 🛠️ 

###  1：

```bash
python scripts/color_scheme_manager.py template my_colors.json
```

 `my_colors.json`：
```json
{
  "scheme_name": "my_custom_scheme",
  "scheme_type": "custom",
  "description": "My custom color scheme",
  "roles": {
    "cdr": {
      "bfactor_min": 90,
      "bfactor_max": 99,
      "color_name": "Red",
      "hex_code": "#FF0000",
      "pymol_name": "red",
      "chimera_name": "red",
      "description": "CDR interface hot spots",
      "priority": 3
    },
    "framework": {
      "bfactor_min": 50,
      "bfactor_max": 59,
      "color_name": "Blue",
      "hex_code": "#0000FF",
      "pymol_name": "blue",
      "chimera_name": "blue",
      "description": "Framework interface",
      "priority": 2
    },
    "antigen": {
      "bfactor_min": 70,
      "bfactor_max": 79,
      "color_name": "Green",
      "hex_code": "#00AA00",
      "pymol_name": "green",
      "chimera_name": "green",
      "description": "Antigen interface",
      "priority": 2
    },
    "other": {
      "bfactor_min": 0,
      "bfactor_max": 20,
      "color_name": "White",
      "hex_code": "#FFFFFF",
      "pymol_name": "white",
      "chimera_name": "white",
      "description": "Non-interface regions",
      "priority": 1
    }
  }
}
```

###  2：

 `my_colors.json` ：

#### 

|  |  |  |
|------|------|------|
| `scheme_name` |  | `"Publication Red-Blue"` |
| `description` |  | `"For journal Nature Methods"` |
| `bfactor_min`/`max` | B-factor  | `90-99` for CDR |
| `color_name` | | `"Crimson"` |
| `hex_code` |  | `"#DC143C"` |
| `pymol_name` | PyMOL  | `"red"`, `"blue"`, `"orange"` |
| `chimera_name` | ChimeraX  |  PyMOL |
| `description` |  | `"CDR hot spots"` |
| `priority` |  |  |

####  PyMOL/Chimera 

```
Basic:
  red, green, blue, yellow, cyan, magenta, white, black, gray

Extended:
  orange, purple, lime, pink, teal, olive, navy, maroon, aqua
  
Named (PyMOL):
  firebrick, indianred, lightcoral, salmon, darksalmon, crimson
  darkred, mediumvioletred, palevioletred, hotpink, deeppink
  lightpink, pink, lavender, plum, violet, orchid, darkmagenta
  purple, mediumorchid, darkviolet, blueviolet, indigo
  slateblue, mediumslateblue, greensea, lightseagreen, mediumaquamarine
  mediumspringgreen, springgreen, mediumseagreen, seagreen
  darkseagreen, darkslategray, darkslategrey, dimgray, dimgrey
  lightslategray, lightslategrey, lightslateblue, slategray, slategrey
  steelblue, cadetblue, lightsteelblue, lightblue, powderblue
  lightcyan, paleturquoise, darkturquoise, turquoise, cyan
  aquamarine, mediumturquoise, turquoise, darkturquoise, lightturquoise
  darkslateblue, mediumslateblue, lightcyan, lightyellow, khaki
  gold, orange, darkorange, orangered, red, crimson
```

###  3：

```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_colors.json \
    --ab_chains A \
    --ag_chain B \
    --output interface_custom.pdb
```

---

## 💡 

###  1：（Nature Methods）

```json
{
  "scheme_name": "Nature Methods",
  "description": "Publication-grade scheme for Nature Methods journal",
  "roles": {
    "cdr": {
      "bfactor_min": 90,
      "bfactor_max": 99,
      "color_name": "Crimson",
      "hex_code": "#DC143C",
      "pymol_name": "red",
      "chimera_name": "red"
    },
    "framework": {
      "bfactor_min": 50,
      "bfactor_max": 59,
      "color_name": "Steel Blue",
      "hex_code": "#4682B4",
      "pymol_name": "blue",
      "chimera_name": "blue"
    },
    "antigen": {
      "bfactor_min": 70,
      "bfactor_max": 79,
      "color_name": "Dark Green",
      "hex_code": "#228B22",
      "pymol_name": "green",
      "chimera_name": "green"
    },
    "other": {
      "bfactor_min": 0,
      "bfactor_max": 20,
      "color_name": "Light Gray",
      "hex_code": "#D3D3D3",
      "pymol_name": "lightgray",
      "chimera_name": "lightgray"
    }
  }
}
```

###  2：（Deuteranopia）

```json
{
  "scheme_name": "Color-blind friendly (Deuteranopia)",
  "description": "For red-green color blindness",
  "roles": {
    "cdr": {
      "bfactor_min": 90,
      "bfactor_max": 99,
      "color_name": "Blue",
      "hex_code": "#0173B2",
      "pymol_name": "blue"
    },
    "framework": {
      "bfactor_min": 50,
      "bfactor_max": 59,
      "color_name": "Orange",
      "hex_code": "#DE8F05",
      "pymol_name": "orange"
    },
    "antigen": {
      "bfactor_min": 70,
      "bfactor_max": 79,
      "color_name": "Red",
      "hex_code": "#CC78BC",
      "pymol_name": "magenta"
    },
    "other": {
      "bfactor_min": 0,
      "bfactor_max": 20,
      "color_name": "Gray",
      "hex_code": "#999999",
      "pymol_name": "gray"
    }
  }
}
```

###  3：

```json
{
  "scheme_name": "Minimalist",
  "description": "Only two colors: interface vs non-interface",
  "roles": {
    "cdr": {
      "bfactor_min": 90,
      "bfactor_max": 99,
      "color_name": "Black",
      "hex_code": "#000000",
      "pymol_name": "black"
    },
    "framework": {
      "bfactor_min": 50,
      "bfactor_max": 59,
      "color_name": "Black",
      "hex_code": "#000000",
      "pymol_name": "black"
    },
    "antigen": {
      "bfactor_min": 70,
      "bfactor_max": 79,
      "color_name": "Black",
      "hex_code": "#000000",
      "pymol_name": "black"
    },
    "other": {
      "bfactor_min": 0,
      "bfactor_max": 20,
      "color_name": "Light Gray",
      "hex_code": "#EEEEEE",
      "pymol_name": "lightgray"
    }
  }
}
```

---

## 🔄 B-factor 

B-factor  PyMOL/Chimera 。

### 

****：
```
CDR:       90-99   
Framework: 50-59   
Antigen:   70-79   
Other:     0-20    
```

****：
```
CDR:       80-99   
Framework: 40-59   
Antigen:   60-79   
Other:     0-30    
```

---

## 📤 

```bash
python scripts/color_scheme_manager.py export ./my_schemes/
```

：
```
my_schemes/
├── rainbow.json
├── scientific.json
├── publication.json
├── dark.json
├── thermal.json
├── pastel.json
├── grayscale.json
└── contrasting.json
```

：
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_schemes/publication.json \
    --output interface.pdb
```

---

## 🎯 

 `compare_schemes.sh`：

```bash
#!/bin/bash

for scheme in rainbow scientific publication dark thermal pastel grayscale contrasting
do
    python scripts/colorize_interface_pdb.py \
        --pdb vhh_her2.pdb \
        --scheme $scheme \
        --ab_chains A --ag_chain B \
        --output interface_${scheme}.pdb
    
    echo "Generated: interface_${scheme}.pdb"
done

echo "✅ All schemes generated. Compare in PyMOL:"
echo "   open interface_rainbow.pdb"
echo "   spectrum b, ..."
```

---

## 📋 

|  |  |  |
|------|---------|------|
|  | Publication | 、 |
|  | Scientific |  |
|  | Dark |  |
|  | Grayscale |  |
|  | Rainbow |  |
|  | Contrasting | CMY  |
|  | Pastel |  |

---

## 🐍  Python 

```python
from color_scheme_manager import SchemeManager, ColorScheme
from colorize_interface_pdb import InterfaceColorizer

#  1：
scheme = SchemeManager.get_scheme("publication")

#  2：
scheme = SchemeManager.load_custom_scheme("my_colors.json")

# 
colorizer = InterfaceColorizer(
    "complex.pdb",
    color_scheme=scheme
)

# 
scheme.print_summary

#  PyMOL 
pymol_cmd = scheme.to_pymol_spectrum
print(f"PyMOL: {pymol_cmd}")
```

---

：2026-03-27 | 
