import Backbone from 'backbone';
import I18n from 'i18n-js';
import {features} from 'pageflow/frontend';
import {Style} from '../models/Style';

export const StylesCollection = Backbone.Collection.extend({
  model: Style,

  initialize(models, options = {}) {
    this.types = options.types || {};
  },

  getUnusedStyles() {
    const unusedStyles = new Backbone.Collection(
      Object
        .entries(this.types)
        .filter(
          ([name, styleType]) => (
            features.isEnabled('decoration_effects') ||
            Style.getKind(name, this.types) !== 'decoration'
          )
        )
        .map(([name]) => ({name})),
      {
        comparator: style => Object.keys(this.types).indexOf(style.get('name')),
        styles: this,
        model: UnusedStyle
      }
    );

    this.listenTo(unusedStyles, 'change:hidden', () =>
      updateSeparation(unusedStyles, this.types)
    );

    updateSeparation(unusedStyles, this.types);

    return unusedStyles;
  }
});

function updateSeparation(styles, types) {
  styles.where({hidden: false}).reduce((previous, style) => {
    style.set('separated',
               previous &&
               Style.getKind(style.get('name'), types) !== Style.getKind(previous.get('name'), types));
    return style;
  }, null);
}

const UnusedStyle = Backbone.Model.extend({
  initialize({name}, {styles}) {
    const {items} = styles.types[name];

    this.set('label', Style.getLabel(name, styles.types));

    if (items) {
      this.set('items', new Backbone.Collection(items, {
        model: UnusedStyleItem,
        styles,
        styleName: name,
      }));
    }
    else {
      this.selected = () => {
        styles.add({name: this.get('name')}, {types: styles.types});
      }
    }

    const update = () => {
      this.set({
        hidden: !!styles.findWhere({name: this.get('name')}) && !items
      });
    };

    this.listenTo(styles, 'add remove', update);
    update();
  }
});

const UnusedStyleItem = Backbone.Model.extend({
  initialize(attributes, {styles, styleName}) {
    this.styles = styles;
    this.styleName = styleName;
    this.isDefault = !!attributes.default;

    this._setLabelWithSuffix(attributes);
    this._setupDisabledStateTracking();
  },

  _setLabelWithSuffix(attributes) {
    let label = attributes.label;
    if (this.isDefault) {
      const defaultSuffix = I18n.t('pageflow_scrolled.editor.common.default_suffix');
      label = label + defaultSuffix;
    }
    this.set('label', label);
  },

  _setupDisabledStateTracking() {
    const update = () => {
      const disabled = this._calculateDisabledState();
      this.set({ disabled });
    };

    this.listenTo(this.styles, 'add remove', update);
    update();
  },

  _calculateDisabledState() {
    const currentStyle = this.styles.findWhere({name: this.styleName});
    const isCurrentlySelected = currentStyle?.get('value') === this.get('value');

    if (this.isDefault) {
      return !currentStyle;
    } else {
      return isCurrentlySelected;
    }
  },

  selected() {
    const currentStyle = this.styles.findWhere({name: this.styleName});

    if (this._shouldResetToDefault(currentStyle)) {
      this._resetToDefault(currentStyle);
    } else {
      this._applyStyle(currentStyle);
    }
  },

  _shouldResetToDefault(currentStyle) {
    return this.isDefault && currentStyle;
  },

  _resetToDefault(currentStyle) {
    this.styles.remove(currentStyle);
  },

  _applyStyle(currentStyle) {
    this.styles.remove(currentStyle);
    this.styles.add({name: this.styleName, value: this.get(('value'))}, {types: this.styles.types});
  }
});
