import {LOAD, UPDATE} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case LOAD:
    return action.payload.settings;

  default:
    return state;
  }
}
