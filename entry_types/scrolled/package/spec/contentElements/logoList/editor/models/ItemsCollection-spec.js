import {ItemsCollection} from 'contentElements/logoList/editor/models/ItemsCollection';
import {factories} from 'support';

describe('logoList ItemsCollection', () => {
  it('updates content element configuration when item is added', () => {
    const imageFile = factories.imageFile({perma_id: 4});
    const contentElement = factories.contentElement({
      configuration: {items: [{id: 3, image: 2}]}
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);

    itemsCollection.addWithId(imageFile);

    expect(contentElement.configuration.get('items')).toEqual([
      {id: 3, image: 2},
      {id: 4, image: 4}
    ]);
  });

  it('updates content element configuration when item is removed', () => {
    const contentElement = factories.contentElement({
      configuration: {items: [{id: 1}, {id: 2}]}
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);

    itemsCollection.remove(1);

    expect(contentElement.configuration.get('items')).toEqual([{id: 2}]);
  });

  it('prunes item links when item is removed', () => {
    const contentElement = factories.contentElement({
      configuration: {
        items: [{id: 1}, {id: 2}],
        itemLinks: {
          1: {href: 'https://acme.example.com'},
          2: {href: 'https://globex.example.com'}
        }
      }
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);

    itemsCollection.remove(1);

    expect(contentElement.configuration.get('itemLinks')).toEqual({
      2: {href: 'https://globex.example.com'}
    });
  });
});
