import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {FilePreviewProgressBarView} from './FilePreviewProgressBarView';

import template from '../templates/audioFilePreview.jst';

export const AudioFilePreviewView = Marionette.ItemView.extend({
  template,
  className: 'file_preview file_preview-audio',

  ui: {
    audio: 'audio',
    playToggle: '.file_preview-play_toggle',
    playIcon: '.file_preview-play',
    pauseIcon: '.file_preview-pause'
  },

  events: {
    'click .file_preview-play_toggle': 'togglePlaying'
  },

  modelEvents: {
    'change:sources': 'update'
  },

  onRender: function() {
    this.update();

    this.appendSubview(new FilePreviewProgressBarView({media: this.ui.audio[0]}));

    this.ui.audio.on('play pause ended', this.updatePlaying.bind(this));
    this.updatePlaying();
  },

  update: function() {
    this.ui.audio.empty();

    _.each(this.model.get('sources'), function(source) {
      this.ui.audio.append($('<source />', {src: source.src, type: source.type}));
    }, this);
  },

  togglePlaying: function() {
    if (!this.ui.audio[0].paused) {
      return this.ui.audio[0].pause();
    }

    // Dismissing the overlay takes the element out of the document,
    // which rejects a play request that is still starting up.
    var started = this.ui.audio[0].play();

    if (started) {
      started.catch(function() {});
    }
  },

  updatePlaying: function() {
    var playing = !this.ui.audio[0].paused;
    var label = I18n.t('pageflow.editor.views.audio_file_preview_view.' +
                       (playing ? 'pause' : 'play'));

    this.ui.playIcon.toggleClass('is_hidden', playing);
    this.ui.pauseIcon.toggleClass('is_hidden', !playing);

    this.ui.playToggle.attr('title', label);
    this.ui.playToggle.attr('aria-label', label);
  }
});
