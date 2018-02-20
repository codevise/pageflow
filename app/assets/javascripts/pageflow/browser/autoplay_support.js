pageflow.browser.feature('only muted autoplay support', function(has) {
  return pageflow.browser.agent.matchesSafari() ||
    pageflow.browser.agent.matchesMobilePlatform();
});
