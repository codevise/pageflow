import {usePlayerState, getInitialPlayerState} from 'frontend/MediaPlayer';
import {renderHookInEntry} from 'support';
import {act} from '@testing-library/react';

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
      act(() => actions.play());
      const [nextState,] = result.current;

      expect(nextState.shouldPlay).toBe(true);
    });

    it('playing action sets state isPlaying to true', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.playing());
      const [nextState,] = result.current;

      expect(nextState.isPlaying).toBe(true);
    });

    it('playFailed action sets state playFailed to true', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.playFailed());
      const [nextState,] = result.current;

      expect(nextState.playFailed).toBe(true);
    });

    it('resets playFailed action on play', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.playFailed());
      const [nextState,] = result.current;

      expect(nextState.playFailed).toBe(true);

      act(() => actions.play());
      const [newState,] = result.current;

      expect(newState.playFailed).toBe(false);
    });

    it('leaves shouldPlay true on paused action during buffer underuns', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => {
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
      act(() => actions.progress(40));
      const [nextState,] = result.current;

      expect(nextState.bufferedEnd).toBe(40);
    });

    it('metaDataLoaded action updates duration', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.metaDataLoaded(0, 30));
      const [nextState,] = result.current;

      expect(nextState.duration).toBe(30);
    });

    it('ended action resets isPlaying and shouldPlay to false', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.ended());
      const [nextState,] = result.current;

      expect(nextState.isPlaying).toBe(false);
      expect(nextState.shouldPlay).toBe(false);
    });

    it('resets isPlaying to false when player is discareded', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.playing());
      act(() => actions.discardMediaElementId());
      const [nextState,] = result.current;

      expect(nextState.isPlaying).toBe(false);
    });

    it('updates volume factor and fade duration on changeVolumeFactor action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.changeVolumeFactor(0.2, 500));
      const [nextState,] = result.current;

      expect(nextState.volumeFactor).toBe(0.2);
      expect(nextState.volumeFactorFadeDuration).toBe(500);
    });

    it('sets userIdle to true on USER_IDLE action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.userIdle());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(true);
    });

    it('sets userIdle to false on USER_INTERACTION action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.userIdle());
      act(() => actions.userInteraction());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userIdle to false on PLAYING action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.userIdle());
      act(() => actions.playing());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userIdle to false on FOCUS_ENTERED_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.userIdle());
      act(() => actions.focusEnteredControls());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userIdle to false on FOCUS_LEFT_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.userIdle());
      act(() => actions.focusLeftControls());
      const [nextState,] = result.current;

      expect(nextState.userIdle).toBe(false);
    });

    it('sets userHoveringControls to true on MOUSE_ENTERED_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.mouseEnteredControls());
      const [nextState,] = result.current;

      expect(nextState.userHoveringControls).toBe(true);
    });

    it('sets userHoveringControls to false on MOUSE_LEFT_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.mouseEnteredControls());
      act(() => actions.mouseLeftControls());
      const [nextState,] = result.current;

      expect(nextState.userHoveringControls).toBe(false);
    });

    it('sets focusInsideControls to true on FOCUS_ENTERED_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.focusEnteredControls());
      const [nextState,] = result.current;

      expect(nextState.focusInsideControls).toBe(true);
    });

    it('sets focusInsideControls to false on FOCUS_LEFT_CONTROLS action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.focusEnteredControls());
      act(() => actions.focusLeftControls());
      const [nextState,] = result.current;

      expect(nextState.focusInsideControls).toBe(false);
    });

    it('sets userHovering to true on MOUSE_ENTERED action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.mouseEntered());
      const [nextState,] = result.current;

      expect(nextState.userHovering).toBe(true);
    });

    it('sets userHovering to false on MOUSE_LEFT action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [, actions] = result.current;
      act(() => actions.mouseEntered());
      act(() => actions.mouseLeft());
      const [nextState,] = result.current;

      expect(nextState.userHovering).toBe(false);
    });
  });

  describe('tracking unplayed state', () => {
    it('is unplayed initially', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [nextState,] = result.current;

      expect(nextState.unplayed).toBe(true);
    });

    it('is no longer unplayed after play action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.play());
      const [nextState,] = result.current;

      expect(nextState.unplayed).toBe(false);
    });

    it('becomes unplayed again when video ends to make it return to its initial look', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.play());
      act(() => actions.ended());
      const [nextState,] = result.current;

      expect(nextState.unplayed).toBe(true);
    });
  });

  describe('tracking dataLoaded state', () => {
    it('is false initially', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [nextState,] = result.current;

      expect(nextState.dataLoaded).toBe(false);
    });

    it('becomed true on dataLoaded action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.dataLoaded());
      const [nextState,] = result.current;

      expect(nextState.dataLoaded).toBe(true);
    });

    it('becomes false again when player is disposed', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.dataLoaded());
      act(() => actions.discardMediaElementId());
      const [nextState,] = result.current;

      expect(nextState.dataLoaded).toBe(false);
    });
  });

  describe('tracking how media was last controlled', () => {
    it('supports via option for play action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.play({via: 'playPauseButton'}));
      const [nextState,] = result.current;

      expect(nextState.lastControlledVia).toBe('playPauseButton');
    });

    it('supports via option for playAndFadeIn action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.playAndFadeIn(1000, {via: 'playPauseButton'}));
      const [nextState,] = result.current;

      expect(nextState.lastControlledVia).toBe('playPauseButton');
    });

    it('supports via option for pause action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.pause({via: 'playPauseButton'}));
      const [nextState,] = result.current;

      expect(nextState.lastControlledVia).toBe('playPauseButton');
    });

    it('supports via option for fadeOutAndPause action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.fadeOutAndPause(1000, {via: 'playPauseButton'}));
      const [nextState,] = result.current;

      expect(nextState.lastControlledVia).toBe('playPauseButton');
    });

    it('resets lastControlledVia on ended action', () => {
      const {result} = renderHookInEntry(() => usePlayerState());
      const [,actions] = result.current;
      act(() => actions.play({via: 'playPauseButton'}));
      act(() => actions.ended());
      const [nextState,] = result.current;

      expect(nextState.lastControlledVia).toBeNull();
    });
  });
});
