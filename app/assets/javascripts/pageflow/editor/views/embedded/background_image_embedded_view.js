pageflow.BackgroundImageEmbeddedView = Backbone.Marionette.View.extend({
  modelEvents: {
    'change': 'update'
  },

  render: function() {
    this.update();
    return this;
  },

  update: function() {
    this.$el.css({
      backgroundImage: 'url("' + this.model.getImageFileUrl(this.options.propertyName) + '")',
      backgroundPosition: this.model.getFilePosition(this.options.propertyName, 'x') + '% ' +
        this.model.getFilePosition(this.options.propertyName, 'y') + '%'
    });

    if (this.options.dataSizeAttributes) {
      var imageFile = this.model.getImageFile(this.options.propertyName);

      if (imageFile && imageFile.isReady()) {
        this.$el.attr('data-width',  imageFile.get('width'));
        this.$el.attr('data-height',  imageFile.get('height'));
      }
      else {
        this.$el.attr('data-width', '16');
        this.$el.attr('data-height', '9');
      }
      this.$el.css({backgroundPosition:'0 0'});
    }
  }
});