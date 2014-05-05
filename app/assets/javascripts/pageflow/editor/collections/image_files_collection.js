pageflow.ImageFilesCollection = Backbone.Collection.extend({
  model: pageflow.ImageFile,

  name: 'image_files',

  mixins: [pageflow.filesCollection]

});
