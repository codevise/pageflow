jQuery.widget('pageflow.hideContentDuringPlayback', {
  attach: function(player) {
    var scrollIndicator = this.options.scrollIndicator;
    var content = this.element.find('.scroller, .controls, .shadow');
    var waitingOnUnderrun = false;
    var widget = this;

    this.scroller = this.element.find('.scroller');

    player.on('bufferunderrun', function() {
      waitingOnUnderrun = true;
    });

    player.on('bufferunderruncontinue', function() {
      waitingOnUnderrun = false;
    });

    player.on('pause', function() {
      content.addClass('lock-showing');

      if (!waitingOnUnderrun) {
        content.addClass('is_paused').removeClass('is_playing');
        widget._removeDelayedIsPlayingClass();

        scrollIndicator.enable();
      }
    });

    player.on('play', function() {
      content.removeClass('lock-showing is_paused').addClass('is_playing');
      widget._addDelayedIsPlayingClass();

      if (pageflow.widgets.isPresent('classic_player_controls')) {
        scrollIndicator.scheduleDisable();
      }
      else {
        scrollIndicator.disable();
      }
    });

    player.on('ended', function() {
      content.addClass('lock-showing');
      content.addClass('is_paused').removeClass('is_playing');

      widget._removeDelayedIsPlayingClass();

      scrollIndicator.enable();
    });

    content.addClass('lock-showing is_paused');
  },

  _addDelayedIsPlayingClass: function() {
    this.scroller.addClass('is_playing_delayed');
    clearTimeout(this.delayedPlayingClassTimeout);
    this.delayedPlayingClassTimeout = null;
  },

  _removeDelayedIsPlayingClass: function() {
    var scroller = this.scroller;

    if (!this.delayedPlayingClassTimeout) {
      this.delayedPlayingClassTimeout = setTimeout(function() {
        scroller.removeClass('is_playing_delayed');
      }, 700);
    }
  },
});