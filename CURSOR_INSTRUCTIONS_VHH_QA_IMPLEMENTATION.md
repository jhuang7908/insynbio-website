# VHH人源化引擎QA验证和报告生成规范（Cursor指令）

## 核心要求

在VHH人源化引擎中实现完整的QA验证机制和严格的报告生成规范，确保：
1. 所有结果必须通过QA验证才能生成CRO报告
2. FR4区域必须完整包含
3. CDR区域严格禁止突变（VHH FR-only模式）
4. 失败结果明确标识，禁止生成"假正常报告"

## 实施步骤

### 1. QA验证模块（必须）

**创建 `core/vhh_qa_validation.py`，实现 `validate_vhh_humanization_result()` 函数：**

```python
def validate_vhh_humanization_result(result: dict, strict: bool = True) -> dict:
    """
    对单个VHH人源化结果做自检。
    
    检查项：
    - 必须有FR1–FR4 & CDR1–3所有区域
    - 序列长度不能被截断（允许±3 aa容差）
    - CDR不允许发生"实际突变"（VHH FR-only策略）
    - CDR3长度合理性（2-35 aa）
    - FR2 hallmark是否存在
    - FR4完整性检查
    
    Returns:
        {
          "ok": bool,
          "errors": [str],
          "warnings": [str]
        }
    """
```

**在 `humanize_vhh()` 返回结果后立即调用QA验证：**

```python
result = humanize_vhh(...)
qa = validate_vhh_humanization_result(result)
result["qa"] = qa

if not qa["ok"]:
    result["status"] = "FAILED_QA"
    result["success"] = False
    result["error"] = f"QA验证失败: {', '.join(qa['errors'])}"
else:
    result["status"] = "OK"
```

### 2. 修复V区重建逻辑（必须）

**创建统一的序列重建函数：**

```python
V_REGION_ORDER = ["FR1", "CDR1", "FR2", "CDR2", "FR3", "CDR3", "FR4"]

def rebuild_v_region_from_regions(regions: dict) -> str:
    """按IMGT顺序拼接FR/CDR区，确保FR4不丢。"""
    seq_parts = []
    for region in V_REGION_ORDER:
        part = regions.get(region, "")
        if part is None:
            part = ""
        seq_parts.append(part)
    return "".join(seq_parts)
```

**替换所有旧的拼接逻辑：**

- `graft_cdrs_to_template()` 必须使用此函数
- `core/vhh_scaffolds/graft_engine.py` 中的拼接必须使用此函数
- 所有其他序列重建位置必须使用此函数

**添加单元测试：**

```python
def test_rebuild_v_region_includes_fr4():
    regions = {
        "FR1": "AAAA",
        "CDR1": "BBBB",
        "FR2": "CCCC",
        "CDR2": "DDDD",
        "FR3": "EEEE",
        "CDR3": "FFFF",
        "FR4": "GGGG",
    }
    seq = rebuild_v_region_from_regions(regions)
    assert seq == "AAAABBBBCCCCDDDDEEEEFFFFGGGG"
```

### 3. 严格禁止CDR自动突变（必须）

**在mutation plan生成阶段，对CDR区段做hard filter：**

```python
def calculate_mutations(original_seq: str, humanized_seq: str, mode: str = "VHH_FR_ONLY") -> dict:
    """
    计算两个序列之间的突变（VHH FR-only模式：禁止CDR突变）
    
    Returns:
        {
            "mutations": [list],  # 真正应用的FR突变
            "cdr_differences": [list]  # CDR差异（仅记录，不应用）
        }
    """
    mutations = []
    cdr_differences = []
    
    for i in range(min(len(original_seq), len(humanized_seq))):
        if original_seq[i] != humanized_seq[i]:
            position = i + 1
            region = get_region_for_position(position)
            
            mutation = {
                'position': position,
                'from': original_seq[i],
                'to': humanized_seq[i],
                'region': region
            }
            
            if mode == "VHH_FR_ONLY":
                if region.startswith("CDR"):
                    # VHH模式下：记录差异，但不真正应用
                    cdr_differences.append(mutation)
                else:
                    mutations.append(mutation)
    
    return {
        "mutations": mutations,
        "cdr_differences": cdr_differences
    }
```

**在应用突变时只用mutations：**

```python
def apply_mutations_to_regions(original_regions, mutation_plan):
    regions = deepcopy(original_regions)
    for m in mutation_plan["mutations"]:
        if m["region"].startswith("CDR"):
            continue  # 再保险，双重保护
        # ... 在对应region上做AA替换 ...
    return regions
```

**QA函数必须检查CDR突变数量：**

