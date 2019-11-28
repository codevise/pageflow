import _ from 'underscore';

import {Object} from '$pageflow/ui';

import {CommonPageConfigurationTabs} from './CommonPageConfigurationTabs';
import {FailuresAPI} from './Failures';
import {FileTypes} from './FileTypes';
import {PageTypes} from './PageTypes';
import {WidgetTypes} from './WidgetTypes';
import {app} from '../app';

export * from './errors';

/**
 * Interface for engines providing editor extensions.
 * @alias editor
 * @memberof module:pageflow/editor
 */
export const EditorApi = Object.extend(
/** @lends module:pageflow/editor.editor */{

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
     * @memberof module:pageflow/editor.editor
     */
    this.failures = new FailuresAPI();

    /**
     * Set up editor integration for page types.
     * @alias pageTypes
     * @memberof module:pageflow/editor.editor
     */
    this.pageTypes = new PageTypes();

    /**
     * Add tabs to the configuration editor of all pages.
     * @alias commonPageConfigurationTabs
     * @memberof module:pageflow/editor.editor
     */
    this.commonPageConfigurationTabs = new CommonPageConfigurationTabs();

    /**
     * Setup editor integration for widget types.
     * @alias widgetType
     * @memberof module:pageflow/editor.editor
     */
    this.widgetTypes = new WidgetTypes();

    /**
     * @alias fileTypes
     * @memberof module:pageflow/editor.editor
     * Set up editor integration for file types
     */
    this.fileTypes = new FileTypes();
  },

  /**
   *  Display Backbone/Marionette View inside the main panel
   *  of the editor.
   */
  showViewInMainPanel: function(view) {
    app.mainRegion.show(view);
  },

  /**
   *  Display the Pageflow-Preview inside the main panel.
   */
  showPreview: function() {
    app.mainRegion.$el.empty();
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
   *     editor.registerPageConfigurationMixin({
   *       externalLinks: function() {
   *         return new Backbone.Collection(this.get('external_links'));
   *       }
   *     }
   *
   *     state.pages.get(1).configuration.externalLinks().each(...);
   */
  registerPageConfigurationMixin: function(mixin) {
    app.trigger('mixin:configuration', mixin);
  },

  /**
   * File selection handlers let editor extensions use the files view
   * to select files for usage in their custom models.
   *
   * See {@link module:pageflow/editor.editor.selectFile
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
         editor.registerFileSelectionHandler('my_file_selection_handler',
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
   *   module:pageflow/editor.editor.registerFileSelectionHandler}.
   *
   * @param {Object} payload
   *   Options passed to the file selection handler.
   *
   * @example
   *
   * editor.selectFile('image_files',
   *                            'my_file_selection_handler',
   *                            {some: 'option for handler'});
   *
   * editor.selectFile({name: 'image_files', filter: 'some_filter'},
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
    return this.pageSelectionView.selectPage(options);
  },

  createFileSelectionHandler: function(handlerName, encodedPayload) {
    if (!this.fileSelectionHandlers[handlerName]) {
      throw 'Unknown FileSelectionHandler ' + handlerName;
    }

    var payloadJson = JSON.parse(decodeURIComponent(encodedPayload));
    return new this.fileSelectionHandlers[handlerName](payloadJson);
  },

  createPageConfigurationEditorView: function(page, options) {
    var view = this.pageTypes
                   .findByPage(page)
                   .createConfigurationEditorView(_.extend(options, {
                     model: page.configuration
                   }));

    this.commonPageConfigurationTabs.apply(view);
    return view;
  }
});
