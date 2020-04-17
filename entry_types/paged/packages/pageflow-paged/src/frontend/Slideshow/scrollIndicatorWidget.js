import jQuery from 'jquery';
import {events} from 'pageflow/frontend';
import {widgets} from '../widgets';
import {navigationDirection} from './navigationDirection';
import {ready} from '../ready';
import {delayedStart} from '../delayedStart';

(function($) {
  var boundaries = {
    back: 'top',
    next: 'bottom'
  };

  $.widget('pageflow.scrollIndicator', {
    _create: function() {
      var parent = this.options.parent,
          direction = this.element.data('direction'),
          boundary = boundaries[direction],
          that = this,
          fadeTimeout;

      function update(page) {
        that.element.toggleClass('hidden_by_scoll_indicator_mode', hiddenByMode(page));
        that.element.toggleClass('hidden_for_page', hideScrollIndicatorForPage(page));

        that.element.toggleClass('invert', invertIndicator(page));
        that.element.toggleClass('horizontal', page.hasClass('scroll_indicator_orientation_horizontal'));
        that.element.toggleClass('available', targetPageExists());
      }

      function hiddenByMode(page) {
        return (page.hasClass('scroll_indicator_mode_non') ||
                (page.hasClass('scroll_indicator_mode_only_next') && direction === 'back') ||
                (page.hasClass('scroll_indicator_mode_only_back') && direction === 'next'));
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
          !widgets.areLoaded();
      }

      function hasSlimPlayerControls(page) {
        return hasPlayerControls(page) && widgets.isPresent('slim_player_controls');
      }

      function hasPlayerControls(page) {
        return !!page.find('[data-role="player_controls"]').length;
      }

      function targetPageExists() {
        return direction === 'next' ? parent.nextPageExists() : parent.previousPageExists();
      }

      parent.on('pageactivate', function(event) {
        update($(event.target));

        clearTimeout(fadeTimeout);
        that.element.removeClass('faded');
      });

      events.on({
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

      parent.on(navigationDirection.getEventName('scrollerhint' + direction), function() {
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

      $.when(ready, delayedStart.promise()).done(function() {
        setTimeout(function() {
          that.element.addClass('attract');
          setTimeout(function() {
            that.element.removeClass('attract');
          }, 1500);
        }, 3000);
      });

      this.element.on('click', function() {
        if (direction === 'next') {
          parent.next();
        }
        else {
          parent.back();
        }
      });
    }
  });
}(jQuery));
