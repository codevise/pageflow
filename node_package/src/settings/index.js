import reducer from './reducer';
import {load, UPDATE} from './actions';

import {takeEvery} from 'redux-saga';
import {call} from 'redux-saga/effects';

export default {
  init({isServerSide, settings, dispatch}) {
    if (!isServerSide) {
      dispatch(load({settings: settings.toJSON()}));
      settings.on('change', () => dispatch(load({settings: settings.toJSON()})));
    }
  },

  createReducers() {
    return {settings: reducer};
  },

  createSaga({settings}) {
    return function*() {
      yield takeEvery(UPDATE, function*(action) {
        yield call([settings, settings.set],
                   action.payload.property,
                   action.payload.value);
      });
    };
  }
};

export const reducers = {settings: reducer};

export function createSaga(model) {
  return function* saga() {
    yield takeEvery(UPDATE, function*(action) {
      yield call([model, model.set],
                 action.payload.property,
                 action.payload.value);
    });
  };
}

export function watch(model, dispatch) {
  dispatch(load({settings: model.toJSON()}));
  model.on('change', () => dispatch(load({settings: model.toJSON()})));
}
