import $ from 'jquery';
import _ from 'underscore';
import { Object } from 'pageflow/ui';
import { within } from '@testing-library/dom';
import Backbone from 'backbone';
import { Entry, Theme, FileTypes, FilesCollection, SubsetCollection, ImageFile, WidgetTypes, EditorApi, FileFoldersCollection, WidgetsCollection, VideoFile, TextTrackFile } from 'pageflow/editor';
import { ReviewSession } from 'pageflow/review';
import { browser, features } from 'pageflow/frontend';
import I18n from 'i18n-js';

let container;
afterEach(() => {
  if (container) {
    container.remove();
    container = null;
  }
});
function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
}
function renderBackboneView(view) {
  ensureContainer();
  view.render();
  container.appendChild(view.el);
  if (view.onShow) {
    view.onShow();
  }
  return within(view.el);
}

const Base = Object.extend({
  initialize: function ($el) {
    this.$el = $el;
  }
});
Base.classMethods = function (Constructor) {
  return {
    find: function (viewOrParentElement) {
      var selector = Constructor.prototype.selector;
      var parentElement = viewOrParentElement.$el || viewOrParentElement;
      var element = parentElement.find(selector);
      if (element.length > 1) {
        throw new Error('Selector "' + selector + '" matches multiple elements in view. Expected only one');
      }
      if (element.length === 0) {
        throw new Error('Selector "' + selector + '" did not match any elements in view.');
      }
      return new Constructor(element);
    },
    findAll: function (viewOrParentElement) {
      var selector = Constructor.prototype.selector;
      var parentElement = viewOrParentElement.$el || viewOrParentElement;
      var elements = parentElement.find(selector);
      return elements.map(function () {
        return new Constructor($(this));
      }).get();
    },
    findBy: function (predicate, options) {
      var predicateString = options.predicateName ? ' filtered by ' + options.predicateName : '';
      var selector = Constructor.prototype.selector;
      var selectorString = 'Selector "' + selector + '"' + predicateString;
      var elements = options.inView.$el.find(selector);
      var element = elements.filter(function () {
        return predicate($(this));
      });
      if (element.length > 1) {
        throw new Error(selectorString + ' matches multiple elements in view. Expected only one');
      }
      if (element.length === 0) {
        throw new Error(selectorString + ' did not match any elements in view.');
      }
      return new Constructor(element);
    },
    render: function (view) {
      renderBackboneView(view);
      return new Constructor(view.$el);
    }
  };
};
Base.extend = function /* arguments */
() {
  var result = Object.extend.apply(this, arguments);
  _.extend(result, Base.classMethods(result));
  return result;
};

const DropDownButton = Base.extend({
  selector: '.drop_down_button',
  menuItemNames: function () {
    return this.$el.find('li:not(.is_hidden)').map(function () {
      return $(this).data('name');
    }).get();
  },
  menuItemLabels: function () {
    return this.$el.find('li:not(.is_hidden) a').map(function () {
      return $(this).text();
    }).get();
  },
  selectMenuItemByName: function (name) {
    var menuItem = this.$el.find('li:not(.is_hidden)').filter(function () {
      return $(this).data('name') == name;
    });
    if (!menuItem.length) {
      throw new Error('Could not find menu item with name "' + name + '"');
    }
    menuItem.find('a').trigger('click');
  },
  selectMenuItemByLabel: function (label) {
    var menuItemLink = this.$el.find('li:not(.is_hidden) a').filter(function () {
      return $(this).text() == label;
    });
    if (!menuItemLink.length) {
      throw new Error('Could not find menu item with label "' + label + '"');
    }
    menuItemLink.trigger('click');
  }
});

const FileMetaDataTable = Base.extend({
  selector: '.file_meta_data table',
  values: function () {
    return this.$el.find('.value').map(function () {
      return $(this).text();
    }).get();
  }
});

const FileStageItem = Base.extend({
  selector: '.file_stage_item'
});

const FileThumbnail = Base.extend({
  selector: '.file_thumbnail',
  backgroundImage: function () {
    return this.$el.css('backgroundImage');
  }
});

