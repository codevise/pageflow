pageflow.ImageFile = Backbone.Model.extend({
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