import {ACCEPT_ALL, DENY_ALL, REQUEST, SAVE} from './actions';

export default function() {
  const initialState = {
    uiVisible: false,
    requestedVendors: []
  };

  return function(state = initialState, action) {
    switch (action.type) {
    case REQUEST:
      return {
        requestedVendors: action.payload.vendors,
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
    case SAVE:
      return {
        uiVisible: false
      };
    default:
      return state;
    }
  };
}
