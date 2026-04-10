"""
Fix header structure across all InSynBio pages:
1. Move <span class="slogan"> from INSIDE .brand to OUTSIDE (as flex sibling)
2. Add mobile-menu-btn between slogan and nav (if missing)
"""
import os, re

BASE = r"D:\InSynBio-AI-Research\Antibody_Engineer_Suite\insynbio-web-source"

MOBILE_BTN = '''  <button class="mobile-menu-btn" onclick="document.querySelector('.top-header-nav').classList.toggle('open')" aria-label="Open navigation">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>'''

pages = [f for f in os.listdir(BASE) if f.endswith('.html')]
fixed = []

for fname in sorted(pages):
    fpath = os.path.join(BASE, fname)
    with open(fpath, encoding='utf-8') as f:
        html = f.read()

    changed = False

    # Pattern: slogan INSIDE brand div (ends with </a>\n    <span class="slogan">...</span>\n  </div>)
    # We need to move the slogan OUTSIDE the brand div, right after </div>
    pattern = re.compile(
        r'(<div class="brand">.*?</a>)\s*\n(\s*<span class="slogan">([^<]*)</span>)\s*\n(\s*</div>)',
        re.DOTALL
    )
    
    def fix_slogan(m):
        brand_open_to_a = m.group(1)   # <div class="brand">...<a>...</a>
        slogan_span     = m.group(2).strip()  # <span class="slogan">...</span>
        closing_div     = m.group(4).strip()  # </div>
        # Reconstruct: brand closes after the <a>, slogan is a sibling
        return f'{brand_open_to_a}\n  </div>\n  {slogan_span}'
    
    new_html, n = pattern.subn(fix_slogan, html)
    if n > 0:
        html = new_html
        changed = True
        print(f'  [{fname}] Moved slogan outside brand')

    # Add mobile-menu-btn between slogan and <nav> if missing
    if 'mobile-menu-btn' not in html and 'top-header-nav' in html:
        # Insert before <nav class="top-header-nav">
        html = html.replace(
            '  <nav class="top-header-nav">',
            f'{MOBILE_BTN}\n  <nav class="top-header-nav">',
            1
        )
        changed = True
        print(f'  [{fname}] Added mobile-menu-btn')

    if changed:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)
        fixed.append(fname)

print(f'\nFixed {len(fixed)} files: {fixed}')
