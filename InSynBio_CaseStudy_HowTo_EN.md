# Case Study Presentation Guide (English)
**For use with InSynBio Pitch Deck — Slides 11–12**
**Version: April 2026**

---

> **How to use this guide**
> Each case study in the PPT is a small card with a hyperlink — the audience cannot see the report details.
> This guide helps you deliver each case clearly using a 3-step structure: **Problem → What we did → Key result**.
> Each case includes: a ready-to-speak script, key numbers to cite, fallback answers for follow-up questions, and how to direct the audience to the live report.

---

## General Delivery Principles

**Keep each case to 60–90 seconds** (unless the audience asks to go deeper).

Delivery rhythm:
```
① One sentence for context  ("A client had a…")
② One sentence for the problem  ("The issue was…")
③ One sentence for our approach  ("We used…")
④ One or two numbers for the result  ("The outcome was…")
⑤ Direct to the report  ("The full data is on our website…")
```

**When to open the live report:** If the audience wants to go deeper, open it on the spot. The reports are interactive HTML — more intuitive than PDFs — and demonstrating them is itself a proof of delivery capability.

---

## Case 1: Bispecific VHH Expression Optimization
**Link:** `case_bispecific_vhh_expression_optimization.html`
**PPT location:** Slide 11, Commercial Engagement ①

### Script (60 sec)

> The first case is a bispecific VHH expression optimization engagement.
>
> **Background:** This was a dual-specificity nanobody targeting two coronavirus strains, connected via a GS linker. The neutralization activity was strong, but secreted expression yield in yeast (*Pichia pastoris*) was very low — directly impacting manufacturing cost.
>
> **Root cause:** Our analysis found the fusion protein's isoelectric point was too high at **8.94**. The ER of *Pichia* is around pH 7.2, and a high-pI protein carries positive charge in that environment, causing it to be retained in the ER and degraded via ERAD — it simply couldn't be secreted.
>
> **What we did:** We rescreened the VHH arm combination and added a glutamic acid (Glu) residue at the linker C-terminus for charge compensation. The fusion pI dropped from 8.94 to **7.85**, and net charge at pH 7 dropped from +5.0 to +1.0.
>
> **Result:** Expression increased **4.8-fold**, with activity fully maintained — the optimized molecule hit IC90 below **0.025 µg/mL** across four coronavirus strains, compared to 0.119 µg/mL before.
>
> The full engineering path and the pI matrix across linker candidates are in the online case report.

### Key Numbers at a Glance
| Metric | Before | After |
|---|---|---|
| Fusion protein pI | 8.94 | 7.85 |
| Net charge @pH 7 | +5.0 | +1.0 |
| Cross-CoV IC90 | 0.119 µg/mL | 0.025 µg/mL |
| Expression improvement | baseline | **4.8×** |

### If they ask follow-up questions…

**Q: Why not switch expression systems?**
A: Switching systems is expensive and slow, and this client had a well-established *Pichia* process. Our goal was to solve the problem within their existing infrastructure, not replace it.

**Q: What conditions was the 4.8× measured under?**
A: Initial shake-flask small-scale fermentation data. The engineering solution was delivered; fed-batch validation is the client's next step, and we clearly documented that in the report.

---

## Case 2: Fentanyl Hapten Virtual Affinity Maturation
**Link:** `case_fentanyl_hapten_vam.html`
**PPT location:** Slide 11, Commercial Engagement ②

### Script (60 sec)

> The second case is an affinity optimization for a fentanyl detection antibody.
>
> **Background:** Fentanyl is a small-molecule hapten — only 337 Da. The contact area between a hapten and an antibody is minimal, making affinity maturation genuinely hard. Traditional approaches require extensive synthesis and screening cycles.
>
> **What we did:** We used our 6-tool ΔΔG consensus framework. We started with AutoDock Vina docking to identify 19 contact residues (13 in the CDRs), ran an alanine scan to find hotspots, performed saturation mutagenesis at 9 hotspot positions, evaluated 100+ candidate variants, scored them with EvoEF2, and filtered against CMC developability.
>
> **Key result:** The top combination mutation — **H:W107I + L:N116E** — achieved a ΔΔG of **−5.53 kcal/mol**, with a synergy bonus: the two individual mutations would predict −4.95 by simple addition, but together they deliver −5.53 — 0.58 kcal/mol beyond additive. All 5 finalists passed CMC screening. The full computational funnel ran in under 72 hours.
>
> The complete mutation matrix and per-tool outputs are in the online report.

