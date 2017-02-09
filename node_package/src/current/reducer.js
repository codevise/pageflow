import {PAGE_CHANGE} from './actions';

export default function(state = null, action) {
  switch (action.type) {
  case PAGE_CHANGE:
    return action.payload.id;
  default:
    return state;
  }
}
