import {INIT} from './actions';

export default function(state = {}, action) {
  switch (action.type) {
  case INIT:
    return {locale: action.payload.locale};
  default:
    return state;
  }
}
