pageflow.EntryPreviewView = Backbone.Marionette.ItemView.extend({
  template: 'templates/entry_preview',
  className: 'container',

  ui: {
    header: '.header',
    entry: '.entry',
    overview: '.overview'
  },

  initialize: function() {
    this.widgets = $();
  },

  onRender: function() {
    this.pageViews = this.subview(new pageflow.CollectionView({
      el: this.ui.entry,
      collection: this.model.pages,
      itemViewConstructor: pageflow.PagePreviewView,
      blankSlateViewConstructor: pageflow.BlankEntryView
    }));

    this.ui.entry.append($('<div class="scroll_indicator indicator">' +
                           I18n.t('pageflow.editor.views.entry_preview_view.scroll_hint',
                                  {locale: this.model.configuration.get('locale') }) +
                           '</div>'));

    this.update();

    this.listenTo(pageflow.entry, 'sync:order sync:widgets', this.update);
    this.listenTo(pageflow.entry, 'change:configuration', function() {
      pageflow.entry.once('sync', this.update, this);
    });

    this.listenTo(pageflow.chapters, 'sync', this.update);
    this.listenTo(pageflow.pages, 'sync', this.update);

    this.listenTo(pageflow.audioFiles, 'sync', this.update);
    this.listenTo(pageflow.imageFiles, 'sync', this.update);
    this.listenTo(pageflow.videoFiles, 'sync', this.update);
  },

  onShow: function() {
    var slideshow = pageflow.Slideshow.setup({
      element: this.ui.entry,
      history: false
    });

    slideshow.update();

    this.listenTo(this.model.pages, 'add', function() {
      slideshow.update();
    });

    this.listenTo(this.model.pages, 'remove', function() {
      slideshow.update();
    });

    this.listenTo(this.model.pages, 'edit', function(model) {
      slideshow.goTo(this.pageViews.itemViews.findByModel(model).$el);
    });

    this.listenTo(pageflow.app, 'resize', function() {
      slideshow.triggerResizeHooks();
      this.updateSimulatedMediaQueryClasses();
    });

    this.updateSimulatedMediaQueryClasses();
  },

  updateSimulatedMediaQueryClasses: function() {
    var width = this.$el.width();
    var portrait = this.$el.width() < this.$el.height();

    $('html')
      .toggleClass('simulate_mobile', width <= 900)
      .toggleClass('simulate_phone', width <= 700)
      .toggleClass('simulate_desktop', width > 700)
      .toggleClass('simulate_narrow_desktop', width <= 1200)
      .toggleClass('simulate_wide_desktop', width > 1600)
      .toggleClass('simulate_pad_portrait', width <= 768 && portrait)
      .toggleClass('simulate_phone_portrait', width <= 500 && portrait);
  },

  update: function() {
    var view = this;

    $.ajax(this.model.url() + '/partials').success(function(response) {
      var partials = $('<div />').html(response);

      view.ui.header.replaceWith(partials.find('.header'));
      view.ui.overview.replaceWith(partials.find('.overview'));
      view.bindUIElements();

      view.updateWidgets(partials);

      view.ui.header.header({
        slideshow: pageflow.slides
      });
      view.ui.overview.overview();
    });

    this.$el.toggleClass('emphasize_chapter_beginning', !!this.model.configuration.get('emphasize_chapter_beginning'));
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

    this.$el.removeClass(_.difference(previousClasses, newClasses).join(' '));
    this.$el.addClass(newClasses.join(' '));
  },

  widgetNames: function(widgets) {
    return widgets.map(function() {
      return 'widget_' + $(this).data('widget') + '_present';
    }).get();
  }
});