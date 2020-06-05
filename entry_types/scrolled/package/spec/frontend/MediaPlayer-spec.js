import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import 'support/fakeBrowserFeatures';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';

import MutedContext from 'frontend/MutedContext';
import {render as testingLibraryRender} from '@testing-library/react'
import {media} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';

describe('MediaPlayer', () => {
  useFakeMedia();

  function getAudioSources() {
    return [
      {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
      {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
      {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
    ];
  }

  function getVideoSources({basename = 'example'} = {}) {
    return [
      {type: 'video/mp4', src: `http://example.com/${basename}.mp4`},
    ];
  }

  function requiredProps() {
    return {
      type: 'video',
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  function render(ui, options) {
    return testingLibraryRender(ui, {
      ...options,
      queries: fakeMediaRenderQueries
    });
  }

  it('does not render player without sources', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()} />);

    expect(queryPlayer()).toBeNull();
  });

  it('does not render player when isPrepared is false', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()}
                                              isPrepared={false}
                                              sources={getAudioSources()} />);

    expect(queryPlayer()).toBeNull();
  });

  it('renders audio player when sources are present', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()}
                                              type={'audio'}
                                              sources={getAudioSources()} />);

    expect(queryPlayer()).toBeDefined();
    expect(media.getPlayer).toHaveBeenCalledWith(getAudioSources(),
                                                 expect.objectContaining({tagName: 'audio'}))
  });

  it('renders video player when sources are present', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()}
                                              type={'video'}
                                              sources={getVideoSources()} />);

    expect(queryPlayer()).toBeDefined();
    expect(media.getPlayer).toHaveBeenCalledWith(getVideoSources(),
                                                 expect.objectContaining({tagName: 'video'}))
  });

  it('does not request new Player for same sources', () => {
    const {rerender} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()} />);
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()} />);

    expect(media.getPlayer).toHaveBeenCalledTimes(1);
  });

  it('requests new Player on sources change', () => {
    const {rerender} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources({basename: 'example'})} />);
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources({basename: 'other'})} />);

    expect(media.getPlayer).toHaveBeenCalledTimes(2);
  });

  it('calls play on player when shouldPlay changes to true in playerState', () => {
    let state = getInitialPlayerState();
    const {rerender, getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    state = {
      ...state,
      shouldPlay: true
    };
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);

    expect(player.playOrPlayOnLoad).toHaveBeenCalledTimes(1);
  });

  it('calls playAndFadeIn on player when shouldPlay changes to true and fadeDuration is present', () => {
    let state = getInitialPlayerState();
    const {rerender, getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    state = {
      ...state,
      fadeDuration: 100,
      shouldPlay: true
    };
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);

    expect(player.playAndFadeIn).toHaveBeenCalledTimes(1);
    expect(player.playAndFadeIn).toHaveBeenCalledWith(100);
  });

  it('calls pause on player when isPlaying and shouldPlay changes to false in playerState', () => {
    let state = {
      ...getInitialPlayerState(),
      isPlaying: true,
      shouldPlay: true
    };
    const {rerender, getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    state = {
      ...state,
      shouldPlay: false
    };
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);

    expect(player.pause).toHaveBeenCalledTimes(1);
  });

  it('sets initial volume factor accoring to playerState', () => {
    let state = {
      ...getInitialPlayerState(),
      volumeFactor: 0.5
    };
    const {getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    expect(player.changeVolumeFactor).toHaveBeenCalledWith(0.5, 0);
  });

  it('calls changeVolumeFactor on player when volumeFactor changes in playerState', () => {
    let state = getInitialPlayerState();
    const {rerender, getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    state = {
      ...state,
      volumeFactor: 0.2,
      volumeFactorFadeDuration: 500
    };
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);

    expect(player.changeVolumeFactor).toHaveBeenCalledWith(0.2, 500);
  });

  it('causes player to play when autoplay is set to true and state is active', () => {
    const {rerender, getPlayer} = render(
      <MutedContext.Provider value={{muted: true}}>
        <MediaPlayer {...requiredProps()} sources={getVideoSources()} />
      </MutedContext.Provider>
    );
    const player = getPlayer();

    rerender(
      <MutedContext.Provider value={{muted: true}}>
        <MediaPlayer {...requiredProps()} sources={getVideoSources()} state={'active'} autoplay={true} />
      </MutedContext.Provider>
    );

    expect(player.playOrPlayOnLoad).toHaveBeenCalled();
  });
});
