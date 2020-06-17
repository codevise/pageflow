import {usePlayerState, getInitialPlayerState} from 'frontend/MediaPlayer';
import {renderHookInEntry} from 'support';
import TestRenderer from 'react-test-renderer';

describe('usePlayerState', () => {
  it('return player initial state and action function', () => {
    const {result} = renderHookInEntry(() => usePlayerState());
    let [state, action] = result.current;

    expect(state).toEqual(getInitialPlayerState());
    expect(action).toBeInstanceOf(Object);
    expect(action.play).toBeInstanceOf(Function);
    expect(action.discardMediaElementId).toBeInstanceOf(Function);
  });

  it('returns userIdle false initially', () => {
    const {result} = renderHookInEntry(() => usePlayerState());
    const [state] = result.current;

    expect(state.userIdle).toBe(false);
  });

  describe('actions updates the player state', () => {

    it('play action sets state shouldPlay to true', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.play());
      const [nextState,] = result.current;

      expect(nextState.shouldPlay).toBe(true);
    });

    it('playing action sets state isPlaying to true', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.playing());
      const [nextState,] = result.current;

      expect(nextState.isPlaying).toBe(true);
    });

    it('playFailed action sets state playFailed to true', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.playFailed());
      const [nextState,] = result.current;

      expect(nextState.playFailed).toBe(true);
    });

    it('resets playFailed action on play', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.playFailed());
      const [nextState,] = result.current;

      expect(nextState.playFailed).toBe(true);

      TestRenderer.act(()=>actions.play());
      const [newState,] = result.current;

      expect(newState.playFailed).toBe(false);
    });

    it('pause action sets state shouldPause to true and shouldPlay to false', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.pause());
      const [nextState,] = result.current;

      expect(nextState.shouldPause).toBe(true);
      expect(nextState.shouldPlay).toBe(false);
    });

    it('leaves shouldPlay true on paused action during buffer underuns', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>{
        actions.play();
        actions.bufferUnderrun();
        actions.paused();
      });
      const [nextState,] = result.current;

      expect(nextState.shouldPlay).toBe(true);
    });

    it('progress action updates bufferedEnd', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.progress(40));
      const [nextState,] = result.current;

      expect(nextState.bufferedEnd).toBe(40);
    });

    it('metaDataLoaded action updates duration', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.metaDataLoaded(0, 30));
      const [nextState,] = result.current;

      expect(nextState.duration).toBe(30);
    });

    it('ended action resets isPlaying and shouldPlay to false', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      TestRenderer.act(()=>actions.ended());
      const [nextState,] = result.current;

      expect(nextState.isPlaying).toBe(false);
      expect(nextState.shouldPlay).toBe(false);
    });

    it('updates volume factor and fade duration on changeVolumeFactor action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.changeVolumeFactor(0.2, 500));
      const [nextState,] = result.current;

      expect(nextState.volumeFactor).toBe(0.2);
      expect(nextState.volumeFactorFadeDuration).toBe(500);
    });

    it('sets userIdle to true on USER_IDLE action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.userIdle());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(true);
    });

    it('sets userIdle to false on USER_INTERACTION action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.userIdle());
      TestRenderer.act(() => actions.userInteraction());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userIdle to false on PLAYING action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.userIdle());
      TestRenderer.act(() => actions.playing());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userIdle to false on FOCUS_ENTERED_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.userIdle());
      TestRenderer.act(() => actions.focusEnteredControls());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userIdle to false on FOCUS_LEFT_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.userIdle());
      TestRenderer.act(() => actions.focusLeftControls());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userHoveringControls to true on CONTROLS_ENTERED action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.controlsEntered());
      const [nextState,] = result.current;

      expect(nextState.userHoveringControls).toBe(true);
    });

    it('sets userHoveringControls to false on CONTROLS_LEFT action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.controlsEntered());
      TestRenderer.act(() => actions.controlsLeft());
      const [nextState,] = result.current;

      expect(nextState.userHoveringControls).toBe(false);
    });

    it('sets focusInsideControls to true on FOCUS_ENTERED_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.focusEnteredControls());
      const [nextState,] = result.current;

      expect(nextState.focusInsideControls).toBe(true);
    });

    it('sets focusInsideControls to false on FOCUS_LEFT_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      TestRenderer.act(() => actions.focusEnteredControls());
      TestRenderer.act(() => actions.focusLeftControls());
      const [nextState,] = result.current;

      expect(nextState.focusInsideControls).toBe(false);
    });
  });
});
