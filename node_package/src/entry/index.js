import {init, ready} from './actions';
import reducer from './reducer';

export default {
  init({slug, dispatch, events, isServerSide}) {
    if (!isServerSide) {
      events.once('ready', () =>
        dispatch(ready())
      );
    }

    dispatch(init({slug}));
  },

  createReducers() {
    return {entry: reducer};
  }
};
