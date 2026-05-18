# SAFE 

## 

、 SAFE_A / SAFE_B / SAFE_C ：
1. 
2. 
3. /
4. ：

---

## 、

### 
- ****: `## 4. Germline （A/B/C ）` → `### `
- **JSON **: 

### 
```
**SAFE_A / SAFE_B / SAFE_C ， VH3  FR2 。**

 FR2  hallmark ，CDR ， FR 。
```

---

## 、

### 
- **JSON **: `result.json` → `safe_strategies`
- ****: `### （ IMGT ）`

### JSON 
```json
{
  "safe_strategies": {
    "SAFE_A": {
      "template_id": "HUMAN_VH3_SCF_10_SAFE_A",
      "fr2_mutations": [
        {
          "imgt_pos": 44,
          "from": "A",
          "to": "Q",
          "meaning": "Q。Q，FR2，。 VHH44100%Q，VHHhallmark。"
        },
        {
          "imgt_pos": 45,
          "from": "A",
          "to": "R",
          "meaning": "..."
        }
      ]
    },
    "SAFE_B": {
      "template_id": "HUMAN_VH3_SCF_10_SAFE_B",
      "fr2_mutations": [
        {"imgt_pos": 37, "from": "L", "to": "Y", "meaning": "..."},
        {"imgt_pos": 44, "from": "A", "to": "Q", "meaning": "..."},
        {"imgt_pos": 45, "from": "A", "to": "R", "meaning": "..."},
        {"imgt_pos": 47, "from": "L", "to": "G", "meaning": "..."}
      ]
    },
    "SAFE_C": {
      "template_id": "HUMAN_VH3_SCF_10_SAFE_C",
      "fr2_mutations": [
        {"imgt_pos": 37, "from": "L", "to": "Y", "meaning": "..."},
        {"imgt_pos": 44, "from": "A", "to": "Q", "meaning": "..."},
        {"imgt_pos": 45, "from": "A", "to": "R", "meaning": "..."},
        {"imgt_pos": 47, "from": "L", "to": "G", "meaning": "..."}
      ]
    }
  }
}
```

### 
✅ **A/B/C  IMGT **
-  `imgt_pos`（IMGT ）
-  `from` `to`
-  `meaning`

✅ **""，""**
- 
-  IMGT 
- ， SAFE_PLAN_DEFINITIONS 

---

## 、/

### 
- ****: `### SAFE_A / SAFE_B / SAFE_C `

### 

#### SAFE_A
- **， VH **
- **FR2 ，**：
  - 
  -  VH 
- ****：
  - ''
  - 
- ****：
  - 
  - 

#### SAFE_B
- ** hallmark  VHH **
- **' VH ''VHH '**
- ****：
  - 
  - 
- ****：
  -  VHH 

#### SAFE_C（ VHH ）
- **FR2 hallmark  VHH **
- ****：
  - 
  - 
  -  VH 
- ****：
  - 
- ****：
  - /

---

## 、

### 
- ****: `###  SAFE_A ？`

### 
```
** SAFE_A ，SAFE_B  SAFE_C ，；，。**

****：
- ✅ 
- ✅ （''）
- ✅  SAFE_A 
- ✅ 
```

---

## 

### 1. 

#### `build_safe_strategies_comparison`
- ****:  SAFE 
- ****: `germline_selection`, `germline_numberings`, `library_data`
- ****: `safe_strategies` 

****:
1.  `SAFE_PLAN_DEFINITIONS` 
2.  `germline_numberings`  IMGT 
3.  `library_data`  `mutations` 
4.  `mutations` ， `HALLMARK_FUNCTIONAL_EXPLANATIONS` 
5. ，

### 2. 

#### 
1. ****:  SAFE_A/B/C ，
2. ****:  IMGT 
3. ****: 
4. ****: 

---

## 

### JSON 
✅ `safe_strategies` 
✅ （SAFE_A/B/C） `fr2_mutations`
✅  `imgt_pos`, `from`, `to`, `meaning`
✅ SAFE_A: 2 （44, 45）
✅ SAFE_B: 4 （37, 44, 45, 47）
✅ SAFE_C: 4 （37, 44, 45, 47）

### 
✅ 
✅ 
✅ /
✅ 

### 
✅ （7/7）

---

## 

1. **scripts/run_egfr_vhh_end_to_end.py**
   -  `build_safe_strategies_comparison` 
   - ， `safe_strategies` 
   -  `render_md_from_json` ，

---

## 

**"""，"。**













