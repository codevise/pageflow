pageflow.LazyVideoEmbeddedView = Backbone.Marionette.View.extend({
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
    var videoPlayer = this.videoPlayer;

    videoPlayer.ensureCreated();

    if (!this.srcDefined || this.model.hasChanged(this.options.propertyName)) {
      var src = this.model.getVideoFileSources(this.options.propertyName);
      videoPlayer.src(src);

      this.srcDefined = true;
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