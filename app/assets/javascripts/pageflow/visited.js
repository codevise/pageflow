pageflow.Visited = function(links) {

  var name = '_pageflow_' + pageflow.entry.id + '_visited';
  var cookies = pageflow.cookies;

  if (!cookies.hasItem(name)) {
    cookies.setItem(name, _getAllIds(), Infinity);
  }

  function _getCookieIds() {
    if (cookies.hasItem(name) && !!cookies.getItem(name)) {
      return cookies.getItem(name).split(',');
    }
    return [];
  }

  function _getAllIds() {
    return links.map(function() {
      return this.getAttribute('href').substr(1);
    }).toArray();
  }

  return {
    getUnvisitedPages: function() {
      var visitedIds = _getCookieIds();
      return visitedIds.length ? _.difference(_getAllIds(), visitedIds) : visitedIds;
    },

    setPageVisited: function(id) {
      var ids = _getCookieIds();

      if (ids.indexOf(id) < 0) {
        ids.push(id);
      }

      cookies.setItem(name, ids, Infinity);
    }
  };
};