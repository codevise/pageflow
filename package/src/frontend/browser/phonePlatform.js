import _ from 'underscore';
import {browser} from './browser';

browser.feature('phone platform', function() {
  var matchers = [/iPod/i, /iPad/i, /iPhone/i, /Android/i, /IEMobile/i];

  return _.any(matchers, function(matcher) {
    return navigator.userAgent.match(matcher) && (window.innerWidth < 700);
  });
});