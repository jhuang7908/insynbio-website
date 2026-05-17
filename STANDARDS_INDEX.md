# Project Standards Index

**Last Updated:** 2026-04-01  
**Status:** OFFICIAL DOCUMENTATION

---

## 📚 **Core Standards**

### 0. **EpiDesignCore — pMHC-TCR Peptide Antigen Design Standard** ⭐ NEW — V1.0
**File:** [`EPIDESIGNCORE_STANDARD_V1.0.md`](./EPIDESIGNCORE_STANDARD_V1.0.md)  
**Purpose:** FIXED RULES for HLA class-I peptide antigen de novo design — AfDesign / BindCraft / HADDOCK3 / MHCflurry  
**Applies to:** All TCR-epitope / pMHC peptide design projects  
**Status:** **MANDATORY — DO NOT DEVIATE**  
**⚠️ PARALLEL SYSTEM to AbEngineCore — separate tools, separate standards**

**Key Components (V1.0):**
- ✅ **5-Phase Workflow:** Target definition → AfDesign generation → HLA validation → TCR assessment → Structural verification
- ✅ **Three Design Modes:** Mode A (HLA-only), Mode B (ternary complex), Mode C (sequential)
- ✅ **HLA Anchor Rules:** 6 alleles with P2/Pn anchor constraints; default HLA-A\*02:01
- ✅ **Gate System (Gate 2-5):** AF2 pLDDT ≥ 70, MHCflurry Rank < 0.5%, MM/GBSA ΔG < -6 kcal/mol
- ✅ **Reference PDB Library:** 6 curated TCR:pMHC ternary complex structures
- ✅ **Tool Chain:** ColabDesign/BindCraft → MHCflurry → NetTCR → HADDOCK3 → OpenMM

---

### 0b. **De Novo CDR Design & Patent Escape Standard** ⭐ CURRENT — V5.0
**File:** [`DE_NOVO_CDR_DESIGN_STANDARD.md`](./DE_NOVO_CDR_DESIGN_STANDARD.md)
**Purpose:** FIXED RULES for automated CDR redesign and patent escape — ProteinMPNN sequence generation, multi-gate filtering, EvoEF2 interface clash detection, conditional ImmuneBuilder/HADDOCK3, adaptive pipeline routing
**Applies to:** All De Novo CDR design projects (VHH, VH/VL; single-CDR or multi-CDR)
**Status:** **MANDATORY — V5.0** (based on VGRW-SR-R2 HER2 VHH benchmark)

**Key Components (V5.0):**
- ✅ **Three-Question Framework:** Q1 (ImmuneBuilder: can it fold?) → Q2 (EvoEF2: do sidechains fit at the interface?) → Q3 (HADDOCK3/MM-GBSA: is the binding mode correct?)
- ✅ **T0.0 PTM Gate:** Mandatory first filter — dedup + chemical liability check (<1s, 73% kill rate)
- ✅ **T1.5 EvoEF2 Clash Gate:** Van der Waals overlap detection in antigen context (~2s/seq, always-on)
- ✅ **Adaptive Routing Engine (§9):** Auto-determines tool chain from `mask_strategy.json` — 5 scenarios from single-CDR2 (~60 min) to full multi-CDR (~24 h)
- ✅ **Conditional ImmuneBuilder/AbLang:** Skip for single non-CDR3 CDR ≤10 mutations; mandatory for CDR3/multi-CDR/framework changes
- ✅ **HADDOCK3 Integration Rules:** Mandatory for CDR3 redesign (backbone unpredictable); WSL local execution
- ✅ **V2 Pipeline Runner:** `run_all_v2.py` with full checkpoint/resume (Ctrl+C safe)
- ✅ **PRODIGY Deprecated:** Replaced by OpenMM MM/GBSA in 15-parameter evaluation

**Configuration:** [`../config/denovo_pipeline_settings.json`](../config/denovo_pipeline_settings.json)
**Modules:** `core/evaluation/fast_clash_check.py`, `core/evaluation/sequence_liability_qc.py`

---

### 0c. **Virtual Affinity Maturation Standard** ⭐ CURRENT — V1.0
**File:** [`VIRTUAL_AFFINITY_MATURATION_STANDARD.md`](./VIRTUAL_AFFINITY_MATURATION_STANDARD.md)  
**Purpose:** FIXED RULES for computational antibody / receptor–ligand affinity maturation — EvoEF2 / PRODIGY / MM-GBSA / ThermoMPNN / AntiFold / ESM-IF1 / HADDOCK3  
**Applies to:** All virtual affinity maturation projects (VH/VL, VHH, short-peptide antigen, protein antigen)  
**Status:** **ACTIVE — V1.0** (based on PAG1 benchmark)

