pageflow.browser.feature('rewrite video sources support', function() {
  // set from conditionally included script file
  return !pageflow.ie9;
});

pageflow.browser.feature('stop buffering support', function(has) {
  return has.not('mobile platform');
});

pageflow.browser.feature('buffer underrun waiting support', function(has) {
  return has.not('mobile platform');
});

pageflow.browser.feature('prebuffering support', function(has) {
  return has.not('mobile platform');
});

pageflow.browser.feature('mp4 support only', function(has) {
  // - Silk does not play videos with hls source
  // - Desktop Safari 9.1 does not loop hls videos
  // - Desktop Safari 10 does not loop hls videos on El
  //   Capitan. Appears to be fixed on Sierra
  return pageflow.browser.agent.matchesSilk() ||
    pageflow.browser.agent.matchesDesktopSafari9() ||
    pageflow.browser.agent.matchesDesktopSafari10();
});
