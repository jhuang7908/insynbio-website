# PyMOL使用指南 - 7D12结构图生成

## PyMOL安装方式

### 方式1：PyMOL Desktop App（推荐，最简单）

**Windows用户**：
1. 下载PyMOL Desktop（免费教育版）：
   - 访问：https://pymol.org/2/
   - 或直接下载：https://pymol.org/downloads/
   - 选择 "PyMOL Open Source" 或 "PyMOL Educational"

2. 安装后，双击桌面图标打开PyMOL GUI

3. 在PyMOL中运行脚本：
   ```
   File → Run Script → 选择 7d12_structure_pymol.pml
   ```
   或直接在PyMOL命令行输入：
   ```
   @output/7D12/7d12_structure_pymol.pml
   ```

### 方式2：命令行PyMOL

如果已安装命令行版本：
```bash
# Windows PowerShell
pymol output/7D12/7d12_structure_pymol.pml

# 或直接运行命令
pymol -c output/7D12/7d12_structure_pymol.pml
```

### 方式3：通过conda安装

```bash
conda install -c conda-forge pymol
```

---

## 使用生成的PyMOL脚本

### 方法A：在PyMOL GUI中运行

1. **打开PyMOL Desktop App**

2. **加载脚本**：
   - 方法1：菜单栏 → `File` → `Run Script` → 选择 `output/7D12/7d12_structure_pymol.pml`
   - 方法2：在PyMOL命令行窗口（底部）输入：
     ```
     @output/7D12/7d12_structure_pymol.pml
     ```
   - 方法3：直接拖拽 `.pml` 文件到PyMOL窗口

3. **查看结果**：
   - 结构图会自动渲染并保存为PNG文件
   - 保存位置：`output/7D12/7d12_4krl_structure_with_sr_mutations.png`

### 方法B：手动执行命令

如果脚本无法自动运行，可以在PyMOL命令行中手动执行：

```python
# 1. 加载结构
load output/7D12/4KRL.pdb, 7d12

# 2. 设置显示样式
show cartoon, 7d12
show surface, 7d12

# 3. 选择SR突变位点
select surface_muts, resi 12+83+96+101 and chain B
select buried_muts, resi 40+42 and chain B
select cdrs, resi 27-38+56-65+105-117 and chain B

# 4. 设置颜色
color gray90, 7d12
color blue, surface_muts
color red, buried_muts
color green, cdrs

# 5. 高亮显示
show spheres, surface_muts
show spheres, buried_muts
show sticks, cdrs

# 6. 调整视角
orient
zoom center, 50

# 7. 渲染图像
ray 1200, 1200
png output/7D12/7d12_4krl_structure_with_sr_mutations.png, dpi=300
```

---

## 替代方案（如果无法安装PyMOL）

### 方案1：ChimeraX（免费，推荐）

1. **下载ChimeraX**：
   - https://www.cgl.ucsf.edu/chimerax/download.html

2. **打开PDB文件**：
   ```
   File → Open → 选择 output/7D12/4KRL.pdb
   ```

3. **执行命令**（在ChimeraX命令行）：
   ```
   # 选择链B
   select :B
   
   # 显示表面
   surface
   
   # 标记SR突变位点
   color #0000ff :12,83,96,101  # 蓝色：表面暴露位点
   color #ff0000 :40,42          # 红色：掩埋位点
   color #00ff00 :27-38,56-65,105-117  # 绿色：CDR区域
   
   # 保存图像
   save output/7D12/7d12_4krl_structure_with_sr_mutations.png
   ```

### 方案2：在线工具

**Mol* (molstar.org)**：
1. 访问：https://molstar.org/viewer/
2. 上传PDB文件：`output/7D12/4KRL.pdb`
3. 手动标记残基（需要手动操作）

**PDB Viewer (rcsb.org)**：
1. 访问：https://www.rcsb.org/3d-view/4KRL
2. 选择链B
3. 手动标记残基

### 方案3：使用Python + py3Dmol（Jupyter Notebook）

如果安装了Jupyter：
```python
import py3Dmol

# 读取PDB文件
with open('output/7D12/4KRL.pdb', 'r') as f:
    pdb_str = f.read()

# 创建3D视图
view = py3Dmol.view(width=800, height=600)
view.addModel(pdb_str, 'pdb')

# 设置样式
view.setStyle({'cartoon': {'color': 'gray'}})

# 标记SR突变位点
view.addStyle({'resi': '12,83,96,101', 'chain': 'B'}, 
               {'cartoon': {'color': 'blue'}})  # 表面暴露
view.addStyle({'resi': '40,42', 'chain': 'B'}, 
               {'cartoon': {'color': 'red'}})    # 掩埋
view.addStyle({'resi': '27-38,56-65,105-117', 'chain': 'B'}, 
               {'cartoon': {'color': 'green'}})   # CDR

view.zoomTo()
view.show()
```

---

## 快速检查PyMOL是否已安装

### Windows PowerShell：
```powershell
# 检查PyMOL命令
Get-Command pymol -ErrorAction SilentlyContinue

# 或检查常见安装路径
Test-Path "C:\Program Files\PyMOL\PyMOL.exe"
Test-Path "$env:LOCALAPPDATA\Programs\PyMOL\PyMOL.exe"
```

### 如果未安装：
1. **下载PyMOL Desktop**（最简单）：
   - https://pymol.org/2/
   - 选择 "PyMOL Open Source" 版本

2. **安装后验证**：
   ```powershell
   # 应该能找到PyMOL
   Get-Command pymol
   ```

---

## 生成的脚本文件位置

- **PyMOL脚本**：`output/7D12/7d12_structure_pymol.pml`
- **PDB文件**：`output/7D12/4KRL.pdb`
- **输出图像**：`output/7D12/7d12_4krl_structure_with_sr_mutations.png`

---

## 常见问题

### Q1: PyMOL脚本无法运行？
**A**: 检查文件路径是否正确，使用绝对路径或确保在项目根目录运行。

### Q2: 图像没有保存？
**A**: 检查PyMOL是否有写入权限，或手动指定完整路径。

### Q3: 颜色显示不正确？
**A**: 确保选择了正确的链（chain B），检查残基编号是否正确。

### Q4: 没有PyMOL怎么办？
**A**: 使用ChimeraX（免费）或在线工具（Mol*），或使用文本结构图（已生成）。

---

## 推荐工作流程

1. **首选**：安装PyMOL Desktop App → 运行脚本 → 查看3D结构图
2. **备选**：使用ChimeraX → 手动执行命令 → 查看结构图
3. **快速查看**：使用文本结构图（`output/7D12/7d12_structure_text_diagram.txt`）
4. **论文使用**：图5散点图 + 文本结构图 + 结构摘要表格
