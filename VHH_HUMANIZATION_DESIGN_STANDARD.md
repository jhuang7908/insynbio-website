# VHH Humanization Design Standard

**Version:** 5.0  
**Date:** 2026-05-16  
**Status:** OFFICIAL STANDARD - DO NOT MODIFY WITHOUT APPROVAL  
**Supersedes:** V4.0 (2026-05-06), V3.0, V2.x series, V1.0

---

## ⭐ V5.0 STRUCTURE-DRIVEN UPGRADE (2026-05-16)

V5.0 is a strategic upgrade approved by the Owner (Evolution Log entry 2026-05-16) that replaces V4.0's static template-and-Tier system with a structure-aware, context-driven design. **All five V5.0 changes are mandatory for new VHH humanization runs:**

### V5.0 Change 1 — Template library: clinical-VHH only

- **Drop the 90 synthetic VH3-SAFE templates.** Real clinical VHH templates (currently n=42, expansion welcome) are the only authoritative source.
- **Rationale:** The clinical VHH universe is concentrated; synthetic VH3-SAFE templates do not reflect real human B-cell repertoire and have created repeated developability mismatches.
- **Impact:** `load_human_vhh_safe_templates()` is deprecated. `select_human_templates()` raises an error rather than falling back to VH3-SAFE.

### V5.0 Change 2 — FR identity cutoff lowered to 0.65

- **Cutoff:** `framework_identity >= 0.65` (was 0.70 in V4.0).
- **Rationale:** Aligned with conventional antibody humanization practice (~0.65). The V4.0 0.70 threshold rejected legitimate clinical-VHH matches that were 0.65–0.70.
- **Permissive mode:** `--fr-cutoff 0.60` available for difficult cases (logged in QA audit as `permissive_cutoff_invoked`).
- **Gate:** `key_position_score >= 0.5` (Hallmark + Vernier anchor match) remains a hard floor regardless of cutoff.

### V5.0 Change 3 — Hallmark decisions driven by CDR3 length + hydrophobicity

The static "always preserve 37/44/45/47" rule from V4.0 is replaced with a decision tree (aligned with V1.8.17 VH→VHH conversion Stealth logic):

| Donor profile | Hallmark policy |
|---|---|
| `CDR3 ≥ 17 aa` **AND** `SAP > 0.714` | **FULL Hallmark preservation** (37+44+45+47, camelid-like FR2 retained for solubility) |
| `CDR3 12–17 aa` **AND** `pI ≤ 9.0` | **PARTIAL Hallmark preservation** (37+44 only, balanced) |
| `CDR3 < 12 aa` **AND** charge load low (`net_basic ≤ 4`) | **MINIMAL Hallmark preservation** (37 only, closer to human VH3) |

Hallmark conditional table is loaded from `tier_system_config.json` block `hallmark_decision_v5`.

### V5.0 Change 4 — Non-Hallmark back-mutation: structure + DeepFR-CTX driven

The static Tier 1 (8 positions) and Tier 2 (14 positions) lists from V4.0 are **deprecated as the primary driver**. Per-template structure prediction is **mandatory**.

**Mandatory pipeline:**

1. Run **IgFold or ABodyBuilder2** on the humanized intermediate (donor CDRs + selected human FR).
2. Compute per-FR-residue **SASA** (rel) and **CDR-loop distance** (Å).
3. Apply **DeepFR-CTX** `apply_ctx_guard()` to vote on retention vs. humanization using the 9-mer clinical context database.
4. Generate a **per-template dynamic Tier** based on:
   - `dynamic_tier(pos) = α × static_v4_tier + β × (1 / SASA_rel) + γ × (1 / CDR_distance)` where α=0.4, β=0.3, γ=0.3.
   - Position with `dynamic_tier >= 0.7` → preserve in S1/S2/S3
   - `0.4 <= dynamic_tier < 0.7` → preserve in S2/S3
   - `dynamic_tier < 0.4` → humanize freely

5. CDR preservation invariant remains absolute (rule unchanged).

### V5.0 Change 5 — No-template fallback: DeepFR-CTX-VHH 9-aa context voting

When no clinical-VHH template meets the cutoff and the donor fails feasibility prescreen, the V4.0 fixed-substitution surface reshaping table (F→Y, L→S, …) is replaced with **DeepFR-CTX-VHH 9-mer voting**:

