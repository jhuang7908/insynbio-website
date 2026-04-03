# 接触面可视化 — 快速参考

## 问题
🔴 **VHH 框架 + HER2 ECD 颜色相近** → 侧链接触面看不清

## 解决方案（2个脚本）

### ⚡ 最快：直接着色 PDB
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output colored.pdb
```

在 PyMOL 中：
```
spectrum b, white cyan blue orange red
show surface; set transparency, 0.3
```

| 颜色 | B-factor | 含义 |
|------|---------|------|
| 🔴 红 | 95 | CDR 接触 |
| 🔵 青 | 55 | 框架接触 |
| 🟠 橙 | 75 | 抗原接触 |

---

### 📊 详细分析：生成接触表 + 脚本
```bash
python scripts/visualize_interface_contacts.py \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output_prefix interface_analysis
```

输出：
- `*_contacts.json` — 所有接触对
- `*_pymol.pml` — PyMOL 脚本  
- `*_chimera.cxc` — ChimeraX 脚本

---

## 多链情况

**FAB（VH + VL）:**
```bash
python scripts/colorize_interface_pdb.py \
    --ab_chains A,B --ag_chain C \
    --pdb fab_her2.pdb --output colored.pdb
```

---

## 常用 PyMOL 命令

```python
# 加载着色后的 PDB
load colored.pdb

# 应用 B-factor 颜色映射
spectrum b, white cyan blue orange red

# 显示相关结构
show sticks
show cartoon  
show surface
set transparency, 0.3

# 只显示接触界面
select interface, b >= 50
hide everything
show sticks, interface
show cartoon, interface

# 导出
png image.png, dpi=300, width=1200
```

---

## 文件位置

| 文件 | 功能 |
|------|------|
| `scripts/colorize_interface_pdb.py` | 主工具：着色 PDB |
| `scripts/visualize_interface_contacts.py` | 详细分析 |
| `scripts/demo_interface_visualization.py` | 演示脚本 |
| `docs/INTERFACE_VISUALIZATION_GUIDE.md` | 完整文档 |

---

## 检查链 ID

```python
from Bio.PDB import PDBParser
p = PDBParser(QUIET=True)
s = p.get_structure('s', 'complex.pdb')
print([c.id for c in s[0]])  # 显示链 ID
```

---

生成时间：2026-03-27 | 自动生成工具集
