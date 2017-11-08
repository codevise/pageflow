/**
 * Input view for a color value in hex representation.
 *
 * @param {string} [options.defaultValue]
 *   Color value to display by default. The corresponding value is not
 *   stored in the model. Selecting the default value when a different
 *   value was set before, unsets the attribute in the model.
 *
 * @param {string[]} [options.swatches]
 *   Preset color values to be displayed inside the picker drop
 *   down. The default value, if present, is always used as the
 *   first swatch automatically.
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.ColorInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/text_input',
  className: 'color_input',

  ui: {
    input: 'input'
  },

  events: {
    'mousedown': 'refreshPicker'
  },

  onRender: function() {
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);

    this.ui.input.minicolors({
      defaultValue: this.options.defaultValue,
      swatches: this.getSwatches(),

      changeDelay: 200,
      change: _.bind(function(color) {
        if (this.options.defaultValue && color === this.options.defaultValue) {
          this.model.unset(this.options.propertyName);
        }
        else {
          this.model.set(this.options.propertyName, color);
        }
      }, this)
    });
  },

  load: function() {
    this.ui.input.val(this.model.get(this.options.propertyName));
  },

  getSwatches: function() {
    return _.chain([this.options.defaultValue, this.options.swatches])
      .flatten()
      .uniq()
      .compact()
      .value();
  },

  refreshPicker: function() {
    this.ui.input.minicolors('value', {});
  }
});