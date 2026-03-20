import Backbone from 'backbone';
import I18n from 'i18n-js';
import {attributeBindingUtils} from 'pageflow/ui';
import {Style} from '../models/Style';

export const StylesCollection = Backbone.Collection.extend({
  model: Style,

  initialize(models, options = {}) {
    this.types = options.types || {};
    this.bindingModel = options.bindingModel;
  },

  getUnusedStyles() {
    const unusedStyles = new Backbone.Collection(
      Object
        .keys(this.types)
        .map(name => ({name})),
      {
        comparator: style => Object.keys(this.types).indexOf(style.get('name')),
        styles: this,
        bindingModel: this.bindingModel,
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
  initialize({name}, {styles, bindingModel}) {
    const type = styles.types[name];
    const {items} = type;

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
        styles.add({name: this.get('name')}, {types: styles.types, bindingModel: styles.bindingModel});
      }
    }

    const updateHidden = () => {
      const inUse = !!styles.findWhere({name: this.get('name')}) && !items;
      this.set({hidden: inUse || !this.get('available')});
    };

    this.listenTo(styles, 'add remove', updateHidden);

    if (type.binding && bindingModel) {
      attributeBindingUtils.setup({
        binding: type.binding,
        model: bindingModel,
        listener: this,
        option: type.when,
        callback: available => {
          this.set({available});
          updateHidden();
        }
      });
    }
    else {
      this.set({available: true});
    }

    updateHidden();
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
    this._removeIncompatibleStyles();
    this.styles.add({name: this.styleName, value: this.get(('value'))}, {types: this.styles.types, bindingModel: this.styles.bindingModel});
  },

  _removeIncompatibleStyles() {
    const incompatibleWith = this.get('incompatibleWith') ;

    if (incompatibleWith) {
      incompatibleWith.forEach(incompatibleStyleName => {
        const incompatibleStyle = this.styles.findWhere({name: incompatibleStyleName});
        if (incompatibleStyle) {
          this.styles.remove(incompatibleStyle);
        }
      });
    }

    this.styles.each(style => {
      const styleType = this.styles.types[style.get('name')];

      if (styleType?.items) {
        const currentItem = styleType.items.find(item => item.value === style.get('value'));

        if (currentItem?.incompatibleWith?.includes(this.styleName)) {
          this.styles.remove(style);
        }
      }
    });
  }
});
