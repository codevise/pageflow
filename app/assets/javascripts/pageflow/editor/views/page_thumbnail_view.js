pageflow.PageThumbnailView = Backbone.Marionette.View.extend({
  modelEvents: {
    'change:configuration': 'update'
  },

  render: function() {
    this.update();
    return this;
  },

  update: function() {
    if (this.fileThumbnailView && this.currentFileThumbnail == this.model.thumbnailFile()) {
      return;
    }

    this.currentFileThumbnail = this.model.thumbnailFile();

    if (this.fileThumbnailView) {
      this.fileThumbnailView.close();
    }

    this.fileThumbnailView = this.subview(new pageflow.FileThumbnailView({
      model: this.model.thumbnailFile(),
      className: 'thumbnail file_thumbnail',
      imageUrlPropertyName: this.options.imageUrlPropertyName
    }));

    this.$el.append(this.fileThumbnailView.el);
  }
});