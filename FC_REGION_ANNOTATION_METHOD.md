# Fc区域编号和功能区计算方法

## 概述

Fc（Fragment crystallizable）区域是抗体重链恒定区的C端部分，包含多个功能域。本文档说明如何计算和标注这些功能区域。

## Fc区域结构

标准的IgG重链恒定区结构：

```
[V区] - [CH1] - [Hinge] - [CH2] - [CH3] - [C_terminal]
         ↓        ↓        ↓       ↓          ↓
       ~98aa   ~12-19aa  ~110aa  ~107aa   ~27-71aa
```

## 计算方法

### 1. 数据来源

Fc区域的序列来自`data/germlines/fc_aa/fc_database/`目录，这些序列已经按照功能域分段存储：

- `CH1`: 恒定区第1域
- `Hinge`: 铰链区
- `CH2`: 恒定区第2域
- `CH3`: 恒定区第3域
- `Unknown`: 未明确标注的区域（可能是Hinge或C_terminal）

### 2. 区域识别方法

#### 方法1：基于Header信息（主要方法）

脚本`scripts/annotate_constant_regions.py`通过解析FASTA文件的header来识别区域：

```python
def parse_header(header: str) -> Dict:
    """解析序列header，提取信息"""
    # 解析域类型
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
        # 根据长度判断
        if seq_len < 20:
            info["domain"] = "Hinge"
        else:
            info["domain"] = "C_terminal"
```

**Header格式示例**：
```
Human_IGHG1_CH1_IGHG1*01_98aa
Human_IGHG1_Hinge_IGHG1*01_15aa
Human_IGHG1_CH2_IGHG1*01_110aa
Human_IGHG1_CH3_IGHG1*01_107aa
Human_IGHG1_Unknown_IGHG1*01_44aa  # 可能是C_terminal
```

#### 方法2：基于序列长度（辅助方法）

对于标记为"Unknown"的区域，根据长度判断：

- **长度 < 20aa**: 判定为`Hinge`（铰链区通常较短）
- **长度 ≥ 20aa**: 判定为`C_terminal`（C端序列通常较长）

### 3. 位置编号计算

位置编号采用**1-based索引**（从1开始计数）：

```python
def create_annotated_sequence(group_key: str, domains: Dict, species: str):
    """创建带注释的完整序列"""
    full_sequence = ""
    annotations = []
    current_pos = 1  # 从位置1开始
    
    # CH1
    if domains["CH1"]:
        ch1 = domains["CH1"][0]
        full_sequence += ch1["sequence"]
        annotations.append({
            "region": "CH1",
            "start": current_pos,           # 例如：1
            "end": current_pos + len(ch1["sequence"]) - 1,  # 例如：98
            "length": len(ch1["sequence"]),  # 例如：98
            "header": ch1["header"]
        })
        current_pos += len(ch1["sequence"])  # 更新为99
    
    # Hinge
    if domains["Hinge"]:
        hinge = domains["Hinge"][0]
        full_sequence += hinge["sequence"]
        annotations.append({
            "region": "Hinge",
            "start": current_pos,           # 例如：99
            "end": current_pos + len(hinge["sequence"]) - 1,  # 例如：113
            "length": len(hinge["sequence"]),  # 例如：15
            "header": hinge["header"]
        })
        current_pos += len(hinge["sequence"])  # 更新为114
    
    # ... 依此类推
```

### 4. 完整序列构建

完整序列按照以下顺序拼接：

```
完整序列 = CH1 + Hinge + CH2 + CH3 + C_terminal
```

**示例（Human IgG1*01）**：
- CH1: 位置 1-98 (98aa)
- Hinge: 位置 99-113 (15aa)
- CH2: 位置 114-223 (110aa)
- CH3: 位置 224-330 (107aa)
- C_terminal: 位置 331-374 (44aa) + 位置 375-401 (27aa)

总长度：401aa

## 区域特征

### CH1域（Constant Heavy 1）

- **典型长度**: 97-98aa
- **功能**: 与轻链的CL域配对
- **特征**: 包含免疫球蛋白折叠结构

### Hinge Region（铰链区）

- **典型长度**: 12-19aa（取决于IgG类型）
- **功能**: 
  - 提供Fab和Fc之间的灵活性
  - 富含半胱氨酸（C），形成链间二硫键
