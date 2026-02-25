# EGFR VHH 端到端流程实现文档

**版本**: v1.0  
**日期**: 2025-12-12  
**原则**: Single Source of Truth, Evidence-first, Fail-fast

---

## 📋 总原则

### 1. Single Source of Truth
- **JSON 是唯一事实源**
- MD/HTML 只能从 JSON 渲染，禁止再计算、禁止"解释性改写"数值

### 2. Evidence-first
- 每个模块必须写 `*_provenance + evidence`
- 没有 provenance 或 evidence 的模块，视为未运行

### 3. Fail-fast
- 任何 fallback、异常、缺字段必须显式记录，否则直接报错
- "静默降级"和"吞异常"一律禁止

---

## 🗂️ 目录与输入（固定）

### 项目目录
```
projects/EGFR_7D12_VHH/
├── input/
│   └── egfr_vhh.fasta          # 输入序列（单条 VHH AA）
├── output/
│   ├── result.json             # 业务 JSON（唯一事实源）
│   ├── report.md               # MD报告（完全从JSON渲染）
│   └── audit.md                # 审计输出（可选）
└── ...
```

### Germline库文件
- `core/data/germline_library_vh3_v1.json`（或实际文件名）

---

## 🔄 计算流程（6个步骤）

### Step 1：读取与规范化输入（必须）

**真实运算**:
- 读取 FASTA
- 去空格/换行/非法字符检查
- 校验仅包含 20AA（可允许 X，但必须记录）

**JSON 证据链**:
```json
{
  "input_provenance": {
    "source_file": "projects/EGFR_7D12_VHH/input/egfr_vhh.fasta",
    "sha256": "<runtime>",
    "sequence_id": "EGFR_7D12_VHH",
    "length": 117,
    "aa_alphabet_check": {"valid": true, "invalid_chars": []},
    "loaded_at": "2025-12-12T19:10:00Z"
  }
}
```

**Fail 条件**: `valid=false` 或 FASTA 为空

---

### Step 2：目标序列 IMGT 切分（ANARCII，必须）

**真实运算**:
- 用 `anarcii`（不是 `anarci`）对目标序列做 IMGT 编号 + FR/CDR 边界

**JSON 证据链**:
```json
{
  "segmentation": {
    "scheme": "imgt",
    "regions": {"FR1":"...", "CDR1":"...", ...},
    "boundaries": {"FR1":[1,26], ...},
    "numbering_first_20": [{"pos":"1","aa":"E"}, ...],
    "reconstruction_check": {"matches_input": true}
  },
  "segmentation_provenance": {
    "method": "anarcii",
    "package": "anarcii",
    "package_version": "<anarcii.__version__>",
    "scheme": "imgt",
    "executed_at": "..."
  }
}
```

**Fail 条件**:
- `method != "anarcii"` 且不是显式 fallback
- `reconstruction_check.matches_input != true`

---

### Step 3：germline 库加载与版本证明（必须）

**真实运算**:
- 从磁盘加载 germline 库文件
- 统计条目数
- 计算 sha256

**JSON 证据链**:
```json
{
  "germline_library_provenance": {
    "library_name": "human_VH3_germline_library",
    "source": "internal_consensus_scaffold",
    "version": "v1.0",
    "path": "core/data/germline_library_vh3_v1.json",
    "entry_count": 128,
    "sha256": "<runtime>",
    "loaded_at": "..."
  }
}
```

**Fail 条件**: 缺字段、`entry_count=0`、`sha256` 为空

---

### Step 4：对 germline 库进行 IMGT 编号（ANARCII，至少对候选/或全库）

**真实运算**:
- 用 `anarcii + IMGT` 对 germline 库进行编号
- 至少必须对：
  - TopN 候选（例如 50）
  - 最终 selected 模板（强制）

**JSON 证据链**:
```json
{
  "germline_numbering": {
    "numberings": {
      "HUMAN_VH3_SCF_24_SAFE_A": {
        "template_id": "HUMAN_VH3_SCF_24_SAFE_A",
        "scheme": "imgt",
        "positions_first_20": [{"pos":"1","aa":"E"}, ...],
        "boundaries": {"FR1":[1,26], ...}
      }
    },
    "numbering_provenance": {
      "method": "anarcii",
      "package": "anarcii",
      "package_version": "<anarcii.__version__>",
      "scheme": "imgt",
      "executed_at": "..."
    }
  }
}
```

**Fail 条件**: `numbering_provenance.method != "anarcii"` 或 `boundaries` 缺失

---

### Step 5：目标序列 vs 每个 germline 的 IMGT 对齐比对（必须真实运算）

**真实运算（核心）**:
- 采用 IMGT position-level identity（不是字符串相似度）
- mask 策略必须写明（例如仅 FR1/FR2/FR3/FR4 参与；CDR 不计）
- 输出每个候选的 match/total 计数

