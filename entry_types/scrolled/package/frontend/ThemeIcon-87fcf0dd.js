import React, { useReducer, useMemo, useCallback, createContext as createContext$1, useContext } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect';
import slugify from 'slugify';
import I18n from 'i18n-js';

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var PREFIX = 'PAGEFLOW_SCROLLED_COLLECTION';
var RESET = "".concat(PREFIX, "_RESET");
var ADD = "".concat(PREFIX, "_ADD");
var CHANGE = "".concat(PREFIX, "_CHANGE");
var PATCH_CONFIGURATION = "".concat(PREFIX, "_PATCH_CONFIGURATION");
var REMOVE = "".concat(PREFIX, "_REMOVE");
var SORT = "".concat(PREFIX, "_SORT");
function useCollections() {
  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    keyAttribute = _ref.keyAttribute;
  return useReducer(reducer, Object.keys(seed).reduce(function (result, key) {
    result[key] = init(seed[key], keyAttribute);
    return result;
  }, {}));
}
function reducer(state, action) {
  var collectionName = action.payload.collectionName;
  var keyAttribute = action.payload.keyAttribute;
  switch (action.type) {
    case RESET:
      return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, collectionName, init(action.payload.items, keyAttribute)));
    case ADD:
      return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, collectionName, {
        order: action.payload.order,
        items: _objectSpread2(_objectSpread2({}, state[collectionName].items), {}, _defineProperty({}, action.payload.attributes[keyAttribute], action.payload.attributes))
      }));
    case CHANGE:
      return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, collectionName, {
        order: state[collectionName].order,
        items: _objectSpread2(_objectSpread2({}, state[collectionName].items), {}, _defineProperty({}, action.payload.attributes[keyAttribute], action.payload.attributes))
      }));
    case PATCH_CONFIGURATION:
      var key = action.payload.key;
      return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, collectionName, {
        order: state[collectionName].order,
        items: _objectSpread2(_objectSpread2({}, state[collectionName].items), {}, _defineProperty({}, key, _objectSpread2(_objectSpread2({}, state[collectionName].items[key]), {}, {
          configuration: _objectSpread2(_objectSpread2({}, state[collectionName].items[key].configuration), action.payload.configuration)
        })))
      }));
    case REMOVE:
      var clonedItems = _objectSpread2({}, state[collectionName].items);
      delete clonedItems[action.payload.key];
      return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, collectionName, {
        order: action.payload.order,
        items: clonedItems
      }));
    case SORT:
      return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, collectionName, {
        order: action.payload.order,
        items: state[collectionName].items
      }));
    default:
      return state;
  }
}
function init(items) {
  var keyAttribute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
  items = items.filter(function (item) {
    return item[keyAttribute];
  });
  return {
    order: items.map(function (item) {
      return item[keyAttribute];
    }),
    items: items.reduce(function (result, item) {
      result[item[keyAttribute]] = item;
      return result;
    }, {})
  };
}
function updateConfiguration(_ref2) {
  var dispatch = _ref2.dispatch,
    name = _ref2.name,
    key = _ref2.key,
    configuration = _ref2.configuration;
  dispatch({
    type: PATCH_CONFIGURATION,
    payload: {
      collectionName: name,
      key: key,
      configuration: configuration
    }
  });
}
function getItem(state, collectionName, key) {
  if (state[collectionName]) {
    return state[collectionName].items[key];
  }
}
function createMultipleItemsSelector(collectionNames, filter) {
  return createSelector.apply(void 0, _toConsumableArray(collectionNames.map(function (collectionName) {
    return function (collections) {
      return collections[collectionName];
    };
  })).concat([function () {
    for (var _len = arguments.length, collections = new Array(_len), _key = 0; _key < _len; _key++) {
      collections[_key] = arguments[_key];
    }
    return collectionNames.reduce(function (result, collectionName, index) {
      result[collectionName] = toOrderedItems(collections[index]);
      return result;
    }, {});
  }]));
}
function createItemsSelector(collectionName, filter) {
  if (filter) {
    var itemsSelector = createItemsSelector(collectionName);
    return createShallowEqualArraysSelector(function (collections) {
      return itemsSelector(collections).filter(filter);
    }, function (items) {
      return items;
    });
  }
  return createSelector(function (collections) {
    return collections[collectionName];
  }, toOrderedItems);
}
function toOrderedItems(collection) {
  if (collection) {
    var items = collection.items;
    return collection.order.map(function (key) {
      return items[key];
    });
  } else {
    return [];
  }
}
var createShallowEqualArraysSelector = createSelectorCreator(defaultMemoize, shallowEqualArrays);
function shallowEqualArrays(a, b) {
  return a.length === b.length && a.every(function (item, index) {
    return item === b[index];
  });
}

var Context = createContext();
function EntryStateProvider(_ref) {
  var seed = _ref.seed,
    children = _ref.children;
  var _useCollections = useCollections(seed.collections, {
      keyAttribute: 'permaId'
    }),
    _useCollections2 = _slicedToArray(_useCollections, 2),
    collections = _useCollections2[0],
    dispatch = _useCollections2[1];
  var value = useMemo(function () {
    return {
      entryState: {
        collections: collections,
        config: seed.config
      },
      dispatch: dispatch
    };
  }, [collections, dispatch, seed]);
  return /*#__PURE__*/React.createElement(Context.Provider, {
    value: value
  }, children);
}
function useEntryState() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (entryState) {
    return entryState;
  };
  return useContextSelector(Context, function (value) {
    return selector(value.entryState);
  });
}
function useEntryStateDispatch() {
  return useContextSelector(Context, function (value) {
    return value.dispatch;
  });
}
function useEntryStateConfig() {
  return useEntryState(function (entryState) {
    return entryState.config;
  });
}
function useEntryStateCollectionItem(collectionName, key) {
  return useEntryState(function (entryState) {
    return getItem(entryState.collections, collectionName, key);
  });
}
function useEntryStateCollectionItems(collectionName, filter) {
  var itemsSelector = useMemo(function () {
    return createItemsSelector(collectionName, filter);
  }, [collectionName, filter]);
  return useEntryState(function (entryState) {
    return itemsSelector(entryState.collections);
  });
}
function useMultipleEntryStateCollectionItems(collectionNames) {
  var multipleItemsSelector = useMemo(function () {
    return createMultipleItemsSelector(collectionNames);
  }, [collectionNames]);
  return useEntryState(function (entryState) {
    return multipleItemsSelector(entryState.collections);
  });
}

