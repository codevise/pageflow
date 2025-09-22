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
    'pageflow_scrolled.public.player_controls.pause': 'Pause',
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

  it('moves focus from big play button to control bar pause button on play', () => {
    const {getByRole, rerender} = renderInEntry(
      <ClassicPlayerControls unplayed={true} />,
      {queries}
    );

    getByRole('button', {name: 'Play'}).focus();

    rerender(
      <ClassicPlayerControls unplayed={false} isPlaying={true} />,
      {queries}
    );

    expect(getByRole('button', {name: 'Pause'})).toHaveFocus();
  });

  it('does not move focus on play if big play button does not have focus', () => {
    const {getByRole, rerender} = renderInEntry(
      <ClassicPlayerControls unplayed={true} />,
      {queries}
    );

    rerender(
      <ClassicPlayerControls unplayed={false} isPlaying={true} />,
      {queries}
    );

    expect(getByRole('button', {name: 'Pause'})).not.toHaveFocus();
  });

  it('moves focus from control bar pause button to big play button on ended', () => {
    const {getByRole, rerender} = renderInEntry(
      <ClassicPlayerControls unplayed={false} isPlaying={true} />,
      {queries}
    );

    getByRole('button', {name: 'Pause'}).focus();

    rerender(
      <ClassicPlayerControls unplayed={true} />,
      {queries}
    );

    expect(getByRole('button', {name: 'Play'})).toHaveFocus();
  });

  it('does not move focus on ended if control bar play button does not have focus', () => {
    const {getByRole, rerender} = renderInEntry(
      <ClassicPlayerControls unplayed={false} isPlaying={true} />,
      {queries}
    );

    rerender(
      <ClassicPlayerControls unplayed={true} />,
      {queries}
    );

    expect(getByRole('button', {name: 'Play'})).not.toHaveFocus();
  });
});
