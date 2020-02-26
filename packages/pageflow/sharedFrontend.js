import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

window.pageflow = window.pageflow || {};

window.pageflow.log = function (text, options) {
  if (window.console && (pageflow.debugMode() || options && options.force)) {
    window.console.log(text);
  }
};

window.pageflow.debugMode = function () {
  return window.location.href.indexOf('debug=true') >= 0;
};

pageflow.events = _.extend({}, Backbone.Events);

pageflow.bandwidth = function () {
  var maxLoadTime = 5000;
  pageflow.bandwidth.promise = pageflow.bandwidth.promise || new $.Deferred(function (deferred) {
    var smallFileUrl = pageflow.assetUrls.smallBandwidthProbe + "?" + new Date().getTime(),
        largeFileUrl = pageflow.assetUrls.largeBandwidthProbe + "?" + new Date().getTime(),
        smallFileSize = 165,
        largeFileSize = 1081010;
    $.when(timeFile(smallFileUrl), timeFile(largeFileUrl)).done(function (timeToLoadSmallFile, timeToLoadLargeFile) {
      var timeDelta = (timeToLoadLargeFile - timeToLoadSmallFile) / 1000;
      var bitsDelta = (largeFileSize - smallFileSize) * 8;
      timeDelta = Math.max(timeDelta, 0.01);
      deferred.resolve({
        durationInSeconds: timeDelta,
        speedInBps: (bitsDelta / timeDelta).toFixed(2)
      });
    }).fail(function () {
      deferred.resolve({
        durationInSeconds: Infinity,
        speedInBps: 0
      });
    });
  }).promise();
  return pageflow.bandwidth.promise;

  function timeFile(url) {
    var startTime = new Date().getTime();
    return withTimeout(loadFile(url), maxLoadTime).pipe(function () {
      return new Date().getTime() - startTime;
    });
  }

  function loadFile(url, options) {
    return new $.Deferred(function (deferred) {
      var image = new Image();
      image.onload = deferred.resolve;
      image.onerror = deferred.reject;
      image.src = url;
    }).promise();
  }

  function withTimeout(promise, milliseconds) {
    return new $.Deferred(function (deferred) {
      var timeout = setTimeout(function () {
        deferred.reject();
      }, milliseconds);
      promise.always(function () {
        clearTimeout(timeout);
      }).then(deferred.resolve, deferred.reject);
    }).promise();
  }
};

/**
 * Browser feature detection.
 *
 * @since 0.9
 */

pageflow.browser = function () {
  var tests = {},
      results = {},
      _ready = new $.Deferred();

  return {
    off: {},
    on: {},
    unset: {},

    /**
     * Add a feature test.
     *
     * @param name [String] Name of the feature. Can contain whitespace.
     * @param test [Function] A function that either returns `true` or
     *   `false` or a promise that resolves to `true` or `false`.
     * @memberof pageflow.browser
     */
    feature: function feature(name, test) {
      var s = name.replace(/ /g, '_');

      this.off[s] = function () {
        window.localStorage['override ' + name] = 'off';
        pageflow.log('Feature off: ' + name, {
          force: true
        });
      };

      this.on[s] = function () {
        window.localStorage['override ' + name] = 'on';
        pageflow.log('Feature on: ' + name, {
          force: true
        });
      };

      this.unset[s] = function () {
        window.localStorage.removeItem('override ' + name);
        pageflow.log('Feature unset: ' + name, {
          force: true
        });
      };

      tests[name] = test;
    },

    /**
     * Check whether the browser has a specific feature. This method
     * may only be called after the `#ready` promise is resolved.
     *
     * @param name [String] Name of the feature.
     * @return [Boolean]
     * @memberof pageflow.browser
     */
    has: function has(name) {
      if (this.ready().state() != 'resolved') {
        throw 'Feature detection has not finished yet.';
      }

      if (results[name] === undefined) {
        throw 'Unknown feature "' + name + '".';
      }

      return results[name];
    },

    /**
     * A promise that is resolved once feature detection has finished.
     *
     * @return [Promise]
     * @memberof pageflow.browser
     */
    ready: function ready() {
      return _ready.promise();
    },

    /** @api private */
    detectFeatures: function detectFeatures() {
      var promises = {};

      var asyncHas = function asyncHas(name) {
        var runTest = function runTest() {
          var value,
              underscoredName = name.replace(/ /g, '_');

          if (pageflow.debugMode() && location.href.indexOf('&has=' + underscoredName) >= 0) {
            value = location.href.indexOf('&has=' + underscoredName + '_on') >= 0;
            pageflow.log('FEATURE OVERRIDDEN ' + name + ': ' + value, {
              force: true
            });
            return value;
          } else if ((pageflow.debugMode() || pageflow.ALLOW_FEATURE_OVERRIDES) && window.localStorage && typeof window.localStorage['override ' + name] !== 'undefined') {
            value = window.localStorage['override ' + name] === 'on';
            pageflow.log('FEATURE OVERRIDDEN ' + name + ': ' + value, {
              force: true
            });
            return value;
          } else {
            return tests[name](asyncHas);
          }
        };

        promises[name] = promises[name] || $.when(runTest());
        return promises[name];
      };

      asyncHas.not = function (name) {
        return asyncHas(name).pipe(function (result) {
          return !result;
        });
      };

      asyncHas.all = function ()
      /* arguments */
      {
        return $.when.apply(null, arguments).pipe(function ()
        /* arguments */
        {
          return _.all(arguments);
        });
      };

      $.when.apply(null, _.map(_.keys(tests), function (name) {
        return asyncHas(name).then(function (result) {
          var cssClassName = name.replace(/ /g, '_');
          $('body').toggleClass('has_' + cssClassName, !!result);
          $('body').toggleClass('has_no_' + cssClassName, !result);
          results[name] = !!result;
        });
      })).then(_ready.resolve);
      return this.ready();
    }
  };
}();

