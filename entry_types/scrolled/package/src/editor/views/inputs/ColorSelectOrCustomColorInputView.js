import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import styles from './ColorSelectOrCustomColorInputView.module.css';

import {ColorSelectInputView} from './ColorSelectInputView';
import {ColorInputView, inputView} from 'pageflow/ui';

export const ColorSelectOrCustomColorInputView = Marionette.View.extend({
  mixins: [inputView],

  className: styles.container,

  initialize() {
    const value = this.model.get(this.options.propertyName);

    this.viewModel = new Backbone.Model(
      value?.startsWith('#') ?
      {value: 'custom', color: value} :
      {value}
    );

    this.listenTo(this.viewModel, `change:value`, (model, value) => {
      if (value === 'custom') {
        this.model.set(this.options.propertyName, model.get('color'));
      }
      else {
        this.model.set(this.options.propertyName, value);
      }

      this.updateCustomColorInputView();
    });

    this.listenTo(this.viewModel, `change:color`, (model, color) => {
      if (model.get('value') === 'custom') {
        this.model.set(this.options.propertyName, color);
      }
    });
  },

  render() {
    this.colorSelectInputView = new ColorSelectInputView({
      ...this.options,
      label: this.labelText(),
      model: this.viewModel,
      propertyName: 'value',
      values: [
        ...this.options.values,
        'custom'
      ],
      texts: [
        ...this.options.texts,
        I18n.t(this.options.customColorTranslationKey)
      ]
    })

    this.appendSubview(this.colorSelectInputView);
    this.updateCustomColorInputView();

    return this;
  },

  updateCustomColorInputView() {
    const customColor = this.viewModel.get('value') === 'custom';

    if (customColor && !this.colorInputView) {
      this.colorInputView = new ColorInputView({
        model: this.viewModel,
        propertyName: 'color'
      });

      this.appendSubview(this.colorInputView);
    }
    else if (!customColor && this.colorInputView) {
      this.colorInputView.close();
      this.colorInputView = null;
    }
  }
});
