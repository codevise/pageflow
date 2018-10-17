pageflow.browser.feature('autoplay support', function(has) {
  return !pageflow.browser.agent.matchesSafari11AndAbove() &&
         !pageflow.browser.agent.matchesMobilePlatform();
});
