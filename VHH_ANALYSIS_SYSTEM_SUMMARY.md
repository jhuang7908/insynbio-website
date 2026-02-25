# VHH分析系统：完整总结

## 一、环境要求

### 1. 操作系统
- **Windows 10/11** (当前环境)
- **Linux** (推荐用于生产环境)
- **macOS** (支持)

### 2. Python版本
- **Python 3.8+** (推荐 3.9+)
- 需要支持 `pathlib`, `typing`, `dataclasses`

### 3. 硬件要求
- **CPU**: 多核处理器（推荐8核+）
- **内存**: 8GB+ (推荐16GB+)
- **存储**: 10GB+ 可用空间
- **GPU**: 可选（ANARCII支持CPU模式）

## 二、依赖包

### 核心依赖

```python
# 必需依赖
anarcii>=1.0.0          # IMGT编号（语言模型版本）
torch>=1.10.0           # PyTorch（ANARCII依赖）
numpy>=1.20.0           # 数值计算
gemmi>=0.5.0            # 结构生物信息学（ANARCII依赖）

# 可选依赖
anarci                 # 传统ANARCI（HMM版本，备用）
abnumber               # 抗体编号库（备用）
biopython>=1.79        # 生物信息学工具
```

### 安装命令

```bash
# 安装核心依赖
pip install anarcii torch numpy gemmi

# 或使用conda
conda install -c conda-forge numpy
pip install anarcii torch gemmi
```

### 依赖大小

| 包名 | 大小 | 位置 |
|------|------|------|
| torch | ~2GB | C盘/D盘 |
| anarcii | ~500MB | C盘/D盘 |
| numpy | ~50MB | C盘/D盘 |
| gemmi | ~100MB | C盘/D盘 |

## 三、VHH框架库（Scaffold Library）

### 1. 什么是VHH框架库？

**VHH框架库（Scaffold Library）**是VHH分析系统的核心数据资源，包含：

- **羊驼VHH框架库**：从73条羊驼VHH序列中聚类生成的代表性框架
- **人源VH3框架库**：从人源VH3家族序列中聚类生成的框架
- **VHH-SAFE人源框架库**：经过VHH-SAFE工程化的人源框架模板

### 2. 框架库的重要性

**为什么框架库重要？**

1. **人源化的基础**：人源化过程需要将VHH的CDR移植到人源框架上，框架库提供了候选框架
2. **减少免疫原性**：使用人源框架可以降低免疫原性
3. **保持结构稳定性**：框架库中的框架经过验证，具有良好的结构稳定性
4. **提高成功率**：预筛选的框架库提高了人源化的成功率

### 3. 羊驼VHH框架库

**文件位置**:
- JSON: `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json`
- FASTA: `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.fasta`

**生成流程**:
```
73条羊驼VHH序列
  ↓ (IMGT编号和切分)
VHH编号和切分结果
  ↓ (贪心聚类，阈值0.90)
VHH框架库（~10-20个代表性框架）
```

**数据格式**:
```json
{
  "scaffold_id": "VHH_SCF_01",
  "n_members": 10,
  "member_ids": ["IGHV1-1", "IGHV1-2", ...],
  "consensus": {
    "fr1": "QVQLVESGGGLVQVGGSLRLSRALS",
    "fr2": "WFRQAPGKEREGVAVITADSGSTTYADSVKG",
    "fr3": "RFTISRDDARNTVYLQMNSLKPEDTAVYY",
    "fr4": "WGQGTQVTVSS",
    "framework_full": "FR1+FR2+FR3+FR4"
  }
}
```

**用途**:
- 作为人源化时的参考（用于计算框架相似性）
- 用于识别VHH的框架特征
- 用于评估人源化后的框架质量

### 4. 人源VH3框架库

**文件位置**:
- JSON: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json`
- FASTA: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.fasta`

**生成流程**:
```
人源IGHV_aa.fasta（所有VH家族）
  ↓ (过滤VH3家族: IGHV3-xx)
VH3序列（~50-100条）
  ↓ (IMGT编号和切分)
VH3编号和切分结果
  ↓ (贪心聚类，阈值0.90)
人源VH3框架库（~20-30个代表性框架）
```

