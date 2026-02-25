# Sequence Cleaning Rules v1

## 概述

序列清洗系统将"脏序列"（可能包含信号肽、linker、标签、恒定区、拼接片段、未知字符等）清洗成可用于下游分析的人类可追溯结构化输入。

## 输出字段定义

### 必需字段

每条链的清洗输出必须包含以下字段：

- **`cleaned_input_sequence`**: 标准化后的氨基酸序列
- **`variable_domain`**: V区检测与裁剪信息
  - `detected`: bool - 是否检测到可变区
  - `v_start`: int - 可变区起始索引（0-based）
  - `v_end`: int - 可变区结束索引（0-based，不包含）
  - `variable_domain_length`: int - 可变区长度（完整字段名）
  - `v_length`: int - 可变区长度（字段别名，与 STOP 条件一致）
  - `trimmed_constant_region`: bool - 是否移除了恒定区
  - `variable_domain_sequence`: str - V区序列
- **`variable_domain_sequence`**: V区序列（独立字段）
- **`imgt_numbering`**: IMGT编号（仅对V区）
- **`kabat_numbering`**: Kabat编号（仅对V区）
- **`dual_map`**: 位置映射（IMGT↔Kabat↔index）
- **`qa_flags`**: QA标志列表
- **`stop_reason`**: STOP原因（如有）
- **`warn_reason`**: WARN原因（字符串格式，兼容字段）
- **`warn_reasons`**: WARN原因列表（结构化）
- **`cleaning_log`**: 清洗日志
- **`tool_versions`**: 工具版本信息

### 字段恒等式约束（必须）

以下恒等式必须满足，否则触发 `STOP_INCONSISTENT_BOUNDARIES`：

```
v_length == variable_domain_length
v_end - v_start == v_length
len(variable_domain_sequence) == v_length
```

## 输入标准化规则

### 字符集与大小写

- **允许**: 20标准氨基酸字母（ACDEFGHIKLMNPQRSTVWY）
- **允许但需记录**: X（未知）
- **全部转为大写**
- **去掉空格、换行、制表符**

### FASTA头/注释

- 若含 `>` 行，丢弃头信息，仅保留序列
- 若含非氨基酸字符（数字、标点），全部剔除并计数记录

### 字符处理顺序

**明确顺序：先统计，再删除非法字符；X 不删除但计入 x_count。**

1. 统计：统计空格、换行、制表符、终止符、非法字符、X
2. 删除：移除空格、换行、制表符、终止符、非法字符
3. 保留：保留标准AA和X（X已计入x_count）

### 长度初筛

- **< 60 aa**: 直接判定不够做V区编号（STOP：`too_short`）
- **> 800 aa**: 高度可疑（可能是融合蛋白/多段拼接），进入"分段搜索"模式并强制人工复核标记（WARN：`too_long_suspicious_fusion`）

## 链类型与分段策略

### V区检测优先级

1. 使用 HMM/编号器（ANARCI/anarcii）对序列做 V-domain 搜索
2. 输出最可信的链类型：H（VH/VHH）或 K/L（VL κ/λ）

### 多V区识别

若同一条序列被识别为多个V区（如 scFv、双VHH、融合蛋白）：

- 默认只保留"得分最高的V区"进入主流程（`variable_domain`）
- 其余段落写入 `extra_domains: List[dict]`，包含：
  - `v_start`: 起始位置
  - `v_end`: 结束位置
  - `length`: 长度
  - `chain_type`: 链类型（可能为None）
  - `score`: 检测分数
  - `sequence`: 序列摘要或全序列
  - `detection_method`: 检测方法
- 触发 `WARN_MULTI_DOMAIN`

### 信号肽处理

- 若 V区检测 `v_start > 0`，则 `0..v_start-1` 视为上游非V区（通常为信号肽/前导肽/垃圾序列）
- 不强制"按生物学信号肽规则剪"，而以V区边界为准，减少误剪
- 在 `cleaning_log` 中记录：
  - `upstream_length`: 上游残留长度
  - `upstream_tail_15`: 上游序列尾部15aa摘要

### 恒定区/标签处理

- 若 `v_end < original_length`，则 `v_end..end` 视为下游非V区（通常为 CH1/CL、Fc、His-tag、linker）
- 设 `trimmed_constant_region = True`
- 在 `cleaning_log` 中记录：
  - `downstream_length`: 下游残留长度
  - `downstream_head_15`: 下游序列头部15aa摘要

