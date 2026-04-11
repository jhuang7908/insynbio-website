"""
Align all KB page heroes with antibody-guide.html standard:
  - Striped teal gradient background
  - 4px solid teal border-top
  - Cormorant Garamond h1, dark-teal color
  - Full-width (not constrained by .page max-width container)

Also fix component-browser.html nav: sticky → fixed, add mobile CSS.
"""
import re

# ─────────────────────────────────────────────────────────────
# Standard hero CSS (matches antibody-guide.html .page-header)
# ─────────────────────────────────────────────────────────────
STD_HERO_CSS = (
    "background:repeating-linear-gradient(135deg,transparent,transparent 14px,"
    "rgba(13,148,136,0.055) 14px,rgba(13,148,136,0.055) 15px),"
    "linear-gradient(135deg,#e6faf7 0%,#d4f3ed 45%,#eaf7f3 100%);"
    "border-top:4px solid #0d9488;"
    "border-bottom:1px solid rgba(13,148,136,0.18);"
    "padding:36px 40px 28px;"
)

STD_HERO_H1_CSS = (
    "font-family:'Cormorant Garamond',serif;"
    "font-size:38px;font-weight:700;"
    "margin:0 0 10px;letter-spacing:-.02em;color:#0d4a43;"
)

STD_HERO_P_CSS = (
    "color:#2d6a61;font-size:15px;"
    "margin:0 0 16px;max-width:720px;line-height:1.65;"
)

MOBILE_NAV_CSS = """
    .mobile-menu-btn{display:none;background:none;border:1px solid var(--border,#e5e7eb);border-radius:8px;padding:6px 8px;cursor:pointer;color:var(--text,#111827);line-height:0;flex-shrink:0;}
    .nav-close-btn{display:none;}
    @media(max-width:768px){
      .mobile-menu-btn{display:block;}
      .top-header{padding:10px 16px !important;flex-wrap:nowrap !important;}
      .top-header-nav{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#fff;flex-direction:column;justify-content:center;align-items:center;gap:4px;z-index:9999;opacity:0;pointer-events:none;transition:opacity .25s;padding:24px;overflow-y:auto;display:flex !important;}
      .top-header-nav.open{opacity:1;pointer-events:auto;}
      .top-header-nav a{font-size:18px;padding:12px 24px;}
      .nav-close-btn{display:block;position:absolute;top:16px;right:20px;background:none;border:none;font-size:32px;color:var(--text,#111827);cursor:pointer;line-height:1;padding:4px 8px;}
      .nav-dropdown .dropdown-menu{position:static;transform:none;opacity:1;visibility:visible;box-shadow:none;border:none;padding:0;width:100%;text-align:center;}
      .nav-dropdown .dropdown-menu a{text-align:center;}
      .nav-dropdown>a::after{display:none;}
      .slogan{display:none;}
    }"""

# ════════════════════════════════════════════════════════════
# 1. component-browser.html — fix nav position + hero style
# ════════════════════════════════════════════════════════════
print("=== component-browser.html ===")
with open('component-browser.html', encoding='utf-8') as f:
    html = f.read()

# a) Fix top-header: sticky→fixed, z-index 1000→2000, add border-bottom teal
html = html.replace(
    'position:sticky;top:0;z-index:1000',
    'position:fixed;top:0;z-index:2000'
)
# Also add flex-wrap:nowrap if not already present (it already has flex-wrap:wrap, change it)
html = html.replace(
    '.top-header{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:rgba(255,255,255,0.93);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,0.05);flex-wrap:wrap;gap:12px;position:fixed;top:0;z-index:2000;}',
    '.top-header{display:flex;align-items:center;justify-content:space-between;padding:12px 32px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:2px solid rgba(13,148,136,0.1);flex-wrap:nowrap;gap:12px;position:fixed;top:0;z-index:2000;width:100%;}'
)

# b) Add body padding-top after body { margin:0; ... }
if 'padding-top' not in re.search(r'body\{[^}]+\}', html).group(0):
    html = re.sub(
        r'(body\{[^}]+\})',
        lambda m: m.group(0).replace('}', ';padding-top:65px;}'),
        html, count=1
    )
    print("  + added body padding-top:65px")

# c) Update controls sticky offset (top:65px matches padding-top)
# already 65px, keep as-is

# d) Replace .page-header background/border with standard style
html = re.sub(
    r'(\.page-header\{)[^}]*(})',
    r'\g<1>' + STD_HERO_CSS + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.page-header h1\{)[^}]*(})',
    r'\g<1>' + STD_HERO_H1_CSS + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.page-header p\{)[^}]*(})',
    r'\g<1>' + STD_HERO_P_CSS + r'\g<2>',
    html, count=1
)
print("  + updated .page-header CSS")

# e) Add mobile nav CSS (replace the broken mobile section)
# Replace the existing broken mobile rule
html = re.sub(
    r'@media\(max-width:768px\)\{.*?\.top-header-nav\{display:none;\}.*?\}',
    '',
    html, flags=re.DOTALL
)
html = re.sub(
    r'@media\(max-width:480px\)\{[^}]+\}',
    '',
    html
)
# Inject before </style>
if MOBILE_NAV_CSS not in html:
    html = html.replace('</style>', MOBILE_NAV_CSS + '\n  </style>', 1)
    print("  + added mobile nav CSS")

