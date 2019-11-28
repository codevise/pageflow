import Backbone from 'backbone';

import {state} from '$state';

export const EditLock = Backbone.Model.extend({
  paramRoot: 'edit_lock',

  url: function() {
    return state.entry.url() + '/edit_lock?timestamp=' + new Date().getTime();
  },

  toJSON: function() {
    return {
      id: this.id,
      force: this.get('force')
    };
  }
});