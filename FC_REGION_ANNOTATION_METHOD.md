# Fc

## 

Fc（Fragment crystallizable）C，。。

## Fc

IgG：

```
[V] - [CH1] - [Hinge] - [CH2] - [CH3] - [C_terminal]
         ↓        ↓        ↓       ↓          ↓
       ~98aa   ~12-19aa  ~110aa  ~107aa   ~27-71aa
```

## 

### 1. 

Fc`data/germlines/fc_aa/fc_database/`，：

- `CH1`: 1
- `Hinge`: 
- `CH2`: 2
- `CH3`: 3
- `Unknown`: （HingeC_terminal）

### 2. 

#### 1：Header

`scripts/annotate_constant_regions.py`FASTAheader：

```python
def parse_header(header: str) -> Dict:
    """header，"""
    # 
    if "_CH1_" in header:
        info["domain"] = "CH1"
    elif "_CH2_" in header:
        info["domain"] = "CH2"
    elif "_CH3_" in header:
        info["domain"] = "CH3"
    elif "_CH4_" in header:
        info["domain"] = "CH4"
    elif "_Hinge_" in header:
        info["domain"] = "Hinge"
    elif "_Unknown_" in header:
        # 
        if seq_len < 20:
            info["domain"] = "Hinge"
        else:
            info["domain"] = "C_terminal"
```

**Header**：
```
Human_IGHG1_CH1_IGHG1*01_98aa
Human_IGHG1_Hinge_IGHG1*01_15aa
Human_IGHG1_CH2_IGHG1*01_110aa
Human_IGHG1_CH3_IGHG1*01_107aa
Human_IGHG1_Unknown_IGHG1*01_44aa  # C_terminal
```

#### 2：

"Unknown"，：

- ** < 20aa**: `Hinge`
- ** ≥ 20aa**: `C_terminal`（C）

### 3. 

**1-based**（1）：

```python
def create_annotated_sequence(group_key: str, domains: Dict, species: str):
    """"""
    full_sequence = ""
    annotations = []
    current_pos = 1  # 1
    
    # CH1
    if domains["CH1"]:
        ch1 = domains["CH1"][0]
        full_sequence += ch1["sequence"]
        annotations.append({
            "region": "CH1",
            "start": current_pos,           # ：1
            "end": current_pos + len(ch1["sequence"]) - 1,  # ：98
            "length": len(ch1["sequence"]),  # ：98
            "header": ch1["header"]
        })
        current_pos += len(ch1["sequence"])  # 99
    
    # Hinge
    if domains["Hinge"]:
        hinge = domains["Hinge"][0]
        full_sequence += hinge["sequence"]
        annotations.append({
            "region": "Hinge",
            "start": current_pos,           # ：99
            "end": current_pos + len(hinge["sequence"]) - 1,  # ：113
            "length": len(hinge["sequence"]),  # ：15
            "header": hinge["header"]
        })
        current_pos += len(hinge["sequence"])  # 114
    
    # ... 
```

### 4. 

：

```
 = CH1 + Hinge + CH2 + CH3 + C_terminal
```

**（Human IgG1*01）**：
- CH1:  1-98 (98aa)
- Hinge:  99-113 (15aa)
- CH2:  114-223 (110aa)
- CH3:  224-330 (107aa)
- C_terminal:  331-374 (44aa) +  375-401 (27aa)

：401aa

## 

### CH1（Constant Heavy 1）

- ****: 97-98aa
- ****: CL
- ****: 

### Hinge Region

- ****: 12-19aa（IgG）
- ****: 
  - FabFc
  - （C），
- ****: C
- ****: （<20aa），Cys

### CH2（Constant Heavy 2）

- ****: 107-110aa
- ****: 
  - Fc（FcγR）
  - （C1q）
  - 
- ****: N-（N-X-S/T）

### CH3（Constant Heavy 3）

- ****: 107-110aa
- ****: 
  - Fc
  - 
  - 
- ****: 

### C_terminal（C）

- ****: 27-71aa（IgG）
- ****: 
  - （IgG）
  - （IgG）
  - 
