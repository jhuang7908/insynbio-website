# 

****: 2025-01-20  
****: 

---

## ✅ 

### 1. Scoring Profile ✅

****:
-  `core/config.py`  `ScoringProfile`  `ScoringConfig` 
-  `ParametersConfig`  `get_scoring_weights` 
-  `core/vhh_humanization.py` scoring profile
- scoring profile

****:
```yaml
parameters:
  scoring:
    active_profile: "default"
    profiles:
      default:
        framework_identity: 0.5
        cdr_compatibility: 0.25
        developability: 0.25
      developability_strict:
        framework_identity: 0.4
        cdr_compatibility: 0.2
        developability: 0.4
      minimized_immunogenicity:
        framework_identity: 0.3
        cdr_compatibility: 0.2
        developability: 0.25
        fr_immunogenicity: 0.25
```

****:
```python
from core.vhh_humanization import humanize_vhh

# profile
result = humanize_vhh(seq, panel="A")

# profile
result = humanize_vhh(seq, panel="A", scoring_profile="developability_strict")
```

****:
- `core/config.py`: ScoringProfileScoringConfig
- `core/vhh_humanization.py`: 
  -  `scoring_profile` 
  -  `calculate_combined_score`  `get_scoring_weights`
  - FR（profile）

### 2.  ✅

****:
- `tests/test_config.py` - 
- `tests/test_scaffolds.py` - Scaffolds
- `tests/test_audit.py` - 
- `tests/test_fallback.py` - Fallback

****:
- ✅ 
- ✅ Scoring profile
- ✅ Scaffolds
- ✅ 
- ✅ Fallback

****:
```bash
pytest tests/test_config.py
pytest tests/test_scaffolds.py
pytest tests/test_audit.py
pytest tests/test_fallback.py
```

### 3.  ✅

****:
- ✅ 
- ✅ HTML（markdown）
- ✅ 
- ✅ timedelta

---

## 📊 

### 
- ****:  ~60 
- ****:  4 ，
- ****: 100% 

### 
- **Scoring Profile**: ✅ 100% 
- ****: ✅ 
- ****: ✅ 100% 

### 
- ****: ✅ 
- ****: ✅ 
- ****: ✅ 

---

## 🔄 

1. ****: 
2. ****: 
3. **API**: API

---

## 📝 

### Scoring Profile

```python
from core.vhh_humanization import humanize_vhh

# 1. profile（balanced）
result1 = humanize_vhh(
    "QVQLVESGGG...",
    panel="A",
    scoring_profile=None  # 
)

# 2. developability_strict profile
result2 = humanize_vhh(
    "QVQLVESGGG...",
    panel="A",
    scoring_profile="developability_strict"
)

# 3. minimized_immunogenicity profile
result3 = humanize_vhh(
    "QVQLVESGGG...",
    panel="A",
    scoring_profile="minimized_immunogenicity"
)
```

### 

```python
from core.audit import get_audit_logger

logger = get_audit_logger

# 
output_id = logger.log_humanization(
    sequence="QVQLVESGGG...",
    result=result,
    panel="A",
    project_name="project_001",
    user_id="user_123"
)

# 
logs = logger.query_logs(
    project_name="project_001",
    event_type="humanization"
)
```

---

## 🎯 

### ✅
- ✅ Scoring Profile
- ✅ 
- ✅ 

### 
1. 
2. API
3. 

### 
1. 
2. ML
3. 

---

****: 2025-01-20  
****: v2.1.0 (Platform Edition with Scoring Profiles)


















