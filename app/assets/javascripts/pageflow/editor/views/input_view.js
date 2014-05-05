pageflow.inputView = {
  ui: {
    labelText: 'label .name',
    inlineHelp: 'label .inline_help'
  },

  onRender: function() {
    this.$el.addClass(this.model.modelName + '_' + this.options.propertyName);
    this.ui.labelText.text(this.localizedAttributeName());

    this.ui.inlineHelp.text(this.inlineHelpText());

    if (!this.inlineHelpText()) {
      this.ui.inlineHelp.hide();
    }
  },

  localizedAttributeName: function() {
    return I18n.t('activerecord.attributes.' + this.model.modelName + '.' + this.options.propertyName);
  },

  inlineHelpText: function() {
    return I18n.t('editor.inline_help.' + this.model.modelName + '.' + this.options.propertyName, {defaultValue: ''});
  }
};