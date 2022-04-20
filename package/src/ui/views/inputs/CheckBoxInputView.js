import Marionette from 'backbone.marionette';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/checkBox.jst';

/**
 * Input view for boolean values.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {boolean} [options.displayUncheckedIfDisabled=false]
 *   Ignore the attribute value if the input is disabled and display
 *   an unchecked check box.
 *
 * @param {boolean} [options.displayCheckedIfDisabled=false]
 *   Ignore the attribute value if the input is disabled and display
 *   an checked check box.
 *
 * @param {string} [options.storeInverted]
 *   Display checked by default and store true in given attribute when
 *   unchecked. The property name passed to `input` is only used for
 *   translations.
 *
 * @class
 */
export const CheckBoxInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,
  className: 'check_box_input',

  events: {
    'change': 'save'
  },

  ui: {
    input: 'input',
    label: 'label'
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.ui.input.attr('id', this.cid);

    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  updateDisabled: function() {
    this.load();
  },

  save: function() {
    if (!this.isDisabled()) {
      const value = this.ui.input.is(':checked');

      if (this.options.storeInverted) {
        this.model.set(this.options.storeInverted, !value);
      }
      else {
        this.model.set(this.options.propertyName, value);
      }
    }
  },

  load: function() {
    if (!this.isClosed) {
      this.ui.input.prop('checked', this.displayValue());
    }
  },

  displayValue: function() {
    if (this.isDisabled() && this.options.displayUncheckedIfDisabled) {
      return false;
    }
    else if (this.isDisabled() && this.options.displayCheckedIfDisabled) {
      return true;
    }
    else if (this.options.storeInverted) {
      return !this.model.get(this.options.storeInverted);
    }
    else {
      return this.model.get(this.options.propertyName);
    }
  }
});
