# VHH Humanization Design Standard - FINAL VERSION

**Version:** 1.0 FINAL  
**Date:** 2026-01-03  
**Status:** ✅ USER CONFIRMED - LOCKED

---

## ⚠️ **OFFICIAL STANDARD - DO NOT MODIFY**

This document represents the **final, user-confirmed** VHH humanization design standard. All modifications require formal approval.

---

## 🎯 **Core Design Philosophy**

### **Humanization Gradient Principle:**
```
S1 (Maximum Humanization) → Fewest back-mutations → Highest % human
S2 (Balanced)             → Moderate back-mutations → Medium % human  
S3 (Conservative)         → Most back-mutations → Lowest % human

Logic: S1 closest to human, S3 closest to camelid
```

---

## 📊 **Three-Strategy System**

### **Strategy 1 (S1): Maximum Humanization**

**Target:** Closest to human antibody, minimal camelid residues

**Back-mutations:** 7 positions
```
✓ VHH Hallmarks (CRITICAL): 37, 44, 45, 47 (4 positions)
✓ Vernier Anchors (CRITICAL): 28, 29, 94 (3 positions)
```

**Characteristics:**
- Humanization: ~94%
- FR2 coverage: 4/16 = 25% (Hallmarks only)
- Risk: HIGH (functional risk due to extensive humanization)

**Scientific Basis:**
- VHH Hallmarks: Harmsen & De Haard (2007), Muyldermans (2013)
- Vernier Anchors: Foote & Winter (1992) concept, adapted for VHH

**Use Case:**
- Chronic/long-term therapeutics
- Regulatory requirements for high humanization
- Acceptable functional risk for lower immunogenicity

---

### **Strategy 2 (S2): Balanced ("半人半驼" for FR2)**

**Target:** Balance humanization and functional retention

**Back-mutations:** 15 positions
```
✓ All S1 positions (7)
✓ FR2 Buried/Structural: 34, 36, 40, 42 (4 positions)
✓ Vernier Tuning: 49, 71, 73, 78 (4 positions)
```

**Characteristics:**
- Humanization: ~87%
- FR2 coverage: 8/16 = 50% ✓ ("半人半驼")
  - Inner (buried): Camelid → structural stability
  - Outer (surface): Human → reduced immunogenicity
- Risk: MEDIUM (balanced)

**FR2 Strategy:** "Half-human, half-camel"
- Preserve buried positions for core packing
- Humanize surface positions for immunogenicity reduction

**Scientific Basis:**
- FR2 buried positions critical for structural integrity
- Vernier tuning positions support CDR stability
- Surface humanization reduces immunogenic epitopes

**Use Case:**
- **INDUSTRY STANDARD** ⭐
- Most projects' first choice
- Optimal risk-benefit balance

---

### **Strategy 3 (S3): Conservative (FR2 "全驼")**

**Target:** Maximum functional retention, closest to original camelid

**Back-mutations:** 29 positions
```
✓ All S2 positions (15)
✓ FR2 Surface: 32, 33, 35, 38, 39, 41, 43, 46 (8 positions)
✓ FR3 Structural: 66, 67, 72, 74, 77, 82 (6 positions)
```

**Characteristics:**
- Humanization: ~75%
- FR2 coverage: 16/16 = 100% ✓ ("全驼")
  - **Complete FR2 preservation**
  - Includes both buried AND surface positions
- Risk: LOW (functional risk minimized)

**FR2 Strategy:** "Full-camel"
- Entire FR2 region preserved from original VHH
- Avoids disrupting Hallmark microenvironment
- Maximum guarantee of structural integrity

**Scientific Basis:**
- FR2 is the signature region of VHH
- Complete preservation ensures Hallmark synergy
- Precedent: Caplacizumab (100% camelid, FDA-approved)

**Use Case:**
- Discovery/optimization phase
- Affinity is paramount
- Acceptable lower humanization (e.g., Caplacizumab precedent)

---

## 📈 **Strategy Gradient Summary**