### Key Numbers at a Glance
| Metric | Value |
|---|---|
| Top mutation combination | H:W107I + L:N116E |
| ΔΔG (EvoEF2) | **−5.53 kcal/mol** |
| Synergy bonus | +0.58 kcal/mol beyond additive |
| CMC pass rate | **5/5** |
| Computational turnaround | ~72 hours |
| Variants evaluated | 100+ |

### If they ask follow-up questions…

**Q: What does −5.53 kcal/mol translate to in actual affinity improvement?**
A: EvoEF2 ΔΔG can't be directly converted to Kd because of systematic tool error. We use these numbers for relative ranking — this molecule is the top computational priority. Actual affinity validation needs SPR or BLI, targeting Kd < 1 nM.

**Q: Do all 6 tools agree on this combination?**
A: That's exactly why we use a multi-tool consensus. Individual tools produce false positives. We only advance mutations that show improvement consistently across multiple tools — this combination met that bar.

---

## Case 3: PD-L1 Dual-Clone Epitope Mapping
**Link:** `case_pdl1_epitope_analysis.html`
**PPT location:** Slide 11, Commercial Engagement ③

### Script (90 sec)

> The third case is a PD-L1 epitope mapping study — slightly more complex, but the conclusion is very direct.
>
> **Background:** A client had two anti-PD-L1 candidate antibodies. Both bound the target, but they behaved differently in PD-1 blockade assays. They needed to understand: where is the difference structurally, and which pipeline suits each?
>
> **What we did:** We used AF2-Multimer to build complex structures for both antibodies against human and cynomolgus PD-L1, then performed interface analysis — counting hydrogen bonds, salt bridges, hydrophobic contacts, and buried surface area.
>
> **Key finding:** Both antibodies bind PD-L1, but at completely different angles.
>
> **Ab1** contacts the lateral face of PD-L1 — buried surface area **1,941 Å²**, 32 hydrogen bonds — but its epitope does not overlap the PD-1 contact core, so **it does not block PD-1 binding**. That makes it an ADC candidate: effective target internalization, payload delivery is feasible.
>
> **Ab2** engages the frontal IgV domain — 20 H-bonds, but 5 salt bridges and 11 hydrophobic contacts, with heavy overlap with atezolizumab's epitope. **It blocks PD-1** — an ICI candidate.
>
> PRODIGY binding energies: Ab1 at **−10.8 kcal/mol**, Ab2 at **−7.3 kcal/mol**.
>
> One analysis, two differentiated development paths. We're not saying one molecule is better — they're suited for different strategies.

### Key Numbers at a Glance
| Metric | Ab1 | Ab2 |
|---|---|---|
| Binding mode | Lateral (IgC region) | Frontal (IgV core) |
| Buried surface area | **1,941 Å²** | 1,795 Å² |
| Hydrogen bonds | **32** | 20 |
| Salt bridges | 2 | **5** |
| Hydrophobic contacts | 6 | **11** |
| PRODIGY ΔG | **−10.8 kcal/mol** | −7.3 kcal/mol |
| PD-1 blockade | **No** | **Yes** |
| **Recommended path** | **ADC** | **ICI** |

### If they ask follow-up questions…

**Q: Are there clinical precedents for non-blocking PD-L1 antibodies in ADCs?**
A: Yes. Non-blocking antibodies don't interfere with the PD-1/PD-L1 axis and can actually reduce target shedding risk, which improves ADC internalization efficiency. Whether this progresses to the clinic requires cell internalization data (flow MFI) and cytotoxicity assays.

**Q: Is the cynomolgus PD-L1 epitope conserved?**
A: The report includes a human vs. cynomolgus PD-L1 epitope comparison — the core epitope is conserved, supporting NHP selection for toxicology studies.

---

## Case 4: muMAb4D5 Humanization Validation
**Link:** `case_mumab4d5_humanization_en.html`
**PPT location:** Slide 11, PoC Validation ④

### Script (60 sec)

> This case is a public validation of our humanization SOP — the target molecule is muMAb4D5, the murine parent of Herceptin (trastuzumab).
>
> Why this molecule? Because the final product exists (Herceptin), so we can verify whether our pipeline reproduces a known successful outcome.
>
> **What we did:** We used our 842-entry germline database to select the optimal frameworks — **IGHV1-46*01** (210 clinical uses) and **IGKV4-1*01** (97 uses). VH framework humanization: 97.5%; VL: 86.7%. Combined with ABodyBuilder2 structural validation, the result was **zero back-mutations** and 100% CDR retention.
>
> **Structural validation:** VH/VL packing angle shifted only **0.026°** (threshold <3°). Max CDR Cα-RMSD was 1.312 Å at H2 (threshold <1.5 Å). All gates pass.
>
> This demonstrates our SOP is reproducible on a benchmark molecule — giving clients a concrete external reference point.

