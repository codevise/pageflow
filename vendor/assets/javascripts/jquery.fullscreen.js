/**
 * @name        jQuery FullScreen Plugin
 * @author      Martin Angelov, Morten Sjøgren
 * @version     1.2
 * @url         http://tutorialzine.com/2012/02/enhance-your-website-fullscreen-api/
 * @license     MIT License
 */

/*jshint browser: true, jquery: true */
// We shrank the plugin so that it contains only what Pageflow needs.
(function($){
  "use strict";

  // These helper functions available only to our plugin scope.
  function supportFullScreen(){
    var doc = document.documentElement;

    return ('requestFullscreen' in doc) ||
      ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
      ('webkitRequestFullScreen' in doc);
  }

  function requestFullScreen(elem){
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    }
  }

  function fullScreenStatus(){
    return document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      false;
  }

  function cancelFullScreen(){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }

  function onFullScreenEvent(callback){
    $(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function(){
      // The full screen status is automatically
      // passed to our callback as an argument.
      callback(fullScreenStatus());
    });
  }

  // Adding a new test to the jQuery support object
  $.support.fullscreen = supportFullScreen();

  // Creating the plugin
  $.fn.fullScreen = function(options){
    if(!$.support.fullscreen || this.length !== 1) {
      // The plugin can be called only
      // on one element at a time

      return this;
    }

    if(fullScreenStatus()){
      // if we are already in fullscreen, exit
      cancelFullScreen();
      return this;
    }

    var elem = this;

    requestFullScreen(elem.get(0));

    elem.cancel = function(){
      cancelFullScreen();
      return elem;
    };

    onFullScreenEvent(function(fullScreen){
      if(!fullScreen){
        // We have exited full screen.
        // Detach event listener
        $(document).off( 'fullscreenchange mozfullscreenchange webkitfullscreenchange' );
      }

      // Calling callback if user provided it
      if(options.callback) {
        options.callback(fullScreen);
      }
    });

    return elem;
  };
}(jQuery));
