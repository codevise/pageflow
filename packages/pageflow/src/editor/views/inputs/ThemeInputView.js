pageflow.ThemeInputView = pageflow.ReferenceInputView.extend({
  options: function() {
    return {
      chooseButtonTitle: I18n.t('pageflow.editor.views.inputs.theme_input_view.choose'),
      hideUnsetButton: true
    };
  },

  choose: function() {
    return pageflow.ChangeThemeDialogView.changeTheme({
      model: this.model,
      themes: this.options.themes,
      themeInUse: this.model.get(this.options.propertyName)
    });
  },

  chooseValue: function() {
    return this.choose().then(function(model) {
      return model.get('name');
    });
  },

  getTarget: function(themeName) {
    return this.options.themes.findByName(themeName);
  }
});