- ****: 
- ****: （≥20aa），CH3

## CH4

****：IgGCH1、CH2、CH3，**CH4**。

- **IgG**: ❌ CH4
- **IgM**: ✅ CH4
- **IgE**: ✅ CH4
- **IgA**: CH4

## 

```
1. FASTA
   ↓
2. header
   ↓
3. header（CH1, CH2, CH3, Hinge）
   ↓
4. "Unknown"，（<20aa → Hinge, ≥20aa → C_terminal）
   ↓
5. IgG
   ↓
6. ：CH1 → Hinge → CH2 → CH3 → C_terminal
   ↓
7. （1-based）
   ↓
8. JSON
```

## 

### JSON

```json
{
  "IgG1*01": {
    "species": "human",
    "igg_type": "IgG1*01",
    "full_sequence": "ASTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKKVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSRDELTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGKELQLEESCAEAQDGELDGLWTTITIFITLFLLSVCYSATVTFFKVKWIFSSVVDLKQTIIPDYRNMIGQGA",
    "total_length": 401,
    "has_ch4": false,
    "regions": [
      {
        "region": "CH1",
        "start": 1,
        "end": 98,
        "length": 98,
        "header": "Human_IGHG1_CH1_IGHG1*01_98aa"
      },
      {
        "region": "Hinge",
        "start": 99,
        "end": 113,
        "length": 15,
        "header": "Human_IGHG1_Unknown_IGHG1*01_15aa"
      },
      {
        "region": "CH2",
        "start": 114,
        "end": 223,
        "length": 110,
        "header": "Human_IGHG1_CH2_IGHG1*01_110aa"
      },
      {
        "region": "CH3",
        "start": 224,
        "end": 330,
        "length": 107,
        "header": "Human_IGHG1_CH3_IGHG1*01_107aa"
      },
      {
        "region": "C_terminal",
        "start": 331,
        "end": 374,
        "length": 44,
        "header": "Human_IGHG1_Unknown_IGHG1*01_44aa"
      }
    ],
    "structure": {
      "has_ch1": true,
      "has_hinge": true,
      "has_ch2": true,
      "has_ch3": true,
      "has_ch4": false,
      "has_c_terminal": true
    }
  }
}
```

### 

- **start**: （1-based，）
- **end**: （1-based，）
- **length**: （end - start + 1）

**Python**：
```python
# ：Python0-based，1
ch2_start = region['start'] - 1  # 114 - 1 = 113
ch2_end = region['end']          # 223
ch2_seq = full_sequence[ch2_start:ch2_end]  # 113-223（Python）
```

## 

### （Human）

|  |  |  |
|------|---------|------|
| CH1 | 98aa | 98aa |
| Hinge | 15aa | 12-17aa |
| CH2 | 110aa | 110aa |
| CH3 | 107aa | 107aa |
| C_terminal | 71aa | 44aa+27aa |

### （Mouse）

|  |  |  |
|------|---------|------|
| CH1 | 97aa | 97aa |
| Hinge | 13aa | 13-16aa |
| CH2 | 107aa | 107-110aa |
| CH3 | 107aa | 107-109aa |
| C_terminal | 71aa | 27-44aa |

### （Dog）

|  |  |  |
|------|---------|------|
| CH1 | 97aa | 97aa |
| Hinge | 14aa | 14-19aa |
| CH2 | 110aa | 110aa |
| CH3 | 110aa | 109-110aa |
| C_terminal | 71aa | 44aa+27aa（IgG2） |

## 

- ****: `scripts/annotate_constant_regions.py`
- ****: `data/germlines/fc_aa/annotated/{species}_IGHC_annotated.json`
- ****: `data/germlines/fc_aa/annotated/README.md`

## 

1. **1-based**：JSON，startend1-based（1）
2. **Python0-based**：1
3. **C**：IgGC，
4. **CH4**：IgGCH4，CH1-CH3
5. **Unknown**：（<20aa → Hinge, ≥20aa → C_terminal）


















