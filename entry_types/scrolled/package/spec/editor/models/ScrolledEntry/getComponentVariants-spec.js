import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('getComponentVariants', () => {
    it('returns empty arrays by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const [values, texts] = entry.getComponentVariants({name: 'figureCaption'});

      expect(values).toEqual([]);
      expect(texts).toEqual([]);
    });

    it('selects property scopes based on name', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                'figureCaption-blue': {
                  surface_color: 'blue'
                },
                'figureCaption-green': {
                  surface_color: 'green'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getComponentVariants({name: 'figureCaption'});

      expect(values).toEqual(['blue', 'green']);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.component_variants'

      useFakeTranslations({
        [`${commonPrefix}.figureCaption-blue`]: 'Blue',
        [`${commonPrefix}.figureCaption-green`]: 'Green'
      });

      it('returns translated display names', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  'figureCaption-blue': {
                    surface_color: 'blue'
                  },
                  'figureCaption-green': {
                    surface_color: 'green'
                  }
                }
              }
            })
          }
        );

        const [, texts] = entry.getComponentVariants({name: 'figureCaption'});

        expect(texts).toEqual([
          'Blue',
          'Green'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.component_variants'
      const themePrefix = `pageflow_scrolled.editor.themes.custom`

      useFakeTranslations({
        [`${commonPrefix}.figureCaption-blue`]: 'Blue',
        [`${commonPrefix}.figureCaption-green`]: 'Green',
        [`${themePrefix}.component_variants.figureCaption-blue`]: 'Custom Blue',
        [`${themePrefix}.component_variants.figureCaption-green`]: 'Custom Green'
      });

      it('prefers theme specific translations', () => {
        const entry = factories.entry(
          ScrolledEntry,
          {
            metadata: {theme_name: 'custom'}
          },
          {
            entryTypeSeed: normalizeSeed({
              themeOptions: {
                properties: {
                  'figureCaption-blue': {
                    surface_color: 'blue'
                  },
                  'figureCaption-green': {
                    surface_color: 'green'
                  }
                }
              }
            })
          }
        );

        const [, texts] = entry.getComponentVariants({name: 'figureCaption'});

        expect(texts).toEqual([
          'Custom Blue',
          'Custom Green'
        ]);
      });
    });
  });
});
