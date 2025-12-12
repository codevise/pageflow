import Marionette from 'backbone.marionette';
import 'jquery-ui';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/sliderInput.jst';

/**
 * A slider for numeric inputs.
 * See {@link inputView} for options
 *
 * @param {Object} [options]
 *
 * @param {number} [options.defaultValue]
 *   Default value to display if property is not set.
 *
 * @param {number} [options.minValue=0]
 *   Value when dragging slider to the very left.
 *
 * @param {number} [options.maxValue=100]
 *   Value when dragging slider to the very right.
 *
 * @param {string} [options.unit="%"]
 *   Unit to display after value.
 *
 * @param {function} [options.displayText]
 *   Function that receives value and returns custom text to display as value.
 *
 * @param {boolean} [options.saveOnSlide]
 *   Already update the model while dragging the handle - not only after
 *   handle has been released.
 *
 * @param {string} [options.icon]
 *   Path to an icon image to display before the label.
 *
 * @class
 */
export const SliderInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  className: 'slider_input',
  template,

  serializeData() {
    return {
      icon: this.options.icon
    };
  },

  ui: {
    widget: '.slider',
    value: '.value'
  },

  events: {
    'slidestart': 'handleSlideStart',
    'slidechange': 'save',
    'slide': 'handleSlide'
  },

  onRender: function() {
    this.ui.widget.slider({
      animate: 'fast'
    });

    if (this.options.values) {
      this.ui.widget.slider('option', 'min', 0);
      this.ui.widget.slider('option', 'max', this.options.values.length - 1);
    }
    else {
      this.setupAttributeBinding('minValue', value => this.updateSliderOption('min', value || 0));
      this.setupAttributeBinding('maxValue', value => this.updateSliderOption('max', value !== undefined ? value : 100));
    }

    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  updateSliderOption(name, value) {
    this.ui.widget.slider('option', name, value)
    this.updateText(this.ui.widget.slider('value'));
  },

  updateDisabled: function(disabled) {
    this.$el.toggleClass('disabled', !!disabled);

    if (disabled) {
      this.ui.widget.slider('disable');
    }
    else {
      this.ui.widget.slider('enable');
    }
  },

  handleSlideStart() {
    if (this.options.onInteractionStart) {
      this.options.onInteractionStart();
    }
  },

  handleSlide(event, ui) {
    var value = this.options.values ? this.options.values[ui.value] : ui.value;
    this.updateText(value);

    if (this.options.saveOnSlide) {
      this.save(event, ui);
    }
  },

  save: function(event, ui) {
    if (this.loading) {
      return;
    }

    var value = this.options.values ? this.options.values[ui.value] : ui.value;
    this.model.set(this.options.propertyName, value);
  },

  load: function() {
    var value;

    if (this.model.has(this.options.propertyName)) {
      value = this.model.get(this.options.propertyName)
    }
    else {
      value = 'defaultValue' in this.options ? this.options.defaultValue : 0
    }

    var sliderValue = this.options.values ?
      this.options.values.indexOf(value) :
      value;

    this.loading = true;
    this.ui.widget.slider('option', 'value', this.clampValue(sliderValue));
    this.loading = false;
    this.updateText(value);
  },

  clampValue(value) {
    const min = this.ui.widget.slider('option', 'min');
    const max = this.ui.widget.slider('option', 'max');

    return Math.min(max, Math.max(min, value));
  },

  updateText: function(value) {
    var text;

    if (this.options.texts) {
      var index = this.options.values.indexOf(value);
      text = this.options.texts[index];
    }
    else if ('displayText' in this.options) {
      text = this.options.displayText(value);
    }
    else {
      var unit = 'unit' in this.options ? this.options.unit : '%';
      text = value + unit;
    }

    this.ui.value.text(text);
  }
});