**JSON 证据链**:
```json
{
  "germline_alignment_provenance": {
    "algorithm": "imgt_position_identity",
    "scheme": "imgt",
    "mask_regions": ["CDR1","CDR2","CDR3"],
    "gap_policy": "disallow",
    "executed_at": "..."
  },
  "germline_candidates": [
    {
      "template_id": "HUMAN_VH3_SCF_24_SAFE_A",
      "region_counts": {
        "FR1": {"match": 23, "total": 26},
        "FR2": {"match": 10, "total": 17},
        "FR3": {"match": 32, "total": 39},
        "FR4": {"match": 11, "total": 11}
      },
      "framework_identity": 0.817,
      "evidence": {
        "imgt_positions_compared": 93,
        "first_10_mismatches": [{"pos":"44","query":"E","ref":"Q"}]
      }
    }
  ]
}
```

**Fail 条件**:
- `imgt_positions_compared == 0`（说明没跑 IMGT position-level 对齐）
- 候选列表为空

---

### Step 6：排序与选择最优模板（必须真实运算 + 可审计）

**真实运算**:
- 明确 objective：最大化 framework_identity（或 combined_score，但必须由真实指标构成）
- tie-breakers 明确
- 生成 Top10
- 选出 selected 并给出 rank

**JSON 证据链**:
```json
{
  "germline_selection_proof": {
    "objective": "maximize_framework_identity",
    "score_source_path": "germline_candidates[].framework_identity",
    "tie_breakers": [
      "germline_candidates[].region_counts.FR2.match",
      "germline_candidates[].region_counts.FR3.match"
    ],
    "eligible_candidate_count": 128,
    "ranked_top10": [
      {"template_id":"HUMAN_VH3_SCF_24_SAFE_A", "rank":1, "framework_identity":0.817}
    ],
    "selected": {"template_id":"HUMAN_VH3_SCF_24_SAFE_A", "rank":1, "framework_identity":0.817},
    "consistency_checks": {
      "selected_in_ranked_top10": true
    }
  },
  "germline": {
    "selected": {"id":"HUMAN_VH3_SCF_24_SAFE_A", "framework_identity":0.817, "reason":"..."},
    "top_candidates": [...]
  }
}
```

**Fail 条件**:
- `selected` 不在 Top10
- `eligible_candidate_count=0`
- 排名与 selected 不一致

---

## 📄 MD 报告与 JSON 完全吻合的硬要求

### 规则：MD 只能从 JSON 渲染

- MD 中出现的所有数字（identity、match/total、rank、template_id、hash、version）必须是 JSON 原值
- MD 不允许出现"综合评分 0.000"这类与 JSON 不一致的字段

### 强制实现：渲染前后做一致性校验

生成 MD 后，跑一个 `md_json_consistency_check`：
- 对 MD 中出现的 template_id/identity/top1 逐条回查 JSON
- 任一不一致 → fail

---

## ✅ 交付级 Validator（必须）

在最终写出 `result.json` 与 `report.md` 前，执行：

1. `validate_input_provenance`
2. `validate_segmentation_provenance`
3. `validate_germline_library_provenance`
4. `validate_germline_numbering_provenance`
5. `validate_alignment_provenance`
6. `validate_selection_proof`
7. `validate_md_matches_json`

**任一失败 → 退出并打印清晰错误（不输出报告）**

---

## 🚀 使用方式

### 运行主流程

```bash
python scripts/run_egfr_vhh_end_to_end.py \
  --input projects/EGFR_7D12_VHH/input/egfr_vhh.fasta \
  --germline core/data/germline_library_vh3_v1.json \
  --out projects/EGFR_7D12_VHH/output/
```

### 强制审计

```bash
python scripts/audit_result.py \
  --json projects/EGFR_7D12_VHH/output/result.json \
  --md   projects/EGFR_7D12_VHH/output/report.md
```

---

## 📁 文件清单

### 新增文件

1. **`scripts/run_egfr_vhh_end_to_end.py`** - 端到端流程主脚本
   - Step 1-6 完整实现
   - 所有provenance生成
   - Fail-fast验证

2. **`scripts/audit_result.py`** - 审计脚本
   - 7项验证规则
   - MD与JSON一致性检查

### 依赖模块

- `core/germline_library_provenance.py` - 库provenance生成
- `core/segmentation/germline_numbering.py` - Germline编号
- `core/segmentation/anarcii_adapter.py` - IMGT切分
- `core/json_data_preparer.py` - JSON数据准备

---

## ✨ 关键特性

### 1. Evidence-first
- ✅ 每个步骤都有provenance
- ✅ 所有计算都有evidence
- ✅ 没有provenance的模块视为未运行

### 2. Fail-fast
- ✅ 任何失败直接抛出异常
- ✅ 禁止静默降级
- ✅ 禁止吞异常

### 3. Single Source of Truth
- ✅ JSON是唯一事实源
- ✅ MD完全从JSON渲染
- ✅ 渲染后一致性校验

---

## 📊 输出示例

### result.json（业务JSON）
包含所有6个步骤的完整provenance和evidence

### report.md（MD报告）
完全从JSON渲染，所有数值与JSON一致

### audit.md（可选）
审计结果报告

---

**状态**: ✅ 已实现  
**版本**: v1.0













