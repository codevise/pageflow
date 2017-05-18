/** @api private */
pageflow.ThemeItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: 'pageflow/editor/templates/theme_item',
  className: 'theme_item',

  mixins: [pageflow.selectableView],

  selectionAttribute: 'theme',

  ui: {
    themeName: '.theme_name',
    useButton: '.use_theme',
    inUseRegion: '.theme_in_use'
  },

  events: {
    'click .use_theme': function(event) {
      var newThemeName = this.model.get('name');

      var stylesheetPath = this.options.themes.findByName(newThemeName)
          .get('stylesheet_path');
      pageflow.stylesheet.update('theme', stylesheetPath);
      this.options.onUse(this.model);
    },
    'mouseenter': 'select',
    'click': 'select'
  },

  onRender: function() {
    this.$el.data('themeName', this.model.get('name'));
    this.ui.themeName.text(this.translateThemeName());

    if (this.inUse()) {
      this.ui.inUseRegion.text('✓');
    }

    this.ui.useButton.toggle(
      !this.inUse()
    );
  },

  inUse: function() {
    return this.model.get('name') === this.options.themeInUse;
  },

  translateThemeName: function() {
    var name = this.model.get('name');
    return I18n.t('pageflow.' + name + '_theme.name');
  }
});
