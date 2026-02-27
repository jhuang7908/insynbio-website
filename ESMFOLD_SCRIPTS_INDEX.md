# ESMFold 相关脚本索引

本仓库中与 **ESMFold 造模 / 结构预测** 相关的脚本与用法汇总，便于复用和对比。

---

## 1. 通用 / 设计规则（scFv linker 流程）

| 脚本 | 作用 | 输入 | 输出 |
|------|------|------|------|
| **scripts/scfv_like_50_linker_anarci_esmfold.py** | Linker 识别、ANARCI、导出 ESMFold 用 FASTA | CSV/Excel（抗体 ID + 序列） | `linker_split_results.json`、**esmfold_input.fasta** |
| **scripts/run_esmfold_batch_from_fasta.py** | 从 FASTA 批量调用 ESMFold（API 或本地） | 任意 FASTA（单链，如 VH-linker-VL） | 每条序列一个 PDB + 可选 summary CSV |

- 84 条「两边有抗体结构」的 FASTA：`data/design_rules/multispecific_linker_pipeline/esmfold_input_two_sided_84.fasta`  
- 用 84 条造模示例：见下文「84 条批量造模」。

---

## 2. 项目内 ESMFold 脚本（类似分析）

### 2.1 使用 ESMFold API（无需本地 GPU）

| 脚本 | 输入格式 | 说明 |
|------|----------|------|
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/h3only_mpnn_temp_sweep/20260129_083507/T0.05/run_esmfold.py** | FASTA：`>id`，序列为 `VH:VL`（冒号分隔） | 内部拼成 VH+G4S3+VL 后调 API，保存 `{id}.pdb` |
| **projects/pembrolizumab/design_rounds/round2_codesign_H3L3/run_esmfold_round2.py** | CSV：`id, vh_seq, vl_seq` | API 或本地；拼成 full_seq=vh+vl（无 linker）后预测，并做 pLDDT/接触分析 |
| **projects/pembrolizumab/run_esmfold_comparison.py** | 项目内比较用 | 调 ESMFold API |
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/run_vl_esmfold.py** | VL 相关 | 调 ESMFold API |

### 2.2 使用本地 ESMFold（fair-esm）

| 脚本 | 输入格式 | 说明 |
|------|----------|------|
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/run_esmfold_gate1.py** | FASTA：`>id`，序列 `VH:VL` | 本地 `esm.pretrained.esmfold_v1()`，预测后做 pLDDT、clash、interface contacts 和综合打分，输出 Top10 |

### 2.3 结构分析（基于 ESMFold 产出的 PDB）

| 脚本 | 作用 |
|------|------|
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/superpose_vh_structures.py** | 将 ESMFold 预测的 VH 叠到参考复合物上 |
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/h3only_mpnn_temp_sweep/.../calc_vh_only_rmsd.py** | 从 ESMFold PDB 提 VH，算 RMSD |
| **projects/pembrolizumab/design_rounds/round1_H2_H3edge/h3only_mpnn_temp_sweep/.../analyze_esmfold_structures.py** | 分析 ESMFold 结构 |
| **projects/pembrolizumab/calc_domain_rmsd.py** | ESMFold 预测的 Fv 域 RMSD 等 |

---

## 3. 84 条（两边有抗体结构）批量造模

- **FASTA**：`data/design_rules/multispecific_linker_pipeline/esmfold_input_two_sided_84.fasta`  
  每条已是单链 **VH + (G4S)3 + VL**，无需再拼 linker。

**推荐**：使用仓库内通用脚本（若已添加）：

```bash
python scripts/run_esmfold_batch_from_fasta.py \
  --fasta data/design_rules/multispecific_linker_pipeline/esmfold_input_two_sided_84.fasta \
  --out-dir data/design_rules/multispecific_linker_pipeline/esmfold_predictions \
  --method api
```

或沿用项目内 API 逻辑：读 FASTA（id + 单链序列），对每条 `requests.post("https://api.esmatlas.com/foldSequence/v1/pdb/", data=sequence)`，保存为 `{id}.pdb`（参考上述 `run_esmfold.py`）。

---

## 4. API 与依赖

- **ESMFold API**：`https://api.esmatlas.com/foldSequence/v1/pdb/`，POST body = 纯序列（单链）。
- **本地**：`pip install fair-esm`，`esm.pretrained.esmfold_v1()`，`model.infer_pdb(sequence)`。

与「84 条、两边有抗体结构、(G4S)3 linker、造模」最接近的既有实现是：  
**round1_H2_H3edge/.../T0.05/run_esmfold.py**（API + FASTA），以及 **run_esmfold_gate1.py**（本地 + 质量分析）。  
84 条 FASTA 已是单链，可直接作为 API/本地预测的输入，无需再按 VH:VL 拆分或拼接。
