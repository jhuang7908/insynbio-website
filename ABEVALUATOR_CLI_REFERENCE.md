# AbEvaluator 指令集参考

**版本**: v1.0 | **日期**: 2026-02-23  
**系统**: InSynBio AbEngineCore — 抗体评估 CLI

---

## 一、入口与总览

| 方式 | 命令 |
|------|------|
| **统一 CLI** | `python Abenginecore/abenginecore.py evaluate <project_name> [options]` |
| **独立脚本** | `python scripts/run_ab_evaluator.py [options]` |

---

## 二、完整参数

| 参数 | 必填 | 说明 | 默认值 |
|------|------|------|--------|
| `project_name` | ✓ | 项目名称（输出标识） | — |
| `--type` | | 抗体类型：`fully_human` / `humanized` / `mouse_parent` | `fully_human` |
| `--pdb` | | PDB 文件路径（结构类模块必需） | — |
| `--ref-pdb` | | 参考 PDB（`humanized` 类型做 delta_vs_mouse 时必需） | — |
| `--vh-chain` | | VH 链 ID | `H` |
| `--vl-chain` | | VL 链 ID | `L` |
| `--vh-seq` | | VH 氨基酸序列 | — |
| `--vl-seq` | | VL 氨基酸序列 | — |
| `--antigen-chain` | | 抗原链 ID（`binding_site` 模块必需） | — |
| `--cdr-json` | | CDR 序列 JSON 文件（`tap` 模块必需） | — |
| `--modules` | | 要运行的模块列表（空格分隔） | 全部适用 |
| `--out`, `-o` | | 输出 JSON 路径 | stdout |
| `--use-iedb` | | 启用 IEDB 在线 API（免疫原性） | 否 |
| `--no-strict-qa` | | 禁用 QA 硬中断（失败仅 WARN） | 否 |

---

## 三、模块速查

| 模块 | 说明 | 依赖 | 适用类型 |
|------|------|------|----------|
| `structure_13param` | 13 参数结构评估 | PDB | 全类型 |
| `tap` | TAP 五项指标（PSH/PPC/PNC/SFvCSP/CDR Length） | PDB + cdr_seqs | 全类型 |
| `developability` | pI、GRAVY、SAP、CMC 风险 | 序列 | 全类型 |
| `cdr_scan` | CDR 化学修饰风险 | 序列 | 全类型 |
| `germline` | 胚系检索、identity% | 序列 | 全类型 |
| `immunogenicity` | MHC-II + 表面免疫原性 | 序列（可选 PDB） | 全类型 |
| `binding_site` | 界面解析、BSA、H 键、阻断分析 | PDB + antigen_chain | humanized / fully_human |
| `delta_vs_mouse` | 人源化 vs 鼠源结构差异 | PDB + ref_pdb | humanized |

---

## 四、常用命令示例

### 4.1 全人抗体（仅序列）

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --vh-seq "QVQLVQSGAEVKKPGASVKVSCKASGYTFT..." \
  --vl-seq "DIQMTQSPSSLSASVGDRVTITC..." \
  --modules developability cdr_scan germline immunogenicity \
  -o my_ab_eval.json
```

### 4.2 全人抗体（PDB + 结构）

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb path/to/antibody.pdb \
  --vh-seq "QVQL..." --vl-seq "DIQM..." \
  --modules structure_13param developability germline cdr_scan immunogenicity \
  -o my_ab_eval.json
```

### 4.3 全人抗体 + TAP（需 cdr_seqs）

```bash
# 先准备 cdr_seqs.json: {"H1":"GFTFSSYD","H2":"...","H3":"...","L1":"...","L2":"...","L3":"..."}
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb antibody.pdb \
  --vh-seq "QVQL..." --vl-seq "DIQM..." \
  --cdr-json cdr_seqs.json \
  --modules tap structure_13param developability immunogenicity \
  -o my_ab_eval.json
```

### 4.4 人源化抗体（含 delta）

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type humanized \
  --pdb humanized.pdb \
  --ref-pdb mouse.pdb \
  --modules structure_13param delta_vs_mouse developability immunogenicity \
  --no-strict-qa \
  -o my_ab_eval.json
```

### 4.5 Ab-Ag 复合物界面分析

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb complex.pdb \
  --antigen-chain C \
  --modules binding_site structure_13param developability \
  -o my_ab_eval.json
```

### 4.6 启用 IEDB 免疫原性

```bash
python Abenginecore/abenginecore.py evaluate my_ab \
  --type fully_human \
  --pdb antibody.pdb \
  --vh-seq "QVQL..." --vl-seq "DIQM..." \
  --modules immunogenicity developability \
  --use-iedb \
  -o my_ab_eval.json
```

---

## 五、输出格式

```json
{
  "project_name": "my_ab",
  "ab_type": "fully_human",
  "overall_status": "PASS",
  "modules_run": ["structure_13param", "developability", "germline"],
  "overall_flags": [],
  "results": {
    "structure_13param": { "status": "PASS", "metrics": {...} },
    "developability": { "pI_fab_estimate": 7.2, "GRAVY": -0.31, ... },
    "germline": { "closest_vh_germline": "IGHV3-23*01", ... },
    "_qa": { "status": "PASS", "n_pass": 5, "n_warn": 0, "n_fail": 0 }
  }
}
```

---

## 六、cdr_seqs JSON 格式

`--cdr-json` 指向的 JSON 文件格式：

```json
{
  "H1": "GFTFSSYD",
  "H2": "ISYDGSNKYYADSVKG",
  "H3": "ARDYYYGMDV",
  "L1": "QSISSY",
  "L2": "AAS",
  "L3": "QQSYSTPLT"
}
```

---

## 七、相关文档

- [ABEVALUATOR_SERVICE_GUIDE.md](ABEVALUATOR_SERVICE_GUIDE.md) — 服务能力说明与调用示例  
- [EVALUATION_SERVICE_CAPABILITIES.md](EVALUATION_SERVICE_CAPABILITIES.md) — 各模块实现状态  
- [ABENGINECORE_CLI_USAGE.md](../Abenginecore/ABENGINECORE_CLI_USAGE.md) — 完整 AbEngineCore 指令集
