pageflow.TextInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/text_input',

  ui: {
    input: 'input'
  },

  events: {
    'change': 'onChange'
  },

  onRender: function() {
    this.updatePlaceholder();
    this.load();
    this.validate();

    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  onChange: function() {
    this.validate();
    this.save();
  },

  save: function() {
    this.model.set(this.options.propertyName, this.ui.input.val());
  },

  load: function() {
    this.ui.input.val(this.model.get(this.options.propertyName));
  },

  validate: function() {
    if (this.options.required && !this.ui.input.val()) {
      this.displayValidationError(I18n.t('pageflow.ui.views.inputs.text_input_view.required_field'));
    }
    else {
      this.resetValidationError();
    }
  },

  displayValidationError: function(message) {
    this.$el.addClass('invalid');
    this.ui.input.attr('title', message);
  },

  resetValidationError: function(message) {
    this.$el.removeClass('invalid');
    this.ui.input.attr('title', '');
  },

  updatePlaceholder: function() {
    this.ui.input.attr('placeholder', this.placeholderText());
  },

  placeholderText: function() {
    if (!this.options.disabled || !this.options.hidePlaceholderIfDisabled) {
      return this.options.placeholder || this.placholderModelValue();
    }
  },

  placholderModelValue: function() {
    return this.options.placeholderModel && this.options.placeholderModel.get(this.options.propertyName);
  }
});