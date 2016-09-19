//= require_tree ./api
//= require_self

/**
 * Interface for engines providing editor extensions.
 * @alias pageflow.editor
 * @memberof module:pageflow/editor
 */
pageflow.EditorApi = pageflow.Object.extend(
/** @lends module:pageflow/editor.pageflow.editor */{

  initialize: function(options) {
    this.router = options && options.router;

    this.sideBarRoutings = [];
    this.mainMenuItems = [];
    this.initializers = [];
    this.fileSelectionHandlers = {};

    /**
     * Failures API
     *
     * @returns {pageflow.Failures}
     *
     * @alias failures
     * @memberof module:pageflow/editor.pageflow.editor
     */
    this.failures = new pageflow.FailuresAPI();

    /**
     * Setup editor integration for page types.
     * @alias pageTypes
     * @memberof module:pageflow/editor.pageflow.editor
     */
    this.pageTypes = new pageflow.PageTypes();

    /**
     * @alias fileTypes
     * @memberof module:pageflow/editor.pageflow.editor
     */
    this.fileTypes = new pageflow.FileTypes();
  },

  /**
   *  Display Backbone/Marionette View inside the main panel
   *  of the editor.
   */
  showViewInMainPanel: function(view) {
    pageflow.app.mainRegion.show(view);
  },

  /**
   *  Display the Pageflow-Preview inside the main panel.
   */
  showPreview: function() {
    pageflow.app.mainRegion.$el.empty();
  },

  /**
   * Register additional router and controller for sidebar.
   *
   * Supported options:
   * - router: constructor function of Backbone Marionette app router
   * - controller: constructor function of Backbone Marionette controller
   */
  registerSideBarRouting: function(options) {
    this.sideBarRoutings.push(options);
  },

  /**
   * Set the file that is the parent of nested files when they are
   * uploaded. This value is automatically set and unset upon
   * navigating towards the appropriate views.
   */
  setUploadTargetFile: function(file) {
    this.nextUploadTargetFile = file;
  },

  /**
   * Set the name of the help entry that shall be selected by
   * default when the help view is opened. This value is
   * automatically reset when navigation occurs.
   */
  setDefaultHelpEntry: function(name) {
    this.nextDefaultHelpEntry = name;
  },

  applyDefaultHelpEntry: function(name) {
    this.defaultHelpEntry = this.nextDefaultHelpEntry;
    this.nextDefaultHelpEntry = null;
  },

  /**
   * Register additional menu item to be displayed on the root sidebar
   * view.
   *
   * Supported options:
   * - translationKey: for the label
   * - path: route to link to
   * - click: click handler
   */
  registerMainMenuItem: function(options) {
    this.mainMenuItems.push(options);
  },

  /**
   * Register a custom initializer which will be run before the boot
   * initializer of the editor.
   */
  addInitializer: function(fn) {
    this.initializers.push(fn);
  },

  /**
   * Navigate to the given path.
   */
  navigate: function(path, options) {
    if (!this.router) {
      throw 'Routing has not been initialized yet.';
    }

    this.router.navigate(path, options);
  },

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
  registerPageConfigurationMixin: function(mixin) {
    Cocktail.mixin(pageflow.Configuration, mixin);
  },

  /**
   * File selection handlers let editor extensions use the files view
   * to select files for usage in their custom models.
   *
   * See {@link module:pageflow/editor.pageflow.editor.selectFile
   * selectFile} method for details how to trigger file selection.
   *
   * Example:
   *
   *     function MyFileSelectionHandler(options) { this.call =
   *       function(file) { // invoked with the selected file };
   *
   *       this.getReferer = function() { // the path to return to
   *         when the back button is clicked // or after file
   *         selection return '/some/path'; } }
   *
   *
         pageflow.editor.registerFileSelectionHandler('my_file_selection_handler',
         MyFileSelectionHandler);
   */
  registerFileSelectionHandler: function(name, handler) {
    this.fileSelectionHandlers[name] = handler;
  },

  /**
   * Trigger selection of the given file type with the given
   * handler. Payload hash is passed to selection handler as options.
   *
   * @param {string|{name: string, filter: string}} fileType
   *   Either collection name of a file type or and object containing
   *   the collection name a file type and a the name of a file type
   *   filter.
   *
   * @param {string} handlerName
   *   The name of a handler registered via {@link
   *   module:pageflow/editor.pageflow.editor.registerFileSelectionHandler}.
   *
   * @param {Object} payload
   *   Options passed to the file selection handler.
   *
   * @example
   *
   * pageflow.editor.selectFile('image_files',
   *                            'my_file_selection_handler',
   *                            {some: 'option for handler'});
   *
   * pageflow.editor.selectFile({name: 'image_files', filter: 'some_filter'},
   *                            'my_file_selection_handler',
   *                            {some: 'option for handler'});
   */
  selectFile: function(fileType, handlerName, payload) {
    if (typeof fileType === 'string') {
      fileType = {
        name: fileType
      };
    }

    this.navigate('/files/' + fileType.name +
                  '?handler=' + handlerName +
                  '&payload=' + encodeURIComponent(JSON.stringify(payload)) +
                  (fileType.filter ? '&filter=' + fileType.filter : ''),
                  {trigger: true});
  },

  /**
   * Returns a promise which resolves to a page selected by the
   * user.
   *
   * Supported options:
   * - isAllowed: function which given a page returns true or false depending on
   *   whether the page is a valid selection
   */
  selectPage: function(options) {
    return pageflow.PageSelectionView.selectPage(options);
  },

  createFileSelectionHandler: function(handlerName, encodedPayload) {
    if (!this.fileSelectionHandlers[handlerName]) {
      throw 'Unknown FileSelectionHandler ' + handlerName;
    }

    var payloadJson = JSON.parse(decodeURIComponent(encodedPayload));
    return new this.fileSelectionHandlers[handlerName](payloadJson);
  },
});
