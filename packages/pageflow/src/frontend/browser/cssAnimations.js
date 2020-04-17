import {browser} from './browser';

// See https://developer.mozilla.org/de/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support

browser.feature('css animations', function() {
  var prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
      elm = document.createElement('div');

  if (elm.style.animationName !== undefined) {
    return true;
  }

  for (var i = 0; i < prefixes.length; i++) {
    if (elm.style[prefixes[i] + 'AnimationName'] !== undefined) {
      return true;
    }
  }

  return false;
});