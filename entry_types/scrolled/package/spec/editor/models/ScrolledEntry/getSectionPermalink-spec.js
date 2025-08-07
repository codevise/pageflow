import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getSectionPermalink', () => {
    it('returns permalink for section', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {pretty_url: 'https://example.com/entry'},
        {
          entryTypeSeed: normalizeSeed({
            sections: [
              {id: 1, permaId: 100}
            ]
          })
        }
      );
      const section = entry.sections.get(1);

      const result = entry.getSectionPermalink(section);

      expect(result).toEqual('https://example.com/entry#section-100');
    });
  });
});
