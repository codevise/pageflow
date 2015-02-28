(function($) {
  $.widget('pageflow.page', {
    _create: function() {
      this.configuration = this.element.data('configuration') || this.options.configuration;
      this.index = this.options.index;

      this.element.addClass(this.configuration.transition || "fade");

      this.preloaded = false;
      this.reinit();
    },

    getConfiguration: function() {
      return this.configuration;
    },

    reinit: function() {
      this.pageType = pageflow.pageType.get(this.element.data('template'));
      this.element.data('pageType', this.pageType);

      this.content = this.element.find('.scroller');
      this.content.scroller();
      this.content.hideTextOnSwipe();

      this._triggerPageTypeHook('enhance');
    },

    reactivate: function() {
      if (this.element.hasClass('active')) {
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

      this.prepareTimeout = setTimeout(_.bind(this.triggerPrepareNextPage, this), this.prepareNextPageTimeout());
    },

    prepare: function() {
      this._triggerPageTypeHook('prepare');
    },

    prepareNextPageTimeout: function() {
      return this.pageType.prepareNextPageTimeout;
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

      this.element
        .removeClass('animate-out-forwards animate-out-backwards')
        .addClass('animate-in-' + options.direction);

      setTimeout(_.bind(function() {
        this.element.addClass('active');
      }, this), 5);

      setTimeout(_.bind(function() {
        this.content.scroller('enable');
        this.content.scroller('afterAnimationHook');
        this.element.removeClass('animate-in-forwards animate-in-backwards');

        this._triggerDelayedPageTypeHook('activated');
      }, this), 1100);

      this.content.scroller('resetPosition', {position: options.position});
      this._trigger('activate', null, {page: this});
      this._triggerPageTypeHook('activating');

      this.prepareTimeout = setTimeout(_.bind(this.triggerPrepareNextPage, this), this.prepareNextPageTimeout());
    },

    deactivate: function(options) {
      this.element
        .removeClass('active animate-in-forwards animate-in-backwards')
        .addClass('animate-out-' + options.direction);

      setTimeout(_.bind(function() {
        this.element.removeClass('animate-out-forwards animate-out-backwards');
        this._triggerPageTypeHook('deactivated');
      }, this), 1100);

      this.content.scroller('disable');
      this._trigger('deactivate');
      this._triggerPageTypeHook('deactivating');

      clearTimeout(this.prepareTimeout);
    },

    _triggerDelayedPageTypeHook: function(name) {
      var that = this;
      var handle = pageflow.manualStart.wait(function() {
        that._triggerPageTypeHook(name);
      });

      this.element.one('deactivate', function() {
        handle.cancel();
      });
    },

    _triggerPageTypeHook: function(name) {
      return this.pageType[name](this.element, this.configuration);
    },

    triggerPrepareNextPage: function() {
      if($(this.element).next(".page").length > 0) {
        $(this.element).next(".page").page('prepare', {});
      }
    }
  });
}(jQuery));