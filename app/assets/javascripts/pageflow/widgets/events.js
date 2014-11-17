jQuery(function($) {
  $('body').on('click', 'a.navigation_main', function() {
    pageflow.events.trigger('button:header');
  });

  $('body').on('click', 'a.navigation_index', function() {
    pageflow.events.trigger('button:overview');
  });

  $('body').on('click', 'a.navigation_fullscreen', function() {
    pageflow.events.trigger('button:fullscreen');
  });

  $('body').on('click', '.mute a', function() {
    pageflow.events.trigger('button:mute');
  });

  $('body').on('click', 'a.share.facebook', function() {
    pageflow.events.trigger('share:facebook');
  });

  $('body').on('click', 'a.share.twitter', function() {
    pageflow.events.trigger('share:twitter');
  });

  $('body').on('click', 'a.share.google', function() {
    pageflow.events.trigger('share:google');
  });

  $('body').on('pageactivate', function(event, ui) {
    pageflow.events.trigger('page:change', ui.page);
  });
});