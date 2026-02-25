# VHH Humanization Decision Tree (IMGT-Only Standard)
# VHH 人源化设计决策树 (仅限 IMGT 标准)

## Step 0 — Quality Control (输入质控)
*   **Target**: VHH / Heavy-chain only V-domain.
*   **Validation**: Must pass ANARCII IMGT numbering without major truncation.
*   **Chain Filter**: If detected as VL (κ/λ), exit this tree and redirect to "Chain Classification/Split" module.
*   **目标**：VHH / 仅重链 V 结构域。
*   **验证**：必须通过 ANARCII IMGT 编号，无明显截断。
*   **链过滤**：若判别为 VL (κ/λ)，退出此决策树，进入“链型判别/切分”模块。

---

## Step 1 — H1/H2 Canonical Determination (构型判别)
*   **Identification**: Calculate North–Dunbrack classes for H1 and H2 using IMGT CDR1/CDR2 boundaries.
*   **Primary Split (H2-Driven)**:
    *   **Flow A: H2 = H2-9-1 (Short H2 Subspace)**
        *   Default Preference: **Back-mutation (BM)** (Human framework dominance + necessary structural fixes).
    *   **Flow B: H2 = H2-10-1 (Stable Basin)**
        *   Default Preference: **Surface Resurfacing (SR) / Native** (Camelid core preservation + surface humanization).
    *   **Flow C: Others / Unknown H2**
        *   Default Preference: **Conservative SR** (or Native→SR) + Mandatory CMC/Structural Audit.

---

## Step 2 — Template Pool Selection (模板池选择)
*   **Principle**: Match canonical subspace first, then rank by identity and quality.
*   **Pool Definitions**:
    *   **Pool-S (Stable Basin)**: For H2-10-1 / H1-13-1. Primarily VH3-based human VHH-friendly scaffolds (e.g., IGHV3-23, IGHV3-30).
    *   **Pool-H2-9 (Short-H2)**: For H2-9-1. Primarily VH3-based, mandatory check for Vernier/Anchor consistency.
*   **Ranking Priority (High to Low)**:
    1.  **Canonical-dependent (ND-dependent v2-lite) core positions** consistency (treated as hard guardrails).
    2.  **Canonical-dependent candidate positions** consistency (treated as soft guardrails).
    3.  Vernier anchor positions (IMGT 28, 29, 94) consistency.
    4.  VHH hallmark positions (IMGT 37, 44, 45, 47) consistency.
    5.  FR identity (Overall and Segmental FR1/2/3).
    6.  CMC / Liabilities.

---

## Step 3 — Strategy Recommendation (策略推荐)
*   **Inputs**: H2 class, `vh_identity_global`, CDR3 Features (len, vector), Mutation Burden (hallmark, vernier, other).

### 1. Recommend BM (Human Framework + Necessary Back-mutation)
*   **Criteria**: H2 = H2-9-1 **AND** at least one of:
    *   `vh_identity_global` ≥ 0.90
    *   `cdr3_len` ≤ 13
    *   `mut_hallmark` ≤ 1 AND `mut_vernier_anchor` ≤ 1 (Low cost for structural restoration).

### 2. Recommend SR (Camelid Core + Surface Resurfacing)
*   **Criteria**: H2 = H2-10-1 (or Flow B/C) **AND** at least one of:
    *   `cdr3_len` ≥ 14
    *   CDR3 Vector: `gp_frac` high or `net_charge` negative (associated with flexible/diverse loops).
    *   `vh_identity_global` < 0.90 (Prevents excessive unnatural back-mutations).

### 3. Recommend Native (Minimal Intervention)
*   **Criteria**:
    *   Baseline explorer / control group.
    *   Validated clinical precedent (e.g., Caplacizumab style).
    *   If SR would introduce excessive surface liabilities.

---

## Step 4 — Back-mutation (BM) Tiering (修复优先级)
*   **Goal**: Structural/folding support, not "reverting everything."

| Tier | Priority | Positions (IMGT) | Strategy / Action |
| :--- | :--- | :--- | :--- |
| **Tier 0** | **Mandatory** | **ND-dependent (core)**, Vernier Anchors (28, 29, 94), IMGT Boundary Anchors (26, 39, 55, 66, 104, 118) | **Fix First**: Restore to parent VHH residue if prediction shows structural disruption. |
| **Tier 1** | **VHH-Specific** | **ND-dependent (candidate)**, Hallmarks (37, 44, 45, 47) | **If BM**: Primary set for back-mutation. **If SR/Native**: Retain camelid hallmarks. |
| **Tier 2** | **Surface** | Strict Surface Plasticity Whitelist (`surface_plasticity_positions_v1_strict`) | **Audit**: Allow humanization replacement if CMC audit (CDR3 vector check) passes. |
| **Tier 3** | **Others** | All other FR positions | **Minimal**: No back-mutation unless explicit evidence of risk (expression/aggregation). |

---

## Limitations (局限性说明)
*   **ND-dependent v2-lite** inferred from Slice-3 only; will be validated/expanded with Slice-1 VH in later release.
*   **ND-dependent v2-lite** 仅基于 Slice-3 数据推断；将在后续版本中使用 Slice-1 VH 数据进行验证和扩展。

---

## Final Output (结论生成)
1.  **H1/H2 Canonical Signature**: (e.g., H1-13-1 / H2-10-1).
2.  **Template Pool + Top Templates**: (Pool-S or Pool-H2-9).
3.  **Strategy Recommendation**: (BM / SR / Native) + Triggering Rationale.
4.  **Back-mutation Plan**: Tiered list of positions with rationale.

---
**Audit Trail**: Based on Slice-3 deep analysis and InSynBio-AI Antibody Engineer Suite Standards.
