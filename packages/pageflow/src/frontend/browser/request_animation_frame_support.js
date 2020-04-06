import {browser} from './browser';

browser.feature('request animation frame support', function() {
  return 'requestAnimationFrame' in window || 'web';
});