const Base$1 = Base.extend({
  selector: '.input'
});
Base$1.findByPropertyName = function (propertyName, {
  visible,
  ...options
} = {}) {
  return this.findBy(el => el.data('inputPropertyName') === propertyName && (!visible || !el.hasClass('hidden_via_binding')), {
    predicateName: `${visible ? 'visible ' : ''}input property name '${propertyName}'`,
    ...options
  });
};

const FileInput = Base$1.extend({
  menuItemNames: function () {
    return DropDownButton.find(this.$el).menuItemNames();
  },
  selectMenuItemByName: function (name) {
    DropDownButton.find(this.$el).selectMenuItemByName(name);
  }
});

const ReferenceInput = Base.extend({
  clickChooseButton: function () {
    this.$el.find('.choose').trigger('click');
  }
});

const StaticThumbnail = Base.extend({
  selector: '.static_thumbnail',
  backgroundImage: function () {
    return this.$el.css('backgroundImage');
  }
});

const ThemeItem = Base.extend({
  selector: '.theme_item',
  hover: function () {
    this.$el.trigger('mouseenter');
  },
  click: function () {
    this.$el.trigger('click');
  },
  clickUseButton: function () {
    this.$el.find('.use_theme').trigger('click');
  }
});
ThemeItem.findByName = function (themeName, options) {
  return this.findBy(function ($el) {
    return $el.data('themeName') === themeName;
  }, _.extend({
    predicateName: 'theme name ' + themeName
  }, options));
};

const ConfigurationEditorTab = Base.extend({
  selector: '.configuration_editor_tab',
  inputPropertyNames: function () {
    return this.$el.find('.input').map(function () {
      return $(this).data('inputPropertyName');
    }).get();
  },
  visibleInputPropertyNames: function () {
    return this.$el.find('.input:not(.hidden_via_binding)').map(function () {
      return $(this).data('inputPropertyName');
    }).get();
  },
  inputLabels: function () {
    return this.$el.find('.input').map(function () {
      return $(this).data('labelText');
    }).get();
  },
  inlineHelpTexts: function () {
    return this.$el.find('.input').map(function () {
      return $(this).data('inlineHelpText');
    }).get();
  }
});

const Tabs = Base.extend({
  selector: '.tabs_view',
  tabNames: function () {
    return this.$el.find('[data-tab-name]').map(function () {
      return $(this).data('tabName');
    }).get();
  },
  tabLabels: function () {
    return this.$el.find('[data-tab-name]').map(function () {
      return $(this).text();
    }).get();
  }
});

const ConfigurationEditor = Base.extend({
  selector: '.configuration_editor',
  tabNames: function () {
    return Tabs.find(this.$el).tabNames();
  },
  tabLabels: function () {
    return Tabs.find(this.$el).tabLabels();
  },
  inputPropertyNames: function () {
    return ConfigurationEditorTab.find(this.$el).inputPropertyNames();
  },
  visibleInputPropertyNames: function () {
    return ConfigurationEditorTab.find(this.$el).visibleInputPropertyNames();
  },
  inputLabels: function () {
    return ConfigurationEditorTab.find(this.$el).inputLabels();
  },
  inlineHelpTexts: function () {
    return ConfigurationEditorTab.find(this.$el).inlineHelpTexts();
  }
});

const Table = Base.extend({
  selector: '.table_view',
  columnNames: function () {
    return this.$el.find('th').map(function () {
      return $(this).data('columnName');
    }).get();
  }
});

const RadioButtonGroupInput = Base$1.extend({
  values: function () {
    return this.$el.find('input').map(function () {
      return $(this).attr('value');
    }).get();
  },
  enabledValues: function () {
    return this.$el.find('input:not([disabled])').map(function () {
      return $(this).attr('value');
    }).get();
  }
});

const SelectInput = Base$1.extend({
  value: function () {
    return this.$el.find('select').val();
  },
  values: function () {
    return this.$el.find('option').map(function () {
      return $(this).attr('value');
    }).get();
  },
  texts: function () {
    return this.$el.find('option').map(function () {
      return $(this).text();
    }).get();
  },
  enabledValues: function () {
    return this.$el.find('option:not([disabled])').map(function () {
      return $(this).attr('value');
    }).get();
  }
});

