pageflow.HelpImageView = Backbone.Marionette.View.extend({
  tagName: 'img',
  className: 'help_image',

  render: function() {
    this.$el.attr('src', pageflow.editorAssetUrls.help[this.options.imageName]);
    return this;
  }
});
