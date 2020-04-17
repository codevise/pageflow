import {Visited} from 'pageflow-paged/frontend';

import * as support from '$support';

describe('pageflow.Visited', function() {
  it('reports no pages as unvisited if init is not called', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    var visited = Visited(entryId, pages, events, cookies);

    expect(visited.getUnvisitedPages()).toEqual([]);
  });

  it('reports no pages as unvisited after first init call', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    var visited = Visited(entryId, pages, events, cookies);
    visited.init();

    expect(visited.getUnvisitedPages()).toEqual([]);
  });

  it('marks all pages as visitied on first init call', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    new Visited(entryId, pages, events, cookies).init();

    var visited = new Visited(entryId, pages, events, cookies);
    visited.init();

    expect(visited.getUnvisitedPages()).toEqual([]);
  });

  it('reports added pages since last init call', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    new Visited(entryId, pages, events, cookies).init();

    pages = [{perma_id: 100}, {perma_id: 101}, {perma_id: 102}];
    var visited = new Visited(entryId, pages, events, cookies);
    visited.init();

    expect(visited.getUnvisitedPages()).toEqual([102]);
  });

  it('no longer reports pages once seen', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    new Visited(entryId, pages, support.fakeEventEmitter(), cookies).init();

    pages = [{perma_id: 100}, {perma_id: 101}, {perma_id: 102}];
    new Visited(entryId, pages, events, cookies).init();
    events.trigger('page:change', {getPermaId: function() { return 102; }});

    var visited = new Visited(entryId, pages, events, cookies);
    visited.init();

    expect(visited.getUnvisitedPages()).toEqual([]);
  });

  it('does not store additional data when visiting pages multiple times', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    new Visited(entryId, pages, events, cookies).init();
    events.trigger('page:change', {getPermaId: function() { return 102; }});

    var usedStorageBefore = cookies.usedStorage();

    events.trigger('page:change', {getPermaId: function() { return 102; }});
    events.trigger('page:change', {getPermaId: function() { return 102; }});

    expect(cookies.usedStorage()).toBe(usedStorageBefore);
  });

  it('migrates legacy cookie', function() {
    var entryId = 5;
    var pages = [{perma_id: 100}, {perma_id: 101}, {perma_id: 102}];
    var events = support.fakeEventEmitter();
    var cookies = fakeCookieStore();

    cookies.setItem('_pageflow_5_visited', '100,101');
    var visited = new Visited(entryId, pages, events, cookies);
    visited.init();

    expect(visited.getUnvisitedPages()).toEqual([102]);
    expect(cookies.hasItem('_pageflow_5_visited')).toBe(false);
  });

  function fakeCookieStore() {
    var cookies = {};

    return {
      hasItem: function(name) {
        return !!cookies[name];
      },

      getItem: function(name) {
        return decodeURIComponent(cookies[name]);
      },

      setItem: function(name, value) {
        cookies[name] = encodeURIComponent(value);
      },

      removeItem: function(name) {
        delete cookies[name];
      },

      usedStorage: function() {
        return JSON.stringify(cookies).length;
      }
    };
  }
});
