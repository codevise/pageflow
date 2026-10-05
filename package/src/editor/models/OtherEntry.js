import Backbone from 'backbone';

import {editor} from '../base';

import {FilesCollection} from '../collections/FilesCollection';

export const OtherEntry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  initialize: function(attributes, options) {
    this.files = {};
    this.fileTypes = options?.fileTypes || editor.fileTypes;
  },

  getFileCollection: function(fileTypeOrFileTypeName) {
    var fileType = fileTypeOrFileTypeName.collectionName ?
                   fileTypeOrFileTypeName :
                   this.fileTypes.findByCollectionName(fileTypeOrFileTypeName);

    if (!this.files[fileType.collectionName]) {
      this.files[fileType.collectionName] = FilesCollection.createForFileType(fileType, [], {entry: this});
    }

    return this.files[fileType.collectionName];
  },

  fetchFiles: function() {
    return Backbone.ajax({
      url: '/editor/entries/' + this.id + '/files',
      dataType: 'json'
    }).then(response => {
      this.fileTypes.each(function(fileType) {
        this.getFileCollection(fileType).set(response[fileType.collectionName] || [],
                                             {fileType: fileType});
      }, this);
    });
  },

  titleOrSlug: function () {
    return this.get('title') || this.get('slug');
  }
});