/**
 * Build editor Backbone models for tests.
 */
const factories = {
  /**
   * Build an entry model.
   *
   * @param {Function} model - Entry type specific entry model
   * @param {Object} [attributes] - Model attributes
   * @param {Object} [options]
   * @param {Object} [options.entryTypeSeed] - Seed data passed to `Entry#setupFromEntryTypeSeed`.
   * @param {FileTypes} [options.fileTypes] - Use {@link #factoriesfiletypes factories.fileTypes} to construct this object.
   * @param {Object} [options.filesAttributes] - An object mapping (underscored) file collection names to arrays of file attributes.
   * @returns {Entry} - An entry Backbone model.
   *
   * @example
   *
   * import {factories} from 'pageflow/testHelpers';
   * import {PagedEntry} from 'editor/models/PagedEntry';
   *
   * const entry = factories.entry(PagedEntry, {slug: 'some-entry'}, {
   *   entryTypeSeed: {some: 'data'},
   *   fileTypes: factories.fileTypes(f => f.withImageFileType()),
   *   filesAttributes: {
   *     image_files: [{id: 100, perma_id: 1, basename: 'image'}]
   *   }
   * });
   */
  entry: function entry(model, attributes, options = {}) {
    if (typeof model !== 'function') {
      return factories.entry(Entry, model, attributes);
    }
    ensureFileTypes(options);
    ensureFilesCollections(options);
    ensureFileFoldersCollection(options);
    ensureWidgetsCollections(options);
    const entry = new model({
      id: 1,
      ...attributes
    }, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection()
    }, options));
    if (entry.setupFromEntryTypeSeed && options.entryTypeSeed) {
      entry.setupFromEntryTypeSeed(options.entryTypeSeed);
    }
    return entry;
  },
  theme: function theme(attributes, options) {
    return new Theme(attributes, options);
  },
  /**
   * Build a real `ReviewSession` pre-populated with state — suitable for
   * Backbone view specs that would otherwise stub out the session.
   *
   * Commenting UI is always gated on a signed-in user; the `currentUser`
   * default reflects that. Specs override it only when they care about
   * the current user's identity (permissions, ownership, etc.).
   *
   * @param {Object} [options]
   * @param {Object} [options.currentUser] - Current user exposed via `session.state.currentUser`.
   * @param {Array}  [options.commentThreads] - Seed threads exposed via `session.state.commentThreads`.
   * @param {Object} [options.entryId] - Entry id used when constructing request URLs.
   * @param {Function} [options.request] - Override the request function. Defaults to a jest mock resolving to the seeded state.
   * @returns {ReviewSession}
   */
  reviewSession: function reviewSession({
    currentUser = {
      id: 1,
      name: 'Test User'
    },
    commentThreads = [],
    entryId = 1,
    request
  } = {}) {
    return new ReviewSession({
      entryId,
      request: request || jest.fn().mockResolvedValue({
        currentUser,
        commentThreads
      }),
      initialState: {
        currentUser,
        commentThreads
      }
    });
  },
  /**
   * Construct a file type registry that can be passed to {@link
   * #factoriesentry factories.entry}.
   *
   * The passed function receives a builder object with the following
   * methods that register a corresponding file type:
   *
   * - `withImageFileType([options])`: Registers a file type with collection name `image_files`.
   * - `withVideoFileType([options])`: Registers a file type with collection name `video_files`.
   * - `withTextTrackFileType([options])`: Registers a file type with collection name `text_track_files`.
   *
   * @param {Function} fn - Build function.
   * @returns {FileTypes} - A file Type registry
   */
  fileTypes: function (fn) {
    var fileTypes = new FileTypes();
    var fileTypesSetupArray = [];
    var builder = {
      withImageFileType: function (options) {
        fileTypes.register('image_files', _.extend({
          model: ImageFile,
          matchUpload: /^image/,
          topLevelType: true
        }, options));
        fileTypesSetupArray.push({
          collectionName: 'image_files',
          typeName: 'Pageflow::ImageFile',
          i18nKey: 'pageflow/image_files'
        });
        return this;
      },
      withVideoFileType: function (options) {
        fileTypes.register('video_files', _.extend({
          model: VideoFile,
          matchUpload: /^video/,
          topLevelType: true
        }, options));
        fileTypesSetupArray.push({
          collectionName: 'video_files',
          typeName: 'Pageflow::VideoFile',
          i18nKey: 'pageflow/video_files',
          nestedFileTypes: [{
            collectionName: 'text_track_files'
          }]
        });
        return this;
      },
      withAudioFileType: function (options) {
        fileTypes.register('audio_files', _.extend({
          model: VideoFile,
          matchUpload: /^audio/,
          topLevelType: true
        }, options));
        fileTypesSetupArray.push({
          collectionName: 'audio_files',
          typeName: 'Pageflow::AudioFile',
          i18nKey: 'pageflow/audio_files',
          nestedFileTypes: [{
            collectionName: 'text_track_files'
          }]
        });
        return this;
      },
      withTextTrackFileType: function (options) {
        fileTypes.register('text_track_files', _.extend({
          model: TextTrackFile,
          matchUpload: /vtt$/
        }, options));
        fileTypesSetupArray.push({
          collectionName: 'text_track_files',
          typeName: 'Pageflow::TextTrackFile',
          i18nKey: 'pageflow/text_track_files'
        });
        return this;
      }
    };
    fn.call(builder, builder);
    fileTypes.setup(fileTypesSetupArray);
    return fileTypes;
  },
  /**
  * Shorthand for calling {@link #factoriesfiletypes
  * factories.fileTypes} with a builder function that calls
  * `withImageFileType`.
  *
  * @param {Object} options - File type options passed to withImageFileType,
  * @returns {FileTypes} - A file Type registry.
  */
  fileTypesWithImageFileType: function (options) {
    return this.fileTypes(function () {
      this.withImageFileType(options);
    });
  },
  imageFileType: function (options) {
    return factories.fileTypesWithImageFileType(options).first();
  },
  fileType: function (options) {
    return factories.imageFileType(options);
  },
  filesCollection: function (options) {
    return FilesCollection.createForFileType(options.fileType, [{}, {}]);
  },
  nestedFilesCollection: function (options) {
    return new SubsetCollection({
      parentModel: factories.file({
        file_name: options.parentFileName
      }),
      filter: function () {
        return true;
      },
      parent: factories.filesCollection({
        fileType: options.fileType
      })
    });
  },
  videoFileWithTextTrackFiles: function (options) {
    var fileTypes = this.fileTypes(function () {
      this.withVideoFileType(options.videoFileTypeOptions);
      this.withTextTrackFileType(options.textTrackFileTypeOptions);
    });
    var fileAttributes = {
      video_files: [_.extend({
        id: 1,
        state: 'encoded'
      }, options.videoFileAttributes)],
      text_track_files: _.map(options.textTrackFilesAttributes, function (attributes) {
        return _.extend({
          parent_file_id: 1,
          parent_file_model_type: 'Pageflow::VideoFile'
        }, attributes);
      })
    };
    var entry = factories.entry({}, {
      files: FilesCollection.createForFileTypes(fileTypes, fileAttributes || {}),
      fileTypes: fileTypes
    });
    var videoFiles = entry.getFileCollection(fileTypes.findByCollectionName('video_files'));
    var textTrackFiles = entry.getFileCollection(fileTypes.findByCollectionName('text_track_files'));
    return {
      entry: entry,
      videoFile: videoFiles.first(),
      videoFiles: videoFiles,
      textTrackFiles: textTrackFiles
    };
  },
  imageFilesFixture: function (options) {
    var fileTypes = this.fileTypes(function () {
      this.withImageFileType(options.fileTypeOptions);
    });
    var fileAttributes = {
      image_files: [_.extend({
        id: 1,
        state: 'processed'
      }, options.imageFileAttributes)]
    };
    var entry = factories.entry({}, {
      files: FilesCollection.createForFileTypes(fileTypes, fileAttributes || {}),
      fileTypes: fileTypes
    });
    var imageFiles = entry.getFileCollection(fileTypes.findByCollectionName('image_files'));
    return {
      entry: entry,
      imageFile: imageFiles.first(),
      imageFiles: imageFiles
    };
  },
  imageFile: function (attributes, options) {
    return new ImageFile(attributes, _.extend({
      fileType: this.imageFileType()
    }, options));
  },
  file: function (attributes, options) {
    return this.imageFile(attributes, options);
  },
  widgetTypes: function (attributesList, beforeSetup) {
    var widgetTypes = new WidgetTypes();
    var attributesListsByRole = {};
    _(attributesList).each(function (attributes) {
      attributesListsByRole[attributes.role] = attributesListsByRole[attributes.role] || [];
      attributesListsByRole[attributes.role].push(_.extend({
        translationKey: 'widget_name.' + attributes.name
      }, attributes));
    });
    if (beforeSetup) {
      beforeSetup(widgetTypes);
    }
    widgetTypes.setup(attributesListsByRole);
    return widgetTypes;
  },
  editorApi: function (beforeSetup) {
    var api = new EditorApi({
      router: {
        navigate(path, {
          trigger
        }) {
          if (trigger) {
            api.trigger('navigate', path);
          }
        }
      }
    });
    if (beforeSetup) {
      beforeSetup(api);
    }
    api.pageTypes.setup(_.map(api.pageTypes.clientSideConfigs, function (config, name) {
      return {
        name: name,
        translation_key_prefix: 'pageflow.' + name,
        translation_key: 'pageflow.' + name + '.name',
        category_translation_key: 'pageflow.' + name + '.category',
        description_translation_key: 'pageflow.' + name + '.description'
      };
    }));
    return api;
  }
};
function ensureFileTypes(options) {
  if (!options.fileTypes) {
    options.fileTypes = new FileTypes();
    options.fileTypes.setup([]);
  }
}
function ensureFilesCollections(options) {
  if (!options.files) {
    options.files = FilesCollection.createForFileTypes(options.fileTypes, options.filesAttributes);
  }
}
function ensureFileFoldersCollection(options) {
  if (!options.fileFolders) {
    options.fileFolders = new FileFoldersCollection(options.fileFoldersAttributes);
  }
}
function ensureWidgetsCollections(options) {
  if (!options.widgets) {
    options.widgets = new WidgetsCollection(options.widgetsAttributes, {
      widgetTypes: options.widgetTypes
    });
  }
}