### Key Numbers at a Glance
| Metric | Value |
|---|---|
| VH framework humanization | 97.5% |
| VL framework humanization | 86.7% |
| Back-mutations required | **0** |
| VH/VL packing angle shift | **0.026°** (threshold <3°) |
| Max CDR Cα-RMSD | **1.312 Å** at H2 (threshold <1.5 Å) |
| Germline database size | 842 entries |

---

## Case 5: muMAb4D5 CMC 15-Parameter Benchmarking
**Link:** `case_mumab4d5_cmc.html`
**PPT location:** Slide 11, PoC Validation ⑤

### Script (45 sec)

> This is the CMC developability assessment for the same molecule.
>
> All 15 parameters pass. **IDI composite score: 77/100** — Herceptin itself scores 81, so the gap is only 4 points.
>
> The analysis flagged one deamidation risk: VH FR3 position 84 is Asn (N84), forming an NG motif with the downstream Gly — a high-risk deamidation site. We recommended a single **N84Q** point mutation. After the mutation, structural QA showed Fv RMSD of only 0.28 Å and CDR-H3 RMSD of 0.42 Å — binding should be unaffected.
>
> TCIA immunogenicity score improved to 0.61 versus Herceptin's 0.65 (lower is better), with high-risk epitopes reduced from 26 to 21.

### Key Numbers at a Glance
| Metric | muMAb4D5 (optimized) | Herceptin |
|---|---|---|
| **IDI composite score** | **77/100** | 81/100 |
| TCIA immunogenicity | **0.61** | 0.65 |
| High-risk epitopes | **21** | 26 |
| Deamidation sites | 1 (after fix) | 2 |
| Key mutation | **N84Q** | — |
| Post-mutation Fv RMSD | **0.28 Å** | — |

---

## Case 6: Anti-Malaria CAR-Macrophage Design
**Link:** `case_malaria_carm_design.html`
**PPT location:** Slide 11, PoC ⑥ / Slide 12, Intelligent Design — CAR-T

### Script (90 sec)

> This case demonstrates our CAR design platform applied to an unusually difficult target — malaria.
>
> **Background and problem:** High-parasitemia falciparum malaria (>10% infected red blood cells) kills over 600,000 people per year. The core challenge: infected red blood cells are anucleate — no MHC molecules — so T cells can't recognize them. Conventional CAR-T completely fails here. Artemisinin drugs also have a 24–48 hour onset lag, and the disease progresses fast.
>
> **Target selection:** Using the ACTES decision engine, we screened 5 candidate antigens and selected **CIDRα1** — a domain of PfEMP1 — because it mediates cytoadherence of infected red blood cells to cerebral vascular endothelium, which is the direct mechanism of cerebral malaria.
>
> **Design:** We used a tandem dual-binder with **C7 + C74** scFvs, covering all 6/6 known CIDRα1 subclasses. The effector cell is a macrophage (CAR-M) — because phagocytosis is the right mechanism for clearing anucleate target cells. The intracellular signaling domain is **FcRγ**, not CD3ζ, because FcRγ is the macrophage's native phagocytic signal.
>
> **Delivery:** mRNA-LNP for transient expression — no genomic integration. The proposed timing is: half-dose artesunate 1.2 mg/kg → CAR-M delivery 4–8 hours later → full-dose artesunate 2.4 mg/kg at 12 hours. CAR-M clears the high-density infected RBC bolus; artesunate handles residual parasites.

### Key Numbers at a Glance
| Design element | Choice | Rationale |
|---|---|---|
| Target antigen | **CIDRα1** | 6/6 subclass coverage; cerebral adhesion mechanism |
| Dual-binder scFvs | **C7 + C74** | Limits escape (var gene switching ~60 total) |
| Effector cell | **CAR-M (macrophage)** | Phagocytosis of anucleate targets |
| Signaling domain | **FcRγ** | Native macrophage phagocytic signal |
| Delivery | **mRNA-LNP** | Transient expression, no genomic integration |
| Construct length | **638 aa** | |

### If they ask follow-up questions…

**Q: Won't CIDRα1 escape via var gene switching?**
A: The var gene switching rate is roughly 0.03–2% per generation. With C7+C74 covering all 6 known subclasses, escape would require simultaneous change at both binding sites — statistically very unlikely. Also, CIDRα1 is structurally required for cerebral adhesion; functional mutations incur a fitness cost. That said, animal model data would be needed for final validation.

