pageflow.file = {
  initialize: function() {
    if (this.fileType()) {
      this.modelName = this.fileType().paramKey;
      this.paramRoot = this.fileType().paramKey;
      this.i18nKey = this.fileType().i18nKey;
    }
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/files/' + this.collection.name;
  },

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

  isPending: function() {
    return !this.isReady() && !this.isFailed();
  },

  isUploading: function() {
    return this.get('state') === 'uploading';
  },

  isUploaded: function() {
    return this.get('state') !== 'uploading' && this.get('state') !== 'upload_failed';
  },

  isReady: function() {
    return this.get('state') === this.readyState;
  },

  isFailed: function() {
    return this.get('state') && !!this.get('state').match(/_failed$/);
  },

  isRetryable: function() {
    return !!this.get('retryable');
  },

  destroyUsage: function() {
    var usage = new pageflow.FileUsage({id: this.get('usage_id')});

    usage.destroy();

    this.trigger('destroy', this, this.collection, {});
  },

  fileType: function() {
    return this.collection && this.collection.fileType;
  }
};
