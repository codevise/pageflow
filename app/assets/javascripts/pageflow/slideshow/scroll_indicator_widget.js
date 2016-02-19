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
          that = this,
          fadeTimeout;

      function update(page) {
        if (page.hasClass('scroll_indicator_mode_non') ||
            (page.hasClass('scroll_indicator_mode_only_next') && direction === 'up') ||
            (page.hasClass('scroll_indicator_mode_only_back') && direction === 'down')) {

          that.element.hide();
        }
        else {
          that.element.show();
        }

        that.element.toggleClass('hidden_for_page', hideScrollIndicatorForPage(page));

        that.element.toggleClass('invert', invertIndicator(page));
        that.element.toggleClass('horizontal', page.hasClass('scroll_indicator_orientation_horizontal'));
        that.element.toggleClass('available', targetPageExists());
      }

      function invertIndicator(page) {
        var result = page.data('invertIndicator');

        if (typeof result === 'undefined') {
          result = page.hasClass('invert') && !hasSlimPlayerControls(page);
        }

        return result;
      }

      function hideScrollIndicatorForPage(page) {
        return hasSlimPlayerControls(page) ||
          !pageflow.widgets.areLoaded();
      }

      function hasSlimPlayerControls(page) {
        return hasPlayerControls(page) && pageflow.widgets.isPresent('slim_player_controls');
      }

      function hasPlayerControls(page) {
        return !!page.find('[data-role="player_controls"]').length;
      }

      function targetPageExists() {
        return direction === 'down' ? parent.nextPageExists() : parent.previousPageExists();
      }

      parent.on('pageactivate', function(event) {
        update($(event.target));

        clearTimeout(fadeTimeout);
        that.element.removeClass('faded');
      });

      pageflow.events.on({
        'page:update': function() {
          update(parent.currentPage());
        },

        'scroll_indicator:disable': function() {
          clearTimeout(fadeTimeout);
          that.element.addClass('hidden_for_page');
        },

        'scroll_indicator:schedule_disable': function() {
          clearTimeout(fadeTimeout);

          fadeTimeout = setTimeout(function() {
            that.element.addClass('faded');
          }, 2000);
        },

        'scroll_indicator:enable': function() {
          clearTimeout(fadeTimeout);
          that.element.removeClass('faded hidden_for_page');
        },
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
          that.element.toggleClass('visible', targetPageExists());
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