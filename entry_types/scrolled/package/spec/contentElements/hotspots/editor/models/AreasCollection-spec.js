import {Area} from 'contentElements/hotspots/editor/models/Area';
import {AreasCollection} from 'contentElements/hotspots/editor/models/AreasCollection';
import {factories} from 'support';

describe('hotspots AreasCollection', () => {
  it('updates content element configuration when area is added', () => {
    const contentElement = factories.contentElement();
    const areasCollection = AreasCollection.forContentElement(contentElement);

    areasCollection.addWithId(new Area());
    areasCollection.addWithId(new Area());

    expect(contentElement.configuration.get('areas')).toEqual([
      {id: 1},
      {id: 2}
    ]);
  });

  it('updates content element configuration when item is removed', () => {
    const contentElement = factories.contentElement({
      configuration: {
        areas: [
          {id: 1},
          {id: 2},
        ]
      }
    });
    const areasCollection = AreasCollection.forContentElement(contentElement);

    areasCollection.remove(1);

    expect(contentElement.configuration.get('areas')).toEqual([
      {id: 2}
    ])
  });

  it('updates content element configuration when item changes', () => {
    const contentElement = factories.contentElement({
      configuration: {
        areas: [
          {id: 1},
        ]
      }
    });
    const areasCollection = AreasCollection.forContentElement(contentElement);

    areasCollection.get(1).set('tooltipPosition', 'above');

    expect(contentElement.configuration.get('areas')).toEqual([
      {id: 1, tooltipPosition: 'above'}
    ])
  });

  it('prunes tooltip texts and link when removing an element with single change event', () => {
    const contentElement = factories.contentElement({
      configuration: {
        areas: [
          {id: 1},
          {id: 2},
        ],
        tooltipTexts: {
          1: {title: [{children: [{text: 'Title for item 1'}]}]},
          2: {title: [{children: [{text: 'Title for item 2'}]}]},
        },
        tooltipLinks: {
          1: {href: 'https://example.com'},
          2: {href: 'https://other.example.com'},
        }
      }
    });
    const itemsCollection = AreasCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('change:configuration', listener);
    itemsCollection.remove(1);

    expect(contentElement.configuration.get('tooltipTexts')).toEqual({
      2: {title: [{children: [{text: 'Title for item 2'}]}]}
    });
    expect(contentElement.configuration.get('tooltipLinks')).toEqual({
      2: {href: 'https://other.example.com'},
    });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('posts content element command on highlight', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        areas: [
          {id: 1},
        ]
      }
    });
    const areasCollection = AreasCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('postCommand', listener);
    areasCollection.get(1).highlight();

    expect(listener).toHaveBeenCalledWith(10, {type: 'HIGHLIGHT_AREA', index: 0});
  });

  it('posts content element command on resetHighlight', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        areas: [
          {id: 1},
        ]
      }
    });
    const areasCollection = AreasCollection.forContentElement(contentElement);
    const listener = jest.fn();

    contentElement.on('postCommand', listener);
    areasCollection.get(1).resetHighlight();

    expect(listener).toHaveBeenCalledWith(10, {type: 'RESET_AREA_HIGHLIGHT'});
  });

  it('return empty title by default', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        areas: [
          {id: 1},
        ]
      }
    });
    const areasCollection = AreasCollection.forContentElement(contentElement);

    expect(areasCollection.get(1).title()).toBeUndefined();
  });

  it('extracts title from tooltip texts', () => {
    const contentElement = factories.contentElement({
      id: 10,
      configuration: {
        tooltipTexts: {
          1: {
            title: [{children: [{text: 'Some title'}]}]
          }
        },
        areas: [
          {id: 1},
        ]
      }
    });
    const areasCollection = AreasCollection.forContentElement(contentElement);

    expect(areasCollection.get(1).title()).toEqual('Some title');
  });
});
