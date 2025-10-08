export function getLifecycleHandlers({configuration, playerActions, mediaMuted}) {
  return {
    onVisible() {
      if (configuration.playbackMode === 'loop') {
        playerActions.play();
      }
    },

    onActivate() {
      if (configuration.playbackMode === 'autoplay' ||
          (!configuration.playbackMode && configuration.autoplay) ||
          (configuration.playbackMode === 'autoplayIfUnmuted' && !mediaMuted)) {
        playerActions.play({via: 'autoplay'});
      }
    },

    onDeactivate() {
      if (configuration.playbackMode !== 'loop') {
        playerActions.fadeOutAndPause(400);
      }
    },

    onInvisible() {
      if (configuration.playbackMode === 'loop') {
        playerActions.fadeOutAndPause(400);
      }
    },
  }
}

export function getPlayerClickHandler({
  configuration,
  playerActions,
  shouldPlay, lastControlledVia,
  mediaMuted,
  isEditable, isSelected
}) {
  if (isEditable && !isSelected) {
    return null;
  }
  else if (configuration.playbackMode === 'loop') {
    if (mediaMuted && !configuration.keepMuted) {
      return () => playerActions.playBlessed();
    }
    else {
      return null;
    }
  }
  else if (configuration.keepMuted) {
    return () => {
      if (shouldPlay) {
        playerActions.pause();
      }
      else {
        playerActions.play();
      }
    };
  }
  else {
    return () => {
      if (shouldPlay && mediaMuted) {
        if (configuration.rewindOnUnmute && lastControlledVia === 'autoplay') {
          playerActions.seekTo(0);
        }

        playerActions.playBlessed();
      }
      else if (shouldPlay) {
        playerActions.pause();
      }
      else {
        playerActions.playBlessed();
      }
    };
  }
}
