pageflow.videoHelpers = {
  updateVideoPoster: function(pageElement, imageUrl) {
    pageElement.find('.vjs-poster').css('background-image', 'url(' + imageUrl + ')');
  }
};
