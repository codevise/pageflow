import Backbone from 'backbone';
import I18n from 'i18n-js';

const TYPES = {
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
  }
}

export const Effect = Backbone.Model.extend({
  initialize({name}) {
    if (!this.has('value')) {
      this.set('value', TYPES[name].defaultValue);
    }
  },

  label() {
    return Effect.getLabel(this.get('name'));
  },

  minValue() {
    return TYPES[this.get('name')].minValue;
  },

  maxValue() {
    return TYPES[this.get('name')].maxValue;
  }
});

Effect.names = Object.keys(TYPES);

Effect.getLabel = function(name) {
  return I18n.t(`pageflow_scrolled.editor.backdrop_effects.${name}.label`);
};

Effect.getKind = function(name) {
  return TYPES[name].kind;
};
