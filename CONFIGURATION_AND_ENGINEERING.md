# 配置与工程化改进文档

本文档描述了VHH分析系统的配置层、资源加载层、报告生成和API接口的实现。

## 一、统一配置层（config.yaml + core/config.py）

### 1.1 配置文件结构

系统现在使用 `config.yaml` 作为统一的配置源，支持：

- **路径配置**：所有数据文件路径集中管理
- **参数配置**：算法参数、阈值、权重等
- **环境变量覆盖**：通过 `VHH_<SECTION>_<KEY>` 格式覆盖配置

### 1.2 使用方式

```python
from core.config import get_config

cfg = get_config()

# 访问路径
alpaca_scaffolds_path = cfg.paths.alpaca_scaffolds
human_templates_path = cfg.paths.human_templates

# 访问参数
clustering_threshold = cfg.parameters.clustering_threshold
hard_min_cdr_score = cfg.parameters.hard_min_cdr_score
scoring_weights = cfg.parameters.scoring_weights
```

### 1.3 环境变量覆盖

```bash
# 覆盖数据根目录
export VHH_PATHS_DATA_ROOT="/path/to/data"

# 覆盖聚类阈值
export VHH_PARAMETERS_CLUSTERING_THRESHOLD=0.95

# 覆盖嵌套配置（用__分隔）
export VHH_PARAMETERS_SCORING_WEIGHTS__FRAMEWORK_IDENTITY=0.6
```

## 二、资源加载层（core/scaffolds.py）

### 2.1 功能

提供统一的资源加载接口，使用 `@lru_cache` 避免重复IO：

- `load_alpaca_vhh_scaffolds()`: 加载羊驼VHH scaffold面板
- `load_human_vh3_scaffolds()`: 加载Human VH3 scaffold面板
- `load_human_vhh_safe_templates()`: 加载Human VHH-SAFE模板库
- `load_alignment_matrix()`: 加载对齐得分矩阵

### 2.2 使用方式

```python
from core.scaffolds import (
    load_alpaca_vhh_scaffolds,
    load_human_vhh_safe_templates,
    load_alignment_matrix
)

# 自动使用缓存，第二次调用不会重新读取文件
alpaca_scaffolds = load_alpaca_vhh_scaffolds()
human_templates = load_human_vhh_safe_templates()
alignment_index = load_alignment_matrix()

# 清除缓存（用于开发/测试）
from core.scaffolds import clear_cache
clear_cache()
```

### 2.3 错误处理

所有加载函数都会抛出 `ScaffoldLoadError` 异常，包含详细的错误信息。

## 三、Fallback标记工具（core/utils/fallback.py）

### 3.1 功能

提供统一的fallback标记方法，确保全系统fallback字段风格统一：

```python
from core.utils.fallback import mark_fallback, is_fallback, get_fallback_info

# 标记对象为fallback
template = {"template_id": "HUMAN_VH3_SCF_01"}
mark_fallback(
    template,
    reason="ANARCII numbering failed",
    ftype="numbering",
    severity="warning"
)

# 检查是否为fallback
if is_fallback(template):
    info = get_fallback_info(template)
    print(f"Fallback reason: {info['reason']}")
```

### 3.2 Fallback类型

- `"numbering"`: IMGT编号失败
- `"template"`: 模板来源问题
- `"scaffold"`: Scaffold加载失败
- `"generic"`: 其他通用fallback

## 四、报告生成模块（core/reporting.py）

### 4.1 功能

将 `humanize_vhh()` 的JSON结果转换为可读的报告：

- **Markdown报告**：适合内部使用、文档生成
- **HTML报告**：可嵌入SaaS前端
- **JSON报告**：原始数据格式

### 4.2 使用方式

```python
from core.vhh_humanization import humanize_vhh
from core.reporting import generate_markdown_report, save_report

# 执行人源化
result = humanize_vhh("QVQLVESGGG...", panel="A", top_k=3)

# 生成Markdown报告
md_report = generate_markdown_report(result)
print(md_report)

# 保存报告到文件（自动选择格式）
report_path = save_report(result, format="markdown")
# 或
report_path = save_report(result, format="html")
```

### 4.3 报告内容

报告包含：

1. **输入VHH信息**：长度、来源、VHH hallmark检查结果
2. **最佳匹配模板**：template_id、panel、fallback状态、developability等级
3. **评分详情表格**：framework_identity、cdr_compatibility、developability、combined_score
4. **风险与警告**：fallback、long CDR3、noncanonical Cys、high-liability FR等
5. **详细信息**：完整的JSON数据（可折叠）

## 五、基准评估脚本（scripts/evaluate_vhh_matching_benchmark.py）

### 5.1 功能

评估 `humanize_vhh()` 在基准集上的表现：

