import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import 'jquery-ui';

import {CollectionView, cssModulesUtils, inputView} from 'pageflow/ui';
import {DropDownButtonView} from 'pageflow/editor';

import {EffectsCollection} from '../../collections/EffectsCollection';

import styles from './EffectListInputView.module.css';

export const EffectListInputView = Marionette.View.extend({
  className: styles.view,

  mixins: [inputView],

  initialize() {
    this.effects = new EffectsCollection(
      this.model.get(this.options.propertyName)
    );

    this.listenTo(this.effects, 'add remove change', () => {
      this.model.set(this.options.propertyName, this.effects.toJSON());
    });
  },

  render() {
    this.appendSubview(new CollectionView({
      itemViewConstructor: EffectListItemView,
      itemViewOptions: {effects: this.effects},
      collection: this.effects
    }));

    const unusedEffects = this.effects.getUnusedEffects();

    this.appendSubview(new DropDownButtonView({
      label: I18n.t('pageflow_scrolled.editor.effect_list_input.add'),
      fullWidth: true,
      openOnClick: true,
      items: unusedEffects
    }));

    const update = () =>
      this.$el.toggleClass(styles.allUsed, unusedEffects.length === 0);

    update();
    this.listenTo(unusedEffects, 'add remove', update);

    this.setupAttributeBinding('visible', this.updateVisible);

    return this;
  }
});

const EffectListItemView = Marionette.ItemView.extend({
  className: styles.item,

  template: (data) => `
    <div class="${styles.label}">${data.label}</div>
    <div class="${styles.value}"></div>
    <div class="${styles.widget}"></div>
    <button class="${styles.remove}"
            title="${I18n.t('pageflow_scrolled.editor.effect_list_input.remove')}">
    </button>
  `,

  serializeData() {
    return {
      label: this.model.label()
    };
  },

  ui: cssModulesUtils.ui(styles, 'widget', 'value'),

  events: cssModulesUtils.events(styles, {
    'click remove': function() {
      this.options.effects.remove(this.model);
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
  }
});
