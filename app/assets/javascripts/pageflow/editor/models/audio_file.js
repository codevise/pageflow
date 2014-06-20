pageflow.AudioFile = Backbone.Model.extend({
  modelName: 'audio_file',
  paramRoot: 'audio_file',
  i18nKey: 'pageflow/audio_file',

  mixins: [pageflow.file, pageflow.encodedFile, pageflow.stageProvider, pageflow.retryable],

  thumbnailPictogram: 'audio',

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/audio_files';
  },

  isPositionable: function() {
    return false;
  }
});
