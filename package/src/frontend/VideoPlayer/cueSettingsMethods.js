export const cueSettingsMethods = function(player) {
  /**
   * Specify the display position of text tracks. This method can also
   * be used to make VideoJS reposition the text tracks after the
   * margins of the text track display have been changed (e.g. to
   * translate text tracks when player controls are displayed).
   *
   * To force such an update, the passed string has to differ from the
   * previously passed string. You can append a dot and an arbitrary
   * string (e.g. `"auto.translated"`), to keep the current setting but
   * still force repositioning.
   *
   * On the other hand, it is possible to change the positioning but
   * have VideoJS apply the change only when the next cue is
   * displayed. This way we can prevent moving a cue that the user
   * might just be reading. Simply append the string `".lazy"`
   * (e.g. `"auto.lazy"`).
   *
   * @param {string} line
   *   Either `"top"` to move text tracks to the first line or
   *   `"auto"` to stick with automatic positioning, followed by a tag
   *   to either force or prevent immediate update.
   */
  player.updateCueLineSettings = function(line) {
    var components = line.split('.');
    var value = components[0];
    var command = components[1];

    value = value == 'top' ? 1 : value;

    var changed = false;

    Array.from(player.textTracks()).forEach(function(textTrack) {
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
    if ((this.prevLine !== line || changed) && (command != 'lazy')) {
      var tech = player.tech({IWillNotUseThisInPlugins: true});
      tech && tech.trigger('texttrackchange');
    }

    this.prevLine = line;
  };
};
