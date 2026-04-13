# InSynBio Pitch Deck — Presenter Script (English)
**Version: April 2026 | Target: ~20 min presentation + 10–15 min Q&A**

> **Notes for presenter**
> - Suggested timing is shown per slide.
> - `[REPORT NOTE]` marks data from the linked case study reports on the website — not visible in the PPT — that should be explained verbally.
> - Italicized transitions are optional and can be adapted to the room.

---

## Slide 01 — Cover (30 sec)

Thank you for having me. My name is Jing Huang, founder of InSynBio.

What we do in one sentence: **We combine real clinical data with AI to help biopharmaceutical teams know whether a molecule is worth developing — and where the risks are — before they ever run an experiment.**

I'll take about 20 minutes to walk you through the problem we solve, how we solve it, and the real cases we've already delivered.

---

## Slide 02 — Founder & Vision (1.5 min)

A bit of background. I completed my Ph.D. and then built research experience at Columbia University, Rockefeller University, and Albert Einstein College of Medicine — all focused on the intersection of protein structure and immunology.

What I kept seeing was the same gap: powerful AI models coming out every year, but no systematic way to anchor them to real clinical data. Teams were either buying AI tools that required a whole bioinformatics team to interpret, or spending months in the wet lab before realizing a molecule was never going to be developable.

Our mission from day one: **don't build another generic AI scoring tool. Build a decision-support system where ML models — AlphaFold, diffusion, language models — are grounded in real clinical wet-lab databases, and deliver actionable outputs, not black-box numbers.**

---

## Slide 02.5 — Next-Gen Modalities (1.5 min)

We're not just for traditional monoclonal antibodies.

The leading modalities in biologics today are bispecifics, ADCs, CAR-T, mRNA vaccines — each with its own design challenges. InSynBio has dedicated assessment and design modules for all six modality types:

- **mAbs & VHH nanobodies** — humanization and stability optimization;
- **Bispecifics** — solving chain-pairing mismatches, optimizing geometric control;
- **ADCs** — DAR optimization and structure-aware linker-payload compatibility;
- **CAR-T / CAR-M** — modular signal architecture screening from a 237-component binder library;
- **mRNA vaccines** — rational multi-epitope antigen scaffold design;
- **AI evaluation framework** — end-to-end design validation and CMC risk flagging.

We provide a **decision architecture** — not random screening, but logic-driven design.

---

## Slide 03 — Three Core Pain Points (2 min)

In the conversations we have every week with research teams, three problems come up again and again:

**First: "Humanization killed our affinity."**

This is the most common one. The root cause is that framework substitution disrupts the CDR spatial conformation. Our approach: structural deviation analysis combined with VH-VL golden-pair screening — predicting which positions carry risk before any substitution is made, so CDR binding is 100% retained.

**Second: "We don't know if this molecule is developable."**

An AI score doesn't tell you where the IND risk is. Our approach: 15 parameters benchmarked item-by-item against 1,142 clinical or marketed drugs — telling you what passes, what's at risk, and how to fix it.

**Third: "ADC and CAR design feels like guesswork."**

Complex modalities rely on empirical screening: slow, expensive, and hard to de-risk. Our approach: target biology logic plus clinical database benchmarking — evidence-based recommendations, not random iteration.

---

## Slide 04 — You Receive a Report, Not a Software License (2 min)

I want to be direct about where we sit relative to alternatives.

Buying AI software means you still need a bioinformatics engineer, an expert to interpret outputs, and time to integrate everything. The result: a lot of numbers, and no clear next step.

Pure wet-lab screening means weeks per cycle, repeated failures, and potentially nine months before you realize the molecule is undevelopable.

**Our model: submit your sequence, and in 3–5 business days you receive a structured report you can act on.**

Every report contains:
1. A per-item risk checklist — what passes, what needs attention, how to fix it;
2. Candidate molecule ranking with percentile comparison against 1,142 marketed drugs;
3. Actionable recommendations — specific mutation sites, substitution strategies, experimental priorities.

Every report carries immunology and AI expert backing. You can take it directly into internal decision-making — no need to translate algorithm outputs yourself.

---

## Slide 05 — Data Moat (2 min)

Our assessments have meaning because they're grounded in real data.

This isn't algorithmic guesswork — we maintain:

| Dataset | Scale |
|---|---|
| Clinical antibody sequences | 1,142 |
| Engineered antibody reference library | 458 |
| **Real clinical ADA immunogenicity records** | **138** (exceptionally rare) |
| Clinical ADC projects | 100 |
| CAR design component library | 237 |
| Clinical germline database | 842 entries |
| Bispecific CMC benchmarks | 134+ |
| MHC I/II epitope records | 109 |
| Clinical VHH reference molecules | 42 |
| Fc engineering clinical records | 21 |

