"""
Replace old/non-standard headers in the 3 database pages with the standard InSynBio header.
"""
import re

STANDARD_HEADER = '''<header class="top-header">
  <div class="brand">
    <a href="index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
      <svg width="34" height="28" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
        <path d="M16 2L2 10V22L16 28L30 22V10L16 2Z" fill="#0d9488" fill-opacity="0.05" stroke="#0d9488" stroke-width="1" stroke-opacity="0.3"/>
        <path d="M14.5 24 V 16" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M17.5 24 V 16" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="13" y1="19" x2="19" y2="19" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="13" y1="21" x2="19" y2="21" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M14.5 16 L 8 7" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M10 16 L 3.5 7" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M17.5 16 L 24 7" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="21.5" y="3.5" width="5" height="5" rx="1" fill="#f59e0b" transform="rotate(45 24 6)"/>
      </svg>
      <span style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:24px;color:#1f2937;letter-spacing:-.02em;">In<span style="color:#0d9488;">Syn</span>Bio</span>
    </a>
  </div>
  <span class="std-slogan">AI for Life Sciences</span>
  <button class="std-mobile-btn" onclick="document.querySelector('.std-top-nav').classList.toggle('open')" aria-label="Open navigation">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
  <nav class="std-top-nav">
    <button class="std-nav-close" onclick="document.querySelector('.std-top-nav').classList.remove('open')">&#10005;</button>
    <a href="index.html">Home</a>
    <div class="std-nav-dd" tabindex="0">
      <a href="index.html#services">AI Drug Design</a>
      <div class="std-dd-menu">
        <a href="InSynBio_Antibody_Developability_Assessment_Page.html"><span class="std-mt">Antibody R&amp;D</span><span class="std-md">Humanization, CMC, Immunogenicity</span></a>
        <a href="InSynBio_ADC_Design_Page.html"><span class="std-mt">Smart ADC Design</span><span class="std-md">Antigen-Payload-Linker Matching</span></a>
        <a href="InSynBio_CART_Design_Page.html"><span class="std-mt">Smart CAR-T Design</span><span class="std-md">Architecture &amp; Component Optimization</span></a>
        <a href="InSynBio_Bispecific_Antibody_Design_Page.html"><span class="std-mt">Bispecific Design</span><span class="std-md">Format Screening · CMC · Pairing</span></a>
        <a href="vaccine_design.html"><span class="std-mt">Vaccine Design</span><span class="std-md">Neoantigen · Heteroclitic · mRNA</span></a>
      </div>
    </div>
    <div class="std-nav-dd" tabindex="0">
      <a href="antibody-guide.html" class="std-active">Clinical Reference Library</a>
      <div class="std-dd-menu">
        <a href="antibody-guide.html"><span class="std-mt">Antibody Engineering Guide</span><span class="std-md">Standards &amp; Design Principles</span></a>
        <a href="ada_database.html"><span class="std-mt">ADA Database</span><span class="std-md">138 Clinical Immunogenicity Benchmarks</span></a>
        <a href="adc_database.html"><span class="std-mt">ADC Database</span><span class="std-md">100 Clinical ADC Programs</span></a>
        <a href="component-browser.html"><span class="std-mt">CAR Component Library</span><span class="std-md">237 CAR-T Engineering Components</span></a>
        <a href="vaccine_kb_data.html"><span class="std-mt">Vaccine Knowledge Base</span><span class="std-md">Antigens &amp; Adjuvant Data</span></a>
      </div>
    </div>
    <div class="std-nav-dd" tabindex="0">
      <a href="index.html#case-studies">Case Studies</a>
      <div class="std-dd-menu">
        <a href="case_mumab4d5_humanization_en.html"><span class="std-mt">muMAb4D5 Humanization</span><span class="std-md">CDR Grafting + Back-mutations</span></a>
        <a href="case_mumab4d5_cmc.html"><span class="std-mt">muMAb4D5 CMC Assessment</span><span class="std-md">15 Developability Metrics Passed</span></a>
        <a href="case_mumab4d5_vhh_en.html"><span class="std-mt">VH &#x2192; HER2 VHH Conversion</span><span class="std-md">Nanobody Engineering &amp; CMC Optimization</span></a>
        <a href="case_vgrw_sr_r2_affinity_maturation.html"><span class="std-mt">VHH Affinity Maturation</span><span class="std-md">Binding Energy Improved &#x2212;3.32 kcal/mol</span></a>
        <a href="case_bispecific_vhh_expression_optimization.html"><span class="std-mt">Bispecific VHH Optimization</span><span class="std-md">pI Engineering + 4.8&#xd7; IC90 Boost</span></a>
        <a href="case_bispecific_vhvl_pairing.html"><span class="std-mt">Bispecific VH/VL Pairing</span><span class="std-md">Structure-guided HC-LC Pairing</span></a>
        <a href="case_malaria_carm_design.html"><span class="std-mt">CAR-M Design</span><span class="std-md">Anti-CIDRα1 Dual-binder CAR-Macrophage</span></a>
        <a href="case_fentanyl_hapten_vam.html"><span class="std-mt">Fentanyl Hapten VAM</span><span class="std-md">Affinity Maturation &#x2212;5.53 kcal/mol</span></a>
        <a href="case_pdl1_epitope_analysis.html"><span class="std-mt">PD-L1 Epitope Analysis</span><span class="std-md">Blocking vs Non-blocking Classification</span></a>
      </div>
    </div>
    <a href="InSynBio_OurTech.html">Our Tech</a>
    <div class="std-nav-dd" tabindex="0">
      <a href="index.html#about">About Us</a>
      <div class="std-dd-menu">
        <a href="index.html#about"><span class="std-mt">About InSynBio</span><span class="std-md">Team background &amp; mission</span></a>
        <a href="index.html#workflow"><span class="std-mt">Workflow</span><span class="std-md">From inquiry to delivery</span></a>
      </div>
    </div>
    <a href="index.html#contact">Contact Us</a>
  </nav>
</header>'''

