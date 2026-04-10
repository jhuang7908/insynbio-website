"""Deep audit: find all potential crashes in the antibody-guide script."""
import re, json

with open('antibody-guide.html', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
js = scripts[1]

# ── 1. Check FC_DATA field completeness ──────────────────────────────────────
fc_m = re.search(r'const FC_DATA = \[(.*?)\n\];', js, re.DOTALL)
if fc_m:
    fc_raw = fc_m.group(1)
    entries = re.split(r'\n\{id:', fc_raw)
    required_for_render = ['id', 'cat', 'tier', 'name', 'alias', 'brief', 'examples', 'mechanism', 'receptors', 'ref']
    for entry in entries:
        if not entry.strip():
            continue
        eid = re.search(r"^'([^']+)'", entry)
        eid = eid.group(1) if eid else 'unknown'
        for field in required_for_render:
            if field + ':' not in entry and field + ': ' not in entry:
                print(f'[FC] {eid}: MISSING field {field!r}')
    print(f'FC_DATA: {len([e for e in entries if e.strip()])} entries checked')

# ── 2. Check ADC_CLINICAL_DATA (also uses renderFcCard) ──────────────────────
adc_m = re.search(r'const ADC_CLINICAL_DATA = \[(.*?)\n\];', js, re.DOTALL)
if adc_m:
    adc_raw = adc_m.group(1)
    entries = re.split(r'\n\{id:', adc_raw)
    for entry in entries:
        if not entry.strip():
            continue
        eid = re.search(r"^'([^']+)'", entry)
        eid = eid.group(1) if eid else 'unknown'
        if 'examples:' not in entry:
            print(f'[ADC_CLINICAL] {eid}: MISSING examples field')
        if 'tier:' not in entry:
            print(f'[ADC_CLINICAL] {eid}: MISSING tier field')
    print(f'ADC_CLINICAL_DATA: {len([e for e in entries if e.strip()])} entries checked')

# ── 3. Check ADC_DATA (also uses renderFcCard) ───────────────────────────────
adc2_m = re.search(r'const ADC_DATA = \[(.*?)\n\];', js, re.DOTALL)
if adc2_m:
    adc2_raw = adc2_m.group(1)
    entries2 = re.split(r'\n\{id:', adc2_raw)
    for entry in entries2:
        if not entry.strip():
            continue
        eid = re.search(r"^'([^']+)'", entry)
        eid = eid.group(1) if eid else 'unknown'
        if 'examples:' not in entry:
            print(f'[ADC_DATA] {eid}: MISSING examples field')
        if 'tier:' not in entry:
            print(f'[ADC_DATA] {eid}: MISSING tier field (ok if not used)')
    print(f'ADC_DATA: {len([e for e in entries2 if e.strip()])} entries checked')

# ── 4. Verify IP_STATUS keys ─────────────────────────────────────────────────
ip_keys = re.findall(r'const IP_STATUS = \{(.*?)\};', js, re.DOTALL)
if ip_keys:
    keys = re.findall(r'(\w+):\s*\{', ip_keys[0])
    print(f'\nIP_STATUS keys: {keys}')

# ── 5. Check resolveIpStatus handles all status values ───────────────────────
all_statuses = re.findall(r"status:'([^']+)'", js)
unique_statuses = set(all_statuses)
print(f'All ip.status values in data: {unique_statuses}')

# ── 6. Look for DOMAINS initialization to spot any missing data references ───
dom_m = re.search(r'const DOMAINS = \{(.*?)\n\};', js, re.DOTALL)
if dom_m:
    dom_text = dom_m.group(1)
    data_refs = re.findall(r'data:\s*(\w+)', dom_text)
    print(f'\nDOMAINS data references: {data_refs}')
    for ref in data_refs:
        if f'const {ref} = ' not in js:
            print(f'  WARNING: {ref} not defined!')
        else:
            print(f'  OK: {ref} defined')

print('\nDone.')