**Key Components (V1.0):**
- ✅ **Three Scenario System:** A (short peptide ≤30 aa), B (protein antigen VH/VL), C (VHH nanobody)
- ✅ **6-Phase Workflow:** Scenario classification → Alanine scan → Full AA screen → Stability/sequence filter → MM/GBSA refinement → AF2 validation → Delivery
- ✅ **Tool Tier System:** Tier-1 (EvoEF2, PRODIGY — fast screen), Tier-2 (ThermoMPNN, AntiFold — stability/sequence veto), Tier-3 (OpenMM MM/GBSA — physics-based)
- ✅ **Multi-structure Consensus:** ≥2 structures × ≥2 tools agree → high confidence
- ✅ **HADDOCK3 Refinement:** Mandatory for short-peptide scenarios; AF2 → HADDOCK3 → ΔΔG pipeline
- ✅ **Unified Python API:** `core/structure/affinity_energy_toolkit.py` — 6 tools, one interface
- ✅ **CLI:** `scripts/affinity_energy_cli.py`
- ✅ **PAG1 Benchmark:** 36-mutation × 6-tool empirical validation

**Reference Data:** [`docs/Affinity_Energy_Tools_Guide.md`](./Affinity_Energy_Tools_Guide.md) | [`projects/PAG-1 project/mutation_scan_results/`](../projects/PAG-1%20project/mutation_scan_results/)

---

### 1. **VH/VL Antibody Humanization Design Standard** ⭐ CURRENT — V4.4
**File:** [`VH_VL_HUMANIZATION_STANDARD_V4.4.md`](./VH_VL_HUMANIZATION_STANDARD_V4.4.md)（Checklist ）  
**Full narrative:** [`VH_VL_HUMANIZATION_STANDARD_V4.3.md`](./VH_VL_HUMANIZATION_STANDARD_V4.3.md)  
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

### 1b. **VH → VHH Conversion Standard** ⭐ CURRENT — V1.8.17
**File:** [`VH_TO_VHH_CONVERSION_STANDARD_V1.8.md`](./VH_TO_VHH_CONVERSION_STANDARD_V1.8.md)  
**Purpose:** FIXED RULES for converting conventional VH to single-domain VHH — Hallmark/Stealth engineering, AbNatiV Δ gating, sdAb adaptation, Expressibility Verdict Gate, Smart-CMC Integration, VL-safety SASA gate (V1.8.16 lineage), Stealth tier net_basic/pI routing (V1.8.17)  
**Applies to:** Path C1 (human VH) and Path C2 (murine VH dual engineering)  
**Status:** **MANDATORY — V1.8.17** (SSOT/registry aligned 2026-05-17; standard header dated 2026-05-16)

**Console / public API deployment branch:** **`V1.8.17.IGHV3`** — same V1.8.17 algorithm standard with **IGHV3-family-only** pre-flight on `POST /vh_to_vhh/*` (see `api/routers/vh_to_vhh.py`). Offline or alternate entry points may run V1.8.17 without that gateway restriction.

**Key Components (V1.8.17):**
- ✅ **AbNatiV Δ Gate:** $\Delta < -0.074$ triggers FAIL; ensures global sequence naturalness (unchanged from V1.8.4).
- ✅ **Phase 2 Hallmark (simplified):** K45R is the sole default hallmark (86% in cohort); K44E/K47F are rescue-only (CDR3≥15 AND compactness>6.5 Å).
- ✅ **Phase 3 Stealth:** Kabat K-gated positions retained; **V1.8.17** adds net_basic/pI-conditional Stealth tiering (NONE/MINIMAL/STANDARD/FULL) per standard § revisions (CD3 Fv structural audit lineage).
- ✅ **[V1.8.16] VL-safety SASA gate:** Structure-measured SASA on hallmark zone after engineering (aa-type-aware; threshold in standard §1a.2).
- ✅ **Phase 4.5 sdAb Adaptation:** L18S disabled; F68Y only if K68=F; Adaptive pI-tune (K73Q fallback); Path C2 CDR Cys-Gate (C100AS).
- ✅ **Phase 5 pI Regulation:** Target pI 5.5–8.5 (unchanged).
- ✅ **Expressibility Verdict Gate:** CDR3 length + compactness + AbNatiV Δ composite gate; FAIL → sequence not publishable as deliverable.
- ✅ **Smart-CMC Integration (V1.8.8 lineage):** Aggregation-motif lookahead and CDR-driven hydrophobic patch detection for converted sequences.

