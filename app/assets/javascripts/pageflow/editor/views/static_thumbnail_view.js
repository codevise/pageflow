pageflow.StaticThumbnailView = Backbone.Marionette.ItemView.extend({
  template: 'templates/static_thumbnail',
  className: 'static_thumbnail',

  onRender: function() {
    this.update();
  },

  update: function() {
    this.$el.css('background-image', 'url(' + this._imageUrl() + ')');
  },

  _imageUrl: function() {
    return this.model.thumbnailUrl();
  }
});
