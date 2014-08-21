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

    this.updateDisabled();
  },

  localizedAttributeName: function() {
    return I18n.t('activerecord.attributes.' + this.model.i18nKey + '.' + this.options.propertyName);
  },

  inlineHelpText: function() {
    var key = 'editor.inline_help.' + this.model.i18nKey + '.' + this.options.propertyName;
    var text = I18n.t(key, {defaultValue: ''});

    if (this.options.disabled) {
      text = I18n.t(key + '_disabled', {defaultValue: text});
    }

    return text;
  },

  updateDisabled: function() {
    if (this.ui.input) {
      this.updateDisabledAttribute(this.ui.input);
    }
  },

  updateDisabledAttribute: function(element) {
    if (this.options.disabled) {
      element.attr('disabled', true);
    }
    else {
      element.removeAttr('disabled');
    }
  }
};