**Configuration:** [`../config/abenginecore_registry.json`](../config/abenginecore_registry.json) (`vh_to_vhh_conversion_path_b2_c`, `release_id` **V1.8.17_VH_to_VHH_Conversion**); SSOT [`../config/standards_ssot.json`](../config/standards_ssot.json)

---

### 2. **Report Generation Standard** ⭐ CURRENT — V4.1
**File:** [`CURSOR_REPORT_ENGINE_V4_1_SPEC.md`](./CURSOR_REPORT_ENGINE_V4_1_SPEC.md)  
**Legacy:** [`CURSOR_REPORT_ENGINE_V3.md`](./CURSOR_REPORT_ENGINE_V3.md)  
**Purpose:** Defines report structure, content requirements, and output formats for all antibody engineering deliverables  
**Applies to:** All reports (VHH, VH/VL humanization, bispecific CMC, VAM, CAR design)  
**Status:** MANDATORY

**Key Requirements (V4.1):**
- Dual report system (Client  + Developer )
- 13 mandatory chapters for humanization reports
- Tier-based mutation classification (Tier 0–3)
- Three final sequences (Seq1=T1, Seq2=T1+T2, Seq3=T1+T3)
- Complete CMC, immunogenicity, developability analysis
- Known issue fixes: target extraction, FR4 identity, immunogenicity N/A handling

---

### 2b. **Unified Report Visual & Rendering Standard** ⭐ CURRENT — V1.1
**Module:** [`core/reporting/`](../core/reporting/)  
**Purpose:** Single source of truth for all InSynBio report visual styles, metadata contracts, naming conventions, and rendering pipelines  
**Applies to:** All project reports (PDF, HTML, Markdown) — humanization, CMC, VAM, CAR design, etc.  
**Status:** **MANDATORY — all new reports must use this framework**

**Architecture:**
- `core/reporting/spec.py` — Report metadata contract (`ReportSpec` v1.1): id, project, family, audience, version, date, confidentiality; **per-family `CHAPTER_SKELETONS`; `chapter_schema`; `validate_content` for BioChatter integration**
- `core/reporting/theme.py` — Visual token singleton (`THEME`): colors, fonts, spacing, page chrome constants
- `core/reporting/theme_reportlab.py` — ReportLab style adapter (`RL`): ParagraphStyles, TableStyles, page header/footer, cover page
- `core/reporting/render.py` — Unified rendering API: `render_pdf`, `render_html`, `write_report_bundle`
- `scripts/report_cli.py` — CLI entry point: `python scripts/report_cli.py pdf|html|bundle <input.md>`

**Key Visual Tokens (single source — `theme.py`):**
- Primary: `#1F3864` (navy) / `#2E5496` (blue) — headings, table headers
- Table: `#EEF2F9` alt rows, `#BBBBBB` grid, `#AAAAAA` horizontal rules
- Font: Microsoft YaHei (`msyh.ttc` / `msyhbd.ttc`), fallback Helvetica
- Page: 2.2cm LR margins, 2.3cm top, em-dash page numbers (`— n —`)

**Naming Convention:** `{project_id}_{family}_{audience}_v{n}.md|pdf|html`

**Chapter Schema Coverage (spec.py v1.1):**

| ReportFamily | Total Chapters | Required |
|---|---|---|
| vhvl_humanization | 16 | 15 |
| vhh_humanization | 13 | 12 |
| vhh_cmc | 9 | 8 |
| bispecific_cmc | 9 | 8 |
| vam | 13 | 11 |
| car_design | 11 | 9 |
| structure_run | 8 | 7 |

**BioChatter Integration (spec.py v1.1):**
```python
spec = ReportSpec("ISB-001", "my_project", ReportFamily.VAM)
chapters = spec.chapter_schema(required_only=True)      # ordered chapter list
missing  = spec.validate_content(content_dict)           # list missing fields
```

**Drift Prevention:** `scripts/audit_report_generators.py` — scans for hardcoded color/font/table definitions outside the shared framework

**Migrated Scripts:**
- `projects/mumab4d5_VGRW_SR_R2/generate_report_pdf.py` ✅
- `projects/malaria_CAR_M/generate_report_pdf.py` ✅
- `scripts/md_to_pdf.py` ✅ (reads THEME tokens when available)

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

