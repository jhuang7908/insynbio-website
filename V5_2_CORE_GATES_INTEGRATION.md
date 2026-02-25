# v5.2 Core Gates 集成指南

## 概述

v5.2 Core Gates 是系统级硬约束检查模块，确保所有人源化结果符合 v5.2 核心设计原则。

**关键原则**：任何不符合 v5.2 结构规则的序列，系统直接 fail，不生成结果、不进报告、不对客户可见。

---

## Gate 清单

### Gate 1: CDR3 不可变
- **规则**：输入 query 的 CDR3 和输出 humanized VH 的 CDR3 必须 100% identical
- **失败代码**：`FAIL_GATE_CDR3_MODIFIED`

### Gate 2: FR4 必须来自 curated IGHJ
- **规则**：
  - humanized VH 的 IMGT 118-128 必须存在
  - 且 118-128 的 11 aa 必须 ∈ curated FR4 库
  - provenance = curated FR4（不是 query、不是 V）
- **失败代码**：`FAIL_GATE_FR4_SOURCE`

### Gate 3: FR4 长度与 motif
- **规则**：
  - FR4 长度 = 11 aa
  - fr4_aa 必须匹配 `^WG.G`（WGQG / WGRG / WGxG）
- **失败代码**：`FAIL_GATE_FR4_FORMAT`

### Gate 4: IMGT 编号完整性
- **规则**：
  - anarcii(IMGT) 必须成功
  - IMGT 118-128 必须全部存在
  - 不允许 out_of_domain / gap
- **失败代码**：`FAIL_GATE_IMGT_INTEGRITY`

---

## API 使用

### 基本用法

```python
from core.gates.v52_core_gates import (
    run_v52_core_gates,
    build_imgt_numbering_dict_from_rows,
)
from core.segmentation.anarcii_adapter import run_anarcii_imgt

# 1. 对 query 和 humanized 序列进行 IMGT 编号
query_regions, query_rows, query_provenance = run_anarcii_imgt(query_seq)
humanized_regions, humanized_rows, humanized_provenance = run_anarcii_imgt(humanized_seq)

# 2. 构建 IMGT numbering dict（使用辅助函数，更简洁）
query_imgt_numbering = build_imgt_numbering_dict_from_rows(query_rows)
humanized_imgt_numbering = build_imgt_numbering_dict_from_rows(humanized_rows)

# 3. 运行 Gate 检查
gate_result = run_v52_core_gates(
    query_seq=query_seq,
    humanized_seq=humanized_seq,
    query_imgt_numbering=query_imgt_numbering,
    humanized_imgt_numbering=humanized_imgt_numbering,
)

# 4. 检查结果
if not gate_result.passed:
    # Gate 失败，必须停止处理
    raise ValueError(f"v5.2 Core Gate failed: {gate_result.failed_gate}\n{gate_result.message}")
else:
    # 所有 Gate 通过，可以继续处理
    print("✅ All gates passed")
```

### GateResult 结构

```python
@dataclass
class GateResult:
    passed: bool  # True 表示所有 Gate 通过
    failed_gate: Optional[str] = None  # 失败时，包含失败代码（如 "FAIL_GATE_FR4_SOURCE"）
    message: Optional[str] = None  # 失败时的详细消息
    details: Optional[Dict[str, Any]] = None  # 详细信息（成功时包含各 Gate 的详情）
```

---

## 集成到主流程

### 集成点 1: 人源化函数

在所有人源化函数（如 `humanize_vhh`, `graft_cdrs_to_template`）中，在返回结果之前必须运行 Gate 检查：

