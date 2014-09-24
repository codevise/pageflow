pageflow.HostedFile = Backbone.Model.extend({
  mixins: [pageflow.file, pageflow.stageProvider, pageflow.retryable],

  stages: function() {
    return [
      {
        name: 'uploading',
        activeStates: ['uploading'],
        failedStates: ['upload_failed']
      },
      {
        name: 'uploading_to_s3',
        activeStates: ['uploading_to_s3'],
        failedStates: ['upload_to_s3_failed']
      }
    ].concat(_.result(this, 'processingStages'));
  },

  processingStages: [],

  readyState: 'uploaded_to_s3',

  isConfirmable: function() {
    return false;
  },

  isPositionable: function() {
    return false;
  }
});