/**
 * Returns data generated by a Ruby lambda registered server
 * side via `config.additional_frontend_seed_data.register`.
 *
 * @example
 *
 * const data = useAdditionalSeedData('someSeed');
 */
function useAdditionalSeedData(name) {
  var config = useEntryStateConfig();
  if (!config.additionalSeedData[name]) {
    throw new Error("Could not find additional seed data with name '".concat(name, "'."));
  }
  return config.additionalSeedData[name];
}

function useContentElementConsentVendor(_ref) {
  var contentElementId = _ref.contentElementId;
  var config = useEntryStateConfig();
  var vendorName = config.contentElementConsentVendors[contentElementId];
  return config.consentVendors.find(function (vendor) {
    return vendor.name === vendorName;
  });
}

function useCutOff() {
  var config = useEntryStateConfig();
  return config.cutOff;
}

/**
 * Returns an object containing theme asset paths.
 *
 * @example
 *
 * const theme = useTheme();
 * theme // =>
 *   {
 *     assets: {
 *       logoDesktop: 'path/to/logoDesktop.svg',
 *       logoMobile: 'path/to/logoMobile.svg'
 *     },
 *     options: {
 *       // options passed to `themes.register` in `pageflow.rb` initializer
 *       // with camleized keys.
 *     }
 *   }
 */
function useTheme() {
  var config = useEntryStateConfig();
  return config.theme;
}

/**
 * Returns a nested data structure representing the metadata of the entry.
 *
 * @example
 *
 * const metaData = useEntryMetadata();
 * metaData // =>
 *   {
 *     id: 5,
 *     locale: 'en',
 *     shareProviders: {email: false, facebook: true},
 *     share_url: 'http://test.host/test',
 *     credits: 'Credits: Pageflow',
 *     configuration: {darkWidgets: true}
 *   }
 */
function useEntryMetadata() {
  var entries = useEntryStateCollectionItems('entries');
  return useMemo(function () {
    return entries[0];
  }, [entries]);
}

/**
 * Returns boolean indicating whether dark variant has been activated for
 * the widgets of the entry.
 */
function useDarkWidgets() {
  var theme = useTheme();
  return useEntryMetadata().configuration.darkWidgets || theme.options.darkWidgets;
}

/**
 * Returns a list of attributes (iconName, name and url) of all configured share
 * providers of the entry. The url provides a %<url>s placeholder where the link
 * can be inserted. iconName can be passed to ThemeIcon to render a theme
 * specific icon.
 *
 * @example
 *
 * const shareProviders = useShareProviders(options);
 * shareProviders // =>
 *   [
 *     {
 *       iconName: 'facebook',
 *       name: 'Facebook',
 *       url: http://www.facebook.com/sharer/sharer.php?u=%<url>s
 *     },
 *     {
 *       iconName: 'twitter',
 *       name: 'Twitter',
 *       url: https://x.com/intent/post?url=%<url>s
 *     }
 *   ]
 */
function useShareProviders(_ref) {
  var isPhonePlatform = _ref.isPhonePlatform;
  var config = useEntryStateConfig();
  var entryMetadata = useEntryMetadata();
  var shareProviders = (entryMetadata === null || entryMetadata === void 0 ? void 0 : entryMetadata.shareProviders) || {};
  var urlTemplates = config.shareUrlTemplates;
  return useMemo(function () {
    var sharing = {
      bluesky: {
        iconName: 'bluesky',
        name: 'Bluesky',
        url: urlTemplates.bluesky
      },
      email: {
        iconName: 'email',
        name: 'Mail',
        url: urlTemplates.email
      },
      facebook: {
        iconName: 'facebook',
        name: 'Facebook',
        url: urlTemplates.facebook
      },
      linked_in: {
        iconName: 'linkedIn',
        name: 'LinkedIn',
        url: urlTemplates.linked_in
      },
      telegram: {
        iconName: 'telegram',
        name: 'Telegram',
        url: urlTemplates.telegram
      },
      threads: {
        iconName: 'threads',
        name: 'threads',
        url: urlTemplates.threads
      },
      twitter: {
        iconName: 'twitter',
        name: 'X',
        url: urlTemplates.twitter
      },
      whats_app: {
        iconName: 'whatsApp',
        name: 'WhatsApp',
        url: urlTemplates.whats_app
      }
    };
    return activeShareProviders(shareProviders, isPhonePlatform).map(function (provider) {
      var config = sharing[provider];
      return {
        name: config.name,
        iconName: config.iconName,
        url: config.url
      };
    });
  }, [shareProviders, isPhonePlatform, urlTemplates]);
}
function activeShareProviders(shareProvidersConfig, isPhonePlatform) {
  var providers = filterShareProviders(shareProvidersConfig, isPhonePlatform);
  return providers.filter(function (provider) {
    return shareProvidersConfig[provider] !== false;
  });
}
function filterShareProviders(shareProvidersConfig, isPhonePlatform) {
  if (!isPhonePlatform) {
    return Object.keys(shareProvidersConfig).filter(function (provider) {
      return provider !== 'telegram' && provider !== 'whats_app';
    });
  }
  return Object.keys(shareProvidersConfig);
}

/**
 * Returns the share url of the entry.
 *
 * @example
 *
 * const shareUrl = useShareUrl();
 * shareUrl // => "http://test.host/test"
 */
function useShareUrl() {
  var entryMetadata = useEntryMetadata();
  var config = useEntryStateConfig();
  if (entryMetadata) {
    return entryMetadata.shareUrl ? entryMetadata.shareUrl : config.prettyUrl;
  } else {
    return config.shareUrl;
  }
}

function useEntryTranslations() {
  var config = useEntryStateConfig();
  return config.entryTranslations;
}

/**
 * Returns a nested data structure representing the chapters and sections
 * of the entry.
 *
 * @private
 *
 * @example
 *
 * const structure = useEntryStructure();
 * structure // =>
 *   [
 *     {
 *       permaId: 5,
 *       title: 'Chapter 1',
 *       summary: 'An introductory chapter',
 *       sections: [
 *         {
 *           id: 1,
 *           permaId: 101,
 *           chapterId: 3,
 *           sectionIndex: 0,
 *           transition: 'scroll',
 *
 *           // references to parent chapter
 *           chapter: { ... },
 *
 *           // references to adjacent section objects
 *           previousSection: { ... },
 *           nextSection: { ... },
 *         }
 *       ],
 *     }
 *   ]
 */
