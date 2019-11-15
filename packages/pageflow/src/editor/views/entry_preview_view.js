pageflow.EntryPreviewView = Backbone.Marionette.ItemView.extend({
  template: 'templates/entry_preview',
  className: 'entry_preview',

  ui: {
    container: '> .container',
    header: '> .container > .header',
    entry: '> .container > .entry',
    overview: '> .container > .overview',
    navigationDisabledHint: '.navigation_disabled_hint'
  },

  initialize: function() {
    this.pages = this.model.pages.persisted();

    this.widgets = $();
    this.debouncedFetchWidgets = _.debounce(this.fetchWidgets, 200);
  },

  onRender: function() {
    this.pageViews = this.subview(new pageflow.CollectionView({
      el: this.ui.entry,
      collection: this.pages,
      itemViewConstructor: pageflow.PagePreviewView,
      blankSlateViewConstructor: pageflow.BlankEntryView
    }));

    this.ui.entry.append($('#indicators_seed > *'));

    this.update();

    this.listenTo(pageflow.entry, 'sync:order sync:widgets', this.update);
    this.listenTo(pageflow.entry, 'change:configuration', function() {
      pageflow.entry.once('sync', this.update, this);
    });
    this.listenTo(pageflow.entry, 'change:emulation_mode', this.updateEmulationMode);

    this.listenTo(pageflow.storylines, 'sync', this.update);
    this.listenTo(pageflow.chapters, 'sync', this.update);
    this.listenTo(pageflow.pages, 'sync', this.update);

    this.listenTo(pageflow.audioFiles, 'sync', this.update);
    this.listenTo(pageflow.imageFiles, 'sync', this.update);
    this.listenTo(pageflow.videoFiles, 'sync', this.update);

    this.listenTo(pageflow.events, 'page:changing', function(event) {
      if (pageflow.entry.get('emulation_mode')) {
        this.ui.navigationDisabledHint.css('opacity', 1);

        clearTimeout(this.navigationDisabledHintTimeout);
        this.navigationDisabledHintTimeout = setTimeout(_.bind(function() {
          this.ui.navigationDisabledHint.css('opacity', 0);
        }, this), 2000);

        event.cancel();
      }
    });

    this.listenTo(pageflow.events, 'page:change', function(page) {
      this.updateEmulationModeSupport(page.getPermaId());
    });
  },

  onShow: function() {
    var slideshow = pageflow.Slideshow.setup({
      element: this.ui.entry,
      enabledFeatureNames: pageflow.entry.get('enabled_feature_names'),
      simulateHistory: true
    });

    pageflow.delayedStart.perform();

    this.listenTo(this.pages, 'add', function() {
      slideshow.update();
    });

    this.listenTo(this.pages, 'remove', function() {
      slideshow.update();
    });

    this.listenTo(this.pages, 'edit', function(model) {
      if (this.lastEditedPage != model) {
        pageflow.entry.unset('emulation_mode');
      }

      this.lastEditedPage = model;

      slideshow.goTo(this.pageViews.itemViews.findByModel(model).$el);
    });

    this.listenTo(pageflow.app, 'resize', function() {
      slideshow.triggerResizeHooks();
      this.updateSimulatedMediaQueryClasses();
    });

    this.listenTo(pageflow.pages, 'change:template', function() {
      this.updateEmulationModeSupport(slideshow.currentPagePermaId());
    });

    this.updateSimulatedMediaQueryClasses();
  },

  updateEmulationModeSupport: function(permaId) {
    var model = pageflow.pages.getByPermaId(permaId);

    pageflow.entry.set('current_page_supports_emulation_mode',
                       model && model.pageType().supportsPhoneEmulation());
  },

  updateSimulatedMediaQueryClasses: function() {
    var width = this.ui.container.width();
    var height = this.ui.container.height();
    var portrait = width < height;

    $('html')
      .toggleClass('simulate_mobile', width <= 900)
      .toggleClass('simulate_phone', (portrait && width <= 500) || (!portrait && height <= 500))
      .toggleClass('simulate_desktop', (portrait && width > 500) || (!portrait && height > 500))
      .toggleClass('simulate_narrow_desktop', width <= 1200)
      .toggleClass('simulate_wide_desktop', width > 1600)
      .toggleClass('simulate_pad_portrait', width <= 768 && portrait)
      .toggleClass('simulate_phone_portrait', width <= 500 && portrait);
  },

  update: function() {
    this.debouncedFetchWidgets();

    this.$el.toggleClass('emphasize_chapter_beginning', !!this.model.configuration.get('emphasize_chapter_beginning'));
  },

  fetchWidgets: function() {
    var view = this;

    $.ajax(this.model.url() + '/partials').success(function(response) {
      var partials = $('<div />').html(response);

      view.ui.header.replaceWith(partials.find('> .header'));
      view.ui.overview.replaceWith(partials.find('> .overview'));
      view.bindUIElements();

      view.updateWidgets(partials);

      view.ui.header.header({
        slideshow: pageflow.slides
      });
      view.ui.overview.overview();
    });
  },

  updateWidgets: function(partials) {
    var widgets = partials.find('[data-widget]');
    this.updatePresentWidgetsCssClasses(widgets);

    this.widgets.remove();
    this.widgets = widgets;
    this.ui.entry.before(this.widgets);

    pageflow.widgetTypes.enhance(this.$el);
  },

  updatePresentWidgetsCssClasses: function(newWidgets) {
    var previousClasses = this.widgetNames(this.widgets);
    var newClasses = this.widgetNames(newWidgets);
    var removedClasses = _.difference(previousClasses, newClasses);
    var addedClasses = _.difference(newClasses, previousClasses);

    this.$el.addClass('widgets_present');
    this.$el.removeClass(removedClasses.join(' '));
    this.$el.addClass(addedClasses.join(' '));

    if (removedClasses.length || addedClasses.length) {
      pageflow.events.trigger('widgets:update');
    }
  },

  widgetNames: function(widgets) {
    return widgets.map(function() {
      return 'widget_' + $(this).data('widget') + '_present';
    }).get();
  },

  updateEmulationMode: function() {
    if (pageflow.entry.previous('emulation_mode')) {
      this.$el.removeClass(this.emulationModeClassName(pageflow.entry.previous('emulation_mode')));
    }

    if (pageflow.entry.get('emulation_mode')) {
      this.$el.addClass(this.emulationModeClassName(pageflow.entry.get('emulation_mode')));
    }

    pageflow.app.trigger('resize');
  },

  emulationModeClassName: function(mode) {
    return 'emulation_mode_' + mode;
  }
});
