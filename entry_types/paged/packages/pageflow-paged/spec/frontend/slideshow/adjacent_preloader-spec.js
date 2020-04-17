import _ from 'underscore';

import  {AdjacentPreloader} from 'pageflow-paged/frontend';

import * as support from '$support';
import sinon from 'sinon';

describe('pageflow.AdjacentPreloader', function() {

  describe('on page:change event', function() {
    it('calls preload on adjacent pages', function() {
      var events = support.fakeEventEmitter();
      var page = fakePage();
      var adjacentPage = fakePage();
      var adjacentPages = fakeAdjacentPages(
        [page, [adjacentPage]]
      );

      new AdjacentPreloader(adjacentPages).attach(events);
      events.trigger('page:change', page);

      expect(adjacentPage.preload).toHaveBeenCalled();
    });
  });

  function fakeAdjacentPages(/* pairs */) {
    var pairs = arguments;
    var stub = sinon.stub();

    _(pairs).each(function(pair) {
      var page = pair[0];
      var adjacentPages = pair[1];

      stub.withArgs(page).returns(adjacentPages);
    });

    return {of: stub};
  }

  function fakePage() {
    return {
      preload: sinon.spy()
    };
  }
});
