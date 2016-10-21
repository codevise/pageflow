pageflow.UploadedFile = Backbone.Model.extend({
  mixins: [pageflow.stageProvider, pageflow.retryable],

  initialize: function(attributes, options) {
    this.options = options;

    this.configuration = new pageflow.FileConfiguration(
      this.get('configuration') || {}
    );

    this.configuration.i18nKey = this.i18nKey;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);

      if (!this.isNew()) {
        this.save();
      }
    });

    this.listenTo(this, 'change', function(model, options) {
      if (options.applyConfigurationUpdaters) {
        this.configuration.applyUpdaters(this.fileType().configurationUpdaters,
                                         this.attributes.configuration);
      }
    });
  },

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/files/' + this.fileType().collectionName;
  },

  fileType: function() {
    return this.options.fileType;
  },

  title: function() {
    return this.get('file_name');
  },

  thumbnailFile: function() {
    return this;
  },

  isUploading: function() {
    return this.get('state') === 'uploading';
  },

  isUploaded: function() {
    return this.get('state') !== 'uploading' && this.get('state') !== 'upload_failed';
  },

  isPending: function() {
    return !this.isReady() && !this.isFailed();
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

  isConfirmable: function() {
    return false;
  },

  isPositionable: function() {
    return false;
  },

  toJSON: function() {
    return _.extend(_.pick(this.attributes, 'rights'), {
      configuration: this.configuration.toJSON()
    });
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

  destroyUsage: function() {
    var usage = new pageflow.FileUsage({id: this.get('usage_id')});

    usage.destroy();

    this.trigger('destroy', this, this.collection, {});
  }
});