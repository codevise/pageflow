import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import 'jquery-ui';

import {CollectionView, cssModulesUtils, inputView} from 'pageflow/ui';
import {DropDownButtonView} from 'pageflow/editor';

import {StylesCollection} from '../../collections/StylesCollection';

import styles from './StyleListInputView.module.css';

export const StyleListInputView = Marionette.ItemView.extend({
  className: styles.view,
  template: () => '',

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
    this.ui.widget.toggleClass(styles.centerZero, this.model.minValue() < 0);

    this.ui.widget.slider({
      animate: 'fast',
      min: this.model.minValue(),
      max: this.model.maxValue()
    });

    this.ui.widget.slider('option', 'value', this.model.get('value') || 50);

    this.ui.colorInput.minicolors({
      defaultValue: this.model.defaultValue(),
      position: 'bottom right',
      changeDelay: 200,
      change: color => {
        this.model.set('value', color);
      }
    });

    this.ui.colorInput.minicolors('value', this.model.get('value'));
  }
});

function renderInput(inputType) {
  if (inputType === 'color') {
    return `<input class="${styles.colorInput}" />`;
  } else {
    return `<div class="${styles.value}"></div>
            <div class="${styles.widget}"></div>`;
  }
}
