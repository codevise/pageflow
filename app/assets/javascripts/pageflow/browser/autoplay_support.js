pageflow.browser.feature('autoplay support', function(has) {
  return !pageflow.browser.agent.matchesSafari11() &&
    !pageflow.browser.agent.matchesMobilePlatform();
});
