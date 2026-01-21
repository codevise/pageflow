import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import 'jquery-ui';

import {CollectionView, ColorPicker, cssModulesUtils, inputView} from 'pageflow/ui';
import {DropDownButtonView} from 'pageflow/editor';

import {StylesCollection} from '../../collections/StylesCollection';

import styles from './StyleListInputView.module.css';

export const StyleListInputView = Marionette.ItemView.extend({
  className: styles.view,
  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>`,

  mixins: [inputView],

  initialize() {
    this.styles = new StylesCollection(
      this.model.get(this.options.propertyName),
      {types: this.options.types}
    );

    this.listenTo(this.styles, 'add remove change', () => {
      this.model.set(this.options.propertyName, this.styles.toJSON());
    });
  },

  onRender() {
    if (this.options.hideLabel) {
      this.$el.addClass(styles.negativeMarginTop);
    }

    this.appendSubview(new CollectionView({
      itemViewConstructor: StyleListItemView,
      itemViewOptions: {
        styles: this.styles,
        translationKeyPrefix: this.options.translationKeyPrefix
      },
      collection: this.styles
    }));

    const unusedStyles = this.styles.getUnusedStyles();

    this.appendSubview(new DropDownButtonView({
      label: I18n.t(`${this.options.translationKeyPrefix}.add`),
      fullWidth: true,
      openOnClick: true,
      items: unusedStyles
    }));

    const update = () =>
      this.$el.toggleClass(styles.allUsed, unusedStyles.length === 0);

    update();
    this.listenTo(unusedStyles, 'add remove', update);
  }
});

const StyleListItemView = Marionette.ItemView.extend({
  className: styles.item,

  template: (data) => `
    <div class="${styles.label}">${data.label}</div>
    ${renderInput(data.inputType)}
    <button class="${styles.remove}"
            title="${data.removeButtonTitle}">
    </button>
            `,

  serializeData() {
    return {
      label: this.model.label(),
      inputType: this.model.inputType(),
      removeButtonTitle: I18n.t(`${this.options.translationKeyPrefix}.remove`)
    };
  },

  ui: cssModulesUtils.ui(styles, 'widget', 'value', 'colorInput'),

  events: cssModulesUtils.events(styles, {
    'click remove': function() {
      this.options.styles.remove(this.model);
    },

    'slidechange widget': function() {
      const value = this.ui.widget.slider('option', 'value');

      this.ui.value.text(value);
      this.model.set('value', value);
    }
  }),

  onRender() {
    this.$el.addClass(styles[`input-${this.model.inputType()}`]);
    this.ui.widget.toggleClass(styles.centerZero, this.model.minValue() < 0);

    this.ui.widget.slider({
      animate: 'fast',
      min: this.model.minValue(),
      max: this.model.maxValue()
    });

    this.ui.widget.slider('option', 'value', this.model.get('value') || 50);

    const colorInput = this.ui.colorInput[0];

    if (colorInput) {
      colorInput.value = this.model.get('value') || this.model.defaultValue() || '';

      this._colorPicker = new ColorPicker(colorInput, {
        defaultValue: this.model.defaultValue(),
        onChange: (color) => {
          this.model.set('value', color || '');
        }
      });
    }
  },

  onBeforeClose() {
    if (this._colorPicker) {
      this._colorPicker.destroy();
    }
  }
});

function renderInput(inputType) {
  if (inputType === 'color') {
    return `<input class="${styles.colorInput}" />`;
  }
  else if (inputType === 'slider') {
    return `<div class="${styles.value}"></div>
            <div class="${styles.widget}"></div>`;
  }
  else {
    return '';
  }
}
