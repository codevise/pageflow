import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('supportsSectionWidths', () => {
    it('returns false by default', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {entryTypeSeed: normalizeSeed()}
      );

      expect(entry.supportsSectionWidths()).toEqual(false);
    });

    it('returns true if theme has narrow section properties', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            themeOptions: {
              properties: {
                root: {
                  narrowSectionTwoColumnInlineContentMaxWidth: '400px'
                }
              }
            }
          })
      });

      expect(entry.supportsSectionWidths()).toEqual(true);
    });
  });
});
