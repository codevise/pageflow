
import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';
//import {app, cssModulesUtils} from 'pageflow/editor';

import {inputView} from 'pageflow/ui';

import styles from './EditSectionTransitionEffectView.module.css';


export const EditSectionTransitionEffectView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: () => `
    <label>
        <span class="name"></span>
        <span class="inline_help"></span>
    </label>
    <div class="radio_buttons_container" />
    `,

  events: {
    'change': 'save'
  },

  ui: {
    label: 'label',
    container: ".radio_buttons_container"
  },

  initialize: function() {
    if (!this.options.texts) {
        if (!this.options.translationKeys) {
            var translationKeyPrefix = this.options.attributeTranslationKeyPrefixes;
            this.options.translationKeys = _.map(this.options.values, function(value) {
                return translationKeyPrefix + '.transition.values.' + value;
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
    //this.select();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  appendOptions: function () {
    _.each(this.options.values, function(value, index) {
      var option = `<div class="${styles.transition} ${this.options.optionDisabled(value) ? styles['disabled'] : 'enabled'}">
                   <div class="${styles[value]}"><div class="${styles.upper_section}">A</div><div class="${styles.lower_section}">B</div></div>
                   <label><input type="radio" value="${value}" name="transitions"/>
                   ${this.options.texts[index]}</label></div>`;
      this.ui.container.append($(option));
        
    //   if (this.options.optionDisabled &&
    //     this.options.optionDisabled(value)) {
    //   //option.setAttribute('disabled', true);
    //   option.classList.add('disable');
    // }
    // console.log(this);
    }, this);
  },

  save: function() {
    var configured = {};
    _.each(this.ui.container.find('input'), function(input) {
        if ($(input).is(':checked')) {
            configured = $(input);
        }
    });
    this.model.set(this.options.propertyName, configured.attr('value'));
  },

  // select: function() {
  //   var select = {};
  //   _.each(this.ui.container.find('div'), function(div) {
  //       if ($(div).hasClass(styles.active)) {
  //           select = $(div);
  //       }
  //       else {
  //           $(div).context.parentElement.classList.remove(styles.active);          
  //       }
  //   });
  //   //select.context.parentElement.classList.add(styles.active);
  //   console.log(select);
  //},

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