```
Strategy  Mutations  Humanization  FR2 Strategy         Risk    Scenario
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S1        7          94%           25% (Hallmarks)      HIGH    High humanization req.
S2        15         87%           50% (半人半驼)✓      MEDIUM  Standard practice ⭐
S3        29         75%           100% (全驼)✓         LOW     Maximum function

Gradient: 7 → 15 → 29 (back-mutations increase)
          94% → 87% → 75% (humanization decreases)
          HIGH → MEDIUM → LOW (functional risk)
```

---

## 🔬 **Tier Classification System**

### **Tier 0: CRITICAL (Must Preserve in ALL Strategies)**

| Position | Type | Kabat | Region | Function |
|----------|------|-------|--------|----------|
| **28** | Vernier Anchor | 28 | FR1/FR2 | Critical anchor for CDR1 geometry |
| **29** | Vernier Anchor | 29 | FR1/FR2 | Critical anchor for CDR1 geometry |
| **37** | VHH Hallmark | 37 | FR2 | VHH structural hallmark |
| **44** | VHH Hallmark | 44 | FR2 | VHH structural hallmark |
| **45** | VHH Hallmark | 45 | FR2 | VHH structural hallmark |
| **47** | VHH Hallmark | 47 | FR2 | VHH structural hallmark |
| **94** | Vernier Anchor | 94 | FR3 | Critical anchor for CDR3 geometry |

**Total:** 7 positions  
**Strategies:** S1, S2, S3 (ALL)

---

### **Tier 1: HIGH PRIORITY (S2 and S3)**

| Position | Type | Region | Function |
|----------|------|--------|----------|
| **34** | FR2 Structural | FR2 | Buried, core packing |
| **36** | FR2 Structural | FR2 | Buried, core packing |
| **40** | FR2 Structural | FR2 | Buried, core packing |
| **42** | FR2 Structural | FR2 | Buried, core packing |
| **49** | Vernier Tuning | FR2/CDR2 | CDR2 support |
| **71** | Vernier Tuning | FR3 | CDR2-CDR3 geometry |
| **73** | Vernier Tuning | FR3 | Adjacent to CDR3 |
| **78** | Vernier Tuning | FR3 | CDR3 electrostatics |

**Total:** 8 positions  
**Strategies:** S2, S3

---

### **Tier 2: MEDIUM PRIORITY (S3 only)**

**FR2 Surface (8 positions):**
- 32, 33, 35, 38, 39, 41, 43, 46
- Surface exposed, less critical but complete FR2 preservation

**FR3 Structural (6 positions):**
- 66, 67, 72, 74, 77, 82
- Secondary support, near CDR regions

**Total:** 14 positions  
**Strategies:** S3

---

### **Tier 3: LOW PRIORITY (Generally NOT included)**

**FR1 Surface (5 positions):**
- 1, 5, 14, 22, 24
- Far from paratope, minimal functional impact

**Total:** 5 positions  
**Strategies:** Generally none (fully humanized)

---

## 🔬 **Scientific Basis**

### **1. VHH Hallmarks (Tier 0) - ✅ VALIDATED**

**Literature:**
- **Harmsen & De Haard (2007)**, Appl Microbiol Biotechnol
- **Muyldermans (2013)**, Annu Rev Biochem

**Key Findings:**
- Position 37: Glu/Gln (hydrophilic) vs Val (VH)
- Position 44/45: Glu/Arg vs Gly/Leu (VH)
- Position 47: Val/Leu vs Trp (VH)
- These compensate for absence of light chain

**Industry Evidence:**
- Caplacizumab: VHH hallmarks NOT humanized
- Ozoralizumab: Hallmarks retained

---

### **2. Vernier Zone Concept - ✅ SCIENTIFICALLY GROUNDED**

**Literature:**
- **Foote & Winter (1992)**, J Mol Biol
  - Original Vernier zone definition
  - Residues that "pack against CDRs"

**Our Application:**
- **Vernier Anchors (Tier 0):** 28, 29, 94
  - Direct structural support for CDR geometry
  - Highest impact on CDR conformation

- **Vernier Tuning (Tier 1):** 49, 71, 73, 78
  - Fine-tune CDR stability
  - Influence CDR-CDR interactions

**Limitation Acknowledged:**
- Original work was on conventional VH/VL, not VHH
- Core concept remains valid: FR residues influence CDR conformation

---

### **3. FR2 "半人半驼" Strategy - ✅ RATIONAL**