```python
cdr_mut = [m for m in mut_list if m.get("region", "").startswith("CDR")]
if cdr_mut:
    errors.append(
        f"检测到 {len(cdr_mut)} 个CDR突变，但策略定义为'FR-only'。"
    )
```

### 4. Safe_mode回退逻辑（可选但推荐）

**实现safe_mode自动回退：**

```python
def humanize_vhh_with_qa(seq: str, ..., enable_safe_mode: bool = True):
    # 第一次尝试：标准模式
    result = humanize_vhh(seq, ...)
    qa = validate_vhh_humanization_result(result)
    result["qa"] = qa
    
    if qa["ok"]:
        result["status"] = "OK"
        return result
    
    # QA不通过，尝试safe_mode
    if enable_safe_mode:
        safe_result = _try_safe_mode(seq, ...)  # 最保守策略
        safe_qa = validate_vhh_humanization_result(safe_result)
        
        if safe_qa["ok"]:
            safe_result["status"] = "OK_SAFE_MODE"
            safe_result["fallback_reason"] = "Standard mode failed QA"
            return safe_result
    
    # 所有模式都失败
    result["status"] = "FAILED_QA"
    return result
```

**Safe_mode特点：**
- 只使用方案A（最温和）
- 禁用所有CMC/免疫原性修复
- 只保证：序列完整 + 人源化程度基本达标

### 5. 报告渲染硬约束（必须）

**更新CRO报告渲染逻辑，严格遵循status：**

```python
def generate_cro_report(result: dict):
    status = result.get("status", "UNKNOWN")
    
    # 硬约束：只有OK状态才生成完整报告
    if status not in ["OK", "OK_SAFE_MODE"]:
        # 禁止生成完整报告
        qa_result = result.get("qa", {})
        return generate_qa_failure_report(result, qa_result)
    
    # 允许生成完整报告
    return generate_full_cro_report(result)
```

**在完整报告生成函数中添加保护：**

```python
def generate_cro_html_report_cn_enhanced(result: dict, output_id: str) -> str:
    """
    生成完整CRO报告
    
    **硬约束：此函数只能用于 status == "OK" 或 "OK_SAFE_MODE" 的结果**
    """
    status = result.get("status", "UNKNOWN")
    if status not in ["OK", "OK_SAFE_MODE"]:
        raise ValueError(
            f"禁止对 status={status} 的结果生成完整CRO报告。"
            f"请使用 generate_cro_html_report_failed_cn() 生成失败报告。"
        )
    # ... 生成完整报告 ...
```

**失败报告必须包含：**

- 序列基本信息
- QA错误列表
- 明确说明："本版本引擎未能生成合格人源化方案，建议后续手工检查/升级引擎后重跑"
- 建议（联系技术支持、使用mAb模式、更换克隆等）

## 禁止行为

**绝对禁止：**
- 对 status != "OK" 的结果调用完整报告生成函数
- 对QA失败的结果进行"美化包装"
- 生成包含虚假数据的"完整报告"
- 在mutation plan中允许CDR突变
- 序列重建时遗漏FR4

## 测试要求

必须包含以下测试：
- `test_rebuild_v_region_includes_fr4()` - 验证FR4包含
- `test_validate_vhh_humanization_result_fr4_missing()` - 验证QA检测FR4缺失
- `test_validate_vhh_humanization_result_cdr_mutation()` - 验证QA检测CDR突变
- `test_generate_full_report_only_for_ok_status()` - 验证只有OK状态能生成完整报告
- `test_generate_full_report_raises_for_failed_qa()` - 验证FAILED_QA状态禁止生成完整报告

## 实施检查清单

- [ ] 创建 `core/vhh_qa_validation.py` 模块
- [ ] 实现 `validate_vhh_humanization_result()` 函数
- [ ] 实现 `rebuild_v_region_from_regions()` 函数
- [ ] 替换所有序列拼接逻辑使用统一函数
- [ ] 修改 `calculate_mutations()` 支持VHH_FR_ONLY模式
- [ ] 在 `humanize_vhh()` 中集成QA验证
- [ ] 实现safe_mode回退逻辑（可选）
- [ ] 更新报告生成函数添加status检查
- [ ] 添加单元测试
- [ ] 更新文档

## 预期效果

实施后，系统将：
1. ✅ 自动检测并拒绝不合格的人源化结果
2. ✅ 确保FR4区域完整包含
3. ✅ 严格禁止CDR突变
4. ✅ 失败时明确告知用户，不再生成误导性报告
5. ✅ 可选地通过safe_mode自动回退提高成功率

















