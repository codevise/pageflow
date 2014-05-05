pageflow.videoHelpers = {
  updateVideoTagForHighBandwidth: function(video) {
    if (pageflow.features.has('high bandwidth') && !pageflow.features.has('mobile platform')) {
      video.attr('poster', video.attr('data-large-poster'));

      if (pageflow.features.has('rewrite video sources support')) {
        video.find('source').each(function() {
          var source = $(this);
          source.attr('src', source.attr('data-high-src'));
        });
      }
    }
    else {
      video.attr('poster', video.attr('data-poster'));
    }
  },

  updateVideoPoster: function(pageElement, imageUrl) {
    pageElement.find('.vjs-poster').css('background-image', 'url(' + imageUrl + ')');
  }
};
