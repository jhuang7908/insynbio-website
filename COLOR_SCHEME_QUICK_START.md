# 🎨 颜色方案 — 快速开始 (3分钟)

## 🚀 最快上手

### 步骤 1：查看所有方案
```bash
python scripts/color_scheme_manager.py list
```

输出：
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

### 步骤 2：用预设方案着色
```bash
# 默认 Rainbow
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb --ab_chains A --ag_chain B \
    --output interface.pdb

# Publication 方案（推荐论文）
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb --ab_chains A --ag_chain B \
    --scheme publication \
    --output interface_pub.pdb

# Dark 方案（暗色背景）
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb --ab_chains A --ag_chain B \
    --scheme dark \
    --output interface_dark.pdb
```

### 步骤 3：在 PyMOL 中查看
```
File → Open → interface_pub.pdb
# 运行脚本中生成的 .pml 文件，或手动输入：
spectrum b, magenta blue orange gray, 5, 95
show surface; set transparency, 0.3
```

---

## 🎨 8 种方案对照表

| 方案 | 用途 | 推荐场景 |
|------|------|---------|
| 🌈 **Rainbow** | 彩虹梯度 | 一般展示、清晰对比 |
| 🔬 **Scientific** | 能量风格 | 学术、热力学意义 |
| 📊 **Publication** | 出版级 | **期刊论文** ⭐ |
| 🌙 **Dark** | 深色主题 | 黑色背景、演讲 |
| 🔥 **Thermal** | 热力梯度 | 结合热力学 |
| 🍰 **Pastel** | 柔和配色 | 长期观看舒适 |
| ⬜ **Grayscale** | 黑白 | **打印输出** ⭐ |
| 🎯 **Contrasting** | 极高对比 | 极端可视化需求 |

---

## 🛠️ 3 分钟创建自定义方案

### 第 1 步：生成模板
```bash
python scripts/color_scheme_manager.py template my_scheme.json
```

### 第 2 步：编辑 `my_scheme.json`

只需改这 4 个地方：

```json
{
  "scheme_name": "My Custom",  // ← 改这个
  "roles": {
    "cdr": {
      "color_name": "Red",     // ← 改这个
      "hex_code": "#FF0000",   // ← 或这个（HEX 码）
      "pymol_name": "red"      // ← 或这个（PyMOL 名）
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

### 第 3 步：使用自定义方案
```bash
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2.pdb \
    --scheme-config my_scheme.json \
    --ab_chains A --ag_chain B \
    --output interface_custom.pdb
```

---

## 📋 常用颜色名

### 基础颜色
```
red, green, blue, yellow, cyan, magenta, 
white, black, gray, orange, purple
```

### 扩展颜色
```
pink, teal, navy, maroon, olive, lime,
aqua, salmon, khaki, gold, plum, violet
```

### PyMOL 特殊名
```
firebrick, crimson, darkorange, steelblue,
cadetblue, mediumaquamarine, darkseagreen
```

或直接用 HEX 码：
```
"#FF0000"  (红)
"#00FF00"  (绿)
"#0000FF"  (蓝)
"#FFFF00"  (黄)
"#00FFFF"  (青)
"#FF00FF"  (品红)
```

---

## 💾 在脚本中集成

```python
from color_scheme_manager import SchemeManager
from colorize_interface_pdb import InterfaceColorizer

# 加载方案
scheme = SchemeManager.get_scheme("publication")

# 创建着色器
colorizer = InterfaceColorizer(
    "complex.pdb",
    color_scheme=scheme
)

# 处理
colorizer.compute_interfaces(["A"], "B")
colorizer.assign_bfactors(["A"], "B")
colorizer.save_colored_pdb("output.pdb")
```

---

## ✨ 酷炫技巧

### 快速对比所有方案
```bash
for s in rainbow scientific publication dark thermal pastel grayscale contrasting
do
    python scripts/colorize_interface_pdb.py \
        --pdb complex.pdb --scheme $s \
        --ab_chains A --ag_chain B \
        --output interface_${s}.pdb
done
```

然后在 PyMOL 中一个一个打开对比。

### 导出所有预设方案为 JSON
```bash
python scripts/color_scheme_manager.py export ./schemes/
```

### 查看某个方案的完整详情
```bash
python scripts/color_scheme_manager.py show publication
```

输出：
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

## 🎯 推荐组合

### 📰 论文投稿
```bash
python scripts/colorize_interface_pdb.py \
    --scheme publication \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output figure.pdb
```

### 🖨️ 黑白打印
```bash
python scripts/colorize_interface_pdb.py \
    --scheme grayscale \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output print.pdb
```

### 🎤 演讲展示（暗背景）
```bash
python scripts/colorize_interface_pdb.py \
    --scheme dark \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output presentation.pdb
```

### 🔬 学术讲座
```bash
python scripts/colorize_interface_pdb.py \
    --scheme scientific \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output seminar.pdb
```

---

📖 **详细指南：** `docs/COLOR_SCHEME_GUIDE.md`

生成时间：2026-03-27
