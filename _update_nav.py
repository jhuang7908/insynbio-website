"""Batch-update the top-header-nav block on all InSynBio pages to match the
correct order: Home | AI Drug Design | Clinical Reference Library | Case Studies
| Our Tech | About Us | Contact Us  (same as Therasik).
"""
import re, os

BASE = r"D:\InSynBio-AI-Research\Antibody_Engineer_Suite\insynbio-web-source"


def nav(active: str) -> str:
    sa = ' class="active"' if active == "services"  else ""
    ra = ' class="active"' if active == "reference" else ""
    ca = ' class="active"' if active == "cases"     else ""
    ta = ' class="active"' if active == "tech"      else ""
    aa = ' class="active"' if active == "about"     else ""
    ha = ' class="active"' if active == "home"      else ""
    return (
        '<nav class="top-header-nav">\n'
        '    <button class="nav-close-btn" onclick="document.querySelector(\'.top-header-nav\').classList.remove(\'open\')">&#10005;</button>\n'
        f'    <a href="index.html"{ha}>Home</a>\n'
        '    <div class="nav-dropdown" tabindex="0">\n'
        f'      <a href="index.html#services"{sa}>AI Drug Design</a>\n'
        '      <div class="dropdown-menu">\n'
        '        <a href="InSynBio_Antibody_Developability_Assessment_Page.html">\n'
        '          <span class="menu-title">Antibody R&amp;D</span>\n'
        '          <span class="menu-desc">Humanization, CMC, Immunogenicity</span>\n'
        '        </a>\n'
        '        <a href="InSynBio_ADC_Design_Page.html">\n'
        '          <span class="menu-title">Smart ADC Design</span>\n'
        '          <span class="menu-desc">Antigen-Payload-Linker Matching</span>\n'
        '        </a>\n'
        '        <a href="InSynBio_CART_Design_Page.html">\n'
        '          <span class="menu-title">Smart CAR-T Design</span>\n'
        '          <span class="menu-desc">Architecture &amp; Component Optimization</span>\n'
        '        </a>\n'
        '        <a href="InSynBio_Bispecific_Antibody_Design_Page.html">\n'
        '          <span class="menu-title">Bispecific Design</span>\n'
        '          <span class="menu-desc">Format Screening · CMC · Pairing</span>\n'
        '        </a>\n'
        '        <a href="vaccine_design.html">\n'
        '          <span class="menu-title">Vaccine Design</span>\n'
        '          <span class="menu-desc">Neoantigen · Heteroclitic · mRNA</span>\n'
        '        </a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="nav-dropdown" tabindex="0">\n'
        f'      <a href="antibody-guide.html"{ra}>Clinical Reference Library</a>\n'
        '      <div class="dropdown-menu">\n'
        '        <a href="antibody-guide.html">\n'
        '          <span class="menu-title">Antibody Engineering Guide</span>\n'
        '          <span class="menu-desc">Standards &amp; Design Principles</span>\n'
        '        </a>\n'
        '        <a href="ada_database.html">\n'
        '          <span class="menu-title">ADA Database</span>\n'
        '          <span class="menu-desc">138 Clinical Immunogenicity Benchmarks</span>\n'
        '        </a>\n'
        '        <a href="adc_database.html">\n'
        '          <span class="menu-title">ADC Database</span>\n'
        '          <span class="menu-desc">100 Clinical ADC Programs</span>\n'
        '        </a>\n'
        '        <a href="component-browser.html">\n'
        '          <span class="menu-title">CAR Component Library</span>\n'
        '          <span class="menu-desc">237 CAR-T Engineering Components</span>\n'
        '        </a>\n'
        '        <a href="vaccine_kb_data.html">\n'
        '          <span class="menu-title">Vaccine Knowledge Base</span>\n'
        '          <span class="menu-desc">Antigens &amp; Adjuvant Data</span>\n'
        '        </a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="nav-dropdown" tabindex="0">\n'
        f'      <a href="index.html#case-studies"{ca}>Case Studies</a>\n'
        '      <div class="dropdown-menu">\n'
        '        <a href="case_mumab4d5_humanization_en.html">\n'
        '          <span class="menu-title">muMAb4D5 Humanization</span>\n'
        '          <span class="menu-desc">CDR Grafting + Back-mutations</span>\n'
        '        </a>\n'
        '        <a href="case_mumab4d5_cmc.html">\n'
        '          <span class="menu-title">muMAb4D5 CMC Assessment</span>\n'
        '          <span class="menu-desc">15 Developability Metrics Passed</span>\n'
        '        </a>\n'
        '        <a href="case_mumab4d5_vhh_en.html">\n'
        '          <span class="menu-title">VH &#x2192; HER2 VHH Conversion</span>\n'
        '          <span class="menu-desc">Nanobody Engineering &amp; CMC Optimization</span>\n'
        '        </a>\n'
        '        <a href="case_vgrw_sr_r2_affinity_maturation.html">\n'
        '          <span class="menu-title">VHH Affinity Maturation</span>\n'
        '          <span class="menu-desc">Binding Energy Improved &#x2212;3.32 kcal/mol</span>\n'
        '        </a>\n'
        '        <a href="case_bispecific_vhh_expression_optimization.html">\n'
        '          <span class="menu-title">Bispecific VHH Optimization</span>\n'
        '          <span class="menu-desc">pI Engineering + 4.8&#xd7; IC90 Boost</span>\n'
        '        </a>\n'
        '        <a href="case_bispecific_vhvl_pairing.html">\n'
        '          <span class="menu-title">Bispecific VH/VL Pairing</span>\n'
        '          <span class="menu-desc">Structure-guided HC-LC Pairing</span>\n'
        '        </a>\n'
        '        <a href="case_malaria_carm_design.html">\n'
        '          <span class="menu-title">CAR-M Design</span>\n'
        '          <span class="menu-desc">Anti-CIDRα1 Dual-binder CAR-Macrophage</span>\n'
        '        </a>\n'
        '        <a href="case_fentanyl_hapten_vam.html">\n'
        '          <span class="menu-title">Fentanyl Hapten VAM</span>\n'
        '          <span class="menu-desc">Affinity Maturation &#x2212;5.53 kcal/mol</span>\n'
        '        </a>\n'
        '        <a href="case_pdl1_epitope_analysis.html">\n'
        '          <span class="menu-title">PD-L1 Epitope Analysis</span>\n'
        '          <span class="menu-desc">Blocking vs Non-blocking Classification</span>\n'
        '        </a>\n'
        '      </div>\n'
        '    </div>\n'
        f'    <a href="InSynBio_OurTech.html"{ta}>Our Tech</a>\n'
        '    <div class="nav-dropdown" tabindex="0">\n'
        f'      <a href="index.html#about"{aa}>About Us</a>\n'
        '      <div class="dropdown-menu">\n'
        '        <a href="index.html#about">\n'
        '          <span class="menu-title">About InSynBio</span>\n'
        '          <span class="menu-desc">Team background &amp; mission</span>\n'
        '        </a>\n'
        '        <a href="index.html#workflow">\n'
        '          <span class="menu-title">Workflow</span>\n'
        '          <span class="menu-desc">From inquiry to delivery</span>\n'
        '        </a>\n'
        '      </div>\n'
        '    </div>\n'
        '    <a href="index.html#contact">Contact Us</a>\n'
        '  </nav>'
    )