### 4. **Bispecific VHH CMC Assessment Standard** ⭐ NEW — V1.0
**File:** [`BISPECIFIC_VHH_CMC_STANDARD.md`](./BISPECIFIC_VHH_CMC_STANDARD.md)  
**Purpose:** FIXED RULES for in silico CMC developability assessment of dual-VHH bispecific antibody constructs (VHH-linker-VHH)  
**Applies to:** All bispecific VHH CMC projects  
**Status:** **MANDATORY — DO NOT DEVIATE**  
**⚠️ Parallel to VHH Humanization Standard — shares VHH CMC engine (`core.cmc.vhh_cmc_engine`)**

**Key Components (V1.0):**
- ✅ **4-Phase Workflow:** Individual VHH CMC → ADI scoring → Fusion pI matrix → SmartLink™ recommendation
- ✅ **15-Metric Panel:** pI, GRAVY, instability, net charge, hydro/charge patch, SAP, agg motifs, hydro clusters, 5 chemical liabilities
- ✅ **14-Gate System:** PASS/WARN/FAIL per metric vs VHH42 clinical thresholds
- ✅ **Flag-Discrete ADI:** PASS=100/WARN=50/FAIL=0 × 4-category weights — identical to `run_vhh_cmc_eval`
- ✅ **VHH42 Reference:** n=42 clinical/humanized VHHs; percentile bands p5–p95
- ✅ **free_cys Filtering:** Conserved VHH disulfide {21, 94} excluded from count
- ✅ **ER Expression Model:** Fusion pI vs ER lumen pH 7.2; PASS <8.5 / WARN 8.5–9.0 / CRITICAL >9.0
- ✅ **SmartLink™ Linker Panel:** 7 default linkers including charged variants (G4S)3+2/3/4E, EAAAK3
- ✅ **CLI:** `scripts/run_bispecific_vhh_cmc.py` v2.0.0

**Module:** `core/cmc/bispecific_cmc_engine.py` → imports `core/cmc/vhh_cmc_engine.py`  
**CLI:** `scripts/run_bispecific_vhh_cmc.py`

---

### 4b. **Numbering Systems**
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

**：**  **ANARCI**。。

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

### **For Virtual Affinity Maturation Projects (e.g., PAG1):**

1. **Read the standard:** [`VIRTUAL_AFFINITY_MATURATION_STANDARD.md`](./VIRTUAL_AFFINITY_MATURATION_STANDARD.md)
2. **Classify scenario:** Antigen length → A/B, Antibody type → B/C
3. **Prepare structure:** AF2-Multimer (+ HADDOCK3 refinement for scenario A)
4. **Run Phase 1–2:** EvoEF2 Ala-scan + full-AA screen via `AffinityEnergyToolkit`
5. **Run Phase 3:** ThermoMPNN + AntiFold stability/sequence veto
6. **Run Phase 4:** MM/GBSA on top candidates × multiple structures
7. **Run Phase 5:** AF2-Multimer re-prediction for final candidates
8. **Deliver Phase 6:** Ranked mutation table (CSV/JSON) + multi-tool HTML report

---

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

### **For Bispecific VHH CMC Projects:**

1. **Read the standard:** [`BISPECIFIC_VHH_CMC_STANDARD.md`](./BISPECIFIC_VHH_CMC_STANDARD.md)
2. **Prepare FASTA files:** One multi-entry FASTA per arm (or inline sequences)
3. **Run Panel mode:**
   ```bash
   python scripts/run_bispecific_vhh_cmc.py \
       --panel-a armA.fasta --panel-b armB.fasta \
       --outdir ./results/project_name
   ```
4. **Review Phase 1:** Per-arm 15-metric table — address any FAIL flags before proceeding
5. **Review Phase 3:** Fusion pI matrix — identify PASS combinations (fusion pI < 8.5)
6. **Select recommendation:** Primary = lowest fusion pI among PASS; record Runner-up
7. **Generate report:** JSON + Markdown auto-generated; anonymize for client delivery

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

### **MUST DO (Bispecific VHH CMC):**
- ✅ Use `core.cmc.vhh_cmc_engine` for per-arm assessment (no reimplementation)
- ✅ Apply VHH42 reference database (n=42); use flag-discrete ADI
- ✅ Filter `free_cys` for conserved disulfide positions {21, 94}
- ✅ Include SAP_score in metrics
- ✅ Run fusion pI matrix with ≥ 5 linker variants
- ✅ Report primary + runner-up SmartLink™ recommendation

