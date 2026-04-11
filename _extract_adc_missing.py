"""
Extract missing payload and linker cards from Therasik ADC database
and inject them into the InSynBio adc_database.html.
Also update the filter dropdowns.
"""
import re

# ─── Read both files ────────────────────────────────────────────────────────
with open('../therasik-web-source/Therasik_ADC_Database.html', encoding='utf-8') as f:
    therasik = f.read()
with open('adc_database.html', encoding='utf-8') as f:
    insynbio = f.read()

# ─── Helper: extract a tab panel content ────────────────────────────────────
def get_panel(html, panel_id):
    m = re.search(r'id="' + panel_id + r'"(.*?)(?=<div class="tab-panel|</div>\s*</div>\s*</body>)', html, re.DOTALL)
    return m.group(1) if m else ''

# ─── Find payload card names in each file ───────────────────────────────────
def get_card_names(panel_html):
    names = re.findall(r'<span class="cc-name"[^>]*>(.*?)</span>', panel_html, re.DOTALL)
    return [re.sub(r'<[^>]+>', '', n).strip() for n in names]

t_payload_panel = get_panel(therasik, 'panel-payloads')
i_payload_panel = get_panel(insynbio, 'panel-payloads')

t_payload_names = get_card_names(t_payload_panel)
i_payload_names = get_card_names(i_payload_panel)

print("THERASIK PAYLOADS:", len(t_payload_names))
print("INSYNBIO PAYLOADS:", len(i_payload_names))
print()

missing_payloads = [n for n in t_payload_names if n not in i_payload_names]
print("MISSING PAYLOAD CARDS:", missing_payloads)

# ─── Find linker card names ──────────────────────────────────────────────────
t_linker_panel = get_panel(therasik, 'panel-linkers')
i_linker_panel = get_panel(insynbio, 'panel-linkers')

def get_linker_names(panel_html):
    names = re.findall(r'<span class="cc-name"[^>]*>(.*?)</span>', panel_html, re.DOTALL)
    return [re.sub(r'<[^>]+>', '', n).strip() for n in names]

t_linker_names = get_linker_names(t_linker_panel)
i_linker_names = get_linker_names(i_linker_panel)

print()
print("THERASIK LINKERS:", len(t_linker_names))
print("INSYNBIO LINKERS:", len(i_linker_names))
print()
missing_linkers = [n for n in t_linker_names if n not in i_linker_names]
print("MISSING LINKER CARDS:", missing_linkers)

# ─── Extract full HTML for missing payload cards ─────────────────────────────
print("\n\n=== Extracting missing payload card HTML ===")
# Payloads cards are <div class="comp-card" ...>...</div>
# Find all cards in Therasik payload panel
all_payload_cards = re.findall(r'<div class="comp-card"[^>]*>.*?(?=<div class="comp-card"|$)', t_payload_panel, re.DOTALL)

missing_payload_html = []
for card_html in all_payload_cards:
    name_m = re.search(r'<span class="cc-name"[^>]*>(.*?)</span>', card_html, re.DOTALL)
    if name_m:
        name = re.sub(r'<[^>]+>', '', name_m.group(1)).strip()
        if name in missing_payloads:
            print(f"  Found: {name} ({len(card_html)} chars)")
            missing_payload_html.append(card_html.strip())

print(f"  Total missing payload HTML blocks: {len(missing_payload_html)}")

# ─── Extract full HTML for missing linker cards ──────────────────────────────
print("\n=== Extracting missing linker card HTML ===")
all_linker_cards = re.findall(r'<div class="comp-card"[^>]*>.*?(?=<div class="comp-card"|$)', t_linker_panel, re.DOTALL)

missing_linker_html = []
for card_html in all_linker_cards:
    name_m = re.search(r'<span class="cc-name"[^>]*>(.*?)</span>', card_html, re.DOTALL)
    if name_m:
        name = re.sub(r'<[^>]+>', '', name_m.group(1)).strip()
        if name in missing_linkers:
            print(f"  Found: {name} ({len(card_html)} chars)")
            missing_linker_html.append(card_html.strip())

