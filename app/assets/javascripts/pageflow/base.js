// base JavaScript file for Pageflow.
// This file is meant to hold code we develop.
// And vendor code that changes a lot.

//= require polyfills/bind

//= require ./jquery_utils
//= require ./videojs

//= require_self

//= require ./object
//= require ./background_media
//= require ./entry_data
//= require ./seed_entry_data
//= require ./cookies
//= require ./cookie_notice
//= require ./events
//= require ./page_type
//= require ./asset_urls
//= require ./preload
//= require ./bandwidth
//= require ./browser
//= require ./features
//= require ./audio
//= require ./audio_player
//= require ./audio_context
//= require ./video_player
//= require ./visited
//= require ./print_layout
//= require ./history
//= require ./delayed_start
//= require ./manual_start
//= require ./widgets
//= require ./widget_types
//= require ./built_in_widget_types
//= require ./links
//= require ./highlighted_page
//= require ./chapter_filter
//= require ./fullscreen
//= require ./multimedia_alert
//= require ./native_scrolling
//= require ./focus_outline
//= require ./phone_landscape_fullscreen
//= require ./theme

//= require ./settings

//= require ./slideshow
//= require ./page_transitions
//= require ./ready
//= require_tree ./widgets
//= require ./react

pageflow = {
  log: function(text, options) {
    if (window.console && (pageflow.debugMode() || (options && options.force))) {
      window.console.log(text);
    }
  },

  debugMode: function() {
    return (window.location.href.indexOf('debug=true') >= 0);
  }
};