- Top-1命中率：最佳匹配是否为专家选择
- Top-3命中率：前3个匹配中是否包含专家选择
- 警告检测率：是否正确识别风险
- 禁止匹配检测：是否匹配了不应匹配的模板

### 5.2 使用方式

```bash
# 使用默认基准文件（config.yaml中配置）
python scripts/evaluate_vhh_matching_benchmark.py

# 指定基准文件
python scripts/evaluate_vhh_matching_benchmark.py --benchmark data/benchmark/my_benchmark.json

# 指定面板和top_k
python scripts/evaluate_vhh_matching_benchmark.py --panel all --top-k 10

# 保存结果
python scripts/evaluate_vhh_matching_benchmark.py --output results/benchmark_eval.json
```

### 5.3 基准文件格式

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
    "notes": "标准VHH序列，应匹配A级模板"
  }
]
```

## 六、HTTP API接口（app/api_vhh_humanization.py）

### 6.1 功能

提供RESTful API接口，包装 `humanize_vhh()` 功能：

- 支持FastAPI（优先）和Flask（备选）
- CORS支持（可配置）
- 自动API文档（FastAPI Swagger）

### 6.2 启动服务

```bash
# 使用默认配置（从config.yaml读取）
python app/api_vhh_humanization.py

# 或使用uvicorn（FastAPI）
uvicorn app.api_vhh_humanization:app --host 0.0.0.0 --port 8000
```

### 6.3 API端点

#### POST /humanize

人源化VHH序列

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

人源化VHH序列并生成报告

**Query Parameters:**
- `format`: `markdown` (default) 或 `html`

**Request Body:** 同 `/humanize`

**Response:** Markdown或HTML格式的报告

#### GET /health

健康检查

**Response:**
```json
{
  "status": "healthy"
}
```

#### GET /docs

API文档（仅FastAPI，Swagger UI）

### 6.4 使用示例

```python
import requests

# 人源化请求
response = requests.post(
    "http://localhost:8000/humanize",
    json={
        "seq": "QVQLVESGGG...",
        "panel": "A",
        "top_k": 3
    }
)
result = response.json()

# 生成报告
response = requests.post(
    "http://localhost:8000/humanize/report?format=html",
    json={"seq": "QVQLVESGGG..."}
)
html_report = response.text
```

## 七、迁移指南

### 7.1 从硬编码路径迁移

**旧代码:**
```python
ALPACA_SCAFFOLDS_FILE = PROJECT_ROOT / "data" / "germlines" / "vicugna_pacos_ig_aa" / "vhh_scaffolds" / "vhh_scaffolds.json"
with open(ALPACA_SCAFFOLDS_FILE) as f:
    scaffolds = json.load(f)
```

**新代码:**
```python
from core.scaffolds import load_alpaca_vhh_scaffolds
scaffolds = load_alpaca_vhh_scaffolds()
```

### 7.2 从硬编码参数迁移

**旧代码:**
```python
combined_score = 0.5 * framework_identity + 0.25 * cdr_compat + 0.25 * dev_score
```

**新代码:**
```python
from core.config import get_config
cfg = get_config()
weights = cfg.parameters.scoring_weights
combined_score = (
    weights['framework_identity'] * framework_identity +
    weights['cdr_compatibility'] * cdr_compat +
    weights['developability'] * dev_score
)
```

### 7.3 添加Fallback标记

**旧代码:**
```python
template['fallback'] = True
template['fallback_reason'] = "ANARCII failed"
```

**新代码:**
```python
from core.utils.fallback import mark_fallback
mark_fallback(template, "ANARCII numbering failed", "numbering", "warning")
```

## 八、配置最佳实践

1. **开发环境**：使用默认 `config.yaml`，通过环境变量覆盖
2. **生产环境**：创建 `config.prod.yaml`，通过环境变量指定
3. **测试环境**：创建 `config.test.yaml`，使用较小的数据集
4. **多项目**：每个项目有自己的 `config.yaml`，通过 `VHH_PATHS_PROJECT_ROOT` 指定

## 九、故障排查

### 9.1 配置未生效

- 检查 `config.yaml` 是否存在
- 检查环境变量格式是否正确（`VHH_<SECTION>_<KEY>`）
- 清除Python缓存：`python -c "from core.config import get_config; get_config()"`

### 9.2 资源加载失败

- 检查文件路径是否正确（使用 `cfg.paths.xxx` 查看）
- 检查文件是否存在
- 查看错误信息中的完整路径

### 9.3 API无法启动

- 检查是否安装了FastAPI或Flask
- 检查端口是否被占用
- 查看日志中的错误信息

## 十、未来扩展

1. **配置验证**：添加配置文件的schema验证
2. **配置热重载**：支持运行时重新加载配置
3. **多环境配置**：支持dev/staging/prod多环境
4. **配置模板**：提供配置模板和示例
5. **配置文档生成**：自动生成配置文档


















