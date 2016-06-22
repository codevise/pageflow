jQuery.widget('pageflow.markWithPlayedStates', {
  attach: function(player) {
    var element = this.element;

    player.on('play', function() {
      element.removeClass('unplayed');
    });

    player.on('pause', function() {
      element.addClass('has_played');
    });
  },

  reset: function(options) {
    this.element.toggleClass('unplayed', !this._willAutoplay(options));
    this.element.removeClass('has_played');
  },

  _willAutoplay: function(options) {
    options = options || {};
    return options.autoplay && !pageflow.browser.has('mobile platform');
  }
});