**Q: Is this a real client project or a PoC?**
A: This is a PoC application of our ACTES design platform. Malaria was chosen deliberately because it's a notoriously hard design problem — the design reasoning and decision logic are fully documented, which is what we want to show.

---

## Case 7: CDR Core Redesign + Affinity Re-Maturation (HER2 VHH)
**Link:** `case_vgrw_cdr_redesign_remat.html`
**PPT location:** Slide 11, PoC Validation ⑦

### Script (90 sec)

> The last PoC case involves a two-step engineering challenge that comes up fairly often in practice.
>
> **Background:** This is a HER2-targeting VHH nanobody series called VGRW. The parental molecule had a Kd of **0.89 nM**. We had previously improved it to **0.54 nM** via virtual affinity maturation (SR-R2, G49A+F112L).
>
> **The problem:** To avoid patent overlap, the CDR2 and CDR3 sequences needed to be diversified — we generated a new scaffold with ProteinMPNN (WT-0838). 55% of CDR2+3 residues changed. Sequence diversity achieved. But affinity dropped from 0.54 nM to **49.75 nM** — nearly 100-fold worse. This is exactly the "CDR redesign killed our affinity" scenario.
>
> **The solution:** Rather than abandoning the redesigned molecule, we used it as a new starting point for affinity re-maturation. Our strategy was polar-priority directed re-maturation — reintroducing key polar contact residues while preserving the CDR2/3 diversity. The final combination, **G49A + K112L + W55R + L64K** (Super Combo), brought Kd from 49.75 nM back to **3.75 nM** — a 13-fold recovery — while maintaining enough CDR sequence diversity to clear the original patent.

### Key Numbers at a Glance
| Version | Kd |
|---|---|
| Parental VGRW | 0.89 nM |
| SR-R2 (after VAM) | **0.54 nM** |
| WT-0838 (after CDR redesign, not optimized) | **49.75 nM** (~100× drop) |
| Super Combo (after re-maturation) | **3.75 nM** (~13× recovery) |
| Final MM/GBSA | −50.72 kcal/mol (vs SR-R2 −63.75) |

### If they ask follow-up questions…

**Q: 3.75 nM is still weaker than SR-R2 at 0.54 nM. Why not just keep optimizing SR-R2?**
A: The objective was different. SR-R2's CDR2/3 sequence is too close to the original patent — that's a legal risk. WT-0838 achieved the necessary sequence diversity but sacrificed affinity. Super Combo recovers functional affinity while maintaining CDR diversity. If SPR validation shows 3.75 nM isn't sufficient, there's room for further optimization — but it's now outside the patent scope.

---

## Case 8: CLDN18.2 ADC Intelligent Design (Gastric Cancer)
**Link:** `InSynBio_ADC_Design_Page.html`
**PPT location:** Slide 12, Intelligent Design — ADC

### Script (90 sec)

