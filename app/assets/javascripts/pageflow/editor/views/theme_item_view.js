/** @api private */
pageflow.ThemeItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: 'pageflow/editor/templates/theme_item',

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

      this.configuration.set('theme_name', newThemeName);
      var stylesheetPath = pageflow.editor.themes.findByName(newThemeName)
          .get('stylesheet_path');
      pageflow.stylesheet.update('theme', stylesheetPath);
    },
    'mouseenter': 'select',
    'click': 'select'
  },

  initialize: function(options) {
    this.configuration = this.options.configuration;
    this.listenTo(this.configuration, 'change', this.render);
  },

  onRender: function() {
    this.ui.themeName.text(this.translateThemeName());

    if (this.inUse()) {
      this.ui.inUseRegion.text('✓');
    }

    this.ui.useButton.toggle(
      !this.inUse()
    );
  },

  inUse: function() {
    return this.model.get('name') === this.configuration.get('theme_name');
  },

  translateThemeName: function() {
    var name = this.model.get('name');
    return I18n.t('pageflow.' + name + '_theme.name');
  }
});
