import {init} from './actions';
import reducer from './reducer';

export default {
  init({theming, dispatch}) {
    dispatch(init(theming));
  },

  createReducers() {
    return {theming: reducer};
  }
};
