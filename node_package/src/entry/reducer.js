import {UPDATE, READY} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case UPDATE:
    return {...state, ...action.payload.entry};
  case READY:
    return {...state, isReady: true};
  default:
    return state;
  }
}
