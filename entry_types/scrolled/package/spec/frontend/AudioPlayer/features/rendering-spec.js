import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

import {renderInEntry} from 'support';
import {AudioPlayer} from 'frontend/AudioPlayer';
import {useFile} from 'entryState';

describe('AudioPlayer rendering', () => {
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

  it('renders audio tag if file is present', () => {
    const result = renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})} />,
      {
        seed: getAudioFileSeed({
          permaId: 100
        })
      }
    );

    expect(result.container.querySelector('audio')).toBeDefined();
  });

  it('does not render audio element when load is "none"', () => {
    const result =
      renderInEntry(() => <AudioPlayer {...requiredProps()}
                                       audioFile={useFile({collectionName: 'audioFiles', permaId: 100})}
                                       load="none" />,
                    {seed: getAudioFileSeed()});

    expect(result.container.querySelector('audio')).toBeNull();
  });

  it('renders alt text', () => {
    const result = renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})} />,
      {
        seed: getAudioFileSeed({
          permaId: 100, configuration: {alt: 'jingle'}
        })
      }
    );

    expect(result.container.querySelector('audio')).toHaveAttribute('alt', 'jingle');
  });

  it('renders empty alt attr', () => {
    const result = renderInEntry(
      () => <AudioPlayer {...requiredProps()}
                         audioFile={useFile({collectionName: 'audioFiles', permaId: 100})} />,
      {
        seed: getAudioFileSeed({
          permaId: 100
        })
      }
    );

    expect(result.container.querySelector('audio').hasAttribute('alt')).toBe(true);
  });
});