PAGES = {
    # service pages
    "vaccine_design.html":                               "services",
    "InSynBio_Bispecific_Antibody_Design_Page.html":    "services",
    "InSynBio_CART_Design_Page.html":                   "services",
    "InSynBio_ADC_Design_Page.html":                    "services",
    "InSynBio_Antibody_Developability_Assessment_Page.html": "services",
    # reference library pages
    "antibody-guide.html":                              "reference",
    "ada_database.html":                                "reference",
    "adc_database.html":                                "reference",
    "component-browser.html":                           "reference",
    "vaccine_kb_data.html":                             "reference",
    "immunogenicity_study.html":                        "reference",
    # tech
    "InSynBio_OurTech.html":                            "tech",
    # case studies
    "case_mumab4d5_humanization_en.html":               "cases",
    "case_mumab4d5_cmc.html":                           "cases",
    "case_mumab4d5_vhh_en.html":                        "cases",
    "case_vgrw_sr_r2_affinity_maturation.html":         "cases",
    "case_bispecific_vhh_expression_optimization.html": "cases",
    "case_bispecific_vhvl_pairing.html":                "cases",
    "case_malaria_carm_design.html":                    "cases",
}

PAT = re.compile(r'<nav class="top-header-nav">.*?</nav>', re.DOTALL)

updated = []
skipped = []

for fname, active in PAGES.items():
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        skipped.append(fname)
        continue
    with open(fpath, encoding="utf-8") as fh:
        html = fh.read()
    new_html, n = PAT.subn(nav(active), html)
    if n == 0:
        skipped.append(f"{fname} (no nav found)")
        continue
    with open(fpath, "w", encoding="utf-8") as fh:
        fh.write(new_html)
    updated.append(fname)

# Fix index.html label only (do NOT replace its nav, it already has correct structure)
index_path = os.path.join(BASE, "index.html")
with open(index_path, encoding="utf-8") as fh:
    idx = fh.read()
# Update label text (exact match)
idx2 = idx.replace(">Clinical Reference<", ">Clinical Reference Library<")
if idx2 != idx:
    with open(index_path, "w", encoding="utf-8") as fh:
        fh.write(idx2)
    updated.append("index.html (label only)")
else:
    print("index.html label already correct or not found")

print(f"\nUpdated ({len(updated)}):")
for f in updated:
    print(f"  ✓ {f}")
if skipped:
    print(f"\nSkipped ({len(skipped)}):")
    for f in skipped:
        print(f"  - {f}")
