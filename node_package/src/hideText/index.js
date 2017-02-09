import watch from './watch';
import hideText from './reducer';

export default {
  init({isServerSide, hideText, dispatch}) {
    if (!isServerSide) {
      watch(hideText, dispatch);
    }
  },

  createReducers() {
    return {hideText};
  }
};

export const reducers = {
  hideText
};

export {
  watch
};
