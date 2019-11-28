import {app} from '../app';

import {state} from '$state';

app.addInitializer(function(options) {
  state.seed = options.common;
});