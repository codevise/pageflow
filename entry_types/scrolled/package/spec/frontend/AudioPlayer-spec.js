import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import 'support/fakeBrowserFeatures';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from "../support";
import {AudioPlayer} from 'frontend/AudioPlayer';
import {media} from 'pageflow/frontend';

describe('AudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function getAudioFileSeed({
    id = 1,
    permaId = 100,
    basename = 'audio'
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
        {id, permaId, isReady: true, basename}
      ]
    };
  }

  function requiredProps() {
    return {
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  it('renders audio tag if file is present', () => {
    const result =
      renderInEntry(<AudioPlayer {...requiredProps()} id={100} />, {
        seed: getAudioFileSeed({
          permaId: 100
        })
      });

    expect(result.container.querySelector('audio')).toBeDefined();
  });

  it('passes correct mp3, m4a and ogg sources to media API', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer')

    renderInEntry(<AudioPlayer {...requiredProps()} id={100} />, {
      seed: getAudioFileSeed({
        id: 1,
        permaId: 100,
        basename: 'audio'
      })
    });

    expect(spyMedia).toHaveBeenCalledWith(
      [
        { type: 'audio/ogg', src: '000/000/001/audio.ogg?u=1'},
        { type: 'audio/mp3', src: '000/000/001/audio.mp3?u=1'},
        { type: 'audio/m4a', src: '000/000/001/audio.m4a?u=1'}
      ],
      expect.anything()
    );
  });

  it('without id no media player is requested', () => {
    const spyMedia = jest.spyOn(media, 'getPlayer');

    renderInEntry(<AudioPlayer {...requiredProps()} />);

    expect(spyMedia).not.toHaveBeenCalled();
  });
});
