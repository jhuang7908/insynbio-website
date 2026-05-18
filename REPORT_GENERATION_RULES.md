# CRO

## 

** status != "OK" " CRO "。**

## Status 

- `"OK"`: QA，，CRO
- `"OK_SAFE_MODE"`: Safe，QA，CRO（safe_mode）
- `"FAILED_QA"`: QA，**QA**
- `"FAILED"`: ，****

## 

### 1. CRO（ status == "OK"  "OK_SAFE_MODE"）

```python
if status in ["OK", "OK_SAFE_MODE"]:
    # CRO
    html_report = generate_cro_html_report_cn_enhanced(result, output_id)
else:
    # ，
    html_report = generate_cro_html_report_failed_cn(result, output_id, qa_result)
```

### 2. QA（status == "FAILED_QA"）

：
- 
- QA
- ："，/"
- （、mAb、）

### 3. （status == "FAILED"）

：
- 
- 

## 

**：**
-  status != "OK"  `generate_cro_html_report_cn_enhanced`
- QA""
- ""

## 

，：

1. ✅  `result.get("status")`
2. ✅  status in ["OK", "OK_SAFE_MODE"] 
3. ✅ status
4. ✅ ，

## 

```python
def generate_cro_report(result: dict) -> str:
    """
    CRO（QA）
    
    ：
    - status == "OK"  "OK_SAFE_MODE": 
    - status: 
    """
    status = result.get("status", "UNKNOWN")
    
    # ：OK
    if status not in ["OK", "OK_SAFE_MODE"]:
        # 
        qa_result = result.get("qa", {})
        return generate_qa_failure_report(result, qa_result)
    
    # 
    return generate_full_cro_report(result)
```

## 

（OK）：
- ""
- 
- 
- 

## 

：
-  status == "OK" 
-  status == "FAILED_QA" 
-  status == "FAILED" 

















