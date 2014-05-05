pageflow.AudioFilesCollection = Backbone.Collection.extend({
  model: pageflow.AudioFile,

  name: 'audio_files',

  mixins: [pageflow.filesCollection]
});