> Our ADC design platform is backed by **100 clinical ADC programs** — 12 approved, 88 in development — covering 78 antigens, 32 payloads, and 22 linker types. We use this database for one thing: making evidence-based design choices driven by target biology, not intuition.
>
> **Take CLDN18.2 gastric cancer as an example.** CLDN18.2 is a key target in gastric and pancreatic cancer, but it presents a design challenge: moderate-to-slow internalization (ke ≈ 0.12–0.18 h⁻¹) and low target shedding.
>
> What does that mean for design?
>
> — MMAE (LogP 3.2) is highly hydrophobic. At higher DAR, it causes aggregation (HMW peak), and slow internalization means slow release;
> — DXd (LogP 1.3) has better aqueous solubility and stronger bystander effect — better for heterogeneous tumor expression;
> — SN-38 (LogP −0.37) has the best permeability (Papp ~15×10⁻⁶ cm/s vs MMAE's 8×10⁻⁶) and strongest bystander killing, ideal for low or heterogeneous target expression.
>
> **Our recommendation for CLDN18.2:** cleavable linker (CL2A) + SN-38, DAR **2.0** via site-specific Cys conjugation, avoiding high-DAR aggregation risk. This is fundamentally different from the random high-DAR approach — and it's backed by 100 clinical program data points.

### Key Numbers at a Glance
| Element | Recommendation | Rationale |
|---|---|---|
| Payload | **SN-38** | Papp 15 > MMAE 8; strong bystander effect |
| LogP comparison | MMAE **3.2** / DXd **1.3** / SN-38 **−0.37** | Aqueous solubility gradient |
| Linker | **Cleavable CL2A** | Matched to moderate-slow internalization |
| DAR | **2.0** (site-specific) | Avoids high-DAR aggregation |
| Clinical database | **100 programs, 78 antigens, 32 payloads** | |

---

## Case 9: KRAS G12D Neoantigen mRNA Vaccine Design
**Link:** `vaccine_design.html`
**PPT location:** Slide 12, Intelligent Design — Vaccine

### Script (90 sec)

> KRAS G12D is one of the most prevalent driver mutations in solid tumors — found in pancreatic cancer, colorectal cancer, lung cancer. But it's a genuinely hard immunotherapy target: the mutant peptides display widely variable MHC class I presentation efficiency depending on HLA type, so not all patients can mount a meaningful T-cell response.
>
> **What we did:** We used MHCflurry 2.2 to scan 9-mer and 10-mer peptides spanning the G12D mutation, covering the 5 highest-frequency HLA alleles for Asian and global populations — **A\*02:01, A\*24:02, B\*40:01, A\*11:01, B\*07:02** — for a total of 190 predictions (38 peptides × 5 alleles).
>
> **Key numbers:** The top-priority epitope reached an IC50 of **47.0 nM**; all selected epitopes fell below **110 nM** — strong predicted MHC I binding. The top Presentation Score was **0.910**.
>
> **Final construct:** Prioritized epitopes were assembled in tandem with a PADRE helper T-cell epitope, AAY/GPGPG linkers, tPA signal peptide, and LAMP1-MITD targeting sequence. The final mRNA multi-epitope vaccine construct: **212 amino acids, 639 nt CDS**, **Codon Adaptation Index (CAI) = 0.976** — near-optimal for mammalian expression. Predicted population coverage: ~**70% in Asian populations**, ~**65% globally**.
>
> This is a complete design from epitope scanning to synthesis-ready output.

### Key Numbers at a Glance
| Metric | Value |
|---|---|
| Peptides evaluated | 38 (9-mer/10-mer) |
| HLA alleles covered | **5** (A\*02:01, A\*24:02, B\*40:01, A\*11:01, B\*07:02) |
| Top IC50 | **47.0 nM** |
| Top Presentation Score | **0.910** |
| Construct size | **212 aa / 639 nt** |
| **Codon Adaptation Index (CAI)** | **0.976** |
| Asian population coverage | **~70%** |

### If they ask follow-up questions…

**Q: KRAS G12D already has AMG 510 (sotorasib) — does a vaccine still make sense?**
A: AMG 510 is a covalent inhibitor targeting **G12C**, not G12D. G12D is actually the more clinically aggressive variant and currently has no approved small-molecule inhibitor. An mRNA vaccine operates through an immunological mechanism entirely orthogonal to small-molecule inhibition — it can be used as a combination approach.

---

## Quick Reference Card (Keep handy during the presentation)

| Case | Core message in one sentence | Strongest number |
|---|---|---|
| Bispecific VHH | pI engineering solved ER retention | **4.8× expression** |
| Fentanyl VAM | 6-tool consensus matured a hapten antibody | **ΔΔG −5.53 kcal/mol** |
| PD-L1 epitope | Same target, two molecules, two pipeline paths | **PRODIGY −10.8 vs −7.3** |
| muMAb4D5 humanization | 842-entry germline database, zero back-mutations | **0 back-mutations** |
| muMAb4D5 CMC | 15/15 parameters pass, comparable to Herceptin | **IDI 77/100** |
| Malaria CAR-M | Phagocytosis mechanism, 6/6 subclass coverage | **Full subclass coverage + mRNA-LNP** |
| CDR redesign | Rebuilt CDR topology, recovered affinity, cleared patent | **Kd 49.75 → 3.75 nM** |
| CLDN18.2 ADC | Target biology drives payload and linker choice | **100-program database** |
| KRAS G12D vaccine | Epitope scan to synthesis-ready construct | **CAI 0.976, ~70% Asian coverage** |

---

## How to Direct the Audience to Live Reports

**If time allows — open the report on the spot:**
> "Let me pull that up right now — seeing the actual report is more direct than my description, and this is also what we actually deliver."

**If time is tight — leave the link:**
> "The full data and methodology are on our website case pages — I'll send you the direct link."

**For a technical audience:**
> "The report has the complete mutation matrix, structural overlays, and per-tool comparison. The methodology section is fully open — nothing is hidden."

**For a business/BD audience:**
> "You don't need to read the algorithm details. The report is written for decision-making — focus on the Risk Rating and Recommended Next Steps sections."

---

*— End of Document —*
