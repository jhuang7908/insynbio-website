"""
Fix double nav-bar issue on old-style InSynBio case pages.

Problem: .mobile-menu-btn has no display:none in CSS, so the hamburger button
appears alongside the full desktop nav on every screen size.

Fix: Inject proper mobile CSS rules into all affected case pages.
"""
import re, pathlib

# Old-style case pages (those using the non-overlay mobile approach)
CASE_FILES = [
    'case_mumab4d5_humanization_en.html',
    'case_mumab4d5_cmc.html',
    'case_mumab4d5_vhh_en.html',
    'case_vgrw_sr_r2_affinity_maturation.html',
    'case_bispecific_vhh_expression_optimization.html',
    'case_malaria_carm_design.html',
    'case_bispecific_vhvl_pairing.html',
]

# CSS to inject before </style> in head (proper mobile hamburger approach)
MOBILE_CSS = """
    /* ─── MOBILE BUTTON (hidden by default) ─── */
    .mobile-menu-btn { display: none; background: none; border: 1px solid var(--border); border-radius: 8px; padding: 6px 8px; cursor: pointer; color: var(--text); line-height: 0; }
    .nav-close-btn   { display: none; }

    @media (max-width: 860px) {
      .top-header .slogan { display: none; }
    }
    @media (max-width: 680px) {
      .mobile-menu-btn { display: block; }
      .top-header { padding: 10px 16px; flex-wrap: nowrap; }
      .top-header-nav {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: #fff; flex-direction: column; justify-content: center;
        align-items: center; gap: 4px; z-index: 9999;
        opacity: 0; pointer-events: none; transition: opacity 0.25s;
        padding: 24px; overflow-y: auto;
      }
      .top-header-nav.open { opacity: 1; pointer-events: auto; }
      .top-header-nav a { font-size: 18px; padding: 12px 24px; }
      .nav-close-btn {
        display: block; position: absolute; top: 16px; right: 20px;
        background: none; border: none; font-size: 32px; color: var(--text);
        cursor: pointer; line-height: 1; padding: 4px 8px;
      }
      .nav-dropdown .dropdown-menu { display: none !important; }
      .nav-dropdown > a::after { content: ''; }
    }
"""

changed = 0
for fname in CASE_FILES:
    p = pathlib.Path(fname)
    if not p.exists():
        print(f"  SKIP (not found): {fname}")
        continue
    html = p.read_text(encoding='utf-8')
    orig = html

    # Remove any existing mobile-menu-btn or nav-close-btn rules to avoid duplication
    html = re.sub(r'\s*\.mobile-menu-btn\s*\{[^}]*\}', '', html)
    html = re.sub(r'\s*\.nav-close-btn\s*\{[^}]*\}', '', html)

    # Also remove the old @media (max-width: 600px) nav wrapping approach
    # (the one that makes nav wrap to second row instead of using overlay)
    # Pattern: inside @media block, remove the old top-header-nav wrapping rules
    # We look for the specific old mobile CSS for the nav wrapping pattern
    old_wrap = re.compile(
        r'(@media\s*\(max-width:\s*600px\)\s*\{[^}]*?)'
        r'(\.top-header-nav\s*\{[^}]*order:\s*3[^}]*\})'
        r'(\s*\.top-header-nav\s*a\s*\{[^}]*\})?',
        re.DOTALL
    )

    # Inject mobile CSS before closing </style>
    if MOBILE_CSS.strip() not in html:
        html = html.replace('  </style>', MOBILE_CSS + '\n  </style>', 1)

    # Also check if mobile-menu-btn onclick still has the right JS (toggle vs add)
    # The old pages use classList.toggle, which is fine
    # The nav-close-btn should use classList.remove('open')
    # These should already be correct in the HTML

    if html != orig:
        p.write_text(html, encoding='utf-8')
        changed += 1
        print(f"  FIXED mobile nav: {fname}")
    else:
        print(f"  NO CHANGE (already fixed): {fname}")

print(f"\nDone. {changed} files updated.")