**数据格式**:
```json
{
  "scaffold_id": "HUMAN_VH3_SCF_01",
  "n_members": 8,
  "member_ids": ["IGHV3-11*01", "IGHV3-15*01", ...],
  "consensus": {
    "fr1": "...",
    "fr2": "...",
    "fr3": "...",
    "fr4": "...",
    "framework_full": "..."
  }
}
```

**用途**:
- 作为VHH-SAFE模板的基础
- 用于生成VHH-SAFE人源框架

### 5. VHH-SAFE人源框架库

**文件位置**:
- JSON: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`
- FASTA: `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.fasta`

**生成流程**:
```
人源VH3框架库
  ↓ (VHH-SAFE工程化)
  ├─ Plan A: 保守修改（44→Q, 45→R）
  ├─ Plan B: 中度修改（37→Y/S, 44→Q, 45→R, 47→G）
  └─ Plan C: 激进修改（37=Y, 44=Q, 45=R, 47=G）
VHH-SAFE人源框架库（每个VH3框架生成3个VHH-SAFE变体）
  ↓ (Developability评分)
带评分的VHH-SAFE框架库
```

**数据格式**:
```json
{
  "template_id": "HUMAN_VH3_SCF_25_SAFE_A",
  "base_scaffold": "HUMAN_VH3_SCF_25",
  "plan": "A",
  "framework": {
    "FR1": "...",
    "FR2": "...",
    "FR3": "...",
    "FR4": "...",
    "framework_full": "..."
  },
  "mutations": {
    "44": {"from": "G", "to": "Q"},
    "45": {"from": "L", "to": "R"}
  },
  "developability": {
    "score": 0.85,
    "liabilities": [...],
    "notes": "..."
  }
}
```

**用途**:
- **人源化的核心资源**：直接用于VHH人源化
- 提供三种VHH-SAFE方案（A/B/C）
- 包含developability评分，用于模板选择

### 6. 框架库的使用

#### 在人源化中的使用

```python
from core.vhh_humanization import humanize_vhh

# 人源化过程会自动加载框架库
result = humanize_vhh(
    seq="VHH_SEQUENCE",
    panel="A",  # 使用Plan A的VHH-SAFE框架
    top_k=3
)

# 框架库加载位置：
# - 羊驼框架库: ALPACA_SCAFFOLDS_FILE
# - 人源框架库: HUMAN_TEMPLATES_FILE
# - 对齐矩阵: ALIGNMENT_FILE
```

#### 框架库加载函数

```python
# core/vhh_humanization.py

def load_alpaca_scaffolds() -> List[Dict[str, Any]]:
    """加载羊驼VHH scaffold面板"""
    # 从 vhh_scaffolds.json 加载

def load_human_templates() -> List[Dict[str, Any]]:
    """加载人源VHH-SAFE模板"""
    # 从 human_vh3_vhh_safe_templates.json 加载
```

### 7. 框架库的维护

#### 更新框架库

**何时需要更新？**
- 添加新的VHH序列
- 添加新的人源VH3序列
- 调整聚类阈值
- 修改VHH-SAFE工程化方案

**更新步骤**:
```bash
# 1. 更新羊驼VHH框架库
python scripts/alpaca_vhh_numbering_and_split.py
python scripts/generate_vhh_scaffold_panel.py

# 2. 更新人源VH3框架库
python scripts/human_vh_numbering_and_split.py
python scripts/generate_human_vh3_scaffold_panel.py