function useEntryStructure() {
  var mainStoryline = useMainStoryline();
  var chapters = useChapters();
  var sections = useEntryStateCollectionItems('sections');
  return useMemo(function () {
    var enrichedSections = sections.map(function (section) {
      return sectionData(section);
    });
    var main = [];
    var excursions = [];
    chapters.forEach(function (chapter) {
      var chapterSections = enrichedSections.filter(function (item) {
        return item.chapterId === chapter.id;
      });
      chapterSections.forEach(function (section) {
        return section.chapter = chapter;
      });
      chapter = _objectSpread2(_objectSpread2({}, chapter), {}, {
        sections: chapterSections
      });
      if (chapter.storylineId === mainStoryline.id) {
        main.push(chapter);
      } else {
        excursions.push(chapter);
      }
    });
    linkAndIndexSections(main.flatMap(function (chapter) {
      return chapter.sections;
    }));
    excursions.forEach(function (excursion) {
      return linkAndIndexSections(excursion.sections);
    });
    return {
      main: main,
      excursions: excursions
    };
  }, [mainStoryline, chapters, sections]);
}
function linkAndIndexSections(sections) {
  sections.forEach(function (section, index) {
    section.sectionIndex = index;
    section.previousSection = sections[index - 1];
    section.nextSection = sections[index + 1];
  });
}

/**
 * Returns an array of sections each with a chapter property containing
 * data about the parent chapter.
 *
 * @private
 *
 * @example
 *
 * const sections = useSectionsWithChapter();
 * sections // =>
 *   [
 *     {
 *       id: 1,
 *       permaId: 101,
 *       chapterId: 3,
 *       transition: 'scroll',
 *       chapter: {
 *         id: 3,
 *         permaId: 5,
 *         title: 'Chapter 1',
 *         summary: 'An introductory chapter',
 *         chapterSlug: 'chapter-1'
 *       },
 *     }
 *   ]
 */
function useSectionsWithChapter() {
  var chapters = useChapters();
  var sections = useEntryStateCollectionItems('sections');
  var chaptersById = useMemo(function () {
    return chapters.reduce(function (result, chapter) {
      result[chapter.id] = chapter;
      return result;
    }, {});
  }, [chapters]);
  return useMemo(function () {
    return sections.map(function (section, sectionIndex) {
      return _objectSpread2(_objectSpread2({
        sectionIndex: sectionIndex
      }, sectionData(section)), {}, {
        chapter: chaptersById[section.chapterId]
      });
    });
  }, [chaptersById, sections]);
}

/**
 * Returns a nested data structure representing the content elements
 * of section.
 *
 * @param {Object} options
 * @param {number} options.sectionPermaId
 *
 * @private
 *
 * @example
 *
 * const section = useSection({sectionPermaId: 4});
 * section // =>
 *   {
 *     id: 100,
 *     permaId: 4,
 *     chapterId: 1,
 *     transition: 'scroll'
 *   }
 */
function useSection(_ref) {
  var sectionPermaId = _ref.sectionPermaId;
  var section = useEntryStateCollectionItem('sections', sectionPermaId);
  return sectionData(section);
}
function sectionData(section) {
  return section && _objectSpread2({
    permaId: section.permaId,
    id: section.id,
    chapterId: section.chapterId
  }, normalizeSectionConfigurationData(section.configuration));
}
function normalizeSectionConfigurationData(configuration) {
  return _objectSpread2(_objectSpread2({}, configuration), configuration.backdropType === 'contentElement' ? {
    fullHeight: true
  } : {});
}
function useSectionForegroundContentElements(_ref2) {
  var sectionId = _ref2.sectionId,
    layout = _ref2.layout,
    phoneLayout = _ref2.phoneLayout;
  var filter = useCallback(function (contentElement) {
    return contentElement.sectionId === sectionId && contentElement.configuration.position !== 'backdrop';
  }, [sectionId]);
  var contentElements = useEntryStateCollectionItems('contentElements', filter);
  return contentElements.map(function (contentElement) {
    return contentElementData(contentElement, layout, phoneLayout);
  });
}
function useContentElement(_ref3) {
  var permaId = _ref3.permaId,
    layout = _ref3.layout;
  var contentElement = useEntryStateCollectionItem('contentElements', permaId);
  return useMemo(function () {
    return contentElement && contentElementData(contentElement, layout);
  }, [contentElement, layout]);
}
function contentElementData(contentElement, layout, phoneLayout) {
  var position = getPosition(contentElement, layout, phoneLayout);
  return {
    id: contentElement.id,
    permaId: contentElement.permaId,
    sectionId: contentElement.sectionId,
    type: contentElement.typeName,
    position: position,
    width: getWidth(contentElement, position, phoneLayout),
    standAlone: contentElement.configuration.position === 'standAlone',
    alignment: contentElement.configuration.alignment,
    props: contentElement.configuration
  };
}
var supportedPositions = {
  center: ['inline', 'left', 'right'],
  centerRagged: ['inline', 'left', 'right'],
  left: ['inline', 'side', 'sticky'],
  right: ['inline', 'side', 'sticky'],
  backdrop: ['backdrop']
};
function getPosition(contentElement, layout, phoneLayout) {
  var position = contentElement.configuration.position;
  if (contentElement.configuration.fullWidthInPhoneLayout && phoneLayout) {
    return 'inline';
  }
  return supportedPositions[layout || 'left'].includes(position) ? position : 'inline';
}
var legacyPositionWidths = {
  wide: 2,
  full: 3
};
var clampedWidthPositions = ['sticky', 'left', 'right'];
function getWidth(contentElement, position, phoneLayout) {
  var width = typeof contentElement.configuration.width === 'number' ? contentElement.configuration.width : legacyPositionWidths[contentElement.configuration.position] || 0;
  if (contentElement.configuration.fullWidthInPhoneLayout && phoneLayout) {
    return 3;
  } else if (clampedWidthPositions.includes(position)) {
    return Math.min(Math.max(width || 0, -2), 2);
  } else {
    return width;
  }
}
function useChapter(_ref4) {
  var permaId = _ref4.permaId;
  var chapters = useChapters();
  return useMemo(function () {
    return chapters.find(function (chapter) {
      return chapter.permaId === permaId;
    });
  }, [chapters, permaId]);
}
function useChapters() {
  var chapters = useEntryStateCollectionItems('chapters');
  return useMemo(function () {
    var chapterSlugs = {};
    return chapters.map(function (chapter, index) {
      var chapterSlug = chapter.configuration.title;
      if (chapterSlug) {
        chapterSlug = slugify(chapterSlug, {
          lower: true,
          locale: 'de',
          strict: true
        });
        if (chapterSlugs[chapterSlug]) {
          chapterSlug = chapterSlug + '-' + chapter.permaId; //append permaId if chapter reference is not unique
        }
        chapterSlugs[chapterSlug] = chapter;
      } else {
        chapterSlug = 'chapter-' + chapter.permaId;
      }
      return _objectSpread2({
        id: chapter.id,
        permaId: chapter.permaId,
        storylineId: chapter.storylineId,
        chapterSlug: chapterSlug,
        index: index
      }, chapter.configuration);
    });
  }, [chapters]);
}
function useMainChapters() {
  var chapters = useChapters();
  var mainStoryline = useMainStoryline();
  return useMemo(function () {
    return chapters.filter(function (chapter) {
      return chapter.storylineId === mainStoryline.id;
    });
  }, [chapters, mainStoryline]);
}
function useMainStoryline() {
  var storylines = useEntryStateCollectionItems('storylines');
  return useMemo(function () {
    return storylines.find(function (storyline) {
      return storyline.configuration.main;
    });
  }, [storylines]);
}

