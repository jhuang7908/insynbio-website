# v5.2 核心设计原则合规性检查

## 版本信息
- **版本**: v5.2 (Production Lock)
- **检查日期**: 2025-12-13
- **状态**: 部分合规，需要修复

---

## 1. FR4 / J 区设计原则合规性

### ✅ 已合规部分

1. **Curated FR4 库已创建**
   - ✅ `data/ighj_curated_fr4.json` 已生成
   - ✅ 包含 IGHJ1-6（01）的 FR4 序列
   - ✅ 所有 FR4 长度为 11 aa
   - ✅ 所有 FR4 起始为 WGxG（WGQG 或 WGRG）

2. **FR4 验证脚本已创建**
   - ✅ `scripts/validate_ighj_curated_fr4.py` 已实现
   - ✅ 校验逻辑：6 条记录、fr4_len=11、fr4_aa 匹配 ^WG.G

### ❌ 需要修复的部分

1. **`core/vhh_humanization.py` - `graft_cdrs_to_template()` 函数**
   - **位置**: 第 436-492 行
   - **问题**: FR4 来源不符合 v5.2 原则
   - **当前逻辑**:
     ```python
     fr4 = consensus.get('fr4', '')
     if not fr4:
         # 从 framework_full 中提取
         fr4 = framework_full[-11:]
     if not fr4:
         # 使用硬编码的默认值
         fr4 = "WGQGTQVTVSS"
     ```
   - **违反原则**: 
     - ❌ FR4 从 `consensus` 或 `framework_full` 获取（违反"FR4 只允许来自人类功能性 IGHJ1-6"）
     - ❌ 使用硬编码默认值（违反"FR4 is a curated structural constant"）
   - **修复方案**: 
     - 必须从 `data/ighj_curated_fr4.json` 加载 FR4
     - 根据选择的 IGHJ 基因（默认 IGHJ1*01）获取对应的 FR4
     - 移除所有硬编码的 FR4 默认值

2. **`core/vhh_scaffolds/graft_engine.py` - `graft_cdrs()` 函数**
   - **位置**: 第 34-76 行
   - **问题**: FR4 从 scaffold 的 `framework_sequences` 获取
   - **当前逻辑**:
     ```python
     fw_seqs = scaffold.data.get("framework_sequences") or {}
     grafted_regions = {
         "FR4": fw_seqs["FR4"],  # ❌ 从 scaffold 获取
     }
     ```
   - **违反原则**: FR4 不应从 scaffold 获取
   - **修复方案**: 必须从 curated FR4 库获取

3. **`core/vhh/vhh_scaffold_match_and_craft.py` - `craft_humanized_vhh()` 函数**
   - **位置**: 第 249-286 行
   - **问题**: FR4 从 scaffold 的 `imgt_positions` 获取
   - **当前逻辑**: 使用 `sc_map.get(pos, ...)` 获取 FR4 位置（118-128）
   - **违反原则**: FR4 不应从 scaffold 推断
   - **修复方案**: 必须从 curated FR4 库获取

---

## 2. CDR3 设计原则合规性

### ✅ 已合规部分

1. **CDR3 未被修改**
   - ✅ 所有代码路径中，CDR3 都直接来自 query 序列
   - ✅ 没有发现 CDR3 替换、缩短或重排的逻辑

2. **CDR3 验证**
   - ✅ QA 验证中有检查 CDR3 是否被修改的逻辑

---

## 3. 编号系统与真值来源合规性

### ✅ 已合规部分

1. **IMGT 作为主要坐标系**
   - ✅ 所有核心逻辑使用 IMGT 编号
   - ✅ FR4 = IMGT 118-128 的定义已明确

2. **Kabat 仅用于展示**
   - ✅ Kabat 用于 hallmark 映射（37/44/45/47）
   - ✅ Kabat 不参与边界定义

---

## 4. 拼接规则合规性

### ❌ 需要修复的部分

1. **当前拼接逻辑不统一**
   - 不同函数使用不同的 FR4 来源
   - 需要统一为：`Human Germline FR1-FR3 + Query CDR3 + Curated Human FR4 (11 aa)`

2. **需要添加拼接验证**
   - 验证拼接后序列可被 anarcii(IMGT) 编号
   - 验证 IMGT 118-128 存在
   - 验证 IMGT 118-128 全部来自 curated FR4

---

## 5. QA / 验证原则合规性

### ✅ 已合规部分

1. **基础验证已存在**
   - ✅ 有 IMGT 编号验证
   - ✅ 有序列完整性检查

### ❌ 需要新增的验证

1. **FR4 来源验证**
   - 需要验证 IMGT 118-128 的序列是否完全匹配 curated FR4
   - 需要验证 FR4 长度是否为 11 aa
   - 需要验证 FR4 起始是否为 WGxG

2. **移除过时的验证**
   - ❌ 不再扫描 J motif（如果存在）
   - ❌ 不再回溯 J 原始 FASTA（如果存在）

---

## 6. 系统复杂度管理原则合规性

### ✅ 已合规部分

1. **Curated FR4 库是确定性的**
   - ✅ JSON 格式，易于验证
   - ✅ 固定 6 条记录，无推断逻辑

---

## 修复优先级

### 🔴 高优先级（必须修复）

1. **修复 `graft_cdrs_to_template()` 函数**
   - 从 curated FR4 库加载 FR4
   - 移除硬编码默认值

2. **修复 `graft_cdrs()` 函数**
   - 从 curated FR4 库加载 FR4
   - 移除从 scaffold 获取 FR4 的逻辑

3. **修复 `craft_humanized_vhh()` 函数**
   - 从 curated FR4 库加载 FR4
   - 移除从 scaffold 推断 FR4 的逻辑

