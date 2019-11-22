pageflow.browser.feature('request animation frame support', function() {
  return 'requestAnimationFrame' in window || 'web';
});
