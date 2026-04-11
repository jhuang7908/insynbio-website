"""
Add 6 missing payload cards and 7 missing linker cards to InSynBio adc_database.html.
Content translated from Therasik ADC database.
"""

MISSING_PAYLOADS = '''<div class="card" onclick="toggleCard(this)" data-cls="PROTACs" data-search="brd4 degrader protac targeted protein degradation dac degrader-antibody">
  <div class="card-header">
    <div class="card-title">BRD4 Degrader (PROTAC)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#d4edda;color:#155724;border:1px solid #c3e6cb;font-size:9px">Patent: Emerging / IP Protected</span></div>
    </div>
    <span class="badge badge-payload">PROTACs</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">IC50: 0.1–10 nM · Mechanism: Targeted Protein Degradation (TPD)</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Emerging)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Mechanism & Potency</div>
      <div class="info-row"><span class="info-label">Class</span><span class="info-value">PROTACs (Degrader-Antibody Conjugates)</span></div>
      <div class="info-row"><span class="info-label">MoA</span><span class="info-value">Proteolysis Targeting Chimera (PROTAC). Recruits E3 ligase (VHL, CRBN) to BRD4, leading to polyubiquitination and proteasomal degradation. Catalytic mechanism allows sub-stoichiometric activity — one molecule can degrade multiple target proteins.</span></div>
      <div class="info-row"><span class="info-label">IC50</span><span class="info-value">0.1–10 nM</span></div>
      <div class="info-row"><span class="info-label">Potency tier</span><span class="info-value">High (Catalytic)</span></div>
      <div class="info-row"><span class="info-label">Bystander effect</span><span class="info-value">Limited (intracellular mechanism)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Parameters</div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">2–4</span></div>
      <div class="info-row"><span class="info-label">Challenges</span><span class="info-value">Large MW (~1000 Da); high hydrophobicity; requires specialized linkers to maintain ADC solubility. Endosomal escape needed for cytosolic delivery.</span></div>
      <div class="info-row"><span class="info-label">Compatible linker</span><span class="info-value">pH-cleavable or protease-cleavable; hydrophilic PEG spacers strongly recommended</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Emerging modality — Degrader-Antibody Conjugates (DACs) combine the target specificity of mAbs with the catalytic power of PROTACs. Particularly promising for undruggable transcription factors.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:32134256 (First DAC report)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-cls="ISACs" data-search="tlr7/8 agonist isac immunostimulatory agonist innate immune">
  <div class="card-header">
    <div class="card-title">TLR7/8 Agonist (ISAC)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#d4edda;color:#155724;border:1px solid #c3e6cb;font-size:9px">Patent: Emerging / IP Protected</span></div>
    </div>
    <span class="badge badge-payload">ISACs</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Mechanism: Immune Stimulating Antibody Conjugate (ISAC) · Target: TLR7/8</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Clinical)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Mechanism & Potency</div>
      <div class="info-row"><span class="info-label">Class</span><span class="info-value">ISACs (Immune Stimulating Antibody Conjugates)</span></div>
      <div class="info-row"><span class="info-label">MoA</span><span class="info-value">Activates TLR7/8 on innate immune cells (macrophages, dendritic cells, NK cells), stimulating anti-tumor immunity via cytokine release (IFN-α, TNF-α). Converts immunologically cold tumors to hot. Distinct from cytotoxin ADCs — relies on immune activation, not direct cell killing.</span></div>
      <div class="info-row"><span class="info-label">Potency tier</span><span class="info-value">Medium (Immunostimulatory)</span></div>
      <div class="info-row"><span class="info-label">Bystander effect</span><span class="info-value">Strong (systemic immune activation)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Clinical Safety</div>
      <div class="info-row"><span class="info-label">Dose-limiting toxicities</span><span class="info-value">Cytokine release syndrome (CRS); Liver toxicity (TLR8 activation in hepatic macrophages)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Parameters</div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">2–4</span></div>
      <div class="info-row"><span class="info-label">Compatible linker</span><span class="info-value">Non-cleavable or pH-cleavable; stability in plasma critical to prevent systemic TLR activation</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">ISACs represent a paradigm shift in ADC design — the payload drives immune activation rather than direct cytotoxicity. Key for PD-1/PD-L1 resistant or immunologically cold tumor settings.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:33649601 (ISAC clinical data)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-cls="Radionuclide" data-search="actinium-225 radionuclide alpha-emitter radioimmunotherapy targeted">
  <div class="card-header">
    <div class="card-title">Actinium-225 Chelate
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#cce5ff;color:#004085;border:1px solid #b8daff;font-size:9px">Patent: Institution / Emerging</span></div>
    </div>
    <span class="badge badge-payload">Radionuclide</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Half-life: 9.9 days · Emission: Alpha (α) · Range: &lt;100 μm</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Clinical)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Mechanism & Potency</div>
      <div class="info-row"><span class="info-label">Class</span><span class="info-value">Alpha-emitting radionuclide</span></div>
      <div class="info-row"><span class="info-label">MoA</span><span class="info-value">Emits high-LET alpha particles causing dense double-strand DNA breaks. Short range (&lt;100 μm, ~3-5 cell diameters) provides highly localized cytotoxicity with minimal bystander damage to normal tissue. Effective in MDR tumors resistant to chemotherapy.</span></div>
      <div class="info-row"><span class="info-label">Half-life</span><span class="info-value">9.9 days</span></div>
      <div class="info-row"><span class="info-label">Potency tier</span><span class="info-value">Very High (double-strand DNA breaks)</span></div>
      <div class="info-row"><span class="info-label">Cell cycle dependency</span><span class="info-value">All phases (cell-cycle independent)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Parameters</div>
      <div class="info-row"><span class="info-label">Chelator</span><span class="info-value">DOTA, DOTAMTM (bifunctional chelates for stable complexation)</span></div>
      <div class="info-row"><span class="info-label">Challenges</span><span class="info-value">Supply scarcity; regulatory handling requirements; daughter nuclide redistribution (Bi-213, Fr-221); cold chain logistics</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Emerging alpha-particle therapy. Lutetium-177 (β-emitter) is more established; Actinium-225 offers 400× higher LET with tighter spatial selectivity. Early clinical programs in prostate and hematologic malignancies.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:29601203 (Ac-225 clinical)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-cls="Protein Toxin" data-search="pe38 pseudomonas exotoxin a protein toxin immunotoxin bacterial">
  <div class="card-header">
    <div class="card-title">Pseudomonas Exotoxin A Fragment (PE38)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#fff3cd;color:#856404;border:1px solid #ffeeba;font-size:9px">Patent: NIH / Academic</span></div>
    </div>
    <span class="badge badge-payload">Protein Toxin</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">IC50: 0.01–1 nM · Mechanism: EF-2 ADP-ribosylation → protein synthesis arrest</div>
    <div style="font-size:10px;color:#1a7a4a;font-weight:600;margin-top:2px">Evidence: High</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Mechanism & Potency</div>
      <div class="info-row"><span class="info-label">Class</span><span class="info-value">Bacterial protein toxin (immunotoxin)</span></div>
      <div class="info-row"><span class="info-label">MoA</span><span class="info-value">Catalytic ADP-ribosylation of elongation factor 2 (EF-2), permanently arresting protein synthesis. Single molecule can kill a cell (enzyme-catalytic mechanism). Domain III of Pseudomonas aeruginosa exotoxin A; domain II removed to reduce non-specific uptake.</span></div>
      <div class="info-row"><span class="info-label">IC50</span><span class="info-value">0.01–1 nM</span></div>
      <div class="info-row"><span class="info-label">Potency tier</span><span class="info-value">Very High (catalytic, single-molecule lethal)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Clinical Safety</div>
      <div class="info-row"><span class="info-label">Dose-limiting toxicities</span><span class="info-value">Immunogenicity (anti-PE38 antibodies in ~80% of patients after 1-3 cycles); Vascular leak syndrome; Hepatotoxicity</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Parameters</div>
      <div class="info-row"><span class="info-label">Conjugation</span><span class="info-value">Genetic fusion (recombinant immunotoxin); chemical conjugation possible but less common</span></div>
      <div class="info-row"><span class="info-label">Challenges</span><span class="info-value">Highly immunogenic in humans; limited to 1-3 cycles before neutralizing antibodies develop. Deimmunization strategies (epitope deletion) under active development.</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Approved as Lumoxiti (moxetumomab pasudotox) for hairy cell leukemia in 2018. Second-generation deimmunized variants (PE24, LMB-100) reduce immunogenicity. Major limitation is anti-drug antibody development.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:28619709 (Lumoxiti approval)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-cls="Oligonucleotide" data-search="sirna oligonucleotide rna interference gene silencing rnai">
  <div class="card-header">
    <div class="card-title">siRNA (Small Interfering RNA)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#d4edda;color:#155724;border:1px solid #c3e6cb;font-size:9px">Patent: Emerging / Platform Dependent</span></div>
    </div>
    <span class="badge badge-payload">Oligonucleotide</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Mechanism: RNA interference (RNAi) gene silencing · Target: mRNA-level</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Emerging)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Mechanism & Potency</div>
      <div class="info-row"><span class="info-label">Class</span><span class="info-value">Oligonucleotide (RNA interference)</span></div>
      <div class="info-row"><span class="info-label">MoA</span><span class="info-value">21-23 nt double-stranded RNA loaded into RISC complex, directing sequence-specific cleavage of complementary mRNA. Catalytic (one siRNA degrades multiple mRNA copies). Can silence any gene with a known mRNA sequence — enables targeting of historically undruggable targets.</span></div>
      <div class="info-row"><span class="info-label">Potency tier</span><span class="info-value">High (catalytic mRNA degradation)</span></div>
      <div class="info-row"><span class="info-label">Cell cycle dependency</span><span class="info-value">All phases</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Parameters</div>
      <div class="info-row"><span class="info-label">Conjugation strategy</span><span class="info-value">SORT conjugation or electrostatic loading; requires endosomal escape for cytosolic RISC access</span></div>
      <div class="info-row"><span class="info-label">Challenges</span><span class="info-value">Endosomal trapping (major barrier); nuclease degradation; off-target silencing; innate immune activation (TLR3/7/8)</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">1–4 (siRNA molecules per antibody)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Antibody-siRNA conjugates (ARCs) are a rapidly emerging modality — MSD MK-0616, Avidity, Dyne Therapeutics programs. Key advantage: can silence oncogenes previously considered undruggable by small molecules.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:34091710 (ARC review)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-cls="Oligonucleotide" data-search="aso antisense oligonucleotide gene silencing splice modulation">
  <div class="card-header">
    <div class="card-title">ASO (Antisense Oligonucleotide)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#d4edda;color:#155724;border:1px solid #c3e6cb;font-size:9px">Patent: Emerging / Platform Dependent</span></div>
    </div>
    <span class="badge badge-payload">Oligonucleotide</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Mechanism: RNase H-mediated mRNA degradation or splice modulation</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Emerging)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Mechanism & Potency</div>
      <div class="info-row"><span class="info-label">Class</span><span class="info-value">Oligonucleotide (antisense)</span></div>
      <div class="info-row"><span class="info-label">MoA</span><span class="info-value">Single-stranded DNA/RNA hybrid (15–25 nt) hybridizes to complementary mRNA, recruiting RNase H for target degradation (gapmers) or blocking ribosome access/modulating splicing (steric block ASOs). Chemical modifications (PS backbone, 2'-MOE) improve nuclease resistance.</span></div>
      <div class="info-row"><span class="info-label">Potency tier</span><span class="info-value">Medium-High (stoichiometric)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Parameters</div>
      <div class="info-row"><span class="info-label">Conjugation strategy</span><span class="info-value">Covalent conjugation via 3' or 5' terminus; requires nuclear/cytosolic delivery depending on target</span></div>
      <div class="info-row"><span class="info-label">Advantages vs siRNA</span><span class="info-value">Single-stranded — lower immunogenicity, easier conjugation; can modulate splicing (not just degrade)</span></div>
      <div class="info-row"><span class="info-label">Challenges</span><span class="info-value">Endosomal escape; lower catalytic efficiency vs siRNA; off-target hybridization</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">ASO-antibody conjugates are being explored for CNS and oncology targets. Advantage over siRNA: no RISC requirement — nuclear access can modulate pre-mRNA splicing of disease-relevant isoforms.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:32929266 (ASO-antibody conjugates)</span></div>
    </div>
  </div>
</div>'''

