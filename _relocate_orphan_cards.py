"""
Move orphan payload/linker cards back inside their card-grid divs.
"""
import re

with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

def find_closing_div(text, open_pos):
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

def extract_all_cards(section):
    cards = []
    i = 0
    while True:
        start = section.find('<div class="card"', i)
        if start == -1:
            break
        end = find_closing_div(section, start)
        if end == -1:
            break
        cards.append(section[start:end])
        i = end
    return cards

# ── Locate grid boundaries ─────────────────────────────────────────────────
pi_start   = html.find('<div class="card-grid" id="gridPayloads">')
pi_end     = find_closing_div(html, pi_start)
li_start   = html.find('<div class="card-grid" id="gridLinkers">')
li_end     = find_closing_div(html, li_start)
next_panel = html.find('<div class="tab-panel"', li_end)

# ── Extract orphan card HTML ────────────────────────────────────────────────
between_section  = html[pi_end:li_start]
after_section    = html[li_end:next_panel]

orphan_payload = extract_all_cards(between_section)
orphan_linker  = extract_all_cards(after_section)
print(f"Orphan payload cards: {len(orphan_payload)}")
print(f"Orphan linker cards:  {len(orphan_linker)}")

# ── Remove orphans from orphan zones ──────────────────────────────────────
clean_between = between_section
for card in orphan_payload:
    clean_between = clean_between.replace(card, '', 1)

clean_after = after_section
for card in orphan_linker:
    clean_after = clean_after.replace(card, '', 1)

# ── Inject orphans BEFORE closing </div> of their grids ───────────────────
# gridPayloads: html[pi_start .. pi_end] ends with </div>
payload_grid = html[pi_start : pi_end - 6]  # strip trailing </div>
payload_grid += '\n' + '\n'.join(orphan_payload) + '\n</div>'

linker_grid  = html[li_start : li_end - 6]
linker_grid  += '\n' + '\n'.join(orphan_linker) + '\n</div>'

# ── Reassemble ────────────────────────────────────────────────────────────
html_new = (
    html[:pi_start]
    + payload_grid
    + clean_between
    + linker_grid
    + clean_after
    + html[next_panel:]
)

# ── Verify counts ─────────────────────────────────────────────────────────
pi2     = html_new.find('<div class="card-grid" id="gridPayloads">')
pi2_end = find_closing_div(html_new, pi2)
li2     = html_new.find('<div class="card-grid" id="gridLinkers">')
li2_end = find_closing_div(html_new, li2)

inside_p = len(re.findall(r'<div class="card"', html_new[pi2:pi2_end]))
inside_l = len(re.findall(r'<div class="card"', html_new[li2:li2_end]))
print(f"\nAfter fix:")
print(f"  Cards inside gridPayloads: {inside_p}  (expected 38)")
print(f"  Cards inside gridLinkers:  {inside_l}  (expected 29)")

if inside_p == 38 and inside_l == 29:
    with open('adc_database.html', 'w', encoding='utf-8') as f:
        f.write(html_new)
    print("  ✓ Saved.")
else:
    print("  ✗ Count mismatch — NOT saved. Check script.")
