// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//

//= require polyfills/bind

//= require i18n
//= require jquery
//= require jquery-ui/widget
//= require jquery_ujs
//= require ./jquery_utils
//= require iscroll
//= require audio5.min
//= require ./videojs
//= require jquery.fullscreen
//= require jquery.placeholder

//= require react
//= require backbone-rails
//= require_self

//= require ./object
//= require ./entry_data
//= require ./seed_entry_data
//= require ./cookies
//= require ./events
//= require ./page_type
//= require ./page_transitions
//= require ./asset_urls
//= require ./preload
//= require ./bandwidth
//= require ./browser
//= require ./features
//= require ./audio
//= require ./audio_player
//= require ./video_player
//= require ./visited
//= require ./print_layout
//= require ./history
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

//= require ./settings

//= require ./slideshow
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
