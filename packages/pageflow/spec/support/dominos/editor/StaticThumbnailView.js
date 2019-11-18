support.dom.StaticThumbnailView = support.dom.Base.extend({
  selector: '.static_thumbnail',

  backgroundImage: function() {
    return this.$el.css('backgroundImage');
  }
});
