# AbEvaluator 服务指南

**版本**: v1.0 | **日期**: 2026-02-23

## 一、服务概述

AbEvaluator 是 InSynBio 抗体评估统一入口，支持序列与结构分析。

| 客户类型 | 推荐模块 |
|----------|----------|
| 全人/转基因小鼠抗体 | structure_13param, developability, tap, germline, immunogenicity, cdr_scan |
| 人源化抗体 | 同上 + delta_vs_mouse |
| Ab-Ag 复合物分析 | binding_site, structure_13param |

## 二、模块与能力

| 模块 | 能力 | 输入 |
|------|------|------|
| structure_13param | 13 参数结构评估 | PDB |
| tap | TAP 五项指标 | PDB + cdr_seqs |
| binding_site | 界面解析 | PDB + antigen_chain |
| delta_vs_mouse | 人源化 vs 鼠源 | PDB + ref_pdb |
| developability | pI、GRAVY、SAP | 序列 |
| cdr_scan | CDR 化学风险 | 序列 |
| germline | 胚系检索 | 序列 |
| immunogenicity | MHC-II + 表面免疫原性 | 序列（可选 PDB） |

## 三、调用方式

**CLI**: `python Abenginecore/abenginecore.py evaluate <project_name> --pdb <path> --modules <list> -o out.json`  
**脚本**: `python scripts/run_ab_evaluator.py --project <name> --pdb <path> -o out.json`  
**API**: 见 [ABEVALUATOR_CLI_REFERENCE.md](ABEVALUATOR_CLI_REFERENCE.md)

## 四、抗体评估明细（暂时人工服务）

需要**完整评估明细报告**的客户可申请 **抗体评估明细** 服务。该服务整合 AbEvaluator 各模块，输出序列、结构、可开发性、界面、免疫原性等结构化明细，当前由 InSynBio 专家人工执行并交付（3–5 工作日）。  

详见 [ANTIBODY_EVALUATION_DETAIL_SERVICE.md](ANTIBODY_EVALUATION_DETAIL_SERVICE.md)。

## 五、相关文档

- [ABEVALUATOR_CLI_REFERENCE.md](ABEVALUATOR_CLI_REFERENCE.md) — 完整 CLI 指令集  
- [ANTIBODY_EVALUATION_DETAIL_SERVICE.md](ANTIBODY_EVALUATION_DETAIL_SERVICE.md) — 抗体评估明细服务说明（暂时人工）  
- [InSynBio_Service_Description_zh.md](InSynBio_Service_Description_zh.md) — 网站服务总览  
- [EVALUATION_SERVICE_CAPABILITIES.md](EVALUATION_SERVICE_CAPABILITIES.md) — 能力实现状态