### 🟡 中优先级（建议修复）

1. **统一拼接逻辑**
   - 创建统一的拼接函数
   - 确保所有路径使用相同的 FR4 来源

2. **添加 FR4 来源验证**
   - 在 QA 验证中添加 FR4 来源检查
   - 验证 IMGT 118-128 匹配 curated FR4

### 🟢 低优先级（可选优化）

1. **文档更新**
   - 更新函数文档字符串
   - 添加 v5.2 原则说明

---

## 修复建议

### 1. 创建统一的 FR4 加载函数

```python
# core/fr4_loader.py
def load_curated_fr4(ighj_id: str = "IGHJ1*01") -> str:
    """
    从 curated FR4 库加载 FR4 序列
    
    Args:
        ighj_id: IGHJ 基因 ID，格式为 "IGHJ{1-6}*01"
    
    Returns:
        FR4 序列（11 aa）
    
    Raises:
        ValueError: 如果 ighj_id 不存在或无效
    """
    fr4_json_path = PROJECT_ROOT / "data" / "ighj_curated_fr4.json"
    with open(fr4_json_path, "r", encoding="utf-8") as f:
        curated_data = json.load(f)
    
    if ighj_id not in curated_data:
        raise ValueError(f"IGHJ ID {ighj_id} not found in curated FR4 library")
    
    fr4_aa = curated_data[ighj_id]["fr4_aa"]
    
    # 验证 FR4 长度和格式
    if len(fr4_aa) != 11:
        raise ValueError(f"FR4 length mismatch: expected 11, got {len(fr4_aa)}")
    
    if not re.match(r'^WG.G', fr4_aa):
        raise ValueError(f"FR4 does not match pattern ^WG.G: {fr4_aa}")
    
    return fr4_aa
```

### 2. 修改 `graft_cdrs_to_template()` 函数

```python
def graft_cdrs_to_template(
    vhh_cdrs: Dict[str, str], 
    human_template: Dict[str, Any],
    ighj_id: str = "IGHJ1*01"  # 新增参数
) -> str:
    """
    将VHH的CDR移植到Human模板框架
    
    v5.2 合规：FR4 必须来自 curated IGHJ1-6 库
    """
    from core.fr4_loader import load_curated_fr4
    
    consensus = human_template['consensus']
    
    # 获取FR1-3
    fr1 = consensus.get('fr1', '')
    fr2 = consensus.get('fr2', '')
    fr3 = consensus.get('fr3', '')
    
    # v5.2: FR4 必须从 curated 库加载
    fr4 = load_curated_fr4(ighj_id)
    
    # 使用统一的序列重建函数
    regions = {
        'FR1': fr1,
        'CDR1': vhh_cdrs.get('CDR1', ''),
        'FR2': fr2,
        'CDR2': vhh_cdrs.get('CDR2', ''),
        'FR3': fr3,
        'CDR3': vhh_cdrs.get('CDR3', ''),
        'FR4': fr4,  # 来自 curated 库
    }
    
    humanized_seq = rebuild_v_region_from_regions(regions)
    return humanized_seq
```

### 3. 添加 FR4 来源验证

```python
# core/vhh_qa_validation.py (或新文件)
def validate_fr4_source(
    humanized_seq: str,
    expected_ighj_id: str = "IGHJ1*01"
) -> Dict[str, Any]:
    """
    验证人源化序列的 FR4 是否来自 curated 库
    
    v5.2 合规性检查：
    - IMGT 118-128 存在
    - IMGT 118-128 序列完全匹配 curated FR4
    """
    from core.fr4_loader import load_curated_fr4
    from core.segmentation.anarcii_adapter import run_anarcii_imgt
    
    # 加载预期的 FR4
    expected_fr4 = load_curated_fr4(expected_ighj_id)
    
    # 对拼接后的序列进行 IMGT 编号
    imgt_result = run_anarcii_imgt(humanized_seq)
    
    # 提取 IMGT 118-128
    pos_to_aa = imgt_result.get("pos_to_aa", {})
    fr4_118_128 = "".join([pos_to_aa.get(pos, "-") for pos in range(118, 129)])
    
    # 验证
    validation_result = {
        "pass": False,
        "expected_ighj_id": expected_ighj_id,
        "expected_fr4": expected_fr4,
        "detected_fr4": fr4_118_128,
        "matches": fr4_118_128 == expected_fr4,
        "errors": []
    }
    
    if not all(pos in pos_to_aa for pos in range(118, 129)):
        validation_result["errors"].append("IMGT 118-128 not fully present")
    
    if fr4_118_128 != expected_fr4:
        validation_result["errors"].append(
            f"FR4 mismatch: expected {expected_fr4}, got {fr4_118_128}"
        )
    
    validation_result["pass"] = len(validation_result["errors"]) == 0
    
    return validation_result
```

---

## 总结

### 当前状态
- ✅ Curated FR4 库已创建并验证
- ✅ CDR3 处理符合原则
- ✅ IMGT 编号系统符合原则
- ❌ FR4 加载逻辑需要修复（3 个函数）
- ❌ FR4 来源验证需要添加

### 下一步行动
1. 创建统一的 FR4 加载函数
2. 修复 3 个核心函数中的 FR4 加载逻辑
3. 添加 FR4 来源验证
4. 更新相关测试

---

## 版本纪律

根据 v5.2 原则第 7 条：

> v5.2 之后：
> - ❌ 不允许重新引入"推断型 FR4 / J"
> - ❌ 不允许混用旧 J 库
> - ❌ 不允许"为了覆盖极端 case"破坏核心约束

**所有修复必须遵循这些约束。**













