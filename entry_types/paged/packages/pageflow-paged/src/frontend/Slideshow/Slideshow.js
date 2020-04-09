import $ from 'jquery';
import _ from 'underscore';
import {events, features} from 'pageflow/frontend'
import {navigationDirection} from './navigationDirection';
import {nativeScrolling} from '../nativeScrolling';
import {DomOrderScrollNavigator} from './DomOrderScrollNavigator';
import {hideText} from './hideText';
import {AdjacentPreloader} from './AdjacentPreloader';
import {SuccessorPreparer} from './SuccessorPreparer';
import {History} from '../History';
import {backgroundMedia} from '../backgroundMedia';
import {Atmo} from './Atmo';
import {state} from '../state';

export const Slideshow = function($el, configurations) {
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
    return !!state.entryData.getParentPagePermaIdByPagePermaId(this.currentPagePermaId());
  };

  this.goToParentPage = function() {
    this.goToByPermaId(state.entryData.getParentPagePermaIdByPagePermaId(
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

      events.trigger('page:changing', {
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
    events.trigger('resize');
  };

  $el.on(navigationDirection.getEventName('scrollerbumpback'), _.bind(function(event) {
    if (currentPage.page('isPageChangeAllowed', {type: 'bumpback'})) {
      this.back();
    }
  }, this));

  $el.on(navigationDirection.getEventName('scrollerbumpnext'), _.bind(function(event) {
    if (currentPage.page('isPageChangeAllowed', {type: 'bumpnext'})) {
      this.next();
    }
  }, this));

  $el.on('click', 'a.to_top', _.bind(function() {
    this.goToLandingPage();
  }, this));

  $(window).on('resize', this.triggerResizeHooks);

  nativeScrolling.preventScrollBouncing($el);

  $el.addClass('slideshow');

  $el.find('.hidden_text_indicator').hiddenTextIndicator({parent : $('body')});
  this.on('slideshowchangepage', function() {
    hideText.deactivate();
  });

  $el.find('.scroll_indicator').scrollIndicator({parent: this});

  this.scrollNavigator = new DomOrderScrollNavigator(this, state.entryData);

  AdjacentPreloader
          .create(function() { return pages; }, this.scrollNavigator)
          .attach(events);

  SuccessorPreparer
          .create(function() { return pages; }, this.scrollNavigator)
          .attach(events);
};

Slideshow.setup = function(options) {
  function configurationsById(pages) {
    return _.reduce(pages, function(memo, page) {
      memo[page.id] = page.configuration;
      return memo;
    }, {});
  }

  state.slides = new Slideshow(
    options.element,
    configurationsById(options.pages)
  );

  features.enable('slideshow', options.enabledFeatureNames || []);

  state.atmo = Atmo.create(
    state.slides,
    events,
    state.audio,
    backgroundMedia
  );

  state.history = History.create(
    state.slides,
    {simulate: options.simulateHistory}
  );

  if (options.beforeFirstUpdate) {
    options.beforeFirstUpdate();
  }

  state.slides.update({
    landingPagePermaId: state.history.getLandingPagePermaId()
  });

  state.history.start();

  return state.slides;
};
