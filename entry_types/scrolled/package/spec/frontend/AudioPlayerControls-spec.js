import {AudioPlayerControls} from 'frontend/AudioPlayerControls';

import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

describe('AudioPlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.video_qualities.labels.fullhd': '1080p'
  });

  it('renders text tracks menu', () => {
    const {getByRole} = renderInEntry(<AudioPlayerControls audioFilePermaId={10}
                                                           playerState={getInitialPlayerState()}
                                                           playerActions={getPlayerActions()} />, {
      seed: {
        audioFiles: [{
          id: 100,
          permaId: 10
        }],
        textTrackFiles: [{
          parentFileId: 100,
          parentFileModelType: 'Pageflow::AudioFile',
          configuration: {
            label: 'English (CC)'
          }
        }]
      }
    });

    expect(getByRole('menuitemradio', {name: 'English (CC)'})).not.toBeNull();
  });

  it('renders waveform player controls', () => {
    const {getByTestId} = renderInEntry(<AudioPlayerControls audioFilePermaId={10}
                                                             playerState={getInitialPlayerState()}
                                                             playerActions={getPlayerActions()}
                                                             configuration={{
                                                               playerControlVariant: 'waveform'
                                                             }}/>, {
      seed: {
        audioFiles: [{
          id: 100,
          permaId: 10
        }]
      }
    });
    expect(getByTestId('waveform-controls')).not.toBeNull();
  });

  it('handles missing file', () => {
    expect(() =>
      renderInEntry(<AudioPlayerControls playerState={getInitialPlayerState()}
                                         playerActions={getPlayerActions()} />)
    ).not.toThrow();
  });
});
