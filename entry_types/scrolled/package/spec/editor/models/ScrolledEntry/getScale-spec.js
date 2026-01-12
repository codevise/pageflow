import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getScale', () => {
    it('returns scale with empty values by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const scale = entry.getScale('contentElementMargin');

      expect(scale.values).toEqual([]);
      expect(scale.texts).toEqual([]);
    });

    it('returns scale with values and texts based on theme custom properties', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
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

      const scale = entry.getScale('contentElementMargin');

      expect(scale.values).toEqual(['sm', 'md', 'lg']);
      expect(scale.texts).toEqual(['Small', 'Medium', 'Large']);
    });

    describe('defaultValue', () => {
      it('is undefined when no default is set', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    'sectionPaddingTop-sm': '10vh',
                    'sectionPaddingTop-md': '20vh',
                    'sectionPaddingTop-lg': '30vh'
                  }
                }
              }
            })
          }
        );

        const scale = entry.getScale('sectionPaddingTop');

        expect(scale.defaultValue).toBeUndefined();
      });

      it('is undefined when scale has no mapped default property name', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    'contentElementMargin-sm': '0.5rem',
                    'contentElementMargin-md': '1rem'
                  }
                }
              }
            })
          }
        );

        const scale = entry.getScale('contentElementMargin');

        expect(scale.defaultValue).toBeUndefined();
      });

      it('returns default value from root scope', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    'sectionPaddingTop-sm': '10vh',
                    'sectionPaddingTop-md': '20vh',
                    'sectionPaddingTop-lg': '30vh',
                    'sectionDefaultPaddingTop': '20vh'
                  }
                }
              }
            })
          }
        );

        const scale = entry.getScale('sectionPaddingTop');

        expect(scale.defaultValue).toEqual('md');
      });

      it('returns default value from specific scope', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    'sectionPaddingTop-sm': '10vh',
                    'sectionPaddingTop-md': '20vh',
                    'sectionPaddingTop-lg': '30vh',
                    'sectionDefaultPaddingTop': '20vh'
                  },
                  'section-cards': {
                    'sectionDefaultPaddingTop': '30vh'
                  }
                }
              }
            })
          }
        );

        const scale = entry.getScale('sectionPaddingTop', {scope: 'section-cards'});

        expect(scale.defaultValue).toEqual('lg');
      });

      it('falls back to root scope when specific scope does not have property', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    'sectionPaddingTop-sm': '10vh',
                    'sectionPaddingTop-md': '20vh',
                    'sectionPaddingTop-lg': '30vh',
                    'sectionDefaultPaddingTop': '20vh'
                  },
                  'section-cards': {
                    'someOtherProperty': 'value'
                  }
                }
              }
            })
          }
        );

        const scale = entry.getScale('sectionPaddingTop', {scope: 'section-cards'});

        expect(scale.defaultValue).toEqual('md');
      });

      it('is undefined when default css value is not in scale', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  root: {
                    'sectionPaddingTop-sm': '10vh',
                    'sectionPaddingTop-md': '20vh',
                    'sectionDefaultPaddingTop': '15vh'
                  }
                }
              }
            })
          }
        );

        const scale = entry.getScale('sectionPaddingTop');

        expect(scale.defaultValue).toBeUndefined();
      });
    });
  });
});
