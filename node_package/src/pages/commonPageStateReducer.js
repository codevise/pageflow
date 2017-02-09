import {
  PAGE_DID_PRELOAD, PAGE_DID_PREPARE, PAGE_DID_UNPREPARE,
  PAGE_WILL_ACTIVATE, PAGE_DID_ACTIVATE, PAGE_WILL_DEACTIVATE
} from './actions';

import {combineReducers} from 'redux';

export default combineReducers({
  isPreloaded,
  isPrepared,
  isActive,
  isActivated,
  initialScrollerPosition
});

function isPreloaded(state = false, action) {
  switch (action.type) {
  case PAGE_DID_PRELOAD:
    return true;

  default:
    return state;
  }
}

function isPrepared(state = false, action) {
  switch (action.type) {
  case PAGE_DID_PREPARE:
  case PAGE_WILL_ACTIVATE:
    return true;

  case PAGE_DID_UNPREPARE:
    return false;

  default:
    return state;
  }
}

function isActive(state = false, action) {
  switch (action.type) {
  case PAGE_WILL_ACTIVATE:
    return true;

  case PAGE_WILL_DEACTIVATE:
    return false;

  default:
    return state;
  }
}

function isActivated(state = false, action) {
  switch (action.type) {
  case PAGE_DID_ACTIVATE:
    return true;

  case PAGE_WILL_DEACTIVATE:
    return false;

  default:
    return state;
  }
}

function initialScrollerPosition(state = null, action) {
  switch (action.type) {
  case PAGE_WILL_ACTIVATE:
    return action.payload.position || 'top';
  case PAGE_WILL_DEACTIVATE:
    return null;
  default:
    return state;
  }
}