# 3. 更新VHH-SAFE框架库
python scripts/generate_human_vhh_safe_templates.py
python scripts/score_vhh_safe_templates.py
```

### 8. 框架库统计

**当前框架库规模**:

| 框架库类型 | 数量 | 说明 |
|-----------|------|------|
| **羊驼VHH框架** | **14个** | 从73条VHH序列聚类生成（identity阈值0.90） |
| **人源VH3框架** | **30个** | 从198条VH3序列聚类生成（identity阈值0.90） |
| **VHH-SAFE模板** | **90个** | 每个VH3框架×3个方案（A/B/C） |

**详细统计**:
- **羊驼VHH框架库**: 14个scaffold，最大cluster包含33个成员（VHH_SCF_04）
- **人源VH3框架库**: 30个scaffold，最大cluster包含58个成员（HUMAN_VH3_SCF_01）
- **VHH-SAFE模板库**: 90个模板（30 scaffolds × 3种方案），全部包含developability评分

### 9. 框架库质量评估

**评估指标**:
- **框架相似性**：与原始VHH框架的相似性
- **Developability评分**：0-1，越高越好
- **VHH hallmark兼容性**：FR2 hallmark位置（37, 44, 45, 47）的兼容性
- **CDR构型兼容性**：与VHH CDR构型的兼容性

**质量保证**:
- 所有框架都经过IMGT编号验证
- VHH-SAFE模板都经过developability评分
- 框架库与羊驼VHH框架的对齐矩阵已计算

## 四、主要脚本和流程

### 1. VHH分类（VHH vs VH）

**脚本**: `scripts/alpaca_vhh_classifier.py`

**功能**: 基于FR2 hallmark位置（37, 44, 45, 47）分类VHH

**参数**:
```bash
python scripts/alpaca_vhh_classifier.py
# 无命令行参数，使用默认路径
```

**输入**:
- `data/germlines/vicugna_pacos_ig_aa/IGHV_aa.fasta`

**输出**:
- `data/germlines/vicugna_pacos_ig_aa/alpaca_ighv_vhh_label.tsv`

**算法**:
- IMGT编号（ANARCII）
- FR2 hallmark位置识别
- VHH评分（基于37, 44, 45, 47位置）

### 2. VHH编号和切分

**脚本**: `scripts/alpaca_vhh_numbering_and_split.py`

**功能**: 对VHH序列进行IMGT编号和FR/CDR切分

**参数**:
```bash
python scripts/alpaca_vhh_numbering_and_split.py
# 无命令行参数，使用默认路径
```

**输入**:
- `data/germlines/vicugna_pacos_ig_aa/alpaca_ighv_vhh_label.tsv`
- `data/germlines/vicugna_pacos_ig_aa/IGHV_aa.fasta`

**输出**:
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_numbered_and_split.json`
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_numbered.fasta`
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_summary.tsv`

**算法**:
- IMGT编号（`core/numbering/imgt_anarcii.py`）
- FR/CDR区域切分（基于IMGT标准边界）

### 3. VHH Scaffold Panel生成

**脚本**: `scripts/generate_vhh_scaffold_panel.py`

**功能**: 基于框架相似性聚类生成VHH scaffold panel

**参数**:
```bash
python scripts/generate_vhh_scaffold_panel.py
# 无命令行参数，使用默认路径和阈值（0.90）
```

**输入**:
- `data/germlines/vicugna_pacos_ig_aa/vhh_numbered/vhh_numbered_and_split.json`

**输出**:
- `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json`
- `data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.fasta`

**算法**:
- 贪心聚类（Greedy Clustering）
- 相似性阈值：0.90
- 共识框架生成（多数表决）

### 4. Human VH3编号和切分

**脚本**: `scripts/human_vh_numbering_and_split.py`

**功能**: 对人源VH3序列进行IMGT编号和FR/CDR切分

**参数**:
```bash
python scripts/human_vh_numbering_and_split.py
# 无命令行参数，使用默认路径
```

**输入**:
- `data/germlines/human_ig_aa/IGHV_aa.fasta`

**输出**:
- `data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json`

**算法**:
- VH3家族过滤（`IGHV3-\d+`）
- IMGT编号
- FR/CDR切分

### 5. Human VH3 Scaffold Panel生成

**脚本**: `scripts/generate_human_vh3_scaffold_panel.py`

**功能**: 生成人源VH3 scaffold panel

**参数**:
```bash
python scripts/generate_human_vh3_scaffold_panel.py
# 无命令行参数，使用默认路径和阈值（0.90）
```

**输入**:
- `data/germlines/human_ig_aa/vh_numbered/human_vh_numbered_and_split.json`

**输出**:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json`
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.fasta`

**算法**:
- 贪心聚类
- 共识框架生成

### 6. VHH-SAFE模板生成

**脚本**: `scripts/generate_human_vhh_safe_templates.py`

**功能**: 生成VHH-SAFE人源框架模板（三种方案：A, B, C）

**参数**:
```bash
python scripts/generate_human_vhh_safe_templates.py
# 无命令行参数，使用默认路径
```

