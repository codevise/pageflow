import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories, useFakeTranslations} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getScale', () => {
    const commonPrefix = 'pageflow_scrolled.editor.scales.contentElementMargin';
    const themePrefix = `pageflow_scrolled.editor.themes.custom.scales.contentElementMargin`;

    useFakeTranslations({
      [`${commonPrefix}.sm`]: 'Small',
      [`${commonPrefix}.md`]: 'Medium',
      [`${commonPrefix}.lg`]: 'Large',
      [`${themePrefix}.sm`]: 'Tiny'
    });

    it('returns empty arrays by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const [values, texts, cssValues] = entry.getScale('contentElementMargin');

      expect(values).toEqual([]);
      expect(texts).toEqual([]);
      expect(cssValues).toEqual([]);
    });

    it('returns values, texts, and cssValues based on theme custom properties', () => {
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
                  'contentElementMargin-sm': '0.5rem',
                  'contentElementMargin-md': '1rem',
                  'contentElementMargin-lg': '1.5rem'
                }
              }
            }
          })
        }
      );

      const [values, texts, cssValues] = entry.getScale('contentElementMargin');

      expect(values).toEqual(['sm', 'md', 'lg']);
      expect(texts).toEqual([
        'Tiny',
        'Medium',
        'Large'
      ]);
      expect(cssValues).toEqual(['0.5rem', '1rem', '1.5rem']);
    });
  });
});
