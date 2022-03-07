import {browser} from './browser';
import {agent} from './Agent';
import {state} from '../state';

browser.feature('rewrite video sources support', function() {
  // set from conditionally included script file
  return !state.ie9;
});

browser.feature('stop buffering support', function(has) {
  return has.not('mobile platform');
});

browser.feature('buffer underrun waiting support', function(has) {
  return has.not('mobile platform');
});

browser.feature('prebuffering support', function(has) {
  return has.not('mobile platform');
});

browser.feature('mp4 support only', function(has) {
  // - Silk does not play videos with hls source
  // - Desktop Safari 9.1 does not loop hls videos
  // - Desktop Safari 10 does not loop hls videos on El
  //   Capitan. Appears to be fixed on Sierra
  return agent.matchesSilk() ||
    agent.matchesDesktopSafari9() ||
    agent.matchesDesktopSafari10();
});

browser.feature('mse and native hls support', function(has) {
  return agent.matchesSafari() &&
    !agent.matchesMobilePlatform();
});

browser.feature('native video player', function(has) {
  return has('iphone platform');
});
