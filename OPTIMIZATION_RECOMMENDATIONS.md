# 

。

## 、

### 1.1  ⚠️ ****

****：`_lazy_get_config`  `core/vhh_humanization.py`  `core/scaffolds.py` 。

****：
```python
#  core/vhh_humanization.py  core/scaffolds.py 
def _lazy_get_config:
    """"""
    import importlib.util
    import sys
    from pathlib import Path
    # ...  ...
```

****：
```python
#  core/utils/config_loader.py
""""""
import importlib.util
import sys
from pathlib import Path

_CONFIG_MODULE_NAME = 'core_config_module'

def get_config_lazy:
    """"""
    if _CONFIG_MODULE_NAME in sys.modules:
        return sys.modules[_CONFIG_MODULE_NAME].get_config
    
    config_path = Path(__file__).resolve.parents[1] / "config.py"
    if not config_path.exists:
        raise ImportError(f"config.py not found at {config_path}")
    
    spec = importlib.util.spec_from_file_location(_CONFIG_MODULE_NAME, config_path)
    config_module = importlib.util.module_from_spec(spec)
    sys.modules[_CONFIG_MODULE_NAME] = config_module
    spec.loader.exec_module(config_module)
    
    return config_module.get_config

# ：
from core.utils.config_loader import get_config_lazy as get_config
```

****：
- 
- 
- 

### 1.2 scaffolds.py  get_config  ⚠️ ****

****：`core/scaffolds.py` 38-40，`get_config` 。

****：
```python
def get_config:
    """"""


```

****：
```python
def get_config:
    """"""
    return _lazy_get_config
```

### 1.3 HTML ⚠️ ****

****：`core/reporting.py`  `_markdown_to_html_simple` ，。

****：
```python
def _markdown_to_html_simple(md: str) -> str:
    """MarkdownHTML"""
    html = md
    html = html.replace("# ", "<h1>").replace("\n# ", "</h1>\n<h1>")
    # ...  ...
```

****：
```python
# markdown
try:
    import markdown
    HAS_MARKDOWN = True
except ImportError:
    HAS_MARKDOWN = False

def _markdown_to_html(md: str) -> str:
    """MarkdownHTML"""
    if HAS_MARKDOWN:
        return markdown.markdown(
            md,
            extensions=['tables', 'fenced_code', 'codehilite']
        )
    else:
        # 
        return _markdown_to_html_simple(md)
```

****：
- Markdown
- 、
- HTML

### 1.4  ⚠️ ****

****：（、）。

****：
```python
#  core/config.py 
def validate_config(cfg: Config) -> List[str]:
    """，"""
    errors = []
    
    # 
    required_paths = [
        ('alpaca_scaffolds', cfg.paths.alpaca_scaffolds),
        ('human_templates', cfg.paths.human_templates),
    ]
    for name, path in required_paths:
        if not path.exists:
            errors.append(f"Required path does not exist: {name} = {path}")
    
    # 
    if not 0 < cfg.parameters.clustering_threshold <= 1:
        errors.append(f"clustering_threshold must be in (0, 1], got {cfg.parameters.clustering_threshold}")
    
    if cfg.parameters.hard_min_cdr_score > cfg.parameters.soft_min_cdr_score:
        errors.append("hard_min_cdr_score must be <= soft_min_cdr_score")
    
    return errors

#  Config.load 
@classmethod
def load(cls, config_path: Optional[Path] = None, validate: bool = True) -> Config:
    # ...  ...
    config = cls._from_dict(config_dict)
    
    if validate:
        errors = validate_config(config)
        if errors:
            raise ValueError(f"Configuration validation failed:\n" + "\n".join(errors))
    
    return config
```

## 、

### 2.1  ⚠️ ****

****：`@lru_cache(maxsize=1)` 。

****：
```python
# 
from functools import lru_cache
from typing import Optional

# 
_CACHE_SIZE = 128  # 

@lru_cache(maxsize=_CACHE_SIZE)
def load_alpaca_vhh_scaffolds(cache_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    VHH scaffold
    
    Args:
        cache_key: （，）
    """
    # ...  ...
    
# 
@lru_cache(maxsize=1)
def load_alpaca_vhh_scaffolds -> List[Dict[str, Any]]:
    cfg = get_config
    path = cfg.paths.alpaca_scaffolds
    
    # 
    mtime = path.stat.st_mtime if path.exists else 0
    cache_key = f"{path}_{mtime}"
    
    # ...  ...
```

### 2.2  ⚠️ ****

****：，。

****：
```python
# 
def initialize_config:
    """"""
    try:
        cfg = get_config
        # 
        load_human_vhh_safe_templates
        return cfg
    except Exception as e:
        logger.error(f"Configuration initialization failed: {e}")
        raise
```

