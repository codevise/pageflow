import createReducer from '../createReducer';
import {reset, add, change, remove, order} from '../actions';

import {expect} from 'support/chai';

describe('createReducer', () => {
  describe('creates reducer that', () => {
    describe('for reset action', () => {
      it('replaces the whole state', () => {
        const state = {
          items: {
            1: {id: 1, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, reset({
          collectionName: 'posts',
          items: [{id: 1, title: 'Other'}]
        }));

        expect(result.items['1'].title).to.eq('Other');
      });

      it('updates order', () => {
        const state = {
          order: [1],
          items: {
            1: {id: 1, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, reset({
          collectionName: 'posts',
          items: [{id: 2, title: 'Other'}]
        }));

        expect(result.order).to.eql([2]);
      });

      it('supports custom id attribute', () => {
        const state = {
          items: {}
        };
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, reset({
          collectionName: 'posts',
          items: [{perma_id: 1, title: 'Other'}]
        }));

        expect(result.items['1'].title).to.eq('Other');
      });

      it('ignores actions other collection', () => {
        const state = {
          items: {
            1: {id: 1, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, reset({
          collectionName: 'comments',
          items: [{id: 1, text: 'Some text'}]
        }));

        expect(result.items['1'].title).to.eq('News');
      });
    });

    describe('for add action', () => {
      it('adds item', () => {
        const state = {
          items: {}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, add({
          collectionName: 'posts',
          attributes: {id: '6', title: 'News'}
        }));

        expect(result.items['6'].title).to.eq('News');
      });

      it('supports updating order', () => {
        const state = {
          items: {}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, add({
          collectionName: 'posts',
          order: [6],
          attributes: {id: '6', title: 'News'}
        }));

        expect(result.order).to.eql([6]);
      });

      it('supports custom id attribute', () => {
        const state = {
          items: {}
        };
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, add({
          collectionName: 'posts',
          attributes: {perma_id: '6', title: 'News'}
        }));

        expect(result.items['6'].title).to.eq('News');
      });

      it('ignores actions for other collections', () => {
        const state = {
          items: {}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, add({
          collectionName: 'comments',
          attributes: {id: '6', text: 'Some text'}
        }));

        expect(result.items).to.eql({});
      });
    });

    describe('for change action', () => {
      it('updates an item', () => {
        const state = {
          items: {
            2: {id: 2, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, change({
          collectionName: 'posts',
          attributes: {id: '2', title: 'Old'}
        }));

        expect(result.items['2'].title).to.eq('Old');
      });

      it('supports custom id attribute', () => {
        const state = {
          items: {
            2: {id: 2, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, change({
          collectionName: 'posts',
          attributes: {perma_id: '2', title: 'Old'}
        }));

        expect(result.items['2'].title).to.eq('Old');
      });

      it('keeps order unchanged', () => {
        const state = {
          order: [2],
          items: {
            2: {id: 2, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, change({
          collectionName: 'posts',
          attributes: {id: '2', title: 'Old'}
        }));

        expect(result.order).to.eq(state.order);
      });

      it('ignores actions for other collection', () => {
        const state = {
          items: {
            2: {id: 2, title: 'Old'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, change({
          collectionName: 'comments',
          attributes: {id: '2', title: 'New'}
        }));

        expect(result.items['2'].title).to.eq('Old');
      });
    });

    describe('for remove action', () => {
      it('removes item', () => {
        const state = {
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, remove({
          collectionName: 'posts',
          attributes: {id: 5}
        }));

        expect(result.items['5']).to.eq(undefined);
      });

      it('supports updating order', () => {
        const state = {
          order: [5],
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, remove({
          collectionName: 'posts',
          attributes: {id: 5},
          order: []
        }));

        expect(result.order).to.eql([]);
      });

      it('supports custom id attribute', () => {
        const state = {
          items: {
            5: {perma_id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, remove({
          collectionName: 'posts',
          attributes: {perma_id: 5}
        }));

        expect(result.items['5']).to.eq(undefined);
      });

      it('ignores actions for other collection', () => {
        const state = {
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, remove({
          collectionName: 'comments',
          attributes: {id: 5}
        }));

        expect(result.items['5'].title).to.eq('News');
      });
    });

    describe('for order action', () => {
      it('stores order', () => {
        const state = {
          items: {
            1: {id: 1, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, order({
          collectionName: 'posts',
          order: [1]
        }));

        expect(result.order).to.eql([1]);
      });

      it('does not change items', () => {
        const state = {
          items: {
            1: {id: 1, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, order({
          collectionName: 'posts',
          order: [1]
        }));

        expect(result.items).to.eql(state.items);
      });

      it('ignores actions for other collection', () => {
        const state = {
          order: [5],
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts');

        const result = reducer(state, order({
          collectionName: 'comments',
          order: [6]
        }));

        expect(result.order).to.eql([5]);
      });
    });

    describe('with itemReducer', () => {
      it('applies reducer to items on reset', () => {
        const state = {
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {
          itemReducer: function(item, action) {
            return {...item, some: 'default'};
          }
        });

        const result = reducer(state, reset({
          collectionName: 'posts',
          items: [{id: 5}]
        }));

        expect(result.items['5'].some).to.eq('default');
      });

      it('applies reducer to added item', () => {
        const state = {
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {
          itemReducer: function(item, action) {
            return {...item, some: 'default'};
          }
        });

        const result = reducer(state, add({
          collectionName: 'posts',
          attributes: {id: 5}
        }));

        expect(result.items['5'].some).to.eq('default');
      });

      it('applies reducer when item changes', () => {
        const state = {
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {
          itemReducer: function(item, action) {
            return {...item, some: 'default'};
          }
        });

        const result = reducer(state, change({
          collectionName: 'posts',
          attributes: {id: 5}
        }));

        expect(result.items['5'].some).to.eq('default');
        expect(result.items['5'].title).to.eq('News');
      });

      it('applies reducer to item for unknown action', () => {
        const state = {
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {
          itemReducer: function(item, action) {
            return {...item, title: action.payload.title};
          }
        });
        const SET_TITLE = 'TEST__SET_TITLE';

        const result = reducer(state, {
          type: SET_TITLE,
          meta: {
            collectionName: 'posts',
            itemId: '5'
          },
          payload: {
            title: 'Edited',
          }
        });

        expect(result.items['5'].title).to.eq('Edited');
      });

      it('keeps order unchanged', () => {
        const state = {
          order: [5],
          items: {
            5: {id: 5, title: 'News'}
          }
        };
        const reducer = createReducer('posts', {
          itemReducer: function(item, action) {
            return {...item, title: action.payload.title};
          }
        });
        const SET_TITLE = 'TEST__SET_TITLE';

        const result = reducer(state, {
          type: SET_TITLE,
          meta: {
            collectionName: 'posts',
            itemId: '5'
          },
          payload: {
            title: 'Edited',
          }
        });

        expect(result.order).to.eq(state.order);
      });

      it('does not change state for unknown action if item reducer does not change state', () => {
        const state = {
          items: {
            5: {id: 5}
          }
        };
        const reducer = createReducer('posts', {
          itemReducer: item => item
        });

        const result = reducer(state, {
          type: 'UNKNOWN',
          meta: {
            collectionName: 'posts',
            itemId: '5'
          }
        });

        expect(result.items).to.eq(state.items);
      });
    });
  });
});
