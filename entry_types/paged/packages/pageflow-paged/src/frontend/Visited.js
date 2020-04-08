import _ from 'underscore';
import {cookieNotice} from './cookieNotice';
import {state} from './state';

export const Visited = function(entryId, pages, events, cookies) {
  var cookieName = '_pageflow_visited';

  var unvisitedPages = [];

  function init() {
    cookieNotice.request();

    if (!cookies.hasItem(cookieName)) {
      storeVisitedPageIds(getAllIds());
    }
    else {
      var visitedIds = getVisitedPageIds();
      unvisitedPages = _.difference(getAllIds(), visitedIds);
    }

    events.on('page:change', function (page) {
      var id = page.getPermaId();
      var ids = getVisitedPageIds();

      if (ids.indexOf(id) < 0) {
        ids.push(id);
      }

      storeVisitedPageIds(ids);
    });
  }

  function migrateLegacyCookie() {
    var legacyCookieName = '_pageflow_' + entryId + '_visited';

    if (cookies.hasItem(legacyCookieName)) {
      var ids = getCookieIds(legacyCookieName);
      storeVisitedPageIds(_.uniq(ids));

      cookies.removeItem(legacyCookieName);
    }
  }

  function getAllIds() {
    return pages.map(function(page) {
      return page.perma_id;
    });
  }

  function storeVisitedPageIds(ids) {
    cookies.setItem(cookieName, ids, Infinity, location.pathname);
  }

  function getVisitedPageIds() {
    return getCookieIds(cookieName);
  }

  function getCookieIds(name) {
    if (cookies.hasItem(name) && !!cookies.getItem(name)) {
      return cookies.getItem(name).split(',').map(function(id) {
        return parseInt(id, 10);
      });
    }
    return [];
  }

  return {
    init: function() {
      migrateLegacyCookie();
      init();
    },

    getUnvisitedPages: function() {
      return unvisitedPages;
    }
  };
};

Visited.setup = function() {
  state.visited = new Visited(
    state.entryId,
    state.pages,
    state.events,
    state.cookies
  );

  if (Visited.enabled) {
    state.visited.init();
  }
};
