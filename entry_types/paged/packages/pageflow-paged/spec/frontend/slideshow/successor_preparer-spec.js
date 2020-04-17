import _ from 'underscore';

import {SuccessorPreparer} from 'pageflow-paged/frontend';

import * as support from '$support';
import sinon from 'sinon';

describe('pageflow.SuccessorPreparer', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  describe('on page:change event', function() {
    it('calls prepare for next page', function() {
      var events = support.fakeEventEmitter();
      var page = fakePage();
      var nextPage = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [[page, nextPage]]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page);
      clock.tick();

      expect(nextPage.prepare).toHaveBeenCalled();
    });

    it('does not prepare next page before prepareNextPageTimeout', function() {
      var events = support.fakeEventEmitter();
      var page = fakePage();
      page.prepareNextPageTimeout.returns(1000);
      var nextPage = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [[page, nextPage]]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page);
      clock.tick(500);

      expect(nextPage.prepare).not.toHaveBeenCalled();
    });

    it('prepares next page after prepareNextPageTimeout', function() {
      var events = support.fakeEventEmitter();
      var page = fakePage();
      page.prepareNextPageTimeout.returns(1000);
      var nextPage = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [[page, nextPage]]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page);
      clock.tick(1100);

      expect(nextPage.prepare).toHaveBeenCalled();
    });

    it('does not prepare page if page changes again before prepareNextPageTimeout', function() {
      var events = support.fakeEventEmitter();
      var page1 = fakePage();
      page1.prepareNextPageTimeout.returns(1000);
      var page2 = fakePage();
      var nextPage = fakePage();
      var otherPage = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [
          [page1, nextPage],
          [page2, otherPage]
        ]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page1);
      clock.tick();
      events.trigger('page:change', page2);
      clock.tick(2000);

      expect(nextPage.prepare).not.toHaveBeenCalled();
    });

    it('does not call prepare if next page does not change', function() {
      var events = support.fakeEventEmitter();
      var page1 = fakePage();
      var page2 = fakePage();
      var nextPage = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [
          [page1, nextPage],
          [page2, nextPage]
        ]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page1);
      clock.tick();
      events.trigger('page:change', page2);
      clock.tick();

      expect(nextPage.prepare).toHaveBeenCalledOnce();
    });

    it('calls unprepare for previously prepared page which is not next page', function() {
      var events = support.fakeEventEmitter();
      var page1 = fakePage();
      var page2 = fakePage();
      var nextPage1 = fakePage();
      var nextPage2 = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [
          [page1, nextPage1],
          [page2, nextPage2]
        ]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page1);
      clock.tick();
      events.trigger('page:change', page2);
      clock.tick();

      expect(nextPage1.unprepare).toHaveBeenCalled();
    });

    it('does not call unprepare for previously prepared page which is next page', function() {
      var events = support.fakeEventEmitter();
      var page1 = fakePage();
      var page2 = fakePage();
      var nextPage = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [
          [page1, nextPage],
          [page2, nextPage]
        ]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page1);
      clock.tick();
      events.trigger('page:change', page2);
      clock.tick();

      expect(nextPage.unprepare).not.toHaveBeenCalled();
    });

    it('does not call unprepare for previously prepared page that become current page', function() {
      var events = support.fakeEventEmitter();
      var page1 = fakePage();
      var page2 = fakePage();
      var page3 = fakePage();
      var adjacentPages = fakeAdjacentPages({
        nextPages: [
          [page1, page2],
          [page2, page3]
        ]
      });

      new SuccessorPreparer(adjacentPages).attach(events);
      events.trigger('page:change', page1);
      clock.tick();
      events.trigger('page:change', page2);
      clock.tick();

      expect(page2.unprepare).not.toHaveBeenCalledOnce();
    });
  });

  function fakeAdjacentPages(options) {
    var pairs = options.nextPages;
    var stub = sinon.stub();

    _(pairs).each(function(pair) {
      var page = pair[0];
      var nextPage = pair[1];

      stub.withArgs(page).returns(nextPage);
    });

    return {nextPage: stub};
  }

  function fakePage() {
    return {
      prepareNextPageTimeout: sinon.stub(),
      prepare: sinon.spy(),
      unprepare: sinon.spy()
    };
  }
});