**输入**:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_scaffolds.json`

**输出**:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.fasta`

**算法**:
- FR2 hallmark位置修改（37, 44, 45, 47）
- 三种VHH-SAFE方案：
  - **Plan A**: 保守修改（Q/E, R, G/L）
  - **Plan B**: 中等修改
  - **Plan C**: 激进修改

### 7. VHH-SAFE模板Developability评分

**脚本**: `scripts/score_vhh_safe_templates.py`

**功能**: 计算VHH-SAFE模板的developability评分

**参数**:
```bash
python scripts/score_vhh_safe_templates.py
# 无命令行参数，使用默认路径
```

**输入**:
- `data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json`

**输出**:
- 更新后的 `human_vh3_vhh_safe_templates.json`（添加developability字段）

**算法**:
- CMC liabilities扫描（`core/vhh_developability.py`）
- FR2/FR3聚集性评估
- 综合评分（0-1）

### 8. VHH人源化

**脚本**: `scripts/test_vhh_humanization.py`

**功能**: 对VHH序列进行人源化

**参数**:
```bash
python scripts/test_vhh_humanization.py
# 脚本内硬编码序列，可修改
```

**核心模块**: `core/vhh_humanization.py`

**函数**: `humanize_vhh(seq, panel='A', top_k=3)`

**参数**:
- `seq`: VHH序列（字符串）
- `panel`: VHH-SAFE方案（'A', 'B', 'C', 'all'）
- `top_k`: 返回前k个最佳匹配
- `species`: 物种（默认'alpaca'）

**算法**:
- CDR构型匹配
- 框架相似性计算
- 关键位置检查（FR1-26, FR2-55, FR3-104）
- 综合评分：`0.6 * structure_match_score + 0.4 * dev_score`

**输出**:
- JSON格式的人源化结果

### 9. 亲和性优化突变建议

**脚本**: `scripts/generate_affinity_optimization_suggestions.py`

**功能**: 生成亲和性优化突变建议和酵母展示突变库

**参数**:
```bash
python scripts/generate_affinity_optimization_suggestions.py \
    --sequence "VHH_SEQUENCE" \          # VHH序列（必需）
    --panel A \                          # VHH-SAFE方案（A/B/C/all，默认A）
    --output "output.json" \             # 输出文件（默认affinity_optimization_suggestions.json）
    --yeast-library \                    # 是否生成酵母展示突变库（标志）
    --max-mutations 3                    # 每个变体的最大突变数（默认5）
```

**输入**:
- VHH序列（命令行参数）

**输出**:
- JSON格式的突变建议和突变库

**算法**:
- 通用规则（`core/affinity_optimization_rules.py`）
- Case by case分析
- 智能组合

## 四、核心算法

### 1. IMGT编号算法

**模块**: `core/numbering/imgt_anarcii.py`

**函数**: `imgt_number_anarcii(seq) -> List[Dict]`

**算法**:
- 使用ANARCII（语言模型版本）
- 返回标准化格式：`[{"pos": int, "ins_code": str, "aa": str, ...}]`

**特点**:
- 全局Anarcii对象（避免重复加载模型）
- CPU模式（`cpu=True`）
- 高精度模式（`mode='accuracy'`）

### 2. FR/CDR切分算法

**模块**: `core/vhh_humanization.py` (函数: `split_regions`)

**算法**:
- 基于IMGT标准边界：
  - FR1: 1-26
  - CDR1: 27-38
  - FR2: 39-55
  - CDR2: 56-65
  - FR3: 66-104
  - CDR3: 105-117
  - FR4: 118-128

### 3. 贪心聚类算法

**模块**: `scripts/generate_vhh_scaffold_panel.py`

**算法**:
```python
1. 第一个序列作为cluster 1的seed
2. 对每个后续序列：
   - 计算与所有现有seed的相似性
   - 如果相似性 ≥ 阈值（0.90），加入该cluster
   - 否则，创建新cluster
3. 在每个cluster内生成共识框架（多数表决）
```

**相似性计算**: 序列identity（逐位比较）

### 4. CDR构型分类算法

**模块**: `core/cdr_canonical.py`

**函数**: `classify_cdr_canonical(cdr_seq, cdr_type)`

