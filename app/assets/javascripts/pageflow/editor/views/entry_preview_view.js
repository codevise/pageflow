pageflow.EntryPreviewView = Backbone.Marionette.ItemView.extend({
  template: 'templates/entry_preview',
  className: 'container',

  ui: {
    header: '.header',
    entry: '.entry',
    navigation: '.navigation',
    navigationMobile: '.navigation_mobile',
    overview: '.overview'
  },

  onRender: function() {
    this.pageViews = this.subview(new pageflow.CollectionView({
      el: this.ui.entry,
      collection: this.model.pages,
      itemViewConstructor: pageflow.PagePreviewView
    }));

    this.ui.entry.append($('<div class="scroll_indicator indicator">Scrollen, um weiterzulesen</div>'));

    this.update();

    this.listenTo(pageflow.entry, 'sync:order', this.update);
    this.listenTo(pageflow.entry, 'change:credits change:home_url change:home_button_enabled', function() {
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
      view.ui.navigation.replaceWith(partials.find('.navigation'));
      view.ui.navigationMobile.replaceWith(partials.find('.navigation_mobile'));
      view.ui.overview.replaceWith(partials.find('.overview'));

      view.bindUIElements();

      view.ui.header.header({
        slideshow: pageflow.slides
      });
      view.ui.navigation.navigation();
      view.ui.navigationMobile.navigationMobile();
      view.ui.overview.overview();
    });
  }
});