- **特征**: 序列中C（半胱氨酸）含量高
- **识别**: 长度短（<20aa），富含Cys

### CH2域（Constant Heavy 2）

- **典型长度**: 107-110aa
- **功能**: 
  - Fc受体（FcγR）结合
  - 补体激活（C1q结合）
  - 糖基化位点
- **特征**: 包含N-糖基化位点（N-X-S/T）

### CH3域（Constant Heavy 3）

- **典型长度**: 107-110aa
- **功能**: 
  - Fc受体结合
  - 重链二聚化
  - 效应功能调节
- **特征**: 形成稳定的二聚体结构

### C_terminal（C端序列）

- **典型长度**: 27-71aa（取决于IgG类型和物种）
- **功能**: 
  - 膜锚定（膜型IgG）
  - 分泌信号（分泌型IgG）
  - 可能影响半衰期
- **特征**: 可能包含疏水区域（膜型）
- **识别**: 长度较长（≥20aa），位于CH3之后

## 关于CH4域

**重要说明**：标准的IgG只有CH1、CH2、CH3三个恒定域，**没有CH4域**。

- **IgG**: ❌ 没有CH4
- **IgM**: ✅ 有CH4
- **IgE**: ✅ 有CH4
- **IgA**: 某些形式可能有CH4

## 计算流程

```
1. 读取FASTA文件
   ↓
2. 解析每个序列的header
   ↓
3. 根据header中的域标识（CH1, CH2, CH3, Hinge）分类
   ↓
4. 对于"Unknown"区域，根据长度判断（<20aa → Hinge, ≥20aa → C_terminal）
   ↓
5. 按IgG类型和等位基因分组
   ↓
6. 按顺序拼接：CH1 → Hinge → CH2 → CH3 → C_terminal
   ↓
7. 计算每个区域的起始和结束位置（1-based）
   ↓
8. 生成注释JSON文件
```

## 输出格式

### JSON格式

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

### 位置编号说明

- **start**: 区域的起始位置（1-based，包含）
- **end**: 区域的结束位置（1-based，包含）
- **length**: 区域长度（end - start + 1）

**Python提取示例**：
```python
# 注意：Python索引是0-based，需要减1
ch2_start = region['start'] - 1  # 114 - 1 = 113
ch2_end = region['end']          # 223
ch2_seq = full_sequence[ch2_start:ch2_end]  # 位置113-223（Python切片）
```

## 典型区域长度

### 人类（Human）

| 区域 | 典型长度 | 范围 |
|------|---------|------|
| CH1 | 98aa | 98aa |
| Hinge | 15aa | 12-17aa |
| CH2 | 110aa | 110aa |
| CH3 | 107aa | 107aa |
| C_terminal | 71aa | 44aa+27aa |

### 小鼠（Mouse）

| 区域 | 典型长度 | 范围 |
|------|---------|------|
| CH1 | 97aa | 97aa |
| Hinge | 13aa | 13-16aa |
| CH2 | 107aa | 107-110aa |
| CH3 | 107aa | 107-109aa |
| C_terminal | 71aa | 27-44aa |

### 狗（Dog）

| 区域 | 典型长度 | 范围 |
|------|---------|------|
| CH1 | 97aa | 97aa |
| Hinge | 14aa | 14-19aa |
| CH2 | 110aa | 110aa |
| CH3 | 110aa | 109-110aa |
| C_terminal | 71aa | 44aa+27aa（仅IgG2） |

## 相关文件

- **注释脚本**: `scripts/annotate_constant_regions.py`
- **注释结果**: `data/germlines/fc_aa/annotated/{species}_IGHC_annotated.json`
- **说明文档**: `data/germlines/fc_aa/annotated/README.md`

## 注意事项

1. **位置是1-based**：在JSON中，start和end位置是1-based（从1开始）
2. **Python索引是0-based**：提取序列时需要减1
3. **C端序列**：不是所有IgG类型都有C端序列，这是正常的
4. **CH4域**：IgG没有CH4域，只有CH1-CH3
5. **Unknown区域**：通过长度判断（<20aa → Hinge, ≥20aa → C_terminal）


















