import re, os

KB_PAGES = [
    'antibody-guide.html',
    'component-browser.html',
    'immunogenicity_study.html',
    'ada_database.html',
    'adc_database.html',
    'vaccine_kb_data.html',
]

for fname in KB_PAGES:
    if not os.path.exists(fname):
        print(f'{fname}: FILE NOT FOUND')
        continue
    with open(fname, encoding='utf-8') as f:
        html = f.read()
    
    has_mobile_btn_html = '<button class="mobile-menu-btn"' in html
    has_top_nav = 'top-header-nav' in html
    
    # Check if slogan is inside brand or outside
    brand_m = re.search(r'<div class="brand">(.*?)</div>', html, re.DOTALL)
    slogan_in_brand = 'slogan' in brand_m.group(1) if brand_m else False
    
    # Find slogan line
    lines = html.split('\n')
    slogan_lines = [i+1 for i, l in enumerate(lines) if 'class="slogan"' in l]
    
    print(f'{fname}:')
    print(f'  slogan in brand div: {slogan_in_brand}')
    print(f'  mobile-menu-btn HTML button: {has_mobile_btn_html}')
    print(f'  has top-header-nav: {has_top_nav}')
    for sl in slogan_lines:
        print(f'  slogan at line {sl}: {lines[sl-1].strip()[:100]}')
    print()
