import createSaga, {createMiddleware} from '../createSaga';
import createReducer from '../createReducer';
import createItemSelector from '../createItemSelector';
import {reset, add, remove} from '../actions';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {call, select, put, take, fork} from 'redux-saga/effects';

import sinon from 'sinon';

describe('createSaga', () => {
  describe('createSaga', () => {
    function createStoreWithCollectionSaga({itemSaga, itemReducer}) {
      const m = createMiddleware();
      const collectionSaga = createSaga('posts', {itemSaga, middleware: m});
      const sagaMiddleware = createSagaMiddleware();

      const store = createStore(combineReducers({
        posts: createReducer('posts', {itemReducer})
      }), {}, applyMiddleware(sagaMiddleware, m));

      sagaMiddleware.run(collectionSaga);

      return store;
    }

    it('runs saga for each item on collection reset', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield call(spy);
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5, title: 'Some post'},
          {id: 6, title: 'Other post'}
        ]
      }));

      expect(spy).toHaveBeenCalledTwice();
    });

    it('runs saga for each for added item', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield call(spy);
        }
      });

      store.dispatch(add({
        collectionName: 'posts',
        attributes: {id: 5, title: 'Some post'}
      }));

      expect(spy).toHaveBeenCalled();
    });

    it('cancels sagas when item is removed', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield take('DISPATCHED_AFTER_REMOVAL');
          yield call(spy);
        }
      });

      store.dispatch(add({
        collectionName: 'posts',
        attributes: {id: 5, title: 'Some post'}
      }));
      store.dispatch(remove({
        collectionName: 'posts',
        attributes: {id: 5}
      }));
      store.dispatch({type: 'DISPATCHED_AFTER_REMOVAL'});

      expect(spy).not.toHaveBeenCalled();
    });

    it('cancels sagas when collection is reset', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield take('DISPATCHED_AFTER_RESET');
          yield call(spy);
        }
      });

      store.dispatch(add({
        collectionName: 'posts',
        attributes: {id: 5, title: 'Some post'}
      }));
      store.dispatch(reset({
        collectionName: 'posts',
        items: []
      }));
      store.dispatch({type: 'DISPATCHED_AFTER_RESET'});

      expect(spy).not.toHaveBeenCalled();
    });

    it('allows to select in context of own item', () => {
      const spy = sinon.spy();
      const itemSelector = createItemSelector('posts');

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          const thisPost = yield select(itemSelector());
          yield call(spy, thisPost.title);
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [{id: 5, title: 'Some post'}]
      }));

      expect(spy).toHaveBeenCalledWith('Some post');
    });

    it('preserves selector args', () => {
      const spy = sinon.spy();
      const itemSelector = createItemSelector('posts');

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          const thisPost = yield select(itemSelector({id: 6}));
          yield call(spy, thisPost.title);
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5, title: 'Some post'},
          {id: 6, title: 'Other post'}
        ]
      }));

      expect(spy).toHaveBeenCalledWith('Other post');
    });

    it('dispatches actions in context of own item', () => {
      const itemSelector = createItemSelector('posts');

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield take('VISIT');
          yield put({
            type: 'SEEN',
            meta: {
              collectionName: 'posts'
            }
          });
        },

        itemReducer: function(state = {}, action) {
          switch (action.type) {
          case 'SEEN':
            return {...state, seen: true};
          default:
            return state;
          }
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5},
          {id: 6}
        ]
      }));
      store.dispatch({type: 'VISIT', meta: {
        collectionName: 'posts',
        itemId: 5
      }});

      expect(itemSelector({id: 5})(store.getState()).seen).toBe(true);
      expect(itemSelector({id: 6})(store.getState()).seen).toBeUndefined();
    });

    it('dispatches actions in context of own item', () => {
      const itemSelector = createItemSelector('posts');

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield fork(function*() {
            yield put({
              type: 'SEEN',
              meta: {
                collectionName: 'posts'
              }
            });
          });
        },

        itemReducer: function(state = {}, action) {
          switch (action.type) {
          case 'SEEN':
            return {...state, seen: true};
          default:
            return state;
          }
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5}
        ]
      }));

      expect(itemSelector({id: 5})(store.getState()).seen).toBe(true);
    });

    it('takes collection actions for own item', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield take('PUBLISH');
          yield call(spy);
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5, title: 'Some post'}
        ]
      }));
      store.dispatch({
        type: 'PUBLISH',
        meta: {
          collectionName: 'posts',
          itemId: 5
        }
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('does not take collection actions for other item', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield take('PUBLISH');
          yield call(spy);
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5, title: 'Some post'}
        ]
      }));
      store.dispatch({
        type: 'PUBLISH',
        meta: {
          collectionName: 'posts',
          itemId: 6
        }
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('takes non collection actions', () => {
      const spy = sinon.spy();

      const store = createStoreWithCollectionSaga({
        itemSaga: function* () {
          yield take('GLOBAL');
          yield call(spy);
        }
      });

      store.dispatch(reset({
        collectionName: 'posts',
        items: [
          {id: 5, title: 'Some post'}
        ]
      }));
      store.dispatch({
        type: 'GLOBAL'
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});
