pageflow.browser.feature('mobile platform', function() {
  return pageflow.browser.agent.matchesMobilePlatform();
});

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
    $('html').addClass('ipad ios7');
}