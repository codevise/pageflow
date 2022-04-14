import {
  getLifecycleHandlers,
  getPlayerClickHandler
} from 'contentElements/inlineVideo/handlers';

import {
  getPlayerActions
} from 'support/fakePlayerState';

describe('getLifecycleHandlers', () => {
  describe('onVisible', () => {
    it('is no-op by default', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const {onVisible} = getLifecycleHandlers(configuration, playerActions);
      onVisible();

      expect(playerActions.calls).toEqual([]);
    });

    it('is no-op for manual playbackMode', () => {
      const configuration = {playbackMode: 'manual'};
      const playerActions = getPlayerActions();

      const {onVisible} = getLifecycleHandlers(configuration, playerActions);
      onVisible();

      expect(playerActions.calls).toEqual([]);
    });

    it('is no-op for autoplay playbackMode', () => {
      const configuration = {playbackMode: 'autoplay'};
      const playerActions = getPlayerActions();

      const {onVisible} = getLifecycleHandlers(configuration, playerActions);
      onVisible();

      expect(playerActions.calls).toEqual([]);
    });

    it('calls play for loop playbackMode', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const {onVisible} = getLifecycleHandlers(configuration, playerActions);
      onVisible();

      expect(playerActions.play).toHaveBeenCalledWith();
    });
  });

  describe('onActivate', () => {
    it('is no-op by default', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const {onActivate} = getLifecycleHandlers(configuration, playerActions);
      onActivate();

      expect(playerActions.calls).toEqual([]);
    });

    it('is no-op for loop playbackMode', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const {onActivate} = getLifecycleHandlers(configuration, playerActions);
      onActivate();

      expect(playerActions.calls).toEqual([]);
    });

    it('is no-op for manual playbackMode', () => {
      const configuration = {playbackMode: 'manual'};
      const playerActions = getPlayerActions();

      const {onActivate} = getLifecycleHandlers(configuration, playerActions);
      onActivate();

      expect(playerActions.calls).toEqual([]);
    });

    it('calls play for autoplay playbackMode', () => {
      const configuration = {playbackMode: 'autoplay'};
      const playerActions = getPlayerActions();

      const {onActivate} = getLifecycleHandlers(configuration, playerActions);
      onActivate();

      expect(playerActions.play).toHaveBeenCalledWith({via: 'autoplay'});
    });

    it('calls play if legacy autoplay flag is set', () => {
      const configuration = {autoplay: true};
      const playerActions = getPlayerActions();

      const {onActivate} = getLifecycleHandlers(configuration, playerActions);
      onActivate();

      expect(playerActions.play).toHaveBeenCalledWith({via: 'autoplay'});
    });

    it('is no-op for manual playbackMode even with legacy autoplay flag', () => {
      const configuration = {playbackMode: 'manual', autoplay: true};
      const playerActions = getPlayerActions();

      const {onActivate} = getLifecycleHandlers(configuration, playerActions);
      onActivate();

      expect(playerActions.calls).toEqual([]);
    });
  });

  describe('onDeactivate', () => {
    it('calls fadeOutAndPause by default', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const {onDeactivate} = getLifecycleHandlers(configuration, playerActions);
      onDeactivate();

      expect(playerActions.fadeOutAndPause).toHaveBeenCalled();
    });

    it('calls fadeOutAndPause for manual playbackMode', () => {
      const configuration = {playbackMode: 'manual'};
      const playerActions = getPlayerActions();

      const {onDeactivate} = getLifecycleHandlers(configuration, playerActions);
      onDeactivate();

      expect(playerActions.fadeOutAndPause).toHaveBeenCalled();
    });

    it('calls fadeOutAndPause for autoplay playbackMode', () => {
      const configuration = {playbackMode: 'autoplay'};
      const playerActions = getPlayerActions();

      const {onDeactivate} = getLifecycleHandlers(configuration, playerActions);
      onDeactivate();

      expect(playerActions.fadeOutAndPause).toHaveBeenCalled();
    });

    it('is no-op for loop playbackMode', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const {onDeactivate} = getLifecycleHandlers(configuration, playerActions);
      onDeactivate();

      expect(playerActions.calls).toEqual([]);
    });
  });

  describe('onInvisible', () => {
    it('is no-op by default', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const {onInvisible} = getLifecycleHandlers(configuration, playerActions);
      onInvisible();

      expect(playerActions.calls).toEqual([]);
    });

    it('is no-op for manual playbackMode', () => {
      const configuration = {playbackMode: 'manual'};
      const playerActions = getPlayerActions();

      const {onInvisible} = getLifecycleHandlers(configuration, playerActions);
      onInvisible();

      expect(playerActions.calls).toEqual([]);
    });

    it('is no-op for autoplay playbackMode', () => {
      const configuration = {playbackMode: 'autoplay'};
      const playerActions = getPlayerActions();

      const {onInvisible} = getLifecycleHandlers(configuration, playerActions);
      onInvisible();

      expect(playerActions.calls).toEqual([]);
    });

    it('calls fadeOutAndPause for loop playbackMode', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const {onInvisible} = getLifecycleHandlers(configuration, playerActions);
      onInvisible();

      expect(playerActions.fadeOutAndPause).toHaveBeenCalled();
    });
  });
});

