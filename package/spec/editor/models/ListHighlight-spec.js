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
    expect(highlight.get('currentId')).toBe(1);

    highlight.next();
    expect(highlight.get('currentId')).toBe(2);

    highlight.next();
    highlight.next();
    expect(highlight.get('currentId')).toBe(1);
  });

  it('moves highlight backwards and wraps around', () => {
    const collection = new Backbone.Collection([
      {id: 1},
      {id: 2},
      {id: 3}
    ]);
    const highlight = new ListHighlight({}, {collection});

    highlight.previous();
    expect(highlight.get('currentId')).toBe(3);

    highlight.previous();
    expect(highlight.get('currentId')).toBe(2);
  });

  it('triggers selected event with current id', () => {
    const collection = new Backbone.Collection([
      {id: 1},
      {id: 2}
    ]);
    const highlight = new ListHighlight({}, {collection});
    const listener = jest.fn();

    highlight.next();
    highlight.on('selected:1', listener);
    highlight.triggerSelect();

    expect(listener).toHaveBeenCalled();
  });
});
