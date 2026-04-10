
// Security: Anti-copy, Anti-right-click, Anti-print
(function() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('copy', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'p' || e.key === 's' || e.key === 'u')) {
      e.preventDefault();
    }
  });
})();

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════

// Fc engineering entries: 21 (fc1–fc18 plus fc13b / fc13c / fc14b)
const ADC_CLINICAL_DATA = [
{id:'adcprogt1001', cat:'HER2', name:'Trastuzumab deruxtecan (Enhertu)', alias:'Daiichi Sankyo / AstraZeneca | HER2', brief:'Breast cancer (HER2+, HER2-low), Gastric cancer, NSCLC', examples:["DXd", "GGFG (Tetrapeptide)"], mechanism:'Gold standard for high-DAR (8.0) strategy. Hydrophilic GGFG linker prevents aggregation. DXd payload is cell-cycle independent and highly membrane-permeable, enabling potent bystander effect in HER2-low tumors. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 60.9% (DESTINY-Breast03) | PFS: 28.8 mo<br>• Grade 3+ AE: 40-50% | Common: Nausea, Neutropenia, ILD (10-15%)<br>• ADA: 2.1%<br>• Dose: 5.4 mg/kg (Q3W)', receptors:'Target: HER2 (DAR: 8.0)', tradeoffs:'Payload: DXd (Topoisomerase I inhibitor) | Linker: GGFG (Tetrapeptide)', ref:'<span>PMID: 28554950</span> · <span>Patents: US8039469, US10519246</span>', tier:'T1'},
{id:'adcprogt1002', cat:'CD30', name:'Brentuximab vedotin (Adcetris)', alias:'Seagen (Pfizer) / Takeda | CD30', brief:'Hodgkin lymphoma, sALCL', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'Benchmark for vc-PABC-MMAE platform. DAR 4.0 stochastic conjugation. Highly effective in CD30+ hematological malignancies due to rapid internalization. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 75% (HL) | PFS: 42.9 mo (ECHELON-1)<br>• Grade 3+ AE: Moderate | Common: Peripheral Neuropathy, Neutropenia, Anemia<br>• ADA: 37% (transient)<br>• Dose: 1.8 mg/kg (Q3W)', receptors:'Target: CD30 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin inhibitor) | Linker: mc-val-cit-PABC', ref:'<span>PMID: 21135266</span> · <span>Patents: US7090843, US7829531</span>', tier:'T1'},
{id:'adcprogt1003', cat:'HER2', name:'Trastuzumab emtansine (Kadcyla)', alias:'Roche (Genentech) | HER2', brief:'HER2+ Breast cancer (Post-neoadjuvant)', examples:["DM1", "SMCC"], mechanism:'First-generation non-cleavable linker ADC. Relies on complete lysosomal degradation of antibody. DM1-lysine metabolite is active but lacks bystander effect, limiting efficacy in heterogeneous tumors. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 3.5)', tradeoffs:'Payload: DM1 (Tubulin inhibitor (Maytansinoid)) | Linker: SMCC', ref:'<span>PMID: 22713502</span> · <span>Patents: US5208020, US7097840</span>', tier:'T1'},
{id:'adcprogt1004', cat:'CD33', name:'Gemtuzumab ozogamicin (Mylotarg)', alias:'Pfizer (Wyeth) | CD33', brief:'AML', examples:["Calicheamicin", "AcBut"], mechanism:'First FDA-approved ADC (2000). Uses pH-sensitive hydrazone linker. IgG4 framework used to minimize Fc effector function. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD33 (DAR: 2.5)', tradeoffs:'Payload: Calicheamicin (DNA-damaging agent) | Linker: AcBut', ref:'<span>PMID: 11060331</span> · <span>Patents: US5773001, US5821337</span>', tier:'T1'},
{id:'adcprogt1005', cat:'TROP-2', name:'Sacituzumab govitecan (Trodelvy)', alias:'Gilead (Immunomedics) | TROP-2', brief:'mTNBC, HR+/HER2- Breast cancer, mUC', examples:["SN-38", "CL2A"], mechanism:'High-DAR (7.6) with pH-sensitive CL2A linker. Rapid release of SN-38 in acidic endosomes and tumor microenvironment. High bystander effect compensates for TROP-2 heterogeneity. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: TROP-2 (DAR: 7.6)', tradeoffs:'Payload: SN-38 (Topoisomerase I inhibitor) | Linker: CL2A', ref:'<span>PMID: 32320577</span> · <span>Patents: US7238785, US9220789</span>', tier:'T1'},
{id:'adcprogt1006', cat:'Nectin-4', name:'Enfortumab vedotin (Padcev)', alias:'Seagen (Pfizer) / Astellas | Nectin-4', brief:'Urothelial carcinoma', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'Fully human IgG1 (XenoMouse-derived) targeting Nectin-4. Standard vc-PABC-MMAE platform with DAR 3.8. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Nectin-4 (DAR: 3.8)', tradeoffs:'Payload: MMAE (Tubulin inhibitor) | Linker: mc-val-cit-PABC', ref:'<span>PMID: 31103038</span> · <span>Patents: US9393323, US10457732</span>', tier:'T1'},
{id:'adcprogt1007', cat:'CD79b', name:'Polatuzumab vedotin (Polivy)', alias:'Roche (Genentech) | CD79b', brief:'DLBCL', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'Humanized IgG1 targeting CD79b. Benchmark for B-cell lymphoma ADC using vc-PABC-MMAE platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD79b (DAR: 3.5)', tradeoffs:'Payload: MMAE (Tubulin inhibitor) | Linker: mc-val-cit-PABC', ref:'<span>PMID: 31063838</span> · <span>Patents: US8021661, US9107961</span>', tier:'T1'},
{id:'adcprogt1008', cat:'CD19', name:'Loncastuximab tesirine (Zynlonta)', alias:'ADC Therapeutics | CD19', brief:'DLBCL', examples:["SG3199 (PBD dimer)", "PEG-Val-Ala-PABC"], mechanism:'First PBD-dimer ADC approved. Low DAR 2.3 required due to extreme payload potency. Uses PEGylated Val-Ala linker for solubility. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD19 (DAR: 2.3)', tradeoffs:'Payload: SG3199 (PBD dimer) (DNA alkylator) | Linker: PEG-Val-Ala-PABC', ref:'<span>PMID: 33852827</span> · <span>Patents: US8871908, US9597412</span>', tier:'T1'},
{id:'adcprogt1009', cat:'FRα', name:'Mirvetuximab soravtansine (Elahere)', alias:'ImmunoGen (AbbVie) | FRα', brief:'Ovarian cancer (FRα high)', examples:["DM4", "Sulfo-SPDB"], mechanism:'First ADC approved for FRalpha-high ovarian cancer. Uses disulfide-cleavable Sulfo-SPDB linker with DM4 payload. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: FRα (DAR: 3.4)', tradeoffs:'Payload: DM4 (Tubulin inhibitor (Maytansinoid)) | Linker: Sulfo-SPDB', ref:'<span>PMID: 36445704</span> · <span>Patents: US8557966, US9616138</span>', tier:'T1'},
{id:'adcprogt1010', cat:'BCMA', name:'Belantamab mafodotin (Blenrep)', alias:'GSK | BCMA', brief:'Multiple Myeloma', examples:["MMAF", "mc"], mechanism:'Afucosylated IgG1 for enhanced ADCC. Non-cleavable mc-MMAF platform. Associated with ocular toxicity (corneal microcysts). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: BCMA (DAR: 4.0)', tradeoffs:'Payload: MMAF (Tubulin inhibitor) | Linker: mc', ref:'<span>PMID: 32023444</span> · <span>Patents: US9273141, US10118967</span>', tier:'T1'},
{id:'adcprogt1011', cat:'Tissue Factor', name:'Tisotumab vedotin (Tivdak)', alias:'Seagen (Pfizer) / Genmab | Tissue Factor', brief:'Cervical cancer', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'Targets Tissue Factor (TF). Standard vc-PABC-MMAE platform. Key for metastatic cervical cancer. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Tissue Factor (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin inhibitor) | Linker: mc-val-cit-PABC', ref:'<span>PMID: 33831346</span> · <span>Patents: US9168314, US9744243</span>', tier:'T1'},
{id:'adcprogt1012', cat:'HER2', name:'Disitamab vedotin (Aidixi (RC48))', alias:'RemeGen / Pfizer | HER2', brief:'HER2+ Gastric, Urothelial, and Breast Cancer', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'China\'s first approved ADC. High affinity HER2 binder with distinct epitope from Trastuzumab. Standard vc-PABC-MMAE DAR 4. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin inhibitor) | Linker: mc-val-cit-PABC', ref:'<span>NMPA Approval year_2021</span> · <span>Patents: CN102250205B, US10688195</span>', tier:'T1'},
{id:'adcprogt2001', cat:'HER3', name:'Patritumab deruxtecan', alias:'Daiichi Sankyo / Merck (MSD) | HER3', brief:'NSCLC (EGFR mutated)', examples:["DXd", "GGFG"], mechanism:'BLA voluntarily withdrawn (May 2025) after HERTHENA-Lung02 failed to meet OS significance in NSCLC. Remains in development for other HER3+ indications (15+ cancer types). High DAR 8.0 DXd platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 53.5% (HER3+ BC) | PFS: TBD<br>• Grade 3+ AE: Moderate | Common: Fatigue, Nausea, Diarrhea, Alopecia<br>• ADA: Not Reported<br>• Dose: 5.6 mg/kg (Q3W)', receptors:'Target: HER3 (DAR: 8.0)', tradeoffs:'Payload: DXd (Topoisomerase I inhibitor) | Linker: GGFG', ref:'<span>HERTHENA-Lung02, May 2025 BLA Withdrawal</span>', tier:'T2'},
{id:'adcprogt2002', cat:'TROP-2', name:'Datopotamab deruxtecan (Dato-DXd)', alias:'Daiichi Sankyo / AstraZeneca | TROP-2', brief:'EGFR-mutated Locally Advanced or Metastatic NSCLC', examples:["DXd", "GGFG"], mechanism:'Approved (June 2025) for pre-treated NSCLC. Optimized DAR 4.0 strategy (vs 8.0 for Enhertu) to improve safety profile for TROP2. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 30.0% (pooled) | PFS: 5.56 mo<br>• Grade 3+ AE: 20.8% | Common: Stomatitis (55%), Nausea (49%), Alopecia (38%)<br>• ADA: Not Reported<br>• Dose: 6 mg/kg (Q3W)', receptors:'Target: TROP-2 (DAR: 4.0)', tradeoffs:'Payload: DXd (Topoisomerase I inhibitor) | Linker: GGFG', ref:'<span>FDA Approval June 23, 2025</span> · <span>Patents: US10494443, US10519246</span>', tier:'T1'},
{id:'adcprogt2003', cat:'B7-H3', name:'Ifinatamab deruxtecan (I-DXd)', alias:'Daiichi Sankyo / Merck (MSD) | B7-H3', brief:'Extensive-stage SCLC (ES-SCLC), Esophageal cancer', examples:["DXd", "GGFG"], mechanism:'FDA Breakthrough Therapy for SCLC. Targets B7-H3 (CD276). DXd platform with DAR 4.0. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 48.2% (12mg/kg) | PFS: 4.9 mo<br>• Grade 3+ AE: 36.5% | Common: Nausea, Anemia, Neutropenia, ILD (12.4%)<br>• ADA: Not Reported<br>• Dose: 12 mg/kg (Q3W)', receptors:'Target: B7-H3 (DAR: 4.0)', tradeoffs:'Payload: DXd (Topoisomerase I inhibitor) | Linker: GGFG', ref:'<span>PMID: 39186361, NCT05280470</span> · <span>Patents: US10590190, US11278627</span>', tier:'T2'},
{id:'adcprogt2004', cat:'HER2', name:'Bulumtatug fuvedotin (SHR-A1811)', alias:'Hengrui Pharma | HER2', brief:'HER2+ Breast Cancer, Gastric Cancer, HER2-low BC', examples:["SHR152852 (TOP1i)", "GGFG-like"], mechanism:'Hengrui\'s flagship HER2 ADC. High DAR 8 Topo1i platform. Competing with Enhertu in HER2-low BC and Gastric cancer. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 66.7% (TNBC combo) | PFS: 86.2% (6-mo rate)<br>• Grade 3+ AE: 61.9% | Common: Neutropenia, WBC decrease, Lymphocyte decrease<br>• ADA: Not Reported<br>• Dose: 4.8 mg/kg (Q3W)', receptors:'Target: HER2 (DAR: 8.0)', tradeoffs:'Payload: SHR152852 (TOP1i) (N/A) | Linker: GGFG-like', ref:'<span>NCT05825701</span> · <span>Patents: CN111285934, WO2020114421</span>', tier:'T2'},
{id:'adcprogt2005', cat:'TROP-2', name:'Sacituzumab tirumotecan (sac-TMT (SKB264 / MK-2870))', alias:'Kelun-Biotech / MSD | TROP-2', brief:'mTNBC, HR+/HER2– Metastatic Breast Cancer, NSCLC', examples:["KL610023 (TOP1i)", "Sulfonyl-based (K-Link)"], mechanism:'Kelun/Merck collaboration. Highly stable sulfonyl linker (K-Link) with DAR 7.4. Superior PK profile vs Trodelvy in breast cancer. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 45.4% (TNBC) | PFS: 6.7 mo<br>• Grade 3+ AE: High (Hematologic) | Common: Neutropenia, Stomatitis, Anemia, Rash<br>• ADA: Not Reported<br>• Dose: 5 mg/kg (Q2W or Q3W)', receptors:'Target: TROP-2 (DAR: 7.4)', tradeoffs:'Payload: KL610023 (TOP1i) (N/A) | Linker: Sulfonyl-based (K-Link)', ref:'<span>NCT05347135, ESMO 2025</span> · <span>Patents: CN111518113, WO2020156475</span>', tier:'T2'},
{id:'adcprogt2006', cat:'TROP-2', name:'Toripalimab-ADC (JS108)', alias:'Junshi Biosciences | TROP-2', brief:'', examples:["SN-38"], mechanism:'{\'physical_consistency\': \'pass\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: TROP-2 (DAR: 8.0)', tradeoffs:'Payload: SN-38 (N/A) | Linker: N/A', ref:'<span>NCT04601469</span>', tier:'T2'},
{id:'adcprogt2007', cat:'B7-H3', name:'ABBV-155', alias:'AbbVie | B7-H3', brief:'', examples:["Bcl-xL inhibitor"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'First-in-class Bcl-xL ADC; targets B7-H3 to deliver apoptotic payload.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: B7-H3 (DAR: 4.0)', tradeoffs:'Payload: Bcl-xL inhibitor (bcl_xl_inhibitors) | Linker: N/A', ref:'<span>NCT03539628</span>', tier:'T2'},
{id:'adcprogt3001', cat:'CEACAM5', name:'Tusamitamab ravtansine', alias:'Sanofi | CEACAM5', brief:'NSCLC', examples:["DM4", "SPDB"], mechanism:'DM4 payload on CEACAM5. Failed Phase 3 CARMEN-LC03 trial. Modest efficacy benefit compared to docetaxel. CEACAM5 shedding and partial recycling may have limited intracellular payload accumulation. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CEACAM5 (DAR: 3.8)', tradeoffs:'Payload: DM4 (Tubulin inhibitor) | Linker: SPDB', ref:'<span>NCT04154956</span>', tier:'T3'},
{id:'adcprogt2008', cat:'HER2', name:'Trastuzumab duocarmazine (SYD985)', alias:'Byondis | HER2', brief:'HER2+ Breast Cancer', examples:["Duocarmycin", "vc-seco-DUBA"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'DNA alkylator requires low DAR. Ocular toxicity is a known class effect.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 2.8)', tradeoffs:'Payload: Duocarmycin (dna_damaging_agents) | Linker: vc-seco-DUBA', ref:'<span>NCT03262935</span>', tier:'T2'},
{id:'adcprogt2009', cat:'CD25', name:'Camidanlumab tesirine (Cami)', alias:'ADC Therapeutics | CD25', brief:'Hodgkin Lymphoma', examples:["SG3199 (PBD)", "Val-Ala-PABC"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'Targeting Tregs in TME; Guillain-Barre syndrome risk observed.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD25 (DAR: 2.3)', tradeoffs:'Payload: SG3199 (PBD) (dna_damaging_agents) | Linker: Val-Ala-PABC', ref:'<span>NCT04052997</span>', tier:'T2'},
{id:'adcprogt2010', cat:'ROR1', name:'Zilovertamab vedotin (VLS-101)', alias:'Merck (MSD) / VelosBio | ROR1', brief:'MCL, DLBCL', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'Standard Seagen platform applied to ROR1.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: ROR1 (DAR: 4.0)', tradeoffs:'Payload: MMAE (tubulin_inhibitors) | Linker: mc-val-cit-PABC', ref:'<span>NCT03833180</span>', tier:'T2'},
{id:'adcprogt2011', cat:'FRα', name:'Farletuzumab ecteribulin (MORAb-202)', alias:'Eisai / BMS | FRα', brief:'Ovarian Cancer', examples:["Eribulin", "Cathepsin B cleavable"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'Eribulin payload provides bystander effect; differentiated from DM4.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: FRα (DAR: 4.0)', tradeoffs:'Payload: Eribulin (tubulin_inhibitors) | Linker: Cathepsin B cleavable', ref:'<span>NCT04300556</span>', tier:'T2'},
{id:'adcprogt2012', cat:'NaPi2b', name:'Upifitamab rilsodotin (UpRi)', alias:'Mersana | NaPi2b', brief:'Ovarian Cancer', examples:["Auristatin F-HPA", "Dolaflexin"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'High DAR 10 polymer scaffold; bleeding events led to clinical hold.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: NaPi2b (DAR: 10.0)', tradeoffs:'Payload: Auristatin F-HPA (tubulin_inhibitors) | Linker: Dolaflexin', ref:'<span>NCT04315233</span>', tier:'T2'},
{id:'adcprogt2013', cat:'MET', name:'Telisotuzumab vedotin (Teliso-V)', alias:'AbbVie | MET', brief:'NSCLC (c-Met overexpressed), EGFR-wild type', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'Targets c-Met overexpressing NSCLC. Uses standard vc-PABC-MMAE platform. Phase 3 LUMINOSITY ongoing. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: MET (DAR: 3.1)', tradeoffs:'Payload: MMAE (tubulin_inhibitors) | Linker: mc-val-cit-PABC', ref:'<span>NCT03539536</span> · <span>Patents: US9346884, US10124068</span>', tier:'T2'},
{id:'adcprogt2014', cat:'EGFR x HER3', name:'BL-B01D1', alias:'SystImmune / BMS | EGFR x HER3', brief:'NSCLC, Breast Cancer', examples:["Ed-04 (TOP1i)", "Cleavable peptide"], mechanism:'Bispecific EGFRxHER3 ADC. Uses proprietary TOP1i payload Ed-04. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 29.3% (ESCC), 54.6% (NPC) | PFS: 8.38 mo (NPC)<br>• Grade 3+ AE: 63.3% (2.5mg/kg) | Common: Anemia, Leukopenia, Thrombocytopenia, ILD<br>• ADA: Not Reported<br>• Dose: 2.5 mg/kg (D1, D8 Q3W)', receptors:'Target: EGFR x HER3 (DAR: 8.0)', tradeoffs:'Payload: Ed-04 (TOP1i) (topoisomerase_I_inhibitors) | Linker: Cleavable peptide', ref:'<span>NCT05983432</span>', tier:'T2'},
{id:'adcprogt2015', cat:'Claudin18.2', name:'IBI343', alias:'Innovent Biologics | Claudin18.2', brief:'Gastric Cancer, Pancreatic Cancer', examples:["Proprietary TOP1i", "Cleavable peptide (DXd-like)"], mechanism:'High-DAR Topo1i platform. Competing for first-in-class CLDN18.2 ADC approval in China. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 29.0% (CLDN18.2 high) | PFS: 5.5 mo<br>• Grade 3+ AE: Moderate | Common: Myelosuppression, Neutropenia, Febrile neutropenia<br>• ADA: Not Reported<br>• Dose: 6 mg/kg (Q3W)', receptors:'Target: Claudin18.2 (DAR: 8.0)', tradeoffs:'Payload: Proprietary TOP1i (topoisomerase_I_inhibitors) | Linker: Cleavable peptide (DXd-like)', ref:'<span>NCT05458219</span> · <span>Patents: CN113045678, WO2021121303</span>', tier:'T2'},
{id:'adcprogt2016', cat:'Claudin18.2', name:'CMG901 (AZD0901)', alias:'Keymed / AstraZeneca | Claudin18.2', brief:'Gastric Cancer', examples:["MMAE", "mc-val-cit-PABC"], mechanism:'First CLDN18.2 ADC to show clinical signal. Licensed to AstraZeneca for $1.1B. vc-PABC-MMAE platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 35% overall, 48% (2.2mg/kg) | PFS: 4.8 mo<br>• Grade 3+ AE: 55% | Common: Nausea, Anemia, Neutropenia<br>• ADA: Not Reported<br>• Dose: 2.2 - 3.0 mg/kg (Q3W)', receptors:'Target: Claudin18.2 (DAR: 4.0)', tradeoffs:'Payload: MMAE (tubulin_inhibitors) | Linker: mc-val-cit-PABC', ref:'<span>NCT04805307</span> · <span>Patents: CN111004321, US11773177</span>', tier:'T2'},
{id:'adcprogt2017', cat:'HER2', name:'ARX788', alias:'Ambrx / NovoCodex | HER2', brief:'HER2+ Breast Cancer, Gastric Cancer', examples:["AS269 (Tubulin inhibitor)", "Non-cleavable (PEG-AS)"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'Site-specific DAR 2 using pAF; highly stable non-cleavable linker.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 2.0)', tradeoffs:'Payload: AS269 (Tubulin inhibitor) (tubulin_inhibitors) | Linker: Non-cleavable (PEG-AS)', ref:'<span>NCT04829604</span>', tier:'T2'},
{id:'adcprogt3002', cat:'CD166 (ALCAM)', name:'Praluzatamab ravtansine (CX-2009)', alias:'CytomX Therapeutics | CD166 (ALCAM)', brief:'Breast Cancer', examples:["DM4", "SPDB"], mechanism:' <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD166 (ALCAM) (DAR: 3.5)', tradeoffs:'Payload: DM4 (N/A) | Linker: SPDB', ref:'<span>NCT03149549</span>', tier:'T3'},
{id:'adcprogt2018', cat:'HER3', name:'YL201 / BNT326', alias:'MediLink (宜联) / BioNTech | HER3', brief:'NSCLC, Breast Cancer', examples:["TOP1i", "TMALIN"], mechanism:'{\'physical_consistency\': \'pass\', \'logic_check\': \'Utilizes TMALIN platform for TME-specific extracellular cleavage, overcoming low internalization of some targets.\'} <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER3 (DAR: 8.0)', tradeoffs:'Payload: TOP1i (N/A) | Linker: TMALIN', ref:'<span>NCT05653752</span>', tier:'T2'},
{id:'adcprogt2200', cat:'CDH6', name:'Raludotatug deruxtecan (DS-6000)', alias:'Daiichi Sankyo | CDH6', brief:'Platinum-resistant Ovarian Cancer, Peritoneal/Fallopian Tube Cancer', examples:["DXd", "GGFG (Tetrapeptide)"], mechanism:'Phase 2 REJOICE-Ovarian01: 50.0% ORR at 5.6 mg/kg dose. Moving to Phase 3 vs chemotherapy. CDH6-directed ADC with DXd platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 50.0% | PFS: TBD<br>• Grade 3+ AE: Moderate | Common: Nausea, Anemia, Asthenia<br>• ADA: Low<br>• Dose: 5.6 mg/kg (Q3W)', receptors:'Target: CDH6 (DAR: 8.0)', tradeoffs:'Payload: DXd (Topoisomerase I Inhibitor) | Linker: GGFG (Tetrapeptide)', ref:'<span>PMID: 34711587, REJOICE-Ovarian01</span>', tier:'T2'},
{id:'adcprogt2201', cat:'TA-MUC1', name:'DS-3939a (DS-3939)', alias:'Daiichi Sankyo | TA-MUC1', brief:'TA-MUC1-expressing Advanced Solid Tumors', examples:["DXd", "GGFG (Tetrapeptide)"], mechanism:'Targeting MUC1 using the validated DXd platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: TA-MUC1 (DAR: 8.0)', tradeoffs:'Payload: DXd (Topoisomerase I Inhibitor) | Linker: GGFG (Tetrapeptide)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2202', cat:'CLDN18.2', name:'Kelun-Biotech SKB315 (SKB315)', alias:'Kelun-Biotech | CLDN18.2', brief:'CLDN18.2-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link (Cleavable)"], mechanism:'Targets CLDN18.2. Kelun\'s proprietary Topo1i platform (K-Link). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CLDN18.2 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link (Cleavable)', ref:'<span>N/A</span> · <span>Patents: CN113174005, WO2021147926</span>', tier:'T2'},
{id:'adcprogt2203', cat:'Nectin-4', name:'Kelun-Biotech SKB410 (SKB410)', alias:'Kelun-Biotech | Nectin-4', brief:'Nectin-4-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link (Cleavable)"], mechanism:'Targets Nectin-4. Collaboration with MSD (MK-3120). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Nectin-4 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link (Cleavable)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2204', cat:'CLDN18.2', name:'Hengrui SHR-A1904 (SHR-A1904)', alias:'Hengrui | CLDN18.2', brief:'Advanced Gastric or Gastroesophageal Junction (GEJ) Cancer', examples:["Rezetecan (SHR169106)", "mc-Gly-Gly-Phe-Gly (GGFG)"], mechanism:'Targets CLDN18.2. Licensed to Merck KGaA for $1.4B. High DAR Topo1i rezetecan payload. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CLDN18.2 (DAR: 4.0)', tradeoffs:'Payload: Rezetecan (SHR169106) (Topoisomerase I Inhibitor) | Linker: mc-Gly-Gly-Phe-Gly (GGFG)', ref:'<span>Nature Medicine 2025, NCT05043987</span> · <span>Patents: CN113264955, WO2021151441</span>', tier:'T2'},
{id:'adcprogt2205', cat:'CD79b', name:'Hengrui SHR-A1912 (SHR-A1912)', alias:'Hengrui | CD79b', brief:'CD79b-expressing Advanced Solid Tumors', examples:["Topoisomerase I inhibitor", "Cleavable peptide linker"], mechanism:'Targets CD79b for B-NHL. In Phase 3 development in China. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD79b (DAR: 8.0)', tradeoffs:'Payload: Topoisomerase I inhibitor (Topoisomerase I Inhibitor) | Linker: Cleavable peptide linker', ref:'<span>N/A</span> · <span>Patents: CN114014945, WO2022022421</span>', tier:'T2'},
{id:'adcprogt2206', cat:'HER3', name:'Hengrui SHR-A2009 (SHR-A2009)', alias:'Hengrui | HER3', brief:'HER3-expressing Advanced Solid Tumors', examples:["SHR169106 (TOP1i)", "Maleimidocaproyl tetrapeptide (GGFG)"], mechanism:'Targets HER3. Fast Track for NSCLC. Evidence: PMID:36045843. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER3 (DAR: 4)', tradeoffs:'Payload: SHR169106 (TOP1i) (Topoisomerase I Inhibitor) | Linker: Maleimidocaproyl tetrapeptide (GGFG)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2207', cat:'HER2', name:'Lepu Biopharma MRG002 (MRG002)', alias:'Lepu Biopharma | HER2', brief:'HER2-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets HER2. Cleavable vc-PABC linker with MMAE payload. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 3.6)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2208', cat:'EGFR', name:'Lepu Biopharma MRG003 (MRG003)', alias:'Lepu Biopharma | EGFR', brief:'EGFR-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets EGFR. Uses standard vc-PABC MMAE platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: EGFR (DAR: 3.8)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2209', cat:'PSMA', name:'Ambrx ARX517 (ARX517)', alias:'Ambrx | PSMA', brief:'PSMA-expressing Advanced Solid Tumors', examples:["MMAE", "pAcPhe (Unnatural AA)"], mechanism:'Site-specific conjugation using unnatural amino acid (pAcPhe) at position 121 of heavy chain. Precise DAR 2.0. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: PSMA (DAR: 2.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: pAcPhe (Unnatural AA)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2210', cat:'NaPi2b', name:'Mersana XMT-1592 (XMT-1592)', alias:'Mersana | NaPi2b', brief:'NaPi2b-expressing Advanced Solid Tumors', examples:["AF-HPA (Auristatin F-hydroxypropylamide)", "Dolasynthen (Site-specific scaffold)"], mechanism:'Site-specific conjugation using Dolasynthen platform to achieve precise DAR 6. AF-HPA is a proprietary auristatin derivative. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: NaPi2b (DAR: 6.0)', tradeoffs:'Payload: AF-HPA (Auristatin F-hydroxypropylamide) (Tubulin Inhibitor) | Linker: Dolasynthen (Site-specific scaffold)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2211', cat:'B7-H4', name:'Mersana XMT-1660 (XMT-1660)', alias:'Mersana | B7-H4', brief:'B7-H4-expressing Advanced Solid Tumors', examples:["AF-HPA", "Dolasynthen"], mechanism:'Targets B7-H4. Uses Dolasynthen platform with auristatin payload. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: B7-H4 (DAR: 6.0)', tradeoffs:'Payload: AF-HPA (Tubulin Inhibitor) | Linker: Dolasynthen', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2212', cat:'CD228', name:'Seagen SGN-CD228A (SGN-CD228A)', alias:'Seagen | CD228', brief:'CD228-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Humanized IgG1 antibody (clone hL49) targeting CD228. Evidence: PMID:36800443. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD228 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2213', cat:'Integrin beta-6', name:'Seagen SGN-B6A (SGN-B6A)', alias:'Seagen | Integrin beta-6', brief:'Integrin beta-6-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets Integrin beta-6. Vedotin ADC. Evidence: PMID:37619980. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Integrin beta-6 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2214', cat:'STn', name:'Seagen SGN-STNV (SGN-STNV)', alias:'Seagen | STn', brief:'STn-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets Sialyl-Tn (STn) antigen. Terminated in Phase 1 (2024). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: STn (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2215', cat:'c-Met', name:'AbbVie ABBV-400 (ABBV-400)', alias:'AbbVie | c-Met', brief:'c-Met-expressing Advanced Solid Tumors', examples:["Adizutecan (TOP1i)", "Cleavable peptide"], mechanism:'Targets c-Met. Phase 3 for CRC. Evidence: NCT05029882. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: c-Met (DAR: 8.0)', tradeoffs:'Payload: Adizutecan (TOP1i) (Topoisomerase I Inhibitor) | Linker: Cleavable peptide', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2216', cat:'SEZ6', name:'AbbVie ABBV-011 (ABBV-011)', alias:'AbbVie | SEZ6', brief:'SEZ6-expressing Advanced Solid Tumors', examples:["Calicheamicin", "Hydrazone"], mechanism:'Targets SEZ6. Uses calicheamicin payload. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: SEZ6 (DAR: 2.0)', tradeoffs:'Payload: Calicheamicin (DNA Damaging Agent) | Linker: Hydrazone', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2217', cat:'LRRC15', name:'AbbVie ABBV-085 (ABBV-085)', alias:'AbbVie | LRRC15', brief:'LRRC15-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Targets LRRC15. Phase 1 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: LRRC15 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2218', cat:'CD123', name:'Pivekimab sunirine (IMGN632)', alias:'ImmunoGen | CD123', brief:'CD123-expressing Advanced Solid Tumors', examples:["IGN (DGN462)", "s-SPDB"], mechanism:'Targets CD123. Phase 2/3 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD123 (DAR: 2.0)', tradeoffs:'Payload: IGN (DGN462) (DNA Damaging Agent) | Linker: s-SPDB', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2219', cat:'FR alpha', name:'ImmunoGen IMGN151 (IMGN151)', alias:'ImmunoGen | FR alpha', brief:'FR alpha-expressing Advanced Solid Tumors', examples:["DM4", "s-SPDB"], mechanism:'Next-generation FRalpha ADC targeting low expression tumors. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: FR alpha (DAR: 3.5)', tradeoffs:'Payload: DM4 (Tubulin Inhibitor) | Linker: s-SPDB', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2220', cat:'HER2', name:'Bio-Thera BAT8001 (BAT8001)', alias:'Bio-Thera | HER2', brief:'HER2-expressing Advanced Solid Tumors', examples:["Maytansinoid (DM1)", "6-maleimidocaproic acid (non-cleavable)"], mechanism:'Targets HER2. Terminated in Phase 3. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 3.5)', tradeoffs:'Payload: Maytansinoid (DM1) (Tubulin Inhibitor) | Linker: 6-maleimidocaproic acid (non-cleavable)', ref:'<span>N/A</span>', tier:'T3'},
{id:'adcprogt2221', cat:'TROP-2', name:'Bio-Thera BAT8003 (BAT8003)', alias:'Bio-Thera | TROP-2', brief:'TROP-2-expressing Advanced Solid Tumors', examples:["Batansine (Maytansinoid)", "Non-cleavable (Batansine platform)"], mechanism:'Targets Trop2. Discontinued at Phase 1. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: TROP-2 (DAR: 3.5)', tradeoffs:'Payload: Batansine (Maytansinoid) (Tubulin Inhibitor) | Linker: Non-cleavable (Batansine platform)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2222', cat:'B7-H3', name:'Bio-Thera BAT8008 (BAT8008)', alias:'Bio-Thera | B7-H3', brief:'B7-H3-expressing Advanced Solid Tumors', examples:["Batansine", "Non-cleavable"], mechanism:'Targets Trop2. Phase 1 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: B7-H3 (DAR: 3.5)', tradeoffs:'Payload: Batansine (Tubulin Inhibitor) | Linker: Non-cleavable', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2223', cat:'Mesothelin', name:'RemeGen RC88 (RC88)', alias:'RemeGen | Mesothelin', brief:'Mesothelin-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets Mesothelin (MSLN). RemeGen proprietary antibody with vc-MMAE platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: 45.2% (Ovarian) | PFS: 6.87 mo (NSCLC high MSLN)<br>• Grade 3+ AE: Manageable | Common: Neutropenia, AST/ALT elevation<br>• ADA: Not Reported<br>• Dose: 2.0 mg/kg (Q3W)', receptors:'Target: Mesothelin (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span> · <span>Patents: CN106632616, US10463746</span>', tier:'T2'},
{id:'adcprogt2224', cat:'c-Met', name:'RemeGen RC108 (RC108)', alias:'RemeGen | c-Met', brief:'c-Met-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets c-Met. Phase 2 for solid tumors overexpressing c-Met. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: c-Met (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span> · <span>Patents: CN110305141, US11291732</span>', tier:'T2'},
{id:'adcprogt2225', cat:'Claudin18.2', name:'RemeGen RC118 (RC118)', alias:'RemeGen | Claudin18.2', brief:'Claudin18.2-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets CLDN18.2. Phase 1 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Claudin18.2 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2226', cat:'Claudin18.2', name:'LaNova LM-302 (LM-302)', alias:'LaNova | Claudin18.2', brief:'Claudin18.2-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets CLDN18.2. Phase 1 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Claudin18.2 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2227', cat:'GPRC5D', name:'LaNova LM-305 (LM-305)', alias:'LaNova | GPRC5D', brief:'GPRC5D-expressing Advanced Solid Tumors', examples:["MMAE", "vc-PABC"], mechanism:'Targets GPRC5D. Licensed to AstraZeneca. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: GPRC5D (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: vc-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2228', cat:'HER2', name:'BNT323 (DB-1303)', alias:'DualityBio | HER2', brief:'HER2-expressing Advanced Solid Tumors', examples:["P1003 (TOP1i)", "Cleavable peptide (DITAC platform)"], mechanism:'DualityBio HER2 ADC. FDA Breakthrough Designation. Partnered with BioNTech. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 8.0)', tradeoffs:'Payload: P1003 (TOP1i) (Topoisomerase I Inhibitor) | Linker: Cleavable peptide (DITAC platform)', ref:'<span>N/A</span> · <span>Patents: CN114845778, WO2022143890</span>', tier:'T2'},
{id:'adcprogt2229', cat:'TROP-2', name:'BNT324 (DB-1305)', alias:'DualityBio | TROP-2', brief:'TROP-2-expressing Advanced Solid Tumors', examples:["Proprietary TOP1i", "Cleavable peptide (DITAC platform)"], mechanism:'Targets B7-H3. DITAC platform candidate. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: TROP-2 (DAR: 8.0)', tradeoffs:'Payload: Proprietary TOP1i (Topoisomerase I Inhibitor) | Linker: Cleavable peptide (DITAC platform)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2230', cat:'B7-H3', name:'BNT325 (DB-1311)', alias:'DualityBio | B7-H3', brief:'B7-H3-expressing Advanced Solid Tumors', examples:["Proprietary TOP1i", "Cleavable peptide (DITAC platform)"], mechanism:'Targets B7-H3. DITAC platform candidate with high potency Topo1i payload. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: B7-H3 (DAR: 8.0)', tradeoffs:'Payload: Proprietary TOP1i (Topoisomerase I Inhibitor) | Linker: Cleavable peptide (DITAC platform)', ref:'<span>N/A</span> · <span>Patents: CN116348398, WO2023051759</span>', tier:'T2'},
{id:'adcprogt2231', cat:'HER3', name:'BNT326 (YL202)', alias:'MediLink | HER3', brief:'HER3-expressing Advanced Solid Tumors', examples:["Topo1i", "TMALIN"], mechanism:'Targets HER3 (ERBB3). Developed by MediLink/BioNTech. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER3 (DAR: 8.0)', tradeoffs:'Payload: Topo1i (Topoisomerase I Inhibitor) | Linker: TMALIN', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2232', cat:'c-Met', name:'MediLink YL211 (YL211)', alias:'MediLink | c-Met', brief:'c-Met-expressing Advanced Solid Tumors', examples:["Topo1i", "TMALIN"], mechanism:'Targets c-Met. Uses TMALIN platform. Licensed to Roche (2024). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: c-Met (DAR: 8.0)', tradeoffs:'Payload: Topo1i (Topoisomerase I Inhibitor) | Linker: TMALIN', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2233', cat:'NaPi2b', name:'MediLink YL205 (YL205)', alias:'MediLink | NaPi2b', brief:'NaPi2b-expressing Advanced Solid Tumors', examples:["Topo1i", "TMALIN"], mechanism:'Targets NaPi-2b. Uses MediLink TMALIN platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: NaPi2b (DAR: 8.0)', tradeoffs:'Payload: Topo1i (Topoisomerase I Inhibitor) | Linker: TMALIN', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2234', cat:'Claudin18.2', name:'CSPC CPO102 (CPO102)', alias:'CSPC | Claudin18.2', brief:'Claudin18.2-expressing Advanced Solid Tumors', examples:["MMAE", "PEG3-Val-Cit-PABC"], mechanism:'Targets CLDN18.2. Developed by Conjupro/CSPC. Phase 1 (NCT05043987). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Claudin18.2 (DAR: 4.0)', tradeoffs:'Payload: MMAE (Tubulin Inhibitor) | Linker: PEG3-Val-Cit-PABC', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2235', cat:'HER2', name:'Kelun-Biotech A166 (A166)', alias:'Kelun-Biotech | HER2', brief:'HER2-expressing Advanced Solid Tumors', examples:["Duostatin-5 (MMAF derivative)", "Valine-Citrulline (vc)"], mechanism:'Site-specific HER2 ADC. NDA accepted in China (2025). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER2 (DAR: 2)', tradeoffs:'Payload: Duostatin-5 (MMAF derivative) (Tubulin Inhibitor) | Linker: Valine-Citrulline (vc)', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2236', cat:'c-Met', name:'Kelun-Biotech A188 (A188)', alias:'Kelun-Biotech | c-Met', brief:'c-Met-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: c-Met (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2237', cat:'TROP-2', name:'Kelun-Biotech A264 (A264)', alias:'Kelun-Biotech | TROP-2', brief:'TROP-2-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'TROP2-directed ADC (SKB264). Phase 3 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: TROP-2 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2238', cat:'B7-H3', name:'Kelun-Biotech A400 (A400)', alias:'Kelun-Biotech | B7-H3', brief:'B7-H3-expressing Advanced Solid Tumors', examples:["Topo1i", "K-Link"], mechanism:'RET targeted ADC (also known as KL-A400). <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: B7-H3 (DAR: 7.4)', tradeoffs:'Payload: Topo1i (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2239', cat:'Nectin-4', name:'Kelun-Biotech A223 (A223)', alias:'Kelun-Biotech | Nectin-4', brief:'Nectin-4-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Nectin-4 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2240', cat:'Claudin18.2', name:'Kelun-Biotech A204 (A204)', alias:'Kelun-Biotech | Claudin18.2', brief:'Claudin18.2-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: Claudin18.2 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2241', cat:'EGFR', name:'Kelun-Biotech A289 (A289)', alias:'Kelun-Biotech | EGFR', brief:'EGFR-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: EGFR (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2242', cat:'HER3', name:'Kelun-Biotech A215 (A215)', alias:'Kelun-Biotech | HER3', brief:'HER3-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: HER3 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2243', cat:'CD79b', name:'Kelun-Biotech A296 (A296)', alias:'Kelun-Biotech | CD79b', brief:'CD79b-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Targets STING. Phase 1 development. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD79b (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2244', cat:'CD22', name:'Kelun-Biotech A219 (A219)', alias:'Kelun-Biotech | CD22', brief:'CD22-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD22 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2245', cat:'CD33', name:'Kelun-Biotech A206 (A206)', alias:'Kelun-Biotech | CD33', brief:'CD33-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD33 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2246', cat:'CD30', name:'Kelun-Biotech A255 (A255)', alias:'Kelun-Biotech | CD30', brief:'CD30-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD30 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2247', cat:'CD19', name:'Kelun-Biotech A233 (A233)', alias:'Kelun-Biotech | CD19', brief:'CD19-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD19 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2248', cat:'BCMA', name:'Kelun-Biotech A244 (A244)', alias:'Kelun-Biotech | BCMA', brief:'BCMA-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: BCMA (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2249', cat:'GPRC5D', name:'Kelun-Biotech A277 (A277)', alias:'Kelun-Biotech | GPRC5D', brief:'GPRC5D-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: GPRC5D (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2250', cat:'FcRH5', name:'Kelun-Biotech A288 (A288)', alias:'Kelun-Biotech | FcRH5', brief:'FcRH5-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: FcRH5 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2251', cat:'CLL-1', name:'Kelun-Biotech A299 (A299)', alias:'Kelun-Biotech | CLL-1', brief:'CLL-1-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CLL-1 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2252', cat:'CD123', name:'Kelun-Biotech A300 (A300)', alias:'Kelun-Biotech | CD123', brief:'CD123-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD123 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2253', cat:'CD37', name:'Kelun-Biotech A311 (A311)', alias:'Kelun-Biotech | CD37', brief:'CD37-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD37 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2254', cat:'CD138', name:'Kelun-Biotech A322 (A322)', alias:'Kelun-Biotech | CD138', brief:'CD138-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD138 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2255', cat:'CD70', name:'Kelun-Biotech A333 (A333)', alias:'Kelun-Biotech | CD70', brief:'CD70-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD70 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2256', cat:'CD25', name:'Kelun-Biotech A344 (A344)', alias:'Kelun-Biotech | CD25', brief:'CD25-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD25 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2257', cat:'CD46', name:'Kelun-Biotech A355 (A355)', alias:'Kelun-Biotech | CD46', brief:'CD46-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD46 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2258', cat:'CD228', name:'Kelun-Biotech A366 (A366)', alias:'Kelun-Biotech | CD228', brief:'CD228-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: CD228 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2259', cat:'FAP', name:'Kelun-Biotech A377 (A377)', alias:'Kelun-Biotech | FAP', brief:'FAP-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: FAP (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2260', cat:'LGR5', name:'Kelun-Biotech A388 (A388)', alias:'Kelun-Biotech | LGR5', brief:'LGR5-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: LGR5 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2261', cat:'LRRC15', name:'Kelun-Biotech A399 (A399)', alias:'Kelun-Biotech | LRRC15', brief:'LRRC15-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: LRRC15 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2262', cat:'SLITRK6', name:'Kelun-Biotech A411 (A411)', alias:'Kelun-Biotech | SLITRK6', brief:'SLITRK6-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: SLITRK6 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2263', cat:'UPK2', name:'Kelun-Biotech A422 (A422)', alias:'Kelun-Biotech | UPK2', brief:'UPK2-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: UPK2 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2264', cat:'LIV-1', name:'Kelun-Biotech A433 (A433)', alias:'Kelun-Biotech | LIV-1', brief:'LIV-1-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: LIV-1 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2265', cat:'GCC', name:'Kelun-Biotech A444 (A444)', alias:'Kelun-Biotech | GCC', brief:'GCC-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: GCC (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2266', cat:'ASCT2', name:'Kelun-Biotech A455 (A455)', alias:'Kelun-Biotech | ASCT2', brief:'ASCT2-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: ASCT2 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
{id:'adcprogt2267', cat:'PTK7', name:'Kelun-Biotech A466 (A466)', alias:'Kelun-Biotech | PTK7', brief:'PTK7-expressing Advanced Solid Tumors', examples:["KL610015 (Topo1i)", "K-Link"], mechanism:'Estimated based on Kelun-Biotech\'s proprietary Topo1i platform. <br><br> <strong>Clinical Profile:</strong><br>• ORR: TBD | PFS: TBD<br>• Grade 3+ AE: TBD | Common: TBD<br>• ADA: TBD<br>• Dose: TBD (TBD)', receptors:'Target: PTK7 (DAR: 7.4)', tradeoffs:'Payload: KL610015 (Topo1i) (Topoisomerase I Inhibitor) | Linker: K-Link', ref:'<span>N/A</span>', tier:'T2'},
];

const ADC_DATA = [
{id:'adccompl001', cat:'Linkers', name:'mc-val-cit-PABC', alias:'cleavable', brief:'Industry standard protease-cleavable linker.', examples:["PMID:12873544", "FDA label: Adcetris, Polivy, Padcev"], mechanism:'Cathepsin B cleavage', receptors:'Enzyme: Cathepsin B (lysosomal cysteine protease; highly expressed in tumor cells)', tradeoffs:'Moderately hydrophobic (causes aggregation at high DAR >4 without PEGylation); PEG2/PEG4 variants significantly improve solubility', ref:'<span>PMID:12873544</span> · <span>FDA label: Adcetris, Polivy, Padcev</span>'},
{id:'adccompl002', cat:'Linkers', name:'GGFG', alias:'cleavable', brief:'Tetrapeptide linker used in Daiichi Sankyo DXd platform.', examples:["PMID:26058450", "FDA label: Enhertu, Dato-DXd"], mechanism:'Cathepsin cleavage', receptors:'Enzyme: Lysosomal cathepsins (B, L, S) — requires complete ADC internalization and lysosomal trafficking', tradeoffs:'Relatively hydrophilic due to GGFG peptide; supports DAR 7–8 without aggregation (key advantage for high-DAR DXd ADCs)', ref:'<span>PMID:26058450</span> · <span>FDA label: Enhertu, Dato-DXd</span>'},
{id:'adccompp001', cat:'Payloads', name:'MMAE', alias:'Tubulin inhibitor', brief:'Monomethyl auristatin E.', examples:["PMID:12873544 (original MMAE ADC)", "PMID:22399561 (MMAE DLT)", "FDA label: Adcetris, Polivy, Padcev"], mechanism:'Inhibits tubulin polymerization by binding to β-tubulin at the vinca alkaloid binding site, causing mitotic arrest and apoptosis.', receptors:'IC50: 0.1–1.0 nM', tradeoffs:['Peripheral sensory neuropathy', 'Neutropenia/febrile neutropenia', 'Fatigue'], ref:'<span>PMID:12873544 (original MMAE ADC)</span> · <span>PMID:22399561 (MMAE DLT)</span> · <span>FDA label: Adcetris, Polivy, Padcev</span>'},
{id:'adccompp002', cat:'Payloads', name:'DXd', alias:'Topoisomerase I inhibitor', brief:'Exatecan derivative (Topoisomerase I inhibitor).', examples:["PMID:26058450 (DXd drug design)", "PMID:29236700 (DESTINY-Breast01)", "FDA label: Enhertu"], mechanism:'Topoisomerase I inhibitor. Traps TOP1-DNA cleavage complexes, causing single-strand DNA breaks that lead to double-strand breaks during replication. Active in all cell cycle phases — key advantage over MMAE for low-proliferation tumors.', receptors:'IC50: 0.3 nM', tradeoffs:['Interstitial lung disease (ILD/pneumonitis) — ~10–15% incidence', 'Nausea/vomiting', 'Myelosuppression'], ref:'<span>PMID:26058450 (DXd drug design)</span> · <span>PMID:29236700 (DESTINY-Breast01)</span> · <span>FDA label: Enhertu</span>'},
{id:'adccompl100', cat:'Linkers', name:'Glucuronide-MMAE', alias:'cleavable', brief:'Cleaved by beta-glucuronidase (highly expressed in lysosomes and tumor microenvironment).', examples:["PMID:16955513 (beta-glucuronide linker)", "PMID:21478267"], mechanism:'Various', receptors:'Enzyme: β-Glucuronidase (lysosomal UGP; also secreted extracellularly in necrotic tumor regions)', tradeoffs:'Highly hydrophilic (glucuronic acid moiety); allows DAR 6–8 without significant aggregation. Superior PK compared to vc-PABC at same DAR.', ref:'<span>PMID:16955513 (beta-glucuronide linker)</span> · <span>PMID:21478267</span>'},
{id:'adccompl101', cat:'Linkers', name:'PEG4-vc-PABC', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B', tradeoffs:'PEG4 substantially improves hydrophilicity over standard vc-PABC; supports DAR 5–6', ref:''},
{id:'adccompl102', cat:'Linkers', name:'VA-PABC', alias:'cleavable', brief:'Valine-Alanine dipeptide.', examples:["PMID:26700026 (Val-Ala design)", "FDA label: Zynlonta (loncastuximab tesirine uses SG3249 VA linker)"], mechanism:'Various', receptors:'Enzyme: Cathepsin B (slightly faster cleavage kinetics than Val-Cit for some substrates)', tradeoffs:'More hydrophilic than vc-PABC (Ala vs Cit); reduces ADC aggregation. Preferred for highly hydrophobic payloads like PBDs and indolinobenzazepines.', ref:'<span>PMID:26700026 (Val-Ala design)</span> · <span>FDA label: Zynlonta (loncastuximab tesirine uses SG3249 VA linker)</span>'},
{id:'adccompl103', cat:'Linkers', name:'Pyrophosphate-diester', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Phosphodiesterase (intracellular) + spontaneous hydrolysis in lysosomes', tradeoffs:'Hydrophilic; improves ADC PK', ref:''},
{id:'adccompl104', cat:'Linkers', name:'Legumain-cleavable', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Legumain (Asn-specific cysteine protease; expressed in tumor-associated macrophages and acidic tumor stroma)', tradeoffs:'Moderate hydrophilicity', ref:''},
{id:'adccompl105', cat:'Linkers', name:'beta-galactoside-cleavable', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: β-Galactosidase (lysosomal; also expressed extracellularly by senescent tumor cells)', tradeoffs:'Highly hydrophilic (galactose moiety); excellent for high DAR', ref:''},
{id:'adccompl106', cat:'Linkers', name:'Sulfatase-cleavable', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Sulfatase (lysosomal arylsulfatase A/B)', tradeoffs:'Highly hydrophilic', ref:''},
{id:'adccompl107', cat:'Linkers', name:'Phosphatase-cleavable', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Alkaline/acid phosphatase (widespread expression — poor tumor selectivity)', tradeoffs:'Highly hydrophilic', ref:''},
{id:'adccompl108', cat:'Linkers', name:'Mal-PEG2-V-Cit-PAB', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B', tradeoffs:'PEG2 spacer significantly improves solubility over standard vc-PABC; allows higher DAR without aggregation', ref:''},
{id:'adccompl109', cat:'Linkers', name:'Fmoc-vc-PABC', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B (after Fmoc deprotection)', tradeoffs:'Hydrophobic (Fmoc group)', ref:''},
{id:'adccompl110', cat:'Linkers', name:'Dde-vc-PABC', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B (after Dde deprotection)', tradeoffs:'Moderate', ref:''},
{id:'adccompl111', cat:'Linkers', name:'Hydrazone-disulfide', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: pH-dependent hydrolysis (no enzyme required); disulfide component also cleaved by intracellular glutathione (GSH)', tradeoffs:'Moderate; hydrazone contributes some polarity', ref:''},
{id:'adccompl112', cat:'Linkers', name:'Thioether-cleavable', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Intracellular thiol (GSH-mediated reduction)', tradeoffs:'Hydrophobic', ref:''},
{id:'adccompl113', cat:'Linkers', name:'Peptide-MMAF', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B or other lysosomal peptidases', tradeoffs:'Moderate; MMAF\'s charge improves overall hydrophilicity vs MMAE linker-payloads', ref:''},
{id:'adccompl114', cat:'Linkers', name:'PEG8-vc-PABC', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B', tradeoffs:'PEG8 provides excellent hydrophilicity; supports DAR 6–8 with minimal aggregation; significant PK improvement over vc-PABC at high DAR', ref:''},
{id:'adccompl115', cat:'Linkers', name:'Val-Cit-PAB-OH', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B', tradeoffs:'Moderate', ref:''},
{id:'adccompl116', cat:'Linkers', name:'mc-Val-Cit-PAB-PNP', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: Cathepsin B', tradeoffs:'Moderate', ref:''},
{id:'adccompl117', cat:'Linkers', name:'Mal-PEG4-NHS', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: None (non-cleavable spacer/crosslinker)', tradeoffs:'PEG4 provides good hydrophilicity', ref:''},
{id:'adccompl118', cat:'Linkers', name:'SMPEG24', alias:'cleavable', brief:'General structural class.', examples:[], mechanism:'Various', receptors:'Enzyme: None (non-cleavable PEG-maleimide crosslinker)', tradeoffs:'PEG24 provides excellent hydrophilicity; enables DAR >8 without aggregation. Used in Zynlonta formulation variants.', ref:''},
{id:'adccompl119', cat:'Linkers', name:'Sulfo-SMCC', alias:'cleavable', brief:'Classic non-cleavable thioether linker.', examples:["PMID:16814772 (T-DM1 design)", "FDA label: Kadcyla"], mechanism:'Various', receptors:'Enzyme: None — non-cleavable. Requires complete lysosomal proteolysis of antibody backbone to release Lys-SMCC-payload adduct', tradeoffs:'Hydrophobic thioether linker; constrains DAR to 3–4 (DAR >4 causes rapid clearance by increased hydrophobicity)', ref:'<span>PMID:16814772 (T-DM1 design)</span> · <span>FDA label: Kadcyla</span>'},
{id:'adccompp100', cat:'Payloads', name:'MMAD', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:22542113"], mechanism:'Auristatin analog, monomethyl dolastatin derivative. Mechanism similar to MMAE (tubulin inhibition at vinca site).', receptors:'IC50: 0.1–1.0 nM', tradeoffs:['Peripheral neuropathy', 'Neutropenia'], ref:'<span>PMID:22542113</span>'},
{id:'adccompp101', cat:'Payloads', name:'Auristatin F', alias:'Various', brief:'Charged tubulin inhibitor.', examples:["PMID:16450923 (MMAF vs MMAE mechanism)", "FDA label: Blenrep (belantamab mafodotin)"], mechanism:'Tubulin inhibitor (vinca alkaloid site). Unlike MMAE, contains a charged C-terminal phenylalanine — membrane-impermeable. No bystander killing effect. Lower systemic cytotoxicity due to poor cell penetration.', receptors:'IC50: 0.5–5.0 nM', tradeoffs:['Ocular toxicity (corneal epithelial microcysts)', 'Thrombocytopenia', 'Peripheral neuropathy (less than MMAE)'], ref:'<span>PMID:16450923 (MMAF vs MMAE mechanism)</span> · <span>FDA label: Blenrep (belantamab mafodotin)</span>'},
{id:'adccompp102', cat:'Payloads', name:'Auristatin E', alias:'Various', brief:'Preclinical or investigational payload.', examples:[], mechanism:'', receptors:'IC50: N/A nM', tradeoffs:'', ref:''},
{id:'adccompp103', cat:'Payloads', name:'PF-06380101', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:24867892"], mechanism:'Novel auristatin derivative. Tubulin polymerization inhibitor designed to reduce P-gp efflux susceptibility compared to MMAE.', receptors:'IC50: 0.1–0.5 nM', tradeoffs:['Nausea', 'Peripheral neuropathy'], ref:'<span>PMID:24867892</span>'},
{id:'adccompp104', cat:'Payloads', name:'Tubulysin A', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:22765894"], mechanism:'Highly potent tubulin polymerization inhibitor from myxobacteria. Binds vinca domain. 10–100× more potent than auristatins.', receptors:'IC50: 0.01–0.1 nM', tradeoffs:['Myelosuppression', 'Peripheral neuropathy'], ref:'<span>PMID:22765894</span>'},
{id:'adccompp105', cat:'Payloads', name:'Tubulysin M', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:26068579"], mechanism:'Synthetic tubulysin analog optimized for ADC conjugation.', receptors:'IC50: 0.01–0.1 nM', tradeoffs:['Myelosuppression', 'GI toxicity'], ref:'<span>PMID:26068579</span>'},
{id:'adccompp106', cat:'Payloads', name:'Cryptophycin 52', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:11814056"], mechanism:'Ultra-potent tubulin inhibitor isolated from cyanobacteria. P-gp substrate — susceptibility to efflux is a major limitation.', receptors:'IC50: 0.001–0.01 nM', tradeoffs:['Peripheral neuropathy', 'Myelosuppression'], ref:'<span>PMID:11814056</span>'},
{id:'adccompp107', cat:'Payloads', name:'PNU-159682', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:21821736"], mechanism:'Ultra-potent nemorubicin metabolite (anthracycline class). IC50 in fM–pM range — among the most potent known ADC payloads. Requires extremely low DAR (1–2) due to toxicity.', receptors:'IC50: 0.00001–0.0001 nM', tradeoffs:['Severe myelosuppression', 'Cardiotoxicity (anthracycline-class)'], ref:'<span>PMID:21821736</span>'},
{id:'adccompp108', cat:'Payloads', name:'DGN462', alias:'Various', brief:'Indolinobenzodiazepine DNA-alkylating agent (IGN).', examples:["PMID:26013320 (IGN ADC)", "PMID:31813763 (IMGN632 CD123)"], mechanism:'Indolinobenzodiazepine (IGN) DNA alkylator. Forms reversible imine bonds in minor groove of DNA — MOA distinct from classic PBD dimers. Effective against quiescent cells. VOD risk requires careful linker stability engineering.', receptors:'IC50: 0.0001–0.001 nM', tradeoffs:['Veno-occlusive disease (VOD/SOS) — class effect', 'Thrombocytopenia', 'Delayed hepatotoxicity'], ref:'<span>PMID:26013320 (IGN ADC)</span> · <span>PMID:31813763 (IMGN632 CD123)</span>'},
{id:'adccompp109', cat:'Payloads', name:'Exatecan', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:26058450 (Exatecan → DXd conversion)"], mechanism:'Camptothecin derivative (Topoisomerase I inhibitor). Precursor to DXd. Cell-cycle independent activity. Highly membrane-permeable — strong bystander killing.', receptors:'IC50: 0.3–3.0 nM', tradeoffs:['Myelosuppression', 'GI toxicity (nausea/diarrhea)', 'ILD risk similar to DXd'], ref:'<span>PMID:26058450 (Exatecan → DXd conversion)</span>'},
{id:'adccompp110', cat:'Payloads', name:'Belotecan', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:20215052"], mechanism:'Korean-developed camptothecin analog. TOP1 inhibitor. Less potent than DXd/exatecan.', receptors:'IC50: 1.0–10.0 nM', tradeoffs:['Myelosuppression', 'GI toxicity'], ref:'<span>PMID:20215052</span>'},
{id:'adccompp111', cat:'Payloads', name:'Topotecan', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:24284813"], mechanism:'Camptothecin analog. Lower potency than exatecan/DXd — limited utility as ADC payload at standard DAR.', receptors:'IC50: 5.0–50.0 nM', tradeoffs:['Severe myelosuppression'], ref:'<span>PMID:24284813</span>'},
{id:'adccompp112', cat:'Payloads', name:'Alpha-amanitin', alias:'Various', brief:'RNA Polymerase II inhibitor.', examples:["PMID:22406981 (Amanitin ADC concept)", "PMID:31697395 (HDP-101 BCMA amanitin ADC)"], mechanism:'Inhibits RNA Polymerase II by blocking the bridge helix translocation step. Active against quiescent, non-proliferating tumor cells — major advantage over tubulin inhibitors in slow-growing tumors (pancreatic cancer, prostate cancer).', receptors:'IC50: 0.001–0.01 nM', tradeoffs:['Hepatotoxicity (historical concern with free drug)', 'Myelosuppression'], ref:'<span>PMID:22406981 (Amanitin ADC concept)</span> · <span>PMID:31697395 (HDP-101 BCMA amanitin ADC)</span>'},
{id:'adccompp113', cat:'Payloads', name:'Thailanstatin A', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:27164163"], mechanism:'Spliceosome inhibitor targeting SF3B1 (branch point binding protein). Disrupts pre-mRNA splicing, causing accumulation of aberrant transcripts and cell death via G2/M arrest.', receptors:'IC50: 0.001–0.01 nM', tradeoffs:['Myelosuppression', 'GI toxicity'], ref:'<span>PMID:27164163</span>'},
{id:'adccompp114', cat:'Payloads', name:'Spliceostatin A', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:17898714"], mechanism:'Spliceosome inhibitor (FR901464 analog). Targets SF3B1, disrupting the U2 snRNP-branch point interaction.', receptors:'IC50: 0.001–0.1 nM', tradeoffs:['Myelosuppression'], ref:'<span>PMID:17898714</span>'},
{id:'adccompp115', cat:'Payloads', name:'KSP71', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:31371393"], mechanism:'Kinesin Spindle Protein (Eg5/KIF11) inhibitor. Causes monopolar spindle formation and mitotic arrest. Distinct resistance mechanism from tubulin inhibitors.', receptors:'IC50: 1.0–10.0 nM', tradeoffs:['Peripheral neuropathy (less than MMAE)', 'Myelosuppression'], ref:'<span>PMID:31371393</span>'},
{id:'adccompp116', cat:'Payloads', name:'SB-743921', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:17350563"], mechanism:'KSP (Eg5) inhibitor. Binds to allosteric ISPK pocket of Eg5. Potent mitotic arrest agent.', receptors:'IC50: 0.1–1.0 nM', tradeoffs:['Myelosuppression', 'GI toxicity'], ref:'<span>PMID:17350563</span>'},
{id:'adccompp117', cat:'Payloads', name:'Navitoclax-derivative', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:29212923 (Bcl-xL ADC concept)"], mechanism:'Bcl-xL/Bcl-2 inhibitor (BH3 mimetic). ADC format restricts systemic exposure — eliminates platelet thrombocytopenia that limits free navitoclax. Synergistic with DNA damaging agents.', receptors:'IC50: 1.0–100.0 nM', tradeoffs:['Thrombocytopenia (Bcl-xL on platelets)', 'Neutropenia'], ref:'<span>PMID:29212923 (Bcl-xL ADC concept)</span>'},
{id:'adccompp118', cat:'Payloads', name:'TLR7-agonist-1', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:33028661 (ISAC concept)", "PMID:34906459 (BDC-1001 HER2 ISAC)"], mechanism:'Toll-like receptor 7 agonist (ISAC — Immune-Stimulating Antibody Conjugate). Activates innate immunity in tumor microenvironment. Does not directly kill tumor cells — stimulates anti-tumor T cell response. Efficacy requires immunogenic tumor microenvironment.', receptors:'IC50: N/A (immunomodulator, EC50 ~10–100 nM) nM', tradeoffs:['Cytokine release syndrome (CRS)', 'Systemic inflammation'], ref:'<span>PMID:33028661 (ISAC concept)</span> · <span>PMID:34906459 (BDC-1001 HER2 ISAC)</span>'},
{id:'adccompp119', cat:'Payloads', name:'STING-agonist-1', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:35314666 (STING-ADC overview)"], mechanism:'STING pathway agonist (cyclic dinucleotide analog). Activates cGAS-STING innate immune signaling, inducing type I interferon production and CD8+ T cell recruitment.', receptors:'IC50: N/A (immunomodulator, EC50 ~1–50 nM) nM', tradeoffs:['CRS', 'Systemic STING activation causing autoimmune-like toxicity'], ref:'<span>PMID:35314666 (STING-ADC overview)</span>'},
{id:'adccompp120', cat:'Payloads', name:'Thorium-227', alias:'Various', brief:'Targeted Alpha Therapy (TAT) payload.', examples:["PMID:26187766 (Thorium-227 Targeted Thorium Conjugates)", "PMID:35219975 (Phase I PSMA-TTC)"], mechanism:'Alpha-particle emitter (t1/2 = 18.7 days). High LET (80 keV/μm). Short path length (~40–80 μm) minimizes off-target tissue damage while delivering lethal DNA double-strand breaks. 4 alpha emissions per decay chain.', receptors:'IC50: N/A (alpha emitter, radiation dose-based) nM', tradeoffs:['Bone marrow suppression', 'Renal toxicity if unbound thorium is released'], ref:'<span>PMID:26187766 (Thorium-227 Targeted Thorium Conjugates)</span> · <span>PMID:35219975 (Phase I PSMA-TTC)</span>'},
{id:'adccompp121', cat:'Payloads', name:'Astatine-211', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:27048580"], mechanism:'Alpha-emitter (t1/2 = 7.2 hours). Potent DNA strand break induction. Short half-life requires manufacturing close to clinical site (limiting factor).', receptors:'IC50: N/A (alpha emitter) nM', tradeoffs:['Thyroid toxicity (requires thyroid protection)', 'Bone marrow suppression'], ref:'<span>PMID:27048580</span>'},
{id:'adccompp122', cat:'Payloads', name:'Radium-223', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:23700264 (Alpharadin/Xofigo)"], mechanism:'Calcium-mimetic alpha emitter. Naturally targets bone. Currently used as free drug (Xofigo) for mCRPC bone metastases — ADC conjugation under exploration.', receptors:'IC50: N/A (alpha emitter) nM', tradeoffs:['Bone marrow suppression', 'GI toxicity'], ref:'<span>PMID:23700264 (Alpharadin/Xofigo)</span>'},
{id:'adccompp123', cat:'Payloads', name:'Lead-212', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:33303579 (Pb-212 TAT)"], mechanism:'Alpha-in-vivo generator. Decays to Bi-212 (alpha emitter) in vivo. t1/2 = 10.6 hours. Used in AlphaMetralex/Perspective platform.', receptors:'IC50: N/A (alpha emitter via Bi-212 daughter) nM', tradeoffs:['Bone marrow suppression', 'Renal toxicity'], ref:'<span>PMID:33303579 (Pb-212 TAT)</span>'},
{id:'adccompp124', cat:'Payloads', name:'Bismuth-213', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:11773748"], mechanism:'Alpha emitter (t1/2 = 45.6 min). Requires on-site Ac-225/Bi-213 generator. Very short half-life is a major logistics challenge.', receptors:'IC50: N/A (alpha emitter) nM', tradeoffs:['Renal toxicity', 'Bone marrow suppression'], ref:'<span>PMID:11773748</span>'},
{id:'adccompp125', cat:'Payloads', name:'Saporin', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:2665776 (Saporin immunotoxins)"], mechanism:'Type I ribosome-inactivating protein (RIP) from soapwort (Saponaria officinalis). N-glycosidase cleaves 28S rRNA, permanently inactivating ribosomes. Requires endosomal escape for cytosolic activity.', receptors:'IC50: 0.001–0.01 (as RIP, ribosome-inactivating protein) nM', tradeoffs:['Immunogenicity (protein toxin)', 'Hepatotoxicity if non-specifically taken up', 'Vascular leak syndrome'], ref:'<span>PMID:2665776 (Saporin immunotoxins)</span>'},
{id:'adccompp126', cat:'Payloads', name:'Gelonin', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:6261600"], mechanism:'Type I RIP (ribosome-inactivating protein). N-glycosidase inactivates eEF-2 on ribosomes. Requires endosomal escape to access cytosol.', receptors:'IC50: 0.001–0.1 nM', tradeoffs:['Immunogenicity', 'Hepatotoxicity', 'Vascular leak syndrome'], ref:'<span>PMID:6261600</span>'},
{id:'adccompp127', cat:'Payloads', name:'Diphtheria toxin', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:8267523 (DT mechanism)", "FDA label: Ontak (denileukin diftitox)"], mechanism:'ADP-ribosylates eEF-2 (elongation factor 2), irreversibly inhibiting protein synthesis. Catalytic — one molecule kills a cell. Used in FDA-approved denileukin diftitox (IL-2-DT fusion).', receptors:'IC50: 0.0001–0.001 nM', tradeoffs:['Immunogenicity (human anti-DT antibodies common)', 'Hepatotoxicity', 'Vascular leak syndrome'], ref:'<span>PMID:8267523 (DT mechanism)</span> · <span>FDA label: Ontak (denileukin diftitox)</span>'},
{id:'adccompp128', cat:'Payloads', name:'Ricin A chain', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:9092568 (ricin immunotoxins review)"], mechanism:'N-glycosidase that depurinates 28S rRNA. Ricin A chain alone requires carrier for internalization (loses galactose-binding B chain in immunotoxin format). VLS is the major dose-limiting issue.', receptors:'IC50: 0.0001–0.001 nM', tradeoffs:['Vascular leak syndrome (VLS)', 'Severe immunogenicity', 'Hemolytic uremic syndrome'], ref:'<span>PMID:9092568 (ricin immunotoxins review)</span>'},
{id:'adccompp129', cat:'Payloads', name:'Shiga toxin', alias:'Various', brief:'Preclinical or investigational payload.', examples:["PMID:27217292"], mechanism:'N-glycosidase (similar to ricin). A subunit inactivates 28S rRNA. B subunit binds Gb3 glycolipid. Only A subunit used in immunotoxins.', receptors:'IC50: 0.0001–0.01 nM', tradeoffs:['Hemolytic uremic syndrome (HUS)', 'Renal toxicity', 'Immunogenicity'], ref:'<span>PMID:27217292</span>'},
];

const FC_DATA = [
{id:'fcls', cat:'Half-life Extension', tier:'T1', name:'LS (M428L/N434S)', alias:'M428L/N434S', brief:'Increases FcRn affinity at pH 6.', examples:["Ravulizumab (Ultomiris)", "Crizanlizumab (Adakveo)", "Evusheld (Tixagevimab/Cilgavimab)"], mechanism:'Increases FcRn affinity at pH 6.0 ~10-fold by optimizing packing at the CH2-CH3 interface, enhancing IgG recycling without increasing pH 7.4 binding.', receptors:'FcRn_pH6: 11-fold increase · FcRn_pH7.4: No significant change · FcgammaRs: Unaffected', tradeoffs:'LS is the clinical gold standard for half-life extension due to its high efficacy (2-3x half-life extension) and low immunogenicity profile.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/16614067/" target="_blank">PMID 16614067</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/20173738/" target="_blank">PMID 20173738</a>', ip:{holder:'AstraZeneca (MedImmune)', status:'Expired/Expiring', expiry:'US expired 2024; continuation claims may persist', design_around:'N434H (Public Domain), T307Q/N434A (Momenta)'}},
{id:'fcyte', cat:'Half-life Extension', tier:'T1', name:'YTE (M252Y/S254T/T256E)', alias:'M252Y/S254T/T256E', brief:'Triple mutation at the CH2-CH3 interface.', examples:["Beyfortus (Nirsevimab)", "Motavizumab (YTE variant)"], mechanism:'Triple mutation at the CH2-CH3 interface. Dramatically increases FcRn affinity at pH 6.0 (~10-fold) but can slightly increase binding at pH 7.4.', receptors:'FcRn_pH6: 10-fold increase · FcRn_pH7.4: Slight increase · FcgammaRs: Reduced ADCC reported in some contexts', tradeoffs:'Provides greater half-life gain than LS in some primates, but triple mutation increases risk of sequence-based immunogenicity.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/12165561/" target="_blank">PMID 12165561</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/23896478/" target="_blank">PMID 23896478</a>', ip:{holder:'AstraZeneca (MedImmune)', status:'Expired', expiry:'2021-2023', design_around:'Core patents expired; YTE can be used for new designs.'}},
{id:'fclala', cat:'Effector Silencing', tier:'T1', name:'LALA (L234A/L235A)', alias:'L234A/L235A', brief:'Disrupts the lower hinge region contacts with FcgammaRs (I, IIa, IIIa) and C1q.', examples:["Atezolizumab (Tecentriq)", "Durvalumab (Imfinzi)"], mechanism:'Disrupts the lower hinge region contacts with FcgammaRs (I, IIa, IIIa) and C1q. Reduces ADCC and CDC.', receptors:'FcgammaRI: Abolished · FcgammaRIIIa: Significantly reduced · C1q: Reduced', tradeoffs:'Standard silencing variant when minimal effector function is desired. Freely usable.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11602730/" target="_blank">PMID 11602730</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/3260844/" target="_blank">PMID 3260844</a>', ip:{holder:'Public Domain', status:'Public', expiry:'N/A', design_around:'None required.'}},
{id:'fclalapg', cat:'Effector Silencing', tier:'T1', name:'LALA-PG (L234A/L235A/P329G)', alias:'L234A/L235A/P329G', brief:'Combines LALA with P329G to completely abolish the \'proline sandwich\' with FcgammaRs, eliminating residual effector function.', examples:["Faricimab (Vabysmo)", "Many Roche/Genentech bispecifics"], mechanism:'Combines LALA with P329G to completely abolish the \'proline sandwich\' with FcgammaRs, eliminating residual effector function.', receptors:'FcgammaRs: Fully abolished · C1q: Fully abolished', tradeoffs:'The most effective silencing variant currently in clinical use. P329G is the key differentiator.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/26976769/" target="_blank">PMID 26976769</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/28003361/" target="_blank">PMID 28003361</a>', ip:{holder:'Roche (Genentech)', status:'Active', expiry:'2029 (US)', design_around:'LALA (slightly less silent but public), N297A (public)'}},
{id:'fcgasdalie', cat:'Effector Enhancement', tier:'T2', name:'GASDALIE (G236A/S239D/A330L/I332E)', alias:'G236A/S239D/A330L/I332E', brief:'Introduces new electrostatic and hydrophobic contacts with FcgammaRIIIa, enhancing NK-cell mediated ADCC.', examples:["Xmab candidates", "Tafasitamab (uses SDIE subset)"], mechanism:'Introduces new electrostatic and hydrophobic contacts with FcgammaRIIIa, enhancing NK-cell mediated ADCC.', receptors:'FcgammaRIIIa: 1000-fold increase · FcgammaRIIa: Enhanced · FcgammaRIIb: Increased (potential liability)', tradeoffs:'Potent ADCC enhancement, but increased FcgammaRIIb binding can be a safety/efficacy trade-off.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/16537476/" target="_blank">PMID 16537476</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/17283120/" target="_blank">PMID 17283120</a>', ip:{holder:'Xencor', status:'Active/Expiring', expiry:'~2027', design_around:'Afucosylation (Kyowa Kirin/Roche)'}},
{id:'fcafuco', cat:'Effector Enhancement', tier:'T1', name:'Afucosylation (FUT8-KO)', alias:'N297 glycan fucose removal', brief:'Removal of core fucose eliminates a steric clash with Trp158 of FcgammaRIIIa, increasing affinity 50-100x.', examples:["Obinutuzumab (Gazyva)", "Mogamulizumab (Poteligeo)", "Benralizumab (Fasenra)"], mechanism:'Removal of core fucose eliminates a steric clash with Trp158 of FcgammaRIIIa, increasing affinity 50-100x.', receptors:'FcgammaRIIIa: 50-100 fold increase · FcgammaRIIb: Minimal change', tradeoffs:'Most clinically validated ADCC enhancement method. Cleanest receptor profile (selective for IIIa).', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11916992/" target="_blank">PMID 11916992</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/16615187/" target="_blank">PMID 16615187</a>', ip:{holder:'Kyowa Kirin / Roche', status:'Expiring', expiry:'Core patents expired ~2021-2022', design_around:'FUT8 knockout is now more accessible; use Kifunensine in culture as a process workaround.'}},
{id:'fchexa', cat:'CDC Enhancement', tier:'T1', name:'HexaBody (E430G)', alias:'E430G', brief:'Promotes Fc-Fc hexamerization on the cell surface upon target binding, creating a high-avidity platform for C1q recruitment.', examples:["Mezagitamab (anti-CD38)", "GEN1029 (HexaBody-DR5)"], mechanism:'Promotes Fc-Fc hexamerization on the cell surface upon target binding, creating a high-avidity platform for C1q recruitment.', receptors:'C1q: 100-10,000 fold avidity increase on surface · FcgammaRs: Unaffected', tradeoffs:'Superior for targets requiring complement-mediated lysis (CDC). Surface-dependent safety mechanism.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/25473098/" target="_blank">PMID 25473098</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/27298261/" target="_blank">PMID 27298261</a>', ip:{holder:'Genmab', status:'Active', expiry:'~2032+', design_around:'K326W/E333S (Direct C1q contact, weaker)'}},
{id:'fckih', cat:'Bispecific / Heterodimerization', tier:'T1', name:'Knobs-into-Holes (KiH)', alias:'T366W (Knob)/T366S/L368A/Y407V (Hole)', brief:'Steric complementarity in the CH3-CH3 interface drives heterodimerization of two different heavy chains.', examples:["Amivantamab", "Mosunetuzumab", "Teclistamab", "Glofitamab"], mechanism:'Steric complementarity in the CH3-CH3 interface drives heterodimerization of two different heavy chains.', receptors:'FcRn: Unaffected · FcgammaRs: Unaffected', tradeoffs:'The foundation of bispecific IgG design. Simple, effective, and now public domain.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/8875953/" target="_blank">PMID 8875953</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/9731797/" target="_blank">PMID 9731797</a>', ip:{holder:'Genentech', status:'Expired', expiry:'2016', design_around:'None required; widely used.'}},
{id:'fcself', cat:'FcgammaRIIb Selectivity', tier:'T2', name:'SELF (S267E/L328F)', alias:'S267E/L328F', brief:'Selectively enhances affinity for the inhibitory receptor FcgammaRIIb while reducing activating receptor binding.', examples:["Obexelimab", "VNRX-5133"], mechanism:'Selectively enhances affinity for the inhibitory receptor FcgammaRIIb while reducing activating receptor binding.', receptors:'FcgammaRIIb: 400-fold increase · FcgammaRIIIa: Reduced · FcgammaRIIa: Reduced', tradeoffs:'Ideal for autoimmune applications where B-cell inhibition is the goal.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/21441456/" target="_blank">PMID 21441456</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/28003361/" target="_blank">PMID 28003361</a>', ip:{holder:'Xencor', status:'Active', expiry:'~2028', design_around:'IgG2 backbone (natural IIb bias)'}},
{id:'fcn297q', cat:'Effector Silencing', tier:'T2', name:'N297Q (Aglycosylation)', alias:'N297Q', brief:'Removes the conserved glycosylation site, causing CH2 domain collapse and total loss of FcgammaR binding.', examples:["Glembatumumab vedotin (ADC)", "Several investigative antibodies"], mechanism:'Removes the conserved glycosylation site, causing CH2 domain collapse and total loss of FcgammaR binding.', receptors:'FcgammaRs: Abolished · C1q: Abolished', tradeoffs:'Cheaper manufacturing (can use E. coli), but Tm is reduced by ~6C. Good for ADCs.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/2471552/" target="_blank">PMID 2471552</a>', ip:{holder:'Public Domain', status:'Public', expiry:'N/A', design_around:'N/A'}},
{id:'fcxtend', cat:'Half-life Extension', tier:'T2', name:'Xtend (T307Q/N434A)', alias:'T307Q/N434A', brief:'Engineered for enhanced pH 6.', examples:["M254 (Momenta/J&J)"], mechanism:'Engineered for enhanced pH 6.0 binding to FcRn. Alternative to LS.', receptors:'FcRn_pH6: 7-10 fold increase · FcRn_pH7.4: Minimal', tradeoffs:'High-potency half-life extension with distinct IP from LS/YTE.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/20173738/" target="_blank">PMID 20173738</a>', ip:{holder:'Momenta (J&J)', status:'Active', expiry:'~2030', design_around:'LS (AstraZeneca, expiring)'}},
{id:'fclalagn', cat:'Effector Silencing', tier:'T3', name:'LALA-GN (L234A/L235A/N297G)', alias:'L234A/L235A/N297G', brief:'Combines hinge silencing (LALA) with aglycosylation (N297G) for extreme effector silence.', examples:[], mechanism:'Combines hinge silencing (LALA) with aglycosylation (N297G) for extreme effector silence.', receptors:'', tradeoffs:'Used when even trace effector activity (e.g. against T cells) must be avoided.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/26976769/" target="_blank">PMID 26976769</a>'},
{id:'fcdapa', cat:'Effector Silencing', tier:'T2', name:'DAPA (D265A/P329A)', alias:'D265A/P329A', brief:'Disrupts the upper CH2 region binding to FcgammaRs.', examples:[], mechanism:'Disrupts the upper CH2 region binding to FcgammaRs. Alternative to LALA.', receptors:'', tradeoffs:'Often used in MedImmune/AZ pipeline antibodies.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11096108/" target="_blank">PMID 11096108</a>', ip:{holder:'AstraZeneca', status:'Expiring', expiry:'2024-2026'}},
{id:'fcsdie', cat:'Effector Enhancement', tier:'T1', name:'SDIE (S239D/I332E)', alias:'S239D/I332E', brief:'The core Xencor enhancement pair.', examples:["Tafasitamab (Monjuvi)"], mechanism:'The core Xencor enhancement pair. Optimizes the electrostatic interface with FcgammaRIIIa.', receptors:'', tradeoffs:'Proven clinical efficacy for enhancing ADCC in B-cell malignancies.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/16537476/" target="_blank">PMID 16537476</a>', ip:{holder:'Xencor', status:'Active', expiry:'~2027'}},
{id:'fcd265a', cat:'Effector Silencing', tier:'T1', name:'D265A', alias:'D265A', brief:'Single point mutation that significantly reduces all FcgammaR binding.', examples:["Atezolizumab (uses N297Q, but D265A is similar)"], mechanism:'Single point mutation that significantly reduces all FcgammaR binding. Found in many clinical candidates.', receptors:'', tradeoffs:'Simple, low-impact silencing.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11096108/" target="_blank">PMID 11096108</a>'},
{id:'fce345k', cat:'CDC Enhancement', tier:'T2', name:'E345K (Complement Enhancement)', alias:'E345K', brief:'CH3 mutation that promotes Fc-Fc interaction, similar to E430G but at a different site.', examples:[], mechanism:'CH3 mutation that promotes Fc-Fc interaction, similar to E430G but at a different site.', receptors:'', tradeoffs:'Often paired with E430G for maximum CDC.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/25473098/" target="_blank">PMID 25473098</a>', ip:{holder:'Genmab', status:'Active'}},
{id:'fcv262e', cat:'FcgammaRIIb Selectivity', tier:'T3', name:'V262E/V264E', alias:'V262E/V264E', brief:'Favors FcgammaRIIb over FcgammaRIIa/IIIa.', examples:[], mechanism:'Favors FcgammaRIIb over FcgammaRIIa/IIIa.', receptors:'', tradeoffs:'Early selectivity variant, superseded by SELF.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/23389682/" target="_blank">PMID 23389682</a>'},
{id:'fcs228p', cat:'Subclass Engineering', tier:'T1', name:'S228P (IgG4 Hinge)', alias:'S228P', brief:'Stabilizes the IgG4 core hinge disulfide, preventing Fab arm exchange in vivo.', examples:["Pembrolizumab", "Nivolumab"], mechanism:'Stabilizes the IgG4 core hinge disulfide, preventing Fab arm exchange in vivo.', receptors:'', tradeoffs:'Mandatory for all clinical IgG4 antibodies.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/19749776/" target="_blank">PMID 19749776</a>'},
{id:'fce430gs440y', cat:'CDC Enhancement', tier:'T3', name:'E430G/S440Y', alias:'E430G/S440Y', brief:'S440Y adds additional stabilizing contacts to the hexamer ring.', examples:[], mechanism:'S440Y adds additional stabilizing contacts to the hexamer ring.', receptors:'', tradeoffs:'Next-gen HexaBody optimization.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/29538065/" target="_blank">PMID 29538065</a>'},
{id:'fcddkk', cat:'Bispecific / Heterodimerization', tier:'T2', name:'DD/KK (Electrostatic Steering)', alias:'K409D/K392D/D399K/E356K', brief:'Complementary charge pairs in CH3 drive heterodimerization.', examples:[], mechanism:'Complementary charge pairs in CH3 drive heterodimerization.', receptors:'', tradeoffs:'Avoids bulky Knob/Hole mutations; good thermal stability.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/20159975/" target="_blank">PMID 20159975</a>', ip:{holder:'Genmab / Amgen', status:'Active', expiry:'~2026-2030'}},
{id:'fcseed', cat:'Bispecific / Heterodimerization', tier:'T2', name:'SEEDbody', alias:'IgA/IgG CH3 strand exchange', brief:'Alternating strands of human IgG and IgA CH3 domains create asymmetrical interfaces that only heterodimerize.', examples:[], mechanism:'Alternating strands of human IgG and IgA CH3 domains create asymmetrical interfaces that only heterodimerize.', receptors:'', tradeoffs:'Very high purity (>99%) and stability.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/20139433/" target="_blank">PMID 20139433</a>', ip:{holder:'Merck KGaA', status:'Active'}},
{id:'fcs298ae333ak334a', cat:'Effector Enhancement', tier:'T1', name:'S298A/E333A/K334A (ALFA)', alias:'S298A/E333A/K334A', brief:'Triple mutation in CH2 that enhances FcgammaRIIIa binding.', examples:["Obinutuzumab (Gazyva - though afucosylation is more prominent)"], mechanism:'Triple mutation in CH2 that enhances FcgammaRIIIa binding. Early Genentech optimization.', receptors:'', tradeoffs:'Historical standard for ADCC enhancement.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11238752/" target="_blank">PMID 11238752</a>'},
{id:'fch435r', cat:'Purification / pH Engineering', tier:'T1', name:'H435R (Staph A non-binding)', alias:'H435R', brief:'Abolishes binding to Protein A; used for purification of bispecifics or to modulate half-life in IgG3 contexts.', examples:["Emicizumab (Hemlibra)"], mechanism:'Abolishes binding to Protein A; used for purification of bispecifics or to modulate half-life in IgG3 contexts.', receptors:'', tradeoffs:'Critical for multi-step Protein A purification of heterodimeric bispecifics.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11532822/" target="_blank">PMID 11532822</a>'},
{id:'fcrecycling', cat:'Half-life Extension', tier:'T1', name:'Recycling Ab (pH-dependent Ag binding)', alias:'None in Fc specifically, but paired with LS/YTE', brief:'Antigen-binding is pH-dependent (binds at 7.', examples:["Satralizumab (Enspryng)"], mechanism:'Antigen-binding is pH-dependent (binds at 7.4, releases at 6.0). Paired with FcRn enhancement to allow one antibody to neutralize multiple antigens.', receptors:'', tradeoffs:'The cutting edge of half-life engineering.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/20943719/" target="_blank">PMID 20943719</a>'},
{id:'fcl328w', cat:'FcgammaRIIb Selectivity', tier:'T3', name:'L328W (FcgammaRIIb Selective)', alias:'L328W', brief:'Increases affinity for IIb while maintaining or reducing IIIa.', examples:[], mechanism:'Increases affinity for IIb while maintaining or reducing IIIa.', receptors:'', tradeoffs:'Part of the SELF optimization path.', ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/21441456/" target="_blank">PMID 21441456</a>'},
];

const DEV_DATA = [
  // ── Physicochemical Properties ───────────────────────────
  {id:'d1', cat:'Physicochemical', risk:'medium',
   name:'pI (Isoelectric Point)', alias:'',
   range:'IgG typical: 5.5–9.5 · Optimal: 6.5–8.5',
   brief:'Net charge at physiological pH; predicts aggregation, viscosity, and colloidal stability.',
   calc:'Computed from AA sequence using Henderson-Hasselbalch equation (pKa from Bjellqvist table). Modeled on full VH/VL or Fab sequence.',
   threshold:'InSynBio flag: pI > 9.0 or < 5.5. Clinical median (AbRef-1142): 8.1.',
   interp:'High pI (>9) → net positive charge at pH 7.4 → electrostatic attraction to negatively charged cell membranes → non-specific binding, aggregation, and viscosity issues. Low pI (<5.5) → net negative → reduced FcRn interaction. Humanization typically shifts pI from murine (~9) toward human (~8).',
   tools:'InSynBio AbEvaluator; BioPython ProtParam; commercial tools: Reaxys pI calc'},
  {id:'d2', cat:'Physicochemical', risk:'low',
   name:'GRAVY (Grand Average of Hydropathicity)', alias:'GRAVY score',
   range:'Typical range: −0.6 to +0.2 · Most IgGs: −0.3 to −0.1',
   brief:'Average Kyte-Doolittle hydropathicity index; measures overall hydrophilicity of the protein.',
   calc:'GRAVY = Σ(hydropathy values for each AA) / sequence length. Uses Kyte-Doolittle scale (1982).',
   threshold:'Flag: GRAVY > 0 (unusually hydrophobic). Values near 0 indicate marginal hydrophilicity.',
   interp:'More negative = more hydrophilic = lower aggregation risk. Positive GRAVY is uncommon for IgGs and warrants investigation. Correlates loosely with PSH but is a sequence-only proxy — use SAP/PSH for structure-based analysis when PDB is available.',
   tools:'BioPython ProtParam; ExPASy ProtParam'},
  {id:'d3', cat:'Physicochemical', risk:'low',
   name:'Instability Index', alias:'Guruprasad index',
   range:'<40: predicted stable · ≥40: predicted unstable',
   brief:'Sequence-based predictor of in vitro protein stability based on dipeptide composition.',
   calc:'Based on frequency of 400 dipeptides weighted by their contribution to instability (Guruprasad et al. 1990). Applied to VH, VL, or full Fab sequence.',
   threshold:'InSynBio flag: >40. Note: this metric has known limitations — interpret alongside wet-lab Tm data.',
   interp:'Original training data from in vitro instability assays. Poor predictor of thermal stability (Tm) alone. Useful as a supplementary flag when combined with other metrics. Antibodies with index 35–45 are borderline; wet-lab Tm measurement recommended.',
   tools:'ExPASy ProtParam; EMBOSS Pepstats'},
  {id:'d4', cat:'Physicochemical', risk:'medium',
   name:'Net Charge at pH 7.4', alias:'Z-charge',
   range:'Most therapeutic IgGs: −5 to +10',
   brief:'Sum of ionizable residue charges at physiological pH; directly impacts viscosity and formulation.',
   calc:'Titrated using Henderson-Hasselbalch with pKa assignments for Asp (3.9), Glu (4.1), His (6.5), Lys (10.5), Arg (12.5), Tyr (10.1), N-term (8.0), C-term (3.1).',
   threshold:'Flag: net charge > +15 (high viscosity risk). Optimal range for SC formulation: −5 to +5.',
   interp:'Highly positive antibodies (>+10) tend to show higher viscosity at high concentration (>100 mg/mL), problematic for SC injection. Positively charged patches also increase non-specific cell binding. Negatively charged antibodies may aggregate at low ionic strength.',
   tools:'InSynBio AbEvaluator; PROPKA 3.0; Vienna AbDesign'},

  // ── Aggregation Propensity ───────────────────────────────
  {id:'d5', cat:'Aggregation Propensity', risk:'high',
   name:'SAP (Spatial Aggregation Propensity)', alias:'SAP score',
   range:'Per-residue score; CDR hotspot SAP > 0.5 is flagged',
   brief:'Structure-based 9-mer sliding window identifying exposed hydrophobic patches that drive aggregation.',
   calc:'Computes solvent accessibility (SASA) for each residue using a probe radius 1.4 Å. A 9-residue window centered on each position scores neighboring hydrophobic exposure. Requires 3D structure (PDB or model).',
   threshold:'InSynBio flag: any CDR position with SAP > 0.5 over a 9-mer window. FR SAP > 1.0 is flagged separately.',
   interp:'SAP directly reflects aggregation-prone regions on the antibody surface. CDR hotspots are particularly problematic as they coincide with the antigen-binding site — mutations to reduce SAP must be validated for retained affinity. FR-SAP patches are more readily mutagenized.',
   tools:'InSynBio AbEvaluator; Sankar et al. Protein Eng Des Sel 2018; Chennamsetty et al. PNAS 2009'},
  {id:'d6', cat:'Aggregation Propensity', risk:'high',
   name:'PSH (Patches of Surface Hydrophobicity)', alias:'PSH · SHM',
   range:'Reference range from AbRef database; flag: top 20% of clinical distribution',
   brief:'Total hydrophobic surface area exposed on Fv; larger patches correlate with aggregation and non-specific binding.',
   calc:'Identifies contiguous hydrophobic residues (GRAVY > 0) on solvent-exposed surfaces. Clusters of ≥3 exposed hydrophobic residues within 5 Å are scored as a "patch." Summed over the full Fv surface.',
   threshold:'Flag: PSH > 80th percentile of AbRef-1142. Absolute threshold varies by antibody size.',
   interp:'PSH is a stronger aggregation predictor than GRAVY when structure is available. Combined use with SAP provides complementary single-residue and patch-level risk assessment. Relevant for formulation development (temperature, excipients).',
   tools:'TAP server (Raybould et al.); InSynBio AbEvaluator; Palivizumab PSH benchmark'},
  {id:'d7', cat:'Aggregation Propensity', risk:'medium',
   name:'PPC (Patches of Positive Charge)', alias:'PPC',
   range:'Flag: PPC > 75th percentile of clinical antibody distribution',
   brief:'Clustered positive-charge patches on Fv surface; correlates with non-specific binding and heparin retention.',
   calc:'Identifies surface-exposed Lys/Arg/His residues within 5 Å of each other. Total solvent-accessible positive charge summed across Fv surface. Includes FR and CDR contributions.',
   threshold:'Flag: PPC > clinical 75th percentile. Particularly relevant for VH-CDR3 basic clusters.',
   interp:'Positively charged CDRs are more common in VHH and some heavy-chain antibodies. High PPC is associated with: (1) polyspecificity/non-specific binding; (2) injection site pain for SC formulation; (3) elevated viscosity. Evaluate in tandem with net charge.',
   tools:'TAP server; InSynBio AbEvaluator; Haidar et al. MAbs 2014'},
  {id:'d8', cat:'Aggregation Propensity', risk:'medium',
   name:'PNC (Patches of Negative Charge)', alias:'PNC',
   range:'Flag: PNC > 75th percentile of clinical antibody distribution',
   brief:'Clustered negative-charge patches; associated with aggregation at acidic pH and formulation challenges.',
   calc:'Surface-exposed Asp/Glu residues within 5 Å clusters. Relevant particularly for antibodies formulated at pH 5.0–6.0 (common lyophilized or liquid formats).',
   threshold:'Flag: PNC > clinical 75th percentile.',
   interp:'Negatively charged patches can drive aggregation in low-pH formulations (citrate, histidine buffers) through reduced electrostatic repulsion at low ionic strength. Relevant for multi-specific formats where isoelectric precipitation is a concern.',
   tools:'TAP server; InSynBio AbEvaluator'},

  // ── CDR Chemical Liability ────────────────────────────────
  {id:'d9', cat:'CDR Chemical Liability', risk:'high',
   name:'Deamidation (NG / NS)', alias:'Asn deamidation',
   range:'Critical: CDR-Asn in NG/NS/NG motif; FR deamidation lower priority',
   brief:'Asn → iso-Asp / Asp conversion under stress conditions; disrupts CDR conformation and potency.',
   calc:'Sequence scan for NG, NS, and NG+NxG motifs using IMGT-annotated CDR positions. NG has ~8-fold higher rate than NS. Surface-accessible Asn (SASA > 30%) in NG motif = high priority.',
   threshold:'InSynBio: any CDR NG or NS flagged as HIGH risk. NxS/T in FR flagged as MEDIUM.',
   interp:'Deamidation occurs chemically (cyclic succinimide intermediate) and enzymatically. Rate depends on neighboring residues: NG >> NS > NQ, NA. High temperature and neutral-high pH accelerate reaction. May cause potency loss in CDR-H2 (common NG in human antibodies). Mutations: N→Q (conservative) or N→S (removes risk but may affect binding).',
   tools:'InSynBio AbEvaluator; Pace et al. Protein Sci 2013; Bischoff & Kolbe J Chromatogr B 1994'},
  {id:'d10', cat:'CDR Chemical Liability', risk:'high',
   name:'Oxidation (Met / Trp)', alias:'Met/Trp oxidation',
   range:'Critical: CDR Met in any position; Trp in CDR-H3 or CDR-L1/L3',
   brief:'Met oxidation → methionine sulfoxide; Trp → kynurenine/hydroxytryptophan. Both reduce potency and shelf-life.',
   calc:'Sequence scan for Met (M) and Trp (W) in IMGT-annotated CDR positions. Met in FR2/FR3 at buried positions is lower risk. Surface-exposed CDR Met (SASA > 25%) = high priority.',
   threshold:'InSynBio: CDR Met or CDR Trp flagged as HIGH risk. FR buried Met as LOW.',
   interp:'Met oxidation is particularly common at CDR-H2 Met52 and during stressed stability studies (H2O2, peroxide, light exposure). Trp is susceptible to photo-oxidation (UV exposure). Both can reduce antigen binding by distorting CDR loop conformation. Mutations: M→L (conservative) or W→ no direct equivalent — typically tolerated by V→I type changes.',
   tools:'InSynBio AbEvaluator; Yan et al. J Pharm Sci 2009'},
  {id:'d11', cat:'CDR Chemical Liability', risk:'high',
   name:'CDR N-Glycosylation (NxS/T)', alias:'CDR glycan motif',
   range:'NxS/T in CDR: flagged HIGH. NxS/T in FR: flagged MEDIUM',
   brief:'Aberrant glycosylation in CDR introduces heterogeneity; may enhance or disrupt antigen binding depending on location.',
   calc:'NxS/T motif scan (N-P excluded) across IMGT CDR positions. Structural exposure (SASA) and context (buried/accessible) determine priority.',
   threshold:'InSynBio: any NxS/T in IMGT-annotated CDR = HIGH flag.',
   interp:'CDR N-glycosylation is unusual and usually unwanted. It creates glycoform heterogeneity that complicates analytical characterization. However, some therapeutic antibodies have CDR glycans that are part of the antigen-binding mechanism (e.g., some anti-HIV broadly neutralizing antibodies). For most mAbs: remove if possible by N→Q mutation. Confirm retention of binding in new CDR glycan context.',
   tools:'InSynBio AbEvaluator; NetNGlyc server; Bondt et al. Mol Cell Proteomics 2014'},
  {id:'d12', cat:'CDR Chemical Liability', risk:'high',
   name:'Asp Isomerization (DG / DS)', alias:'Asp isomerization',
   range:'DG: high risk · DS: moderate risk · DG in CDR-H3 = critical',
   brief:'Asp → iso-Asp or cyclic succinimide (adjacent G or S accelerates reaction); reduces antigen-binding potency.',
   calc:'Sequence scan for DG and DS in CDR positions. DG has ~5× faster rate than DS. Rate is pH-, temperature-, and structure-dependent.',
   threshold:'InSynBio: CDR DG = HIGH. CDR DS = MEDIUM. FR DG = MEDIUM.',
   interp:'DG isomerization is faster than deamidation (NG) and may be the dominant degradation pathway in CDR-H3. Conformational constraint in the adjacent residues modulates rate. Mutations: D→E (conservative, eliminates isomerization risk), or G→A (reduces flexibility, slows rate).',
   tools:'InSynBio AbEvaluator; Robinson & Rudd Curr Drug Targets 2012; Rehder et al. J Pharm Sci 2008'},
  {id:'d13', cat:'CDR Chemical Liability', risk:'high',
   name:'Free Cysteine (unpaired Cys)', alias:'Free thiol',
   range:'Any free Cys in VH/VL outside canonical disulfides = flagged',
   brief:'Unpaired Cys can form unwanted disulfide bonds, mixed disulfides with excipients, or adducts affecting product quality.',
   calc:'Structural assignment using canonical disulfide map (IMGT scheme). Cys not in intra-domain S-S bridge = free Cys. Confirmed by LC-MS for free thiol content.',
   threshold:'InSynBio: any free Cys in variable domain = HIGH flag (except engineered designs).',
   interp:'Free Cys can form: (1) mixed disulfides with glutathione (cysteinylation); (2) intermolecular disulfides → dimer aggregation; (3) intrachain scrambled disulfides. Common source: CDR-introduced Cys during phage display or site-directed mutagenesis. In ADC design, engineered free Cys (e.g., ThioMab C239) is intentional for conjugation — context matters.',
   tools:'InSynBio AbEvaluator; Lyubarskaya et al. Anal Chem 2006'},

  // ── Structural Metrics ───────────────────────────────────
  {id:'d14', cat:'Structural Metrics', risk:'medium',
   name:'VH-VL Packing Angle', alias:'β-barrel orientation angle',
   range:'Normal: 35°–47° (Chothia convention) · Flag: <30° or >52°',
   brief:'Angle between VH and VL β-sheet planes; deviations indicate compromised interface that may affect stability or antigen binding.',
   calc:'Calculated from PDB or AlphaFold model using the Chothia VH-VL orientation angle algorithm. References the conserved FR2 and FR4 β-strands. InSynBio pipeline: ABodyBuilder2 → IMGT numbering → angle calculation.',
   threshold:'InSynBio flag: angle outside ±6° of median clinical value (40.5°). Post-humanization Δangle < 2° = acceptable.',
   interp:'Extreme angles indicate an unusual VH-VL packing that may destabilize the Fv or change CDR loop conformations. Common cause: incompatible germline pairing or aggressive back-mutation choices. Compare pre- and post-humanization angles. Clinical antibody database median: 40.5° (AbRef-1142).',
   tools:'InSynBio AbEvaluator; ABodyBuilder2; AbYsis VH-VL angle tool'},
  {id:'d15', cat:'Structural Metrics', risk:'medium',
   name:'pLDDT (AlphaFold confidence)', alias:'pLDDT per-residue',
   range:'High confidence: pLDDT ≥ 70 · Low: < 50',
   brief:'Per-residue confidence score from AlphaFold2/ABodyBuilder2 structural model; flags disordered or poorly predicted CDR regions.',
   calc:'Output of ABodyBuilder2 (ImmunoBuilder) antibody-specific structure prediction. Scores range 0–100 per residue. CDR-H3 typically has lower pLDDT than framework (less conserved).',
   threshold:'InSynBio flag: CDR-H3 average pLDDT < 50 (high model uncertainty). FR average should be > 70.',
   interp:'Low pLDDT in CDR-H3 indicates the model is uncertain — this reflects genuine conformational flexibility in long or unusual CDR-H3 loops, not a defect. High pLDDT across CDRs supports structural interpretation of docking, interface analysis, and back-mutation decisions. FR pLDDT < 60 suggests structural anomalies worth investigating.',
   tools:'ABodyBuilder2 (Abanades et al. 2023); AlphaFold2; OpenFold'},
  {id:'d16', cat:'Structural Metrics', risk:'low',
   name:'SFvCSP (Fv Colloidal Stability Parameter)', alias:'SFvCSP',
   range:'Flag: SFvCSP outside ±1 SD of AbRef distribution',
   brief:'Whole-Fv colloidal stability metric integrating charge and hydrophobicity surface distribution.',
   calc:'Combines Fv surface charge asymmetry with patch hydrophobicity distribution. Requires 3D structure. Proprietary score normalized against InSynBio AbRef-1142 database.',
   threshold:'InSynBio: SFvCSP Z-score > +1.5 or < −1.5 is flagged.',
   interp:'High SFvCSP (abnormal) → elevated risk of viscosity issues or aggregation at high concentration. Useful as a composite CMC summary metric in the full evaluation report. Not computed for sequence-only submissions.',
   tools:'InSynBio AbEvaluator (in-house); inspired by Bodnarchuk et al. J Phys Chem B 2020'},
  {id:'d17', cat:'Physicochemical', risk:'medium',
   name:'BVP (Baculovirus Particle) Binding', alias:'BVP Score',
   range:'Flag: Top 10% of clinical distribution',
   brief:'Measures non-specific binding to baculovirus particles; high-confidence proxy for in vivo clearance and off-target toxicity.',
   calc:'Experimental readout from ELISA or BLI using BVP as reagent. Computational proxy: Fv surface charge asymmetry + hydrophobic patch size.',
   threshold:'Flag: Top 10% of clinical mAbs. Correlates with rapid clearance in humans.',
   interp:'High BVP binding indicates a "sticky" antibody likely to have poor PK and potential off-target safety issues. Critical for ADC and multi-specific formats.',
   tools:'In vitro: BVP-ELISA; In silico: InSynBio stickiness-score'},
  {id:'d18', cat:'Aggregation Propensity', risk:'high',
   name:'AC-SINS (Self-Interaction)', alias:'AC-SINS shift',
   range:'Typical: < 2 nm shift · Flag: > 4 nm shift',
   brief:'Gold nanoparticle-based assay measuring antibody self-association at high concentration.',
   calc:'Measures plasmon resonance wavelength shift (nm) when antibody is conjugated to gold nanoparticles. Greater shift = higher self-interaction.',
   threshold:'Flag: > 2.0 nm shift relative to reference (e.g., palivizumab). High risk for viscosity and aggregation.',
   interp:'AC-SINS is highly predictive of viscosity at concentrations > 100 mg/mL. Essential for subcutaneous formulation development.',
   tools:'In vitro: Gold nanoparticle spectroscopy; In silico: SAP score (local aggregation hotspots)'},
];

const IMMUNO_DATA = [
  // ── Sequence-based ────────────────────────────────────────
  {id:'i1', cat:'Sequence-based', risk:'high',
   name:'T-cell Epitopes (MHC-II Binding)', alias:'HLA-II epitopes',
   brief:'Framework or CDR peptides that bind MHC-II → activate CD4+ T helper cells → ADA class-switch.',
   mechanism:'9-mer peptides from VH/VL FR/CDR regions are presented by antigen-presenting cells on MHC-II alleles. Peptides binding multiple alleles (promiscuous binders) are highest risk. T-cell help is required for high-affinity ADA (IgG isotype).',
   detection:'IEDB 27-allele HLA prediction (NetMHCII, NN-align). InSynBio: EL4 percentile threshold per allele. Also: EpiMatrix (Epivax), iTope (Antitope).',
   mitigation:'Germline-aligning humanization eliminates most framework T-cell epitopes. CDR deimmunization (T→S, N→Q) if CDR carries epitope — with caution to preserve binding. Regulatory: T-cell epitope prediction is requested in FDA guidance for biologic IMPs.',
   ref:'Jones et al. J Clin Oncol 2016; Deehan et al. Clin Immunol 2015'},
  {id:'i2', cat:'Sequence-based', risk:'high',
   name:'Germline Identity (%)', alias:'Human germline identity',
   brief:'% sequence identity to nearest human germline IGHV/IGKV/IGLV allele; proxy for immunogenic non-self residues.',
   mechanism:'Murine-origin residues in FR regions are the primary source of T-cell epitopes in chimeric/poorly humanized antibodies. The lower the human germline identity, the more murine-like the framework and the higher the ADA risk.',
   detection:'BLAST vs IMGT/GENE-DB human germline allele database. InSynBio threshold: VH < 85% or VL < 80% → humanization recommended.',
   mitigation:'CDR grafting + back-mutations targeting Vernier zone. Humanization protocol: AbEngineCore V4.4. Goal: VH ≥ 90%, VL ≥ 90% identity to nearest human germline.',
   ref:'Hwang & Foote Methods 2005; Almagro & Fransson Front Biosci 2008'},
  {id:'i3', cat:'Sequence-based', risk:'medium',
   name:'CDR Length & Composition', alias:'CDR novelty',
   brief:'Longer, unusual CDR sequences (especially CDR-H3) increase immunogenic peptide diversity.',
   mechanism:'CDR-H3 encodes the most diverse sequences in the antibody repertoire. Very long CDR-H3 (>18 aa) or unusual CDR compositions create novel peptides not found in human germline context — potentially presented as foreign by MHC-II.',
   detection:'IMGT CDR annotation + length distribution comparison vs clinical antibody database (AbRef-1142). Composition analysis: aromatic/basic/charged residue enrichment in CDR context.',
   mitigation:'CDR composition is generally preserved during humanization (CDRs are not humanized). However, deimmunization of CDR MHC-II epitopes is possible when epitope overlaps CDR without compromising paratope residues.',
   ref:'Kabat et al. NIH Pub 1991; Marks et al. Nat Biotechnol 2021'},

  // ── Structural / Physical ────────────────────────────────
  {id:'i4', cat:'Structural / Physical', risk:'high',
   name:'Protein Aggregates', alias:'HMW species / oligomers',
   brief:'Aggregated antibody is among the strongest immunogenicity triggers; bypasses T-cell tolerance mechanisms.',
   mechanism:'Aggregates present repetitive epitope arrays that can directly crosslink B-cell receptors (T-independent pathway) even without T-cell help. This can trigger ADA to epitopes that are normally tolerized in monomer form.',
   detection:'DLS (hydrodynamic radius), SEC-MALS (HMW %), turbidity. In silico: SAP + PSH predict aggregation-prone regions before wet lab.',
   mitigation:'Reduce SAP/PSH by surface hydrophobicity engineering or formulation optimization (excipients, pH, ionic strength). Forced degradation studies recommended for all clinical candidates.',
   ref:'Rosenberg Embo Mol Med 2014; Ratanji et al. J Immunotoxicol 2014; Joubert et al. J Pharm Sci 2012'},
  {id:'i5', cat:'Structural / Physical', risk:'medium',
   name:'Surface Hydrophobicity (SASA-based)', alias:'Exposed hydrophobic surface',
   mechanism:'Hydrophobic patches on antibody surface promote uptake by dendritic cells and macrophages via scavenger receptors, increasing the probability of antigen presentation on MHC-II.',
   brief:'High surface hydrophobicity correlates with non-specific protein uptake and enhanced MHC-II presentation of antibody-derived peptides.',
   detection:'PSH from structure; Parker hydrophilicity plot from sequence. InSynBio: SASA-based analysis (optional with PDB).',
   mitigation:'Minimize CDR/FR surface hydrophobicity through design (preferred germlines). Formulation with polysorbate 80 partially mitigates surface adsorption.',
   ref:'Chennamsetty et al. PNAS 2009; Chen et al. Protein Sci 2020'},

  // ── Glycosylation ────────────────────────────────────────
  {id:'i6', cat:'Glycosylation', risk:'medium',
   name:'Fc N297 Glycan Composition', alias:'N297 glycan · core fucose',
   brief:'Glycan variants at the conserved Fc N297 site affect immunogenicity through FcγR binding and complement activation.',
   mechanism:'Non-human glycan structures (e.g., α-1,3-galactose from murine/NS0 expression, Neu5Gc from CHO) are recognized as foreign by human anti-carbohydrate antibodies. CHO-expressed antibodies may contain Neu5Gc. α-Gal epitopes from murine hosts are highly immunogenic.',
   detection:'MALDI-TOF glycan profiling; LC-MS/MS glycopeptide analysis. Cell line screening: CHO-K1 has low Neu5Gc; NS0/Sp2/0 may have high α-Gal.',
   mitigation:'Use CHO or HEK293 expression for lowest non-human glycan risk. FUT8-KO CHO (afucosylation) changes ADCC profile but not immunogenicity risk. Avoid NS0/Sp2/0 for clinical programs when possible.',
   ref:'Chung et al. N Engl J Med 2008 (α-Gal/Neu5Gc); Ghaderi et al. Nat Biotechnol 2012'},
  {id:'i7', cat:'Glycosylation', risk:'medium',
   name:'CDR Glycosylation', alias:'Variable domain glycan',
   brief:'N-glycans in CDR can mask or expose epitopes, affecting both potency and immunogenicity.',
   mechanism:'CDR glycans are uncommon but structurally significant when present. They can shield T-cell epitopes (reducing immunogenicity) or — if non-human glycoforms are incorporated — introduce novel glycan immunogens.',
   detection:'NetNGlyc in silico prediction; LC-MS/MS glycopeptide characterization; cell-line specific glycan profiling.',
   mitigation:'If CDR glycan is functional (contributes to binding): use CHO/HEK for minimal non-human glycan risk. If CDR glycan is unwanted heterogeneity: N→Q mutation to remove.',
   ref:'van Berkel et al. Mol Immunol 2009; Bondt et al. Mol Cell Proteomics 2014'},

  // ── Administration & Clinical ────────────────────────────
  {id:'i8', cat:'Administration & Clinical', risk:'high',
   name:'Route of Administration', alias:'SC vs IV vs IM',
   brief:'Subcutaneous administration is ~2–5× more immunogenic than IV infusion due to dermal APC exposure.',
   mechanism:'SC injection deposits antibody in the subcutaneous adipose tissue where resident DCs, Langerhans cells, and macrophages are abundant. These APCs efficiently process and present antigen on MHC-II. IV bypasses peripheral APC exposure for most of the dose.',
   detection:'Clinical ADA monitoring data — SC antibodies consistently show higher ADA incidence in controlled trials (e.g., adalimumab SC vs IV data).',
   mitigation:'Optimize formulation for SC (pH 5.5–7.0, isotonic, low aggregates). Immunomodulatory co-administration (MTX for anti-TNF). PEGylation can reduce immunogenicity. SC device (pen/autoinjector) design minimizes aggregation during injection.',
   ref:'Buss et al. MAbs 2012; Vincent et al. Front Immunol 2017'},
  {id:'i9', cat:'Administration & Clinical', risk:'high',
   name:'Prior Sensitization / Pre-existing ADA', alias:'Pre-existing immunity',
   brief:'Anti-drug antibody responses are amplified in patients with pre-existing antibodies to the drug or structurally related proteins.',
   mechanism:'Previous exposure to the same or similar antibody (including earlier treatment cycles, biosimilar switching, or cross-reactive native sequences) can pre-sensitize patients. Memory B cells and long-lived plasma cells amplify ADA response on re-challenge.',
   detection:'Pre-dose ADA assay in Phase I/II. Bridging assay format for anti-idiotype detection. Clinical ADA surveillance per ICH S6(R1) and FDA guidance.',
   mitigation:'Structured washout periods for antibody switching. Immunomodulatory co-therapy. ADA-tolerized sequences (highly humanized, minimal T-cell epitopes).',
   ref:'ICH S6(R1); FDA Immunogenicity Guidance 2019; Mack et al. Clin Pharm 2019'},
  {id:'i10', cat:'Administration & Clinical', risk:'medium',
   name:'Disease State & Immune Status', alias:'Patient immunosuppression',
   brief:'Immunosuppressed patients (oncology, post-transplant) show lower ADA rates; autoimmune patients on immunomodulators show variable ADA.',
   mechanism:'ADA formation requires a functional adaptive immune response (T-cell help, B-cell activation). Chemotherapy, corticosteroids, and targeted immunosuppression all reduce ADA probability. Paradoxically, immunostimulatory conditions (active autoimmunity, adjuvant) may enhance immunogenicity.',
   detection:'Stratify ADA analysis by disease indication and concomitant immunosuppressive therapy in clinical trials.',
   mitigation:'Disease-specific ADA risk stratification in clinical design. For oncology: lower ADA threshold acceptable due to immunosuppression. For autoimmune: optimize sequence and formulation before Phase II.',
   ref:'Sheehan & Isaacs Autoimmun Rev 2020; Vultaggio et al. Curr Opin Allergy Clin Immunol 2018'},
  {id:'i11', cat:'Administration & Clinical', risk:'medium',
   name:'Dosing Frequency & Cumulative Dose', alias:'Dose regimen',
   brief:'Higher dosing frequency and cumulative dose increase ADA incidence for most therapeutic antibodies.',
   mechanism:'Each dose provides additional antigen for B-cell activation and T-cell priming. Intermittent dosing (e.g., every 3 months) may be less immunogenic than weekly dosing for some antibodies. Tolerance induction occurs with continuous high-dose regimens in some cases.',
   detection:'ADA time-course analysis in clinical trials — compare ADA positivity rate by dose cohort and treatment duration.',
   mitigation:'Optimize dosing interval (longer intervals may reduce immunogenicity for cytokine-targeting antibodies). High-dose continuous dosing can induce tolerance for some targets (anti-TNF experience).',
   ref:'Casadevall & Scharff Clin Infect Dis 1995; Schiff et al. Ann Rheum Dis 2006'},

  // ── Formulation & Manufacturing ──────────────────────────
  {id:'i12', cat:'Formulation & Manufacturing', risk:'high',
   name:'Oxidative Stress & Light Exposure', alias:'Photo-oxidation',
   brief:'Photo-oxidation of Trp/Met in CDR creates neo-epitopes with enhanced MHC-II binding.',
   mechanism:'UV and visible light convert Trp to kynurenine, kynurenic acid, or hydroxytryptophan. These modified residues form new antigenic epitopes in the CDR that were not present in the designed sequence — bypassing tolerance built to the original sequence.',
   detection:'Photo-stress stability study (ICH Q1B equivalent). LC-MS/MS for oxidized peptide mapping. InSynBio: Trp/Met in CDR flagged in chemical liability scan.',
   mitigation:'Amber/light-protective primary packaging. Reduce Trp/Met in CDR where tolerated. Antioxidant excipients (methionine, EDTA). Controlled nitrogen blanket in fill/finish.',
   ref:'Qi et al. J Pharm Sci 2009; Haberger et al. MAbs 2014'},
  {id:'i13', cat:'Formulation & Manufacturing', risk:'medium',
   name:'Excipient / Adjuvant Co-administration', alias:'Formulation components',
   brief:'Some excipients (polysorbates, silicone oil) can form sub-visible particles with protein, acting as adjuvants.',
   mechanism:'Silicone oil from prefilled syringe barrels can form protein-lipid aggregates. Polysorbate degradation products can co-precipitate with antibody. Particulate matter formed from these interactions creates depot-effect adjuvancy at the SC injection site.',
   detection:'Microflow imaging (MFI), nanoparticle tracking analysis (NTA), resonant mass measurement. Accelerated degradation of polysorbate-containing formulations.',
   mitigation:'Minimize silicone oil use (baked-on vs. sprayed syringe). Monitor polysorbate degradation (PS20 vs PS80 stability). Sub-visible particle threshold: USP <788>/<789>.',
   ref:'Demeule et al. Eur J Pharm Biopharm 2009; Shire SJ MAbs 2009'},
];

// ═══════════════════════════════════════════════════════════
// WET LAB VALIDATION DATA
// ═══════════════════════════════════════════════════════════
const WET_DATA = [
  // ── Developability · Physicochemical ─────────────────────
  {id:'w1', name:'Dynamic Light Scattering', alias:'DLS',
   cat:'Developability · Physicochemical',
   brief:'Measures particle size distribution and colloidal stability in solution. Primary screen for aggregation propensity.',
   principle:'Laser light is scattered by particles in solution; autocorrelation of intensity fluctuations gives hydrodynamic radius (Rh). Polydispersity index (PDI) reports size heterogeneity.',
   readout:'Z-average Rh (nm), PDI, % large-particle species. Flag: PDI > 0.2 or bimodal distribution.',
   compLink:'SAP (hydrophobic aggregation propensity), net charge (electrostatic repulsion), pI vs formulation pH gap',
   context:'ICH Q8/Q9 recommended for early formulation screening. Required by FDA for BLA CMC package (sub-visible particles section).',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/19219582/" target="_blank" rel="noopener">Shire SJ MAbs 2009</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/22327427/" target="_blank" rel="noopener">Chennamsetty et al. PNAS 2009</a>'},

  {id:'w2', name:'Size Exclusion Chromatography — HPLC', alias:'SEC-HPLC',
   cat:'Developability · Physicochemical',
   brief:'Gold-standard for quantifying monomer purity and soluble aggregate content. Orthogonal to DLS.',
   principle:'Proteins are separated by hydrodynamic volume through a porous stationary phase. UV absorbance (280 nm) quantifies each peak. Mobile phase pH and ionic strength affect resolution.',
   readout:'Monomer % (target ≥ 95%), HMW species %, LMW species %. Retention time shift indicates conformational change.',
   compLink:'SAP score, GRAVY (hydrophobicity), instability index — all predict aggregate-prone sequences',
   context:'ICH Q6B identity/purity test. Required for all IND/BLA submissions. Stability studies use SEC-HPLC to track aggregation kinetics at 4°C / 25°C / 40°C.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/17880699/" target="_blank" rel="noopener">Rosenberg AS AAPS J 2006</a>; USP <621>'},

  {id:'w3', name:'Differential Scanning Calorimetry / Fluorimetry', alias:'DSC / DSF (nanoDSF)',
   cat:'Developability · Physicochemical',
   brief:'Measures thermal unfolding transitions (Tm) of antibody domains. Predicts storage stability and formulation conditions.',
   principle:'DSC: measures excess heat capacity during temperature ramp. DSF/nanoDSF: monitors intrinsic Trp/Tyr fluorescence ratio (350/330 nm) shift during unfolding — no dye required. Tm of CH2, CH3, Fab domains resolved as separate transitions.',
   readout:'Tm1 (Fab), Tm2 (CH2), Tm3 (CH3) in °C. ΔTm between variants reflects stability impact of mutations. Onset temperature (Tonset) for formulation.',
   compLink:'Instability index (aliphatic / hydrophobic buried residues), pLDDT (structural confidence) — low pLDDT regions often correspond to low-Tm domains',
   context:'ICH Q8 formulation development. nanoDSF preferred for throughput screening; DSC for full characterization in BLA. Tm > 65°C (Fab) and > 70°C (CH2) are common industry thresholds.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/21445773/" target="_blank" rel="noopener">Ionescu et al. J Pharm Sci 2008</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/22327427/" target="_blank" rel="noopener">Freire E Methods Enzymol 1995</a>'},

  {id:'w4', name:'Hydrophobic Interaction Chromatography', alias:'HIC',
   cat:'Developability · Physicochemical',
   brief:'Separates antibody variants by surface hydrophobicity. Used to assess drug-like character and predict HIC-based purification behavior.',
   principle:'Proteins bind a hydrophobic resin under high-salt conditions; elution by decreasing ammonium sulfate gradient. More hydrophobic variants elute later. Retention time correlates with GRAVY and SAP scores.',
   readout:'Relative retention time vs. reference standard. Column: Butyl-S, Phenyl-HP. Flag: retention time > 15 min on Butyl-S column.',
   compLink:'GRAVY score (global hydrophobicity), PSH (patch surface hydrophobicity), SAP score',
   context:'Used in downstream process development to optimize capture chromatography. Strongly hydrophobic mAbs may cause manufacturing challenges (resin fouling, low yield). Also predicts subcutaneous injection site reactions.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/24695285/" target="_blank" rel="noopener">Haverick et al. mAbs 2014</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/21984298/" target="_blank" rel="noopener">Demeule et al. MAbs 2009</a>'},

  {id:'w5', name:'Cation Exchange Chromatography', alias:'CEX / IEX',
   cat:'Developability · Physicochemical',
   brief:'Resolves charge heterogeneity variants (acidic/basic peaks). Monitors deamidation, C-terminal Lys clipping, and oxidation in the context of charge state.',
   principle:'Proteins bind a negatively charged resin at low ionic strength; salt or pH gradient elutes variants by charge. Main peak flanked by acidic variants (deamidation, sialylation) and basic variants (C-terminal Lys, Met oxidation).',
   readout:'% acidic variants, % main peak, % basic variants. Stability trending: acidic peak growth rate reflects deamidation kinetics.',
   compLink:'pI (determines binding strength and elution position), deamidation sites (NG/NS motifs), oxidation (Met/Trp)',
   context:'ICH Q6B charge heterogeneity test. CEX profile is a key release and stability assay in BLA. Acidic peak > 20% often triggers investigation.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/17139657/" target="_blank" rel="noopener">Harris RJ J Chromatogr B 2005</a>; USP <1053>'},

  // ── Developability · Chemical Liability ──────────────────
  {id:'w6', name:'Peptide Mapping — LC-MS/MS', alias:'Peptide Map / PTM Analysis',
   cat:'Developability · Chemical Liability',
   brief:'Identifies and quantifies post-translational modifications (PTMs) at residue level. Gold standard for chemical liability characterization.',
   principle:'Antibody is digested with trypsin (± Lys-C). Resulting peptides are separated by reverse-phase HPLC and identified by high-resolution MS/MS (Orbitrap or Q-TOF). Modified peptides identified by mass shift: +0.984 Da (deamidation), +15.995 Da (oxidation), +0.5 Da (Asp isomerization).',
   readout:'% modification at each site (e.g., "N55 deamidation: 3.2% at t=0, 18.7% at 40°C/4wk"). Hotspot: NG/NS deamidation, DG/DS isomerization, Met/Trp oxidation, free Cys.',
   compLink:'CDR deamidation flags (NG/NS), oxidation flags (Met/Trp), Asp isomerization (DG/DS), free Cys count — all from InSynBio sequence analysis',
   context:'FDA expects peptide map data in BLA CMC for each PTM hotspot identified in silico. Forced oxidation (H₂O₂) and deamidation (pH 9, 40°C) studies with peptide map readout are standard.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/19813233/" target="_blank" rel="noopener">Pan H et al. Biotechnol Bioeng 2009</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/25102867/" target="_blank" rel="noopener">Vlasak J, Ionescu R MAbs 2011</a>'},

  {id:'w7', name:'Forced Degradation Study', alias:'Stress Testing / Accelerated Stability',
   cat:'Developability · Chemical Liability',
   brief:'Deliberately stresses antibody under heat, oxidation, light, pH, and freeze-thaw to reveal degradation pathways before clinical manufacturing.',
   principle:'ICH Q1A(R2) stress conditions: thermal (40°C/75% RH, 6 months), oxidative (0.03–0.3% H₂O₂), photolytic (ICH Q1B), acidic/basic pH excursions, freeze-thaw cycling (≥5 cycles, −80°C/+25°C). Degradation products characterized by SEC-HPLC, CEX, and peptide mapping.',
   readout:'Degradation rate constants, primary degradation pathway identification, formulation excipient protective effects. Orthogonal analytics: SEC (aggregation), CEX (charge), DLS (particle size).',
   compLink:'All sequence-based liabilities (NG deamidation, Met oxidation, DG isomerization, CDR glycosylation sites) are prioritized stress testing targets. Computationally flagged sites validated by forced degradation kinetics.',
   context:'ICH Q1A(R2) and Q8 mandatory for IND filing. Results define shelf-life and formulation conditions. FDA/EMA expect forced degradation data to support proposed degradation pathways in BLA.',
   ref:'ICH Q1A(R2) 2003; <a href="https://pubmed.ncbi.nlm.nih.gov/19816943/" target="_blank" rel="noopener">Kerwin BA, Remmele RL Jr J Pharm Sci 2007</a>'},

  // ── Immunogenicity ────────────────────────────────────────
  {id:'w8', name:'EpiScreen™ / DC-T Cell Assay', alias:'PBMC T-cell Proliferation / DC-T Assay',
   cat:'Immunogenicity · T-Cell Epitopes',
   brief:'Ex vivo human PBMC-based assay that directly measures T-cell proliferative responses to antibody peptide pools. Functional validation of in silico MHC-II epitope predictions.',
   principle:'Peptide library (15-mer overlapping, spanning full antibody sequence) is incubated with donor PBMCs (≥50 HLA-DR diverse donors). T-cell proliferation (³H-thymidine or CFSE dilution) or cytokine secretion (IFN-γ ELISPOT) measured after 7–10 days. Stimulation Index (SI) ≥ 2.0 defines positive epitope.',
   readout:'SI per peptide per donor; % donors responding; epitope map overlaid on antibody sequence. Compare parent vs. humanized antibody.',
   compLink:'Directly validates InSynBio MHC-II 27-allele IEDB prediction — SI-positive regions should overlap with high-risk MHC-II clusters. Used to confirm that humanization reduced immunogenicity.',
   context:'Antitope EpiScreen™ and Lonza EpiVax are commercial platforms. MHRA/EMA guidance encourages T-cell assay data for biosimilars and novel mAbs with high immunogenicity risk.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/15882712/" target="_blank" rel="noopener">Stickler MM et al. J Immunother 2004</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/19916168/" target="_blank" rel="noopener">Jawa V et al. Clin Immunol 2013</a>'},

  {id:'w9', name:'ADA Detection — ECL Bridging Assay', alias:'Anti-Drug Antibody (ADA) Assay / MSD',
   cat:'Immunogenicity · T-Cell Epitopes',
   brief:'Gold-standard clinical assay for detecting anti-drug antibodies (ADA) in patient serum samples. Required for all clinical biologic programs.',
   principle:'Electrochemiluminescence (ECL) bridging format: drug is coated as capture and labeled as detection. ADA in serum bridges both — signal proportional to ADA titer. MSD SECTOR platform preferred for sensitivity. Cut-point established from pre-dose samples.',
   readout:'Screening positive rate (%), confirmatory positive rate (%), titer (dilution at cut-point), time to onset, persistence. Neutralizing ADA (NAb) in separate assay.',
   compLink:'Validating all immunogenicity predictions: germline identity, MHC-II risk, aggregation, and immunodominant epitope mapping. Clinical ADA incidence is the ultimate readout of in silico immunogenicity score.',
   context:'FDA Immunogenicity Guidance 2019 and EMA Guideline on Immunogenicity require ADA monitoring in all Phase I–III trials. Tier 1: screening → Tier 2: confirmatory → Tier 3: titer → Tier 4: NAb.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/29236280/" target="_blank" rel="noopener">FDA Immunogenicity Guidance 2019</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/24860609/" target="_blank" rel="noopener">Mire-Sluis AR et al. J Immunol Methods 2004</a>'},

  {id:'w10', name:'Neutralizing ADA (NAb) Assay', alias:'NAb / Cell-Based Neutralization Assay',
   cat:'Immunogenicity · T-Cell Epitopes',
   brief:'Detects ADA that block drug pharmacological activity. Critical for differentiating non-neutralizing binding ADA from clinically impactful neutralizing ADA.',
   principle:'Cell-based reporter assay: drug-responsive cell line (e.g., STAT-luciferase) is exposed to drug + patient serum. NAb in serum reduces drug-induced reporter signal. Ligand-binding assay (LBA) format used when cell-based is not feasible.',
   readout:'% inhibition, NAb titer (dilution at 50% inhibition). Clinical impact correlates with NAb titer and PK/PD loss.',
   compLink:'Epitope location matters: CDR-targeted ADA is more likely to be neutralizing. InSynBio paratope residue analysis helps predict whether immunogenic regions overlap with antigen-binding site.',
   context:'FDA requires NAb assay for all biologics with evidence of ADA. Particularly critical for cytokine/enzyme replacement therapies. NAb-positive patients may require dose adjustment or discontinuation.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/25319741/" target="_blank" rel="noopener">Shankar G et al. AAPS J 2014</a>; FDA Immunogenicity Guidance 2019'},

  {id:'w11', name:'MHC-II Peptide Binding Assay', alias:'In Vitro MHC-II Binding / REVEAL Assay',
   cat:'Immunogenicity · T-Cell Epitopes',
   brief:'Direct biochemical measurement of peptide binding affinity to purified MHC-II alleles. Validates and refines in silico MHC-II epitope predictions.',
   principle:'Competitive binding assay: test peptides compete with a fluorescently labeled reference peptide for binding to purified HLA-DR alleles. IC₅₀ determined. Alternatively, TR-FRET or AlphaLISA format. Epivax REVEAL platform provides multi-allele coverage.',
   readout:'IC₅₀ (nM) per peptide-allele pair; binding percentile rank vs. IEDB background. Binders with IC₅₀ < 1000 nM considered significant.',
   compLink:'Direct validation of InSynBio 27-allele IEDB prediction output. High-risk predicted peptides should show IC₅₀ < 500 nM in binding assay. Used to prioritize which predicted epitopes to address by humanization.',
   context:'Used in deimmunization and epitope removal programs. EMA Guideline on Immunogenicity Assessment recommends in vitro peptide binding data to support clinical risk stratification for novel modalities.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/19028671/" target="_blank" rel="noopener">Sturniolo T et al. Nat Biotechnol 1999</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/15882712/" target="_blank" rel="noopener">Jones TD et al. J Immunol 2004</a>'},

  // ── Fc Function ───────────────────────────────────────────
  {id:'w12', name:'ADCC Reporter Assay', alias:'Jurkat NFAT-Luciferase / ADCC Bioassay',
   cat:'Fc Function · Effector Activity',
   brief:'High-throughput cell-based assay for antibody-dependent cellular cytotoxicity (ADCC). Primary functional readout for FcγRIIIa-enhancing mutations (GASDALIE, afucosylation, S239D/I332E).',
   principle:'Engineered Jurkat effector cells express FcγRIIIa (V158 high-affinity allele) and NFAT-luciferase reporter. Antibody-coated target cells activate Jurkat via FcγRIIIa crosslinking → NFAT → luciferase signal. EC₅₀ and Emax compared vs. reference standard.',
   readout:'EC₅₀ (nM), Emax (% max activity), relative ADCC activity (% vs. reference). Afucosylated variants typically show 10–100× lower EC₅₀ than fucosylated.',
   compLink:'Directly validates Fc mutation category "ADCC/ADCP Enhancement" (GASDALIE, S239D/I332E, K326W/E333S) and afucosylation. Computational prediction of FcγRIIIa contact residues (EU 234–239, 298, 332) matches ADCC activity.',
   context:'Promega ADCC Reporter Bioassay is FDA-accepted for biosimilar ADCC comparability. Required for all ADCC-enhancing antibody programs. ICH Q6B functional characterization.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/17537386/" target="_blank" rel="noopener">Shields RL et al. J Biol Chem 2001</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/12370378/" target="_blank" rel="noopener">Lazar GA et al. PNAS 2006</a>'},

  {id:'w13', name:'FcRn Binding Assay — SPR / BLI', alias:'FcRn SPR / Biacore / Octet',
   cat:'Fc Function · Half-Life',
   brief:'Measures Fc–FcRn binding affinity at pH 6.0 (endosomal, on-rate for recycling) and pH 7.4 (blood, off-rate for release). Key functional assay for half-life extending mutations (LS, YTE).',
   principle:'Surface Plasmon Resonance (SPR, Biacore): FcRn immobilized on chip; antibody flowed at pH 6.0 to measure kon and koff. Wash at pH 7.4 to measure endosomal release rate. BLI (Octet): FcRn on biosensor tip. High pH 6.0 affinity + fast pH 7.4 release = longer half-life.',
   readout:'KD at pH 6.0 (nM), off-rate (koff) at pH 7.4. LS mutation: ~10× increase in FcRn affinity at pH 6.0 vs. WT IgG1. YTE: ~10× increase (human FcRn).',
   compLink:'Directly validates LS (M428L/N434S) and YTE (M252Y/S254T/T256E) mutation engineering goals. Computational FcRn contact residue analysis (EU 252, 254, 256, 428, 433, 434) predicts which mutations improve binding.',
   context:'FDA expects FcRn binding data for any antibody with engineered half-life modifications. Cynomolgus monkey FcRn (cross-reactive with LS/YTE) used for PK prediction. Species differences important: YTE has weaker effect in mice.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/20622100/" target="_blank" rel="noopener">Dall\'Acqua WF et al. J Biol Chem 2006</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/20038795/" target="_blank" rel="noopener">Zalevsky J et al. Nat Biotechnol 2010</a>'},

  {id:'w14', name:'FcγR Binding Panel — SPR', alias:'FcγR Panel / Biacore Multi-Cycle',
   cat:'Fc Function · Effector Activity',
   brief:'Quantifies binding affinity to all five human FcγRs (FcγRIa, IIa-H131, IIa-R131, IIb, IIIa-V158, IIIa-F158, IIIb) in a single SPR experiment. Defines the effector function profile of any Fc variant.',
   principle:'SPR multi-cycle kinetics with recombinant human FcγRs immobilized on separate flow cells. Antibody injected as analyte. KD measured for each receptor. LALA/LALAPG/N297A variants show complete loss of FcγRIIIa and FcγRIIa binding. Afucosylated shows selective FcγRIIIa enhancement.',
   readout:'KD (nM) per FcγR allele. FcγRIIb:FcγRIIa ratio (selectivity index for immunomodulatory antibodies). Complete binding profile used to predict ADCC, ADCP, and cytokine release risk.',
   compLink:'Validates all Fc engineering categories: silencing (LALA, LALAPG, N297A/G → no FcγR binding), ADCC enhancement (GASDALIE, S239D/I332E → FcγRIIIa selectively improved), bispecific (KiH → heterodimer confirmed by asymmetric SPR).',
   context:'FDA/EMA require FcγR panel for BLA CMC of any Fc-engineered antibody. Biosimilar comparability exercises require FcγR binding comparability to originator. FcγRIIb engagement relevant for agonist CD40/OX40 antibodies.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11101895/" target="_blank" rel="noopener">Bruhns P et al. Blood 2009</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/15273120/" target="_blank" rel="noopener">Nimmerjahn F, Ravetch JV J Exp Med 2005</a>'},

  {id:'w15', name:'Fc Glycan Profiling — LC-MS', alias:'N-Glycan Analysis / HILIC-FLR-MS',
   cat:'Fc Function · Glycosylation',
   brief:'Characterizes the N-glycan composition at Asn297 (EU). Essential for confirming afucosylation, monitoring glycan batch consistency, and assessing impact on FcγRIIIa binding and ADCC.',
   principle:'Released glycans (PNGase F digest) labeled with 2-AB or RapiFluor-MS fluorescent tag, separated by HILIC (hydrophilic interaction) HPLC with fluorescence detection, identified by MS. Main glycoforms: G0F, G1F, G2F (fucosylated); G0, G1, G2 (afucosylated); Man5–9 (high mannose); A2G2S2 (sialylated).',
   readout:'% each glycoform; core fucosylation % (target < 10% for afucosylated products, e.g., obinutuzumab). Sialylation %, high mannose % (affects clearance rate).',
   compLink:'N297 glycosylation flag: if CDR contains NxS/T motif, it can also be glycosylated — peptide map + glycan profiling needed to confirm. Fc N297A mutation: glycan profiling confirms aglycosylation and FcγR silencing.',
   context:'ICH Q6B glycan characterization required. FDA expects glycan profile comparability for biosimilars. Afucosylation achieved by CHO FUT8 knockout (e.g., Potelligent®) or GnTIII overexpression (e.g., glycoengineering). High mannose increases ADCC but reduces serum half-life via SIGN-R1 clearance.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/12370378/" target="_blank" rel="noopener">Umana P et al. Nat Biotechnol 1999</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/17537386/" target="_blank" rel="noopener">Shields RL et al. J Biol Chem 2002</a>'},

  {id:'w16', name:'CDC Assay — Complement-Dependent Cytotoxicity', alias:'CDC / C1q Binding ELISA',
   cat:'Fc Function · Effector Activity',
   brief:'Measures antibody-mediated complement activation and target cell lysis. Relevant for mutations that enhance (K326W/E333S) or silence (DAPA) complement activity.',
   principle:'Target cells incubated with antibody + human serum (complement source). Cell lysis measured by LDH release or calcein-AM fluorescence loss. C1q ELISA separately measures direct C1q binding affinity. DAPA (D265A/P329A) and LALA mutations should show < 5% CDC vs. WT IgG1.',
   readout:'% specific lysis at antibody concentration range; EC₅₀. C1q binding: KD (nM) by ELISA. K326W/E333S shows 3–4× higher CDC vs. WT IgG1.',
   compLink:'Validates complement-modulating Fc mutations. DAPA / LALA / LALAPG computational prediction of FcγR + C1q silencing confirmed by CDC ≈ 0. K326W/E333S enhancement confirmed by elevated CDC and C1q KD.',
   context:'Required for CDC-dependent oncology antibodies (e.g., rituximab class). DAPA validation required if dual FcγR+complement silencing is claimed. ICH Q6B functional characterization for all cytotoxic mAbs.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/11805295/" target="_blank" rel="noopener">Idusogie EE et al. J Immunol 2001</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/18349143/" target="_blank" rel="noopener">Hezareh M et al. J Virol 2001</a>'},
  {id:'w17', name:'BVP Binding Assay', alias:'BVP-ELISA / BLI',
   cat:'Developability · Physicochemical',
   brief:'Quantifies non-specific binding to baculovirus particles as a proxy for polyspecificity and in vivo clearance.',
   principle:'Baculovirus particles are immobilized; antibody binding is measured by ELISA or Biolayer Interferometry (BLI). High BVP binding correlates with accelerated non-specific clearance.',
   readout:'Relative binding index (RBI) vs. reference mAbs (e.g., adalimumab as low, cetuximab as high).',
   compLink:'Fv stickiness score, SFvCSP, and net charge at physiological pH.',
   context:'Commonly used in early-stage candidate selection (Lead-Op) to de-risk PK. High BVP binding is a frequent cause of poor monkey-to-human PK translation.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/24492294/" target="_blank" rel="noopener">Hotzel et al. MAbs 2012</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/32646321/" target="_blank" rel="noopener">Jain et al. PNAS 2017</a>'},
  {id:'w18', name:'AC-SINS Assay', alias:'Gold Nanoparticle Self-Interaction',
   cat:'Developability · Physicochemical',
   brief:'High-throughput assay for measuring antibody self-interaction (self-association) propensity.',
   principle:'Antibodies are immobilized on gold nanoparticles; self-interaction causes particles to aggregate, shifting the surface plasmon resonance (SPR) wavelength. Shift magnitude reflects self-association strength.',
   readout:'Wavelength shift (Δλ, nm). Shift > 5 nm indicates high aggregation risk.',
   compLink:'SAP score (spatial aggregation propensity) and PSH (hydrophobic patches).',
   context:'Primary screen for high-concentration formulation (SC delivery). Correlates with viscosity and opalescence issues.',
   ref:'<a href="https://pubmed.ncbi.nlm.nih.gov/24492294/" target="_blank" rel="noopener">Sule et al. Mol Pharm 2013</a>; <a href="https://pubmed.ncbi.nlm.nih.gov/21984298/" target="_blank" rel="noopener">Demeule et al. MAbs 2009</a>'},
];

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let currentDomain = 'fc';
let searchTerm = '';
let catFilter = '';
let tierFilter = '';

// ═══════════════════════════════════════════════════════════
// DOMAIN CONFIG
// ═══════════════════════════════════════════════════════════
const DOMAINS = {
  adc_registry: {
    data: ADC_CLINICAL_DATA,
    note: '<strong>Clinical ADC Registry</strong> — Comprehensive database of approved and clinical-stage Antibody-Drug Conjugates. Includes target, conjugation tech, DAR, and latest clinical results.',
    catField: 'cat',
    cats: [...new Set(ADC_CLINICAL_DATA.map(d=>d.cat))].sort(),
    showTier: true,
    filterLabel: 'All Targets',
    card: renderFcCard,
  },
  adc: {
    data: ADC_DATA,
    note: '<strong>Antibody-Drug Conjugate (ADC) Components</strong> — Key linkers, payloads, and conjugation technologies used in clinical-stage ADCs. Includes mechanism of release, potency data, and clinical precedent.',
    catField: 'cat',
    cats: [...new Set(ADC_DATA.map(d=>d.cat))],
    showTier: false,
    filterLabel: 'All ADC Categories',
    card: renderFcCard,
  },
  fc: {
    data: FC_DATA,
    extraHtmlTop: renderFcSelectionGuide,
    note: '<strong>Fc Engineering Mutations</strong> — Each mutation entry shows its regulatory evidence tier (T1: approved drugs, T2: clinical trials, T3: preclinical), mechanism, affected receptors, commercial examples, and <strong>IP/patent status</strong> with design-around guidance. Use the category filter to focus on a specific engineering goal.<br><span style="font-size:12px;color:#6b7280;margin-top:6px;display:block;">⚖ <strong>IP status key:</strong> <span style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;padding:1px 7px;border-radius:10px;font-weight:700;">Public Domain / Expired</span> = freely usable &nbsp;·&nbsp; <span style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;padding:1px 7px;border-radius:10px;font-weight:700;">Expiring Soon</span> = core patent expiring within ~3 years &nbsp;·&nbsp; <span style="background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;padding:1px 7px;border-radius:10px;font-weight:700;">Active Patent</span> = in-force protection; license or design-around required. &nbsp;<em>For commercial use, always conduct a full Freedom-to-Operate (FTO) analysis in your target jurisdictions — patent status varies by country and continuation filings.</em></span><br><span style="font-size:12px;color:#6b7280;margin-top:4px;display:block;">📌 Mutations use <strong>EU numbering</strong> (Edelman). For full IgG1/IgG2/IgG4 Fc sequences: <a href="https://www.imgt.org/IMGTrepertoire/Proteins/protein/human/IGH/IGHC/Hu_IGHCall.html" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;">IMGT IgHC database →</a> &nbsp;|&nbsp; <a href="https://www.uniprot.org/uniprotkb/P01857" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;">UniProt IgG1 (P01857) →</a> &nbsp;|&nbsp; <a href="https://www.ncbi.nlm.nih.gov/protein/NP_000149" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;">NCBI RefSeq →</a></span>',
    catField: 'cat',
    cats: [...new Set(FC_DATA.map(d=>d.cat))],
    showTier: true,
    filterLabel: 'All Fc Categories',
    card: renderFcCard,
  },
  dev: {
    data: DEV_DATA,
    note: '<strong>Developability Assessment Metrics</strong> — 15 parameters across 4 categories. Each entry explains the calculation method, InSynBio threshold, clinical interpretation, and relevant tools.<br><span style="font-size:12px;color:#6b7280;margin-top:6px;display:block;">⚠ <strong>Risk level definition (CMC context):</strong> <span style="color:#b91c1c;font-weight:700;">High</span> = directly linked to IND/BLA failure or clinical holds in published cases (e.g., aggregation, deamidation potency loss). <span style="color:#92400e;font-weight:700;">Medium</span> = significant concern requiring investigation but manageable by formulation or design change. <span style="color:#166534;font-weight:700;">Low</span> = supplementary metric; flag alone rarely causes failure. All risk levels are calibrated against InSynBio AbRef-1142 clinical antibody database and published CMC literature.</span>',
    catField: 'cat',
    cats: [...new Set(DEV_DATA.map(d=>d.cat))],
    showTier: false,
    filterLabel: 'All Metric Categories',
    card: renderDevCard,
  },
  immuno: {
    data: IMMUNO_DATA,
    extraHtmlBottom: renderFcAdaStats,
    note: '<strong>Immunogenicity Risk Factors</strong> — 13 key determinants of anti-drug antibody (ADA) formation. Organized into: sequence-based (addressable by humanization/design), structural/physical (addressable by engineering), glycosylation, and clinical/formulation factors (patient- or process-dependent).<br><span style="font-size:12px;color:#6b7280;margin-top:6px;display:block;">⚠ <strong>Risk level definition (ADA context):</strong> <span style="color:#b91c1c;font-weight:700;">High</span> = directly associated with significantly increased ADA incidence in clinical data (e.g., T-cell epitopes, aggregates, SC route). <span style="color:#92400e;font-weight:700;">Medium</span> = contributes to ADA risk but effect size depends on indication, dose, and patient immune status. <span style="color:#166534;font-weight:700;">Low</span> = minor or indirect contribution. ⚠ Clinical factors (route, disease state, dosing) reflect patient/design decisions — not intrinsic sequence defects.</span>',
    catField: 'cat',
    cats: [...new Set(IMMUNO_DATA.map(d=>d.cat))],
    showTier: false,
    filterLabel: 'All Factor Categories',
    card: renderImmunoCard,
  },
  wet: {
    data: WET_DATA,
    note: '<strong>Wet Lab Validation Assays</strong> — 16 experimental assays across 4 categories, paired with corresponding InSynBio computational metrics. Each entry describes the assay principle, key readout parameters, which in silico predictions it validates, and its regulatory context (ICH/FDA/EMA).<br><span style="font-size:12px;color:#6b7280;margin-top:6px;display:block;">🔬 <strong>Dry-Wet Integration:</strong> InSynBio computational analysis identifies sequence liabilities and functional predictions <em>before</em> costly experiments are run. Use this tab to plan your experimental validation strategy after receiving an InSynBio report — prioritizing assays for flagged metrics to maximize efficiency.</span>',
    catField: 'cat',
    cats: [...new Set(WET_DATA.map(d=>d.cat))],
    showTier: false,
    filterLabel: 'All Assay Categories',
    card: renderWetCard,
  },
};

// ═══════════════════════════════════════════════════════════
// EXTRA HTML SECTIONS (Fc Selection Guide + ADA Stats)
// ═══════════════════════════════════════════════════════════
function renderFcSelectionGuide() {
  return `<div style="background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:20px;font-size:13px;margin-bottom:24px;">
    <div style="font-weight:700;margin-bottom:12px;color:#374151">📌 Fc Selection Quick Reference</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
      <div style="padding:14px;background:#fff;border-radius:8px;border-left:3px solid #0d9488"><div style="font-weight:700;font-size:12px;margin-bottom:4px">ADCC / CDC Required</div><div style="font-size:12px;color:#6b7280">IgG1 wild-type, or GASDALIE (S239D/I332E) enhanced; monitor infusion reaction risk</div></div>
      <div style="padding:14px;background:#fff;border-radius:8px;border-left:3px solid #7c3aed"><div style="font-weight:700;font-size:12px;margin-bottom:4px">Effector Function Ablation</div><div style="font-size:12px;color:#6b7280">LALA (L234A/L235A) or P329G; IgG4+S228P as alternative; standard for checkpoint inhibitors</div></div>
      <div style="padding:14px;background:#fff;border-radius:8px;border-left:3px solid #059669"><div style="font-weight:700;font-size:12px;margin-bottom:4px">Half-life Extension</div><div style="font-size:12px;color:#6b7280">LS (M428L/N434S) or YTE (M252Y/S254T/T256E); preferred for SC long-acting; note placental transfer</div></div>
      <div style="padding:14px;background:#fff;border-radius:8px;border-left:3px solid #d97706"><div style="font-weight:700;font-size:12px;margin-bottom:4px">Bispecific Antibody</div><div style="font-size:12px;color:#6b7280">Knob-into-Hole + disulfide optimization; or DuoBody F405L/K409R; monitor heterodimer purity</div></div>
    </div>
  </div>`;
}

const FC_ADA_STATS = [
  {grp:'IgG1 Wild-type (Normal Effector)', n:67, median:5.0, min:0.0, max:87.0, low_risk_n:45, color:'#0d9488', note:'Most common format; ADA rate heavily influenced by route of administration and indication'},
  {grp:'IgG2 / IgG4 (Reduced Effector)',  n:39, median:5.6, min:0.0, max:42.9, low_risk_n:24, color:'#0891b2', note:'IgG4 often used for SC dosing; median ADA similar to IgG1'},
  {grp:'Fc Silenced (LALA/N297)',           n:7,  median:2.0, min:0.8, max:30.0, low_risk_n:5,  color:'#7c3aed', note:'Ablating effector function reduces immune activation but does not directly lower antigenicity'},
  {grp:'ADCC-Enhanced',                     n:1,  median:13.0,min:13.0,max:13.0, low_risk_n:0,  color:'#b91c1c', note:'Very limited dataset (n=1) — use for reference only'},
  {grp:'Half-life Extended (YTE/LS)',        n:10, median:5.0, min:0.4, max:85.0, low_risk_n:6,  color:'#059669', note:'YTE/LS used for long-acting SC regimens; extended exposure may increase cumulative ADA'},
  {grp:'ADC (Antibody-Drug Conjugate)',      n:14, median:7.6, min:0.0, max:17.0, low_risk_n:8,  color:'#d97706', note:'ADC scaffold does not intrinsically raise ADA; payload conjugation increases immune complex risk'},
];

function renderFcAdaStats() {
  let html = `<div class="domain-note"><p><strong>Fc Engineering × Clinical ADA Impact</strong> — Statistical analysis of InSynBio\'s 138-entry clinical ADA database stratified by Fc format. Data sourced from FDA/EMA labels and PMID-verified literature (Tier A/B evidence). ADA incidence is affected by multiple confounders (route, indication, assay generation, co-immunosuppression) — this analysis is for Fc selection guidance only and does not replace molecule-specific literature review.</p></div>`;
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:28px;">`;
  FC_ADA_STATS.forEach(s => {
    const barW = Math.min(100, s.median * 1.8);
    const lowPct = Math.round(100 * s.low_risk_n / s.n);
    html += `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;border-top:3px solid ${s.color}">
      <div style="font-size:13px;font-weight:700;color:${s.color};margin-bottom:12px">${s.grp}</div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:4px">Median ADA Rate</div>
      <div style="font-size:28px;font-weight:700;color:${s.color};font-family:'Cormorant Garamond',serif;margin-bottom:6px">${s.median.toFixed(1)}%</div>
      <div style="background:#f3f4f6;border-radius:4px;height:6px;margin-bottom:10px"><div style="width:${barW}%;background:${s.color};border-radius:4px;height:6px"></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:11px;margin-bottom:10px">
        <div style="text-align:center"><div style="font-weight:700">${s.n}</div><div style="color:#9ca3af">Records</div></div>
        <div style="text-align:center"><div style="font-weight:700">${s.min.toFixed(1)}–${s.max.toFixed(1)}%</div><div style="color:#9ca3af">Range</div></div>
        <div style="text-align:center"><div style="font-weight:700;color:#059669">${lowPct}%</div><div style="color:#9ca3af" title="% with ADA &lt; 5%">Low-risk</div></div>
      </div>
      <div style="font-size:11px;color:#6b7280;border-top:1px solid #f3f4f6;padding-top:8px;line-height:1.5">${s.note}</div>
    </div>`;
  });
  html += `</div>`;
  html += `<div style="background:#f0fdf9;border:1px solid rgba(13,148,136,0.2);border-radius:12px;padding:20px;font-size:13px;line-height:1.8;margin-bottom:20px">
    <div style="font-weight:700;color:#0d4a43;margin-bottom:10px">⚠ Key Interpretation Notes</div>
    <ul style="margin:0;padding-left:18px;color:#374151">
      <li><strong>Assay generation bias:</strong> Gen 1 ELISA sensitivity is ~10× lower than Gen 3 ECL; cross-generation comparisons should be treated with caution</li>
      <li><strong>Route of administration:</strong> SC dosing yields ADA rates ~2–5× higher than IV; Fc format and route are often co-selected (e.g., YTE for SC long-acting)</li>
      <li><strong>Indication bias:</strong> Oncology patients are immunocompromised, systematically lowering ADA; autoimmune patients on MTX can reduce ADA by 60–90%</li>
      <li><strong>Sample size limitations:</strong> Fc Silenced (n=7) and ADCC-Enhanced (n=1) have limited statistical power — consult primary literature</li>
      <li><strong>Causality direction:</strong> Fc format modulates ADA indirectly through half-life, effector function, and immune activation — not through direct sequence antigenicity</li>
    </ul>
  </div>`;
  return html;
}

// ═══════════════════════════════════════════════════════════
// RENDER HELPERS
// ═══════════════════════════════════════════════════════════
function hl(text) {
  if (!searchTerm || !text) return text;
  const re = new RegExp('(' + searchTerm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

const RISK_LABEL = {high:'High Risk', medium:'Medium Risk', low:'Low Risk'};
const RISK_CLASS = {high:'risk-high', medium:'risk-med', low:'risk-low'};
const TIER_LABEL = {T1:'T1 · Approved', T2:'T2 · Clinical', T3:'T3 · Preclinical'};

const IP_STATUS = {
  public:   {label:'Public Domain',    bg:'#f0fdf4', color:'#166534', border:'#bbf7d0'},
  expired:  {label:'Patent Expired',   bg:'#f0fdf4', color:'#166534', border:'#bbf7d0'},
  expiring: {label:'Expiring Soon',    bg:'#fffbeb', color:'#92400e', border:'#fde68a'},
  active:   {label:'Active Patent',    bg:'#fef2f2', color:'#b91c1c', border:'#fecaca'},
};

function resolveIpStatus(status) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes('public')) return IP_STATUS.public;
  if (s.includes('expir') && s.includes('active')) return IP_STATUS.expiring;
  if (s.includes('active')) return IP_STATUS.active;
  if (s.includes('expir')) return IP_STATUS.expiring;
  if (s.includes('expired')) return IP_STATUS.expired;
  return IP_STATUS.expiring;
}

function renderFcCard(d) {
  const exHtml = (d.examples || []).map(e => {
    const cls = e.toLowerCase().includes('fda') ? 'ex-approved' : 'ex-trial';
    return `<span class="${cls}">${hl(e)}</span>`;
  }).join(' · ');
  const ip = d.ip;
  const ipc = ip ? resolveIpStatus(ip.status) : null;
  const ipBadge = ipc ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;background:${ipc.bg};color:${ipc.color};border:1px solid ${ipc.border};white-space:nowrap;">${ipc.label}</span>` : '';
  const ipBlock = (ip && ipc) ? `
    <div class="detail-full" style="background:${ipc.bg};border:1px solid ${ipc.border};border-radius:8px;padding:10px 12px;margin-top:4px;">
      <div class="dl" style="color:${ipc.color};">⚖ IP / Patent Status &nbsp;${ipBadge}</div>
      <div class="dv" style="margin-top:6px;"><strong>Holder:</strong> ${hl(ip.holder || '—')}<br><strong>Expiry:</strong> ${hl(ip.expiry || '—')}<br><strong style="color:#374151;">Design-around:</strong> ${hl(ip.design_around || ip.workaround || ip.key || '—')}</div>
    </div>` : '';
  return `
    <div class="comp-card" id="card-${d.id}" onclick="toggleCard(event, '${d.id}')" onmouseleave="handleMouseLeave('${d.id}')">
      <div class="cc-top">
        <div class="cc-name">${hl(d.name)}${d.alias ? `<br><span class="cc-alias">${hl(d.alias)}</span>` : ''}</div>
        <div class="cc-actions">${ipc ? ipBadge : ''}<span class="tier tier-${d.tier}">${TIER_LABEL[d.tier]}</span><span class="expand-toggle"></span></div>
      </div>
      <div class="cc-meta">
        <span class="cat-chip">${hl(d.cat)}</span>
      </div>
      <div class="cc-brief">${hl(d.brief)}</div>
      ${d.examples.length ? `<div class="cc-examples">${exHtml}</div>` : ''}
      <div class="cc-detail">
        <div class="collapse-bar"><div class="collapse-progress"></div></div>
        <div class="detail-grid">
          <div class="detail-full"><div class="dl">Mechanism</div><div class="dv">${hl(d.mechanism)}</div></div>
          <div><div class="dl">Receptors / Targets Affected</div><div class="dv">${hl(d.receptors)}</div></div>
          ${d.tradeoffs ? `<div><div class="dl">Trade-offs & Considerations</div><div class="dv">${hl(d.tradeoffs)}</div></div>` : '<div></div>'}
          <div class="detail-full"><div class="dl">Key References</div><div class="dv">${d.ref}</div></div>
          ${ipBlock}
        </div>
      </div>
    </div>`;
}

function renderDevCard(d) {
  return `
    <div class="comp-card" id="card-${d.id}" onclick="toggleCard(event, '${d.id}')" onmouseleave="handleMouseLeave('${d.id}')">
      <div class="cc-top">
        <div class="cc-name">${hl(d.name)}${d.alias ? `<br><span class="cc-alias" style="font-family:inherit;">${hl(d.alias)}</span>` : ''}</div>
        <div class="cc-actions"><span class="risk-badge ${RISK_CLASS[d.risk]}">${RISK_LABEL[d.risk]}</span><span class="expand-toggle"></span></div>
      </div>
      <div class="cc-meta">
        <span class="cat-chip">${hl(d.cat)}</span>
        ${d.range ? `<span class="range-badge">${hl(d.range)}</span>` : ''}
      </div>
      <div class="cc-brief">${hl(d.brief)}</div>
      <div class="cc-detail">
        <div class="collapse-bar"><div class="collapse-progress"></div></div>
        <div class="detail-grid">
          <div><div class="dl">How It Is Calculated</div><div class="dv">${hl(d.calc)}</div></div>
          <div><div class="dl">InSynBio Threshold / Flag</div><div class="dv">${hl(d.threshold)}</div></div>
          <div class="detail-full"><div class="dl">Clinical Interpretation</div><div class="dv">${hl(d.interp)}</div></div>
          <div class="detail-full"><div class="dl">Tools Used</div><div class="dv">${hl(d.tools)}</div></div>
        </div>
      </div>
    </div>`;
}

function renderImmunoCard(d) {
  return `
    <div class="comp-card" id="card-${d.id}" onclick="toggleCard(event, '${d.id}')" onmouseleave="handleMouseLeave('${d.id}')">
      <div class="cc-top">
        <div class="cc-name">${hl(d.name)}${d.alias ? `<br><span class="cc-alias" style="font-family:inherit;">${hl(d.alias)}</span>` : ''}</div>
        <div class="cc-actions"><span class="risk-badge ${RISK_CLASS[d.risk]}">${RISK_LABEL[d.risk]}</span><span class="expand-toggle"></span></div>
      </div>
      <div class="cc-meta">
        <span class="cat-chip">${hl(d.cat)}</span>
      </div>
      <div class="cc-brief">${hl(d.brief)}</div>
      <div class="cc-detail">
        <div class="collapse-bar"><div class="collapse-progress"></div></div>
        <div class="detail-grid">
          <div class="detail-full"><div class="dl">Mechanism</div><div class="dv">${hl(d.mechanism)}</div></div>
          <div><div class="dl">Detection Methods</div><div class="dv">${hl(d.detection)}</div></div>
          <div><div class="dl">Mitigation Strategies</div><div class="dv">${hl(d.mitigation)}</div></div>
          <div class="detail-full"><div class="dl">Key References</div><div class="dv">${hl(d.ref)}</div></div>
        </div>
      </div>
    </div>`;
}

function renderWetCard(d) {
  return `
    <div class="comp-card" id="card-${d.id}" onclick="toggleCard(event, '${d.id}')" onmouseleave="handleMouseLeave('${d.id}')">
      <div class="cc-top">
        <div class="cc-name">${hl(d.name)}${d.alias ? `<br><span class="cc-alias">${hl(d.alias)}</span>` : ''}</div>
        <div class="cc-actions"><span class="expand-toggle"></span></div>
      </div>
      <div class="cc-meta">
        <span class="cat-chip">${hl(d.cat)}</span>
      </div>
      <div class="cc-brief">${hl(d.brief)}</div>
      <div class="cc-detail">
        <div class="collapse-bar"><div class="collapse-progress"></div></div>
        <div class="detail-grid">
          <div class="detail-full"><div class="dl">Assay Principle</div><div class="dv">${hl(d.principle)}</div></div>
          <div><div class="dl">Key Readout / Parameters</div><div class="dv">${hl(d.readout)}</div></div>
          <div><div class="dl">Validates Computational Metrics</div><div class="dv">${hl(d.compLink)}</div></div>
          <div class="detail-full"><div class="dl">Regulatory Context</div><div class="dv">${hl(d.context)}</div></div>
          <div class="detail-full"><div class="dl">Key References</div><div class="dv">${d.ref}</div></div>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════
// RENDER GRID
// ═══════════════════════════════════════════════════════════
function renderGrid() {
  const dom = DOMAINS[currentDomain];
  const data = dom.data;
  const q = searchTerm.toLowerCase();

  const filtered = data.filter(d => {
    const matchCat = !catFilter || d.cat === catFilter;
    const matchTier = !tierFilter || d.tier === tierFilter;
    const matchSearch = !q || [d.name, d.alias, d.brief, d.cat,
      d.mechanism || '', d.examples ? d.examples.join(' ') : '',
      d.interp || '', d.detection || '', d.mitigation || '',
      d.principle || '', d.readout || '', d.compLink || '', d.context || '',
      d.ip ? `${d.ip.holder} ${d.ip.key} ${d.ip.workaround} ${d.ip.status}` : ''].some(f => f.toLowerCase().includes(q));
    return matchCat && matchTier && matchSearch;
  });

  // Group by category
  const groups = {};
  filtered.forEach(d => {
    (groups[d.cat] = groups[d.cat] || []).push(d);
  });

  const gc = document.getElementById('grid-container');
  const es = document.getElementById('empty-state');

  if (filtered.length === 0) {
    gc.innerHTML = '';
    es.style.display = '';
    document.getElementById('stats-chip').textContent = '0 entries';
    return;
  }
  es.style.display = 'none';

  let html = `<div class="domain-note"><p>${dom.note}</p></div>`;
  if (dom.extraHtmlTop) html += dom.extraHtmlTop();
  for (const [cat, cards] of Object.entries(groups)) {
    html += `<div class="cat-section">
      <div class="cat-header">
        <h2>${hl(cat)}</h2>
        <span class="cat-count">${cards.length}</span>
      </div>
      <div class="card-grid">${cards.map(d => dom.card(d)).join('')}</div>
    </div>`;
  }
  if (dom.extraHtmlBottom) html += dom.extraHtmlBottom();
  gc.innerHTML = html;
  document.getElementById('stats-chip').textContent = `${filtered.length} / ${data.length} entries`;
}

// ═══════════════════════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════════════════════
let collapseTimers = {};

function toggleCard(ev, id) {
  // Clicks on PubMed / external links must not bubble — otherwise the card toggles
  // collapsed and hides the detail panel (looks like "lost content" until refresh).
  if (ev && ev.target && typeof ev.target.closest === 'function') {
    if (ev.target.closest('a, button, input, select, textarea, label')) return;
  }
  const el = document.getElementById('card-' + id);
  if (el) {
    const isExpanded = el.classList.toggle('expanded');
    
    // Auto-collapse logic
    const progress = el.querySelector('.collapse-progress');
    if (isExpanded) {
      if (progress) {
        progress.style.transition = 'none';
        progress.style.width = '100%';
      }
      
      // Setup hover listeners if not already done
      if (!el.dataset.hoverBound) {
        el.dataset.hoverBound = 'true';
        
        el.addEventListener('mouseenter', () => {
          if (!el.classList.contains('expanded')) return;
          if (collapseTimers[id]) {
            clearTimeout(collapseTimers[id]);
            collapseTimers[id] = null;
          }
          if (progress) {
            progress.style.transition = 'none';
            progress.style.width = '100%';
          }
        });
        
        el.addEventListener('mouseleave', () => {
          if (!el.classList.contains('expanded')) return;
          
          // Start the 3-second countdown
          const duration = 3000; // 3 seconds
          if (progress) {
            // Force reflow to ensure transition starts from 100%
            void progress.offsetWidth;
            progress.style.transition = `width ${duration}ms linear`;
            progress.style.width = '0%';
          }
          
          collapseTimers[id] = setTimeout(() => {
            el.classList.remove('expanded');
            if (progress) {
              progress.style.transition = 'none';
              progress.style.width = '100%';
            }
          }, duration);
        });
      }
    } else {
      // Manual collapse: clear timer and reset progress
      if (collapseTimers[id]) {
        clearTimeout(collapseTimers[id]);
        collapseTimers[id] = null;
      }
      if (progress) {
        progress.style.transition = 'none';
        progress.style.width = '100%';
      }
    }
  }
}

function handleMouseLeave(id) {
  // This is now handled via event listener added in toggleCard to ensure proper binding
}

function switchDomain(domain, btn) {
  currentDomain = domain;
  searchTerm = '';
  catFilter = '';
  tierFilter = '';
  document.getElementById('search-input').value = '';
  document.getElementById('cat-filter').value = '';
  document.querySelectorAll('.dtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateCatFilter();
  const tierEl = document.getElementById('tier-filter');
  tierEl.style.display = (domain === 'fc') ? '' : 'none';
  renderGrid();
  updateClearBtn();
}

function updateCatFilter() {
  const dom = DOMAINS[currentDomain];
  const sel = document.getElementById('cat-filter');
  sel.innerHTML = `<option value="">${dom.filterLabel}</option>`;
  dom.cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}

function clearFilters() {
  searchTerm = '';
  catFilter = '';
  tierFilter = '';
  document.getElementById('search-input').value = '';
  document.getElementById('cat-filter').value = '';
  document.getElementById('tier-filter').value = '';
  updateClearBtn();
  renderGrid();
}

function updateClearBtn() {
  const hasFilter = searchTerm || catFilter || tierFilter;
  document.getElementById('clear-btn').classList.toggle('visible', !!hasFilter);
}

// ── Event listeners ──────────────────────────────────────
document.getElementById('search-input').addEventListener('input', e => {
  searchTerm = e.target.value.trim();
  updateClearBtn();
  renderGrid();
});
document.getElementById('cat-filter').addEventListener('change', e => {
  catFilter = e.target.value;
  updateClearBtn();
  renderGrid();
});
document.getElementById('tier-filter').addEventListener('change', e => {
  tierFilter = e.target.value;
  updateClearBtn();
  renderGrid();
});

// ── Init: handle ?tab= URL param ─────────────────────────
const urlTab = new URLSearchParams(window.location.search).get('tab');
if (urlTab && DOMAINS[urlTab]) {
  currentDomain = urlTab;
  document.querySelectorAll('.dtab').forEach(b => {
    b.classList.toggle('active', b.dataset.domain === urlTab);
  });
  if (urlTab !== 'fc') document.getElementById('tier-filter').style.display = 'none';
}
updateCatFilter();
renderGrid();
