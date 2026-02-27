# Project Standards Index

**Last Updated:** 2026-02-18  
**Status:** OFFICIAL DOCUMENTATION

---

## 📚 **Core Standards**

### 1. **VH/VL Antibody Humanization Design Standard** ⭐ CURRENT — V4.4
**File:** [`VH_VL_HUMANIZATION_STANDARD_V4.4.md`](./VH_VL_HUMANIZATION_STANDARD_V4.4.md)（Checklist 优化版）  
**Full narrative:** [`VH_VL_HUMANIZATION_STANDARD_V4.3.md`](./VH_VL_HUMANIZATION_STANDARD_V4.3.md)（正文规则）  
**Purpose:** FIXED RULES for conventional VH/VL antibody humanization — structure-based, semi-automated  
**Applies to:** All VH/VL humanization projects (e.g., 4B12, any mouse IgG/IgM)  
**Status:** **MANDATORY — DO NOT DEVIATE**  
**⚠️ STRICTLY SEPARATED from VHH workflow**

**Key Components (V4.4):**
- ✅ **5-Phase Workflow:** CDR measurement → Framework selection → Structure modeling → Backmutation → QC
- ✅ **Step 2.0 Germline validation:** Sequences from IGHV_aa/IGKV_aa only; no FR4 in V-region
- ✅ **4-Step Framework Protocol:** CDR length gate (L2 excluded — kappa invariant) → Golden Pairs → Vernier score → FR identity
- ✅ **Vernier-CDR overlap:** `in_cdr_union` pre-annotation; same-class requires structural evaluation
- ✅ **VL BM=0 declaration:** Explicit per-position reasoning when VL back-mutations = 0
- ✅ **Phase 5.2b:** Canonical class verification (humanized H1/H2/L1 vs mouse)
- ✅ **CDR3 boundary:** 105–117 only; FR4 from human J-gene; IEDB HTTP status recorded

**Configuration File:** [`../config/vh_vl_humanization_v44.json`](../config/vh_vl_humanization_v44.json)  
**Legacy (V4.3):** [`../config/vh_vl_humanization_v43.json`](../config/vh_vl_humanization_v43.json)  
**Data Basis:** 458-engineered therapeutic antibody structural database

---

### 2. **Report Generation Standard**
**File:** [`CURSOR_REPORT_ENGINE_V3.md`](./CURSOR_REPORT_ENGINE_V3.md)  
**Purpose:** Defines report structure, content requirements, and output formats  
**Applies to:** All antibody humanization reports (VHH, VH, VL, bispecific)  
**Status:** MANDATORY

**Key Requirements:**
- Dual report system (Client + Developer)
- Tier-based mutation classification (Tier 0-3)
- Three final sequences (Seq1-3)
- Complete CMC, immunogenicity, developability analysis

---

### 3. **VHH Humanization Design Standard**
**File:** [`VHH_HUMANIZATION_DESIGN_STANDARD.md`](./VHH_HUMANIZATION_DESIGN_STANDARD.md)  
**Purpose:** **FIXED RULES for VHH humanization strategies**  
**Applies to:** All VHH humanization projects  
**Status:** **MANDATORY - DO NOT DEVIATE**

**Key Components:**
- ✅ **Fixed Tier System:** Tier 0 (7 pos), Tier 1 (8 pos), Tier 2 (14 pos), Tier 3 (5 pos)
- ✅ **Three Standard Strategies:**
  - S1: Tier 0 only (7 mutations, ~94% humanized)
  - S2: Tier 0 + 1 (15 mutations, ~87% humanized)
  - S3: Tier 0 + 1 + 2 (29 mutations, ~75% humanized)
- ✅ **Vernier Zone Priority:** Anchors (28,29,94) + Tuning (49,71,73,78)
- ✅ **VHH Hallmarks:** 37, 44, 45, 47 (FR2)
- ✅ **Design Rules:** Progressive gradient, CDR preservation, fixed formulas

**Configuration File:** [`../config/tier_system_config.json`](../config/tier_system_config.json)

**⚠️ CRITICAL:** This standard is FIXED. All humanization designs must reference and comply with this standard. No arbitrary modifications allowed.

