# CRO报告生成规则（硬约束）

## 核心原则

**禁止对 status != "OK" 的结果渲染"完整 CRO 报告"。**

## Status 定义

- `"OK"`: QA验证通过，结果正常，可以生成完整CRO报告
- `"OK_SAFE_MODE"`: Safe模式回退成功，QA通过，可以生成完整CRO报告（但需标注为safe_mode）
- `"FAILED_QA"`: QA验证失败，**只能生成QA失败报告**
- `"FAILED"`: 人源化过程失败，**只能生成失败报告**

## 报告生成规则

### 1. 完整CRO报告（仅限 status == "OK" 或 "OK_SAFE_MODE"）

```python
if status in ["OK", "OK_SAFE_MODE"]:
    # 允许生成完整CRO报告
    html_report = generate_cro_html_report_cn_enhanced(result, output_id)
else:
    # 禁止生成完整报告，只能生成失败报告
    html_report = generate_cro_html_report_failed_cn(result, output_id, qa_result)
```

### 2. QA失败报告（status == "FAILED_QA"）

必须包含：
- 序列基本信息
- QA错误列表
- 明确的失败说明："本版本引擎未能生成合格人源化方案，建议后续手工检查/升级引擎后重跑"
- 建议（联系技术支持、使用mAb模式、更换克隆等）

### 3. 其他失败报告（status == "FAILED"）

包含：
- 错误信息
- 失败原因

## 禁止行为

**绝对禁止：**
- 对 status != "OK" 的结果调用 `generate_cro_html_report_cn_enhanced()`
- 对QA失败的结果进行"美化包装"
- 生成包含虚假数据的"完整报告"

## 实现检查清单

在实现报告生成函数时，必须：

1. ✅ 首先检查 `result.get("status")`
2. ✅ 只有 status in ["OK", "OK_SAFE_MODE"] 才调用完整报告生成函数
3. ✅ 其他status一律调用失败报告生成函数
4. ✅ 失败报告必须明确说明失败原因，不得美化

## 示例代码

```python
def generate_cro_report(result: dict) -> str:
    """
    生成CRO报告（严格遵循QA结果）
    
    规则：
    - status == "OK" 或 "OK_SAFE_MODE": 生成完整报告
    - 其他status: 只生成失败报告
    """
    status = result.get("status", "UNKNOWN")
    
    # 严格检查：只有OK状态才生成完整报告
    if status not in ["OK", "OK_SAFE_MODE"]:
        # 禁止生成完整报告
        qa_result = result.get("qa", {})
        return generate_qa_failure_report(result, qa_result)
    
    # 允许生成完整报告
    return generate_full_cro_report(result)
```

## 违反规则的后果

如果违反此规则（对非OK状态生成完整报告）：
- 会导致用户看到虚假的"成功"报告
- 掩盖引擎的实际问题
- 浪费用户时间分析无效结果
- 破坏系统可信度

## 测试要求

所有报告生成函数必须包含测试：
- 测试 status == "OK" 时生成完整报告
- 测试 status == "FAILED_QA" 时只生成失败报告
- 测试 status == "FAILED" 时只生成失败报告

















