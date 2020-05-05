import 'core-js/features/array/fill';
import 'core-js/features/object/assign';
import 'core-js/features/promise';
import 'core-js/features/map';
import 'core-js/features/string/starts-with';
import 'core-js/features/set';
import 'core-js/features/symbol';
import 'core-js/features/symbol/iterator';

import 'intersection-observer';
import 'regenerator-runtime/runtime.js';

// Make sure we're in a Browser-like environment before importing polyfills
// This prevents `fetch()` from being imported in a Node test environment
if (typeof window !== 'undefined') {
  require('whatwg-fetch');
}
