pageflow.visited = (function() {

  var name, cookies = pageflow.cookies;

  $(function() {
    name = '_pageflow_' + pageflow.entryId + '_visited';

    if (pageflow.visited.enabled) {
      init();
    }
  });

  function init() {
    if (!cookies.hasItem(name)) {
      cookies.setItem(name, _getAllIds(), Infinity);
    }

    pageflow.ready.then(function() {
      pageflow.slides.on('pageactivate', function (e) {
        var id = e.target.getAttribute('id');
        var ids = _getCookieIds();

        if (ids.indexOf(id) < 0) {
          ids.push(id);
        }

        cookies.setItem(name, ids, Infinity);
      });
    });
  }

  function _getCookieIds() {
    if (cookies.hasItem(name) && !!cookies.getItem(name)) {
      return cookies.getItem(name).split(',').map(function(id) {
        return parseInt(id, 10);
      });
    }
    return [];
  }

  function _getAllIds() {
    return pageflow.pages.map(function(page) {
      return page.perma_id;
    });
  }

  return {
    getUnvisitedPages: function() {
      if (pageflow.visited.enabled) {
        var visitedIds = _getCookieIds();
        return visitedIds.length ? _.difference(_getAllIds(), visitedIds) : visitedIds;
      }
      return [];
    }
  };
}());