pageflow.browser.agent = {
  matchesSilk: function() {
    return navigator.userAgent.match(/\bSilk\b/);
  },

  matchesDesktopSafari9: function() {
    return this.matchesSafari9() && !this.matchesMobilePlatform();
  },

  matchesSafari9: function() {
    var matchers = [/Safari\//i, /Version\/9/i];

    return _.all(matchers, function(matcher) {
      return navigator.userAgent.match(matcher);
    });
  },

  matchesMobilePlatform: function() {
    var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];

    return _.any(matchers, function(matcher) {
      return navigator.userAgent.match(matcher);
    });
  }
};