const userAgents = {
  'Safari on iPhone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) ' + 'AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0' + 'Mobile/14A403 Safari/602.1',
  'Safari on macOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) ' + 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 ' + 'Safari/605.1.15',
  'Chrome on Android': 'Mozilla/5.0 (Linux; Android 10) ' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106' + 'Mobile Safari/537.36',
  'Chrome on iPhone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)' + 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75' + 'Mobile/14E5239e Safari/602.1',
  'Chrome on Windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' + '(KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
};
function fakeBrowserAgent(name) {
  if (!userAgents[name]) {
    throw new Error(`Unknown browser ${name}.`);
  }
  return new browser.Agent(userAgents[name]);
}

const state = window.pageflow || {};

/**
 * Setup global state for testing Backbone editor components.
 *
 * For some editor components like (some views or models) it's easier
 * to depend on the global mutable state (available via the `$state`
 * module alias) instead of injecting dependencies. This helper can be
 * used to test these components in isolation.
 *
 * @param {Object} mapping -
 *   Properties to set on the global state. Functions as values will
 *   be evaluated and the return value will be assigned instead.
 */
const setupGlobals = function (mapping) {
  let globalsBackup;
  beforeEach(() => {
    if (globalsBackup) {
      throw new Error('There can only be one setupGlobals call per test.');
    }
    globalsBackup = {};
    setGlobals(mapping);
  });
  afterEach(() => {
    _.each(mapping, function (_, key) {
      state[key] = globalsBackup[key];
    });
    globalsBackup = null;
  });
  function setGlobals(mapping) {
    _.each(mapping, function (value, key) {
      globalsBackup[key] = state[key];
      state[key] = typeof value === 'function' ? value.call(this) : value;
    });
    return mapping;
  }
  return {
    setGlobals
  };
};

