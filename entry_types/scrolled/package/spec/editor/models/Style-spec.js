import {Style} from 'editor/models/Style';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
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
    'pageflow_scrolled.editor.backdrop_effects.blur.label': 'Blur'
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
