import Backbone from 'backbone';
import I18n from 'i18n-js';

const TYPES = {
  blur: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50
  },
  brightness: {
    minValue: -100,
    maxValue: 100,
    defaultValue: -20
  },
  contrast: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20
  },
  grayscale: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100
  },
  saturate: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20
  },
  sepia: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100
  },
  zoom: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 20
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
}
