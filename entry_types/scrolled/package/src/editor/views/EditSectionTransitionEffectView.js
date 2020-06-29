import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {inputView} from 'pageflow/ui';

import styles from './EditSectionTransitionEffectView.module.css';

export const EditSectionTransitionEffectView = Marionette.ItemView.extend({
  mixins: [inputView],

  template: () => `
    <label>
        <span class="name"></span>
        <span class="inline_help"></span>
    </label>
    <div class="transitions_container" />
    `,

  events: {
    'change': 'save'
  },

  ui: {
    label: 'label',
    container: ".transitions_container"
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

    if (!this.options.groups) {
      this.options.groups = _.map(this.options.groupTanslationKeys, function(key) {
        return I18n.t(key);
      });
    }
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.appendOptions();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
    this.loadCheckbox();
  },

  appendOptions: function () {
    var extendedOption = {};
    _.each(this.options.values, function(value, index) {
      if (value === 'fade') {
          extendedOption = `<label class=${styles.extended_option} for=${value}>
                              <input type='checkbox' name='transitions' value='${value}' id='${value}' ${this.options.optionDisabled(value) ? 'disabled' : ''}/>
                              ${this.options.texts[index]}
                            </label>`;
      }
      else {
        var option = `<div class='${styles.container}
                      ${this.options.optionDisabled(value) ? styles['disabled'] : 'enabled'}
                      ${value === 'fadeBg' ? styles.container_with_option : ''}'>
                        <label for='${value}'>
                          <div class='${styles.transition} ${styles[value]}'>
                            <div class='${styles.animation}'>
                              <div class='${styles.upper_section}'>
                                <div class='${styles.upper_background}'>A</div>
                              </div>
                              <div class='${styles.lower_section}'>
                                <div class='${styles.lower_background}'>B</div>
                              </div>
                            </div>
                            <div class='${styles.input}'>
                              <input type='radio' name='transitions' value='${value}' id='${value}' ${this.options.optionDisabled(value) ? 'disabled' : ''}/>
                              ${this.options.texts[index]}
                            </div>
                          </div>
                        </label>
                      </div>`;
          
        this.ui.container.append($(option));
      }

      if (value === 'fadeBg') {
          this.ui.container.find(`div.${styles.container_with_option}`).append($(extendedOption));
      }

    }, this);
  },

  save: function() {
    var configured = {};
    _.each(this.ui.container.find('input'), function(input) {
        if ($(input).is(':checked')) {
            configured = $(input);
        }
    });
    
    //This is the case, if a user unchecks the checkbox, then there is no checked item.
    //So the parent 'fade' transition will be selected.
    _.each(this.ui.container.find('input'), function(input) {
      if (!configured.length && $(input).context.id === 'fadeBg') {
        configured = $(input) 
      } 
      
      else if ($(input).context.id !== configured.context.id) {
          $(input).context.checked = false;
        }
    });
 
    this.model.set(this.options.propertyName, configured.attr('value'));
  },

  load: function() {
    if (!this.isClosed) {
      var value = this.model.get(this.options.propertyName);

      if (this.model.has(this.options.propertyName) &&
          this.ui.container.find('input[value="' + value +'"]:not([checked])').length) {

        var select = {};
        _.each(this.ui.container.find('label'), function(label) {
                if ($(label).context.htmlFor === value) {
                    select = $(label);
                }
                else {
                    if ($(label).context.htmlFor === 'fade') {
                      $(label).context.classList.remove(styles.active);
                    }
                    $(label).context.parentElement.classList.remove(styles.active);
                }
            });
        select.context.parentElement.classList.add(styles.active);

        if (select.context.htmlFor === 'fade') {
          select.context.classList.add(styles.active);
        }
        else {
          select.context.classList.remove(styles.active);
        }
      }
    }
  },
  //Checkbox doesn't retain it's state after a reload, so this will make sure if it was selected it retain it's value.
  loadCheckbox: function() {
    var value = this.model.get(this.options.propertyName);
    if (value === 'fade') {
        var input = this.ui.container.find('input[value="' + value +'"]');
        $(input).prop('checked', true);
    }
  }
});