MISSING_LINKERS = '''<div class="card" onclick="toggleCard(this)" data-ltype="Disulfide-cleavable" data-search="spdb disulfide cleavable immunogen spdb-dm4 maytansinoid">
  <div class="card-header">
    <div class="card-title">SPDB (N-Succinimidyl-4-(2-pyridyldithio)butanoate)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#fff3cd;color:#856404;border:1px solid #ffeeba;font-size:9px">Patent: ImmunoGen (Expired/Expiring)</span></div>
    </div>
    <span class="badge badge-linker">Disulfide-cleavable</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Plasma t½: 3–5 days · Cleavage: Glutathione (intracellular reductive environment)</div>
    <div style="font-size:10px;color:#1a7a4a;font-weight:600;margin-top:2px">Evidence: High</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">Disulfide bond reduction by intracellular glutathione (GSH ~1-10 mM intracellular vs ~2-5 μM extracellular)</span></div>
      <div class="info-row"><span class="info-label">Cleavage enzyme</span><span class="info-value">Glutathione (thiol exchange); thioredoxin reductase</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">Moderate — hindered disulfide reduces premature cleavage; 4-carbon spacer (butanoate) provides better steric protection vs SPDP</span></div>
      <div class="info-row"><span class="info-label">Patent / FTO</span><span class="info-value">ImmunoGen platform patents; now largely expired or expiring — design-around space available</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Primary payload</span><span class="info-value">Maytansinoids (DM1, DM4) — used in Kadcyla (ado-trastuzumab emtansine)</span></div>
      <div class="info-row"><span class="info-label">Compatible conjugation sites</span><span class="info-value">Lysine (NHS ester); Cysteine (maleimide variant)</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">3–4</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Industry standard disulfide linker for maytansinoid ADCs. Used in Kadcyla (T-DM1) as the SMCC (non-cleavable) variant. SPDB provides cleavable alternative with hindered disulfide for improved plasma stability.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:24631280 (Kadcyla/DM1 linker chemistry)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-ltype="Disulfide-cleavable" data-search="spp disulfide cleavable spp-dm1 maytansinoid immunogen">
  <div class="card-header">
    <div class="card-title">SPP (N-Succinimidyl-4-(2-pyridyldithio)pentanoate)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#fff3cd;color:#856404;border:1px solid #ffeeba;font-size:9px">Patent: ImmunoGen</span></div>
    </div>
    <span class="badge badge-linker">Disulfide-cleavable</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Plasma t½: 2–4 days · Cleavage: Intracellular glutathione reduction</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">Disulfide reduction — 5-carbon spacer (pentanoate) vs SPDB 4-carbon; slightly more flexible but similar stability profile</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">Moderate; hindered disulfide improves stability vs simple SPDP</span></div>
      <div class="info-row"><span class="info-label">Patent / FTO</span><span class="info-value">ImmunoGen IP portfolio; overlaps with SPDB patents</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Primary payload</span><span class="info-value">Maytansinoids (DM1); early ImmunoGen platform programs</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">2–4</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Early-generation disulfide linker superseded by more stable SPDB variants in most programs. Still used as a reference in linker comparison studies and in some preclinical models.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:22544701 (DM1 linker comparison)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-ltype="Non-cleavable" data-search="fleximer mersana dolaflexin polymer backbone non-cleavable high-dar">
  <div class="card-header">
    <div class="card-title">Fleximer (Mersana Dolaflexin Platform)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#fff3cd;color:#856404;border:1px solid #ffeeba;font-size:9px">Patent: Mersana Therapeutics (Proprietary)</span></div>
    </div>
    <span class="badge badge-linker">Non-cleavable</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Type: Polymer backbone linker · DAR: 10–15 (high DAR enabled) · Payload: Auristatin F</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Clinical)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">Non-cleavable — hydrophilic polymer (modified polyacetal) backbone distributes multiple payload molecules with enhanced water solubility. Payload released by lysosomal proteolysis of the antibody itself after internalization.</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">Very high (non-cleavable polymer backbone)</span></div>
      <div class="info-row"><span class="info-label">Patent / FTO</span><span class="info-value">Proprietary Mersana platform (XMT-1992, XMT-2056 clinical programs)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Key advantage</span><span class="info-value">Enables high DAR (10–15) without aggregation — polymer backbone disperses hydrophobic payload, preventing PK-limiting aggregation seen with conventional high-DAR ADCs</span></div>
      <div class="info-row"><span class="info-label">Compatible payloads</span><span class="info-value">Auristatin F (AF); designed for hydrophobic payload solubilization</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">10–15 (high DAR design intent)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Mersana Dolaflexin platform enables ultrahigh DAR ADCs with maintained PK. Upifitamab rilsodotin (XMT-1536) — NaPi2b-targeting Phase 2. Advantage: increased drug loading per antibody improves antitumor activity in low-antigen-density tumors.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:33888590 (Mersana Dolaflexin)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-ltype="Glucuronidase-cleavable" data-search="cl2a sacituzumab trodelvy glucuronide sn-38 trop2">
  <div class="card-header">
    <div class="card-title">CL2A (Sacituzumab Govitecan Linker)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#cce5ff;color:#004085;border:1px solid #b8daff;font-size:9px">Patent: Immunomedics / Gilead</span></div>
    </div>
    <span class="badge badge-linker">Glucuronidase-cleavable</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Plasma t½: Short (~1 day) · Cleavage: β-glucuronidase (tumor microenvironment)</div>
    <div style="font-size:10px;color:#1a7a4a;font-weight:600;margin-top:2px">Evidence: High (Approved)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">β-glucuronidase cleaves the glucuronide bond, releasing SN-38. TME-enriched β-glucuronidase (necrotic tumor cells release enzyme extracellularly) enables bystander killing even for non-internalizing antigen</span></div>
      <div class="info-row"><span class="info-label">Cleavage enzyme</span><span class="info-value">β-glucuronidase (lysosomal + extracellular tumor enriched)</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">Moderate-Low — intentionally labile to enable high-DAR (7–8) with SN-38 bystander killing</span></div>
      <div class="info-row"><span class="info-label">Patent / FTO</span><span class="info-value">Immunomedics (now Gilead) patents; Trodelvy (sacituzumab govitecan) FDA approved 2020/2021</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Primary payload</span><span class="info-value">SN-38 (active metabolite of irinotecan); camptothecin derivatives</span></div>
      <div class="info-row"><span class="info-label">Key advantage</span><span class="info-value">High DAR (7–8) without excessive hydrophobicity; extracellular cleavage provides potent bystander killing</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">7–8</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Used in approved Trodelvy (sacituzumab govitecan-hziy) for triple-negative breast cancer and urothelial cancer. High DAR and bystander killing distinguish it from most ADCs. The glucuronide chemistry enables hydrophilic linker-payload release in the TME.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:33170115 (Trodelvy ASCENT trial)</span></div><div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">FDA label: Trodelvy</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-ltype="Non-cleavable" data-search="tmalin thiol-maleimide non-cleavable stable conjugation">
  <div class="card-header">
    <div class="card-title">TMALin (Thiol-Maleimide Non-Cleavable)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#cce5ff;color:#004085;border:1px solid #b8daff;font-size:9px">Patent: Platform Dependent</span></div>
    </div>
    <span class="badge badge-linker">Non-cleavable</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Plasma t½: &gt;7 days · Cleavage: None — released by antibody proteolysis</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">Non-cleavable thioether bond formed from maleimide-thiol reaction. Payload released only after lysosomal degradation of the antibody, yielding a payload-amino acid metabolite.</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">Very high — no enzymatic cleavage site</span></div>
      <div class="info-row"><span class="info-label">Retro-Michael concern</span><span class="info-value">Hydrolysis of maleimide ring to succinimide thioether significantly reduces retro-Michael deconjugation risk</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Compatible payloads</span><span class="info-value">Maytansinoids (DM1, DM4); non-membrane-permeable payloads requiring intracellular release</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">2–4</span></div>
      <div class="info-row"><span class="info-label">Limitation</span><span class="info-value">Bystander killing limited — payload-amino acid metabolite is charged, membrane-impermeable</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Non-cleavable linkers are preferred for targets with robust internalization kinetics. The lack of bystander killing is acceptable for high-antigen-density, homogeneous tumors. Used in Kadcyla (SMCC-DM1 variant).</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:25031149 (non-cleavable ADC review)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-ltype="Non-cleavable" data-search="k-link kymera lysine bioorthogonal click chemistry site-specific">
  <div class="card-header">
    <div class="card-title">K-Link (Lysine Bioorthogonal Conjugation)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#d4edda;color:#155724;border:1px solid #c3e6cb;font-size:9px">Patent: Emerging Platform</span></div>
    </div>
    <span class="badge badge-linker">Non-cleavable</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Strategy: Site-specific lysine conjugation via bioorthogonal chemistry</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Emerging)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">Site-specific conjugation to engineered or reactive lysine residues using bioorthogonal chemistry (NHS ester, HATU coupling, or enzymatic). Generates homogeneous DAR without cysteine reduction.</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">High (non-cleavable amide/thioether bond)</span></div>
      <div class="info-row"><span class="info-label">Key advantage</span><span class="info-value">Preserves disulfide bonds (no reduction step) — maintains antibody structural integrity and Fc function better than cysteine-based conjugation</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Compatible payloads</span><span class="info-value">Broad — compatible with amine-reactive payloads</span></div>
      <div class="info-row"><span class="info-label">Optimal DAR range</span><span class="info-value">2–4 (site-specific)</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Emerging site-specific conjugation chemistry. Provides homogeneous DAR without cysteine reduction — maintains antibody disulfide integrity. Complementary to cysteine-based conjugation for antibodies where disulfide reduction causes aggregation.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:31564619 (site-specific lysine conjugation)</span></div>
    </div>
  </div>
</div>
<div class="card" onclick="toggleCard(this)" data-ltype="Conditional Activation" data-search="probody cba conditionally activated pb-fab masking peptide tumor protease">
  <div class="card-header">
    <div class="card-title">Probody (Conditionally Activated Linker-Masking System)
      <div style="display:flex;gap:5px;align-items:center;margin-top:4px"><span class="badge" style="background:#fff3cd;color:#856404;border:1px solid #ffeeba;font-size:9px">Patent: CytomX Therapeutics (Proprietary)</span></div>
    </div>
    <span class="badge badge-linker">Conditional Activation</span>
  </div>
  <div class="card-body">
    <div class="cc-brief">Strategy: Tumor protease-activated masking peptide — conditional antigen binding</div>
    <div style="font-size:10px;color:#b07800;font-weight:600;margin-top:2px">Evidence: Medium (Clinical)</div>
    <span class="expand-toggle"></span>
    <div class="cc-detail">
      <div class="collapse-bar"><div class="collapse-progress"></div></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Cleavage Mechanism & Stability</div>
      <div class="info-row"><span class="info-label">Mechanism</span><span class="info-value">A masking peptide (connected via protease-cleavable linker) sterically blocks the antigen-binding domain. In the tumor microenvironment, upregulated proteases (uPA, matriptase, legumain) cleave the linker, releasing the mask and restoring full antigen binding. Normal tissue — mask intact, minimal on-target off-tumor toxicity.</span></div>
      <div class="info-row"><span class="info-label">Cleavage enzyme</span><span class="info-value">Tumor-enriched proteases: uPA, matriptase-1 (ST14), legumain, MMP-2/9</span></div>
      <div class="info-row"><span class="info-label">Plasma stability</span><span class="info-value">High in circulation (mask intact); selective activation in TME</span></div>
      <div class="info-row"><span class="info-label">Patent / FTO</span><span class="info-value">CytomX Therapeutics proprietary platform (Probody®); extensive patent portfolio</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">ADC Design Compatibility</div>
      <div class="info-row"><span class="info-label">Key advantage</span><span class="info-value">Enables targeting of broadly-expressed antigens (EGFR, CD166, CD71) that would cause unacceptable on-target off-tumor toxicity with conventional ADCs</span></div>
      <div class="info-row"><span class="info-label">Clinical programs</span><span class="info-value">CX-2009 (CD166-Probody-DM4), CX-2029 (CD71-Probody-MMAE) — Phase 2</span></div>
      <div class="info-row"><span class="info-label">Limitation</span><span class="info-value">Complex manufacturing; requires TME protease validation for each new target; patent landscape restricts access</span></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#888;margin:10px 0 4px;border-top:1px solid #eee;padding-top:8px">Structure & References</div>
      <div class="info-row"><span class="info-label">Evidence note</span><span class="info-value" style="font-style:italic;color:#444">Probody technology allows previously off-limits targets to be used for ADC development by restricting binding to the tumor microenvironment. Validated in multiple clinical programs with improved therapeutic index vs conventional ADC targeting ubiquitous antigens.</span></div>
      <div class="info-row" style="font-size:11px;color:#666"><span class="info-label">Ref</span><span class="info-value">PMID:31235653 (Probody clinical results)</span></div>
    </div>
  </div>
</div>'''

