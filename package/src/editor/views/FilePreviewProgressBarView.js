import $ from 'jquery';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import template from '../templates/filePreviewProgressBar.jst';

const MEDIA_EVENTS = 'durationchange loadedmetadata timeupdate';

export const FilePreviewProgressBarView = Marionette.ItemView.extend({
  template,
  className: 'file_preview-progress',

  ui: {
    input: 'input'
  },

  events: {
    'input input': 'seek'
  },

  initialize: function() {
    _.bindAll(this, 'update');
  },

  onRender: function() {
    $(this.options.media).on(MEDIA_EVENTS, this.update);
    this.update();
  },

  onClose: function() {
    $(this.options.media).off(MEDIA_EVENTS, this.update);
  },

  seek: function() {
    this.options.media.currentTime = Number(this.ui.input.val());
    this.update();
  },

  update: function() {
    var duration = this.duration();
    var currentTime = this.options.media.currentTime;

    this.ui.input.attr('max', duration);
    this.ui.input.val(currentTime);

    this.el.style.setProperty('--progress',
                              `${duration ? (currentTime / duration) * 100 : 0}%`);
  },

  // Unknown until the browser has loaded metadata.
  duration: function() {
    var duration = this.options.media.duration;

    return Number.isFinite(duration) ? duration : 0;
  }
});
