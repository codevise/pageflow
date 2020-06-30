import _ from 'underscore';

import {Object} from 'pageflow/ui';

import {CommonPageConfigurationTabs} from './CommonPageConfigurationTabs';
import {FailuresAPI} from './Failures';
import {FileTypes} from './FileTypes';
import {FileImporters} from './FileImporters'
import {PageTypes} from './PageTypes';
import {SavingRecordsCollection} from './SavingRecordsCollection';
import {WidgetTypes} from './WidgetTypes';
import {app} from '../app';
import {state} from '$state';

export * from './errors';
export {Failure} from './Failure';
export {FileTypes, WidgetTypes};

/**
 * Interface for engines providing editor extensions.
 * @alias editor
 */
export const EditorApi = Object.extend(
/** @lends editor */{

  initialize: function(options) {
    this.router = options && options.router;

    this.sideBarRoutings = [];
    this.mainMenuItems = [];
    this.initializers = [];
    this.fileSelectionHandlers = {};

    /**
     * Failures API
     *
     * @returns {Failures}
     * @memberof editor
     */
    this.failures = new FailuresAPI();

    /**
     * Tracking records that are currently being saved.
     *
     * @returns {SavingRecordsCollection}
     * @memberof editor
     * @since 15.1
     */
    this.savingRecords = new SavingRecordsCollection();

    /**
     * Set up editor integration for page types.
     * @memberof editor
     */
    this.pageTypes = new PageTypes();

    /**
     * Add tabs to the configuration editor of all pages.
     * @memberof editor
     */
    this.commonPageConfigurationTabs = new CommonPageConfigurationTabs();

    /**
     * Setup editor integration for widget types.
     * @memberof editor
     */
    this.widgetTypes = new WidgetTypes();

    /**
     * Set up editor integration for file types
     * @memberof editor
     */
    this.fileTypes = new FileTypes();


    /**
     * List of available file import plugins
     * @memberof editor
     */
    this.fileImporters = new FileImporters();
  },

  /**
   * Configure editor for entry type.
   *
   * @param {string} name
   *   Must match name of entry type registered in Ruby configuration.
   * @param {Object} options
   * @param {function} options.EntryModel
   *   Backbone model extending {Entry} to store entry state.
   * @param {function} options.EntryPreviewView
   *   Backbone view that will render the live preview of the entry.
   * @param {function} options.EntryOutlineView
   *   Backbone view that will be rendered in the side bar.
   * @param {function} options.isBrowserSupported
   *  Checks to see if the browser is supported.
   * @param {function} options.browserNotSupportedView
   *  Backbone view that will be rendered if the browser is not supported.
   */
  registerEntryType(name, options) {
    this.entryType = {name, ...options};
  },

  createEntryModel(seed, options) {
    const entry = new this.entryType.entryModel(seed.entry, options);

    if (entry.setupFromEntryTypeSeed) {
      entry.setupFromEntryTypeSeed(seed.entry_type, state);
    }

    return entry;
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
   * See {@link #editorselectfile
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
   *   #editorregisterfileselectionhandler registerFileSelectionHandler}.
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
    return this.pageSelectionView.selectPage({...options, entry: state.entry});
  },

  createFileSelectionHandler: function(handlerName, encodedPayload) {
    if (!this.fileSelectionHandlers[handlerName]) {
      throw 'Unknown FileSelectionHandler ' + handlerName;
    }

    var payloadJson = JSON.parse(decodeURIComponent(encodedPayload));
    return new this.fileSelectionHandlers[handlerName]({...payloadJson, entry: state.entry});
  },

  createPageConfigurationEditorView: function(page, options) {
    var view = this.pageTypes
                   .findByPage(page)
                   .createConfigurationEditorView(_.extend(options, {
                     model: page.configuration
                   }));

    this.commonPageConfigurationTabs.apply(view);
    return view;
  },

  ensureBrowserSupport: function(start) {
    if (this.entryType.isBrowserSupported) {
      const isBrowserSupported = this.entryType.isBrowserSupported();
  
      if (isBrowserSupported) {
          start();
      }
      else {
          const browserNotSupportedView = new this.entryType.browserNotSupportedView();
          app.mainRegion.show(browserNotSupportedView);
      }
    }
    else {
      start();
    }

  }
});
