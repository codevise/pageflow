/*
 * Prevent click event on play/pause button if the last click event
 * was less than 400ms ago.  Workaround for the "Phantom-Touch" on
 * Samsung Galaxy Note 10.1
 */
(function() {
  var originalOnClick = vjs.PlayToggle.prototype.onClick;
  var lastAction;

  vjs.PlayToggle.prototype.onClick = function() {
    var now = new Date().getTime();

    if (typeof lastAction == 'undefined' || now - lastAction > 400) {
      lastAction = now;

      if (pageflow.browser.has('phone platform')) {
        var elem = this.player_.tech.el();
        this.player_.play();

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.webkitEnterFullscreen) {
          elem.webkitEnterFullscreen();
        }
      }
      else {
        originalOnClick.apply(this, arguments);
      }
    }
  };

  vjs.PlayToggle.prototype.createEl = function(tagName, attributes){
    return vjs.Button.prototype.createEl.call(this, tagName || 'a', attributes);
  };
}());
