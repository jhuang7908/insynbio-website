import re, os

PAGES = [
    'adc_database.html',
    'vaccine_kb_data.html',
    'component-browser.html',
    'antibody-guide.html',
    'ada_database.html',
]

for fname in PAGES:
    if not os.path.exists(fname): continue
    # Read first 2000 lines only for CSS/structure checks, last 3000 for JS
    with open(fname, encoding='utf-8') as f:
        lines = f.readlines()
    total_lines = len(lines)
    head = ''.join(lines[:2000])
    tail = ''.join(lines[max(0,total_lines-3000):])
    full = head + tail  # approximate, may miss middle but good enough

    print(f"\n=== {fname} ({total_lines} lines) ===")

    # 1. Grid CSS
    has_grid_css = '.grid {' in head or '.card-grid {' in head
    grid_css = re.findall(r'\.(grid|card-grid)\s*\{[^}]{0,120}', head)
    print(f"  Grid CSS: {['.' + g[0] for g in re.findall(r'\.(card-grid|grid)\b', head[:3000])][:5]}")
    for gc in grid_css:
        cols = re.search(r'grid-template-columns:[^;]+', gc)
        if cols: print(f"    columns: {cols.group(0)}")

    # 2. Details/card expand state
    open_details = head.count('<details open') + tail.count('<details open')
    total_details = head.count('<details') + tail.count('<details')
    print(f"  <details open> (expanded by default): {open_details} / ~{total_details} total")

    # 3. Grid div IDs and whether they have grid class
    grid_divs = re.findall(r'<div\s+([^>]*id="[^"]*[Gg]rid[^"]*"[^>]*)>', head+tail)
    for gd in grid_divs[:15]:
        has_grid_cls = 'class=' in gd and ('grid' in gd or 'card-grid' in gd)
        id_m = re.search(r'id="([^"]+)"', gd)
        gid = id_m.group(1) if id_m else '?'
        status = '✓' if has_grid_cls else '✗ MISSING GRID CLASS'
        print(f"    [{status}] id={gid}")

    # 4. Search/filter IDs in JS (tail)
    filter_calls = re.findall(r"filterGrid\('([^']+)'", tail)
    render_innerHTML = re.findall(r"getElementById\('([^']+)'\)\.innerHTML\s*=", tail)
    grid_renders = [r for r in render_innerHTML if 'grid' in r.lower() or 'Grid' in r]
    search_ids = re.findall(r'id="(search\w+)"', head+tail)
    filter_ids  = re.findall(r'id="(filter\w+)"', head+tail)
    print(f"  filterGrid calls: {filter_calls}")
    print(f"  JS renders grids: {grid_renders}")
    print(f"  Search inputs: {search_ids}")
    print(f"  Filter selects: {filter_ids}")

print("\nDone.")
