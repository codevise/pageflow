(function($) {
  var boundaries = {
    up: 'top',
    down: 'bottom'
  };

  $.widget('pageflow.scrollIndicator', {
    _create: function() {
      var parent = this.options.parent,
          direction = this.element.data('direction'),
          boundary = boundaries[direction],
          that = this;

      parent.on('pageactivate', function(event) {
        var page = $(event.target);
        var invertIndicator = page.data('invertIndicator');

        if (typeof invertIndicator === 'undefined') {
          invertIndicator = page.hasClass('invert');
        }

        that.element.toggleClass('invert', invertIndicator);
        that.element.toggleClass('horizontal', page.data('scrollDirection'));
      });

      parent.on('scrollerhint' + direction, function() {
        that.element.addClass('animate');
        setTimeout(function() {
          that.element.removeClass('animate');
        }, 500);
      });

      parent.on('scrollernear' + boundary, function(event) {
        var page = $(event.target).parents('section');

        if (page.hasClass('active')) {
          that.element.toggleClass('visible', parent.nextPageExists());
        }
      });

      parent.on('scrollernotnear' + boundary +' slideshowchangepage', function() {
        that.element.removeClass('visible');
      });

      $.when(pageflow.ready, pageflow.manualStart).done(function() {
        setTimeout(function() {
          that.element.addClass('attract');
          setTimeout(function() {
            that.element.removeClass('attract');
          }, 1500);
        }, 3000);
      });

      this.element.on('click', function() {
        if (direction === 'down') {
          parent.next();
        }
        else {
          parent.back();
        }
      });
    }
  });
}(jQuery));