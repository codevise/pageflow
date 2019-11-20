import I18n from 'i18n-js';

import {ReusableFile} from './ReusableFile';
import {UploadableFile} from './UploadableFile';

export const TextTrackFile = UploadableFile.extend({
  defaults: {
    configuration: {
      kind: 'captions'
    }
  },

  processingStages: [
    {
      name: 'processing',
      activeStates: ['processing'],
      failedStates: ['processing_failed']
    }
  ],

  readyState: 'processed',

  initialize: function(attributes, options) {
    ReusableFile.prototype.initialize.apply(this, arguments);

    if (this.isNew() && !this.configuration.get('srclang')) {
      this.configuration.set('srclang', this.extractLanguageCodeFromFilename());
    }
  },

  displayLabel: function() {
    return this.configuration.get('label') ||
      this.inferredLabel() ||
      I18n.t('pageflow.editor.text_track_files.label_missing');
  },

  inferredLabel: function() {
    var srclang = this.configuration.get('srclang');

    if (srclang) {
      return I18n.t('pageflow.languages.' + srclang, {
        defaultValue: ''
      });
    }
  },

  extractLanguageCodeFromFilename: function() {
    var matches = /\S+\.([a-z]{2})_[A-Z]{2}\.[a-z]+/.exec(this.get('file_name'));
    return matches && matches[1];
  }
});

TextTrackFile.displayLabelBinding = 'srclang';
