/**
 * Input view for a single line of text.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the input is blank.
 *
 * @param {string|function} [options.placeholder]
 *   Display a placeholder string if the input is blank. Either a
 *   string or a function taking the model as a first parameter and
 *   returning a string.
 *
 * @param {string} [options.placeholderBinding]
 *   Name of an attribute. Recompute the placeholder function whenever
 *   this attribute changes.
 *
 * @param {boolean} [options.hidePlaceholderIfDisabled]
 *   Do not display the placeholder if the input is disabled.
 *
 * @param {Backbone.Model} [options.placeholderModel]
 *   Obtain placeholder by looking up the configured `propertyName`
 *   inside a given model.
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
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

    if (this.options.placeholderBinding) {
      this.listenTo(this.model,
                    'change:' + this.options.placeholderBinding,
                    this.updatePlaceholder);
    }
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
  },

  updatePlaceholder: function() {
    this.ui.input.attr('placeholder', this.placeholderText());
  },

  placeholderText: function() {
    if (!this.options.disabled || !this.options.hidePlaceholderIfDisabled) {
      if (this.options.placeholder) {
        if (typeof this.options.placeholder == 'function') {
          return this.options.placeholder(this.model);
        }
        else {
          return this.options.placeholder;
        }
      }
      else {
        return this.placeholderModelValue();
      }
    }
  },

  placeholderModelValue: function() {
    return this.options.placeholderModel &&
      this.options.placeholderModel.get(this.options.propertyName);
  }
});
