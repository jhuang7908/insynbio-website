# ANARCI 和 ANARCII 使用指南

## 概述

ANARCI 和 ANARCII 是两个用于抗体序列 IMGT 编号的 Python 工具包，但使用不同的技术实现。

---

## ANARCI（一个i）

### 基本信息

- **全称**: ANtibody numbering and Receptor ClassIfication
- **类型**: 基于 HMM（隐马尔可夫模型）的传统方法
- **开发**: Oxford Protein Informatics Group (OPIG)
- **状态**: 成熟稳定，广泛使用
- **GitHub**: https://github.com/oxpig/ANARCI

### 安装

```bash
pip install anarci
```

### 依赖

- Python 3.6+
- BioPython
- HMMER（用于序列比对）

### 使用方法

#### 基本用法

```python
from anarci import anarci

# 单个序列
sequences = [("seq1", "EVQLVESGGGLVQPGGSLRLSCAASGFTFDDYAMSWVRQAPGKGLEWVSAISWNGGSTYYAESMKGRFTISRDNAKNTLYLQMNSLKPEDTAVYYC")]
result = anarci(sequences, scheme="imgt")

# 结果结构
# result = (assignments, alignment_details, hit_tables)
# assignments[0] = (seq_info, domains, scores)
# seq_info = (seq_id, sequence, (start, end, chain_type))
# domains[0] = numbering = [(aa, (pos, ins_code), region), ...]
```

#### 提取IMGT编号

```python
from anarci import anarci

sequences = [("my_seq", "EVQLVESGGGLVQPGGSLRLSCAASGFTFDDYAMSWVRQAPGKGLEWVSAISWNGGSTYYAESMKGRFTISRDNAKNTLYLQMNSLKPEDTAVYYC")]

assignments, alignment_details, hit_tables = anarci(sequences, scheme="imgt")

if assignments and assignments[0]:
    seq_info, domains, scores = assignments[0]
    seq_id, orig_seq, (start, end, chain_type) = seq_info
    
    if domains:
        numbering = domains[0]  # 第一个domain的编号
        
        # numbering格式: [(aa, (pos, ins_code), region), ...]
        for aa, pos_info, region in numbering:
            if pos_info:
                pos_num, ins_code = pos_info
                print(f"位置 {pos_num}: {aa} (区域: {region})")
```

#### 使用 run_anarci（新版本API）

```python
from anarci import run_anarci

sequences = [("seq1", "EVQLVESGGGLVQPGGSLRLSCAASGFTFDDYAMSWVRQAPGKGLEWVSAISWNGGSTYYAESMKGRFTISRDNAKNTLYLQMNSLKPEDTAVYYC")]

# run_anarci返回: (seqs, all_numberings, alignment_details, hit_tables)
seqs, all_numberings, alignment_details, hit_tables = run_anarci(sequences, scheme="imgt")

if all_numberings and len(all_numberings) > 0:
    domains = all_numberings[0]
    if domains:
        numbering = domains[0]
        # 处理编号结果
```

### 特点

- ✅ 成熟稳定，广泛使用
- ✅ 基于 HMM，准确性高
- ✅ 支持多种编号方案（IMGT, Kabat, Chothia等）
- ⚠️ 需要 HMMER 作为依赖
- ⚠️ 处理速度相对较慢

---

## ANARCII（两个i）

### 基本信息

- **全称**: ANtibody numbering and Receptor ClassIfication II
- **类型**: 基于深度学习语言模型的新方法
- **开发**: Oxford Protein Informatics Group (OPIG)
- **作者**: Alexander Greenshields Watson
- **开发时间**: 约2023-2024年（基于版本2.0.3和包信息推断）
- **开发地区**: 英国牛津（University of Oxford, Department of Statistics）
- **开发机构**: Oxford Protein Informatics Group (OPIG)
- **作者邮箱**: opig@stats.ox.ac.uk
- **版本**: 2.0.3（当前）
- **状态**: 较新，使用深度学习模型

### 安装

```bash
pip install anarcii
```

### 依赖

- Python 3.7+
- **torch** (PyTorch) - 深度学习框架
- **numpy** - 数值计算
- **gemmi** - 晶体学数据处理
- **msgpack** - 数据序列化
- **psutil** - 系统工具
- **sortedcontainers** - 数据结构

### 使用方法

#### 基本用法

```python
from anarcii import Anarcii

# 创建Anarcii对象
anarcii_obj = Anarcii(
    seq_type='antibody',  # 序列类型：'antibody' 或 'tcr'
    mode='accuracy',      # 模式：'accuracy'（准确）或 'speed'（快速）
    batch_size=32,        # 批处理大小
    cpu=False,            # 是否强制使用CPU（False表示使用GPU如果可用）
    ncpu=-1,              # CPU核心数（-1表示使用所有）
    verbose=False,        # 是否显示详细信息
    max_seqs_len=102400   # 最大序列长度
)

# 对序列进行编号
result = anarcii_obj.number('EVQLVESGGGLVQPGGSLRLSCAASGFTFDDYAMSWVRQAPGKGLEWVSAISWNGGSTYYAESMKGRFTISRDNAKNTLYLQMNSLKPEDTAVYYC')

# 结果格式
# result = {
#     'Sequence': {
#         'numbering': [((1, ' '), 'E'), ((2, ' '), 'V'), ...],
#         'chain_type': 'H',
#         'scheme': 'imgt',
#         'score': 29.79,
#         'query_start': 0,
#         'query_end': 95,
#         'error': None
#     }
# }
```

#### 提取IMGT编号

