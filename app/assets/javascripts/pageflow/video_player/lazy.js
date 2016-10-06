// A proxy which lazily initializes the real video player.
pageflow.VideoPlayer.Lazy = function(template, options) {
  var placeholder = $('<span class="video_placeholder" />'),
      that = this,
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

      videoPlayer = new pageflow.VideoPlayer(videoTag[0], options);
      videoPlayer.ready(readyCallbacks.fire);
    }
  };

  this.isPresent = function() {
    return videoTag && !disposeTimeout;
  };

  this.dispose = function() {
    if (videoTag && !pageflow.browser.has('mobile platform')) {
      this.setEmptySrc();

      $(videoPlayer.el()).replaceWith(placeholder);
      videoPlayer.dispose();

      videoPlayer = null;
      videoTag = null;
    }
  };

  this.setEmptySrc = function() {
    videoPlayer.src([
      {type: 'video/webm', src: pageflow.assetUrls.emptyWebm},
      {type: 'video/mp4', src: pageflow.assetUrls.emptyMp4}
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

  this.srcFromOptions = function() {
    return videoPlayer ? videoPlayer.srcFromOptions() : null;
  };

  _.each(['play', 'playAndFadeIn', 'pause', 'fadeOutAndPause', 'prebuffer', 'src', 'on', 'load', 'currentTime'], function(method) {
    that[method] = function(/* args */) {
      var args = arguments;

      if (!videoPlayer) {
        pageflow.log('Video Player not yet initialized. (' + method + ')', {force: true});
        return;
      }

      return new $.Deferred(function(deferred) {
        videoPlayer.ready(function() {
          $.when(videoPlayer[method].apply(videoPlayer, args)).then(deferred.resolve);
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

    if (pageflow.browser.has('mobile platform') && element.attr('data-mobile-poster')) {
      element.attr('poster', element.attr('data-mobile-poster'));
    }
    else if (pageflow.browser.has('high bandwidth') && !pageflow.browser.has('mobile platform')) {
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
