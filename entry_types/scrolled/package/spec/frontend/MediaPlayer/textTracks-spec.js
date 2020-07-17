import React from 'react';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';
import {useFakeMedia, fakeMediaRenderQueries} from 'support/fakeMedia';
import {renderHookInEntry} from 'support';
import {act} from '@testing-library/react-hooks'
import {render as testingLibraryRender} from '@testing-library/react'

import {media} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';
import {useTextTracks} from 'frontend/useTextTracks';
import {useFile} from 'entryState';

describe('MediaPlayer', () => {
  useFakeMedia();

  function getAudioSources() {
    return [
      {type: 'audio/ogg', src: 'http://example.com/example.ogg'}
    ];
  }

  function requiredProps() {
    return {
      type: 'audio',
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  function getTextTracks({sampleTextTrack} = {}) {
    const seed = {
      fileUrlTemplates: {
        textTrackFiles: {
          vtt: 'file.vtt'
        }
      },
      audioFiles: [{
        id: 10,
        permaId: 1
      }],
      textTrackFiles: [{
        parentFileId: 10,
        parentFileModelType: 'Pageflow::AudioFile',
        isReady: true,
        ...sampleTextTrack
      }]
    };

    const {result} = renderHookInEntry(() => useTextTracks({
      file: useFile({collectionName: 'audioFiles', permaId: 1})
    }), {seed});

    return result.current;
  }

  function render(ui, options) {
    return testingLibraryRender(ui, {
      ...options,
      queries: fakeMediaRenderQueries
    });
  }

  it('passes text tracks sources to getPlayer', () => {
    const textTracks = getTextTracks({
      sampleTextTrack: {
        id: 1,
        configuration: {
          label: 'German',
          srclang: 'de',
          kind: 'caption'
        }
      }
    });
    render(<MediaPlayer {...requiredProps()}
                        sources={getAudioSources()}
                        textTracks={textTracks} />);

    expect(media.getPlayer).toHaveBeenCalledWith(
      getAudioSources(),
      expect.objectContaining({
        textTrackSources: [{
          id: 'text_track_file_1',
          kind: 'caption',
          label: 'German',
          srclang: 'de',
          src: 'file.vtt'
        }]
      })
    );
  });

  it('does not passes text tracks if text tracks are disabled', () => {
    const textTracks = getTextTracks({
      sampleTextTrack: {
        id: 1
      }
    });
    render(<MediaPlayer {...requiredProps()}
                        textTracksDisabled={true}
                        sources={getAudioSources()}
                        textTracks={textTracks} />);

    expect(media.getPlayer).toHaveBeenCalledWith(
      getAudioSources(),
      expect.objectContaining({
        textTrackSources: []
      })
    );
  });

  it('does not request new player when rerendered with deeply equal text tracks', () => {
    const {rerender} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getAudioSources()}
                          textTracks={getTextTracks({
                            sampleTextTrack: {
                              configuration: {
                                srclang: 'de',
                                kind: 'caption'
                              }
                            }
                          })} />);

    rerender(<MediaPlayer {...requiredProps()}
                          sources={getAudioSources()}
                          textTracks={getTextTracks({
                              sampleTextTrack: {
                                configuration: {
                                  srclang: 'de',
                                  kind: 'caption'
                                }
                              }
                            })} />);

    expect(media.getPlayer).toHaveBeenCalledTimes(1);
  });

  it('requests new player when rerendered with changed text tracks', () => {
    const {rerender} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getAudioSources()}
                          textTracks={getTextTracks({
                            sampleTextTrack: {
                              configuration: {
                                srclang: 'de',
                                kind: 'caption'
                              }
                            }
                          })} />);

    rerender(<MediaPlayer {...requiredProps()}
                          sources={getAudioSources()}
                          textTracks={getTextTracks({
                            sampleTextTrack: {
                              configuration: {
                                srclang: 'en',
                                kind: 'caption'
                              }
                            }
                          })} />);

    expect(media.getPlayer).toHaveBeenCalledTimes(2);
  });

  it('updates mode of text track when active text track changes', () => {
    const sampleTextTrack = {
      id: 1,
      configuration: {
        srclang: 'de',
        kind: 'caption'
      }
    };
    const {select} = getTextTracks({sampleTextTrack})

    act(() => select('off'));
    const {rerender, getPlayer} =
      render(<MediaPlayer {...requiredProps()}
                          sources={getAudioSources()}
                          textTracks={getTextTracks({sampleTextTrack})} />);
    expect(getPlayer().textTracks()[0].mode).toEqual('disabled');

    act(() => select(sampleTextTrack.id));
    rerender(<MediaPlayer {...requiredProps()}
                          sources={getAudioSources()}
                          textTracks={getTextTracks({sampleTextTrack})} />);

    expect(getPlayer().textTracks()[0].mode).toEqual('showing');
  });
});
