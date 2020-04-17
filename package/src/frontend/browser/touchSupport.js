import {browser} from './browser';

browser.feature('touch support', function() {
  return ('ontouchstart' in window) ||
    /* Firefox on android */
    window.DocumentTouch && document instanceof window.DocumentTouch ||
    /* > 0 on IE touch devices */
    navigator.maxTouchPoints;
});