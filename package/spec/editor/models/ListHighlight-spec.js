import Backbone from 'backbone';

import {ListHighlight} from 'pageflow/editor';

describe('ListHighlight', () => {
  it('moves highlight forward and wraps around', () => {
    const collection = new Backbone.Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);
    const highlight = new ListHighlight({}, {collection});

    highlight.next();
    expect(highlight.get('currentCid')).toBe(collection.at(0).cid);

    highlight.next();
    expect(highlight.get('currentCid')).toBe(collection.at(1).cid);

    highlight.next();
    highlight.next();
    expect(highlight.get('currentCid')).toBe(collection.at(0).cid);
  });

  it('moves highlight backwards and wraps around', () => {
    const collection = new Backbone.Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);
    const highlight = new ListHighlight({}, {collection});

    highlight.previous();
    expect(highlight.get('currentCid')).toBe(collection.at(2).cid);

    highlight.previous();
    expect(highlight.get('currentCid')).toBe(collection.at(1).cid);
  });

  it('triggers selected event with current cid', () => {
    const collection = new Backbone.Collection([
      {id: 1},
      {id: 2}
    ]);
    const highlight = new ListHighlight({}, {collection});
    const listener = jest.fn();

    highlight.next();
    highlight.on(`selected:${collection.at(0).cid}`, listener);
    highlight.triggerSelect();

    expect(listener).toHaveBeenCalled();
  });
});
