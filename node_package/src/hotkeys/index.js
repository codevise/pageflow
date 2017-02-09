import {SPACE, TAB} from 'utils/keyCodes';
import {space, tab} from './actions';

export default {
  init({isServerSide, window, getState, dispatch}) {
    if (isServerSide) { return; }

    window.addEventListener('keydown', event => {
      const currentPageId = getState().currentPageId;

      if (event.keyCode == SPACE) {
        dispatch(space({currentPageId}));
      }
      else if (event.keyCode == TAB) {
        dispatch(tab({currentPageId}));
      }
    });
  }
};
