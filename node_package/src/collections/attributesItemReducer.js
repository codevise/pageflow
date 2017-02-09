import {ADD, CHANGE} from './actions';

export default function attributesItemReducer(state = {}, action) {
  switch (action.type) {
  case ADD:
  case CHANGE:
    return action.payload.attributes;

  default:
    return state;
  }
}
