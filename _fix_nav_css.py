"""Add full nav dropdown CSS to pages that have the new nav HTML but are missing the CSS."""
import os, re

BASE = r"D:\InSynBio-AI-Research\Antibody_Engineer_Suite\insynbio-web-source"

FULL_NAV_CSS = """    /* ── Nav dropdowns ── */
    .mobile-menu-btn { display: none; background: none; border: none; padding: 6px; cursor: pointer; color: var(--text); flex-shrink: 0; }
    .nav-close-btn { display: none; }
    .top-header-nav { display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center; }
    .top-header-nav a { padding: 8px 16px; font-size: 14px; color: var(--text-muted); text-decoration: none; border-radius: 20px; transition: all 0.2s; font-weight: 500; }
    .top-header-nav a:hover { color: var(--primary); background: rgba(13,148,136,0.06); }
    .top-header-nav a.active { background: var(--primary); color: #fff; box-shadow: 0 2px 8px rgba(13,148,136,0.25); }
    .nav-dropdown { position: relative; }
    .nav-dropdown > a::after { content: ' \\25be'; font-size: 10px; opacity: 0.6; margin-left: 4px; }
    .nav-dropdown .dropdown-menu { position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(10px); min-width: 220px; padding: 8px; background: #fff; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.12); opacity: 0; visibility: hidden; transition: all 0.2s cubic-bezier(0.16,1,0.3,1); z-index: 100; margin-top: 8px; }
    .nav-dropdown:hover .dropdown-menu, .nav-dropdown:focus-within .dropdown-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
    .nav-dropdown .dropdown-menu a { display: block; padding: 12px 16px; color: var(--text); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 400; background: transparent; }
    .nav-dropdown .dropdown-menu a:hover { background: var(--bg-alt); }
    .nav-dropdown .dropdown-menu a .menu-title { display: block; font-weight: 600; font-size: 14px; color: var(--text); margin-bottom: 2px; }
    .nav-dropdown .dropdown-menu a:hover .menu-title { color: var(--primary); }
    .nav-dropdown .dropdown-menu a .menu-desc { display: block; font-size: 12px; color: var(--text-muted); line-height: 1.4; }
    @media (max-width: 768px) {
      .mobile-menu-btn { display: block; }
      .top-header { padding: 10px 16px !important; flex-wrap: nowrap !important; }
      .top-header-nav { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fff; flex-direction: column; justify-content: center; align-items: center; gap: 4px; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity .25s; padding: 24px; overflow-y: auto; }
      .top-header-nav.open { opacity: 1; pointer-events: auto; }
      .top-header-nav a { font-size: 18px; padding: 12px 24px; }
      .nav-close-btn { display: block; position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 32px; color: var(--text); cursor: pointer; line-height: 1; padding: 4px 8px; }
      .nav-dropdown .dropdown-menu { position: static; transform: none; opacity: 1; visibility: visible; box-shadow: none; border: none; padding: 0; width: 100%; }
      .nav-dropdown > a::after { display: none; }
    }"""

pages = ["antibody-guide.html", "InSynBio_OurTech.html"]

for fname in pages:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f"SKIP (not found): {fname}")
        continue

    with open(fpath, encoding='utf-8') as f:
        html = f.read()

    if '.nav-dropdown' in html:
        print(f"SKIP (already has nav CSS): {fname}")
        continue

    # For antibody-guide.html: replace the 3-line simple nav CSS block
    simple_nav = (
        '    .top-header-nav{display:flex;align-items:center;gap:6px;}\n'
        '    .top-header-nav a{padding:7px 14px;font-size:14px;color:var(--text-muted);text-decoration:none;border-radius:20px;transition:all .2s;font-weight:500;}\n'
        '    .top-header-nav a:hover{color:var(--primary);background:rgba(13,148,136,.06);}'
    )
    if simple_nav in html:
        html = html.replace(simple_nav, FULL_NAV_CSS)
        print(f"Replaced simple nav CSS in {fname}")
    else:
        # Insert before </style> as fallback
        html = html.replace('</style>', FULL_NAV_CSS + '\n  </style>', 1)
        print(f"Inserted nav CSS before </style> in {fname}")

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(html)

print("\nDone.")