## V区编号与gap规则

- **仅对裁剪后的V区编号**
- V区序列应为连续氨基酸串（不含gap）
- 编号输出字典中允许出现缺失位点/插入位点，但不允许把gap作为序列字符写回V区
- 双编号映射（IMGT↔Kabat）以IMGT为"主锚"

## STOP / WARN 规则

### 必须 STOP（直接拒绝进入后续人源化/评估）

- `variable_domain.detected == False`
- V区长度不合理：
  - VH/VHH：< 90 或 > 150
  - VL：< 85 或 > 140
- V区中X比例过高（> 5%）
- 字段恒等式约束不满足（`STOP_INCONSISTENT_BOUNDARIES`）
- 出现 `*`（终止符）或明显移码痕迹

### 允许继续但必须 WARN（进入报告的"输入风险提示"）

- `status=conflict`（双编号映射冲突）
- 同一条序列检测到多个V区（疑似融合构建）- `WARN_MULTI_DOMAIN`
- V区长度处在边界极值（例如 VH 149–150）
- 出现异常富集片段（如 poly-G/S、强疏水段）提示可能有linker或标签残留
- 上游残留较长（`v_start` 很大）提示N端拼接/信号肽不典型
- 下游残留较长（`v_end < original_length` 且差值大）提示C端恒定区/标签

### WARN原因结构化

- **`warn_reasons`**: `List[str]` - 结构化WARN原因列表（必须存在）
- **`warn_reason`**: `str` - 字符串格式（兼容字段，由 `warn_reasons` 连接生成）
- 多个WARN同时触发时全部写入列表，不得丢失
- `qa_flags` 与 `warn_reasons` 一致（qa_flags是"分级+标签"，warn_reasons是"触发原因列表"）

## 记录与可追溯性

每条输入必须保存：

- **`raw_input_hash`**: 原始输入序列的SHA256哈希
- **`cleaning_log`**: 清洗日志
  - `original_length`: 原始长度
  - `cleaned_length`: 清洗后长度
  - `removed_chars`: 移除的字符类型列表
  - `removed_count`: 移除字符计数
  - `x_count`: X字符数量
  - `invalid_chars`: 非法字符列表
  - `invalid_count`: 非法字符数量
  - `has_fasta_header`: 是否有FASTA头
  - `fasta_header`: FASTA头内容
  - `upstream_length`: 上游残留长度（如有）
  - `upstream_tail_15`: 上游序列尾部15aa摘要（如有）
  - `downstream_length`: 下游残留长度（如有）
  - `downstream_head_15`: 下游序列头部15aa摘要（如有）
- **`variable_domain`**: V区检测信息（见上文）
- **`extra_domains`**: 其他V区列表（如有多个）
- **`tool_versions`**: 工具版本（ANARCI/anarcii版本、scheme=imgt/kabat）
- **`qa_flags`**: QA标志列表
- **`stop_reason`**: STOP原因（如有）
- **`warn_reason`**: WARN原因（字符串，兼容）
- **`warn_reasons`**: WARN原因列表（结构化）

## 清洗输出分级

用于客户报告/开发者报告：

- **Clean (Green)**: 单一V区、长度合理、X≈0、dual_map完整
- **Usable with Warnings (Yellow)**: conflict / 多V区 / 边界长度，但仍可定位关键位点
- **Reject (Red)**: V区无法检测或质量不达标，必须客户重发序列或人工修复

## 实现细节

### 字段恒等式验证

在生成最终输出前，必须验证：

```python
v_length == variable_domain_length
v_end - v_start == v_length
len(variable_domain_sequence) == v_length
```

若不满足，触发 `STOP_INCONSISTENT_BOUNDARIES` 并在 `cleaning_log` 中记录诊断信息。

### 多V区检测策略

当前实现：
1. 检测第一个V区
2. 如果剩余序列足够长（>100aa），尝试检测第二个V区
3. 选择score最高者作为主 `variable_domain`
4. 其余记录到 `extra_domains`

未来可扩展：更复杂的多V区检测算法（滑动窗口、分段搜索等）。

---

**版本**: 1.0  
**创建日期**: 2025-12-14  
**最后更新**: 2025-12-14  
**所有者**: antibody_engineering  
**审核者**: computational_structures








