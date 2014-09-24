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

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/files/image_files';
  },

  isReady: function() {
    return this.get('state') === 'processed';
  },

  isPending: function() {
    return this.get('state') === 'processing';
  },

  isRetryable: function() {
    return this.get('state') === 'processing_failed';
  },

  isConfirmable: function() {
    return false;
  },

  isPositionable: function() {
    return this.isReady();
  }
});