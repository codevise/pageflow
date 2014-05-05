pageflow.file = {
  cancelUpload: function() {
    if (this.get('state') === 'uploading') {
      this.trigger('uploadCancelled');
      this.destroy();
    }
  },

  uploadFailed: function() {
    this.set('state', 'upload_failed');
    this.unset('uploading_progress');

    this.trigger('uploadFailed');
  },

  isUploading: function() {
    return this.get('state') === 'uploading';
  },

  isUploaded: function() {
    return this.get('state') !== 'uploading' && this.get('state') !== 'upload_failed';
  },

  destroyUsage: function() {
    var usage = new pageflow.FileUsage({id: this.get('usage_id')});

    usage.destroy();

    this.trigger('destroy', this, this.collection, {});
  }
};
