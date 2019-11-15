import {init} from './actions';
import reducer from './reducer';
import {camelize} from 'utils';

export default {
  createReducers() {
    return {pageTypes: reducer};
  },

  init({pageTypesSeed, dispatch}) {
    dispatch(init({pageTypes: camelize.deep(pageTypesSeed)}));
  }
};
