import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getAspectRatio', () => {
    it('returns default aspect ratio', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const result = entry.getAspectRatio('narrow');

      expect(result).toEqual(0.75);
    });

    it('returns tall default aspect ratio', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed()
        }
      );

      const result = entry.getAspectRatio('tall');

      expect(result).toEqual(16 / 9);
    });

    it('lets theme aspect ratio override tall default', () => {
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

      const result = entry.getAspectRatio('tall');

      expect(result).toEqual(2);
    });

    it('returns custom aspect ratio', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
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

      const result = entry.getAspectRatio('4to5');

      expect(result).toEqual(0.8);
    });
  });
});
