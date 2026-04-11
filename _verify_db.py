import re
for fname in ['ada_database.html', 'adc_database.html', 'vaccine_kb_data.html']:
    with open(fname, encoding='utf-8') as f:
        html = f.read()
    has_std_slogan = '.std-slogan' in html
    has_std_nav = '.std-top-nav' in html
    m = re.search(r'body\s*\{[^}]+\}', html)
    body_pt = re.search(r'padding-top:\s*[\d]+px', m.group(0)) if m else None
    pt_val = body_pt.group(0) if body_pt else 'none'
    print(fname + ': slogan-css=' + str(has_std_slogan) + ', nav-css=' + str(has_std_nav) + ', body-pt=' + pt_val)
