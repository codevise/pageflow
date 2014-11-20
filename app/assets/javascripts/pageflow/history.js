pageflow.History = function(slideshow) {
  slideshow.on('slideshowchangepage', function() {
    if(pageflow.features.has('hashchange support')) {
      window.location.hash = '#' + slideshow.currentPage().attr('id');
    }
  });

  $(window).on('hashchange', function() {
    slideshow.goToByPermaId(getHash());
  });

  slideshow.goToByPermaId(getHash());

  function getHash() {
    var match = window.location.href.match(/#(.*)$/);
    return match ? match[1] : '';
  }
};