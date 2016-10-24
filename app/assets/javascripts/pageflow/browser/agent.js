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
    var matchers = [/Safari\//i, /Version\/9/i];

    return _.all(matchers, function(matcher) {
      return navigator.userAgent.match(matcher);
    });
  },

  matchesSafari10: function() {
    var matchers = [/Safari\//i, /Version\/10/i];

    return _.all(matchers, function(matcher) {
      return navigator.userAgent.match(matcher);
    });
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
  }
};
