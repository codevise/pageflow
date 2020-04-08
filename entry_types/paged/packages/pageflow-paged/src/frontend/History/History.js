import _ from 'underscore';
import {SimulatedAdapter} from './SimulatedAdapter';
import {PushStateAdapter} from './PushStateAdapter';
import {HashAdapter} from './HashAdapter';

import {browser} from 'pageflow/frontend';

export const History = function(slideshow, adapter) {
  slideshow.on('slideshowchangepage', function(event, options) {
    var hash = slideshow.currentPage().attr('id');

    if (options.back) {
      adapter.replaceState(null, '', adapter.hash());
    }
    else if (options.ignoreInHistory) {
      adapter.replaceState(null, '', hash);
    }
    else {
      adapter.replaceState(options, '', adapter.hash());
      adapter.pushState(null, '', hash);
    }
  });

  adapter.on('popstate', function(event) {
    if (!adapter.state()) {
      return;
    }

    slideshow.goToByPermaId(adapter.hash(), _.extend({
      back: true
    }, _.pick(adapter.state(), 'direction', 'transition')));
  });

  adapter.on('hashchange', function() {
    slideshow.goToByPermaId(adapter.hash());
  });

  this.getLandingPagePermaId = function() {
    return adapter.hash() || pageParameter();
  };

  this.start = function() {
    adapter.replaceState(null, '', slideshow.currentPage().attr('id'));
  };

  this.back = _.bind(adapter.back, adapter);

  function pageParameter() {
    var match = window.location.href.match(/page=([^&]*)/);
    return match ? match[1] : '';
  }
};

History.create = function(slideshow, options) {
  options = options || {};

  var adapter;

  if (options.simulate) {
    adapter = new SimulatedAdapter();
  }
  else if (browser.has('pushstate support')) {
    adapter = new PushStateAdapter();
  }
  else {
    adapter = new HashAdapter();
  }

  return new History(slideshow, adapter);
};
