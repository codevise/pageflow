import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getBackgroundColorPresets', () => {
    it('returns empty array by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {entryTypeSeed: normalizeSeed()}
      );

      expect(entry.getBackgroundColorPresets()).toEqual([]);
    });

    it('returns value and text for each preset', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              presets: {
                backgroundColors: [
                  {value: '#c9e9fb', name: 'Extra Light Blue'},
                  {value: '#fbe6b8', name: 'BG Yellow'}
                ]
              }
            }
          })
        }
      );

      expect(entry.getBackgroundColorPresets()).toEqual([
        {value: '#c9e9fb', text: 'Extra Light Blue'},
        {value: '#fbe6b8', text: 'BG Yellow'}
      ]);
    });

    it('falls back to value as text when name is missing', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              presets: {
                backgroundColors: [{value: '#c9e9fb'}]
              }
            }
          })
        }
      );

      expect(entry.getBackgroundColorPresets()).toEqual([
        {value: '#c9e9fb', text: '#c9e9fb'}
      ]);
    });
  });
});
