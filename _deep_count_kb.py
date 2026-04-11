"""
Deep element counts for all KB pages, looking at JS data arrays too.
"""
import re, os

def deep_count(path, label=""):
    if not os.path.exists(path):
        return f"  FILE NOT FOUND"
    with open(path, encoding='utf-8') as f:
        html = f.read()
    
    fname = os.path.basename(path)
    results = []
    
    if 'adc' in fname.lower() or 'ADC' in fname:
        n_payload = len(re.findall(r'data-cls="[^"]+?"', html))
        n_linker  = len(re.findall(r'data-ltype="[^"]+?"', html))
        n_prog    = len(re.findall(r'class="card"[^>]*onclick[^>]*data-prog', html))
        # Count program records (they use data-stage or similar)
        n_stage   = len(re.findall(r'data-stage="[^"]*"', html))
        n_target  = len(re.findall(r'data-target="[^"]*"', html))
        n_cards   = len(re.findall(r'<div class="card" onclick="toggleCard', html))
        results.append(f"Payload cards: {n_payload}")
        results.append(f"Linker cards:  {n_linker}")
        results.append(f"Clinical program cards (data-stage): {n_stage}")
        results.append(f"Antigen cards (data-target): {n_target}")
        results.append(f"Total .card onclick: {n_cards}")
        
    elif 'ada' in fname.lower():
        # ADA data is in a JS array
        match = re.search(r'const\s+(?:ADA_DATA|data|antibodies|records)\s*=\s*\[', html)
        if match:
            arr_start = match.end() - 1
            depth = 0
            for i, ch in enumerate(html[arr_start:], arr_start):
                if ch == '[': depth += 1
                elif ch == ']': depth -= 1
                if depth == 0:
                    arr_str = html[arr_start:i+1]
                    n = len(re.findall(r'\{', arr_str))
                    results.append(f"JS records in data array: ~{n} objects")
                    break
        # Count table rows
        n_tr = len(re.findall(r'<tr[^>]*data-id=', html))
        results.append(f"<tr> rows with data-id: {n_tr}")
        n_tr2 = len(re.findall(r'<tr\b[^>]*class="[^"]*row', html))
        results.append(f"<tr> rows with row class: {n_tr2}")
        
    elif 'component' in fname.lower() or 'CAR' in fname or 'car' in fname.lower():
        # CAR components
        n_comp = len(re.findall(r'class="comp-card"', html))
        n_cards = len(re.findall(r'class="card"', html))
        # Check JS data
        match = re.search(r'const\s+(?:COMPONENTS|components|data|CAR_DATA)\s*=\s*\[', html)
        if match:
            arr_start = match.end() - 1
            depth = 0
            for i, ch in enumerate(html[arr_start:], arr_start):
                if ch == '[': depth += 1
                elif ch == ']': depth -= 1
                if depth == 0:
                    arr_str = html[arr_start:i+1]
                    n = len(re.findall(r'"id"', arr_str))
                    results.append(f'JS records (by "id" key): {n}')
                    break
        results.append(f"comp-card elements: {n_comp}")
        results.append(f"card elements: {n_cards}")
        
        # Count by category in scripts
        cats = re.findall(r'"category"\s*:\s*"([^"]+)"', html)
        if cats:
            from collections import Counter
            cat_counts = Counter(cats)
            results.append(f"Category breakdown:")
            for cat, cnt in sorted(cat_counts.items()):
                results.append(f"  {cat}: {cnt}")
    
    elif 'vaccine' in fname.lower():
        # Vaccine data
        n_ag = len(re.findall(r'"antigen"', html))
        n_adj = len(re.findall(r'"adjuvant"', html))
        n_tr = len(re.findall(r'<tr\b[^>]*data-', html))
        n_card = len(re.findall(r'class="card"', html))
        # Check for ag-row or similar
        n_row = len(re.findall(r'<tr\b[^>]*class="[^"]*ag-row', html))
        results.append(f'"antigen" occurrences: {n_ag}')
        results.append(f'"adjuvant" occurrences: {n_adj}')
        results.append(f"<tr> with data-: {n_tr}")
        results.append(f"<tr> ag-row: {n_row}")
        results.append(f"class=card: {n_card}")
        # Look for VaccineData or similar
        m = re.search(r'(?:VAX_DATA|vaccineData|VACCINES|antigens)\s*=\s*\[', html)
        if m:
            depth = 0
            for i, ch in enumerate(html[m.start():m.start()+50000], m.start()):
                if ch == '[': depth += 1
                elif ch == ']': depth -= 1
                if depth == 0:
                    arr_str = html[m.start():i+1]
                    n = len(re.findall(r'"name"', arr_str))
                    results.append(f'JS vaccine records (by "name"): {n}')
                    break
    
    elif 'antibody-guide' in fname or 'Antibody_Guide' in fname:
        n_fc_row = len(re.findall(r'<tr\b[^>]*(?:class="fc-row"|data-)', html))
        n_card = len(re.findall(r'class="card"', html))
        n_comp = len(re.findall(r'class="comp-card"', html))
        # JS data
        m = re.search(r'(?:FC_DATA|fcData|FC_VARIANTS)\s*=\s*\[', html)
        if m:
            depth = 0
            for i, ch in enumerate(html[m.start():m.start()+200000], m.start()):
                if ch == '[': depth += 1
                elif ch == ']': depth -= 1
                if depth == 0:
                    arr_str = html[m.start():i+1]
                    n = len(re.findall(r'"name"', arr_str))
                    results.append(f'JS FC records (by "name"): {n}')
                    break
        results.append(f"fc-row <tr>: {n_fc_row}")
        results.append(f"card elements: {n_card}")
        results.append(f"comp-card: {n_comp}")
    
    else:
        results.append("(unknown page type)")
    
    return "\n".join(f"  {r}" for r in results)

pages = [
    ("ADC Database",
     "adc_database.html",
     "../therasik-web-source/Therasik_ADC_Database.html"),
    ("ADA Database",
     "ada_database.html",
     "../therasik-web-source/Therasik_Antibody_Guide.html"),
    ("CAR Component Browser",
     "component-browser.html",
     "../therasik-web-source/Therasik_CAR_KB.html"),
    ("Vaccine KB",
     "vaccine_kb_data.html",
     "../therasik-web-source/Therasik_Vaccine_KB.html"),
    ("Antibody Guide",
     "antibody-guide.html",
     "../therasik-web-source/Therasik_Antibody_Guide.html"),
]

for label, ins_path, therasik_path in pages:
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")
    print(f"[InSynBio]")
    print(deep_count(ins_path))
    print(f"[Therasik]")
    print(deep_count(therasik_path))
