import createReducer from '../createReducer';

import {actionCreators} from '../actions';

import {expect} from 'support/chai';

describe('createReducer creates function that', () => {
  it('handles actions for given media scope', () => {
    const {play} = actionCreators({scope: 'custom'});
    const reducer = createReducer({scope: 'custom'});

    const nextState = reducer({}, play());

    expect(nextState.shouldPlay).to.eq(true);
  });

  it('ignores actions for other media scope', () => {
    const {play} = actionCreators({scope: 'other'});
    const reducer = createReducer({scope: 'custom'});

    const nextState = reducer({}, play());

    expect(nextState.shouldPlay).not.to.eq(true);
  });

  describe('for TIME_UPDATE action', () => {
    it('updates currentTime', () => {
      const {timeUpdate} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({currentTime: 30},
                                timeUpdate({currentTime: 40, duration: 60}));

      expect(nextState.currentTime).to.eq(40);
    });

    it('updates duration', () => {
      const {timeUpdate} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({}, timeUpdate({currentTime: 40, duration: 60}));

      expect(nextState.duration).to.eq(60);
    });
  });

  describe('for PROGRESS action', () => {
    it('updates bufferedEnd', () => {
      const {progress} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({}, progress({bufferedEnd: 40}));

      expect(nextState.bufferedEnd).to.eq(40);
    });
  });

  describe('for META_DATA_LOADED action', () => {
    it('updates duration', () => {
      const {metaDataLoaded} = actionCreators();
      const reducer = createReducer();

      const nextState = reducer({}, metaDataLoaded({duration: 50}));

      expect(nextState.duration).to.eq(50);
    });
  });

  it('sets playFailed to true on PLAY_FAILED action', () => {
    const {playFailed} = actionCreators();
    const reducer = createReducer();

    const nextState = reducer({}, playFailed());

    expect(nextState.playFailed).to.eq(true);
  });

  it('makes state look unplayed again in PLAY_FAILED action', () => {
    const {play, playFailed} = actionCreators();
    const reducer = createReducer();

    let state = {};
    state = reducer(state, play());
    state = reducer(state, playFailed());

    expect(state.shouldPlay).to.eq(false);
    expect(state.unplayed).to.eq(true);
  });

  it('resets playFailed on PLAY action', () => {
    const {play} = actionCreators();
    const reducer = createReducer();

    const nextState = reducer({playFailed: true}, play());

    expect(nextState.playFailed).to.eq(false);
  });
});
