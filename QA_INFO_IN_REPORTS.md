# QA

****: 20251210  
****: `scripts/generate_egfr_cro_report_cn_enhanced.py`

---

## 

JSONHTMLQA，warningserrors，。

---

## JSONQA

### 

QAJSON：

```json
{
  "qa": {
    "ok": true/false,
    "errors": [...],
    "warnings": [...]
  }
}
```

### 

 `prepare_json_data` ：

```python
"qa": result.get("qa", {})  # QA（warningserrors）
```

---

## HTMLQA

### 1. （status == "OK"  "OK_SAFE_MODE"）

#### 

****: 9（""）

****:
- QA warnings
- warning"fallback"，

****:
- : `generate_method_limitations_section(qa_result: dict)`
- : `generate_full_html_report` 

****:

1. **Fallback**:
   -  (`#fff3cd`)
   -  (`#f39c12`)
   - ："⚠️ ："
   - 

2. ****:
   -  (`#f8f9fa`)
   -  (`#6c757d`)
   - 

**HTML**:
```html
<div class="section">
    <h2 class="section-title">9. </h2>
    <div class="info-box">
        <p>QA，：</p>
    </div>
    <ul>
        <!-- Fallback -  -->
        <li style="......">
            <strong>⚠️ ：</strong>
            <span>fallbackFR2，。</span>
            <p>，fallback。</p>
        </li>
        <!--  -->
        <li style="......">
            <span>FR2（<10 aa），</span>
        </li>
    </ul>
</div>
```

---

### 2. （status == "FAILED_QA"  "FAILED"）

#### QA

****: 

****:
- QA errors
- 

****:
- : `generate_cro_html_report_failed_cn`
- :
  1. ****: "FR """
  2. **CDR**: "CDR"""""
  3. ****: """"
  4. ****: 

****:

：
-  (`#fee`)
-  (`#e74c3c`)
- （"："）
- 

**HTML**:
```html
<h3 style="color: #e74c3c; margin-top: 20px;">QA：</h3>
<ul>
    <!--  -->
    <li style="......">
        <strong>：</strong>
        <span>FR (21) FR (17) ...</span>
    </li>
    <!-- CDR -->
    <li style="......">
        <strong>CDR：</strong>
        <span>CDR1 （4: N->Q），VHHCDR。</span>
    </li>
    <!--  -->
    <li style="......">
        <strong>：</strong>
        <span>humanized_sequence  FR1-CDR1-FR2-CDR2-FR3-CDR3-FR4 ...</span>
    </li>
</ul>
```

---

## 

### 1. 

****: "FR "、""、""

****:
- `"FR (21) FR (17) ，。"`
- `" FR1 3 (Q->X) FR，。"`

### 2. CDR

****: "CDR" + (""  "")

****:
- `"CDR1 （4: N->Q），VHHCDR。"`
- `"CDR1 （=6aa, =7aa），VHH FR-only。"`

### 3. 

****: ""、""

****:
- `"humanized_sequence  FR1-CDR1-FR2-CDR2-FR3-CDR3-FR4 ，。"`

---

## 

### JSONQA

```python
import json

with open("report.json", "r", encoding="utf-8") as f:
    data = json.load(f)

qa = data.get("qa", {})
if qa.get("ok"):
    print("QA")
    if qa.get("warnings"):
        print(":", qa["warnings"])
else:
    print("QA")
    print(":", qa.get("errors", []))
```

### HTML

1. ****: 9""
2. ****: "QA"

---

## 

✅ **JSON**: QA `qa`   
✅ **HTML**: 9""warnings，fallback  
✅ **HTML**: errors，  

****: ✅ 

---

****: 1.0  
****: 20251210

















