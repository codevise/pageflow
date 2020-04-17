import Marionette from 'backbone.marionette';
import _ from 'underscore';

export const LazyVideoEmbeddedView = Marionette.View.extend({
  modelEvents: {
    'change': 'update'
  },

  render: function() {
    this.videoPlayer = this.$el.data('videoPlayer');

    this.videoPlayer.ready(_.bind(function() {
      this.videoPlayer.src(this.model.getVideoFileSources(this.options.propertyName));
    }, this));

    this.update();
    return this;
  },

  update: function() {
    if (this.videoPlayer.isPresent() && this.model.hasChanged(this.options.propertyName)) {
      var paused = this.videoPlayer.paused();

      this.videoPlayer.src(this.model.getVideoFileSources(this.options.propertyName));

      if (!paused) {
        this.videoPlayer.play();
      }
    }

    if (this.options.dataSizeAttributes) {
      var videoFile = this.model.getVideoFile(this.options.propertyName);

      if (videoFile && videoFile.isReady()) {
        this.$el.attr('data-width', videoFile.get('width'));
        this.$el.attr('data-height', videoFile.get('height'));
      }
      else {
        this.$el.attr('data-width', '16');
        this.$el.attr('data-height', '9');
      }
    }
  }
});