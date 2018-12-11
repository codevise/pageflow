import {UPDATE} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case UPDATE:
    return action.payload.entry;
  default:
    return state;
  }
}
