import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {renderInEntry} from 'support'

import {PlayPauseButton} from 'frontend/PlayerControls/PlayPauseButton';
import {useFakeTranslations} from 'pageflow/testHelpers';

describe('PlayPauseButton', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.player_controls.play': 'Play',
    'pageflow_scrolled.public.player_controls.pause': 'Pause'
  });

  it('shows pause button when playing', () => {
    const {getByLabelText} = renderInEntry(<PlayPauseButton isPlaying={true}/>);
    expect(getByLabelText('Pause')).toBeVisible();
  });

  it('shows play button when paused', () => {
    const {getByLabelText} = renderInEntry(<PlayPauseButton isPlaying={false}/>);
    expect(getByLabelText('Play')).toBeVisible();
  });
});
