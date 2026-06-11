import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {AudioPlayer} from 'frontend/AudioPlayer';
import {useFile} from 'entryState';

describe('AudioPlayer poster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function requiredProps() {
    return {
      playerState: getInitialPlayerState(),
      playerActions: getPlayerActions()
    };
  }

  it('renders given poster image', () => {
    const {getByRole} = renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})}
                         posterImageFile={useFile({collectionName: 'imageFiles', permaId: 200})} />,
      {
        seed: {
          fileUrlTemplates: {
            audioFiles: {
              mp3: ':id_partition/audio.mp3',
              m4a: ':id_partition/audio.m4a',
              ogg: ':id_partition/audio.ogg'
            },
            imageFiles: {
              large: ':id_partition/large.jpg'
            }
          },
          audioFiles: [
            {id: 1, permaId: 100, isReady: true}
          ],
          imageFiles: [
            {id: 2, permaId: 200, isReady: true}
          ]
        }
      }
    );

    expect(getByRole('img')).toHaveAttribute('src', '000/000/002/large.jpg');
  });
});
