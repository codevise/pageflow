import Backbone from 'backbone';
import I18n from 'i18n-js';

export const Style = Backbone.Model.extend({
  initialize({name}, {types}) {
    this.types = types;

    if (!this.has('value')) {
      this.set('value', this.defaultValue());
    }
  },

  label() {
    return Style.getLabel(this.get('name'), this.types);
  },

  defaultValue() {
    return this.types[this.get('name')].defaultValue;
  },

  minValue() {
    return this.types[this.get('name')].minValue;
  },

  maxValue() {
    return this.types[this.get('name')].maxValue;
  },

  inputType() {
    return this.types[this.get('name')].inputType || 'slider';
  }
});

Style.getLabel = function(name, types) {
  return I18n.t(`pageflow_scrolled.editor.backdrop_effects.${name}.label`);
};

Style.getKind = function(name, types) {
  return types[name].kind;
};

Style.effectTypes = {
  blur: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'filter'
  },
  brightness: {
    minValue: -100,
    maxValue: 100,
    defaultValue: -20,
    kind: 'filter'
  },
  contrast: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  grayscale: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  saturate: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  sepia: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  autoZoom: {
    minValue: 1,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  scrollParallax: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  frame: {
    kind: 'decoration',
    inputType: 'color',
    defaultValue: '#ffffff'
  }
};