/**
 * Enable feature flags for the surrounding describe block.
 *
 * Each `beforeEach` calls `features.enable(scope, names)`, which both
 * flips `features.isEnabled` to true for the given names and runs any
 * functions registered via `features.register` for them. Each
 * `afterEach` restores the set of enabled features to whatever was
 * enabled before the helper was invoked, so suites do not leak state
 * into each other.
 *
 * Multiple calls within the same describe block (or across nested
 * describes) compose: each call adds its own features on top of
 * whatever previous `useFakeFeatures` calls already enabled.
 *
 * @param {String} scope -
 *   Name of the scope to enable the features in (e.g. `'frontend'`,
 *   `'editor'`).
 * @param {String[]} names -
 *   Feature names to enable in the given scope.
 *
 * @example
 * import {useFakeFeatures} from 'pageflow/testHelpers';
 * import {features} from 'pageflow/frontend';
 *
 * describe('...', () => {
 *   useFakeFeatures('frontend', ['commenting']);
 *
 *   it('...', () => {
 *     expect(features.isEnabled('commenting')).toBe(true);
 *   });
 * });
 */
function useFakeFeatures(scope, names) {
  let originalEnabledFeatureNames;
  beforeEach(() => {
    originalEnabledFeatureNames = features.enabledFeatureNames;
    features.enable(scope, names);
  });
  afterEach(() => {
    features.enabledFeatureNames = originalEnabledFeatureNames;
  });
}

