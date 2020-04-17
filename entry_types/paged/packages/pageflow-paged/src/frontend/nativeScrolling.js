export const nativeScrolling = {
  preventScrollBouncing: function(slideshow) {
    slideshow.on('touchmove', function (e) {
      e.preventDefault();
    });
  },

  preventScrollingOnEmbed: function(slideshow) {
    slideshow.on('wheel mousewheel DOMMouseScroll', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });
  }
};