# f) Add flex:1 to .top-header-nav if missing
html = html.replace(
    '.top-header-nav{display:flex;align-items:center;gap:6px;}',
    '.top-header-nav{display:flex;align-items:center;gap:6px;flex:1;justify-content:center;}'
)

with open('component-browser.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("  saved.\n")


# ════════════════════════════════════════════════════════════
# 2. vaccine_kb_data.html — extract hero from .page container
# ════════════════════════════════════════════════════════════
print("=== vaccine_kb_data.html ===")
with open('vaccine_kb_data.html', encoding='utf-8') as f:
    html = f.read()

# a) Move <section class="hero">...</section> out of <main class="page">
# Pattern: </header>\n  <main class="page">\n    <section class="hero">...</section>
hero_m = re.search(
    r'(</header>\s*<main class="page">)\s*(<section class="hero">.*?</section>)',
    html, re.DOTALL
)
if hero_m:
    full_match = hero_m.group(0)
    after_header = hero_m.group(1)
    hero_section = hero_m.group(2)
    # Change section class to page-header div, remove border-radius styling
    hero_as_ph = hero_section.replace('<section class="hero">', '<div class="page-header">').replace('</section>', '</div>')
    replacement = after_header.replace('</header>', '</header>\n' + hero_as_ph)
    # Remove hero from inside .page
    new_block = after_header  # </header><main class="page">  without the hero
    html = html.replace(full_match, hero_as_ph + '\n' + after_header)
    print("  + moved hero section outside .page container")
else:
    print("  WARNING: could not find hero inside .page pattern")

# b) Replace old .hero CSS with standard .page-header CSS
html = re.sub(
    r'(\.hero\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_CSS + 'margin-top:0;' + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.hero h1\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_H1_CSS + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.hero p\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_P_CSS + r'\g<2>',
    html, count=1
)
# Also add .page-header alias for the class we just changed in HTML
if '.page-header' not in html:
    html = html.replace('.hero {', '.hero,.page-header {', 1)
print("  + updated .hero/.page-header CSS to standard style")

# c) Update .page to remove top padding (hero is now outside)
html = re.sub(
    r'(\.page\s*\{[^}]*?)padding:32px',
    r'\g<1>padding:24px',
    html
)

with open('vaccine_kb_data.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("  saved.\n")


# ════════════════════════════════════════════════════════════
# 3. ada_database.html — update .hero CSS to standard style
# ════════════════════════════════════════════════════════════
print("=== ada_database.html ===")
with open('ada_database.html', encoding='utf-8') as f:
    html = f.read()

# Update .hero CSS
html = re.sub(
    r'(\.hero\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_CSS + 'margin-top:0;' + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.hero h1\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_H1_CSS + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.hero p\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_P_CSS + r'\g<2>',
    html, count=1
)
print("  + updated .hero CSS to standard style")

# Add body padding-top if missing
body_m = re.search(r'body\s*\{[^}]+\}', html)
if body_m and 'padding-top' not in body_m.group(0):
    html = html.replace(body_m.group(0),
                        body_m.group(0).replace('}', ';padding-top:52px;}'))
    print("  + added body padding-top:52px")

with open('ada_database.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("  saved.\n")


# ════════════════════════════════════════════════════════════
# 4. adc_database.html — extract page-header from .page, update CSS
# ════════════════════════════════════════════════════════════
print("=== adc_database.html ===")
with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

# Move page-header outside .page container
# Pattern: </header><div class="page">\n  <!-- Page header... -->\n  <div class="page-header">...</div>
ph_m = re.search(
    r'(</header><div class="page">)\s*(?:<!--[^>]*-->)?\s*(<div class="page-header">.*?</div>)',
    html, re.DOTALL
)
if ph_m:
    full_match = ph_m.group(0)
    after_header = ph_m.group(1)  # </header><div class="page">
    ph_block = ph_m.group(2)       # <div class="page-header">...</div>
    # Put page-header before .page, remove from inside .page
    replacement = '</header>\n' + ph_block + '\n<div class="page">'
    html = html.replace(full_match, replacement)
    print("  + moved page-header outside .page container")
else:
    print("  WARNING: could not find page-header inside .page for adc_database.html")

# Update .page-header CSS
html = re.sub(
    r'(\.page-header\s*\{\s*margin-bottom:\s*32px;\s*\})',
    '.page-header{' + STD_HERO_CSS + 'margin-bottom:0;}',
    html
)
html = re.sub(
    r'(\.page-header h1\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_H1_CSS + r'\g<2>',
    html, count=1
)
html = re.sub(
    r'(\.page-header p\s*\{)[^}]*(})',
    r'\g<1>' + STD_HERO_P_CSS + r'\g<2>',
    html, count=1
)
print("  + updated .page-header CSS to standard style")

with open('adc_database.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("  saved.\n")

print("All done.")
