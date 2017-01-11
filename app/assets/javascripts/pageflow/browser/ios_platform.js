pageflow.browser.feature('ios platform', function() {
  return pageflow.browser.agent.matchesMobileSafari();
});

pageflow.browser.feature('iphone platform', function(has) {
  return has.all(has('ios platform'),
                 has('phone platform'));
});