## 、API

### 3.1  ⚠️ ****

****：API。

****：
```python
#  FastAPI  Pydantic 
class HumanizeRequest(BaseModel):
    seq: str = Field(..., min_length=50, max_length=200, description="VHH")
    panel: str = Field(default="A", pattern="^[ABC]$|^all$", description="")
    top_k: int = Field(default=3, ge=1, le=20, description="k")
    source: Optional[str] = Field(default=None, max_length=50)

    @validator('seq')
    def validate_sequence(cls, v):
        # 
        valid_aa = set('ACDEFGHIKLMNPQRSTVWY')
        if not all(c in valid_aa for c in v.upper):
            raise ValueError('Invalid amino acid sequence')
        return v.upper
```

### 3.2  ⚠️ ****

****：。

****：
```python
# 
class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    error_code: str
    details: Optional[Dict[str, Any]] = None

# 
@app.exception_handler(VHHHumanizationError)
async def vhh_error_handler(request: Request, exc: VHHHumanizationError):
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(
            success=False,
            error=str(exc),
            error_code="VHH_HUMANIZATION_ERROR"
        ).dict
    )
```

### 3.3  ⚠️ ****

****：
```python
#  slowapi 
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/humanize")
@limiter.limit("10/minute")  # 10
async def humanize_vhh_api(req: HumanizeRequest):
    # ...
```

## 、

### 4.1  ⚠️ ****

****：
```python
# 
class Config:
    _last_modified: Optional[float] = None
    
    @classmethod
    def load(cls, config_path: Optional[Path] = None, auto_reload: bool = False) -> Config:
        # ...  ...
        
        if auto_reload:
            cls._config_path = config_path
            cls._last_modified = config_path.stat.st_mtime
        
        return config
    
    @classmethod
    def check_reload(cls) -> bool:
        """"""
        if not cls._config_path or not cls._last_modified:
            return False
        
        current_mtime = cls._config_path.stat.st_mtime
        if current_mtime > cls._last_modified:
            cls._CFG = None  # 
            return True
        return False
```

### 4.2  ⚠️ ****

****：
- （、、F1）
- 
- 

### 4.3  ⚠️ ****

****：
```python
# 
class ReportTemplate:
    def __init__(self, template_path: Path):
        self.template = self._load_template(template_path)
    
    def render(self, data: Dict[str, Any]) -> str:
        #  Jinja2 
        from jinja2 import Template
        template = Template(self.template)
        return template.render(**data)

# 
reporting:
  html_template: "templates/report.html.j2"
```

## 、

### 5.1  ⚠️ ****

****：。

****：
```python
# tests/test_config.py
import pytest
from pathlib import Path
from core.config import get_config, Config

def test_config_loading:
    cfg = get_config
    assert cfg.paths.project_root.exists
    assert 0 < cfg.parameters.clustering_threshold <= 1

def test_config_env_override(monkeypatch):
    monkeypatch.setenv("VHH_PARAMETERS_CLUSTERING_THRESHOLD", "0.95")
    cfg = get_config
    assert cfg.parameters.clustering_threshold == 0.95

# tests/test_scaffolds.py
def test_load_scaffolds:
    scaffolds = load_alpaca_vhh_scaffolds
    assert len(scaffolds) > 0
    assert 'scaffold_id' in scaffolds[0]

# tests/test_reporting.py
def test_markdown_report:
    result = {
        "success": True,
        "best_match": {...}
    }
    report = generate_markdown_report(result)
    assert "# VHH Humanization Report" in report
```

### 5.2  ⚠️ ****

****：
```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.api_vhh_humanization import app

client = TestClient(app)

def test_humanize_endpoint:
    response = client.post("/humanize", json={
        "seq": "QVQLVESGGG...",
        "panel": "A"
    })
    assert response.status_code == 200
    assert response.json["success"] == True
```

## 、

### 6.1 API ⚠️ ****

****：
- 
- 
- 

### 6.2  ⚠️ ****

****：
```python
# scripts/generate_config_docs.py
def generate_config_docs:
    """config.yamlConfig"""
    # config.yaml
    # 
    # Markdown
```

## 、

### 
1. ✅  `scaffolds.py`  `get_config` 
2. ✅  `_lazy_get_config` 
3. ⚠️ 

### 
1. ⚠️ HTML（markdown）
2. ⚠️ 
3. ⚠️ API
4. ⚠️ 

### 
1. 
2. 
3. 
4. 
5. 

## 、

1. ****（1-2）：
   - 
   - 
   - 

2. ****（3-5）：
   - HTML
   - 
   - API

3. ****：
   - 
   - 
   - 


















