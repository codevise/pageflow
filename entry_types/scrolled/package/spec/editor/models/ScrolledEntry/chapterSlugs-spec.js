import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('chapter slugs', () => {
    function createEntry(chapters, storylines) {
      return factories.entry(ScrolledEntry, {}, {
        entryTypeSeed: normalizeSeed({chapters, storylines})
      });
    }

    it('sets chapter slugs on chapters', () => {
      const entry = createEntry([
        {id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}}
      ]);

      expect(entry.chapters.get(1).get('chapterSlug')).toEqual('intro');
    });

    it('orders chapters by storyline position like the server', () => {
      const entry = createEntry([
        {id: 1, permaId: 100, storylineId: 2, position: 0, configuration: {title: 'Intro'}},
        {id: 2, permaId: 200, storylineId: 1, position: 1, configuration: {title: 'Intro'}}
      ], [
        {id: 1, position: 0, configuration: {main: true}},
        {id: 2, position: 1, configuration: {}}
      ]);

      expect(entry.chapters.get(2).get('chapterSlug')).toEqual('intro');
      expect(entry.chapters.get(1).get('chapterSlug')).toEqual('intro-100');
    });

    it('updates chapter slug when title changes', () => {
      const entry = createEntry([
        {id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}}
      ]);

      entry.chapters.get(1).configuration.set('title', 'Outro', {autoSave: false});

      expect(entry.chapters.get(1).get('chapterSlug')).toEqual('outro');
    });

    it('updates slugs of other chapters with same title', () => {
      const entry = createEntry([
        {id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}},
        {id: 2, permaId: 200, position: 1, configuration: {title: 'Intro'}}
      ]);

      entry.chapters.get(1).configuration.set('title', 'Other', {autoSave: false});

      expect(entry.chapters.get(2).get('chapterSlug')).toEqual('intro');
    });

    it('updates slugs when chapters are removed', () => {
      const entry = createEntry([
        {id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}},
        {id: 2, permaId: 200, position: 1, configuration: {title: 'Intro'}}
      ]);

      entry.chapters.remove(entry.chapters.get(1));

      expect(entry.chapters.get(2).get('chapterSlug')).toEqual('intro');
    });

    it('does not include chapter slugs when saving chapters', () => {
      const entry = createEntry([
        {id: 1, permaId: 100, position: 0, configuration: {title: 'Intro'}}
      ]);

      expect(entry.chapters.get(1).toJSON()).not.toHaveProperty('chapterSlug');
    });
  });
});
