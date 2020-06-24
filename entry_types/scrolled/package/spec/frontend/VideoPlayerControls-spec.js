import {VideoPlayerControls} from 'frontend/VideoPlayerControls';

import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

describe('VideoPlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.video_qualities.labels.fullhd': '1080p',
    'pageflow_scrolled.public.video_qualities.annotations.fullhd': 'HD'
  });

  it('renders quality selection menu', () => {
    const {getByRole} = renderInEntry(<VideoPlayerControls videoFilePermaId={10}
                                                           playerState={getInitialPlayerState()}
                                                           playerActions={getPlayerActions()} />, {
      seed: {
        videoFiles: [{
          permaId: 10,
          variants: ['fullhd']
        }]
      }
    });

    expect(getByRole('menuitemradio', {name: '1080p HD'})).not.toBeNull();
  });

  it('renders text tracks menu', () => {
    const {getByRole} = renderInEntry(<VideoPlayerControls videoFilePermaId={10}
                                                           playerState={getInitialPlayerState()}
                                                           playerActions={getPlayerActions()} />, {
      seed: {
        videoFiles: [{
          id: 100,
          permaId: 10,
          variants: ['fullhd']
        }],
        textTrackFiles: [{
          parentFileId: 100,
          parentFileModelType: 'Pageflow::VideoFile',
          configuration: {
            label: 'English (CC)'
          }
        }]
      }
    });

    expect(getByRole('menuitemradio', {name: 'English (CC)'})).not.toBeNull();
  });

  it('handles missing file', () => {
    expect(() =>
      renderInEntry(<VideoPlayerControls playerState={getInitialPlayerState()}
                                         playerActions={getPlayerActions()} />)
    ).not.toThrow();
  });
});
