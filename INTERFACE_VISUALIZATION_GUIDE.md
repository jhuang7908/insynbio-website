# 接触面可视化快速指南

## 问题
VHH 框架和 HER2 ECD 默认颜色太相近 → 侧链接触界面难以辨识

## 解决方案：两个工具

### 方案 A：直接重新着色 PDB（推荐，最简单）

```bash
python scripts/colorize_interface_pdb.py \
    --pdb your_vhh_her2_complex.pdb \
    --ab_chains A \                    # VHH 在 A 链
    --ag_chain B \                     # HER2 ECD 在 B 链
    --contact_dist 4.5 \
    --output interface_colored.pdb
```

**输出文件：**
- `interface_colored.pdb` — 着色后的 PDB（B-factor 编码）
- `interface_colored_color_by_bfactor.pml` — PyMOL 脚本
- `interface_colored_coloring_report.txt` — 说明文档

**在 PyMOL 中打开：**
```
File → Open → interface_colored.pdb
```

然后执行 PyMOL 命令：
```
spectrum b, white cyan blue orange red
show sticks
show surface
set transparency, 0.3
```

**颜色对应：**
| 颜色 | B-factor | 含义 |
|------|---------|------|
| 🔴 红/品红 | B≈95 | CDR 接触界面（热点） |
| 🔵 青/蓝 | B≈55 | 框架接触界面 |
| 🟠 橙/黄 | B≈75 | 抗原接触界面 |
| ⚪ 白/灰 | B≤20 | 非接触区（表面或埋藏） |

---

### 方案 B：生成交互式可视化脚本（更详细）

```bash
python scripts/visualize_interface_contacts.py \
    --pdb your_vhh_her2_complex.pdb \
    --ab_chains A \
    --ag_chain B \
    --contact_dist 4.5 \
    --output_prefix vhh_her2_interface
```

**输出文件：**
- `vhh_her2_interface_contacts.json` — 所有接触残基对（可用于进一步分析）
- `vhh_her2_interface_pymol.pml` — PyMOL 脚本（详细选择）
- `vhh_her2_interface_chimera.cxc` — UCSF ChimeraX 脚本

**在 PyMOL 中打开：**
```
File → Open → your_vhh_her2_complex.pdb
File → Run → vhh_her2_interface_pymol.pml
```

---

## 快速上手流程

### 步骤 1：检查你的 PDB 文件

```bash
# 查看链 ID
python -c "
from Bio.PDB import PDBParser
parser = PDBParser(QUIET=True)
struct = parser.get_structure('s', 'your_pdb.pdb')
model = struct[0]
print('Chains:', [chain.id for chain in model])
"
```

### 步骤 2：运行着色脚本

如果你的 VHH 在链 A，HER2 在链 B：
```bash
python scripts/colorize_interface_pdb.py \
    --pdb your_vhh_her2_complex.pdb \
    --ab_chains A \
    --ag_chain B \
    --output interface_colored.pdb
```

### 步骤 3：在 PyMOL 中可视化

```
pymol interface_colored.pdb
> spectrum b, white cyan blue orange red
> show surface
> set transparency, 0.3
> orient
```

### 步骤 4：导出截图

```
# PyMOL 中
File → Export Image → PNG (设置分辨率)
```

---

## 高级用法：联合多个抗体或多链

**多链 VHH（VH + VL）：**
```bash
python scripts/colorize_interface_pdb.py \
    --pdb fab_her2_complex.pdb \
    --ab_chains A,B \              # 两条链组成抗体
    --ag_chain C \
    --output fab_interface.pdb
```

**多个接触界面：**
```bash
# 分别分析 VHH-HER2 和 VHH-另一个靶点
python scripts/colorize_interface_pdb.py \
    --pdb bispecific_complex.pdb \
    --ab_chains A \
    --ag_chain B \
    --output interface_target1.pdb

python scripts/colorize_interface_pdb.py \
    --pdb bispecific_complex.pdb \
    --ab_chains A \
    --ag_chain C \
    --output interface_target2.pdb
```

---

## 常见问题

**Q: PyMOL 中颜色还是看不清？**
A: 调整 `spectrum` 命令的映射范围：
```
spectrum b, white cyan blue orange red, 0, 100
```

**Q: 只想看接触残基的侧链，其他部分隐藏？**
A: 在 PyMOL 中执行：
```
# 隐藏所有
hide everything

# 只显示接触界面和其周围残基
select interface, b >= 50
show sticks, interface
show cartoon, interface
```

**Q: 导出为 Chimera/ChimeraX 格式？**
A: 使用方案 B 的脚本输出自动包含 Chimera 格式。

**Q: 修改接触距离阈值（默认 4.5 Å）？**
A: 
```bash
python scripts/colorize_interface_pdb.py \
    --contact_dist 5.0 \           # 增加到 5.0 Å
    --pdb your.pdb \
    --ab_chains A \
    --ag_chain B \
    --output interface.pdb
```

---

## 技术细节

### B-factor 颜色映射原理

PyMOL 的 `spectrum` 命令可以将 B-factor 值映射到颜色：
```
spectrum b, color1 color2 color3, min_value, max_value
```

我们使用的映射：
- `spectrum b, white cyan blue orange red, 0, 100`
  - B ≤ 9：WHITE（非接触）
  - B ≈ 55：CYAN（框架接触）
  - B ≈ 75：ORANGE（抗原接触）
  - B ≈ 95：RED（CDR 接触）

### 接触定义

- **距离阈值**：4.5 Å（标准界面定义；可调整）
- **原子对**：两个残基之间任意原子对的最小距离
- **CDR 定义**：Kabat 编号系统（可在脚本中修改）

---

## 集成到你的项目

将脚本放入你的项目流程：

```python
# 在你的 humanization 报告脚本中添加
import subprocess

def visualize_humanized_structure(pdb_path, output_dir):
    """自动生成着色后的 PDB 用于可视化。"""
    subprocess.run([
        "python", "scripts/colorize_interface_pdb.py",
        "--pdb", pdb_path,
        "--ab_chains", "A,B",     # 根据你的链标记调整
        "--ag_chain", "C",
        "--output", f"{output_dir}/interface_colored.pdb"
    ])
    
    print(f"✅ Colored PDB: {output_dir}/interface_colored.pdb")
    print("   Load in PyMOL: spectrum b, white cyan blue orange red")
```

---

## 需要帮助？

- **脚本输出有问题**：检查 `*_coloring_report.txt` 中的统计数据
- **链 ID 不对**：运行检查脚本确认你的 PDB 中的实际链标记
- **需要不同的配色方案**：编辑脚本中的 `self.B_CDR / self.B_FR / self.B_AG` 值

