import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getTypographyVariants', () => {
    it('returns empty arrays by default', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values, translationKeys] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual([]);
      expect(translationKeys).toEqual([]);
    });

    it('selects typography rules based on content element type name', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'someElement-highlight': {
                  textTransform: 'uppercase'
                },
                'someElement-alternative': {
                  fontFamily: 'Other'
                }
              }
            },
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual(['highlight', 'alternative']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_variants'

      useFakeTranslations({
        [`${commonPrefix}.someElement-highlight`]: 'Highlight',
        [`${commonPrefix}.someElement-alternative`]: 'Alternative'
      });

      it('returns translated display names', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-highlight': {
                    textTransform: 'uppercase'
                  },
                  'someElement-alternative': {
                    fontFamily: 'Other'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            })
          }
        );
        const contentElement = entry.contentElements.get(5);

        const [, texts] = entry.getTypographyVariants({contentElement});

        expect(texts).toEqual([
          'Highlight',
          'Alternative'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_variants'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.someElement-highlight`]: 'Highlight',
        [`${commonPrefix}.someElement-alternative`]: 'Alternative',
        [`${themePrefix}.typography_variants.someElement-highlight`]: 'Custom Highlight',
        [`${themePrefix}.typography_variants.someElement-alternative`]: 'Custom Alternative'
      });

      it('prefers theme specific translations', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-highlight': {
                    textTransform: 'uppercase'
                  },
                  'someElement-alternative': {
                    fontFamily: 'Other'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            })
          }
        );
        const contentElement = entry.contentElements.get(5);

        const [, texts] = entry.getTypographyVariants({contentElement});

        expect(texts).toEqual([
          'Custom Highlight',
          'Custom Alternative'
        ]);
      });
    });

    it('supports filtering by additional prefix', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'someElement-heading-highlight': {
                  textTransform: 'uppercase'
                },
                'someElement-heading-alternative': {
                  fontFamily: 'Other'
                },
                'someElement-body-highlight': {
                  fontSize: '1rem'
                }
              }
            },
            contentElements: [
              {id: 5, typeName: 'someElement'}
            ]
          })
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement, prefix: 'heading'});

      expect(values).toEqual(['highlight', 'alternative']);
    });

    it('filters out legacy variants', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: {
            ...normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-highlight': {
                    textTransform: 'uppercase'
                  },
                  'someElement-highlightAccent': {
                    textTransform: 'uppercase',
                    color: 'var(--theme-accent-color)'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            }),
            legacyTypographyVariants: {
              highlightAccent: {
                variant: 'highlight',
                paletteColor: 'accent'
              }
            }
          }
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual(['highlight']);
    });
  });
});
