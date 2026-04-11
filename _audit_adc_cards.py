import re

with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

pi = html.find('id="gridPayloads"')
li = html.find('id="gridLinkers"')
payload_section = html[pi:li]

# All cards in payload section
cards = re.findall(r'<div class="card" onclick="toggleCard\(this\)" ([^>]+)>', payload_section)
print(f"Total payload cards found: {len(cards)}")
print()

for attr_str in cards:
    cls_m = re.search(r'data-cls="([^"]+)"', attr_str)
    search_m = re.search(r'data-search="([^"]+)"', attr_str)
    cls = cls_m.group(1) if cls_m else 'NONE'
    title = search_m.group(1).split()[0] if search_m else 'NONE'
    print(f"  cls={cls!r:40}  name={title[:30]}")

print()
# Linker section
lsect_start = html.find('id="gridLinkers"')
lsect_end = html.find('<div class="tab-panel"', lsect_start + 100)
linker_section = html[lsect_start:lsect_end]
lcards = re.findall(r'<div class="card" onclick="toggleCard\(this\)" ([^>]+)>', linker_section)
print(f"Total linker cards found: {len(lcards)}")
print()
for attr_str in lcards:
    ltype_m = re.search(r'data-ltype="([^"]+)"', attr_str)
    search_m = re.search(r'data-search="([^"]+)"', attr_str)
    ltype = ltype_m.group(1) if ltype_m else 'NONE'
    title = search_m.group(1).split()[0] if search_m else 'NONE'
    print(f"  ltype={ltype!r:40}  name={title[:30]}")
