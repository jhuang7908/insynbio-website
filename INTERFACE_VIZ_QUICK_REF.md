#  — 

## 
🔴 **VHH  + HER2 ECD ** → 

## （2）

### ⚡ ： PDB
```bash
python scripts/colorize_interface_pdb.py \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output colored.pdb
```

 PyMOL ：
```
spectrum b, white cyan blue orange red
show surface; set transparency, 0.3
```

|  | B-factor |  |
|------|---------|------|
| 🔴  | 95 | CDR  |
| 🔵  | 55 |  |
| 🟠  | 75 |  |

---

### 📊 ： + 
```bash
python scripts/visualize_interface_contacts.py \
    --pdb complex.pdb \
    --ab_chains A --ag_chain B \
    --output_prefix interface_analysis
```

：
- `*_contacts.json` — 
- `*_pymol.pml` — PyMOL   
- `*_chimera.cxc` — ChimeraX 

---

## 

**FAB（VH + VL）:**
```bash
python scripts/colorize_interface_pdb.py \
    --ab_chains A,B --ag_chain C \
    --pdb fab_her2.pdb --output colored.pdb
```

---

##  PyMOL 

```python
#  PDB
load colored.pdb

#  B-factor 
spectrum b, white cyan blue orange red

# 
show sticks
show cartoon  
show surface
set transparency, 0.3

# 
select interface, b >= 50
hide everything
show sticks, interface
show cartoon, interface

# 
png image.png, dpi=300, width=1200
```

---

## 

|  |  |
|------|------|
| `scripts/colorize_interface_pdb.py` | ： PDB |
| `scripts/visualize_interface_contacts.py` |  |
| `scripts/demo_interface_visualization.py` |  |
| `docs/INTERFACE_VISUALIZATION_GUIDE.md` |  |

---

##  ID

```python
from Bio.PDB import PDBParser
p = PDBParser(QUIET=True)
s = p.get_structure('s', 'complex.pdb')
print([c.id for c in s[0]])  #  ID
```

---

：2026-03-27 | 
