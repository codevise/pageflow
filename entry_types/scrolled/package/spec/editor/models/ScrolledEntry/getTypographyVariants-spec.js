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
                'someElement-large': {
                  fontSize: '3rem'
                },
                'someElement-small': {
                  fontSize: '2rem'
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

      expect(values).toEqual(['large', 'small']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_variants'

      useFakeTranslations({
        [`${commonPrefix}.someElement-large`]: 'Large',
        [`${commonPrefix}.someElement-small`]: 'Small'
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
                  'someElement-large': {
                    fontSize: '3rem'
                  },
                  'someElement-small': {
                    fontSize: '2rem'
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
          'Large',
          'Small'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_variants'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.someElement-large`]: 'Large',
        [`${commonPrefix}.someElement-small`]: 'Small',
        [`${themePrefix}.typography_variants.someElement-large`]: 'Custom Large',
        [`${themePrefix}.typography_variants.someElement-small`]: 'Custom Small'
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
                  'someElement-large': {
                    fontSize: '3rem'
                  },
                  'someElement-small': {
                    fontSize: '2rem'
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
          'Custom Large',
          'Custom Small'
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
                'someElement-heading-large': {
                  fontSize: '3rem'
                },
                'someElement-heading-small': {
                  fontSize: '2rem'
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

      expect(values).toEqual(['large', 'small']);
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
                  'someElement-large': {
                    fontSize: '3rem'
                  },
                  'someElement-largeAccent': {
                    fontSize: '2rem',
                    color: 'var(--theme-accent-color)'
                  }
                }
              },
              contentElements: [
                {id: 5, typeName: 'someElement'}
              ]
            }),
            legacyTypographyVariants: {
              largeAccent: {
                variant: 'large',
                paletteColor: 'accent'
              }
            }
          }
        }
      );
      const contentElement = entry.contentElements.get(5);

      const [values] = entry.getTypographyVariants({contentElement});

      expect(values).toEqual(['large']);
    });
  });
});
