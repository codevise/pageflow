import React from 'react';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';

import {render as testingLibraryRender} from '@testing-library/react'
import {media} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';
import {EventContext} from 'frontend/useEventContextData';

describe('MediaPlayer', () => {
  useFakeMedia();

  function getAudioSources() {
    return [
      {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
      {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
      {type: 'audio/mp3', src: 'http://example.com/example.mp3'}
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

  it('supports appending a suffix to source urls', () => {
    render(<MediaPlayer {...requiredProps()}
                        sourceUrlSuffix="?test"
                        sources={getVideoSources()} />);

    expect(media.getPlayer).toHaveBeenCalledWith(
      [
        expect.objectContaining({src: expect.stringMatching(/example.mp4\?test$/)}),
      ],
      expect.anything()
    );
  });

  it('it passes data from EventContext to getPlayer as media events context data', () => {
    const eventContextData = {some: 'data'};

    render(<MediaPlayer {...requiredProps()}
                        type={'video'}
                        sources={getVideoSources()} />,
           {
             wrapper: ({children}) =>
               <EventContext.Provider value={eventContextData}>{children}</EventContext.Provider>
           });

    expect(media.getPlayer).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        mediaEventsContextData: eventContextData
      }
    ));
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

  it('sets initial current time on loadedmetadata event according to playerState', () => {
    let state = {
      ...getInitialPlayerState(),
      currentTime: 5
    };
    const {getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    player.trigger('loadedmetadata');

    expect(player.currentTime).toHaveBeenCalledWith(5);
  });

  it('does not set current time before loadedmetadata event', () => {
    let state = {
      ...getInitialPlayerState(),
      currentTime: 5
    };
    const {getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    expect(player.currentTime).not.toHaveBeenCalledWith(expect.anything());
  });

  it('does not set current time on loadedmetadata event after component unmounted', () => {
    let state = {
      ...getInitialPlayerState(),
      currentTime: 5
    };
    const {getPlayer, unmount} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();
    unmount();
    player.trigger('loadedmetadata');

    expect(player.currentTime).not.toHaveBeenCalledWith(expect.anything());
  });

  it('saves media element id on loadedmetadata event', () => {
    const saveMediaElementIdAction = jest.fn();
    const actions = {
      ...getPlayerActions(),
      saveMediaElementId: saveMediaElementIdAction
    };

    const {getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          filePermaId={5}
                          playerActions={actions} />);
    const player = getPlayer();

    player.trigger('loadedmetadata');

    expect(saveMediaElementIdAction).toHaveBeenCalledWith('fake-player-5');
  });

  it('does save media element id before loadedmetadata event', () => {
    const saveMediaElementIdAction = jest.fn();
    const actions = {
      ...getPlayerActions(),
      saveMediaElementId: saveMediaElementIdAction
    };

    render(<MediaPlayer {...requiredProps()}
                        sources={getVideoSources()}
                        filePermaId={5}
                        playerActions={actions} />);

    expect(saveMediaElementIdAction).not.toHaveBeenCalled();
  });

  it('does save media element id on loadedmetadata event after component unmounted', () => {
    const saveMediaElementIdAction = jest.fn();
    const actions = {
      ...getPlayerActions(),
      saveMediaElementId: saveMediaElementIdAction
    };

    const {getPlayer, unmount} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          filePermaId={5}
                          playerActions={actions} />);
    const player = getPlayer();
    unmount();
    player.trigger('loadedmetadata');

    expect(saveMediaElementIdAction).not.toHaveBeenCalled();
  });
});
