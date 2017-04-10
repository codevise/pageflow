pageflow.ChangeThemeDialogView = Backbone.Marionette.ItemView.extend({
  template: 'templates/change_theme_dialog',
  className: 'change_theme dialog',

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
    var themeInUse = this.options.themes.findWhere({
      name: pageflow.entry.configuration.get('theme_name')
    });
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
      collection: pageflow.editor.themes,
      tagName: 'ul',
      model: this.model,
      itemViewConstructor: pageflow.ThemeView,
      itemViewOptions: {
        configuration: this.model,
        selection: this.selection
      }
    });

    this.ui.themesPanel.append(this.subview(this.themesView).el);

    this.update();
  },

  update: function() {
    this.ui.previewImage.attr('src', pageflow.editor.themes.find(function(theme) {
      return theme.attributes.name == pageflow.entry.configuration.attributes.theme_name;
    }).get('preview_image_url'));
  }
});

pageflow.ChangeThemeDialogView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.ChangeThemeDialogView(options));
};
