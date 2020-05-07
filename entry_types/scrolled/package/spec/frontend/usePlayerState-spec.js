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
  });

});