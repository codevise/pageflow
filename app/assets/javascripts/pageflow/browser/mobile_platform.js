pageflow.browser.feature('mobile platform', function() {
  var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /Silk/i, /IEMobile/i];
  return _.any(matchers, function(matcher) {
    return navigator.userAgent.match(matcher);
  });
});

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
    $('html').addClass('ipad ios7');
}