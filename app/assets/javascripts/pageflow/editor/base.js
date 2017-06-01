//= require cocktail
//= require backbone.marionette
//= require pageflow/ui
//= require ./sync

//= require jquery-ui
//= require jquery/layout

//= require jquery-fileupload/vendor/load-image
//= require jquery-fileupload/vendor/canvas-to-blob
//= require jquery-fileupload/jquery.fileupload
//= require jquery-fileupload/jquery.fileupload-fp

//= require ./api

//= require_self

//= require_tree ./utils
//= require_tree ./models/mixins
//= require ./models/uploaded_file
//= require ./models/hosted_file
//= require ./models/encoded_file
//= require ./models/configuration
//= require ./models/scaffold
//= require_tree ./models
//= require_tree ./collections/mixins
//= require ./collections/multi_collection
//= require ./collections/subset_collection
//= require_tree ./collections
//= require_tree ./routers
//= require_tree ./controllers
//= require_tree ./templates

//= require_tree ./views/mixins
//= require ./views/model_thumbnail_view
//= require ./views/file_item_view
//= require ./views/file_meta_data_item_value_view
//= require ./views/chapter_item_view
//= require ./views/page_item_view
//= require ./views/inputs/reference_input_view
//= require_tree ./views/configuration_editors
//= require_tree ./views

//= require ./initializers/setup_config
//= require ./initializers/setup_common_seed
//= require ./initializers/setup_features
//= require ./initializers/setup_audio
//= require ./initializers/setup_help_entries
//= require ./initializers/setup_file_types
//= require ./initializers/setup_widget_types
//= require ./initializers/setup_collections
//= require ./initializers/setup_file_uploader
//= require ./initializers/setup_page_types
//= require ./initializers/setup_hotkeys
//= require ./initializers/setup_file_uploader
//= require ./initializers/setup_themes
//= require ./initializers/edit_lock
//= require ./initializers/files_polling
//= require ./initializers/stylesheet_reloading
//= require ./initializers/routing
//= require ./initializers/error_listener
//= require ./initializers/additional_initializers
//= require ./initializers/boot

/**
 * The Pageflow editor.
 * @module pageflow/editor
 */

pageflow.app = new Backbone.Marionette.Application();
pageflow.editor = new pageflow.EditorApi();

pageflow.startEditor = function(options) {
  jQuery(function() {
    $.when(
      $.getJSON('/editor/entries/' + options.entryId + '/seed'),
      pageflow.browser.detectFeatures()
    )
      .done(function(result) {
        pageflow.app.start(result[0]);
      })
      .fail(function() {
        alert('Error while starting editor.');
      });
  });
};
