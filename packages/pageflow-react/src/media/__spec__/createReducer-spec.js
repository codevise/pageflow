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

  it('sets shouldPlay to true on PLAY', () => {
    const {play} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());

    expect(state.shouldPlay).to.eq(true);
  });

  it('sets shouldPlay to true on PLAYING even if play started playing by itself', () => {
    const {playing} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());

    expect(state.shouldPlay).to.eq(true);
  });

  it('resets shouldPlay to false on PAUSE', () => {
    const {play, pause} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, pause());

    expect(state.shouldPlay).to.eq(false);
  });

  it('sets shouldPlay to false on PAUSED even if player pauses by itself', () => {
    const {play, playing, paused} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, playing());
    state = reducer(state, paused());

    expect(state.shouldPlay).to.eq(false);
  });

  it('resets shouldPlay to false on ENDED', () => {
    const {play, playing, ended} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, playing());
    state = reducer(state, ended());

    expect(state.shouldPlay).to.eq(false);
  });

  it('leaves shouldPlay true on PAUSED action during buffer underuns', () => {
    const {play, paused, bufferUnderrun} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, bufferUnderrun());
    state = reducer(state, paused());

    expect(state.shouldPlay).to.eq(true);
  });

  it('sets shouldPlay to false on PAUSED action again after buffer underun', () => {
    const {play, paused, bufferUnderrun, bufferUnderrunContinue} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, play());
    state = reducer(state, bufferUnderrun());
    state = reducer(state, bufferUnderrunContinue());
    state = reducer(state, paused());

    expect(state.shouldPlay).to.eq(false);
  });


  it('sets isPlaying to true on PLAYING action', () => {
    const {playing} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());

    expect(state.isPlaying).to.eq(true);
  });

  it('resets isPlaying to false on PAUSED action', () => {
    const {playing, paused} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());
    state = reducer(state, paused());

    expect(state.isPlaying).to.eq(false);
  });

  it('resets isPlaying to false on ENDED action', () => {
    const {playing, ended} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());
    state = reducer(state, ended());

    expect(state.isPlaying).to.eq(false);
  });

  it('does not change isPlaying on actions that only intend to play', () => {
    const {paused, play, playAndFadeIn} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, paused());
    state = reducer(state, play());
    state = reducer(state, playAndFadeIn({fadeDuration: 1000}));

    expect(state.isPlaying).to.eq(false);
  });

  it('does not change isPlaying on actions that only intend to pause', () => {
    const {playing, pause, fadeOutAndPause} = actionCreators();
    const reducer = createReducer();
    var state = {};

    state = reducer(state, playing());
    state = reducer(state, pause());
    state = reducer(state, fadeOutAndPause({fadeDuration: 1000}));

    expect(state.isPlaying).to.eq(true);
  });
});
