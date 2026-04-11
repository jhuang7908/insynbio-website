"""
Count knowledge base element totals in InSynBio pages.
Runs from insynbio-web-source/ directory.
"""
import re, os, sys

def count_in(path, **pattern_map):
    if not os.path.exists(path):
        return {'error': f'FILE NOT FOUND: {path}'}
    with open(path, encoding='utf-8') as f:
        html = f.read()
    result = {}
    for name, pattern in pattern_map.items():
        result[name] = len(re.findall(pattern, html))
    return result

# InSynBio pages
print("=" * 60)
print("InSynBio Knowledge Base Element Counts")
print("=" * 60)

# ADC Database
adc = count_in('adc_database.html',
    payload_cards = r'class="card" onclick="toggleCard\(this\)" data-cls=',
    linker_cards  = r'class="card" onclick="toggleCard\(this\)" data-ltype=',
    program_cards = r'class="card" onclick="toggleCard\(this\)" data-target=',
    antigen_cards = r'class="card" onclick="toggleCard\(this\)" data-antigen=',
)
print(f"\n[ADC Database]")
for k, v in adc.items():
    print(f"  {k}: {v}")

# ADA Database
ada = count_in('ada_database.html',
    ab_cards = r'class="ab-card"',
    rows     = r'<tr class="clickable',
)
print(f"\n[ADA Database]")
for k, v in ada.items():
    print(f"  {k}: {v}")

# CAR Component Browser
car = count_in('component-browser.html',
    comp_cards = r'class="comp-card"',
    cards_generic = r'<div class="card"',
)
print(f"\n[CAR Component Browser]")
for k, v in car.items():
    print(f"  {k}: {v}")

# Vaccine KB
vax = count_in('vaccine_kb_data.html',
    antigen_cards = r'class="ag-card"',
    adjuvant_cards = r'class="adj-card"',
    vac_cards_generic = r'<div class="card"',
    table_rows = r'<tr[^>]*class="vrow"',
)
print(f"\n[Vaccine KB]")
for k, v in vax.items():
    print(f"  {k}: {v}")

# Antibody Guide
abg = count_in('antibody-guide.html',
    section_cards = r'<div class="card"',
    fc_rows = r'<tr class="fc-row"',
    guide_sections = r'<h2 class="',
)
print(f"\n[Antibody Guide]")
for k, v in abg.items():
    print(f"  {k}: {v}")

print()