```python
def humanize_vhh(seq: str, ...) -> dict:
    # ... 人源化逻辑 ...
    
    humanized_seq = graft_cdrs_to_template(...)
    
    # ✅ 必须：运行 v5.2 Core Gates
    from core.gates.v52_core_gates import run_v52_core_gates
    from core.segmentation.anarcii_adapter import run_anarcii_imgt
    
    # 对 humanized 序列进行 IMGT 编号
    humanized_regions, humanized_rows, _ = run_anarcii_imgt(humanized_seq)
    humanized_pos_to_aa = {row["pos"]: row["aa"] for row in humanized_rows if row.get("aa") and row.get("aa") != "-"}
    humanized_imgt_numbering = {"pos_to_aa": humanized_pos_to_aa}
    
    # 运行 Gate 检查
    gate_result = run_v52_core_gates(
        query_seq=seq,
        humanized_seq=humanized_seq,
        query_imgt_numbering=query_imgt_numbering,  # 从之前的编号结果获取
        humanized_imgt_numbering=humanized_imgt_numbering,
    )
    
    # ❌ Gate fail → 不生成序列、不进入评分、不写报告
    if not gate_result.passed:
        result['error'] = f"v5.2 Core Gate failed: {gate_result.failed_gate}"
        result['gate_failure'] = {
            'failed_gate': gate_result.failed_gate,
            'message': gate_result.message,
            'details': gate_result.details,
        }
        return result  # 直接返回，不继续处理
    
    # ✅ 只有 ALL_GATES_PASS == True 才允许继续
    result['humanized_sequence'] = humanized_seq
    result['gate_result'] = {
        'passed': True,
        'details': gate_result.details,
    }
    
    # 继续后续处理：FR2 hallmark 比例设计、CMC / developability、报告渲染
    ...
```

### 集成点 2: 报告生成

在报告生成之前，必须检查 Gate 结果：

```python
def generate_report(result: dict) -> str:
    # 检查 Gate 结果
    if result.get('gate_failure'):
        # Gate 失败，不生成报告
        return f"Report generation skipped: {result['gate_failure']['failed_gate']}"
    
    if not result.get('gate_result', {}).get('passed', False):
        # Gate 未通过，不生成报告
        return "Report generation skipped: v5.2 Core Gates not passed"
    
    # Gate 通过，生成报告
    ...
```

### 集成点 3: API 端点

在 API 端点中，Gate 失败必须返回明确的错误响应：

```python
@app.route('/api/humanize', methods=['POST'])
def humanize_api():
    result = humanize_vhh(...)
    
    if result.get('gate_failure'):
        return jsonify({
            'success': False,
            'error': 'v5.2_core_gate_failed',
            'failed_gate': result['gate_failure']['failed_gate'],
            'message': result['gate_failure']['message'],
        }), 400  # Bad Request
    
    return jsonify({
        'success': True,
        'humanized_sequence': result['humanized_sequence'],
        'gate_result': result['gate_result'],
    }), 200
```

---

## 系统级行为

### ❌ Gate fail 时的行为

1. **不生成序列**：不返回 humanized_sequence
2. **不进入评分**：不计算 CMC、developability、immunogenicity 等
3. **不写报告**：不生成任何报告文件
4. **不对客户展示**：不在 UI 中显示结果

### ✅ Gate pass 时的行为

1. **允许进入后续流程**：
   - FR2 hallmark 比例设计
   - CMC / developability 分析
   - Immunogenicity 评估
   - 报告渲染

---

## 错误处理

### 常见失败原因

1. **FAIL_GATE_CDR3_MODIFIED**
   - 原因：CDR3 被修改
   - 解决：检查人源化逻辑，确保 CDR3 不被替换

2. **FAIL_GATE_FR4_SOURCE**
   - 原因：FR4 不在 curated 库中
   - 解决：确保使用 `data/ighj_curated_fr4.json` 中的 FR4

3. **FAIL_GATE_FR4_FORMAT**
   - 原因：FR4 长度或 motif 不匹配
   - 解决：确保 FR4 长度为 11 aa，起始为 WGxG

4. **FAIL_GATE_IMGT_INTEGRITY**
   - 原因：IMGT 编号失败或 IMGT 118-128 不完整
   - 解决：检查序列是否完整，确保可以正确编号

---

## 测试

运行测试脚本验证 Gate 模块：

```bash
python scripts/test_v52_core_gates.py
```

---

## 版本纪律

根据 v5.2 原则第 7 条：

> v5.2 之后：
> - ❌ 不允许重新引入"推断型 FR4 / J"
> - ❌ 不允许混用旧 J 库
> - ❌ 不允许"为了覆盖极端 case"破坏核心约束

**所有 Gate 规则都是硬约束，不允许绕过。**

