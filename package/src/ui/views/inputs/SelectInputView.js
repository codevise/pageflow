import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {findKeyWithTranslation} from '../../utils/i18nUtils';
import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/selectInput.jst';

/**
 * A drop down with support for grouped items.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {string[]} [options.values]
 *   List of possible values to persist in the attribute.
 *
 * @param {string[]} [options.texts]
 *   List of display texts for drop down items.
 *
 * @param {string[]} [options.translationKeys]
 *   Translation keys to obtain item texts from.
 *
 * @param {string[]} [options.translationKeyPrefix]
 *   Obtain texts for items from translations by appending the item
 *   value to this prefix separated by a dot. By default the
 *   [`attributeTranslationKeyPrefixes` option]{@link inputView}
 *   is used by appending the suffix `.values` to each candidate.
 *
 * @param {string[]} [options.groups]
 *   Array of same length as `values` array, containing the display
 *   name of a group header each item shall be grouped under.
 *
 * @param {Backbone.Model[]} [options.collection]
 *   Create items for each model in the collection. Use the
 *   `*Property` options to extract values and texts for each items
 *   from the models.
 *
 * @param {string} [options.valueProperty]
 *   Attribute to use as item value.
 *
 * @param {string} [options.textProperty]
 *   Attribute to use as item display text.
 *
 * @param {string} [options.groupProperty]
 *   Attribute to use as item group name.
 *
 * @param {string} [options.translationKeyProperty]
 *   Attribute to use as translation key to obtain display text.
 *
 * @param {string} [options.groupTranslationKeyProperty]
 *   Attribute to use as translation key to obtain group name.
 *
 * @param {boolean} [options.ensureValueDefined]
 *   Set the attribute to the first value on view creation.
 *
 * @param {boolean} [options.includeBlank]
 *   Include an item that sets the value of the attribute to a blank
 *   string.
 *
 * @param {string} [options.blankText]
 *   Display text for the blank item.
 *
 * @param {string} [options.blankTranslationKey]
 *   Translation key to obtain display text for blank item.
 *
 * @param {string} [options.placeholderValue]
 *   Include an item that sets the value of the attribute to a blank
 *   string and indicate that the attribute is set to a default
 *   value. Include the display name of the given value, in the
 *   text. This option can be used if a fallback to the
 *   `placeholderValue` occurs whenever the attribute is blank.
 *
 * @param {Backbone.Model} [options.placeholderModel]
 *   Behaves like `placeholderValue`, but obtains the value by looking
 *   up the `propertyName` attribute inside the given model. This
 *   option can be used if a fallback to the corresponding attribute
 *   value of the `placeholderModel` occurs whenever the attribute is
 *   blank.
 *
 * @param {function} [options.optionDisabled]
 *   Receives value and has to return boolean indicating whether
 *   option is disabled.
 *
 * @class
 */
export const SelectInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,

  events: {
    'change': 'save'
  },

  ui: {
    select: 'select',
    input: 'select'
  },

  initialize: function() {
    if (this.options.collection) {
      this.options.values = _.pluck(this.options.collection, this.options.valueProperty);

      if (this.options.textProperty) {
        this.options.texts = _.pluck(this.options.collection, this.options.textProperty);
      }
      else if (this.options.translationKeyProperty) {
        this.options.translationKeys = _.pluck(this.options.collection, this.options.translationKeyProperty);
      }

      if (this.options.groupProperty) {
        this.options.groups = _.pluck(this.options.collection, this.options.groupProperty);
      }
      else if (this.options.groupTranslationKeyProperty) {
        this.options.groupTanslationKeys = _.pluck(this.options.collection, this.options.groupTranslationKeyProperty);
      }
    }

    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = this.options.translationKeyPrefix ||
          findKeyWithTranslation(this.attributeTranslationKeys('values', {
            fallbackPrefix: 'activerecord.values'
          }));

        this.options.translationKeys = _.map(this.options.values, function(value) {
          return translationKeyPrefix + '.' + value;
        }, this);
      }

      this.options.texts = _.map(this.options.translationKeys, function(key) {
        return I18n.t(key);
      });
    }

    if (!this.options.groups) {
      this.options.groups = _.map(this.options.groupTanslationKeys, function(key) {
        return I18n.t(key);
      });
    }

    this.optGroups = {};
  },

  onRender: function() {
    this.appendBlank();
    this.appendPlaceholder();
    this.appendOptions();

    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);

    if (this.options.ensureValueDefined && !this.model.has(this.options.propertyName)) {
      this.save();
    }
  },

  appendBlank: function() {
    if (!this.options.includeBlank) {
      return;
    }

    if (this.options.blankTranslationKey) {
      this.options.blankText = I18n.t(this.options.blankTranslationKey);
    }

    var option = document.createElement('option');

    option.value = '';
    option.text = this.options.blankText || I18n.t('pageflow.ui.views.inputs.select_input_view.none');

    this.ui.select.append(option);
  },

  appendPlaceholder: function() {
    if (!this.options.placeholderModel && !this.options.placeholderValue) {
      return;
    }

    var placeholderValue = this.options.placeholderValue || this.options.placeholderModel.get(this.options.propertyName);
    var placeholderIndex = this.options.values.indexOf(placeholderValue);

    if (placeholderIndex >= 0) {
      var option = document.createElement('option');

      option.value = '';
      option.text = I18n.t('pageflow.ui.views.inputs.select_input_view.placeholder', {text: this.options.texts[placeholderIndex]});

      this.ui.select.append(option);
    }
  },

  appendOptions: function() {
    _.each(this.options.values, function(value, index) {
      var option = document.createElement('option');
      var group = this.options.groups[index];

      option.value = value;
      option.text = this.options.texts[index];

      if (this.options.optionDisabled &&
          this.options.optionDisabled(value)) {
        option.setAttribute('disabled', true);
      }

      if (group) {
        option.setAttribute('data-group', group);
        this.findOrCreateOptGroup(group).append(option);
      }
      else {
        this.ui.select.append(option);
      }
    }, this);
  },

  findOrCreateOptGroup: function(label) {
    if (!this.optGroups[label]) {
      this.optGroups[label] = $('<optgroup />', {label: label})
        .appendTo(this.ui.select);
    }

    return this.optGroups[label];
  },

  save: function() {
    this.model.set(this.options.propertyName, this.ui.select.val());
  },

  load: function() {
    if (!this.isClosed) {
      var value = this.model.get(this.options.propertyName);

      if (this.model.has(this.options.propertyName) &&
          this.ui.select.find('option[value="' + value +'"]:not([disabled])').length) {
        this.ui.select.val(value);

      }
      else {
        this.ui.select.val(this.ui.select.find('option:not([disabled]):first').val());
      }
    }
  }
});
