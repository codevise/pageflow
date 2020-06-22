import {VideoPlayerControls} from 'frontend/VideoPlayerControls';

import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

describe('VideoPlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.video_qualities.labels.fullhd': '1080p'
  });

  it('renders quality selection menu', () => {
    const {getByText} = renderInEntry(<VideoPlayerControls videoFilePermaId={10}
                                                           playerState={getInitialPlayerState()}
                                                           playerActions={getPlayerActions()} />, {
      seed: {
        videoFiles: [{
          permaId: 10,
          variants: ['fullhd']
        }]
      }
    });

    expect(getByText('1080p')).not.toBeNull();
  });

  it('handles missing file', () => {
    expect(() =>
      renderInEntry(<VideoPlayerControls playerState={getInitialPlayerState()}
                                         playerActions={getPlayerActions()} />)
    ).not.toThrow();
  });
});
