"""Add mobile-menu-btn HTML element to pages that have slogan but no hamburger button."""
import os, re

BASE = r"D:\InSynBio-AI-Research\Antibody_Engineer_Suite\insynbio-web-source"

MOBILE_BTN = ('  <button class="mobile-menu-btn" onclick="document.querySelector'
              "('.top-header-nav').classList.toggle('open')\" aria-label=\"Open navigation\">\n"
              '    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
              ' stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/>'
              '<line x1="3" y1="6" x2="21" y2="6"/>'
              '<line x1="3" y1="18" x2="21" y2="18"/></svg>\n'
              '  </button>')

pages = [f for f in os.listdir(BASE) if f.endswith('.html')]
fixed = []

for fname in sorted(pages):
    fpath = os.path.join(BASE, fname)
    with open(fpath, encoding='utf-8') as f:
        html = f.read()

    # Check for the HTML button element (not just CSS class)
    has_btn_html = '<button class="mobile-menu-btn"' in html
    has_nav = 'class="top-header-nav"' in html
    has_slogan = 'class="slogan"' in html

    if has_nav and has_slogan and not has_btn_html:
        # Insert mobile-menu-btn before <nav class="top-header-nav">
        # But only when it's the main nav (not inside a nested structure)
        new_html = html.replace(
            '  <nav class="top-header-nav">',
            f'{MOBILE_BTN}\n  <nav class="top-header-nav">',
            1
        )
        if new_html != html:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_html)
            fixed.append(fname)
            print(f'  [{fname}] Added mobile-menu-btn')
        else:
            print(f'  [{fname}] Replacement not found (nav indented differently?)')

print(f'\nFixed {len(fixed)} files')
