(function($) {
  var ENTER_KEY = 13;
  var SPACE_KEY = 32;

  $.widget('pageflow.scrollButton', {
    _create: function() {
      var element = this.element;
      var scroller = this.options.scroller;
      var direction = this.options.direction;
      var interval;

      scroller.on('scrollEnd', function() {
        updateVisibility();
      });

      this.element.on('click', function() {
      });

      if (this.options.page) {
        element.on({
          click: function () {
            changePage();
            element.blur();
            return false;
          },

          keypress: function(e) {
            if (e.which == SPACE_KEY) {
              changePage();
            }
          },

          touchstart: function() {
            changePage();
          }
        });
      }

      updateVisibility();

      function updateVisibility() {
        element.toggle(!atBoundary());
      }

      function changePage() {
        if (direction === 'top' || direction === 'left') {
          scroller.prev();
        }
        else if (direction === 'down' || direction === 'right') {
          scroller.next();
        }
      }

      function scrollBy(delta, duration) {
        if (direction === 'top') {
          scroller.scrollBy(0, delta, duration);
        }
        else if (direction === 'left') {
          scroller.scrollBy(delta, 0, duration);
        }
        else if (direction === 'down') {
          scroller.scrollBy(0, -delta, duration);
        }
        else {
          scroller.scrollBy(-delta, 0, duration);
        }
      }

      function atBoundary() {
        if (direction === 'top') {
          return (scroller.y >= 0);
        }
        else if (direction === 'left') {
          return (scroller.x >= 0);
        }
        else if (direction === 'down') {
          return (scroller.y <= scroller.maxScrollY);
        }
        else {
          return (scroller.x <= scroller.maxScrollX);
        }
      }
    }
  });
}(jQuery));
