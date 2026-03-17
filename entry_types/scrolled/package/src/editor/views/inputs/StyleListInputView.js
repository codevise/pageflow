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
      this.readFromModel(),
      {types: this.options.types}
    );

    this.listenTo(this.styles, 'add remove change', () => {
      this.saveToModel();
    });
  },

  readFromModel() {
    const serialized = this.model.get(this.options.propertyName) || [];

    const fromProperties = Object.entries(this.options.types)
      .filter(([, type]) => {
        if (!type.propertyName || !this.model.has(type.propertyName)) {
          return false;
        }

        return !type.values || type.values.includes(this.model.get(type.propertyName));
      })
      .map(([name, type]) => ({name, value: this.model.get(type.propertyName)}));

    return [...serialized, ...fromProperties];
  },

  saveToModel() {
    const serialized = [];
    const setProperties = new Set();

    this.styles.each(style => {
      const propertyName = style.propertyName();

      if (propertyName) {
        this.model.set(propertyName, style.get('value'));
        setProperties.add(propertyName);
      }
      else {
        serialized.push(style.toJSON());
      }
    });

    Object.values(this.options.types).forEach(type => {
      if (type.propertyName && !setProperties.has(type.propertyName)) {
        if ('resetValue' in type) {
          this.model.set(type.propertyName, type.resetValue);
        }
        else {
          this.model.unset(type.propertyName);
        }
      }
    });

    this.model.set(this.options.propertyName, serialized);
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
      this.$el.toggleClass(styles.allUsed,
                           unusedStyles.where({hidden: false}).length === 0);

    update();
    this.listenTo(unusedStyles, 'change:hidden', update);
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

    'slide widget': function(event, ui) {
      const values = this.model.values();

      if (values) {
        this.ui.value.text(this.model.texts()[ui.value]);
        this.model.set('value', values[ui.value]);
      }
    },

    'slidechange widget': function() {
      if (!this.model.values()) {
        const value = this.ui.widget.slider('option', 'value');

        this.ui.value.text(value);
        this.model.set('value', value);
      }
    }
  }),

  onRender() {
    this.$el.addClass(styles[`input-${this.model.inputType()}`]);

    const values = this.model.values();

    if (values) {
      this.ui.widget.slider({
        animate: 'fast',
        min: 0,
        max: values.length - 1
      });

      const storedValue = this.model.get('value') || this.model.defaultValue();
      const index = values.indexOf(storedValue);

      this.ui.widget.slider('option', 'value', index);
      this.ui.value.text(this.model.texts()[index]);
    }
    else {
      this.ui.widget.toggleClass(styles.centerZero, this.model.minValue() < 0);

      this.ui.widget.slider({
        animate: 'fast',
        min: this.model.minValue(),
        max: this.model.maxValue()
      });

      this.ui.widget.slider('option', 'value', this.model.get('value') || 50);
    }

    const colorInput = this.ui.colorInput[0];

    if (colorInput) {
      colorInput.value = this.model.get('value') || this.model.defaultValue() || '';

      this._colorPicker = new ColorPicker(colorInput, {
        defaultValue: this.model.defaultValue(),
        ...this.model.inputOptions(),
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
