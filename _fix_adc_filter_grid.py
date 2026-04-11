"""
Fix three issues in adc_database.html:
1. filterGrid uses exact match but data-cls values in cards use plurals/different case
   → Fix by changing filterGrid to use .includes() for substring matching
2. gridExp missing class="card-grid" → add class
3. Fix payload filter option values to match actual data-cls values in cards
"""
import re

with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

# ── 1. Fix filterGrid to use substring matching instead of exact match ────────
old_filter_logic = '''    var matchFilters = true;
    if (filterConfigs) {
      filterConfigs.forEach(function(fc) {
        var val = document.getElementById(fc.selectId).value;
        if (val && card.getAttribute(fc.attr) !== val) matchFilters = false;
      });
    }'''

new_filter_logic = '''    var matchFilters = true;
    if (filterConfigs) {
      filterConfigs.forEach(function(fc) {
        var val = document.getElementById(fc.selectId).value;
        if (val) {
          var attrVal = (card.getAttribute(fc.attr) || '').toLowerCase();
          if (!attrVal.includes(val.toLowerCase())) matchFilters = false;
        }
      });
    }'''

if old_filter_logic in html:
    html = html.replace(old_filter_logic, new_filter_logic)
    print("✓ Fixed filterGrid to use substring matching")
else:
    print("WARNING: old filter logic pattern not found exactly — trying partial match")
    # Try to find and fix it
    html = re.sub(
        r'if \(val && card\.getAttribute\(fc\.attr\) !== val\) matchFilters = false;',
        'if (val) { var attrVal = (card.getAttribute(fc.attr) || \'\').toLowerCase(); if (!attrVal.includes(val.toLowerCase())) matchFilters = false; }',
        html
    )
    print("  → Applied regex-based fix")

# ── 2. Fix gridExp: add class="card-grid" ─────────────────────────────────────
html = html.replace('<div id="gridExp">', '<div class="card-grid" id="gridExp">', 1)
print("✓ Added class=\"card-grid\" to gridExp")

# ── 3. Fix payload filter option values to match actual data-cls in cards ─────
# Check existing data-cls values in payload cards
data_cls_vals = re.findall(r'<div class="card"[^>]*data-cls="([^"]+)"', html)
# Only from payload section (between gridPayloads and gridLinkers)
pi = html.find('id="gridPayloads"')
li = html.find('id="gridLinkers"')
payload_section = html[pi:li]
payload_cls = list(set(re.findall(r'data-cls="([^"]+)"', payload_section)))
print("\nActual data-cls values in payload cards:")
for c in sorted(payload_cls):
    print("  " + c)

# Fix filter dropdown to exactly match data-cls values
old_payload_filter = re.search(r'id="filterPayloadCls"[^>]*>.*?</select>', html, re.DOTALL)
if old_payload_filter:
    # Build correct filter from actual values
    new_filter = '''id="filterPayloadCls">
        <option value="">All mechanism classes</option>'''
    
    # Map known data-cls values to display names
    cls_display = {
        'Tubulin Inhibitors': 'Tubulin Inhibitors',
        'Topoisomerase I Inhibitors': 'Topoisomerase I Inhibitors',
        'Dna Damaging Agents': 'DNA Damaging Agents',
        'Rna Pol Ii Inhibitors': 'RNA Pol II Inhibitors',
        'Spliceosome Inhibitors': 'Spliceosome Inhibitors',
        'Kinesin Inhibitors': 'Kinesin Inhibitors',
        'Protein Toxins': 'Protein Toxins',
        'Radionuclides': 'Radionuclides',
        'Bcl-Xl Inhibitors': 'Bcl-xL Inhibitors',
        'Ksp Inhibitors': 'KSP Inhibitors',
        'PROTACs': 'PROTACs (Degraders)',
        'ISACs': 'ISACs (Immune Stimulating)',
        'Oligonucleotide': 'Oligonucleotides',
        'Radionuclide': 'Radionuclides',
        'Protein Toxin': 'Protein Toxins',
    }
    
    shown = set()
    for cls in sorted(payload_cls):
        if cls and cls not in shown:
            display = cls_display.get(cls, cls)
            new_filter += '\n        <option value="' + cls + '">' + display + '</option>'
            shown.add(cls)
    
    new_filter += '\n      </select>'
    html = html[:old_payload_filter.start()] + new_filter + html[old_payload_filter.end():]
    print("\n✓ Updated payload filter to match actual data-cls values")

# ── 4. Fix linker filter option values ─────────────────────────────────────────
lsect_start = html.find('id="gridLinkers"')
lsect_end = html.find('<div class="tab-panel"', lsect_start + 100)
linker_section = html[lsect_start:lsect_end]
linker_types = list(set(re.findall(r'data-ltype="([^"]+)"', linker_section)))
print("\nActual data-ltype values in linker cards:")
for l in sorted(linker_types):
    print("  " + l)

# ── 5. Save ─────────────────────────────────────────────────────────────────────
with open('adc_database.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("\nSaved.")
