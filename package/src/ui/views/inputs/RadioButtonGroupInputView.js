import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {findKeyWithTranslation} from '../../utils/i18nUtils';
import {inputView} from '../mixins/inputView';

/**
 * Input view for selecting one value from a small set of options
 * using radio buttons.
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {Array} options.values
 *   Array of possible values the property can be set to.
 *
 * @param {Array} [options.texts]
 *   Array of display texts for the values. If not provided,
 *   translations are looked up based on the model's i18nKey.
 *
 * @class
 */
export const RadioButtonGroupInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
  `,
  className: 'radio_button_input',

  events: {
    'change': 'save'
  },

  initialize: function() {
    if (!this.options.texts) {
      var translationKeyPrefix = findKeyWithTranslation(
        this.attributeTranslationKeys('values', {fallbackPrefix: 'activerecord.values'})
      );

      this.options.texts = _.map(this.options.values, function(value) {
        return I18n.t(translationKeyPrefix + '.' + value);
      });
    }
  },

  onRender: function() {
    this.appendOptions();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  updateDisabled: function() {
    this.$el.find('input').prop('disabled', this.isDisabled());
  },

  save: function() {
    var index = this.$el.find('input').index(this.$el.find('input:checked'));
    this.model.set(this.options.propertyName, this.options.values[index]);
  },

  appendOptions: function() {
    _.each(this.options.values, function(value, index) {
      var id = this.cid + '_' + value;

      var wrapper = document.createElement('div');
      wrapper.className = 'radio_button';

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = this.options.propertyName;
      input.value = value;
      input.id = id;

      var label = document.createElement('label');
      label.htmlFor = id;

      var nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = this.options.texts[index];
      label.appendChild(nameSpan);

      wrapper.appendChild(input);
      wrapper.appendChild(document.createTextNode(' '));
      wrapper.appendChild(label);
      this.$el.append(wrapper);
    }, this);
  },

  load: function() {
    if (!this.isClosed) {
      var value = this.model.get(this.options.propertyName);
      this.$el.find('input[value="' + value + '"]').prop('checked', true);
    }
  }
});
