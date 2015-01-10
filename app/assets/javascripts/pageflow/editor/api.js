//= require_tree ./api
//= require_self

/**
 * Interface for engines providing editor extensions.
 */
pageflow.EditorApi = pageflow.Object.extend({
  initialize: function() {
    this.sideBarRoutings = [];
    this.mainMenuItems = [];
    this.initializers = [];
    this.fileSelectionHandlers = {};

    /**
     *  Display Backbone/Marionette View inside the main panel
     *  of the editor.
     */
    this.showViewInMainPanel = function(view) {
      pageflow.app.mainRegion.show(view);
    };

    /**
     *  Display the Pageflow-Preview inside the main panel.
     */
    this.showPreview = function() {
      pageflow.app.mainRegion.$el.empty();
    };

    /**
     * Register additional router and controller for sidebar.
     *
     * Supported options:
     * - router: constructor function of Backbone Marionette app router
     * - controller: constructor function of Backbone Marionette controller
     */
    this.registerSideBarRouting = function(options) {
      this.sideBarRoutings.push(options);
    };

    /**
     * Set the name of the help entry that shall be selected by
     * default when the help view is opened. This value is
     * automatically reset when navigation occurs.
     */
    this.setDefaultHelpEntry = function(name) {
      this.nextDefaultHelpEntry = name;
    };

    /** @api private */
    this.applyDefaultHelpEntry = function(name) {
      this.defaultHelpEntry = this.nextDefaultHelpEntry;
      this.nextDefaultHelpEntry = null;
    };

    /**
     * Register additional menu item to be displayed on the root sidebar
     * view.
     *
     * Supported options:
     * - translationKey: for the label
     * - path: route to link to
     * - click: click handler
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

    /**
     * Extend the interface of page configuration objects. This is
     * especially convenient to wrap structured data from the page
     * configuration as Backbone objects.
     *
     * Example:
     *
     *     pageflow.editor.registerPageConfigurationMixin({
     *       externalLinks: function() {
     *         return new Backbone.Collection(this.get('external_links'));
     *       }
     *     }
     *
     *     pageflow.pages.get(1).configuration.externalLinks().each(...);
     */
    this.registerPageConfigurationMixin = function(mixin) {
      Cocktail.mixin(pageflow.Configuration, mixin);
    };

    /**
     * File selection handlers let editor extensions use the files view
     * to select files for usage in their custom models.
     *
     * See selectFile method for details how to trigger file selection.
     *
     * Example:
     *
     *     function MyFileSelectionHandler(options) {
     *       this.call = function(file) {
     *         // invoked with the selected file
     *       };
     *
     *       this.getReferer = function() {
     *         // the path to return to when the back button is clicked
     *         // or after file selection
     *         return '/some/path';
     *       }
     *     }
     *
     *     pageflow.editor.registerFileSelectionHandler('my_file_selection_handler', MyFileSelectionHandler);
     */
    this.registerFileSelectionHandler = function(name, handler) {
      this.fileSelectionHandlers[name] = handler;
    };

    /**
     * Trigger selection of the given file type with the given
     * handler. Payload hash is passed to selection handler as options.
     *
     * Example:
     *
     *     pageflow.editor.selectFile('image_files', 'my_file_selection_handler', {some: 'option for handler'});
     */
    this.selectFile = function(fileType, handlerName, payload) {
      this.navigate('/files/' + fileType + '?handler=' + handlerName + '&payload=' + encodeURIComponent(JSON.stringify(payload)), {trigger: true});
    };

    /**
     * Returns a promise which resolves to a page selected by the
     * user.
     */
    this.selectPage = function() {
      return pageflow.PageSelectionView.selectPage();
    };

    /**
     * Failures API
     *
     * Can watch collections for errors saving models and display the error
     * allong with a retry button.
     *
     *     pageflow.editor.failures.watch(collection);
     *
     * It's possible to add failures to the UI by adding instances of subclasses of pageflow.Failure:
     *
     *     pageflow.editor.failures.add(new pageflow.OrderingFailure(model, collection));
     *
     */
    this.failures = new pageflow.FailuresAPI();

    /**
     * Setup editor integration for page types.
     */
    this.pageTypes = new pageflow.PageTypes();

    /**
     *
     */
    this.fileTypes = new pageflow.FileTypes();

    /** @private */
    this.createFileSelectionHandler = function(handlerName, encodedPayload) {
      /** @private */
      if (!this.fileSelectionHandlers[handlerName]) {
        throw 'Unknown FileSelectionHandler ' + handlerName;
      }

      var payloadJson = JSON.parse(decodeURIComponent(encodedPayload));
      return new this.fileSelectionHandlers[handlerName](payloadJson);
    };
  }
});
