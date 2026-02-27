# ANARCI 与 ANARCII 区分说明

本仓库**仅使用 ANARCII** 做抗体编号；**ANARCI** 为另一套独立程序，二者不可混用。

---

## 1. 程序对比

| 项目 | **ANARCI** | **ANARCII** |
|------|------------|-------------|
| **发表/年代** | 2015，经典工具 | 2025，新一代 |
| **方法** | 基于**序列比对**到参考库 | 基于 **Seq2Seq 语言模型**，无需比对 |
| **实现** | 独立程序 / 可能有 Python 封装 | **Python 包 `anarcii`**（本仓库所用） |
| **编号方案** | 常见 scheme 支持 | IMGT、Kabat、Chothia、Martin、AHo 等 |
| **特点** | 依赖参考序列、对罕见/新物种可能失败 | 泛化更好、速度高、可处理 VHH/TCR/VNAR 等 |

**结论**：ANARCI 和 ANARCII 是**两套不同程序**；本仓库中所有 `from anarcii import Anarcii` 及基于其的编号逻辑均为 **ANARCII**，不是 ANARCI。

---

## 2. 本仓库中的使用

- **实际调用**：`anarcii` 包（PyPI），类 `Anarcii`，即 **ANARCII**。
- **典型用法**：`engine = Anarcii()` → `engine.number([(id, seq), ...])` → `engine.to_scheme("kabat")` 等。
- **文档/注释**：凡涉及上述 `anarcii` 包处，应写 **ANARCII**；仅在描述“经典/比对式工具”或外部文献时使用 **ANARCI**。

---

## 3. 相关文件（均指 ANARCII）

- `core/humanization/kabat_utils.py`：`kabat_from_anarcii()`、`get_kabat_numbering()` — 使用 ANARCII 输出。
- `core/numbering/dual_scheme.py`：双 scheme 编号 — 调用 ANARCII。
- `scripts/vhh_clinical_40_anarci.py`：40 条临床 VHH 编号 — 脚本名为 anarci，**实现为 ANARCII**。
- `scripts/scfv_like_50_linker_anarci_esmfold.py`：linker 切分后对 VH/VL 编号 — 使用 ANARCII。
- `scripts/build_germline_kabat_cache.py`：胚系 Kabat 缓存 — 使用 ANARCII。

命名历史原因：部分脚本/文件名仍含 “anarci”，但**运行时调用的均为 ANARCII（anarcii 包）**。

---

## 4. ImmuneBuilder 与 ARANCI 接口模拟

**ImmuneBuilder**（ABodyBuilder2 / NanoBodyBuilder2）依赖经典 **ANARCI** 做序列校验与编号（`from anarci import validate_sequence, anarci, scheme_short_to_long`）。本仓库采用「**用 ARANCII 做切分与编号，再模拟 ARANCI 的接口**」：

- **切分**：单链由 ARANCII 编号并识别链型（H/K/L）；scFv 等先由 linker 规则切分为 VH/VL，再对每段用 ARANCII 编号（见 `scripts/scfv_like_50_linker_anarci_esmfold.py`）。
- **接口模拟**：`reports/anarci_compat/anarci.py` 提供 `validate_sequence`、`anarci`、`scheme_short_to_long`，内部全部委托给 `anarcii.Anarcii`，返回值形状与 ImmuneBuilder 期望一致（`numbered[0][0][0]` 为编号列表）。
- **用法**：在导入 ImmuneBuilder 前将 `reports/anarci_compat` 置于 `sys.path` 最前，使 `import anarci` 加载该兼容层。详见 `reports/anarci_compat/README.md` 与 `scripts/batch_immunebuilder_vhh39.py`。

---

## 5. 参考文献（简述）

- **ANARCI**：Dunbar & Deane, *Bioinformatics* 2016（抗原受体编号与分类）。
- **ANARCII**：Oxford Immunology 2025, *bioRxiv* 2025.04.16.648720（通用抗原受体编号语言模型）。