function extendFile(collectionName, file, config) {
  return addModelType(collectionName, expandUrls(collectionName, file, config.fileUrlTemplates), config.fileModelTypes);
}
function addModelType(collectionName, file, modelTypes) {
  if (!file) {
    return null;
  }
  if (!modelTypes[collectionName]) {
    throw new Error("Could not find model type for collection name ".concat(collectionName));
  }
  return _objectSpread2(_objectSpread2({}, file), {}, {
    modelType: modelTypes[collectionName]
  });
}
function expandUrls(collectionName, file, urlTemplates) {
  if (!file) {
    return null;
  }
  if (!urlTemplates[collectionName]) {
    throw new Error("No file url templates found for ".concat(collectionName));
  }
  var variants = file.variants ? ['original'].concat(_toConsumableArray(file.variants)) : Object.keys(urlTemplates[collectionName]);
  var urls = variants.reduce(function (result, variant) {
    var url = getFileUrl(collectionName, file, variant, urlTemplates);
    if (url) {
      result[variant] = url;
    }
    return result;
  }, {});
  return _objectSpread2({
    urls: urls
  }, file);
}
function getFileUrl(collectionName, file, quality, urlTemplates) {
  var templates = urlTemplates[collectionName];
  var template = templates[quality];
  if (template) {
    return template.replace(':id_partition', idPartition(file.id)).replace(':basename', file.basename).replace(':extension', file.extension).replace(':processed_extension', file.processedExtension).replace(':pageflow_hls_qualities', function () {
      return hlsQualities(file);
    });
  }
}
function idPartition(id) {
  return partition(pad(id, 9));
}
function partition(string, separator) {
  return string.replace(/./g, function (c, i, a) {
    return i && (a.length - i) % 3 === 0 ? '/' + c : c;
  });
}
function pad(string, size) {
  return (Array(size).fill(0).join('') + string).slice(-size);
}
function hlsQualities(file) {
  return ['low', 'medium', 'high', 'fullhd', '4k'].filter(function (quality) {
    return file.variants.includes(quality);
  }).join(',');
}

/**
 * Look up a file by its collection and perma id.
 *
 * @param {Object} options
 * @param {String} options.collectionName - Collection name of file type to look for (in camel case).
 * @param {String} options.permaId - Perma id of file look up
 *
 * @example
 * const imageFile = useFile({collectionName: 'imageFiles', permaId: 5});
 * imageFile // =>
 *   {
 *     id: 102,
 *     permaId: 5,
 *     width: 1000,
 *     height: 500,
 *     urls: {
 *       large: 'https://...'
 *     },
 *     configuration: {
 *       alt: '...'
 *     }
 *   }
 */
function useFile(_ref) {
  var collectionName = _ref.collectionName,
    permaId = _ref.permaId;
  var file = useEntryStateCollectionItem(collectionName, permaId);
  return extendFile(collectionName, file, useEntryStateConfig());
}

function useFileWithInlineRights(_ref) {
  var configuration = _ref.configuration,
    collectionName = _ref.collectionName,
    propertyName = _ref.propertyName;
  var file = useFile({
    collectionName: collectionName,
    permaId: configuration[propertyName]
  });
  var config = useEntryStateConfig();
  return file && _objectSpread2(_objectSpread2({}, file), {}, {
    license: file.configuration.license && config.fileLicenses[file.configuration.license],
    inlineRights: file.configuration.rights_display === 'inline' && !configuration[propertyName === 'id' ? 'inlineRightsHidden' : "".concat(propertyName.replace('Id', ''), "InlineRightsHidden")]
  });
}

function useDownloadableFile(options) {
  var file = useFile(options);
  return file && _objectSpread2(_objectSpread2({}, file), {}, {
    urls: _objectSpread2(_objectSpread2({}, file.urls), {}, {
      download: "".concat(file.urls.original, "?download=").concat(encodeURIComponent(file.displayName))
    })
  });
}

function useNestedFiles(_ref) {
  var collectionName = _ref.collectionName,
    parent = _ref.parent;
  var config = useEntryStateConfig();
  var files = useEntryStateCollectionItems(collectionName, function (file) {
    return parent && file.parentFileId === parent.id && file.parentFileModelType === parent.modelType;
  });
  return files.map(function (file) {
    return extendFile(collectionName, file, config);
  });
}

function getFileUrlTemplateHost(seed, collectionName, variant) {
  var hlsUrlTemplate = seed.config.fileUrlTemplates[collectionName][variant];
  return hlsUrlTemplate.split('//')[1].split('/')[0];
}

