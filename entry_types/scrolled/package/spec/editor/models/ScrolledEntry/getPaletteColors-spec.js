import {editor} from 'pageflow-scrolled/editor';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getPaletteColors', () => {
    it('returns empty arrays by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {entryTypeSeed: normalizeSeed()}
      );

      const [values, translationKeys] = entry.getPaletteColors();

      expect(values).toEqual([]);
      expect(translationKeys).toEqual([]);
    });

    it('extracts palette colors names from theme properties', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  paletteColorBrandBlue: '#00f',
                  paletteColorBrandGreen: '#0f0'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getPaletteColors();

      expect(values).toEqual(['brand-blue', 'brand-green']);
    });

    it('supports named palettes', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  paletteColorBrandBlue: '#00f',
                  paletteColorBrandGreen: '#0f0',
                  paletteColorAccentColor: '#123)'
                }
              },
              palettes: {
                brandColors: ['brandBlue', 'brand_green']
              }
            }
          })
        }
      );

      const [values] = entry.getPaletteColors({name: 'brandColors'});

      expect(values).toEqual(['brand-blue', 'brand-green']);
    });

    it('returns empty array if named palette is missing', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  paletteColorBrandBlue: '#00f',
                  paletteColorBrandGreen: '#0f0',
                  paletteColorAccentColor: '#123)'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getPaletteColors({name: 'brandColors'});

      expect(values).toEqual([]);
    });

    describe('with shared translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.palette_colors'

      useFakeTranslations({
        [`${commonPrefix}.dark_content_text`]: 'Dark Text Color',
        [`${commonPrefix}.light_content_text`]: 'Light Text Color'
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
                  root: {
                    paletteColorDarkContentText: '#00f',
                    paletteColorLightContentText: '#fff'
                  }
                }
              }
            })
          }
        );

        const [, texts] = entry.getPaletteColors();

        expect(texts).toEqual([
          'Dark Text Color',
          'Light Text Color'
        ]);
      });
    });

    describe('with theme specific translations', () => {
      const commonPrefix = 'pageflow_scrolled.editor.palette_colors';
      const themePrefix = `pageflow_scrolled.editor.themes.custom.palette_colors`;

      useFakeTranslations({
        [`${commonPrefix}.accent`]: 'Accent',
        [`${themePrefix}.accent`]: 'Highlight'
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
                  root: {
                    paletteColorAccent: '#00f'
                  }
                }
              }
            })
          }
        );

        const [, texts] = entry.getPaletteColors();

        expect(texts).toEqual([
          'Highlight'
        ]);
      });
    });
  });
});
