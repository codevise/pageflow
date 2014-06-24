pageflow.ImageFile = Backbone.Model.extend({
  modelName: 'image_file',
  paramRoot: 'image_file',
  i18nKey: 'pageflow/image_file',

  mixins: [pageflow.file, pageflow.stageProvider, pageflow.retryable],

  stageMapping: {
    uploading: {
      activeStates: ['uploading'],
      finishedStates: ['processing', 'processed', 'processing_failed'],
      failedStates: ['upload_failed']
    },
    processing: {
      activeStates: ['processing'],
      finishedStates: ['processed'],
      failedStates: ['processing_failed']
    }
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/image_files';
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

  isPositionable: function() {
    return this.isReady();
  }
});