import React from 'react';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';

import {render as testingLibraryRender, queries} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {media} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';
import {EventContext} from 'frontend/useEventContextData';
import {StaticPreview} from 'frontend/useScrollPositionLifecycle';

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
      queries: {
        ...queries,
        ...fakeMediaRenderQueries
      }
    });
  }

  it('does not render player without sources', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()} />);

    expect(queryPlayer()).toBeNull();
  });

  it('does not render player when load prop is "none"', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()}
                                              load="none"
                                              sources={getAudioSources()} />);

    expect(queryPlayer()).toBeNull();
  });

  it('does not render player when load prop is "poster"', () => {
    const {queryPlayer} = render(<MediaPlayer {...requiredProps()}
                                              load="poster"
                                              sources={getVideoSources()} />);

    expect(queryPlayer()).toBeNull();
  });

  it('renders poster image when load prop is "auto"', () => {
    const {getByRole} = render(<MediaPlayer {...requiredProps()}
                                            load="auto"
                                            posterImageUrl="poster.jpg"
                                            sources={getVideoSources()} />);

    expect(getByRole('img')).toHaveAttribute('src', 'poster.jpg');
  });

  it('renders poster image when load prop is "poster"', () => {
    const {getByRole} = render(<MediaPlayer {...requiredProps()}
                                            load="poster"
                                            posterImageUrl="poster.jpg"
                                            sources={getVideoSources()} />);

    expect(getByRole('img')).toHaveAttribute('src', 'poster.jpg');
  });

  it('does not render poster image when load prop is "none"', () => {
    const {queryByRole} = render(<MediaPlayer {...requiredProps()}
                                              load="none"
                                              posterImageUrl="poster.jpg"
                                              sources={getVideoSources()} />);

    expect(queryByRole('img')).toBeNull();
  });

  it('applies object position to poster image', () => {
    const {getByRole} = render(<MediaPlayer {...requiredProps()}
                                            load="poster"
                                            posterImageUrl="poster.jpg"
                                            objectPosition={{x: 50, y: 0}}
                                            sources={getVideoSources()} />);

    expect(getByRole('img')).toHaveStyle('object-position: 50% 0%');
  });

  it('renders only poster image in static preview event when load prop is "auto"', () => {
    const {getByRole, queryPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          load="auto"
                          posterImageUrl="poster.jpg"
                          sources={getVideoSources()} />,
             {wrapper: StaticPreview});

    expect(queryPlayer()).toBeNull();
    expect(getByRole('img')).toHaveAttribute('src', 'poster.jpg');
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

  it('applies object position to player', () => {
    const {getPlayer} = render(<MediaPlayer {...requiredProps()}
                                            type="video"
                                            objectPosition={{x: 50, y: 0}}
                                            sources={getVideoSources()} />);

    expect(getPlayer().getMediaElement()).toHaveStyle('object-position: 50% 0%');
  });

  it('updates object position on player when props change', () => {
    const {getPlayer, rerender} =
      render(<MediaPlayer {...requiredProps()}
                          type="video"
                          objectPosition={{x: 100, y: 100}}
                          sources={getVideoSources()} />);
    rerender(<MediaPlayer {...requiredProps()}
                          type="video"
                          objectPosition={{x: 50, y: 0}}
                          sources={getVideoSources()} />);

    expect(getPlayer().getMediaElement()).toHaveStyle('object-position: 50% 0%');
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

  it('calls play on player when shouldPlay is true in initial playerState', () => {
    let state = {
      ...getInitialPlayerState(),
      shouldPlay: true
    };
    const {getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          playerState={state} />);
    const player = getPlayer();

    expect(player.play).toHaveBeenCalledTimes(1);
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

  it('invoked dataLoaded action on loadeddata event', () => {
    const dataLoadedAction = jest.fn();
    const actions = {
      ...getPlayerActions(),
      dataLoaded: dataLoadedAction
    };

    const {getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getVideoSources()}
                          filePermaId={5}
                          playerActions={actions} />);
    const player = getPlayer();

    player.trigger('loadeddata');

    expect(dataLoadedAction).toHaveBeenCalled();
  });
});
