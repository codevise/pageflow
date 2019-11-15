import Backbone from 'backbone';

import {FilesCollection} from '../collections/FilesCollection';

export const OtherEntry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  initialize: function() {
    this.files = {};
  },

  getFileCollection: function(fileType) {
    if (!this.files[fileType.collectionName]) {
      this.files[fileType.collectionName] = FilesCollection.createForFileType(fileType, [], {entry: this});
    }

    return this.files[fileType.collectionName];
  },

  titleOrSlug: function () {
    return this.get('title') || this.get('slug');
  }
});