/**
 * Detect browser via user agent. Use only if feature detection is not
 * an option.
 */

pageflow.browser.Agent = function (userAgent) {
  return {
    matchesSilk: function matchesSilk() {
      return matches(/\bSilk\b/);
    },
    matchesDesktopSafari: function matchesDesktopSafari() {
      return this.matchesSafari() && !this.matchesMobilePlatform();
    },
    matchesDesktopSafari9: function matchesDesktopSafari9() {
      return this.matchesSafari9() && !this.matchesMobilePlatform();
    },
    matchesDesktopSafari10: function matchesDesktopSafari10() {
      return this.matchesSafari10() && !this.matchesMobilePlatform();
    },
    matchesSafari9: function matchesSafari9() {
      return this.matchesSafari() && matches(/Version\/9/i);
    },
    matchesSafari10: function matchesSafari10() {
      return this.matchesSafari() && matches(/Version\/10/i);
    },
    matchesSafari11: function matchesSafari11() {
      return this.matchesSafari() && matches(/Version\/11/i);
    },
    matchesSafari11AndAbove: function matchesSafari11AndAbove() {
      return this.matchesSafari() && captureGroupGreaterOrEqual(/Version\/(\d+)/i, 11);
    },
    matchesSafari: function matchesSafari() {
      // - Chrome also reports to be a Safari
      // - Safari does not report to be a Chrome
      // - Edge also reports to be a Safari, but also reports to be Chrome
      return matches(/Safari\//i) && !matches(/Chrome/i);
    },

    /**
     * Returns true on iOS Safari.
     * @return {boolean}
     */
    matchesMobileSafari: function matchesMobileSafari() {
      var matchers = [/iPod/i, /iPad/i, /iPhone/i];
      return _.any(matchers, function (matcher) {
        return userAgent.match(matcher);
      });
    },

    /**
     * Returns true on iOS or Android.
     * @return {boolean}
     */
    matchesMobilePlatform: function matchesMobilePlatform() {
      var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];
      return _.any(matchers, function (matcher) {
        return userAgent.match(matcher);
      });
    },

    /**
     * Returns true on Internet Explorser version 9, 10 and 11.
     * @return {boolean}
     */
    matchesIEUpTo11: function matchesIEUpTo11() {
      return userAgent.match(/Trident\//);
    },

    /**
     * Returns true in InApp browser of Facebook app.
     * @return {boolean}
     */
    matchesFacebookInAppBrowser: function matchesFacebookInAppBrowser() {
      return userAgent.match(/FBAN/) && userAgent.match(/FBAV/);
    }
  };

  function matches(exp) {
    return !!userAgent.match(exp);
  }

  function captureGroupGreaterOrEqual(exp, version) {
    var match = userAgent.match(exp);
    return match && match[1] && parseInt(match[1], 10) >= version;
  }
};

pageflow.browser.agent = new pageflow.browser.Agent(navigator.userAgent);

pageflow.browser.feature('autoplay support', function (has) {
  return !pageflow.browser.agent.matchesSafari11AndAbove() && !pageflow.browser.agent.matchesMobilePlatform();
});

// See https://developer.mozilla.org/de/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support
pageflow.browser.feature('css animations', function () {
  var prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
      elm = document.createElement('div');

  if (elm.style.animationName !== undefined) {
    return true;
  }

  for (var i = 0; i < prefixes.length; i++) {
    if (elm.style[prefixes[i] + 'AnimationName'] !== undefined) {
      return true;
    }
  }

  return false;
});

// Facebook app displays a toolbar at the bottom of the screen on iOS
// phone which hides parts of the browser viewport. Normally this is
// hidden once the user scrolls, but since there is no native
// scrolling in Pageflow, the bar stays and hides page elements like
// the slim player controls.
pageflow.browser.feature('facebook toolbar', function (has) {
  return has.all(has('iphone platform'), pageflow.browser.agent.matchesFacebookInAppBrowser());
});

pageflow.browser.feature('high bandwidth', function () {
  return pageflow.bandwidth().pipe(function (result) {
    var isHigh = result.speedInBps > 8000 * 1024;

    if (window.console) {
      window.console.log('Detected bandwidth ' + result.speedInBps / 8 / 1024 + 'KB/s. High: ' + (isHigh ? 'Yes' : 'No'));
    }

    return isHigh;
  });
});

pageflow.browser.feature('ie', function () {
  if (navigator.appName == 'Microsoft Internet Explorer') {
    return true;
  } else {
    return false;
  }
});

pageflow.browser.feature('ios platform', function () {
  return pageflow.browser.agent.matchesMobileSafari();
});
pageflow.browser.feature('iphone platform', function (has) {
  return has.all(has('ios platform'), has('phone platform'));
});

pageflow.browser.feature('mobile platform', function () {
  return pageflow.browser.agent.matchesMobilePlatform();
});

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
  $('html').addClass('ipad ios7');
}

