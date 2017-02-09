import {init} from './actions';
import reducer from './reducer';

export default {
  init({slug, dispatch}) {
    dispatch(init({slug}));
  },

  createReducers() {
    return {entry: reducer};
  }
};