print(f"  Total missing linker HTML blocks: {len(missing_linker_html)}")

# ─── Inject missing payload cards into InSynBio ─────────────────────────────
if missing_payload_html:
    # Find end of payload grid in insynbio
    # Insert before </div> that closes the payload grid
    payload_grid_end = re.search(r'(id="gridPayloads"[^>]*>)(.*?)(</div>\s*</div>\s*<!-- ═══)',
                                  insynbio, re.DOTALL)
    if payload_grid_end:
        insert_pos = payload_grid_end.end(2)
        cards_to_add = '\n    ' + '\n    '.join(missing_payload_html)
        insynbio = insynbio[:insert_pos] + cards_to_add + insynbio[insert_pos:]
        print(f"\n✓ Injected {len(missing_payload_html)} payload cards into gridPayloads")
    else:
        print("WARNING: Could not find gridPayloads insertion point")

# ─── Inject missing linker cards into InSynBio ──────────────────────────────
if missing_linker_html:
    linker_grid_end = re.search(r'(id="gridLinkers"[^>]*>)(.*?)(</div>\s*</div>\s*<!-- ═══)',
                                  insynbio, re.DOTALL)
    if linker_grid_end:
        insert_pos = linker_grid_end.end(2)
        cards_to_add = '\n    ' + '\n    '.join(missing_linker_html)
        insynbio = insynbio[:insert_pos] + cards_to_add + insynbio[insert_pos:]
        print(f"✓ Injected {len(missing_linker_html)} linker cards into gridLinkers")
    else:
        print("WARNING: Could not find gridLinkers insertion point")

# ─── Update payload filter dropdown ──────────────────────────────────────────
old_filter = re.search(r'id="filterPayloadCls"[^>]*>(.*?)</select>', insynbio, re.DOTALL)
if old_filter:
    new_payload_filter = '''id="filterPayloadCls">
        <option value="">All mechanism classes</option>
        <option value="Tubulin Inhibitor">Tubulin Inhibitors</option>
        <option value="Topoisomerase I Inhibitor">Topoisomerase I Inhibitors</option>
        <option value="DNA Damaging Agent">DNA Damaging Agents</option>
        <option value="RNA Polymerase Inhibitor">RNA Polymerase Inhibitors</option>
        <option value="Spliceosome Inhibitor">Spliceosome Inhibitors</option>
        <option value="Kinesin Inhibitor">Kinesin Inhibitors</option>
        <option value="Protein Toxin">Protein Toxins</option>
        <option value="Radionuclide">Radionuclides</option>
        <option value="ISAC">ISACs (Immune Stimulating)</option>
        <option value="PROTAC">PROTACs (Degraders)</option>
        <option value="Oligonucleotide">Oligonucleotides</option>
      </select>'''
    insynbio = insynbio[:old_filter.start()] + new_payload_filter + insynbio[old_filter.end():]
    print("✓ Updated payload filter dropdown (11 categories)")

# ─── Update linker filter dropdown ───────────────────────────────────────────
old_lfilter = re.search(r'id="filterLinkerType"[^>]*>(.*?)</select>', insynbio, re.DOTALL)
if old_lfilter:
    new_linker_filter = '''id="filterLinkerType">
        <option value="">All types</option>
        <option value="Protease-cleavable">Protease-cleavable</option>
        <option value="Glucuronidase-cleavable">Glucuronidase-cleavable</option>
        <option value="pH-cleavable">pH-cleavable</option>
        <option value="Disulfide-cleavable">Disulfide-cleavable</option>
        <option value="Non-cleavable">Non-cleavable</option>
        <option value="Conditional Activation">Conditional Activation</option>
      </select>'''
    insynbio = insynbio[:old_lfilter.start()] + new_linker_filter + insynbio[old_lfilter.end():]
    print("✓ Updated linker filter dropdown (6 categories)")

# ─── Save ────────────────────────────────────────────────────────────────────
with open('adc_database.html', 'w', encoding='utf-8') as f:
    f.write(insynbio)
print("\nSaved adc_database.html")
