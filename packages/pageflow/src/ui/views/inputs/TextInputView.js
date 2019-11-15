/**
 * Input view for a single line of text.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the input is blank.
 *
 * @param {number} [options.maxLength=255]
 *   Maximum length of characters for this input.
 *   To support legacy data which consists of more characters than the specified maxLength,
 *   the option will only take effect for data which is shorter than the specified maxLength.
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
    if(this.validate()) {
      this.save();
    }
  },

  onClose: function() {
    if(this.validate()) {
      this.save();
    }
  },

  save: function() {
    this.model.set(this.options.propertyName, this.ui.input.val());
  },

  load: function() {
    var input = this.ui.input;
    input.val(this.model.get(this.options.propertyName));

    // set mysql varchar length as default for non-legacy data
    this.options.maxLength = this.options.maxLength || 255;
    // do not validate legacy data which length exceeds the specified maximum
    // for new and maxLength-conforming data: add validation
    this.validateMaxLength = (input.val().length <= this.options.maxLength);
  },

  validate: function() {
    var input = this.ui.input;
    if (this.options.required && !input.val()) {
      this.displayValidationError(I18n.t('pageflow.ui.views.inputs.text_input_view.required_field'));
      return false;
    } if (this.validateMaxLength && (input.val().length > this.options.maxLength)) {
      this.displayValidationError(
        I18n.t('pageflow.ui.views.inputs.text_input_view.max_characters_exceeded',
               {max_length: this.options.maxLength})
      );
      return false;
    }
    else {
      this.resetValidationError();
      return true;
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
