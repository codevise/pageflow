pageflow.History = function(slideshow) {
  slideshow.on('slideshowchangepage', function() {
    if (pageflow.browser.has('hashchange support')) {
      window.location.hash = '#' + slideshow.currentPage().attr('id');
    }
  });

  $(window).on('hashchange', function() {
    slideshow.goToByPermaId(getHash());
  });

  slideshow.goToByPermaId(getPermaId());

  function getHash() {
    var match = window.location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  }

  function getPermaId() {
    if (getHash().length) {
      return getHash();
    }
    else {
      var match = window.location.href.match(/page=([^&]*)/);
      return match ? match[1] : '';
    }
  }
};