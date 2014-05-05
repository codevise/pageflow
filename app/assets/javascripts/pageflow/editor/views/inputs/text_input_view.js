pageflow.TextInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'templates/inputs/text_input',

  ui: {
    input: 'input'
  },

  events: {
    'change': 'onChange'
  },

  onRender: function() {
    this.load();
    this.validate();
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
      this.displayValidationError('Muss ausgefüllt werden');
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
  }
});