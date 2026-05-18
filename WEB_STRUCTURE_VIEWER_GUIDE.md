# 🌐  — 

## 

### ✅  1：ECD  VHH FR 
**：** ，
```
VHH  ≠ HER2 ECD 
```

### ✅  2：
**：** /
- 
- 
- 

---

## 🚀 

### Step 1: 
```bash
# （VHH-HER2）
python scripts/web_structure_viewer.py \
    --pdb vhh_her2_complex.pdb \
    --preset vhh_her2 \
    --output viewer.html

# （FAB-）
python scripts/web_structure_viewer.py \
    --pdb fab_antigen_complex.pdb \
    --preset fab_antigen \
    --output viewer.html

# 
python scripts/web_structure_viewer.py \
    --pdb complex.pdb \
    --preset vhh_her2 \
    --title "My VHH-HER2 Complex" \
    --output viewer.html
```

### Step 2: 
```
File → Open → viewer.html

```

### Step 3: 

|  |  |
|------|------|
| 🖱️ **** |  |
| 🔄 **** | / |
| 🔀 **Shift+** |  |
| ☑️ **Show Sidechains** | / |
| ⚪ **Opacity Slider** |  |
| 🎯 **Quick Views** |  |

---

## 💡 

###  1：VHH-HER2
```bash
--preset vhh_her2
```

：
- ✅ VHH 
- ✅ HER2 ECD 
- ✅ VHH-HER2 
- ✅ ：
  - Overall
  - VHH Only
  - HER2 Only
  - Interface

###  2：FAB-
```bash
--preset fab_antigen
```

：
- ✅ VH 
- ✅ VL 
- ✅ 
- ✅ VH-
- ✅ VL-
- ✅ ：
  - Overall
  - CDR Sidechains（CDR ）
  - Interface

---

## 🎨 

### VHH-HER2 
```
🟣 VHH          #FF00FF 
🔵 HER2 ECD     #00CCFF 
```

### FAB-
```
🔴 VH           #FF0000 
🔵 VL           #0000FF 
🟢 Antigen      #00AA00 
```

---

## 🛠️ 

### 

 `viewer_config.json`：
```json
{
  "title": "My Custom Complex",
  "height": 800,
  "width": 1200,
  "chains": {
    "A": {
      "color": "#FF00FF",
      "representation": "cartoon",
      "name": "VHH"
    },
    "B": {
      "color": "#00CCFF",
      "representation": "cartoon",
      "name": "HER2"
    }
  },
  "interfaces": [
    {
      "chain1": "A",
      "chain2": "B",
      "color": "#FFFF00",
      "distance": 4.5
    }
  ],
  "views": [
    {
      "name": "Overall",
      "style": "all",
      "sidechain": false
    },
    {
      "name": "With Sidechains",
      "style": "all",
      "sidechain": true
    }
  ]
}
```

### 
```bash
python scripts/web_structure_viewer.py \
    --pdb complex.pdb \
    --config viewer_config.json \
    --output viewer.html
```

---

## 🎯 

###  1：
1. 
2.  "Interface" 
3. ☑️  "Show Sidechains"
4. 

###  2：
1. 
2. 
3. 
4.  "Quick Views" 

###  3：
1. （F11）
2. 
3. 
4. 

###  4：
1. 
2. 
3. /

---

## 📱 

|  |  |
|------|------|
| Chrome / Edge | ✅  |
| Firefox | ✅  |
| Safari | ✅  |
| IE 11 | ❌  |

---

## 🔧 

### 
- **3Dmol.js** —  3D 
- 
-  PDB、MOL、SDF 

### 
-  HTML  < 5 MB（ PDB ）
- 

### 
- （< 10,000 ）
- ，

---

## 💾 

### 
1.  viewer.html
2.  →  → "，"
3.  viewer.html 

### 
```bash
# ， viewer.html
# ，

# 
```

### 
1.  viewer.html
2. 
3.  F12 
4.  PNG/PDF

---

## 🎨 

###  HEX 

|  | HEX  |  |
|------|--------|------|
|  | #FF00FF |  (VHH/VH) |
|  | #00CCFF |  (ECD) |
|  | #FF0000 | VH  |
|  | #0000FF | VL  |
|  | #00AA00 |  |
|  | #FFFF00 |  |
|  | #CCCCCC |  |

---

## 📋 

### 
```bash
# VHH-HER2 
python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --output viewer.html

# FAB- 
python scripts/web_structure_viewer.py --pdb complex.pdb --preset fab_antigen --output viewer.html

# 
python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --title "MyTitle" --output viewer.html

# 
python scripts/web_structure_viewer.py --help
```

### 
```
    → 
        → 
Shift+    → 
```

### 
```
☑ Show Sidechains   → 
⚪ Opacity Slider    → 
🎯 Quick Views      → 
🔄 Reset View       → 
```

---

## ✨ 

###  1：

```
1. 
   python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --output viewer.html

2. 
    viewer.html

3. 
    "Interface" 

4. 
   ☑ Show Sidechains

5. 
   

6. 
   
```

###  2：

```
1. 
   python scripts/web_structure_viewer.py --pdb complex.pdb --preset vhh_her2 --title "Figure 2A" --output viewer.html

2. 

3. 
   -  Quick Views 
   - 
   -  Show Sidechains

4. 
   F12  → 
   

5. 
```

---

## 🔗 

|  |  |  |
|------|------|------|
|  | `colorize_interface_pdb.py` |  PDB |
|  | `visualize_interface_contacts.py` |  JSON |
|  | `web_structure_viewer.py` | ， |

---

## 📖 

### ：VHH-HER2 
```bash
# Step 1: 
python scripts/web_structure_viewer.py \
    --pdb vhh_her2_complex.pdb \
    --preset vhh_her2 \
    --title "VHH-HER2 Complex Analysis" \
    --output analysis_viewer.html

# Step 2:  PDB
python scripts/colorize_interface_pdb.py \
    --pdb vhh_her2_complex.pdb \
    --scheme publication \
    --ab_chains A --ag_chain B \
    --output vhh_her2_colored.pdb

# Step 3:  analysis_viewer.html
# 
```

---

**：** 2026-03-27  
**：** ✅   
**：** （Chrome, Firefox, Safari）  
**：** 
