import Backbone from 'backbone';

import {
  ExternalLinkCollection
} from 'contentElements/externalLinkList/editor/models/ExternalLinkCollection';

describe('ExternalLinkCollection', () => {
  describe('.addNewLink', () => {
    it('returns link for empty collection', () => {
      const collection = new ExternalLinkCollection([], {
        entry: {},
        configuration: new Backbone.Model()
      });

      const link = collection.addNewLink();

      expect(link.id).toEqual(1);
    });

    it('generates uniq ids', () => {
      const collection = new ExternalLinkCollection([
        {id: 1},
        {id: 3}
      ], {
        entry: {},
        configuration: new Backbone.Model()
      });

      const link = collection.addNewLink();

      expect(link.id).toEqual(4);
    });
  });
});