/**
 * Returns a collection of rights and source urls of all files
 * used in the entry. If none of the files has a rights attribute
 * configured, it falls back to the default file rights of the
 * entry's site, otherwise returns an empty array.
 *
 * @example
 *
 * const fileRights = useFileRights();
 * fileRights // => [{text: 'author of image 1', urls: ['https://example.com/source-url']}]
 */
function useFileRights() {
  var _config$defaultFileRi;
  var config = useEntryStateConfig();
  var fileCollectionNames = Object.keys(config.fileModelTypes);
  var files = useMultipleEntryStateCollectionItems(fileCollectionNames);
  var defaultFileRights = (_config$defaultFileRi = config.defaultFileRights) === null || _config$defaultFileRi === void 0 ? void 0 : _config$defaultFileRi.trim();
  var items = {};
  Object.keys(files).forEach(function (key) {
    return files[key].filter(function (file) {
      return file.configuration.rights_display !== 'inline';
    }).forEach(function (file) {
      var _file$rights;
      var text = ((_file$rights = file.rights) === null || _file$rights === void 0 ? void 0 : _file$rights.trim()) || defaultFileRights;
      if (text) {
        var _file$configuration$s;
        items[text] = items[text] || {
          text: text,
          urls: new Set()
        };
        if ((_file$configuration$s = file.configuration.source_url) === null || _file$configuration$s === void 0 ? void 0 : _file$configuration$s.trim()) {
          items[text].urls.add(file.configuration.source_url);
        }
      }
    });
  });
  return Object.values(items).map(function (item) {
    return _objectSpread2(_objectSpread2({}, item), {}, {
      urls: Array.from(item.urls).sort()
    });
  }).sort(function (a, b) {
    return a.text.localeCompare(b.text);
  });
}

/**
 * Returns a nested data structure representing the legal info of the entry.
 * Each legal info is separated into label and url to use in links.
 * Both label and url can be blank, depending on the configuration.
 *
 * @example
 *
 * const legalInfo = useLegalInfo();
 * legalInfo // =>
 *   {
 *     imprint: {
 *       label: '',
 *       url: ''
 *     },
 *     copyright: {
 *       label: '',
 *       url: ''
 *     },
 *     privacy: {
 *       label: '',
 *       url: ''
 *     }
 *   }
 */
function useLegalInfo() {
  var config = useEntryStateConfig();
  return config.legalInfo;
}

/**
 * Returns the credits string (rich text) of the entry.
 *
 * @example
 *
 * const credits = useCredits();
 * credits // => "Credits: <a href="http://pageflow.com">pageflow.com</a>"
 */
function useCredits() {
  var entryMetadata = useEntryMetadata();
  var credits = '';
  if (entryMetadata) {
    credits = entryMetadata.credits;
  }
  return credits;
}

var qualities = ['medium', 'fullhd', '4k'];
function useAvailableQualities(file) {
  if (!file) {
    return [];
  }
  return ['auto'].concat(_toConsumableArray(qualities.filter(function (name) {
    return file.variants.includes(name);
  })));
}

function useWidget(_ref) {
  var role = _ref.role;
  var widgets = useEntryStateCollectionItems('widgets');
  return useMemo(function () {
    return widgets.find(function (widget) {
      return widget.role === role && widget.typeName;
    });
  }, [role, widgets]);
}

function updateContentElementConfiguration(_ref) {
  var dispatch = _ref.dispatch,
    permaId = _ref.permaId,
    configuration = _ref.configuration;
  updateConfiguration({
    dispatch: dispatch,
    name: 'contentElements',
    key: permaId,
    configuration: configuration
  });
}

var LocaleContext = createContext$1('en');
function setupI18n(_ref) {
  var defaultLocale = _ref.defaultLocale,
    locale = _ref.locale,
    translations = _ref.translations;
  I18n.defaultLocale = defaultLocale;
  I18n.locale = locale;
  I18n.translations = translations;
}
function LocaleProvider(_ref2) {
  var children = _ref2.children;
  var _ref3 = useEntryMetadata() || {},
    locale = _ref3.locale;
  return /*#__PURE__*/React.createElement(LocaleContext.Provider, {
    value: locale
  }, children);
}
function useLocale() {
  return useContext(LocaleContext);
}

/**
 * Use translations in frontend elements. Uses the configured locale
 * of the current entry by default. Note that only translation keys
 * from the `pageflow_scrolled.public` scope are universally
 * available.
 *
 * to render translations for inline editing controls in the editor
 * preview, you can pass `"ui"` as `locale` option and use
 * translations from the `pageflow_scrolled.inline_editing` scope.
 *
 * @param {Object} [options]
 * @param {string} [locale="entry"] -
 *   Pass `"ui"` to use the locale of the editor interface instead.
 *
 * @example
 * const {t} = useI18n();
 * t('pageflow_scrolled.public.some.key')
 *
 * const {t} = useI18n({locale: 'ui'});
 * t('pageflow_scrolled.inline_editing.some.key')
 */
function useI18n() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    scope = _ref4.locale;
  var locale = useLocale();
  return {
    t: function t(key, options) {
      return I18n.t(key, _objectSpread2(_objectSpread2({}, options), {}, {
        locale: scope !== 'ui' && locale
      }));
    }
  };
}

var _excluded = ["styles"];
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var information = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "-65 -65 449 449"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M165 0C74.019 0 0 74.02 0 165.001 0 255.982 74.019 330 165 330s165-74.018 165-164.999S255.981 0 165 0zm0 300c-74.44 0-135-60.56-135-134.999S90.56 30 165 30s135 60.562 135 135.001C300 239.44 239.439 300 165 300z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M164.998 70c-11.026 0-19.996 8.976-19.996 20.009 0 11.023 8.97 19.991 19.996 19.991 11.026 0 19.996-8.968 19.996-19.991 0-11.033-8.97-20.009-19.996-20.009zm.002 70c-8.284 0-15 6.716-15 15v90c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-90c0-8.284-6.716-15-15-15z"
  }));
});

var _excluded$1 = ["styles"];
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
var muted = (function (_ref) {
  var _ref$styles = _ref.styles,
    styles = _ref$styles === void 0 ? {} : _ref$styles,
    props = _objectWithoutProperties(_ref, _excluded$1);
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "volume-mute",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-volume-mute"] || "fa-volume-mute") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"
  }));
});

