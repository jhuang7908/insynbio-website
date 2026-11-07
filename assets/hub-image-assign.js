(function (root) {
  var PAGE_SIZE = 12;

  function hashKey(key) {
    var h = 0;
    var s = String(key || '');
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return Math.abs(h);
  }

  function rotate(list, key) {
    if (!list || !list.length) return [];
    var idx = hashKey(key) % list.length;
    return list.slice(idx).concat(list.slice(0, idx));
  }

  function candidatesFor(item, catalog) {
    var images = catalog.images || {};
    var ids = [];
    var primary = catalog.primaries && catalog.primaries[item.id];
    if (primary) ids.push(primary);
    var pool = (catalog.pools && catalog.pools[item.module]) || [];
    rotate(pool, item.id).forEach(function (id) {
      if (ids.indexOf(id) === -1) ids.push(id);
    });
    (catalog.reserve || []).forEach(function (id) {
      if (ids.indexOf(id) === -1) ids.push(id);
    });
    return ids.map(function (id) { return images[id]; }).filter(Boolean);
  }

  function assign(items, catalog) {
    catalog = catalog || root.HUB_IMAGE_CATALOG;
    var used = Object.create(null);
    var rows = [];
    var ok = true;
    (items || []).forEach(function (item) {
      if (!item) return;
      var cands = catalog ? candidatesFor(item, catalog) : [];
      var pick = null;
      for (var i = 0; i < cands.length; i++) {
        if (!used[cands[i].sha256]) { pick = cands[i]; break; }
      }
      var unique = !!pick;
      if (!pick && cands.length) {
        pick = cands[0];
        unique = false;
        ok = false;
      }
      if (!pick) ok = false;
      if (pick) used[pick.sha256] = item.id;
      item._assignedImage = pick;
      rows.push({ id: item.id, image: pick ? pick.id : '', sha256: pick ? pick.sha256 : '', unique: unique });
    });
    return { ok: ok, assigned: rows };
  }

  var api = { PAGE_SIZE: PAGE_SIZE, assign: assign, candidatesFor: candidatesFor };
  root.HubImageAssign = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
