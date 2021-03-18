import 'core-js/features/array/fill';
import 'core-js/features/array/find';
import 'core-js/features/array/from'
import 'core-js/features/object/assign';
import 'core-js/features/promise';
import 'core-js/features/map';
import 'core-js/features/string/starts-with';
import 'core-js/features/set';
import 'core-js/features/symbol';
import 'core-js/features/symbol/iterator';

import 'regenerator-runtime/runtime.js';

import {browser} from 'pageflow/frontend';

// Safari does not handle positive root margin correctly inside
// iframes. Use polyfill instead.
if (browser.agent.matchesSafari() && window.parent !== window) {
  delete window.IntersectionObserver;
}

require('intersection-observer');

// Make sure we're in a Browser-like environment before importing polyfills
// This prevents `fetch()` from being imported in a Node test environment
if (typeof window !== 'undefined') {
  require('whatwg-fetch');
}
