(function (root) {
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function onSite(item, img) {
    var ids = (img && img.on_site_ids) || [];
    return !!(item && ids.indexOf(item.id) !== -1);
  }

  function label(item, img) {
    return onSite(item, img) ? '实地，不是本场活动现场' : '主题示意，非本项目现场';
  }

  function html(item) {
    var img = item && item._assignedImage;
    if (!img) return '';
    var text = img.attribution || img.author || '作者见来源页';
    var who = img.source_page
      ? '<a href="' + esc(img.source_page) + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">' + esc(text) + '</a>'
      : esc(text);
    var license = '';
    if (img.license_url) {
      license = ' · <a href="' + esc(img.license_url) + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">' + esc(img.license || '许可') + '</a>';
    } else if (img.license) {
      license = ' · ' + esc(img.license);
    }
    return '<div class="hub-photo-credit"><span class="hub-photo-credit-label">' + esc(label(item, img)) + '</span>' + who + license + '</div>';
  }

  var api = { onSite: onSite, label: label, html: html };
  root.HubImageCredit = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
