pageflow.History = function(slideshow) {
  slideshow.on('slideshowchangepage', function() {
    if(pageflow.features.has('hashchange support')) {
      window.location.hash = '#' + slideshow.currentPage().attr('id');
    }
    else {
      $(window).on('orientationchange', function() {
        window.scrollTo(0,0);
      });
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