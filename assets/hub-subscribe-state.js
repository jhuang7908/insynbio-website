(function (root) {
  async function hubApiBusinessOk(response) {
    if (!response || response.ok !== true) return false;
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      return false;
    }
    return !!data && data.ok === true;
  }

  var api = { hubApiBusinessOk: hubApiBusinessOk };
  root.hubApiBusinessOk = hubApiBusinessOk;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
