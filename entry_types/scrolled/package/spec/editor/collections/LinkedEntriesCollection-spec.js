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
});
