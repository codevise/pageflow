pageflow.UploadedFile = Backbone.Model.extend({
  mixins: [pageflow.stageProvider, pageflow.retryable],

  initialize: function(attributes, options) {
    this.options = options || {};

    this.configuration = new pageflow.FileConfiguration(
      this.get('configuration') || {}
    );

    this.configuration.i18nKey = this.i18nKey;
    this.configuration.parent = this;

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);

      _.chain(this.configuration.changed).keys().each(function(name) {
        this.trigger('change:configuration:' + name, this, this.configuration.get(name));
      }, this);

      if (!this.isNew()) {
        this.save();
      }
    });

    this.listenTo(this, 'change:rights', function() {
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
    return this.collection.url();
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

  nestedFiles: function(supersetCollection) {
    if (typeof supersetCollection === 'function') {
      supersetCollection = supersetCollection();
    }

    var collectionName = supersetCollection.fileType.collectionName;
    this.nestedFilesCollections = this.nestedFilesCollections || {};

    this.nestedFilesCollections[collectionName] = this.nestedFilesCollections[collectionName] ||
      new pageflow.NestedFilesCollection({
        parent: supersetCollection,
        parentFile: this
      });

    return this.nestedFilesCollections[collectionName];
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
    return _.extend(_.pick(this.attributes, 'rights', 'parent_file_id', 'parent_file_model_type'), {
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
  }
});
