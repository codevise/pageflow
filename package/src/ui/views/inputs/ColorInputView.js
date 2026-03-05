import Marionette from 'backbone.marionette';
import _ from 'underscore';
import ColorPicker from '../ColorPicker';

export {ColorPicker};

import {inputView} from '../mixins/inputView';
import {inputWithPlaceholderText} from '../mixins/inputWithPlaceholderText';

import template from '../../templates/inputs/colorInput.jst';

/**
 * Input view for a color value in hex representation.
 *
 * See {@link inputWithPlaceholderText} for placeholder related
 * further options.  See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {string|function} [options.defaultValue]
 *   Color value to display by default. The corresponding value is not
 *   stored in the model. Selecting the default value when a different
 *   value was set before, unsets the attribute in the model.
 *
 * @param {string} [options.defaultValueBinding]
 *   Name of an attribute the default value depends on. If a function
 *   is used as defaultValue option, it will be passed the value of the
 *   defaultValueBinding attribute each time it changes. If no
 *   defaultValue option is set, the value of the defaultValueBinding
 *   attribute will be used as default value.
 *
 * @param {string|function} [options.placeholderColor]
 *   Color to display in swatch by default.
 *
 * @param {string} [options.placeholderColorBinding]
 *   Name of an attribute the placeholder color depends on. If a function
 *   is used as placeholderColor option, it will be passed the value of the
 *   placeholderColorBinding attribute each time it changes.
 *
 * @param {boolean} [options.alpha]
 *   Allow picking colors with alpha channel. When enabled, translucent
 *   colors are stored in `#rrggbbaa` format. Fully opaque colors still
 *   use `#rrggbb`.
 *
 * @param {string[]} [options.swatches]
 *   Preset color values to be displayed inside the picker drop
 *   down. The default value, if present, is always used as the
 *   first swatch automatically.
 *
 * @class
 */
export const ColorInputView = Marionette.ItemView.extend({
  mixins: [inputView, inputWithPlaceholderText],

  template,
  className: 'color_input',

  ui: {
    input: 'input'
  },

  onRender: function() {
    this.setupAttributeBinding('placeholderColor', this.updatePlaceholderColor);

    this._colorPicker = new ColorPicker(this.ui.input[0], {
      alpha: this.options.alpha,
      defaultValue: this.defaultValue(),
      fallbackColor: this.getAttributeBoundOption('placeholderColor'),
      fallbackColorDescription: this.options.placeholderColorDescription,
      swatches: this.getSwatches(),
      onChange: _.debounce(_.bind(this._onChange, this), 200)
    });

    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);

    if (this.options.defaultValueBinding) {
      this.listenTo(this.model, 'change:' + this.options.defaultValueBinding, this.updateSettings);
    }

    this.load();
  },

  updatePlaceholderColor(value) {
    if (this._colorPicker) {
      this._colorPicker.update({fallbackColor: value});
    }
  },

  updateSettings: function() {
    this._colorPicker.update({
      defaultValue: this.defaultValue(),
      swatches: this.getSwatches()
    });

    this.load();
  },

  load: function() {
    var color = this.model.get(this.options.propertyName) || this.defaultValue() || '';

    if (!this._saving) {
      this._colorPicker.setValue(color);
    }

    this.$el.toggleClass('is_default', !this.model.has(this.options.propertyName));
  },

  onBeforeClose: function() {
    this._colorPicker.destroy();
  },

  getSwatches: function() {
    return _.chain([this.defaultValue(), this.options.swatches])
      .flatten()
      .uniq()
      .compact()
      .value();
  },

  defaultValue: function () {
    var bindingValue;

    if (this.options.defaultValueBinding) {
      bindingValue = this.model.get(this.options.defaultValueBinding);
    }

    if (typeof this.options.defaultValue === 'function') {
      return this.options.defaultValue(bindingValue);
    }
    else if ('defaultValue' in this.options) {
      return this.options.defaultValue;
    }
    else {
      return bindingValue;
    }
  },

  _onChange: function(color) {
    this._saving = true;

    if (!color || color === this.defaultValue()) {
      this.model.unset(this.options.propertyName);
    }
    else {
      this.model.set(this.options.propertyName, color);
    }

    this._saving = false;
  }
});
