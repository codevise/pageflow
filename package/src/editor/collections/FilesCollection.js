import Backbone from 'backbone';
import _ from 'underscore';

import {SubsetCollection} from './SubsetCollection';

import {state} from '$state';

export const FilesCollection = Backbone.Collection.extend({
  initialize: function(models, options) {
    options = options || {};

    this.entry = options.entry;
    this.fileType = options.fileType;
    this.name = options.fileType.collectionName;
  },

  comparator: function(file) {
    var fileName = file.get('file_name');
    return (fileName && fileName.toLowerCase) ? fileName.toLowerCase() : fileName;
  },

  url: function() {
    return '/editor/entries/' + this.getEntry().get('id') + '/files/' + this.name;
  },

  fetch: function(options) {
    options = _.extend({
      fileType: this.fileType
    }, options || {});

    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  findOrCreateBy: function(attributes) {
    return this.findWhere(attributes) ||
      this.create(attributes, {
        fileType: this.fileType,
        queryParams: { no_upload: true }
      });
  },

  getByPermaId: function(permaId) {
    return this.findWhere({perma_id: parseInt(permaId, 10)});
  },

  getEntry: function() {
    return this.entry || state.entry;
  },

  confirmable: function() {
    return new SubsetCollection({
      parent: this,
      watchAttribute: 'state',

      filter: function(item) {
        return item.get('state') === 'waiting_for_confirmation';
      },
    });
  },

  uploadable: function() {
    this._uploadableSubsetCollection = this._uploadableSubsetCollection ||
      new SubsetCollection({
        parent: this,
        watchAttribute: 'state',

        filter: function(item) {
          return item.get('state') === 'uploadable';
        },
      });

    return this._uploadableSubsetCollection;
  },

  withFilter: function(filterName) {
    return new SubsetCollection({
      parent: this,
      watchAttribute: 'configuration',

      filter: this.fileType.getFilter(filterName).matches,
    });
  }
});

FilesCollection.createForFileTypes = function(fileTypes, files, options) {
  return fileTypes.reduce(function(result, fileType) {
    result[fileType.collectionName] = FilesCollection.createForFileType(
      fileType,
      files[fileType.collectionName],
      options
    );
    return result;
  }, {});
};

FilesCollection.createForFileType = function(fileType, files, options) {
  return new FilesCollection(
    files,
    _.extend({
      fileType: fileType,
      model: fileType.model
    }, options || {})
  );
};
