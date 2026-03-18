import {Style} from 'editor/models/Style';

import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {features} from 'pageflow/frontend';
import {normalizeSeed} from 'support';

describe('Style', () => {
  const exampleTypes = {
    blur: {
      minValue: 0,
      maxValue: 100,
      defaultValue: 50,
      kind: 'filter',
      inputType: 'slider'
    },
    frame: {
      kind: 'decoration',
      inputType: 'color',
      defaultValue: '#ffffff'
    }
  };

  useFakeTranslations({
    'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur',
    'pageflow_scrolled.editor.content_element_style_list_input.boxShadow': 'Box shadow',
    'pageflow_scrolled.editor.content_element_style_list_input.outlineColor': 'Outline'
  });

  it('has label based on translation', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.label()).toEqual('Blur');
  });

  it('can use label from type', () => {
    const style = new Style({name: 'aspectRatio-square'}, {
      types: {
        'aspectRatio-square': {
          kind: 'aspectRatio',
          key: 'aspectRatio',
          defaultValue: 'square',
          label: 'Square'
        }
      }
    });

    expect(style.label()).toEqual('Square');
  });

  it('has min and max values', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.minValue()).toEqual(0);
    expect(style.maxValue()).toEqual(100);
  });

  it('sets default value', () => {
    const style = new Style({name: 'blur'}, {types: exampleTypes});

    expect(style.get('value')).toEqual(50);
  });

  it('defaults to none inputType', () => {
    const style = new Style({name: 'blur'}, {
      types: {
        blur: {
          defaultValue: 50,
          kind: 'filter'
        }
      }
    });

    expect(style.inputType()).toEqual('none');
  });

  it('supports colors inputType', () => {
    const style = new Style({name: 'frame'}, {types: exampleTypes});

    expect(style.inputType()).toEqual('color');
  });

  describe('.getEffectTypes', () => {
    beforeEach(() => features.enabledFeatureNames = []);

    it('includes filter and animation effects', () => {
      const types = Style.getEffectTypes();

      expect(types).toHaveProperty('blur');
      expect(types).toHaveProperty('autoZoom');
      expect(types.blur.kind).toEqual('filter');
      expect(types.autoZoom.kind).toEqual('animation');
    });

    it('excludes decoration effects by default', () => {
      const types = Style.getEffectTypes();

      expect(types).not.toHaveProperty('frame');
    });

    it('includes decoration effects when feature is enabled', () => {
      features.enable('frontend', ['decoration_effects']);

      const types = Style.getEffectTypes();

      expect(types).toHaveProperty('frame');
      expect(types.frame.kind).toEqual('decoration');
    });
  });

  describe('.getTypesForContentElement', () => {
    it('returns empty object when no margin scale is defined', () => {
      editor.contentElementTypes.register('textBlock', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'textBlock'}
            ]
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).toEqual({});
    });

    it('returns margin types based on content element margin scale', () => {
      editor.contentElementTypes.register('textBlock', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'textBlock'}
            ],
            themeOptions: {
              properties: {
                root: {
                  'contentElementMargin-sm': '0.5rem',
                  'contentElementMargin-md': '1rem',
                  'contentElementMargin-lg': '1.5rem'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementMargin: {
                  sm: 'Small',
                  md: 'Medium',
                  lg: 'Large'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).toMatchObject({
        marginTop: {
          kind: 'spacing',
          inputType: 'slider',
          values: ['sm', 'md', 'lg'],
          texts: ['Small', 'Medium', 'Large']
        },
        marginBottom: {
          kind: 'spacing',
          inputType: 'slider',
          values: ['sm', 'md', 'lg'],
          texts: ['Small', 'Medium', 'Large']
        }
      });
    });
    it('sets resetValue from content element defaultConfig', () => {
      editor.contentElementTypes.register('heading', {
        defaultConfig: {marginTop: 'none'}
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'heading'}
            ],
            themeOptions: {
              properties: {
                root: {
                  'contentElementMargin-sm': '0.5rem',
                  'contentElementMargin-md': '1rem',
                  'contentElementMargin-lg': '1.5rem'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementMargin: {
                  sm: 'Small',
                  md: 'Medium',
                  lg: 'Large'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result.marginTop.resetValue).toEqual('none');
      expect(result.marginBottom).not.toHaveProperty('resetValue');
    });

    it('includes default value from margin scale', () => {
      editor.contentElementTypes.register('textBlock', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'textBlock'}
            ],
            themeOptions: {
              properties: {
                root: {
                  'contentElementMargin-sm': '0.5rem',
                  'contentElementMargin-md': '1rem',
                  'contentElementMargin-lg': '1.5rem',
                  'contentElementMarginStyleDefault': '0.5rem'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementMargin: {
                  sm: 'Small',
                  md: 'Medium',
                  lg: 'Large'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result.marginTop.defaultValue).toEqual('sm');
      expect(result.marginBottom.defaultValue).toEqual('sm');
    });

    it('returns boxShadow type when supportedStyles includes boxShadow and scale is defined', () => {
      editor.contentElementTypes.register('inlineImage', {
        supportedStyles: ['boxShadow']
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'inlineImage'}
            ],
            themeOptions: {
              properties: {
                root: {
                  'contentElementBoxShadow-sm': '0 1px 3px rgba(0,0,0,0.12)',
                  'contentElementBoxShadow-md': '0 4px 6px rgba(0,0,0,0.1)',
                  'contentElementBoxShadow-lg': '0 10px 15px rgba(0,0,0,0.1)'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementBoxShadow: {
                  sm: 'Small',
                  md: 'Medium',
                  lg: 'Large'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).toMatchObject({
        boxShadow: {
          kind: 'decoration',
          inputType: 'slider',
          propertyName: 'boxShadow',
          values: ['sm', 'md', 'lg'],
          texts: ['Small', 'Medium', 'Large']
        }
      });
    });

    it('does not return boxShadow when type does not have supportedStyles', () => {
      editor.contentElementTypes.register('textBlock', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'textBlock'}
            ],
            themeOptions: {
              properties: {
                root: {
                  'contentElementBoxShadow-sm': '0 1px 3px rgba(0,0,0,0.12)',
                  'contentElementBoxShadow-md': '0 4px 6px rgba(0,0,0,0.1)'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementBoxShadow: {
                  sm: 'Small',
                  md: 'Medium'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).not.toHaveProperty('boxShadow');
    });

    it('does not return boxShadow when no scale is defined', () => {
      editor.contentElementTypes.register('inlineImage', {
        supportedStyles: ['boxShadow']
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).not.toHaveProperty('boxShadow');
    });

    it('returns outlineColor type when supportedStyles includes outline', () => {
      editor.contentElementTypes.register('inlineImage', {
        supportedStyles: ['outline']
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'inlineImage'}
            ]
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).toMatchObject({
        outlineColor: {
          kind: 'decoration',
          inputType: 'color',
          propertyName: 'outlineColor'
        }
      });
    });

    it('uses outlineColor theme property as default for outlineColor', () => {
      editor.contentElementTypes.register('inlineImage', {
        supportedStyles: ['outline']
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'inlineImage'}
            ],
            themeOptions: {
              properties: {
                root: {
                  outlineColor: '#cc0000'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result.outlineColor.defaultValue).toEqual('#cc0000');
    });

    it('includes used outline colors as swatches in outlineColor inputOptions', () => {
      editor.contentElementTypes.register('inlineImage', {
        supportedStyles: ['outline']
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'inlineImage', configuration: {outlineColor: '#ff0000'}},
              {id: 2, typeName: 'inlineImage', configuration: {outlineColor: '#00ff00'}},
              {id: 3, typeName: 'inlineImage'}
            ]
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result.outlineColor.inputOptions.swatches).toEqual(
        expect.arrayContaining(['#ff0000', '#00ff00'])
      );
    });

    it('passes binding condition from supportedStyles object to type definition', () => {
      const whenFn = posterId => !!posterId;

      editor.contentElementTypes.register('inlineAudio', {
        supportedStyles: [
          {name: 'boxShadow', binding: 'posterId', when: whenFn}
        ]
      });

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'inlineAudio'}
            ],
            themeOptions: {
              properties: {
                root: {
                  'contentElementBoxShadow-sm': '0 1px 3px rgba(0,0,0,0.12)',
                  'contentElementBoxShadow-md': '0 4px 6px rgba(0,0,0,0.1)'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementBoxShadow: {
                  sm: 'Small',
                  md: 'Medium'
                }
              }
            }
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result.boxShadow.binding).toEqual('posterId');
      expect(result.boxShadow.when).toBe(whenFn);
    });

    it('does not return outlineColor when type does not have supportedStyles', () => {
      editor.contentElementTypes.register('textBlock', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 1, typeName: 'textBlock'}
            ]
          })
        }
      );

      const contentElement = entry.contentElements.get(1);
      const result = Style.getTypesForContentElement({entry, contentElement});

      expect(result).not.toHaveProperty('outlineColor');
    });
  });

  describe('.getImageModifierTypes', () => {
    const commonPrefix = 'pageflow_scrolled.editor.aspect_ratios';
    const themePrefix = `pageflow_scrolled.editor.themes.custom.aspect_ratios`;

    useFakeTranslations({
      [`${commonPrefix}.square`]: 'Square (1:1)',
      [`${themePrefix}.4to5`]: 'Custom (4:5)',
      'pageflow_scrolled.editor.backdrop_effects.rounded.label': 'Rounded corners',
      'pageflow_scrolled.editor.scales.contentElementBoxBorderRadius.none': 'None',
      'pageflow_scrolled.editor.scales.contentElementBoxBorderRadius.sm': 'Small',
      'pageflow_scrolled.editor.scales.contentElementBoxBorderRadius.md': 'Medium',
      'pageflow_scrolled.editor.scales.contentElementBoxBorderRadius.lg': 'Large',
      'pageflow_scrolled.editor.common.default_suffix': ' (Default)',
      'pageflow_scrolled.editor.crop_types.circle': 'Circle'
    });

    it('includes styles for theme aspect ratios', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {
          metadata: {theme_name: 'custom'}
        },
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  aspectRatio4to5: '0.8'
                }
              }
            }
          })
        }
      );

      const result = Style.getImageModifierTypes({entry});

      expect(result).toMatchObject({
        'crop': {
          items: expect.arrayContaining([
            {
              value: '4to5',
              label: 'Custom (4:5)'
            },
            {
              value: 'square',
              label: 'Square (1:1)'
            }
          ])
        }
      })
    });

    it('includes rounded modifier with theme border radius scale', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  'contentElementBoxBorderRadius-sm': '4px',
                  'contentElementBoxBorderRadius-md': '8px'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementBoxBorderRadius: {
                  sm: 'Small',
                  md: 'Medium'
                }
              }
            }
          })
        }
      );

      const result = Style.getImageModifierTypes({entry});

      expect(result).toMatchObject({
        'rounded': {
          items: expect.arrayContaining([
            {
              value: 'sm',
              label: 'Small'
            },
            {
              value: 'md',
              label: 'Medium'
            }
          ])
        }
      })
    });

    it('includes none option and disables matching item when theme has default border radius', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  'contentElementBoxBorderRadius': '8px',
                  'contentElementBoxBorderRadius-sm': '4px',
                  'contentElementBoxBorderRadius-md': '8px',
                  'contentElementBoxBorderRadius-lg': '16px'
                }
              }
            },
            themeTranslations: {
              scales: {
                contentElementBoxBorderRadius: {
                  none: 'None',
                  sm: 'Small',
                  md: 'Medium',
                  lg: 'Large'
                }
              }
            }
          })
        }
      );

      const result = Style.getImageModifierTypes({entry});

      expect(result).toMatchObject({
        'rounded': {
          items: [
            {
              value: 'none',
              label: 'None'
            },
            {
              value: 'sm',
              label: 'Small'
            },
            {
              value: 'md',
              label: 'Medium',
              default: true
            },
            {
              value: 'lg',
              label: 'Large'
            }
          ]
        }
      });
    });

    it('includes circle crop option as last item', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {
          metadata: {theme_name: 'custom'}
        },
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  aspectRatioSquare: '1'
                }
              }
            }
          })
        }
      );

      const result = Style.getImageModifierTypes({entry});
      const cropItems = result.crop.items;
      const lastItem = cropItems[cropItems.length - 1];

      expect(lastItem).toMatchObject({
        value: 'circle',
        label: 'Circle'
      });
    });
  });
});
