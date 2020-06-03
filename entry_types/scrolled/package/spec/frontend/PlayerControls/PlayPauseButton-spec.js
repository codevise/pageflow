import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import {PlayPauseButton} from 'frontend/playerControls/PlayPauseButton';

describe('PlayPauseButton', () => {
  it('shows pause icon when playing', () => {
    const {getByTestId} = render(<PlayPauseButton isPlaying={true}/>);
    expect(getByTestId('pause-icon')).toBeVisible();
  });

  it('shows play icon when paused', () => {
    const {getByTestId} = render(<PlayPauseButton isPlaying={false}/>);
    expect(getByTestId('play-icon')).toBeVisible();
  });
});
