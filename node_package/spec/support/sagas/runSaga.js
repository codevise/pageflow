import createSagaMiddleware from 'redux-saga';
import {take} from 'redux-saga/effects';
import {applyMiddleware, createStore as createReduxStore} from 'redux';

import sinon from 'sinon';

export const RETURN_FROM_CALL = 'SAGA_HELPERS__RETURN_FROM_CALL';

export default function(saga, {reducer, initialState = {}, args = []} = {}) {
  const putSpy = sinon.spy();
  const callStubs = [];

  const sagaMiddleware = createSagaMiddleware({
    sagaMonitor: createSagaMonitor(callStubs, putSpy)
  });

  const store = createReduxStore(reducer || (state => state),
                                 initialState,
                                 applyMiddleware(sagaMiddleware));

  let running = false;

  function ensureRunning() {
    if (!running) {
      running = true;
      sagaMiddleware.run(saga, ...args);
    }
  }

  function ensureNotYetRunning() {
    if (running) {
      throw new Error('Saga is already running.');
    }
  }

  return {
    blockOnCall(fn) {
      ensureNotYetRunning();

      callStubs.push({calledFn: fn, stubFn: function*() {
        const action = yield take(action =>
          (action.type == RETURN_FROM_CALL && action.payload.fn == fn)
        );
        return action.payload.result;
      }});

      return this;
    },

    stubCall(fn, result) {
      ensureNotYetRunning();

      callStubs.push({calledFn: fn, stubFn: function() {
        return result;
      }});

      return this;
    },

    run() {
      ensureRunning();
    },

    returnFromCall(fn, result) {
      ensureRunning();
      store.dispatch({
        type: RETURN_FROM_CALL,
        payload: {
          fn,
          result
        }
      });

      return this;
    },

    dispatch(action) {
      ensureRunning();
      store.dispatch(action);
      return this;
    },

    put: putSpy
  };
}

function createSagaMonitor(callStubs, putSpy) {
  return {
    effectTriggered({effect}) {
      if (effect && effect.CALL) {
        callStubs.find(callStub => {
          if (callStub.calledFn === effect.CALL.fn) {
            effect.CALL = {
              fn: callStub.stubFn,
              context: null,
              args: []
            };
          }
        });
      }
    },

    effectResolved() {},

    effectRejected() {},

    effectCancelled() {},

    actionDispatched(action) {
      putSpy(action);
    }
  };
}
