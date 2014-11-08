pageflow.ImageFile = pageflow.UploadedFile.extend({
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

  getBackgroundPositioningImageUrl: function() {
    return this.get('url');
  },

  isPositionable: function() {
    return this.isReady();
  }
});