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
});
