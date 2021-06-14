import {ACCEPT_ALL, DENY_ALL, REQUEST} from './actions';

export default function() {
  const initialState = {
    uiVisible: false
  };

  return function(state = initialState, action) {
    switch (action.type) {
    case REQUEST:
      return {
        uiVisible: true
      };
    case ACCEPT_ALL:
      return {
        uiVisible: false
      };
    case DENY_ALL:
      return {
        uiVisible: false
      };
    default:
      return state;
    }
  };
}
