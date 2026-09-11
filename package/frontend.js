import BackboneEvents from 'backbone-events-standalone';
import VideoJS from 'video.js';

class Persistence {
  constructor({
    cookies
  }) {
    this.cookies = cookies;
  }
  store(vendors, signal) {
    const vendorsByCookieName = vendors.reduce((sorted, vendor) => {
      const cookieName = vendor.cookieName;
      sorted[cookieName] = sorted[cookieName] || [];
      sorted[cookieName].push(vendor);
      return sorted;
    }, {});
    Object.entries(vendorsByCookieName).forEach(([cookieName, vendors]) => {
      const cookieDomain = vendors[0].cookieDomain;
      this.setCookie(cookieName, JSON.stringify(vendors.reduce((result, vendor) => {
        result[vendor.cookieKey || vendor.name] = signal === 'accepted' ? true : signal === 'denied' ? false : signal[vendor.name];
        return result;
      }, {})), cookieDomain);
    });
  }
  update(vendor, signal) {
    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};
    this.setCookie(vendor.cookieName, JSON.stringify({
      ...flags,
      [vendor.cookieKey || vendor.name]: signal
    }), vendor.cookieDomain);
  }
  read(vendor) {
    const content = this.cookies.getItem(vendor.cookieName);
    const flags = content ? JSON.parse(content) : {};
    const flag = flags[vendor.cookieKey || vendor.name];
    return flag === true ? 'accepted' : flag === false ? 'denied' : 'undecided';
  }
  setCookie(name, value, domain) {
    if (domain && !window.location.hostname.match(new RegExp(`${domain}$`))) {
      domain = null;
    }
    this.cookies.setItem(name, value, {
      path: '/',
      domain,
      expires: Infinity,
      // Ensure cookie can be read iframe embed
      sameSite: 'None',
      secure: true
    });
  }
}

