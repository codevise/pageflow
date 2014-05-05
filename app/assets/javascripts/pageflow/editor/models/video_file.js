pageflow.VideoFile = Backbone.Model.extend({
  modelName: 'video_file',
  paramRoot: 'video_file',

  mixins: [pageflow.file, pageflow.encodedFile, pageflow.stageProvider, pageflow.retryable],

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/video_files';
  },

  isPositionable: function() {
    return false;
  }
});
