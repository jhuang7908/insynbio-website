import os
import re

HERE = "d:/InSynBio-AI-Research/Antibody_Engineer_Suite/insynbio-web-source"

MOBILE_NAV_CSS = r"""
    /* ── Mobile nav ────────────────────────────────── */
    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: block !important;
        flex-shrink: 0 !important;
        margin-left: auto !important;
      }
      .top-header {
        padding: 10px 16px !important;
        flex-wrap: nowrap !important;
        width: 100% !important;
        max-width: 100vw !important;
        left: 0 !important;
        right: 0 !important;
        justify-content: space-between !important;
        box-sizing: border-box !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      .top-header .slogan { display: none !important; }
      .top-header-nav {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        min-height: 100vh !important;
        min-height: 100dvh !important;
        height: auto !important;
        background: #ffffff !important;
        flex: none !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        align-items: stretch !important;
        align-content: flex-start !important;
        gap: 0 !important;
        z-index: 10000 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s !important;
        padding: 72px 0 max(24px, env(safe-area-inset-bottom, 0px)) !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        display: flex !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      .top-header-nav.open {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      body:has(.top-header-nav.open) {
        overflow: hidden !important;
      }
      .top-header-nav > a {
        display: block !important;
        flex: 0 0 auto !important;
        align-self: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
        text-align: center !important;
        font-size: 18px !important;
        padding: 16px 20px !important;
        min-height: 48px !important;
        line-height: 1.35 !important;
        border-radius: 0 !important;
        border-bottom: 1px solid #f3f4f6 !important;
        color: #111827 !important;
        background: transparent !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      .top-header-nav > a:hover { color: #0d9488 !important; }
      .top-header-nav > a.active { color: #0d9488 !important; }
      .top-header-nav > a:last-of-type {
        border-bottom: none !important;
        padding-bottom: max(28px, calc(16px + env(safe-area-inset-bottom, 0px))) !important;
      }
      .nav-dropdown {
        width: 100% !important;
        max-width: 100% !important;
        align-self: stretch !important;
        flex: 0 0 auto !important;
        text-align: center !important;
        margin: 0 !important;
      }
      .nav-dropdown > a {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        text-align: center !important;
        font-size: 18px !important;
        padding: 16px 20px !important;
        min-height: 48px !important;
        line-height: 1.35 !important;
        border-radius: 0 !important;
        border-bottom: 1px solid #f3f4f6 !important;
        color: #111827 !important;
        background: transparent !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      .nav-dropdown > a::after { content: ' ▾' !important; }
      .nav-close-btn {
        display: flex !important;
        position: absolute !important;
        top: max(12px, env(safe-area-inset-top, 0px)) !important;
        right: max(12px, env(safe-area-inset-right, 0px)) !important;
        background: #f3f4f6 !important;
        border: none !important;
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        min-height: 44px !important;
        border-radius: 50% !important;
        font-size: 24px !important;
        color: #111827 !important;
        cursor: pointer !important;
        z-index: 10001 !important;
        align-items: center !important;
        justify-content: center !important;
        touch-action: manipulation !important;
      }
      .nav-dropdown .dropdown-menu {
        position: static !important;
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        box-shadow: none !important;
        width: 100% !important;
        background: #f9fafb !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
        border: none !important;
        border-bottom: 1px solid #f3f4f6 !important;
        max-height: none !important;
      }
      .nav-dropdown .dropdown-menu a {
        display: block !important;
        font-size: 15px !important;
        padding: 14px 20px !important;
        text-align: left !important;
        border-bottom: 1px solid #f3f4f6 !important;
        min-height: 44px !important;
        box-sizing: border-box !important;
      }
      .nav-dropdown .dropdown-menu a .menu-title { font-size: 15px !important; margin-bottom: 2px !important; }
      .nav-dropdown .dropdown-menu a .menu-desc { font-size: 12px !important; }

      /* --- Layout Fixes for Sidebar Pages --- */
      .page-wrap { flex-direction: column !important; }
      .sidebar { 
        width: 100% !important; 
        height: auto !important; 
        position: static !important; 
        border-right: none !important; 
        border-bottom: 1px solid #eee !important;
        padding: 16px !important;
      }
      .sidebar nav {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
      .sidebar nav a {
        flex: 1 1 calc(50% - 8px) !important;
        justify-content: center !important;
        text-align: center !important;
        padding: 8px 12px !important;
        margin-bottom: 0 !important;
        font-size: 13.5px !important;
      }
      .main { padding: 30px 20px !important; }
      .main h1 { font-size: 32px !important; }
      .main-intro { margin: -30px -20px 30px !important; padding: 30px 20px !important; }
      .hero { padding-top: 100px !important; }
    }
"""

def main():
    for name in os.listdir(HERE):
        if not name.endswith(".html"):
            continue
        path = os.path.join(HERE, name)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # Find the @media (max-width: 768px) block that contains .top-header-nav
        idx = 0
        while True:
            idx = content.find("@media (max-width: 768px)", idx)
            if idx == -1:
                break
            
            # Find the end of this block
            brace_start = content.find("{", idx)
            if brace_start != -1:
                depth = 0
                i = brace_start
                while i < len(content):
                    if content[i] == "{":
                        depth += 1
                    elif content[i] == "}":
                        depth -= 1
                        if depth == 0:
                            end_idx = i + 1
                            block_content = content[idx:end_idx]
                            if ".top-header-nav" in block_content and ".mobile-menu-btn" in block_content:
                                # Replace this block
                                content = content[:idx] + MOBILE_NAV_CSS + content[end_idx:]
                                break
                            break
                    i += 1
                if ".top-header-nav" in block_content and ".mobile-menu-btn" in block_content:
                    break
            idx += 1

        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print(f"Updated {name}")

if __name__ == "__main__":
    main()
