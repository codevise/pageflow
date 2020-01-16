import Marionette from 'backbone.marionette';
import _ from 'underscore';
import 'jquery.minicolors';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/textInput.jst';

/**
 * Input view for a color value in hex representation.
 * See {@link inputView} for further options
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
 * @param {string[]} [options.swatches]
 *   Preset color values to be displayed inside the picker drop
 *   down. The default value, if present, is always used as the
 *   first swatch automatically.
 *
 * @class
 */
export const ColorInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,
  className: 'color_input',

  ui: {
    input: 'input'
  },

  events: {
    'mousedown': 'refreshPicker'
  },

  onRender: function() {
    this.ui.input.minicolors({
      changeDelay: 200,
      change: _.bind(function(color) {
        if (color === this.defaultValue()) {
          this.model.unset(this.options.propertyName);
        }
        else {
          this.model.set(this.options.propertyName, color);
        }
      }, this)
    });

    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);

    if (this.options.defaultValueBinding) {
      this.listenTo(this.model, 'change:' + this.options.defaultValueBinding, this.updateSettings);
    }

    this.updateSettings();
  },

  updateSettings: function() {
    this.ui.input.minicolors('settings', {
      defaultValue: this.defaultValue(),
      swatches: this.getSwatches()
    });

    this.load();
  },

  load: function() {
    this.ui.input.minicolors('value',
                             this.model.get(this.options.propertyName) || this.defaultValue());
    this.$el.toggleClass('is_default', !this.model.has(this.options.propertyName));
  },

  refreshPicker: function() {
    this.ui.input.minicolors('value', {});
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
  }
});
