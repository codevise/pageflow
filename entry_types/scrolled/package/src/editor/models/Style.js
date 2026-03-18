import Backbone from 'backbone';
import I18n from 'i18n-js';
import {features} from 'pageflow/frontend';

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

  values() {
    return this.types[this.get('name')].values;
  },

  texts() {
    return this.types[this.get('name')].texts;
  },

  propertyName() {
    return this.types[this.get('name')].propertyName;
  },

  inputType() {
    return this.types[this.get('name')].inputType || 'none';
  },

  inputOptions() {
    return this.types[this.get('name')].inputOptions || {};
  }
});

Style.getLabel = function(name, types) {
  return types[name].label ||
         I18n.t(`pageflow_scrolled.editor.backdrop_effects.${name}.label`);
};

Style.getKind = function(name, types) {
  return types[name].kind;
};

const allEffectTypes = {
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

Style.getEffectTypes = function() {
  if (features.isEnabled('decoration_effects')) {
    return allEffectTypes;
  }

  return Object.fromEntries(
    Object.entries(allEffectTypes).filter(
      ([, type]) => type.kind !== 'decoration'
    )
  );
};

Style.getTypesForContentElement = function({entry, contentElement}) {
  const marginScale = entry.getScale('contentElementMargin');
  const defaultConfig = contentElement.getType().defaultConfig || {};
  const result = {};

  const supportedStyles = contentElement.getType().supportedStyles || [];

  if (marginScale.values.length > 0) {
    result.marginTop = {
      kind: 'spacing',
      label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.marginTop'),
      propertyName: 'marginTop',
      inputType: 'slider',
      values: marginScale.values,
      texts: marginScale.texts,
      defaultValue: marginScale.defaultValue,
      ...('marginTop' in defaultConfig && {resetValue: defaultConfig.marginTop})
    };

    result.marginBottom = {
      kind: 'spacing',
      label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.marginBottom'),
      propertyName: 'marginBottom',
      inputType: 'slider',
      values: marginScale.values,
      texts: marginScale.texts,
      defaultValue: marginScale.defaultValue,
      ...('marginBottom' in defaultConfig && {resetValue: defaultConfig.marginBottom})
    };
  }

  if (supportedStyles.includes('boxShadow')) {
    const boxShadowScale = entry.getScale('contentElementBoxShadow');

    if (boxShadowScale.values.length > 0) {
      result.boxShadow = {
        kind: 'decoration',
        label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.boxShadow'),
        propertyName: 'boxShadow',
        inputType: 'slider',
        values: boxShadowScale.values,
        texts: boxShadowScale.texts,
        defaultValue: boxShadowScale.defaultValue
      };
    }
  }

  if (supportedStyles.includes('outline')) {
    const themeProperties = entry.getThemeProperties();

    result.outlineColor = {
      kind: 'decoration',
      label: I18n.t('pageflow_scrolled.editor.content_element_style_list_input.outlineColor'),
      propertyName: 'outlineColor',
      inputType: 'color',
      defaultValue: themeProperties.root?.outlineColor,
      inputOptions: {
        alpha: true,
        swatches: entry.getUsedContentElementColors('outlineColor')
      }
    };
  }

  return result;
}

Style.getImageModifierTypes = function({entry}) {
  const [values, labels] = entry.getAspectRatios();
  const borderRadiusScale = entry.getScale('contentElementBoxBorderRadius');

  const result = {
    crop: {
      items: [
        ...values.map((value, index) => (
          {
            label: labels[index],
            value
          }
        )),
        {
          label: I18n.t('pageflow_scrolled.editor.crop_types.circle'),
          value: 'circle',
          incompatibleWith: ['rounded']
        }
      ]
    }
  };

  if (borderRadiusScale.values.length > 0) {
    const items = borderRadiusScale.values.map((value, index) => {
      const item = {
        label: borderRadiusScale.texts[index],
        value
      };

      if (borderRadiusScale.defaultValue === value) {
        item.default = true;
      }

      return item;
    });

    if (borderRadiusScale.defaultValue) {
      const noneLabel = I18n.t('pageflow_scrolled.editor.scales.contentElementBoxBorderRadius.none');

      items.unshift({
        label: noneLabel,
        value: 'none',
        disabled: false
      });
    }

    result.rounded = { items };
  }

  return result;
}
