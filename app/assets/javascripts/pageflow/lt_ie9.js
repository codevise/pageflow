//= require html5shiv-printshiv
//= require jquery.backgroundSize
//= require polyfills/get_computed_style

jQuery(function($) {
  function centerPosters() {
    $('.vjs-poster img').each(function() {
      var img = $(this),
          imgWidth = img.width(),
          imgHeight = img.height(),
          bodyWidth = $('body').width(),
          bodyHeight = $('body').height(),
          imgRatio = imgHeight > 0 ? imgWidth / imgHeight : 1,
          bodyRatio = bodyHeight > 0 ? bodyWidth / bodyHeight : 1,
          scale;

      if (imgRatio > bodyRatio) {
        scale = bodyWidth / imgWidth;
        img.css({
          position: 'absolute',
          left: 0,
          top: (bodyHeight - imgHeight * scale) / 2 + 'px',
          height: 'auto',
          width: '100%'
        });
      }
      else {
        scale = bodyHeight / imgHeight;
        img.css({
          position: 'relative',
          margin: 'auto',
          left: 0,
          top: 0,
          height: '100%',
          width: 'auto'
        });
      }
    });
  }

  $('.page .background_image').css('background-size', 'cover');

  $('body').on('pageactivate', function(event) {
    $('.background_image', event.target).each(function() {
      this.style.backgroundImage = '';
      $.refreshBackground(this);
    });

    centerPosters();
  });

  $(window).on('resize', function() {
    centerPosters();
  });

  $('.ie8_hint .close').click(function() {
    $('.ie8_hint').remove();
    return false;
  });
});