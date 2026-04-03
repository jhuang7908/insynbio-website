# 自定义颜色方案完全指南

## 🎨 可用的预设方案

### 快速预览

```bash
# 列出所有方案
python scripts/color_scheme_manager.py list

# 查看某个方案详情
python scripts/color_scheme_manager.py show rainbow
python scripts/color_scheme_manager.py show publication
```

---

## 8 种内置方案详解

### 1️⃣ **Rainbow** 🌈 (默认)
经典彩虹梯度：从红到紫
```
CDR (B=95)         🔴 红
Framework (B=55)   🔵 青
Antigen (B=75)     🟡 黄
Other (B=5)        ⚪ 白
```
**适用场景：** 一般展示、清晰对比

**PyMOL：**
```
spectrum b, red cyan yellow white, 5, 95
```

---

### 2️⃣ **Scientific** 🔬
科学级配色：能量风格
```
CDR (B=95)         🔴 红 (高能)
Framework (B=55)   🔵 蓝 (低能)
Antigen (B=75)     🟢 绿 (中能)
Other (B=5)        ⚪ 白 (背景)
```
**适用场景：** 学术论文、热力学概念

---

### 3️⃣ **Publication** 📊
出版级配色：印刷友好
```
CDR (B=95)         💜 品红 (#CC0066)
Framework (B=55)   🔵 蓝 (深 #0033CC)
Antigen (B=75)     🟠 橙 (#FF8800)
Other (B=5)        ⚫ 灰
```
**适用场景：** 期刊论文、会议演讲（推荐！）

---

### 4️⃣ **Dark** 🌙
深色主题：黑色背景友好
```
CDR (B=95)         💜 品红 (亮)
Framework (B=55)   🔵 青 (亮)
Antigen (B=75)     🟡 黄 (亮)
Other (B=5)        ⬛ 黑
```
**适用场景：** 暗黑主题演讲、黑色背景

---

### 5️⃣ **Thermal** 🔥
热力梯度：蓝(冷)→红(热)
```
CDR (B=95)         🔴 红 (热)
Framework (B=55)   🟢 绿 (温)
Antigen (B=75)     🟠 橙 (温)
Other (B=5)        🔵 蓝 (冷)
```
**适用场景：** 结合热力学意义的可视化

---

### 6️⃣ **Pastel** 🍰
柔和配色：温和易看
```
CDR (B=95)         🍑 浅红
Framework (B=55)   🧊 浅蓝
Antigen (B=75)     🧅 浅橙
Other (B=5)        🩶 浅灰
```
**适用场景：** 用户界面、长期盯看展示

---

### 7️⃣ **Grayscale** ⬜
灰度：黑白打印
```
CDR (B=95)         ⬛ 黑 (darkest)
Framework (B=55)   🩶 深灰
Antigen (B=75)     🩶 中灰
Other (B=5)        ⚪ 浅灰
```
**适用场景：** B&W 打印、黑白论文

---

### 8️⃣ **Contrasting** 🎯
高对比：三原色
```
CDR (B=95)         💜 品红 (#FF00FF)
Framework (B=55)   🔵 青 (#00FFFF)
Antigen (B=75)     🟡 黄 (#FFFF00)
Other (B=5)        ⚪ 白
```
**适用场景：** 极端高对比需求、色盲友好（部分）

---

## 🎨 使用预设方案

### 示例 1：使用 Publication 方案

```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme publication \
    --ab_chains A \
    --ag_chain B \
    --output interface_pub.pdb
```

然后在 PyMOL 中：
```
spectrum b, magenta blue orange gray, 5, 95
```

### 示例 2：使用 Dark 方案（暗色背景）

```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme dark \
    --ab_chains A \
    --ag_chain B \
    --output interface_dark.pdb
```

### 示例 3：使用 Grayscale 方案（打印）

```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme grayscale \
    --ab_chains A \
    --ag_chain B \
    --output interface_bw.pdb
```

---

## 🛠️ 创建自定义方案

### 步骤 1：生成模板

```bash
python scripts/color_scheme_manager.py template my_colors.json
```

生成的 `my_colors.json`：
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

### 步骤 2：修改颜色

编辑 `my_colors.json` 中的以下字段：

#### 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `scheme_name` | 方案名称 | `"Publication Red-Blue"` |
| `description` | 描述 | `"For journal Nature Methods"` |
| `bfactor_min`/`max` | B-factor 范围 | `90-99` for CDR |
| `color_name` | 颜色名称（显示用）| `"Crimson"` |
| `hex_code` | 十六进制颜色码 | `"#DC143C"` |
| `pymol_name` | PyMOL 颜色名 | `"red"`, `"blue"`, `"orange"` |
| `chimera_name` | ChimeraX 颜色名 | 同 PyMOL |
| `description` | 角色描述 | `"CDR hot spots"` |
| `priority` | 显示优先级 | 越高越重要 |

#### 常见 PyMOL/Chimera 颜色名

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

### 步骤 3：使用自定义方案

```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_colors.json \
    --ab_chains A \
    --ag_chain B \
    --output interface_custom.pdb
```

---

## 💡 创意配色方案示例

### 例 1：论文投稿风格（Nature Methods）

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

### 例 2：色盲友好方案（Deuteranopia）

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

### 例 3：极简主义（只用两色）

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

## 🔄 B-factor 范围调优

B-factor 范围影响 PyMOL/Chimera 的颜色梯度平滑度。

### 推荐配置

**紧密范围**（快速颜色变化）：
```
CDR:       90-99   (紧)
Framework: 50-59   (紧)
Antigen:   70-79   (紧)
Other:     0-20    (宽)
```

**宽松范围**（平滑梯度）：
```
CDR:       80-99   (宽)
Framework: 40-59   (宽)
Antigen:   60-79   (宽)
Other:     0-30    (宽)
```

---

## 📤 导出所有方案为文件

```bash
python scripts/color_scheme_manager.py export ./my_schemes/
```

生成：
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

然后可以一个一个尝试：
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --scheme-config my_schemes/publication.json \
    --output interface.pdb
```

---

## 🎯 快速对比多个方案

创建对比脚本 `compare_schemes.sh`：

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

## 📋 颜色方案选择建议

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 期刊论文 | Publication | 专业、印刷友好 |
| 学术报告 | Scientific | 能量风格合理 |
| 暗色背景 | Dark | 高对比度 |
| 黑白打印 | Grayscale | 完美可读性 |
| 通用展示 | Rainbow | 清晰对比 |
| 色盲友好 | Contrasting | CMY 配色 |
| 柔和看着 | Pastel | 长期观看舒适 |

---

## 🐍 在 Python 中使用

```python
from color_scheme_manager import SchemeManager, ColorScheme
from colorize_interface_pdb import InterfaceColorizer

# 方法 1：使用预设方案
scheme = SchemeManager.get_scheme("publication")

# 方法 2：加载自定义方案
scheme = SchemeManager.load_custom_scheme("my_colors.json")

# 创建着色器并应用方案
colorizer = InterfaceColorizer(
    "complex.pdb",
    color_scheme=scheme
)

# 查看方案详情
scheme.print_summary()

# 获取 PyMOL 命令
pymol_cmd = scheme.to_pymol_spectrum()
print(f"PyMOL: {pymol_cmd}")
```

---

生成时间：2026-03-27 | 自动生成工具集