---

### 4. **Numbering Systems**
**Convention:** Dual numbering system  
**Status:** MANDATORY

**IMGT Numbering:**
- Used for: CDR boundary definitions
- CDR1-IMGT: 25-31
- CDR2-IMGT: 48-56
- CDR3-IMGT: 94-106

**Kabat Numbering:**
- Used for: Functional site annotation (Hallmarks, Vernier)
- Hallmarks: Kabat 37, 44, 45, 47
- Vernier: Kabat 27, 28, 29, 30, 47, 49, 71, 73, 78, 93, 94

**编号工具区分：** 本仓库仅使用 **ANARCII**（Python 包 `anarcii`），与经典程序 **ANARCI** 为不同软件。详见 [`ANARCI_VS_ANARCII.md`](./ANARCI_VS_ANARCII.md)。

---

## 🔧 **Configuration Files**

### **VH/VL Humanization Configuration** ⭐ CURRENT — V4.4
**File:** [`../config/vh_vl_humanization_v44.json`](../config/vh_vl_humanization_v44.json)  
**Purpose:** Machine-readable VH/VL humanization rules — V4.4 (Checklist + germline validation + canonical check)  
**Format:** JSON  
**Usage:** Import this file in all new VH/VL humanization scripts

**Contents (V4.4 adds):**
- Step 2.0 germline validation rules; CDR3 boundary 105–117; FR4 sources
- Vernier-CDR overlap `in_cdr_union`; same-class mandatory structural evaluation
- VL BM=0 declaration requirement; Phase 5.2b canonical class check
- L2 exclusion rationale; CDR RMSD threshold 1.5 Å; IEDB HTTP status record
- Full checklist_v4_4 (Phase 1–5) and compliance_rules

---

### **VHH Tier System Configuration**
**File:** [`../config/tier_system_config.json`](../config/tier_system_config.json)  
**Purpose:** Machine-readable Tier classification system for VHH  
**Format:** JSON  
**Usage:** Import this file in all VHH humanization scripts

**Contents:**
- Complete Tier 0-3 position definitions
- Position-level metadata (type, function, priority)
- Strategy formulas (S1, S2, S3)
- Quality check rules
- CDR definitions (IMGT)

---

## 📋 **Design Workflow**

### **For VH/VL Humanization Projects (e.g., 4B12):**

1. **Read the standard:** [`VH_VL_HUMANIZATION_STANDARD_V4.4.md`](./VH_VL_HUMANIZATION_STANDARD_V4.4.md) and narrative [`VH_VL_HUMANIZATION_STANDARD_V4.3.md`](./VH_VL_HUMANIZATION_STANDARD_V4.3.md)
2. **Load configuration:** `config/vh_vl_humanization_v44.json`
3. **Run Phase 2.1:** CDR length gate (batch Anarcii, cached)
4. **Run Phase 2.2–2.4:** Golden pairs + Vernier score + FR identity → generate `humanization_proposal.json`
5. **Human confirmation:** Review Top-3 VH × Top-3 VL candidates
6. **Run Phase 3:** ImmuneBuilder structure model of mouse antibody
7. **Run Phase 4:** Structure-based backmutation decisions (SASA + contact number)
8. **Run Phase 5 QC:** RMSD, angle, packing, liabilities, IEDB
9. **Generate report:** Follow `CURSOR_REPORT_ENGINE_V3.md`

---

### **For VHH Humanization Projects:**

1. **Read the standard:** [`VHH_HUMANIZATION_DESIGN_STANDARD.md`](./VHH_HUMANIZATION_DESIGN_STANDARD.md)
2. **Load configuration:** `config/tier_system_config.json`
3. **Apply fixed formulas:**
   - S1 = Tier 0 positions
   - S2 = Tier 0 + Tier 1 positions
   - S3 = Tier 0 + Tier 1 + Tier 2 positions
4. **Verify quality checks:**
   - S1: 7 mutations ✓
   - S2: 15 mutations ✓
   - S3: 29 mutations ✓
   - S1 < S2 < S3 ✓