**算法**:
- 基于长度和关键残基
- CDR1/CDR2: 长度范围分类
- CDR3: 长度分类（short/canonical/long/very_long）

### 5. Developability评分算法

**模块**: `core/vhh_developability.py`

**函数**: `analyze_developability(framework_seq)`

**算法**:
- CMC liabilities扫描（去酰胺化、异构化、氧化、糖基化）
- FR2/FR3聚集性评估
- 加权评分：`score = 1 - (liability_penalty + aggregation_penalty)`

### 6. 亲和性优化规则算法

**模块**: `core/affinity_optimization_rules.py`

**算法**:
- **框架恢复规则**: 检查关键位置（26, 55, 104）的变化
- **CDR优化规则**: 基于残基类型（疏水、带电、芳香族）
- **位置特异性规则**: 基于IMGT位置的固定规则

## 五、结果格式

### 1. JSON格式

#### VHH编号和切分结果
```json
{
  "id": "VHH_ID",
  "sequence": "QVQLVES...",
  "length": 117,
  "imgt_numbering": [
    {"pos": 1, "ins_code": " ", "aa": "Q", ...},
    ...
  ],
  "regions": {
    "FR1": "QVQLVESGGGLVQVGGSLRLSRALS",
    "CDR1": "GFWYNHMG",
    "FR2": "WFRQAPGKEREGVAVITADSGSTTYADSVKG",
    "CDR2": "RFTISRDDARNTVYLQMNSLK",
    "FR3": "PEDTAVYY",
    "CDR3": "CAAGGVGWPYFDY",
    "FR4": "WGQGTQVTVSS"
  }
}
```

#### 人源化结果
```json
{
  "success": true,
  "best_match": {
    "human_template": "HUMAN_VH3_SCF_25_SAFE_A",
    "humanized_sequence": "...",
    "framework_identity": 0.725,
    "combined_score": 0.537,
    "cdr_canonical": {...},
    "developability_score": 0.85,
    "affinity_risk": {
      "level": "medium",
      "factors": [...],
      "recommendation": "..."
    }
  },
  "best_by_plan": {
    "A": {...},
    "B": {...},
    "C": {...}
  }
}
```

#### 突变建议结果
```json
{
  "strategy": "systematic",
  "mutations": [
    {
      "position": 26,
      "from": "S",
      "to": "A",
      "region": "FR1",
      "rationale": "恢复原始FR1-26残基...",
      "priority": "high",
      "rule_id": "POS_26_RESTORE",
      "expected_impact": "positive"
    }
  ],
  "systematic_suggestions": [...],
  "case_specific_suggestions": [...],
  "rules_applied": ["POS_26_RESTORE", "CDR_HYDROPHOBIC_OPTIMIZE"],
  "summary": {
    "total_mutations": 10,
    "systematic_count": 5,
    "case_specific_count": 5,
    "high_priority": 2,
    "medium_priority": 8
  }
}
```

### 2. TSV格式

#### VHH分类结果
```tsv
id	length	label	vhh_score	aa37	aa44	aa45	aa47
IGHV1-1	117	VHH	2.5	Y	Q	R	W
IGHV1-2	115	VH	1.0	F	G	L	W
```

#### VHH摘要
```tsv
id	length	fr1_len	cdr1_len	fr2_len	cdr2_len	fr3_len	cdr3_len	fr4_len
VHH_001	117	26	8	17	10	39	13	11
```

### 3. FASTA格式

#### Scaffold Panel
```fasta
>VHH_SCF_01 | n_members=10 | fr_len=(26,17,39,11)
QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVITADSGSTTYADSVKGRFTISRDDARNTVYLQMNSLKPEDTAVYYCAAGGVGWPYFDYWGQGTQVTVSS
```

## 六、报告格式

### 1. Markdown报告

**位置**: `docs/` 目录

**主要报告**:
- `VHH_HUMANIZATION_MODULE.md`: 人源化模块文档
- `VHH_DEVELOPABILITY_SCORING.md`: Developability评分文档
- `AFFINITY_OPTIMIZATION_STRATEGY.md`: 亲和性优化策略
- `AFFINITY_OPTIMIZATION_RULES.md`: 通用规则文档

### 2. 控制台输出

