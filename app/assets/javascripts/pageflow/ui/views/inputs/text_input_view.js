/**
 * Input view for a single line of text.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the input is blank.
 *
 * @see
 * {@link module:pageflow/ui.pageflow.inputWithPlaceholderText pageflow.inputWithPlaceholderText}
 * for placeholder related further options
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.TextInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView, pageflow.inputWithPlaceholderText],

  template: 'pageflow/ui/templates/inputs/text_input',

  ui: {
    input: 'input'
  },

  events: {
    'change': 'onChange'
  },

  onRender: function() {
    this.load();
    this.validate();

    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  onChange: function() {
    this.validate();
    this.save();
  },

  onClose: function() {
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
  }
});