5. **Generate report:** Follow `CURSOR_REPORT_ENGINE_V3.md`

---

## ⚠️ **Compliance Rules**

### **MUST DO (VH/VL, V4.4):**
- ✅ Follow `VH_VL_HUMANIZATION_STANDARD_V4.4.md` and config `vh_vl_humanization_v44.json`
- ✅ Validate germline sequences from IGHV_aa/IGKV_aa (no FR4 in V-region)
- ✅ Pre-annotate `in_cdr_union` for Vernier diff table; same-class → structural evaluation
- ✅ Execute all 5 phases in order; Phase 5.2b canonical class verification
- ✅ Declare VL back-mutation count (including zero) with per-position reasoning
- ✅ Record IEDB HTTP status and CDR self-check after assembly

### **MUST NOT DO (VH/VL):**
- ❌ Mix VHH and VH/VL rules, data, or modules
- ❌ Skip ImmuneBuilder modeling; use rearranged antibody sequence as germline
- ❌ Humanize any Union CDR position; set CDR3 upper bound > 117
- ❌ Per-sequence Anarcii calls (batch only)

### **MUST DO (VHH):**
- ✅ Follow the VHH Humanization Design Standard exactly
- ✅ Use the Tier system configuration file
- ✅ Document any deviations with scientific justification
- ✅ Run quality checks before finalizing designs
- ✅ Generate both Client and Developer reports

### **MUST NOT DO (VHH):**
- ❌ Modify Tier definitions without approval
- ❌ Change strategy formulas arbitrarily
- ❌ Skip Vernier zone analysis
- ❌ Humanize CDRs
- ❌ Create ad-hoc position classifications

---

## 📊 **Quick Reference**

### **VHH Tier System Summary**

| Tier | Positions | Priority | S1 | S2 | S3 |
|------|-----------|----------|----|----|-----|
| **0** | 7 (Hallmarks + Vernier Anchors) | CRITICAL | ✓ | ✓ | ✓ |
| **1** | 8 (Structural + Vernier Tuning) | HIGH | | ✓ | ✓ |
| **2** | 14 (Surface + Secondary) | MEDIUM | | | ✓ |
| **3** | 5 (FR1 distant) | LOW | | | |

### **Expected Mutation Counts**

```
S1:  7 mutations → ~94% humanized
S2: 15 mutations → ~87% humanized
S3: 29 mutations → ~75% humanized

Progressive gradient: 7 → 15 → 29 ✓
```

---

## 🔍 **Quality Assurance**

Before submitting any humanization design, verify:

- [ ] Standard document reviewed: `VHH_HUMANIZATION_DESIGN_STANDARD.md`
- [ ] Configuration file loaded: `tier_system_config.json`
- [ ] S1 uses Tier 0 only
- [ ] S2 uses Tier 0 + 1
- [ ] S3 uses Tier 0 + 1 + 2
- [ ] Mutation counts match expected (7, 15, 29)
- [ ] CDRs are 100% preserved
- [ ] All sequences are correct length (117 aa for VHH)
- [ ] Report follows CURSOR_REPORT_ENGINE v3.0

---

## 📞 **Support**

**Questions about standards:**
- Review the specific standard document first
- Check configuration files for exact definitions
- Refer to literature references in standard docs

**Requesting changes:**
- Provide scientific justification
- Cite literature support
- Submit formal change request

---

## 📅 **Version History**

| Date | Standard | Version | Changes |
|------|----------|---------|---------|
| 2026-02-18 | VH/VL Humanization Design | 4.4 | Checklist expansion — germline validation, 5.2b canonical class, VL BM declaration, IEDB status, L2 rationale |
| 2026-02-18 | VH/VL Humanization Design | 4.3 | Initial creation — structure-based semi-auto workflow |
| 2026-01-03 | VHH Humanization Design | 1.0 | Initial creation - Fixed Tier system |
| 2025-12-10 | CURSOR_REPORT_ENGINE | 3.0 | Report structure standard |

---

## ✅ **Status: ACTIVE**

All standards listed in this index are **ACTIVE** and **MANDATORY** for their respective project types.

**Compliance is non-negotiable.**















