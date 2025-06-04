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
    const name = this.get('name');
    const label = Style.getLabel(name, this.types);
    const item = this.types[name].items?.find(item => item.value === this.get('value'));

    if (item) {
      return `${label}: ${item.label}`;
    }
    else {
      return label;
    }
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
    return this.types[this.get('name')].inputType || 'none';
  }
});

Style.getLabel = function(name, types) {
  return types[name].label ||
         I18n.t(`pageflow_scrolled.editor.backdrop_effects.${name}.label`);
};

Style.getKind = function(name, types) {
  return types[name].kind;
};

Style.effectTypes = {
  blur: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'filter'
  },
  brightness: {
    inputType: 'slider',
    minValue: -100,
    maxValue: 100,
    defaultValue: -20,
    kind: 'filter'
  },
  contrast: {
    inputType: 'slider',
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  grayscale: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  saturate: {
    inputType: 'slider',
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  sepia: {
    inputType: 'slider',
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  autoZoom: {
    inputType: 'slider',
    minValue: 1,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  scrollParallax: {
    inputType: 'slider',
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

Style.getImageModifierTypes = function({entry}) {
  const [values, labels] = entry.getAspectRatios();

  return {
    crop: {
      items: values.map((value, index) => (
        {
          label: labels[index],
          value
        }
      ))
    }
  };
}
