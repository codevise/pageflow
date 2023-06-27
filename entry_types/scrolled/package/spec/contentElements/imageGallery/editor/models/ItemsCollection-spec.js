import {ItemsCollection} from 'contentElements/imageGallery/editor/models/ItemsCollection';
import {factories} from 'support';

describe('imageGallery ItemsCollection', () => {
  it('updates content element configuration when item is added', () => {
    const imageFile = factories.imageFile({perma_id: 4});
    const contentElement = factories.contentElement();
    const itemsCollection = ItemsCollection.forContentElement(contentElement);

    itemsCollection.addWithId(imageFile);

    expect(contentElement.configuration.get('items')).toEqual([
      {id: 1, image: 4}
    ])
  });

  it('updates content element configuration when item is removed', () => {
    const contentElement = factories.contentElement({
      configuration: {
        items: [
          {id: 1},
          {id: 2},
        ]
      }
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);

    itemsCollection.remove(1);

    expect(contentElement.configuration.get('items')).toEqual([
      {id: 2}
    ])
  });

  it('prunes captions when removing an element', () => {
    const contentElement = factories.contentElement({
      configuration: {
        items: [
          {id: 1},
          {id: 2},
        ],
        captions: {
          1: 'Caption for item 1',
          2: 'Caption for item 2'
        }
      }
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);

    itemsCollection.remove(1);

    expect(contentElement.configuration.get('captions')).toEqual({2: 'Caption for item 2'})
  });
});
