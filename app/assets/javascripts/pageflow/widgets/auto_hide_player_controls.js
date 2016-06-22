jQuery.widget('pageflow.autoHidePlayerControls', {
  attach: function(player) {
    var element = this.element;
    var options = this.options;
    var pageElement = this.options.pageElement;
    var target = this.options.target;
    var timeout;

    pageElement.on('mousemove', autoHideControls);
    $('body').on('keydown', autoHideControls);
    pageElement.find('.content').on('touchstart', autoHideControls);

    player.on('play', function() {
      autoHideControls();
    });

    player.on('pause', showControls);

    element.on('mouseenter', function() {
      target.addClass('is_control_bar_hovered');
    });

    element.on('mouseleave', function() {
      target.removeClass('is_control_bar_hovered');
    });

    function autoHideControls() {
      showControls();
      if (!pageflow.browser.has('phone platform')) {
        clearTimeout(timeout);
        timeout = setTimeout(hideControls, 2000);
      }
    }

    function hideControls() {
      if (!player.paused()) {
        target.addClass('is_idle');
        element.addClass('has_been_faded');

        if (options.onHide) {
          options.onHide();
        }
      }
    }

    function showControls() {
      target.removeClass('is_idle');

      if (options.onShow) {
        options.onShow();
      }
    }
  },

  reset: function(options) {
    this.element
      .removeClass('has_been_faded');
  }
});
