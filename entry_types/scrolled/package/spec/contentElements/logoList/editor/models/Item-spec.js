import {ItemsCollection} from 'contentElements/logoList/editor/models/ItemsCollection';
import {factories} from 'support';

describe('logoList Item', () => {
  it('posts content element command on highlight', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {items: [{id: 1}, {id: 2}]}
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('postCommand', listener);
    itemsCollection.get(2).highlight();

    expect(listener).toHaveBeenCalledWith(10, {type: 'HIGHLIGHT_ITEM', index: 1});
  });

  it('posts content element command on resetHighlight', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {items: [{id: 1}]}
    });
    const itemsCollection = ItemsCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('postCommand', listener);
    itemsCollection.get(1).resetHighlight();

    expect(listener).toHaveBeenCalledWith(10, {type: 'RESET_ITEM_HIGHLIGHT'});
  });
});
