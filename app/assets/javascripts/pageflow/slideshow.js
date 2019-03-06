//=require ./slideshow/atmo
//=require ./slideshow/lazy_page_widget
//=require ./slideshow/page_split_layout
//=require ./slideshow/page_widget
//=require ./slideshow/scroller_widget
//=require ./slideshow/scroll_indicator
//=require ./slideshow/scroll_indicator_widget
//=require ./slideshow/hidden_text_indicator_widget
//=require ./slideshow/adjacent_preloader
//=require ./slideshow/successor_preparer
//=require ./slideshow/swipe_gesture
//=require ./slideshow/hide_text
//=require ./slideshow/hide_text_on_swipe
//=require ./slideshow/dom_order_scroll_navigator
//=require ./slideshow/navigation_direction

pageflow.Slideshow = function($el, configurations) {
  var transitioning = false,
      currentPage = $(),
      pages = $(),
      that = this,
      currentPageIndex;

  configurations = configurations || {};

  function transitionMutex(fn, context) {
    if (transitioning) { return; }
    transitioning = true;

    var transitionDuration = fn.call(context);

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
    return this.scrollNavigator.nextPageExists(currentPage, pages);
  };

  this.previousPageExists = function() {
    return this.scrollNavigator.previousPageExists(currentPage, pages);
  };

  this.isOnLandingPage = function() {
    return currentPage.is(this.scrollNavigator.getLandingPage(pages));
  };

  this.goToLandingPage = function() {
    this.goTo(this.scrollNavigator.getLandingPage(pages));
  };

  this.back = function() {
    this.scrollNavigator.back(currentPage, pages);
  };

  this.next = function() {
    this.scrollNavigator.next(currentPage, pages);
  };

  this.parentPageExists = function() {
    return !!pageflow.entryData.getParentPagePermaIdByPagePermaId(this.currentPagePermaId());
  };

  this.goToParentPage = function() {
    this.goToByPermaId(pageflow.entryData.getParentPagePermaIdByPagePermaId(
      this.currentPagePermaId()
    ));
  };

  this.goToById = function(id, options) {
    return this.goTo($el.find('[data-id=' + id + ']'), options);
  };

  this.goToByPermaId = function(permaId, options) {
    if (permaId) {
      return this.goTo(getPageByPermaId(permaId), options);
    }
  };

  this.goTo = function(page, options) {
    options = options || {};

    if (page.length && !page.is(currentPage)) {
      var cancelled = false;

      pageflow.events.trigger('page:changing', {
        cancel: function() {
          cancelled = true;
        }
      });

      if (cancelled) {
        return;
      }

      transitionMutex(function() {
        var previousPage = currentPage;
        currentPage = page;
        currentPageIndex = currentPage.index();

        var transition = options.transition ||
          this.scrollNavigator.getDefaultTransition(previousPage, currentPage, pages);

        var direction =
          this.scrollNavigator.getTransitionDirection(previousPage, currentPage, pages, options);

        var outDuration = previousPage.page('deactivate', {
          direction: direction,
          transition: transition
        });

        var inDuration = currentPage.page('activate', {
          direction: direction,
          position: options.position,
          transition: transition
        });

        currentPage.page('preload');
        $el.trigger('slideshowchangepage', [options]);

        return Math.max(outDuration, inDuration);
      }, this);

      return true;
    }
  };

  this.goToFirstPage = function() {
    return this.goTo(pages.first());
  };

  this.update = function(options) {
    pages = $el.find('section.page');

    pages.each(function(index) {
      var $page = $(this);

      $page.page({
        index: index,
        configuration: configurations[$page.data('id')]
      });
    });

    ensureCurrentPage(options);
  };

  this.currentPage = function() {
    return currentPage;
  };

  this.currentPagePermaId = function() {
    return parseInt(currentPage.attr('id'), 10);
  };

  this.currentPageConfiguration = function() {
    return currentPage.page('getConfiguration');
  };

  function ensureCurrentPage(options) {
    var newCurrentPage = findNewCurrentPage(options);

    if (newCurrentPage) {
      currentPage = newCurrentPage;
      currentPageIndex = currentPage.index();

      currentPage.page('activateAsLandingPage');
      currentPage.page('preload');
    }
  }

  function findNewCurrentPage(options) {
    if (!currentPage.length) {
      var permaId = options && options.landingPagePermaId;
      var landingPage = permaId ? getPageByPermaId(permaId) : $();

      return landingPage.length ?
        landingPage :
        that.scrollNavigator.getLandingPage(pages);
    }
    else if (!currentPage.parent().length) {
      return nearestPage(currentPageIndex);
    }
  }

  function getPageByPermaId(permaId) {
    return $el.find('#' + parseInt(permaId, 10));
  }

  this.on = function() {
    $el.on.apply($el, arguments);
  };

  this.triggerResizeHooks = function() {
    currentPage.page('resize');
    pageflow.events.trigger('resize');
  };

  $el.on(pageflow.navigationDirection.getEventName('scrollerbumpback'), _.bind(function(event) {
    if (currentPage.page('isPageChangeAllowed', {type: 'bumpback'})) {
      this.back();
    }
  }, this));

  $el.on(pageflow.navigationDirection.getEventName('scrollerbumpnext'), _.bind(function(event) {
    if (currentPage.page('isPageChangeAllowed', {type: 'bumpnext'})) {
      this.next();
    }
  }, this));

  $el.on('click', 'a.to_top', _.bind(function() {
    this.goToLandingPage();
  }, this));

  $(window).on('resize', this.triggerResizeHooks);

  pageflow.nativeScrolling.preventScrollBouncing($el);

  $el.addClass('slideshow');

  $el.find('.hidden_text_indicator').hiddenTextIndicator({parent : $('body')});
  this.on('slideshowchangepage', function() {
    pageflow.hideText.deactivate();
  });

  $el.find('.scroll_indicator').scrollIndicator({parent: this});

  this.scrollNavigator = new pageflow.DomOrderScrollNavigator(this, pageflow.entryData);

  pageflow.AdjacentPreloader
          .create(function() { return pages; }, this.scrollNavigator)
          .attach(pageflow.events);

  pageflow.SuccessorPreparer
          .create(function() { return pages; }, this.scrollNavigator)
          .attach(pageflow.events);
};

pageflow.Slideshow.setup = function(options) {
  function configurationsById(pages) {
    return _.reduce(pages, function(memo, page) {
      memo[page.id] = page.configuration;
      return memo;
    }, {});
  }

  pageflow.slides = new pageflow.Slideshow(
    options.element,
    configurationsById(options.pages)
  );

  pageflow.features.enable('slideshow', options.enabledFeatureNames || []);

  pageflow.atmo = pageflow.Atmo.create(
    pageflow.slides,
    pageflow.events,
    pageflow.audio,
    pageflow.backgroundMedia
  );

  pageflow.history = pageflow.History.create(
    pageflow.slides,
    {simulate: options.simulateHistory}
  );

  if (options.beforeFirstUpdate) {
    options.beforeFirstUpdate();
  }

  pageflow.slides.update({
    landingPagePermaId: pageflow.history.getLandingPagePermaId()
  });

  pageflow.history.start();

  return pageflow.slides;
};
