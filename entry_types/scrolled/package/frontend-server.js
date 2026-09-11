import 'core-js/modules/es.regexp.flags';
import 'core-js/modules/web.immediate';
import URLPolyfill from 'core-js-pure/features/url';
import React from 'react';
import ReactRailsUJS from 'react_ujs';
import { setupI18n, Root } from 'pageflow-scrolled/frontend';

// The server-side rendering environment (ExecJS) lacks Web APIs like URL,
// which `core-js/stable` no longer polyfills now that we target modern
// browsers. Install it from core-js-pure (which the browser-targeted
// transforms do not strip) so prerendering can use `new URL(...)`.
if (typeof global.URL === 'undefined') {
  global.URL = URLPolyfill;
}
ReactRailsUJS.getConstructor = function () {
  // Normally this function receives the name of a component, but we
  // only need to render one type of component.
  return ServerRenderedRoot;
};
function ServerRenderedRoot({
  seed
}) {
  setupI18n(seed.i18n);
  return /*#__PURE__*/React.createElement(Root, {
    seed: seed
  });
}
