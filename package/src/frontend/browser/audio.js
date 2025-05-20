import {browser} from './browser';
import {agent} from './Agent';

browser.feature('broken ogg support', function() {
  // ogg is not supported on iOS < 18.4 and broken on iOS 18.4
  return agent.matchesMobileSafari();;
});
