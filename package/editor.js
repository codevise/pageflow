import Backbone from 'backbone';
import _ from 'underscore';
import { Object as Object$1, ConfigurationEditorView, TabsView, TextInputView, CollectionView, tooltipContainer, inputView, SelectInputView, TextAreaInputView, SeparatorView, CheckBoxGroupInputView, i18nUtils, ConfigurationEditorTabView, FileNameInputView, UrlDisplayView, TableView, TextTableCellView, PresenceTableCellView, SortableCollectionView, attributeBinding, UrlInputView, DeleteRowTableCellView, CheckBoxInputView, SliderInputView, IconTableCellView } from 'pageflow/ui';
export * from 'pageflow/ui';
import Cocktail from 'cocktail';
import I18n$1 from 'i18n-js';
import Marionette from 'backbone.marionette';
import $ from 'jquery';
import { browser, features, Audio, events } from 'pageflow/frontend';
import { autoUpdate, computePosition, offset, shift, size, arrow } from '@floating-ui/dom';
import 'jquery-ui';

(function () {
  var sync = Backbone.sync;
  Backbone.sync = function (method, model, options) {
    if (model.paramRoot && !options.attrs) {
      options.attrs = options.queryParams || {};
      options.attrs[model.paramRoot] = model.toJSON(options);
    }
    return sync(method, model, options);
  };
})();

const CommonPageConfigurationTabs = Object$1.extend({
  initialize: function () {
    this.configureFns = {};
  },
  register: function (name, configureFn) {
    this.configureFns[name] = configureFn;
  },
  apply: function (configurationEditorView) {
    _.each(this.configureFns, function (configureFn, name) {
      configurationEditorView.tab(name, function () {
        configureFn.call(prefixInputDecorator(name, this));
      });
    });
    function prefixInputDecorator(name, dsl) {
      return {
        input: function (propertyName, view, options) {
          return dsl.input(name + '_' + propertyName, view, options);
        }
      };
    }
  }
});

const DropDownMenuItems = Object$1.extend({
  initialize: function () {
    this.menuItems = {};
  },
  register: function (menuItem, {
    menuName
  }) {
    this.menuItems[menuName] = this.menuItems[menuName] || [];
    this.menuItems[menuName].push(menuItem);
  },
  findAllByMenuName: function (menuName) {
    return this.menuItems[menuName] || [];
  }
});

/**
 * Failure and subclasses are used in the failures api.
 *
 * Subclasses that represent failures that are can not be retried should
 * override `catRetry` with false.
 * Retryable failures should implement `retryAction`.
 *
 * @class
 */
const Failure = Object$1.extend({
  canRetry: true,
  type: 'Failure',
  initialize: function (model) {
    this.model = model;
  },
  retry: function () {
    if (this.canRetry) {
      return this.retryAction();
    }
  },
  retryAction: function () {
    return this.model.save();
  },
  key: function () {
    return this.model.cid + '-' + this.type;
  }
});
const SavingFailure = Failure.extend({
  type: 'SavingFailure'
});
const OrderingFailure = Failure.extend({
  type: 'OrderingFailure',
  initialize: function (model, collection) {
    Failure.prototype.initialize.call(this, model);
    this.collection = collection;
  },
  retryAction: function () {
    return this.collection.saveOrder();
  }
});

/**
 * API to allow access to failure UI and recovery.
 *
 * Can watch collections for errors saving models and display the error
 * allong with a retry button.
 *
 *     editor.failures.watch(collection);
 *
 * It's possible to add failures to the UI by adding instances of subclasses of Failure:
 *
 *     editor.failures.add(new OrderingFailure(model, collection));
 *
 * @alias Failures
 */
const FailuresAPI = Object$1.extend( /** @lends Failures.prototype */{
  initialize: function () {
    this.failures = {};
    this.length = 0;
  },
  /**
   * Listen to the `error` and `sync` events of a collection and
   * create failure objects.
   */
  watch: function (collection) {
    this.listenTo(collection, 'sync', this.remove);
    this.listenTo(collection, 'error', function (model) {
      if (!model.isNew()) {
        this.add(new SavingFailure(model));
      }
    });
  },
  retry: function () {
    _.each(this.failures, function (failure, key) {
      this.remove(key);
      failure.retry();
    }, this);
  },
  isEmpty: function () {
    return _.size(this.failures) === 0;
  },
  /**
   * Record that a failure occured.
   *
   * @param {Failure} failure
   * The failure object to add.
   */
  add: function (failure) {
    this.failures[failure.key()] = failure;
    this.length = _.size(this.failures);
  },
  remove: function (key) {
    delete this.failures[key];
    this.length = _.size(this.failures);
  },
  count: function () {
    return this.length;
  }
});
_.extend(FailuresAPI.prototype, Backbone.Events);

const UploadError = Object$1.extend({
  setMessage: function (options) {
    this.upload = options.upload;
    var typeTranslation;
    if (options.typeTranslation) {
      typeTranslation = options.typeTranslation;
    } else if (this.upload.type !== '') {
      typeTranslation = this.upload.type;
    } else {
      typeTranslation = I18n$1.t('pageflow.editor.errors.upload.type_empty');
    }
    var interpolations = {
      name: this.upload.name,
      type: typeTranslation,
      validList: options.validList
    };
    this.message = I18n$1.t(options.translationKey, interpolations);
  }
});
const UnmatchedUploadError = UploadError.extend({
  name: 'UnmatchedUploadError',
  initialize: function (upload) {
    this.setMessage({
      upload: upload,
      translationKey: 'pageflow.editor.errors.unmatched_upload_error'
    });
  }
});
const validFileTypeTranslationList = {
  validFileTypeTranslations: function (validFileTypes) {
    return validFileTypes.map(function (validFileType) {
      return I18n$1.t('activerecord.models.' + validFileType.i18nKey + '.other');
    }).join(', ');
  }
};
const NestedTypeError = UploadError.extend({
  name: 'NestedTypeError',
  initialize: function (upload, options) {
    var fileType = options.fileType;
    var fileTypes = options.fileTypes;
    var validParentFileTypes = fileTypes.filter(function (parentFileType) {
      return parentFileType.nestedFileTypes.contains(fileType);
    });
    var validParentFileTypeTranslations = this.validFileTypeTranslations(validParentFileTypes);
    var typeI18nKey = fileTypes.findByUpload(upload).i18nKey;
    var typePluralTranslation = I18n$1.t('activerecord.models.' + typeI18nKey + '.other');
    this.setMessage({
      upload: upload,
      translationKey: 'pageflow.editor.errors.nested_type_error',
      typeTranslation: typePluralTranslation,
      validList: validParentFileTypeTranslations
    });
  }
});
Cocktail.mixin(NestedTypeError, validFileTypeTranslationList);
const InvalidNestedTypeError = UploadError.extend({
  name: 'InvalidNestedTypeError',
  initialize: function (upload, options) {
    var editor = options.editor;
    var fileType = options.fileType;
    var validFileTypes = editor.nextUploadTargetFile.fileType().nestedFileTypes;
    var validFileTypeTranslations = this.validFileTypeTranslations(validFileTypes);
    var typeI18nKey = fileType.i18nKey;
    var typeSingularTranslation = I18n$1.t('activerecord.models.' + typeI18nKey + '.one');
    this.setMessage({
      upload: upload,
      translationKey: 'pageflow.editor.errors.invalid_nested_type_error',
      typeTranslation: typeSingularTranslation,
      validList: validFileTypeTranslations
    });
  }
});
Cocktail.mixin(InvalidNestedTypeError, validFileTypeTranslationList);

const FileTypesCollection = Object$1.extend({
  initialize: function (fileTypes) {
    this._fileTypes = fileTypes;
  },
  findByUpload: function (upload) {
    var result = this.find(function (fileType) {
      return fileType.matchUpload(upload);
    });
    if (!result) {
      throw new UnmatchedUploadError(upload);
    }
    return result;
  },
  findByCollectionName: function (collectionName) {
    var result = this.find(function (fileType) {
      return fileType.collectionName === collectionName;
    });
    if (!result) {
      throw 'Could not find file type by collection name "' + collectionName + '"';
    }
    return result;
  }
});
_.each(['each', 'map', 'reduce', 'first', 'find', 'contains', 'filter'], function (method) {
  FileTypesCollection.prototype[method] = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this._fileTypes);
    return _[method].apply(_, args);
  };
});

// Renders the image which files point at via
// `getBackgroundPositioningImageUrl`. Used for all file types which do
// not bring a positioning view of their own.
const BackgroundPositioningImageView = Marionette.ItemView.extend({
  tagName: 'img',
  template: () => '',
  className: function () {
    return 'background_positioning-image-' + this.options.fit;
  },
  onRender: function () {
    this.$el.attr('src', this.model.getBackgroundPositioningImageUrl());
  },
  setPosition: function (x, y) {
    this.$el.css('object-position', x + '% ' + y + '%');
  }
});

const FileType = Object$1.extend({
  initialize: function (options) {
    this.model = options.model;
    this.typeName = options.typeName;
    this.collectionName = options.collectionName;
    this.topLevelType = options.topLevelType;
    this.paramKey = options.paramKey;
    this.i18nKey = options.i18nKey;
    this.nestedFileTypes = [];
    this.settingsDialogTabs = options.settingsDialogTabs || [];
    this.confirmUploadTableColumns = options.confirmUploadTableColumns || [];
    this.configurationEditorInputs = [].concat(options.configurationEditorInputs || []);
    this.configurationUpdaters = options.configurationUpdaters || [];
    this.nestedFileTableColumns = options.nestedFileTableColumns || [];
    this.nestedFilesOrder = options.nestedFilesOrder;
    this.skipUploadConfirmation = options.skipUploadConfirmation || false;
    this.filters = options.filters || [];
    this.noExtendedFileRights = options.noExtendedFileRights;
    this.metaDataAttributes = options.metaDataAttributes || [];
    this.previewView = options.previewView;
    this.thumbnailView = options.thumbnailView;
    this.positioningView = options.positioningView || BackgroundPositioningImageView;
    if (typeof options.matchUpload === 'function') {
      this.matchUpload = options.matchUpload;
    } else if (options.matchUpload instanceof RegExp) {
      this.matchUpload = function (upload) {
        return upload.type.match(options.matchUpload);
      };
    } else {
      throw 'matchUpload option of FileType "' + this.collectionName + '" must either be a function or a RegExp.';
    }
    this.setupModelNaming();
  },
  setupModelNaming: function () {
    this.model.prototype.modelName = this.model.prototype.modelName || this.paramKey;
    this.model.prototype.paramRoot = this.model.prototype.paramRoot || this.paramKey;
    this.model.prototype.i18nKey = this.model.prototype.i18nKey || this.i18nKey;
  },
  setNestedFileTypes: function (fileTypesCollection) {
    this.nestedFileTypes = fileTypesCollection;
  },
  getFilter: function (name) {
    var result = _(this.filters).find(function (filter) {
      return filter.name === name;
    });
    if (!result) {
      throw new Error('Unknown filter "' + name + '" for file type "' + this.collectionName + '".');
    }
    return result;
  }
});

const FileTypes = Object$1.extend({
  modifyableProperties: ['configurationEditorInputs', 'configurationUpdaters', 'confirmUploadTableColumns', 'filters'],
  initialize: function () {
    this.clientSideConfigs = [];
    this.clientSideConfigModifications = {};
    this.commonSettingsDialogTabs = [];
    this.commonMetaDataAttributes = [];
  },
  register: function (name, config) {
    if (this._setup) {
      throw 'File types already set up. Register file types before initializers run.';
    }
    this.clientSideConfigs[name] = config;
  },
  modify: function (name, config) {
    if (this._setup) {
      throw 'File types already set up. Modify file types before initializers run.';
    }
    this.clientSideConfigModifications[name] = this.clientSideConfigModifications[name] || [];
    this.clientSideConfigModifications[name].push(config);
  },
  setup: function (serverSideConfigs) {
    var clientSideConfigs = this.clientSideConfigs;
    this._setup = true;
    var configs = _.chain(serverSideConfigs).map(serverSideConfig => {
      var clientSideConfig = clientSideConfigs[serverSideConfig.collectionName];
      if (!clientSideConfig) {
        throw 'Missing client side config for file type "' + serverSideConfig.collectionName + '"';
      }
      this.applyCommonConfig(clientSideConfig);
      this.applyModifications(serverSideConfig, clientSideConfig);
      return _.extend({}, serverSideConfig, clientSideConfig);
    }).sortBy(config => config.priority || 10).value();
    this.collection = new FileTypesCollection(_.map(configs, config => new FileType(config)));
    var those = this;
    _.map(serverSideConfigs, function (serverSideConfig) {
      var fileType = those.findByCollectionName(serverSideConfig.collectionName);
      fileType.setNestedFileTypes(new FileTypesCollection(_.map(serverSideConfig.nestedFileTypes, function (nestedFileType) {
        return those.findByCollectionName(nestedFileType.collectionName);
      })));
    });
  },
  applyCommonConfig(clientSideConfig) {
    clientSideConfig.settingsDialogTabs = this.commonSettingsDialogTabs.concat(clientSideConfig.settingsDialogTabs || []);
    clientSideConfig.metaDataAttributes = this.commonMetaDataAttributes.concat(clientSideConfig.metaDataAttributes || []);
  },
  applyModifications(serverSideConfig, clientSideConfig) {
    _(this.clientSideConfigModifications[serverSideConfig.collectionName]).each(function (modification) {
      this.lintModification(modification, serverSideConfig.collectionName);
      this.applyModification(clientSideConfig, modification);
    }, this);
  },
  lintModification: function (modification, collectionName) {
    var unmodifyableProperties = _.difference(_.keys(modification), this.modifyableProperties);
    if (unmodifyableProperties.length) {
      throw 'Only the following properties are allowed in FileTypes#modify: ' + this.modifyableProperties.join(', ') + '. Given in modification for ' + collectionName + ': ' + unmodifyableProperties.join(', ') + '.';
    }
  },
  applyModification: function (target, modification) {
    _(this.modifyableProperties).each(function (property) {
      target[property] = (target[property] || []).concat(modification[property] || []);
    });
  }
});
_.each(['each', 'map', 'reduce', 'first', 'find', 'findByUpload', 'findByCollectionName', 'contains', 'filter'], function (method) {
  FileTypes.prototype[method] = function () {
    if (!this._setup) {
      throw 'File types are not yet set up.';
    }
    return this.collection[method].apply(this.collection, arguments);
  };
});

const FileImporters = Object$1.extend({
  initialize: function () {
    this.importers = {};
  },
  register: function (name, config) {
    if (this._setup) {
      throw 'File importers setup is already finished. Register file importers before setup is finished';
    }
    this.importers[name] = config;
    config.key = name;
  },
  setup: function (serverSideConfigs) {
    this._setup = true;
    let registeredImporters = this.importers;
    let importers = {};
    serverSideConfigs.forEach(function (importer) {
      let regImporter = registeredImporters[importer.importerName];
      regImporter['authenticationRequired'] = importer.authenticationRequired;
      regImporter['authenticationProvider'] = importer.authenticationProvider;
      regImporter['logoSource'] = importer.logoSource;
      importers[importer.importerName] = regImporter;
    });
    this.importers = importers;
  },
  find: function (name) {
    if (!this.importers[name]) {
      throw 'Could not find file importer with name "' + name + '"';
    }
    return this.importers[name];
  },
  keys: function () {
    return _.keys(this.importers);
  },
  values: function () {
    return _.values(this.importers);
  }
});

const PageLinkConfigurationEditorView = ConfigurationEditorView.extend({
  configure: function () {
    this.tab('general', function () {
      this.group('page_link');
    });
  }
});

const PageType = Object$1.extend({
  initialize: function (name, options, seed) {
    this.name = name;
    this.options = options;
    this.seed = seed;
  },
  translationKey: function () {
    return this.seed.translation_key;
  },
  thumbnailCandidates: function () {
    return this.seed.thumbnail_candidates;
  },
  pageLinks: function (configuration) {
    if ('pageLinks' in this.options) {
      return this.options.pageLinks(configuration);
    }
  },
  configurationEditorView: function () {
    return this.options.configurationEditorView || ConfigurationEditorView.repository[this.name];
  },
  embeddedViews: function () {
    return this.options.embeddedViews;
  },
  createConfigurationEditorView: function (options) {
    var constructor = this.configurationEditorView();
    options.pageType = this.seed;
    return new constructor(_.extend({
      tabTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_configuration_tabs', 'pageflow.common_page_configuration_tabs'],
      attributeTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_attributes', 'pageflow.common_page_attributes']
    }, options));
  },
  createPageLinkConfigurationEditorView: function (options) {
    var constructor = this.options.pageLinkConfigurationEditorView || PageLinkConfigurationEditorView;
    return new constructor(_.extend({
      tabTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_link_configuration_tabs', 'pageflow.common_page_link_configuration_tabs'],
      attributeTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_link_attributes', 'pageflow.common_page_link_attributes']
    }, options));
  },
  supportsPhoneEmulation: function () {
    return !!this.options.supportsPhoneEmulation;
  }
});

const PageTypes = Object$1.extend({
  initialize: function () {
    this.clientSideConfigs = {};
  },
  register: function (name, config) {
    if (this._setup) {
      throw 'Page types already set up. Register page types before initializers run.';
    }
    this.clientSideConfigs[name] = config;
  },
  setup: function (serverSideConfigs) {
    var clientSideConfigs = this.clientSideConfigs;
    this._setup = true;
    this.pageTypes = _.map(serverSideConfigs, function (serverSideConfig) {
      var clientSideConfig = clientSideConfigs[serverSideConfig.name] || {};
      return new PageType(serverSideConfig.name, clientSideConfig, serverSideConfig);
    });
  },
  findByName: function (name) {
    var result = this.find(function (pageType) {
      return pageType.name === name;
    });
    if (!result) {
      throw 'Could not find page type with name "' + name + '"';
    }
    return result;
  },
  findByPage: function (page) {
    return this.findByName(page.get('template'));
  }
});
_.each(['each', 'map', 'reduce', 'first', 'find', 'pluck'], function (method) {
  PageTypes.prototype[method] = function () {
    if (!this._setup) {
      throw 'Page types are not yet set up.';
    }
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.pageTypes);
    return _[method].apply(_, args);
  };
});

// A partial implementation of a collection that can store records of
// different model types.  Backbone.Collection tries to merge records
// if they have the same id.
const MultiCollection = function () {
  this.records = {};
  this.length = 0;
};
_.extend(MultiCollection.prototype, {
  add: function (record) {
    if (!this.records[record.cid]) {
      this.records[record.cid] = record;
      this.length = _.keys(this.records).length;
      this.trigger('add', record);
    }
  },
  remove: function (record) {
    if (this.records[record.cid]) {
      delete this.records[record.cid];
      this.length = _.keys(this.records).length;
      this.trigger('remove', record);
    }
  },
  isEmpty: function () {
    return this.length === 0;
  }
});
_.extend(MultiCollection.prototype, Backbone.Events);
MultiCollection.extend = Backbone.Collection.extend;

/**
 * Watch Backbone collections to track which models are currently
 * being saved. Used to update the notifications view displaying
 * saving status/failutes.
 */
const SavingRecordsCollection = MultiCollection.extend({
  /**
   * Listen to events of models in collection to track when they are
   * being saved.
   *
   * @param {Backbone.Collection} collection - Collection to watch.
   */
  watch: function (collection) {
    var that = this;
    this.listenTo(collection, 'request', function (model, xhr) {
      that.add(model);
      xhr.always(function () {
        that.remove(model);
      });
    });
  }
});

const WidgetType = Object$1.extend({
  initialize: function (serverSideConfig, clientSideConfig) {
    this.name = serverSideConfig.name;
    this.translationKey = serverSideConfig.translationKey;
    this.insertPoint = serverSideConfig.insertPoint;
    this.enabledInEditor = serverSideConfig.enabledInEditor !== false;
    this.configurationEditorView = clientSideConfig.configurationEditorView;
    this.configurationEditorTabViewGroups = clientSideConfig.configurationEditorTabViewGroups || {};
    this.isOptional = clientSideConfig.isOptional;
  },
  hasConfiguration: function () {
    return !!this.configurationEditorView;
  },
  createConfigurationEditorView: function (options) {
    var constructor = this.configurationEditorView;
    return new constructor(_.extend({
      attributeTranslationKeyPrefixes: ['pageflow.editor.widgets.attributes.' + this.name, 'pageflow.editor.widgets.common_attributes']
    }, options));
  },
  defineStubConfigurationEditorTabViewGroups(groups) {
    _.each(this.configurationEditorTabViewGroups, (fn, name) => groups.define(name, () => {}));
  },
  defineConfigurationEditorTabViewGroups(groups) {
    _.each(this.configurationEditorTabViewGroups, (fn, name) => groups.define(name, fn));
  }
});

const WidgetTypes = Object$1.extend({
  initialize: function () {
    this._clientSideConfigs = {};
    this._optionalRoles = {};
  },
  register: function (name, config) {
    if (this._setup) {
      throw 'Widget types already set up. Register widget types before initializers run.';
    }
    this._clientSideConfigs[name] = config;
  },
  setup: function (serverSideConfigsByRole) {
    this._setup = true;
    this._widgetTypesByName = {};
    var roles = _.keys(serverSideConfigsByRole);
    this._widgetTypesByRole = roles.reduce(_.bind(function (result, role) {
      result[role] = serverSideConfigsByRole[role].map(_.bind(function (serverSideConfig) {
        var clientSideConfig = this._clientSideConfigs[serverSideConfig.name] || {};
        var widgetType = new WidgetType(serverSideConfig, clientSideConfig);
        this._widgetTypesByName[serverSideConfig.name] = widgetType;
        return widgetType;
      }, this));
      return result;
    }, this), {});
  },
  findAllByRole: function (role) {
    return this._widgetTypesByRole[role] || [];
  },
  findByName: function (name) {
    if (!this._widgetTypesByName[name]) {
      throw 'Could not find widget type with name "' + name + '"';
    }
    return this._widgetTypesByName[name];
  },
  registerRole: function (role, options) {
    this._optionalRoles[role] = options.isOptional;
  },
  isOptional: function (role) {
    return !!this._optionalRoles[role];
  },
  defineStubConfigurationEditorTabViewGroups(groups) {
    _.each(this._widgetTypesByName, widgetType => widgetType.defineStubConfigurationEditorTabViewGroups(groups));
  }
});

const app = new Marionette.Application();

// The payload needs to be passed as JSON string since that is the form
// it arrives in when the sidebar route is parsed.
function filesPath({
  collectionName,
  folderPermaId,
  handler,
  payload,
  filterName
} = {}) {
  let path = '/files';
  if (collectionName) {
    path += '/' + collectionName;
  }
  if (folderPermaId) {
    path += '/folders/' + folderPermaId;
  }
  if (!handler) {
    return path;
  }
  return path + '?handler=' + handler + '&payload=' + encodeURIComponent(payload) + (filterName ? '&filter=' + filterName : '');
}

const state = window.pageflow || {};

/**
 * Interface for engines providing editor extensions.
 * @alias editor
 */
const EditorApi = Object$1.extend( /** @lends editor */{
  initialize: function (options) {
    this.router = options && options.router;
    this.entryType = {};
    this.sideBarRoutings = [];
    this.mainMenuItems = [];
    this.initializers = [];
    this.fileSelectionHandlers = {};
    this.appearanceInputsCallbacks = [];

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

    /**
     * List of additional menu items for dropdown menus
     * @memberof editor
     */
    this.dropDownMenuItems = new DropDownMenuItems();
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
   * @param {boolean} [options.supportsExtendedFileRights]
   *  Offer additional inputs for files to specify source url, license and default
   *  display location.
   */
  registerEntryType(name, options) {
    this.entryType = {
      name,
      ...options
    };
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
  showViewInMainPanel: function (view) {
    app.mainRegion.show(view);
  },
  /**
   *  Display the Pageflow-Preview inside the main panel.
   */
  showPreview: function () {
    app.mainRegion.$el.empty();
  },
  /**
   * Register additional router and controller for sidebar.
   *
   * Supported options:
   * - router: constructor function of Backbone Marionette app router
   * - controller: constructor function of Backbone Marionette controller
   */
  registerSideBarRouting: function (options) {
    this.sideBarRoutings.push(options);
  },
  /**
   * Set the file that is the parent of nested files when they are
   * uploaded. This value is automatically set and unset upon
   * navigating towards the appropriate views.
   */
  setUploadTargetFile: function (file) {
    this.nextUploadTargetFile = file;
  },
  /**
   * Set the folder that top level files are placed in when they are
   * uploaded. This value is automatically set and unset upon navigating
   * towards the appropriate views.
   */
  setUploadFolder: function (folder) {
    this.nextUploadFolder = folder;
  },
  /**
   * Set the name of the help entry that shall be selected by
   * default when the help view is opened. This value is
   * automatically reset when navigation occurs.
   */
  setDefaultHelpEntry: function (name) {
    this.nextDefaultHelpEntry = name;
  },
  applyDefaultHelpEntry: function (name) {
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
   * - indicatorAttribute: name of an entry attribute. While it is
   *   truthy, the item displays an indicator dot.
   */
  registerMainMenuItem: function (options) {
    this.mainMenuItems.push(options);
  },
  /**
   * Register additional inputs to show in the appearance tab under
   * title and options. Passed callback receives tabView and options
   * with entry.
   *
   * @since 17.1
   */
  registerAppearanceInputs(callback) {
    this.appearanceInputsCallbacks.push(callback);
  },
  /**
   * Register a custom initializer which will be run before the boot
   * initializer of the editor.
   */
  addInitializer: function (fn) {
    this.initializers.push(fn);
  },
  /**
   * Navigate to the given path.
   */
  navigate: function (path, options) {
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
  registerPageConfigurationMixin: function (mixin) {
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
  registerFileSelectionHandler: function (name, handler) {
    this.fileSelectionHandlers[name] = handler;
  },
  /**
   * Trigger selection of the given file type with the given
   * handler. Payload hash is passed to selection handler as options.
   *
   * @param {string|{name: string, filter: string}|{defaultTab: string, filter: string}} fileType
   *   Either collection name of a file type or and object containing
   *   the collection name a file type and a the name of a file type
   *   filter or an object containingn a defaultTab property that
   *   preselects that file type, while allowing selecting files of any
   *   type. Pass null to allow selecting files of any type without
   *   preselecting one.
   *
   * @param {string} handlerName
   *   The name of a handler registered via {@link
   *   #editorregisterfileselectionhandler registerFileSelectionHandler}.
   *
   * @param {Object} payload
   *   Options passed to the file selection handler. A `label` property
   *   is used by the files list to say what the file will be used for.
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
  selectFile: function (fileType, handlerName, payload) {
    if (typeof fileType === 'string') {
      fileType = {
        name: fileType
      };
    }
    fileType = fileType || {};
    this.navigate(filesPath({
      collectionName: filesPathCollectionName(fileType),
      handler: handlerName,
      payload: JSON.stringify(payload),
      filterName: fileType.filter
    }), {
      trigger: true
    });
  },
  /**
   * Returns a promise which resolves to a page selected by the
   * user.
   *
   * Supported options:
   * - isAllowed: function which given a page returns true or false depending on
   *   whether the page is a valid selection
   */
  selectPage: function (options) {
    return this.pageSelectionView.selectPage({
      ...options,
      entry: state.entry
    });
  },
  createFileSelectionHandler: function (handlerName, encodedPayload) {
    if (!this.fileSelectionHandlers[handlerName]) {
      throw 'Unknown FileSelectionHandler ' + handlerName;
    }
    var payloadJson = JSON.parse(decodeURIComponent(encodedPayload));
    var handler = new this.fileSelectionHandlers[handlerName]({
      ...payloadJson,
      entry: state.entry
    });

    // Lets the files list name what is being selected. Handlers are
    // free to provide a label of their own.
    handler.selectionLabel = handler.selectionLabel || payloadJson.label;
    return handler;
  },
  createPageConfigurationEditorView: function (page, options) {
    var view = this.pageTypes.findByPage(page).createConfigurationEditorView(_.extend(options, {
      model: page.configuration
    }));
    this.commonPageConfigurationTabs.apply(view);
    return view;
  },
  ensureBrowserSupport: function (start) {
    if (this.entryType.isBrowserSupported) {
      const isBrowserSupported = this.entryType.isBrowserSupported();
      if (isBrowserSupported) {
        start();
      } else {
        const browserNotSupportedView = new this.entryType.browserNotSupportedView();
        app.mainRegion.show(browserNotSupportedView);
      }
    } else {
      start();
    }
  }
});
function filesPathCollectionName(fileType) {
  if (fileType.defaultTab) {
    return fileType.defaultTab + ':default';
  }
  return fileType.name;
}

const dialogView = {
  events: {
    'mousedown': function (event) {
      if (!event.target.closest(`.box`)) {
        this.close();
      }
    },
    'click .close': function () {
      this.close();
    },
    'click .box': function () {
      return false;
    }
  }
};

function template(data) {
var __t, __p = '';
__p += '<div class="box">\n  <div class="content">\n    <h1 class="dialog-header"></h1>\n  </div>\n\n  <div class="footer">\n    <a href="" class="close">\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.file_settings_dialog.close') )) == null ? '' : __t) +
'\n    </a>\n  </div>\n</div>\n';
return __p
}

const FileSettingsDialogView = Marionette.ItemView.extend({
  template,
  className: 'file_settings_dialog editor dialog',
  mixins: [dialogView],
  ui: {
    content: '.content',
    header: '.dialog-header'
  },
  onRender: function () {
    this.ui.header.text(this.model.title());
    this.tabsView = new TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.settings_dialog_tabs',
      defaultTab: this.options.tabName
    });
    _.each(this.model.fileType().settingsDialogTabs, function (options) {
      this.tabsView.tab(options.name, _.bind(function () {
        return this.subview(new options.view(_.extend({
          model: this.model
        }, options.viewOptions)));
      }, this));
    }, this);
    this.ui.content.append(this.subview(this.tabsView).el);
  }
});
FileSettingsDialogView.open = function (options) {
  app.dialogRegion.show(new FileSettingsDialogView(options));
};

function template$1(data) {
var __t, __p = '';
__p += '<span class="value"></span>\n<button class="edit" type="button" title="' +
((__t = ( I18n.t('pageflow.editor.templates.file_meta_data_item_value_view.edit') )) == null ? '' : __t) +
'">\n</button>\n\n';
return __p
}

/**
 * Base class for views used as `valueView` for file type meta data
 * attributes.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.name]
 *   Name of the meta data item used in translation keys.
 *
 * @param {string} [options.settingsDialogTabLink]
 *   Dispaly a link to open the specified tab of the file settings
 *   dialog.
 *
 * @since 12.0
 *
 * @class
 */
const FileMetaDataItemValueView = Marionette.ItemView.extend({
  template: template$1,
  className: 'value_wrapper',
  ui: {
    value: '.value',
    editLink: '.edit'
  },
  events: {
    'click .edit': function () {
      FileSettingsDialogView.open({
        model: this.model,
        tabName: this.options.settingsDialogTabLink
      });
    }
  },
  modelEvents: {
    'change': 'toggleEditLink'
  },
  onRender: function () {
    this.listenTo(this.model, 'change:' + this.options.name, this.update);
    this.toggleEditLink();
    this.update();
  },
  update: function () {
    this.ui.value.text(this.getText() || I18n$1.t('pageflow.editor.views.file_meta_data_item_value_view.blank'));
  },
  getText: function () {
    throw new Error('Not implemented');
  },
  toggleEditLink: function () {
    this.ui.editLink.toggle(!!this.options.settingsDialogTabLink && !this.model.isNew());
  }
});

const TextFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
  getText: function () {
    var model;
    if (this.options.fromConfiguration) {
      model = this.model.configuration;
    } else {
      model = this.model;
    }
    const value = model.get(this.options.name);
    if (value && this.options.formatValue) {
      return this.options.formatValue(value);
    }
    return value;
  }
});

const altMetaDataAttribute = {
  name: 'alt',
  valueView: TextFileMetaDataItemValueView,
  valueViewOptions: {
    fromConfiguration: true,
    settingsDialogTabLink: 'general'
  }
};
const altConfigurationEditorInput = {
  name: 'alt',
  inputView: TextInputView,
  inputViewOptions: {
    maxLength: 5000
  }
};

// The i18n-js JS lib shipped by the i18n-js Ruby gem (Sprockets) is an
// old version whose fallback only tries defaultLocale; it never walks
// parent locales. Patch lookup so e.g. `de-CH` falls back via `de` to
// defaultLocale. The Webpack-bundled I18n (npm i18n-js) does this
// natively when I18n.fallbacks is true.
function patchSprocketsI18nForParentLocaleFallback(I18n) {
  const originalLookup = I18n.lookup;
  I18n.lookup = function (scope, options) {
    options = options || {};
    if (!I18n.fallbacks || options.fallback) {
      return originalLookup.call(I18n, scope, options);
    }
    const candidates = parentLocaleChain(options.locale || I18n.currentLocale(), I18n.defaultLocale);
    for (const candidate of candidates) {
      const result = originalLookup.call(I18n, scope, I18n.prepareOptions({
        locale: candidate,
        fallback: true
      }, options));
      if (result !== undefined) return result;
    }
    return I18n.isValidNode(options, 'defaultValue') ? options.defaultValue : undefined;
  };
}
function parentLocaleChain(locale, defaultLocale) {
  const chain = [];
  const parts = String(locale).split('-');
  while (parts.length > 0) {
    chain.push(parts.join('-'));
    parts.pop();
  }
  if (!chain.includes(defaultLocale)) chain.push(defaultLocale);
  return chain;
}

const editor = new EditorApi();
const startEditor = function (options) {
  // In Webpack builds, I18n object from the i18n-js module is not
  // identical to window.I18n which is provided by the i18n-js gem via
  // the asset pipeline. Make translations provided via the asset
  // pipeline available in Webpack bundle.
  I18n$1.defaultLocale = window.I18n.defaultLocale;
  I18n$1.locale = window.I18n.locale;
  I18n$1.translations = window.I18n.translations;
  I18n$1.fallbacks = window.I18n.fallbacks;
  patchSprocketsI18nForParentLocaleFallback(window.I18n);
  $(function () {
    editor.ensureBrowserSupport(() => {
      Promise.all([$.getJSON('/editor/entries/' + options.entryId + '/seed'), browser.detectFeatures()]).then(result => app.start(result[0]), () => alert('Error while starting editor.'));
    });
  });
};

/**
 * Mixins for Backbone models and collections that use entry type
 * specific editor controllers registered via the `editor_app` entry
 * type option.
 */
const entryTypeEditorControllerUrls = {
  /**
   * Mixins for Backbone collections that defines `url` method.
   *
   * @param {Object} options
   * @param {String} options.resources - Path suffix of the controller route
   *
   * @example
   *
   * import {editor, entryTypeEditorControllerUrls} from 'pageflow/editor';
   *
   * editor.registerEntryType('test', {
       // ...
     });
   *
   * export const ItemsCollection = Backbone.Collection.extend({
   *   mixins: [entryTypeEditorControllerUrls.forCollection({resources: 'items'})
   * });
   *
   * new ItemsCollection().url() // => '/editor/entries/10/test/items'
   */
  forCollection({
    resources
  }) {
    return {
      url() {
        return entryTypeEditorControllerUrl(resources);
      },
      urlSuffix() {
        return `/${resources}`;
      }
    };
  },
  /**
   * Mixins for Backbone models that defines `urlRoot` method.
   *
   * @param {Object} options
   * @param {String} options.resources - Path suffix of the controller route
   *
   * @example
   *
   * import {editor, entryTypeEditorControllerUrls} from 'pageflow/editor';
   *
   * editor.registerEntryType('test', {
     // ...
     });
   *
   * export const Item = Backbone.Model.extend({
   *   mixins: [entryTypeEditorControllerUrls.forModel({resources: 'items'})
   * });
   *
   * new Item({id: 20}).url() // => '/editor/entries/10/test/items/20'
   */
  forModel({
    resources
  }) {
    return {
      urlRoot: function () {
        return this.isNew() ? this.collection.url() : entryTypeEditorControllerUrl(resources);
      }
    };
  }
};
function entryTypeEditorControllerUrl(resources) {
  return [state.entry.url(), editor.entryType.name, resources].join('/');
}

// Accessing local storage throws in some browser configurations.
function getLocalStorage() {
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

const formDataUtils = {
  fromModel: function (model) {
    var object = {};
    object[model.modelName] = model.toJSON();
    return this.fromObject(object);
  },
  fromObject: function (object) {
    var queryString = $.param(object).replace(/\+/g, '%20');
    return _(queryString.split('&')).reduce(function (result, param) {
      var pair = param.split('=');
      result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      return result;
    }, {});
  }
};

const stylesheet = {
  reload: function (name) {
    var link = this.selectLink(name);
    if (!link.data('originalHref')) {
      link.data('originalHref', link.attr('href'));
    }
    link.attr('href', link.data('originalHref') + '&reload=' + new Date().getTime());
  },
  update: function (name, stylesheetPath) {
    var link = this.selectLink(name);
    if (link.attr('href') !== stylesheetPath) {
      link.attr('href', stylesheetPath);
    }
  },
  selectLink: function (name) {
    return $('head link[data-name=' + name + ']');
  }
};

// Backbone indexes models by id. Since files of different types can
// share ids, collections that combine file types would treat files as
// duplicates of each other and silently drop them. Looking models up by
// cid keeps them apart. Lookups by plain id remain ambiguous in such
// collections.
function cidBasedGet(obj) {
  if (obj && obj.cid) {
    return this._byId[obj.cid];
  }
  return Backbone.Collection.prototype.get.call(this, obj);
}

const SubsetCollection = Backbone.Collection.extend({
  get: cidBasedGet,
  constructor: function (options) {
    var adding = false;
    var sorting = false;
    var parentSorting = false;
    options = options || {};
    this.predicate = options.filter || function (item) {
      return true;
    };
    this.parent = options.parent;
    this.parentModel = options.parentModel;
    delete options.filter;
    delete options.parent;
    this.model = this.parent.model;
    this.comparator = options.comparator || this.parent.comparator;
    this.listenTo(this.parent, 'add', function (model, collection, options) {
      if (!adding && this.predicate(model)) {
        this.add(model, options);
      }
    });
    this.listenTo(this.parent, 'remove', function (model) {
      this.remove(model);
    });
    this.listenTo(this, 'add', function (model, collection, options) {
      adding = true;
      this.parent.add(model);
      adding = false;
    });
    if (options.watchAttribute) {
      this.listenTo(this.parent, 'change:' + options.watchAttribute, function (model) {
        if (this.predicate(model)) {
          this.add(model);
        } else {
          this.remove(model);
        }
      });
    }
    if (options.sortOnParentSort) {
      this.listenTo(this.parent, 'sort', function () {
        parentSorting = true;
        if (!sorting) {
          this.sort();
        }
        parentSorting = false;
      });
    }
    this.listenTo(this, 'sort', function () {
      sorting = true;
      if (!parentSorting) {
        this.parent.sort();
      }
      sorting = false;
    });
    Backbone.Collection.prototype.constructor.call(this, this.parent.filter(this.predicate, this), options);
  },
  clear: function () {
    this.parent.remove(this.models);
    this.reset();
  },
  url: function () {
    return this.parentModel.url() + (_.result(this.parent, 'urlSuffix') || _.result(this.parent, 'url'));
  },
  dispose: function () {
    this.stopListening();
    this.reset();
  },
  updateFilter: function (predicate) {
    this.predicate = predicate || function () {
      return true;
    };
    var modelsToRemove = [];
    var modelsToAdd = [];
    this.parent.each(function (model) {
      var included = !!this.get(model);
      var shouldBeIncluded = this.predicate(model);
      if (shouldBeIncluded && !included) {
        modelsToAdd.push(model);
      }
      if (!shouldBeIncluded && included) {
        modelsToRemove.push(model);
      }
    }, this);
    if (modelsToRemove.length) {
      this.remove(modelsToRemove);
    }
    if (modelsToAdd.length) {
      this.add(modelsToAdd);
    }
    return this;
  }
});

const FilesCollection = Backbone.Collection.extend({
  initialize: function (models, options) {
    options = options || {};
    this.entry = options.entry;
    this.fileType = options.fileType;
    this.name = options.fileType.collectionName;
  },
  comparator: byFileName,
  url: function () {
    return '/editor/entries/' + this.getEntry().get('id') + '/files/' + this.name;
  },
  fetch: function (options) {
    options = _.extend({
      fileType: this.fileType
    }, options || {});
    return Backbone.Collection.prototype.fetch.call(this, options);
  },
  findOrCreateBy: function (attributes) {
    return this.findWhere(attributes) || this.create(attributes, {
      fileType: this.fileType,
      queryParams: {
        no_upload: true
      }
    });
  },
  getByPermaId: function (permaId) {
    return this.findWhere({
      perma_id: parseInt(permaId, 10)
    });
  },
  getEntry: function () {
    return this.entry || state.entry;
  },
  confirmable: function () {
    return new SubsetCollection({
      parent: this,
      watchAttribute: 'state',
      filter: function (item) {
        return item.get('state') === 'waiting_for_confirmation';
      }
    });
  },
  uploadable: function () {
    this._uploadableSubsetCollection = this._uploadableSubsetCollection || new SubsetCollection({
      parent: this,
      watchAttribute: 'state',
      filter: function (item) {
        return item.get('state') === 'uploadable';
      }
    });
    return this._uploadableSubsetCollection;
  },
  withFilter: function (filterName) {
    return new SubsetCollection({
      parent: this,
      watchAttribute: 'configuration',
      filter: this.fileType.getFilter(filterName).matches
    });
  }
});
function byFileName(file) {
  var fileName = file.get('file_name');
  return fileName && fileName.toLowerCase ? fileName.toLowerCase() : fileName;
}
FilesCollection.createForFileTypes = function (fileTypes, files, options) {
  return fileTypes.reduce(function (result, fileType) {
    result[fileType.collectionName] = FilesCollection.createForFileType(fileType, files[fileType.collectionName], options);
    return result;
  }, {});
};
FilesCollection.createForFileType = function (fileType, files, options) {
  return new FilesCollection(files, _.extend({
    fileType: fileType,
    model: fileType.model
  }, options || {}));
};

const OtherEntry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',
  initialize: function () {
    this.files = {};
  },
  getFileCollection: function (fileType) {
    if (!this.files[fileType.collectionName]) {
      this.files[fileType.collectionName] = FilesCollection.createForFileType(fileType, [], {
        entry: this
      });
    }
    return this.files[fileType.collectionName];
  },
  titleOrSlug: function () {
    return this.get('title') || this.get('slug');
  }
});

/**
 * A menu item that shows a confirmation dialog before calling a
 * destroy callback.
 *
 * @param {Object} attributes
 * @param {boolean} [attributes.separated] - Display separator above item.
 *
 * @param {Object} options
 * @param {Backbone.Model} [options.destroyedModel] - Model to destroy.
 *   Override `destroyModel` method for custom behavior.
 *
 * Set `translationKeyPrefix` to provide `destroy` and `confirm_destroy`
 * translations.
 *
 * @since edge
 */
const DestroyMenuItem = Backbone.Model.extend({
  translationKeyPrefix: 'pageflow.editor.views.destroy_menu_item',
  defaults: {
    name: 'destroy',
    destructive: true
  },
  initialize(attributes, options) {
    this.options = options || {};
    this.set('label', I18n$1.t(`${this.translationKeyPrefix}.destroy`));
    this.set('confirmMessage', I18n$1.t(`${this.translationKeyPrefix}.confirm_destroy`));
  },
  selected() {
    if (window.confirm(this.get('confirmMessage'))) {
      this.destroyModel();
    }
  },
  destroyModel() {
    var _this$options$destroy;
    (_this$options$destroy = this.options.destroyedModel) === null || _this$options$destroy === void 0 ? void 0 : _this$options$destroy.destroyWithDelay();
  }
});

const EditLock = Backbone.Model.extend({
  paramRoot: 'edit_lock',
  url: function () {
    return '/entries/' + state.entry.get('id') + '/edit_lock?timestamp=' + new Date().getTime();
  },
  toJSON: function () {
    return {
      id: this.id,
      force: this.get('force')
    };
  }
});

const transientReferences = {
  initialize: function () {
    this.transientReferences = {};
    this.pendingReferences = {};
  },
  getReference: function (attribute, collection) {
    if (typeof collection === 'string') {
      var fileType = editor.fileTypes.findByCollectionName(collection);
      collection = state.entry.getFileCollection(fileType);
    }
    return this.transientReferences[attribute] || collection.getByPermaId(this.get(attribute));
  },
  setReference: function (attribute, record) {
    this._cleanUpReference(attribute);
    this._setReference(attribute, record);
    this._listenForReady(attribute, record);
  },
  unsetReference: function (attribute) {
    this._cleanUpReference(attribute);
    this.set(attribute, null);
  },
  _setReference: function (attribute, record) {
    if (record.isNew()) {
      this.transientReferences[attribute] = record;
      this.set(attribute, null);
      this._setPermaIdOnceSynced(attribute, record);
    } else {
      this.set(attribute, record.get('perma_id'));
    }
  },
  _setPermaIdOnceSynced: function (attribute, record) {
    record.once('change:perma_id', function () {
      this._onceRecordCanBeFoundInCollection(record, function () {
        delete this.transientReferences[attribute];
        this.set(attribute, record.get('perma_id'));
      });
    }, this);
  },
  _onceRecordCanBeFoundInCollection: function (record, callback) {
    // Backbone collections update their modelsById map in the change
    // event which is dispatched after the `change:<attribute>`
    // events.
    record.once('change', _.bind(callback, this));
  },
  _listenForReady: function (attribute, record) {
    if (!record.isReady()) {
      this.pendingReferences[attribute] = record;
      this.listenTo(record, 'change:state', function (model, value, options) {
        if (record.isReady()) {
          this._cleanUpReadyListener(attribute);
          this.trigger('change', this, options);
          this.trigger('change:' + attribute + ':ready');
        }
      });
    }
  },
  _cleanUpReference: function (attribute) {
    this._cleanUpSaveListener(attribute);
    this._cleanUpReadyListener(attribute);
  },
  _cleanUpSaveListener: function (attribute) {
    if (this.transientReferences[attribute]) {
      this.stopListening(this.transientReferences[attribute], 'change:perma_id');
      delete this.transientReferences[attribute];
    }
  },
  _cleanUpReadyListener: function (attribute) {
    if (this.pendingReferences[attribute]) {
      this.stopListening(this.pendingReferences[attribute], 'change:state');
      delete this.pendingReferences[attribute];
    }
  }
};

const Configuration = Backbone.Model.extend({
  modelName: 'page',
  i18nKey: 'pageflow/page',
  mixins: [transientReferences],
  defaults: {
    gradient_opacity: 100,
    display_in_navigation: true,
    transition: 'fade',
    text_position: 'left',
    invert: false,
    hide_title: false,
    autoplay: true
  },
  /**
   * Used by views (i.e. FileInputView) to get id which can be used in
   * routes to lookup configuration via its page.
   * @private
   */
  getRoutableId: function () {
    return this.parent.id;
  },
  getImageFileUrl: function (attribute, options) {
    options = options || {};
    var file = this.getImageFile(attribute);
    if (file && file.isReady()) {
      return file.get(options.styleGroup ? options.styleGroup + '_url' : 'url');
    }
    return '';
  },
  getImageFile: function (attribute) {
    return this.getReference(attribute, 'image_files');
  },
  getFilePosition: function (attribute, coord) {
    var propertyName = this.filePositionProperty(attribute, coord);
    return this.has(propertyName) ? this.get(propertyName) : 50;
  },
  setFilePosition: function (attribute, coord, value) {
    var propertyName = this.filePositionProperty(attribute, coord);
    this.set(propertyName, value);
  },
  setFilePositions: function (attribute, x, y) {
    var attributes = {};
    attributes[this.filePositionProperty(attribute, 'x')] = x;
    attributes[this.filePositionProperty(attribute, 'y')] = y;
    this.set(attributes);
  },
  filePositionProperty: function (attribute, coord) {
    return attribute.replace(/_id$/, '_' + coord);
  },
  getVideoFileSources: function (attribute) {
    var file = this.getVideoFile(attribute);
    if (file && file.isReady()) {
      return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
    }
    return '';
  },
  getVideoFile: function (attribute) {
    return this.getReference(attribute, 'video_files');
  },
  getAudioFileSources: function (attribute) {
    var file = this.getAudioFile(attribute);
    if (file && file.isReady()) {
      return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
    }
    return '';
  },
  getAudioFile: function (attribute) {
    return this.getReference(attribute, 'audio_files');
  },
  getVideoPosterUrl: function () {
    var posterFile = this.getReference('poster_image_id', 'image_files'),
      videoFile = this.getReference('video_file_id', 'video_files');
    if (posterFile) {
      return posterFile.get('url');
    } else if (videoFile) {
      return videoFile.get('poster_url');
    }
    return null;
  },
  _appendSuffix: function (sources) {
    var parent = this.parent;
    if (!parent || !parent.id) {
      return sources;
    }
    return _.map(sources, function (source) {
      var clone = _.clone(source);
      clone.src = clone.src + '?e=' + parent.id + '&t=' + new Date().getTime();
      return clone;
    });
  }
});
app.on('mixin:configuration', mixin => {
  Cocktail.mixin(Configuration, mixin);
});

/**
 * Remove model from collection only after the `DELETE` request has
 * succeeded. Still allow tracking that the model is being destroyed
 * by triggering a `destroying` event and adding a `isDestroying`
 * method.
 */
const delayedDestroying = {
  initialize: function () {
    this._destroying = false;
    this._destroyed = false;
  },
  /**
   * Trigger `destroying` event and send `DELETE` request. Only remove
   * model from collection once the request is done.
   */
  destroyWithDelay: function () {
    var model = this;
    this._destroying = true;
    this.trigger('destroying', this);
    return Backbone.Model.prototype.destroy.call(this, {
      wait: true,
      success: function () {
        model._destroying = false;
        model._destroyed = true;
      },
      error: function () {
        model._destroying = false;
      }
    });
  },
  /**
   * Get whether the model is currently being destroyed.
   */
  isDestroying: function () {
    return this._destroying;
  },
  /**
   * Get whether the model has been destroyed.
   */
  isDestroyed: function () {
    return this._destroyed;
  }
};

/**
 * Mixin for Backbone models that shall be watched by {@link
 * modelLifecycleTrackingView} mixin.
 */
const failureTracking = {
  initialize: function () {
    this._saveFailed = false;
    this.listenTo(this, 'sync', function () {
      this._saveFailed = false;
      this._failureMessage = null;
      this.trigger('change:failed');
    });
    this.listenTo(this, 'error', function (model, xhr) {
      this._saveFailed = true;
      this._failureMessage = this.translateStatus(xhr);
      this.trigger('change:failed');
    });
  },
  isFailed: function () {
    return this._saveFailed;
  },
  getFailureMessage: function () {
    return this._failureMessage;
  },
  translateStatus: function (xhr) {
    if (xhr.status === 401) {
      return 'Sie müssen angemeldet sein, um diese Aktion auszuführen.';
    } else if (xhr.status === 403) {
      return 'Sie sind nicht berechtigt diese Aktion auszuführen.';
    } else if (xhr.status === 404) {
      return 'Der Datensatz konnte auf dem Server nicht gefunden werden.';
    } else if (xhr.status === 409) {
      return 'Die Reportage wurde außerhalb dieses Editors bearbeitet.';
    } else if (xhr.status >= 500 && xhr.status < 600) {
      return 'Der Server hat einen internen Fehler gemeldet.';
    } else if (xhr.statusText === 'timeout') {
      return 'Der Server ist nicht erreichbar.';
    }
    return '';
  }
};

/**
 * Mixins for models with a nested configuration model.
 *
 * Triggers events on the parent model of the form
 * `change:configuration` and `change:configuration:<attribute>`, when
 * the configuration changes.
 *
 * @param {Object} [options]
 * @param {Function} [options.configurationModel] -
 *   Backbone model to use for nested configuration model.
 * @param {Boolean} [options.autoSave] -
 *   Save model when configuration changes.
 * @param {Boolean|Array<String>} [options.includeAttributesInJSON] -
 *   Include all or specific attributes of the parent model in the
 *   data returned by `toJSON` besides the `configuration` property.
 * @param {Function} [options.afterInitialize] -
 *   Callback to invoke once configuration has been set up. The
 *   initialize method of this mixin is only invoked after the
 *   initialize method of the class using the mixin. The callback
 *   is invoked with `this` pointing to the model object.
 * @returns {Object} - Mixin to be included in model.
 *
 * @example
 *
 * import {configurationContainer} from 'pageflow/editor';
 *
 * const Section = Backbone.Model.extend({
 *   mixins: [configurationContainer({autoSave: true})]
 * });
 *
 * const section = new Section({configuration: {some: 'value'}});
 * section.configuration.get('some') // => 'value';
 */
function configurationContainer({
  configurationModel,
  autoSave,
  includeAttributesInJSON,
  afterInitialize
} = {}) {
  configurationModel = configurationModel || Configuration.extend({
    defaults: {}
  });
  return {
    initialize() {
      this.configuration = new configurationModel(this.get('configuration'));
      this.configuration.parent = this;
      const canSave = () => !this.isNew() && (!this.isDestroying || !this.isDestroying()) && (!this.isDestroyed || !this.isDestroyed());
      const debouncedSave = leadingTrailingDebounce(() => {
        if (canSave()) {
          this.save();
        }
      }, 500);
      this.listenTo(this.configuration, 'change', function (model, options) {
        if (canSave() && autoSave && options.autoSave !== false) {
          debouncedSave();
        }
        this.trigger('change:configuration', this, undefined, options);
        _.chain(this.configuration.changed).keys().each(function (name) {
          this.trigger('change:configuration:' + name, this, this.configuration.get(name));
        }, this);
      });
      if (afterInitialize) {
        afterInitialize.call(this);
      }
    },
    toJSON() {
      let attributes = {};
      if (includeAttributesInJSON === true) {
        attributes = _.clone(this.attributes);
      } else if (includeAttributesInJSON) {
        attributes = _.pick(this.attributes, includeAttributesInJSON);
      }
      return _.extend(attributes, {
        configuration: this.configuration.toJSON()
      });
    }
  };
}
function leadingTrailingDebounce(fn, delay) {
  let timer = null;
  let pendingTrailing = false;
  function debounced() {
    if (timer === null) {
      fn();
    } else {
      pendingTrailing = true;
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      if (pendingTrailing) {
        pendingTrailing = false;
        fn();
      }
    }, delay);
  }
  return debounced;
}

const Page = Backbone.Model.extend({
  modelName: 'page',
  paramRoot: 'page',
  i18nKey: 'pageflow/page',
  defaults: function () {
    return {
      template: 'background_image',
      configuration: {},
      active: false,
      perma_id: ''
    };
  },
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: true,
    configurationModel: Configuration,
    afterInitialize() {
      this.configuration.page = this;
      this.listenTo(this.configuration, 'change:title', function () {
        this.trigger('change:title');
      });
    }
  }), failureTracking, delayedDestroying],
  initialize() {
    this.listenTo(this, 'change:template', function () {
      this.save();
    });
  },
  urlRoot: function () {
    return this.isNew() ? this.collection.url() : '/pages';
  },
  storylinePosition: function () {
    return this.chapter && this.chapter.storylinePosition() || -1;
  },
  chapterPosition: function () {
    return this.chapter && this.chapter.has('position') ? this.chapter.get('position') : -1;
  },
  isFirstPage: function () {
    return this.isChapterBeginning() && this.chapterPosition() === 0 && this.storylinePosition() === 1;
  },
  isChapterBeginning: function () {
    return this.get('position') === 0;
  },
  title: function () {
    return this.configuration.get('title') || this.configuration.get('additional_title') || '';
  },
  thumbnailFile: function () {
    var configuration = this.configuration;
    return _.reduce(this.pageType().thumbnailCandidates(), function (result, candidate) {
      if (candidate.condition && !conditionMet(candidate.condition, configuration)) {
        return result;
      }
      return result || configuration.getReference(candidate.attribute, candidate.file_collection);
    }, null);
  },
  pageLinks: function () {
    return this.pageType().pageLinks(this.configuration);
  },
  pageType: function () {
    return editor.pageTypes.findByName(this.get('template'));
  },
  destroy: function () {
    this.destroyWithDelay();
  }
});
function conditionMet(condition, configuration) {
  if (condition.negated) {
    return configuration.get(condition.attribute) != condition.value;
  } else {
    return configuration.get(condition.attribute) == condition.value;
  }
}
Page.linkedPagesLayouts = ['default', 'hero_top_left', 'hero_top_right'];
Page.textPositions = ['left', 'center', 'right'];
Page.textPositionsWithoutCenterOption = ['left', 'right'];
Page.scrollIndicatorModes = ['all', 'only_back', 'only_next', 'non'];
Page.scrollIndicatorOrientations = ['vertical', 'horizontal'];
Page.delayedTextFadeIn = ['no_fade', 'short', 'medium', 'long'];

const Scaffold = Object$1.extend({
  initialize: function (parent, options) {
    this.parent = parent;
    this.options = options || {};
  },
  create: function () {
    var scaffold = this;
    var query = this.options.depth ? '?depth=' + this.options.depth : '';
    this.model = this.build();
    Backbone.sync('create', this.model, {
      url: this.model.url() + '/scaffold' + query,
      success: function (response) {
        scaffold.load(response);
        scaffold.model.trigger('sync', scaffold.model, response, {});
      }
    });
  },
  build: function () {},
  load: function () {}
});

const StorylineScaffold = Scaffold.extend({
  build: function () {
    this.storyline = this.parent.buildStoryline(this.options.storylineAttributes);
    this.chapter = this.storyline.buildChapter();
    if (this.options.depth === 'page') {
      this.page = this.chapter.buildPage();
    }
    editor.trigger('scaffold:storyline', this.storyline);
    return this.storyline;
  },
  load: function (response) {
    this.storyline.set(response.storyline);
    this.chapter.set(response.chapter);
    if (this.page) {
      this.page.set(response.page);
    }
  }
});

const FileReuse = Backbone.Model.extend({
  modelName: 'file_reuse',
  paramRoot: 'file_reuse',
  initialize: function (attributes, options) {
    this.entry = options.entry;
    this.collectionName = options.fileType.collectionName;
  },
  url: function () {
    return '/editor/entries/' + this.entry.get('id') + '/files/' + this.collectionName + '/reuse';
  }
});
FileReuse.submit = function (otherEntry, file, options) {
  new FileReuse({
    other_entry_id: otherEntry.get('id'),
    file_id: file.get('id'),
    folder_perma_id: options.folderPermaId
  }, {
    entry: options.entry,
    fileType: file.fileType()
  }).save(null, options);
};

const FileConfiguration = Configuration.extend({
  defaults: {},
  applyUpdaters: function (updaters, newAttributes) {
    _(updaters).each(function (updater) {
      updater(this, newAttributes);
    }, this);
  }
});

const NestedFilesCollection = SubsetCollection.extend({
  constructor: function (options) {
    var parent = options.parent;
    var parentFile = options.parentFile;
    var modelType = parentFile.fileType().typeName;
    var nestedFilesOrder = parent.fileType.nestedFilesOrder;
    SubsetCollection.prototype.constructor.call(this, {
      parent: parent,
      parentModel: parentFile,
      filter: function (item) {
        return item.get('parent_file_id') === parentFile.get('id') && item.get('parent_file_model_type') === modelType;
      },
      comparator: nestedFilesOrder && nestedFilesOrder.comparator
    });
    if (nestedFilesOrder) {
      this.listenTo(this, 'change:configuration:' + nestedFilesOrder.binding, this.sort);
    }
  },
  getByPermaId: function (permaId) {
    return this.findWhere({
      perma_id: parseInt(permaId, 10)
    });
  }
});

const retryable = {
  retry: function (options) {
    options = options ? _.clone(options) : {};
    if (options.parse === void 0) options.parse = true;
    var model = this;
    options.success = function (resp) {
      if (!model.set(model.parse(resp, options), options)) return false;
      model.trigger('sync', model, resp, options);
    };
    options.error = function (resp) {
      model.trigger('error', model, resp, options);
    };
    options.url = this.url() + '/retry';
    return this.sync('create', this, options);
  }
};

const FileStage = Backbone.Model.extend({
  initialize: function (attributes, options) {
    this.file = options.file;
    this.activeStates = options.activeStates || [];
    this.finishedStates = options.finishedStates || [];
    this.failedStates = options.failedStates || [];
    this.actionRequiredStates = options.actionRequiredStates || [];
    this.nonFinishedStates = this.activeStates.concat(this.failedStates, this.actionRequiredStates);
    this.update();
    this.listenTo(this.file, 'change:state', this.update);
    this.listenTo(this.file, 'change:' + this.get('name') + '_progress', this.update);
    this.listenTo(this.file, 'change:' + this.get('name') + '_error_message', this.update);
  },
  update: function () {
    this.updateState();
    this.updateProgress();
    this.updateErrorMessage();
  },
  updateState: function () {
    var state = this.file.get('state');
    this.set('active', this.activeStates.indexOf(state) >= 0);
    this.set('finished', this.finishedStates.indexOf(state) >= 0);
    this.set('failed', this.failedStates.indexOf(state) >= 0);
    this.set('action_required', this.actionRequiredStates.indexOf(state) >= 0);
    if (this.get('active')) {
      this.set('state', 'active');
    } else if (this.get('finished')) {
      this.set('state', 'finished');
    } else if (this.get('failed')) {
      this.set('state', 'failed');
    } else if (this.get('action_required')) {
      this.set('state', 'action_required');
    } else {
      this.set('state', 'pending');
    }
  },
  updateProgress: function () {
    this.set('progress', this.file.get(this.get('name') + '_progress'));
  },
  updateErrorMessage: function () {
    var errorMessageAttribute = this.get('name') + '_error_message';
    this.set('error_message', this.file.get(errorMessageAttribute));
  },
  localizedDescription: function () {
    var prefix = 'pageflow.editor.files.stages.';
    var suffix = this.get('name') + '.' + this.get('state');
    return I18n$1.t(prefix + this.file.i18nKey + '.' + suffix, {
      defaultValue: I18n$1.t(prefix + suffix)
    });
  }
});

const stageProvider = {
  initialize: function () {
    var finishedStates = [this.readyState];
    var stages = _.result(this, 'stages') || [];
    this.stages = new Backbone.Collection(_.chain(stages).slice().reverse().map(function (options) {
      var name = options.name;
      options.file = this;
      options.finishedStates = finishedStates;
      var fileStage = new FileStage({
        name: name
      }, options);
      finishedStates = finishedStates.concat(fileStage.nonFinishedStates);
      return fileStage;
    }, this).reverse().value());
    this.unfinishedStages = new SubsetCollection({
      parent: this.stages,
      watchAttribute: 'finished',
      filter: function (stage) {
        return !stage.get('finished');
      }
    });

    // Only the stage a file is waiting on says anything about what is
    // going on. Stages which are done or still queued behind the
    // current one only add noise.
    this.currentStages = new Backbone.Collection();
    this.listenTo(this.unfinishedStages, 'add remove', this.updateCurrentStages);
    this.updateCurrentStages();
  },
  updateCurrentStages: function () {
    var stage = this.unfinishedStages.first();
    this.currentStages.set(stage ? [stage] : []);
  },
  currentStage: function () {
    return this.stages.find(function (stage) {
      return stage.get('active') || stage.get('action_required') || stage.get('failed');
    });
  }
};

const ReusableFile = Backbone.Model.extend({
  // Files which are not in any folder have a blank folder perma id, which
  // lets code comparing folders rely on the attribute being present even
  // before the server has responded to an upload.
  defaults: {
    folder_perma_id: null
  },
  mixins: [configurationContainer({
    autoSave: true,
    configurationModel: FileConfiguration,
    includeAttributesInJSON: ['file_name', 'display_name', 'rights', 'parent_file_id', 'parent_file_model_type', 'folder_perma_id', 'content_type', 'file_size'],
    afterInitialize() {
      this.configuration.i18nKey = this.i18nKey;
    }
  }), stageProvider, retryable],
  initialize: function (attributes, options) {
    this.options = options || {};
    this.listenTo(this, 'change:rights', function () {
      if (!this.isNew()) {
        this.save();
      }
    });
    this.listenTo(this, 'change:display_name', function () {
      if (!this.isNew()) {
        this.save();
      }
    });
    this.listenTo(this, 'change:folder_perma_id', function () {
      if (!this.isNew()) {
        this.save();
      }
    });
    this.listenTo(this, 'change:original_url change:display_name', this.updateDownloadUrl);
    this.updateDownloadUrl();
    this.listenTo(this, 'change', function (model, options) {
      if (options.applyConfigurationUpdaters) {
        this.configuration.applyUpdaters(this.fileType().configurationUpdaters, this.attributes.configuration);
      }
    });
  },
  urlRoot: function () {
    return this.collection.url();
  },
  fileType: function () {
    return this.options.fileType;
  },
  createPreviewView: function () {
    var PreviewView = this.fileType().previewView;
    if (!PreviewView || !this.isReady()) {
      return;
    }
    return new PreviewView({
      model: this
    });
  },
  createThumbnailView: function () {
    var _this$fileType;
    var ThumbnailView = (_this$fileType = this.fileType()) === null || _this$fileType === void 0 ? void 0 : _this$fileType.thumbnailView;
    if (!ThumbnailView || !this.isReady()) {
      return;
    }
    return new ThumbnailView({
      model: this
    });
  },
  createPositioningView: function (options) {
    var PositioningView = this.fileType().positioningView;
    return new PositioningView({
      model: this,
      ...options
    });
  },
  title: function () {
    return this.get('display_name') || this.get('file_name');
  },
  thumbnailFile: function () {
    return this;
  },
  nestedFiles: function (supersetCollection) {
    if (typeof supersetCollection === 'function') {
      supersetCollection = supersetCollection();
    }
    var collectionName = supersetCollection.fileType.collectionName;
    this.nestedFilesCollections = this.nestedFilesCollections || {};
    this.nestedFilesCollections[collectionName] = this.nestedFilesCollections[collectionName] || new NestedFilesCollection({
      parent: supersetCollection,
      parentFile: this
    });
    return this.nestedFilesCollections[collectionName];
  },
  isUploading: function () {
    return this.get('state') === 'uploading';
  },
  isUploaded: function () {
    return this.get('state') !== 'uploading' && this.get('state') !== 'uploading_failed';
  },
  isPending: function () {
    return !this.isReady() && !this.isFailed();
  },
  isReady: function () {
    return this.get('state') === this.readyState;
  },
  isFailed: function () {
    return this.get('state') && !!this.get('state').match(/_failed$/);
  },
  isRetryable: function () {
    return !!this.get('retryable');
  },
  isConfirmable: function () {
    return false;
  },
  isPositionable: function () {
    return false;
  },
  cancelUpload: function () {
    if (this.get('state') === 'uploading') {
      this.trigger('uploadCancelled');
      this.destroy();
    }
  },
  uploadFailed: function () {
    this.set('state', 'uploading_failed');
    this.unset('uploading_progress');
    this.trigger('uploadFailed');
  },
  publish: function () {
    this.save({}, {
      url: this.url() + '/publish'
    });
  },
  updateDownloadUrl: function () {
    const originalUrl = this.get('original_url');
    const displayName = this.get('display_name');
    if (originalUrl && displayName) {
      const separator = originalUrl.includes('?') ? '&' : '?';
      this.set('download_url', `${originalUrl}${separator}download=${encodeURIComponent(displayName)}`);
    } else {
      this.unset('download_url');
    }
  }
});

const UploadableFile = ReusableFile.extend({
  stages: function () {
    return [{
      name: 'uploading',
      activeStates: ['uploading'],
      failedStates: ['uploading_failed']
    }].concat(_.result(this, 'processingStages'));
  },
  processingStages: [],
  readyState: 'uploaded'
});

const EncodedFile = UploadableFile.extend({
  processingStages: function () {
    var stages = [];
    if (state.config.confirmEncodingJobs) {
      stages.push({
        name: 'fetching_meta_data',
        activeStates: ['waiting_for_meta_data', 'fetching_meta_data'],
        failedStates: ['fetching_meta_data_failed']
      });
    }
    stages.push({
      name: 'encoding',
      actionRequiredStates: ['waiting_for_confirmation'],
      activeStates: ['waiting_for_encoding', 'encoding'],
      failedStates: ['fetching_meta_data_failed', 'encoding_failed']
    });
    return stages;
  },
  readyState: 'encoded',
  isConfirmable: function () {
    return this.get('state') === 'waiting_for_confirmation';
  },
  isPositionable: function () {
    return false;
  }
});

const VideoFile = EncodedFile.extend({
  getBackgroundPositioningImageUrl: function () {
    return this.get('poster_url');
  },
  isPositionable: function () {
    return this.isReady();
  }
});

const WidgetConfigurationFileSelectionHandler = function (options) {
  var widget = state.entry.widgets.get(options.id);
  this.call = function (file) {
    widget.configuration.setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/widgets/' + widget.id;
  };
};
editor.registerFileSelectionHandler('widgetConfiguration', WidgetConfigurationFileSelectionHandler);

const EncodingConfirmation = Backbone.Model.extend({
  paramRoot: 'encoding_confirmation',
  initialize: function () {
    this.videoFiles = new Backbone.Collection();
    this.audioFiles = new Backbone.Collection();
    this.updateEmpty();
    this.watchCollections();
  },
  watchCollections: function () {
    this.listenTo(this.videoFiles, 'add remove', this.check);
    this.listenTo(this.audioFiles, 'add remove', this.check);
    this.listenTo(this.videoFiles, 'reset', this.updateEmpty);
    this.listenTo(this.audioFiles, 'reset', this.updateEmpty);
  },
  check: function () {
    var model = this;
    model.updateEmpty();
    model.set('checking', true);
    model.save({}, {
      url: model.url() + '/check',
      success: function () {
        model.set('checking', false);
      },
      error: function () {
        model.set('checking', false);
      }
    });
  },
  saveAndReset: function () {
    var model = this;
    model.save({}, {
      success: function () {
        model.set('summary_html', '');
        model.videoFiles.reset();
        model.audioFiles.reset();
      }
    });
  },
  updateEmpty: function () {
    this.set('empty', this.videoFiles.length === 0 && this.audioFiles.length === 0);
  },
  url: function () {
    return '/editor/entries/' + state.entry.get('id') + '/encoding_confirmations';
  },
  toJSON: function () {
    return {
      video_file_ids: this.videoFiles.pluck('id'),
      audio_file_ids: this.audioFiles.pluck('id')
    };
  }
});
EncodingConfirmation.createWithPreselection = function (options) {
  var model = new EncodingConfirmation();
  if (options.fileId) {
    if (options.fileType === 'video_file') {
      model.videoFiles.add(state.videoFiles.get(options.fileId));
    } else {
      model.audioFiles.add(state.audioFiles.get(options.fileId));
    }
  }
  return model;
};

const Theme = Backbone.Model.extend({
  title: function () {
    return I18n$1.t('pageflow.' + this.get('name') + '_theme.name');
  },
  thumbnailUrl: function () {
    return this.get('preview_thumbnail_url');
  },
  hasHomeButton: function () {
    return this.get('home_button');
  },
  hasOverviewButton: function () {
    return this.get('overview_button');
  },
  supportsEmphasizedPages: function () {
    return this.get('emphasized_pages');
  },
  supportsScrollIndicatorModes: function () {
    return this.get('scroll_indicator_modes');
  },
  supportsHideLogoOnPages: function () {
    return this.get('hide_logo_option');
  }
});

const WidgetConfiguration = Configuration.extend({
  i18nKey: 'pageflow/widget',
  defaults: {}
});

const AudioFile = EncodedFile.extend({
  thumbnailPictogram: 'audio',
  getSources: function (attribute) {
    if (this.isReady()) {
      return this.get('sources') ? this.get('sources') : '';
    }
    return '';
  }
});

const EntryMetadataConfiguration = Configuration.extend({
  modelName: 'entry_metadata_configuration',
  i18nKey: 'pageflow/entry_metadata_configuration',
  defaults: {}
});

const EntryMetadata = Configuration.extend({
  mixins: [failureTracking],
  modelName: 'entry',
  i18nKey: 'pageflow/entry',
  defaults: {},
  initialize: function (attributes, options) {
    Configuration.prototype.initialize.apply(this, attributes, options);
    this.configuration = new EntryMetadataConfiguration(_.clone(attributes.configuration) || {});
    this.listenTo(this.configuration, 'change', function (model, options) {
      this.trigger('change', model, options);
      this.trigger('change:configuration', this, undefined, options);
      this.parent.save();
    });
  },
  // Pageflow Scrolled only synchronizes saved records to entry state.
  isNew() {
    return false;
  }
});

const StorylineConfiguration = Configuration.extend({
  modelName: 'storyline',
  i18nKey: 'pageflow/storyline',
  defaults: {},
  initialize: function () {
    this.listenTo(this, 'change:main', function (model, value) {
      if (value) {
        this.unset('parent_page_perma_id');
      }
    });
  }
});

const TextTrackFile = UploadableFile.extend({
  defaults: {
    configuration: {
      kind: 'captions'
    }
  },
  processingStages: [{
    name: 'processing',
    activeStates: ['processing'],
    failedStates: ['processing_failed']
  }],
  readyState: 'processed',
  initialize: function (attributes, options) {
    ReusableFile.prototype.initialize.apply(this, arguments);
    if (this.isNew() && !this.configuration.get('srclang')) {
      this.configuration.set('srclang', this.extractLanguageCodeFromFilename());
    }
  },
  displayLabel: function () {
    return this.configuration.get('label') || this.inferredLabel() || I18n$1.t('pageflow.editor.text_track_files.label_missing');
  },
  inferredLabel: function () {
    var srclang = this.configuration.get('srclang');
    if (srclang) {
      return I18n$1.t('pageflow.languages.' + srclang, {
        defaultValue: ''
      });
    }
  },
  extractLanguageCodeFromFilename: function () {
    var matches = /\S+\.([a-z]{2})_[A-Z]{2}\.[a-z]+/.exec(this.get('file_name'));
    return matches && matches[1];
  }
});
TextTrackFile.displayLabelBinding = 'srclang';

const StorylineOrdering = function (storylines, pages) {
  var storylinesByParent;
  this.watch = function () {
    storylines.on('add change:configuration', function () {
      this.sort();
    }, this);
    pages.on('change:position change:chapter_id', function () {
      this.sort();
    }, this);
  };
  this.sort = function (options) {
    prepare();
    visit(storylinesWithoutParent(), 1, 0);
    storylines.sort(options);
  };
  function visit(storylines, offset, level) {
    return _(storylines).reduce(function (position, storyline, index) {
      storyline.set('position', position);
      storyline.set('level', level);
      return visit(children(storyline), position + 1, level + 1);
    }, offset);
  }
  function storylinesWithoutParent() {
    return storylinesByParent[-1];
  }
  function children(storyline) {
    return storylinesByParent[storyline.cid] || [];
  }
  function prepare() {
    storylinesByParent = _(groupStorylinesByParentStoryline()).reduce(function (result, storylines, key) {
      result[key] = storylines.sort(compareStorylines);
      return result;
    }, {});
  }
  function groupStorylinesByParentStoryline() {
    return storylines.groupBy(function (storyline) {
      var parentPage = getParentPage(storyline);
      return parentPage && parentPage.chapter ? parentPage.chapter.storyline.cid : -1;
    });
  }
  function compareStorylines(storylineA, storylineB) {
    return compareByMainFlag(storylineA, storylineB) || compareByParentPagePosition(storylineA, storylineB) || compareByLane(storylineA, storylineB) || compareByRow(storylineA, storylineB) || compareByTitle(storylineA, storylineB);
  }
  function compareByMainFlag(storylineA, storylineB) {
    return compare(storylineA.isMain() ? -1 : 1, storylineB.isMain() ? -1 : 1);
  }
  function compareByParentPagePosition(storylineA, storylineB) {
    return compare(getParentPagePosition(storylineA), getParentPagePosition(storylineB));
  }
  function compareByLane(storylineA, storylineB) {
    return compare(storylineA.lane(), storylineB.lane());
  }
  function compareByRow(storylineA, storylineB) {
    return compare(storylineA.row(), storylineB.row());
  }
  function compareByTitle(storylineA, storylineB) {
    return compare(storylineA.title(), storylineB.title());
  }
  function compare(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }
  function getParentPagePosition(storyline) {
    var parentPage = getParentPage(storyline);
    return parentPage && parentPage.get('position');
  }
  function getParentPage(storyline) {
    return pages.getByPermaId(storyline.parentPagePermaId());
  }
};

const PageConfigurationFileSelectionHandler = function (options) {
  var page = state.pages.get(options.id);
  this.call = function (file) {
    page.configuration.setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/pages/' + page.id + '/' + (options.returnToTab || 'files');
  };
};
editor.registerFileSelectionHandler('pageConfiguration', PageConfigurationFileSelectionHandler);

const ImageFile = ReusableFile.extend({
  stages: [{
    name: 'uploading',
    activeStates: ['uploading'],
    failedStates: ['uploading_failed']
  }, {
    name: 'processing',
    activeStates: ['processing'],
    finishedStates: ['processed'],
    failedStates: ['processing_failed']
  }],
  readyState: 'processed',
  getBackgroundPositioningImageUrl: function () {
    return this.get('url');
  },
  isPositionable: function () {
    return this.isReady();
  }
});

const EntryMetadataFileSelectionHandler = function (options) {
  this.call = function (file) {
    state.entry.metadata.setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/meta_data/' + (options.returnToTab || 'general');
  };
};
editor.registerFileSelectionHandler('entryMetadata', EntryMetadataFileSelectionHandler);

const EntryPublication = Backbone.Model.extend({
  paramRoot: 'entry_publication',
  quota: function () {
    return new Backbone.Model(this.get('quota') || {});
  },
  check: function () {
    var model = this;
    this.set('checking', true);
    this.save({}, {
      url: this.url() + '/check',
      success: function () {
        model.set('checking', false);
      },
      error: function () {
        model.set('checking', false);
      }
    });
  },
  publish: function (attributes) {
    return this.save(attributes, {
      success: function (model) {
        state.entry.parse(model.get('entry'));
      },
      error: function (model, xhr) {
        model.set(xhr.responseJSON);
      }
    });
  },
  url: function () {
    return '/editor/entries/' + state.entry.get('id') + '/entry_publications';
  }
});

const ChapterScaffold = Scaffold.extend({
  build: function () {
    this.chapter = this.parent.buildChapter(this.options.chapterAttributes);
    this.page = this.chapter.buildPage();
    return this.chapter;
  },
  load: function (response) {
    this.chapter.set(response.chapter);
    this.page.set(response.page);
  }
});

const EditLockContainer = Backbone.Model.extend({
  initialize: function () {
    this.storageKey = 'pageflow.edit_lock.' + state.entry.id;
  },
  acquire: function (options) {
    options = options || {};
    var container = this;
    var lock = new EditLock({
      id: options.force ? null : sessionStorage[this.storageKey],
      force: options.force
    });
    lock.save(null, {
      polling: !!options.polling,
      success: function (lock) {
        sessionStorage[container.storageKey] = lock.id;
        container.lock = lock;
        container.trigger('acquired');
        container.startPolling();
      }
    });
  },
  startPolling: function () {
    if (!this.pollingInteval) {
      this.pollingInteval = setInterval(_.bind(function () {
        this.acquire({
          polling: true
        });
      }, this), state.config.editLockPollingIntervalInSeconds * 1000);
    }
  },
  stopPolling: function () {
    if (this.pollingInteval) {
      clearInterval(this.pollingInteval);
      this.pollingInteval = null;
    }
  },
  watchForErrors: function () {
    var container = this;
    $(document).ajaxSend(function (event, xhr) {
      if (container.lock) {
        xhr.setRequestHeader("X-Edit-Lock", container.lock.id);
      }
    });
    $(document).ajaxError(function (event, xhr, settings) {
      switch (xhr.status) {
        case 409:
          container.handleConflict(xhr, settings);
          break;
        case 401:
        case 422:
          container.handleUnauthenticated();
          break;
        default:
          container.handleError();
      }
    });
  },
  release: function () {
    if (this.lock) {
      var promise = this.lock.destroy();
      delete sessionStorage[this.storageKey];
      this.lock = null;
      return promise;
    }
  },
  handleConflict: function (xhr, settings) {
    this.lock = null;
    this.trigger('locked', xhr.responseJSON || {}, {
      context: settings.url.match(/\/edit_lock/) && !settings.polling ? 'acquire' : 'other'
    });
    this.stopPolling();
  },
  handleUnauthenticated: function () {
    this.stopPolling();
    this.trigger('unauthenticated');
  },
  handleError: function () {}
});

const Site = Backbone.Model.extend({
  modelName: 'site',
  i18nKey: 'pageflow/site',
  collectionName: 'sites'
});

const ChapterConfiguration = Configuration.extend({
  modelName: 'chapter',
  i18nKey: 'pageflow/chapter',
  defaults: {}
});

const Widget = Backbone.Model.extend({
  paramRoot: 'widget',
  i18nKey: 'pageflow/widget',
  initialize: function (attributes, options) {
    this.widgetTypes = options.widgetTypes;
    this.configuration = new WidgetConfiguration(this.get('configuration') || {});
    this.configuration.parent = this;
    this.listenTo(this.configuration, 'change', function () {
      this.trigger('change:configuration', this);
    });
  },
  widgetType: function () {
    return this.get('type_name') && this.widgetTypes.findByName(this.get('type_name'));
  },
  defineConfigurationEditorTabViewGroups(groups) {
    this.widgetType() && this.widgetType().defineConfigurationEditorTabViewGroups(groups);
  },
  hasConfiguration: function () {
    return !!(this.widgetType() && this.widgetType().hasConfiguration());
  },
  role: function () {
    return this.id;
  },
  urlRoot: function () {
    return this.collection.url();
  },
  toJSON: function () {
    return {
      role: this.role(),
      type_name: this.get('type_name'),
      configuration: this.configuration.toJSON()
    };
  }
});

const Search = Backbone.Model.extend({
  defaults: {
    term: '',
    order: 'alphabetical'
  },
  initialize: function (attrs, options = {}) {
    this.attribute = options.attribute;
    this.storageKey = options.storageKey;
    this.comparators = {
      alphabetical: function (file) {
        var fileName = file.get('display_name');
        return fileName && fileName.toLowerCase ? fileName.toLowerCase() : fileName;
      },
      most_recent: function (file) {
        var date = file.get('created_at');
        return date ? -new Date(date).getTime() : -file.id;
      }
    };
    this.orderAttributes = {
      alphabetical: 'display_name',
      most_recent: 'created_at'
    };
    if (this.storageKey) {
      const storage = getLocalStorage();
      if (storage && storage[this.storageKey]) {
        this.set('order', storage[this.storageKey]);
      }
      this.on('change:order', function () {
        const storage = getLocalStorage();
        if (storage) {
          storage[this.storageKey] = this.get('order');
        }
      });
    }
  },
  matches: function (model) {
    return this.matchesValue(model.get(this.attribute));
  },
  matchesValue: function (value) {
    var term = (this.get('term') || '').toLowerCase();
    return (value || '').toLowerCase().indexOf(term) >= 0;
  },
  applyTo: function (collection) {
    var subset = new SubsetCollection({
      parent: collection,
      parentModel: collection.parentModel,
      watchAttribute: this.attribute,
      filter: this.matches.bind(this),
      comparator: this.comparators[this.get('order')]
    });
    this.listenTo(this, 'change:term', function () {
      subset.updateFilter(this.matches.bind(this));
    });
    this.listenTo(this, 'change:order', function () {
      subset.comparator = this.comparators[this.get('order')];
      subset.sort();
    });
    this.listenTo(subset, 'change', function (model) {
      var attribute = this.orderAttributes[this.get('order')];
      if (model.hasChanged(attribute)) {
        subset.sort();
      }
    });
    return subset;
  }
});

const ListHighlight = Backbone.Model.extend({
  defaults: {
    active: false
  },
  initialize(attrs, options = {}) {
    this.collection = options.collection;
  },
  next() {
    this._move(1);
  },
  previous() {
    this._move(-1);
  },
  triggerSelect() {
    const cid = this.get('currentCid');
    if (cid != null) {
      this.trigger(`selected:${cid}`);
    }
  },
  _move(delta) {
    const collection = this.collection;
    const length = collection.length;
    if (!length) {
      return;
    }
    const currentCid = this.get('currentCid');
    let index = collection.models.findIndex(model => model.cid === currentCid);
    if (index === -1) {
      index = delta > 0 ? 0 : length - 1;
    } else {
      index = (index + delta + length) % length;
    }
    this.set('currentCid', collection.at(index).cid);
  }
});

const FileTypeSelection = Backbone.Model.extend({
  defaults() {
    return {
      collectionNames: []
    };
  },
  initialize(attributes, options = {}) {
    this.storageKey = options.storageKey;
    if (!this.storageKey) {
      return;
    }
    const storage = getLocalStorage();
    if (storage && storage[this.storageKey] != null) {
      this.set('collectionNames', parseCollectionNames(storage[this.storageKey]));
    }
    this.on('change:collectionNames', function () {
      const storage = getLocalStorage();
      if (storage) {
        storage[this.storageKey] = this.get('collectionNames').join(',');
      }
    });
  },
  select(collectionNames) {
    this.set('collectionNames', collectionNames);
  },
  selectOnly(collectionName) {
    this.select(this.isOnlySelected(collectionName) ? [] : [collectionName]);
  },
  toggle(collectionName) {
    const collectionNames = this.get('collectionNames');
    this.select(this.isSelected(collectionName) ? collectionNames.filter(name => name !== collectionName) : [...collectionNames, collectionName]);
  },
  isSelected(collectionName) {
    return this.get('collectionNames').includes(collectionName);
  },
  isOnlySelected(collectionName) {
    const collectionNames = this.get('collectionNames');
    return collectionNames.length === 1 && collectionNames[0] === collectionName;
  },
  matches(file) {
    const collectionNames = this.get('collectionNames');
    return !collectionNames.length || collectionNames.includes(file.fileType().collectionName);
  }
});
function parseCollectionNames(value) {
  return value.split(',').filter(Boolean);
}

const StorylineTransitiveChildPages = function (storyline, storylines, pages) {
  var isTranstiveChildStoryline;
  this.contain = function (page) {
    if (!isTranstiveChildStoryline) {
      search();
    }
    return !!isTranstiveChildStoryline[page.chapter.storyline.id];
  };
  function search() {
    isTranstiveChildStoryline = storylines.reduce(function (memo, other) {
      var current = other;
      while (current) {
        if (current === storyline || memo[current.id]) {
          memo[other.id] = true;
          return memo;
        }
        current = parentStoryline(current);
      }
      return memo;
    }, {});
  }
  function parentStoryline(storyline) {
    var parentPage = pages.getByPermaId(storyline.parentPagePermaId());
    return parentPage && parentPage.chapter && parentPage.chapter.storyline;
  }
};

const FileUploader = Object$1.extend({
  initialize: function (options) {
    this.fileTypes = options.fileTypes;
    this.entry = options.entry;
    this.deferreds = [];
  },
  add: function (upload, options) {
    options = options || {};
    var editor$1 = options.editor || editor;
    var fileType = this.fileTypes.findByUpload(upload);
    var file = new fileType.model({
      state: 'uploadable',
      file_name: upload.name,
      display_name: upload.name,
      content_type: upload.type,
      file_size: upload.size,
      configuration: this.defaultConfiguration(fileType, editor$1)
    }, {
      fileType: fileType
    });
    var setTargetFile = editor$1.nextUploadTargetFile;
    if (setTargetFile) {
      if (fileType.topLevelType || !setTargetFile.fileType().nestedFileTypes.contains(fileType)) {
        throw new InvalidNestedTypeError(upload, {
          editor: editor$1,
          fileType: fileType
        });
      }
      file.set({
        parent_file_id: setTargetFile.get('id'),
        parent_file_model_type: setTargetFile.fileType().typeName
      });
    } else if (!fileType.topLevelType) {
      throw new NestedTypeError(upload, {
        fileType: fileType,
        fileTypes: this.fileTypes
      });
    } else if (editor$1.nextUploadFolder) {
      file.set('folder_perma_id', editor$1.nextUploadFolder.get('perma_id'));
    }
    this.entry.getFileCollection(fileType).add(file);
    var deferred = new $.Deferred();
    if (setTargetFile) {
      deferred.resolve();
    } else {
      this.deferreds.push(deferred);
      if (this.deferreds.length == 1) {
        this.trigger('new:batch');
      }
    }
    return deferred.promise().then(function () {
      file.set('state', 'uploading');
      return file;
    }, function () {
      file.destroy();
    });
  },
  defaultConfiguration: function (fileType, editor) {
    var configuration = {};
    if (editor.entryType && editor.entryType.supportsExtendedFileRights && !fileType.noExtendedFileRights) {
      var rightsDisplay = this.entry.metadata && this.entry.metadata.configuration.get('defaultFileRightsDisplay');
      if (rightsDisplay) {
        configuration.rights_display = rightsDisplay;
      }
    }
    return configuration;
  },
  submit: function () {
    _(this.deferreds).invoke('resolve');
    this.deferreds = [];
  },
  abort: function () {
    _(this.deferreds).invoke('reject');
    this.deferreds = [];
  }
});

const orderedCollection = {
  initialize: function () {
    if (this.autoConsolidatePositions !== false) {
      this.listenTo(this, 'remove', function () {
        this.consolidatePositions();
        this.saveOrder();
      });
    }
  },
  consolidatePositions: function () {
    this.each(function (item, index) {
      item.set('position', index);
    });
  },
  saveOrder: function () {
    var parentModel = this.parentModel;
    var collection = this;
    if (collection.isEmpty()) {
      return $.Deferred().resolve().promise();
    }
    return Backbone.sync('update', parentModel, {
      url: collection.url() + '/order',
      attrs: {
        ids: collection.pluck('id')
      },
      success: function (response) {
        parentModel.trigger('sync', parentModel, response, {});
        parentModel.trigger('sync:order', parentModel, response, {});
      },
      error: function (jqXHR, textStatus, errorThrown) {
        editor.failures.add(new OrderingFailure(parentModel, collection));
      }
    });
  }
};

const ChapterPagesCollection = SubsetCollection.extend({
  mixins: [orderedCollection],
  constructor: function (options) {
    var chapter = options.chapter;
    SubsetCollection.prototype.constructor.call(this, {
      parent: options.pages,
      parentModel: chapter,
      filter: function (item) {
        return !chapter.isNew() && item.get('chapter_id') === chapter.id;
      },
      comparator: function (item) {
        return item.get('position');
      }
    });
    this.each(function (page) {
      page.chapter = chapter;
    });
    this.listenTo(this, 'add', function (model) {
      model.chapter = chapter;
      model.set('chapter_id', chapter.id);
      editor.trigger('add:page', model);
    });
    this.listenTo(this, 'remove', function (model) {
      model.chapter = null;
    });
    this.listenTo(chapter, 'destroy', function () {
      this.clear();
    });
  }
});

const Chapter = Backbone.Model.extend({
  modelName: 'chapter',
  paramRoot: 'chapter',
  i18nKey: 'pageflow/chapter',
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: true,
    configurationModel: ChapterConfiguration
  }), failureTracking, delayedDestroying],
  initialize: function (attributes, options) {
    this.pages = new ChapterPagesCollection({
      pages: options.pages || state.pages,
      chapter: this
    });
    this.listenTo(this, 'change:title', function () {
      this.save();
    });
  },
  urlRoot: function () {
    return this.isNew() ? this.collection.url() : '/chapters';
  },
  storylinePosition: function () {
    return this.storyline && this.storyline.get('position') || -1;
  },
  addPage: function (attributes) {
    var page = this.buildPage(attributes);
    page.save();
    return page;
  },
  buildPage: function (attributes) {
    var defaults = {
      chapter_id: this.id,
      position: this.pages.length
    };
    return this.pages.addAndReturnModel(_.extend(defaults, attributes));
  },
  toJSON: function () {
    return _.extend(_.clone(this.attributes), {
      configuration: this.configuration.toJSON()
    });
  },
  destroy: function () {
    this.destroyWithDelay();
  }
});

const StorylineChaptersCollection = SubsetCollection.extend({
  mixins: [orderedCollection],
  constructor: function (options) {
    var storyline = options.storyline;
    SubsetCollection.prototype.constructor.call(this, {
      parent: options.chapters,
      parentModel: storyline,
      filter: function (item) {
        return !storyline.isNew() && item.get('storyline_id') === storyline.id;
      },
      comparator: function (item) {
        return item.get('position');
      }
    });
    this.each(function (chapter) {
      chapter.storyline = storyline;
    });
    this.listenTo(this, 'add', function (model) {
      model.storyline = storyline;
      model.set('storyline_id', storyline.id);
      editor.trigger('add:chapter', model);
    });
    this.listenTo(this, 'remove', function (model) {
      model.storyline = null;
    });
  }
});

const Storyline = Backbone.Model.extend({
  modelName: 'storyline',
  paramRoot: 'storyline',
  i18nKey: 'pageflow/storyline',
  mixins: [configurationContainer({
    autoSave: true,
    configurationModel: StorylineConfiguration
  }), failureTracking, delayedDestroying],
  initialize: function (attributes, options) {
    this.chapters = new StorylineChaptersCollection({
      chapters: options.chapters || state.chapters,
      storyline: this
    });
    this.listenTo(this, 'change:configuration:main', function (model, value) {
      this.trigger('change:main', this, value);
    });
  },
  urlRoot: function () {
    return this.isNew() ? this.collection.url() : '/storylines';
  },
  displayTitle: function () {
    return _([this.title() || !this.isMain() && I18n$1.t('pageflow.storylines.untitled'), this.isMain() && I18n$1.t('pageflow.storylines.main')]).compact().join(' - ');
  },
  title: function () {
    return this.configuration.get('title');
  },
  isMain: function () {
    return !!this.configuration.get('main');
  },
  lane: function () {
    return this.configuration.get('lane');
  },
  row: function () {
    return this.configuration.get('row');
  },
  parentPagePermaId: function () {
    return this.configuration.get('parent_page_perma_id');
  },
  parentPage: function () {
    return state.pages.getByPermaId(this.parentPagePermaId());
  },
  transitiveChildPages: function () {
    return new StorylineTransitiveChildPages(this, state.storylines, state.pages);
  },
  addChapter: function (attributes) {
    var chapter = this.buildChapter(attributes);
    chapter.save();
    return chapter;
  },
  buildChapter: function (attributes) {
    var defaults = {
      storyline_id: this.id,
      title: '',
      position: this.chapters.length
    };
    return this.chapters.addAndReturnModel(_.extend(defaults, attributes));
  },
  scaffoldChapter: function (options) {
    var scaffold = new ChapterScaffold(this, options);
    scaffold.create();
    return scaffold;
  },
  destroy: function () {
    this.destroyWithDelay();
  }
});

const PageLink = Backbone.Model.extend({
  mixins: [transientReferences],
  i18nKey: 'pageflow/page_link',
  targetPage: function () {
    return state.pages.getByPermaId(this.get('target_page_id'));
  },
  label: function () {
    return this.get('label');
  },
  editPath: function () {
    return '/page_links/' + this.id;
  },
  getPageId: function () {
    return this.collection.page.id;
  },
  toSerializedJSON: function () {
    return _.omit(this.attributes, 'highlighted', 'position');
  },
  highlight: function () {
    this.set('highlighted', true);
  },
  resetHighlight: function () {
    this.unset('highlighted');
  },
  remove: function () {
    this.collection.remove(this);
  }
});

const PageLinkFileSelectionHandler = function (options) {
  var page = state.pages.getByPermaId(options.id.split(':')[0]);
  var pageLink = page.pageLinks().get(options.id);
  this.call = function (file) {
    pageLink.setReference(options.attributeName, file);
  };
  this.getReferer = function () {
    return '/page_links/' + pageLink.id;
  };
};
editor.registerFileSelectionHandler('pageLink', PageLinkFileSelectionHandler);

const persistedPromise = {
  persisted: function () {
    var model = this;
    this._persistedDeferred = this._persistedDeferred || $.Deferred(function (deferred) {
      if (model.isNew()) {
        model.once('change:id', deferred.resolve);
      } else {
        deferred.resolve();
      }
    });
    return this._persistedDeferred.promise();
  }
};
Cocktail.mixin(Backbone.Model, persistedPromise);

const filesCountWatcher = {
  watchFileCollection: function (name, collection) {
    this.watchedFileCollectionNames = this.watchedFileCollectionNames || [];
    this.watchedFileCollectionNames.push(name);
    this.listenTo(collection, 'change:state', function (model) {
      this.updateFilesCounts(name, collection);
    });
    this.listenTo(collection, 'add', function () {
      this.updateFilesCounts(name, collection);
    });
    this.listenTo(collection, 'remove', function () {
      this.updateFilesCounts(name, collection);
    });
    this.updateFilesCounts(name, collection);
  },
  updateFilesCounts: function (name, collection) {
    this.updateFilesCount('uploading', name, collection, function (file) {
      return file.isUploading();
    });
    this.updateFilesCount('confirmable', name, collection, function (file) {
      return file.isConfirmable();
    });
    this.updateFilesCount('pending', name, collection, function (file) {
      return file.isPending();
    });
  },
  updateFilesCount: function (trait, name, collection, filter) {
    this.set(trait + '_' + name + '_count', collection.filter(filter).length);
    this.set(trait + '_files_count', _.reduce(this.watchedFileCollectionNames, function (sum, name) {
      return sum + this.get(trait + '_' + name + '_count');
    }, 0, this));
  }
};

const fileWithType = {};

const polling = {
  togglePolling: function (enabled) {
    if (enabled) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  },
  startPolling: function () {
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(_.bind(function () {
        this.fetch();
      }, this), 1000);
    }
  },
  stopPolling: function () {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
};

const Entry = Backbone.Model.extend({
  paramRoot: 'entry',
  urlRoot: '/editor/entries',
  modelName: 'entry',
  i18nKey: 'pageflow/entry',
  collectionName: 'entries',
  mixins: [filesCountWatcher, polling, failureTracking],
  initialize: function (attributes, options) {
    options = options || {};
    this.metadata = new EntryMetadata(this.get('metadata') || {});
    this.metadata.parent = this;

    // In 15.1 `entry.configuration` was turned into a new `Metadata`
    // model. Some of the entry type specific data (like
    // `home_button_enabled`) was extraced into
    // `entry.metadata.configuration`. Attributes like `title` or `locale`
    // which used to live in `entry.configuration` now live in
    // entry.metadata. Since some plugins (e.g. `pageflow-vr`) depend on
    // reading the locale from `entry.configuration`, this `configuration`
    // keeps backwards compatibility.
    this.configuration = this.metadata;
    this.themes = options.themes || state.themes;
    this.site = options.site || state.site;
    this.files = options.files || state.files;
    this.fileFolders = options.fileFolders || state.fileFolders;
    this.fileFolders.entry = this;
    this.fileTypes = options.fileTypes || editor.fileTypes;
    this.storylines = options.storylines || state.storylines;
    this.storylines.parentModel = this;
    this.chapters = options.chapters || state.chapters;
    this.chapters.parentModel = this;
    this.pages = state.pages;
    this.widgets = options.widgets;
    this.widgets.subject = this;
    this.imageFiles = state.imageFiles;
    this.videoFiles = state.videoFiles;
    this.audioFiles = state.audioFiles;
    this.fileTypes.each(function (fileType) {
      var collection = this.getFileCollection(fileType);
      collection.entry = this;
      this.watchFileCollection(fileType.collectionName, collection);
    }, this);
    this.listenTo(this.storylines, 'sort', function () {
      this.pages.sort();
    });
    this.listenTo(this.chapters, 'sort', function () {
      this.pages.sort();
    });
    this.listenTo(this.metadata, 'change', function () {
      this.trigger('change:metadata');
      this.save();
    });
    this.listenTo(this.metadata, 'change:locale', function () {
      this.once('sync', function () {
        // No other way of updating page templates used in
        // EntryPreviewView at the moment.
        location.reload();
      });
    });
  },
  getTheme: function () {
    return this.themes.findByName(this.metadata.get('theme_name'));
  },
  supportsPhoneEmulation() {
    return true;
  },
  addStoryline: function (attributes) {
    var storyline = this.buildStoryline(attributes);
    storyline.save();
    return storyline;
  },
  buildStoryline: function (attributes) {
    var defaults = {
      title: ''
    };
    return this.storylines.addAndReturnModel(_.extend(defaults, attributes));
  },
  scaffoldStoryline: function (options) {
    var scaffold = new StorylineScaffold(this, options);
    scaffold.create();
    return scaffold;
  },
  addChapterInNewStoryline: function (options) {
    return this.scaffoldStoryline(_.extend({
      depth: 'chapter'
    }, options)).chapter;
  },
  addPageInNewStoryline: function (options) {
    return this.scaffoldStoryline(_.extend({
      depth: 'page'
    }, options)).page;
  },
  reuseFile: function (otherEntry, file, options) {
    var entry = this;
    FileReuse.submit(otherEntry, file, {
      entry: entry,
      folderPermaId: (options || {}).folderPermaId,
      success: function (model, response) {
        entry._setFiles(response, {
          merge: false,
          remove: false
        });
        entry.trigger('use:files');
      }
    });
  },
  getFileCollection: function (fileTypeOrFileTypeName) {
    return this.files[fileTypeOrFileTypeName.collectionName || fileTypeOrFileTypeName];
  },
  pollForPendingFiles: function () {
    this.listenTo(this, 'change:pending_files_count', function (model, value) {
      this.togglePolling(value > 0);
    });
    this.togglePolling(this.get('pending_files_count') > 0);
  },
  parse: function (response, options) {
    if (response) {
      this.set(_.pick(response, 'published', 'published_until', 'password_protected', 'last_published_with_noindex'));
      this._setFiles(response, {
        add: false,
        remove: false,
        applyConfigurationUpdaters: true
      });
    }
    return response;
  },
  _setFiles: function (response, options) {
    this.fileTypes.each(function (fileType) {
      var filesAttributes = response[fileType.collectionName];
      if (options.merge !== false) {
        filesAttributes = _.map(filesAttributes, function (fileAttributes) {
          return _.omit(fileAttributes, 'display_name', 'rights');
        });
      }
      this.getFileCollection(fileType).set(filesAttributes, _.extend({
        fileType: fileType
      }, options));
      delete response[fileType.collectionName];
    }, this);
  },
  toJSON: function () {
    let metadataJSON = this.metadata.toJSON();
    let configJSON = this.metadata.configuration.toJSON();
    metadataJSON.configuration = configJSON;
    return metadataJSON;
  }
});

var AuthenticationProvider = Object$1.extend({
  authenticate: function (parent, provider) {
    this.authenticationPopup('/auth/' + provider, 800, 600);
    this.authParent = parent;
  },
  authenticationPopup: function (linkUrl, width, height) {
    var sep = linkUrl.indexOf('?') !== -1 ? '&' : '?',
      url = linkUrl + sep + 'popup=true',
      left = (screen.width - width) / 2 - 16,
      top = (screen.height - height) / 2 - 50,
      windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
    return window.open(url, 'authPopup', windowFeatures);
  },
  authenticateCallback: function () {
    this.authParent.authenticateCallback();
  }
});
const authenticationProvider = new AuthenticationProvider();

const FileImport = Backbone.Model.extend({
  modelName: 'file_import',
  action: 'search',
  url: function () {
    var slug = this.get('currentEntry').get('slug');
    return '/editor/entries/' + slug + '/file_import/' + this.importer.key + '/' + this.action;
  },
  initialize: function (options) {
    this.importer = options.importer;
    this.set('selectedFiles', []);
    this.set('currentEntry', options.currentEntry);
    this.authenticationInterval = setInterval(this.authenticate.bind(this), 2000);
  },
  authenticate: function () {
    if (!this.popUped) {
      if (this.importer.authenticationRequired) {
        authenticationProvider.authenticate(this, this.importer.authenticationProvider);
        this.popUped = true;
      } else {
        this.authenticateCallback();
      }
    }
  },
  authenticateCallback: function () {
    clearInterval(this.authenticationInterval);
    this.set('isAuthenticated', true);
    this.importer.authenticationRequired = false;
    this.popUped = false;
  },
  createFileImportDialogView: function () {
    return this.importer.createFileImportDialogView(this);
  },
  select: function (options) {
    if (options instanceof Backbone.Model) {
      this.get('selectedFiles').push(options);
      this.trigger('change');
    }
  },
  unselect: function (options) {
    var index = this.get('selectedFiles').indexOf(options);
    this.get('selectedFiles').splice(index, 1);
    this.trigger('change');
  },
  clearSelections: function () {
    this.set('selectedFiles', []);
  },
  search: function (query) {
    this.action = 'search/?query=' + query;
    return this.fetchData();
  },
  fetchData: function (options) {
    return this.fetch(options).then(function (data) {
      if (data && data.data) {
        return data.data;
      }
    });
  },
  getFilesMetaData: function (options) {
    this.action = 'files_meta_data';
    var selectedFiles = this.get('selectedFiles');
    for (var i = 0; i < selectedFiles.length; i++) {
      selectedFiles[i] = selectedFiles[i].toJSON();
    }
    return this.fetch({
      data: {
        files: selectedFiles
      },
      postData: true,
      type: 'POST'
    }).then(function (data) {
      if (data && data.data) {
        return data.data;
      } else {
        return undefined;
      }
    });
  },
  cancelImport: function (collectionName) {
    var selections = state.files[collectionName].uploadable();
    selections.each(function (selection) {
      selection.destroy();
    });
    selections.clear();
  },
  startImportJob: function (collectionName) {
    this.action = 'start_import_job';
    const fileType = editor.fileTypes.findByCollectionName(collectionName);
    const currentEntry = this.get('currentEntry');
    const selections = currentEntry.getFileCollection(fileType).uploadable();
    this.sync('create', this, {
      attrs: {
        collection: collectionName,
        files: selections.toJSON().map((item, index) => ({
          ...item,
          url: selections.at(index).get('source_url')
        }))
      },
      success: function (items) {
        items.forEach(item => {
          const file = selections.find(file => file.get('source_url') == item.source_url);
          if (file) {
            file.set(item.attributes);
          }
        });
      }
    });
  }
});

const FileFolder = Backbone.Model.extend({
  // Folders at the top level have no parent, which lets code comparing
  // parents rely on the attribute being present.
  defaults: {
    parent_folder_perma_id: null
  },
  modelName: 'file_folder',
  paramRoot: 'file_folder',
  i18nKey: 'pageflow/file_folder',
  mixins: [failureTracking, delayedDestroying],
  initialize: function () {
    this.listenTo(this, 'change:name change:parent_folder_perma_id', function () {
      if (!this.isNew()) {
        this.save();
      }
    });
  },
  urlRoot: function () {
    return this.collection.url();
  },
  title: function () {
    return this.get('name');
  },
  destroy: function () {
    return this.destroyWithDelay();
  }
});

const ChaptersCollection = Backbone.Collection.extend({
  model: Chapter,
  url: '/chapters',
  comparator: function (chapter) {
    return chapter.get('position');
  }
});

/**
 * A Backbone collection that is automatically updated to only
 * contain models with a foreign key matching the id of a parent
 * model.
 *
 * @param {Object} options
 * @param {Backbone.Model} options.parentModel -
 *   Model whose id is compared to foreign keys.
 * @param {Backbone.Collection} options.parent -
 *   Collection to filter items with matching foreign key from.
 * @param {String} options.foreignKeyAttribute -
 *   Attribute to compare to id of parent model.
 * @param {String} options.parentReferenceAttribute -
 *   Set reference to parent model on models in collection.
 *
 * @since 15.1
 */
const ForeignKeySubsetCollection = SubsetCollection.extend({
  mixins: [orderedCollection],
  constructor: function (options) {
    var parent = options.parent;
    var parentModel = options.parentModel;
    this.autoConsolidatePositions = options.autoConsolidatePositions;
    this.listenTo(this, 'add', function (model) {
      if (options.parentReferenceAttribute) {
        model[options.parentReferenceAttribute] = parentModel;
      }
      model.set(options.foreignKeyAttribute, parentModel.id);
    });
    SubsetCollection.prototype.constructor.call(this, {
      parent,
      parentModel,
      watchAttribute: options.foreignKeyAttribute,
      filter: function (item) {
        return !parentModel.isNew() && item.get(options.foreignKeyAttribute) === parentModel.id;
      },
      comparator: function (item) {
        return item.get('position');
      }
    });
    this.listenTo(parentModel, 'destroy dependentDestroy', function () {
      this.invoke('trigger', 'dependentDestroy');
      this.clear();
    });
    if (options.parentReferenceAttribute) {
      this.each(model => model[options.parentReferenceAttribute] = parentModel);
      this.listenTo(this, 'remove', function (model) {
        if (model[options.parentReferenceAttribute] === parentModel) {
          model[options.parentReferenceAttribute] = null;
        }
      });
    }
  }
});

const PageLinksCollection = Backbone.Collection.extend({
  model: PageLink,
  initialize: function (models, options) {
    this.configuration = options.configuration;
    this.page = options.configuration.page;
    this.load();
    this.listenTo(this, 'add remove change', this.save);
    this.listenTo(this.configuration, 'change:page_links', this.load);
  },
  addLink: function (targetPageId) {
    this.addWithPosition(this.defaultPosition(), targetPageId);
  },
  canAddLink: function (targetPageId) {
    return true;
  },
  updateLink: function (link, targetPageId) {
    link.set('target_page_id', targetPageId);
  },
  removeLink: function (link) {
    this.remove(link);
  },
  addWithPosition: function (position, targetPageId) {
    this.add(this.pageLinkAttributes(position, targetPageId));
  },
  removeByPosition: function (position) {
    this.remove(this.findByPosition(position));
  },
  findByPosition: function (position) {
    return this.findWhere({
      position: position
    });
  },
  load: function () {
    this.set(this.pageLinksAttributes());
  },
  save: function () {
    this.configuration.set('page_links', this.map(function (pageLink) {
      return pageLink.toSerializedJSON();
    }));
  },
  defaultPosition: function () {
    return Math.max(0, _.max(this.map(function (pageLink) {
      return pageLink.get('position');
    }))) + 1;
  },
  pageLinksAttributes: function () {
    return this.configuration.get('page_links') || [];
  },
  pageLinkAttributes: function (position, targetPageId, id) {
    return {
      id: id || this.getUniqueId(),
      target_page_id: targetPageId,
      position: position
    };
  },
  /** @private */
  getUniqueId: function () {
    var maxId = Math.max(0, _.max(this.map(function (pageLink) {
      return parseInt(pageLink.id.split(':').pop(), 10);
    })));
    return this.configuration.page.get('perma_id') + ':' + (maxId + 1);
  }
});

const OtherEntriesCollection = Backbone.Collection.extend({
  model: OtherEntry,
  url: '/editor/entries',
  initialize: function (models, options) {
    options = options || {};
    this.excludeEntry = options.excludeEntry;
  },
  // override parse method to exclude the entry being edited. This is the collection
  // of the "other" entries, after all.
  parse: function (response) {
    var excludeEntry = this.getExcludeEntry(),
      filteredResponse = _.filter(response, function (entry) {
        return entry.id != excludeEntry.id;
      });
    return Backbone.Collection.prototype.parse.call(this, filteredResponse);
  },
  getExcludeEntry: function () {
    return this.excludeEntry || state.entry;
  }
});

const StorylinesCollection = Backbone.Collection.extend({
  autoConsolidatePositions: false,
  mixins: [orderedCollection],
  model: Storyline,
  url: function () {
    return '/entries/' + state.entry.get('id') + '/storylines';
  },
  initialize: function () {
    this.listenTo(this, 'change:main', function (model, value) {
      if (value) {
        this.each(function (storyline) {
          if (storyline.isMain() && storyline !== model) {
            storyline.configuration.unset('main');
          }
        });
      }
    });
  },
  main: function () {
    return this.find(function (storyline) {
      return storyline.configuration.get('main');
    }) || this.first();
  },
  comparator: function (chapter) {
    return chapter.get('position');
  }
});

const OrderedPageLinksCollection = PageLinksCollection.extend({
  comparator: 'position',
  saveOrder: function () {
    this.save();
  }
});

const PagesCollection = Backbone.Collection.extend({
  model: Page,
  url: '/pages',
  comparator: function (pageA, pageB) {
    if (pageA.storylinePosition() > pageB.storylinePosition()) {
      return 1;
    } else if (pageA.storylinePosition() < pageB.storylinePosition()) {
      return -1;
    } else if (pageA.chapterPosition() > pageB.chapterPosition()) {
      return 1;
    } else if (pageA.chapterPosition() < pageB.chapterPosition()) {
      return -1;
    } else if (pageA.get('position') > pageB.get('position')) {
      return 1;
    } else if (pageA.get('position') < pageB.get('position')) {
      return -1;
    } else {
      return 0;
    }
  },
  getByPermaId: function (permaId) {
    return this.findWhere({
      perma_id: parseInt(permaId, 10)
    });
  },
  persisted: function () {
    if (!this._persisted) {
      this._persisted = new SubsetCollection({
        parent: this,
        sortOnParentSort: true,
        filter: function (page) {
          return !page.isNew();
        }
      });
      this.listenTo(this, 'change:id', function (model) {
        setTimeout(_.bind(function () {
          this._persisted.add(model);
        }, this), 0);
      });
    }
    return this._persisted;
  }
});

const ThemesCollection = Backbone.Collection.extend({
  model: Theme,
  findByName: function (name) {
    var theme = this.findWhere({
      name: name
    });
    if (!theme) {
      throw new Error('Found no theme by name ' + name);
    }
    return theme;
  }
});

const WidgetsCollection = Backbone.Collection.extend({
  model: Widget,
  initialize: function (widgets, options) {
    this.widgetTypes = options.widgetTypes;
    this.listenTo(this, 'change:type_name change:configuration', function () {
      this.batchSave();
    });
  },
  url: function () {
    return '/editor/subjects/entries/' + this.subject.id + '/widgets';
  },
  batchSave: function (options) {
    var subject = this.subject;
    return Backbone.sync('patch', subject, _.extend(options || {}, {
      url: this.url() + '/batch',
      attrs: {
        widgets: this.map(function (widget) {
          return widget.toJSON();
        })
      },
      success: function (response) {
        subject.trigger('sync:widgets', subject, response, {});
      }
    }));
  },
  setupConfigurationEditorTabViewGroups(groups) {
    this.defineConfigurationEditorTabViewGroups(groups);
    this.listenTo(this, 'change:type_name', () => this.defineConfigurationEditorTabViewGroups(groups));
  },
  defineConfigurationEditorTabViewGroups(groups) {
    this.widgetTypes.defineStubConfigurationEditorTabViewGroups(groups);
    this.each(widget => widget.defineConfigurationEditorTabViewGroups(groups));
  },
  withWidgetType(properties) {
    return new SubsetCollection({
      parent: this,
      watchAttribute: 'type_name',
      filter: widget => {
        const widgetType = widget.widgetType();
        return !!widgetType && Object.keys(properties).every(name => widgetType[name] === properties[name]);
      }
    });
  }
});

const addAndReturnModel = {
  // Backbone's add does not return the added model. push returns the
  // model but does not trigger sort.
  addAndReturnModel: function (model, options) {
    model = this._prepareModel(model, options);
    this.add(model, options);
    return model;
  }
};
Cocktail.mixin(Backbone.Collection, addAndReturnModel);

const CombinedFilesCollection = Backbone.Collection.extend({
  constructor: function (options) {
    this.collections = options.collections;
    Backbone.Collection.prototype.constructor.call(this, _.flatten(_.pluck(this.collections, 'models'), true));
    _.each(this.collections, function (collection) {
      this.listenTo(collection, 'add', function (file) {
        this.add(file);
      });
      this.listenTo(collection, 'remove', function (file) {
        this.remove(file);
      });
    }, this);
  },
  comparator: byFileName,
  get: function (file) {
    if (file != null && !file.cid) {
      throw new Error('Cannot look up files by id in combined files collections since files ' + 'of different types can share ids. Pass a file instead.');
    }
    return cidBasedGet.call(this, file);
  },
  dispose: function () {
    this.stopListening();
    this.reset();
  }
});

// Each collection keeps its own order, so that its models stay together
// as one section of the list.
const ConcatenatedCollection = Backbone.Collection.extend({
  get: cidBasedGet,
  constructor: function (options) {
    this.collections = options.collections;
    Backbone.Collection.prototype.constructor.call(this, this.allModels());
    _.each(this.collections, function (collection) {
      this.listenTo(collection, 'add', function (model) {
        this.add(model);
      });
      this.listenTo(collection, 'remove', function (model) {
        this.remove(model);
      });
      this.listenTo(collection, 'sort', function () {
        this.sort();
      });
    }, this);
  },
  comparator: function (model) {
    return this.positions[model.cid];
  },
  // Looking up the position of each model while comparing would turn
  // every insert into a quadratic sort. Backbone sorts whenever models
  // are added, which keeps the positions up to date.
  sort: function (options) {
    this.positions = {};
    this.allModels().forEach(function (model, index) {
      this.positions[model.cid] = index;
    }, this);
    return Backbone.Collection.prototype.sort.call(this, options);
  },
  allModels: function () {
    return _.flatten(_.pluck(this.collections, 'models'), true);
  },
  dispose: function () {
    this.stopListening();
    this.reset();
  }
});

const ListSelection = Backbone.Collection.extend({
  get: cidBasedGet,
  // Checking items stays switched on until it is switched off again,
  // even while nothing is checked. Unchecking the last item would
  // otherwise pull the check boxes away from under the pointer.
  start: function () {
    this.selecting = true;
    this.trigger('change:selecting');
  },
  stop: function () {
    this.selecting = false;
    this.reset();
    this.trigger('change:selecting');
  },
  isSelecting: function () {
    return !!this.selecting;
  },
  toggle: function (item) {
    if (this.includes(item)) {
      this.remove(item);
    } else {
      this.add(item);
    }
  },
  includes: function (item) {
    return !!this.get(item);
  },
  // Iterating a copy since destroying an item takes it out of the list,
  // which drops it from the selection and would skip the item behind it.
  destroyAll: function () {
    this.models.slice().forEach(function (item) {
      item.destroy();
    });
  }
});

const FileFoldersCollection = Backbone.Collection.extend({
  model: FileFolder,
  initialize: function (models, options) {
    this.entry = (options || {}).entry;
  },
  comparator: function (folder) {
    return (folder.get('name') || '').toLowerCase();
  },
  url: function () {
    return '/editor/entries/' + this.getEntry().get('id') + '/file_folders';
  },
  getEntry: function () {
    return this.entry || state.entry;
  },
  // Perma ids are numbers everywhere in the editor, but folders can also
  // be looked up by the string a route hands over. Blank means that no
  // folder is meant.
  byPermaId: function (permaId) {
    if (permaId === null || permaId === undefined || permaId === '') {
      return;
    }
    var number = Number(permaId);
    return this.find(function (folder) {
      return folder.get('perma_id') === number;
    });
  },
  parentOf: function (folder) {
    return this.byPermaId(folder.get('parent_folder_perma_id'));
  },
  // Broken data with a folder nested inside one of its own descendants
  // would make walking up the tree loop forever.
  ancestorsOf: function (folder) {
    var result = [];
    var current = this.parentOf(folder);
    while (current && result.indexOf(current) < 0) {
      result.unshift(current);
      current = this.parentOf(current);
    }
    return result;
  },
  childrenOf: function (folder) {
    var permaId = folder ? folder.get('perma_id') : null;
    return this.filter(function (other) {
      return other.get('parent_folder_perma_id') === permaId;
    });
  },
  // The server refuses to delete a folder which still holds files or
  // subfolders, empty subfolders included.
  isEmptyFolder: function (folder, files) {
    var permaId = folder.get('perma_id');
    return !this.childrenOf(folder).length && !files.some(function (file) {
      return file.get('folder_perma_id') === permaId;
    });
  },
  descendantPermaIdsOf: function (folder) {
    return this.collectDescendantPermaIds(folder, []);
  },
  // Broken data with a folder nested inside one of its own descendants
  // would make walking down the tree recurse forever.
  collectDescendantPermaIds: function (folder, result) {
    if (result.indexOf(folder.get('perma_id')) >= 0) {
      return result;
    }
    result.push(folder.get('perma_id'));
    this.childrenOf(folder).forEach(function (child) {
      this.collectDescendantPermaIds(child, result);
    }, this);
    return result;
  }
});

const SidebarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'widgets/:id': 'widget',
    'files/:collectionName(/folders/:folderPermaId)?handler=:handler&payload=:payload&filter=:filter': 'files',
    'files(/:collectionName)(/folders/:folderPermaId)?handler=:handler&payload=:payload': 'files',
    'files(/:collectionName)(/folders/:folderPermaId)': 'files',
    'confirmable_files?type=:type&id=:id': 'confirmableFiles',
    'confirmable_files': 'confirmableFiles',
    'meta_data': 'metaData',
    'meta_data/:tab': 'metaData',
    'defaults': 'defaults',
    'publish': 'publish',
    '?storyline=:id': 'index',
    '.*': 'index'
  }
});

function template$2(data) {
var __t, __p = '';
__p += '<a class="back">' +
((__t = ( I18n.t('pageflow.editor.templates.back_button_decorator.outline') )) == null ? '' : __t) +
'</a>\n<div class="outlet"></div>\n';
return __p
}

const BackButtonDecoratorView = Marionette.Layout.extend({
  template: template$2,
  className: 'back_button_decorator',
  events: {
    'click a.back': 'goBack'
  },
  regions: {
    outlet: '.outlet'
  },
  onRender: function () {
    this.outlet.show(this.options.view);
  },
  goBack: function () {
    this.options.view.onGoBack && this.options.view.onGoBack();
    editor.navigate('/', {
      trigger: true
    });
  }
});

function template$3(data) {
var __t, __p = '';
__p += '<input type="checkbox">\n<label class="file_name"></label>\n<span class="duration"></span>\n\n<div class="actions">\n  <a class="remove" title="' +
((__t = ( I18n.t('pageflow.editor.templates.confirmable_file_item.remove') )) == null ? '' : __t) +
'"></a>\n</div>\n';
return __p
}

const ConfirmableFileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template: template$3,
  ui: {
    fileName: '.file_name',
    duration: '.duration',
    label: 'label',
    checkBox: 'input',
    removeButton: '.remove'
  },
  events: {
    'click .remove': 'destroy',
    'change input': 'updateSelection'
  },
  onRender: function () {
    this.ui.label.attr('for', this.cid);
    this.ui.checkBox.attr('id', this.cid);
    this.ui.checkBox.prop('checked', this.options.selectedFiles.contains(this.model));
    this.ui.fileName.text(this.model.title());
    this.ui.duration.text(this.model.get('duration') || '-');
  },
  destroy: function () {
    if (window.confirm(I18n$1.t('pageflow.editor.views.confirmable_file_item_view.confirm_destroy'))) {
      this.model.destroy();
    }
  },
  updateSelection: function () {
    if (this.ui.checkBox.is(':checked')) {
      this.options.selectedFiles.add(this.model);
    } else {
      this.options.selectedFiles.remove(this.model);
    }
  }
});

function template$4(data) {
var __t, __p = '';
__p += '<div class="blank_slate">\n  <p>\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_encoding.all_released') )) == null ? '' : __t) +
'\n  </p>\n  <p>\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_encoding.link_to_progress', {
            link: '<a href="#/files/video_files">'+I18n.t('pageflow.editor.templates.confirm_encoding.manage_files')+'</a>'})
      )) == null ? '' : __t) +
'\n  </p>\n</div>\n\n<div class="intro">\n</div>\n\n<div class="video_files_panel">\n  <h2 class="sidebar-header">\n    ' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_encoding.videos_tab') )) == null ? '' : __t) +
'\n  </h2>\n</div>\n\n<div class="audio_files_panel">\n  <h2 class="sidebar-header">\n    ' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_encoding.audios_tab') )) == null ? '' : __t) +
'\n  </h2>\n</div>\n\n<div class="summary">\n</div>\n<button class="confirm">' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_encoding.confirm_button') )) == null ? '' : __t) +
'</button>\n';
return __p
}

const ConfirmEncodingView = Marionette.ItemView.extend({
  template: template$4,
  className: 'confirm_encoding',
  ui: {
    blankSlate: '.blank_slate',
    videoFilesPanel: '.video_files_panel',
    audioFilesPanel: '.audio_files_panel',
    summary: '.summary',
    intro: '.intro',
    confirmButton: 'button'
  },
  events: {
    'click button': function () {
      this.model.saveAndReset();
    }
  },
  initialize: function () {
    this.confirmableVideoFiles = state.videoFiles.confirmable();
    this.confirmableAudioFiles = state.audioFiles.confirmable();
  },
  onRender: function () {
    this.listenTo(this.model, 'change', this.updateSummary);
    this.listenTo(this.confirmableAudioFiles, 'add remove', this.updateBlankSlate);
    this.listenTo(this.confirmableVideoFiles, 'add remove', this.updateBlankSlate);
    this.ui.videoFilesPanel.append(this.subview(new CollectionView({
      tagName: 'ul',
      className: 'confirmable_files',
      collection: this.confirmableVideoFiles,
      itemViewConstructor: ConfirmableFileItemView,
      itemViewOptions: {
        selectedFiles: this.model.videoFiles
      }
    })).el);
    this.ui.audioFilesPanel.append(this.subview(new CollectionView({
      tagName: 'ul',
      className: 'confirmable_files',
      collection: this.confirmableAudioFiles,
      itemViewConstructor: ConfirmableFileItemView,
      itemViewOptions: {
        selectedFiles: this.model.audioFiles
      }
    })).el);
    this.update();
  },
  update: function () {
    this.updateBlankSlate();
    this.updateSummary();
  },
  updateBlankSlate: function () {
    this.ui.blankSlate.toggle(!this.confirmableVideoFiles.length && !this.confirmableAudioFiles.length);
    this.ui.intro.toggle(!!this.confirmableVideoFiles.length || !!this.confirmableAudioFiles.length);
    this.ui.videoFilesPanel.toggle(!!this.confirmableVideoFiles.length);
    this.ui.audioFilesPanel.toggle(!!this.confirmableAudioFiles.length);
  },
  updateSummary: function (enabled) {
    this.ui.intro.html(this.model.get('intro_html'));
    this.ui.summary.html(this.model.get('summary_html'));
    this.ui.confirmButton.toggleClass('checking', !!this.model.get('checking'));
    if (this.model.get('empty') || this.model.get('exceeding') || this.model.get('checking')) {
      this.ui.confirmButton.attr('disabled', true);
    } else {
      this.ui.confirmButton.removeAttr('disabled');
    }
  }
});
ConfirmEncodingView.create = function (options) {
  return new BackButtonDecoratorView({
    view: new ConfirmEncodingView(options)
  });
};

/**
 * Mixin for Marionette Views that sets css class names according to
 * life cycle events of its model.
 *
 * @param {Object} options
 * @param {Object} options.classNames
 * @param {String} options.classNames.creating -
 *   Class name to add to root element while model is still being created.
 * @param {String} options.classNames.destroying -
 *   Class name to add to root element while model is being destroyed.
 * @param {String} options.classNames.failed -
 *   Class name to add to root element while model is in failed state.
 *   Model needs to include {@link failureTracking} mixin.
 * @param {String} options.classNames.failureMessage -
 *   Class name of the element that shall be updated with the failure
 *   message. Model needs to include {@link failureTracking} mixin.
 * @param {String} options.classNames.retryButton -
 *   Class name of the element that shall act as a retry button.
 */
function modelLifecycleTrackingView({
  classNames
}) {
  return {
    events: {
      [`click .${classNames.retryButton}`]: function () {
        editor.failures.retry();
        return false;
      }
    },
    initialize() {
      if (classNames.creating) {
        this.listenTo(this.model, 'change:id', function () {
          this.$el.removeClass(classNames.creating);
        });
      }
      if (classNames.destroying) {
        this.listenTo(this.model, 'destroying', function () {
          this.$el.addClass(classNames.destroying);
        });
        this.listenTo(this.model, 'error', function () {
          this.$el.removeClass(classNames.destroying);
        });
      }
      if (classNames.failed || classNames.failureMessage) {
        this.listenTo(this.model, 'change:failed', () => this.updateFailIndicator());
      }
    },
    render() {
      if (this.model.isNew()) {
        this.$el.addClass(classNames.creating);
      }
      if (this.model.isDestroying && this.model.isDestroying()) {
        this.$el.addClass(classNames.destroying);
      }
      this.updateFailIndicator();
    },
    updateFailIndicator: function () {
      if (classNames.failed && this.model.isFailed) {
        this.$el.toggleClass(classNames.failed, this.model.isFailed());
      }
      if (classNames.failureMessage && this.model.getFailureMessage) {
        this.$el.find(`.${classNames.failureMessage}`).text(this.model.getFailureMessage());
      }
    }
  };
}

const failureIndicatingView = modelLifecycleTrackingView({
  classNames: {
    failed: 'failed',
    failureMessage: 'failure .message',
    retryButton: 'retry'
  }
});

function template$5(data) {
var __t, __p = '';
__p += '<a class="close" href="#">' +
((__t = ( I18n.t('pageflow.editor.templates.edit_entry.close') )) == null ? '' : __t) +
'</a>\n<a class="publish" href="#" data-tooltip-align="bottom right">\n  ' +
((__t = ( I18n.t('pageflow.editor.templates.edit_entry.publish') )) == null ? '' : __t) +
'\n</a>\n\n<ul class="menu">\n  <li>\n    <a class="edit_entry_meta_data" href="#" data-path="/meta_data">' +
((__t = ( I18n.t('pageflow.editor.templates.edit_entry.metadata') )) == null ? '' : __t) +
'</a>\n    <span class="failure_icon" title="' +
((__t = ( I18n.t('pageflow.editor.templates.edit_entry.save_error') )) == null ? '' : __t) +
'" />\n  </li>\n  <li>\n    <a class="manage_files" href="#" data-path="/files">' +
((__t = ( I18n.t('pageflow.editor.templates.edit_entry.manage_files') )) == null ? '' : __t) +
'</a>\n  </li>\n</ul>\n\n<div class="edit_entry_outline_region"></div>\n';
return __p
}

const EditEntryView = Marionette.Layout.extend({
  template: template$5,
  mixins: [failureIndicatingView, tooltipContainer],
  ui: {
    publishButton: 'a.publish',
    publicationStateButton: 'a.publication_state',
    menu: '.menu'
  },
  regions: {
    outlineRegion: '.edit_entry_outline_region'
  },
  events: {
    'click a.close': function () {
      $.when(state.editLock.release()).then(function () {
        window.location = '/admin/entries/' + state.entry.id;
      });
    },
    'click a.publish': function () {
      if (!this.ui.publishButton.hasClass('disabled')) {
        editor.navigate('/publish', {
          trigger: true
        });
      }
      return false;
    },
    'click .menu a': function (event) {
      editor.navigate($(event.target).data('path'), {
        trigger: true
      });
      return false;
    }
  },
  onRender: function () {
    this._addMenuItems();
    this._updatePublishButton();
    this.outlineRegion.show(new editor.entryType.outlineView({
      entry: state.entry,
      navigatable: true,
      editable: true,
      displayInNavigationHint: true,
      rememberLastSelection: true,
      storylineId: this.options.storylineId
    }));
  },
  _updatePublishButton: function () {
    var disabled = !this.model.get('publishable');
    this.ui.publishButton.toggleClass('disabled', disabled);
    if (disabled) {
      this.ui.publishButton.attr('data-tooltip', 'pageflow.editor.views.edit_entry_view.cannot_publish');
    } else {
      this.ui.publishButton.removeAttr('data-tooltip');
    }
  },
  _addMenuItems: function () {
    var view = this;
    _.each(editor.mainMenuItems, function (options) {
      var item = $('<li><a href="#"></a></li>');
      var link = item.find('a');
      if (options.path) {
        link.data('path', options.path);
      }
      if (options.id) {
        link.attr('data-main-menu-item', options.id);
      }
      link.text(I18n$1.t(options.translationKey));
      if (options.click) {
        $(link).click(options.click);
      }
      if (options.indicatorAttribute) {
        view._bindMenuItemIndicator(link, options.indicatorAttribute);
      }
      view.ui.menu.append(item);
    });
  },
  _bindMenuItemIndicator: function (link, attribute) {
    var view = this;
    var update = function () {
      link.toggleClass('indicator', !!view.model.get(attribute));
    };
    this.listenTo(this.model, 'change:' + attribute, update);
    update();
  }
});

const EditDefaultsInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: 'edit_defaults_button',
  template: () => `
    <button>
      ${I18n$1.t('pageflow.editor.views.inputs.edit_defaults_input_view.label')}
    </button>
  `,
  events: {
    'click button': function () {
      this.options.editor.navigate('/defaults', {
        trigger: true
      });
    }
  }
});

function template$6(data) {
var __t, __p = '';
__p += '<div class="widget_type">\n</div>\n<a class="settings" title="' +
((__t = ( I18n.t('pageflow.editor.templates.widget_item.settings') )) == null ? '' : __t) +
'"></a>\n';
return __p
}

const WidgetItemView = Marionette.Layout.extend({
  template: template$6,
  tagName: 'li',
  className: 'widget_item',
  regions: {
    widgetTypeContainer: '.widget_type'
  },
  modelEvents: {
    'change:type_name': 'update'
  },
  events: {
    'click .settings': function () {
      editor.navigate('/widgets/' + this.model.role(), {
        trigger: true
      });
      return false;
    }
  },
  onRender: function () {
    var widgetTypes = this.options.widgetTypes.findAllByRole(this.model.role()) || [];
    var isOptional = this.options.widgetTypes.isOptional(this.model.role());
    this.widgetTypeContainer.show(new SelectInputView({
      model: this.model,
      propertyName: 'type_name',
      label: I18n$1.t('pageflow.widgets.roles.' + this.model.role()),
      collection: widgetTypes,
      valueProperty: 'name',
      translationKeyProperty: 'translationKey',
      includeBlank: isOptional || !this.model.get('type_name')
    }));
    this.$el.toggleClass('is_hidden', widgetTypes.length <= 1 && !this.model.hasConfiguration() && !isOptional);
    this.update();
  },
  update: function () {
    this.$el.toggleClass('has_settings', this.model.hasConfiguration());
  }
});

function template$7(data) {
var __p = '';
__p += '<ol class="widgets">\n</ol>\n';
return __p
}

const EditWidgetsView = Marionette.Layout.extend({
  template: template$7,
  ui: {
    widgets: '.widgets'
  },
  onRender: function () {
    this.subview(new CollectionView({
      el: this.ui.widgets,
      collection: this.model.widgets,
      itemViewConstructor: WidgetItemView,
      itemViewOptions: {
        widgetTypes: this.options.widgetTypes
      }
    }).render());
  }
});

function template$8(data) {
var __p = '';
__p += '<div class="image"></div>\n<div class="label"></div>\n';
return __p
}

const BackgroundPositioningPreviewView = Marionette.ItemView.extend({
  template: template$8,
  className: 'preview',
  modelEvents: {
    change: 'update'
  },
  ui: {
    image: '.image',
    label: '.label'
  },
  onRender: function () {
    this.renderFile();
    this.update();
  },
  // File types can crop the file themselves, which is the only way to
  // preview files that have no image to position on the server.
  renderFile: function () {
    var file = this.file();
    this.positioningView = file && file.createPositioningView({
      fit: 'cover'
    });
    if (this.positioningView) {
      this.appendSubview(this.positioningView, {
        to: this.ui.image
      });
    }
  },
  update: function () {
    var ratio = this.options.ratio;
    var max = this.options.maxSize;
    var width = ratio > 1 ? max : max * ratio;
    var height = ratio > 1 ? max / ratio : max;
    this.ui.image.css({
      width: width + 'px',
      height: height + 'px'
    });
    if (this.positioningView) {
      this.positioningView.setPosition(this.model.getFilePosition(this.options.propertyName, 'x'), this.model.getFilePosition(this.options.propertyName, 'y'));
    }
    this.ui.label.text(this.options.label);
  },
  file: function () {
    return this.model.getReference(this.options.propertyName, this.options.filesCollection);
  }
});

function template$9(data) {
var __p = '';
__p += '<div class="container">\n  <div class="file"></div>\n  <div class="slider horizontal">\n  </div>\n  <div class="slider vertical">\n  </div>\n  <div class="percent horizontal">\n    <input type="number" min="0" max="100">\n    %\n  </div>\n  <div class="percent vertical">\n    <input type="number" min="0" max="100">\n    %\n  </div>\n</div>\n';
return __p
}

const BackgroundPositioningSlidersView = Marionette.ItemView.extend({
  template: template$9,
  className: '',
  ui: {
    container: '.container',
    file: '.file',
    sliderHorizontal: '.horizontal.slider',
    sliderVertical: '.vertical.slider',
    inputHorizontal: '.percent.horizontal input',
    inputVertical: '.percent.vertical input'
  },
  events: {
    'mousedown .file': function (event) {
      var view = this;
      view.saveFromEvent(event);
      function onMove(event) {
        view.saveFromEvent(event);
      }
      function onUp() {
        $('.background_positioning.dialog').off('mousemove', onMove).off('mouseup', onUp);
      }
      $('.background_positioning.dialog').on('mousemove', onMove).on('mouseup', onUp);
    },
    'dragstart .file': function (event) {
      event.preventDefault();
    }
  },
  modelEvents: {
    change: 'update'
  },
  onRender: function () {
    var view = this;
    this.renderFile();
    this.ui.sliderVertical.slider({
      orientation: 'vertical',
      change: function (event, ui) {
        view.save('y', 100 - ui.value);
      },
      slide: function (event, ui) {
        view.save('y', 100 - ui.value);
      }
    });
    this.ui.sliderHorizontal.slider({
      orientation: 'horizontal',
      change: function (event, ui) {
        view.save('x', ui.value);
      },
      slide: function (event, ui) {
        view.save('x', ui.value);
      }
    });
    this.ui.inputVertical.on('change', function () {
      view.save('y', $(this).val());
    });
    this.ui.inputHorizontal.on('change', function () {
      view.save('x', $(this).val());
    });
    this.update();
  },
  // File types can render the file themselves, which is the only way
  // to display files that do not have an image to position on the
  // server.
  renderFile: function () {
    var file = this.model.getReference(this.options.propertyName, this.options.filesCollection);
    this.appendSubview(file.createPositioningView({
      fit: 'contain'
    }), {
      to: this.ui.file
    });
  },
  update: function () {
    var x = this.model.getFilePosition(this.options.propertyName, 'x');
    var y = this.model.getFilePosition(this.options.propertyName, 'y');
    this.ui.sliderVertical.slider('value', 100 - y);
    this.ui.sliderHorizontal.slider('value', x);
    this.ui.inputVertical.val(y);
    this.ui.inputHorizontal.val(x);
  },
  saveFromEvent: function (event) {
    var x = event.pageX - this.ui.container.offset().left;
    var y = event.pageY - this.ui.container.offset().top;
    this.save('x', Math.round(x / this.ui.container.width() * 100));
    this.save('y', Math.round(y / this.ui.container.width() * 100));
  },
  save: function (coord, value) {
    this.model.setFilePosition(this.options.propertyName, coord, Math.min(100, Math.max(0, value)));
  }
});

function template$a(data) {
var __t, __p = '';
__p += '<div class="box">\n  <div class="content">\n    <h2 class="dialog-header">' +
((__t = ( I18n.t('pageflow.editor.templates.background_positioning.title') )) == null ? '' : __t) +
'</h2>\n    <p class="dialog-hint">' +
((__t = ( I18n.t('pageflow.editor.templates.background_positioning.help') )) == null ? '' : __t) +
'</p>\n\n    <div class="wrapper">\n    </div>\n\n    <h3>' +
((__t = ( I18n.t('pageflow.editor.templates.background_positioning.preview_title') )) == null ? '' : __t) +
'</h3>\n    <div class="previews">\n      <div>\n      </div>\n    </div>\n  </div>\n\n  <div class="footer">\n    <a href="" class="save">' +
((__t = ( I18n.t('pageflow.editor.templates.background_positioning.save') )) == null ? '' : __t) +
'</a>\n    <a href="" class="close">' +
((__t = ( I18n.t('pageflow.editor.templates.background_positioning.cancel') )) == null ? '' : __t) +
'</a>\n  </div>\n</div>\n';
return __p
}

const BackgroundPositioningView = Marionette.ItemView.extend({
  template: template$a,
  className: 'background_positioning editor dialog',
  mixins: [dialogView],
  ui: {
    previews: '.previews > div',
    wrapper: '.wrapper'
  },
  previews: {
    ratio16to9: 16 / 9,
    ratio16to9Portrait: 9 / 16,
    ratio4to3: 4 / 3,
    ratio4to3Portrait: 3 / 4,
    banner: 5 / 1
  },
  events: {
    'click .save': function () {
      this.save();
      this.close();
    }
  },
  initialize: function () {
    this.transientModel = this.model.clone();
  },
  onRender: function () {
    this.ui.wrapper.append(this.subview(new BackgroundPositioningSlidersView({
      model: this.transientModel,
      propertyName: this.options.propertyName,
      filesCollection: this.options.filesCollection
    })).el);
    this.createPreviews();
  },
  save: function () {
    this.model.setFilePositions(this.options.propertyName, this.transientModel.getFilePosition(this.options.propertyName, 'x'), this.transientModel.getFilePosition(this.options.propertyName, 'y'));
  },
  createPreviews: function () {
    var view = this;
    var previews = this.options.preview ? {
      preview: this.options.preview
    } : this.previews;
    _.each(previews, function (ratio, name) {
      view.ui.previews.append(view.subview(new BackgroundPositioningPreviewView({
        model: view.transientModel,
        propertyName: view.options.propertyName,
        filesCollection: view.options.filesCollection,
        ratio: ratio,
        maxSize: 200,
        label: I18n$1.t('pageflow.editor.templates.background_positioning.previews.' + name, {
          defaultValue: ''
        })
      })).el);
    });
  }
});
BackgroundPositioningView.open = function (options) {
  app.dialogRegion.show(new BackgroundPositioningView(options));
};

function template$b(data) {
var __p = '';
__p += '<div class="label"></div>\n<a href="#"></a>\n';
return __p
}

const DropDownButtonItemView = Marionette.ItemView.extend({
  template: template$b,
  tagName: 'li',
  className: 'drop_down_button_item',
  ui: {
    link: '> a',
    label: '> .label'
  },
  events: {
    'click > a': function (event) {
      if (!this.model.get('disabled')) {
        this.model.selected();
      }
      event.preventDefault();
      if (this.model.get('kind') === 'checkBox' || this.model.get('kind') === 'radio') {
        event.stopPropagation();
      }
    }
  },
  modelEvents: {
    change: 'update'
  },
  onRender: function () {
    this.update();
    if (this.model.get('items')) {
      this.appendSubview(new this.options.listView({
        items: this.model.get('items')
      }));
    }
  },
  update: function () {
    this.ui.link.text(this.model.get('label'));
    this.ui.label.text(this.model.get('label'));
    this.$el.toggleClass('is_selectable', !!this.model.selected);
    this.$el.toggleClass('is_disabled', !!this.model.get('disabled'));
    this.$el.toggleClass('is_hidden', !!this.model.get('hidden'));
    this.$el.toggleClass('has_check_box', this.model.get('kind') === 'checkBox');
    this.$el.toggleClass('has_radio', this.model.get('kind') === 'radio');
    this.$el.toggleClass('is_checked', !!this.model.get('checked'));
    this.$el.toggleClass('separated', !!this.model.get('separated'));
    this.$el.toggleClass('is_destructive', !!this.model.get('destructive'));
    this.$el.data('name', this.model.get('name'));
  }
});

const DropDownButtonItemListView = function (options) {
  return new CollectionView({
    tagName: 'ul',
    className: 'drop_down_button_items',
    collection: options.items,
    itemViewConstructor: DropDownButtonItemView,
    itemViewOptions: {
      listView: DropDownButtonItemListView
    }
  });
};

function template$c(data) {
var __p = '';
__p += '<button></button>\n\n<div class="drop_down_button_menu">\n</div>\n';
return __p
}

/**
 * A button that displays a drop down menu on hover.
 *
 * @param {Object} options
 *
 * @param {String} options.label
 *   Button text.
 *
 * @param {Backbone.Collection} options.items
 *   Collection of menu items. See below for supported attributes.
 *
 * @param {boolean} [options.fullWidth]
 *   Make button and drop down span 100% of available width.
 *
 * @param {boolean} [options.openOnClick]
 *   Require click to open menu. By default, menu opens on when the
 *   mouse enters the button.
 *
 * @param {String} [options.alignMenu]
 *   "right" to align menu on the right. Aligned on the left by
 *   default.
 *
 * @param {String} [options.buttonClassName]
 *   CSS class name for button element.
 *
 * ## Item Models
 *
 * The following model attributes can be used to control the
 * appearance of a menu item:
 *
 * - `name` - A name for the menu item which is not displayed.
 * - `label` - Used as menu item label.
 * - `disabled` - Make the menu item inactive.
 * - `checked` - Display a check mark in front of the item.
 * - `destructive` - Display with red hover state.
 * - `items` - A Backbone collection of nested menu items.
 *
 * If the menu item model provdised a `selected` method, it is called
 * when the menu item is clicked.
 *
 * @class
 */
const DropDownButtonView = Marionette.ItemView.extend({
  template: template$c,
  className: 'drop_down_button',
  ui: {
    button: '> button',
    menu: '.drop_down_button_menu'
  },
  events: function () {
    return {
      [this.options.openOnClick ? 'click' : 'mouseenter']: function () {
        this.positionMenu();
        this.showMenu();
      },
      'mouseleave': function () {
        this.scheduleHideMenu();
      }
    };
  },
  onRender: function () {
    var view = this;
    this.$el.toggleClass('full_width', !!this.options.fullWidth);
    this.ui.button.toggleClass('has_icon_and_text', !!this.options.label);
    this.ui.button.toggleClass('has_icon_only', !this.options.label);
    this.ui.button.toggleClass('ellipsis_icon', !!this.options.ellipsisIcon);
    this.ui.button.toggleClass('borderless', !!this.options.borderless);
    this.ui.button.text(this.options.label);
    this.ui.button.attr('title', this.options.title);
    this.ui.button.addClass(this.options.buttonClassName);
    this.ui.menu.append(this.subview(new DropDownButtonItemListView({
      items: this.options.items
    })).el);
    this.ui.menu.on({
      'mouseenter': function () {
        view.showMenu();
      },
      'mouseleave': function () {
        view.scheduleHideMenu();
      },
      'click': function () {
        view.hideMenu();
      }
    });
    this.ui.menu.appendTo('#editor_menu_container');
  },
  onClose: function () {
    this.ui.menu.remove();
  },
  positionMenu: function () {
    var offset = this.$el.offset();
    this.ui.menu.css({
      top: offset.top + this.$el.height(),
      left: this.options.alignMenu === 'right' ? offset.left + this.$el.width() - this.ui.menu.outerWidth() : offset.left,
      width: this.options.fullWidth ? this.$el.width() : null
    });
  },
  showMenu: function () {
    this.ensureOnlyOneDropDownButtonShowsMenu();
    clearTimeout(this.hideMenuTimeout);
    this.ui.menu.addClass('is_visible');
    this.ui.button.addClass('hover');
  },
  ensureOnlyOneDropDownButtonShowsMenu: function () {
    if (DropDownButtonView.currentlyShowingMenu) {
      DropDownButtonView.currentlyShowingMenu.hideMenu();
    }
    DropDownButtonView.currentlyShowingMenu = this;
  },
  hideMenu: function () {
    clearTimeout(this.hideMenuTimeout);
    if (!this.isClosed) {
      this.ui.button.removeClass('hover');
      this.ui.menu.removeClass('is_visible');
    }
  },
  scheduleHideMenu: function () {
    this.hideMenuTimeout = setTimeout(_.bind(this.hideMenu, this), 300);
  }
});

function template$d(data) {
var __p = '';
__p += '<div class="pictogram"></div>\n<div class="file_thumbnail-custom"></div>\n';
return __p
}

function template$e(data) {
var __p = '';
__p += '<svg class="file_stage_icon-spinner" viewBox="0 0 16 16">\n  <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" opacity="0.25"/>\n  <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>\n</svg>\n<svg class="file_stage_icon-alert" viewBox="0 0 16 16">\n  <path fill="currentColor" fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm1 4a1 1 0 0 0-2 0v3.5a1 1 0 0 0 2 0V5Zm-1 5.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/>\n</svg>\n<svg class="file_stage_icon-bell" viewBox="0 0 16 16">\n  <path fill="currentColor" d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3L2.1 11.2a.5.5 0 0 0 .4.8h11a.5.5 0 0 0 .4-.8L12.5 9V6A4.5 4.5 0 0 0 8 1.5Z"/>\n  <path fill="currentColor" d="M6.2 13.2a1.9 1.9 0 0 0 3.6 0H6.2Z"/>\n</svg>\n';
return __p
}

const FileStageIconView = Marionette.ItemView.extend({
  tagName: 'span',
  className: 'file_stage_icon',
  template: template$e,
  attributes: {
    'aria-hidden': 'true'
  },
  ui: {
    spinner: '.file_stage_icon-spinner',
    alert: '.file_stage_icon-alert',
    bell: '.file_stage_icon-bell'
  },
  modelEvents: {
    'change': 'update'
  },
  onRender: function () {
    this.update();
  },
  update: function () {
    var failed = !!this.model.get('failed');
    var actionRequired = !!this.model.get('action_required');
    this.ui.spinner.toggle(!failed && !actionRequired);
    this.ui.alert.toggle(failed);
    this.ui.bell.toggle(actionRequired);
  }
});

const FileThumbnailView = Marionette.ItemView.extend({
  className: 'file_thumbnail',
  template: template$d,
  modelEvents: {
    'change:state': 'update'
  },
  ui: {
    pictogram: '.pictogram',
    custom: '.file_thumbnail-custom'
  },
  onRender: function () {
    if (this.model) {
      this.appendSubview(new CollectionView({
        tagName: 'span',
        className: 'file_thumbnail-stage_icon',
        collection: this.model.currentStages,
        itemViewConstructor: FileStageIconView
      }));
    }
    this.update();
  },
  update: function () {
    if (this.model) {
      this.ui.pictogram.addClass(this.model.thumbnailPictogram);
      this.$el.css('background-image', this._imageUrl() ? 'url(' + this._imageUrl() + ')' : '');
      this.$el.toggleClass('always_picogram', !!this.model.thumbnailPictogram).toggleClass('ready', this.model.isReady());
      this.renderCustomThumbnail();
    } else {
      this.$el.css('background-image', '');
      this.$el.removeClass('ready');
      this.ui.pictogram.addClass('empty');
    }
  },
  // File types can render their own thumbnail instead of the image
  // pointed at by the thumbnail url. Only created once the file is
  // ready, which is why this is retried on state changes.
  renderCustomThumbnail: function () {
    var _this$model$createThu, _this$model;
    if (this.customThumbnailView) {
      return;
    }
    this.customThumbnailView = (_this$model$createThu = (_this$model = this.model).createThumbnailView) === null || _this$model$createThu === void 0 ? void 0 : _this$model$createThu.call(_this$model);
    if (this.customThumbnailView) {
      this.appendSubview(this.customThumbnailView, {
        to: this.ui.custom
      });
    }
  },
  _imageUrl: function () {
    return this.model.get(this.options.imageUrlPropertyName || 'thumbnail_url');
  }
});

/**
 * Input view to reference a file.
 *
 * @class
 */
const FileInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <div class="file_input-thumbnail"></div>
    <div class="file_name"></div>

    <a href=""
       class="unset"
       title="${I18n$1.t('pageflow.ui.templates.inputs.file_input.reset')}">
    </a>
    <a href=""
       class="choose"
       title="${I18n$1.t('pageflow.ui.templates.inputs.file_input.edit')}">
    </a>
  `,
  className: 'file_input',
  ui: {
    fileName: '.file_name',
    thumbnail: '.file_input-thumbnail'
  },
  events: {
    'click .choose': function () {
      editor.selectFile({
        name: this.options.collection.name,
        filter: this.options.filter
      }, this.options.fileSelectionHandler || 'pageConfiguration', _.extend({
        id: this.model.getRoutableId ? this.model.getRoutableId() : this.model.id,
        attributeName: this.options.propertyName,
        returnToTab: this.options.parentTab,
        label: this.labelText()
      }, this.options.fileSelectionHandlerOptions || {}));
      return false;
    },
    'click .unset': function () {
      this.model.unsetReference(this.options.propertyName);
      return false;
    }
  },
  initialize: function () {
    this.options = _.extend({
      positioning: true,
      textTrackFiles: state.textTrackFiles
    }, this.options);
    if (typeof this.options.collection === 'string') {
      this.options.collection = state.entry.getFileCollection(editor.fileTypes.findByCollectionName(this.options.collection));
    }
    this.textTrackMenuItems = new Backbone.Collection();
  },
  onRender: function () {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
    var dropDownMenuItems = this._dropDownMenuItems();
    if (dropDownMenuItems.length) {
      this.appendSubview(new DropDownButtonView({
        items: dropDownMenuItems,
        ellipsisIcon: true,
        openOnClick: true
      }));
    }
    this.setupBooleanAttributeBinding('positioning', this._updatePositioning);
  },
  update: function () {
    var file = this._getFile();
    this._listenToNestedTextTrackFiles(file);
    this.$el.toggleClass('is_unset', !file);
    this.ui.fileName.text(file ? file.title() : I18n$1.t('pageflow.ui.views.inputs.file_input_view.none'));
    this._updateThumbnail(file);
  },
  onClose: function () {
    var _this$thumbnailView;
    (_this$thumbnailView = this.thumbnailView) === null || _this$thumbnailView === void 0 ? void 0 : _this$thumbnailView.close();
  },
  // Thumbnail views of file types can hold on to resources of the file
  // they display, which requires closing the previous thumbnail rather
  // than only replacing its markup. Since closing a view removes its
  // element, the thumbnail lives inside a container of its own.
  _updateThumbnail: function (file) {
    if (this.thumbnailView) {
      this.thumbnailView.close();
    }
    this.thumbnailView = new FileThumbnailView({
      model: file
    });
    this.ui.thumbnail.append(this.thumbnailView.render().el);
  },
  _updatePositioning(positioning) {
    if (this.positioningMenuItem) {
      this.positioningMenuItem.set('hidden', !positioning);
    }
  },
  _dropDownMenuItems: function () {
    var file = this._getFile(file);
    var items = new Backbone.Collection();
    if (this.options.defaultTextTrackFilePropertyName && file) {
      items.add({
        name: 'default_text_track',
        label: I18n$1.t('pageflow.editor.views.inputs.file_input.default_text_track'),
        items: this.textTrackMenuItems
      });
    }
    if (file && file.isPositionable()) {
      this.positioningMenuItem = new FileInputView.EditBackgroundPositioningMenuItem({
        name: 'edit_background_positioning',
        label: I18n$1.t('pageflow.editor.views.inputs.file_input.edit_background_positioning')
      }, {
        inputModel: this.model,
        propertyName: this.options.propertyName,
        filesCollection: this.options.collection,
        positioningOptions: this.options.positioningOptions
      });
      items.add(this.positioningMenuItem);
    }
    if (file) {
      _.each(this.options.dropDownMenuItems, item => {
        items.add(this._createCustomMenuItem(file, item));
      });
      if (this.options.dropDownMenuName) {
        const customItems = editor.dropDownMenuItems.findAllByMenuName(this.options.dropDownMenuName);
        _.each(customItems, item => {
          items.add(this._createCustomMenuItem(file, item));
        });
      }
      items.add(new FileInputView.EditFileSettingsMenuItem({
        name: 'edit_file_settings',
        label: I18n$1.t('pageflow.editor.views.inputs.file_input.edit_file_settings')
      }, {
        file: file
      }));
    }
    return items;
  },
  _createCustomMenuItem(file, item) {
    const options = {
      inputModel: this.model,
      propertyName: this.options.propertyName,
      file
    };
    if (typeof item === 'function') {
      return new item({}, options);
    } else {
      return new FileInputView.CustomMenuItem({
        name: item.name,
        label: item.label,
        checked: item.checked,
        items: item.items && new Backbone.Collection(item.items.map(item => this._createCustomMenuItem(file, item)))
      }, {
        ...options,
        selected: item.selected,
        items: item.items
      });
    }
  },
  _listenToNestedTextTrackFiles: function (file) {
    if (this.textTrackFiles) {
      this.stopListening(this.textTrackFiles);
      this.textTrackFiles = null;
    }
    if (file && this.options.defaultTextTrackFilePropertyName) {
      this.textTrackFiles = file.nestedFiles(this.options.textTrackFiles);
      this.listenTo(this.textTrackFiles, 'add remove', this._updateTextTrackMenuItems);
      this._updateTextTrackMenuItems();
    }
  },
  _updateTextTrackMenuItems: function update() {
    var models = [null].concat(this.textTrackFiles.toArray());
    this.textTrackMenuItems.set(models.map(function (textTrackFile) {
      return new FileInputView.DefaultTextTrackFileMenuItem({}, {
        textTrackFiles: this.textTrackFiles,
        textTrackFile: textTrackFile,
        inputModel: this.model,
        propertyName: this.options.defaultTextTrackFilePropertyName
      });
    }, this));
  },
  _getFile: function () {
    return this.model.getReference(this.options.propertyName, this.options.collection);
  }
});
FileInputView.EditBackgroundPositioningMenuItem = Backbone.Model.extend({
  initialize: function (attributes, options) {
    this.options = options;
  },
  selected: function () {
    let positioningOptions = this.options.positioningOptions;
    if (typeof positioningOptions === 'function') {
      positioningOptions = positioningOptions();
    }
    BackgroundPositioningView.open({
      model: this.options.inputModel,
      propertyName: this.options.propertyName,
      filesCollection: this.options.filesCollection,
      ...positioningOptions
    });
  }
});
FileInputView.CustomMenuItem = Backbone.Model.extend({
  initialize: function (attributes, options) {
    this.options = options;
  },
  selected: function () {
    this.options.selected({
      inputModel: this.options.inputModel,
      propertyName: this.options.propertyName,
      file: this.options.file
    });
  }
});
FileInputView.EditFileSettingsMenuItem = Backbone.Model.extend({
  initialize: function (attributes, options) {
    this.options = options;
  },
  selected: function () {
    FileSettingsDialogView.open({
      model: this.options.file
    });
  }
});
FileInputView.DefaultTextTrackFileMenuItem = Backbone.Model.extend({
  initialize: function (attributes, options) {
    this.options = options;
    this.listenTo(this.options.inputModel, 'change:' + this.options.propertyName, this.update);
    if (this.options.textTrackFile) {
      this.listenTo(this.options.textTrackFile, 'change:configuration', this.update);
    }
    this.update();
  },
  update: function () {
    this.set('kind', 'radio');
    this.set('checked', this.options.textTrackFile == this.getDefaultTextTrackFile());
    this.set('name', this.options.textTrackFile ? null : 'no_default_text_track');
    this.set('label', this.options.textTrackFile ? this.options.textTrackFile.displayLabel() : this.options.textTrackFiles.length ? I18n$1.t('pageflow.editor.views.inputs.file_input.auto_default_text_track') : I18n$1.t('pageflow.editor.views.inputs.file_input.no_default_text_track'));
  },
  selected: function () {
    if (this.options.textTrackFile) {
      this.options.inputModel.setReference(this.options.propertyName, this.options.textTrackFile);
    } else {
      this.options.inputModel.unsetReference(this.options.propertyName);
    }
  },
  getDefaultTextTrackFile: function () {
    return this.options.inputModel.getReference(this.options.propertyName, this.options.textTrackFiles);
  }
});

function template$f(data) {
var __p = '';
__p += '<div class="spinner">\n  <div class="rect1"></div>\n  <div class="rect2"></div>\n  <div class="rect3"></div>\n  <div class="rect4"></div>\n  <div class="rect5"></div>\n</div>\n';
return __p
}

const LoadingView = Marionette.ItemView.extend({
  template: template$f,
  className: 'loading',
  tagName: 'li'
});

const selectableView = {
  initialize: function () {
    this.selectionAttribute = this.selectionAttribute || this.model.modelName;
    this.listenTo(this.options.selection, 'change:' + this.selectionAttribute, function (selection, selectedModel) {
      this.$el.toggleClass('active', selectedModel === this.model);
    });
    this.$el.toggleClass('active', this.options.selection.get(this.selectionAttribute) === this.model);
  },
  select: function () {
    this.options.selection.set(this.selectionAttribute, this.model);
  },
  onClose: function () {
    if (this.options.selection.get(this.selectionAttribute) === this.model) {
      this.options.selection.set(this.selectionAttribute, null);
    }
  }
};

function template$g(data) {
var __t, __p = '';
__p += '<span class="theme_name"></span>\n<span class="button_or_checkmark">\n  <p class="theme_in_use"></p>\n  <a class="use_theme">' +
((__t = ( I18n.t('pageflow.editor.templates.theme.use') )) == null ? '' : __t) +
'</a>\n</span>\n';
return __p
}

const ThemeItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template: template$g,
  className: 'theme_item',
  mixins: [selectableView],
  selectionAttribute: 'theme',
  ui: {
    themeName: '.theme_name',
    useButton: '.use_theme',
    inUseRegion: '.theme_in_use'
  },
  events: {
    'click .use_theme': function () {
      this.options.onUse(this.model);
    },
    'mouseenter': 'select',
    'click': 'select'
  },
  onRender: function () {
    this.$el.data('themeName', this.model.get('name'));
    this.ui.themeName.text(this.model.title());
    if (this.inUse()) {
      this.ui.inUseRegion.text('✓');
    }
    this.ui.useButton.toggle(!this.inUse());
  },
  inUse: function () {
    return this.model.get('name') === this.options.themeInUse;
  }
});

function template$h(data) {
var __t, __p = '';
__p += '<div class="box">\n  <h1 class="dialog-header">\n    ' +
((__t = ( I18n.t('pageflow.editor.templates.change_theme_dialog.header') )) == null ? '' : __t) +
'\n  </h1>\n  <div class="panels">\n    <div class="themes_panel">\n    </div>\n    <div class="preview_panel">\n      <h2 class="dialog-sub_header">\n        ' +
((__t = ( I18n.t('pageflow.editor.templates.change_theme_dialog.preview_header_prefix') )) == null ? '' : __t) +
'\n        <span class="preview_header_theme_name"></span>\n        ' +
((__t = ( I18n.t('pageflow.editor.templates.change_theme_dialog.preview_header_suffix') )) == null ? '' : __t) +
'\n      </h2>\n      <div class="preview_image_region">\n        <img class="preview_image" src="default_template.png">\n      </div>\n    </div>\n  </div>\n  <div class="footer">\n    <a href="" class="close">\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.change_theme_dialog.close') )) == null ? '' : __t) +
'\n    </a>\n  </div>\n</div>\n';
return __p
}

const ChangeThemeDialogView = Marionette.ItemView.extend({
  template: template$h,
  className: 'change_theme dialog editor',
  mixins: [dialogView],
  ui: {
    themesPanel: '.themes_panel',
    previewPanel: '.preview_panel',
    previewImageRegion: '.preview_image_region',
    previewImage: '.preview_image',
    previewHeaderThemeName: '.preview_header_theme_name'
  },
  initialize: function (options) {
    this.selection = new Backbone.Model();
    var themeInUse = this.options.themes.findByName(this.options.themeInUse);
    this.selection.set('theme', themeInUse);
    this.listenTo(this.selection, 'change:theme', function () {
      if (!this.selection.get('theme')) {
        this.selection.set('theme', themeInUse);
      }
      this.update();
    });
  },
  onRender: function () {
    var themes = this.options.themes;
    this.themesView = new CollectionView({
      collection: themes,
      tagName: 'ul',
      itemViewConstructor: ThemeItemView,
      itemViewOptions: {
        selection: this.selection,
        onUse: this.options.onUse,
        themes: themes,
        themeInUse: this.options.themeInUse
      }
    });
    this.ui.themesPanel.append(this.subview(this.themesView).el);
    this.ui.previewPanel.append(this.subview(new LoadingView({
      tagName: 'div'
    })).el);
    this.update();
  },
  update: function () {
    var that = this;
    var selectedTheme = this.options.themes.findByName(that.selection.get('theme').get('name'));
    this.ui.previewImage.hide();
    this.ui.previewImage.one('load', function () {
      $(this).show();
    });
    this.ui.previewImage.attr('src', selectedTheme.get('preview_image_url'));
    this.ui.previewHeaderThemeName.text(selectedTheme.title());
  }
});
ChangeThemeDialogView.changeTheme = function (options) {
  return $.Deferred(function (deferred) {
    options.onUse = function (theme) {
      deferred.resolve(theme);
      view.close();
    };
    var view = new ChangeThemeDialogView(options);
    view.on('close', function () {
      deferred.reject();
    });
    app.dialogRegion.show(view.render());
  }).promise();
};

function template$i(data) {
var __p = '';
__p += '\n';
return __p
}

const StaticThumbnailView = Marionette.ItemView.extend({
  template: template$i,
  className: 'static_thumbnail',
  modelEvents: {
    'change:configuration': 'update'
  },
  onRender: function () {
    this.update();
  },
  update: function () {
    this.$el.css('background-image', 'url(' + this._imageUrl() + ')');
  },
  _imageUrl: function () {
    return this.model.thumbnailUrl();
  }
});

/**
 * Base thumbnail view for models supporting a `thumbnailFile` method.
 *
 * @class
 */
const ModelThumbnailView = Marionette.View.extend({
  className: 'model_thumbnail',
  modelEvents: {
    'change:configuration': 'update'
  },
  render: function () {
    this.update();
    return this;
  },
  update: function () {
    if (this.model) {
      if (_.isFunction(this.model.thumbnailFile)) {
        var file = this.model && this.model.thumbnailFile();
        if (this.thumbnailView && this.currentFileThumbnail == file) {
          return;
        }
        this.currentFileThumbnail = file;
        this.newThumbnailView = new FileThumbnailView({
          model: file,
          className: 'thumbnail file_thumbnail',
          imageUrlPropertyName: this.options.imageUrlPropertyName
        });
      } else {
        this.newThumbnailView = this.newThumbnailView || new StaticThumbnailView({
          model: this.model
        });
      }
    }
    if (this.thumbnailView) {
      this.thumbnailView.close();
    }
    if (this.model) {
      this.thumbnailView = this.subview(this.newThumbnailView);
      this.$el.append(this.thumbnailView.el);
    }
  }
});

function template$j(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<div class="title"></div>\n<button class="unset"></button>\n<button class="choose"></button>\n';
return __p
}

/**
 * Base class for input views that reference models.
 *
 * @class
 */
const ReferenceInputView = Marionette.ItemView.extend( /** @lends ReferenceInputView.prototype */{
  mixins: [inputView],
  template: template$j,
  className: 'reference_input',
  ui: {
    title: '.title',
    chooseButton: '.choose',
    unsetButton: '.unset',
    buttons: 'button'
  },
  events: {
    'click .choose': function () {
      var view = this;
      this.chooseValue().then(function (id) {
        view.model.set(view.options.propertyName, id);
      });
      return false;
    },
    'click .unset': function () {
      this.model.unset(this.options.propertyName);
      return false;
    }
  },
  initialize: function () {
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },
  onRender: function () {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },
  /**
   * Returns a promise for some identifying attribute.
   *
   * Default attribute name is perma_id. If the attribute is named
   * differently, you can have your specific ReferenceInputView
   * implement `chooseValue()` accordingly.
   *
   * Will be used to set the chosen Model for this View.
   */
  chooseValue: function () {
    return this.choose().then(function (model) {
      return model.get('perma_id');
    });
  },
  choose: function () {
    throw 'Not implemented: Override ReferenceInputView#choose to return a promise';
  },
  getTarget: function (targetId) {
    throw 'Not implemented: Override ReferenceInputView#getTarget';
  },
  createThumbnailView: function (target) {
    return new ModelThumbnailView({
      model: target
    });
  },
  update: function () {
    if (this.isClosed) {
      return;
    }
    var target = this.getTarget(this.model.get(this.options.propertyName));
    this.ui.title.text(target ? target.title() : I18n$1.t('pageflow.editor.views.inputs.reference_input_view.none'));
    this.ui.unsetButton.toggle(!!target && !this.options.hideUnsetButton);
    this.ui.unsetButton.attr('title', this.options.unsetButtonTitle || I18n$1.t('pageflow.editor.views.inputs.reference_input_view.unset'));
    this.ui.chooseButton.attr('title', this.options.chooseButtonTitle || I18n$1.t('pageflow.editor.views.inputs.reference_input_view.choose'));
    this.updateDisabledAttribute(this.ui.buttons);
    if (this.thumbnailView) {
      this.thumbnailView.close();
    }
    this.thumbnailView = this.subview(this.createThumbnailView(target));
    this.ui.title.before(this.thumbnailView.el);
  }
});

const ThemeInputView = ReferenceInputView.extend({
  options: function () {
    return {
      chooseButtonTitle: I18n$1.t('pageflow.editor.views.inputs.theme_input_view.choose'),
      hideUnsetButton: true
    };
  },
  choose: function () {
    return ChangeThemeDialogView.changeTheme({
      model: this.model,
      themes: this.options.themes,
      themeInUse: this.model.get(this.options.propertyName)
    });
  },
  chooseValue: function () {
    return this.choose().then(function (model) {
      return model.get('name');
    });
  },
  getTarget: function (themeName) {
    return this.options.themes.findByName(themeName);
  }
});

function template$k(data) {
var __t, __p = '';
__p += '<a class="back">' +
((__t = ( I18n.t('pageflow.editor.templates.edit_meta_data.outline') )) == null ? '' : __t) +
'</a>\n\n<div class="failure">\n  <p>' +
((__t = ( I18n.t('pageflow.editor.templates.edit_meta_data.save_error') )) == null ? '' : __t) +
'</p>\n  <p class="message"></p>\n  <a class="retry" href="">' +
((__t = ( I18n.t('pageflow.editor.templates.edit_meta_data.retry') )) == null ? '' : __t) +
'</a>\n</div>\n\n<div class="form_fields"></div>\n';
return __p
}

const EditMetaDataView = Marionette.Layout.extend({
  template: template$k,
  className: 'edit_meta_data',
  mixins: [failureIndicatingView],
  regions: {
    formContainer: '.form_fields'
  },
  events: {
    'click a.back': 'goBack'
  },
  onRender: function () {
    var entry = this.model;
    var state = this.options.state || {};
    var features = this.options.features || {};
    var editor = this.options.editor || {};
    var configurationEditor = new ConfigurationEditorView({
      model: entry.metadata.configuration,
      tab: this.options.tab,
      attributeTranslationKeyPrefixes: ['pageflow.entry_types.' + editor.entryType.name + '.editor.entry_metadata_configuration_attributes']
    });
    configurationEditor.tab('general', function () {
      this.input('title', TextInputView, {
        placeholder: entry.get('entry_title'),
        model: entry.metadata
      });
      this.input('locale', SelectInputView, {
        values: state.config.availablePublicLocales,
        texts: _.map(state.config.availablePublicLocales, function (locale) {
          return I18n$1.t('pageflow.public._language', {
            locale: locale
          });
        }),
        model: entry.metadata
      });
      this.input('credits', TextAreaInputView, {
        model: entry.metadata
      });
      this.input('author', TextInputView, {
        placeholder: state.config.defaultAuthorMetaTag,
        model: entry.metadata
      });
      this.input('publisher', TextInputView, {
        placeholder: state.config.defaultPublisherMetaTag,
        model: entry.metadata
      });
      this.input('keywords', TextInputView, {
        placeholder: state.config.defaultKeywordsMetaTag,
        model: entry.metadata
      });
      if (state.config.entryStructuredDataTypes && state.config.entryStructuredDataTypes.length > 1) {
        this.input('structured_data_type_name', SelectInputView, {
          values: state.config.entryStructuredDataTypes,
          texts: state.config.entryStructuredDataTypes.map(name => I18n$1.t(`pageflow.editor.entry_structured_data_types.${name}.label`, {
            defaultValue: name.replace(/_/g, ' ')
          })),
          model: entry.metadata
        });
      }
    });
    configurationEditor.tab('widgets', function () {
      editor.entryType.appearanceInputs && editor.entryType.appearanceInputs(this, {
        entry,
        site: state.site
      });
      editor.appearanceInputsCallbacks.forEach(callback => {
        callback(this, {
          entry
        });
      });
      entry.widgets && this.view(EditWidgetsView, {
        model: entry,
        widgetTypes: editor.widgetTypes
      });
      if (features.isEnabled && features.isEnabled('selectable_themes') && state.themes.length > 1) {
        this.view(ThemeInputView, {
          themes: state.themes,
          propertyName: 'theme_name',
          model: entry.metadata
        });
      }
      if (editor.entryType.editDefaultsView) {
        this.view(SeparatorView);
        this.view(EditDefaultsInputView, {
          entry,
          editor
        });
      }
    });
    configurationEditor.tab('social', function () {
      this.input('share_image_id', FileInputView, {
        collection: state.imageFiles,
        fileSelectionHandler: 'entryMetadata',
        model: entry.metadata
      });
      this.input('summary', TextAreaInputView, {
        disableRichtext: true,
        disableLinks: true,
        model: entry.metadata
      });
      this.input('share_url', TextInputView, {
        placeholder: state.entry.get('pretty_url'),
        model: entry.metadata
      });
      this.input('share_providers', CheckBoxGroupInputView, {
        values: state.config.availableShareProviders,
        translationKeyPrefix: 'activerecord.values.pageflow/entry.share_providers',
        model: entry.metadata
      });
    });
    this.listenTo(entry.metadata, 'change:theme_name', function () {
      configurationEditor.refresh();
    });
    this.formContainer.show(configurationEditor);
  },
  goBack: function () {
    this.options.editor.navigate('/', {
      trigger: true
    });
  }
});

function template$l(data) {
var __t, __p = '';
__p += '<a class="back">' +
((__t = ( I18n.t('pageflow.editor.templates.edit_widget.back') )) == null ? '' : __t) +
'</a>\n';
return __p
}

const EditWidgetView = Marionette.ItemView.extend({
  template: template$l,
  className: 'edit_widget',
  events: {
    'click a.back': function () {
      editor.navigate('/meta_data/widgets', {
        trigger: true
      });
    }
  },
  initialize: function () {
    this.model.set('editing', true);
  },
  onClose: function () {
    Marionette.ItemView.prototype.onClose.call(this);
    this.model.set('editing', false);
  },
  onRender: function () {
    var configurationEditor = this.model.widgetType().createConfigurationEditorView({
      model: this.model.configuration,
      entry: this.options.entry,
      tab: this.options.tab
    });
    this.appendSubview(configurationEditor);
  }
});

const loadable = modelLifecycleTrackingView({
  classNames: {
    creating: 'creating',
    destroying: 'destroying'
  }
});

function template$m(data) {
var __p = '';
__p += '<span class="file_thumbnail"></span>\n\n<span class="file_name"></span>\n';
return __p
}

const ExplorerFileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template: template$m,
  mixins: [loadable, selectableView],
  selectionAttribute: 'file',
  ui: {
    fileName: '.file_name',
    thumbnail: '.file_thumbnail'
  },
  events: {
    'click': function () {
      if (!this.$el.hasClass('disabled')) {
        this.select();
      }
    }
  },
  modelEvents: {
    'change': 'update'
  },
  onRender: function () {
    this.update();
    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));
  },
  update: function () {
    if (this.isDisabled()) {
      this.$el.addClass('disabled');
    }
    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.title());
  },
  isDisabled: function () {
    return this.options.disabledIds && _.contains(this.options.disabledIds, this.model.get('id'));
  }
});

function template$n(data) {
var __p = '';
__p += '<a href="">\n  <span class="title"></span>\n</a>\n';
return __p
}

const OtherEntryItemView = Marionette.ItemView.extend({
  template: template$n,
  className: 'other_entry_item',
  tagName: 'li',
  mixins: [selectableView],
  ui: {
    title: '.title'
  },
  events: {
    'click': 'select'
  },
  onRender: function () {
    this.ui.title.text(this.model.titleOrSlug());
  }
});

function template$o(data) {
var __t, __p = '';
__p +=
((__t = ( I18n.t('pageflow.editor.templates.other_entries_blank_slate.none_available') )) == null ? '' : __t) +
'\n';
return __p
}

const OtherEntriesCollectionView = Marionette.View.extend({
  initialize: function () {
    this.otherEntries = new OtherEntriesCollection();
    this.listenTo(this.otherEntries, 'sync', function () {
      if (this.otherEntries.length === 1) {
        this.options.selection.set('entry', this.otherEntries.first());
      }
    });
  },
  render: function () {
    this.subview(new CollectionView({
      el: this.el,
      collection: this.otherEntries,
      itemViewConstructor: OtherEntryItemView,
      itemViewOptions: {
        selection: this.options.selection
      },
      blankSlateViewConstructor: Marionette.ItemView.extend({
        template: template$o,
        tagName: 'li',
        className: 'blank_slate'
      }),
      loadingViewConstructor: LoadingView
    }));
    this.otherEntries.fetch();
    return this;
  }
});

function template$p(data) {
var __t, __p = '';
__p += '<div class="box">\n  <h1 class="dialog-header">\n    ' +
((__t = ( I18n.t('pageflow.editor.templates.files_explorer.reuse_files') )) == null ? '' : __t) +
'\n  </h1>\n\n  <div class="panels">\n    <ul class="entries_panel">\n    </ul>\n\n    <div class="files_panel">\n    </div>\n  </div>\n\n  <div class="footer">\n    <button class="ok">' +
((__t = ( I18n.t('pageflow.editor.templates.files_explorer.ok') )) == null ? '' : __t) +
'</button>\n    <button class="close">' +
((__t = ( I18n.t('pageflow.editor.templates.files_explorer.cancel') )) == null ? '' : __t) +
'</button>\n  </div>\n</div>\n';
return __p
}

function filesGalleryBlankSlateTemplate(data) {
var __t, __p = '';
__p += '<li class="blank_slate">' +
((__t = ( I18n.t('pageflow.editor.templates.files_gallery_blank_slate.no_files') )) == null ? '' : __t) +
'<li>\n';
return __p
}

function filesExplorerBlankSlateTemplate(data) {
var __t, __p = '';
__p += '<li class="blank_slate">' +
((__t = ( I18n.t('pageflow.editor.templates.files_explorer_blank_slate.choose_hint') )) == null ? '' : __t) +
'<li>\n';
return __p
}

const FilesExplorerView = Marionette.ItemView.extend({
  template: template$p,
  className: 'files_explorer editor dialog',
  mixins: [dialogView],
  ui: {
    entriesPanel: '.entries_panel',
    filesPanel: '.files_panel',
    okButton: '.ok'
  },
  events: {
    'click .ok': function () {
      if (this.options.callback) {
        this.options.callback(this.selection.get('entry'), this.selection.get('file'));
      }
      this.close();
    }
  },
  initialize: function () {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change:entry', function () {
      this.tabsView.refresh();
    });

    // check if the OK button should be enabled.
    this.listenTo(this.selection, 'change', function (selection, options) {
      this.ui.okButton.prop('disabled', !this.selection.get('file'));
    });
  },
  onRender: function () {
    this.subview(new OtherEntriesCollectionView({
      el: this.ui.entriesPanel,
      selection: this.selection
    }));
    this.tabsView = new TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.tabs',
      defaultTab: this.options.tabName
    });
    editor.fileTypes.each(function (fileType) {
      if (fileType.topLevelType) {
        this.tab(fileType);
      }
    }, this);
    this.ui.filesPanel.append(this.subview(this.tabsView).el);
    this.ui.okButton.prop('disabled', true);
  },
  tab: function (fileType) {
    this.tabsView.tab(fileType.collectionName, _.bind(function () {
      var collection = this._collection(fileType);
      var disabledIds = state.entry.getFileCollection(fileType).pluck('id');
      return new CollectionView({
        tagName: 'ul',
        className: 'files_gallery',
        collection: collection,
        itemViewConstructor: ExplorerFileItemView,
        itemViewOptions: {
          selection: this.selection,
          disabledIds: disabledIds
        },
        blankSlateViewConstructor: this._blankSlateConstructor()
      });
    }, this));
  },
  _collection: function (fileType) {
    var collection,
      entry = this.selection.get('entry');
    if (entry) {
      collection = entry.getFileCollection(fileType);
      collection.fetch();
    } else {
      collection = new Backbone.Collection();
    }
    return collection;
  },
  _blankSlateConstructor: function () {
    return Marionette.ItemView.extend({
      template: this.selection.get('entry') ? filesGalleryBlankSlateTemplate : filesExplorerBlankSlateTemplate
    });
  }
});
FilesExplorerView.open = function (options) {
  app.dialogRegion.show(new FilesExplorerView(options));
};

function template$q(data) {
var __t, __p = '';
__p += '<li class="blank_slate">\n  ' +
((__t = ( data.text )) == null ? '' : __t) +
'\n</li>\n';
return __p
}

const FilesBlankSlateView = Marionette.ItemView.extend({
  template: template$q,
  initialize: function () {
    this.listenTo(this.options.files, 'add remove change:folder_perma_id', this.render);
  },
  serializeData: function () {
    return {
      text: this.text()
    };
  },
  // Saying that there are no files would be misleading when the list
  // only looks empty because the file type filter or the search term
  // hide what the folder holds.
  text: function () {
    if (this.filesInFolder().length) {
      return I18n$1.t('pageflow.editor.views.files_blank_slate_view.no_matches');
    }
    if (this.options.folder) {
      return I18n$1.t('pageflow.editor.views.files_blank_slate_view.empty_folder');
    }
    return this.options.text;
  },
  filesInFolder: function () {
    var permaId = this.options.folder ? this.options.folder.get('perma_id') : null;
    return this.options.files.filter(function (file) {
      return file.get('folder_perma_id') === permaId;
    });
  }
});

function template$r(data) {
var __p = '';
__p += '<th></th>\n<td></td>';
return __p
}

const FileMetaDataItemView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: template$r,
  ui: {
    label: 'th',
    value: 'td'
  },
  onRender: function () {
    this.appendSubview(new this.options.valueView(_.extend({
      model: this.model,
      name: this.options.name
    }, this.options.valueViewOptions || {})), {
      to: this.ui.value
    });
    this.ui.label.text(this.labelText());
  },
  labelText: function () {
    return i18nUtils.attributeTranslation(this.options.name, 'label', {
      prefixes: ['pageflow.editor.files.attributes.' + this.model.fileType().collectionName, 'pageflow.editor.files.common_attributes'],
      fallbackPrefix: 'activerecord.attributes',
      fallbackModelI18nKey: this.model.i18nKey
    });
  }
});

// Lists the places of the entry that reference a file. Takes the index
// the files list built via `Entry#fileReferences`. Each place has a
// label, an optional detail naming the referencing property and a
// pictogram. Clicking an item selects the referencing model in the
// editor.
const FileReferencesView = Marionette.ItemView.extend({
  className: 'file_references',
  template: () => `
    <div class="file_references-separator">
      <h3 class="file_references-header">
        ${I18n$1.t('pageflow.editor.views.file_references.header')}
      </h3>
    </div>
    <div class="file_references-list"></div>
  `,
  ui: {
    list: '.file_references-list'
  },
  onRender() {
    this.update();
  },
  update() {
    const places = this.options.fileReferences.placesFor(this.model);
    this.ui.list.empty().append(places.map(place => renderItem(place)));
    this.$el.toggle(places.length > 0);
  }
});
function renderItem(place) {
  const item = $('<button />', {
    type: 'button',
    class: 'file_references-item'
  });
  const lines = $('<span />', {
    class: 'file_references-lines'
  });
  item.append($('<span />', {
    class: 'file_references-pictogram',
    style: `mask-image: url('${escapeCssUrl(place.pictogram)}')`
  }));
  lines.append($('<span />', {
    class: 'file_references-label',
    text: place.label
  }));
  if (place.detail) {
    lines.append($('<span />', {
      class: 'file_references-detail',
      text: place.detail
    }));
  }
  item.append(lines);
  item.on('click', () => place.select());
  return item[0];
}
function escapeCssUrl(url) {
  return url.replace(/'/g, "\\'").replace(/\n/g, '');
}

function template$s(data) {
var __p = '';
__p += '<span class="file_stage_item-icon"></span>\n\n<div class="file_stage_item-text">\n  <p class="percent"></p>\n  <p class="description"></p>\n  <p class="error_message"></p>\n</div>\n';
return __p
}

const FileStageItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'file_stage_item',
  template: template$s,
  ui: {
    icon: '.file_stage_item-icon',
    description: '.description',
    percent: '.percent',
    errorMessage: '.error_message'
  },
  modelEvents: {
    'change': 'update'
  },
  onRender: function () {
    this.appendSubview(new FileStageIconView({
      model: this.model
    }), {
      to: this.ui.icon
    });
    this.update();
    this.$el.addClass(this.model.get('name'));
    if (this.options.standAlone) {
      this.$el.addClass('stand_alone');
    } else {
      this.$el.addClass('indented');
    }
  },
  update: function () {
    this.ui.description.text(this.model.localizedDescription());
    if (typeof this.model.get('progress') === 'number' && this.model.get('active')) {
      this.ui.percent.text(this.model.get('progress') + '%');
    } else {
      this.ui.percent.text('');
    }
    this.ui.errorMessage.toggle(!!this.model.get('error_message')).text(this._translatedErrorMessage());
    this.$el.toggleClass('active', this.model.get('active'));
    this.$el.toggleClass('finished', this.model.get('finished'));
    this.$el.toggleClass('failed', this.model.get('failed'));
    this.$el.toggleClass('action_required', this.model.get('action_required'));
  },
  _translatedErrorMessage: function () {
    return this.model.get('error_message') && I18n$1.t(this.model.get('error_message'), {
      defaultValue: this.model.get('error_message')
    });
  }
});

function template$t(data) {
var __t, __p = '';
__p += '<div class="file_meta_data_overlay-arrow"></div>\n\n<div class="file_meta_data_overlay-content">\n  <div class="file_meta_data_overlay-preview"></div>\n\n  <ul class="file_stage_items"></ul>\n\n  <div class="file_meta_data">\n    <table cellpadding="0" cellspacing="0">\n      <tbody class="attributes">\n      </tbody>\n      <tbody class="downloads">\n        <tr>\n          <th>' +
((__t = ( I18n.t('pageflow.editor.templates.file_item.source') )) == null ? '' : __t) +
'</th>\n          <td><a class="original" href="#" download target="_blank">' +
((__t = ( I18n.t('pageflow.editor.templates.file_item.download') )) == null ? '' : __t) +
'</a></td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n\n  <div class="file_meta_data_overlay-file_references"></div>\n</div>\n';
return __p
}

const DISTANCE_FROM_THUMBNAIL = 8;
const DISTANCE_FROM_VIEWPORT_EDGE = 8;

// Long enough to move the pointer from the thumbnail across the gap
// into the overlay.
const DISMISS_DELAY = 300;

// Below this the preview no longer tells the file apart, so the content
// scrolls rather than scaling the preview away.
const MIN_PREVIEW_HEIGHT = 96;
const FileMetaDataOverlayView = Marionette.ItemView.extend({
  template: template$t,
  className: 'file_meta_data_overlay',
  ui: {
    arrow: '.file_meta_data_overlay-arrow',
    content: '.file_meta_data_overlay-content',
    preview: '.file_meta_data_overlay-preview',
    stageItems: '.file_stage_items',
    metaData: 'tbody.attributes',
    fileReferences: '.file_meta_data_overlay-file_references',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },
  events: {
    'mouseenter': 'cancelDismiss',
    'mouseleave': 'scheduleDismiss',
    // Editing happens in a dialog which the overlay would otherwise
    // linger in front of.
    'click .file_meta_data button.edit': 'dismiss'
  },
  modelEvents: {
    'change': 'update',
    'change:state': 'renderPreview'
  },
  initialize: function () {
    _.bindAll(this, 'handleOutsideClick');
  },
  onRender: function () {
    this.update();
    this.subview(new CollectionView({
      el: this.ui.stageItems,
      collection: this.model.currentStages,
      itemViewConstructor: FileStageItemView
    }));
    this.listenTo(this.model.currentStages, 'add remove', this.updateStages);
    this.updateStages();
    _.each(this.metaDataViews(), function (view) {
      this.ui.metaData.append(this.subview(view).el);
    }, this);
    if (this.options.fileReferences) {
      this.appendSubview(new FileReferencesView({
        model: this.model,
        fileReferences: this.options.fileReferences
      }), {
        to: this.ui.fileReferences
      });
    }
  },
  // Only exists while the overlay is open, so that videos of other
  // files do not keep loading and playing in the background. Rerendered
  // on state changes since files only get a preview once they have
  // finished processing.
  renderPreview: function () {
    this.closePreview();
    if (this.isClosed || !this.isOpen()) {
      return;
    }
    this.previewView = this.model.createPreviewView();
    if (this.previewView) {
      this.ui.preview.append(this.previewView.render().el);
    }
    this.ui.preview.toggle(!!this.previewView);
  },
  closePreview: function () {
    if (this.previewView) {
      this.previewView.close();
      this.previewView = null;
    }
    if (!this.isClosed) {
      this.ui.preview.hide();
    }
  },
  update: function () {
    if (this.isClosed) {
      return;
    }
    this.ui.downloadLink.attr('href', this.model.get('download_url'));
    this.ui.downloads.toggle(this.model.isUploaded() && !_.isEmpty(this.model.get('download_url')));
  },
  // The separator would otherwise linger once the file is done.
  updateStages: function () {
    this.ui.stageItems.toggle(!!this.model.currentStages.length);
  },
  metaDataViews: function () {
    var model = this.model;
    return _.map(this.options.metaDataAttributes, function (options) {
      if (typeof options === 'string') {
        options = {
          name: options,
          valueView: TextFileMetaDataItemValueView
        };
      }
      return new FileMetaDataItemView(_.extend({
        model: model
      }, options));
    });
  },
  isOpen: function () {
    return !!this.stopAutoUpdate;
  },
  isLocked: function () {
    return !!this.locked;
  },
  // Hovering another thumbnail must not take away an overlay which has
  // been pinned by clicking it.
  openUnlessPinned: function () {
    var _FileMetaDataOverlayV;
    if ((_FileMetaDataOverlayV = FileMetaDataOverlayView.currentlyOpen) === null || _FileMetaDataOverlayV === void 0 ? void 0 : _FileMetaDataOverlayV.isLocked()) {
      return;
    }
    this.open();
  },
  // Only one overlay at a time, since they would otherwise pile up on
  // top of each other next to the list.
  open: function () {
    var _FileMetaDataOverlayV2;
    this.cancelDismiss();
    if (this.isOpen()) {
      return;
    }
    (_FileMetaDataOverlayV2 = FileMetaDataOverlayView.currentlyOpen) === null || _FileMetaDataOverlayV2 === void 0 ? void 0 : _FileMetaDataOverlayV2.dismiss();
    FileMetaDataOverlayView.currentlyOpen = this;
    this.$el.addClass('is_open');
    this.stopAutoUpdate = autoUpdate(this.options.reference, this.el, this.position.bind(this));
    this.renderPreview();
    this.trigger('toggle');
  },
  // Hovering only opens the overlay for as long as the pointer stays on
  // the thumbnail or the overlay itself. Clicking pins it.
  toggleLock: function () {
    if (this.isLocked()) {
      this.unlock();
    } else {
      this.open();
      this.lock();
    }
  },
  lock: function () {
    this.locked = true;

    // Binding on the next tick keeps the very click which locked the
    // overlay from dismissing it again.
    this.bindOutsideClickTimeout = setTimeout(() => {
      $(document).on('click', this.handleOutsideClick);
    }, 0);
  },
  unlock: function () {
    this.locked = false;
    clearTimeout(this.bindOutsideClickTimeout);
    $(document).off('click', this.handleOutsideClick);
  },
  handleOutsideClick: function (event) {
    if (this.el.contains(event.target) || this.options.reference.contains(event.target)) {
      return;
    }
    this.dismiss();
  },
  scheduleDismiss: function () {
    if (this.isLocked()) {
      return;
    }
    this.dismissTimeout = setTimeout(this.dismiss.bind(this), DISMISS_DELAY);
  },
  cancelDismiss: function () {
    clearTimeout(this.dismissTimeout);
  },
  dismiss: function () {
    this.cancelDismiss();
    this.unlock();
    if (!this.isOpen()) {
      return;
    }
    this.stopAutoUpdate();
    this.stopAutoUpdate = null;
    if (FileMetaDataOverlayView.currentlyOpen === this) {
      FileMetaDataOverlayView.currentlyOpen = null;
    }
    this.closePreview();
    this.$el.removeClass('is_open');
    this.trigger('toggle');
  },
  position: function () {
    return computePosition(this.options.reference, this.el, {
      placement: 'left',
      middleware: [offset(DISTANCE_FROM_THUMBNAIL), shift({
        padding: DISTANCE_FROM_VIEWPORT_EDGE
      }), size({
        padding: DISTANCE_FROM_VIEWPORT_EDGE,
        apply: this.applyAvailableHeight.bind(this)
      }), arrow({
        element: this.ui.arrow[0]
      })]
    }).then(this.applyPosition.bind(this));
  },
  // Keeps the overlay inside the viewport next to short rows and on
  // short screens. Whatever the rest of the overlay does not need is
  // left for the preview to scale itself down into.
  applyAvailableHeight: function ({
    availableHeight
  }) {
    if (this.isClosed) {
      return;
    }
    var content = this.ui.content[0];
    var borders = this.el.offsetHeight - content.offsetHeight;
    var available = Math.max(0, availableHeight - borders);
    var previewHeight = this.ui.preview.outerHeight(true) || 0;
    this.el.style.setProperty('--available-height', `${available}px`);
    this.el.style.setProperty('--preview-max-height', `${Math.max(MIN_PREVIEW_HEIGHT, available - (content.scrollHeight - previewHeight))}px`);
  },
  // Positioning is async, so the view can already be gone by the time
  // the position has been computed.
  applyPosition: function ({
    x,
    y,
    middlewareData
  }) {
    var _middlewareData$arrow;
    if (this.isClosed) {
      return;
    }
    var arrowElement = this.ui.arrow[0];
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;

    // Half of the arrow sticks out of the overlay to point at the
    // thumbnail.
    arrowElement.style.right = `${-arrowElement.offsetWidth / 2}px`;
    if (((_middlewareData$arrow = middlewareData.arrow) === null || _middlewareData$arrow === void 0 ? void 0 : _middlewareData$arrow.y) != null) {
      arrowElement.style.top = `${middlewareData.arrow.y}px`;
    }
  },
  onClose: function () {
    Marionette.ItemView.prototype.onClose.call(this);
    this.closePreview();
    this.dismiss();
  }
});

function template$u(data) {
var __t, __p = '';
__p += '<div class="box">\n  <h1 class="dialog-header"></h1>\n\n  <p class="dialog-hint move_to_folder_dialog-hint"></p>\n\n  <div class="content">\n    <ul class="move_to_folder_dialog-targets"></ul>\n  </div>\n\n  <div class="footer">\n    <button class="close" type="button">\n      ' +
((__t = ( I18n.t('pageflow.editor.views.move_to_folder_dialog_view.cancel') )) == null ? '' : __t) +
'\n    </button>\n  </div>\n</div>\n';
return __p
}

const MoveToFolderDialogView = Marionette.ItemView.extend({
  template: template$u,
  className: 'move_to_folder_dialog editor dialog',
  mixins: [dialogView],
  ui: {
    header: '.dialog-header',
    hint: '.move_to_folder_dialog-hint',
    targets: '.move_to_folder_dialog-targets'
  },
  events: {
    'click .move_to_folder_dialog-target': function (event) {
      this.move($(event.currentTarget).data('folder'));
      return false;
    }
  },
  initialize: function () {
    this.movedFolders = this.options.models.filter(isFolder);

    // Nesting a folder inside itself or inside one of its own subfolders
    // would detach it from the folder tree.
    this.blockedPermaIds = this.movedFolders.reduce(function (permaIds, folder) {
      return permaIds.concat(this.options.fileFolders.descendantPermaIdsOf(folder));
    }.bind(this), []);
  },
  onRender: function () {
    var models = this.options.models;
    var kind = this.kind();
    this.ui.header.text(this.translation('header.' + kind, {
      count: models.length
    }));
    this.ui.hint.text(this.translation('hint.' + kind, {
      count: models.length,
      name: models[0].title()
    }));

    // Nesting the folders inside the target which stands for the root
    // matches the tree they form and takes care of indenting them.
    this.ui.targets.append(this.targetItem());
  },
  // Moving files and folders at once is about neither of them in
  // particular. Such a mixed selection always holds at least two items,
  // so its translations need no singular.
  kind: function () {
    if (!this.movedFolders.length) {
      return 'files';
    }
    return this.movedFolders.length === this.options.models.length ? 'folders' : 'items';
  },
  targetItem: function (folder) {
    var item = $('<li />', {
      'class': 'move_to_folder_dialog-target_item'
    }).append(this.targetButton(folder));

    // Folders which are still being named have no perma id to move a
    // file into yet.
    var children = this.options.fileFolders.childrenOf(folder).filter(function (child) {
      return !child.isNew();
    });
    if (children.length) {
      var list = $('<ul />');
      children.forEach(function (child) {
        list.append(this.targetItem(child));
      }, this);
      item.append(list);
    }
    return item;
  },
  targetButton: function (folder) {
    var current = this.permaIdOf(folder) === this.currentFolderPermaId();
    var blocked = !current && !!folder && this.blockedPermaIds.indexOf(folder.get('perma_id')) >= 0;
    var button = $('<button />', {
      'class': 'move_to_folder_dialog-target',
      type: 'button',
      disabled: current || blocked,
      'aria-current': current ? 'true' : null
    }).data('folder', folder);
    button.toggleClass('is_blocked', blocked);
    button.append($('<span />', {
      'class': 'move_to_folder_dialog-pictogram',
      'aria-hidden': 'true'
    }));
    button.append($('<span />', {
      'class': 'move_to_folder_dialog-name',
      text: folder ? folder.get('name') : this.translation('root')
    }));
    if (current) {
      button.append($('<span />', {
        'class': 'move_to_folder_dialog-current',
        text: this.translation('current')
      }));
    }
    return button;
  },
  // Setting the folder an item is already in is a no op, so moving a
  // selection does not save the items which do not actually move.
  //
  // Iterating a copy since moving an item can drop it from the selection
  // which the list passed in, which would skip the items behind it.
  move: function (folder) {
    var permaId = this.permaIdOf(folder);
    this.options.models.slice().forEach(function (model) {
      model.set(folderAttribute(model), permaId);
    });
    if (this.options.onMove) {
      this.options.onMove();
    }
    this.close();
  },
  // With items from more than one folder, none of the targets is the
  // folder they are all in.
  currentFolderPermaId: function () {
    var permaIds = this.options.models.map(function (model) {
      return model.get(folderAttribute(model));
    });
    return permaIds.every(function (permaId) {
      return permaId === permaIds[0];
    }) ? permaIds[0] : undefined;
  },
  permaIdOf: function (folder) {
    return folder ? folder.get('perma_id') : null;
  },
  translation: function (keyName, options) {
    return I18n$1.t('pageflow.editor.views.move_to_folder_dialog_view.' + keyName, options);
  }
});
MoveToFolderDialogView.open = function (options) {
  app.dialogRegion.show(new MoveToFolderDialogView(options));
};
function folderAttribute(model) {
  return isFolder(model) ? 'parent_folder_perma_id' : 'folder_perma_id';
}
function isFolder(model) {
  return model instanceof FileFolder;
}

// Mixin for item views of a list which can be navigated with arrow keys
// while the search field has focus. Views need to provide a `select`
// method for what pressing enter shall do.
const listHighlighting = {
  initialize: function () {
    if (!this.options.listHighlight) {
      return;
    }
    this.listenTo(this.options.listHighlight, 'change:currentCid change:active', () => {
      if (this.updateHighlight()) {
        this.el.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
    this.listenTo(this.options.listHighlight, 'selected:' + this.model.cid, this.select);
  },
  onRender: function () {
    this.updateHighlight();
  },
  updateHighlight: function () {
    if (!this.options.listHighlight) {
      return false;
    }
    var highlighted = this.options.listHighlight.get('currentCid') === this.model.cid && this.options.listHighlight.get('active');
    this.$el.toggleClass('keyboard_highlight', highlighted);
    this.$el.attr('aria-selected', highlighted ? 'true' : null);
    return highlighted;
  }
};

// Mixin for item views of the files list which name the folder an item
// was found in. Views need to provide a `parentFolderPermaId` method.
const parentFolderLabel = {
  ui: {
    parentFolder: '.files-parent_folder',
    parentFolderLabel: '.files-parent_folder_label',
    parentFolderName: '.files-parent_folder_name'
  },
  initialize: function () {
    if (this.options.fileFolders) {
      this.listenTo(this.options.fileFolders, 'change:name', this.updateParentFolder);
    }
  },
  onRender: function () {
    this.updateParentFolder();
  },
  // Rows which name no folder are left without text, so that the hidden
  // label does not end up in the name of the button or check box of the
  // row.
  updateParentFolder: function () {
    var folder = this.parentFolder();
    this.ui.parentFolderLabel.text(folder ? I18n$1.t('pageflow.editor.templates.files.in_folder') : '');
    this.ui.parentFolderName.text(folder ? folder.get('name') : '');
    this.ui.parentFolder.toggleClass('is_hidden', !folder);
  },
  // Only items outside the folder the list is displaying need their
  // folder named, which searching across folders is the only source of.
  parentFolder: function () {
    var _this$options$folder, _this$options$fileFol;
    var permaId = this.parentFolderPermaId();
    if (!permaId || permaId === ((_this$options$folder = this.options.folder) === null || _this$options$folder === void 0 ? void 0 : _this$options$folder.get('perma_id'))) {
      return;
    }
    return (_this$options$fileFol = this.options.fileFolders) === null || _this$options$fileFol === void 0 ? void 0 : _this$options$fileFol.byPermaId(permaId);
  }
};

function template$v(data) {
var __t, __p = '';
__p += '<button class="file_thumbnail_button" type="button">\n  <span class="file_thumbnail"></span>\n  <span class="file_item-reference_count"></span>\n</button>\n\n<div class="file_item-info">\n  <div class="actions">\n    ';
 if (data.selectable) {__p += '\n      <button class="select" type="button">' +
((__t = ( I18n.t('pageflow.editor.templates.file_item.select') )) == null ? '' : __t) +
'</button>\n    ';
 } else {__p += '\n      <button class="confirm" type="button" title="' +
((__t = ( I18n.t('pageflow.editor.templates.file_item.confirm') )) == null ? '' : __t) +
'"></button>\n      <button class="retry" type="button" title="' +
((__t = ( I18n.t('pageflow.editor.templates.file_item.retry') )) == null ? '' : __t) +
'"></button>\n      <button class="settings" type="button" title="' +
((__t = ( I18n.t('pageflow.editor.templates.file_item.settings') )) == null ? '' : __t) +
'"></button>\n    ';
 }__p += '\n  </div>\n\n  <span class="files-parent_folder">\n    <span class="files-parent_folder_label visually_hidden"></span>\n    <span class="files-parent_folder_name"></span>\n  </span>\n\n  <label class="file_item-name_row">\n    ';
 if (data.multiSelectable) {__p += '\n      <input class="file_item-check_box" type="checkbox" disabled />\n    ';
 }__p += '\n\n    <span class="file_name"></span>\n  </label>\n</div>\n';
return __p
}

// Long enough to sweep past a file without its overlay showing up.
const OPEN_DELAY = 200;
const FileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template: template$v,
  mixins: [loadable, listHighlighting, parentFolderLabel],
  ui: {
    fileName: '.file_name',
    checkBox: '.file_item-check_box',
    actions: '.actions',
    selectButton: '.select',
    settingsButton: '.settings',
    confirmButton: '.confirm',
    retryButton: '.retry',
    thumbnail: '.file_thumbnail',
    thumbnailButton: '.file_thumbnail_button',
    referenceCount: '.file_item-reference_count'
  },
  events: {
    'click .select': 'select',
    'change .file_item-check_box': function () {
      this.options.listSelection.toggle(this.model);
    },
    'click .settings': function () {
      FileSettingsDialogView.open({
        model: this.model
      });
    },
    'click .confirm': 'confirm',
    'click .retry': 'retry',
    'mouseenter .file_thumbnail_button': 'openMetaData',
    'mouseleave .file_thumbnail_button': 'dismissMetaData',
    'click .file_thumbnail_button': 'toggleMetaDataLock'
  },
  initialize: function () {
    this.menuItems = this.createMenuItems();
    if (this.options.fileFolders) {
      this.listenTo(this.options.fileFolders, 'add remove change:id', this.updateMoveItem);
    }
    if (this.multiSelectable()) {
      this.listenTo(this.options.listSelection, 'add remove reset change:selecting', this.updateSelected);
      this.listenTo(this.options.listSelection, 'change:selecting', this.updateReferenceCount);
    }
  },
  createMenuItems: function () {
    var items = new Backbone.Collection([{
      name: 'move',
      label: I18n$1.t('pageflow.editor.templates.file_item.move')
    }, {
      name: 'cancel',
      label: I18n$1.t('pageflow.editor.templates.file_item.cancel_upload')
    }, {
      name: 'destroy',
      label: I18n$1.t('pageflow.editor.templates.file_item.destroy'),
      destructive: true
    }]);
    items.findWhere({
      name: 'move'
    }).selected = () => this.move();
    items.findWhere({
      name: 'cancel'
    }).selected = () => this.cancel();
    items.findWhere({
      name: 'destroy'
    }).selected = () => this.destroy();
    return items;
  },
  menuItem: function (name) {
    return this.menuItems.findWhere({
      name: name
    });
  },
  modelEvents: {
    'change': 'update',
    'change:folder_perma_id': 'updateParentFolder'
  },
  parentFolderPermaId: function () {
    return this.model.get('folder_perma_id');
  },
  serializeData: function () {
    return {
      selectable: !!this.options.selectionHandler,
      multiSelectable: this.multiSelectable()
    };
  },
  // Picking a single file is the point of selection mode, so checking
  // files for a bulk action would only get in the way.
  multiSelectable: function () {
    return !this.options.selectionHandler && !!this.options.listSelection;
  },
  onRender: function () {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);
    this.update();
    this.updateSelected();
    this.updateReferenceCount();
    this.setupAriaAttributes();
    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));
    this.renderActionsDropDown();
  },
  // Built on first use. Rendering an overlay for every row would make
  // long file lists slow to display.
  //
  // Rendered next to the editor's menus so the overlay is not clipped
  // by the scrolling files list. Stays inside the item if there is no
  // container to portal into.
  metaDataOverlay: function () {
    if (!this.metaDataOverlayView) {
      this.metaDataOverlayView = this.subview(new FileMetaDataOverlayView({
        model: this.model,
        metaDataAttributes: this.options.metaDataAttributes,
        fileReferences: this.options.fileReferences,
        reference: this.ui.thumbnailButton[0]
      }));
      this.metaDataOverlayView.el.id = this.metaDataOverlayId();
      this.ui.thumbnailButton.attr('aria-controls', this.metaDataOverlayId());
      this.$el.append(this.metaDataOverlayView.el);
      this.metaDataOverlayView.$el.appendTo('#editor_menu_container');
      this.listenTo(this.metaDataOverlayView, 'toggle', this.updateExpanded);
    }
    return this.metaDataOverlayView;
  },
  metaDataOverlayId: function () {
    return 'file-details-' + this.model.cid;
  },
  // Selecting a file is the only action offered in selection mode.
  renderActionsDropDown: function () {
    if (this.options.selectionHandler) {
      return;
    }
    this.ui.actions.append(this.subview(new DropDownButtonView({
      items: this.menuItems,
      title: I18n$1.t('pageflow.editor.templates.file_item.actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    })).el);
  },
  update: function () {
    if (this.isClosed) {
      return;
    }
    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.title());
    this.ui.settingsButton.toggle(!this.model.isNew());
    this.menuItem('cancel').set('hidden', !this.model.isUploading());
    this.menuItem('destroy').set('hidden', this.model.isUploading());
    this.updateMoveItem();
    this.ui.confirmButton.toggle(this.model.isConfirmable());
    this.ui.retryButton.toggle(this.model.isRetryable());
    this.updateToggleLabel();
  },
  // The file name is the label of the check box, so the check box has to
  // be disabled while files are not being checked. Clicking a name would
  // otherwise check the file even though no check box is displayed.
  updateSelected: function () {
    if (!this.multiSelectable() || this.isClosed) {
      return;
    }
    var selected = this.options.listSelection.includes(this.model);
    this.ui.checkBox.prop('checked', selected);
    this.ui.checkBox.prop('disabled', !this.options.listSelection.isSelecting());
    this.$el.toggleClass('is_selected', selected);
  },
  // Counted only while files are being checked, since deciding which
  // files a bulk delete may take out of the entry is what the count is
  // there for.
  updateReferenceCount: function () {
    var _this$options$listSel;
    if (this.isClosed || !this.options.fileReferences || !((_this$options$listSel = this.options.listSelection) === null || _this$options$listSel === void 0 ? void 0 : _this$options$listSel.isSelecting())) {
      return;
    }
    var count = this.options.fileReferences.placesFor(this.model).length;
    this.ui.referenceCount.text(I18n$1.t('pageflow.editor.templates.file_item.reference_count', {
      count: count
    }));
    this.ui.referenceCount.toggleClass('is_unreferenced', !count);
  },
  // Only folders which have been created can hold a file, so an entry
  // whose only folder is still being named has nothing to move into.
  updateMoveItem: function () {
    var folders = this.options.fileFolders;
    var movable = !this.model.isNew() && !!folders && folders.some(function (folder) {
      return !folder.isNew();
    });
    this.menuItem('move').set('hidden', !movable);
  },
  // Moving the pointer across the list would otherwise flash the
  // overlays of all files on the way. Once one of them is open, moving
  // on to the next file is deliberate enough to skip the delay.
  openMetaData: function () {
    if (FileMetaDataOverlayView.currentlyOpen) {
      return this.metaDataOverlay().openUnlessPinned();
    }
    this.openMetaDataTimeout = setTimeout(() => {
      this.metaDataOverlay().openUnlessPinned();
    }, OPEN_DELAY);
  },
  dismissMetaData: function () {
    var _this$metaDataOverlay;
    clearTimeout(this.openMetaDataTimeout);
    (_this$metaDataOverlay = this.metaDataOverlayView) === null || _this$metaDataOverlay === void 0 ? void 0 : _this$metaDataOverlay.scheduleDismiss();
  },
  // Picking the file is the point of selection mode, so the thumbnail
  // does the same as the rest of the row. Pinning the overlay would
  // only get in the way of moving on to the next file.
  toggleMetaDataLock: function () {
    clearTimeout(this.openMetaDataTimeout);
    if (this.options.selectionHandler) {
      return this.select();
    }
    this.metaDataOverlay().toggleLock();
  },
  updateExpanded: function () {
    this.$el.toggleClass('expanded', this.metaDataOverlayView.isOpen());
    this.updateToggleLabel();
  },
  setupAriaAttributes: function () {
    var fileNameId = 'file-name-' + this.model.cid;
    var selectId = 'file-select-' + this.model.cid;

    // The select button covers the whole row, so its label has to name
    // the file it selects.
    this.ui.fileName.attr('id', fileNameId);
    this.ui.selectButton.attr('id', selectId);
    this.ui.selectButton.attr('aria-labelledby', selectId + ' ' + fileNameId);
  },
  // No title attribute, since hovering the thumbnail is what opens the
  // overlay in the first place. A tooltip about hiding details would
  // appear on top of the details it talks about.
  updateToggleLabel: function () {
    var isExpanded = this.$el.hasClass('expanded');
    var label = I18n$1.t(isExpanded ? 'pageflow.editor.templates.file_item.collapse_details' : 'pageflow.editor.templates.file_item.expand_details');
    this.ui.thumbnailButton.attr('aria-expanded', isExpanded.toString());
    this.ui.thumbnailButton.attr('aria-label', label);
  },
  move: function () {
    MoveToFolderDialogView.open({
      models: [this.model],
      fileFolders: this.options.fileFolders
    });
  },
  destroy: function () {
    if (window.confirm(I18n$1.t('pageflow.editor.views.file_item_view.confirm_destroy'))) {
      this.model.destroy();
    }
  },
  cancel: function () {
    this.model.cancelUpload();
  },
  confirm: function () {
    editor.navigate('/confirmable_files?type=' + this.model.modelName + '&id=' + this.model.id, {
      trigger: true
    });
  },
  retry: function () {
    this.model.retry();
  },
  select: function () {
    var result = this.options.selectionHandler.call(this.model);
    if (result !== false) {
      editor.navigate(this.options.selectionHandler.getReferer(), {
        trigger: true
      });
    }
    return false;
  },
  onClose: function () {
    Marionette.ItemView.prototype.onClose.call(this);
    clearTimeout(this.openMetaDataTimeout);
  }
});

function template$w(data) {
var __t, __p = '';
__p += '<span class="file_folders-pictogram" aria-hidden="true"></span>\n\n<div class="file_folders-info">\n  ';
 if (data.naming) {__p += '\n    <input class="file_folders-input"\n           type="text"\n           aria-label="' +
((__t = ( data.nameLabel )) == null ? '' : __t) +
'" />\n  ';
 } else {__p += '\n    ';
 if (data.selecting) {__p += '\n      <label class="file_folders-label">\n        <span class="files-parent_folder">\n          <span class="files-parent_folder_label visually_hidden"></span>\n          <span class="files-parent_folder_name"></span>\n        </span>\n\n        <span class="file_folders-title">\n          <input class="file_folders-check_box" type="checkbox" />\n          <span class="file_folders-name"></span>\n        </span>\n        <span class="file_folders-file_count"></span>\n      </label>\n    ';
 } else {__p += '\n      <button class="file_folders-button" type="button">\n        <span class="files-parent_folder">\n          <span class="files-parent_folder_label visually_hidden"></span>\n          <span class="files-parent_folder_name"></span>\n        </span>\n\n        <span class="file_folders-title">\n          <span class="file_folders-name"></span>\n          <span class="file_folders-chevron" aria-hidden="true"></span>\n        </span>\n        <span class="file_folders-file_count"></span>\n      </button>\n    ';
 }__p += '\n\n    <div class="file_folders-actions"></div>\n  ';
 }__p += '\n</div>\n';
return __p
}

const FolderItemView = Marionette.ItemView.extend({
  template: template$w,
  tagName: 'li',
  className: 'file_folders-item',
  mixins: [listHighlighting, parentFolderLabel],
  ui: {
    name: '.file_folders-name',
    checkBox: '.file_folders-check_box',
    fileCount: '.file_folders-file_count',
    actions: '.file_folders-actions',
    input: '.file_folders-input'
  },
  events: {
    'click .file_folders-button': 'select',
    'change .file_folders-check_box': function () {
      this.options.listSelection.toggle(this.model);
    },
    'keydown .file_folders-input': 'handleInputKeyDown',
    'blur .file_folders-input': 'commit'
  },
  modelEvents: {
    // Rerender to replace the name input with the row of the created
    // folder.
    'change:id': 'render',
    'change:name': 'update',
    'change:parent_folder_perma_id': 'updateParentFolder'
  },
  parentFolderPermaId: function () {
    return this.model.get('parent_folder_perma_id');
  },
  initialize: function () {
    this.menuItems = this.createMenuItems();
    this.listenTo(this.options.files, 'add remove change:folder_perma_id', this.updateFileCount);
    this.listenTo(this.options.fileFolders, 'add remove change:parent_folder_perma_id', this.updateFileCount);
    this.listenTo(this.options.files, 'add remove change:folder_perma_id', this.updateDestroyItem);
    this.listenTo(this.options.fileFolders, 'add remove change:parent_folder_perma_id', this.updateDestroyItem);
    this.listenTo(this.options.fileFolders, 'add remove change:id change:parent_folder_perma_id', this.updateMoveItem);
    if (this.multiSelectable()) {
      this.listenTo(this.options.listSelection, 'add remove reset', this.updateSelected);

      // The button which navigates into the folder gives way to the check
      // box, so the row has to be built again.
      this.listenTo(this.options.listSelection, 'change:selecting', this.render);
    }
  },
  createMenuItems: function () {
    var items = new Backbone.Collection([{
      name: 'rename',
      label: I18n$1.t('pageflow.editor.views.folder_item_view.rename')
    }, {
      name: 'move',
      label: I18n$1.t('pageflow.editor.views.folder_item_view.move')
    }, {
      name: 'destroy',
      label: I18n$1.t('pageflow.editor.views.folder_item_view.destroy'),
      destructive: true
    }]);
    items.findWhere({
      name: 'rename'
    }).selected = () => {
      this.renaming = true;
      this.render();
    };
    items.findWhere({
      name: 'move'
    }).selected = () => this.move();
    items.findWhere({
      name: 'destroy'
    }).selected = () => this.model.destroy();
    return items;
  },
  move: function () {
    MoveToFolderDialogView.open({
      models: [this.model],
      fileFolders: this.options.fileFolders
    });
  },
  // Moving a folder out to the top level is always an option, while a
  // folder which already is at the top level needs some other folder
  // outside its own subtree to move into.
  updateMoveItem: function () {
    var folders = this.options.fileFolders;
    var ownPermaIds = folders.descendantPermaIdsOf(this.model);
    var movable = !this.model.isNew() && (this.model.get('parent_folder_perma_id') !== null || folders.some(function (folder) {
      return !folder.isNew() && ownPermaIds.indexOf(folder.get('perma_id')) < 0;
    }));
    this.menuItems.findWhere({
      name: 'move'
    }).set('hidden', !movable);
  },
  // Files hidden by the file type filter cannot make a folder look
  // empty, since such a folder is not listed to begin with.
  updateDestroyItem: function () {
    var empty = this.options.fileFolders.isEmptyFolder(this.model, this.options.files);
    this.menuItems.findWhere({
      name: 'destroy'
    }).set('hidden', !empty);
  },
  serializeData: function () {
    return {
      naming: this.isEditingName(),
      selecting: this.isSelecting(),
      nameLabel: I18n$1.t(this.renaming ? 'pageflow.editor.views.folder_item_view.new_name' : 'pageflow.editor.views.folder_item_view.name')
    };
  },
  onRender: function () {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);
    this.$el.toggleClass('naming', this.isEditingName());
    this.update();
    this.updateSelected();
    this.updateFileCount();
    this.updateDestroyItem();
    this.updateMoveItem();
    this.renderActionsDropDown();
    if (this.isEditingName()) {
      this.ui.input.val(this.model.get('name'));
      setTimeout(() => this.ui.input.focus().select(), 0);
    }
  },
  // Navigating into the folder is the only action offered in selection
  // mode.
  renderActionsDropDown: function () {
    if (this.isEditingName() || this.options.selectionHandler) {
      return;
    }
    this.appendSubview(new DropDownButtonView({
      items: this.menuItems,
      title: I18n$1.t('pageflow.editor.views.folder_item_view.actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {
      to: this.ui.actions
    });
  },
  isEditingName: function () {
    return this.model.isNew() || !!this.renaming;
  },
  isSelecting: function () {
    return this.multiSelectable() && this.options.listSelection.isSelecting();
  },
  multiSelectable: function () {
    return !this.options.selectionHandler && !!this.options.listSelection;
  },
  updateSelected: function () {
    if (this.isClosed) {
      return;
    }
    var selected = this.isSelecting() && this.options.listSelection.includes(this.model);
    this.ui.checkBox.prop('checked', selected);
    this.$el.toggleClass('is_selected', selected);
  },
  // Navigating into the folder is the only action of the row, so it is
  // also what selecting the highlighted row does.
  select: function () {
    this.options.onSelect(this.model);
  },
  update: function () {
    this.ui.name.text(this.model.get('name'));
  },
  // Removing the folder from the collection notifies the view before it
  // has stopped listening.
  updateFileCount: function () {
    if (this.isClosed) {
      return;
    }
    this.ui.fileCount.text(I18n$1.t('pageflow.editor.views.folder_item_view.file_count', {
      count: this.fileCount()
    }));
  },
  // Files in subfolders count towards the folder as well, matching the
  // recursive notion of an empty folder.
  fileCount: function () {
    var permaIds = this.options.fileFolders.descendantPermaIdsOf(this.model);
    return this.options.files.filter(function (file) {
      return permaIds.indexOf(file.get('folder_perma_id')) >= 0;
    }).length;
  },
  handleInputKeyDown: function (event) {
    if (event.key === 'Enter') {
      this.commit();
    } else if (event.key === 'Escape') {
      this.discard();
    }
  },
  // Rerendering removes the input, which can trigger another blur.
  commit: function () {
    if (!this.isEditingName()) {
      return;
    }
    var name = this.ui.input.val().trim();
    if (this.model.isNew()) {
      if (!name) {
        return this.discard();
      }
      this.model.set('name', name);
      return this.model.save();
    }
    this.renaming = false;
    this.render();
    if (name) {
      this.model.set('name', name);
    }
  },
  discard: function () {
    if (this.model.isNew()) {
      var _this$model$collectio;
      (_this$model$collectio = this.model.collection) === null || _this$model$collectio === void 0 ? void 0 : _this$model$collectio.remove(this.model);
    } else if (this.renaming) {
      this.renaming = false;
      this.render();
    }
  }
});

// Folders and files share one list, which needs a single constructor to
// build its rows with. Returning a view from a constructor makes it the
// result of the `new` expression, so this stands in for either view.
function FilesListItemView(options) {
  if (options.model instanceof FileFolder) {
    return new FolderItemView(options);
  }
  return new FileItemView({
    ...options,
    metaDataAttributes: options.model.fileType().metaDataAttributes
  });
}

function template$x(data) {
var __t, __p = '';
__p += '<div class="file_type_pills-group"\n     role="group"\n     aria-label="' +
((__t = ( I18n.t('pageflow.editor.views.file_type_pills_view.group_label') )) == null ? '' : __t) +
'">\n</div>\n';
return __p
}

function pillTemplate(data) {
var __t, __p = '';
__p +=
((__t = ( data.label )) == null ? '' : __t) +
'<span class="file_type_pills-remove" aria-hidden="true"></span><span class="file_type_pills-add" aria-hidden="true"></span>\n';
return __p
}

const FileTypePillsView = Marionette.ItemView.extend({
  template: template$x,
  className: 'file_type_pills',
  ui: {
    group: '.file_type_pills-group'
  },
  initialize: function () {
    this.options.fileTypes.forEach(function (fileType) {
      this.listenTo(filesOfType(this.options.entry, fileType), 'add remove', this.update);
    }, this);
  },
  onRender: function () {
    this.pillViews = this.options.fileTypes.map(function (fileType) {
      var pillView = new FileTypePillView({
        fileType: fileType,
        fileTypes: this.options.fileTypes,
        fileTypeSelection: this.options.fileTypeSelection,
        entry: this.options.entry
      });
      this.appendSubview(pillView, {
        to: this.ui.group
      });
      return pillView;
    }, this);
    this.handleDocumentKeyEvent = this.handleDocumentKeyEvent.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    $(document).on('keydown keyup', this.handleDocumentKeyEvent);
    $(window).on('blur', this.handleWindowBlur);
    this.update();
  },
  onClose: function () {
    Marionette.ItemView.prototype.onClose.call(this);
    $(document).off('keydown keyup', this.handleDocumentKeyEvent);
    $(window).off('blur', this.handleWindowBlur);
  },
  // Pills state which file types the list holds, which is of interest
  // even while files of only one type are present. Filtering by that
  // single type is pointless, though, so the hint about filtering only
  // shows up once there is more than one type to choose from.
  update: function () {
    var present = presentFileTypes(this.options.entry, this.options.fileTypes);
    this.$el.toggle(present.length > 0);
    this.ui.group.attr('title', present.length > 1 ? this.hint() : null);
    (this.pillViews || []).forEach(function (pillView) {
      pillView.update();
    });
  },
  hint: function () {
    return I18n$1.t('pageflow.editor.views.file_type_pills_view.hint');
  },
  handleDocumentKeyEvent: function (event) {
    this.toggleCombining(event.metaKey || event.ctrlKey);
  },
  // Releasing the modifier key outside of the window would go unnoticed.
  handleWindowBlur: function () {
    this.toggleCombining(false);
  },
  toggleCombining: function (combining) {
    this.pillViews.forEach(function (pillView) {
      pillView.toggleCombining(combining);
    });
  }
});
const FileTypePillView = Marionette.ItemView.extend({
  template: pillTemplate,
  tagName: 'button',
  className: 'file_type_pills-pill',
  attributes: {
    type: 'button'
  },
  events: {
    'click': function (event) {
      this.applyToSelection(event.metaKey || event.ctrlKey);
    },
    // Browsers do not activate buttons on enter while a modifier key is held.
    'keydown': function (event) {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.applyToSelection(true);
      }
    }
  },
  initialize: function () {
    this.listenTo(this.options.fileTypeSelection, 'change:collectionNames', this.update);
    this.listenTo(this.options.entry, 'change:uploading_' + this.collectionName() + '_count', this.update);
    this.listenTo(this.files(), 'add remove', this.update);
  },
  serializeData: function () {
    return {
      label: I18n$1.t('pageflow.editor.files.tabs.' + this.collectionName())
    };
  },
  onRender: function () {
    this.update();
  },
  update: function () {
    var onlyPresentType = this.isOnlyPresentType();

    // The pill of the only file type present states that the list holds
    // files of that type, which cannot be turned off.
    var selected = onlyPresentType || this.options.fileTypeSelection.isSelected(this.collectionName());
    this.$el.attr('aria-pressed', selected ? 'true' : 'false');
    this.$el.toggleClass('active', selected);
    this.$el.toggleClass('only_type', onlyPresentType);
    this.$el.toggleClass('only_active', this.isOnlyActive());
    this.$el.toggleClass('removable', this.isRemovable());
    this.$el.toggleClass('addable', this.isAddable());
    this.$el.toggleClass('spinner', this.uploadingCount() > 0);
    this.$el.toggle(this.files().length > 0);
  },
  toggleCombining: function (combining) {
    this.combining = combining;
    this.update();
  },
  applyToSelection: function (combining) {
    if (this.isOnlyPresentType()) {
      return;
    }
    if (combining) {
      this.options.fileTypeSelection.toggle(this.collectionName());
    } else {
      this.options.fileTypeSelection.selectOnly(this.collectionName());
    }
  },
  // Clicking a pill only removes its file type from the selection while
  // the modifier key is held. Otherwise it narrows the selection down to
  // that single type, unless it is selected on its own already.
  isRemovable: function () {
    if (this.isOnlyPresentType() || !this.options.fileTypeSelection.isSelected(this.collectionName())) {
      return false;
    }
    return this.combining || this.isOnlyActive();
  },
  // Clicking a pill only adds its file type to the selection while the
  // modifier key is held. Otherwise it replaces the selection.
  isAddable: function () {
    return !!this.combining && !this.isOnlyPresentType() && !this.options.fileTypeSelection.isSelected(this.collectionName());
  },
  isOnlyActive: function () {
    return !this.isOnlyPresentType() && this.options.fileTypeSelection.isOnlySelected(this.collectionName());
  },
  isOnlyPresentType: function () {
    var present = presentFileTypes(this.options.entry, this.options.fileTypes);
    return present.length === 1 && present[0] === this.options.fileType;
  },
  collectionName: function () {
    return this.options.fileType.collectionName;
  },
  uploadingCount: function () {
    return this.options.entry.get('uploading_' + this.collectionName() + '_count');
  },
  files: function () {
    return filesOfType(this.options.entry, this.options.fileType);
  }
});
function presentFileTypes(entry, fileTypes) {
  return fileTypes.filter(function (fileType) {
    return filesOfType(entry, fileType).length > 0;
  });
}
function filesOfType(entry, fileType) {
  return entry.getFileCollection(fileType);
}

function template$y(data) {
var __t, __p = '';
__p += '<nav class="folder_breadcrumb-path"\n     aria-label="' +
((__t = ( I18n.t('pageflow.editor.views.folder_breadcrumb_view.label') )) == null ? '' : __t) +
'">\n  <button class="folder_breadcrumb-root"\n          type="button"\n          title="' +
((__t = ( I18n.t('pageflow.editor.views.folder_breadcrumb_view.reset') )) == null ? '' : __t) +
'"\n          aria-label="' +
((__t = ( I18n.t('pageflow.editor.views.folder_breadcrumb_view.reset') )) == null ? '' : __t) +
'">\n  </button>\n</nav>\n';
return __p
}

const FolderBreadcrumbView = Marionette.ItemView.extend({
  template: template$y,
  className: 'folder_breadcrumb',
  ui: {
    path: '.folder_breadcrumb-path'
  },
  events: {
    'click .folder_breadcrumb-parent': function (event) {
      this.options.onSelect($(event.currentTarget).data('folder'));
      return false;
    },
    'click .folder_breadcrumb-root': function () {
      this.options.onSelect(null);
      return false;
    }
  },
  modelEvents: {
    'change:name': 'render'
  },
  onRender: function () {
    this.options.fileFolders.ancestorsOf(this.model).forEach(function (folder) {
      this.appendSegment(this.parentSegment(folder));
    }, this);
    this.appendSegment(this.currentSegment());
  },
  // The folder icon of the root stands in for a segment of its own, so
  // every name is preceded by a separator.
  appendSegment: function (segment) {
    this.ui.path.append(this.separator()).append(segment);
  },
  separator: function () {
    return $('<span />', {
      'class': 'folder_breadcrumb-separator',
      'aria-hidden': 'true'
    });
  },
  parentSegment: function (folder) {
    return $('<button />', {
      'class': 'folder_breadcrumb-parent',
      type: 'button',
      text: folder.get('name')
    }).data('folder', folder);
  },
  currentSegment: function () {
    return $('<span />', {
      'class': 'folder_breadcrumb-current',
      text: this.model.get('name')
    });
  }
});

function template$z(data) {
var __t, __p = '';
__p += '<input type="text" class="list_search_field-term" />\n<span class="list_search_field-placeholder"></span>\n<a href=""\n   class="list_search_field-reset"\n   title="' +
((__t = ( I18n.t('pageflow.editor.templates.list_search_field.reset') )) == null ? '' : __t) +
'"></a>\n';
return __p
}

const ListSearchFieldView = Marionette.ItemView.extend({
  template: template$z,
  className: 'list_search_field',
  ui: {
    input: '.list_search_field-term',
    placeholder: '.list_search_field-placeholder'
  },
  events: {
    'input .list_search_field-term': 'changeTerm',
    'click .list_search_field-reset': 'reset',
    'keydown .list_search_field-term': 'handleInputKeyDown',
    'focus .list_search_field-term': 'handleInputFocus',
    'blur .list_search_field-term': 'handleInputBlur'
  },
  initialize(options = {}) {
    this.search = options.search;
    this.listHighlight = options.listHighlight;
  },
  onRender() {
    this.toggleReset();
    this.ui.input.attr('aria-label', this.label());
    this.ui.placeholder.html(this.hint());
    if (this.options.ariaControlsId) {
      this.ui.input.attr('aria-controls', this.options.ariaControlsId);
    }
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    $(document).on('keydown', this.handleDocumentKeyDown);
    if (this.options.autoFocus) {
      setTimeout(() => this.ui.input.focus(), 0);
    }
  },
  onClose() {
    $(document).off('keydown', this.handleDocumentKeyDown);
  },
  label() {
    return this.options.label || I18n$1.t('pageflow.editor.templates.list_search_field.placeholder');
  },
  hint() {
    return I18n$1.t(this.options.hintTranslationKey || 'pageflow.editor.templates.list_search_field.hint', {
      hotkey: '<kbd>/</kbd>'
    });
  },
  changeTerm() {
    this.search.set('term', this.ui.input.val());
    this.toggleReset();
  },
  reset(event) {
    this.ui.input.val('');
    this.search.set('term', '');
    this.toggleReset();
    this.ui.input.focus();
    if (event) {
      event.preventDefault();
    }
  },
  handleDocumentKeyDown(event) {
    const active = document.activeElement;
    if (event.key === '/' && !/input|textarea/i.test(active.tagName)) {
      this.ui.input.focus();
      event.preventDefault();
    }
  },
  handleInputKeyDown(event) {
    if (event.key === 'Escape') {
      if (this.search.get('term')) {
        this.reset();
      } else {
        this.ui.input.blur();
      }
    } else if (this.listHighlight) {
      if (event.key === 'ArrowDown') {
        this.listHighlight.next();
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        this.listHighlight.previous();
        event.preventDefault();
      } else if (event.key === 'Enter') {
        this.listHighlight.triggerSelect();
      }
    }
  },
  handleInputFocus() {
    this.$el.addClass('focus');
    if (this.listHighlight) {
      this.listHighlight.set('active', true);
    }
  },
  handleInputBlur() {
    this.$el.removeClass('focus');
    if (this.listHighlight) {
      this.listHighlight.set('active', false);
    }
  },
  toggleReset() {
    this.$el.toggleClass('has_value', !!this.search.get('term'));
  }
});

function template$A(data) {
var __p = '';
__p += '<div class="filtered_files-banner">\n  <span class="filtered_files-banner_text"></span>\n  <button type="button" class="filtered_files-banner_dismiss"></button>\n</div>\n<div class="filtered_files-header">\n  <div class="filtered_files-browse_controls">\n    <div class="filtered_files-filter_bar">\n    </div>\n  </div>\n\n  <div class="filtered_files-selection_bar">\n    <div class="filtered_files-selection_bar_status">\n      <span class="filtered_files-selection_bar_text" aria-live="polite"></span>\n      <button type="button" class="filtered_files-selection_bar_dismiss"></button>\n    </div>\n\n    <div class="filtered_files-selection_bar_actions">\n      <button type="button" class="filtered_files-selection_bar_action"></button>\n      <button type="button" class="filtered_files-selection_bar_destroy"></button>\n    </div>\n  </div>\n</div>\n<div class="filtered_files-list"></div>\n';
return __p
}

const FilteredFilesView = Marionette.ItemView.extend({
  template: template$A,
  className: 'filtered_files',
  ui: {
    banner: '.filtered_files-banner',
    bannerText: '.filtered_files-banner_text',
    bannerDismiss: '.filtered_files-banner_dismiss',
    header: '.filtered_files-header',
    browseControls: '.filtered_files-browse_controls',
    filterBar: '.filtered_files-filter_bar',
    selectionBar: '.filtered_files-selection_bar',
    selectionBarText: '.filtered_files-selection_bar_text',
    selectionBarAction: '.filtered_files-selection_bar_action',
    selectionBarDestroy: '.filtered_files-selection_bar_destroy',
    selectionBarDismiss: '.filtered_files-selection_bar_dismiss',
    list: '.filtered_files-list',
    sort: '.filtered_files-sort'
  },
  events: {
    // Leaves selection mode and any named filter behind, but stays in
    // the files list and in the current folder. Returning to where the
    // selection was requested from is what the back button is for.
    'click .filtered_files-banner_dismiss': function () {
      this.options.onDismissSelection();
      return false;
    },
    // Each bulk action is the point of the selection it acts on, so the
    // check boxes go away again once one of them has run.
    'click .filtered_files-selection_bar_action': function () {
      MoveToFolderDialogView.open({
        models: this.listSelection.models,
        fileFolders: this.options.fileFolders,
        onMove: () => this.stopSelecting()
      });
      return false;
    },
    'click .filtered_files-selection_bar_destroy': function () {
      this.destroySelection();
      return false;
    },
    'click .filtered_files-selection_bar_dismiss': function () {
      this.stopSelecting();
      return false;
    }
  },
  initialize: function () {
    var _editor$entryType;
    this.search = new Search({}, {
      attribute: 'display_name',
      storageKey: 'pageflow.filtered_files.sort_order'
    });
    var collections = this.options.fileTypes.map(function (fileType) {
      return this.options.entry.getFileCollection(fileType);
    }, this);
    if (this.options.filterName) {
      this.filteredCollections = collections.map(function (collection) {
        return collection.withFilter(this.options.filterName);
      }, this);
    }
    this.combinedFiles = new CombinedFilesCollection({
      collections: this.filteredCollections || collections
    });
    if (this.options.fileTypeSelection) {
      this.selectedFiles = new SubsetCollection({
        parent: this.combinedFiles,
        filter: this.matchesFileTypeSelection.bind(this)
      });
      this.listenTo(this.options.fileTypeSelection, 'change:collectionNames', function () {
        this.selectedFiles.updateFilter(this.matchesFileTypeSelection.bind(this));
      });
    }
    if (this.options.fileFolders) {
      this.folderFiles = new SubsetCollection({
        parent: this.selectedFiles || this.combinedFiles,
        filter: this.matchesFolder.bind(this),
        watchAttribute: 'folder_perma_id'
      });
      this.visibleFolders = new SubsetCollection({
        parent: this.options.fileFolders,
        filter: this.isVisibleFolder.bind(this),
        watchAttribute: 'parent_folder_perma_id'
      });
      this.listenTo(this.search, 'change:term', function () {
        this.folderFiles.updateFilter(this.matchesFolder.bind(this));
        this.updateVisibleFolders();
      });
      this.listenTo(this.combinedFiles, 'add remove change:folder_perma_id', this.updateVisibleFolders);
      if (this.options.fileTypeSelection) {
        this.listenTo(this.options.fileTypeSelection, 'change:collectionNames', this.updateVisibleFolders);
      }
    }
    this.searchFilteredCollection = this.search.applyTo(this.folderFiles || this.selectedFiles || this.combinedFiles);

    // Folders and files form one list, so that keyboard navigation
    // reaches both and the blank slate only appears once neither is
    // left.
    this.listItems = new ConcatenatedCollection({
      collections: [this.visibleFolders, this.searchFilteredCollection].filter(Boolean)
    });
    if (this.options.selectionHandler) {
      this.listHighlight = new ListHighlight({}, {
        collection: this.listItems
      });
    } else {
      this.setupListSelection();
    }

    // Walking the entry once and looking each file up lets the list
    // display a reference count per row without repeating the walk.
    if ((_editor$entryType = editor.entryType) === null || _editor$entryType === void 0 ? void 0 : _editor$entryType.supportsFileReferences) {
      this.fileReferences = this.options.entry.fileReferences();
    }
    this.menuItems = this.createMenuItems();
  },
  setupListSelection: function () {
    this.listSelection = new ListSelection();

    // An item which has been moved, deleted or filtered out has no row
    // left to uncheck, so the number in the bar would stop matching the
    // list.
    this.listenTo(this.listItems, 'remove', function (model) {
      this.listSelection.remove(model);
    });
    this.listenTo(this.listSelection, 'add remove reset', this.updateSelectionBar);
    this.listenTo(this.listSelection, 'change:selecting', this.updateSelecting);
    this.listenTo(this.combinedFiles, 'add remove', this.updateSelectable);
    if (this.options.fileFolders) {
      this.listenTo(this.options.fileFolders, 'add remove change:id', this.updateSelectable);
    }
  },
  onRender: function () {
    this.renderBanner();
    this.renderSearchField();
    this.renderMenu();
    this.renderFileTypePills();
    this.renderBreadcrumb();
    this.renderCollectionView();
    this.updateSelecting();
    if (this.listSelection) {
      this.updateSelectable();
    }
  },
  // Being in selection mode is easy to overlook once the list fills the
  // sidebar, so the banner spells out what is being looked for.
  renderBanner: function () {
    // Rendering it hidden is not an option, since jQuery would set an
    // inline display of block on the still detached element, which the
    // flex layout of the banner would not survive.
    if (!this.options.filterName && !this.options.selectionHandler) {
      return this.ui.banner.remove();
    }
    var dismissLabel = this.bannerTranslation(this.options.selectionHandler ? 'cancel_selection' : 'reset_filter');
    this.renderBannerText();
    this.ui.bannerDismiss.attr({
      title: dismissLabel,
      'aria-label': dismissLabel
    });
  },
  // Emphasizes the name inside the sentence without requiring markup in
  // the translation.
  renderBannerText: function () {
    var placeholder = '\u0000';
    var parts = this.bannerTranslation('select', {
      name: placeholder
    }).split(placeholder);
    this.ui.bannerText.empty().append(document.createTextNode(parts[0])).append($('<span />', {
      class: 'filtered_files-banner_name',
      text: this.selectionName()
    })).append(document.createTextNode(parts[1] || ''));
  },
  // The view which requested the selection knows best what the file
  // will be used for. A named filter is only ever requested for a
  // single file type and its name already says which.
  selectionName: function () {
    var _this$options$selecti;
    return ((_this$options$selecti = this.options.selectionHandler) === null || _this$options$selecti === void 0 ? void 0 : _this$options$selecti.selectionLabel) || this.options.filterName && this.filterTranslation('name') || this.fileTypeName() || this.bannerTranslation('any_file_type');
  },
  fileTypeName: function () {
    if (!this.options.selectionFileType) {
      return;
    }
    var collectionName = this.options.selectionFileType.collectionName;
    return i18nUtils.findTranslation(['pageflow.editor.files.singular.' + collectionName, 'pageflow.editor.files.tabs.' + collectionName]);
  },
  bannerTranslation: function (keyName, options) {
    return this.translation(keyName, options);
  },
  renderSearchField() {
    this.searchFieldView = this.appendSubview(new ListSearchFieldView({
      search: this.search,
      label: this.searchLabel(),
      hintTranslationKey: this.searchHintTranslationKey(),
      listHighlight: this.listHighlight,
      ariaControlsId: 'filtered_files',
      autoFocus: !!this.options.selectionHandler
    }), {
      to: this.ui.filterBar
    });
  },
  searchHintTranslationKey: function () {
    return this.options.folder ? 'pageflow.editor.templates.list_search_field.hint_in_folder' : 'pageflow.editor.templates.list_search_field.hint_in_all_folders';
  },
  searchLabel: function () {
    if (this.options.folder) {
      return I18n$1.t('pageflow.editor.views.filtered_files_view.search_in_folder', {
        folder: this.options.folder.get('name')
      });
    }
    return I18n$1.t('pageflow.editor.views.filtered_files_view.search');
  },
  renderMenu: function () {
    this.appendSubview(new DropDownButtonView({
      title: this.translation('actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      openOnClick: true,
      items: this.menuItems
    }), {
      to: this.ui.filterBar
    });
  },
  createMenuItems: function () {
    var items = new Backbone.Collection([{
      name: 'sort',
      label: this.translation('sort_button_label'),
      items: new SortMenuItemsCollection([{
        name: 'alphabetical'
      }, {
        name: 'most_recent'
      }], {
        search: this.search
      })
    }]);
    if (this.listSelection) {
      items.add({
        name: 'select',
        label: this.translation('select_items')
      });
      items.findWhere({
        name: 'select'
      }).selected = () => this.startSelecting();
    }
    return items;
  },
  startSelecting: function () {
    this.listSelection.start();
  },
  stopSelecting: function () {
    this.listSelection.stop();
  },
  destroySelection: function () {
    var message = this.translation('confirm_destroy_selection', {
      count: this.listSelection.length
    });
    if (!window.confirm(message)) {
      return;
    }
    this.listSelection.destroyAll();
    this.stopSelecting();
  },
  updateSelecting: function () {
    if (!this.listSelection) {
      return this.ui.selectionBar.remove();
    }
    var selecting = this.listSelection.isSelecting();
    this.ui.browseControls.toggleClass('is_hidden', selecting);
    this.ui.selectionBar.toggleClass('is_hidden', !selecting);
    this.collectionView.$el.toggleClass('is_selecting', selecting);
    var dismissLabel = this.translation('end_selection');
    var destroyLabel = this.translation('destroy_selection');
    this.ui.selectionBarDismiss.attr({
      title: dismissLabel,
      'aria-label': dismissLabel
    });
    this.ui.selectionBarAction.text(this.translation('move_selection'));
    this.ui.selectionBarDestroy.attr({
      title: destroyLabel,
      'aria-label': destroyLabel
    });

    // Files can only be moved into folders, so entries which have none
    // offer nothing to move a selection into.
    this.ui.selectionBarAction.toggle(!!this.options.fileFolders);
    this.updateSelectionBar();
  },
  // An entry without files and folders has nothing to check, so the bar
  // neither reserves space above the list nor can be opened from the
  // menu. Folders which are still being named have no row to check yet.
  updateSelectable: function () {
    var folders = this.options.fileFolders;
    var selectable = !!this.combinedFiles.length || !!folders && folders.some(function (folder) {
      return !folder.isNew();
    });
    if (!selectable) {
      this.listSelection.stop();
    }
    this.menuItems.findWhere({
      name: 'select'
    }).set('disabled', !selectable);
    this.ui.selectionBar.toggleClass('is_unavailable', !selectable);
  },
  updateSelectionBar: function () {
    this.ui.selectionBarText.text(this.translation('selected_items', {
      count: this.listSelection.length
    }));
    this.ui.selectionBarAction.prop('disabled', !this.listSelection.length);
    this.ui.selectionBarDestroy.prop('disabled', !this.listSelection.length || this.selectionContainsNonEmptyFolder());
  },
  selectionContainsNonEmptyFolder: function () {
    var files = this.selectedFiles || this.combinedFiles;
    return this.listSelection.some(function (model) {
      return model instanceof FileFolder && !this.options.fileFolders.isEmptyFolder(model, files);
    }, this);
  },
  translation: function (keyName, options) {
    return I18n$1.t('pageflow.editor.views.filtered_files_view.' + keyName, options);
  },
  renderFileTypePills: function () {
    if (!this.options.fileTypeSelection) {
      return;
    }
    this.appendSubview(new FileTypePillsView({
      entry: this.options.entry,
      fileTypes: this.options.fileTypes,
      fileTypeSelection: this.options.fileTypeSelection
    }), {
      to: this.ui.browseControls
    });
  },
  renderBreadcrumb: function () {
    if (!this.options.folder) {
      return;
    }
    var view = this.subview(new FolderBreadcrumbView({
      model: this.options.folder,
      fileFolders: this.options.fileFolders,
      onSelect: this.options.onSelectFolder
    }));
    view.$el.insertBefore(this.ui.list);
  },
  renderCollectionView: function () {
    var blankSlateText = this.options.filterName ? this.filterTranslation('blank_slate') : I18n$1.t('pageflow.editor.templates.files_blank_slate.no_files');
    this.collectionView = this.subview(new CollectionView({
      tagName: 'ul',
      id: 'filtered_files',
      className: 'files',
      collection: this.listItems,
      itemViewConstructor: FilesListItemView,
      itemViewOptions: {
        onSelect: this.options.onSelectFolder,
        folder: this.options.folder,
        fileFolders: this.options.fileFolders,
        files: this.selectedFiles || this.combinedFiles,
        listSelection: this.listSelection,
        selectionHandler: this.options.selectionHandler,
        listHighlight: this.listHighlight,
        fileReferences: this.fileReferences
      },
      blankSlateViewConstructor: FilesBlankSlateView,
      blankSlateViewOptions: {
        text: blankSlateText,
        folder: this.options.folder,
        fileFolders: this.options.fileFolders,
        files: this.combinedFiles
      }
    }));
    this.appendSubview(this.collectionView, {
      to: this.ui.list
    });
  },
  filterTranslation: function (keyName, options) {
    var filterName = this.options.filterName;
    var collectionName = this.filteredFileType().collectionName;
    var entryTypeName = editor.entryType.name;
    return i18nUtils.findTranslation(['pageflow.entry_types.' + entryTypeName + '.editor.files.filters.' + collectionName + '.' + filterName + '.' + keyName, 'pageflow.entry_types.' + entryTypeName + '.editor.files.common_filters.' + keyName, 'pageflow.editor.files.filters.' + collectionName + '.' + filterName + '.' + keyName, 'pageflow.editor.files.common_filters.' + keyName], options);
  },
  // Named filters are only ever requested for a single file type.
  filteredFileType: function () {
    return this.options.fileTypes[0];
  },
  matchesFileTypeSelection: function (file) {
    return this.options.fileTypeSelection.matches(file);
  },
  // Searching the root list looks into all folders. Inside a folder,
  // searching stays scoped to that folder.
  matchesFolder: function (file) {
    if (this.searchesAllFolders()) {
      return true;
    }
    return file.get('folder_perma_id') === this.folderPermaId();
  },
  // Folder name hits are only of interest while searching the root list.
  // Inside a folder, subfolders would just be noise among the file hits.
  isVisibleFolder: function (folder) {
    if (this.search.get('term')) {
      return this.searchesAllFolders() && this.search.matchesValue(folder.get('name')) && this.containsSelectedFileTypes(folder);
    }
    if (folder.get('parent_folder_perma_id') !== this.folderPermaId()) {
      return false;
    }
    return folder.isNew() || this.containsSelectedFileTypes(folder);
  },
  // Filtering by file type would otherwise keep listing folders which
  // turn out empty once entered.
  containsSelectedFileTypes: function (folder) {
    if (!this.selectedFiles || !this.options.fileTypeSelection.get('collectionNames').length) {
      return true;
    }
    var permaIds = this.options.fileFolders.descendantPermaIdsOf(folder);
    return this.selectedFiles.some(function (file) {
      return permaIds.indexOf(file.get('folder_perma_id')) >= 0;
    });
  },
  updateVisibleFolders: function () {
    this.visibleFolders.updateFilter(this.isVisibleFolder.bind(this));
  },
  searchesAllFolders: function () {
    return !this.options.folder && !!this.search.get('term');
  },
  folderPermaId: function () {
    return this.options.folder ? this.options.folder.get('perma_id') : null;
  },
  onClose: function () {
    var _this$filteredCollect, _this$selectedFiles, _this$folderFiles, _this$visibleFolders;
    Marionette.ItemView.prototype.onClose.call(this);
    (_this$filteredCollect = this.filteredCollections) === null || _this$filteredCollect === void 0 ? void 0 : _this$filteredCollect.forEach(collection => collection.dispose());
    (_this$selectedFiles = this.selectedFiles) === null || _this$selectedFiles === void 0 ? void 0 : _this$selectedFiles.dispose();
    (_this$folderFiles = this.folderFiles) === null || _this$folderFiles === void 0 ? void 0 : _this$folderFiles.dispose();
    (_this$visibleFolders = this.visibleFolders) === null || _this$visibleFolders === void 0 ? void 0 : _this$visibleFolders.dispose();
    this.combinedFiles.dispose();
    this.searchFilteredCollection.dispose();
    this.listItems.dispose();
  }
});
const SortMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.search = options.search;
    this.set('label', I18n$1.t(`pageflow.editor.views.filtered_files_view.sort.${this.get('name')}`));
    this.set('kind', 'radio');
    const updateChecked = () => {
      this.set('checked', this.search.get('order') === this.get('name'));
    };
    this.listenTo(this.search, 'change:order', updateChecked);
    updateChecked();
  },
  selected() {
    this.search.set('order', this.get('name'));
  }
});
const SortMenuItemsCollection = Backbone.Collection.extend({
  model: SortMenuItem
});

function template$B(data) {
var __t, __p = '';
__p += '<div class="box choose_importer_box">\n  <h1 class="dialog-header">' +
((__t = ( I18n.t('pageflow.editor.views.files_view.importer.heading') )) == null ? '' : __t) +
'</h1>\n\n  <div class="content">\n    <ul class="importers_panel">\n    </ul>\n  </div>\n\n  <div class="footer">\n    <button class="close">' +
((__t = ( I18n.t('pageflow.editor.templates.files_explorer.cancel') )) == null ? '' : __t) +
'</button>\n  </div>\n</div>\n';
return __p
}

function template$C(data) {
var __t, __p = '';
__p += '<button class=\'importer\' data-key=\'' +
((__t = ( data.fileImporter.key )) == null ? '' : __t) +
'\'>\n  <div class="logo">\n    <img alt="Free high resolution images" src="' +
((__t = ( data.fileImporter.logoSource )) == null ? '' : __t) +
'">\n  </div>\n  <div class="text">\n    <h3 class="name">' +
((__t = ( I18n.t('pageflow.editor.file_importers.'+data.fileImporter.key+'.select_title'))) == null ? '' : __t) +
'</h3>\n    <p class="select_label">' +
((__t = ( I18n.t('pageflow.editor.file_importers.'+data.fileImporter.key+'.select_label'))) == null ? '' : __t) +
'</p>\n  </div>\n</button>';
return __p
}

const ImporterSelectView = Marionette.ItemView.extend({
  template: template$C,
  className: 'importer_select',
  tagName: 'li',
  events: {
    'click .importer': function (event) {
      this.options.parentView.importerSelected(this.options.importer);
    }
  },
  initialize: function (options) {},
  serializeData: function () {
    return {
      fileImporter: this.options.importer
    };
  }
});

const ChooseImporterView = Marionette.ItemView.extend({
  template: template$B,
  className: 'choose_importer editor dialog',
  mixins: [dialogView],
  ui: {
    importersList: '.importers_panel',
    closeButton: '.close'
  },
  events: {
    'click .close': function () {
      this.close();
    }
  },
  importerSelected: function (importer) {
    if (this.options.callback) {
      this.options.callback(importer);
    }
    this.close();
  },
  onRender: function () {
    let self = this;
    editor.fileImporters.values().forEach(fileImporter => {
      let importerSelectView = new ImporterSelectView({
        importer: fileImporter,
        parentView: self
      }).render();
      self.ui.importersList.append(importerSelectView.$el);
    });
  }
});
ChooseImporterView.open = function (options) {
  app.dialogRegion.show(new ChooseImporterView(options).render());
};

function template$D(data) {
var __t, __p = '';
__p += '<div class="box file_importer_box">\n  <h1 class="dialog-header">' +
((__t = ( I18n.t('pageflow.editor.file_importers.'+data.importerKey+'.dialog_label') )) == null ? '' : __t) +
'</h1>\n\n  <div class="content_panel">\n    \n  </div>\n\n  <div class="footer">\n    <div class="disclaimer">\n      ' +
((__t = ( I18n.t('pageflow.editor.file_importers.'+data.importerKey+'.disclaimer') )) == null ? '' : __t) +
'\n    </div>\n    <button class="import" disabled>' +
((__t = ( I18n.t('pageflow.editor.views.files_view.import') )) == null ? '' : __t) +
'</button>\n    <button class="close">' +
((__t = ( I18n.t('pageflow.editor.templates.files_explorer.cancel') )) == null ? '' : __t) +
'</button>\n  </div>\n</div>\n';
return __p
}

function template$E(data) {
var __t, __p = '';
__p += '<div class="box">\n  <h1 class="dialog-header">' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_upload.header') )) == null ? '' : __t) +
'</h1>\n  <p class="dialog-hint">' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_upload.hint') )) == null ? '' : __t) +
'</p>\n\n  <div class="panels">\n    <div class="files_panel">\n    </div>\n\n    <div class="selected_file_panel">\n      <h2 class="dialog-sub_header">' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_upload.edit_file_header') )) == null ? '' : __t) +
'</h2>\n      <div class="selected_file_region">\n      </div>\n    </div>\n  </div>\n\n  <div class="footer">\n    <button class="upload">' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_upload.upload') )) == null ? '' : __t) +
'</button>\n    <button class="close">' +
((__t = ( I18n.t('pageflow.editor.templates.confirm_upload.close') )) == null ? '' : __t) +
'</button>\n  </div>\n</div>\n';
return __p
}

function template$F(data) {
var __p = '';
__p += '';
return __p
}

const EditFileView = Marionette.ItemView.extend({
  template: template$F,
  className: 'edit_file',
  onRender: function () {
    var fileType = this.model.fileType();
    var entry = this.options.entry || state.entry;
    var entryTypeName = editor.entryType.name;
    var tab = new ConfigurationEditorTabView({
      model: this.model.configuration,
      attributeTranslationKeyPrefixes: ['pageflow.entry_types.' + entryTypeName + '.editor.files.attributes.' + fileType.collectionName, 'pageflow.entry_types.' + entryTypeName + '.editor.files.common_attributes', 'pageflow.editor.files.attributes.' + fileType.collectionName, 'pageflow.editor.files.common_attributes', 'pageflow.editor.nested_files.' + fileType.collectionName, 'pageflow.editor.nested_files.common_attributes']
    });
    tab.input('display_name', FileNameInputView, {
      model: this.model,
      required: true
    });
    tab.view(SeparatorView);
    tab.input('rights', TextInputView, {
      model: this.model,
      placeholder: entry.get('default_file_rights')
    });
    if (editor.entryType.supportsExtendedFileRights && !fileType.noExtendedFileRights) {
      tab.input('source_url', TextInputView);
      tab.input('license', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow.editor.files.common_attributes.license.blank',
        values: state.config.availableFileLicenses,
        texts: state.config.availableFileLicenses.map(name => I18n$1.t(`pageflow.file_licenses.${name}.name`))
      });
      tab.input('rights_display', SelectInputView, {
        values: ['credits', 'inline']
      });
      tab.view(SeparatorView);
      tab.input('ai_indicator', SelectInputView, {
        includeBlank: true,
        values: ['ai_modified', 'ai_generated']
      });
      tab.input('ai_indicator_text', TextInputView, {
        visibleBinding: 'ai_indicator'
      });
    }
    tab.view(SeparatorView);
    _(this.fileTypeInputs()).each(function (options) {
      tab.input(options.name, options.inputView, options.inputViewOptions);
    });
    tab.input('download_url', UrlDisplayView, {
      model: this.model
    });
    this.appendSubview(tab);
  },
  fileTypeInputs: function () {
    var fileType = this.model.fileType();
    return _.chain(fileType.configurationEditorInputs).map(function (inputs) {
      if (_.isFunction(inputs)) {
        return inputs(this.model);
      } else {
        return inputs;
      }
    }, this).flatten().value();
  }
});

const UploadableFilesView = Marionette.View.extend({
  className: 'uploadable_files',
  initialize: function () {
    this.uploadableFiles = this.collection.uploadable();
    if (!this.options.selection.has('file')) {
      this.options.selection.set('file', this.uploadableFiles.first());
    }
  },
  render: function () {
    var entryTypeName = editor.entryType.name;
    this.appendSubview(new TableView({
      collection: this.uploadableFiles,
      attributeTranslationKeyPrefixes: ['pageflow.entry_types.' + entryTypeName + '.editor.files.attributes.' + this.options.fileType.collectionName, 'pageflow.entry_types.' + entryTypeName + '.editor.files.common_attributes', 'pageflow.editor.files.attributes.' + this.options.fileType.collectionName, 'pageflow.editor.files.common_attributes'],
      columns: this.commonColumns({
        fileTypeDisplayName: I18n$1.t('pageflow.editor.files.tabs.' + this.options.fileType.collectionName)
      }).concat(this.fileTypeColumns()),
      selection: this.options.selection,
      selectionAttribute: 'file'
    }));
    this.listenTo(this.uploadableFiles, 'add remove', this.update);
    this.update();
    return this;
  },
  update: function () {
    this.$el.toggleClass('is_empty', this.uploadableFiles.length === 0);
  },
  commonColumns: function (options) {
    return [{
      name: 'display_name',
      headerText: options.fileTypeDisplayName,
      cellView: TextTableCellView
    }, {
      name: 'rights',
      cellView: PresenceTableCellView
    }];
  },
  fileTypeColumns: function () {
    return _(this.options.fileType.confirmUploadTableColumns).map(function (column) {
      return _.extend({}, column, {
        configurationAttribute: true
      });
    });
  }
});

const ConfirmFileImportUploadView = Marionette.Layout.extend({
  template: template$E,
  className: 'confirm_upload editor dialog',
  mixins: [dialogView],
  regions: {
    selectedFileRegion: '.selected_file_region'
  },
  ui: {
    filesPanel: '.files_panel'
  },
  events: {
    'click .upload': function () {
      this.onImport();
    },
    'click .close': function () {
      this.closeMe();
    }
  },
  getSelectedFiles: function () {
    var files = [];
    _.each(state.files, collection => {
      if (collection.length > 0) {
        files = files.concat(collection.toJSON());
      }
    });
    return files;
  },
  initialize: function () {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },
  onRender: function () {
    this.options.fileTypes.each(function (fileType) {
      this.ui.filesPanel.append(this.subview(new UploadableFilesView({
        collection: this.options.files[fileType.collectionName],
        fileType: fileType,
        selection: this.selection
      })).el);
    }, this);
    this.update();
  },
  onImport: function () {
    var cName = this.options.fileImportModel.get('metaData').collection;
    this.options.fileImportModel.get('importer').startImportJob(cName);
    this.close();
  },
  closeMe: function () {
    var cName = this.options.fileImportModel.get('metaData').collection;
    this.options.fileImportModel.get('importer').cancelImport(cName);
    this.close();
  },
  update: function () {
    var file = this.selection.get('file');
    if (file) {
      this.selectedFileRegion.show(new EditFileView({
        model: file
      }));
    } else {
      this.selectedFileRegion.close();
    }
  }
});
ConfirmFileImportUploadView.open = function (options) {
  app.dialogRegion.show(new ConfirmFileImportUploadView(options));
};

const FilesImporterView = Marionette.ItemView.extend({
  template: template$D,
  className: 'files_importer editor dialog',
  mixins: [dialogView],
  ui: {
    contentPanel: '.content_panel',
    spinner: '.lds-spinner',
    importButton: '.import',
    closeButton: '.close'
  },
  events: {
    'click .import': function () {
      this.getMetaData();
    }
  },
  initialize: function (options) {
    this.model = new Backbone.Model({
      importerKey: options.importer.key,
      importer: new FileImport({
        importer: options.importer,
        currentEntry: state.entry
      })
    });
    this.listenTo(this.model.get('importer'), "change", function (event) {
      this.updateImportButton();
      if (!this.isInitialized) {
        this.updateAuthenticationView();
      }
    });
  },
  updateAuthenticationView: function () {
    var importer = this.model.get('importer');
    if (importer.get('isAuthenticated')) {
      this.ui.contentPanel.empty();
      this.ui.contentPanel.append(this.model.get('importer').createFileImportDialogView().render().el);
      this.isInitialized = true;
    }
  },
  updateImportButton: function () {
    var importer = this.model.get('importer');
    this.ui.importButton.prop('disabled', importer.get('selectedFiles').length < 1);
  },
  getMetaData: function () {
    var self = this;
    this.model.get('importer').getFilesMetaData().then(function (metaData) {
      if (metaData) {
        self.model.set('metaData', metaData);
        // add each selected file meta to state.files
        for (var i = 0; i < metaData.files.length; i++) {
          var file = metaData.files[i];
          var fileType = editor.fileTypes.findByUpload(file);
          file = new fileType.model({
            state: 'uploadable',
            display_name: file.name,
            content_type: file.type,
            file_size: -1,
            rights: file.rights,
            source_url: file.url,
            folder_perma_id: self.options.folderPermaId,
            configuration: {
              source_url: file.source_url
            }
          }, {
            fileType: fileType
          });
          state.entry.getFileCollection(fileType).add(file);
        }
        ConfirmFileImportUploadView.open({
          fileTypes: editor.fileTypes,
          fileImportModel: self.model,
          files: state.files
        });
      }
    });
    this.close();
  },
  onRender: function () {
    if (!this.isInitialized) {
      this.ui.contentPanel.append(this.subview(new LoadingView({
        tagName: 'div'
      })).el);
    }
  }
});
FilesImporterView.open = function (options) {
  app.dialogRegion.show(new FilesImporterView(options).render());
};

function template$G(data) {
var __t, __p = '';
__p += '<a class="back">' +
((__t = ( I18n.t('pageflow.editor.templates.files.back') )) == null ? '' : __t) +
'</a>\n';
return __p
}

const FilesView = Marionette.ItemView.extend({
  template: template$G,
  className: 'manage_files',
  events: {
    'click a.back': 'goBack',
    'file-selected': 'updatePage'
  },
  onRender: function () {
    let menuOptions = [{
      label: I18n$1.t('pageflow.editor.views.files_view.upload'),
      handler: this.upload.bind(this)
    }, {
      label: I18n$1.t('pageflow.editor.views.files_view.reuse'),
      handler: () => {
        FilesExplorerView.open({
          callback: (otherEntry, file) => {
            state.entry.reuseFile(otherEntry, file, {
              folderPermaId: this.currentFolderPermaId()
            });
          }
        });
      }
    }];
    if (editor.fileImporters.keys().length > 0) {
      menuOptions.push({
        label: I18n$1.t('pageflow.editor.views.files_view.import'),
        handler: () => {
          ChooseImporterView.open({
            callback: importer => {
              FilesImporterView.open({
                importer: importer,
                folderPermaId: this.currentFolderPermaId()
              });
            }
          });
        }
      });
    }
    menuOptions.push({
      label: I18n$1.t('pageflow.editor.views.files_view.folder'),
      handler: this.addFolder.bind(this),
      separated: true
    });
    this.$el.append(this.subview(new DropDownButtonView({
      label: I18n$1.t('pageflow.editor.views.files_view.add'),
      items: this.addMenuItems(menuOptions),
      alignMenu: 'right',
      buttonClassName: 'manage_files-add'
    })).el);
    var fileTypes = this.fileTypes();
    if (fileTypes.length > 1) {
      this.fileTypeSelection = new FileTypeSelection({}, {
        storageKey: 'pageflow.files_view.file_types'
      });
      this.fileTypeSelection.select(this.selectedCollectionNames(fileTypes));
      if (this.options.selectionHandler) {
        this.listenTo(this.fileTypeSelection, 'change:collectionNames', function () {
          if (this.displaysUnselectableFileTypes()) {
            this.leaveSelectionMode();
          }
        });
      } else {
        this.watchFileTypesForRemovedFiles(fileTypes);
      }
    }
    var tabsView = new TabsView({
      i18n: 'pageflow.editor.views.files_view.tabs'
    });
    editor.setUploadFolder(this.currentFolder());
    tabsView.tab('files', () => new FilteredFilesView({
      entry: this.model,
      fileTypes: fileTypes,
      fileTypeSelection: this.fileTypeSelection,
      fileFolders: this.model.fileFolders,
      folder: this.currentFolder(),
      onSelectFolder: this.selectFolder.bind(this),
      onDismissSelection: this.leaveSelectionMode.bind(this),
      selectionHandler: this.options.selectionHandler,
      selectionFileType: this.selectionFileType(),
      filterName: this.options.filterName
    }));
    this.$el.append(this.subview(tabsView).el);
  },
  addMenuItems: function (menuOptions) {
    return new Backbone.Collection(menuOptions.map(function (option) {
      var item = new Backbone.Model({
        label: option.label,
        separated: option.separated
      });
      item.selected = option.handler;
      return item;
    }));
  },
  // Only a selection which is restricted to a single file type can be
  // named. Otherwise the requested type is merely a preselection.
  selectionFileType: function () {
    if (!this.options.selectionHandler || this.options.allowSelectingAny) {
      return;
    }
    return editor.fileTypes.findByCollectionName(this.options.fileTypeName);
  },
  // Folders which have been deleted in another editor session would
  // otherwise render an empty list without a way back.
  currentFolder: function () {
    return this.model.fileFolders.byPermaId(this.options.folderPermaId);
  },
  // Dropping handler and payload ends the selection request. The
  // current folder is kept, since ending it is not meant to undo the
  // navigation that led there.
  leaveSelectionMode: function () {
    var folder = this.currentFolder();
    editor.navigate(filesPath({
      folderPermaId: folder && folder.get('perma_id')
    }), {
      trigger: true
    });
  },
  currentFolderPermaId: function () {
    var folder = this.currentFolder();
    return folder && folder.get('perma_id');
  },
  onClose: function () {
    Marionette.ItemView.prototype.onClose.call(this);
    editor.setUploadFolder(undefined);
  },
  // The folder is only persisted once the user has entered a name in the
  // row which appears for folders that have not been created yet.
  addFolder: function () {
    var folder = this.currentFolder();
    this.model.fileFolders.add({
      name: '',
      parent_folder_perma_id: folder ? folder.get('perma_id') : null
    });
  },
  selectFolder: function (folder) {
    editor.navigate(filesPath({
      ...this.options.pathParams,
      folderPermaId: folder && folder.get('perma_id')
    }), {
      trigger: true
    });
  },
  selectedCollectionNames: function (fileTypes) {
    if (this.options.fileTypeName) {
      return [this.options.fileTypeName];
    }
    return this.selectableCollectionNames(fileTypes);
  },
  // Selecting a file type which is no longer registered or has no files
  // would filter the list down to nothing while its pill is hidden.
  selectableCollectionNames: function (fileTypes) {
    var collectionNames = fileTypes.filter(function (fileType) {
      return this.model.getFileCollection(fileType).length > 0;
    }, this).map(function (fileType) {
      return fileType.collectionName;
    });
    return this.fileTypeSelection.get('collectionNames').filter(function (collectionName) {
      return collectionNames.includes(collectionName);
    });
  },
  watchFileTypesForRemovedFiles: function (fileTypes) {
    fileTypes.forEach(function (fileType) {
      this.listenTo(this.model.getFileCollection(fileType), 'remove', function () {
        this.fileTypeSelection.select(this.selectableCollectionNames(fileTypes));
      });
    }, this);
  },
  // Files of types the content element does not accept must not appear
  // selectable. Changing the pills leaves selection mode instead.
  displaysUnselectableFileTypes: function () {
    return !!this.options.selectionHandler && !this.options.allowSelectingAny && !this.fileTypeSelection.isOnlySelected(this.options.fileTypeName);
  },
  fileTypes: function () {
    // Filters are registered per file type, so a request for a filtered list
    // only ever concerns the single type it is registered for.
    if (this.options.filterName) {
      return [editor.fileTypes.findByCollectionName(this.options.fileTypeName)];
    }
    return editor.fileTypes.filter(function (fileType) {
      return fileType.topLevelType;
    });
  },
  // Entering a folder is a navigation step of its own, which the back
  // button undoes before leaving the files list.
  goBack: function () {
    var folder = this.currentFolder();
    if (folder) {
      return this.selectFolder(this.model.fileFolders.parentOf(folder));
    }
    if (this.options.selectionHandler) {
      editor.navigate(this.options.selectionHandler.getReferer(), {
        trigger: true
      });
    } else {
      editor.navigate('/', {
        trigger: true
      });
    }
  },
  upload: function () {
    app.trigger('request-upload');
  }
});

function template$H(data) {
var __p = '';
__p += '<div class="quota_state">\n</div>\n<div class="outlet">\n</div>\n<div class="exhausted_message">\n</div>\n';
return __p
}

const EntryPublicationQuotaDecoratorView = Marionette.Layout.extend({
  template: template$H,
  className: 'quota_decorator',
  regions: {
    outlet: '.outlet'
  },
  ui: {
    state: '.quota_state',
    exhaustedMessage: '.exhausted_message'
  },
  modelEvents: {
    'change:exceeding change:checking change:quota': 'update'
  },
  onRender: function () {
    this.model.check();
  },
  update: function () {
    var view = this;
    if (this.model.get('checking')) {
      view.ui.state.text(I18n$1.t('pageflow.editor.quotas.loading'));
      view.ui.exhaustedMessage.hide().html('');
      view.outlet.close();
    } else {
      if (view.model.get('exceeding')) {
        view.ui.state.hide();
        view.ui.exhaustedMessage.show().html(view.model.get('exhausted_html'));
        view.outlet.close();
      } else {
        if (view.model.quota().get('state_description')) {
          view.ui.state.text(view.model.quota().get('state_description'));
          view.ui.state.show();
        } else {
          view.ui.state.hide();
        }
        view.outlet.show(view.options.view);
      }
    }
  }
});

function template$I(data) {
var __t, __p = '';
__p += '<div class="files_pending notice">\n  <p>' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.files_pending_notice') )) == null ? '' : __t) +
'</p>\n  <p><a href="#files">' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.show_files') )) == null ? '' : __t) +
'</a></p>\n</div>\n\n<div>\n  <div class="published notice">\n    <p>' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.published_notice') )) == null ? '' : __t) +
'</p>\n    <p><a href="" target="_blank">' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.view_revisions') )) == null ? '' : __t) +
'</a></p>\n  </div>\n\n  <div class="not_published notice">\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.not_published_notice') )) == null ? '' : __t) +
'\n  </div>\n\n  <h2 class="sidebar-header">\n    ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.publish_current') )) == null ? '' : __t) +
'\n  </h2>\n\n  <div class="radio_input">\n    <input id="publish_entry_forever" type="radio" name="mode" value="publish_forever">\n    <label for="publish_entry_forever">' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.unlimited') )) == null ? '' : __t) +
'</label>\n  </div>\n\n  <div class="radio_input">\n    <input id="publish_entry_until" type="radio" name="mode" value="publish_until">\n    <label for="publish_entry_until">' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.until_including') )) == null ? '' : __t) +
'</label>\n  </div>\n\n  <div class="publish_until_fields disabled">\n    <label>\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.date') )) == null ? '' : __t) +
'\n      <input type="text" name="publish_until">\n    </label>\n\n    <label>\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.time') )) == null ? '' : __t) +
'\n      <input type="text" name="publish_until_time" value="00:00">\n    </label>\n  </div>\n\n  <div class="check_box_input">\n    <input id="publish_with_noindex" type="checkbox" name="noindex" value="1">\n    <label for="publish_with_noindex">\n      <span class="name">\n        ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.noindex') )) == null ? '' : __t) +
'\n      </span>\n      <span class="inline_help">\n        ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.noindex_help') )) == null ? '' : __t) +
'\n      </span>\n    </label>\n  </div>\n\n  <div class="check_box_input">\n    <input id="publish_password_protected" type="checkbox" name="password_protected" value="1">\n    <label for="publish_password_protected">\n      <span class="name">\n        ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.password_protected') )) == null ? '' : __t) +
'\n      </span>\n      <span class="inline_help">\n        ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.password_help') )) == null ? '' : __t) +
'\n      </span>\n    </label>\n  </div>\n\n  <div class="password_fields disabled">\n    <label>\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.user_name') )) == null ? '' : __t) +
'\n      <input type="text" name="user_name" disabled>\n    </label>\n\n    <label>\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.password') )) == null ? '' : __t) +
'\n      <input type="text" name="password">\n    </label>\n\n    <p class="already_published_with_password">\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.already_published_with_password_help') )) == null ? '' : __t) +
'\n    </p>\n    <p class="previously_published_with_password">\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.previously_published_with_password_help') )) == null ? '' : __t) +
'\n    </p>\n    <p class="already_published_without_password">\n      ' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.already_published_without_password_help') )) == null ? '' : __t) +
'\n    </p>\n  </div>\n\n  <button class="save" disabled>' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.publish') )) == null ? '' : __t) +
'</a>\n</div>\n\n<div class="success notice">\n  <p>' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.publish_success') )) == null ? '' : __t) +
'</p>\n  <p>' +
((__t = ( I18n.t('pageflow.editor.templates.publish_entry.published_url_hint') )) == null ? '' : __t) +
'</p>\n  <p><a href="" target="_blank"></a></p>\n</div>\n';
return __p
}

const PublishEntryView = Marionette.ItemView.extend({
  template: template$I,
  className: 'publish_entry',
  ui: {
    publishUntilFields: '.publish_until_fields',
    publishUntilField: 'input[name=publish_until]',
    publishUntilTimeField: 'input[name=publish_until_time]',
    publishUntilRadioBox: '#publish_entry_until',
    publishForeverRadioBox: 'input[value=publish_forever]',
    passwordProtectedCheckBox: 'input[name=password_protected]',
    passwordFields: '.password_fields',
    userNameField: 'input[name=user_name]',
    passwordField: 'input[name=password]',
    noindexCheckBox: 'input[name=noindex]',
    alreadyPublishedWithPassword: '.already_published_with_password',
    previouslyPublishedWithPassword: '.previously_published_with_password',
    alreadyPublishedWithoutPassword: '.already_published_without_password',
    revisionsLink: '.published.notice a',
    publishedNotice: '.published.notice',
    saveButton: 'button.save',
    successNotice: '.success',
    successLink: '.success a'
  },
  events: {
    'click button.save': 'save',
    'click input#publish_entry_forever': 'enablePublishForever',
    'click input#publish_entry_until': 'enablePublishUntilFields',
    'focus .publish_until_fields input': 'enablePublishUntilFields',
    'change .publish_until_fields input': 'checkForm',
    'click input#publish_password_protected': 'togglePasswordFields',
    'keyup input[name=password]': 'checkForm',
    'change input[name=password]': 'checkForm'
  },
  modelEvents: {
    'change': 'update',
    'change:published': function (model, value) {
      if (value) {
        this.ui.publishedNotice.effect('highlight', {
          duration: 'slow'
        });
      }
    }
  },
  onRender: function () {
    this.ui.publishUntilField.datepicker({
      dateFormat: 'dd.mm.yy',
      constrainInput: true,
      defaultDate: new Date(),
      minDate: new Date()
    });
    this.update();
  },
  update: function () {
    this.$el.toggleClass('files_pending', this.model.get('uploading_files_count') > 0 || this.model.get('pending_files_count') > 0);
    this.$el.toggleClass('published', this.model.get('published'));
    this.ui.revisionsLink.attr('href', '/admin/entries/' + this.model.id);
    this.ui.successLink.attr('href', this.model.get('pretty_url'));
    this.ui.successLink.text(this.model.get('pretty_url'));
    var publishedUntil = new Date(this.model.get('published_until'));
    if (publishedUntil > new Date()) {
      this.ui.publishUntilField.datepicker('setDate', publishedUntil);
      this.ui.publishUntilTimeField.val(timeStr(publishedUntil));
    } else {
      this.ui.publishUntilField.datepicker('setDate', this.defaultPublishedUntilDate());
    }
    this.ui.userNameField.val(this.options.account.get('name'));
    if (this.model.get('password_protected')) {
      this.ui.passwordProtectedCheckBox.prop('checked', true);
      this.togglePasswordFields();
    } else {
      this.ui.passwordField.val(this.randomPassword());
    }
    this.ui.noindexCheckBox.prop('checked', this.model.get('last_published_with_noindex'));
    this.ui.alreadyPublishedWithPassword.toggle(this.model.get('published') && this.model.get('password_protected'));
    this.ui.previouslyPublishedWithPassword.toggle(!this.model.get('published') && this.model.get('password_protected'));
    this.ui.alreadyPublishedWithoutPassword.toggle(this.model.get('published') && !this.model.get('password_protected'));

    // Helpers
    function timeStr(date) {
      return twoDigits(date.getHours()) + ':' + twoDigits(date.getMinutes());
      function twoDigits(val) {
        return ("0" + val).slice(-2);
      }
    }
  },
  save: function () {
    var publishedUntil = null;
    if (this.$el.hasClass('publishing')) {
      return;
    }
    if (this.ui.publishUntilRadioBox.is(':checked')) {
      publishedUntil = this.ui.publishUntilField.datepicker('getDate');
      setTime(publishedUntil, this.ui.publishUntilTimeField.val());
      if (!this.checkPublishUntilTime()) {
        alert('Bitte legen Sie einen gültigen Depublikationszeitpunkt fest.');
        this.ui.publishUntilTimeField.focus();
        return;
      }
      if (!publishedUntil || !checkDate(publishedUntil)) {
        alert('Bitte legen Sie ein Depublikationsdatum fest.');
        this.ui.publishUntilField.focus();
        return;
      }
    }
    var that = this;
    this.options.entryPublication.publish({
      published_until: publishedUntil,
      password_protected: this.ui.passwordProtectedCheckBox.is(':checked'),
      password: this.ui.passwordField.val(),
      noindex: this.ui.noindexCheckBox.is(':checked')
    }).fail(function () {
      alert('Beim Veröffentlichen ist ein Fehler aufgetreten');
    }).always(function () {
      if (that.isClosed) {
        return;
      }
      that.$el.removeClass('publishing');
      that.$el.addClass('succeeded');
      that.$('input').removeAttr('disabled');
      var publishedMessage = that.options.entryPublication.get('published_message_html');
      if (publishedMessage) {
        that.ui.successNotice.append(publishedMessage);
      }
      that.enableSave();
    });
    this.$el.addClass('publishing');
    this.$('input').attr('disabled', '1');
    this.disableSave();

    // Helpers
    function setTime(date, time) {
      date.setHours.apply(date, parseTime(time));
    }
    function parseTime(str) {
      return str.split(':').map(function (number) {
        return parseInt(number, 10);
      });
    }
    function checkDate(date) {
      if (Object.prototype.toString.call(date) === "[object Date]") {
        if (isNaN(date.getTime())) {
          return false;
        }
        return true;
      }
      return false;
    }
  },
  defaultPublishedUntilDate: function () {
    const date = new Date();
    date.setMonth(date.getMonth() + this.options.config.defaultPublishedUntilDurationInMonths);
    return date;
  },
  enableSave: function () {
    this.ui.saveButton.removeAttr('disabled');
  },
  disableSave: function () {
    this.ui.saveButton.attr('disabled', true);
  },
  enablePublishUntilFields: function () {
    this.ui.publishForeverRadioBox[0].checked = false;
    this.ui.publishUntilRadioBox[0].checked = true;
    this.ui.publishUntilFields.removeClass('disabled');
    this.checkForm();
  },
  disablePublishUntilFields: function () {
    this.ui.publishUntilRadioBox[0].checked = false;
    this.ui.publishUntilFields.addClass('disabled');
    this.checkForm();
    if (!this.checkPublishUntilTime()) {
      this.ui.publishUntilTimeField.val('00:00');
    }
    this.ui.publishUntilTimeField.removeClass('invalid');
    this.ui.publishUntilField.removeClass('invalid');
  },
  enablePublishForever: function () {
    this.disablePublishUntilFields();
    this.ui.publishForeverRadioBox[0].checked = true;
    this.enableSave();
  },
  checkForm: function () {
    if (_.all([this.checkPublishUntil(), this.checkPassword()])) {
      this.enableSave();
    } else {
      this.disableSave();
    }
  },
  checkPublishUntil: function () {
    return this.ui.publishForeverRadioBox.is(':checked') || this.ui.publishUntilRadioBox.is(':checked') && _.all([this.checkPublishUntilDate(), this.checkPublishUntilTime()]);
  },
  checkPublishUntilDate: function () {
    if (this.ui.publishUntilField.datepicker('getDate')) {
      this.ui.publishUntilField.removeClass('invalid');
      return true;
    } else {
      this.ui.publishUntilField.addClass('invalid');
      return false;
    }
  },
  checkPublishUntilTime: function () {
    if (!this.ui.publishUntilTimeField.val().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      this.ui.publishUntilTimeField.addClass('invalid');
      return false;
    }
    this.ui.publishUntilTimeField.removeClass('invalid');
    return true;
  },
  togglePasswordFields: function () {
    this.ui.passwordFields.toggleClass('disabled', !this.ui.passwordProtectedCheckBox.is(':checked'));
    this.checkForm();
  },
  checkPassword: function () {
    if (this.ui.passwordField.val().length === 0 && !this.model.get('password_protected') && this.ui.passwordProtectedCheckBox.is(':checked')) {
      this.ui.passwordField.addClass('invalid');
      return false;
    } else {
      this.ui.passwordField.removeClass('invalid');
      return true;
    }
  },
  randomPassword: function () {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return _(10).times(function () {
      return possible.charAt(Math.floor(Math.random() * possible.length));
    }).join('');
  }
});
PublishEntryView.create = function (options) {
  return new BackButtonDecoratorView({
    view: new EntryPublicationQuotaDecoratorView({
      model: options.entryPublication,
      view: new PublishEntryView(options)
    })
  });
};

const SidebarController = Marionette.Controller.extend({
  initialize: function (options) {
    this.region = options.region;
    this.entry = options.entry;
  },
  index: function (storylineId) {
    this.region.show(new EditEntryView({
      model: this.entry,
      storylineId: storylineId
    }));
  },
  files: function (collectionName, folderPermaId, handler, payload, filterName) {
    const [fileTypeName, suffix] = (collectionName || '').split(':');
    this.region.show(new FilesView({
      model: this.entry,
      selectionHandler: handler && editor.createFileSelectionHandler(handler, payload),
      fileTypeName: fileTypeName || undefined,
      allowSelectingAny: !fileTypeName || suffix === 'default',
      // Perma ids are numbers everywhere else, so the route param is
      // converted right where it enters the editor.
      folderPermaId: folderPermaId && Number(folderPermaId),
      filterName: filterName,
      // Navigating between folders needs to preserve the rest of the
      // route.
      pathParams: {
        collectionName,
        handler,
        payload,
        filterName
      }
    }));
    editor.setDefaultHelpEntry('pageflow.help_entries.files');
  },
  confirmableFiles: function (preselectedFileType, preselectedFileId) {
    const model = EncodingConfirmation.createWithPreselection({
      fileType: preselectedFileType,
      fileId: preselectedFileId
    });
    model.check();
    this.region.show(ConfirmEncodingView.create({
      model
    }));
  },
  metaData: function (tab) {
    this.region.show(new EditMetaDataView({
      model: this.entry,
      tab: tab,
      state: state,
      features: features,
      editor: editor
    }));
  },
  publish: function () {
    this.region.show(PublishEntryView.create({
      model: this.entry,
      account: state.account,
      entryPublication: new EntryPublication(),
      config: state.config
    }));
    editor.setDefaultHelpEntry('pageflow.help_entries.publish');
  },
  widget: function (id) {
    const model = this.entry.widgets.get(id);
    this.region.show(new EditWidgetView({
      entry: this.entry,
      model
    }));
    this.entry.trigger('selectWidget', model);
  },
  defaults: function () {
    const EditDefaultsView = editor.entryType.editDefaultsView;
    if (EditDefaultsView) {
      this.region.show(new EditDefaultsView({
        model: this.entry.metadata,
        entry: this.entry,
        editor
      }));
    }
  }
});

const UploaderView = Marionette.View.extend({
  el: 'form#upload',
  initialize: function () {
    this.listenTo(app, 'request-upload', this.openFileDialog);
  },
  render: function () {
    var that = this;
    this.$el.fileupload({
      type: 'POST',
      paramName: 'file',
      dataType: 'XML',
      acceptFileTypes: new RegExp('(\\.|\\/)(bmp|gif|jpe?g|png|ti?f|wmv|mp4|mpg|mov|asf|asx|avi|' + 'm?v|mpeg|qt|3g2|3gp|3ivx|divx|3vx|vob|flv|dvx|xvid|mkv|vtt)$', 'i'),
      add: function (event, data) {
        try {
          state.fileUploader.add(data.files[0]).then(function (record) {
            data.record = record;
            record.save(null, {
              success: function () {
                var directUploadConfig = data.record.get('direct_upload_config');
                data.url = directUploadConfig.url;
                data.formData = directUploadConfig.fields;
                var xhr = data.submit();
                that.listenTo(data.record, 'uploadCancelled', function () {
                  xhr.abort();
                });
              }
            });
          });
        } catch (e) {
          if (e instanceof UploadError) {
            app.trigger('error', e);
          } else {
            throw e;
          }
        }
      },
      progress: function (event, data) {
        data.record.set('uploading_progress', parseInt(data.loaded / data.total * 100, 10));
      },
      done: function (event, data) {
        data.record.unset('uploading_progress');
        data.record.publish();
      },
      fail: function (event, data) {
        if (data.errorThrown !== 'abort') {
          data.record.uploadFailed();
        }
      },
      always: function (event, data) {
        that.stopListening(data.record);
      }
    });
    return this;
  },
  openFileDialog: function () {
    this.$('input:file').click();
  }
});

const ScrollingView = Marionette.View.extend({
  events: {
    scroll: function () {
      if (this._isChapterView()) {
        this.scrollpos = this.$el.scrollTop();
      }
    }
  },
  initialize: function () {
    this.scrollpos = 0;
    this.listenTo(this.options.region, 'show', function () {
      if (this._isChapterView()) {
        this.$el.scrollTop(this.scrollpos);
      }
    });
  },
  _isChapterView: function () {
    return !Backbone.history.getFragment();
  }
});

function template$J(data) {
var __t, __p = '';
__p += '<div class="box">\n  <h2>' +
((__t = ( I18n.t('pageflow.editor.templates.help.title') )) == null ? '' : __t) +
'</h2>\n\n  <div class="placeholder"></div>\n\n  <div class="footer">\n    <a class="close" href="">' +
((__t = ( I18n.t('pageflow.editor.templates.help.close') )) == null ? '' : __t) +
'</a>\n  </div>\n</div>\n';
return __p
}

const HelpView = Marionette.ItemView.extend({
  template: template$J,
  className: 'help',
  ui: {
    placeholder: '.placeholder',
    sections: 'section',
    menuItems: 'li'
  },
  events: {
    'click .close': function () {
      this.toggle();
    },
    'click .expandable > a': function (event) {
      $(event.currentTarget).parents('.expandable').toggleClass('expanded');
    },
    'click a': function (event) {
      var link = $(event.currentTarget);
      if (link.attr('href').indexOf('#') === 0) {
        this.showSection(link.attr('href').substring(1), {
          scrollIntoView: !link.parents('nav').length
        });
      } else if (link.attr('href').match(/^http/)) {
        window.open(link.attr('href'), '_blank');
      }
      return false;
    },
    'click .box': function () {
      return false;
    },
    'click': function () {
      this.toggle();
    }
  },
  initialize: function () {
    this.listenTo(app, 'toggle-help', function (name) {
      this.toggle();
      this.showSection(name || editor.defaultHelpEntry || this.defaultHelpEntry(), {
        scrollIntoView: true
      });
    });
  },
  onRender: function () {
    this.ui.placeholder.replaceWith($('#help_entries_seed').html());
    this.bindUIElements();
  },
  toggle: function () {
    this.$el.toggle();
  },
  defaultHelpEntry: function () {
    return this.ui.sections.first().data('name');
  },
  showSection: function (name, options) {
    this.ui.menuItems.each(function () {
      var menuItem = $(this);
      var active = menuItem.find('a').attr('href') === '#' + name;
      menuItem.toggleClass('active', active);
      if (active) {
        menuItem.parents('.expandable').addClass('expanded');
        if (options.scrollIntoView) {
          menuItem[0].scrollIntoView();
        }
      }
    });
    this.ui.sections.each(function () {
      var section = $(this);
      section.toggle(section.data('name') === name);
    });
  }
});

const PageThumbnailView = ModelThumbnailView.extend({
  className: 'model_thumbnail page_thumbnail'
});

function template$K(data) {
var __t, __p = '';
__p += '<div>\n  <span class="missing_page_thumbnail"></span>\n  <span class="page_thumbnail"></span>\n  <div class="title"></div>\n  <div class="label"></div>\n  <a class="remove" title="' +
((__t = ( I18n.t('pageflow.editor.templates.page_link_item.remove') )) == null ? '' : __t) +
'"></a>\n  <a class="edit" title="' +
((__t = ( I18n.t('pageflow.editor.templates.page_link_item.edit') )) == null ? '' : __t) +
'"></a>\n<div>\n';
return __p
}

const PageLinkItemView = Marionette.ItemView.extend({
  template: template$K,
  tagName: 'li',
  className: 'page_link',
  ui: {
    thumbnail: '.page_thumbnail',
    title: '.title',
    label: '.label',
    editButton: '.edit',
    removeButton: '.remove'
  },
  events: {
    'click .edit': function () {
      editor.navigate(this.model.editPath(), {
        trigger: true
      });
      return false;
    },
    'mouseenter': function () {
      this.model.highlight(true);
    },
    'mouseleave': function () {
      this.model.resetHighlight(false);
    },
    'click .remove': function () {
      if (confirm(I18n$1.t('pageflow.internal_links.editor.views.edit_page_link_view.confirm_destroy'))) {
        this.model.remove();
      }
    }
  },
  onRender: function () {
    var page = this.model.targetPage();
    if (page) {
      this.subview(new PageThumbnailView({
        el: this.ui.thumbnail,
        model: page
      }));
      this.$el.addClass(page.get('template'));
      this.ui.title.text(page.title() || I18n$1.t('pageflow.editor.views.page_link_item_view.unnamed'));
    } else {
      this.ui.title.text(I18n$1.t('pageflow.editor.views.page_link_item_view.no_page'));
    }
    this.ui.label.text(this.model.label());
    this.ui.label.toggle(!!this.model.label());
    this.ui.editButton.toggle(!!this.model.editPath());
    this.$el.toggleClass('dangling', !page);
  }
});

function template$L(data) {
var __t, __p = '';
__p += '<label>\n  <span class="name">' +
((__t = ( I18n.t('pageflow.editor.templates.page_links.label') )) == null ? '' : __t) +
'</span>\n</label>\n<ul class="links outline"></ul>\n\n<a href="" class="add_link">' +
((__t = ( I18n.t('pageflow.editor.templates.page_links.add') )) == null ? '' : __t) +
'</a>\n';
return __p
}

const PageLinksView = Marionette.ItemView.extend({
  template: template$L,
  className: 'page_links',
  ui: {
    links: 'ul.links',
    addButton: '.add_link'
  },
  events: {
    'click .add_link': function () {
      var view = this;
      editor.selectPage().then(function (page) {
        view.model.pageLinks().addLink(page.get('perma_id'));
      });
      return false;
    }
  },
  onRender: function () {
    var pageLinks = this.model.pageLinks();
    var collectionViewConstructor = pageLinks.saveOrder ? SortableCollectionView : CollectionView;
    this.subview(new collectionViewConstructor({
      el: this.ui.links,
      collection: pageLinks,
      itemViewConstructor: PageLinkItemView,
      itemViewOptions: {
        pageLinks: pageLinks
      }
    }));
    this.listenTo(pageLinks, 'add remove', function () {
      this.updateAddButton(pageLinks);
    });
    this.updateAddButton(pageLinks);
  },
  updateAddButton: function (pageLinks) {
    this.ui.addButton.css('display', pageLinks.canAddLink() ? 'inline-block' : 'none');
  }
});

function template$M(data) {
var __p = '';
__p += '<div class="emulation_mode_button-wrapper"\n     data-tooltip-align="top center">\n  <div class="emulation_mode_button-desktop_icon"/>\n  <div class="emulation_mode_button-phone_icon"/>\n  <div class="emulation_mode_button-track" />\n  <div class="emulation_mode_button-thumb" />\n</div>\n';
return __p
}

const EmulationModeButtonView = Marionette.ItemView.extend({
  template: template$M,
  className: 'emulation_mode_button',
  mixins: [tooltipContainer],
  ui: {
    wrapper: '.emulation_mode_button-wrapper',
    desktopIcon: '.emulation_mode_button-desktop_icon',
    phoneIcon: '.emulation_mode_button-phone_icon'
  },
  events: {
    'click': function () {
      if (this.model.get('emulation_mode_disabled')) {
        return;
      }
      if (this.model.has('emulation_mode')) {
        this.model.unset('emulation_mode');
      } else {
        this.model.set('emulation_mode', 'phone');
      }
    }
  },
  modelEvents: {
    'change:emulation_mode change:emulation_mode_disabled': 'update'
  },
  onRender: function () {
    this.update();
  },
  update: function () {
    this.$el.toggleClass('disabled', !!this.model.get('emulation_mode_disabled'));
    this.$el.toggleClass('active', this.model.has('emulation_mode'));
    this.ui.wrapper.attr('data-tooltip', this.model.get('emulation_mode_disabled') ? 'pageflow.editor.templates.emulation_mode_button.disabled_hint' : 'pageflow.editor.templates.emulation_mode_button.tooltip');
  }
});

function template$N(data) {
var __t, __p = '';
__p +=
((__t = ( I18n.t('pageflow.editor.templates.help_button.open_help') )) == null ? '' : __t);
return __p
}

const HelpButtonView = Marionette.ItemView.extend({
  template: template$N,
  className: 'help_button',
  events: {
    'click': function () {
      app.trigger('toggle-help');
    }
  }
});

const SidebarFooterView = Marionette.View.extend({
  className: 'sidebar_footer',
  render: function () {
    if (this.model.supportsPhoneEmulation()) {
      this.appendSubview(new EmulationModeButtonView({
        model: this.model
      }));
    }
    this.appendSubview(new HelpButtonView());
    return this;
  }
});

const HelpImageView = Marionette.View.extend({
  tagName: 'img',
  className: 'help_image',
  render: function () {
    this.$el.attr('src', state.editorAssetUrls.help[this.options.imageName]);
    return this;
  }
});

const InfoBoxView = Marionette.ItemView.extend({
  className: 'info_box',
  mixins: [attributeBinding],
  template: data => data.icon ? `<div class="with_icon"><img src="${data.icon}" /><span>${data.text}</span></div>` : data.text,
  serializeData() {
    return {
      text: this.options.text,
      icon: this.options.icon
    };
  },
  initialize() {
    this.setupBooleanAttributeBinding('visible', this.updateVisible);
  },
  onRender() {
    this.$el.addClass(this.options.level);
    this.updateVisible();
  },
  updateVisible() {
    this.$el.toggleClass('hidden_via_binding', this.getBooleanAttributBoundOption('visible') === false);
  }
});

function template$O(data) {
var __t, __p = '';
__p += '<input type="range" min="0" max="0" step="0.01" value="0"\n       title="' +
((__t = ( I18n.t('pageflow.editor.views.file_preview_progress_bar_view.position') )) == null ? '' : __t) +
'"\n       aria-label="' +
((__t = ( I18n.t('pageflow.editor.views.file_preview_progress_bar_view.position') )) == null ? '' : __t) +
'">\n<div></div>\n';
return __p
}

const MEDIA_EVENTS = 'durationchange loadedmetadata timeupdate';
const FilePreviewProgressBarView = Marionette.ItemView.extend({
  template: template$O,
  className: 'file_preview-progress',
  ui: {
    input: 'input'
  },
  events: {
    'input input': 'seek'
  },
  initialize: function () {
    _.bindAll(this, 'update');
  },
  onRender: function () {
    $(this.options.media).on(MEDIA_EVENTS, this.update);
    this.update();
  },
  onClose: function () {
    $(this.options.media).off(MEDIA_EVENTS, this.update);
  },
  seek: function () {
    this.options.media.currentTime = Number(this.ui.input.val());
    this.update();
  },
  update: function () {
    var duration = this.duration();
    var currentTime = this.options.media.currentTime;
    this.ui.input.attr('max', duration);
    this.ui.input.val(currentTime);
    this.el.style.setProperty('--progress', `${duration ? currentTime / duration * 100 : 0}%`);
  },
  // Unknown until the browser has loaded metadata.
  duration: function () {
    var duration = this.options.media.duration;
    return Number.isFinite(duration) ? duration : 0;
  }
});

function template$P(data) {
var __p = '';
__p += '<audio preload="metadata"></audio>\n\n<button class="file_preview-play_toggle" type="button">\n  <svg class="file_preview-play" viewBox="0 0 16 16" aria-hidden="true">\n    <path fill="currentColor" d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.2-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z"/>\n  </svg>\n  <svg class="file_preview-pause" viewBox="0 0 16 16" aria-hidden="true">\n    <path fill="currentColor" d="M4.4 3h2.3v10H4.4zM9.3 3h2.3v10H9.3z"/>\n  </svg>\n</button>\n';
return __p
}

const AudioFilePreviewView = Marionette.ItemView.extend({
  template: template$P,
  className: 'file_preview file_preview-audio',
  ui: {
    audio: 'audio',
    playToggle: '.file_preview-play_toggle',
    playIcon: '.file_preview-play',
    pauseIcon: '.file_preview-pause'
  },
  events: {
    'click .file_preview-play_toggle': 'togglePlaying'
  },
  modelEvents: {
    'change:sources': 'update'
  },
  onRender: function () {
    this.update();
    this.appendSubview(new FilePreviewProgressBarView({
      media: this.ui.audio[0]
    }));
    this.ui.audio.on('play pause ended', this.updatePlaying.bind(this));
    this.updatePlaying();
  },
  update: function () {
    this.ui.audio.empty();
    _.each(this.model.get('sources'), function (source) {
      this.ui.audio.append($('<source />', {
        src: source.src,
        type: source.type
      }));
    }, this);
  },
  togglePlaying: function () {
    if (!this.ui.audio[0].paused) {
      return this.ui.audio[0].pause();
    }

    // Dismissing the overlay takes the element out of the document,
    // which rejects a play request that is still starting up.
    var started = this.ui.audio[0].play();
    if (started) {
      started.catch(function () {});
    }
  },
  updatePlaying: function () {
    var playing = !this.ui.audio[0].paused;
    var label = I18n$1.t('pageflow.editor.views.audio_file_preview_view.' + (playing ? 'pause' : 'play'));
    this.ui.playIcon.toggleClass('is_hidden', playing);
    this.ui.pauseIcon.toggleClass('is_hidden', !playing);
    this.ui.playToggle.attr('title', label);
    this.ui.playToggle.attr('aria-label', label);
  }
});

// Reserves the right box before the file has loaded, so the overlay
// does not jump into place around it. The attributes tell the browser
// which ratio to reserve. Passing the width to the stylesheet as well
// keeps it from scaling a small file up to the width of the sidebar.
const filePreviewDimensions = {
  applyDimensions: function (element) {
    var width = this.model.get('width');
    var height = this.model.get('height');
    if (width && height) {
      element.attr({
        width,
        height
      });
      element[0].style.setProperty('--preview-width', width + 'px');
    }
  }
};

function template$Q(data) {
var __p = '';
__p += '<img alt="" />\n';
return __p
}

const ImageFilePreviewView = Marionette.ItemView.extend({
  template: template$Q,
  className: 'file_preview',
  mixins: [filePreviewDimensions],
  ui: {
    image: 'img'
  },
  modelEvents: {
    'change:preview_url': 'update'
  },
  onRender: function () {
    this.update();
  },
  update: function () {
    this.applyDimensions(this.ui.image);
    this.ui.image.attr('src', this.model.get('preview_url'));
  }
});

function template$R(data) {
var __p = '';
__p += '<video muted loop autoplay playsinline preload="metadata"></video>\n\n<div class="file_preview-controls">\n  <button class="file_preview-mute_toggle" type="button">\n    <svg class="file_preview-muted" viewBox="0 0 16 16" aria-hidden="true">\n      <path fill="currentColor" d="M8.5 2.2 5 5H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2l3.5 2.8a.6.6 0 0 0 1-.5V2.7a.6.6 0 0 0-1-.5Z"/>\n      <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M11.5 6.5 15 10M15 6.5l-3.5 3.5"/>\n    </svg>\n    <svg class="file_preview-unmuted" viewBox="0 0 16 16" aria-hidden="true">\n      <path fill="currentColor" d="M8.5 2.2 5 5H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2l3.5 2.8a.6.6 0 0 0 1-.5V2.7a.6.6 0 0 0-1-.5Z"/>\n      <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M11.8 5.6a3.4 3.4 0 0 1 0 4.8M13.9 3.5a6.4 6.4 0 0 1 0 9"/>\n    </svg>\n  </button>\n</div>\n';
return __p
}

const VideoFilePreviewView = Marionette.ItemView.extend({
  template: template$R,
  className: 'file_preview',
  mixins: [filePreviewDimensions],
  ui: {
    video: 'video',
    controls: '.file_preview-controls',
    muteToggle: '.file_preview-mute_toggle',
    mutedIcon: '.file_preview-muted',
    unmutedIcon: '.file_preview-unmuted'
  },
  events: {
    'click video': 'toggleMuted',
    'click .file_preview-mute_toggle': 'toggleMuted'
  },
  modelEvents: {
    'change:preview_url': 'update'
  },
  onRender: function () {
    // Chrome only starts playing without user interaction if the
    // property is set, not just the attribute.
    this.ui.video.prop('muted', true);

    // Seeking comes before turning on sound, both in reading order and
    // when tabbing through the controls.
    var progressBar = new FilePreviewProgressBarView({
      media: this.ui.video[0]
    });
    this.ui.controls.prepend(this.subview(progressBar).el);
    this.update();
    this.updateMuted();
  },
  update: function () {
    this.applyDimensions(this.ui.video);
    this.ui.video.attr('src', this.model.get('preview_url'));
  },
  toggleMuted: function () {
    this.ui.video.prop('muted', !this.ui.video.prop('muted'));
    this.updateMuted();
  },
  updateMuted: function () {
    var muted = this.ui.video.prop('muted');
    var label = I18n$1.t('pageflow.editor.views.video_file_preview_view.' + (muted ? 'unmute' : 'mute'));

    // Toggled via class rather than inline style, since jQuery would
    // fall back to the inline display of an svg inside the still hidden
    // overlay, which keeps the button from being round.
    this.ui.mutedIcon.toggleClass('is_hidden', !muted);
    this.ui.unmutedIcon.toggleClass('is_hidden', muted);
    this.ui.muteToggle.attr('title', label);
    this.ui.muteToggle.attr('aria-label', label);
  }
});

function template$S(data) {
var __t, __p = '';
__p += '<span class="list_item_thumbnail"></span>\n<span class="list_item_missing_thumbnail"></span>\n<span class="list_item_type_pictogram type_pictogram"></span>\n\n<div class="list_item_title"></div>\n<div class="list_item_description"></div>\n\n<div class="list_item_buttons">\n  <a class="list_item_edit_button" title="' +
((__t = ( I18n.t('pageflow.editor.templates.list_item.edit') )) == null ? '' : __t) +
'"></a>\n  <a class="list_item_remove_button" title="' +
((__t = ( I18n.t('pageflow.editor.templates.list_item.remove') )) == null ? '' : __t) +
'"></a>\n</div>\n';
return __p
}

const ListItemView = Marionette.ItemView.extend({
  template: template$S,
  tagName: 'li',
  className: 'list_item',
  ui: {
    thumbnail: '.list_item_thumbnail',
    typePictogram: '.list_item_type_pictogram',
    title: '.list_item_title',
    description: '.list_item_description',
    editButton: '.list_item_edit_button',
    removeButton: '.list_item_remove_button'
  },
  events: {
    'click .list_item_edit_button': function () {
      this.options.onEdit(this.model);
      return false;
    },
    'click .list_item_remove_button': function () {
      this.options.onRemove(this.model);
      return false;
    },
    'mouseenter': function () {
      if (this.options.highlight) {
        this.model.highlight();
      }
    },
    'mouseleave': function () {
      if (this.options.highlight) {
        this.model.resetHighlight();
      }
    }
  },
  modelEvents: {
    'change': 'update'
  },
  onRender: function () {
    this.subview(new ModelThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));
    if (this.options.typeName) {
      this.$el.addClass(this.typeName());
    }
    this.ui.editButton.toggleClass('is_available', !!this.options.onEdit);
    this.ui.removeButton.toggleClass('is_available', !!this.options.onRemove);
    this.update();
  },
  update: function () {
    this.ui.typePictogram.attr('title', this.typeDescription());
    this.ui.title.text(this.model.title() || I18n$1.t('pageflow.editor.views.page_link_item_view.unnamed'));
    this.ui.description.text(this.description());
    this.ui.description.toggle(!!this.description());
    this.$el.toggleClass('is_invalid', !!this.getOptionResult('isInvalid'));
  },
  onClose: function () {
    if (this.options.highlight) {
      this.model.resetHighlight();
    }
  },
  description: function () {
    return this.getOptionResult('description');
  },
  typeName: function () {
    return this.getOptionResult('typeName');
  },
  typeDescription: function () {
    return this.getOptionResult('typeDescription');
  },
  getOptionResult: function (name) {
    return typeof this.options[name] === 'function' ? this.options[name](this.model) : this.options[name];
  }
});

function template$T(data) {
var __t, __p = '';
__p += '<div class="checking notice editor">\n  <p>' +
((__t = ( I18n.t('pageflow.editor.templates.locked.loading') )) == null ? '' : __t) +
'</p>\n\n  <a class="close" href="#">' +
((__t = ( I18n.t('pageflow.editor.templates.locked.close') )) == null ? '' : __t) +
'</a>\n</div>\n\n<div class="error notice editor">\n  <p class="message"></p>\n\n  <a class="close" href="#">' +
((__t = ( I18n.t('pageflow.editor.templates.locked.close') )) == null ? '' : __t) +
'</a>\n  <a class="break" href="#">' +
((__t = ( I18n.t('pageflow.editor.templates.locked.open_here') )) == null ? '' : __t) +
'</a>\n</div>\n\n';
return __p
}

const LockedView = Marionette.ItemView.extend({
  template: template$T,
  className: 'locked checking',
  ui: {
    breakButton: '.break',
    message: '.error .message'
  },
  events: {
    'click .close': 'goBack',
    'click .break': 'breakLock'
  },
  modelEvents: {
    acquired: 'hide',
    locked: 'show',
    unauthenticated: 'goBack'
  },
  breakLock: function () {
    this.model.acquire({
      force: true
    });
  },
  goBack: function () {
    window.location = "/admin/entries/" + state.entry.id;
  },
  show: function (info, options) {
    var key = info.error + '.' + options.context;
    this.ui.message.html(I18n$1.t('pageflow.edit_locks.errors.' + key + '_html', {
      user_name: info.held_by
    }));
    this.ui.message.attr('data-error', key);
    this.ui.breakButton.text(I18n$1.t('pageflow.edit_locks.break_action.acquire'));
    this.$el.removeClass('checking');
    this.$el.show();
  },
  hide: function () {
    this.ui.message.attr('data-error', null);
    this.$el.removeClass('checking');
    this.$el.hide();
  }
});

const EditorView = Backbone.View.extend({
  events: {
    'click a': function (event) {
      // prevent default for all links
      if (!$(event.currentTarget).attr('target') && !$(event.currentTarget).attr('download') && !$(event.currentTarget).attr('href')) {
        return false;
      }
    }
  },
  initialize: function () {
    $(window).on('beforeunload', function (event) {
      if (state.entry.get('uploading_files_count') > 0) {
        return I18n$1.t('pageflow.editor.views.editor_views.files_pending_warning');
      }
    });
  },
  render: function () {
    this.$el.layout({
      minSize: 300,
      togglerTip_closed: I18n$1.t('pageflow.editor.views.editor_views.show_editor'),
      togglerTip_open: I18n$1.t('pageflow.editor.views.editor_views.hide_editor'),
      resizerTip: I18n$1.t('pageflow.editor.views.editor_views.resize_editor'),
      enableCursorHotkey: false,
      fxName: 'none',
      maskIframesOnResize: true,
      onresize: function () {
        app.trigger('resize');
      }
    });
    new UploaderView().render();
    this.$el.append(new LockedView({
      model: state.editLock
    }).render().el);
    this.$el.append(new HelpView().render().el);
  }
});

const BackgroundImageEmbeddedView = Marionette.View.extend({
  modelEvents: {
    'change': 'update'
  },
  render: function () {
    this.update();
    return this;
  },
  update: function () {
    if (this.options.useInlineStyles !== false) {
      this.updateInlineStyle();
    } else {
      this.updateClassName();
    }
    if (this.options.dataSizeAttributes) {
      this.updateDataSizeAttributes();
    }
  },
  updateClassName: function () {
    this.$el.addClass('load_image');
    var propertyName = this.options.propertyName.call ? this.options.propertyName() : this.options.propertyName;
    var id = this.model.get(propertyName);
    var prefix = this.options.backgroundImageClassNamePrefix.call ? this.options.backgroundImageClassNamePrefix() : this.options.backgroundImageClassNamePrefix;
    prefix = prefix || 'image';
    var backgroundImageClassName = id && prefix + '_' + id;
    if (this.currentBackgroundImageClassName !== backgroundImageClassName) {
      this.$el.removeClass(this.currentBackgroundImageClassName);
      this.$el.addClass(backgroundImageClassName);
      this.currentBackgroundImageClassName = backgroundImageClassName;
    }
  },
  updateInlineStyle: function () {
    this.$el.css({
      backgroundImage: this.imageValue(),
      backgroundPosition: this.model.getFilePosition(this.options.propertyName, 'x') + '% ' + this.model.getFilePosition(this.options.propertyName, 'y') + '%'
    });
  },
  updateDataSizeAttributes: function () {
    var imageFile = this.model.getImageFile(this.options.propertyName);
    if (imageFile && imageFile.isReady()) {
      this.$el.attr('data-width', imageFile.get('width'));
      this.$el.attr('data-height', imageFile.get('height'));
    } else {
      this.$el.attr('data-width', '16');
      this.$el.attr('data-height', '9');
    }
    this.$el.css({
      backgroundPosition: '0 0'
    });
  },
  imageValue: function () {
    var url = this.model.getImageFileUrl(this.options.propertyName, {
      styleGroup: this.$el.data('styleGroup')
    });
    return url ? 'url("' + url + '")' : 'none';
  }
});

const LazyVideoEmbeddedView = Marionette.View.extend({
  modelEvents: {
    'change': 'update'
  },
  render: function () {
    this.videoPlayer = this.$el.data('videoPlayer');
    this.videoPlayer.ready(_.bind(function () {
      this.videoPlayer.src(this.model.getVideoFileSources(this.options.propertyName));
    }, this));
    this.update();
    return this;
  },
  update: function () {
    if (this.videoPlayer.isPresent() && this.model.hasChanged(this.options.propertyName)) {
      var paused = this.videoPlayer.paused();
      this.videoPlayer.src(this.model.getVideoFileSources(this.options.propertyName));
      if (!paused) {
        this.videoPlayer.play();
      }
    }
    if (this.options.dataSizeAttributes) {
      var videoFile = this.model.getVideoFile(this.options.propertyName);
      if (videoFile && videoFile.isReady()) {
        this.$el.attr('data-width', videoFile.get('width'));
        this.$el.attr('data-height', videoFile.get('height'));
      } else {
        this.$el.attr('data-width', '16');
        this.$el.attr('data-height', '9');
      }
    }
  }
});

function template$U(data) {
var __t, __p = '';
__p += '<li class="uploading"><span class="count">0</span>' +
((__t = ( I18n.t('pageflow.editor.templates.notification.upload_pending') )) == null ? '' : __t) +
'</li>\n<li class="failed"><span class="count">0</span> <span class="description">' +
((__t = ( I18n.t('pageflow.editor.templates.notification.save_error') )) == null ? '' : __t) +
'</span> <a class="retry">' +
((__t = ( I18n.t('pageflow.editor.templates.notification.retry') )) == null ? '' : __t) +
'</a></li>\n<li class="saving">' +
((__t = ( I18n.t('pageflow.editor.templates.notification.saving') )) == null ? '' : __t) +
'</li>\n<li class="saved">' +
((__t = ( I18n.t('pageflow.editor.templates.notification.saved') )) == null ? '' : __t) +
'</li>\n\n<li class="confirmable_files">\n  ' +
((__t = ( I18n.t('pageflow.editor.templates.notification.approve_files', {num_files: '<span class="count">0</span>'}) )) == null ? '' : __t) +
'\n  <a href="#/confirmable_files" class="display_confirmable_files">' +
((__t = ( I18n.t('pageflow.editor.templates.notification.show') )) == null ? '' : __t) +
'</a>\n</li>\n';
return __p
}

const NotificationsView = Marionette.ItemView.extend({
  className: 'notifications',
  tagName: 'ul',
  template: template$U,
  ui: {
    failedCount: '.failed .count',
    uploadingCount: '.uploading .count',
    confirmableFilesCount: '.confirmable_files .count'
  },
  events: {
    'click .retry': function () {
      editor.failures.retry();
    }
  },
  onRender: function () {
    this.listenTo(state.entry, 'change:uploading_files_count', this.notifyUploadCount);
    this.listenTo(state.entry, 'change:confirmable_files_count', this.notifyConfirmableFilesCount);
    this.listenTo(editor.savingRecords, 'add', this.update);
    this.listenTo(editor.savingRecords, 'remove', this.update);
    this.listenTo(editor.failures, 'add', this.update);
    this.listenTo(editor.failures, 'remove', this.update);
    this.update();
    this.notifyConfirmableFilesCount();
  },
  update: function () {
    this.$el.toggleClass('failed', !editor.failures.isEmpty());
    this.$el.toggleClass('saving', !editor.savingRecords.isEmpty());
    this.ui.failedCount.text(editor.failures.count());
  },
  notifyUploadCount: function (model, uploadCount) {
    this.$el.toggleClass('uploading', uploadCount > 0);
    this.ui.uploadingCount.text(uploadCount);
  },
  notifyConfirmableFilesCount: function () {
    var confirmableFilesCount = state.entry.get('confirmable_files_count');
    this.$el.toggleClass('has_confirmable_files', confirmableFilesCount > 0);
    this.ui.confirmableFilesCount.text(confirmableFilesCount);
  }
});

const FileProcessingStateDisplayView = Marionette.View.extend({
  className: 'file_processing_state_display',
  mixins: [inputView],
  initialize: function () {
    if (typeof this.options.collection === 'string') {
      this.options.collection = state.entry.getFileCollection(editor.fileTypes.findByCollectionName(this.options.collection));
    }
    this.listenTo(this.model, 'change:' + this.options.propertyName, this._update);
  },
  render: function () {
    this._update();
    return this;
  },
  _update: function () {
    if (this.fileStagesView) {
      this.stopListening(this.file.currentStages);
      this.fileStagesView.close();
      this.fileStagesView = null;
    }
    this.file = this._getFile();
    if (this.file) {
      this.listenTo(this.file.currentStages, 'add remove', this._updateClassNames);
      this.fileStagesView = new CollectionView({
        tagName: 'ul',
        collection: this.file.currentStages,
        itemViewConstructor: FileStageItemView,
        itemViewOptions: {
          standAlone: true
        }
      });
      this.appendSubview(this.fileStagesView);
    }
    this._updateClassNames();
  },
  _updateClassNames: function () {
    this.$el.toggleClass('file_processing_state_display-empty', !this._hasItems());
  },
  _hasItems: function () {
    return this.file && this.file.currentStages.length;
  },
  _getFile: function () {
    return this.model.getReference(this.options.propertyName, this.options.collection);
  }
});

/**
 * Input view for oEmbed URLs that resolves and normalizes URLs via oEmbed.
 *
 * Extends UrlInputView to validate URLs via oEmbed and optionally transform
 * them using provider-specific processing functions. The oEmbed response is
 * not stored; it's only used during validation to normalize/transform the URL.
 *
 * @param {Object} [options]
 *
 * @param {string} options.providerNameProperty
 *   Name of the property on the model that contains the provider name.
 *
 * @param {Object.<string, Object>} [options.providers]
 *   Map of provider names to provider configuration objects. Each provider
 *   config can have:
 *   - `supportedHosts`: Array of supported host patterns (e.g., ['bsky.app', 'bsky.social']).
 *     If not specified, all hosts are accepted.
 *   - `transform`: Function that receives the oEmbed response and returns
 *     a transformed/normalized URL string.
 *   - `skipOembedValidation`: Boolean to skip oEmbed validation entirely
 *     for this provider.
 *
 * @example
 *
 *   new OembedUrlInputView({
 *     model: contentElement,
 *     propertyName: 'url',
 *     displayPropertyName: 'displayUrl',
 *     providerNameProperty: 'provider',
 *     providers: {
 *       bluesky: {
 *         supportedHosts: ['bsky.app', 'bsky.social'],
 *         transform: function(response) {
 *           // Return canonical URL from response
 *           return response.url || response.author_url;
 *         }
 *       },
 *       instagram: {
 *         supportedHosts: ['instagram.com', 'www.instagram.com'],
 *         skipOembedValidation: true
 *       }
 *     }
 *   });
 *
 * @class
 */
const OembedUrlInputView = UrlInputView.extend({
  onRender: function () {
    UrlInputView.prototype.onRender.call(this);
    this.displayUrlsByProvider = {};
    this.listenTo(this.model, 'change:' + this.options.providerNameProperty, this.onProviderChange);
  },
  onProviderChange: function () {
    var oldProvider = this.model.previous(this.options.providerNameProperty);
    var newProvider = this.model.get(this.options.providerNameProperty);
    var currentDisplayUrl = this.model.get(this.options.displayPropertyName);
    if (currentDisplayUrl) {
      this.displayUrlsByProvider[oldProvider] = currentDisplayUrl;
    }
    var restoredDisplayUrl = this.displayUrlsByProvider[newProvider];
    this.model.set({
      [this.options.propertyName]: '',
      [this.options.displayPropertyName]: restoredDisplayUrl || ''
    });
    this.onChange();
  },
  providerOptions: function () {
    var providerName = this.model.get(this.options.providerNameProperty);
    return this.options.providers && this.options.providers[providerName] || {};
  },
  supportedHosts: function () {
    return this.providerOptions().supportedHosts || ['.*'];
  },
  permitHttps: function () {
    return true;
  },
  validateUrl: function (url) {
    var providerName = this.model.get(this.options.providerNameProperty);
    var deferred = $.Deferred();
    if (!url || !providerName) {
      deferred.resolve();
      return deferred.promise();
    }
    if (this.providerOptions().skipOembedValidation) {
      deferred.resolve();
      return deferred.promise();
    }
    deferred.notify(I18n$1.t('pageflow.editor.views.inputs.oembed_url_input_view.status.resolving'));
    $.ajax({
      url: '/editor/oembed',
      data: {
        provider: providerName,
        url: url
      },
      dataType: 'json'
    }).done(response => {
      deferred.resolve(response);
    }).fail(xhr => {
      if (xhr.statusText === 'abort') {
        deferred.reject();
        return;
      }
      var errorKey;
      if (xhr.status === 422) {
        errorKey = 'invalid_provider';
      } else if (xhr.status === 404) {
        errorKey = 'not_found';
      } else {
        errorKey = 'error';
      }
      deferred.reject(I18n$1.t('pageflow.editor.views.inputs.oembed_url_input_view.status.' + errorKey));
    });
    return deferred.promise();
  },
  transformPropertyValue: function (value, oembedResponse) {
    if (!oembedResponse) {
      return value;
    }
    var transformFunction = this.providerOptions().transform;
    if (transformFunction) {
      return transformFunction(oembedResponse);
    }
    return value;
  }
});

const NestedFilesView = Marionette.View.extend({
  className: 'nested_files',
  initialize: function () {
    if (!this.options.selection.has('file')) {
      this.options.selection.set('file', this.collection.first());
      this.options.selection.set('nextFile', this.collection.at(1));
    }
    this.listenTo(this.collection, 'add', this.selectNewFile);
    this.listenTo(this.collection, 'remove', this.selectNextFileIfSelectionDeleted);
    this.listenTo(this.options.selection, 'change', this.setNextFile);
    this.listenTo(this.collection, 'add', this.update);
    this.listenTo(this.collection, 'remove', this.update);
    this.listenTo(this.collection, 'request', this.update);
    this.listenTo(this.collection, 'sync', this.update);
  },
  render: function () {
    this.appendSubview(new TableView({
      collection: this.collection,
      attributeTranslationKeyPrefixes: ['pageflow.editor.nested_files.' + this.options.fileType.collectionName],
      columns: this.columns(this.options.fileType),
      selection: this.options.selection,
      selectionAttribute: 'file',
      blankSlateText: this.options.tableBlankSlateText
    }));
    this.update();
    return this;
  },
  update: function () {
    this.$el.toggleClass('is_empty', this.collection.length === 0);
  },
  columns: function (fileType) {
    var nestedFilesColumns = _(fileType.nestedFileTableColumns).map(function (column) {
      return _.extend({}, column, {
        configurationAttribute: true
      });
    });
    nestedFilesColumns.push({
      name: 'delete',
      cellView: DeleteRowTableCellView,
      cellViewOptions: {
        toggleDeleteButton: 'isUploading',
        invertToggleDeleteButton: true
      }
    });
    return nestedFilesColumns;
  },
  selectNewFile: function (file) {
    this.options.selection.set('file', file);
    this.setNextFile();
  },
  selectNextFileIfSelectionDeleted: function () {
    var fileIndex = this.collection.indexOf(this.options.selection.get('file'));
    if (fileIndex === -1) {
      var nextFile = this.options.selection.get('nextFile');
      this.options.selection.set('file', nextFile);
    }
  },
  setNextFile: _.debounce(function () {
    var fileIndex = this.collection.indexOf(this.options.selection.get('file'));
    if (typeof this.collection.at(fileIndex + 1) !== 'undefined') {
      this.options.selection.set('nextFile', this.collection.at(fileIndex + 1));
    } else if (typeof this.collection.at(fileIndex - 1) !== 'undefined') {
      this.options.selection.set('nextFile', this.collection.at(fileIndex - 1));
    } else {
      this.options.selection.set('nextFile', undefined);
    }
  }, 200)
});

function template$V(data) {
var __t, __p = '';
__p += '<div class="text_tracks_container">\n  <div class="files_upload_panel">\n    <div class="files_panel">\n    </div>\n    <a class="upload" href="">' +
((__t = ( I18n.t('pageflow.editor.templates.text_tracks.upload') )) == null ? '' : __t) +
'</a>\n  </div>\n\n  <div class="selected_file_panel">\n    <h2 class="selected_file_header dialog-sub_header">' +
((__t = ( I18n.t('pageflow.editor.templates.text_tracks.edit_file_header') )) == null ? '' : __t) +
'</h2>\n    <div class="selected_file_region">\n    </div>\n  </div>\n</div>\n';
return __p
}

const TextTracksView = Marionette.Layout.extend({
  template: template$V,
  className: 'text_tracks',
  regions: {
    selectedFileRegion: '.selected_file_region'
  },
  ui: {
    filesPanel: '.files_panel',
    selectedFileHeader: '.selected_file_header'
  },
  events: {
    'click a.upload': 'upload'
  },
  initialize: function (options) {
    this.options = options || {};
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },
  onRender: function () {
    this.nestedFilesView = new NestedFilesView({
      collection: this.model.nestedFiles(this.options.supersetCollection),
      fileType: editor.fileTypes.findByCollectionName('text_track_files'),
      selection: this.selection,
      model: this.model,
      tableBlankSlateText: I18n$1.t('pageflow.editor.nested_files.text_track_files.no_files_blank_slate')
    });
    this.ui.filesPanel.append(this.subview(this.nestedFilesView).el);
    this.update();
    editor.setUploadTargetFile(this.model);
  },
  onClose: function () {
    editor.setUploadTargetFile(undefined);
  },
  update: function () {
    var selectedFile = this.selection.get('file');
    if (selectedFile) {
      this.selectedFileRegion.show(new EditFileView({
        model: selectedFile,
        displayFileName: true,
        attributeTranslationKeyPrefixes: ['pageflow.editor.nested_files.text_track_files']
      }));
      this.ui.selectedFileHeader.toggle(true);
    } else {
      this.selectedFileRegion.close();
      this.ui.selectedFileHeader.toggle(false);
    }
  },
  upload: function () {
    app.trigger('request-upload');
  }
});

const TextTracksFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
  initialize: function () {
    this.textTrackFiles = this.model.nestedFiles(state.textTrackFiles);
    this.listenTo(this.textTrackFiles, 'add remove change:configuration', this.update);
  },
  getText: function () {
    return this.textTrackFiles.map(function (textTrackFile) {
      return textTrackFile.displayLabel();
    }).join(', ');
  }
});

function template$W(data) {
var __p = '';
__p += '<label>\n  <span class="list_label"></span>\n</label>\n\n<ul class="list_items"></ul>\n';
return __p
}

function blankSlateTemplate(data) {
var __t, __p = '';
__p +=
((__t = ( I18n.t('pageflow.editor.templates.list_blank_slate.text') )) == null ? '' : __t) +
'\n';
return __p
}

/**
 * A generic list view with items consisting of a thumbnail, text and
 * possibly some buttons or a navigation arrow.
 *
 * Models inside the collection must implement the following methods:
 *
 * @param {Backbone.Collection} options.collection
 *
 * @param {Object} options
 *
 * @param {string} options.label
 *   Text of the label to display above the list.
 *
 * @param {boolean} [options.highlight=false]
 *
 * @param {boolean} [options.sortable=false]
 *
 * @param {string|function} [options.itemDescription]
 *
 * @param {string|function} [options.itemTypeName]
 *
 * @param {string|function} [options.itemTypeDescription]
 *
 * @param {string|function} [options.itemIsInvalid]
 *
 * @param {function} [options.onEdit]
 *
 * @param {function} [options.onRemove]
 *
 * @class
 */
const ListView = Marionette.ItemView.extend({
  template: template$W,
  className: 'list',
  ui: {
    label: '.list_label',
    items: '.list_items'
  },
  onRender: function () {
    var collectionViewConstructor = this.options.sortable ? SortableCollectionView : CollectionView;
    this.subview(new collectionViewConstructor({
      el: this.ui.items,
      collection: this.collection,
      itemViewConstructor: ListItemView,
      itemViewOptions: _.extend({
        description: this.options.itemDescription,
        typeName: this.options.itemTypeName,
        typeDescription: this.options.itemTypeDescription,
        isInvalid: this.options.itemIsInvalid
      }, _(this.options).pick('onEdit', 'onRemove', 'highlight')),
      blankSlateViewConstructor: Marionette.ItemView.extend({
        tagName: 'li',
        className: 'list_blank_slate',
        template: blankSlateTemplate
      })
    }));
    this.ui.label.text(this.options.label);
    this.$el.toggleClass('with_type_pictogram', !!this.options.itemTypeName);
  }
});

const ConfirmUploadView = Marionette.Layout.extend({
  template: template$E,
  className: 'confirm_upload editor dialog',
  mixins: [dialogView],
  regions: {
    selectedFileRegion: '.selected_file_region'
  },
  ui: {
    filesPanel: '.files_panel'
  },
  events: {
    'click .upload': function () {
      this.options.fileUploader.submit();
      this.close();
    }
  },
  initialize: function () {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },
  onRender: function () {
    this.options.fileTypes.each(function (fileType) {
      this.ui.filesPanel.append(this.subview(new UploadableFilesView({
        collection: this.options.files[fileType.collectionName],
        fileType: fileType,
        selection: this.selection
      })).el);
    }, this);
    this.update();
  },
  onClose: function () {
    this.options.fileUploader.abort();
  },
  update: function () {
    var file = this.selection.get('file');
    if (file) {
      this.selectedFileRegion.show(new EditFileView({
        model: file
      }));
    } else {
      this.selectedFileRegion.close();
    }
  }
});
ConfirmUploadView.watch = function (fileUploader, fileTypes, files) {
  fileUploader.on('new:batch', function () {
    ConfirmUploadView.open({
      fileUploader: fileUploader,
      fileTypes: fileTypes,
      files: files
    });
  });
};
ConfirmUploadView.open = function (options) {
  app.dialogRegion.show(new ConfirmUploadView(options));
};

/**
 * Base view to edit configuration container models.  Extend and
 * override the `configure` method which receives a {@link
 * ConfigurationEditorView} to define the tabs and inputs that shall
 * be displayed.
 *
 * Add a `translationKeyPrefix` property to the prototype and define
 * the following translations:
 *
 * * `<translationKeyPrefix>.tabs`: used as `tabTranslationKeyPrefix`
 *   of the `ConfigurationEditorView`.
 *
 * * `<translationKeyPrefix>.attributes`: used as one of the
 *   `attributeTranslationKeyPrefixes` of the
 *   `ConfigurationEditorView`.
 *
 * * `<translationKeyPrefix>.back` (optional): Back button label.
 *
 * * `<translationKeyPrefix>.save_error` (optional): Header of the
 *   failure message that is displayed if the model cannot be saved.
 *
 * * `<translationKeyPrefix>.retry` (optional): Label of the retry
 *   button of the failure message.
 *
 * Override the `goBackPath` property or method to customize the path
 * that the back button navigates to. Defaults to `/`.
 *
 * Override the `defaultTab` property or method to set the initially
 * selected tab.
 *
 * Override the `getActionsMenuItems` method to add menu items to the
 * actions dropdown.
 *
 * The view navigates back when the model is destroyed. Override the
 * `containingCollection` property or method to also navigate back
 * when the model is removed from the returned collection.
 *
 * @param {Object} options
 * @param {Backbone.Model} options.model -
 *   Model including the {@link configurationContainer} and
 *   {@link failureTracking} mixins.
 *
 * @since 15.1
 */
const EditConfigurationView = Marionette.Layout.extend({
  className: 'edit_configuration_view',
  template: ({
    t,
    backLabel
  }) => `
    <a class="back">${backLabel}</a>
    <div class="actions_drop_down_button"></div>

    <div class="failure">
      <p>${t('save_error')}</p>
      <p class="message"></p>
      <a class="retry" href="">${t('retry')}</a>
    </div>

    <div class="configuration_container"></div>
  `,
  serializeData() {
    return {
      t: key => this.t(key),
      backLabel: this.getBackLabel()
    };
  },
  mixins: [failureIndicatingView],
  regions: {
    configurationContainer: '.configuration_container'
  },
  events: {
    'click a.back': 'goBack'
  },
  initialize() {
    const containingCollection = _.result(this, 'containingCollection');
    if (containingCollection) {
      this.listenTo(containingCollection, 'remove', model => {
        if (model === this.model) {
          this.goBack();
        }
      });
    }
    this.listenTo(this.model, 'destroy', this.goBack);
  },
  onRender: function () {
    const translationKeyPrefix = _.result(this, 'translationKeyPrefix');
    this.configurationEditor = new ConfigurationEditorView({
      tabTranslationKeyPrefix: `${translationKeyPrefix}.tabs`,
      attributeTranslationKeyPrefixes: [`${translationKeyPrefix}.attributes`],
      model: this.getConfigurationModel(),
      tab: _.result(this, 'defaultTab')
    });
    this.configure(this.configurationEditor);
    this.configurationContainer.show(this.configurationEditor);
    this.renderActionsDropDown();
  },
  renderActionsDropDown() {
    const items = new Backbone.Collection(this.getActionsMenuItems());
    if (!items.length) {
      return;
    }
    this.$el.find('.actions_drop_down_button').append(this.subview(new DropDownButtonView({
      items,
      label: this.t('actions'),
      ellipsisIcon: true,
      openOnClick: true,
      alignMenu: 'right'
    })).el);
  },
  getActionsMenuItems() {
    return [];
  },
  onShow: function () {
    this.configurationEditor.refreshScroller();
  },
  goBack: function () {
    const path = _.result(this, 'goBackPath') || '/';
    editor.navigate(path, {
      trigger: true
    });
  },
  getConfigurationModel() {
    return this.model.configuration;
  },
  getBackLabel() {
    return this.t(_.result(this, 'goBackPath') ? 'back' : 'outline');
  },
  t(suffix) {
    const translationKeyPrefix = _.result(this, 'translationKeyPrefix');
    return I18n$1.t(`${translationKeyPrefix}.${suffix}`, {
      defaultValue: I18n$1.t(`pageflow.editor.views.edit_configuration.${suffix}`)
    });
  }
});

editor.widgetTypes.register('classic_loading_spinner', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      this.tab('loading_spinner', function () {
        this.view(InfoBoxView, {
          text: I18n$1.t('pageflow.editor.classic_loading_spinner.widget_type_info_box_text')
        });
      });
    }
  })
});

editor.widgetTypes.register('consent_bar', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      this.tab('consent_bar', function () {
        this.view(InfoBoxView, {
          text: I18n$1.t('pageflow.editor.consent_bar.widget_type_info_box_text')
        });
      });
    }
  })
});

editor.widgetTypes.registerRole('cookie_notice', {
  isOptional: true
});
editor.widgetTypes.register('cookie_notice_bar', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      this.tab('cookie_notice_bar', function () {
        this.view(InfoBoxView, {
          text: I18n$1.t('pageflow.editor.cookie_notice_bar.widget_type_info_box_text')
        });
      });
    }
  })
});

editor.widgetTypes.register('media_loading_spinner', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      this.tab('loading_spinner', function () {
        this.view(InfoBoxView, {
          text: I18n$1.t('pageflow.editor.media_loading_spinner.widget_type_info_box_text')
        });
        this.input('custom_background_image_id', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'widgetConfiguration'
        });
        this.input('invert', CheckBoxInputView);
        this.input('remove_logo', CheckBoxInputView);
        this.input('blur_strength', SliderInputView);
        this.input('animation_duration', SliderInputView, {
          minValue: 1,
          maxValue: 7,
          defaultValue: 7,
          unit: 's'
        });
      });
    }
  })
});

editor.widgetTypes.register('phone_horizontal_slideshow_mode', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      this.tab('phone_horizontal_slideshow_mode', function () {
        this.view(InfoBoxView, {
          text: I18n$1.t('pageflow.editor.phone_horizontal_slideshow_mode.widget_type_info_box_text')
        });
        this.view(HelpImageView, {
          imageName: 'phone_horizontal_slideshow_mode'
        });
      });
    }
  })
});

editor.widgetTypes.register('title_loading_spinner', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function () {
      this.tab('loading_spinner', function () {
        this.view(InfoBoxView, {
          text: I18n$1.t('pageflow.editor.title_loading_spinner.widget_type_info_box_text')
        });
        this.input('title', TextInputView, {
          placeholder: state.entry.metadata.get('title') || state.entry.get('entry_title')
        });
        this.input('subtitle', TextInputView);
        this.input('custom_background_image_id', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'widgetConfiguration'
        });
        this.input('invert', CheckBoxInputView);
        this.input('remove_logo', CheckBoxInputView);
        this.input('blur_strength', SliderInputView);
        this.input('animation_duration', SliderInputView, {
          minValue: 1,
          maxValue: 7,
          defaultValue: 7,
          unit: 's'
        });
      });
    }
  })
});

app.addInitializer(function (options) {
  state.config = options.config;
});

app.addInitializer(function (options) {
  state.editorAssetUrls = options.asset_urls;
});

app.addInitializer(function (options) {
  state.seed = options.common;
});

app.addInitializer(function (options) {
  features.enable('editor', options.entry.enabled_feature_names);
});

app.addInitializer(function (options) {
  Audio.setup({
    getSources: function (audioFileId) {
      var file = state.audioFiles.getByPermaId(audioFileId);
      return file ? file.getSources() : '';
    }
  });
});

app.addInitializer(function () {
  Backbone.history.on('route', function () {
    editor.applyDefaultHelpEntry();
  });
});

const OtherFile = UploadableFile.extend({
  thumbnailPictogram: 'other'
});

var textTracksMetaDataAttribute = {
  name: 'text_tracks',
  valueView: TextTracksFileMetaDataItemValueView,
  valueViewOptions: {
    settingsDialogTabLink: 'text_tracks'
  }
};
var textTracksSettingsDialogTab = {
  name: 'text_tracks',
  view: TextTracksView,
  viewOptions: {
    supersetCollection: function () {
      return state.textTrackFiles;
    }
  }
};
editor.fileTypes.register('image_files', {
  model: ImageFile,
  previewView: ImageFilePreviewView,
  metaDataAttributes: ['dimensions', altMetaDataAttribute],
  matchUpload: /^image/,
  configurationEditorInputs: [altConfigurationEditorInput]
});
editor.fileTypes.register('video_files', {
  model: VideoFile,
  previewView: VideoFilePreviewView,
  metaDataAttributes: ['format', 'dimensions', 'duration', textTracksMetaDataAttribute, altMetaDataAttribute],
  matchUpload: /^video/,
  configurationEditorInputs: [altConfigurationEditorInput],
  settingsDialogTabs: [textTracksSettingsDialogTab]
});
editor.fileTypes.register('audio_files', {
  model: AudioFile,
  previewView: AudioFilePreviewView,
  metaDataAttributes: ['format', 'duration', textTracksMetaDataAttribute, altMetaDataAttribute],
  matchUpload: /^audio/,
  configurationEditorInputs: [altConfigurationEditorInput],
  settingsDialogTabs: [textTracksSettingsDialogTab]
});
editor.fileTypes.register('text_track_files', {
  model: TextTrackFile,
  matchUpload: function (upload) {
    return upload.name.match(/\.vtt$/) || upload.name.match(/\.srt$/);
  },
  skipUploadConfirmation: true,
  noExtendedFileRights: true,
  configurationEditorInputs: [{
    name: 'label',
    inputView: TextInputView,
    inputViewOptions: {
      placeholder: function (configuration) {
        var textTrackFile = configuration.parent;
        return textTrackFile.inferredLabel();
      },
      placeholderBinding: TextTrackFile.displayLabelBinding
    }
  }, {
    name: 'kind',
    inputView: SelectInputView,
    inputViewOptions: {
      values: () => state.config.availableTextTrackKinds,
      translationKeyPrefix: 'pageflow.config.text_track_kind'
    }
  }, {
    name: 'srclang',
    inputView: TextInputView,
    inputViewOptions: {
      required: true
    }
  }],
  nestedFileTableColumns: [{
    name: 'label',
    cellView: TextTableCellView,
    value: function (textTrackFile) {
      return textTrackFile.displayLabel();
    },
    contentBinding: TextTrackFile.displayLabelBinding
  }, {
    name: 'srclang',
    cellView: TextTableCellView,
    default: () => I18n$1.t('pageflow.editor.text_track_files.srclang_missing')
  }, {
    name: 'kind',
    cellView: IconTableCellView,
    cellViewOptions: {
      icons: () => state.config.availableTextTrackKinds
    }
  }],
  nestedFilesOrder: {
    comparator: function (textTrackFile) {
      return textTrackFile.displayLabel().toLowerCase();
    },
    binding: 'label'
  }
});
editor.fileTypes.register('other_files', {
  model: OtherFile,
  metaDataAttributes: [altMetaDataAttribute],
  matchUpload: () => true,
  priority: 100,
  configurationEditorInputs: [altConfigurationEditorInput]
});
app.addInitializer(function (options) {
  editor.fileTypes.commonMetaDataAttributes = [{
    name: 'rights',
    valueView: TextFileMetaDataItemValueView,
    valueViewOptions: {
      settingsDialogTabLink: 'general'
    }
  }];
  if (editor.entryType.supportsExtendedFileRights) {
    editor.fileTypes.commonMetaDataAttributes = [...editor.fileTypes.commonMetaDataAttributes, {
      name: 'source_url',
      valueView: TextFileMetaDataItemValueView,
      valueViewOptions: {
        fromConfiguration: true,
        settingsDialogTabLink: 'general'
      }
    }, {
      name: 'license',
      valueView: TextFileMetaDataItemValueView,
      valueViewOptions: {
        fromConfiguration: true,
        formatValue: value => I18n$1.t(`pageflow.file_licenses.${value}.name`),
        settingsDialogTabLink: 'general'
      }
    }];
  }
  editor.fileTypes.commonSettingsDialogTabs = [{
    name: 'general',
    view: EditFileView
  }];
  editor.fileTypes.setup(options.config.fileTypes);
});

app.addInitializer(function (options) {
  editor.widgetTypes.registerRole('navigation', {
    isOptional: true
  });
  editor.widgetTypes.setup(options.widget_types);
});

app.addInitializer(function (options) {
  state.files = FilesCollection.createForFileTypes(editor.fileTypes, options.files);
  state.imageFiles = state.files.image_files;
  state.videoFiles = state.files.video_files;
  state.audioFiles = state.files.audio_files;
  state.textTrackFiles = state.files.text_track_files;
  state.fileFolders = new FileFoldersCollection(options.file_folders);
  var widgets = new WidgetsCollection(options.widgets, {
    widgetTypes: editor.widgetTypes
  });
  state.themes = new ThemesCollection(options.themes);
  state.pages = new PagesCollection(options.pages);
  state.chapters = new ChaptersCollection(options.chapters);
  state.storylines = new StorylinesCollection(options.storylines);
  state.site = new Site(options.site);
  state.entry = editor.createEntryModel(options, {
    widgets: widgets
  });
  state.account = new Backbone.Model(options.account);
  widgets.setupConfigurationEditorTabViewGroups(ConfigurationEditorTabView.groups);
  state.storylineOrdering = new StorylineOrdering(state.storylines, state.pages);
  state.storylineOrdering.sort({
    silent: true
  });
  state.storylineOrdering.watch();
  state.pages.sort();
  state.storylines.on('sort', _.debounce(function () {
    state.storylines.saveOrder();
  }, 100));
  editor.failures.watch(state.entry);
  editor.failures.watch(state.pages);
  editor.failures.watch(state.chapters);
  editor.failures.watch(state.fileFolders);
  editor.savingRecords.watch(state.pages);
  editor.savingRecords.watch(state.chapters);
  editor.savingRecords.watch(state.fileFolders);
  events.trigger('seed:loaded');
});

app.addInitializer(function (options) {
  state.fileUploader = new FileUploader({
    entry: state.entry,
    fileTypes: editor.fileTypes
  });
  ConfirmUploadView.watch(state.fileUploader, editor.fileTypes, state.files);
});

app.addInitializer(function (options) {
  editor.pageTypes.setup(options.page_types);
});

app.addInitializer(function (options) {
  editor.fileImporters.setup(options.config.fileImporters);
});

app.addInitializer(function (options) {
  state.editLock = new EditLockContainer();
  state.editLock.watchForErrors();
  state.editLock.acquire();
});

app.addInitializer(function (options) {
  state.entry.pollForPendingFiles();
});

app.addInitializer(function () {
  _.each(editor.sideBarRoutings, function (options) {
    new options.router({
      controller: new options.controller({
        region: app.sidebarRegion,
        entry: state.entry
      })
    });
  });
  editor.router = new SidebarRouter({
    controller: new SidebarController({
      region: app.sidebarRegion,
      entry: state.entry
    })
  });
  window.editor = editor.router;
});

app.addInitializer(function () {
  app.on('error', function (e) {
    if (e.message) {
      alert(e.message);
    } else {
      alert(I18n$1.t(e.name, {
        scope: 'pageflow.editor.errors',
        defaultValue: I18n$1.t('pageflow.editor.errors.unknown')
      }));
    }
  });
});

app.addInitializer(function /* args */
() {
  var context = this;
  var args = arguments;
  _.each(editor.initializers, function (fn) {
    fn.call(context, {
      ...args,
      entry: state.entry
    });
  });
});

app.addInitializer(function (options) {
  new EditorView({
    el: $('body')
  }).render();
  new ScrollingView({
    el: $('sidebar .scrolling'),
    region: app.sidebarRegion
  }).render();
  app.previewRegion.show(new editor.entryType.previewView({
    model: state.entry
  }));
  app.notificationsRegion.show(new NotificationsView());
  app.sidebarFooterRegion.show(new SidebarFooterView({
    model: state.entry
  }));
  Backbone.history.start({
    root: options.root
  });
});
app.addRegions({
  previewRegion: '#entry_preview',
  mainRegion: '#main_content',
  indicatorsRegion: '#editor_indicators',
  sidebarRegion: 'sidebar .container',
  dialogRegion: '.dialog_container',
  notificationsRegion: 'sidebar .notifications_container',
  sidebarFooterRegion: 'sidebar .sidebar_footer_container'
});

export { AudioFile, AudioFilePreviewView, BackButtonDecoratorView, BackgroundImageEmbeddedView, BackgroundPositioningImageView, BackgroundPositioningPreviewView, BackgroundPositioningSlidersView, BackgroundPositioningView, ChangeThemeDialogView, Chapter, ChapterConfiguration, ChapterPagesCollection, ChapterScaffold, ChaptersCollection, ChooseImporterView, CombinedFilesCollection, ConcatenatedCollection, Configuration, ConfirmEncodingView, ConfirmFileImportUploadView, ConfirmUploadView, ConfirmableFileItemView, DestroyMenuItem, DropDownButtonItemListView, DropDownButtonItemView, DropDownButtonView, EditConfigurationView, EditDefaultsInputView, EditEntryView, EditFileView, EditLock, EditLockContainer, EditMetaDataView, EditWidgetView, EditWidgetsView, EditorApi, EditorView, EmulationModeButtonView, EncodedFile, EncodingConfirmation, Entry, EntryMetadata, EntryMetadataFileSelectionHandler, EntryPublication, EntryPublicationQuotaDecoratorView, ExplorerFileItemView, Failure, FileConfiguration, FileFolder, FileFoldersCollection, FileImport, FileInputView, FileItemView, FileMetaDataItemValueView, FileMetaDataItemView, FileMetaDataOverlayView, FilePreviewProgressBarView, FileProcessingStateDisplayView, FileReferencesView, FileReuse, FileSettingsDialogView, FileStage, FileStageIconView, FileStageItemView, FileThumbnailView, FileTypePillsView, FileTypeSelection, FileTypes, FileTypesCollection, FileUploader, FilesBlankSlateView, FilesCollection, FilesExplorerView, FilesImporterView, FilesListItemView, FilesView, FilteredFilesView, FolderBreadcrumbView, FolderItemView, ForeignKeySubsetCollection, HelpButtonView, HelpImageView, HelpView, ImageFile, ImageFilePreviewView, InfoBoxView, InvalidNestedTypeError, LazyVideoEmbeddedView, ListHighlight, ListItemView, ListSelection, ListView, LoadingView, LockedView, ModelThumbnailView, MoveToFolderDialogView, NestedFilesCollection, NestedFilesView, NestedTypeError, NotificationsView, OembedUrlInputView, OrderedPageLinksCollection, OtherEntriesCollection, OtherEntriesCollectionView, OtherEntry, OtherEntryItemView, Page, PageConfigurationFileSelectionHandler, PageLink, PageLinkConfigurationEditorView, PageLinkFileSelectionHandler, PageLinkItemView, PageLinksCollection, PageLinksView, PageThumbnailView, PagesCollection, PublishEntryView, ReferenceInputView, ReusableFile, Scaffold, ScrollingView, Search, SidebarController, SidebarFooterView, SidebarRouter, Site, StaticThumbnailView, Storyline, StorylineChaptersCollection, StorylineConfiguration, StorylineOrdering, StorylineScaffold, StorylineTransitiveChildPages, StorylinesCollection, SubsetCollection, TextFileMetaDataItemValueView, TextTrackFile, TextTracksFileMetaDataItemValueView, TextTracksView, Theme, ThemeInputView, ThemeItemView, ThemesCollection, UnmatchedUploadError, UploadError, UploadableFile, UploadableFilesView, UploaderView, VideoFile, VideoFilePreviewView, Widget, WidgetConfiguration, WidgetConfigurationFileSelectionHandler, WidgetItemView, WidgetTypes, WidgetsCollection, addAndReturnModel, altConfigurationEditorInput, altMetaDataAttribute, app, authenticationProvider, byFileName, configurationContainer, delayedDestroying, dialogView, editor, entryTypeEditorControllerUrls, failureIndicatingView, failureTracking, fileWithType, filesCountWatcher, filesPath, formDataUtils, getLocalStorage, listHighlighting, loadable, modelLifecycleTrackingView, orderedCollection, persistedPromise, polling, retryable, selectableView, stageProvider, startEditor, state, stylesheet, transientReferences, validFileTypeTranslationList };
