import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('getContentElementVariants', () => {
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

      const [values, texts] = entry.getContentElementVariants({contentElement});

      expect(values).toEqual([]);
      expect(texts).toEqual([]);
    });

    it('selects property scopes based on content element type name', () => {
      editor.contentElementTypes.register('someElement', {});

      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                'someElement-blue': {
                  surface_color: 'blue'
                },
                'someElement-green': {
                  surface_color: 'green'
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

      const [values] = entry.getContentElementVariants({contentElement});

      expect(values).toEqual(['blue', 'green']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.content_element_variants'

      useFakeTranslations({
        [`${commonPrefix}.someElement-blue`]: 'Blue',
        [`${commonPrefix}.someElement-green`]: 'Green'
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
                properties: {
                  'someElement-blue': {
                    surface_color: 'blue'
                  },
                  'someElement-green': {
                    surface_color: 'green'
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

        const [, texts] = entry.getContentElementVariants({contentElement});

        expect(texts).toEqual([
          'Blue',
          'Green'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.content_element_variants'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.someElement-blue`]: 'Blue',
        [`${commonPrefix}.someElement-green`]: 'Green',
        [`${themePrefix}.content_element_variants.someElement-blue`]: 'Custom Blue',
        [`${themePrefix}.content_element_variants.someElement-green`]: 'Custom Green'
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
                properties: {
                  'someElement-blue': {
                    surface_color: 'blue'
                  },
                  'someElement-green': {
                    surface_color: 'green'
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

        const [, texts] = entry.getContentElementVariants({contentElement});

        expect(texts).toEqual([
          'Custom Blue',
          'Custom Green'
        ]);
      });
    });
  });
});
