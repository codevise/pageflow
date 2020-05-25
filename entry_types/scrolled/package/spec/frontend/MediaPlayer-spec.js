import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import 'support/fakeBrowserFeatures';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import MutedContext from 'frontend/MutedContext';
import {render} from '@testing-library/react'
import {media} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';

describe('MediaPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  let getAudioSources = () => {
    return [ 
      {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
      {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
      {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
    ];
  }
  let getVideoSources = () => {
    return [ 
      {type: 'video/mp4', src: 'http://example.com/example.mp4'},
    ];
  }

  it('do not renders audio tag without sources', () => {
    const {container} = render(<MediaPlayer type={'audio'} />);
    expect(container.querySelector('audio')).toBeNull();
  });

  it('renders audio tag for audio type sources', () => {
    let state = getInitialPlayerState();
    const {container} = render(<MediaPlayer type={'audio'} sources={getAudioSources()} playerState={state} playerActions={getPlayerActions()} />);
    
    expect(container.querySelector('audio')).toBeDefined();
  });

  it('renders video tag for video type sources', () => {
    let state = getInitialPlayerState();
    const {container} = render(<MediaPlayer type={'video'} sources={getAudioSources()} playerState={state} playerActions={getPlayerActions()} />);
    
    expect(container.querySelector('video')).toBeDefined();
  });

  it('do not requests new Player for same sources', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    let state = getInitialPlayerState();
    let playerActions = getPlayerActions();
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);
    rerender(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);
  });

  it('requests new Player on sources change', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');
    let state = getInitialPlayerState();
    let playerActions = getPlayerActions();
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    expect(spyMedia).toHaveBeenCalledTimes(1);
    let videoSources = getVideoSources();
    videoSources[0].src = 'example.mp4';
    rerender(<MediaPlayer type={'video'} sources={videoSources} playerState={state} playerActions={playerActions} />);
    expect(spyMedia).toHaveBeenCalledTimes(2);
  });

  it('calls play on player when shouldPlay changes to true in playerState', () => {
    let state = getInitialPlayerState();
    let playerActions = getPlayerActions();
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    
    state = getInitialPlayerState();
    state.shouldPlay = true;

    let spyPlay = jest.spyOn(media.players['0'], 'play');
    rerender(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    expect(spyPlay).toHaveBeenCalledTimes(1);
  });

  it('calls playAndFadeIn on player when shouldPlay changes to true and fadeDuration is present', () => {
    let state = getInitialPlayerState();
    let playerActions = getPlayerActions();
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    
    state = getInitialPlayerState();
    state.fadeDuration = 100;
    state.shouldPlay = true;
    
    let spyPlayAndFadeIn = jest.spyOn(media.players['0'], 'playAndFadeIn');
    rerender(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    expect(spyPlayAndFadeIn).toHaveBeenCalledTimes(1);
    expect(spyPlayAndFadeIn).toHaveBeenCalledWith(100);
  });

  it('calls pause on player when isPlaying and shouldPlay changes to false in playerState', () => {
    let state = getInitialPlayerState();
    state.isPlaying = true;
    state.shouldPlay = true;
    let playerActions = getPlayerActions();
    const {rerender} = render(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    
    state = getInitialPlayerState();
    state.isPlaying = true;
    state.shouldPlay = false;

    let spyPause = jest.spyOn(media.players['0'], 'pause');
    rerender(<MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />);
    expect(spyPause).toHaveBeenCalledTimes(1);
  });

  it('causes player to play when autoplay is set to true and state is active', () => {
    let state = getInitialPlayerState();
    let playerActions = getPlayerActions();
    
    const {rerender} = render(
      <MutedContext.Provider value={{muted: true}}>
        <MediaPlayer type={'video'} sources={getVideoSources()} playerState={state} playerActions={playerActions} />
      </MutedContext.Provider>
     );
    
    let spyPlay = jest.spyOn(media.players['0'], 'playOrPlayOnLoad');
        
    rerender(
      <MutedContext.Provider value={{muted: true}}>
        <MediaPlayer type={'video'} sources={getVideoSources()} state={'active'} autoplay={true} playerState={state} playerActions={playerActions} />
      </MutedContext.Provider>
    );
    expect(spyPlay).toHaveBeenCalled();
  })

});
