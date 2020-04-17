import {browser} from './browser';
import {agent} from './Agent';

browser.feature('volume control support', function(has) {
  return has.not('ios platform');
});

browser.feature('audio context volume fading support', function() {
  return !agent.matchesDesktopSafari();
});
