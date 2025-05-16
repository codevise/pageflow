import Backbone from 'backbone';
import I18n from 'i18n-js';

export const Effect = Backbone.Model.extend({
  initialize({name}, options = {}) {
    this.types = options.types || {};

    if (!this.has('value')) {
      this.set('value', this.defaultValue());
    }
  },

  label() {
    return Effect.getLabel(this.get('name'), this.types);
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

Effect.getLabel = function(name, types) {
  return I18n.t(`pageflow_scrolled.editor.backdrop_effects.${name}.label`);
};

Effect.getKind = function(name, types) {
  return types[name].kind;
};
