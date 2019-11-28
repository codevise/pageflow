import _ from 'underscore';

import {Configuration} from './Configuration';

export const FileConfiguration = Configuration.extend({
  defaults: {
  },

  applyUpdaters: function(updaters, newAttributes) {
    _(updaters).each(function(updater) {
      updater(this, newAttributes);
    }, this);
  }
});
