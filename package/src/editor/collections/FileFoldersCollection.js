import Backbone from 'backbone';

import {FileFolder} from '../models/FileFolder';

import {state} from '$state';

export const FileFoldersCollection = Backbone.Collection.extend({
  model: FileFolder,

  initialize: function(models, options) {
    this.entry = (options || {}).entry;
  },

  comparator: function(folder) {
    return (folder.get('name') || '').toLowerCase();
  },

  url: function() {
    return '/editor/entries/' + this.getEntry().get('id') + '/file_folders';
  },

  getEntry: function() {
    return this.entry || state.entry;
  },

  // Perma ids are numbers everywhere in the editor, but folders can also
  // be looked up by the string a route hands over. Blank means that no
  // folder is meant.
  byPermaId: function(permaId) {
    if (permaId === null || permaId === undefined || permaId === '') {
      return;
    }

    var number = Number(permaId);

    return this.find(function(folder) {
      return folder.get('perma_id') === number;
    });
  },

  parentOf: function(folder) {
    return this.byPermaId(folder.get('parent_folder_perma_id'));
  },

  childrenOf: function(folder) {
    var permaId = folder ? folder.get('perma_id') : null;

    return this.filter(function(other) {
      return other.get('parent_folder_perma_id') === permaId;
    });
  },

  descendantPermaIdsOf: function(folder) {
    return this.collectDescendantPermaIds(folder, []);
  },

  // Broken data with a folder nested inside one of its own descendants
  // would make walking down the tree recurse forever.
  collectDescendantPermaIds: function(folder, result) {
    if (result.indexOf(folder.get('perma_id')) >= 0) {
      return result;
    }

    result.push(folder.get('perma_id'));

    this.childrenOf(folder).forEach(function(child) {
      this.collectDescendantPermaIds(child, result);
    }, this);

    return result;
  }
});
