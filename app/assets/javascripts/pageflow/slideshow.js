//=require ./slideshow/page_widget
//=require ./slideshow/scroller_widget
//=require ./slideshow/scroll_indicator_widget
//=require ./slideshow/hidden_text_indicator_widget
//=require ./slideshow/progressive_preload
//=require ./slideshow/swipe_gesture
//=require ./slideshow/hide_text
//=require ./slideshow/hide_text_on_swipe

pageflow.Slideshow = function($el, configurations) {
  var transitionDuration = 1000,
      transitioning = false,
      preload = new pageflow.ProgressivePreload(),
      currentPage = $(),
      currentPageIndex, pages;

  configurations = configurations || {};

  function transitionMutex(fn, context) {
    if (transitioning) { return; }
    transitioning = true;

    fn.call(context);

    setTimeout(function() {
      transitioning = false;
    }, transitionDuration);
  }

  function nearestPage(index) {
    var result = $(pages.get(index));

    if (!result.length) {
      return pages.last();
    }

    return result;
  }

  this.nextPageExists = function() {
    return (!currentPage.is(pages.last()));
  };

  this.back = function() {
    this.goTo(currentPage.prev('.page'), {position: 'bottom'});
  };

  this.next = function() {
    this.goTo(currentPage.next('.page'));
  };

  this.goToById = function(id) {
    this.goTo($el.find('[data-id=' + id + ']'));
  };

  this.goToByPermaId = function(permaId) {
    if (permaId) {
      this.goTo($el.find('#' + permaId));
    }
  };

  this.goTo = function(page, options) {
    options = options || {};

    if (page.length && !page.is(currentPage)) {
      transitionMutex(function() {
        var previousPage = currentPage;
        currentPage = page;
        currentPageIndex = currentPage.index();

        var direction = currentPageIndex > previousPage.index() ? 'forwards' : 'backwards';

        previousPage.page('deactivate', {direction: direction});
        currentPage.page('activate', {direction: direction, position: options.position});

        preload.start(currentPage);
        $el.trigger('slideshowchangepage');
      }, this);
    }
  };

  this.goToFirstPage = function() {
    this.goTo(pages.first());
  };

  this.update = function() {
    pages = $el.find('section.page');

    pages.each(function(index) {
      var $page = $(this);

      $page.page({
        index: index,
        configuration: configurations[$page.data('id')]
      });
    });

    ensureCurrentPage();
  };

  this.currentPage = function() {
    return currentPage;
  };

  function ensureCurrentPage() {
    var newCurrentPage = findNewCurrentPage();

    if (newCurrentPage) {
      currentPage = newCurrentPage;
      currentPageIndex = currentPage.index();

      currentPage.page('activateAsLandingPage');
      preload.start(currentPage);
    }
  }

  function findNewCurrentPage() {
    if (!currentPage.length) {
      return pages.first();
    }
    else if (!currentPage.parent().length) {
      return nearestPage(currentPageIndex);
    }
  }

  this.on = function() {
    $el.on.apply($el, arguments);
  };

  this.triggerResizeHooks = function() {
    currentPage.page('resize');
  };

  $el.on('scrollerbumpup', _.bind(function(event) {
    this.back();
  }, this));

  $el.on('scrollerbumpdown', _.bind(function(event) {
    this.next();
  }, this));

  $el.on('click', 'a.to_top', _.bind(function() {
    this.goToFirstPage();
  }, this));

  $(window).on('resize', this.triggerResizeHooks);

  // prevent page from bouncing in modern browsers
  $(document).on('touchmove', function (e) { e.preventDefault(); });

  $el.addClass('slideshow');

  $el.find('.hidden_text_indicator').hiddenTextIndicator({parent : $('body')});
  this.on('slideshowchangepage', function() {
    pageflow.hideText.deactivate();
  });

  var scrollIndicator = $el.find('.scroll_indicator');
  scrollIndicator.scrollIndicator({parent : this});
  scrollIndicator.on('click', _.bind(function(event) {
    this.next();
  }, this));

  this.update();
};