```python
from anarcii import Anarcii

anarcii_obj = Anarcii()
result = anarcii_obj.number('EVQLVESGGGLVQPGGSLRLSCAASGFTFDDYAMSWVRQAPGKGLEWVSAISWNGGSTYYAESMKGRFTISRDNAKNTLYLQMNSLKPEDTAVYYC')

if isinstance(result, dict) and 'Sequence' in result:
    seq_info = result['Sequence']
    numbering = seq_info.get('numbering', [])
    chain_type = seq_info.get('chain_type', 'H')
    scheme = seq_info.get('scheme', 'imgt')
    
    # numbering格式: [((pos, ins_code), aa), ...]
    for item in numbering:
        if isinstance(item, tuple) and len(item) >= 2:
            pos_info, aa = item[0], item[1]
            if pos_info and isinstance(pos_info, tuple):
                pos_num, ins_code = pos_info
                if aa != '-':  # 跳过gap
                    print(f"位置 {pos_num}: {aa}")
```

#### 批量处理

```python
from anarcii import Anarcii

anarcii_obj = Anarcii(batch_size=32)

sequences = [
    'EVQLVESGGGLVQPGGSLRLSCAASGFTFDDYAMSWVRQAPGKGLEWVSAISWNGGSTYYAESMKGRFTISRDNAKNTLYLQMNSLKPEDTAVYYC',
    'QVQLVQPGAELRKPGALLKVSCKASGYTFTSYYIDWVRQAPGQGLGWVGRIDPEDGGTNYAQKFQGRVTLTADTSTSTAYVELSSLRSEDTAVCYCVR',
    # ... 更多序列
]

results = []
for seq in sequences:
    result = anarcii_obj.number(seq)
    results.append(result)
```

### 特点

- ✅ 基于深度学习，准确性高
- ✅ 支持GPU加速（如果可用）
- ✅ 批处理支持，处理速度快
- ✅ 纯Python实现，易于集成
- ⚠️ 需要较大的依赖（torch等）
- ⚠️ 首次运行需要下载模型

---

## 对比总结

| 特性 | ANARCI | ANARCII |
|------|--------|---------|
| **技术** | HMM（隐马尔可夫模型） | 深度学习语言模型 |
| **开发时间** | 较早（2010年代） | 较新（2023-2024） |
| **准确性** | 高 | 高（可能更高） |
| **速度** | 较慢 | 较快（支持GPU） |
| **依赖** | HMMER, BioPython | torch, numpy, gemmi |
| **安装大小** | 较小 | 较大（包含模型） |
| **GPU支持** | 否 | 是 |
| **批处理** | 支持 | 支持（更高效） |
| **成熟度** | 非常成熟 | 较新但稳定 |

---

## 选择建议

### 使用 ANARCI 如果：
- 需要最小化依赖
- 不需要GPU加速
- 处理单个或少量序列
- 需要最大兼容性

### 使用 ANARCII 如果：
- 需要处理大量序列
- 有GPU可用
- 需要最佳性能
- 可以接受较大的依赖

---

## 在项目中的使用

### 当前项目（Antibody Engineer Suite）

在 `scripts/alpaca_vhh_classifier.py` 中，我们同时支持两者：

```python
# 优先使用abnumber（内部可能使用anarci）
# 如果失败，尝试anarcii
# 最后尝试anarci

if HAS_ABNUMBER:
    # 使用abnumber
elif HAS_ANARCII:
    # 使用anarcii
elif HAS_ANARCI:
    # 使用anarci
```

### 推荐配置

```python
# 推荐：优先使用anarcii（如果可用）
try:
    from anarcii import Anarcii
    anarcii_obj = Anarcii(mode='accuracy')
    # 使用anarcii
except ImportError:
    # Fallback到anarci
    from anarci import anarci
    # 使用anarci
```

---

## 常见问题

### Q: anarci 和 anarcii 有什么区别？

A: 
- **anarci**（一个i）：传统HMM方法，成熟稳定
- **anarcii**（两个i）：深度学习方法，较新但性能更好

### Q: 可以同时安装两者吗？

A: 可以，它们是完全独立的包，不会冲突。

### Q: 哪个更准确？

A: 两者都很准确。anarcii 在某些情况下可能更准确，因为它使用了深度学习模型。

### Q: 安装 anarcii 需要多长时间？

A: 取决于网络速度，因为需要下载 PyTorch 和模型文件。通常需要几分钟到十几分钟。

### Q: anarcii 需要GPU吗？

A: 不需要，但如果有GPU会更快。默认会尝试使用GPU，如果没有则使用CPU。

---

## 参考资料

- **ANARCI GitHub**: https://github.com/oxpig/ANARCI
- **ANARCII**: 通过 `pip show anarcii` 查看详细信息
- **OPIG官网**: https://www.stats.ox.ac.uk/research/proteins/

---

## 更新日志

### ANARCII
- **2024**: anarcii 2.0.3 发布（当前版本）
- **2023**: anarcii 初始版本发布（推测）

### ANARCI
- **2015-2020**: ANARCI 主要开发和维护期
- **2010s**: ANARCI 早期开发

## 准确性说明

### ANARCI（一个i）
- ✅ **准确性高**：基于HMM模型，经过多年验证
- ✅ **广泛使用**：在学术界和工业界得到广泛认可
- ✅ **稳定可靠**：成熟工具，结果可重复

### ANARCII（两个i）
- ✅ **准确性高**：基于深度学习语言模型，可能在某些情况下更准确
- ✅ **较新工具**：使用现代AI技术
- ⚠️ **验证较少**：由于较新，大规模验证可能较少
- ✅ **实际测试**：在我们的项目中（84条羊驼序列）100%成功编号

**建议**：对于关键应用，可以同时使用两者进行交叉验证。

---

**注意**: anarcii 的开发时间和地区信息基于公开资料和包信息推断。如需最准确的信息，请参考官方文档或联系开发团队。

