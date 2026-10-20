import {LinkedEntriesCollection} from 'editor/collections/LinkedEntriesCollection';
import Backbone from 'backbone';

describe('LinkedEntriesCollection', () => {
  describe('#addLinkableEntry', () => {
    it('adds attributes needed to render links', () => {
      const linkedEntries = new LinkedEntriesCollection();

      linkedEntries.addLinkableEntry(new Backbone.Model({
        id: 5, title: 'Other', url: '/other', previewUrl: '/admin/other',
        publicationState: 'not_published', signature: 'signed'
      }));

      expect(linkedEntries.get(5).attributes).toEqual({
        id: 5, title: 'Other', url: '/other', previewUrl: '/admin/other',
        publicationState: 'not_published'
      });
    });

    it('adds chapter of linkable entry', () => {
      const linkedEntries = new LinkedEntriesCollection([{id: 5, chapters: []}]);

      linkedEntries.addLinkableEntry(new Backbone.Model({
        id: 5,
        chapters: [{permaId: 20, title: 'Intro', slug: 'intro', signature: 'signed'}]
      }), {chapter: 20});

      expect(linkedEntries.get(5).get('chapters')).toEqual([
        {permaId: 20, title: 'Intro', slug: 'intro', previewSlug: 'intro'}
      ]);
    });

    it('updates existing linked entry', () => {
      const linkedEntries = new LinkedEntriesCollection([
        {id: 5, title: 'Seed', publicationState: 'not_published'}
      ]);

      linkedEntries.addLinkableEntry(new Backbone.Model({
        id: 5, title: 'Other', publicationState: 'published_without_password_protection'
      }));

      expect(linkedEntries.get(5).attributes).toMatchObject({
        title: 'Other', publicationState: 'published_without_password_protection'
      });
    });
  });

  describe('#mergeLinkedEntries', () => {
    it('adds new linked entries', () => {
      const linkedEntries = new LinkedEntriesCollection([{id: 5}]);

      linkedEntries.mergeLinkedEntries([{id: 9, title: 'Other'}]);

      expect(linkedEntries.pluck('id')).toEqual([5, 9]);
    });

    it('adds chapters to existing linked entries', () => {
      const linkedEntries = new LinkedEntriesCollection([
        {id: 5, chapters: [{permaId: 20, slug: 'intro'}]}
      ]);

      linkedEntries.mergeLinkedEntries([{
        id: 5,
        chapters: [{permaId: 20, slug: 'other'}, {permaId: 30, slug: 'outro'}]
      }]);

      expect(linkedEntries.get(5).get('chapters')).toEqual([
        {permaId: 20, slug: 'intro'},
        {permaId: 30, slug: 'outro'}
      ]);
    });

    it('updates attributes of existing linked entries', () => {
      const linkedEntries = new LinkedEntriesCollection([
        {id: 5, title: 'Old', chapters: [{permaId: 20, slug: 'intro'}]}
      ]);

      linkedEntries.mergeLinkedEntries([{id: 5, title: 'New'}]);

      expect(linkedEntries.get(5).attributes).toEqual({
        id: 5, title: 'New', chapters: [{permaId: 20, slug: 'intro'}]
      });
    });
  });
});
