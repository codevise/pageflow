import Backbone from 'backbone';

import {Theme} from '../models/Theme';

export const ThemesCollection = Backbone.Collection.extend({
  model: Theme,

  findByName: function(name) {
    var theme = this.findWhere({name: name});

    if (!theme) {
      throw new Error('Found no theme by name ' + name);
    }

    return theme;
  }
});