### **MUST NOT DO (Bispecific VHH CMC):**
- ❌ Use tent-function ADI or AbRef-458 reference for VHH assessment
- ❌ Report `free_cys` without conserved Cys filtering
- ❌ Use a single linker — always run the full linker panel
- ❌ Disclose client sequences or specific variant IDs in public reports

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

Before submitting any affinity maturation design, verify:

- [ ] Standard document reviewed: `VIRTUAL_AFFINITY_MATURATION_STANDARD.md`
- [ ] Scenario classified (A / B / C)
- [ ] Structure quality gate passed (ipTM > 0.6, pLDDT > 65)
- [ ] Scenario A: HADDOCK3 refinement completed
- [ ] EvoEF2 + MM/GBSA on ≥ 2 structures
- [ ] ThermoMPNN stability veto applied (ΔΔG > +0.5 → excluded)
- [ ] Multi-structure consensus rule applied
- [ ] Final candidates validated by AF2 re-prediction
- [ ] Report generated (HTML + CSV/JSON)

Before submitting any bispecific VHH CMC report, verify:

- [ ] Standard document reviewed: `BISPECIFIC_VHH_CMC_STANDARD.md`
- [ ] Both arms evaluated: 15 metrics × PASS/WARN/FAIL per arm
- [ ] ADI: flag-discrete, VHH42 reference, SAP_score included
- [ ] free_cys filtered for conserved Cys {21, 94}
- [ ] Fusion pI matrix: ≥ 5 linkers, all arm combinations
- [ ] ER expression flag applied (threshold pI > 8.5)
- [ ] Primary + runner-up recommendation recorded
- [ ] JSON + Markdown reports generated and reviewed
- [ ] Client report anonymized (no sequences, no variant IDs)

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

## 📊 **Confirmed-70 therapeutic panel — downstream-analysis readiness**

**Purpose:** Single reproducible cohort (ADA-verified ∩ TheraSAbDab, human / humanised only) for sequence–germline–structure–ADA statistics, benchmarking, and pipeline QA.

**Readiness statement:** The panel is treated as **fit for downstream computational analysis** when the checks below pass. This is **not** a claim that every structure is experimental or that germline calls are clinically genotyped; it is a claim of **internal completeness, traceable sources, and consistent tooling**.

| Gate | Expectation | Audit |
|------|-------------|--------|
| Cohort lock | 70 INNs from `confirmed_ada.json` ∩ Thera genetics filter | `scripts/analyze_70_human_humanized_germline_ada.py` |
| Field completeness | Thera match, Target, phase, conditions, heavy (+ bispec) sequence for all 70 | `scripts/_report_confirmed70_completeness.py` |
| Sequences (extended) | Per-arm + atlas fallbacks in `confirmed70_sequences_full.csv` | `scripts/build_confirmed70_sequences_full.py` |
| IMGT numbering + FR split | ANARCI rows for every chain (incl. bispecific arm2, Ozoralizumab arm3 ALB8) | `data/thera_sabdab/out/anarcii_numbering_70.csv`; `scripts/run_anarcii_numbering_70.py`; `scripts/append_ozoralizumab_vh3_anarcii.py` |
| Germline | 842 INN where available; else IMGT `aa_translated` on Thera sequence; OGRDB columns from ANARCI FR match; naive-blood **V-gene population priors** (κ/λ-weighted VL) | `confirmed70_human_humanized_germline_ada.csv`; `data/germlines/population_usage/`; `core/resources/germline_population_usage.py` |
| Structure path | Every drug has a resolved relative PDB path | `confirmed70_structure_atlas_supplement.csv`; `scripts/supplement_confirmed70_atlas_structures.py` |
| Germline ↔ ADA (exploratory) | Analysis snapshot + Spearman / Kruskal summaries | `data/thera_sabdab/out/germline_ada_panel/`; `scripts/build_germline_ada_correlation_library.py` |

**Known design facts (not defects):** One drug (Ozoralizumab) has no classical light chain; VH+VL germline columns are intentionally N/A for VL. Structure files mix **experimental PDB**, **atlas/engineered PDB**, and **predicted** models (e.g. ESMFold, ImmuneBuilder wholes); always stratify or filter by `atlas_structure_source` when interpreting structure-derived features.

**Ozoralizumab ALB8:** Full third VHH sequence and primary experimental structure reference **PDB 8Z8V** (PMID 39083975), aligned with `OZORALIZUMAB_ALB8_VHH_AA` in `scripts/build_confirmed70_sequences_full.py`.

---

## 🛡️ **Governance & Evolution**