pageflow.browser.feature('phone platform', function () {
  var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /IEMobile/i];
  return _.any(matchers, function (matcher) {
    return navigator.userAgent.match(matcher) && $(window).width() < 700;
  });
});

pageflow.browser.feature('pushstate support', function () {
  return window.history && 'pushState' in window.history;
});

pageflow.browser.feature('request animation frame support', function () {
  return 'requestAnimationFrame' in window || 'web';
});

pageflow.browser.feature('touch support', function () {
  return 'ontouchstart' in window ||
  /* Firefox on android */
  window.DocumentTouch && document instanceof window.DocumentTouch ||
  /* > 0 on IE touch devices */
  navigator.maxTouchPoints;
});

pageflow.browser.feature('rewrite video sources support', function () {
  // set from conditionally included script file
  return !pageflow.ie9;
});
pageflow.browser.feature('stop buffering support', function (has) {
  return has.not('mobile platform');
});
pageflow.browser.feature('buffer underrun waiting support', function (has) {
  return has.not('mobile platform');
});
pageflow.browser.feature('prebuffering support', function (has) {
  return has.not('mobile platform');
});
pageflow.browser.feature('mp4 support only', function (has) {
  // - Silk does not play videos with hls source
  // - Desktop Safari 9.1 does not loop hls videos
  // - Desktop Safari 10 does not loop hls videos on El
  //   Capitan. Appears to be fixed on Sierra
  return pageflow.browser.agent.matchesSilk() || pageflow.browser.agent.matchesDesktopSafari9() || pageflow.browser.agent.matchesDesktopSafari10();
});
pageflow.browser.feature('mse and native hls support', function (has) {
  return pageflow.browser.agent.matchesSafari() && !pageflow.browser.agent.matchesMobilePlatform();
});
pageflow.browser.feature('native video player', function (has) {
  return has('iphone platform');
});

pageflow.browser.feature('volume control support', function (has) {
  return has.not('ios platform');
});
pageflow.browser.feature('audio context volume fading support', function () {
  return !pageflow.browser.agent.matchesDesktopSafari();
});

/**
 * Obtain the globally shared audio context. There can only be a
 * limited number of `AudioContext` objects in one page.
 *
 * @since 12.1
 */
pageflow.audioContext = {
  /**
   * @returns [AudioContext]
   *   Returns `null` if web audio API is not supported or creating
   *   the context fails.
   */
  get: function get() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (typeof this._audioContext === 'undefined') {
      try {
        this._audioContext = AudioContext && new AudioContext();
      } catch (e) {
        this._audioContext = null;
        pageflow.log('Failed to create AudioContext.', {
          force: true
        });
      }
    }

    return this._audioContext;
  }
};

pageflow.mediaPlayer = {
  enhance: function enhance(player, options) {
    pageflow.mediaPlayer.handleFailedPlay(player, _.extend({
      hasAutoplaySupport: pageflow.browser.has('autoplay support')
    }, options));
    pageflow.mediaPlayer.asyncPlay(player);

    if (options.hooks) {
      pageflow.mediaPlayer.hooks(player, options.hooks);
    }

    if (options.volumeFading) {
      pageflow.mediaPlayer.volumeFading(player);
      pageflow.mediaPlayer.volumeBinding(player, pageflow.settings, options);
    }

    if (options.loadWaiting) {
      pageflow.mediaPlayer.loadWaiting(player);
    }
  }
};

