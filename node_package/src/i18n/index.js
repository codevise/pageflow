import {init} from './actions';
import reducer from './reducer';

export default {
  createReducers() {
    return {i18n: reducer};
  },

  init({locale, dispatch}) {
    dispatch(init({locale}));
  }
};
