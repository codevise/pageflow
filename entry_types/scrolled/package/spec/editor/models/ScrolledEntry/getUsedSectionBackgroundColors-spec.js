import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getUsedSectionBackgroundColors', () => {
    it('returns unique sorted list of used background colors', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {
                configuration: {
                  backdropType: 'color',
                  backdropColor: '#400'}
              },
              {
                configuration: {
                  backdropType: 'color',
                  backdropColor: '#040'
                }
              },
              {
                configuration: {
                  backdropType: 'color',
                  backdropColor: '#400'
                }
              },
              {
                configuration: {
                  appearance: 'cards',
                  cardSurfaceColor: '#500'
                }
              },
              {
                configuration: {
                  appearance: 'cards',
                  cardSurfaceColor: '#400'
                }
              }
            ]
          })
        }
      );

      const colors = entry.getUsedSectionBackgroundColors();

      expect(colors).toEqual(['#400', '#500', '#040']);
    });

    it('ignores blank colors', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {
                configuration: {
                  backdropType: 'color'
                }
              }
            ]
          })
        }
      );

      const colors = entry.getUsedSectionBackgroundColors();

      expect(colors).toEqual([]);
    });

    it('ignores invisible config options', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {
                configuration: {
                  backdropType: 'image',
                  backdropColor: '#400'}
              },
              {
                configuration: {
                  appearance: 'shadow',
                  cardSurfaceColor: '#500'
                }
              }
            ]
          })
        }
      );

      const colors = entry.getUsedSectionBackgroundColors();

      expect(colors).toEqual([]);
    });
  });
});
