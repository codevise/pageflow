pageflow.inputView = {
  ui: {
    labelText: 'label .name',
    inlineHelp: 'label .inline_help'
  },

  onRender: function() {
    this.$el.addClass(this.model.modelName + '_' + this.options.propertyName);
    this.ui.labelText.text(this.labelText());

    this.ui.inlineHelp.text(this.inlineHelpText());

    if (!this.inlineHelpText()) {
      this.ui.inlineHelp.hide();
    }

    this.updateDisabled();
    this.setupVisibleBinding();
  },

  labelText: function() {
    return this.options.label || this.localizedAttributeName();
  },

  localizedAttributeName: function() {
    return I18n.t('activerecord.attributes.' + this.model.i18nKey + '.' + this.options.propertyName);
  },

  inlineHelpText: function() {
    var key = 'pageflow.ui.inline_help.' + this.model.i18nKey + '.' + this.options.propertyName;
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
  },

  setupVisibleBinding: function() {
    var view = this;

    if (this.options.visibleBinding) {
      this.listenTo(this.model, 'change:' + this.options.visibleBinding, updateVisible);
      updateVisible(this.model, this.model.get(this.options.visibleBinding));
    }

    function updateVisible(model, value) {
      view.$el.toggle(view.options.visibleBindingValue ? value === view.options.visibleBindingValue : !!value);
    }
  }
};