# ─── Insert into adc_database.html ───────────────────────────────────────────
with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

# Find end of gridPayloads grid and insert before its closing </div>
# gridPayloads closes just before the next tab-panel or closing div
payload_grid_start = html.find('id="gridPayloads"')
if payload_grid_start < 0:
    print("ERROR: gridPayloads not found")
else:
    # Find the closing of this grid (before next tab-panel)
    next_panel = html.find('<div class="tab-panel"', payload_grid_start + 100)
    # The grid div closes before the tab panel
    grid_segment = html[payload_grid_start:next_panel]
    # Find last </div> in this segment (closes the grid)
    last_div = grid_segment.rfind('</div>')
    if last_div > 0:
        insert_at = payload_grid_start + last_div
        html = html[:insert_at] + '\n' + MISSING_PAYLOADS + '\n' + html[insert_at:]
        print(f"Inserted 6 payload cards into gridPayloads")
    else:
        print("ERROR: could not find end of gridPayloads")

# Find end of gridLinkers grid and insert before its closing </div>
linker_grid_start = html.find('id="gridLinkers"')
if linker_grid_start < 0:
    print("ERROR: gridLinkers not found")
else:
    next_section = html.find('<div class="tab-panel"', linker_grid_start + 100)
    if next_section < 0:
        next_section = html.find('</div>\n</div>', linker_grid_start + 100)
    grid_segment = html[linker_grid_start:next_section]
    last_div = grid_segment.rfind('</div>')
    if last_div > 0:
        insert_at = linker_grid_start + last_div
        html = html[:insert_at] + '\n' + MISSING_LINKERS + '\n' + html[insert_at:]
        print(f"Inserted 7 linker cards into gridLinkers")
    else:
        print("ERROR: could not find end of gridLinkers")

# Update filterPayloadCls to match exact data-cls values used
# Our cards use: "PROTACs", "ISACs", "Radionuclide", "Protein Toxin", "Oligonucleotide"
# Fix filter values to match exactly
html = html.replace(
    '<option value="ISAC">ISACs (Immune Stimulating)</option>',
    '<option value="ISACs">ISACs (Immune Stimulating)</option>'
)
html = html.replace(
    '<option value="PROTAC">PROTACs (Degraders)</option>',
    '<option value="PROTACs">PROTACs (Degraders)</option>'
)

with open('adc_database.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved adc_database.html")

# Verify
with open('adc_database.html', encoding='utf-8') as f:
    html2 = f.read()
import re
payload_cards = len(re.findall(r'badge-payload', html2))
linker_cards = len(re.findall(r'badge-linker', html2))
print(f"Payload badge count (should be 38): {payload_cards}")
print(f"Linker badge count (should be 29): {linker_cards}")
