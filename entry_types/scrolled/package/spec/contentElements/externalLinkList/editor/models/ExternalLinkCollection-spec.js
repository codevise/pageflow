import Backbone from 'backbone';

import {
  ExternalLinkCollection
} from 'contentElements/externalLinkList/editor/models/ExternalLinkCollection';

import {factories} from 'support';

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

  it('updates content element configuration when item is added', () => {
    const contentElement = factories.contentElement();
    const areasCollection = ExternalLinkCollection.forContentElement(contentElement);

    areasCollection.addNewLink();
    areasCollection.addNewLink();

    expect(contentElement.configuration.get('links')).toEqual([
      {id: 1},
      {id: 2}
    ]);
  });

  it('updates content element configuration when item is removed', () => {
    const contentElement = factories.contentElement({
      configuration: {
        links: [
          {id: 1},
          {id: 2},
        ]
      }
    });
    const linksCollection = ExternalLinkCollection.forContentElement(contentElement);

    linksCollection.remove(1);

    expect(contentElement.configuration.get('links')).toEqual([
      {id: 2}
    ])
  });

  it('updates content element configuration when item changes', () => {
    const contentElement = factories.contentElement({
      configuration: {
        links: [
          {id: 1},
        ]
      }
    });
    const linksCollection = ExternalLinkCollection.forContentElement(contentElement);

    linksCollection.get(1).set('tooltipPosition', 'above');

    expect(contentElement.configuration.get('links')).toEqual([
      {id: 1, tooltipPosition: 'above'}
    ])
  });

  it('prunes tooltip texts and link when removing an element with single change event', () => {
    const contentElement = factories.contentElement({
      configuration: {
        links: [
          {id: 1},
          {id: 2},
        ],
        itemTexts: {
          1: {title: [{children: [{text: 'Title for item 1'}]}]},
          2: {title: [{children: [{text: 'Title for item 2'}]}]},
        },
        itemLinks: {
          1: {href: 'https://example.com'},
          2: {href: 'https://other.example.com'},
        }
      }
    });
    const itemsCollection = ExternalLinkCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('change:configuration', listener);
    itemsCollection.remove(1);

    expect(contentElement.configuration.get('itemTexts')).toEqual({
      2: {title: [{children: [{text: 'Title for item 2'}]}]}
    });
    expect(contentElement.configuration.get('itemLinks')).toEqual({
      2: {href: 'https://other.example.com'},
    });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
