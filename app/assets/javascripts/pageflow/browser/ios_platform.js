pageflow.browser.feature('ios platform', function() {
  var matchers = [/iPod/i, /iPad/i, /iPhone/i];
  return _.any(matchers, function(matcher) {
    return navigator.userAgent.match(matcher);
  });
});