/**
 * Define translations to use in tests.
 *
 * Multiple calls within the same describe block (or across nested
 * describes) compose: each call's translations are merged on top of
 * whatever previous `useFakeTranslations` calls already provided.
 *
 * @param {Object} translations -
 *   A mapping of either the form `(translation key => translated
 *   text)`.  Translation keys can contains dots.
 * @param {Object} [options]
 * @param {boolean} [options.multiLocale] -
 *   Set to `true` if keys include the locale name.
 *
 * @example
 * import {useFakeTranslations} from 'pageflow/testHelpers';
 * import I18n from 'i18n-js';
 *
 * describe('...', () => {
 *   useFakeTranslations({
 *     'some.key': 'some translation'
 *   });
 *
 *   it('...', () => {
 *     I18n.t('some.key') // => 'some translation'
 *   });
 * });
 *
 * @example
 * import {useFakeTranslations} from 'pageflow/testHelpers';
 * import I18n from 'i18n-js';
 *
 * describe('...', () => {
 *   useFakeTranslations({
 *     'en.some.key': 'some text',
 *     'de.some.key': 'etwas Text'
 *   }, {multiLocale: true});
 *
 *   it('...', () => {
 *     I18n.locale = 'de';
 *     I18n.t('some.key') // => 'etwas Text'
 *   });
 * });
 */
function useFakeTranslations(translations, {
  multiLocale
} = {}) {
  let originalTranslations;
  beforeEach(function () {
    originalTranslations = I18n.translations;
    const base = I18n.translations ? JSON.parse(JSON.stringify(I18n.translations)) : {};
    if (multiLocale) {
      applyTranslations(base, translations);
    } else {
      base.en = base.en || {};
      applyTranslations(base.en, translations);
    }
    I18n.translations = base;
  });
  afterEach(() => {
    I18n.translations = originalTranslations;
  });
}
function applyTranslations(target, translations) {
  _(translations).each((value, key) => {
    const keys = key.split('.');
    const last = keys.pop();
    const inner = _(keys).reduce((r, k) => {
      r[k] = r[k] || {};
      return r[k];
    }, target);
    inner[last] = value;
  });
}

export { ConfigurationEditor, ConfigurationEditorTab, DropDownButton, FileInput, FileMetaDataTable, FileStageItem, FileThumbnail, Base$1 as Input, RadioButtonGroupInput, ReferenceInput, SelectInput, StaticThumbnail, Table, Tabs, ThemeItem, factories, fakeBrowserAgent, renderBackboneView, setupGlobals, useFakeFeatures, useFakeTranslations };
