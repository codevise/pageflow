import jQuery from 'jquery';
import _ from 'underscore';
import {pageType} from '../pageType';
import {ScrollIndicator} from './ScrollIndicator';
import {pageTransitions} from '../pageTransitions';
import {navigationDirection} from './navigationDirection';
import {delayedStart} from '../delayedStart';
import {state} from '../state';

(function($) {
  $.widget('pageflow.nonLazyPage', {
    widgetEventPrefix: 'page',
    _create: function() {
      this.configuration = this.element.data('configuration') || this.options.configuration;
      this.index = this.options.index;

      this._setupNearBoundaryCssClasses();
      this._setupContentLinkTargetHandling();

      this.reinit();
    },

    getPermaId: function() {
      return parseInt(this.element.attr('id'), 10);
    },

    getConfiguration: function() {
      return this.configuration;
    },

    update: function(configuration) {
      _.extend(this.configuration, configuration.attributes);
      this.pageType.update(this.element, configuration);
    },

    reinit: function() {
      this.pageType = pageType.get(this.element.data('template'));
      this.element.data('pageType', this.pageType);
      this.preloaded = false;

      if (this.pageType.scroller === false) {
        this.content = $();
      }
      else {
        this.content = this.element.find('.scroller');
      }

      this.content.scroller(this.pageType.scrollerOptions || {});
      this.pageType.scroller = this.content.scroller('instance');
      this.pageType.scrollIndicator = new ScrollIndicator(this.element);

      this._setupHideTextOnSwipe();

      this._triggerPageTypeHook('enhance');
      this._trigger('enhanced');
    },

    reactivate: function() {
      if (this.element.hasClass('active')) {
        this.preload();

        this.content.scroller('enable');
        this.content.scroller('resetPosition');
        this.content.scroller('afterAnimationHook');

        this._triggerPageTypeHook('activating');
        this._triggerDelayedPageTypeHook('activated');
      }
    },

    cleanup: function() {
      this._triggerPageTypeHook('deactivating');
      this._triggerDelayedPageTypeHook('deactivated');
      this._triggerPageTypeHook('cleanup');
    },

    refreshScroller: function() {
      this.content.scroller('refresh');
    },

    resize: function() {
      this._triggerPageTypeHook('resize');
    },

    activateAsLandingPage: function() {
      this.element.addClass('active');

      this.content.scroller('enable');
      this.content.scroller('resetPosition');
      this.content.scroller('afterAnimationHook');

      this._trigger('activate', null, {page: this});
      this._triggerPageTypeHook('activating');
      this._triggerDelayedPageTypeHook('activated');
    },

    prepare: function() {
      this._triggerPageTypeHook('prepare');
    },

    unprepare: function() {
      this._triggerPageTypeHook('unprepare');
    },

    prepareNextPageTimeout: function() {
      return this.pageType.prepareNextPageTimeout;
    },

    linkedPages: function() {
      return this._triggerPageTypeHook('linkedPages');
    },

    isPageChangeAllowed: function(options) {
      return this._triggerPageTypeHook('isPageChangeAllowed', options);
    },

    preload: function() {
      var page = this;

      if (!this.preloaded) {
        this.preloaded = true;

        return $.when(this._triggerPageTypeHook('preload')).then(function() {
          page._trigger('preloaded');
        });
      }
    },

    activate: function(options) {
      options = options || {};

      setTimeout(_.bind(function() {
        this.element.addClass('active');
      }, this), 0);

      var duration = this.animateTransition('in', options, function() {
        this.content.scroller('enable');
        this.content.scroller('afterAnimationHook');

        this._triggerDelayedPageTypeHook('activated');
      });

      this.content.scroller('resetPosition', {position: options.position});
      this._trigger('activate', null, {page: this});
      this._triggerPageTypeHook('activating', {position: options.position});

      return duration;
    },

    deactivate: function(options) {
      options = options || {};

      this.element.removeClass('active');

      var duration = this.animateTransition('out', options, function() {
        this._triggerPageTypeHook('deactivated');
      });

      this.content.scroller('disable');
      this._trigger('deactivate');
      this._triggerPageTypeHook('deactivating');

      return duration;
    },

    animateTransition: function(destination, options, callback) {
      var otherDestination = destination === 'in' ? 'out' : 'in';
      var transition = pageTransitions.get(options.transition ||
                                                    this.configuration.transition ||
                                                    'fade');
      var animateClass = transition.className + ' animate-' + destination + '-' + options.direction;

      this.element
        .removeClass('animate-' + otherDestination + '-forwards animate-' + otherDestination + '-backwards')
        .addClass(animateClass);

      setTimeout(_.bind(function() {
        this.element.removeClass(animateClass);
        callback.call(this);
      }, this), transition.duration);

      return transition.duration;
    },

    _triggerDelayedPageTypeHook: function(name) {
      var that = this;
      var handle = delayedStart.wait(function() {
        that._triggerPageTypeHook(name);
      });

      this.element.one('pagedeactivate', function() {
        handle.cancel();
      });
    },

    _triggerPageTypeHook: function(name, options) {
      return this.pageType[name](this.element, this.configuration, options || {});
    },

    _setupHideTextOnSwipe: function() {
      if (state.entryData.getThemingOption('hide_text_on_swipe') &&
          !navigationDirection.isHorizontal() &&
          !this.pageType.noHideTextOnSwipe) {
        this.element.hideTextOnSwipe({
          eventTargetSelector: // legacy ERB pages
                               '.content > .scroller,' +
                               // React based pages
                               '.content > .scroller-wrapper > .scroller,' +
                               // internal links/text page
                               '.content.scroller'
        });
      }
    },

    _setupNearBoundaryCssClasses: function() {
      var element = this.element;

      _(['top', 'bottom']).each(function(boundary) {
        element.on('scrollernear' + boundary, function() {
          element.addClass('is_near_' + boundary);
        });

        element.on('scrollernotnear' + boundary, function() {
          element.removeClass('is_near_' + boundary);
        });
      });
    },

    _setupContentLinkTargetHandling: function() {
      this._on({
        'click .page_text .paragraph a': function(event) {
          var href = $(event.currentTarget).attr('href');
          var target = PAGEFLOW_EDITOR ? '_blank' : $(event.currentTarget).attr('target');

          if (href[0] === '#') {
            state.slides.goToByPermaId(href.substr(1));
          }
          else {
            // There was a time when the rich text editor did not add
            // target attributes to inline links even though it should
            // have. Ensure all content links to external urls open in
            // new tab, except explicitly specified otherwise by editor.
            window.open(href, target || '_blank');
          }

          event.preventDefault();
        }
      });
    }
  });
}(jQuery));
