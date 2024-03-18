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

browser.feature('video scaling bug fixed by load', function(has) {
  // When reusing video elements for videos with different
  // resolutions, Safari gets confused and scales videos incorrectly -
  // drawing them to only cover a part of the element. This appears to
  // not happen when the video is loaded or played immediately after
  // changing the source. No longer reproducible in iOS 17.4.
  return agent.matchesMobileSafari({osVersions: ['17.0', '17.1', '17.2', '17.3']});
});