var _excluded$2 = ["styles"];
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
var share = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$2);
  return /*#__PURE__*/React.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "5 5 84 84"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M67.5 18c-5.1 0-9.3 4.2-9.3 9.3 0 .5.1 1.1.2 1.6l-23 12.9c-1.7-1.8-4.1-3-6.8-3-5.1 0-9.3 4.1-9.3 9.3 0 5.1 4.1 9.3 9.3 9.3 2.7 0 5.2-1.2 6.9-3.1l22.8 13.4c0 .4-.1.7-.1 1.1 0 5.1 4.1 9.3 9.3 9.3 5.1 0 9.3-4.1 9.3-9.3 0-5.1-4.1-9.3-9.3-9.3-2.8 0-5.4 1.3-7.1 3.3L37.7 49.4c.1-.4.1-.9.1-1.3 0-.5 0-1-.1-1.5l23.1-13c1.7 1.8 4.1 3 6.8 3 5.1 0 9.3-4.1 9.3-9.3-.1-5.1-4.3-9.3-9.4-9.3z"
  }));
});

var _excluded$3 = ["styles"];
function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}
var unmuted = (function (_ref) {
  var _ref$styles = _ref.styles,
    styles = _ref$styles === void 0 ? {} : _ref$styles,
    props = _objectWithoutProperties(_ref, _excluded$3);
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "volume-mute",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-volume-mute"] || "fa-volume-mute") + " " + (styles["fa-w-16"] || "fa-w-16"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M232.36 64.01a24.007 24.007 0 00-1.176.002c-5.703.15-11.464 2.348-16.155 7.039L126.061 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-14.293-11.514-23.733-23.64-24.01zm149.5 31.994c-8.107-.16-16.098 3.814-20.75 11.217-7.09 11.28-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256c0-63.53-32.06-121.94-85.77-156.24a23.808 23.808 0 00-12.37-3.756zm-55.032 80.174c-8.51-.046-16.795 4.42-21.209 12.402-6.39 11.61-2.159 26.2 9.451 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88 0-31.88-17.54-61.32-45.78-76.86a23.987 23.987 0 00-11.402-2.952z"
  }));
});

var _excluded$4 = ["styles"];
function _extends$4() {
  _extends$4 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$4.apply(this, arguments);
}
var gear = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$4);
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "-3 -3 30 30"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0014 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
  }));
});

var _excluded$5 = ["styles"];
function _extends$5() {
  _extends$5 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$5.apply(this, arguments);
}
var textTracks = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$5);
  return /*#__PURE__*/React.createElement("svg", _extends$5({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "-3 -3 30 30"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"
  }));
});

var _excluded$6 = ["styles"];
function _extends$6() {
  _extends$6 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$6.apply(this, arguments);
}
var copyright = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$6);
  return /*#__PURE__*/React.createElement("svg", _extends$6({
    xmlns: "http://www.w3.org/2000/svg",
    width: "800",
    height: "800",
    viewBox: "0 0 24 24",
    fill: "none"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M14 9c-.48-.6-1.07-1-2-1-1.923 0-3 1.143-3 4s1.077 4 3 4c.93 0 1.52-.4 2-1m-2 6a9 9 0 100-18 9 9 0 000 18z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
});

var _excluded$7 = ["styles"];
function _extends$7() {
  _extends$7 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$7.apply(this, arguments);
}
var world = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$7);
  return /*#__PURE__*/React.createElement("svg", _extends$7({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "-2 -2 28 28",
    strokeWidth: "1.75",
    stroke: "currentColor"
  }, props), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
  }));
});

var _excluded$8 = ["styles"];
function _extends$8() {
  _extends$8 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$8.apply(this, arguments);
}
var close = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$8);
  return /*#__PURE__*/React.createElement("svg", _extends$8({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor"
  }, props), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18L18 6M6 6l12 12"
  }));
});

var _excluded$9 = ["styles"];
function _extends$9() {
  _extends$9 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$9.apply(this, arguments);
}
var checked = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$9);
  return /*#__PURE__*/React.createElement("svg", _extends$9({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M434.442 58.997L195.559 297.881 77.554 179.88 0 257.438l195.559 195.565L512 136.551z"
  }));
});

var _excluded$a = ["styles"];
function _extends$a() {
  _extends$a = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$a.apply(this, arguments);
}
var back = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$a);
  return /*#__PURE__*/React.createElement("svg", _extends$a({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor"
  }, props), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
  }));
});

var _excluded$b = ["styles"];
function _extends$b() {
  _extends$b = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$b.apply(this, arguments);
}
var bluesky = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$b);
  return /*#__PURE__*/React.createElement("svg", _extends$b({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2 42.1-31.6 110.3-56 110.3 21.8 0 15.5-8.9 130.5-14.1 149.2-18.2 64.8-84.4 81.4-143.3 71.3C456 322 482.2 380 425.6 438c-107.4 110.2-154.3-27.6-166.3-62.9-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8c-12 35.3-59 173.1-166.3 62.9-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1 10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"
  }));
});

var _excluded$c = ["styles"];
function _extends$c() {
  _extends$c = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$c.apply(this, arguments);
}
var email = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$c);
  return /*#__PURE__*/React.createElement("svg", _extends$c({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 612 612"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M573.75 57.375H38.25C17.136 57.375 0 74.511 0 95.625v420.75c0 21.133 17.136 38.25 38.25 38.25h535.5c21.133 0 38.25-17.117 38.25-38.25V95.625c0-21.114-17.117-38.25-38.25-38.25zM554.625 497.25H57.375V204.657l224.03 187.999c7.134 5.967 15.874 8.97 24.595 8.97 8.74 0 17.461-3.003 24.595-8.97l224.03-187.999V497.25zm0-367.487L306 338.379 57.375 129.763V114.75h497.25v15.013z"
  }));
});

var _excluded$d = ["styles"];
function _extends$d() {
  _extends$d = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$d.apply(this, arguments);
}
var facebook = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$d);
  return /*#__PURE__*/React.createElement("svg", _extends$d({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 430.113 430.114"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M158.081 83.3v59.218h-43.385v72.412h43.385v215.183h89.122V214.936h59.805s5.601-34.721 8.316-72.685H247.54V92.74c0-7.4 9.717-17.354 19.321-17.354h48.557V.001h-66.021C155.878-.004 158.081 72.48 158.081 83.3z"
  }));
});