pageflow.mediaPlayer.handleFailedPlay = function (player, options) {
  var originalPlay = player.play;

  player.play = function ()
  /* arguments */
  {
    var result = originalPlay.apply(player, arguments);

    if (result && typeof result["catch"] !== 'undefined') {
      return result["catch"](function (e) {
        if (e.name === 'NotAllowedError' && options.hasAutoplaySupport) {
          if (options.fallbackToMutedAutoplay) {
            player.muted(true);
            return originalPlay.apply(player, arguments).then(function () {
              player.trigger('playmuted');
            }, function () {
              player.trigger('playfailed');
            });
          } else {
            player.trigger('playfailed');
          }
        } else {
          pageflow.log('Caught play exception for video.');
        }
      });
    }

    return result;
  };
};

pageflow.mediaPlayer.volumeFading = function (player) {
  if (!pageflow.browser.has('volume control support')) {
    return pageflow.mediaPlayer.volumeFading.noop(player);
  } else if (pageflow.browser.has('audio context volume fading support') && pageflow.audioContext.get() && player.getMediaElement) {
    return pageflow.mediaPlayer.volumeFading.webAudio(player, pageflow.audioContext.get());
  } else {
    return pageflow.mediaPlayer.volumeFading.interval(player);
  }
};

pageflow.mediaPlayer.volumeFading.interval = function (player) {
  var originalVolume = player.volume;
  var fadeVolumeDeferred;
  var fadeVolumeInterval;

  player.volume = function (value) {
    if (typeof value !== 'undefined') {
      cancelFadeVolume();
    }

    return originalVolume.apply(player, arguments);
  };

  player.fadeVolume = function (value, duration) {
    cancelFadeVolume();
    return new $.Deferred(function (deferred) {
      var resolution = 10;
      var startValue = volume();
      var steps = duration / resolution;
      var leap = (value - startValue) / steps;

      if (value === startValue) {
        deferred.resolve();
      } else {
        fadeVolumeDeferred = deferred;
        fadeVolumeInterval = setInterval(function () {
          volume(volume() + leap);

          if (volume() >= value && value >= startValue || volume() <= value && value <= startValue) {
            resolveFadeVolume();
          }
        }, resolution);
      }
    });
  };

  player.one('dispose', cancelFadeVolume);

  function volume()
  /* arguments */
  {
    return originalVolume.apply(player, arguments);
  }

  function resolveFadeVolume() {
    clearInterval(fadeVolumeInterval);
    fadeVolumeDeferred.resolve();
    fadeVolumeInterval = null;
    fadeVolumeDeferred = null;
  }

  function cancelFadeVolume() {
    if (fadeVolumeInterval) {
      clearInterval(fadeVolumeInterval);
      fadeVolumeDeferred.reject();
      fadeVolumeInterval = null;
      fadeVolumeDeferred = null;
    }
  }
};

pageflow.mediaPlayer.volumeFading.noop = function (player) {
  player.fadeVolume = function (value, duration) {
    return new $.Deferred().resolve().promise();
  };
};

