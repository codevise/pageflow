import {features} from 'pageflow/frontend';

import {app} from '../app';

app.addInitializer(function(options) {
  features.enable('editor', options.entry.enabled_feature_names);
});
