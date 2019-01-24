import {init} from './actions';
import reducer from './reducer';

export default {
  createReducers() {
    return {theme: reducer};
  },

  init({dispatch, isServerSide}) {
    if (!isServerSide) {
      const probe = document.getElementById('theme_probe-main_color');

      dispatch(init({
        mainColor: window.getComputedStyle(probe)['background-color']
      }));
    }
  }
};
