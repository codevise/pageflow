import Backbone from 'backbone';

import {delayedDestroying} from './mixins/delayedDestroying';
import {failureTracking} from './mixins/failureTracking';

export const FileFolder = Backbone.Model.extend({
  // Folders at the top level have no parent, which lets code comparing
  // parents rely on the attribute being present.
  defaults: {
    parent_folder_perma_id: null
  },

  modelName: 'file_folder',
  paramRoot: 'file_folder',
  i18nKey: 'pageflow/file_folder',

  mixins: [failureTracking, delayedDestroying],

  initialize: function() {
    this.listenTo(this, 'change:name', function() {
      if (!this.isNew()) {
        this.save();
      }
    });
  },

  urlRoot: function() {
    return this.collection.url();
  },

  title: function() {
    return this.get('name');
  },

  destroy: function() {
    return this.destroyWithDelay();
  }
});
