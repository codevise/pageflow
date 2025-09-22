import React from 'react';

import {ClassicPlayerControls} from 'frontend/PlayerControls';

import '@testing-library/jest-dom/extend-expect'
import {fireEvent} from '@testing-library/react'
import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'support';
import * as queries from 'support/roleQueriesExcludingInert';

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

  it('renders play button when unplayed', () => {
    const {queryByRole} = renderInEntry(
      <ClassicPlayerControls unplayed={true} />,
      {queries}
    );

    expect(queryByRole('button', {name: 'Play'})).not.toBeNull();
  });

  it('renders control bar by default', () => {
    const {getByRole} = renderInEntry(
      <ClassicPlayerControls unplayed={false} />,
      {queries}
    );

    expect(getByRole('button', {name: 'Play'})).not.toBeNull();
  });

  it('supports hiding control bar', () => {
    const {queryByRole} = renderInEntry(
      <ClassicPlayerControls unplayed={false} hideControlBar={true} />,
      {queries}
    );

    expect(queryByRole('button', {name: 'Play'})).toBeNull();
  });

  it('renders play button initially even when hiding control bar', () => {
    const {getByRole} = renderInEntry(
      <ClassicPlayerControls unplayed={true} hideControlBar={true} />,
      {queries}
    );

    expect(getByRole('button', {name: 'Play'})).not.toBeNull();
  });

  it('supports hiding big play button shown initially', () => {
    const {queryByRole} = renderInEntry(
      <ClassicPlayerControls unplayed={true} hideBigPlayButton={true} />,
      {queries}
    );

    expect(queryByRole('button', {name: 'Play'})).toBeNull();
  });
});
