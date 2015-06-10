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