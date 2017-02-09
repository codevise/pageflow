import createReducer from '../createReducer';
import {reset, add, change, remove} from '../actions';

import {expect} from 'support/chai';

describe('createReducer', () => {
  describe('creates reducer that', () => {
    describe('for reset action', () => {
      it('replaces the whole state', () => {
        const state = {
          1: {id: 1, title: 'News'}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, reset({
          collectionName: 'posts',
          items: [{id: 1, title: 'Other'}]
        }));

        expect(result['1'].title).to.eq('Other');
      });

      it('supports custom id attribute', () => {
        const state = {};
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, reset({
          collectionName: 'posts',
          items: [{perma_id: 1, title: 'Other'}]
        }));

        expect(result['1'].title).to.eq('Other');
      });

      it('ignores actions other collection', () => {
        const state = {
          1: {id: 1, title: 'News'}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, reset({
          collectionName: 'comments',
          items: [{id: 1, text: 'Some text'}]
        }));

        expect(result['1'].title).to.eq('News');
      });
    });

    describe('for add action', () => {
      it('adds item', () => {
        const state = {};
        const reducer = createReducer('posts');

        const result = reducer(state, add({
          collectionName: 'posts',
          attributes: {id: '6', title: 'News'}
        }));

        expect(result['6'].title).to.eq('News');
      });

      it('supports custom id attribute', () => {
        const state = {};
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, add({
          collectionName: 'posts',
          attributes: {perma_id: '6', title: 'News'}
        }));

        expect(result['6'].title).to.eq('News');
      });

      it('ignores actions for other collections', () => {
        const state = {};
        const reducer = createReducer('posts');

        const result = reducer(state, add({
          collectionName: 'comments',
          attributes: {id: '6', text: 'Some text'}
        }));

        expect(result).to.eql({});
      });
    });

    describe('for change action', () => {
      it('updates an item', () => {
        const state = {
          2: {id: 2, title: 'News'}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, change({
          collectionName: 'posts',
          attributes: {id: '2', title: 'Old'}
        }));

        expect(result['2'].title).to.eq('Old');
      });

      it('supports custom id attribute', () => {
        const state = {
          2: {id: 2, title: 'News'}
        };
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, change({
          collectionName: 'posts',
          attributes: {perma_id: '2', title: 'Old'}
        }));

        expect(result['2'].title).to.eq('Old');
      });

      it('ignores actions for other collection', () => {
        const state = {
          2: {id: 2, title: 'Old'}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, change({
          collectionName: 'comments',
          attributes: {id: '2', title: 'New'}
        }));

        expect(result['2'].title).to.eq('Old');
      });
    });

    describe('for remove action', () => {
      it('removes item', () => {
        const state = {
          5: {id: 5, title: 'News'}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, remove({
          collectionName: 'posts',
          attributes: {id: 5}
        }));

        expect(result['5']).to.eq(undefined);
      });

      it('supports custom id attribute', () => {
        const state = {
          5: {perma_id: 5, title: 'News'}
        };
        const reducer = createReducer('posts', {idAttribute: 'perma_id'});

        const result = reducer(state, remove({
          collectionName: 'posts',
          attributes: {perma_id: 5}
        }));

        expect(result['5']).to.eq(undefined);
      });

      it('ignores actions for other collection', () => {
        const state = {
          5: {id: 5, title: 'News'}
        };
        const reducer = createReducer('posts');

        const result = reducer(state, remove({
          collectionName: 'comments',
          attributes: {id: 5}
        }));

        expect(result['5'].title).to.eq('News');
      });
    });

    describe('with itemReducer', () => {
      it('applies reducer to items on reset', () => {
        const state = {
          5: {id: 5, title: 'News'}
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

        expect(result['5'].some).to.eq('default');
      });

      it('applies reducer to added item', () => {
        const state = {
          5: {id: 5, title: 'News'}
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

        expect(result['5'].some).to.eq('default');
      });

      it('applies reducer when item changes', () => {
        const state = {
          5: {id: 5, title: 'News'}
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

        expect(result['5'].some).to.eq('default');
        expect(result['5'].title).to.eq('News');
      });

      it('applies reducer to item for unknown action', () => {
        const state = {
          5: {id: 5, title: 'News'}
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

        expect(result['5'].title).to.eq('Edited');
      });

      it('does not change state for unknown action if item reducer does not change state', () => {
        const state = {
          5: {id: 5}
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

        expect(result).to.eq(state);
      });
    });
  });
});
