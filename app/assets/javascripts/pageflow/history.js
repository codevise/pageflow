//= require_self
//= require_tree ./history

pageflow.History = function(slideshow, adapter) {
  slideshow.on('slideshowchangepage', function(event, options) {
    var hash = slideshow.currentPage().attr('id');

    if (options.back) {
      adapter.replaceState(null, '', adapter.hash());
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

  slideshow.goToByPermaId(adapter.hash() || pageParameter());
  adapter.replaceState(null, '', slideshow.currentPage().attr('id'));

  this.back = _.bind(adapter.back, adapter);

  function pageParameter() {
    var match = window.location.href.match(/page=([^&]*)/);
    return match ? match[1] : '';
  }
};

pageflow.History.create = function(slideshow, options) {
  options = options || {};

  var adapter;

  if (options.simulate || !pageflow.browser.has('hashchange support')) {
    adapter = new pageflow.History.SimulatedAdapter();
  }
  else if (pageflow.browser.has('pushstate support')) {
    adapter = new pageflow.History.PushStateAdapter();
  }
  else {
    adapter = new pageflow.History.HashAdapter();
  }

  return new pageflow.History(slideshow, adapter);
};
