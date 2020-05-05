import _ from 'underscore';
import Object from './Object'
import {navigationDirection} from './Slideshow/navigationDirection';

export const PageTransitions = Object.extend({
  initialize: function(navigationDirection) {
    this.repository = {};
    this.navigationDirection = navigationDirection;
  },

  register: function(name, options) {
    this.repository[name] = options;
  },

  get: function(name) {
    var transition = this.repository[name];

    if (!transition) {
      throw 'Unknown page transition "' + name + '"';
    }

    return this.navigationDirection.isHorizontal() ?
           transition.h :
           transition.v;
  },

  names: function() {
    return _.keys(this.repository);
  }
});

export const pageTransitions = new PageTransitions(navigationDirection);

pageTransitions.register('fade', {
  v: {className: 'fade fade-v', duration: 1100},
  h: {className: 'fade fade-h', duration: 600}
});

pageTransitions.register('crossfade', {
  v: {className: 'crossfade', duration: 1100},
  h: {className: 'crossfade crossfade-fast', duration: 600}
});

pageTransitions.register('fade_to_black', {
  v: {className: 'fade_to_black', duration: 2100},
  h: {className: 'fade_to_black', duration: 2100}
});

pageTransitions.register('cut', {
  v: {className: 'cut', duration: 1100},
  h: {className: 'cut', duration: 1100}
});

pageTransitions.register('scroll', {
  v: {className: 'scroll scroll-in scroll-from_bottom', duration: 1100},
  h: {className: 'scroll scroll-in scroll-from_right scroll-fast', duration: 600}
});

pageTransitions.register('scroll_right', {
  v: {className: 'scroll scroll-in scroll-from_right', duration: 1100},
  h: {className: 'scroll scroll-in scroll-from_bottom scroll-fast', duration: 600}
});

pageTransitions.register('scroll_left', {
  v: {className: 'scroll scroll-in scroll-from_left', duration: 1100},
  h: {className: 'scroll scroll-in scroll-from_top scroll-fast', duration: 600}
});

pageTransitions.register('scroll_over_from_right', {
  v: {className: 'scroll scroll-over scroll-from_right', duration: 1100},
  h: {className: 'scroll scroll-over scroll-from_bottom scroll-fast', duration: 600}
});

pageTransitions.register('scroll_over_from_left', {
  v: {className: 'scroll scroll-over scroll-from_left', duration: 1100},
  h: {className: 'scroll scroll-over scroll-from_top scroll-fast', duration: 600}
});
