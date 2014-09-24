pageflow.ImageFile = Backbone.Model.extend({
  modelName: 'image_file',
  paramRoot: 'image_file',
  i18nKey: 'pageflow/image_file',

  mixins: [pageflow.file, pageflow.stageProvider, pageflow.retryable],

  stages: [
    {
      name: 'uploading',
      activeStates: ['uploading'],
      failedStates: ['upload_failed']
    },
    {
      name: 'processing',
      activeStates: ['processing'],
      finishedStates: ['processed'],
      failedStates: ['processing_failed']
    }
  ],

  readyState: 'processed',

  isConfirmable: function() {
    return false;
  },

  isPositionable: function() {
    return this.isReady();
  }
});