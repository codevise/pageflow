import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

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
    'click input': 'save'
  },

  ui: {
    label: 'label',
    container: ".transitions_container"
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.appendItems();

    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  appendItems: function () {
    this.ui.container.append([
      this.transitionItem({value: 'fade'}, [
        this.transitionVariant({value: 'fadeBg'}),
        this.transitionVariant({value: 'fade'})
      ]),
      this.transitionItem({value: 'panZoom'}, [
        this.transitionVariant({value: 'panZoom'}),
        this.transitionVariant({value: 'panZoomFade'})
      ]),
      this.transitionItem({value: 'scroll'}),
      this.transitionItem({value: 'scrollOver'}),
      this.transitionItem({value: 'reveal'}),
      this.transitionItem({value: 'beforeAfter'})
    ].join(''));
  },

  save() {
    this.saveRadioInout('transition',
                        this.model,
                        this.options.propertyName);

    this.saveRadioInout('defaultTransition',
                        this.options.defaultsModel,
                        this.options.defaultPropertyName);
  },

  saveRadioInout(name, model, propertyName) {
    const checkedInput = this.ui.container.find(
      `input[name="${name}"]:checked`
    );

    model.set(propertyName, checkedInput.attr('value'));
  },

  load() {
    if (!this.isClosed) {
      this.loadRadioInput('defaultTransition',
                          this.options.defaultsModel,
                          this.options.defaultPropertyName);

      const input =
        this.loadRadioInput('transition',
                            this.model,
                            this.options.propertyName);

      this.$el.find(`.${styles.container}`).removeClass(styles.active);
      input.parents(`.${styles.container}`).addClass(styles.active);

      input.parents(`.${styles.container}`)
           .find(`.${styles.transitionLabel}`)
           .attr('for', input.attr('id'));
    }
  },

  loadRadioInput(name, model, propertyName) {
    const value = model.get(propertyName);

    let input = this.ui.container.find(
      `input[name="${name}"][value="${value}"]:enabled`
    );

    if (!input.length) {
      input = this.ui.container.find(
        `input[name="${name}"]:enabled`
      ).first();
    }

    input.prop('checked', true);
    return input;
  },

  transitionItem({value}, variants = []) {
    return `
      <div class='${styles.container}
           ${this.options.optionDisabled(value) ? styles.disabled : ''}'>
        <label for='${value}' class="${styles.transitionLabel}">
          <div class='${styles.transition} ${styles[value]}'>
            ${this.transitionPreview()}
            <div class='${styles.input}'>
              ${variants.length ? '' : this.transitionInput({value})}
              ${this.transitionDisplayName(value)}
            </div>
          </div>
        </label>
        ${variants.length ? variants.join('') : this.defaultTransitionField({value})}
      </div>
    `;
  },

  transitionPreview() {
    return `
      <div class='${styles.animation}'>
        <div class='${styles.upperSection}'>
          <div class='${styles.upperBackground}'></div>
        </div>
        <div class='${styles.lowerSection}'>
          <div class='${styles.lowerBackground}'></div>
        </div>
      </div>
    `;
  },

  transitionVariant({value}) {
    return `
      <div class="${styles.transitionVariant}">
        <label for=${value} class="${styles.transitionVariantLabel}">
          ${this.transitionInput({value})}
          ${this.transitionVariantDisplayName(value)}
        </label>
        ${this.defaultTransitionField({value})}
      </div>
    `;
  },

  transitionInput({value}) {
    return `
      <input type='radio'
             name='transition'
             value='${value}'
             id='${value}'
             ${this.options.optionDisabled(value) ? 'disabled' : ''} />
    `;
  },

  defaultTransitionField({value}) {
    const markAsDefaultLabel = I18n.t(this.options.attributeTranslationKeyPrefixes +
                                      '.transition.mark_as_default_transition',
                                      {name: this.transitionDisplayName(value)});

    return `
      <label class='${styles.defaultTransition}'
             for='defaultTransition-${value}'>
        <input type='radio'
               id='defaultTransition-${value}'
               name='defaultTransition'
               value='${value}' aria-label="${markAsDefaultLabel}" />
        <div class='${styles.defaultTransitionIcons}'>
          <div class='${styles.defaultTransitionIcon}'
               title="${I18n.t(this.options.attributeTranslationKeyPrefixes +
                               '.transition.default_transition',
                               {name: this.transitionDisplayName(value)})}" />
          <div class='${styles.markAsDefaultTransitionIcon}'
               title="${markAsDefaultLabel}" />
    </div>
    </label>
    `;
  },

  transitionDisplayName(value) {
    return I18n.t(this.options.attributeTranslationKeyPrefixes +
                  '.transition.values.' + value);
  },

  transitionVariantDisplayName(value) {
    return I18n.t(this.options.attributeTranslationKeyPrefixes +
                  '.transition.variants.' + value);
  }
});
