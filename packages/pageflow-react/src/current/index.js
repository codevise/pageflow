import currentPageId from './reducer';
import watch from './watch';

export default {
  init({isServerSide, events, dispatch}) {
    if (!isServerSide) {
      watch(events, dispatch);
    }
  },

  createReducers() {
    return {currentPageId}
  }
}

export const reducers = {currentPageId};

export {
  watch
};