1. **Hard-protected residues:** G, P, C (never substituted).
2. For each FR position (skip CDR, skip Hallmark-mandatory by V5.0 Change 3, skip Vernier anchor 94, skip Tier 0):
   - Compute 9-mer windows overlapping the position.
   - Score all 20 amino acids by clinical 9-mer frequency (database: `config/clinical_842_9mer_db.json`).
3. Pick the highest-scoring AA that:
   - Reduces local SAP (Δ ≤ −0.01), AND
   - Does not introduce PTM motif (NG, NS, DG, DP, QG, …), AND
   - Does not flip charge category (neutral→neutral; D/E→D/E), AND
   - Is not the original residue.
4. Iterate until SAP enters strategy-permitted band OR no improving candidate exists (max 10 iterations).

---

## 📊 V5.0 Compatibility with V4.0 Strategy Names

V5.0 retains S1/S2/S3 names for backward compatibility but redefines them as dynamic-Tier ranges, not static position lists:

| Strategy | V4.0 (static) | V5.0 (dynamic) |
|---|---|---|
| **S1** | Tier 0 only (7 positions) | Dynamic Tier ≥ 0.7 + Hallmark policy |
| **S2** | Tier 0 + 1 (15 positions) | Dynamic Tier ≥ 0.4 + Hallmark policy |
| **S3** | Tier 0 + 1 + 2 (29 positions) | Dynamic Tier > 0 + Hallmark policy (Conservative) |

Expected mutation counts and humanization% become **per-sequence**, not fixed.

---

## 🔒 V5.0 Mandatory Quality Gates

Before delivering any V5.0 humanization output:

- [ ] Template was selected from clinical-VHH library only (NO VH3-SAFE).
- [ ] FR identity ≥ 0.65 (or permissive cutoff logged in QA audit).
- [ ] Hallmark policy (Change 3) recorded: `FULL`, `PARTIAL`, or `MINIMAL`.
- [ ] IgFold/ABodyBuilder2 structure prediction completed (PDB cached).
- [ ] SASA + CDR-distance per FR residue recorded in result.json.
- [ ] DeepFR-CTX guard log attached (`ctx_guard_decisions`).
- [ ] CDRs 100% preserved (CDR1/CDR2/CDR3 invariant).
- [ ] If surface reshaping fallback was used: 9-aa context voting log attached.

V4.0 quality gates (CDR3 hard ≥ 25 aa, SAP hard > 0.771) are **retained** as feasibility prescreen.

---

---

## 📋 **Purpose**

This document defines the **fixed, non-negotiable rules** for VHH humanization design in this project. All humanization strategies must follow these standards.

---

## 🎯 **Core Principles**

1. **Tier-based classification** - All back-mutations must be classified into Tier 0-3
2. **Vernier Zone priority** - Vernier anchors and tuning positions are critical
3. **Progressive strategies** - S1 < S2 < S3 in conservativeness
4. **CDR preservation** - CDRs are NEVER humanized (always 100% original)
5. **Traceable rationale** - Every position must have a documented reason

---

## 📊 **Tier Classification System**

### **Tier 0: CRITICAL **

**Definition:** Positions that are absolutely essential for VHH function and CDR geometry. Must be preserved in ALL strategies.

**Positions:**

| Position | Type | Kabat | Region | Function |
|----------|------|-------|--------|----------|
| **37** | Hallmark | 37 | FR2 | VHH structural hallmark |
| **44** | Hallmark | 44 | FR2 | VHH structural hallmark |
| **45** | Hallmark | 45 | FR2 | VHH structural hallmark |
| **47** | Hallmark | 47 | FR2 | VHH structural hallmark |
| **28** | Vernier Anchor | 28 | FR1/FR2 border | Critical anchor for CDR1 geometry |
| **29** | Vernier Anchor | 29 | FR1/FR2 border | Critical anchor for CDR1 geometry |
| **94** | Vernier Anchor | 94 | FR3 | Critical anchor for CDR3 geometry |

**Total:** 7 positions  
**Rule:** MUST be included in S1, S2, S3

---

### **Tier 1: HIGH PRIORITY **

**Definition:** Positions critical for structural stability and CDR support. Strongly recommended for functional retention.

**Positions:**

