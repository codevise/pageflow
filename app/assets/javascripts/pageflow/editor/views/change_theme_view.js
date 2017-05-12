pageflow.ChangeThemeView = Backbone.Marionette.ItemView.extend({
  template: 'templates/change_theme',

  ui: {
    changeThemeButton: '.change_theme',
    labelText: 'label .name',
    currentThemeName: 'p.current_theme_name'
  },

  events: {
    'click .change_theme': function() {
      pageflow.ChangeThemeDialogView.open({
        model: this.model,
        themes: this.options.themes
      });
    }
  },

  initialize: function(options) {
    this.listenTo(this.model, 'change:theme_name', this.render);
  },

  onRender: function() {
    this.ui.labelText.text(this.labelText());
    this.ui.currentThemeName.text(this.localizedThemeName());
  },

  labelText: function() {
    return this.options.label || this.labelPrefix();
  },

  labelPrefix: function() {
    return I18n.t('pageflow.editor.templates.change_theme.current_prefix');
  },

  localizedThemeName: function() {
    return I18n.t('pageflow.' + this.model.get('theme_name') + '_theme.name');
  }
});
