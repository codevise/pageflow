import 'core-js/stable';
import 'core-js/features/typed-array/uint16-array';

import React from 'react';
import ReactRailsUJS from 'react_ujs';

import {Root, setupI18n} from 'pageflow-scrolled/frontend';

ReactRailsUJS.getConstructor = function() {
  // Normally this function receives the name of a component, but we
  // only need to render one type of component.
  return ServerRenderedRoot;
};

function ServerRenderedRoot({seed}) {
  setupI18n(seed.i18n);

  return (
    <Root seed={seed} />
  );
}