//  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
const cookies = {
  getItem: function (sKey) {
    if (!sKey) {
      return null;
    }
    // eslint-disable-next-line no-useless-escape
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem(...args) {
    document.cookie = setItemCookieString(...args);
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) {
      return false;
    }
    // eslint-disable-next-line no-useless-escape
    return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
  },
  keys: function () {
    // eslint-disable-next-line no-useless-escape
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
};
function setItemCookieString(key, value, expiresOrOptions, path, domain, secure) {
  if (expiresOrOptions && typeof expiresOrOptions === 'object' && expiresOrOptions.constructor !== Date) {
    return setItemCookieStringWithOptions(key, value, expiresOrOptions);
  } else {
    return setItemCookieStringWithOptions(key, value, {
      expires: expiresOrOptions,
      path,
      domain,
      secure
    });
  }
}
function setItemCookieStringWithOptions(key, value, {
  expires,
  path,
  domain,
  secure,
  sameSite
}) {
  let expiresPart = "";
  if (expires) {
    switch (expires.constructor) {
      case Number:
        expiresPart = expires === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + expires;
        break;
      case String:
        expiresPart = "; expires=" + expires;
        break;
      case Date:
        expiresPart = "; expires=" + expires.toUTCString();
        break;
    }
  }
  return encodeURIComponent(key) + "=" + encodeURIComponent(value) + expiresPart + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (sameSite ? "; SameSite=" + sameSite : "") + (secure ? "; Secure" : "");
}

const supportedParadigms = ['external opt-out', 'opt-in', 'lazy opt-in', 'skip'];
class Consent {
  constructor({
    cookies,
    inEditor
  }) {
    this.requestedPromise = new Promise(resolve => {
      this.requestedPromiseResolve = resolve;
    });
    this.vendors = [];
    this.persistence = new Persistence({
      cookies
    });
    this.emitter = {
      ...BackboneEvents
    };
    this.inEditor = inEditor;
  }
  registerVendor(name, {
    displayName,
    description,
    paradigm,
    cookieName,
    cookieKey,
    cookieDomain
  }) {
    if (this.vendorRegistrationClosed) {
      throw new Error(`Vendor ${name} has been registered after ` + 'registration has been closed.');
    }
    if (!name.match(/^[a-z0-9-_]+$/i)) {
      throw new Error(`Invalid vendor name '${name}'. ` + 'Only letters, numbers, hyphens and underscores are allowed.');
    }
    if (supportedParadigms.indexOf(paradigm) < 0) {
      throw new Error(`unknown paradigm ${paradigm}`);
    }
    this.vendors.push({
      displayName,
      description,
      name,
      paradigm,
      cookieName: cookieName || 'pageflow_consent',
      cookieKey,
      cookieDomain
    });
  }
  closeVendorRegistration() {
    this.vendorRegistrationClosed = true;
    if (!this.getUndecidedOptInVendors().length) {
      this.triggerDecisionEvents();
      return;
    }
    const vendors = this.getRequestedVendors();
    this.requestedPromiseResolve({
      vendors: this.withState(vendors),
      acceptAll: () => {
        this.persistence.store(vendors, 'accepted');
        this.triggerDecisionEvents();
      },
      denyAll: () => {
        this.persistence.store(vendors, 'denied');
        this.triggerDecisionEvents();
      },
      save: vendorConsent => {
        this.persistence.store(vendors, vendorConsent);
        this.triggerDecisionEvents();
      }
    });
  }
  relevantVendors({
    include: additionalVendorNames
  } = {}) {
    return this.withState(this.vendors.filter(vendor => {
      return (additionalVendorNames === null || additionalVendorNames === void 0 ? void 0 : additionalVendorNames.includes(vendor.name)) || vendor.paradigm === 'opt-in' || vendor.paradigm === 'external opt-out' || vendor.paradigm === 'lazy opt-in' && this.persistence.read(vendor) !== 'undecided';
    }), {
      applyDefaults: true
    });
  }
  require(vendorName) {
    if (this.inEditor) {
      return Promise.resolve('fulfilled');
    }
    const vendor = this.findVendor(vendorName, 'require consent for');
    switch (vendor.paradigm) {
      case 'opt-in':
      case 'lazy opt-in':
        if (this.getUndecidedOptInVendors().length) {
          return new Promise(resolve => {
            this.emitter.once(`${vendor.name}:accepted`, () => resolve('fulfilled'));
            this.emitter.once(`${vendor.name}:denied`, () => resolve('failed'));
          });
        }
        if (this.persistence.read(vendor) === 'accepted') {
          return Promise.resolve('fulfilled');
        } else {
          return Promise.resolve('failed');
        }
      case 'external opt-out':
        if (this.persistence.read(vendor) === 'denied') {
          return Promise.resolve('failed');
        }
        return Promise.resolve('fulfilled');
      case 'skip':
        return Promise.resolve('fulfilled');
      default:
        // should not be used
        return null;
    }
  }
  requireAccepted(vendorName) {
    if (this.inEditor) {
      return Promise.resolve('fulfilled');
    }
    const vendor = this.findVendor(vendorName, 'require consent for');
    if (vendor.paradigm === 'opt-in' || vendor.paradigm === 'lazy opt-in') {
      if (this.getUndecidedOptInVendors().length || this.persistence.read(vendor) !== 'accepted') {
        return new Promise(resolve => {
          this.emitter.once(`${vendor.name}:accepted`, () => resolve('fulfilled'));
        });
      }
      return Promise.resolve('fulfilled');
    } else {
      return this.require(vendorName);
    }
  }
  requested() {
    return this.requestedPromise;
  }
  accept(vendorName) {
    const vendor = this.findVendor(vendorName, 'accept');
    this.persistence.update(vendor, true);
    this.emitter.trigger(`${vendor.name}:accepted`);
  }
  deny(vendorName) {
    const vendor = this.findVendor(vendorName, 'deny');
    this.persistence.update(vendor, false);
  }
  getRequestedVendors() {
    return this.vendors.filter(vendor => {
      return vendor.paradigm !== 'skip';
    });
  }
  getUndecidedOptInVendors() {
    return this.vendors.filter(vendor => {
      return vendor.paradigm === 'opt-in' && this.persistence.read(vendor) === 'undecided';
    });
  }
  triggerDecisionEvents() {
    this.vendors.filter(vendor => {
      return vendor.paradigm !== 'skip';
    }).forEach(vendor => {
      this.emitter.trigger(`${vendor.name}:${this.persistence.read(vendor)}`);
    });
  }
  findVendor(vendorName, actionForErrorMessage) {
    const vendor = this.vendors.find(vendor => vendor.name === vendorName);
    if (!vendor) {
      throw new Error(`Cannot ${actionForErrorMessage} unknown vendor "${vendorName}". ` + 'Consider using consent.registerVendor.');
    }
    return vendor;
  }
  withState(vendors, {
    applyDefaults
  } = {}) {
    return vendors.map(vendor => {
      const state = this.persistence.read(vendor);
      return {
        ...vendor,
        state: state === 'undecided' && applyDefaults ? this.getDefaultState(vendor) : state
      };
    });
  }
  getDefaultState(vendor) {
    if (vendor.paradigm === 'external opt-out') {
      return 'accepted';
    }
    return 'undecided';
  }
}
Consent.create = function () {
  const inEditor = typeof PAGEFLOW_EDITOR !== 'undefined' && PAGEFLOW_EDITOR;
  return new Consent({
    cookies,
    inEditor
  });
};

const log = function (text, options) {
  if (window.console && (debugMode() || options && options.force)) {
    window.console.log(text);
  }
};
const debugMode = function () {
  return window.location.href.indexOf('debug=true') >= 0;
};

const state = typeof window !== 'undefined' && window.pageflow || {};

const assetUrls = state.assetUrls || {};

const events = Object.assign({}, BackboneEvents);

/**
 * Detect browser via user agent. Use only if feature detection is not
 * an option.
 */
const Agent = function (userAgent) {
  return {
    matchesSilk: function () {
      return matches(/\bSilk\b/);
    },
    matchesDesktopSafari: function (options) {
      if (options) {
        return this.matchesSafari() && !this.matchesMobilePlatform() && matchesMinVersion(/Version\/(\d+)/i, options.minVersion);
      } else {
        return this.matchesSafari() && !this.matchesMobilePlatform();
      }
    },
    matchesDesktopSafari9: function () {
      return this.matchesSafari9() && !this.matchesMobilePlatform();
    },
    matchesDesktopSafari10: function () {
      return this.matchesSafari10() && !this.matchesMobilePlatform();
    },
    matchesSafari9: function () {
      return this.matchesSafari() && matches(/Version\/9/i);
    },
    matchesSafari10: function () {
      return this.matchesSafari() && matches(/Version\/10/i);
    },
    matchesSafari11: function () {
      return this.matchesSafari() && matches(/Version\/11/i);
    },
    matchesSafari11AndAbove: function () {
      return this.matchesSafari() && matchesMinVersion(/Version\/(\d+)/i, 11);
    },
    matchesSafari: function () {
      // - Chrome also reports to be a Safari
      // - Safari does not report to be a Chrome
      // - Edge also reports to be a Safari, but also reports to be Chrome
      return matches(/Safari\//i) && !matches(/Chrome/i);
    },
    /**
     * Returns true on iOS Safari.
     * @return {boolean}
     */
    matchesMobileSafari: function ({
      osVersions
    } = {}) {
      var deviceMatchers = [/iPod/i, /iPad/i, /iPhone/i];
      if (osVersions) {
        return deviceMatchers.some(matcher => userAgent.match(matcher)) && osVersions.some(osVersion => userAgent.includes(osVersion.replace('.', '_')));
      } else {
        return matchesiPadSafari13AndAbove() || deviceMatchers.some(matcher => userAgent.match(matcher)) && !window.MSStream // IE exclusion from being detected as an iOS device;
        ;
      }
    },
    /**
     * Returns true on Android.
     * @return {boolean}
     */
    matchesAndroid: function () {
      return matches(/Android/i);
    },
    /**
     * Returns true on iOS or Android.
     * @return {boolean}
     */
    matchesMobilePlatform: function () {
      var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];
      return matchers.some(function (matcher) {
        return userAgent.match(matcher);
      }) || matchesiPadSafari13AndAbove();
    },
    /**
     * Returns true on Internet Explorser version 9, 10 and 11.
     * @return {boolean}
     */
    matchesIEUpTo11: function () {
      return userAgent.match(/Trident\//);
    },
    /**
     * Returns true in InApp browser of Facebook app.
     * @return {boolean}
     */
    matchesFacebookInAppBrowser: function () {
      return userAgent.match(/FBAN/) && userAgent.match(/FBAV/);
    },
    matchesDesktopChrome: function (options) {
      if (options) {
        return this.matchesChrome() && !this.matchesMobilePlatform() && matchesMinVersion(/Chrome\/(\d+)/i, options.minVersion);
      } else {
        return this.matchesChrome() && !this.matchesMobilePlatform();
      }
    },
    matchesDesktopFirefox: function (options) {
      if (options) {
        return this.matchesFirefox() && !this.matchesMobilePlatform() && matchesMinVersion(/Firefox\/(\d+)/i, options.minVersion);
      } else {
        return this.matchesFirefox() && !this.matchesMobilePlatform();
      }
    },
    matchesDesktopEdge: function (options) {
      if (options) {
        return this.matchesEdge() && !this.matchesMobilePlatform() && matchesMinVersion(/Edg\/(\d+)/i, options.minVersion);
      } else {
        return this.matchesEdge() && !this.matchesMobilePlatform();
      }
    },
    /**
    * Returns true on Google Chrome.
    * @return {boolean}
    */
    matchesChrome: function () {
      // - Edge also reports to be a Chrome
      return matches(/Chrome\//i) && !matches(/Edg/i);
    },
    /**
    * Returns true on Firefox.
    * @return {boolean}
    */
    matchesFirefox: function () {
      return matches(/Firefox\//i) && !matches(/Seamonkey/i);
    },
    /**
    * Returns true on Microsoft Edge.
    * @return {boolean}
    */
    matchesEdge: function () {
      return matches(/Edg\//i);
    }
  };
  function matches(exp) {
    return !!userAgent.match(exp);
  }
  function matchesMinVersion(exp, version) {
    var match = userAgent.match(exp);
    return match && match[1] && parseInt(match[1], 10) >= version;
  }

  //After ios13 update, iPad reports the same user string
  //as Safari on Dekstop MacOS.
  //At the time of this writing there are no other devices
  //with multi-touch support other than IOS/iPadOS
  //See: https://stackoverflow.com/a/58064481
  function matchesiPadSafari13AndAbove() {
    return agent.matchesSafari() && navigator.maxTouchPoints > 1 && navigator.platform === 'MacIntel';
  }
};
const agent = new Agent(typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr');

/**
 * Browser feature detection.
 *
 * @since 0.9
 */
const browser = function () {
  var tests = {},
    results = {},
    featureDetectionComplete = false;
  let readyPromiseResolve;
  let readyPromise = new Promise(function (resolve, reject) {
    readyPromiseResolve = resolve;
  });
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
    feature: function (name, test) {
      var s = name.replace(/ /g, '_');
      this.off[s] = function () {
        window.localStorage['override ' + name] = 'off';
        log('Feature off: ' + name, {
          force: true
        });
      };
      this.on[s] = function () {
        window.localStorage['override ' + name] = 'on';
        log('Feature on: ' + name, {
          force: true
        });
      };
      this.unset[s] = function () {
        window.localStorage.removeItem('override ' + name);
        log('Feature unset: ' + name, {
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
    has: function (name) {
      if (!featureDetectionComplete) {
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
     * @return Promise
     * @memberof pageflow.browser
     */
    ready: function () {
      return readyPromise;
    },
    /** @api private */
    detectFeatures: function () {
      var promises = {};
      var asyncHas = function (name) {
        var runTest = function () {
          var value,
            underscoredName = name.replace(/ /g, '_');
          if (debugMode() && location.href.indexOf('&has=' + underscoredName) >= 0) {
            value = location.href.indexOf('&has=' + underscoredName + '_on') >= 0;
            log('FEATURE OVERRIDDEN ' + name + ': ' + value, {
              force: true
            });
            return value;
          } else if ((debugMode() || window.PAGEFLOW_ALLOW_FEATURE_OVERRIDES) && window.localStorage && typeof window.localStorage['override ' + name] !== 'undefined') {
            value = window.localStorage['override ' + name] === 'on';
            log('FEATURE OVERRIDDEN ' + name + ': ' + value, {
              force: true
            });
            return value;
          } else {
            return tests[name](asyncHas);
          }
        };
        promises[name] = promises[name] || Promise.all([runTest()]).then(a => {
          return a[0];
        });
        return promises[name];
      };
      asyncHas.not = function (name) {
        return asyncHas(name).then(function (result) {
          return !result;
        });
      };
      asyncHas.all = function /* arguments */
      () {
        return Promise.all(arguments).then(function (results) {
          return results.every(result => result);
        });
      };
      Promise.all(Object.keys(tests).map(function (name) {
        return asyncHas(name).then(function (result) {
          var cssClassName = name.replace(/ /g, '_');
          document.body.classList.toggle('has_' + cssClassName, !!result);
          document.body.classList.toggle('has_no_' + cssClassName, !result);
          results[name] = !!result;
        });
      })).then(() => {
        featureDetectionComplete = true;
        readyPromiseResolve();
      });
      return this.ready();
    }
  };
}();

browser.feature('broken ogg support', function () {
  // ogg is not supported on iOS < 18.4 and broken on iOS 18.4
  return agent.matchesMobileSafari();
});

browser.feature('autoplay support', function (has) {
  return !agent.matchesSafari11AndAbove() && !agent.matchesMobilePlatform();
});

// See https://developer.mozilla.org/de/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support

browser.feature('css animations', function () {
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
browser.feature('facebook toolbar', function (has) {
  return has.all(has('iphone platform'), agent.matchesFacebookInAppBrowser());
});

browser.feature('ie', function () {
  if (navigator.appName == 'Microsoft Internet Explorer') {
    return true;
  } else {
    return false;
  }
});

browser.feature('ios platform', function () {
  return agent.matchesMobileSafari();
});
browser.feature('iphone platform', function (has) {
  return has.all(has('ios platform'), has('phone platform'));
});

browser.feature('mobile platform', function () {
  return agent.matchesMobilePlatform();
});

browser.feature('phone platform', function () {
  var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /IEMobile/i];
  return matchers.some(function (matcher) {
    return navigator.userAgent.match(matcher) && window.innerWidth < 700;
  });
});

browser.feature('pushstate support', function () {
  return window.history && 'pushState' in window.history;
});

browser.feature('request animation frame support', function () {
  return 'requestAnimationFrame' in window || 'web';
});

browser.feature('touch support', function () {
  return 'ontouchstart' in window || /* Firefox on android */
  window.DocumentTouch && document instanceof window.DocumentTouch || /* > 0 on IE touch devices */
  navigator.maxTouchPoints;
});

browser.feature('rewrite video sources support', function () {
  // set from conditionally included script file
  return !state.ie9;
});
browser.feature('stop buffering support', function (has) {
  return has.not('mobile platform');
});
browser.feature('buffer underrun waiting support', function (has) {
  return has.not('mobile platform');
});
browser.feature('prebuffering support', function (has) {
  return has.not('mobile platform');
});
browser.feature('mp4 support only', function (has) {
  // - Silk does not play videos with hls source
  // - Desktop Safari 9.1 does not loop hls videos
  // - Desktop Safari 10 does not loop hls videos on El
  //   Capitan. Appears to be fixed on Sierra
  return agent.matchesSilk() || agent.matchesDesktopSafari9() || agent.matchesDesktopSafari10();
});
browser.feature('mse and native hls support', function (has) {
  return agent.matchesSafari() && !agent.matchesMobilePlatform();
});
browser.feature('native video player', function (has) {
  return has('iphone platform');
});
browser.feature('video scaling bug fixed by load', function (has) {
  // When reusing video elements for videos with different
  // resolutions, Safari gets confused and scales videos incorrectly -
  // drawing them to only cover a part of the element. This appears to
  // not happen when the video is loaded or played immediately after
  // changing the source. No longer reproducible in iOS 17.4.
  return agent.matchesMobileSafari({
    osVersions: ['17.0', '17.1', '17.2', '17.3']
  });
});

browser.feature('volume control support', function (has) {
  return has.not('ios platform');
});
browser.feature('audio context volume fading support', function () {
  return !agent.matchesDesktopSafari();
});

browser.agent = agent;
browser.Agent = Agent;

/**
 * Let plugins register functions which extend the editor or
 * slideshow with certain functionality when a named feature is
 * enabled.
 *
 * @alias pageflow.features
 * @since 0.9
 */
class Features {
  /** @lends pageflow.features */

  /** @api private */
  constructor() {
    this.registry = {};
    this.enabledFeatureNames = [];
  }

  /**
   * `pageflow.features` has been renamed to `pageflow.browser`.
   * @deprecated
   */
  has( /* arguments */
  ) {
    return browser.has.apply(browser, arguments);
  }

  /**
   * Register a function to configure a feature when it is active.
   *
   * @param {String} scope - Name of the scope the passed function
   *   shall be called in.
   * @param name [String] Name of the feature
   * @param fn [Function] Function to call when the given feature
   *   is activate.
   */
  register(scope, name, fn) {
    this.registry[scope] = this.registry[scope] || {};
    this.registry[scope][name] = this.registry[scope][name] || [];
    this.registry[scope][name].push(fn);
  }

  /**
   * Check if a feature as been enabled.
   *
   * @param name [String]
   * @return [Boolean]
   */
  isEnabled(name) {
    return this.enabledFeatureNames.includes(name);
  }

  /** @api private */
  enable(scope, names) {
    var fns = this.registry[scope] || {};
    this.enabledFeatureNames = this.enabledFeatureNames.concat(names);
    names.forEach(function (name) {
      (fns[name] || []).forEach(function (fn) {
        fn();
      });
    });
  }
}
const features = new Features();

const handleFailedPlay = function (player, options) {
  var originalPlay = player.play;
  player.play = function /* arguments */
  () {
    var result = originalPlay.apply(player, arguments);
    if (result && typeof result.catch !== 'undefined') {
      return result.catch(function (e) {
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
          log('Caught play exception for video.');
        }
      });
    }
    return result;
  };
};

const asyncPlay = function (player) {
  var originalPlay = player.play;
  var originalPause = player.pause;
  var intendingToPlay = false;
  var intendingToPause = false;
  player.play = function /* arguments */
  () {
    player.intendToPlay();
    return originalPlay.apply(player, arguments);
  };
  player.pause = function /* arguments */
  () {
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
    return new Promise(function (resolve, reject) {
      if (value) {
        resolve();
      } else {
        reject('aborted');
      }
    });
  }
};

const hooks = function (player, hooks) {
  var originalPlay = player.play;
  player.updateHooks = newHooks => {
    hooks = newHooks;
  };
  player.play = function /* args */
  () {
    var args = arguments;
    player.trigger('beforeplay');
    player.intendToPlay();
    if (hooks.before) {
      return Promise.all([hooks.before()]).then(function () {
        return player.ifIntendingToPlay().then(function () {
          return originalPlay.apply(player, args);
        });
      });
    } else {
      return originalPlay.apply(player, args);
    }
  };
  if (player.afterHookListener) {
    player.off('pause', player.afterHookListener);
    player.off('ended', player.afterHookListener);
  }
  player.afterHookListener = () => {
    if (hooks.after) {
      hooks.after();
    }
  };
  player.on('pause', player.afterHookListener);
  player.on('ended', player.afterHookListener);
};

const volumeBinding = function (player, settings, options) {
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
      return Promise.resolve();
    }
    player.intendToPlay();
    player.volume(0);
    return Promise.all([originalPlay.call(player)]).then(function () {
      listenToVolumeSetting();
      return player.ifIntendingToPlay().then(function () {
        return player.fadeVolume(player.targetVolume(), duration).then(null, function () {
          return Promise.resolve();
        });
      });
    });
  };
  player.pause = function () {
    stopListeningToVolumeSetting();
    originalPause.call(player);
  };
  player.fadeOutAndPause = function (duration) {
    if (player.paused() && !player.intendingToPlay()) {
      return Promise.resolve();
    }
    player.intendToPause();
    stopListeningToVolumeSetting();
    return player.fadeVolume(0, duration).then(function () {
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
    return (options.ignoreVolumeSetting ? 1 : settings.get('volume')) * volumeFactor;
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

/**
 * Obtain the globally shared audio context. There can only be a
 * limited number of `AudioContext` objects in one page.
 *
 * @since 12.1
 */
const audioContext = {
  /**
   * @returns [AudioContext]
   *   Returns `null` if web audio API is not supported or creating
   *   the context fails.
   */
  get: function () {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (typeof this._audioContext === 'undefined') {
      try {
        this._audioContext = AudioContext && new AudioContext();
      } catch (e) {
        this._audioContext = null;
        log('Failed to create AudioContext.', {
          force: true
        });
      }
    }
    return this._audioContext;
  }
};

const webAudio = function (player, audioContext) {
  var gainNode;
  var currentResolve;
  var currentTimeout;
  var currentValue = 1;
  var lastStartTime;
  var lastDuration;
  var lastStartValue;
  var allowedMinValue = 0.000001;
  if (audioContext.state === 'suspended') {
    events.on('background_media:unmute', function () {
      player.volume(currentValue);
    });
  }
  function tryResumeIfSuspended() {
    return new Promise(function (resolve, reject) {
      if (audioContext.state === 'suspended') {
        var maybePromise = audioContext.resume();
        if (maybePromise && maybePromise.then) {
          maybePromise.then(handlePromise);
        } else {
          setTimeout(handlePromise, 0);
        }
      } else {
        resolve();
      }
      function handlePromise() {
        if (audioContext.state === 'suspended') {
          reject();
        } else {
          resolve();
        }
      }
    });
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
      return new Promise(function (resolve, reject) {
        currentResolve = resolve;
        currentTimeout = setTimeout(resolveCurrent, duration);
      });
    }, function () {
      currentValue = ensureInAllowedRange(value);
      return Promise.resolve();
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
  function resolveCurrent() {
    clearTimeout(currentTimeout);
    currentResolve('done');
    currentTimeout = null;
    currentResolve = null;
  }
  function cancel() {
    if (currentResolve) {
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
      clearTimeout(currentTimeout);
      currentResolve('cancelled');
      currentTimeout = null;
      currentResolve = null;
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

const noop = function (player) {
  player.fadeVolume = function (value, duration) {
    return Promise.resolve();
  };
};

const interval = function (player) {
  const originalVolume = player.volume;
  let fadeVolumeResolve;
  let fadeVolumeInterval;
  player.volume = function (value) {
    if (typeof value !== 'undefined') {
      cancelFadeVolume();
    }
    return originalVolume.apply(player, arguments);
  };
  player.fadeVolume = function (value, duration) {
    cancelFadeVolume();
    return new Promise(function (resolve, reject) {
      const resolution = 10;
      const startValue = volume();
      const steps = duration / resolution;
      const leap = (value - startValue) / steps;
      if (value === startValue) {
        resolve();
      } else {
        fadeVolumeResolve = resolve;
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
  function volume( /* arguments */
  ) {
    return originalVolume.apply(player, arguments);
  }
  function resolveFadeVolume() {
    clearInterval(fadeVolumeInterval);
    fadeVolumeResolve('done');
    fadeVolumeInterval = null;
    fadeVolumeResolve = null;
  }
  function cancelFadeVolume() {
    if (fadeVolumeResolve) {
      fadeVolumeResolve('cancelled');
      fadeVolumeResolve = null;
    }
    if (fadeVolumeInterval) {
      clearInterval(fadeVolumeInterval);
      fadeVolumeInterval = null;
    }
  }
};

const volumeFading = function (player) {
  if (!browser.has('volume control support')) {
    return noop(player);
  } else if (browser.has('audio context volume fading support') && audioContext.get() && player.getMediaElement) {
    return webAudio(player, audioContext.get());
  } else {
    return interval(player);
  }
};

volumeFading.interval = interval;
volumeFading.noop = noop;
volumeFading.webAudio = webAudio;

const loadWaiting = function (player) {
  var originalFadeVolume = player.fadeVolume;
  player.fadeVolume = function /* args */
  () {
    var args = arguments;
    return Promise.all([this.loadedPromise]).then(function () {
      return originalFadeVolume.apply(player, args);
    });
  };
};

class Settings {
  constructor() {
    this.attributes = {
      volume: 1
    };
    this.initialize();
  }
  get(attributeName) {
    return this.attributes[attributeName];
  }
  set(key, value) {
    let attrs;
    if (typeof key === 'object') {
      attrs = key;
    } else {
      (attrs = {})[key] = value;
    }
    for (const attr in attrs) {
      this.attributes[attr] = attrs[attr];
      this.trigger('change:' + attr);
    }
    this.trigger('change');
  }
  toJSON() {
    return {
      ...this.attributes
    };
  }
  initialize() {
    const storage = this.getLocalStorage();
    if (storage) {
      if (storage['pageflow.settings']) {
        try {
          this.set(JSON.parse(storage['pageflow.settings']));
        } catch (e) {
          log(e);
        }
      }
      this.on('change', function () {
        storage['pageflow.settings'] = JSON.stringify(this.attributes);
      });
    }
  }
  getLocalStorage() {
    try {
      return window.localStorage;
    } catch (e) {
      // Safari throws SecurityError when accessing window.localStorage
      // if cookies/website data are disabled.
      return null;
    }
  }
}
Object.assign(Settings.prototype, BackboneEvents);
const settings = new Settings();

const mediaPlayer = {
  enhance: function (player, options) {
    handleFailedPlay(player, {
      hasAutoplaySupport: browser.has('autoplay support'),
      ...options
    });
    asyncPlay(player);
    if (options.hooks) {
      hooks(player, options.hooks);
    }
    if (options.volumeFading) {
      volumeFading(player);
      volumeBinding(player, settings, options);
    }
    if (options.loadWaiting) {
      loadWaiting(player);
    }
  }
};

mediaPlayer.handleFailedPlay = handleFailedPlay;
mediaPlayer.volumeBinding = volumeBinding;
mediaPlayer.volumeFading = volumeFading;
mediaPlayer.loadWaiting = loadWaiting;
mediaPlayer.hooks = hooks;
mediaPlayer.asyncPlay = asyncPlay;

// Replacement for Underscore's throttle, because scrolled entries
// don't have Underscore anymore

function throttle(func, timeFrame) {
  var lastTime = 0;
  return function (options) {
    var now = new Date();
    func = func.bind(this);
    if (now - lastTime >= timeFrame) {
      func(options);
      lastTime = now;
    }
  };
}

const mediaEvents = function (player, context) {
  function triggerMediaEvent(name) {
    events.trigger('media:' + name, {
      fileName: player.currentSrc,
      context: context,
      currentTime: player.position,
      duration: player.duration,
      volume: player.volume(),
      bitrate: 128000
    });
  }
  player.on('play', function () {
    triggerMediaEvent('play');
  });
  player.on('seeking', function () {
    triggerMediaEvent('seeking');
  });
  player.on('seeked', function () {
    triggerMediaEvent('seeked');
  });
  player.on('timeupdate', function () {
    triggerMediaEvent('timeupdate');
  });
  player.on('timeupdate', throttle(function () {
    triggerMediaEvent('timeupdate_throttled');
  }, 5000));
  player.on('pause', function () {
    triggerMediaEvent('pause');
  });
  player.on('ended', function () {
    triggerMediaEvent('ended');
  });
};

// Prevent audio play back when browser enters background on mobile
// device. Use the face that timeupdate events continue to fire while
// intervals no longer executed when the browser is in the background.
const pauseInBackground = function (player) {
  var interval;
  var lastInterval;
  var resolution = 100;
  function startProbeInterval() {
    interval = setInterval(function () {
      lastInterval = new Date().getTime();
    }, resolution);
  }
  function stopProbeInterval() {
    clearInterval(interval);
    interval = null;
  }
  function pauseIfProbeIntervalHalted() {
    if (intervalHalted()) {
      player.pause();
    }
  }
  function intervalHalted() {
    return interval && lastInterval < new Date().getTime() - resolution * 5;
  }
  player.on('play', startProbeInterval);
  player.on('pause', stopProbeInterval);
  player.on('ended', stopProbeInterval);
  player.on('timeupdate', pauseIfProbeIntervalHalted);
};

/**
 * Calling seek before the media tag is ready causes InvalidState
 * exeption. If this happens, we wait for the next progress event and
 * retry. We resolve a promise once seeking succeeded.
 *
 * @api private
 */
const seekWithInvalidStateHandling = function (player) {
  var originalSeek = player.seek;
  player.seek = function (time) {
    return retryOnProgress(function () {
      originalSeek.call(player, time);
    });
  };
  function retryOnProgress(fn) {
    var tries = 0;
    return new Promise(function (resolve, reject) {
      function tryOrWaitForProgress() {
        tries += 1;
        if (tries >= 50) {
          reject();
          return;
        }
        try {
          fn();
          resolve();
        } catch (e) {
          player.one('progress', tryOrWaitForProgress);
        }
      }
      tryOrWaitForProgress();
    });
  }
};

const rewindMethod = function (player) {
  /**
   * Seek to beginning of file. If already at the beginning do
   * nothing.
   *
   * @alias pageflow.AudioPlayer#rewind
   */
  player.rewind = function () {
    if (player.position > 0) {
      var result = player.seek(0);
      player.trigger('timeupdate', player.position, player.duration);
      return result;
    } else {
      return Promise.resolve();
    }
  };
};

const getMediaElementMethod = function (player) {
  player.getMediaElement = function () {
    return player.audio.audio;
  };
};

/**
 * Playing audio sources
 *
 * @param {Object[]} sources
 * List of sources for audio element.
 *
 * @param {string} sources[].type
 * Mime type of the audio.
 *
 * @param {string} sources[].src
 * Url of the audio.
 *
 * @class
 */
const AudioPlayer = function (sources, options) {
  options = options || {};
  var codecMapping = {
    vorbis: 'audio/ogg',
    mp4: 'audio/mp4',
    mp3: 'audio/mpeg'
  };
  let readyResolve;
  let readyPromise = new Promise(function (resolve) {
    readyResolve = resolve;
  });
  let loadedResolve;
  let loadedPromise = new Promise(function (resolve) {
    loadedResolve = resolve;
  });
  var audio = new Audio5js({
    reusedTag: options.tag,
    swf_path: assetUrls.audioSwf,
    throw_errors: false,
    format_time: false,
    codecs: options.codecs || ['vorbis', 'mp4', 'mp3'],
    ready: readyResolve,
    loop: options.loop
  });
  audio.readyPromise = readyPromise;
  audio.loadedPromise = loadedPromise;
  audio.on('load', loadedResolve);
  if (options.mediaEvents) {
    mediaEvents(audio, options.context);
  }
  if (options.pauseInBackground && browser.has('mobile platform')) {
    pauseInBackground(audio);
  }
  mediaPlayer.enhance(audio, {
    loadWaiting: true,
    ...options
  });
  seekWithInvalidStateHandling(audio);
  rewindMethod(audio);
  getMediaElementMethod(audio);
  audio.src = function (sources) {
    readyPromise.then(function () {
      var source = (sources || []).find(function (source) {
        return codecMapping[audio.settings.player.codec] === source.type;
      });
      audio.load(source ? source.src : '');
    });
  };
  var originalLoad = audio.load;
  audio.load = function (src) {
    if (!src) {
      this.duration = 0;
    }
    this.currentSrc = src;
    this.position = 0;
    this.trigger('timeupdate', this.position, this.duration);
    originalLoad.apply(this, arguments);
  };
  var originalSeek = audio.seek;
  audio.seek = function () {
    if (this.currentSrc) {
      return originalSeek.apply(this, arguments);
    }
  };
  var originalPlay = audio.play;
  audio.play = function () {
    if (this.currentSrc) {
      originalPlay.apply(this, arguments);
    }
  };
  audio.paused = function () {
    return !audio.playing;
  };
  audio.src(sources);
  return audio;
};
AudioPlayer.fromAudioTag = function (element, options) {
  return new AudioPlayer(element.find('source').map(function () {
    return {
      src: this.getAttribute('src'),
      type: this.getAttribute('type')
    };
  }).get(), {
    tag: element[0],
    ...options
  });
};
AudioPlayer.fromScriptTag = function (element, options) {
  var sources = element.length ? JSON.parse(element.text()) : [];
  return new AudioPlayer(sources, options);
};

const Null = function () {
  this.playAndFadeIn = function () {
    return Promise.resolve();
  };
  this.fadeOutAndPause = function () {
    return Promise.resolve();
  };
  this.changeVolumeFactor = function () {
    return Promise.resolve();
  };
  this.play = function () {};
  this.pause = function () {};
  this.paused = function () {
    return true;
  };
  this.seek = function () {
    return Promise.resolve();
  };
  this.rewind = function () {
    return Promise.resolve();
  };
  this.formatTime = function () {};
  this.one = function (event, handler) {
    handler();
  };
};
Object.assign(Null.prototype, BackboneEvents);

AudioPlayer.mediaEvents = mediaEvents;
AudioPlayer.Null = Null;
AudioPlayer.seekWithInvalidStateHandling = seekWithInvalidStateHandling;
AudioPlayer.rewindMethod = rewindMethod;
AudioPlayer.pauseInBackground = pauseInBackground;

if (typeof window !== 'undefined') {
  window.VIDEOJS_NO_DYNAMIC_STYLE = true;
}

const filterSources = function (playerElement) {
  if (playerElement.tagName.toLowerCase() !== 'video') {
    return playerElement;
  }
  var changed = false;
  if (browser.has('mp4 support only')) {
    // keep only mp4 source
    playerElement.querySelectorAll('source').forEach(source => {
      if (source.type !== 'video/mp4') {
        playerElement.removeChild(source);
      }
    });
    changed = true;
  } else if (browser.has('mse and native hls support')) {
    // remove dash source to ensure hls is used
    const dashSource = playerElement.querySelector('source[type="application/dash+xml"]');
    if (dashSource) {
      playerElement.removeChild(dashSource);
      changed = true;
    }
  }
  if (changed) {
    // the video tags initially in the dom are broken since they "saw"
    // the other sources. replace with clone
    var clone = playerElement.cloneNode(true);
    playerElement.replaceWith(clone);
    return clone;
  } else {
    return playerElement;
  }
};

const useSlimPlayerControlsDuringPhonePlayback = function (player) {
  var originalPlay = player.play;
  player.play = function () {
    if (browser.has('phone platform') && !browser.has('native video player')) {
      state.widgets.use({
        name: 'slim_player_controls',
        insteadOf: 'classic_player_controls'
      }, function (restoreWidgets) {
        player.one('pause', restoreWidgets);
      });
    }
    return originalPlay.apply(this, arguments);
  };
};

const prebuffering = function (player) {
  let prebufferPromiseReject;
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
      log('buffered ahead ' + delta + ': ' + result + ' (' + currentBufferTime + '/' + desiredBufferTime + ')');
    }
    return result;
  };
  player.prebuffer = function (options) {
    options = options || {};
    const delta = options.secondsToBuffer || 10;
    const secondsToWait = options.secondsToWait || 3;
    const interval = 200;
    const maxCount = secondsToWait * 1000 / interval;
    let count = 0;
    if (browser.has('prebuffering support')) {
      if (!player.isBufferedAhead(delta) && !player.prebufferPromise) {
        log('prebuffering video ' + player.src());
        player.prebufferPromise = new Promise((resolve, reject) => {
          prebufferPromiseReject = reject;
          wait();
          function wait() {
            setTimeout(function () {
              if (!player.prebufferPromise) {
                return;
              }
              count++;
              if (player.isBufferedAhead(delta) || count > maxCount) {
                log('finished prebuffering video ' + player.src());
                resolve();
                player.prebufferPromise = null;
              } else {
                wait();
              }
            }, interval);
          }
        });
      }
    }
    return player.prebufferPromise ? player.prebufferPromise : Promise.resolve();
  };
  player.abortPrebuffering = function () {
    if (player.prebufferPromise) {
      log('ABORT prebuffering');
      prebufferPromiseReject('prebuffering aborted');
      player.prebufferPromise = null;
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

const cueSettingsMethods = function (player) {
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
    Array.from(player.textTracks()).forEach(function (textTrack) {
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
    if ((this.prevLine !== line || changed) && command != 'lazy') {
      var tech = player.tech({
        IWillNotUseThisInPlugins: true
      });
      tech && tech.trigger('texttrackchange');
    }
    this.prevLine = line;
  };
};

const getMediaElementMethod$1 = function (player) {
  player.getMediaElement = function () {
    var tech = player.tech({
      IWillNotUseThisInPlugins: true
    });
    return tech && tech.el();
  };
};

const mediaEvents$1 = function (player, context) {
  player.updateMediaEventsContext = function (newContext) {
    context = newContext;
  };
  player.triggerMediaAllocate = function () {
    if (context) {
      events.trigger('media:allocate', {
        ...mediaEventPayload(),
        element: player.getMediaElement()
      });
    }
  };
  player.triggerMediaRelease = function () {
    if (context) {
      events.trigger('media:release', {
        ...mediaEventPayload(),
        element: player.getMediaElement()
      });
    }
  };
  player.on('play', function () {
    triggerMediaEvent('play');
  });
  player.on('seeking', function () {
    triggerMediaEvent('seeking');
  });
  player.on('seeked', function () {
    triggerMediaEvent('seeked');
  });
  player.on('timeupdate', function () {
    triggerMediaEvent('timeupdate');
  });
  player.on('timeupdate', throttle(function () {
    triggerMediaEvent('timeupdate_throttled');
  }, 5000));
  player.on('pause', function () {
    triggerMediaEvent('pause');
  });
  player.on('ended', function () {
    triggerMediaEvent('ended');
  });
  function triggerMediaEvent(name) {
    if (context) {
      events.trigger('media:' + name, mediaEventPayload());
    }
  }
  function mediaEventPayload() {
    return {
      fileName: player.previousSrc || player.currentSrc(),
      context: context,
      currentTime: player.currentTime(),
      duration: player.duration(),
      volume: player.volume(),
      altText: player.getMediaElement().getAttribute('alt'),
      bitrate: 3500000
    };
  }
};

const bufferUnderrunWaiting = function (player) {
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
    log('Buffer underrun');
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
    }, () => {});
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
      log('ignoring underrun');
    }
    return r;
  }
  function stopListeningForProgress() {
    player.off('progress', pauseAndPreloadOnUnderrun);
  }
  if (browser.has('buffer underrun waiting support')) {
    player.on('play', function () {
      player.on('progress', pauseAndPreloadOnUnderrun);
    });
    player.on('pause', stopListeningForProgress);
    player.on('ended', stopListeningForProgress);
  }
};

const rewindMethod$1 = function (player) {
  /**
   * Seek to beginning of file. If already at the beginning do
   * nothing.
   *
   * @alias pageflow.VideoPlayer#rewind
   */
  player.rewind = function () {
    if (player.currentTime() > 0) {
      player.currentTime(0);
      player.trigger('timeupdate', player.currentTime(), player.duration());
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };
};

const VideoPlayer = function (element, options) {
  options = options || {};
  element = filterSources(element);
  var player = VideoJS(element, options);
  if (options.useSlimPlayerControlsDuringPhonePlayback) {
    useSlimPlayerControlsDuringPhonePlayback(player);
  }
  prebuffering(player);
  cueSettingsMethods(player);
  getMediaElementMethod$1(player);
  rewindMethod$1(player);
  if (options.mediaEvents) {
    mediaEvents$1(player, options.context);
  }
  if (options.bufferUnderrunWaiting) {
    bufferUnderrunWaiting(player);
  }
  mediaPlayer.enhance(player, options);
  return player;
};

VideoPlayer.useSlimPlayerControlsDuringPhonePlayback = useSlimPlayerControlsDuringPhonePlayback;
VideoPlayer.prebuffering = prebuffering;
VideoPlayer.filterSources = filterSources;
VideoPlayer.mediaEvents = mediaEvents$1;
VideoPlayer.cueSettingsMethods = cueSettingsMethods;
VideoPlayer.bufferUnderrunWaiting = bufferUnderrunWaiting;

const createMediaPlayer = function (options) {
  let isAudio = options.tagName == 'AUDIO';
  const player = new VideoPlayer(options.mediaElement, {
    controlBar: false,
    loadingSpinner: false,
    bigPlayButton: false,
    errorDisplay: false,
    textTrackSettings: false,
    poster: options.poster,
    loop: options.loop,
    controls: options.controls,
    html5: {
      nativeCaptions: !isAudio && browser.has('iphone platform'),
      // Only used by pageflow-scrolled
      vhs: {
        useBandwidthFromLocalStorage: true,
        usePlayerObjectFit: true
      }
    },
    bufferUnderrunWaiting: true,
    fallbackToMutedAutoplay: !isAudio,
    ignoreVolumeSetting: true,
    volumeFading: true,
    hooks: {},
    mediaEvents: true,
    context: null
  });
  player.textTrackSettings = {
    getValues() {
      return {};
    }
  };
  player.playOrPlayOnLoad = function () {
    if (this.readyState() > 0) {
      player.play();
    } else {
      player.on('loadedmetadata', player.play);
    }
  };
  player.addClass('video-js');
  player.addClass('player');
  return player;
};

/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const BLANK_AUDIO_SRC = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBA' + 'AAAABAAEAIlYAAESsAAACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAA==';
const BLANK_VIDEO_SRC = 'data:video/mp4;base64,AAAAHGZ0eXBNNFYgAAACAG' + 'lzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARw' + 'AAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIE' + 'guMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3' + 'd3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYm' + 'xvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3' + 'JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbG' + 'lzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV' + '9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3Rocm' + 'VhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb2' + '5zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbn' + 'RfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcm' + 'M9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcH' + 'N0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYW' + 'xfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8m' + 'KAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' + 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4G' + 'SAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkA' + 'IZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAE' + 'mQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgA' + 'AAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC' + '/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkA' + 'IZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAE' + 'mQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgA' + 'AAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC' + '/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkA' + 'IZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAE' + 'mQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgA' + 'AAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgC' + 'vAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAh' + 'kAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQ' + 'AAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAA' + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAA' + 'AAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAA' + 'BAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobW' + 'RpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZG' + 'UAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAA' + 'AAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAA' + 'AAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAA' + 'ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFW' + 'dCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAA' + 'AAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2' + 'MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAA' + 'AACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAA' + 'oAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAA' + 'AAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABC' + 'UAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAA' + 'AFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAA' + 'AAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAA' + 'AAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAA' + 'AAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAA' + 'AAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAA' + 'AAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZA' + 'AAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAA' + 'AAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAA' + 'AAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAA' + 'IAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAA' + 'AACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAA' + 'EAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAA' + 'AAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAA' + 'IAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAA' + 'AAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAAD' + 'MAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAA' + 'AACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAA' + 'kAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAA' + 'AACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAA' + 'AAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAA' + 'AEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ' + '0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAA' + 'AAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYX' + 'ZmNTUuMzMuMTAw';
const blankSources = {
  audio: {
    src: BLANK_AUDIO_SRC,
    type: 'audio/wav'
  },
  video: {
    src: BLANK_VIDEO_SRC,
    type: 'video/mp4'
  }
};

/** @const @enum {string} */
const MediaType = {
  AUDIO: 'audio',
  VIDEO: 'video'
};
let elId = 0;

/**
 * Media pool class handles the pool of Videojs media players
 */
class MediaPool {
  constructor(options = {
    playerCount: 4
  }) {
    this.playerCount = options.playerCount;
    this.allocatedPlayers = {};
    this.unAllocatedPlayers = {};
    this.mediaFactory_ = {
      [MediaType.AUDIO]: () => {
        const audioEl = document.createElement('audio');
        audioEl.setAttribute('crossorigin', 'anonymous');
        return audioEl;
      },
      [MediaType.VIDEO]: () => {
        const videoEl = document.createElement('video');
        videoEl.setAttribute('crossorigin', 'anonymous');
        return videoEl;
      }
    };
  }
  allocatePlayer({
    playerType,
    playerId,
    playsInline,
    mediaEventsContextData,
    hooks,
    poster,
    loop = false,
    controls = false,
    altText,
    onRelease
  }) {
    let player = undefined;
    if (!this.unAllocatedPlayers[playerType]) {
      this.populateMediaPool_();
    }
    if (this.unAllocatedPlayers[playerType].length == 0) {
      this.freeOnePlayer(playerType);
    }
    player = this.unAllocatedPlayers[playerType].pop();
    if (player) {
      player.pause();
      player.getMediaElement().loop = loop;
      player.getMediaElement().setAttribute('alt', altText);
      player.poster(poster);
      player.controls(controls);
      if (playsInline) {
        player.playsinline(true);
      }
      player.updateHooks(hooks || {});
      player.updateMediaEventsContext(mediaEventsContextData);
      this.allocatedPlayers[playerType].push(player);
      player.playerId = playerId || this.allocatedPlayers[playerType].length;
      player.releaseCallback = onRelease;
      player.previousSrc = null;
      player.triggerMediaAllocate();
      return player;
    } else {
      console.log('no player found for allocation');
    }
  }
  freeOnePlayer(type) {
    this.unAllocatePlayer(this.allocatedPlayers[type][0]); // free up the first allocated player
  }
  unAllocatePlayer(player) {
    if (player) {
      player.triggerMediaRelease();
      let type = this.getMediaTypeFromEl(player.el());
      this.allocatedPlayers[type] = this.allocatedPlayers[type].filter(p => p != player);
      player.previousSrc = player.currentSrc();
      player.controls(false);
      player.getMediaElement().loop = false;
      player.playsinline(false);
      player.src(blankSources[type]);
      player.poster('');
      clearTextTracks(player);
      this.unAllocatedPlayers[type].push(player);
      if (player.releaseCallback) {
        player.releaseCallback();
        player.releaseCallback = null;
      }
      player.pause();
    }
  }
  blessAll(value) {
    if (this.unAllocatedPlayers[MediaType.AUDIO] == undefined || this.unAllocatedPlayers[MediaType.VIDEO] == undefined) {
      this.populateMediaPool_();
    }
    this.forEachMediaType(key => {
      this.allPlayersForType(MediaType[key]).forEach(player => {
        player.muted(value);
      });
    });
  }
  allPlayersForType(type) {
    if (this.unAllocatedPlayers[type]) {
      return [...this.unAllocatedPlayers[type], ...this.allocatedPlayers[type]];
    }
    return [];
  }
  getMediaTypeFromEl(mediaElement) {
    let tagName = mediaElement.tagName.toLowerCase();
    if (tagName == 'div') {
      tagName = mediaElement.children[0].tagName.toLowerCase();
    }
    return this.getMediaType(tagName);
  }
  getMediaType(tagName) {
    switch (tagName) {
      case 'audio':
        return MediaType.AUDIO;
      case 'video':
        return MediaType.VIDEO;
    }
  }
  forEachMediaType(callbackFn) {
    Object.keys(MediaType).forEach(callbackFn.bind(this));
  }
  createPlayer_(type, mediaEl) {
    mediaEl.setAttribute('pool-element', elId++);
    if (!this.unAllocatedPlayers[type]) {
      this.unAllocatedPlayers[type] = [];
      this.allocatedPlayers[type] = [];
    }
    let player = createMediaPlayer({
      mediaElement: mediaEl,
      tagName: type
    });
    mediaEl.setAttribute('src', blankSources[type].src);
    player.muted(true);
    this.unAllocatedPlayers[type].push(player);
    return player;
  }
  initializeMediaPool_(type, mediaElSeed) {
    const playerCount = typeof this.playerCount === 'function' ? this.playerCount(type) : this.playerCount;
    while (this.allPlayersForType(type).length < playerCount) {
      this.createPlayer_(type, mediaElSeed.cloneNode(true));
    }
  }
  populateMediaPool_() {
    this.forEachMediaType(key => {
      let type = MediaType[key];
      let mediaEl = this.mediaFactory_[type].call(this);
      this.initializeMediaPool_(type, mediaEl);
    });
  }
}
function clearTextTracks(player) {
  const tracks = player.textTracks();
  let i = tracks.length;
  while (i--) {
    player.removeRemoteTextTrack(tracks[i]);
  }
}

const media = {
  playerPool: new MediaPool({
    playerCount: () => features.isEnabled('large_player_pool') ? 10 : 4
  }),
  muteState: true,
  get muted() {
    return this.muteState;
  },
  mute: function (value) {
    this.muteState = value;
    this.playerPool.blessAll(value);
    this.trigger('change:muted', value);
  },
  getPlayer: function (fileSource, options) {
    options.playerType = options.tagName || MediaType.VIDEO;
    let player = this.playerPool.allocatePlayer(options);
    if (player) {
      player.muted(this.muteState);
      player.src(fileSource);
      if (options.textTrackSources) {
        options.textTrackSources.forEach(track => player.addRemoteTextTrack(track, true));
      }
      if (browser.has('video scaling bug fixed by load')) {
        player.load();
      }
      return player;
    }
  },
  releasePlayer: function (player) {
    if (player) {
      this.playerPool.unAllocatePlayer(player);
    }
  }
};
Object.assign(media, BackboneEvents);

/**
 * Play and fade between multiple audio files.
 *
 * @class
 */
const MultiPlayer = function (pool, options) {
  if (options.crossFade && options.playFromBeginning) {
    throw 'pageflow.Audio.MultiPlayer: The options crossFade and playFromBeginning can not be used together at the moment.';
  }
  var current = new AudioPlayer.Null();
  var currentId = null;
  var that = this;

  /**
   * Continue playback.
   */
  this.resume = function () {
    return current.play();
  };

  /**
   * Continue playback with fade in.
   */
  this.resumeAndFadeIn = function () {
    return current.playAndFadeIn(options.fadeDuration);
  };
  this.seek = function (position) {
    return current.seek(position);
  };
  this.pause = function () {
    return current.pause();
  };
  this.paused = function () {
    return current.paused();
  };
  this.fadeOutAndPause = function () {
    return current.fadeOutAndPause(options.fadeDuration);
  };
  this.fadeOutIfPlaying = function () {
    if (current.paused()) {
      return Promise.resolve();
    } else {
      return current.fadeOutAndPause(options.fadeDuration);
    }
  };
  this.position = function () {
    return current.position;
  };
  this.duration = function () {
    return current.duration;
  };
  this.fadeTo = function (id) {
    return changeCurrent(id, function (player) {
      return player.playAndFadeIn(options.fadeDuration);
    });
  };
  this.play = function (id) {
    return changeCurrent(id, function (player) {
      return player.play();
    });
  };
  this.changeVolumeFactor = function (factor) {
    return current.changeVolumeFactor(factor, options.fadeDuration);
  };
  this.formatTime = function (time) {
    return current.formatTime(time);
  };
  function changeCurrent(id, callback) {
    if (!options.playFromBeginning && id === currentId && !current.paused()) {
      return Promise.resolve();
    }
    var player = pool.get(id);
    currentId = id;
    var fadeOutPromise = current.fadeOutAndPause(options.fadeDuration);
    if (current._stopMultiPlayerEventPropagation && current.paused()) {
      current._stopMultiPlayerEventPropagation();
    }
    return handleCrossFade(fadeOutPromise).then(function () {
      current = player;
      startEventPropagation(current, id);
      return handlePlayFromBeginning(player).then(function () {
        return callback(player);
      });
    });
  }
  function handleCrossFade(fadePomise) {
    if (options.crossFade) {
      return Promise.resolve();
    } else {
      return fadePomise;
    }
  }
  function handlePlayFromBeginning(player) {
    if (options.playFromBeginning || options.rewindOnChange) {
      return player.rewind();
    } else {
      return Promise.resolve();
    }
  }
  function startEventPropagation(player, id) {
    let playCallback = function () {
      that.trigger('play', {
        audioFileId: id
      });
    };
    let pauseCallback = function () {
      that.trigger('pause', {
        audioFileId: id
      });
      if (currentId !== id) {
        player._stopMultiPlayerEventPropagation();
      }
    };
    let timeUpdateCallback = function () {
      that.trigger('timeupdate', {
        audioFileId: id
      });
    };
    let endedCallback = function () {
      that.trigger('ended', {
        audioFileId: id
      });
    };
    let playFailedCallback = function () {
      that.trigger('playfailed', {
        audioFileId: id
      });
    };
    player.on('play', playCallback);
    player.on('pause', pauseCallback);
    player.on('timeupdate', timeUpdateCallback);
    player.on('ended', endedCallback);
    player.on('playfailed', playFailedCallback);
    player._stopMultiPlayerEventPropagation = function () {
      player.off('play', playCallback);
      player.off('pause', pauseCallback);
      player.off('timeupdate', timeUpdateCallback);
      player.off('ended', endedCallback);
      player.off('playfailed', playFailedCallback);
    };
  }
};
Object.assign(MultiPlayer.prototype, BackboneEvents);

const PlayerSourceIDMap = function (media, {
  playerOptions
} = {}) {
  return {
    current: undefined,
    previous: undefined,
    mapSources: function (id, sources) {
      this[id] = sources;
    },
    get: function (sourceID) {
      if (!this[sourceID]) {
        return new AudioPlayer.Null();
      }
      if (this.current && this.current.playerId === sourceID) {
        return this.current;
      }
      if (this.previous && this.previous.playerId === sourceID) {
        let holder = this.current;
        this.current = this.previous;
        this.previous = holder;
      } else {
        if (this.previous) {
          media.releasePlayer(this.previous);
        }
        this.previous = this.current;
        this.current = media.getPlayer(this[sourceID], {
          filePermaId: sourceID,
          playerId: sourceID,
          ...playerOptions
        });
      }
      return this.current;
    }
  };
};

const PlayerPool = function (audio, options) {
  this.players = {};
  this.get = function (audioFileId) {
    this.players[audioFileId] = this.players[audioFileId] || audio.createPlayer(audioFileId, options);
    return this.players[audioFileId];
  };
  this.dispose = function () {
    this.players = {};
  };
};

/**
 * Playing audio files.
 * @alias pageflow.audio
 * @member
 */
const Audio = function (options) {
  this.getSources = options.getSources || function (audioFileId) {
    return options.audioFiles[audioFileId] || '';
  };

  /**
   * Creates a player for the given audio file.
   *
   * @param {string|number} audioFileId
   *   Id of the audio file to play. The id can be of the form
   *   `"5.suffix"` to distinguish multiple occurences of the same
   *   audio file for example inside a pageflow.Audio.PlayerPool;
   *
   * @param {Object} [options]
   *   Options to pass on player creation
   *
   * @static
   */
  this.createPlayer = function (audioFileId, options) {
    var sources = this.getSources(removeSuffix(audioFileId));
    if (sources) {
      return new AudioPlayer(sources, {
        volumeFading: true,
        ...options
      });
    } else {
      return new AudioPlayer.Null();
    }
  };

  /**
   * Create a `MultiPlayer` to play and fade between multiple audio
   * files.
   *
   * @param {Object} [options]
   *   All options supported by pageflow.AudioPlayer can be passed.
   *
   * @param {number} [options.fadeDuration]
   *   Time in milliseconds to fade audios in and out.
   *
   * @param {boolean} [options.playFromBeginning=false]
   *   Always restart audio files from the beginning.
   *
   * @param {boolean} [options.rewindOnChange=false]
   *   Play from beginning when changing audio files.
   *
   * @return {pageflow.Audio.MultiPlayer}
   */
  this.createMultiPlayer = function (options) {
    return new MultiPlayer(new PlayerPool(this, options), options);
  };
  function removeSuffix(id) {
    if (!id) {
      return id;
    }
    return parseInt(id.toString().split('.')[0], 10);
  }
};
Audio.setup = function (options) {
  state.audio = new Audio(options);
};

Audio.PlayerPool = PlayerPool;

let isEventAdded = false;
let callbacks = [];
let muteInBackground = () => {
  callbacks.forEach(cb => {
    cb(document.visibilityState);
  });
};
function documentHiddenState(callback) {
  callbacks.push(callback);
  if (!isEventAdded) {
    isEventAdded = true;
    document.addEventListener('visibilitychange', muteInBackground, false);
  }
  return {
    removeCallback: () => {
      callbacks = callbacks.filter(c => c !== callback);
    }
  };
}

const consent = Consent.create();

export { Audio, AudioPlayer, Consent, Features, MediaPool, MediaType, MultiPlayer, PlayerSourceIDMap, VideoPlayer, assetUrls, audioContext, blankSources, browser, consent, cookies, debugMode, documentHiddenState, events, features, log, media, mediaPlayer, setItemCookieString, settings };
