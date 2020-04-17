import _ from 'underscore';
import {VideoPlayer} from './VideoPlayer';
import {browser} from '../browser';
import {log} from '../base';
import {assetUrls} from '../assetUrls';

// A proxy which lazily initializes the real video player.
export const Lazy = function(template, options) {
  var placeholder = $('<span class="video_placeholder" />'),
    that = this,

    // TODO: Replace $.Callbacks
    readyCallbacks = new $.Callbacks(),
    disposeTimeout, videoTag, videoPlayer, html;

  saveHtml(template);
  template.before(placeholder);

  this.ensureCreated = function() {
    if (disposeTimeout) {
      clearTimeout(disposeTimeout);
      disposeTimeout = null;
    }

    if (!videoTag) {
      videoTag = createVideoTag();
      placeholder.replaceWith(videoTag);

      videoPlayer = new VideoPlayer(videoTag[0], options);
      videoPlayer.ready(readyCallbacks.fire);
    }
  };

  this.isPresent = function() {
    return videoTag && !disposeTimeout;
  };

  this.dispose = function() {
    if (videoTag && !browser.has('mobile platform')) {
      this.setEmptySrc();

      $(videoPlayer.el()).replaceWith(placeholder);
      videoPlayer.dispose();

      videoPlayer = null;
      videoTag = null;
    }
  };

  this.setEmptySrc = function() {
    videoPlayer.src([
      {type: 'video/webm', src: assetUrls.emptyWebm},
      {type: 'video/mp4', src: assetUrls.emptyMp4}
    ]);
  };

  this.scheduleDispose = function() {
    if (!disposeTimeout) {
      disposeTimeout = setTimeout(function() {
        that.dispose();
      }, 5 * 1000);
    }
  };

  // proxied methods

  this.ready = function(callback) {
    readyCallbacks.add(callback);
  };

  this.paused = function() {
    return videoPlayer && videoPlayer.paused();
  };

  this.volume = function(/* arguments */) {
    if (!videoPlayer) {
      return 0;
    }

    return videoPlayer.volume.apply(videoPlayer, arguments);
  };

  this.showPosterImage = function() {
    return videoPlayer && videoPlayer.posterImage.show();
  };

  this.hidePosterImage = function() {
    return videoPlayer && videoPlayer.posterImage.unlockShowing();
  };

  _.each(['play', 'playAndFadeIn', 'pause', 'fadeOutAndPause', 'prebuffer', 'src', 'on', 'load', 'currentTime', 'muted'], function(method) {
    that[method] = function(/* args */) {
      var args = arguments;

      if (!videoPlayer) {
        log('Video Player not yet initialized. (' + method + ')', {force: true});
        return;
      }

      return new Promise(function(resolve) {
        videoPlayer.ready(function() {
          // TODO: Replace $.when
          $.when(videoPlayer[method].apply(videoPlayer, args)).then(resolve);
        });
      });
    };
  });

  function saveHtml(template) {
    html = template.html();
  }

  function createVideoTag() {
    var htmlWithPreload = html.replace(/preload="[a-z]*"/, 'preload="auto"');
    htmlWithPreload = htmlWithPreload.replace(/src="([^"]*)"/g, 'src="$1&t=' + new Date().getTime() + '"');

    var element = $(htmlWithPreload);

    if (browser.has('mobile platform') && element.attr('data-mobile-poster')) {
      element.attr('poster', element.attr('data-mobile-poster'));
    }
    else if (browser.has('high bandwidth') && !browser.has('mobile platform')) {
      element.attr('poster', element.attr('data-large-poster'));

      element.find('source').each(function() {
        $(this).attr('src', $(this).attr('data-high-src'));
      });
    }
    else {
      element.attr('poster', element.attr('data-poster'));
    }

    return element;
  }
};