**Governance:** [`ABENGINECORE_GOVERNANCE.md`](./ABENGINECORE_GOVERNANCE.md) v1.1.0  
**Evolution Log:** [`EVOLUTION_LOG.md`](./EVOLUTION_LOG.md) (APPEND-ONLY)

### File Classification

|  | Agent  |  |
|------|-----------|------|
| 🔒 LOCKED |  | Standards, configs, governance, core scripts |
| 📝 APPEND-ONLY |  | `EVOLUTION_LOG.md` |
| ⚙️ TUNABLE |  | ,  |
| 🔧 PROJECT |  | `projects/`, `delivery_*/`, `output/` |

### Evolution Protocol

1. **OBSERVE** → Agent  `EVOLUTION_LOG.md`  `[OBSERVATION]`（，）
2. **PROPOSE** → Agent  `EVOLUTION_LOG.md`  `[PROPOSAL]`
3. **APPROVE** → （"//"）
4. **EXECUTE** → Agent  +  + CHANGELOG

---

## 📞 **Support**

**Questions about standards:**
- Review the specific standard document first
- Check configuration files for exact definitions
- Refer to literature references in standard docs

**Requesting changes:**
- Follow the Evolution Protocol (observe → propose → await approval → execute)
- Provide scientific justification
- Cite literature support

---

## 📅 **Version History**

| Date | Standard | Version | Changes |
|------|----------|---------|---------|
| 2026-04-03 | De Novo CDR Design | 5.0 | Three-Question tool framework (§2), T1.5 EvoEF2 Clash gate (§4.4/§5.5), multi-CDR/CDR3 extended pipeline (§7), adaptive routing engine (§9), HADDOCK3 integration rules (§7.4), checkpoint/resume runner, `fast_clash_check.py` module |
| 2026-04-03 | De Novo CDR Design | 4.0 | T0.0 PTM mandatory gate, conditional ImmuneBuilder/AbLang, V2 MPNN sampling, root position philosophy, PRODIGY deprecated |
| 2026-04-02 | Unified Report Visual Standard | 1.1 | spec.py v1.1: per-family CHAPTER_SKELETONS (8 families × ordered ChapterEntry), chapter_schema, validate_content for BioChatter; CURSOR_REPORT_ENGINE V4.1 promoted to docs/ as primary Report Generation Standard |
| 2026-04-02 | Unified Report Visual Standard | 1.0 | Initial creation — `core/reporting/` framework: spec.py (metadata contract), theme.py (visual tokens), theme_reportlab.py (RL adapter), render.py (API), report_cli.py (CLI); migrated VAM + CAR-M + md_to_pdf; audit script |
| 2026-04-01 | Bispecific VHH CMC | 1.0 | Initial creation — 4-phase workflow, VHH42 ref, 14-gate system, flag-discrete ADI, SmartLink™ linker panel, ER expression model; `core/cmc/bispecific_cmc_engine.py` + `vhh_cmc_engine.py` |
| 2026-04-01 | STANDARDS_INDEX | — | Confirmed-70: downstream-analysis gates + germline–ADA exploratory library (`germline_ada_panel/`) |
| 2026-04-01 | AbEngineCore Governance | 1.1.0 | Evolution protocol (§-B), file classification, EVOLUTION_LOG.md, VAM + EpiDesign locked files |
| 2026-04-01 | Virtual Affinity Maturation | 1.0 | Initial creation — 3-scenario VAM workflow, 6-tool chain, PAG1 benchmark, HADDOCK3 pipeline |
| 2026-04-01 | EpiDesignCore | 1.0 | Initial creation — pMHC-TCR peptide antigen design system (parallel to AbEngineCore) |
| 2026-02-18 | VH/VL Humanization Design | 4.4 | Checklist expansion — germline validation, 5.2b canonical class, VL BM declaration, IEDB status, L2 rationale |
| 2026-02-18 | VH/VL Humanization Design | 4.3 | Initial creation — structure-based semi-auto workflow |
| 2026-01-03 | VHH Humanization Design | 1.0 | Initial creation - Fixed Tier system |
| 2026-04-02 | CURSOR_REPORT_ENGINE | 4.1 | Promoted to docs/ as primary standard; V3 retained as legacy |
| 2025-12-10 | CURSOR_REPORT_ENGINE | 3.0 | Report structure standard |

---

## ✅ **Status: ACTIVE**

All standards listed in this index are **ACTIVE** and **MANDATORY** for their respective project types.

**Compliance is non-negotiable.**







