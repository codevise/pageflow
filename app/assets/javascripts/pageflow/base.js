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

//= require jquery
//= require jquery.ui.widget
//= require jquery_ujs
//= require ./jquery_utils
//= require iscroll
//= require audio5.min
//= require video
//= require jquery.fullscreen
//= require jquery.placeholder

//= require backbone-rails
//= require_self

//= require ./cookies
//= require ./events
//= require ./page_type
//= require ./asset_urls
//= require ./preload
//= require ./bandwidth
//= require ./features
//= require ./audio_player
//= require ./video_player
//= require ./visited
//= require ./print_layout
//= require ./history
//= require ./manual_start
//= require ./widget_types
//= require ./built_in_widget_types
//= require ./links

//= require ./settings

//= require ./slideshow
//= require ./ready
//= require_tree ./widgets

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
