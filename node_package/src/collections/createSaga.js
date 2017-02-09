import {isItemAction, getItemIdFromItemAction, ensureItemActionId} from './itemActionHelpers';
import {addItemScope} from './itemScopeHelpers';

import {select, fork, cancel, call} from 'redux-saga/effects';
import {takeEvery, runSaga} from 'redux-saga';

import createItemsSelector from './createItemsSelector';
import {RESET, ADD, REMOVE} from './actions';

export default function(collectionName, {itemSaga, middleware}) {
  const itemsSelector = createItemsSelector(collectionName);

  return saga;

  function* saga() {
    const runningItemSagas = {};

    yield takeEvery([RESET, ADD, REMOVE],
                    syncItemSagas, runningItemSagas);
  }

  function* syncItemSagas(runningItemSagas) {
    const items = yield select(itemsSelector);

    yield* cancelStaleItemSagas(items, runningItemSagas);
    yield* forkNewItemSagas(items, runningItemSagas);
  }

  function* cancelStaleItemSagas(items, runningItemSagas) {
    yield Object.keys(runningItemSagas).map(runningItemId => {
      if (!(runningItemId in items)) {
        return cancel(runningItemSagas[runningItemId]);
      }
    });
  }

  function* forkNewItemSagas(items, runningItemSagas) {
    const tasks = yield Object.keys(items).map(itemId => {
      if (!runningItemSagas[itemId]) {
        return fork(runItemSaga, parseInt(itemId, 10));
      }
    });

    Object.keys(items).forEach((key, index) => {
      if (!runningItemSagas[key]) {
        runningItemSagas[key] = tasks[index];
      }
    });
  }

  function* runItemSaga(itemId) {
    const task = runSaga(itemSaga(), {
      subscribe(callback) {
        return middleware.subscribe(action => {
          if (!isItemAction(action, collectionName) ||
              getItemIdFromItemAction(action) == itemId) {

            callback(action);
          }
        });
      },

      dispatch(action) {
        ensureItemActionId(action, collectionName, itemId);
        middleware.dispatch(action);
      },

      getState() {
        return addItemScope(middleware.getState(), collectionName, itemId);
      }
    });

    try {
      yield call(() => task.done);
    }
    finally {
      task.cancel();
    }
  }
}

export function createMiddleware() {
  return function middleware({getState, dispatch}) {
    const sagaEmitter = emitter();

    middleware.getState = getState;
    middleware.dispatch = dispatch;
    middleware.subscribe = sagaEmitter.subscribe;

    return next => action => {
      const result = next(action);

      sagaEmitter.emit(action);

      return result;
    };
  };
}

function emitter() {
  const subscribers = [];

  function subscribe(sub) {
    subscribers.push(sub);
    return () => remove(subscribers, sub);
  }

  function emit(item) {
    const arr = subscribers.slice();
    for (var i = 0, len =  arr.length; i < len; i++) {
      arr[i](item);
    }
  }

  return {
    subscribe,
    emit
  };
}

function remove(array, item) {
  const index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
