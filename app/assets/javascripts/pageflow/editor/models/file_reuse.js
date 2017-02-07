pageflow.FileReuse = Backbone.Model.extend({
  modelName: 'file_reuse',
  paramRoot: 'file_reuse',

  initialize: function(attributes, options) {
    this.entry = options.entry;
    this.collectionName = options.fileType.collectionName;
  },

  url: function() {
    return '/editor/entries/' + this.entry.get('id') + '/files/' + this.collectionName + '/reuse';
  }
});

pageflow.FileReuse.submit = function(otherEntry, file, options) {
  new pageflow.FileReuse({
    other_entry_id: otherEntry.get('id'),
    file_id: file.get('id')
  }, {
    entry: options.entry,
    fileType: file.fileType()
  }).save(null, options);
};
