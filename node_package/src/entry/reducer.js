import {INIT} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case INIT:
    return {slug: action.payload.slug};
  default:
    return state;
  }
}
