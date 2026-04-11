import re, pathlib

# === TASK 1: Fix hero height in all existing case pages ===
case_files = [
    'case_mumab4d5_humanization_en.html',
    'case_mumab4d5_cmc.html',
    'case_mumab4d5_vhh_en.html',
    'case_vgrw_sr_r2_affinity_maturation.html',
    'case_bispecific_vhh_expression_optimization.html',
    'case_bispecific_vhvl_pairing.html',
    'case_malaria_carm_design.html',
]

for f in case_files:
    p = pathlib.Path(f)
    if not p.exists():
        print(f"  SKIP (not found): {f}")
        continue
    html = p.read_text(encoding='utf-8')
    orig = html
    # Replace hero padding - 3-value form: 80px 32px 100px
    html = re.sub(
        r'(\.case-hero\s*\{[^}]*?)padding:\s*(?:80|90|100|70|60)px\s+\d+px\s+(?:80|90|100|110|120)px',
        r'\1padding: 48px 24px 56px',
        html
    )
    # Also handle 2-value form: "padding: 80px 32px"
    html = re.sub(
        r'(\.case-hero\s*\{[^}]*?)padding:\s*(?:80|90|100|70)px\s+\d+px(?=\s*;)',
        r'\1padding: 48px 24px',
        html
    )
    # Reduce h1 font-size in case-hero from large values
    html = re.sub(
        r'(\.case-hero\s+h1\s*\{[^}]*?)font-size:\s*(?:52|54|56|58|60)px',
        r'\1font-size: 44px',
        html
    )
    if html != orig:
        p.write_text(html, encoding='utf-8')
        print(f"  FIXED hero: {f}")
    else:
        print(f"  NO CHANGE: {f}")

print()

# === TASK 2: Remove Bispecific VH/VL Pairing from all nav dropdowns ===
vhvl_pattern = re.compile(
    r'\s*<a\s[^>]*href=["\']case_bispecific_vhvl_pairing\.html["\'][^>]*>.*?</a>',
    re.DOTALL
)

all_htmls = list(pathlib.Path('.').glob('*.html'))
changed = 0
for p in sorted(all_htmls):
    try:
        html = p.read_text(encoding='utf-8')
    except Exception:
        continue
    if 'case_bispecific_vhvl_pairing' not in html:
        continue
    new_html = vhvl_pattern.sub('', html)
    if new_html != html:
        p.write_text(new_html, encoding='utf-8')
        changed += 1
        print(f"  REMOVED VH/VL from nav: {p.name}")
    else:
        print(f"  WARN - reference remains in: {p.name}")

print(f"\nDone. Hero fixed in case pages; VH/VL nav removed from {changed} files.")