**格式**: 结构化文本输出

**示例**:
```
================================================================================
VHH亲和性优化突变建议生成
================================================================================

输入序列: QVQLVESGGGLVQVGGSLRLSRALSGFWYNHMGWFRQAPGKEREGVAVIT...
序列长度: 117aa
方案: A

[步骤1] 进行VHH人源化...
✓ 人源化成功
  最佳模板: HUMAN_VH3_SCF_25_SAFE_A
  框架identity: 72.5%
  综合得分: 0.537

[步骤2] 生成亲和性优化突变建议...
✓ 生成完成
  策略: systematic
  总突变数: 10
  通用规则建议: 5
  Case by case建议: 5
  高优先级: 2
  中优先级: 8
```

## 七、脚本参数和替代符

### 1. 命令行参数总结

#### 主要脚本参数

| 脚本 | 参数 | 说明 | 默认值 |
|------|------|------|--------|
| **generate_affinity_optimization_suggestions.py** | `--sequence, -s` | VHH序列 | 无（使用示例） |
| | `--panel, -p` | VHH-SAFE方案 | `A` |
| | `--output, -o` | 输出JSON文件 | `affinity_optimization_suggestions.json` |
| | `--yeast-library, -y` | 生成酵母展示突变库 | `False` |
| | `--max-mutations, -m` | 最大突变数 | `5` |
| **v3_immunogenicity.py** | `--project, -p` | 项目名称 | 必需 |
| | `--base-dir, -b` | 项目根目录 | 脚本上级目录 |
| | `--use-iedb` | 使用IEDB API | `False` |
| | `--hla-panel` | HLA面板 | `ext27` |
| | `--alleles` | HLA等位基因列表 | 无 |
| | `--output, -o` | 输出文件路径 | 项目目录/v3_immunogenicity/result_v3.json |
| **run_vhh_cli.py** | `--fasta, -f` | 输入FASTA文件 | 必需 |
| | `--source` | VHH来源 | `llama` |
| | `--target` | 目标物种 | `human` |
| | `--strategy` | 工程策略 | `balanced` |
| | `--out, -o` | 输出JSON文件 | 无（stdout） |

### 2. 硬编码路径（当前实现）

#### 主要数据路径

```python
# 项目根目录
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# 羊驼VHH数据
ALPACA_DIR = PROJECT_ROOT / "data" / "germlines" / "vicugna_pacos_ig_aa"
ALPACA_FASTA = ALPACA_DIR / "IGHV_aa.fasta"
ALPACA_LABEL = ALPACA_DIR / "alpaca_ighv_vhh_label.tsv"
ALPACA_NUMBERED = ALPACA_DIR / "vhh_numbered" / "vhh_numbered_and_split.json"
ALPACA_SCAFFOLDS = ALPACA_DIR / "vhh_scaffolds" / "vhh_scaffolds.json"

# 人源VH3数据
HUMAN_DIR = PROJECT_ROOT / "data" / "germlines" / "human_ig_aa"
HUMAN_FASTA = HUMAN_DIR / "IGHV_aa.fasta"
HUMAN_NUMBERED = HUMAN_DIR / "vh_numbered" / "human_vh_numbered_and_split.json"
HUMAN_SCAFFOLDS = HUMAN_DIR / "vh_scaffolds" / "human_vh3_scaffolds.json"
HUMAN_TEMPLATES = HUMAN_DIR / "vh_scaffolds" / "human_vh3_vhh_safe_templates.json"
```

### 3. 环境变量支持（建议）

**当前**: 无环境变量支持

**建议实现**:
```python
# 使用环境变量
DATA_ROOT = Path(os.getenv("VHH_DATA_ROOT", "data/germlines"))
OUTPUT_ROOT = Path(os.getenv("VHH_OUTPUT_ROOT", "output"))
```

### 4. 配置文件支持（建议）

**当前**: 无配置文件

**建议的配置文件格式** (`config.yaml`):
```yaml
paths:
  data_root: "data/germlines"
  output_root: "output"
  alpaca_dir: "{data_root}/vicugna_pacos_ig_aa"
  human_dir: "{data_root}/human_ig_aa"

parameters:
  clustering_threshold: 0.90
  max_mutations: 5
  default_panel: "A"

anarcii:
  mode: "accuracy"
  cpu: true
  batch_size: 32
```

