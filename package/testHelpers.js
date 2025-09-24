import $ from 'jquery';
import _ from 'underscore';
import { Object as Object$1 } from 'pageflow/ui';
import Backbone from 'backbone';
import { Entry, Theme, FileTypes, FilesCollection, SubsetCollection, ImageFile, WidgetTypes, EditorApi, WidgetsCollection, VideoFile, TextTrackFile } from 'pageflow/editor';
import { browser } from 'pageflow/frontend';
import I18n from 'i18n-js';

var Base = Object$1.extend({
  initialize: function initialize($el) {
    this.$el = $el;
  }
});
Base.classMethods = function (Constructor) {
  return {
    find: function find(viewOrParentElement) {
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
    findAll: function findAll(viewOrParentElement) {
      var selector = Constructor.prototype.selector;
      var parentElement = viewOrParentElement.$el || viewOrParentElement;
      var elements = parentElement.find(selector);
      return elements.map(function () {
        return new Constructor($(this));
      }).get();
    },
    findBy: function findBy(predicate, options) {
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
    render: function render(view, options) {
      view.render();
      if (options && options.appendTo) {
        options.appendTo.append(view.$el);
      }
      return new Constructor(view.$el);
    }
  };
};
Base.extend = function /* arguments */
() {
  var result = Object$1.extend.apply(this, arguments);
  _.extend(result, Base.classMethods(result));
  return result;
};

var DropDownButton = Base.extend({
  selector: '.drop_down_button',
  menuItemNames: function menuItemNames() {
    return this.$el.find('li:not(.is_hidden)').map(function () {
      return $(this).data('name');
    }).get();
  },
  menuItemLabels: function menuItemLabels() {
    return this.$el.find('li:not(.is_hidden) a').map(function () {
      return $(this).text();
    }).get();
  },
  selectMenuItemByName: function selectMenuItemByName(name) {
    var menuItem = this.$el.find('li:not(.is_hidden)').filter(function () {
      return $(this).data('name') == name;
    });
    if (!menuItem.length) {
      throw new Error('Could not find menu item with name "' + name + '"');
    }
    menuItem.find('a').trigger('click');
  },
  selectMenuItemByLabel: function selectMenuItemByLabel(label) {
    var menuItemLink = this.$el.find('li:not(.is_hidden) a').filter(function () {
      return $(this).text() == label;
    });
    if (!menuItemLink.length) {
      throw new Error('Could not find menu item with label "' + label + '"');
    }
    menuItemLink.trigger('click');
  }
});

var FileMetaDataTable = Base.extend({
  selector: '.file_meta_data table',
  values: function values() {
    return this.$el.find('.value').map(function () {
      return $(this).text();
    }).get();
  }
});

var FileStageItem = Base.extend({
  selector: '.file_stage_item'
});

var FileThumbnail = Base.extend({
  selector: '.file_thumbnail',
  backgroundImage: function backgroundImage() {
    return this.$el.css('backgroundImage');
  }
});

var ReferenceInput = Base.extend({
  clickChooseButton: function clickChooseButton() {
    this.$el.find('.choose').trigger('click');
  }
});

var StaticThumbnail = Base.extend({
  selector: '.static_thumbnail',
  backgroundImage: function backgroundImage() {
    return this.$el.css('backgroundImage');
  }
});

var ThemeItem = Base.extend({
  selector: '.theme_item',
  hover: function hover() {
    this.$el.trigger('mouseenter');
  },
  click: function click() {
    this.$el.trigger('click');
  },
  clickUseButton: function clickUseButton() {
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

var ConfigurationEditorTab = Base.extend({
  selector: '.configuration_editor_tab',
  inputPropertyNames: function inputPropertyNames() {
    return this.$el.find('.input').map(function () {
      return $(this).data('inputPropertyName');
    }).get();
  },
  visibleInputPropertyNames: function visibleInputPropertyNames() {
    return this.$el.find('.input:not(.hidden_via_binding)').map(function () {
      return $(this).data('inputPropertyName');
    }).get();
  },
  inputLabels: function inputLabels() {
    return this.$el.find('.input').map(function () {
      return $(this).data('labelText');
    }).get();
  },
  inlineHelpTexts: function inlineHelpTexts() {
    return this.$el.find('.input').map(function () {
      return $(this).data('inlineHelpText');
    }).get();
  }
});

var Tabs = Base.extend({
  selector: '.tabs_view',
  tabNames: function tabNames() {
    return this.$el.find('[data-tab-name]').map(function () {
      return $(this).data('tabName');
    }).get();
  },
  tabLabels: function tabLabels() {
    return this.$el.find('[data-tab-name]').map(function () {
      return $(this).text();
    }).get();
  }
});

var ConfigurationEditor = Base.extend({
  selector: '.configuration_editor',
  tabNames: function tabNames() {
    return Tabs.find(this.$el).tabNames();
  },
  tabLabels: function tabLabels() {
    return Tabs.find(this.$el).tabLabels();
  },
  inputPropertyNames: function inputPropertyNames() {
    return ConfigurationEditorTab.find(this.$el).inputPropertyNames();
  },
  visibleInputPropertyNames: function visibleInputPropertyNames() {
    return ConfigurationEditorTab.find(this.$el).visibleInputPropertyNames();
  },
  inputLabels: function inputLabels() {
    return ConfigurationEditorTab.find(this.$el).inputLabels();
  },
  inlineHelpTexts: function inlineHelpTexts() {
    return ConfigurationEditorTab.find(this.$el).inlineHelpTexts();
  }
});

var Table = Base.extend({
  selector: '.table_view',
  columnNames: function columnNames() {
    return this.$el.find('th').map(function () {
      return $(this).data('columnName');
    }).get();
  }
});

var ColorInput = Base.extend({
  value: function value() {
    return this._input().val();
  },
  fillIn: function fillIn(value, clock) {
    this._input().val(value);
    this._input().trigger('keyup');
    clock.tick(500);
  },
  swatches: function swatches() {
    return this.$el.find('.minicolors-swatches span').map(function () {
      return window.getComputedStyle(this)['background-color'];
    }).get();
  },
  _input: function _input() {
    return this.$el.find('input');
  }
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var Base$1 = Base.extend({
  selector: '.input'
});
Base$1.findByPropertyName = function (propertyName, options) {
  return this.findBy(function (el) {
    return el.data('inputPropertyName') === propertyName;
  }, _objectSpread2({
    predicateName: "input property name '".concat(propertyName, "'")
  }, options));
};

var RadioButtonGroupInput = Base$1.extend({
  values: function values() {
    return this.$el.find('input').map(function () {
      return $(this).attr('value');
    }).get();
  },
  enabledValues: function enabledValues() {
    return this.$el.find('input:not([disabled])').map(function () {
      return $(this).attr('value');
    }).get();
  }
});

var SelectInput = Base$1.extend({
  value: function value() {
    return this.$el.find('select').val();
  },
  values: function values() {
    return this.$el.find('option').map(function () {
      return $(this).attr('value');
    }).get();
  },
  enabledValues: function enabledValues() {
    return this.$el.find('option:not([disabled])').map(function () {
      return $(this).attr('value');
    }).get();
  }
});

/**
 * Build editor Backbone models for tests.
 */
var factories = {
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
  entry: function entry(model, attributes) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (typeof model !== 'function') {
      return factories.entry(Entry, model, attributes);
    }
    ensureFileTypes(options);
    ensureFilesCollections(options);
    ensureWidgetsCollections(options);
    var entry = new model(_objectSpread2({
      id: 1
    }, attributes), _.extend({
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
  fileTypes: function fileTypes(fn) {
    var fileTypes = new FileTypes();
    var fileTypesSetupArray = [];
    var builder = {
      withImageFileType: function withImageFileType(options) {
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
      withVideoFileType: function withVideoFileType(options) {
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
      withAudioFileType: function withAudioFileType(options) {
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
      withTextTrackFileType: function withTextTrackFileType(options) {
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
  fileTypesWithImageFileType: function fileTypesWithImageFileType(options) {
    return this.fileTypes(function () {
      this.withImageFileType(options);
    });
  },
  imageFileType: function imageFileType(options) {
    return factories.fileTypesWithImageFileType(options).first();
  },
  fileType: function fileType(options) {
    return factories.imageFileType(options);
  },
  filesCollection: function filesCollection(options) {
    return FilesCollection.createForFileType(options.fileType, [{}, {}]);
  },
  nestedFilesCollection: function nestedFilesCollection(options) {
    return new SubsetCollection({
      parentModel: factories.file({
        file_name: options.parentFileName
      }),
      filter: function filter() {
        return true;
      },
      parent: factories.filesCollection({
        fileType: options.fileType
      })
    });
  },
  videoFileWithTextTrackFiles: function videoFileWithTextTrackFiles(options) {
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
  imageFilesFixture: function imageFilesFixture(options) {
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
  imageFile: function imageFile(attributes, options) {
    return new ImageFile(attributes, _.extend({
      fileType: this.imageFileType()
    }, options));
  },
  file: function file(attributes, options) {
    return this.imageFile(attributes, options);
  },
  widgetTypes: function widgetTypes(attributesList, beforeSetup) {
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
  editorApi: function editorApi(beforeSetup) {
    var api = new EditorApi({
      router: {
        navigate: function navigate(path, _ref) {
          var trigger = _ref.trigger;
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
function ensureWidgetsCollections(options) {
  if (!options.widgets) {
    options.widgets = new WidgetsCollection(options.widgetsAttributes, {
      widgetTypes: options.widgetTypes
    });
  }
}

var userAgents = {
  'Safari on iPhone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) ' + 'AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0' + 'Mobile/14A403 Safari/602.1',
  'Safari on macOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) ' + 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 ' + 'Safari/605.1.15',
  'Chrome on Android': 'Mozilla/5.0 (Linux; Android 10) ' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106' + 'Mobile Safari/537.36',
  'Chrome on iPhone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)' + 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75' + 'Mobile/14E5239e Safari/602.1',
  'Chrome on Windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' + '(KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
};
function fakeBrowserAgent(name) {
  if (!userAgents[name]) {
    throw new Error("Unknown browser ".concat(name, "."));
  }
  return new browser.Agent(userAgents[name]);
}

var state = window.pageflow || {};

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
var setupGlobals = function setupGlobals(mapping) {
  var globalsBackup;
  beforeEach(function () {
    if (globalsBackup) {
      throw new Error('There can only be one setupGlobals call per test.');
    }
    globalsBackup = {};
    setGlobals(mapping);
  });
  afterEach(function () {
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
    setGlobals: setGlobals
  };
};

/**
 * Define translations to use in tests.
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
function useFakeTranslations(translations) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    multiLocale = _ref.multiLocale;
  var originalTranslations;
  beforeEach(function () {
    originalTranslations = I18n.translations;
    if (multiLocale) {
      I18n.translations = keysWithDotsToNestedObjects(translations);
    } else {
      I18n.translations = {
        en: keysWithDotsToNestedObjects(translations)
      };
    }
  });
  afterEach(function () {
    I18n.translations = originalTranslations;
  });
}
function keysWithDotsToNestedObjects(translations) {
  return _(translations).reduce(function (result, value, key) {
    var keys = key.split('.');
    var last = keys.pop();
    var inner = _(keys).reduce(function (r, key) {
      r[key] = r[key] || {};
      return r[key];
    }, result);
    inner[last] = value;
    return result;
  }, {});
}

export { ColorInput, ConfigurationEditor, ConfigurationEditorTab, DropDownButton, FileMetaDataTable, FileStageItem, FileThumbnail, RadioButtonGroupInput, ReferenceInput, SelectInput, StaticThumbnail, Table, Tabs, ThemeItem, factories, fakeBrowserAgent, setupGlobals, useFakeTranslations };
