pageflow.FileUsagesCollection = Backbone.Collection.extend({
  model: pageflow.FileUsage,

  name: 'file_usages',

  initialize: function(models, options) {
    options = options || {};
    this.entry = options.entry;
  },

  url: function() {
    return '/editor/entries/' + this.entry.get('id') + '/file_usages';
  },

  createForFile: function(file, options) {
    return this.create({
      file_id: file.get('id'),
      file_type: file.fileType().typeName
    }, options);
  }
});
