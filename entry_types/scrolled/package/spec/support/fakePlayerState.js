import {getInitialPlayerState as initialPlayerState} from 'frontend/MediaPlayer/usePlayerState';
import {createActions} from 'frontend/MediaPlayer/playerActions';

export const getInitialPlayerState = () => {
  let state = initialPlayerState();
  state.shouldPrebuffer = false;
  return state;
}

export const getPlayerActions = () => {
  const actions = {
    calls: []
  }

  return Object.keys(createActions(() => {})).reduce((result, action) => {
    result[action] = jest.fn(() => {
      actions.calls.push(action);
    });

    return result;
  }, actions);
}
