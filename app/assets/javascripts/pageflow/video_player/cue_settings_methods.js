pageflow.VideoPlayer.cueSettingsMethods = function(player) {
  player.updateCueLineSettings = function(line, forceUpdate) {
    var value = line.split('.')[0];
    value = value == 'top' ? 1 : value;

    var changed = false;

    _(player.textTracks()).each(function(textTrack) {
      if (textTrack.mode == 'showing' && textTrack.cues) {
        for (var i = 0; i < textTrack.cues.length; i++) {
          if (textTrack.cues[i].line != value) {
            textTrack.cues[i].line = value;
            changed = true;
          }
        }
      }
    });

    // Setting `line` does not update display directly, but only when
    // the next cue is displayed. This is problematic, when we
    // reposition text tracks to prevent overlap with player
    // controls. Triggering the event makes VideoJS update positions.
    // Ensure display is also updated when the current showing text
    // track changed since the last call, i.e. `line` has been changed
    // for a cue even though the previous call had the same
    // parameters.
    if (this.prevLine !== line || changed) {
      player.tech({IWillNotUseThisInPlugins: true}).trigger('texttrackchange');
    }

    this.prevLine = line;
  };
};
