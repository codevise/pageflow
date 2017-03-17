pageflow.ChangeThemeView = Backbone.Marionette.ItemView.extend({
  template: 'templates/change_theme',

  ui: {
    changeThemeButton: '.change_theme',
    labelText: 'label .name'
  },

  events: {
    'click .change_theme': function() {
      pageflow.ChangeThemeDialogView.open({
        model: this.model,
        themes: this.options.themes
      });
    }
  },

  onRender: function() {
    this.ui.labelText.text(this.labelText());
  },

  labelText: function() {
    return this.options.label || this.labelPrefix() + ': ' + this.localizedThemeName();
  },

  labelPrefix: function() {
    return I18n.t('pageflow.editor.templates.change_theme.current_prefix');
  },

  localizedThemeName: function() {
    return I18n.t('pageflow.' + this.model.get('theme_name') + '_theme.name');
  }
});
