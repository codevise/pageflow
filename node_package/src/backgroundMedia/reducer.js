import {MUTE, UNMUTE} from './actions';

const initialState = {
  muted: false
};

export default function(state = initialState, action) {
  switch (action.type) {
  case MUTE:
    return {
      muted: true
    };
  case UNMUTE:
    return {
      muted: false
    };
  default:
    return state;
  }
}
