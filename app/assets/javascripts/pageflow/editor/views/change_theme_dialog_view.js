pageflow.ChangeThemeDialogView = Backbone.Marionette.ItemView.extend({
  template: 'templates/change_theme_dialog',
  className: 'change_theme dialog editor',

  mixins: [pageflow.dialogView],

  ui: {
    content: '.content',
    themesPanel: '.themes_panel',
    previewImageRegion: '.preview_image_region',
    previewImage: '.preview_image',
    previewHeaderThemeName: '.preview_header_theme_name'
  },

  initialize: function(options) {
    this.listenTo(this.model, 'change', this.update);
    this.selection = new Backbone.Model();
    var themeInUse = this.options.themes.findByName(pageflow.entry.configuration.get('theme_name'));
    this.selection.set('theme', themeInUse);
    this.listenTo(this.selection, 'change:theme', function() {
      if (!this.selection.get('theme')) {
        this.selection.set('theme', themeInUse);
      }
      this.update();
    });
  },

  onRender: function() {
    this.themesView = new pageflow.CollectionView({
      collection: this.options.themes,
      tagName: 'ul',
      itemViewConstructor: pageflow.ThemeItemView,
      itemViewOptions: {
        configuration: this.model,
        selection: this.selection,
        onUse: this.options.onUse
      }
    });

    this.ui.themesPanel.append(this.subview(this.themesView).el);

    this.update();
  },

  update: function() {
    var that = this;
    var selectedTheme = this.options.themes.findByName(that.selection.get('theme').get('name'));
    this.ui.previewImage.attr('src', selectedTheme.get('preview_image_url'));
    this.ui.previewHeaderThemeName.text(that.translateThemeName({
      name: selectedTheme.get('name')
    }));
  },

  translateThemeName: function(options) {
    var name = options.name;
    return I18n.t('pageflow.' + name + '_theme.name');
  }
});

pageflow.ChangeThemeDialogView.changeTheme = function(options) {
  return $.Deferred(function(deferred) {
    options.onUse = function() {
      deferred.resolve(this.model);
    };

    var view = new pageflow.ChangeThemeDialogView(options);

    view.on('close', function() {
      deferred.reject();
    });

    pageflow.app.dialogRegion.show(view.render());
  }).promise();
};
