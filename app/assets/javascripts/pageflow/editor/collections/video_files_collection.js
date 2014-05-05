pageflow.VideoFilesCollection = Backbone.Collection.extend({
  model: pageflow.VideoFile,

  name: 'video_files',

  mixins: [pageflow.filesCollection]

});
