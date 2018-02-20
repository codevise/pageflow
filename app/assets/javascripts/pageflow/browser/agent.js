/**
 * Detect browser via user agent. Use only if feature detection is not
 * an option.
 */
pageflow.browser.agent = {
  matchesSilk: function() {
    return navigator.userAgent.match(/\bSilk\b/);
  },

  matchesDesktopSafari9: function() {
    return this.matchesSafari9() && !this.matchesMobilePlatform();
  },

  matchesDesktopSafari10: function() {
    return this.matchesSafari10() && !this.matchesMobilePlatform();
  },

  matchesSafari9: function() {
    return this.matchesSafari() &&
      this._matches(/Version\/9/i);
  },

  matchesSafari10: function() {
    return this.matchesSafari() &&
      this._matches(/Version\/10/i);
  },

  matchesSafari: function() {
    // - Chrome also reports to be a Safari
    // - Safari does not report to be a Chrome
    // - Edge also reports to be a Safari, but also reports to be Chrome
    return this._matches(/Safari\//i) &&
      !this._matches(/Chrome/i);
  },

  /**
   * Returns true on iOS Safari.
   * @return {boolean}
   */
  matchesMobileSafari: function() {
    var matchers = [/iPod/i, /iPad/i, /iPhone/i];

    return _.any(matchers, function(matcher) {
      return navigator.userAgent.match(matcher);
    });
  },

  /**
   * Returns true on iOS or Android.
   * @return {boolean}
   */
  matchesMobilePlatform: function() {
    var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];

    return _.any(matchers, function(matcher) {
      return navigator.userAgent.match(matcher);
    });
  },

  /**
   * Returns true on Internet Explorser version 9, 10 and 11.
   * @return {boolean}
   */
  matchesIEUpTo11: function() {
    return navigator.userAgent.match(/Trident\//);
  },

  /**
   * Returns true in InApp browser of Facebook app.
   * @return {boolean}
   */
  matchesFacebookInAppBrowser: function() {
    return navigator.userAgent.match(/FBAN/) && navigator.userAgent.match(/FBAV/);
  },

  _matches: function(exp) {
    return navigator.userAgent.match(exp);
  }
};
