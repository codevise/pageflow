//= require cocktail
//= require backbone.marionette
//= require ./sync
//= require ./renderer

//= require jquery.ui.all
//= require jquery/layout

//= require jquery-fileupload/vendor/load-image
//= require jquery-fileupload/vendor/canvas-to-blob
//= require jquery-fileupload/jquery.fileupload
//= require jquery-fileupload/jquery.fileupload-fp

//= require wysihtml5
//= require parser_rules/simple

//= require i18n
//= require i18n/translations

//= require ./object
//= require ./api

//= require_self

//= require_tree ./models/mixins
//= require ./models/uploaded_file
//= require ./models/hosted_file
//= require ./models/encoded_file
//= require_tree ./models
//= require_tree ./collections/mixins
//= require ./collections/multi_collection
//= require ./collections/subset_collection
//= require_tree ./collections
//= require_tree ./routers
//= require_tree ./controllers
//= require_tree ./templates

//= require_tree ./views/mixins
//= require ./views/file_item_view
//= require ./views/chapter_item_view
//= require ./views/page_item_view
//= require ./views/configuration_editor_tab_view
//= require ./views/configuration_editor_view
//= require_tree ./views/configuration_editors
//= require_tree ./views

//= require ./initializers/setup_config
//= require ./initializers/setup_file_types
//= require ./initializers/setup_collections
//= require ./initializers/setup_page_types
//= require ./initializers/edit_lock
//= require ./initializers/files_polling
//= require ./initializers/routing
//= require ./initializers/additional_initializers
//= require ./initializers/boot

pageflow.app = new Backbone.Marionette.Application();
pageflow.editor = new pageflow.EditorApi();
