import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/jsonInput.jst';

export const JsonInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,
  className: 'json_input',

  ui: {
    input: 'textarea'
  },

  events: {
    'change': 'onChange',
    'keyup': 'validate'
  },

  onRender: function() {
    this.load();
    this.validate();

    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  onChange: function() {
    if (this.validate()) {
      this.save();
    }
  },

  onClose: function() {
    if (this.validate()) {
      this.save();
    }
  },

  save: function() {
    this.model.set(this.options.propertyName,
                   this.ui.input.val() ? JSON.parse(this.ui.input.val()) : null);
  },

  load: function() {
    var input = this.ui.input;
    var value = this.model.get(this.options.propertyName);

    input.val(value ? JSON.stringify(value, null, 2) : '');
  },

  validate: function() {
    var input = this.ui.input;

    if (input.val() && !this.isValidJson(input.val())) {
      this.displayValidationError(I18n.t('pageflow.ui.views.inputs.json_input_view.invalid'));
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
  },

  isValidJson: function(text) {
    try {
      JSON.parse(text);
      return true;
    }
    catch(e) {
      return false;
    }
  }
});
