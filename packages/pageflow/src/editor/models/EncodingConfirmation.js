import Backbone from 'backbone';

import {state} from '$state';

export const EncodingConfirmation = Backbone.Model.extend({
  paramRoot: 'encoding_confirmation',

  initialize: function() {
    this.videoFiles = new Backbone.Collection();
    this.audioFiles = new Backbone.Collection();

    this.updateEmpty();
    this.watchCollections();
  },

  watchCollections: function() {
    this.listenTo(this.videoFiles, 'add remove', this.check);
    this.listenTo(this.audioFiles, 'add remove', this.check);

    this.listenTo(this.videoFiles, 'reset', this.updateEmpty);
    this.listenTo(this.audioFiles, 'reset', this.updateEmpty);
  },

  check: function() {
    var model = this;

    model.updateEmpty();
    model.set('checking', true);

    model.save({}, {
      url: model.url() + '/check',
      success: function() {
        model.set('checking', false);
      },
      error: function() {
        model.set('checking', false);
      }
    });
  },

  saveAndReset: function() {
    var model = this;

    model.save({}, {
      success: function() {
        model.set('summary_html', '');

        model.videoFiles.reset();
        model.audioFiles.reset();
      }
    });
  },

  updateEmpty: function() {
    this.set('empty', this.videoFiles.length === 0 && this.audioFiles.length === 0);
  },

  url: function() {
    return '/editor/entries/' + state.entry.get('id') + '/encoding_confirmations';
  },

  toJSON: function() {
    return {
      video_file_ids: this.videoFiles.pluck('id'),
      audio_file_ids: this.audioFiles.pluck('id'),
    };
  }
});

EncodingConfirmation.createWithPreselection = function(options) {
  var model = new EncodingConfirmation();

  if (options.fileId) {
    if (options.fileType === 'video_file') {
      model.videoFiles.add(state.videoFiles.get(options.fileId));
    }
    else {
      model.audioFiles.add(state.audioFiles.get(options.fileId));
    }
  }

  return model;
};