var _excluded$e = ["styles"];
function _extends$e() {
  _extends$e = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$e.apply(this, arguments);
}
var linkedIn = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$e);
  return /*#__PURE__*/React.createElement("svg", _extends$e({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 430.117 430.117"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M430.117 261.543V420.56h-92.188V272.193c0-37.271-13.334-62.707-46.703-62.707-25.473 0-40.632 17.142-47.301 33.724-2.432 5.928-3.058 14.179-3.058 22.477V420.56h-92.219s1.242-251.285 0-277.32h92.21v39.309c-.187.294-.43.611-.606.896h.606v-.896c12.251-18.869 34.13-45.824 83.102-45.824 60.673-.001 106.157 39.636 106.157 124.818zM52.183 9.558C20.635 9.558 0 30.251 0 57.463c0 26.619 20.038 47.94 50.959 47.94h.616c32.159 0 52.159-21.317 52.159-47.94-.606-27.212-20-47.905-51.551-47.905zM5.477 420.56h92.184V143.24H5.477v277.32z"
  }));
});

var _excluded$f = ["styles"];
function _extends$f() {
  _extends$f = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$f.apply(this, arguments);
}
var telegram = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$f);
  return /*#__PURE__*/React.createElement("svg", _extends$f({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512.004 512.004"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M508.194 20.517c-4.43-4.96-11.42-6.29-17.21-3.76l-482 211a15.01 15.01 0 00-8.98 13.41 15.005 15.005 0 008.38 13.79l115.09 56.6 28.68 172.06c.93 6.53 6.06 11.78 12.74 12.73 4.8.69 9.57-1 12.87-4.4l90.86-90.86 129.66 92.62a15.02 15.02 0 0014.24 1.74 15.01 15.01 0 009.19-11.01l90-451c.89-4.47-.26-9.26-3.52-12.92zm-372.84 263.45l-84.75-41.68 334.82-146.57-250.07 188.25zm46.94 44.59l-13.95 69.75-15.05-90.3 183.97-138.49-150.88 151.39c-2.12 2.12-3.53 4.88-4.09 7.65zm9.13 107.3l15.74-78.67 36.71 26.22-52.45 52.45zm205.41 19.94l-176.73-126.23 252.47-253.31-75.74 379.54z"
  }));
});

var _excluded$g = ["styles"];
function _extends$g() {
  _extends$g = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$g.apply(this, arguments);
}
var threads = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$g);
  return /*#__PURE__*/React.createElement("svg", _extends$g({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M331.5 235.7c2.2.9 4.2 1.9 6.3 2.8 29.2 14.1 50.6 35.2 61.8 61.4 15.7 36.5 17.2 95.8-30.3 143.2-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2-32.3-41-48.9-98.1-49.5-169.6v-.5c.5-71.5 17.1-128.6 49.4-169.6 36.3-46.1 90.3-69.7 160.5-70.2h.3c70.3.5 124.9 24 162.3 69.9 18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4-29.2-35.8-73-54.2-130.5-54.6-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3 28 35.6 71.2 53.9 128.2 54.4 51.4-.4 85.4-12.6 113.7-40.9 32.3-32.2 31.7-71.8 21.4-95.9-6.1-14.2-17.1-26-31.9-34.9-3.7 26.9-11.8 48.3-24.7 64.8-17.1 21.8-41.4 33.6-72.7 35.3-23.6 1.3-46.3-4.4-63.9-16-20.8-13.8-33-34.8-34.3-59.3-2.5-48.3 35.7-83 95.2-86.4 21.1-1.2 40.9-.3 59.2 2.8-2.4-14.8-7.3-26.6-14.6-35.2-10-11.7-25.6-17.7-46.2-17.8h-.7c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6.4 99.9 39.5 103.7 107.7l-.2.2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3 25.6-1.4 54.6-11.4 59.5-73.2-13.2-2.9-27.8-4.4-43.4-4.4-4.8 0-9.6.1-14.4.4-42.9 2.4-57.2 23.2-56.2 41.8l-.1.1z"
  }));
});

var _excluded$h = ["styles"];
function _extends$h() {
  _extends$h = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$h.apply(this, arguments);
}
var twitter = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$h);
  return /*#__PURE__*/React.createElement("svg", _extends$h({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z"
  }));
});

var _excluded$i = ["styles"];
function _extends$i() {
  _extends$i = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$i.apply(this, arguments);
}
var whatsApp = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$i);
  return /*#__PURE__*/React.createElement("svg", _extends$i({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 90 90"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M90 43.841c0 24.213-19.779 43.841-44.182 43.841a44.256 44.256 0 01-21.357-5.455L0 90l7.975-23.522a43.38 43.38 0 01-6.34-22.637C1.635 19.628 21.416 0 45.818 0 70.223 0 90 19.628 90 43.841zM45.818 6.982c-20.484 0-37.146 16.535-37.146 36.859 0 8.065 2.629 15.534 7.076 21.61L11.107 79.14l14.275-4.537A37.122 37.122 0 0045.819 80.7c20.481 0 37.146-16.533 37.146-36.857S66.301 6.982 45.818 6.982zm22.311 46.956c-.273-.447-.994-.717-2.076-1.254-1.084-.537-6.41-3.138-7.4-3.495-.993-.358-1.717-.538-2.438.537-.721 1.076-2.797 3.495-3.43 4.212-.632.719-1.263.809-2.347.271-1.082-.537-4.571-1.673-8.708-5.333-3.219-2.848-5.393-6.364-6.025-7.441-.631-1.075-.066-1.656.475-2.191.488-.482 1.084-1.255 1.625-1.882.543-.628.723-1.075 1.082-1.793.363-.717.182-1.344-.09-1.883-.27-.537-2.438-5.825-3.34-7.977-.902-2.15-1.803-1.792-2.436-1.792-.631 0-1.354-.09-2.076-.09s-1.896.269-2.889 1.344c-.992 1.076-3.789 3.676-3.789 8.963 0 5.288 3.879 10.397 4.422 11.113.541.716 7.49 11.92 18.5 16.223C58.2 65.771 58.2 64.336 60.186 64.156c1.984-.179 6.406-2.599 7.312-5.107.9-2.512.9-4.663.631-5.111z"
  }));
});

