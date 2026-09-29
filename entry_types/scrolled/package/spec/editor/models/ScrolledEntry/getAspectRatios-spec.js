import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getAspectRatios', () => {
    const commonPrefix = 'pageflow_scrolled.editor.aspect_ratios';
    const themePrefix = `pageflow_scrolled.editor.themes.custom.aspect_ratios`;

    useFakeTranslations({
      [`${commonPrefix}.narrow`]: 'Landscape (4:3)',
      [`${commonPrefix}.portrait`]: 'Portrait (3:4)',
      [`${commonPrefix}.square`]: 'Square (1:1)',
      [`${commonPrefix}.tall`]: 'Portrait (9:16)',
      [`${commonPrefix}.wide`]: 'Landscape (16:9)',
      [`${commonPrefix}.original`]: 'Original',
      [`${themePrefix}.4to5`]: 'Custom (4:5)'
    });

    it('returns default aspect ratios by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const [values, texts] = entry.getAspectRatios();

      expect(values).toEqual(['wide', 'narrow', 'square', 'portrait', 'tall']);
      expect(texts).toEqual([
        'Landscape (16:9)',
        'Landscape (4:3)',
        'Square (1:1)',
        'Portrait (3:4)',
        'Portrait (9:16)'
      ]);
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
                root: {
                  aspectRatio4to5: '0.8'
                }
              }
            }
          })
        }
      );

      const [values, texts] = entry.getAspectRatios();

      expect(values).toEqual(['wide', 'narrow', '4to5', 'square', 'portrait', 'tall']);
      expect(texts).toEqual([
        'Landscape (16:9)',
        'Landscape (4:3)',
        'Custom (4:5)',
        'Square (1:1)',
        'Portrait (3:4)',
        'Portrait (9:16)'
      ]);
    });

    it('lets theme ratios override defaults without adding duplicates', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  aspectRatioTall: '2'
                }
              }
            }
          })
        }
      );

      const [values] = entry.getAspectRatios();

      expect(values).toEqual(['wide', 'narrow', 'square', 'portrait', 'tall']);
    });

    it('includes original aspect ratio when includeOriginal option is true', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const [values, texts] = entry.getAspectRatios({includeOriginal: true});

      expect(values).toEqual(['wide', 'narrow', 'square', 'portrait', 'tall', 'original']);
      expect(texts).toEqual([
        'Landscape (16:9)',
        'Landscape (4:3)',
        'Square (1:1)',
        'Portrait (3:4)',
        'Portrait (9:16)',
        'Original'
      ]);
    });

    it('includes original aspect ratio with custom ratios when includeOriginal option is true', () => {
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

      const [values, texts] = entry.getAspectRatios({includeOriginal: true});

      expect(values).toEqual(['wide', 'narrow', '4to5', 'square', 'portrait', 'tall', 'original']);
      expect(texts).toEqual([
        'Landscape (16:9)',
        'Landscape (4:3)',
        'Custom (4:5)',
        'Square (1:1)',
        'Portrait (3:4)',
        'Portrait (9:16)',
        'Original'
      ]);
    });
  });
});