| Position | Type | Region | Function |
|----------|------|--------|----------|
| **34** | FR2 Structural | FR2 | Buried, core packing |
| **36** | FR2 Structural | FR2 | Buried, core packing |
| **40** | FR2 Structural | FR2 | Buried, core packing |
| **42** | FR2 Structural | FR2 | Buried, core packing |
| **49** | Vernier Tuning | FR2/CDR2 border | CDR2 support |
| **71** | Vernier Tuning | FR3 | CDR2-CDR3 geometry |
| **73** | Vernier Tuning | FR3 | Adjacent to CDR3 |
| **78** | Vernier Tuning | FR3 | CDR3 electrostatics |

**Total:** 8 positions  
**Rule:** MUST be included in S2, S3. Optional for S1.

---

### **Tier 2: MEDIUM PRIORITY **

**Definition:** Positions that contribute to stability and function but are less critical. Optional for conservative strategies.

**Positions:**

| Category | Positions | Count | Function |
|----------|-----------|-------|----------|
| **FR2 Surface** | 32, 33, 35, 38, 39, 41, 43, 46 | 8 | Surface exposed, lower impact |
| **FR3 Structural** | 66, 67, 72, 74, 77, 82 | 6 | Secondary support, near CDR |

**Total:** 14 positions  
**Rule:** MUST be included in S3. Optional for S1, S2.

---

### **Tier 3: LOW PRIORITY **

**Definition:** Positions far from CDRs with minimal functional impact. Generally humanized.

**Positions:**

| Category | Positions | Count | Region |
|----------|-----------|-------|--------|
| **FR1 Surface** | 1, 5, 14, 22, 24 | 5 | FR1 N-terminus |

**Total:** 5 positions  
**Rule:** Generally NOT included unless specific structural data supports it.

---

## 🎯 **Three Standard Strategies**

### **S1: Base Humanized**

**Formula:** `Tier 0 only`

**Back-mutations:** 7 positions  
- Tier 0: 28, 29, 37, 44, 45, 47, 94

**Characteristics:**
- Maximum humanization (typically 94-96%)
- Minimum camelization
- Only CRITICAL positions preserved
- Suitable for: Acute/short-term therapeutics

**FR2 Coverage:** 4/16 positions (25%) = Hallmarks only

---

### **S2: Safety-Optimized**

**Formula:** `Tier 0 + Tier 1`

**Back-mutations:** 15 positions  
- Tier 0: 7 positions
- Tier 1: 8 positions (34, 36, 40, 42, 49, 71, 73, 78)

**Characteristics:**
- Balanced humanization (typically 85-90%)
- Functional stability ensured
- Vernier network supported
- Suitable for: Chronic/long-term therapeutics

**FR2 Coverage:** 8/16 positions (50%) = Hallmarks + buried structural  
**FR3 Coverage:** 3/36 positions = Vernier tuning only

---

### **S3: Affinity-Optimized (Conservative)**

**Formula:** `Tier 0 + Tier 1 + Tier 2`

**Back-mutations:** 29 positions  
- Tier 0: 7 positions
- Tier 1: 8 positions
- Tier 2: 14 positions (FR2 surface + FR3 structural)

**Characteristics:**
- Conservative humanization (typically 75-80%)
- Maximum functional retention
- Extended Vernier network
- Suitable for: Discovery/optimization phase

**FR2 Coverage:** 16/16 positions (100%) = Complete FR2 preservation  
**FR3 Coverage:** 9/36 positions = Extended structural support

---

## 📐 **Design Rules (FIXED)**

### **Rule 1: Progressive Gradient**
```
S1 < S2 < S3 in back-mutation count
S1 > S2 > S3 in humanization percentage
```

### **Rule 2: CDR Preservation**
```
CDR1-IMGT (25-31): 100% original in ALL strategies
CDR2-IMGT (48-56): 100% original in ALL strategies
CDR3-IMGT (94-106): 100% original in ALL strategies
```

### **Rule 3: FR1 Strategy**
```
FR1 is generally fully humanized in all three strategies.
Exception: Positions 28, 29 (Vernier anchors at FR1/FR2 border)
```

### **Rule 4: FR2 Strategy**
```
S1: Hallmarks only (positions 37, 44, 45, 47)
S2: Hallmarks + buried (add 34, 36, 40, 42)
S3: Complete FR2 (all 16 positions: 32-47)
```

### **Rule 5: FR3 Strategy**
```
S1: No FR3 back-mutations (except Vernier anchor 94)
S2: Vernier tuning only (49, 71, 73, 78)
S3: Extended Vernier + structural (add 66, 67, 72, 74, 77, 82)
```