var _excluded$j = ["styles"];
function _extends$j() {
  _extends$j = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$j.apply(this, arguments);
}
var arrowLeft = (function (_ref) {
  var _ref$styles = _ref.styles,
    styles = _ref$styles === void 0 ? {} : _ref$styles,
    props = _objectWithoutProperties(_ref, _excluded$j);
  return /*#__PURE__*/React.createElement("svg", _extends$j({
    xmlns: "http://www.w3.org/2000/svg",
    className: (styles["h-5"] || "h-5") + " " + (styles["w-5"] || "w-5"),
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z",
    clipRule: "evenodd"
  }));
});

var _excluded$k = ["styles"];
function _extends$k() {
  _extends$k = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$k.apply(this, arguments);
}
var arrowRight = (function (_ref) {
  var _ref$styles = _ref.styles,
    styles = _ref$styles === void 0 ? {} : _ref$styles,
    props = _objectWithoutProperties(_ref, _excluded$k);
  return /*#__PURE__*/React.createElement("svg", _extends$k({
    xmlns: "http://www.w3.org/2000/svg",
    className: (styles["h-5"] || "h-5") + " " + (styles["w-5"] || "w-5"),
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z",
    clipRule: "evenodd"
  }));
});

var _excluded$l = ["styles"];
function _extends$l() {
  _extends$l = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$l.apply(this, arguments);
}
var scrollDown = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$l);
  return /*#__PURE__*/React.createElement("svg", _extends$l({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M16.939 10.939L12 15.879l-4.939-4.94-2.122 2.122L12 20.121l7.061-7.06z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.939 3.939L12 8.879l-4.939-4.94-2.122 2.122L12 13.121l7.061-7.06z"
  }));
});

var _excluded$m = ["styles"];
function _extends$m() {
  _extends$m = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$m.apply(this, arguments);
}
var enterFullscreen = (function (_ref) {
  var _ref$styles = _ref.styles,
    styles = _ref$styles === void 0 ? {} : _ref$styles,
    props = _objectWithoutProperties(_ref, _excluded$m);
  return /*#__PURE__*/React.createElement("svg", _extends$m({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "expand",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-expand"] || "fa-expand") + " " + (styles["fa-w-14"] || "fa-w-14"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"
  }));
});

var _excluded$n = ["styles"];
function _extends$n() {
  _extends$n = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$n.apply(this, arguments);
}
var exitFullscreen = (function (_ref) {
  var _ref$styles = _ref.styles,
    styles = _ref$styles === void 0 ? {} : _ref$styles,
    props = _objectWithoutProperties(_ref, _excluded$n);
  return /*#__PURE__*/React.createElement("svg", _extends$n({
    "aria-hidden": "true",
    "data-prefix": "fas",
    "data-icon": "compress",
    className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-compress"] || "fa-compress") + " " + (styles["fa-w-14"] || "fa-w-14"),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"
  }));
});

var _excluded$o = ["styles"];
function _extends$o() {
  _extends$o = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$o.apply(this, arguments);
}
var play = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$o);
  return /*#__PURE__*/React.createElement("svg", _extends$o({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  }));
});

var _excluded$p = ["styles"];
function _extends$p() {
  _extends$p = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$p.apply(this, arguments);
}
var pause = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$p);
  return /*#__PURE__*/React.createElement("svg", _extends$p({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
  }));
});

var icons = {
  expand: arrowRight,
  information: information,
  muted: muted,
  share: share,
  unmuted: unmuted,
  gear: gear,
  textTracks: textTracks,
  copyright: copyright,
  world: world,
  close: close,
  back: back,
  checked: checked,
  bluesky: bluesky,
  email: email,
  facebook: facebook,
  linkedIn: linkedIn,
  telegram: telegram,
  threads: threads,
  twitter: twitter,
  whatsApp: whatsApp,
  arrowLeft: arrowLeft,
  arrowRight: arrowRight,
  scrollDown: scrollDown,
  enterFullscreen: enterFullscreen,
  exitFullscreen: exitFullscreen,
  play: play,
  pause: pause
};

/**
 * Render an SVG icon that can be customized in themes.
 *
 * @param {Object} props
 * @param {string} props.name -
 *   Either: arrowLeft, arrowRight, back, checked, copyright, close, email,
 *   enterFullscreen, exitFullscreen, expand, facebook, gear, information,
 *   linkedIn, menu, muted, pause, play, share, telegram,
 *   textTracks, twitter, unmuted, world, whatsApp,
 *   arrowLeft, arrowRight, scrollDown, world
 * @params {number} [props.width] - Image width.
 * @params {number} [props.height] - Image height.
 */
function ThemeIcon(_ref) {
  var name = _ref.name,
    width = _ref.width,
    height = _ref.height,
    renderFallback = _ref.renderFallback;
  var theme = useTheme();
  var FallbackIcon = icons[name];
  var themeAsset = theme.assets.icons[name];
  if (!FallbackIcon && !renderFallback) {
    throw new Error("Unknown icon '".concat(name, "'. Available options: ").concat(Object.keys(icons).join(', '), "."));
  }
  if (themeAsset) {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height
    }, /*#__PURE__*/React.createElement("use", {
      xlinkHref: "".concat(themeAsset, "#icon")
    }));
  } else if (renderFallback) {
    return renderFallback();
  } else {
    return /*#__PURE__*/React.createElement(FallbackIcon, {
      width: width,
      height: height
    });
  }
}

export { useCutOff as A, useDarkWidgets as B, useEntryTranslations as C, useFileRights as D, EntryStateProvider as E, useLegalInfo as F, useMainChapters as G, useShareProviders as H, useShareUrl as I, useLocale as J, updateContentElementConfiguration as K, LocaleProvider as L, _unsupportedIterableToArray as M, ThemeIcon as T, _slicedToArray as _, _objectSpread2 as a, _defineProperty as b, useEntryMetadata as c, useNestedFiles as d, _objectWithoutProperties as e, useWidget as f, useTheme as g, _toConsumableArray as h, useContentElement as i, useFileWithInlineRights as j, useFile as k, useSectionForegroundContentElements as l, useAdditionalSeedData as m, useSectionsWithChapter as n, useContentElementConsentVendor as o, useChapter as p, useDownloadableFile as q, useEntryStateDispatch as r, useSection as s, useEntryStructure as t, useI18n as u, getFileUrlTemplateHost as v, useAvailableQualities as w, setupI18n as x, useChapters as y, useCredits as z };