### 5. 占位符系统（建议）

**当前**: 无占位符系统

**建议的占位符**:
```python
# 路径占位符
"{PROJECT_ROOT}"    # 项目根目录
"{DATA_ROOT}"       # 数据根目录
"{SPECIES}"         # 物种名称（human, alpaca等）
"{REGION}"          # 区域（vh_numbered, vh_scaffolds等）
"{VERSION}"         # 版本号
"{DATE}"            # 日期（YYYY-MM-DD）
"{TIMESTAMP}"       # 时间戳

# 使用示例
path_template = "{DATA_ROOT}/{SPECIES}_ig_aa/{REGION}/output.json"
path = path_template.format(
    DATA_ROOT="data/germlines",
    SPECIES="human",
    REGION="vh_scaffolds"
)
```

### 6. 脚本参数替代符

**当前**: 使用argparse，无替代符

**参数传递方式**:
```bash
# 直接传递
python script.py --sequence "SEQ" --panel A

# 使用环境变量（建议）
export VHH_SEQUENCE="SEQ"
export VHH_PANEL="A"
python script.py

# 使用配置文件（建议）
python script.py --config config.yaml
```

### 7. 默认值总结

| 参数类型 | 默认值 | 位置 |
|---------|--------|------|
| **聚类阈值** | `0.90` | `scripts/generate_vhh_scaffold_panel.py` |
| **VHH-SAFE方案** | `'A'` | `core/vhh_humanization.py` |
| **Top K** | `3` | `core/vhh_humanization.py` |
| **最大突变数** | `5` | `scripts/generate_affinity_optimization_suggestions.py` |
| **ANARCII模式** | `'accuracy'` | `core/numbering/imgt_anarcii.py` |
| **ANARCII CPU** | `True` | `core/numbering/imgt_anarcii.py` |
| **Batch Size** | `32` | `core/numbering/imgt_anarcii.py` |

## 八、完整工作流程

### 标准流程

```
1. VHH分类
   scripts/alpaca_vhh_classifier.py
   ↓
2. VHH编号和切分
   scripts/alpaca_vhh_numbering_and_split.py
   ↓
3. VHH Scaffold Panel生成
   scripts/generate_vhh_scaffold_panel.py
   ↓
4. Human VH3编号和切分
   scripts/human_vh_numbering_and_split.py
   ↓
5. Human VH3 Scaffold Panel生成
   scripts/generate_human_vh3_scaffold_panel.py
   ↓
6. VHH-SAFE模板生成
   scripts/generate_human_vhh_safe_templates.py
   ↓
7. Developability评分
   scripts/score_vhh_safe_templates.py
   ↓
8. VHH人源化
   core/vhh_humanization.py (humanize_vhh函数)
   ↓
9. 亲和性优化
   scripts/generate_affinity_optimization_suggestions.py
```

### 快速流程（仅人源化和优化）

```
1. VHH人源化
   from core.vhh_humanization import humanize_vhh
   result = humanize_vhh(seq, panel='A')
   ↓
2. 亲和性优化
   scripts/generate_affinity_optimization_suggestions.py --sequence "SEQ"
```

## 九、数据目录结构

```
data/germlines/
├── human_ig_aa/
│   ├── IGHV_aa.fasta
│   ├── vh_numbered/
│   │   └── human_vh_numbered_and_split.json
│   └── vh_scaffolds/
│       ├── human_vh3_scaffolds.json
│       └── human_vh3_vhh_safe_templates.json
└── vicugna_pacos_ig_aa/
    ├── IGHV_aa.fasta
    ├── alpaca_ighv_vhh_label.tsv
    ├── vhh_numbered/
    │   ├── vhh_numbered_and_split.json
    │   └── vhh_summary.tsv
    └── vhh_scaffolds/
        ├── vhh_scaffolds.json
        └── vhh_scaffolds.fasta
```

## 十、框架库常见问题

