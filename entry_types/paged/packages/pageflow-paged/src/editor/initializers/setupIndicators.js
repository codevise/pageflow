import {app} from 'pageflow/editor';

import {DisabledAtmoIndicatorView} from '../views/DisabledAtmoIndicatorView';

// Use app instead of editor here to append initializer after
// pageflow/editora's boot initializer. DisabledAtmoIndicatorView
// depends on state.atmo`which is only available after the entry
// preview has been created.
app.addInitializer(function(options) {
  app.indicatorsRegion.show(new DisabledAtmoIndicatorView());
});
