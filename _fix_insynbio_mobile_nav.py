"""
Fix mobile navigation for insynbio-web-source (English site).
The issue is that the mobile nav CSS in insynbio-web-source/index.html is different from therasik-web-source
and lacks the correct layout rules for the dropdowns, causing them to be unclickable or hidden.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

MOBILE_NAV_CSS = r"""
    /* ── Mobile nav ────────────────────────────────── */
    @media (max-width: 768px) {
      body { padding-top: 64px; }
      .top-header { padding: 0 20px; }
      .top-header .slogan, .top-header .std-slogan { display: none; }
      .mobile-menu-btn, .std-mobile-btn {
        display: block;
        margin-left: auto;
        color: #111827;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 6px 10px;
        cursor: pointer;
        background: none;
      }
      .top-header-nav, .std-top-nav {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #fff;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        gap: 0;
        margin: 0;
        padding: 72px 0 40px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.25s ease, visibility 0.25s;
        z-index: 10000;
        overflow-y: auto;
      }
      .top-header-nav.open, .std-top-nav.open {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      body:has(.top-header-nav.open) { overflow: hidden !important; }
      
      .top-header-nav > a, .std-top-nav > a {
        display: block;
        text-align: center;
        font-size: 18px; padding: 16px 24px; color: #111827;
        border-bottom: 1px solid #f3f4f6;
        border-radius: 0;
      }
      .top-header-nav > a:hover, .std-top-nav > a:hover { color: #0d9488; background: transparent; }
      .top-header-nav > a.active, .std-top-nav > a.active { background: transparent; color: #0d9488; }
      
      .nav-close-btn, .std-nav-close {
        display: flex; position: absolute; top: 16px; right: 16px;
        background: #f3f4f6; border: none; font-size: 24px; color: #111827; cursor: pointer;
        width: 44px; height: 44px; border-radius: 50%;
        align-items: center; justify-content: center;
      }
      
      .nav-dropdown { width: 100%; text-align: center; }
      .nav-dropdown > a {
        display: block;
        font-size: 18px; padding: 16px 24px; color: #111827;
        border-bottom: 1px solid #f3f4f6;
        border-radius: 0;
      }
      .nav-dropdown .dropdown-menu, .std-nav-dd .std-dd-menu { 
        display: block !important;
        position: static !important;
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        box-shadow: none !important;
        width: 100% !important;
        background: #f9fafb !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        border-bottom: 1px solid #f3f4f6 !important;
        max-height: none !important;
      }
      .nav-dropdown .dropdown-menu a {
        display: block;
        font-size: 15px; padding: 14px 24px; text-align: left;
        border-bottom: 1px solid #f3f4f6;
        border-radius: 0;
      }
      .nav-dropdown > a::after, .std-nav-dd > a::after { display: inline-block; }
    }
"""

JS_SNIPPET = """
  <script>
    (function() {
      function setNavActive() {
        var hash = window.location.hash || '';
        var homeLink = document.querySelector('.top-header-nav a[href="index.html"]');
        if (homeLink) homeLink.classList.toggle('active', !hash || hash === '#');
        document.querySelectorAll('.top-header-nav a[href*="#"]').forEach(function(a) {
          var href = a.getAttribute('href');
          var anchor = href.includes('#') ? href.split('#')[1] : '';
          a.classList.toggle('active', anchor && hash === '#' + anchor);
        });
      }
      window.addEventListener('hashchange', setNavActive);
      setNavActive();

      document.querySelectorAll('.top-header-nav a').forEach(function(a) {
        a.addEventListener('click', function(e) {
          var href = this.getAttribute('href');
          if (!href || href === '#') return;
          var hashIdx = href.indexOf('#');
          if (hashIdx === -1) return;
          
          var targetId = href.substring(hashIdx + 1);
          var targetEl = document.getElementById(targetId);
          
          if (targetEl && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || href.startsWith('#'))) {
            e.preventDefault();
            document.querySelector('.top-header-nav').classList.remove('open');
            targetEl.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, null, '#' + targetId);
          }
        });
      });

      function syncNavDropdownTabindex() {
        var mobile = window.matchMedia('(max-width: 768px)').matches;
        document.querySelectorAll('.top-header-nav .nav-dropdown').forEach(function(el) {
          if (mobile) el.removeAttribute('tabindex');
          else el.setAttribute('tabindex', '0');
        });
      }
      syncNavDropdownTabindex();
      window.addEventListener('resize', syncNavDropdownTabindex);
    })();
  </script>
"""

def main():
    for name in os.listdir(HERE):
        if not name.endswith(".html"):
            continue
        path = os.path.join(HERE, name)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Replace the old mobile nav CSS block
        # Find the start of the mobile nav block
        start_marker = "/* ── Mobile nav ────────────────────────────────── */"
        if start_marker in content:
            start_idx = content.find(start_marker)
            # Find the end of the @media (max-width: 768px) block
            media_start = content.find("@media (max-width: 768px)", start_idx)
            if media_start != -1:
                brace_start = content.find("{", media_start)
                depth = 0
                i = brace_start
                while i < len(content):
                    if content[i] == "{":
                        depth += 1
                    elif content[i] == "}":
                        depth -= 1
                        if depth == 0:
                            end_idx = i + 1
                            content = content[:start_idx] + MOBILE_NAV_CSS + content[end_idx:]
                            break
                    i += 1

        # 2. Add the JS snippet if not present, or replace old JS logic
        # Clean up old JS
        content = re.sub(r'<script>\s*function setNavActive.*?setNavActive\(\);.*?window\.addEventListener.*?\}\);\s*</script>', '', content, flags=re.DOTALL)
        content = re.sub(r'<script>\s*\(function\(\) \{\s*function setNavActive.*?</script>', '', content, flags=re.DOTALL)
        
        if "syncNavDropdownTabindex" not in content and "</body>" in content:
            content = content.replace("</body>", JS_SNIPPET + "\n</body>")

        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print(f"Updated {name}")

if __name__ == "__main__":
    main()
