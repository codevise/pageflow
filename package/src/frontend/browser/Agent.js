/**
 * Detect browser via user agent. Use only if feature detection is not
 * an option.
 */
export const Agent = function(userAgent) {
  return {
    matchesSilk: function() {
      return matches(/\bSilk\b/);
    },

    matchesDesktopSafari: function(options) {
      if (options) {
        return this.matchesSafari() &&
               !this.matchesMobilePlatform() &&
               matchesMinVersion(/Version\/(\d+)/i, options.minVersion);
      }
      else {
        return this.matchesSafari() &&
               !this.matchesMobilePlatform()
      }     
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
             matchesMinVersion(/Version\/(\d+)/i, 11);
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

      return (matchers.some(function(matcher) {
              return userAgent.match(matcher);
             }) &&
             !window.MSStream) || //IE exclusion from being detected as an iOS device;
             matchesiPadSafari13AndAbove();
    },

    /**
     * Returns true on iOS or Android.
     * @return {boolean}
     */
    matchesMobilePlatform: function() {
      var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];

      return matchers.some(function(matcher) {
              return userAgent.match(matcher);
             }) ||
             matchesiPadSafari13AndAbove();
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

    matchesDesktopChrome: function(options) {
      if (options) {
        return this.matchesChrome() &&
               !this.matchesMobilePlatform() &&
               matchesMinVersion(/Chrome\/(\d+)/i, options.minVersion);
      }
      else {
        return this.matchesChrome() &&
               !this.matchesMobilePlatform()
      }     
    },

    matchesDesktopFirefox: function(options) {
      if (options) {
        return this.matchesFirefox() &&
               !this.matchesMobilePlatform() &&
               matchesMinVersion(/Firefox\/(\d+)/i, options.minVersion);
      }
      else {
        return this.matchesFirefox() &&
               !this.matchesMobilePlatform();
      }      
    },
    
    matchesDesktopEdge: function(options) {
      if (options) {
        return this.matchesEdge() &&
               !this.matchesMobilePlatform() &&
               matchesMinVersion(/Edg\/(\d+)/i, options.minVersion);
      }
      else {
        return this.matchesEdge() &&
               !this.matchesMobilePlatform();
      }     
    },
    
    /**
   * Returns true on Google Chrome.
   * @return {boolean}
   */
    matchesChrome: function() {
      // - Edge also reports to be a Chrome
      return matches(/Chrome\//i) &&
              !matches(/Edg/i);
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
    return agent.matchesSafari() &&
           navigator.maxTouchPoints > 1 &&
           navigator.platform === 'MacIntel';       
  }
};

export const agent = new Agent(typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr');
