import {useCollections, watchCollection, getItems, getItem} from 'collections';

import Backbone from 'backbone';
import {renderHook, act} from '@testing-library/react-hooks';

describe('useCollections', () => {
  it('loads initial state from passed object', () => {
    const {result} = renderHook(() => useCollections({
      posts: [
        {id: 1, title: 'News'},
        {id: 2, title: 'Report'}
      ]
    }));

    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['News', 'Report']);
  });
});

describe('watch', () => {
  it('initializes useCollections state', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'News'},
      {id: 2, title: 'Report'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['News', 'Report']);
  });

  it('supports mapping attribute names', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'News'},
      {id: 2, title: 'Report'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', {text: 'title'}],
        dispatch
      });
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.text)).toEqual(['News', 'Report']);
  });

  it('supports mapping to constants', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {title: 'News'},
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: [{id: () => 1}, 'title'],
        dispatch
      });
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['News']);
  });

  it('supports watching multiple collections', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'News'},
      {id: 2, title: 'Report'}
    ]);
    const comments = new Backbone.Collection([
      {id: 1, text: 'Great!'},
      {id: 2, text: 'Agreed.'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
      watchCollection(comments, {
        name: 'comments',
        attributes: ['id', 'text'],
        dispatch
      });
    });
    const [state,] = result.current;
    const postsItems = getItems(state, 'posts');
    const commentsItems = getItems(state, 'comments');

    expect(postsItems.map(i => i.title)).toEqual(['News', 'Report']);
    expect(commentsItems.map(i => i.text)).toEqual(['Great!', 'Agreed.']);
  });

  it('respects order of collection given by its comparator', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection(
      [
        {id: 1, title: 'Second', position: 2},
        {id: 2, title: 'First', position: 1}
      ],
      {comparator: 'position'}
    );

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['First', 'Second']);
  });

  it('updates order on sort', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection(
      [
        {id: 1, title: 'A', position: 1},
        {id: 2, title: 'B', position: 2}
      ],
      {comparator: 'position'}
    );

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.at(0).set('position', 3)
      posts.sort();
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['B', 'A']);
  });

  it('ignores new models on sort', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection(
      [
        {id: 1, title: 'A', position: 1},
        {title: 'Not saved yet', position: 2},
        {id: 3, title: 'B', position: 3}
      ],
      {comparator: 'position'}
    );

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.sort();
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['A', 'B']);
  });

  it('ignores not yet persisted items', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection();

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.add({title: 'No id yet'})
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items).toEqual([]);
  });

  it('adds items once persisted', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection();

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.add({title: 'Created'})
      posts.first().set('id', 1);
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['Created']);
  });

  it('supports including configuration attributes', () => {
    const {result} = renderHook(() => useCollections());
    const model = new Backbone.Model({id: 1});
    model.configuration = new Backbone.Model({title: 'Title from configuration'});
    const posts = new Backbone.Collection([model])

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        includeConfiguration: true,
        dispatch
      });
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.configuration.title)).toEqual(['Title from configuration']);
  });

  it('updates useCollections state when model is added', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection();

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.add({id: 1, title: 'News'})
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['News']);
  });

  it('leaves unchanged item referentially equal on add', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'Unchanged'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });

    let [state,] = result.current;
    const itemBeforeChange = getItems(state, 'posts')[0];

    act(() => {
      posts.add({id: 2, title: 'News'});
    });

    [state,] = result.current;
    const itemAfterChange = getItems(state, 'posts')[0];

    expect(itemBeforeChange).toBe(itemAfterChange);
  });

  it('updates useCollections state when model is removed', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'News'},
      {id: 2, title: 'Report'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.remove({id: 1})
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['Report']);
  });

  it('leaves unchanged item referentially equal on remove', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'Unchanged'},
      {id: 2, title: 'Removed'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });

    let [state,] = result.current;
    const itemBeforeChange = getItems(state, 'posts')[0];

    act(() => {
      posts.remove(2);
    });

    [state,] = result.current;
    const itemAfterChange = getItems(state, 'posts')[0];

    expect(itemBeforeChange).toBe(itemAfterChange);
  });

  it('updates useCollections state when model is changed', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'Old news'},
      {id: 2, title: 'Report'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });

      posts.at(0).set('title', 'News');
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.title)).toEqual(['News', 'Report']);
  });

  it('updates useCollections state when included configuration changes', () => {
    const {result} = renderHook(() => useCollections());
    const model = new Backbone.Model({id: 1});
    model.configuration = new Backbone.Model({title: 'Old title'});
    const posts = new Backbone.Collection([model])

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        includeConfiguration: true,
        dispatch
      });

      model.configuration.set('title', 'New title')
      model.trigger('change:configuration', model);
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.configuration.title)).toEqual(['New title']);
  });

  it('updates useCollections state when attribute with mapped name changes', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([{id: 1, title: 'Old title'}]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', {text: 'title'}],
        dispatch
      });

      posts.first().set('title', 'New title')
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.map(i => i.text)).toEqual(['New title']);
  });

  it('does not leave updated item referentially equal on update', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([{id: 1, title: 'Old news'}]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });

    let [state,] = result.current;
    const itemBeforeChange = getItems(state, 'posts')[0];

    act(() => {
      posts.at(0).set('title', 'News');
    });

    [state,] = result.current;
    const itemAfterChange = getItems(state, 'posts')[0];

    expect(itemBeforeChange).not.toBe(itemAfterChange);
  });

  it('leaves unchanged item referentially equal on update', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'Unchanged'},
      {id: 2, title: 'Old'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });

    let [state,] = result.current;
    const itemBeforeChange = getItems(state, 'posts')[0];

    act(() => {
      posts.at(1).set('title', 'New');
    });

    [state,] = result.current;
    const itemAfterChange = getItems(state, 'posts')[0];

    expect(itemBeforeChange).toBe(itemAfterChange);
  });

  it('leaves item referentially equal on update of unused attribute', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 1, title: 'Unchanged', notWatched: 'Old value'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });

    let [state,] = result.current;
    const itemBeforeChange = getItems(state, 'posts')[0];

    act(() => {
      posts.first().set('notWatched', 'New value');
    });

    [state,] = result.current;
    const itemAfterChange = getItems(state, 'posts')[0];

    expect(itemBeforeChange).toBe(itemAfterChange);
  });

  it('supports getting items by id', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection([
      {id: 2, title: 'News'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['id', 'title'],
        dispatch
      });
    });

    let [state,] = result.current;
    const item = getItem(state, 'posts', 2);

    expect(item.title).toBe('News');
  });

  it('supports indexing by different attribute', () => {
    const {result} = renderHook(() => useCollections(undefined, {keyAttribute: 'permaId'}));
    const posts = new Backbone.Collection([
      {id: 2, permaId: 4, title: 'News'}
    ]);

    act(() => {
      const [, dispatch] = result.current;
      watchCollection(posts, {
        name: 'posts',
        attributes: ['permaId', 'title'],
        keyAttribute: 'permaId',
        dispatch
      });
    });

    let [state,] = result.current;
    const item = getItem(state, 'posts', 4);

    expect(item.title).toBe('News');
  });

  it('returns teardown function to stop watching', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection();

    act(() => {
      const [, dispatch] = result.current;
      const teardown = watchCollection(posts, {
        name: 'posts',
        attributes: ['id'],
        dispatch
      });

      teardown();
      posts.add({id: 1, title: 'News'})
    });
    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items.length).toBe(0);
  });

  it('teardown function does not remove other listener', () => {
    const {result} = renderHook(() => useCollections());
    const posts = new Backbone.Collection();
    const listener = jest.fn();

    posts.on('add', listener);

    act(() => {
      const [, dispatch] = result.current;
      const teardown = watchCollection(posts, {
        name: 'posts',
        attributes: ['id'],
        dispatch
      });

      teardown();
      posts.add({id: 1, title: 'News'})
    });

    expect(listener).toHaveBeenCalled();
  });
});

describe('getItems', () => {
  it('returns an empty array by default', () => {
    const {result} = renderHook(() => useCollections());

    const [state,] = result.current;
    const items = getItems(state, 'posts');

    expect(items).toEqual([]);
  });
});
