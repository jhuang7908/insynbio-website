# 

## 
VHH  HER2 ECD  → 

## ：

###  A： PDB（，）

```bash
python scripts/colorize_interface_pdb.py \
    --pdb your_vhh_her2_complex.pdb \
    --ab_chains A \                    # VHH  A 
    --ag_chain B \                     # HER2 ECD  B 
    --contact_dist 4.5 \
    --output interface_colored.pdb
```

**：**
- `interface_colored.pdb` —  PDB（B-factor ）
- `interface_colored_color_by_bfactor.pml` — PyMOL 
- `interface_colored_coloring_report.txt` — 

** PyMOL ：**
```
File → Open → interface_colored.pdb
```

 PyMOL ：
```
spectrum b, white cyan blue orange red
show sticks
show surface
set transparency, 0.3
```

**：**
|  | B-factor |  |
|------|---------|------|
| 🔴 / | B≈95 | CDR  |
| 🔵 / | B≈55 |  |
| 🟠 / | B≈75 |  |
| ⚪ / | B≤20 |  |

---

###  B：

```bash
python scripts/visualize_interface_contacts.py \
    --pdb your_vhh_her2_complex.pdb \
    --ab_chains A \
    --ag_chain B \
    --contact_dist 4.5 \
    --output_prefix vhh_her2_interface
```

**：**
- `vhh_her2_interface_contacts.json` — 
- `vhh_her2_interface_pymol.pml` — PyMOL 
- `vhh_her2_interface_chimera.cxc` — UCSF ChimeraX 

** PyMOL ：**
```
File → Open → your_vhh_her2_complex.pdb
File → Run → vhh_her2_interface_pymol.pml
```

---

## 

###  1： PDB 

```bash
#  ID
python -c "
from Bio.PDB import PDBParser
parser = PDBParser(QUIET=True)
struct = parser.get_structure('s', 'your_pdb.pdb')
model = struct[0]
print('Chains:', [chain.id for chain in model])
"
```

###  2：

 VHH  A，HER2  B：
```bash
python scripts/colorize_interface_pdb.py \
    --pdb your_vhh_her2_complex.pdb \
    --ab_chains A \
    --ag_chain B \
    --output interface_colored.pdb
```

###  3： PyMOL 

```
pymol interface_colored.pdb
> spectrum b, white cyan blue orange red
> show surface
> set transparency, 0.3
> orient
```

###  4：

```
# PyMOL 
File → Export Image → PNG 
```

---

## ：

** VHH（VH + VL）：**
```bash
python scripts/colorize_interface_pdb.py \
    --pdb fab_her2_complex.pdb \
    --ab_chains A,B \              # 
    --ag_chain C \
    --output fab_interface.pdb
```

**：**
```bash
#  VHH-HER2  VHH-
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

## 

**Q: PyMOL ？**
A:  `spectrum` ：
```
spectrum b, white cyan blue orange red, 0, 100
```

**Q: ，？**
A:  PyMOL ：
```
# 
hide everything

# 
select interface, b >= 50
show sticks, interface
show cartoon, interface
```

**Q:  Chimera/ChimeraX ？**
A:  B  Chimera 。

**Q: （ 4.5 Å）？**
A: 
```bash
python scripts/colorize_interface_pdb.py \
    --contact_dist 5.0 \           #  5.0 Å
    --pdb your.pdb \
    --ab_chains A \
    --ag_chain B \
    --output interface.pdb
```

---

## 

### B-factor 

PyMOL  `spectrum`  B-factor ：
```
spectrum b, color1 color2 color3, min_value, max_value
```

：
- `spectrum b, white cyan blue orange red, 0, 100`
  - B ≤ 9：WHITE
  - B ≈ 55：CYAN
  - B ≈ 75：ORANGE
  - B ≈ 95：RED（CDR ）

### 

- ****：4.5 Å（；）
- ****：
- **CDR **：Kabat 

---

## 

：

```python
#  humanization 
import subprocess

def visualize_humanized_structure(pdb_path, output_dir):
    """ PDB 。"""
    subprocess.run([
        "python", "scripts/colorize_interface_pdb.py",
        "--pdb", pdb_path,
        "--ab_chains", "A,B",     # 
        "--ag_chain", "C",
        "--output", f"{output_dir}/interface_colored.pdb"
    ])
    
    print(f"✅ Colored PDB: {output_dir}/interface_colored.pdb")
    print("   Load in PyMOL: spectrum b, white cyan blue orange red")
```

---

## ？

- ****： `*_coloring_report.txt` 
- ** ID **： PDB 
- ****： `self.B_CDR / self.B_FR / self.B_AG` 

