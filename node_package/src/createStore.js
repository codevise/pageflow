/*global process*/
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {call} from 'redux-saga/effects';

export default function(reduxModules, options) {
  const sagaMiddleware = createSagaMiddleware();
  let sagas = [];
  let middlewares = [];

  if (!options.isServerSide) {
    ({sagas, middlewares} = createSagasAndMiddlewares(reduxModules, options));
  }

  const store = createStore(createReducer(reduxModules, options), {},
                            devToolsInDevelopment(applyMiddleware(
                              sagaMiddleware,
                              ...middlewares
                            )));

  sagaMiddleware.run(function*() {
    yield sagas;
  });

  init(reduxModules, {...options, dispatch: store.dispatch, getState: store.getState});

  return store;
}

export function createReducer(reduxModules, options) {
  const reducers = reduxModules.reduce((result, reduxModule) => {
    return reduxModule.createReducers ? {
      ...result,
      ...reduxModule.createReducers(options)
    } : result;
  }, {});

  return Object.keys(reducers).length ? combineReducers(reducers) : (state, action) => state;
}

function createSagasAndMiddlewares(reduxModules, options) {
  const sagas = [];
  const middlewares = [];

  reduxModules.forEach(reduxModule => {
    let middleware;

    if (reduxModule.createMiddleware) {
      middleware = reduxModule.createMiddleware(options);
      middlewares.push(middleware);
    }

    if (reduxModule.createSaga) {
      sagas.push(call(reduxModule.createSaga({...options, middleware})));
    }
  });

  return {
    sagas, middlewares
  };
}

function init(reduxModules, options) {
  reduxModules.forEach(reduxModule => {
    if (reduxModule.init) {
      reduxModule.init(options);
    }
  });
}

function devToolsInDevelopment(enhancer) {
  if ((typeof process === 'undefined' ||
       process.env.NODE_ENV !== 'production') &&
      typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined') {

    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(enhancer);
  }
  else {
    return enhancer;
  }
}
