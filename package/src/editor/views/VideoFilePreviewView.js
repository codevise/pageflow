import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {FilePreviewProgressBarView} from './FilePreviewProgressBarView';
import {filePreviewDimensions} from './mixins/filePreviewDimensions';

import template from '../templates/videoFilePreview.jst';

export const VideoFilePreviewView = Marionette.ItemView.extend({
  template,
  className: 'file_preview',

  mixins: [filePreviewDimensions],

  ui: {
    video: 'video',
    controls: '.file_preview-controls',
    muteToggle: '.file_preview-mute_toggle',
    mutedIcon: '.file_preview-muted',
    unmutedIcon: '.file_preview-unmuted'
  },

  events: {
    'click video': 'toggleMuted',
    'click .file_preview-mute_toggle': 'toggleMuted'
  },

  modelEvents: {
    'change:preview_url': 'update'
  },

  onRender: function() {
    // Chrome only starts playing without user interaction if the
    // property is set, not just the attribute.
    this.ui.video.prop('muted', true);

    // Seeking comes before turning on sound, both in reading order and
    // when tabbing through the controls.
    var progressBar = new FilePreviewProgressBarView({media: this.ui.video[0]});
    this.ui.controls.prepend(this.subview(progressBar).el);

    this.update();
    this.updateMuted();
  },

  update: function() {
    this.applyDimensions(this.ui.video);
    this.ui.video.attr('src', this.model.get('preview_url'));
  },

  toggleMuted: function() {
    this.ui.video.prop('muted', !this.ui.video.prop('muted'));
    this.updateMuted();
  },

  updateMuted: function() {
    var muted = this.ui.video.prop('muted');
    var label = I18n.t('pageflow.editor.views.video_file_preview_view.' +
                       (muted ? 'unmute' : 'mute'));

    // Toggled via class rather than inline style, since jQuery would
    // fall back to the inline display of an svg inside the still hidden
    // overlay, which keeps the button from being round.
    this.ui.mutedIcon.toggleClass('is_hidden', !muted);
    this.ui.unmutedIcon.toggleClass('is_hidden', muted);

    this.ui.muteToggle.attr('title', label);
    this.ui.muteToggle.attr('aria-label', label);
  }
});
