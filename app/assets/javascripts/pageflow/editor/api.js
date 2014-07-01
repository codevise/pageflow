//= require_tree ./api
//= require_self

/**
 * Interface for engines providing editor extensions.
 */
pageflow.EditorApi = pageflow.Object.extend({
  initialize: function() {
    this.initializers = [];

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
