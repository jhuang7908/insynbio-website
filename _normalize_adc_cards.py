"""
Normalize data-cls / data-ltype in adc_database.html and rebuild filter dropdowns.
Revert filterGrid to exact match once values are consistent.
"""
import re

with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

# ── 1. Normalize payload data-cls values ────────────────────────────────────
replacements_cls = [
    # singular → plural
    ('data-cls="Radionuclide"',              'data-cls="Radionuclides"'),
    ('data-cls="Protein Toxin"',             'data-cls="Protein Toxins"'),
    # merge Immune Stimulatory Agonists → ISACs
    ('data-cls="Immune Stimulatory Agonists"', 'data-cls="ISACs"'),
]
for old, new in replacements_cls:
    count = html.count(old)
    html = html.replace(old, new)
    print(f"  cls: {count}x {repr(old)} → {repr(new)}")

# ── 2. Normalize linker data-ltype values ────────────────────────────────────
# Generic "Cleavable" → "Protease-cleavable" for linkers that are actually protease-cleavable
# (the 22 that are currently labeled "Cleavable")
# This is accurate because the actual enzymes are cathepsin B, legumain, sulfatase, phosphatase
# which are all endolysosomal proteases / enzymes. "Cleavable" is too vague.
replacements_ltype = [
    ('data-ltype="Cleavable"', 'data-ltype="Enzymatic-cleavable"'),
]
for old, new in replacements_ltype:
    count = html.count(old)
    html = html.replace(old, new)
    print(f"  ltype: {count}x {repr(old)} → {repr(new)}")

# ── 3. Revert filterGrid to exact match (substring already applied, revert) ──
html = html.replace(
    '''    var matchFilters = true;
    if (filterConfigs) {
      filterConfigs.forEach(function(fc) {
        var val = document.getElementById(fc.selectId).value;
        if (val) {
          var attrVal = (card.getAttribute(fc.attr) || '').toLowerCase();
          if (!attrVal.includes(val.toLowerCase())) matchFilters = false;
        }
      });
    }''',
    '''    var matchFilters = true;
    if (filterConfigs) {
      filterConfigs.forEach(function(fc) {
        var val = document.getElementById(fc.selectId).value;
        if (val && card.getAttribute(fc.attr) !== val) matchFilters = false;
      });
    }'''
)
print("  reverted filterGrid to exact match")

# ── 4. Rebuild payload filter dropdown ──────────────────────────────────────
# Get actual distinct data-cls values after normalization
pi = html.find('id="gridPayloads"')
li = html.find('id="gridLinkers"')
payload_section = html[pi:li]
cls_vals = sorted(set(re.findall(r'data-cls="([^"]+)"', payload_section)))
print(f"\nNormalized payload data-cls values: {cls_vals}")

cls_display = {
    'Tubulin Inhibitors':         'Tubulin Inhibitors',
    'Topoisomerase I Inhibitors': 'Topoisomerase I Inhibitors',
    'Dna Damaging Agents':        'DNA Damaging Agents',
    'Rna Polymerase Ii Inhibitors':'RNA Pol II Inhibitors',
    'Spliceosome Inhibitors':     'Spliceosome Inhibitors',
    'Ksp Inhibitors':             'KSP Inhibitors',
    'Bcl Xl Inhibitors':          'Bcl-xL Inhibitors',
    'ISACs':                      'ISACs (Immune Stimulating)',
    'PROTACs':                    'PROTACs (Degraders)',
    'Radionuclides':              'Radionuclides',
    'Protein Toxins':             'Protein Toxins',
    'Oligonucleotide':            'Oligonucleotides (siRNA/ASO)',
}

new_payload_opts = '\n        <option value="">All mechanism classes</option>'
for cv in cls_vals:
    display = cls_display.get(cv, cv)
    new_payload_opts += f'\n        <option value="{cv}">{display}</option>'

old_pf = re.search(r'id="filterPayloadCls"[^>]*>.*?</select>', html, re.DOTALL)
if old_pf:
    html = html[:old_pf.start()] + f'id="filterPayloadCls">{new_payload_opts}\n      </select>' + html[old_pf.end():]
    print("✓ Rebuilt payload filter dropdown")

# ── 5. Rebuild linker filter dropdown ────────────────────────────────────────
lsect_start = html.find('id="gridLinkers"')
lsect_end = html.find('<div class="tab-panel"', lsect_start + 100)
linker_section = html[lsect_start:lsect_end]
ltype_vals = sorted(set(re.findall(r'data-ltype="([^"]+)"', linker_section)))
print(f"\nNormalized linker data-ltype values: {ltype_vals}")

ltype_display = {
    'Enzymatic-cleavable':      'Enzymatic-cleavable (Protease/Glucuronidase/Other)',
    'Disulfide-cleavable':      'Disulfide-cleavable',
    'Glucuronidase-cleavable':  'Glucuronidase-cleavable',
    'Non-cleavable':            'Non-cleavable',
    'Conditional Activation':   'Conditional Activation',
}

new_linker_opts = '\n        <option value="">All types</option>'
for lv in ltype_vals:
    display = ltype_display.get(lv, lv)
    new_linker_opts += f'\n        <option value="{lv}">{display}</option>'

old_lf = re.search(r'id="filterLinkerType"[^>]*>.*?</select>', html, re.DOTALL)
if old_lf:
    html = html[:old_lf.start()] + f'id="filterLinkerType">{new_linker_opts}\n      </select>' + html[old_lf.end():]
    print("✓ Rebuilt linker filter dropdown")

# ── 6. Save ──────────────────────────────────────────────────────────────────
with open('adc_database.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("\nSaved.")