**S2 FR2 Design:**
- **Preserve buried (8 positions):** Structural integrity
- **Humanize surface (8 positions):** Immunogenicity reduction
- **Ratio: 50%** - balanced approach

**Industry Alignment:**
- Most VHH humanization projects use selective FR2 preservation
- Complete humanization: high risk
- Complete preservation: lower humanization
- 50% balance: industry consensus

---

### **4. FR2 "全驼" Strategy - ✅ PRECEDENTED**

**S3 FR2 Complete Preservation:**
- **All 16 FR2 positions retained**
- **Rationale:** FR2 is VHH signature region

**Industry Precedent:**
- **Caplacizumab:** 100% camelid (including FR2), FDA-approved
- **Ozoralizumab:** Mostly camelid
- **Evidence:** VHH frameworks are naturally less immunogenic than murine

---

## 📋 **Design Rules (NON-NEGOTIABLE)**

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

### **Rule 3: FR2 Strategy Definition**
```
S1: FR2 Hallmarks only (4/16 = 25%)
S2: FR2 Hallmarks + Buried (8/16 = 50%) = "半人半驼"
S3: FR2 Complete (16/16 = 100%) = "全驼"
```

### **Rule 4: Tier Application**
```
S1 = Tier 0 only (7 positions)
S2 = Tier 0 + Tier 1 (15 positions)
S3 = Tier 0 + Tier 1 + Tier 2 (29 positions)
```

### **Rule 5: Vernier Zone Priority**
```
Vernier Anchors (28, 29, 94): ALL strategies (Tier 0)
Vernier Tuning (49, 71, 73, 78): S2 and S3 only (Tier 1)
```

### **Rule 6: Sequence Length**
```
All humanized sequences: 117 aa (VHH standard)
FR4 (106-117): Always preserved from original
```

---

## ✅ **Quality Control Checklist**

Before finalizing any humanization design:

- [ ] S1 contains exactly 7 back-mutations (Tier 0)
- [ ] S2 contains exactly 15 back-mutations (Tier 0 + 1)
- [ ] S3 contains exactly 29 back-mutations (Tier 0 + 1 + 2)
- [ ] S1 < S2 < S3 in mutation count
- [ ] S1 > S2 > S3 in humanization %
- [ ] All CDRs are 100% preserved
- [ ] All Vernier anchors (28, 29, 94) in all strategies
- [ ] All VHH Hallmarks (37, 44, 45, 47) in all strategies
- [ ] S2 has 8/16 FR2 positions (50%)
- [ ] S3 has 16/16 FR2 positions (100%)
- [ ] All sequences are 117 aa

---

## 📚 **References**

1. **Harmsen MM, De Haard HJ (2007)** Properties, production, and applications of camelid single-domain antibody fragments. *Appl Microbiol Biotechnol* 77:13-22

2. **Muyldermans S (2013)** Nanobodies: natural single-domain antibodies. *Annu Rev Biochem* 82:775-797

3. **Foote J, Winter G (1992)** Antibody framework residues affecting the conformation of the hypervariable loops. *J Mol Biol* 224:487-499

4. **Vincke C, Muyldermans S (2012)** Introduction to heavy chain antibodies and derived Nanobodies. *Methods Mol Biol* 911:15-26

---

## 🔒 **Document Status**

**Version:** 1.0 FINAL  
**Date:** 2026-01-03  
**Status:** ✅ USER CONFIRMED  
**Approval:** LOCKED - No modifications without formal review

**Configuration File:** `config/tier_system_config.json`  
**Implementation:** `output/7d12_verified_run/checkpoint_04_humanized_sequences_FINAL.json`

---

## ✅ **Summary**

This standard ensures:
1. ✅ **Scientific rigor** - Based on validated literature
2. ✅ **Systematic approach** - Tier-based classification
3. ✅ **Clear rationale** - Every position justified
4. ✅ **Progressive gradient** - S1 → S2 → S3 logic
5. ✅ **Industry alignment** - Follows best practices
6. ✅ **Reproducibility** - Fixed, documented rules

**All VHH humanization projects MUST follow this standard.**

---

**Document Owner:** Antibody Engineering Team  
**Last Updated:** 2026-01-03  
**Status:** OFFICIAL - MANDATORY COMPLIANCE















