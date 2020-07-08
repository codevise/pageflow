import {browser} from 'pageflow/frontend';

describe('pageflow.browser.Agent', function() {
  var Agent = browser.Agent;
  describe ('#matchesSafari11AndAbove', function() {
    it('returns false for Safari 10', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3)' +
        'AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8'
      );

      expect(agent.matchesSafari11AndAbove()).toBe(false);
    });

    it('returns true for Safari 11', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) ' +
        'AppleWebKit/604.1.28 (KHTML, like Gecko) Version/11.0 Safari/604.1.28'
      );

      expect(agent.matchesSafari11AndAbove()).toBe(true);
    });

    it('returns true for Safari 12', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
      );

      expect(agent.matchesSafari11AndAbove()).toBe(true);
    });

    it('returns false for anything only containing a matching version string', function() {
      var agent = new Agent(
        'Version/11.0 something else'
      );

      expect(agent.matchesSafari11AndAbove()).toBe(false);
    });

    it('returns false for Chrome', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
      );

      expect(agent.matchesSafari11AndAbove()).toBe(false);
    });

    it('returns false for Edge', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
      );

      expect(agent.matchesSafari11AndAbove()).toBe(false);
    });
  });

  describe('#matchesDesktopSafari', function() {
    it('returns true for Safari 12', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
      );

      expect(agent.matchesDesktopSafari()).toBe(true);
    });

    it('returns false for Safari on iPhone', function() {
      var agent = new Agent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) '+
        'AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1'
      );

      expect(agent.matchesDesktopSafari()).toBe(false);
    });

    it('returns false for Safari 3.2 if minVersion 4 is given', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_6; en-us) '+
        'AppleWebKit/525.27.1 (KHTML, like Gecko) Version/3.2.1 Safari/525.27.1'
      );

      expect(agent.matchesDesktopSafari({minVersion: 4})).toBe(false);
    });
  });

  describe('#matchesDesktopEdge', function() {
    it('returns true for Edge', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.58'
      );

      expect(agent.matchesDesktopEdge()).toBe(true);
    });

    it('returns false for Edge on Windows 10 mobile', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows Mobile 10; Android 10.0; Microsoft; Lumia 950XL) '+
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Mobile Safari/537.36 Edge/40.15254.603'
      );

      expect(agent.matchesDesktopEdge()).toBe(false);
    });

    it('returns false for Edge 12 if minVersion 20 is given', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0) '+
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136'
      );

      expect(agent.matchesDesktopEdge({minVersion: 20})).toBe(false);
    });
  });

  describe('#matchesDesktopFirefox', function() {
    it('returns true for Firefox', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) ' +
        'Gecko/20100101 Firefox/78.0'
      );

      expect(agent.matchesDesktopFirefox()).toBe(true);
    });

    it('returns false for SeaMonkey', function() {
      var agent = new Agent(
        'Mozilla/5.0 (X11; Linux x86_64; rv:29.0) ' +
        'Gecko/20100101 Firefox/29.0 SeaMonkey/2.26'
      );

      expect(agent.matchesDesktopFirefox()).toBe(false);
    });

    it('returns false for Firefox on android', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Android 10; Mobile; rv:68.0) '+
        'Gecko/68.0 Firefox/68.0'
      );

      expect(agent.matchesDesktopFirefox()).toBe(false);
    });

    it('returns false for Firefox 17 when minVersion 20 is given', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) ' +
        'Gecko/20100101 Firefox/17.0'
      );

      expect(agent.matchesDesktopFirefox({minVersion: 20})).toBe(false);
    });
  });

  describe('#matchesDesktopChrome', function() {
    it('returns true for Chrome 83', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
      );

      expect(agent.matchesDesktopChrome()).toBe(true);
    });

    it('returns false for Chrome on android', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Linux; Android 10) '+
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
      );

      expect(agent.matchesDesktopChrome()).toBe(false);
    });

    it('returns false for Chrome on iphone', function() {
      var agent = new Agent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) '+
        'AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1'
      );

      expect(agent.matchesDesktopChrome()).toBe(false);
    });

    it('returns false for Edge', function() {
      var agent = new Agent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.58'
      );

      expect(agent.matchesDesktopChrome()).toBe(false);
    });

    it('returns false for Chrome 12 when minVersion 20 is given', function() {
      var agent = new Agent(
        'Mozilla/5.0 (X11; Linux i686) ' +
        'AppleWebKit/534.30 (KHTML, like Gecko) Slackware/Chrome/12.0.742.100 Safari/534.30'
      );

      expect(agent.matchesDesktopChrome({minVersion: 20})).toBe(false);
    });
  });
});
