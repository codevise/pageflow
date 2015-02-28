pageflow.browser.feature('pushstate support', function() {
  return (window.history && 'pushState' in window.history);
});
