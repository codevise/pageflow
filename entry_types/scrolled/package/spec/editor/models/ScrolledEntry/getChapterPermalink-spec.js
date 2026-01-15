import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getChapterPermalink', () => {
    it('returns permalink with slugified title', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {pretty_url: 'https://example.com/entry'},
        {
          entryTypeSeed: normalizeSeed({
            chapters: [
              {id: 1, permaId: 100, configuration: {title: 'My Chapter'}}
            ]
          })
        }
      );
      const chapter = entry.chapters.get(1);

      const result = entry.getChapterPermalink(chapter);

      expect(result).toEqual('https://example.com/entry#my-chapter');
    });

    it('uses chapter-permaId for chapters without title', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {pretty_url: 'https://example.com/entry'},
        {
          entryTypeSeed: normalizeSeed({
            chapters: [
              {id: 1, permaId: 100}
            ]
          })
        }
      );
      const chapter = entry.chapters.get(1);

      const result = entry.getChapterPermalink(chapter);

      expect(result).toEqual('https://example.com/entry#chapter-100');
    });

    it('appends permaId if slug would not be unique', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {pretty_url: 'https://example.com/entry'},
        {
          entryTypeSeed: normalizeSeed({
            chapters: [
              {id: 1, permaId: 100, configuration: {title: 'Same Title'}},
              {id: 2, permaId: 200, configuration: {title: 'Same Title'}}
            ]
          })
        }
      );
      const chapter1 = entry.chapters.get(1);
      const chapter2 = entry.chapters.get(2);

      expect(entry.getChapterPermalink(chapter1)).toEqual('https://example.com/entry#same-title');
      expect(entry.getChapterPermalink(chapter2)).toEqual('https://example.com/entry#same-title-200');
    });
  });
});
