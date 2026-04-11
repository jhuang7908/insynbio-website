"""
Auto-detect card/row patterns across all KB pages and count elements.
Also does same for Therasik for comparison.
"""
import re, os

def detect_counts(path, label=""):
    if not os.path.exists(path):
        return f"  [FILE NOT FOUND: {path}]"
    with open(path, encoding='utf-8') as f:
        html = f.read()
    
    results = []
    
    # ADC: specific attrs
    n = len(re.findall(r'data-cls="[^"]+?"', html))
    if n: results.append(f"payload cards (data-cls): {n}")
    n = len(re.findall(r'data-ltype="[^"]+?"', html))
    if n: results.append(f"linker cards (data-ltype): {n}")
    
    # Generic card containers
    for cls in ['card', 'comp-card', 'ab-card', 'ag-card', 'adj-card', 'vac-card',
                'entry', 'drug-card', 'fc-card', 'row-card']:
        n = len(re.findall(rf'class="[^"]*\b{cls}\b[^"]*"', html))
        if n > 0:
            results.append(f'class="{cls}": {n}')
    
    # Table rows with data
    n = len(re.findall(r'<tr\b[^>]*onclick', html))
    if n: results.append(f"clickable <tr> rows: {n}")
    n = len(re.findall(r'<tr\b[^>]*data-', html))
    if n: results.append(f"<tr> with data- attrs: {n}")
    
    # Section count
    n = len(re.findall(r'<section\b', html))
    if n: results.append(f"<section> blocks: {n}")
    
    # Scripts w/ inline JSON arrays
    arrays = re.findall(r'\[[\s\S]{20,2000}?\]', html[:len(html)//2])
    for arr in arrays[:3]:
        n = len(re.findall(r'\{[^{}]{10,}?\}', arr))
        if n > 3:
            results.append(f"JSON array objects (est.): {n}")
            break
    
    if not results:
        results.append("(no recognizable element patterns found)")
    
    out = []
    for r in results:
        out.append(f"  {r}")
    return "\n".join(out)

def compare(label, insynbio_path, therasik_path):
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")
    base = os.path.dirname(os.path.abspath(insynbio_path))
    
    print(f"\n[InSynBio: {os.path.basename(insynbio_path)}]")
    print(detect_counts(insynbio_path))
    
    print(f"\n[Therasik:  {os.path.basename(therasik_path)}]")
    print(detect_counts(therasik_path))

compare("ADC Database",
    "adc_database.html",
    "../therasik-web-source/Therasik_ADC_Database.html")

compare("ADA Database",
    "ada_database.html",
    "../therasik-web-source/Therasik_Antibody_Guide.html")

compare("CAR Component Browser",
    "component-browser.html",
    "../therasik-web-source/Therasik_CAR_KB.html")

compare("Vaccine KB",
    "vaccine_kb_data.html",
    "../therasik-web-source/Therasik_Vaccine_KB.html")

compare("Antibody Guide",
    "antibody-guide.html",
    "../therasik-web-source/Therasik_Antibody_Guide.html")
