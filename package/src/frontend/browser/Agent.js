/**
 * Detect browser via user agent. Use only if feature detection is not
 * an option.
 */
export const Agent = function(userAgent) {
  return {
    matchesSilk: function() {
      return matches(/\bSilk\b/);
    },

    matchesDesktopSafari: function() {
      return this.matchesSafari() && !this.matchesMobilePlatform() && minVersion(/Version\/(\d+)/i, 4);
    },

    matchesDesktopSafari9: function() {
      return this.matchesSafari9() && !this.matchesMobilePlatform();
    },

    matchesDesktopSafari10: function() {
      return this.matchesSafari10() && !this.matchesMobilePlatform();
    },

    matchesSafari9: function() {
      return this.matchesSafari() &&
             matches(/Version\/9/i);
    },

    matchesSafari10: function() {
      return this.matchesSafari() &&
             matches(/Version\/10/i);
    },

    matchesSafari11: function() {
      return this.matchesSafari() &&
             matches(/Version\/11/i);
    },

    matchesSafari11AndAbove: function() {
      return this.matchesSafari() &&
             captureGroupGreaterOrEqual(/Version\/(\d+)/i, 11);
    },

    matchesSafari: function() {
      // - Chrome also reports to be a Safari
      // - Safari does not report to be a Chrome
      // - Edge also reports to be a Safari, but also reports to be Chrome
      return matches(/Safari\//i) &&
             !matches(/Chrome/i);
    },

    /**
     * Returns true on iOS Safari.
     * @return {boolean}
     */
    matchesMobileSafari: function() {
      var matchers = [/iPod/i, /iPad/i, /iPhone/i];

      return matchers.some(function(matcher) {
        return userAgent.match(matcher);
      });
    },

    /**
     * Returns true on iOS or Android.
     * @return {boolean}
     */
    matchesMobilePlatform: function() {
      var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];

      return matchers.some(function(matcher) {
        return userAgent.match(matcher);
      });
    },

    /**
     * Returns true on Internet Explorser version 9, 10 and 11.
     * @return {boolean}
     */
    matchesIEUpTo11: function() {
      return userAgent.match(/Trident\//);
    },

    /**
     * Returns true in InApp browser of Facebook app.
     * @return {boolean}
     */
    matchesFacebookInAppBrowser: function() {
      return userAgent.match(/FBAN/) && userAgent.match(/FBAV/);
    },

    matchesDesktopChrome: function() {
      return this.matchesChrome() && !this.matchesMobilePlatform() && minVersion(/Chrome\/(\d+)/i, 25);
    },

    matchesDesktopFirefox: function() {
      return this.matchesFirefox() && !this.matchesMobilePlatform() && minVersion(/Firefox\/(\d+)/i, 20);
    },
    
    matchesDesktopEdge: function() {
      return this.matchesEdge() && !this.matchesMobilePlatform() && minVersion(/Edg\/(\d+)/i, 20);
    },
    
    /**
   * Returns true on Google Chrome.
   * @return {boolean}
   */
    matchesChrome: function() {
      return matches(/Chrome\//i);
    },
    
    /**
   * Returns true on Firefox.
   * @return {boolean}
   */
    matchesFirefox: function() {
      return matches(/Firefox\//i) &&
            !matches(/Seamonkey/i);
    },
    
    /**
   * Returns true on Microsoft Edge.
   * @return {boolean}
   */
    matchesEdge: function() {
      return matches(/Edg\//i);
    }
  };

  function matches(exp) {
    return !!userAgent.match(exp);
  }

  function captureGroupGreaterOrEqual(exp, version) {
    var match = userAgent.match(exp);
    return match && match[1] && parseInt(match[1], 10) >= version;
  }

  function minVersion(exp, version) {
    var match = userAgent.match(exp);
    //Chrome
    if (match[0].includes('Chrome')) {
      return match && match[1] && parseInt(match[1], 10) >= version;
    }
    //Edge
    if (match[0].includes('Edg')) {
      return match && match[1] && parseInt(match[1], 10) >= version;
    }
    //Safari
    if (match[0].includes('Version')) {
      return match && match[1] && parseInt(match[1], 10) >= version;
    }
    //Firefox
    if (match[0].includes('Firefox')) {
      return match && match[1] && parseInt(match[1], 10) >= version;
    }    
  }
};

export const agent = new Agent(navigator.userAgent);
