import Backbone from 'backbone';

import {FileConfiguration} from './FileConfiguration';
import {NestedFilesCollection} from '../collections/NestedFilesCollection';
import {configurationContainer} from './mixins/configurationContainer';
import {retryable} from './mixins/retryable';
import {stageProvider} from './mixins/stageProvider';

export const ReusableFile = Backbone.Model.extend({
  mixins: [
    configurationContainer({
      autoSave: true,
      configurationModel: FileConfiguration,
      includeAttributesInJSON: [
        'file_name',
        'display_name',
        'rights',
        'parent_file_id',
        'parent_file_model_type',
        'content_type',
        'file_size'
      ],
      afterInitialize() {
        this.configuration.i18nKey = this.i18nKey;
      }
    }),
    stageProvider,
    retryable
  ],

  initialize: function(attributes, options) {
    this.options = options || {};

    this.listenTo(this, 'change:rights', function() {
      if (!this.isNew()) {
        this.save();
      }
    });

    this.listenTo(this, 'change:display_name', function() {
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
    return this.get('display_name') || this.get('file_name');
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
      new NestedFilesCollection({
        parent: supersetCollection,
        parentFile: this
      });

    return this.nestedFilesCollections[collectionName];
  },

  isUploading: function() {
    return this.get('state') === 'uploading';
  },

  isUploaded: function() {
    return this.get('state') !== 'uploading' && this.get('state') !== 'uploading_failed';
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

  cancelUpload: function() {
    if (this.get('state') === 'uploading') {
      this.trigger('uploadCancelled');
      this.destroy();
    }
  },

  uploadFailed: function() {
    this.set('state', 'uploading_failed');
    this.unset('uploading_progress');
    this.trigger('uploadFailed');
  },

  publish: function() {
    this.save({}, {
      url: this.url() + '/publish'
    });
  }
});
