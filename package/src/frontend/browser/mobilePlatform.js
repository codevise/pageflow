import {browser} from './browser';
import {agent} from './Agent';

browser.feature('mobile platform', function() {
  return agent.matchesMobilePlatform();
});
