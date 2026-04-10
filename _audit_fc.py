import re

with open('antibody-guide.html', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
js = scripts[1]

# Extract FC_DATA block
m = re.search(r'const FC_DATA = (\[.*?\n\];)', js, re.DOTALL)
if not m:
    print('FC_DATA not found')
else:
    fc_text = m.group(1)
    ids = re.findall(r"id:'(fc[^']+)'", fc_text)
    print(f'FC_DATA entries: {len(ids)}')
    statuses = re.findall(r"status:'([^']+)'", fc_text)
    print(f'IP status values: {set(statuses)}')
    # Check for entries without examples
    for id_val in ids:
        start = fc_text.find("id:'" + id_val + "'")
        # Find end of this entry (next id: or end)
        next_id = fc_text.find("{id:", start + 5)
        chunk = fc_text[start: next_id if next_id > 0 else start+2000]
        if 'examples:' not in chunk:
            print(f'  NO examples field: {id_val}')
        if 'ip:{' in chunk or "ip:{" in chunk:
            # Find the ip status
            ip_status = re.search(r"status:'([^']*)'", chunk)
            if ip_status:
                s = ip_status.group(1).lower().split('/')[0].strip()
                valid = ['public', 'expired', 'expiring', 'active', 'public domain']
                if s not in valid:
                    print(f'  UNKNOWN status in {id_val}: {ip_status.group(1)!r} -> key={s!r}')

# Check DOMAINS block for any reference errors
if 'const DOMAINS' in js:
    print('\nDOMAINS block found')
    
# Check the renderGrid function
rg_match = re.search(r'function renderGrid\(\)(.*?)(?=\nfunction )', js, re.DOTALL)
if rg_match:
    print(f'\nrenderGrid found ({len(rg_match.group(0))} chars)')
    # Check for dom.extraHtmlTop usage
    if 'extraHtmlTop' in rg_match.group(0):
        print('  has extraHtmlTop handling')