The 138 clinical ADA records are our most critical competitive barrier. This type of data is extraordinarily scarce — pharma companies don't voluntarily publish ADA data, and it requires extensive manual extraction from regulatory filings and literature.

---

## Slide 06 — AbEngineCore: The 8-Series Tool Matrix (1.5 min)

Behind this data is our integrated 8-category tool stack:

- **Structure prediction**: AlphaFold2, ABodyBuilder2
- **Molecular docking**: HADDOCK3, AF2-Multimer
- **Generative design**: ProteinMPNN, ESM-IF1, RFdiffusion
- **Stability & affinity**: ThermoMPNN, MM/GBSA, PRODIGY
- **Immunogenicity**: IEDB API (27 HLA-DR alleles)
- **Sequence annotation**: ANARCI (Kabat / IMGT numbering)
- **Biological fitness**: AntiFold, ESM-2
- **Vaccine design suite**: neoantigen scanning, multi-epitope assembly, codon optimization

These tools don't run in isolation. They operate within a unified decision framework that generates a consensus output for each molecule.

---

## Slide 07 — CMC Developability Assessment (2 min)

Before a molecule goes into the lab, we evaluate it across 15 parameters in 4 dimensions:

1. **Primary sequence features** (5 parameters): isoelectric point pI, GRAVY hydrophobicity, instability index, net charge, SAP aggregation score.
2. **TAP industry guidelines** (4 parameters): CDR length, PSH hydrophobic patch, PPC/PNC charge patches, SFvCSP asymmetry.
3. **Structural risk** (3 parameters): VH-VL packing angle consistency, contact map analysis, Vernier zone SASA exposure.
4. **Chemical liability hotspots** (3 parameters): deamidation sites (NG/NS), oxidation sites (M/W/H), isomerization sites (DG/DS) — full-sequence scan.

This is summarized into the **IDI composite score**, with percentile ranking against 1,142 marketed drugs.

You don't need to interpret every parameter — you just see the score and percentile, and you know exactly where this molecule stands relative to the drugs that actually made it to market.

---

## Slide 08 — ADA Immunogenicity (2 min)

ADA is one of the hardest risks to predict in the industry. We are candid about this: **no tool can guarantee zero immunogenicity.**

What we can do:

- **Sequence dimension**: MHC-II 27-allele T-cell epitope scanning, risk site clustering, Parker hydrophilicity filtering;
- **Structure + germline dimension**: Historical ADA rate comparison for matched germline families, surface immunogenicity SASA, germline tolerance validation;
- **Clinical validation**: Based on 138 real clinical antibody ADA datasets — multi-parameter comparison to identify critical causatives.

Our commitment: with the most comprehensive clinical data supply chain available, we aim to minimize relative risk to the lowest achievable level in the industry.

---

## Slide 09 — Standardized Engineering Pipeline (1.5 min)

Our analysis follows a standardized 7-step SOP:

**Sequence Analysis → Humanization → Structure & Epitope → Affinity VAM → CMC Check → Clinical Benchmarking → Report Delivery**

Each stage has defined standards and exit criteria. Three core modules:

- **Intelligent Humanization**: ML-driven framework selection with structural back-mutation — CDR binding 100% retained;
- **Virtual Affinity Maturation (VAM)**: 6-tool ΔΔG consensus validation — rapid, high-confidence binder optimization;
- **CDR Core Redesign**: ProteinMPNN-driven novel topology generation — bypasses patent constraints, maximizes sequence diversity.

---

## Slide 10 — Excellence Gallery I (3 min)

Let me walk through some real cases. Each has a full report on our website — I'll give you the key numbers here.

### Section I: Commercial Engagements

**① Bispecific VHH Expression Optimization**
A client submitted a bispecific VHH with suboptimal expression. We identified two issues: pI too high causing aggregation tendency, and linker geometry creating steric interference. After pI adjustment from 8.2 to 6.8 and a GS-8 linker redesign, **expression increased 4.8-fold**. This directly impacts CMC manufacturing cost and timeline.

[REPORT NOTE: Full sequence engineering path, linker screening logic, and stability data at `case_bispecific_vhh_expression_optimization.html`]

**② Small-Molecule Hapten Virtual Affinity Maturation (Fentanyl)**
A fentanyl detection antibody that didn't meet the commercial assay affinity threshold. Using our 6-tool ΔΔG consensus framework, we performed targeted CDR scanning. **Final ΔΔG = −5.53 kcal/mol**, clearing the commercial detection kit design requirement.

[REPORT NOTE: Full mutation matrix, per-tool outputs, and consensus filtering logic at `case_fentanyl_hapten_vam.html`]

