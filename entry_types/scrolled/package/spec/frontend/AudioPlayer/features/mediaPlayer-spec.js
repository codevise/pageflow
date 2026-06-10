import React from 'react';
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {AudioPlayer} from 'frontend/AudioPlayer';
import {useFile} from 'entryState';
import {media} from 'pageflow/frontend';

describe('AudioPlayer media player', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function getAudioFileSeed({
    id = 1,
    permaId = 100,
    basename = 'audio',
    configuration = {}
  } = {}) {
    return {
      fileUrlTemplates: {
        audioFiles: {
          mp3: ':id_partition/:basename.mp3',
          m4a: ':id_partition/:basename.m4a',
          ogg: ':id_partition/:basename.ogg'
        }
      },
      audioFiles: [
        {id, permaId, isReady: true, basename, configuration}
      ]
    };
  }

  function requiredProps() {
    return {
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  it('passes correct mp3, m4a and ogg sources to media API', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer')

    renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})} />,
      {
        seed: getAudioFileSeed({
          id: 1,
          permaId: 100,
          basename: 'audio'
        })
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      [
        { type: 'audio/ogg', src: '000/000/001/audio.ogg?u=1'},
        { type: 'audio/mp3', src: '000/000/001/audio.mp3?u=1'},
        { type: 'audio/m4a', src: '000/000/001/audio.m4a?u=1'}
      ],
      expect.anything()
    );
  });

  it('passes file perma id to media api', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})} />,
      {
        seed: getAudioFileSeed({
          id: 1,
          permaId: 100,
          basename: 'audio'
        })
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({filePermaId: 100})
    );
  });

  it('passes displayName from audio file as media events context data', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})} />,
      {
        seed: {
          fileUrlTemplates: {
            audioFiles: {
              mp3: ':id_partition/:basename.mp3'
            }
          },
          audioFiles: [
            {id: 1, permaId: 100, isReady: true, displayName: 'Podcast.mp3'}
          ]
        }
      }
    );

    expect(spyMedia).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        mediaEventsContextData: expect.objectContaining({
          fileDisplayName: 'Podcast.mp3'
        })
      })
    );
  });

  it('without id no media player is requested', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(<AudioPlayer {...requiredProps()} />);

    expect(spyMedia).not.toHaveBeenCalled();
  });
});
