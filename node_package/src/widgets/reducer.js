import {LOAD} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case LOAD:
    return action.payload.widgets;

  default:
    return state;
  }
}
