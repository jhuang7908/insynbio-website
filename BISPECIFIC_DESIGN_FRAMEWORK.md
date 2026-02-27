# 双特异抗体设计框架

结合 125 条临床双抗学习 + 客户实际需求。

---

## 一、客户需求分类（基于 125 双抗）

| 需求类型 | 数量 | 典型靶点组合 | 格式偏好 |
|----------|------|--------------|----------|
| **TCE（CD3 重定向）** | 65 | BCMA-CD3, CD20-CD3, PSMA-CD3, CD123-CD3, CD19-CD3 | IgG-like 36 / scFv-like 29 |
| **免疫共刺激** | 24 | PD-L1+4-1BB, LAG3+CTLA4, PD-1+CTLA4 | 多为 IgG-like |
| **双肿瘤靶点** | 9 | EGFR+MET, HER2 双表位, PD-L1+CD47 | IgG-like 为主 |
| **其他** | 27 | 多靶点、特殊组合 | 混合 |

**结论**：TCE 是最大客户需求（52%），其次是免疫共刺激（19%）。

---

## 二、125 双抗学习要点

### 2.1 格式 × 需求

- **TCE**：IgG-like 与 scFv-like 各占一半，客户可根据半衰期/CMC 选型
- **免疫共刺激**：以 IgG-like 为主（Fc 效应功能、长半衰期）
- **双肿瘤**：以 IgG-like 为主（KiH、CrossMab、DVD-Ig）

### 2.2 TCE 靶点频次（Top 5）

| 肿瘤靶点 | CD3 组合数 | 适应症 |
|----------|------------|--------|
| BCMA | 8 | 多发性骨髓瘤 |
| CD20 | 4 | B 细胞淋巴瘤 |
| PSMA | 3 | 前列腺癌 |
| CD123 | 3 | AML |
| CD19 | 2 | B-ALL |

### 2.3 现有设计能力（functional_domains.json）

- **Linker**：G4S1/3/5/6、EAAAK3
- **KiH**：Knob-in-hole 突变位点
- **Binder**：FMC63(CD19)、c11D5.3(BCMA)、m971(CD22)、SS1(MSLN)、YP7(GPC3)、OKT3(CD3)
- **格式**：Tandem VHH、KiH IgG

---

## 三、设计流程（结合学习 + 客户需求）

```
客户需求输入
    ↓
需求分类（TCE / 双肿瘤 / 免疫共刺激）
    ↓
格式选择（参考 125 双抗：IgG-like vs scFv-like）
    ↓
靶点组合校验（参考 125 临床靶点对）
    ↓
设计执行
    ├─ scFv-like：Tandem scFv + Linker（G4S3 等）→ ESMFold 本地建模
    ├─ IgG-like：KiH + CrossMab → ColabFold 多链建模
    └─ Tandem VHH：VHH1-linker-VHH2 → 现有 design_bispecific.py
    ↓
可开发性 / 免疫原性评估（AbEngineCore）
```

---

## 四、待建能力

| 能力 | 现状 | 目标 |
|------|------|------|
| **125 双抗知识库** | slice_4 有 ID 列表 | 提取 format_raw、靶点对、linker 模式、Fc 亚型 → JSON |
| **需求→格式推荐** | 无 | 按需求类型推荐格式（TCE→IgG/scFv 二选一；共刺激→IgG） |
| **靶点组合校验** | 无 | 检查靶点对是否在 125 临床中出现，给出相似参考 |
| **scFv 序列提取** | 无 | 从 125 双抗中解析 scFv 臂序列，建参考集 |
| **ESMFold 批量** | 有 ColabFold 脚本 | 增加 scFv 单链 ESMFold 本地批处理 |

---

## 五、实施优先级

1. **P0**：建 125 双抗知识库 JSON（format、targets、phase、fc_isotype、format_raw）
2. **P1**：扩展 design_bispecific.py，支持「需求类型→格式推荐」+「靶点组合校验」
3. **P2**：从 125 双抗提取 scFv 序列，建 ESMFold 参考结构集
4. **P3**：集成 AbEngineCore 可开发性/免疫原性到双抗设计交付

---

## 六、数据来源

- `data/thera_sabdab/out/reference_slices.json` → slice_4_bispecific_engineering
- `data/thera_sabdab/out/antibody_meta_models.json` → format、target、clinical、fc
- `data/design_rules/functional_domains.json` → linkers、KiH、binders
- `data/design_rules/bispecific_125_knowledge.json` → 125 双抗知识库（由 `scripts/build_bispecific_125_knowledge.py` 生成）
