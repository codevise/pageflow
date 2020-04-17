import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {findKeyWithTranslation} from '../../utils/i18nUtils';
import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/checkBoxGroupInput.jst';

/**
 * Input view for attributes storing configuration hashes with boolean values.
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @class
 */
export const CheckBoxGroupInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  template,
  className: 'check_box_group_input',

  events: {
    'change': 'save'
  },

  ui: {
    label: 'label',
    container: '.check_boxes_container'
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
      var option = '<div class="check_box">'+
                   '<label><input type="checkbox" name="'+value+'" />'+
                   this.options.texts[index]+'</label></div>';
      this.ui.container.append($(option));
    }, this);
  },

  save: function() {
    var configured = {};
    _.each(this.ui.container.find('input'), function(input) {
      configured[$(input).attr('name')] = $(input).prop('checked');
    });
    this.model.set(this.options.propertyName, configured);
  },

  load: function() {
    if (!this.isClosed) {
      _.each(this.options.values, function(value) {
        this.ui.container
          .find('input[name="'+value+'"]')
          .prop('checked', this.model.get(this.options.propertyName)[value]);
      }, this);
    }
  }
});
