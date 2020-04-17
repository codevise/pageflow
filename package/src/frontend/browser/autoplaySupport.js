import {browser} from './browser';
import {agent} from './Agent';

browser.feature('autoplay support', function(has) {
  return !agent.matchesSafari11AndAbove() &&
         !agent.matchesMobilePlatform();
});
