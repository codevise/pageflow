import {init} from './actions';
import reducer from './reducer';

export default {
  init({site, dispatch}) {
    dispatch(init(site));
  },

  createReducers() {
    return {site: reducer};
  }
};
