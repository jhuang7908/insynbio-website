# PyMOL - 7D12

## PyMOL

### 1：PyMOL Desktop App（，）

**Windows**：
1. PyMOL Desktop：
   - ：https://pymol.org/2/
   - ：https://pymol.org/downloads/
   -  "PyMOL Open Source"  "PyMOL Educational"

2. ，PyMOL GUI

3. PyMOL：
   ```
   File → Run Script →  7d12_structure_pymol.pml
   ```
   PyMOL：
   ```
   @output/7D12/7d12_structure_pymol.pml
   ```

### 2：PyMOL

：
```bash
# Windows PowerShell
pymol output/7D12/7d12_structure_pymol.pml

# 
pymol -c output/7D12/7d12_structure_pymol.pml
```

### 3：conda

```bash
conda install -c conda-forge pymol
```

---

## PyMOL

### A：PyMOL GUI

1. **PyMOL Desktop App**

2. ****：
   - 1： → `File` → `Run Script` →  `output/7D12/7d12_structure_pymol.pml`
   - 2：PyMOL：
     ```
     @output/7D12/7d12_structure_pymol.pml
     ```
   - 3： `.pml` PyMOL

3. ****：
   - PNG
   - ：`output/7D12/7d12_4krl_structure_with_sr_mutations.png`

### B：

，PyMOL：

```python
# 1. 
load output/7D12/4KRL.pdb, 7d12

# 2. 
show cartoon, 7d12
show surface, 7d12

# 3. SR
select surface_muts, resi 12+83+96+101 and chain B
select buried_muts, resi 40+42 and chain B
select cdrs, resi 27-38+56-65+105-117 and chain B

# 4. 
color gray90, 7d12
color blue, surface_muts
color red, buried_muts
color green, cdrs

# 5. 
show spheres, surface_muts
show spheres, buried_muts
show sticks, cdrs

# 6. 
orient
zoom center, 50

# 7. 
ray 1200, 1200
png output/7D12/7d12_4krl_structure_with_sr_mutations.png, dpi=300
```

---

## （PyMOL）

### 1：ChimeraX（，）

1. **ChimeraX**：
   - https://www.cgl.ucsf.edu/chimerax/download.html

2. **PDB**：
   ```
   File → Open →  output/7D12/4KRL.pdb
   ```

3. ****（ChimeraX）：
   ```
   # B
   select :B
   
   # 
   surface
   
   # SR
   color #0000ff :12,83,96,101  # ：
   color #ff0000 :40,42          # ：
   color #00ff00 :27-38,56-65,105-117  # ：CDR
   
   # 
   save output/7D12/7d12_4krl_structure_with_sr_mutations.png
   ```

### 2：

**Mol* (molstar.org)**：
1. ：https://molstar.org/viewer/
2. PDB：`output/7D12/4KRL.pdb`
3. 

**PDB Viewer (rcsb.org)**：
1. ：https://www.rcsb.org/3d-view/4KRL
2. B
3. 

### 3：Python + py3Dmol（Jupyter Notebook）

Jupyter：
```python
import py3Dmol

# PDB
with open('output/7D12/4KRL.pdb', 'r') as f:
    pdb_str = f.read

# 3D
view = py3Dmol.view(width=800, height=600)
view.addModel(pdb_str, 'pdb')

# 
view.setStyle({'cartoon': {'color': 'gray'}})

# SR
view.addStyle({'resi': '12,83,96,101', 'chain': 'B'}, 
               {'cartoon': {'color': 'blue'}})  # 
view.addStyle({'resi': '40,42', 'chain': 'B'}, 
               {'cartoon': {'color': 'red'}})    # 
view.addStyle({'resi': '27-38,56-65,105-117', 'chain': 'B'}, 
               {'cartoon': {'color': 'green'}})   # CDR

view.zoomTo
view.show
```

---

## PyMOL

### Windows PowerShell：
```powershell
# PyMOL
Get-Command pymol -ErrorAction SilentlyContinue

# 
Test-Path "C:\Program Files\PyMOL\PyMOL.exe"
Test-Path "$env:LOCALAPPDATA\Programs\PyMOL\PyMOL.exe"
```

### ：
1. **PyMOL Desktop**：
   - https://pymol.org/2/
   -  "PyMOL Open Source" 

2. ****：
   ```powershell
   # PyMOL
   Get-Command pymol
   ```

---

## 

- **PyMOL**：`output/7D12/7d12_structure_pymol.pml`
- **PDB**：`output/7D12/4KRL.pdb`
- ****：`output/7D12/7d12_4krl_structure_with_sr_mutations.png`

---

## 

### Q1: PyMOL？
**A**: ，。

### Q2: ？
**A**: PyMOL，。

### Q3: ？
**A**: （chain B），。

### Q4: PyMOL？
**A**: ChimeraX（Mol*），。

---

## 

1. ****：PyMOL Desktop App →  → 3D
2. ****：ChimeraX →  → 
3. ****：（`output/7D12/7d12_structure_text_diagram.txt`）
4. ****：5 +  + 
