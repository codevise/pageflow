import jQuery from 'jquery';
import {events} from 'pageflow/frontend';

jQuery(function($) {
  $('body').on('click', 'a.navigation_main', function() {
    events.trigger('button:header');
  });

  $('body').on('click', 'a.navigation_index', function() {
    events.trigger('button:overview');
  });

  $('body').on('click', 'a.navigation_fullscreen', function() {
    events.trigger('button:fullscreen');
  });

  $('body').on('click', '.mute a', function() {
    events.trigger('button:mute');
  });

  $('body').on('click', 'a.share.facebook', function() {
    events.trigger('share:facebook');
  });

  $('body').on('click', 'a.share.twitter', function() {
    events.trigger('share:twitter');
  });

  $('body').on('click', 'a.share.google', function() {
    events.trigger('share:google');
  });

  $('body').on('pageactivate', function(event, ui) {
    events.trigger('page:change', ui.page);
  });
});
