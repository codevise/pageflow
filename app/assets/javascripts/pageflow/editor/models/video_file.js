pageflow.VideoFile = Backbone.Model.extend({
  modelName: 'video_file',
  paramRoot: 'video_file',
  i18nKey: 'pageflow/video_file',

  mixins: [pageflow.file, pageflow.encodedFile, pageflow.stageProvider, pageflow.retryable],

  isPositionable: function() {
    return false;
  }
});
