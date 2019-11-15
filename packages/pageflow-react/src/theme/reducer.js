import {INIT} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case INIT:
    return action.payload;
  default:
    return state;
  }
}
