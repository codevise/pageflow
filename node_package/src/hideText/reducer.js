import {ACTIVATE, DEACTIVATE} from './actions';
import {PAGE_CHANGE} from 'current/actions';

const initialState = {
  isActive: false,
  hasBeenActive: false
};

export default function(state = initialState, action) {
  switch (action.type) {
  case ACTIVATE:
    return {
      isActive: true,
      hasBeenActive: true
    };
  case DEACTIVATE:
    return {
      ...state,
      isActive: false
    };
  case PAGE_CHANGE:
    return {
      ...state,
      hasBeenActive: false
    };
  default:
    return state;
  }
}
