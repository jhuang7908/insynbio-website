"""
Full audit of all KB pages:
1. Are cards collapsed by default?
2. Multi-column grid (class="grid" or "card-grid")?
3. Filter/search function coverage for each grid?
4. Any grid missing the grid class?
"""
import re, os

PAGES = [
    'adc_database.html',
    'vaccine_kb_data.html',
    'component-browser.html',
    'antibody-guide.html',
    'ada_database.html',
]

print("=" * 70)
print("KB AUDIT: Collapse / Grid / Filter Coverage")
print("=" * 70)

for fname in PAGES:
    if not os.path.exists(fname):
        print(f"\n[{fname}] FILE NOT FOUND")
        continue
    with open(fname, encoding='utf-8') as f:
        html = f.read()
    print(f"\n{'─'*70}")
    print(f"  {fname}")
    print(f"{'─'*70}")

    # ── 1. Cards expanded by default? ──────────────────────────────────────
    # <details open> → expanded
    open_details = len(re.findall(r'<details\b[^>]*\bopen\b', html))
    total_details = len(re.findall(r'<details\b', html))
    # <div class="card expanded"> → expanded
    expanded_divs = len(re.findall(r'class="[^"]*\bcard\b[^"]*\bexpanded\b', html))
    total_cards   = len(re.findall(r'class="[^"]*\bcard\b', html))
    print(f"  Cards (<details>): {total_details} total, {open_details} with 'open' (expanded by default)")
    print(f"  Cards (<div>): {total_cards} total, {expanded_divs} with 'expanded' class")

    # ── 2. Grid containers ─────────────────────────────────────────────────
    grids_with_class = re.findall(r'<div\s+class="[^"]*\b(?:grid|card-grid)\b[^"]*"\s+id="([^"]+)"', html)
    grids_without = re.findall(r'<div\s+id="([^"]+)"(?![^>]*class=)', html)
    # Any div id ending in Grid/grid without grid class?
    bare_grid_ids = [gid for gid in grids_without if 'grid' in gid.lower() or 'Grid' in gid]
    print(f"  Grid divs with grid class: {grids_with_class}")
    if bare_grid_ids:
        print(f"  WARNING – divs with 'grid' in id but NO grid class: {bare_grid_ids}")

    # Also check divs that have id containing Grid but might be missing class
    all_div_ids = re.findall(r'<div[^>]+id="([^"]+)"[^>]*>', html)
    grid_id_divs = [(gid, re.search(r'<div[^>]+id="' + re.escape(gid) + r'"[^>]*>', html)) for gid in all_div_ids if 'grid' in gid.lower() or 'Grid' in gid]
    for gid, m in grid_id_divs:
        if m:
            tag = m.group(0)
            has_class = 'grid' in tag or 'card-grid' in tag
            if not has_class:
                print(f"  MISSING GRID CLASS: <div id=\"{gid}\"> → {tag[:100]}")

    # ── 3. Search / filter function coverage ─────────────────────────────────
    # Look for search inputs and the IDs they target
    search_ids = re.findall(r'id="(search\w+)"', html)
    filter_ids  = re.findall(r'id="(filter\w+)"', html)
    
    # Look for JS event listener attachment for these IDs
    # Common patterns: .addEventListener('input', ...) or .oninput = or onChange
    event_patterns = re.findall(r"'(search\w+|filter\w+)'", html)
    
    print(f"  Search input IDs: {search_ids}")
    print(f"  Filter select IDs: {filter_ids}")
    
    # Check that each search/filter ID appears in JS event listener code
    js_section = html[html.rfind('<script'):]
    for sid in search_ids + filter_ids:
        if sid not in js_section:
            print(f"  WARNING – '{sid}' not found in JS section (event not attached?)")

    # ── 4. filterGrid / render calls for each grid ───────────────────────────
    filter_calls = re.findall(r"filterGrid\('([^']+)'", html)
    render_calls = re.findall(r"getElementById\('([^']+)'\)\.innerHTML\s*=", html)
    print(f"  filterGrid calls for: {filter_calls}")
    print(f"  innerHTML render targets: {[r for r in render_calls if 'grid' in r.lower() or 'Grid' in r]}")

print("\n" + "=" * 70)
print("AUDIT COMPLETE")
print("=" * 70)
