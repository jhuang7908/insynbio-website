"""
Diagnose and fix misplaced payload/linker cards that were injected
outside the card-grid divs.
"""
import re

with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

# ── Find gridPayloads and gridLinkers boundaries ────────────────────────────
pi_start = html.find('<div class="card-grid" id="gridPayloads">')
li_start = html.find('<div class="card-grid" id="gridLinkers">')

# Find the closing </div> for gridPayloads  
# Count nested divs from pi_start
def find_closing_div(text, open_pos):
    """Return position AFTER the closing </div> of the div that opens at open_pos."""
    depth = 0
    i = open_pos
    while i < len(text):
        if text[i:i+4] == '<div':
            depth += 1
            i += 4
        elif text[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return i + 6
            i += 6
        else:
            i += 1
    return -1

pi_end = find_closing_div(html, pi_start)
li_end = find_closing_div(html, li_start)

print(f"gridPayloads: chars {pi_start}–{pi_end}")
print(f"gridLinkers:  chars {li_start}–{li_end}")

payload_section = html[pi_start:pi_end]
linker_section  = html[li_start:li_end]

# Count cards inside vs outside
inside_payload = len(re.findall(r'<div class="card"', payload_section))
inside_linker  = len(re.findall(r'<div class="card"', linker_section))
print(f"\nCards INSIDE gridPayloads: {inside_payload}")
print(f"Cards INSIDE gridLinkers:  {inside_linker}")

# Find cards between gridPayloads end and gridLinkers start
between = html[pi_end:li_start]
orphan_payload = re.findall(r'<div class="card"[^>]*data-cls="([^"]+)"', between)
print(f"\nOrphan payload cards (between grids): {len(orphan_payload)}")
for cls in orphan_payload:
    print(f"  data-cls={repr(cls)}")

# Find cards after gridLinkers end (before next tab-panel)
next_panel = html.find('<div class="tab-panel"', li_end)
after_linker = html[li_end:next_panel]
orphan_linker = re.findall(r'<div class="card"[^>]*data-ltype="([^"]+)"', after_linker)
print(f"\nOrphan linker cards (after gridLinkers): {len(orphan_linker)}")
for lt in orphan_linker:
    print(f"  data-ltype={repr(lt)}")

# Also check for any data-cls cards after gridLinkers
orphan_cls_after = re.findall(r'<div class="card"[^>]*data-cls="([^"]+)"', after_linker)
if orphan_cls_after:
    print(f"  (also data-cls cards after linker grid: {orphan_cls_after})")