describe('getPlayerClickHandler', () => {
  describe('for loop', () => {
    it('unmutes when playing on mute', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: true,
        mediaMuted: true
      });
      handler();

      expect(playerActions.playBlessed).toHaveBeenCalled();
    });

    it('is null if playing on mute and keepMuted is set', () => {
      const configuration = {playbackMode: 'loop', keepMuted: true};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: true,
        mediaMuted: true,
      });

      expect(handler).toBeNull();
    });

    it('is null if media not muted and playing', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: true,
        mediaMuted: false
      });

      expect(handler).toBeNull();
    });

    it('is null if media not muted and paused', () => {
      const configuration = {playbackMode: 'loop'};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: false,
        mediaMuted: false
      });

      expect(handler).toBeNull();
    });
  });

  describe('by default', () => {
    it('plays and unmutes when paused', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: false
      });
      handler();

      expect(playerActions.playBlessed).toHaveBeenCalled();
    });

    it('unmutes when playing on mute', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: true,
        mediaMuted: true
      });
      handler();

      expect(playerActions.playBlessed).toHaveBeenCalled();
    });

    describe('when rewindOnUnmute is set', () => {
      it('unmutes and rewinds when autoplaying on mute', () => {
        const configuration = {rewindOnUnmute: true};
        const playerActions = getPlayerActions();

        const handler = getPlayerClickHandler({
          configuration,
          playerActions,
          shouldPlay: true,
          lastControlledVia: 'autoplay',
          mediaMuted: true
        });
        handler();

        expect(playerActions.seekTo).toHaveBeenCalledWith(0);
        expect(playerActions.playBlessed).toHaveBeenCalled();
      });

      it('does not rewind when playing on mute after manual start', () => {
        const configuration = {rewindOnUnmute: true};
        const playerActions = getPlayerActions();

        const handler = getPlayerClickHandler({
          configuration,
          playerActions,
          shouldPlay: true,
          lastControlledVia: 'playPauseButton',
          mediaMuted: true
        });
        handler();

        expect(playerActions.seekTo).not.toHaveBeenCalled();
      });
    });

    it('pauses when playing', () => {
      const configuration = {};
      const playerActions = getPlayerActions();

      const handler = getPlayerClickHandler({
        configuration,
        playerActions,
        shouldPlay: true
      });
      handler();

      expect(playerActions.pause).toHaveBeenCalled();
    });

    describe('when keepMuted is set', () => {
      it('plays without unmuting when paused', () => {
        const configuration = {keepMuted: true};
        const playerActions = getPlayerActions();

        const handler = getPlayerClickHandler({
          configuration,
          playerActions,
          shouldPlay: false,
          mediaMuted: true
        });
        handler();

        expect(playerActions.play).toHaveBeenCalled();
      });

      it('pauses when playing on mute and keepMuted is set', () => {
        const configuration = {keepMuted: true};
        const playerActions = getPlayerActions();

        const handler = getPlayerClickHandler({
          configuration,
          playerActions,
          shouldPlay: true,
          mediaMuted: true
        });
        handler();

        expect(playerActions.pause).toHaveBeenCalled();
      });
    });

    describe('in editor', () => {
      it('is null if not selected', () => {
        const configuration = {};
        const playerActions = getPlayerActions();

        const handler = getPlayerClickHandler({
          configuration,
          playerActions,
          shouldPlay: false,
          isEditable: true,
          isSelected: false
        });

        expect(handler).toBeNull();
      });

      it('plays paused video when selected', () => {
        const configuration = {};
        const playerActions = getPlayerActions();

        const handler = getPlayerClickHandler({
          configuration,
          playerActions,
          shouldPlay: false,
          isEditable: true,
          isSelected: true
        });
        handler();

        expect(playerActions.playBlessed).toHaveBeenCalled();
      });
    })
  });
});
