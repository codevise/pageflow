import React from 'react';

import {ClassicPlayerControls} from 'frontend/PlayerControls';

import '@testing-library/jest-dom/extend-expect'
import {fireEvent} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';

describe('ClassicPlayerControls', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.player_controls.play': 'Play',
    'pageflow_scrolled.public.player_controls.quality': 'Quality'
  });

  it('supports rendering and handling events for quality menu items', () => {
    const listener = jest.fn();
    const {getByTitle, getByText} = renderInEntry(
      <ClassicPlayerControls
        qualityMenuItems={[
          {label: '1080p', value: 'fullhd'},
          {label: '720p', value: 'medium'},
        ]}
        onQualityMenuItemClick={listener} />
    );

    fireEvent.click(getByTitle('Quality'));
    fireEvent.click(getByText('1080p'));

    expect(listener).toHaveBeenCalledWith('fullhd');
  });

  it('renders control bar by default', () => {
    const {queryByLabelText} = renderInEntry(
      <ClassicPlayerControls />
    );

    expect(queryByLabelText('Play')).not.toBeNull();
  });

  it('supports hiding control bar', () => {
    const {queryByLabelText} = renderInEntry(
      <ClassicPlayerControls hideControlBar={true} />
    );

    expect(queryByLabelText('Play')).toBeNull();
  });
});
