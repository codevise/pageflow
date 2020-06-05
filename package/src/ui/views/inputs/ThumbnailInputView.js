import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {findKeyWithTranslation} from '../../utils/i18nUtils';
import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/radioButton.jst';

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
export const ThumbnailInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,
  className: 'radio_button_group_input',

  events: {
    'change': 'save'
  },

  ui: {
    label: 'label',
    container: '.radio_buttons_container'
  },

  initialize: function() {
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
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.appendOptions();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  appendOptions: function () {
    _.each(this.options.values, function(value, index) {
      var option = '<div class="radio_button">'+
                   '<div class="'+ value +'_transition"><div class="upper_section">A</div><div class="lower_section">B</div></div>'+
                   '<label><input type="radio" value="'+value+'" name="transitions"/>'+
                   this.options.texts[index]+'</label></div>';
      this.ui.container.append($(option));

      if (this.options.optionDisabled &&
        this.options.optionDisabled(value)) {
      option.setAttribute('disabled', true);
    }
    }, this);
  },

  save: function() {
    var configured = {};
    _.each(this.ui.container.find('input'), function(input) {
        if ($(input).is(':checked')) {
            configured = $(input).attr('value');
        }
    });
    this.model.set(this.options.propertyName, configured);
  },

  load: function() {
    if (!this.isClosed) {
      _.each(this.options.values, function(value) {
        this.ui.container
          .find('input[value="'+value+'"]')
          .prop('checked', this.model.get(this.options.propertyName)[value]);
      }, this);
    }
  }
});
