import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getTypographySizes', () => {
    it('returns only md by default', () => {
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

      const [values] = entry.getTypographySizes({contentElement});

      expect(values).toEqual(['md']);
    });

    it('selects typography rules based on content element type name and always includes md', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'someElement-lg': {
                  fontSize: '3rem'
                },
                'someElement-sm': {
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

      const [values] = entry.getTypographySizes({contentElement});

      expect(values).toEqual(['lg', 'md', 'sm']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_sizes'

      useFakeTranslations({
        [`${commonPrefix}.lg`]: 'Large',
        [`${commonPrefix}.md`]: 'Medium'
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
                  'someElement-lg': {
                    fontSize: '3rem'
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

        const [, texts] = entry.getTypographySizes({contentElement});

        expect(texts).toEqual([
          'Large',
          'Medium'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_sizes'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.lg`]: 'Large',
        [`${commonPrefix}.md`]: 'Medium',
        [`${themePrefix}.typography_sizes.lg`]: 'L',
        [`${themePrefix}.typography_sizes.md`]: 'M',
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
                  'someElement-lg': {
                    fontSize: '3em'
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

        const [, texts] = entry.getTypographySizes({contentElement});

        expect(texts).toEqual([
          'L',
          'M'
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
                'someElement-heading-lg': {
                  fontSize: '3rem'
                },
                'someElement-heading-sm': {
                  fontSize: '2rem'
                },
                'someElement-body-highlight-sm': {
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

      const [values] = entry.getTypographySizes({contentElement, prefix: 'heading'});

      expect(values).toEqual(['lg', 'md', 'sm']);
    });

    it('supports passing scaleCategory instead of contentElement', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'counterNumber-xl': {
                  fontSize: '350px'
                },
                'counterNumber-sm': {
                  fontSize: '110px'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getTypographySizes({scaleCategory: 'counterNumber'});

      expect(values).toEqual(['xl', 'md', 'sm']);
    });

    it('returns sizes in ascending order when order option is asc', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              typography: {
                'someElement-lg': {
                  fontSize: '3rem'
                },
                'someElement-sm': {
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

      const [values] = entry.getTypographySizes({contentElement, order: 'asc'});

      expect(values).toEqual(['sm', 'md', 'lg']);
    });

    describe('with texts option', () => {
      const commonPrefix = 'pageflow_scrolled.editor.typography_sizes';

      useFakeTranslations({
        [`${commonPrefix}.lg`]: 'Large',
        [`${commonPrefix}.md`]: 'Medium',
        [`${commonPrefix}.short.lg`]: 'L',
        [`${commonPrefix}.short.md`]: 'M'
      });

      it('returns short translated display names when texts option is short', () => {
        editor.contentElementTypes.register('someElement', {});

        const entry = factories.entry(
          ScrolledEntry,
          {},
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                typography: {
                  'someElement-lg': {
                    fontSize: '3rem'
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

        const [, texts] = entry.getTypographySizes({contentElement, texts: 'short'});

        expect(texts).toEqual([
          'L',
          'M'
        ]);
      });
    });
  });
});