**③ PD-L1 High-Resolution Epitope Map**
Two candidate anti-PD-L1 antibodies. We reconstructed both antigen-antibody complex structures and used PRODIGY scoring to precisely compare their binding modes: Ab1 scored −10.8 kcal/mol, Ab2 scored −7.3 kcal/mol. We also mapped the steric blocking domain, giving the client structural evidence for their differentiation positioning.

[REPORT NOTE: Epitope heatmap and competitive binding analysis at `case_pdl1_epitope_analysis.html`]

---

### Section II: Proof-of-Concept Validation

**④ Humanization SOP Validation (muMAb4D5)**
Full-pipeline humanization of trastuzumab precursor muMAb4D5. Used 842-entry germline database for optimal framework selection, with structural back-mutation achieving 100% binding retention.

**⑤ CMC 15-Parameter Benchmarking (muMAb4D5)**
Same molecule, full CMC evaluation. 15 parameters fully benchmarked against clinical assets. IDI composite score: **77/100** — top quartile among historical marketed antibodies.

**⑥ Affinity VAM — Malaria CAR-M Design**
Used the InSynBio 237-Binder library to screen signal module architecture for anti-CIDRα1 dual-binder CAR-M, validating a multi-target signaling model design through modular assembly.

**⑦ CDR Core Redesign**
ProteinMPNN-driven novel scaffold generation — maintained target recognition while bypassing patent constraints with an entirely new CDR topology.

---

## Slide 11 — Excellence Gallery II (2.5 min)

### Section III: Intelligent Drug Design Systems

**ADC Decision Engine: CLDN18.2 (Gastric Cancer)**
CLDN18.2 presents a specific design challenge: moderate-to-slow internalization and low shedding. Our ADC design engine analyzed this target's biological characteristics and systematically evaluated linker type, payload selection, and DAR range — delivering a complete decision path from target analysis to design space optimization.

[REPORT NOTE: Full target analysis matrix, linker-payload compatibility matrix, 100 clinical ADC benchmarks at `InSynBio_ADC_Design_Page.html`]

**CAR-T Modality Architect**
Modular signal architecture screening from the InSynBio 237-Binder library, with CAR persistence in solid tumor microenvironments as the core design objective.

[REPORT NOTE: Full case with anti-CIDRα1 malaria model at `case_malaria_carm_design.html`]

**Vaccine Design Suite: KRAS G12D Neoantigen mRNA**
KRAS G12D is the most important mutation target in solid tumors, but its immunogenicity as an MHC class I epitope has always been a challenge. We developed a multi-allele neoantigen scanning pipeline, multi-epitope scaffold assembly, and codon optimization — delivering a mRNA multi-epitope vaccine design.

[REPORT NOTE: Epitope screening matrix, 109 MHC core record validation, mRNA structural design at `vaccine_design.html`]

---

### Section IV: Research Frontier (Active)

**De Novo Protein Drug Design**: RFdiffusion + ProteinMPNN + AlphaFold2 in coordination — exploring novel binding sequence space independent of existing scaffolds. Active R&D, open to collaborative exploration.

**TCR-Restricted Epitope Immunopotentiation**: pMHC epitope TCR recognition binding energy optimization, multi-HLA coverage strategy to enhance T-cell immune response. Also open to collaboration.

---

## Slide 12 — Partnership Model (1.5 min)

Getting started is simple. Two engagement modes:

**Per-Project Engagement:**
1. Sign NDA — sequences submitted securely;
2. 3–5 business days: structured analysis report delivered;
3. Report walkthrough call to align on next experimental steps;
4. 50% fee rebate for academic publication.

**Ongoing Advisory:**
Continuous pipeline support, real-time analysis of new candidates, participation in internal R&D meetings, fully confidential — no sequence retention after project close. Scope can be adjusted by project stage.

---

## Slide 13 — Closing (30 sec)

If you have a molecule, **send it over.**

One email with a sequence — we'll provide a preliminary assessment at no charge, with no obligation.

📧 contact@insynbio.com
🌐 www.insynbio.com

Thank you.

---
---

# Q&A Prep Sheet (English)

> High-frequency questions in five categories with suggested responses.

---

## I. Technical Credibility

**Q1: What's the accuracy rate of your AI predictions?**

A: We deliberately don't give a single "accuracy rate" number — that would be misleading. Different tools have different performance envelopes: ThermoMPNN achieves Pearson r of ~0.65–0.70 for thermal stability prediction; PRODIGY has an error of roughly ±1.5 kcal/mol for complex ΔG. Our core value isn't "prediction accuracy" in isolation — it's **multi-tool consensus plus clinical benchmarking to filter out clearly problematic molecules and shorten experimental cycles.** That's where we reduce risk.