pageflow.mediaPlayer.volumeFading.webAudio = function (player, audioContext) {
  var gainNode;
  var currentDeferred;
  var currentTimeout;
  var currentValue = 1;
  var lastStartTime;
  var lastDuration;
  var lastStartValue;
  var allowedMinValue = 0.000001;

  if (audioContext.state === 'suspended') {
    pageflow.events.on('background_media:unmute', function () {
      player.volume(currentValue);
    });
  }

  function tryResumeIfSuspended() {
    return new $.Deferred(function (deferred) {
      if (audioContext.state === 'suspended') {
        var maybePromise = audioContext.resume();

        if (maybePromise && maybePromise.then) {
          maybePromise.then(handleDeferred);
        } else {
          setTimeout(handleDeferred, 0);
        }
      } else {
        deferred.resolve();
      }

      function handleDeferred() {
        if (audioContext.state === 'suspended') {
          deferred.reject();
        } else {
          deferred.resolve();
        }
      }
    }).promise();
  }

  player.volume = function (value) {
    if (typeof value !== 'undefined') {
      tryResumeIfSuspended().then(function () {
        ensureGainNode();
        cancel();
        currentValue = ensureInAllowedRange(value);
        gainNode.gain.setValueAtTime(currentValue, audioContext.currentTime);
      }, function () {
        currentValue = ensureInAllowedRange(value);
      });
    }

    return Math.round(currentValue * 100) / 100;
  };

  player.fadeVolume = function (value, duration) {
    return tryResumeIfSuspended().then(function () {
      ensureGainNode();
      cancel();
      recordFadeStart(duration);
      currentValue = ensureInAllowedRange(value);
      gainNode.gain.setValueAtTime(lastStartValue, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(currentValue, audioContext.currentTime + duration / 1000);
      return new $.Deferred(function (deferred) {
        currentTimeout = setTimeout(resolve, duration);
        currentDeferred = deferred;
      }).promise();
    }, function () {
      currentValue = ensureInAllowedRange(value);
      return new $.Deferred().resolve().promise();
    });
  };

  player.one('dispose', cancel);

  function ensureGainNode() {
    if (!gainNode) {
      gainNode = audioContext.createGain();
      var source = audioContext.createMediaElementSource(player.getMediaElement());
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    }
  }

  function resolve() {
    clearTimeout(currentTimeout);
    currentDeferred.resolve();
    currentTimeout = null;
    currentDeferred = null;
  }

  function cancel() {
    if (currentDeferred) {
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
      clearTimeout(currentTimeout);
      currentDeferred.reject();
      currentTimeout = null;
      currentDeferred = null;
      updateCurrentValueFromComputedValue();
    }
  }

  function recordFadeStart(duration) {
    lastStartTime = audioContext.currentTime;
    lastStartValue = currentValue;
    lastDuration = duration;
  }

  function updateCurrentValueFromComputedValue() {
    // Firefox 54 on Ubuntu does not provide computed values when gain
    // was changed via one of the scheduling methods. Instead
    // gain.value always reports 1. Interpolate manually do determine
    // how far the fade was performed before cancel was called.
    if (gainNode.gain.value == 1) {
      var performedDuration = (audioContext.currentTime - lastStartTime) * 1000;
      var lastDelta = currentValue - lastStartValue;
      var performedFraction = lastDelta > 0 ? performedDuration / lastDuration : 1;
      currentValue = ensureInAllowedRange(lastStartValue + performedFraction * lastDelta);
    } else {
      currentValue = gainNode.gain.value;
    }
  }

  function ensureInAllowedRange(value) {
    return value < allowedMinValue ? allowedMinValue : value;
  }
};

pageflow.mediaPlayer.volumeBinding = function (player, settings, options) {
  options = options || {};
  var originalPlay = player.play;
  var originalPause = player.pause;
  var volumeFactor = 'volumeFactor' in options ? options.volumeFactor : 1;

  player.play = function () {
    player.intendToPlay();
    player.volume(player.targetVolume());
    listenToVolumeSetting();
    return originalPlay.call(player);
  };

  player.playAndFadeIn = function (duration) {
    if (!player.paused() && !player.intendingToPause()) {
      return new $.Deferred().resolve().promise();
    }

    player.intendToPlay();
    player.volume(0);
    return $.when(originalPlay.call(player)).then(function () {
      listenToVolumeSetting();
      return player.fadeVolume(player.targetVolume(), duration).then(null, function () {
        return new $.Deferred().resolve().promise();
      });
    });
  };

  player.pause = function () {
    stopListeningToVolumeSetting();
    originalPause.call(player);
  };

  player.fadeOutAndPause = function (duration) {
    if (player.paused() && !player.intendingToPlay()) {
      return new $.Deferred().resolve().promise();
    }

    player.intendToPause();
    stopListeningToVolumeSetting();
    return player.fadeVolume(0, duration).always(function () {
      return player.ifIntendingToPause().then(function () {
        originalPause.call(player);
      });
    });
  };

  player.changeVolumeFactor = function (factor, duration) {
    volumeFactor = factor;
    return player.fadeVolume(player.targetVolume(), duration);
  };

  player.targetVolume = function () {
    return settings.get('volume') * volumeFactor;
  };

  function listenToVolumeSetting() {
    player.on('dispose', stopListeningToVolumeSetting);
    settings.on('change:volume', onVolumeChange);
  }

  function stopListeningToVolumeSetting() {
    player.off('dispose', stopListeningToVolumeSetting);
    settings.off('change:volume', onVolumeChange);
  }

  function onVolumeChange(model, value) {
    player.fadeVolume(player.targetVolume(), 40);
  }
};

pageflow.mediaPlayer.loadWaiting = function (player) {
  var originalFadeVolume = player.fadeVolume;

  player.fadeVolume = function ()
  /* args */
  {
    var args = arguments;
    return $.when(this.loadedPromise).then(function () {
      return originalFadeVolume.apply(player, args);
    });
  };
};

pageflow.mediaPlayer.hooks = function (player, hooks) {
  var originalPlay = player.play;

  if (hooks.before) {
    player.play = function ()
    /* args */
    {
      var args = arguments;
      player.trigger('beforeplay');
      player.intendToPlay();
      return $.when(hooks.before()).then(function () {
        return player.ifIntendingToPlay().then(function () {
          return originalPlay.apply(player, args);
        });
      });
    };
  }

  if (hooks.after) {
    player.on('pause', hooks.after);
    player.on('ended', hooks.after);
  }
};

pageflow.mediaPlayer.asyncPlay = function (player) {
  var originalPlay = player.play;
  var originalPause = player.pause;
  var intendingToPlay = false;
  var intendingToPause = false;

  player.play = function ()
  /* arguments */
  {
    player.intendToPlay();
    return originalPlay.apply(player, arguments);
  };

  player.pause = function ()
  /* arguments */
  {
    player.intendToPause();
    return originalPause.apply(player, arguments);
  };

  player.intendToPlay = function () {
    intendingToPlay = true;
    intendingToPause = false;
  };

  player.intendToPause = function () {
    intendingToPause = true;
    intendingToPlay = false;
  };

  player.intendingToPlay = function () {
    return intendingToPlay;
  };

  player.intendingToPause = function () {
    return intendingToPause;
  };

  player.ifIntendingToPause = function () {
    return promiseFromBoolean(intendingToPause);
  };

  player.ifIntendingToPlay = function () {
    return promiseFromBoolean(intendingToPlay);
  };

  function promiseFromBoolean(value) {
    return new $.Deferred(function (deferred) {
      if (value) {
        deferred.resolve();
      } else {
        deferred.reject('aborted');
      }
    }).promise();
  }
};

pageflow.VideoPlayer = function (element, options) {
  options = options || {};
  element = pageflow.VideoPlayer.filterSources(element);
  var player = videojs(element, options);

  if (options.useSlimPlayerControlsDuringPhonePlayback) {
    pageflow.mediaPlayer.useSlimPlayerControlsDuringPhonePlayback(player);
  }

  pageflow.VideoPlayer.prebuffering(player);
  pageflow.VideoPlayer.cueSettingsMethods(player);
  pageflow.VideoPlayer.getMediaElementMethod(player);

  if (options.mediaEvents) {
    pageflow.VideoPlayer.mediaEvents(player, options.context);
  }

  if (options.bufferUnderrunWaiting) {
    pageflow.VideoPlayer.bufferUnderrunWaiting(player);
  }

  pageflow.mediaPlayer.enhance(player, options);
  return player;
};

videojs.Html5DashJS.hook('beforeinitialize', function (player, mediaPlayer) {
  mediaPlayer.getDebug().setLogToBrowserConsole(false);
});

pageflow.mediaPlayer.useSlimPlayerControlsDuringPhonePlayback = function (player) {
  var originalPlay = player.play;

  player.play = function () {
    if (pageflow.browser.has('phone platform') && !pageflow.browser.has('native video player')) {
      pageflow.widgets.use({
        name: 'slim_player_controls',
        insteadOf: 'classic_player_controls'
      }, function (restoreWidgets) {
        player.one('pause', restoreWidgets);
      });
    }

    return originalPlay.apply(this, arguments);
  };
};

pageflow.VideoPlayer.mediaEvents = function (player, context) {
  function triggerMediaEvent(name) {
    pageflow.events.trigger('media:' + name, {
      fileName: player.currentSrc(),
      context: context,
      currentTime: player.currentTime(),
      duration: player.duration(),
      volume: player.volume(),
      bitrate: pageflow.browser.has('high bandwidth') ? 3500000 : 2000000
    });
  }

  player.on('play', function () {
    triggerMediaEvent('play');
  });
  player.on('timeupdate', function () {
    triggerMediaEvent('timeupdate');
  });
  player.on('pause', function () {
    triggerMediaEvent('pause');
  });
  player.on('ended', function () {
    triggerMediaEvent('ended');
  });
};

pageflow.VideoPlayer.prebuffering = function (player) {
  player.isBufferedAhead = function (delta, silent) {
    // video.js only gives us one time range starting from 0 here. We
    // still ask for the last time range to be on the safe side.
    var timeRanges = player.buffered();
    var currentBufferTime = timeRanges.end(timeRanges.length - 1);
    var desiredBufferTime = player.currentTime() + delta;

    if (player.duration()) {
      desiredBufferTime = Math.min(desiredBufferTime, Math.floor(player.duration()));
    }

    var result = currentBufferTime >= desiredBufferTime;

    if (!silent) {
      pageflow.log('buffered ahead ' + delta + ': ' + result + ' (' + currentBufferTime + '/' + desiredBufferTime + ')');
    }

    return result;
  };

  player.prebuffer = function (options) {
    options = options || {};
    var delta = options.secondsToBuffer || 10;
    var secondsToWait = options.secondsToWait || 3;
    var interval = 200;
    var maxCount = secondsToWait * 1000 / interval;
    var count = 0;
    var deferred = $.Deferred();

    var _timeout;

    if (pageflow.browser.has('prebuffering support')) {
      if (!player.isBufferedAhead(delta) && !player.prebufferDeferred) {
        pageflow.log('prebuffering video ' + player.src());

        _timeout = function timeout() {
          setTimeout(function () {
            if (!player.prebufferDeferred) {
              return;
            }

            count++;

            if (player.isBufferedAhead(delta) || count > maxCount) {
              pageflow.log('finished prebuffering video ' + player.src());
              deferred.resolve();
              player.prebufferDeferred = null;
            } else {
              _timeout();
            }
          }, interval);
        };

        _timeout();

        player.prebufferDeferred = deferred;
      }
    }

    return player.prebufferDeferred ? player.prebufferDeferred.promise() : deferred.resolve().promise();
  };

  player.abortPrebuffering = function () {
    if (player.prebufferDeferred) {
      pageflow.log('ABORT prebuffering');
      player.prebufferDeferred.reject();
      player.prebufferDeferred = null;
    }
  };

  var originalPause = player.pause;

  player.pause = function () {
    player.abortPrebuffering();
    return originalPause.apply(this, arguments);
  };

  player.one('dispose', function () {
    player.abortPrebuffering();
  });
};

pageflow.VideoPlayer.bufferUnderrunWaiting = function (player) {
  var originalPause = player.pause;

  player.pause = function () {
    cancelWaiting();
    originalPause.apply(this, arguments);
  };

  function pauseAndPreloadOnUnderrun() {
    if (bufferUnderrun()) {
      pauseAndPreload();
    }
  }

  function bufferUnderrun() {
    return !player.isBufferedAhead(0.1, true) && !player.waitingOnUnderrun && !ignoringUnderruns();
  }

  function pauseAndPreload() {
    pageflow.log('Buffer underrun');
    player.trigger('bufferunderrun');
    player.pause();
    player.waitingOnUnderrun = true;
    player.prebuffer({
      secondsToBuffer: 5,
      secondsToWait: 5
    }).then(function () {
      // do nothing if user aborted waiting by clicking pause
      if (player.waitingOnUnderrun) {
        player.waitingOnUnderrun = false;
        player.trigger('bufferunderruncontinue');
        player.play();
      }
    });
  }

  function cancelWaiting() {
    if (player.waitingOnUnderrun) {
      player.ignoreUnderrunsUntil = new Date().getTime() + 5 * 1000;
      player.waitingOnUnderrun = false;
      player.trigger('bufferunderruncontinue');
    }
  }

  function ignoringUnderruns() {
    var r = player.ignoreUnderrunsUntil && new Date().getTime() < player.ignoreUnderrunsUntil;

    if (r) {
      pageflow.log('ignoring underrun');
    }

    return r;
  }

  function stopListeningForProgress() {
    player.off('progress', pauseAndPreloadOnUnderrun);
  }

  if (pageflow.browser.has('buffer underrun waiting support')) {
    player.on('play', function () {
      player.on('progress', pauseAndPreloadOnUnderrun);
    });
    player.on('pause', stopListeningForProgress);
    player.on('ended', stopListeningForProgress);
  }
};

pageflow.VideoPlayer.filterSources = function (playerElement) {
  if (!$(playerElement).is('video')) {
    return playerElement;
  }

  var changed = false;

  if (pageflow.browser.has('mp4 support only')) {
    // keep only mp4 source
    $(playerElement).find('source').not('source[type="video/mp4"]').remove();
    changed = true;
  } else if (pageflow.browser.has('mse and native hls support')) {
    // remove dash source to ensure hls is used
    $(playerElement).find('source[type="application/dash+xml"]').remove();
    changed = true;
  }

  if (changed) {
    // the video tags initially in the dom are broken since they "saw"
    // the other sources. replace with clones
    var clone = $(playerElement).clone(true);
    $(playerElement).replaceWith(clone);
    return clone[0];
  } else {
    return playerElement;
  }
};

pageflow.VideoPlayer.Lazy = function (template, options) {
  var placeholder = $('<span class="video_placeholder" />'),
      that = this,
      readyCallbacks = new $.Callbacks(),
      disposeTimeout,
      videoTag,
      videoPlayer,
      html;
  saveHtml(template);
  template.before(placeholder);

  this.ensureCreated = function () {
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

  this.isPresent = function () {
    return videoTag && !disposeTimeout;
  };

  this.dispose = function () {
    if (videoTag && !pageflow.browser.has('mobile platform')) {
      this.setEmptySrc();
      $(videoPlayer.el()).replaceWith(placeholder);
      videoPlayer.dispose();
      videoPlayer = null;
      videoTag = null;
    }
  };

  this.setEmptySrc = function () {
    videoPlayer.src([{
      type: 'video/webm',
      src: pageflow.assetUrls.emptyWebm
    }, {
      type: 'video/mp4',
      src: pageflow.assetUrls.emptyMp4
    }]);
  };

  this.scheduleDispose = function () {
    if (!disposeTimeout) {
      disposeTimeout = setTimeout(function () {
        that.dispose();
      }, 5 * 1000);
    }
  }; // proxied methods


  this.ready = function (callback) {
    readyCallbacks.add(callback);
  };

  this.paused = function () {
    return videoPlayer && videoPlayer.paused();
  };

  this.volume = function ()
  /* arguments */
  {
    if (!videoPlayer) {
      return 0;
    }

    return videoPlayer.volume.apply(videoPlayer, arguments);
  };

  this.showPosterImage = function () {
    return videoPlayer && videoPlayer.posterImage.show();
  };

  this.hidePosterImage = function () {
    return videoPlayer && videoPlayer.posterImage.unlockShowing();
  };

  _.each(['play', 'playAndFadeIn', 'pause', 'fadeOutAndPause', 'prebuffer', 'src', 'on', 'load', 'currentTime', 'muted'], function (method) {
    that[method] = function ()
    /* args */
    {
      var args = arguments;

      if (!videoPlayer) {
        pageflow.log('Video Player not yet initialized. (' + method + ')', {
          force: true
        });
        return;
      }

      return new $.Deferred(function (deferred) {
        videoPlayer.ready(function () {
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
    } else if (pageflow.browser.has('high bandwidth') && !pageflow.browser.has('mobile platform')) {
      element.attr('poster', element.attr('data-large-poster'));
      element.find('source').each(function () {
        $(this).attr('src', $(this).attr('data-high-src'));
      });
    } else {
      element.attr('poster', element.attr('data-poster'));
    }

    return element;
  }
};

pageflow.VideoPlayer.cueSettingsMethods = function (player) {
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
  player.updateCueLineSettings = function (line) {
    var components = line.split('.');
    var value = components[0];
    var command = components[1];
    value = value == 'top' ? 1 : value;
    var changed = false;

    _(player.textTracks()).each(function (textTrack) {
      if (textTrack.mode == 'showing' && textTrack.cues) {
        for (var i = 0; i < textTrack.cues.length; i++) {
          if (textTrack.cues[i].line != value) {
            textTrack.cues[i].line = value;
            changed = true;
          }
        }
      }
    }); // Setting `line` does not update display directly, but only when
    // the next cue is displayed. This is problematic, when we
    // reposition text tracks to prevent overlap with player
    // controls. Triggering the event makes VideoJS update positions.
    // Ensure display is also updated when the current showing text
    // track changed since the last call, i.e. `line` has been changed
    // for a cue even though the previous call had the same
    // parameters.


    if ((this.prevLine !== line || changed) && command != 'lazy') {
      var tech = player.tech({
        IWillNotUseThisInPlugins: true
      });
      tech && tech.trigger('texttrackchange');
    }

    this.prevLine = line;
  };
};

pageflow.VideoPlayer.getMediaElementMethod = function (player) {
  player.getMediaElement = function () {
    var tech = player.tech({
      IWillNotUseThisInPlugins: true
    });
    return tech && tech.el();
  };
};

pageflow.Settings = Backbone.Model.extend({
  defaults: {
    volume: 1
  },
  initialize: function initialize() {
    var storage = this.getLocalStorage();

    if (storage) {
      if (storage['pageflow.settings']) {
        try {
          this.set(JSON.parse(storage['pageflow.settings']));
        } catch (e) {
          pageflow.log(e);
        }
      }

      this.on('change', function () {
        storage['pageflow.settings'] = JSON.stringify(this);
      });
    }
  },
  getLocalStorage: function getLocalStorage() {
    try {
      return window.localStorage;
    } catch (e) {
      // Safari throws SecurityError when accessing window.localStorage
      // if cookies/website data are disabled.
      return null;
    }
  }
});
pageflow.settings = new pageflow.Settings();

var pageflow$1 = window.pageflow;

export { pageflow$1 as pageflow };
