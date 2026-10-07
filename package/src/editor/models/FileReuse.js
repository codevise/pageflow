import Backbone from 'backbone';

export const FileReuse = Backbone.Model.extend({
  modelName: 'file_reuse',
  paramRoot: 'file_reuse',

  initialize: function(attributes, options) {
    this.entry = options.entry;
  },

  url: function() {
    return '/editor/entries/' + this.entry.get('id') + '/file_reuses';
  }
});

FileReuse.submit = function(otherEntry, files, options) {
  new FileReuse({
    other_entry_id: otherEntry.get('id'),
    folder_perma_id: options.folderPermaId,
    files: files.map(function(file) {
      return {
        collection_name: file.fileType().collectionName,
        id: file.get('id')
      };
    })
  }, {
    entry: options.entry
  }).save(null, options);
};
