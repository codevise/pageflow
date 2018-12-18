import {INIT, READY} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case INIT:
    return {...state, slug: action.payload.slug};
  case READY:
    return {...state, isReady: true};
  default:
    return state;
  }
}