STANDARD_NAV_CSS = '''
    /* ── Standard top header ── */
    .top-header { display:flex; align-items:center; justify-content:space-between; padding:12px 32px; background:rgba(255,255,255,0.95); backdrop-filter:blur(12px); border-bottom:2px solid rgba(13,148,136,0.1); flex-wrap:nowrap; gap:12px; position:fixed; width:100%; top:0; z-index:2000; }
    .std-slogan { font-size:13px; color:var(--text-muted,#6b7280); padding-left:14px; border-left:1px solid var(--border,#e5e7eb); white-space:nowrap; font-weight:500; letter-spacing:.02em; flex-shrink:0; }
    .std-mobile-btn { display:none; background:none; border:none; padding:6px; cursor:pointer; color:var(--text,#111827); flex-shrink:0; }
    .std-nav-close { display:none; }
    .std-top-nav { display:flex; align-items:center; gap:6px; flex:1; justify-content:center; }
    .std-top-nav > a, .std-nav-dd > a { padding:8px 16px; font-size:14px; color:var(--text-muted,#6b7280); text-decoration:none; border-radius:20px; transition:all .2s; font-weight:500; }
    .std-top-nav > a:hover, .std-nav-dd > a:hover { color:var(--primary,#0d9488); background:rgba(13,148,136,.06); }
    .std-active { background:var(--primary,#0d9488) !important; color:#fff !important; box-shadow:0 2px 8px rgba(13,148,136,.25); }
    .std-nav-dd { position:relative; }
    .std-nav-dd > a::after { content:' ▾'; font-size:10px; opacity:.6; margin-left:4px; }
    .std-nav-dd .std-dd-menu { position:absolute; top:100%; left:50%; transform:translateX(-50%) translateY(10px); min-width:220px; padding:8px; background:#fff; border:1px solid rgba(0,0,0,.06); border-radius:12px; box-shadow:0 10px 40px -10px rgba(0,0,0,.12); opacity:0; visibility:hidden; transition:all .2s cubic-bezier(.16,1,.3,1); z-index:100; margin-top:8px; }
    .std-nav-dd:hover .std-dd-menu, .std-nav-dd:focus-within .std-dd-menu { opacity:1; visibility:visible; transform:translateX(-50%) translateY(0); }
    .std-dd-menu a { display:block; padding:12px 16px; color:var(--text,#111827); text-decoration:none; border-radius:8px; font-size:14px; font-weight:400; }
    .std-dd-menu a:hover { background:var(--bg-alt,#f9fafb); }
    .std-mt { display:block; font-weight:600; font-size:14px; color:var(--text,#111827); margin-bottom:2px; }
    .std-dd-menu a:hover .std-mt { color:var(--primary,#0d9488); }
    .std-md { display:block; font-size:12px; color:var(--text-muted,#6b7280); line-height:1.4; }
    @media (max-width:768px) {
      .std-mobile-btn { display:block; }
      .top-header { padding:10px 16px !important; }
      .std-top-nav { position:fixed; top:0; left:0; width:100vw; height:100vh; background:#fff; flex-direction:column; justify-content:center; align-items:center; gap:4px; z-index:9999; opacity:0; pointer-events:none; transition:opacity .25s; padding:24px; overflow-y:auto; }
      .std-top-nav.open { opacity:1; pointer-events:auto; }
      .std-top-nav > a, .std-nav-dd > a { font-size:18px; padding:12px 24px; }
      .std-nav-close { display:block; position:absolute; top:16px; right:20px; background:none; border:none; font-size:32px; color:var(--text,#111827); cursor:pointer; line-height:1; padding:4px 8px; }
      .std-nav-dd .std-dd-menu { position:static; transform:none; opacity:1; visibility:visible; box-shadow:none; border:none; padding:0; width:100%; }
      .std-nav-dd > a::after { display:none; }
    }'''

# ── Process each page ────────────────────────────────────────────────────────
PAGES = {
    'ada_database.html': {
        'old_header_pattern': r'<header class="top-header">.*?</header>',
        'body_top_offset': 52,   # body padding-top to fix
    },
    'adc_database.html': {
        'old_header_pattern': r'<div class="top-bar">.*?</div>\s*\n',
        'body_top_offset': 60,
    },
    'vaccine_kb_data.html': {
        'old_header_pattern': r'<header class="topbar">.*?</header>',
        'body_top_offset': 62,
    },
}

for fname, cfg in PAGES.items():
    try:
        with open(fname, encoding='utf-8') as f:
            html = f.read()
    except FileNotFoundError:
        print(f'SKIP: {fname} not found')
        continue

    # Replace old header with standard one
    new_html, n = re.subn(cfg['old_header_pattern'], STANDARD_HEADER, html, flags=re.DOTALL)
    if n == 0:
        print(f'WARNING: no header match in {fname}')
        continue
    print(f'[{fname}] Replaced header ({n} match)')

    # Inject nav CSS before </style>
    if STANDARD_NAV_CSS not in new_html:
        new_html = new_html.replace('</style>', STANDARD_NAV_CSS + '\n  </style>', 1)
        print(f'  + injected nav CSS')

    # Update body padding-top to match standard 52px
    new_html = re.sub(
        r'body\s*\{([^}]*?padding-top:\s*\d+px[^}]*?)\}',
        lambda m: m.group(0).replace(m.group(1), m.group(1).replace(
            re.search(r'padding-top:\s*\d+px', m.group(1)).group(0), 'padding-top: 52px'
        )),
        new_html
    )

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f'  saved.\n')

print('Done.')
