/**
 * Text based input view that can display a placeholder.
 *
 * @param {Object} [options]
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
 */
export const inputWithPlaceholderText = {
  onRender: function() {
    this.updatePlaceholder();

    if (this.options.placeholderBinding) {
      this.listenTo(this.model,
                    'change:' + this.options.placeholderBinding,
                    this.updatePlaceholder);
    }
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
};
