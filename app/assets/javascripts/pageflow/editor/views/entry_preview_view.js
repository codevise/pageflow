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

    this.ui.entry.append($('<div class="scroll_indicator indicator">Scrollen, um weiterzulesen</div>'));

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
    var slideshow = pageflow.slides =  new pageflow.Slideshow(this.ui.entry);
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
    });
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

    this.$el.toggleClass('emphasize_chapter_beginning', !!this.model.get('emphasize_chapter_beginning'));
  },

  updateWidgets: function(partials) {
    this.widgets.remove();
    this.widgets = partials.find('[data-widget]');
    this.ui.entry.before(this.widgets);

    pageflow.widgetTypes.enhance(this.$el);
  }
});