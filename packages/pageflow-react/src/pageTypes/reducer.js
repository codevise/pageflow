import {INIT} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case INIT:
    return action.payload.pageTypes;
  default:
    return state;
  }
}
