import React from 'react';

import {MediaInteractionTracking} from 'frontend/MediaInteractionTracking';

import {render, fireEvent} from '@testing-library/react';
import {getInitialPlayerState, getPlayerActions} from 'support/fakePlayerState';

jest.useFakeTimers();

describe('MediaInteractionTracking', () => {
  it('dispatches userInteraction action on mouse move', () => {
    const playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userInteraction: jest.fn()
    };
    const {getByTestId} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    fireEvent.mouseMove(getByTestId('child'));

    expect(playerActions.userInteraction).toHaveBeenCalled();
  });

  it('dispatches userInteraction action on click', () => {
    const playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userInteraction: jest.fn()
    };
    const {getByTestId} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    fireEvent.click(getByTestId('child'));

    expect(playerActions.userInteraction).toHaveBeenCalled();
  });

  it('dispatches userIdle action with delay after last user interaction', () => {
    const playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userIdle: jest.fn()
    };
    const {getByTestId} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    fireEvent.click(getByTestId('child'));
    jest.advanceTimersByTime(1000);

    expect(playerActions.userIdle).toHaveBeenCalled();
  });

  it('does not dispatch userIdle action if user keeps interacting', () => {
    const playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userIdle: jest.fn()
    };
    const {getByTestId} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    fireEvent.click(getByTestId('child'));
    jest.advanceTimersByTime(700);
    fireEvent.click(getByTestId('child'));
    jest.advanceTimersByTime(700);

    expect(playerActions.userIdle).not.toHaveBeenCalled();
  });

  it('preserves idle timeout across rerenders', () => {
    const playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userIdle: jest.fn()
    };
    const {getByTestId, rerender} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    fireEvent.click(getByTestId('child'));
    rerender(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    jest.advanceTimersByTime(700);
    fireEvent.click(getByTestId('child'));
    jest.advanceTimersByTime(700);

    expect(playerActions.userIdle).not.toHaveBeenCalled();
  });

  it('dispatches userIdle action with delay after player started playing', () => {
    let playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userIdle: jest.fn()
    };
    const {rerender} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000} />
    );

    playerState = {
      ...playerState,
      isPlaying: true
    };
    rerender(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000} />
    );
    jest.advanceTimersByTime(1000);

    expect(playerActions.userIdle).toHaveBeenCalled();
  });

  it('cancels delay when focus enters controls', () => {
    let playerState = getInitialPlayerState();
    const playerActions = {
      ...getPlayerActions(),
      userIdle: jest.fn()
    };
    const {getByTestId, rerender} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    fireEvent.click(getByTestId('child'));
    jest.advanceTimersByTime(700);
    playerState = {
      ...playerState,
      focusInsideControls: true
    };
    rerender(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000} />
    );
    jest.advanceTimersByTime(700);

    expect(playerActions.userIdle).not.toHaveBeenCalled();
  });

  it('dispatches userIdle action with delay after focus left playing', () => {
    let playerState = {
      ...getInitialPlayerState(),
      focusInsideControls: true
    };
    const playerActions = {
      ...getPlayerActions(),
      userIdle: jest.fn()
    };
    const {rerender} = render(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000}>
        <div data-testid="child" />
      </MediaInteractionTracking>
    );

    playerState = {
      ...playerState,
      focusInsideControls: false
    };
    rerender(
      <MediaInteractionTracking playerState={playerState}
                                playerActions={playerActions}
                                idleDelay={1000} />
    );
    jest.advanceTimersByTime(1000);

    expect(playerActions.userIdle).toHaveBeenCalled();
  });
});