---

**Q2: Where does your 138-record ADA database come from?**

A: We built it ourselves by extracting and normalizing data from published clinical literature, FDA briefing documents, EMA assessment reports, and peer-reviewed publications — record by record. Each entry has source citation and evidence tier annotation. It's rare because pharma companies don't voluntarily disclose ADA data; it requires systematic manual extraction and curation over time.

---

**Q3: You're using AlphaFold and other public tools. What's your differentiation?**

A: The tools are public; the differentiation is three layers:
1. **Clinical anchoring**: we compare AlphaFold structural predictions against the structural profiles of real approved drugs — not just the predicted value in isolation;
2. **Multi-tool consensus logic**: a single tool's output is a reference; we use 6-tool consensus to make decisions, dramatically reducing false positives;
3. **Expert immunology interpretation**: AlphaFold gives you a structure; we give you drug engineering recommendations based on that structure — which a pure algorithm cannot do.

---

## II. Case Study Details

**Q4: The 4.8x expression improvement in the bispecific VHH — what expression system was this?**

A: Measured in HEK293 transient expression. The two main contributors were the pI adjustment (8.2 → 6.8) reducing aggregation tendency in the ER, and replacing a GS-4 linker with GS-8 to reduce inter-chain steric interference. CHO stable line validation data can be discussed further in a follow-up meeting.

**Q5: Which positions were mutated in the fentanyl antibody?**

A: Core mutations were at two hydrophobic contact positions in CDR-H3 and one affinity hotspot in CDR-L1. The full mutation matrix is in the report at `case_fentanyl_hapten_vam.html` — I'd rather not read through it now because it gets quite technical quickly.

**Q6: For the PD-L1 case, PRODIGY scored −10.8 and −7.3. Which antibody is better?**

A: From a binding energy perspective, −10.8 is stronger — but that doesn't automatically make it the better candidate. Our report also compared epitope coverage, competitive binding relative to atezolizumab, and CMC risk profiles for both. The recommendation was to evaluate all of those dimensions together, not just binding energy alone.

---

## III. Business Model

**Q7: How is pricing structured?**

A: Per-project pricing varies by scope and depth — from a basic CMC screening to a full humanization + VAM + ADA assessment package. The range is roughly low thousands to low tens of thousands of dollars. Pricing is customized based on molecule type, assessment depth, and turnaround requirement. Ongoing advisory engagements are structured as monthly retainers or milestone-based.

---

**Q8: Is 3–5 business days guaranteed? What if we have an urgent deadline?**

A: We have an expedited track that can compress basic assessment to 48–72 hours with prior notice. Complex modalities like bispecifics or ADCs with full structural docking are harder to compress, because the computation itself takes time. We'll always be upfront if a timeline isn't feasible.

---

**Q9: How is data confidentiality maintained?**

A: NDA first. Service agreement explicitly defines the confidentiality scope for sequences and data. Reports are generated in an isolated compute environment. Client sequences are not retained after project close. We can execute additional IP protection agreements if required.

---

## IV. Platform Boundaries

**Q10: Do you run wet-lab experiments?**

A: No. We are purely computational and decision-support. Our reports are tools for your experimental team — directing their priorities and de-risking their next steps. That's exactly why we can deliver in 3–5 days.

---

**Q11: Can you predict in vivo results?**

A: We are very careful not to promise this. In vivo outcomes are driven by PK, tissue distribution, immune microenvironment, and dozens of variables we can't model reliably. What we can do is minimize computable risks at the computational level — improving the probability that a molecule entering the lab has already had its most obvious failure modes identified. We don't guarantee in vivo outcomes.

---

**Q12: Which species do you support?**

A: Human, mouse, rabbit, and camelid VHH are fully supported, across Kabat / IMGT / Chothia numbering schemes. Canine and other species are assessed on a case-by-case basis.

---

## V. Company Stage

**Q13: How many clients do you have?**

A: We're in early commercial stage, with delivered projects spanning commercial client engagements and PoC collaborations. Specific client information is under NDA, but we can share redacted case reports as reference material.

---

**Q14: Who are your competitors?**

A: Two categories of direct competition:
1. **General AI platforms** (e.g., Schrödinger, Benchling AI modules): they provide tools, not reports. They target large companies with in-house bioinformatics teams — not research teams that need fast, actionable decisions;
2. **CRO/computational service firms**: turnaround is typically weeks to months, and they don't offer standardized clinical benchmarking databases.

Our differentiation: **standardized clinical benchmarking + fast delivery + actionable reports** — all three simultaneously.

---

*— End of Document —*