### **Rule 6: Vernier Zone Priority**
```
Anchors (28, 29, 94): ALWAYS preserved (Tier 0)
Tuning (49, 71, 73, 78): S2 and S3 only (Tier 1)
Extended (66, 67, 72, 74, 77, 82): S3 only (Tier 2)
```

---

## 🔬 **Position Classification Reference**

### **VHH Hallmarks (Kabat Numbering)**
- **37 (IMGT 37):** Q in VHH, V in conventional VH
- **44 (IMGT 44):** E/G in VHH, W in conventional VH
- **45 (IMGT 45):** R/G in VHH, L in conventional VH
- **47 (IMGT 47):** V/L in VHH, W in conventional VH

### **Vernier Zone (Literature-based)**
**Anchors (Tier 0):**
- Kabat 27, 28 (IMGT 28, 29) - CDR1 anchor
- Kabat 93, 94 (IMGT 94) - CDR3 anchor

**Tuning (Tier 1):**
- Kabat 30 (IMGT 30) - CDR1 fine-tuning
- Kabat 47 (IMGT 49) - CDR2 support
- Kabat 71 (IMGT 71) - CDR2-CDR3 geometry
- Kabat 73 (IMGT 73) - CDR3 adjacent
- Kabat 78 (IMGT 78) - CDR3 electrostatics

---

## 📊 **Expected Mutation Counts**

| Strategy | Tier 0 | Tier 1 | Tier 2 | Tier 3 | Total | Humanization |
|----------|--------|--------|--------|--------|-------|--------------|
| **S1** | 7 | 0 | 0 | 0 | 7 | ~94% |
| **S2** | 7 | 8 | 0 | 0 | 15 | ~87% |
| **S3** | 7 | 8 | 14 | 0 | 29 | ~75% |

**Tolerance:** ±2 positions per strategy due to sequence-specific variations

---

## ⚠️ **Quality Control Checklist**

Before finalizing any humanization design, verify:

- [ ] S1 contains exactly Tier 0 positions
- [ ] S2 contains Tier 0 + Tier 1 positions
- [ ] S3 contains Tier 0 + Tier 1 + Tier 2 positions
- [ ] S1 < S2 < S3 in total mutations
- [ ] All CDRs are 100% preserved
- [ ] All Vernier anchors (28, 29, 94) are in S1/S2/S3
- [ ] All VHH Hallmarks (37, 44, 45, 47) are in S1/S2/S3
- [ ] S3 has complete FR2 (16/16 positions)
- [ ] Each position has documented rationale in Tier system

---

## 📚 **References**

1. **IMGT Numbering:** [IMGT.org](http://www.imgt.org)
2. **Kabat Numbering:** For functional sites (Hallmark, Vernier)
3. **Vernier Zone Definition:** Foote & Winter (1992), J Mol Biol
4. **VHH Hallmarks:** Harmsen & De Haard (2007), Appl Microbiol Biotechnol
5. **CURSOR_REPORT_ENGINE v3.0:** Project internal standard

---

## 🔒 **Change Control**

**Version History:**

| Version | Date | Changes | Approver |
|---------|------|---------|----------|
| 1.0 | 2026-01-03 | Initial standard creation | System |
| 2.x | 2026-01–02 | Tier system refinements (V2.0–V2.8 series) | Owner |
| 3.0 | 2026-03 | Database-B integration, V2.2 Primary Selector (42 clinical VHH) | Owner |
| 4.0 | 2026-05-06 | VHH68_CMC_Benchmark_v1.0 prescreen gates (CDR3 ≥25aa, SAP >0.771) | Owner |
| **5.0** | **2026-05-16** | **Structure-driven Tier + DeepFR-CTX fallback; drop VH3-SAFE; FR cutoff 0.70→0.65; Hallmark decision tree by CDR3+SAP** | **Owner (Evolution Log 2026-05-16)** |

**Modification Policy:**
- Any changes to Tier definitions require formal review
- Position classifications cannot be changed without literature support
- Strategy formulas are FIXED and cannot be modified per-project

---

## ✅ **Summary**

This standard ensures:
1. ✅ Consistent, reproducible humanization design
2. ✅ Scientific rationale for every position
3. ✅ Systematic Tier-based classification
4. ✅ Fixed rules that prevent arbitrary changes
5. ✅ Quality-controlled output

**All future VHH humanization projects MUST follow this standard.**

---

**Document Owner:** Antibody Engineering Team  
**Review Cycle:** Annual  
**Status:** ACTIVE - MANDATORY COMPLIANCE















