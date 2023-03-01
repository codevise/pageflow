import Marionette from 'backbone.marionette';

import {inputView} from '../mixins/inputView';

/**
 * Input view for a number.
 *
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.locale]
 * Locale used to fomat and parse numbers.
 *
 * @class
 */
export const NumberInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <input type="text" dir="auto" />
  `,

  ui: {
    input: 'input'
  },

  events: {
    'change': 'onChange'
  },

  initialize() {
    this.parser = new NumberParser(this.options.locale);
  },

  onRender: function() {
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  onChange: function() {
    this.save();
    this.load();
  },

  onClose: function() {
    this.save();
  },

  save: function() {
    const inputValue = this.ui.input.val();
    this.model.set(this.options.propertyName, this.parser.parse(inputValue) || 0);
  },

  load: function() {
    const input = this.ui.input;
    const value = this.model.get(this.options.propertyName) || 0;

    input.val(value.toLocaleString(this.options.locale, {useGrouping: false}));
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

class NumberParser {
  constructor(locale) {
    const format = new Intl.NumberFormat(locale);
    const parts = format.formatToParts(12345.6);
    const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
    const index = new Map(numerals.map((d, i) => [d, i]));

    this._group = new RegExp(`[${parts.find(d => d.type === "group").value}]`, "g");
    this._decimal = new RegExp(`[${parts.find(d => d.type === "decimal").value}]`);
    this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
    this._index = d => index.get(d);
  }

  parse(string) {
    string = string.trim()
                   .replace(this._group, "")
                   .replace(this._decimal, ".")
                   .replace(this._numeral, this._index);
    return string ? +string : NaN;
  }
}
