export const videoHelpers = {
  updateVideoPoster: function(pageElement, imageUrl) {
    pageElement.find('.vjs-poster').css('background-image', 'url(' + imageUrl + ')');
  },

  updateBackgroundVideoPosters: function(pageElement, imageUrl, x, y) {
    pageElement.find('.vjs-poster, .background-image').css({
      'background-image': 'url(' + imageUrl + ');',
      'background-position': x + '% ' + y + '%;'
    });
  }
};
