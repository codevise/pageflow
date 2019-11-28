import {SET_BOTTOM} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case SET_BOTTOM:
    return {...state, bottom: action.payload.value};
  default:
    return state;
  }
}
