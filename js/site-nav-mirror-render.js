/**
 * Renders top-header-nav from INSYNBIO_THERASIK_NAV (site-nav-mirror-config.js).
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function serviceMenuItem(site, svc, activeId) {
    var side = site === 'insynbio' ? svc.insynbio : svc.therasik;
    var active = activeId && svc.id === activeId ? ' class="active"' : '';
    return (
      '<a href="' +
      esc(side.href) +
      '"' +
      active +
      '><span class="menu-title">' +
      esc(side.title) +
      '</span><span class="menu-desc">' +
      esc(side.desc) +
      '</span></a>'
    );
  }

  function servicesDropdown(site, options) {
    var cfg = global.INSYNBIO_THERASIK_NAV;
    if (!cfg) return '';
    var inner = '';
    var i;
    var activeSvc = options && options.activeService;
    for (i = 0; i < cfg.services.length; i++) {
      inner += serviceMenuItem(site, cfg.services[i], activeSvc);
    }
    if (site === 'insynbio' && cfg.insynbioOnlyServices) {
      for (i = 0; i < cfg.insynbioOnlyServices.length; i++) {
        var x = cfg.insynbioOnlyServices[i];
        inner +=
          '<a href="' +
          esc(x.href) +
          '"><span class="menu-title">' +
          esc(x.title) +
          '</span><span class="menu-desc">' +
          esc(x.desc) +
          '</span></a>';
      }
    }
    var svcAnchor = site === 'therasik' ? 'therasik_index.html#services' : '#services';
    var svcLabel = site === 'therasik' ? '' : 'Services';
    return (
      '<div class="nav-dropdown" tabindex="0">' +
      '<a href="' +
      esc(svcAnchor) +
      '">' +
      esc(svcLabel) +
      '</a>' +
      '<div class="dropdown-menu">' +
      inner +
      '</div></div>'
    );
  }

  function closeBtn(site) {
    var label = site === 'therasik' ? '' : 'Close menu';
    return (
      '<button type="button" class="nav-close-btn" aria-label="' +
      esc(label) +
      '" onclick="this.parentElement.classList.remove(\'open\')">&times;</button>'
    );
  }

  function render(navEl, options) {
    if (!navEl || !global.INSYNBIO_THERASIK_NAV) return;
    var site = options.site || 'insynbio';
    var layout = options.layout || 'insynbioIndex';
    var parts = [closeBtn(site)];

    if (layout === 'insynbioIndex') {
      parts.push(
        '<a href="index.html" class="active">Home</a>',
        '<a href="#about">About Us</a>',
        servicesDropdown('insynbio', options),
        '<a href="#case-studies">Case Studies</a>',
        '<a href="InSynBio_OurTech.html">Our Tech</a>',
        '<a href="#workflow">Workflow</a>',
        '<a href="#faq">FAQ</a>',
        '<a href="#contact">Contact Us</a>',
        '<a href="https://console.insynbio.com" target="_blank" rel="noopener noreferrer" style="color:var(--primary);font-weight:600;">AI Platform Login →</a>'
      );
    } else if (layout === 'therasikIndex') {
      parts.push(
        '<a href="therasik_index.html" class="active"></a>',
        '<a href="#about"></a>',
        servicesDropdown('therasik', options),
        '<a href="#workflow"></a>',
        '<a href="#contact"></a>'
      );
    } else if (layout === 'therasikService') {
      parts.push(
        '<a href="therasik_index.html"></a>',
        '<a href="therasik_index.html#about"></a>',
        servicesDropdown('therasik', options),
        '<a href="#submit"></a>',
        '<a href="#contact"></a>'
      );
    }

    navEl.innerHTML = parts.join('');

    if (layout === 'insynbioIndex') {
      var hash = global.location.hash || '';
      var home = navEl.querySelector('a[href="index.html"]');
      if (home) {
        home.classList.toggle('active', !hash || hash === '#' || hash === '#home');
      }
      navEl.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (href !== '#') {
          a.classList.toggle('active', hash === href);
        }
      });
    }
  }

  global.SiteNavMirror = { render: render, esc: esc };
})(typeof window !== 'undefined' ? window : globalThis);
