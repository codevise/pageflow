import Backbone from 'backbone';

import {state} from '$state';

export const EditLock = Backbone.Model.extend({
  paramRoot: 'edit_lock',

  url: function() {
    return '/entries/' + state.entry.get('id') + '/edit_lock?timestamp=' + new Date().getTime();
  },

  toJSON: function() {
    return {
      id: this.id,
      force: this.get('force')
    };
  }
});
