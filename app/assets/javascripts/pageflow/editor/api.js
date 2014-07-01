//= require_tree ./api
//= require_self

/**
 * Interface for engines providing editor extensions.
 */
pageflow.EditorApi = pageflow.Object.extend({
  initialize: function() {
    this.mainMenuItems = [];
    this.initializers = [];

    /**
     * Register additional menu item to be displayed on the root sidebar
     * view.
     *
     * Supported options:
     * - translationKey: for the label
     * - path: route to link to
     */
    this.registerMainMenuItem = function(options) {
      this.mainMenuItems.push(options);
    };

    /**
     * Register a custom initializer which will be run before the boot
     * initializer of the editor.
     */
    this.addInitializer = function(fn) {
      this.initializers.push(fn);
    };

    /**
     * Navigate to the given path.
     */
    this.navigate = function(path, options) {
      editor.navigate(path, options);
    };
  }
});
