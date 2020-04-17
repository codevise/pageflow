import {browser} from './browser';
import {agent} from './Agent';

browser.feature('ios platform', function() {
  return agent.matchesMobileSafari();
});

browser.feature('iphone platform', function(has) {
  return has.all(has('ios platform'),
                 has('phone platform'));
});