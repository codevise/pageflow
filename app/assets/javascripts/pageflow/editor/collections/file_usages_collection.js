pageflow.FileUsagesCollection = Backbone.Collection.extend({
  model: pageflow.FileUsage,

  name: 'file_usages',

  url: function() {
    return '/editor/entries/' + pageflow.entry.get('id') + '/file_usages';
  }
});
