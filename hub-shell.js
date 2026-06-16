/** Shell pages (latest/channels/…) — switch iframe only; never nest wrapper inside iframe */
(function () {
  const VIEW_BY_HREF = {
    'latest.html': 'latest',
    'yellow-pages.html': 'yellowpages',
    'channels.html': 'channels',
    'deals.html': 'deals',
  };
  const frame = document.getElementById('hub-frame');
  if (!frame) return;

  function viewFromHref(href) {
    const name = String(href || '').split('/').pop().split('?')[0].toLowerCase();
    return VIEW_BY_HREF[name] || 'latest';
  }

  function setActive(link) {
    document.querySelectorAll('.subnav a').forEach((a) => a.classList.remove('active'));
    if (link) link.classList.add('active');
  }

  document.querySelectorAll('.subnav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const view = viewFromHref(a.getAttribute('href'));
      frame.src = 'us-chinese-life-hub.html?view=' + view + '&v=3.0.0';
      setActive(a);
      const href = a.getAttribute('href');
      if (href) {
        try { history.replaceState(null, '', href); } catch (_) {}
      }
    });
  });
})();