### 1. 框架库文件不存在
**错误**: `FileNotFoundError: vhh_scaffolds.json not found`
**原因**: 框架库未生成
**解决**: 
```bash
# 生成羊驼VHH框架库
python scripts/alpaca_vhh_numbering_and_split.py
python scripts/generate_vhh_scaffold_panel.py

# 生成人源VH3框架库
python scripts/human_vh_numbering_and_split.py
python scripts/generate_human_vh3_scaffold_panel.py

# 生成VHH-SAFE框架库
python scripts/generate_human_vhh_safe_templates.py
```

### 2. 框架库版本不匹配
**错误**: 人源化时找不到匹配的框架
**原因**: 框架库版本过旧或格式不匹配
**解决**: 重新生成框架库，确保使用最新版本

### 3. Developability评分缺失
**错误**: `KeyError: 'developability'`
**原因**: VHH-SAFE模板库未运行developability评分
**解决**: 
```bash
python scripts/score_vhh_safe_templates.py
```

### 4. 框架库加载失败
**错误**: JSON解析错误或格式不正确
**原因**: 框架库文件损坏或格式错误
**解决**: 检查JSON文件格式，重新生成框架库

## 十一、常见问题

### 1. IMGT编号失败
**原因**: ANARCII模型未加载或序列格式问题
**解决**: 检查ANARCII安装，使用备用方法（ANARCI/abnumber）

### 2. 路径错误
**原因**: 硬编码路径不匹配
**解决**: 检查文件是否存在，使用相对路径

### 3. 内存不足
**原因**: ANARCII模型加载占用内存
**解决**: 使用CPU模式，减少batch_size

### 4. 编码错误（Windows）
**原因**: GBK编码问题
**解决**: 使用UTF-8编码，避免特殊字符

## 十二、框架库最佳实践

### 1. 框架库初始化检查

在运行人源化之前，检查框架库是否存在：

```python
from pathlib import Path
from core.vhh_humanization import ALPACA_SCAFFOLDS_FILE, HUMAN_TEMPLATES_FILE

# 检查框架库文件
if not ALPACA_SCAFFOLDS_FILE.exists():
    raise FileNotFoundError(f"羊驼VHH框架库不存在: {ALPACA_SCAFFOLDS_FILE}")

if not HUMAN_TEMPLATES_FILE.exists():
    raise FileNotFoundError(f"人源VHH-SAFE框架库不存在: {HUMAN_TEMPLATES_FILE}")
```

### 2. 框架库版本管理

建议在框架库JSON文件中添加版本信息：

```json
{
  "version": "1.0.0",
  "generated_date": "2024-01-01",
  "source_sequences": 73,
  "n_scaffolds": 15,
  "clustering_threshold": 0.90,
  "scaffolds": [...]
}
```

### 3. 框架库备份

框架库是核心资源，建议定期备份：

```bash
# 备份框架库
cp data/germlines/vicugna_pacos_ig_aa/vhh_scaffolds/vhh_scaffolds.json \
   backups/vhh_scaffolds_v1.0.0.json

cp data/germlines/human_ig_aa/vh_scaffolds/human_vh3_vhh_safe_templates.json \
   backups/human_vh3_vhh_safe_templates_v1.0.0.json
```

### 4. 框架库验证

定期验证框架库的完整性：

```python
# 验证框架库
def validate_scaffold_library(json_file):
    with open(json_file) as f:
        data = json.load(f)
    
    # 检查必需字段
    required_fields = ['scaffold_id', 'n_members', 'consensus']
    for scaffold in data:
        for field in required_fields:
            if field not in scaffold:
                raise ValueError(f"缺少必需字段: {field}")
    
    # 检查框架序列完整性
    for scaffold in data:
        consensus = scaffold['consensus']
        if not all(k in consensus for k in ['fr1', 'fr2', 'fr3', 'fr4']):
            raise ValueError(f"框架序列不完整: {scaffold['scaffold_id']}")
```

## 十三、扩展性

### 1. 添加新规则
在 `core/affinity_optimization_rules.py` 中添加新规则

### 2. 添加新算法
在相应模块中添加新函数

### 3. 支持新物种
添加新的germline数据，修改路径配置

## 十四、性能优化

### 1. 模型加载
- 全局Anarcii对象（避免重复加载）
- 延迟加载（lazy loading）

### 2. 批处理
- ANARCII支持batch_size参数
- 序列批量处理

### 3. 缓存
- 编号结果缓存（可选）
- 中间结果保存

