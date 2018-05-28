import {REQUEST, DISMISS} from './actions';

export default function({hasBeenDismissed}) {
  const initialState = {
    dismissed: hasBeenDismissed,
    visible: false
  };

  return function(state = initialState, action) {
    switch (action.type) {
    case REQUEST:
      if (!state.dismissed) {
        return {
          ...state,
          visible: true
        };
      }

      return state;
    case DISMISS:
      return {
        dismissed: true,
        visible: false
      };
    default:
      return state;
    }
  };
}
