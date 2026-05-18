# 

VHH、、API。

## 、（config.yaml + core/config.py）

### 1.1 

 `config.yaml` ，：

- ****：
- ****：、、
- ****： `VHH_<SECTION>_<KEY>` 

### 1.2 

```python
from core.config import get_config

cfg = get_config

# 
alpaca_scaffolds_path = cfg.paths.alpaca_scaffolds
human_templates_path = cfg.paths.human_templates

# 
clustering_threshold = cfg.parameters.clustering_threshold
hard_min_cdr_score = cfg.parameters.hard_min_cdr_score
scoring_weights = cfg.parameters.scoring_weights
```

### 1.3 

```bash
# 
export VHH_PATHS_DATA_ROOT="/path/to/data"

# 
export VHH_PARAMETERS_CLUSTERING_THRESHOLD=0.95

# （__）
export VHH_PARAMETERS_SCORING_WEIGHTS__FRAMEWORK_IDENTITY=0.6
```

## 、（core/scaffolds.py）

### 2.1 

， `@lru_cache` IO：

- `load_alpaca_vhh_scaffolds`: VHH scaffold
- `load_human_vh3_scaffolds`: Human VH3 scaffold
- `load_human_vhh_safe_templates`: Human VHH-SAFE
- `load_alignment_matrix`: 

### 2.2 

```python
from core.scaffolds import (
    load_alpaca_vhh_scaffolds,
    load_human_vhh_safe_templates,
    load_alignment_matrix
)

# ，
alpaca_scaffolds = load_alpaca_vhh_scaffolds
human_templates = load_human_vhh_safe_templates
alignment_index = load_alignment_matrix

# （/）
from core.scaffolds import clear_cache
clear_cache
```

### 2.3 

 `ScaffoldLoadError` ，。

## 、Fallback（core/utils/fallback.py）

### 3.1 

fallback，fallback：

```python
from core.utils.fallback import mark_fallback, is_fallback, get_fallback_info

# fallback
template = {"template_id": "HUMAN_VH3_SCF_01"}
mark_fallback(
    template,
    reason="ANARCI numbering failed",
    ftype="numbering",
    severity="warning"
)

# fallback
if is_fallback(template):
    info = get_fallback_info(template)
    print(f"Fallback reason: {info['reason']}")
```

### 3.2 Fallback

- `"numbering"`: IMGT
- `"template"`: 
- `"scaffold"`: Scaffold
- `"generic"`: fallback

## 、（core/reporting.py）

### 4.1 

 `humanize_vhh` JSON：

- **Markdown**：、
- **HTML**：SaaS
- **JSON**：

### 4.2 

```python
from core.vhh_humanization import humanize_vhh
from core.reporting import generate_markdown_report, save_report

# 
result = humanize_vhh("QVQLVESGGG...", panel="A", top_k=3)

# Markdown
md_report = generate_markdown_report(result)
print(md_report)

# 
report_path = save_report(result, format="markdown")
# 
report_path = save_report(result, format="html")
```

### 4.3 

：

1. **VHH**：、、VHH hallmark
2. ****：template_id、panel、fallback、developability
3. ****：framework_identity、cdr_compatibility、developability、combined_score
4. ****：fallback、long CDR3、noncanonical Cys、high-liability FR
5. ****：JSON

## 、（scripts/evaluate_vhh_matching_benchmark.py）

### 5.1 

 `humanize_vhh` ：

- Top-1：
- Top-3：3
- ：
- ：

### 5.2 

```bash
# （config.yaml）
python scripts/evaluate_vhh_matching_benchmark.py

# 
python scripts/evaluate_vhh_matching_benchmark.py --benchmark data/benchmark/my_benchmark.json

# top_k
python scripts/evaluate_vhh_matching_benchmark.py --panel all --top-k 10

# 
python scripts/evaluate_vhh_matching_benchmark.py --output results/benchmark_eval.json
```

### 5.3 

```json
[
  {
    "vhh_id": "EXAMPLE_001",
    "vhh_sequence": "QVQLVESGGG...",
    "expected_template_id": "HUMAN_VH3_VHH_SAFE_A_01",
    "expected_template_ids": [
      "HUMAN_VH3_VHH_SAFE_A_01",
      "HUMAN_VH3_VHH_SAFE_A_02",
      "HUMAN_VH3_VHH_SAFE_B_01"
    ],
    "should_not_match": [],
    "notes": "VHH，A"
  }
]
```

## 、HTTP API（app/api_vhh_humanization.py）

### 6.1 

RESTful API， `humanize_vhh` ：

- FastAPIFlask
- CORS
- API（FastAPI Swagger）

### 6.2 

```bash
# （config.yaml）
python app/api_vhh_humanization.py

# uvicorn（FastAPI）
uvicorn app.api_vhh_humanization:app --host 0.0.0.0 --port 8000
```

### 6.3 API

#### POST /humanize

VHH

**Request Body:**
```json
{
  "seq": "QVQLVESGGG...",
  "panel": "A",
  "top_k": 3,
  "source": "llama"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "success": true,
    "best_match": {...},
    "best_by_plan": {...}
  }
}
```

#### POST /humanize/report

VHH

**Query Parameters:**
- `format`: `markdown` (default)  `html`

**Request Body:**  `/humanize`

**Response:** MarkdownHTML

#### GET /health



**Response:**
```json
{
  "status": "healthy"
}
```

#### GET /docs

API（FastAPI，Swagger UI）

### 6.4 

```python
import requests

# 
response = requests.post(
    "http://localhost:8000/humanize",
    json={
        "seq": "QVQLVESGGG...",
        "panel": "A",
        "top_k": 3
    }
)
result = response.json

# 
response = requests.post(
    "http://localhost:8000/humanize/report?format=html",
    json={"seq": "QVQLVESGGG..."}
)
html_report = response.text
```

## 、

### 7.1 

**:**
```python
ALPACA_SCAFFOLDS_FILE = PROJECT_ROOT / "data" / "germlines" / "vicugna_pacos_ig_aa" / "vhh_scaffolds" / "vhh_scaffolds.json"
with open(ALPACA_SCAFFOLDS_FILE) as f:
    scaffolds = json.load(f)
```

**:**
```python
from core.scaffolds import load_alpaca_vhh_scaffolds
scaffolds = load_alpaca_vhh_scaffolds
```

### 7.2 

**:**
```python
combined_score = 0.5 * framework_identity + 0.25 * cdr_compat + 0.25 * dev_score
```

**:**
```python
from core.config import get_config
cfg = get_config
weights = cfg.parameters.scoring_weights
combined_score = (
    weights['framework_identity'] * framework_identity +
    weights['cdr_compatibility'] * cdr_compat +
    weights['developability'] * dev_score
)
```

### 7.3 Fallback

**:**
```python
template['fallback'] = True
template['fallback_reason'] = "ANARCI failed"
```

**:**
```python
from core.utils.fallback import mark_fallback
mark_fallback(template, "ANARCI numbering failed", "numbering", "warning")
```

## 、

1. ****： `config.yaml`，
2. ****： `config.prod.yaml`，
3. ****： `config.test.yaml`，
4. ****： `config.yaml`， `VHH_PATHS_PROJECT_ROOT` 

## 、

### 9.1 

-  `config.yaml` 
- （`VHH_<SECTION>_<KEY>`）
- Python：`python -c "from core.config import get_config; get_config"`

### 9.2 

- （ `cfg.paths.xxx` ）
- 
- 

### 9.3 API

- FastAPIFlask
- 
- 

## 、

1. ****：schema
2. ****：
3. ****：dev/staging/prod
4. ****：
5. ****：


















