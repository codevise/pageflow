pageflow.browser.feature('volume control support', function(has) {
  return has.not('ios platform');
});

pageflow.browser.feature('audio context volume fading support', function() {
  return !pageflow.browser.agent.matchesDesktopSafari();
});
