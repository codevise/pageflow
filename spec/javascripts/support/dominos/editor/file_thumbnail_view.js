support.dom.FileThumbnailView = support.dom.Base.extend({
  selector: '.file_thumbnail',

  backgroundImage: function() {
    return this.$el.css('backgroundImage');
  }
});
