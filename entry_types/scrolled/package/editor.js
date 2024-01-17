import { inputView, cssModulesUtils, i18nUtils, ConfigurationEditorTabView, SliderInputView, SelectInputView, SortableCollectionView, CollectionView as CollectionView$1, CheckBoxInputView, TextInputView, Object as Object$1, TextAreaInputView, SeparatorView, ConfigurationEditorView } from 'pageflow/ui';
import React, { useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Backbone$1 from 'backbone';
import ReactDOM from 'react-dom';
import { Listbox } from '@headlessui/react';
import Marionette from 'backbone.marionette';
import I18n, { t } from 'i18n-js';
import { createContext } from 'use-context-selector';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import 'slugify';
import { StandaloneSectionThumbnail, getAvailableTransitionNames, utils } from 'pageflow-scrolled/frontend';
import * as globalInterop from 'pageflow/editor';
import { editor as editor$1, Configuration, configurationContainer, delayedDestroying, entryTypeEditorControllerUrls, failureTracking, ForeignKeySubsetCollection, orderedCollection, Entry, modelLifecycleTrackingView, DropDownButtonView, CollectionView, app, EditConfigurationView, cssModulesUtils as cssModulesUtils$1, FileInputView, ColorInputView } from 'pageflow/editor';
import { features, browser } from 'pageflow/frontend';
import $ from 'jquery';
import { editor as editor$2 } from 'pageflow-scrolled/editor';
import 'jquery-ui';

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

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".TypographyVariantSelectInputView-module_preview__12fCl {\n  overflow: hidden;\n  position: relative;\n  padding: 0.25rem 0.5rem 0.5rem;\n  background-color: var(--ui-primary-color);\n  color: var(--ui-on-primary-color);\n  border: solid 1px var(--ui-on-surface-color-lightest-solid);\n  border-radius: 0.125rem;\n  margin-bottom: 0.25rem;\n  height: 6rem;\n  pointer-events: none;\n}\n\n.TypographyVariantSelectInputView-module_preview__12fCl > div {\n  width: 200%;\n}\n\n.TypographyVariantSelectInputView-module_cardsAppearance__1bjfD > div {\n  margin-top: -3rem;\n  margin-left: -3rem;\n  padding-bottom: 3rem;\n}\n";
var styles = {"preview":"TypographyVariantSelectInputView-module_preview__12fCl","cardsAppearance":"TypographyVariantSelectInputView-module_cardsAppearance__1bjfD"};
styleInject(css);

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

var css$1 = ".ListboxInputView-module_container__vNkJh {\n  position: relative;\n}\n\n.ListboxInputView-module_button__3ZTnw {\n  background-color: var(--ui-surface-color);\n  text-align: left;\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\");\n  background-position: right 0.5rem center;\n  background-repeat: no-repeat;\n  background-size: 1.5em 1.5em;\n  padding-right: 2.5rem;\n}\n\n.ListboxInputView-module_options__Yp2CJ {\n  position: absolute;\n  width: 100%;\n  box-sizing: border-box;\n  left: 0;\n  top: 100%;\n  z-index: 3;\n  padding: 1px;\n  margin-bottom: 1rem;\n  border: solid 1px var(--ui-on-surface-color-lighter);\n  border-radius: 0.125rem;\n  box-shadow: var(--ui-box-shadow);\n  background-color: var(--ui-surface-color);\n  cursor: default;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.ListboxInputView-module_options__Yp2CJ::before{\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  padding-bottom: 1rem;\n  pointer-events: none;\n}\n\n.ListboxInputView-module_options__Yp2CJ:focus {\n  outline: 0;\n}\n\n.ListboxInputView-module_option__2Umwh {\n  padding: 0.25rem;\n  overflow: hidden;\n}\n\n.ListboxInputView-module_activeOption__Mo1YN {\n  background-color: var(--ui-selection-color-light);\n}\n";
var styles$1 = {"container":"ListboxInputView-module_container__vNkJh","button":"ListboxInputView-module_button__3ZTnw","options":"ListboxInputView-module_options__Yp2CJ","option":"ListboxInputView-module_option__2Umwh","activeOption":"ListboxInputView-module_activeOption__Mo1YN"};
styleInject(css$1);

var ListboxInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: styles$1.view,
  template: function template() {
    return "\n    <label>\n      <span class=\"name\"></span>\n      <span class=\"inline_help\"></span>\n    </label>\n    <div class=\"".concat(styles$1.container, "\"></div>\n  ");
  },
  ui: cssModulesUtils.ui(styles$1, 'container'),
  modelEvents: function modelEvents() {
    return _defineProperty({}, "change:".concat(this.options.propertyName), 'renderDropdown');
  },
  initialize: function initialize() {
    var _this = this;

    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = i18nUtils.findKeyWithTranslation(this.attributeTranslationKeys('values'));
        this.options.translationKeys = this.options.values.map(function (value) {
          return translationKeyPrefix + '.' + value;
        });
      }

      this.options.texts = this.options.translationKeys.map(function (key) {
        return I18n.t(key);
      });
    }

    this.items = _toConsumableArray(this.options.values.map(function (value, i) {
      return {
        value: value,
        text: _this.options.texts[i]
      };
    }));

    if (this.options.includeBlank) {
      this.items.unshift({
        name: '',
        text: I18n.t(this.options.blankTranslationKey)
      });
    }
  },
  renderSelectedItem: function renderSelectedItem(item) {
    return item.text;
  },
  renderItem: function renderItem(item) {
    return item.text;
  },
  onRender: function onRender() {
    this.renderDropdown();
  },
  updateDisabled: function updateDisabled() {
    this.renderDropdown();
  },
  renderDropdown: function renderDropdown(value, text) {
    var _this2 = this;

    ReactDOM.render(React.createElement(Dropdown, {
      items: this.items,
      disabled: this.isDisabled(),
      renderSelectedItem: function renderSelectedItem(item) {
        return _this2.renderSelectedItem(item);
      },
      renderItem: function renderItem(item) {
        return _this2.renderItem(item);
      },
      selectedItem: this.items.find(function (item) {
        return item.value === _this2.model.get(_this2.options.propertyName);
      }) || this.items[0],
      onChange: function onChange(value) {
        _this2.model.set(_this2.options.propertyName, value);
      }
    }), this.ui.container[0]);
  }
});

function Dropdown(_ref2) {
  var items = _ref2.items,
      disabled = _ref2.disabled,
      renderItem = _ref2.renderItem,
      renderSelectedItem = _ref2.renderSelectedItem,
      selectedItem = _ref2.selectedItem,
      onChange = _ref2.onChange;
  return /*#__PURE__*/React.createElement(Listbox, {
    value: selectedItem.value,
    disabled: disabled,
    onChange: onChange
  }, /*#__PURE__*/React.createElement(Listbox.Button, {
    className: styles$1.button
  }, renderSelectedItem(selectedItem)), /*#__PURE__*/React.createElement(Listbox.Options, {
    className: styles$1.options
  }, items.map(function (item) {
    return /*#__PURE__*/React.createElement(Listbox.Option, {
      key: item.value || 'blank',
      value: item.value
    }, function (_ref3) {
      var active = _ref3.active;
      return /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$1.option, _defineProperty({}, styles$1.activeOption, active))
      }, renderItem(item));
    });
  })));
}

var PREFIX = 'PAGEFLOW_SCROLLED_COLLECTION';
var RESET = "".concat(PREFIX, "_RESET");
var ADD = "".concat(PREFIX, "_ADD");
var CHANGE = "".concat(PREFIX, "_CHANGE");
var REMOVE = "".concat(PREFIX, "_REMOVE");
var SORT = "".concat(PREFIX, "_SORT");
function watchCollection(collection, _ref3) {
  var name = _ref3.name,
      dispatch = _ref3.dispatch,
      attributes = _ref3.attributes,
      includeConfiguration = _ref3.includeConfiguration,
      _ref3$keyAttribute = _ref3.keyAttribute,
      keyAttribute = _ref3$keyAttribute === void 0 ? 'id' : _ref3$keyAttribute;
  var handle = {};
  var options = {
    attributeNames: attributes,
    includeConfiguration: includeConfiguration
  };
  var tearingDown = false;
  var watchedAttributeNames = getWatchedAttributeNames(attributes);
  var sourceKeyAttribute = findSourceAttributeName(attributes, keyAttribute);
  dispatch({
    type: RESET,
    payload: {
      collectionName: name,
      keyAttribute: keyAttribute,
      items: collection.map(function (model) {
        return getAttributes(model, options);
      })
    }
  });
  collection.on('add change:id', function (model) {
    if (!model.isNew()) {
      dispatch({
        type: ADD,
        payload: {
          collectionName: name,
          keyAttribute: keyAttribute,
          order: collection.pluck(sourceKeyAttribute).filter(Boolean),
          attributes: getAttributes(model, options)
        }
      });
    }
  }, handle);
  collection.on('change', function (model) {
    if (hasChangedAttributes(model, watchedAttributeNames) && !model.isNew()) {
      dispatch({
        type: CHANGE,
        payload: {
          collectionName: name,
          keyAttribute: keyAttribute,
          attributes: getAttributes(model, options)
        }
      });
    }
  }, handle);

  if (includeConfiguration) {
    collection.on('change:configuration', function (model, value) {
      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          ignoreInWatchCollection = _ref4.ignoreInWatchCollection;

      if (!model.isNew() && !ignoreInWatchCollection) {
        dispatch({
          type: CHANGE,
          payload: {
            collectionName: name,
            keyAttribute: keyAttribute,
            attributes: getAttributes(model, options)
          }
        });
      }
    }, handle);
  }

  collection.on('remove', function (model) {
    if (!tearingDown && !model.isNew()) {
      dispatch({
        type: REMOVE,
        payload: {
          collectionName: name,
          order: collection.pluck(sourceKeyAttribute).filter(Boolean),
          key: model.attributes[sourceKeyAttribute]
        }
      });
    }
  }, handle);
  collection.on('sort', function (model) {
    return dispatch({
      type: SORT,
      payload: {
        collectionName: name,
        order: collection.pluck(sourceKeyAttribute).filter(Boolean)
      }
    });
  }, handle);
  return function () {
    tearingDown = true;
    collection.off(null, null, handle);
  };
}

function findSourceAttributeName(attributeNames, targetAttributeName) {
  var mapping = attributeNames.find(function (attributeName) {
    return typeof attributeName === 'object' && mappedAttributeTarget(attributeName) === targetAttributeName;
  });
  return mapping ? mappedAttributeSource(mapping) : targetAttributeName;
}

function hasChangedAttributes(model, attributeNames) {
  return attributeNames.some(function (attributeName) {
    return model.hasChanged(attributeName);
  });
}

function getWatchedAttributeNames(attributeNames) {
  return attributeNames.map(function (attributeName) {
    return typeof attributeName == 'object' ? mappedAttributeSource(attributeName) : attributeName;
  });
}

function mappedAttributeSource(attributeName) {
  return attributeName[Object.keys(attributeName)[0]];
}

function mappedAttributeTarget(attributeName) {
  return Object.keys(attributeName)[0];
}

function getAttributes(model, _ref5) {
  var attributeNames = _ref5.attributeNames,
      includeConfiguration = _ref5.includeConfiguration;
  var result = attributeNames.reduce(function (result, attributeName) {
    if (typeof attributeName == 'object') {
      var key = Object.keys(attributeName)[0];
      var value = attributeName[key];

      if (typeof value == 'function') {
        result[key] = value(model.get(key));
      } else {
        result[key] = model.get(value);
      }
    } else {
      result[attributeName] = model.get(attributeName);
    }

    return result;
  }, {});

  if (includeConfiguration) {
    result.configuration = _objectSpread2({}, model.configuration.attributes);
  }
  return result;
}

var createShallowEqualArraysSelector = createSelectorCreator(defaultMemoize, shallowEqualArrays);

function shallowEqualArrays(a, b) {
  return a.length === b.length && a.every(function (item, index) {
    return item === b[index];
  });
}

var Context = createContext();

function watchCollections(entry, _ref) {
  var dispatch = _ref.dispatch;
  var chapters = entry.chapters,
      sections = entry.sections,
      contentElements = entry.contentElements,
      widgets = entry.widgets,
      files = entry.files;
  var teardownFns = [];
  teardownFns.push(watchCollection(new Backbone.Collection([entry.metadata]), {
    name: 'entries',
    attributes: ['locale', {
      permaId: function permaId() {
        return entry.id;
      }
    }, // Make sure key attribute is present
    {
      shareProviders: 'share_providers'
    }, {
      shareUrl: 'share_url'
    }, 'credits'],
    keyAttribute: 'permaId',
    dispatch: dispatch
  }));
  teardownFns.push(watchCollection(chapters, {
    name: 'chapters',
    attributes: ['id', 'permaId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch: dispatch
  }));
  teardownFns.push(watchCollection(sections, {
    name: 'sections',
    attributes: ['id', 'permaId', 'chapterId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch: dispatch
  }));
  teardownFns.push(watchCollection(contentElements, {
    name: 'contentElements',
    attributes: ['id', 'permaId', 'typeName', 'sectionId'],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch: dispatch
  }));
  teardownFns.push(watchCollection(widgets, {
    name: 'widgets',
    attributes: [{
      typeName: 'type_name'
    }, 'role', {
      permaId: 'role'
    }],
    keyAttribute: 'permaId',
    includeConfiguration: true,
    dispatch: dispatch
  }));
  Object.keys(files).forEach(function (collectionName) {
    teardownFns.push(watchCollection(files[collectionName], {
      name: camelize(collectionName),
      attributes: ['id', {
        permaId: 'perma_id'
      }, 'width', 'height', 'basename', 'extension', 'rights', {
        processedExtension: 'processed_extension'
      }, {
        isReady: 'is_ready'
      }, {
        variants: function variants(_variants) {
          return _variants && _variants.map(function (variant) {
            return camelize(variant);
          });
        }
      }, {
        durationInMs: 'duration_in_ms'
      }, {
        parentFileId: 'parent_file_id'
      }, {
        parentFileModelType: 'parent_file_model_type'
      }],
      keyAttribute: 'permaId',
      includeConfiguration: true,
      dispatch: dispatch
    }));
  });
  return function () {
    teardownFns.forEach(function (fn) {
      return fn();
    });
  };
}

function camelize(snakeCase) {
  return snakeCase.replace(/_[a-z]/g, function (match) {
    return match[1].toUpperCase();
  });
}

var TypographyVariantSelectInputView = ListboxInputView.extend({
  renderItem: function renderItem(item) {
    return /*#__PURE__*/React.createElement(Preview, {
      entry: this.options.entry,
      contentElement: this.options.contentElement,
      item: item,
      getPreviewConfiguration: this.options.getPreviewConfiguration
    });
  }
});

function Preview(_ref) {
  var entry = _ref.entry,
      contentElement = _ref.contentElement,
      item = _ref.item,
      getPreviewConfiguration = _ref.getPreviewConfiguration;
  var subscribe = useCallback(function (dispatch) {
    watchCollections(buildEntry(entry, contentElement, item, getPreviewConfiguration), {
      dispatch: dispatch
    });
  }, [entry, contentElement, item, getPreviewConfiguration]);
  var appearance = contentElement.section.configuration.get('appearance');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.preview, styles["".concat(appearance, "Appearance")]),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(StandaloneSectionThumbnail, {
    scale: false,
    seed: entry.scrolledSeed,
    sectionPermaId: 1,
    subscribe: subscribe
  })), item.text);
}

function buildEntry(entry, contentElement, item, getPreviewConfiguration) {
  var section = contentElement.section;
  var fakeContentElement = new Backbone$1.Model(contentElement.attributes);
  fakeContentElement.configuration = new Backbone$1.Model(getPreviewConfiguration(contentElement.configuration.attributes, item.value));
  var fakeSection = new Backbone$1.Model(_objectSpread2(_objectSpread2({}, section.attributes), {}, {
    permaId: 1
  }));
  fakeSection.configuration = new Backbone$1.Model(_objectSpread2(_objectSpread2({}, section.configuration.attributes), {}, {
    transition: 'preview',
    fullHeight: false,
    layout: 'left',
    exposeMotifArea: false,
    backdrop: _objectSpread2(_objectSpread2({}, section.configuration.attributes.backdrop), {}, {
      imageMotifArea: null,
      imageMobileMotifArea: null,
      videoMotifArea: null
    })
  }));
  return {
    id: entry.id,
    metadata: entry.metadata,
    widgets: entry.widgets,
    files: entry.files,
    chapters: new Backbone$1.Collection([section.chapter]),
    sections: new Backbone$1.Collection([fakeSection]),
    contentElements: new Backbone$1.Collection([fakeContentElement])
  };
}

var css$2 = ".ColorSelectInputView-module_item__1qpQU {\n  display: flex;\n  align-items: center;\n}\n\n.ColorSelectInputView-module_swatch__36Kqr {\n  background-color: var(--color);\n  width: 1rem;\n  height: 1rem;\n  border: solid 1px var(--ui-on-surface-color-lighter);\n  border-radius: 0.125rem;\n  margin-right: 0.5rem;\n}\n\n.ColorSelectInputView-module_blank__16xMd .ColorSelectInputView-module_swatch__36Kqr {\n  display: none;\n}\n";
var styles$2 = {"item":"ColorSelectInputView-module_item__1qpQU","swatch":"ColorSelectInputView-module_swatch__36Kqr","blank":"ColorSelectInputView-module_blank__16xMd"};
styleInject(css$2);

var ColorSelectInputView = ListboxInputView.extend({
  renderItem: renderItem,
  renderSelectedItem: renderItem
});

function renderItem(item) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$2.item, _defineProperty({}, styles$2.blank, !item.value))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.swatch,
    style: {
      '--color': "var(--theme-palette-color-".concat(item.value, ")")
    }
  }), item.text);
}

var css$3 = ".PositionSelectInputView-module_preview__3MWNM {\n  aspect-ratio: 16 / 9;\n  border: solid 1px var(--ui-on-surface-color-lightest);\n  border-radius: 0.125rem;\n  margin-bottom: 0.25rem;\n  background-color: var(--ui-primary-color);\n  color: var(--ui-on-primary-color-light);\n  padding: 1rem 2rem;\n  overflow: hidden;\n  position: relative;\n  max-width: 260px;\n  box-sizing: border-box;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.PositionSelectInputView-module_content__kFX__ {\n  width: 45%;\n}\n\n.PositionSelectInputView-module_centerLayout__3Pb2n .PositionSelectInputView-module_content__kFX__,\n.PositionSelectInputView-module_centerLayout__3Pb2n .PositionSelectInputView-module_block__1LmpL,\n.PositionSelectInputView-module_centerRaggedLayout__3CHo3 .PositionSelectInputView-module_content__kFX__,\n.PositionSelectInputView-module_centerRaggedLayout__3CHo3 .PositionSelectInputView-module_block__1LmpL {\n  width: 60%;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.PositionSelectInputView-module_rightLayout__2IEOe .PositionSelectInputView-module_content__kFX__,\n.PositionSelectInputView-module_rightLayout__2IEOe .PositionSelectInputView-module_block__1LmpL {\n  margin-left: auto;\n}\n\n.PositionSelectInputView-module_textBlock__1myje {\n  display: block;\n  width: 100%;\n  margin-bottom: 0.75rem;\n  line-height: 0.75rem;\n}\n\n.PositionSelectInputView-module_centerRaggedLayout__3CHo3 .PositionSelectInputView-module_textBlock__1myje {\n  text-align: center;\n}\n\n.PositionSelectInputView-module_textBlockWord__ls-2O {\n  display: inline-block;\n  border: solid 1px currentColor;\n  width: 0.5rem;\n}\n\n.PositionSelectInputView-module_textBlockWord__ls-2O:nth-child(5n) {\n  width: 0.75rem;\n}\n\n.PositionSelectInputView-module_textBlockWord__ls-2O:nth-child(2n) {\n  width: 0.625rem;\n}\n\n.PositionSelectInputView-module_block__1LmpL {\n  width: 60%;\n  aspect-ratio: 4 / 3;\n  background-color: var(--ui-selection-color);\n  border-radius: 0.25rem;\n  margin-bottom: 0.5rem;\n}\n\n.PositionSelectInputView-module_leftPosition__3D2gR .PositionSelectInputView-module_block__1LmpL,\n.PositionSelectInputView-module_rightPosition__U2qvu .PositionSelectInputView-module_block__1LmpL {\n  width: 40%;\n  margin: 0.5rem 0 0;\n}\n\n.PositionSelectInputView-module_leftPosition__3D2gR .PositionSelectInputView-module_block__1LmpL {\n  float: left;\n  margin-left: -5%;\n  margin-right: 0.75rem;\n}\n\n.PositionSelectInputView-module_rightPosition__U2qvu .PositionSelectInputView-module_block__1LmpL {\n  float: right;\n  margin-right: -5%;\n  margin-left: 0.75rem;\n}\n\n.PositionSelectInputView-module_stickyPosition__13uqb .PositionSelectInputView-module_block__1LmpL {\n  width: 100%;\n}\n\n.PositionSelectInputView-module_stickyPosition__13uqb .PositionSelectInputView-module_wrapper__LJFpa {\n  float: right;\n  width: 40%;\n  position: sticky;\n  top: 30%;\n}\n\n.PositionSelectInputView-module_rightLayout__2IEOe.PositionSelectInputView-module_stickyPosition__13uqb .PositionSelectInputView-module_wrapper__LJFpa {\n  float: left;\n}\n\n.PositionSelectInputView-module_standAlonePosition__230HM .PositionSelectInputView-module_wrapper__LJFpa {\n  height: 170px;\n}\n\n.PositionSelectInputView-module_standAlonePosition__230HM .PositionSelectInputView-module_block__1LmpL {\n  position: sticky;\n  top: 10%;\n}\n\n.PositionSelectInputView-module_outer__uPbtA {\n  position: relative;\n}\n\n.PositionSelectInputView-module_outer__uPbtA .PositionSelectInputView-module_inlineHelp__13pS6 {\n  right: 0;\n  top: 0;\n  box-sizing: border-box;\n}\n\n.PositionSelectInputView-module_outer__uPbtA .PositionSelectInputView-module_inlineHelp__13pS6:hover {\n  padding: 7px 30px 7px 5px;\n}\n\n.PositionSelectInputView-module_outer__uPbtA .PositionSelectInputView-module_inlineHelp__13pS6::before {\n  color: var(--ui-on-primary-color);\n}\n\n.PositionSelectInputView-module_outer__uPbtA .PositionSelectInputView-module_inlineHelp__13pS6:hover::before {\n  color: var(--ui-primary-color-lighter);\n}\n";
var styles$3 = {"preview":"PositionSelectInputView-module_preview__3MWNM","content":"PositionSelectInputView-module_content__kFX__","centerLayout":"PositionSelectInputView-module_centerLayout__3Pb2n","block":"PositionSelectInputView-module_block__1LmpL","centerRaggedLayout":"PositionSelectInputView-module_centerRaggedLayout__3CHo3","rightLayout":"PositionSelectInputView-module_rightLayout__2IEOe","textBlock":"PositionSelectInputView-module_textBlock__1myje","textBlockWord":"PositionSelectInputView-module_textBlockWord__ls-2O","leftPosition":"PositionSelectInputView-module_leftPosition__3D2gR","rightPosition":"PositionSelectInputView-module_rightPosition__U2qvu","stickyPosition":"PositionSelectInputView-module_stickyPosition__13uqb","wrapper":"PositionSelectInputView-module_wrapper__LJFpa","standAlonePosition":"PositionSelectInputView-module_standAlonePosition__230HM","outer":"PositionSelectInputView-module_outer__uPbtA","inlineHelp":"PositionSelectInputView-module_inlineHelp__13pS6"};
styleInject(css$3);

var PositionSelectInputView = ListboxInputView.extend({
  renderItem: function renderItem(item) {
    return /*#__PURE__*/React.createElement(Preview$1, {
      item: item,
      layout: this.options.sectionLayout,
      inlineHelpTranslationKeyPrefix: i18nUtils.findKeyWithTranslation(this.attributeTranslationKeys('item_inline_help_texts'))
    });
  }
});
var duration = 3000;

function Preview$1(_ref) {
  var item = _ref.item,
      layout = _ref.layout,
      inlineHelpTranslationKeyPrefix = _ref.inlineHelpTranslationKeyPrefix;
  var ref = useRef();
  var dist = item.value === 'sticky' || item.value === 'standAlone' ? 200 : 100;
  useEffect(function () {
    var startTime = new Date().getTime();
    var interval = setInterval(function () {
      var currentTime = new Date().getTime();
      var t = (currentTime - startTime) % (2 * duration);

      if (t > duration) {
        t = duration - (t - duration);
      }

      ref.current.scrollTop = dist * easeInOut(t / duration);
    }, 10);
    return function () {
      return clearInterval(interval);
    };
  }, [dist]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$3.outer
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$3.preview, styles$3["".concat(item.value, "Position")], styles$3["".concat(layout, "Layout")]),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.section
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.content
  }, /*#__PURE__*/React.createElement(TextBlock, {
    words: 40
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$3.group
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.block
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$3.content
  }, /*#__PURE__*/React.createElement(TextBlock, {
    words: 30
  }), /*#__PURE__*/React.createElement(TextBlock, {
    words: 40
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles$3.content
  }, /*#__PURE__*/React.createElement(TextBlock, {
    words: 70
  })))), /*#__PURE__*/React.createElement("span", {
    className: classNames('inline_help', styles$3.inlineHelp)
  }, I18n.t(item.value, {
    scope: inlineHelpTranslationKeyPrefix
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$3.description
  }, item.text));
}

function TextBlock(_ref2) {
  var words = _ref2.words;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$3.textBlock
  }, Array(words).fill().map(function (i, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: styles$3.textBlockWord
    });
  }));
}

function easeInOut(t) {
  t = t * 2;
  if (t < 1) return Math.pow(t, 2) / 2;
  t = t - 1;
  return t - Math.pow(t, 2) / 2 + 1 / 2;
}

ConfigurationEditorTabView.groups.define('ContentElementPosition', function () {
  var contentElement = this.model.parent;

  if (contentElement.getAvailablePositions().length > 1) {
    this.input('position', PositionSelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      values: contentElement.getAvailablePositions(),
      sectionLayout: this.model.parent.section.configuration.get('layout')
    });
  }

  this.input('width', SliderInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    displayText: function displayText(value) {
      return ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'][value + 3];
    },
    saveOnSlide: true,
    minValueBinding: 'position',
    maxValueBinding: 'position',
    minValue: function minValue() {
      return contentElement.getAvailableMinWidth();
    },
    maxValue: function maxValue() {
      return contentElement.getAvailableMaxWidth();
    },
    visible: function visible() {
      return contentElement.getAvailableMinWidth() !== contentElement.getAvailableMaxWidth();
    },
    defaultValue: this.model.get('position') === 'wide' ? 2 : this.model.get('position') === 'full' ? 3 : 0
  });
});
ConfigurationEditorTabView.groups.define('ContentElementTypographyVariant', function (_ref) {
  var entry = _ref.entry,
      model = _ref.model,
      prefix = _ref.prefix,
      getPreviewConfiguration = _ref.getPreviewConfiguration;
  var contentElement = this.model.parent;

  if (entry.getTypographyVariants({
    contentElement: contentElement
  })[0].length) {
    var _entry$getTypographyV = entry.getTypographyVariants({
      contentElement: contentElement,
      prefix: prefix
    }),
        _entry$getTypographyV2 = _slicedToArray(_entry$getTypographyV, 2),
        variants = _entry$getTypographyV2[0],
        texts = _entry$getTypographyV2[1];

    this.input('typographyVariant', TypographyVariantSelectInputView, {
      entry: entry,
      model: model || this.model,
      contentElement: contentElement,
      prefix: prefix,
      getPreviewConfiguration: getPreviewConfiguration,
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'typographyVariant.blank',
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      disabled: !variants.length,
      values: variants,
      texts: texts
    });
  }
});
ConfigurationEditorTabView.groups.define('ContentElementVariant', function (_ref2) {
  var entry = _ref2.entry;

  var _entry$getContentElem = entry.getContentElementVariants({
    contentElement: this.model.parent
  }),
      _entry$getContentElem2 = _slicedToArray(_entry$getContentElem, 2),
      variants = _entry$getContentElem2[0],
      texts = _entry$getContentElem2[1];

  if (variants.length) {
    this.input('variant', SelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'variant.blank',
      values: variants,
      texts: texts
    });
  }
});
ConfigurationEditorTabView.groups.define('PaletteColor', function (_ref3) {
  var propertyName = _ref3.propertyName,
      entry = _ref3.entry,
      model = _ref3.model;

  var _entry$getPaletteColo = entry.getPaletteColors(),
      _entry$getPaletteColo2 = _slicedToArray(_entry$getPaletteColo, 2),
      values = _entry$getPaletteColo2[0],
      texts = _entry$getPaletteColo2[1];

  if (values.length) {
    this.input(propertyName, ColorSelectInputView, {
      model: model || this.model,
      includeBlank: true,
      blankTranslationKey: 'pageflow_scrolled.editor.' + 'common_content_element_attributes.' + 'palette_color.blank',
      values: values,
      texts: texts
    });
  }
});

editor$1.widgetTypes.registerRole('header', {
  isOptional: false
});
editor$1.widgetTypes.registerRole('footer', {
  isOptional: true
});
editor$1.widgetTypes.registerRole('inlineFileRights', {
  isOptional: false
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * Integrate new content types into the editor.
 * @name editor_contentElementTypes
 */

var ContentElementTypeRegistry = /*#__PURE__*/function () {
  function ContentElementTypeRegistry(_ref) {
    var features = _ref.features;

    _classCallCheck(this, ContentElementTypeRegistry);

    this.features = features;
    this.contentElementTypes = {};
  }
  /**
   * Register a new type of content element in the editor.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {Function} options.configurationEditor -
   *   Function that is evaluated in the context of a
   *   `ConfigurationEditorView` (see `pageflow/ui`) which will
   *   be used to edit the configuration of content elements of
   *   this type. Receives an options object with an `entry`
   *   property containing the entry model.
   * @param {Object} options.defaultConfig -
   *   Object that is set as initial config for the content element.
   * @param {Function} [options.split] -
   *   Function that receives configuration attributes and a split point
   *   and needs to return a two element array of configuration attributes
   *   objects representing the content elements that arise from splitting
   *   a content element with the given configuration at the specified
   *   split point. Called when inserting content elements at custom split
   *   points.
   * @param {Function} [options.merge] -
   *   Function that receives two configuration attributes objects and
   *   needs to return a single merged configuration. If provided, this
   *   will function will be called whenever two content elements of this
   *   type become adjacent because a common neighbor has been deleted.
   * @param {string[]} [options.supportedPositions] -
   *   Pass array containing a subset of the positions `left`, `right`,
   *   `sticky` and `inline`. By default all positions are supported.
   * @param {string[]} [options.supportedWidthRange] -
   *   Pass array consisting of two widths of the form `xxs`, `xs`, `sm`,
   *   `md`, `lg`, `xl` or `full` representing the smallest andlargest
   *   supported width. By default only width `md` is supported.
   * @memberof editor_contentElementTypes
   *
   * @example
   *
   * // editor.js
   * editor.contentElementTypes.register('inlineImage', {
   *   supportedWidthRange: ['xss', 'full'],
   *
   *   configurationEditor() {
   *     this.tab('general', function() {
   *       this.input('caption', TextInputView);
   *     });
   *   }
   * });
   */


  _createClass(ContentElementTypeRegistry, [{
    key: "register",
    value: function register(typeName, options) {
      this.contentElementTypes[typeName] = options;
    }
  }, {
    key: "setupConfigurationEditor",
    value: function setupConfigurationEditor(typeName, configurationEditorView, options) {
      return this.findByTypeName(typeName).configurationEditor.call(configurationEditorView, options);
    }
  }, {
    key: "findByTypeName",
    value: function findByTypeName(typeName) {
      if (!this.contentElementTypes[typeName]) {
        throw new Error("Unknown content element type ".concat(typeName));
      }

      return this.contentElementTypes[typeName];
    }
  }, {
    key: "groupedByCategory",
    value: function groupedByCategory() {
      var result = [];
      var categoriesByName = {};
      this.toArray().forEach(function (contentElementType) {
        var categoryName = contentElementType.category || 'basic';

        if (!categoriesByName[categoryName]) {
          categoriesByName[categoryName] = {
            name: categoryName,
            displayName: I18n.t("pageflow_scrolled.editor.content_element_categories.".concat(categoryName, ".name")),
            contentElementTypes: []
          };
          result.push(categoriesByName[categoryName]);
        }

        categoriesByName[categoryName].contentElementTypes.push(contentElementType);
      });
      return result;
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var _this = this;

      return Object.keys(this.contentElementTypes).map(function (typeName) {
        return _objectSpread2(_objectSpread2({}, _this.contentElementTypes[typeName]), {}, {
          typeName: typeName,
          displayName: I18n.t("pageflow_scrolled.editor.content_elements.".concat(typeName, ".name")),
          description: I18n.t("pageflow_scrolled.editor.content_elements.".concat(typeName, ".description"))
        });
      }).filter(function (contentElement) {
        return !contentElement.featureName || _this.features.isEnabled(contentElement.featureName);
      });
    }
  }]);

  return ContentElementTypeRegistry;
}();

function extend(api) {
  return Object.assign(api, {
    contentElementTypes: new ContentElementTypeRegistry({
      features: features
    })
  });
}
var editor = extend(editor$1);

function ConsentVendors(_ref) {
  var hostMatchers = _ref.hostMatchers;
  return {
    fromUrl: function fromUrl(url) {
      var _Object$entries$find;

      url = new URL(url);
      return (_Object$entries$find = Object.entries(hostMatchers).find(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 1),
            matcher = _ref3[0];

        return new RegExp(matcher).test(url.host);
      })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[1];
    }
  };
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

var SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'fadeBg',
    fullHeight: true,
    exposeMotifArea: true,
    backdrop: {}
  },
  initialize: function initialize() {
    Configuration.prototype.initialize.apply(this, arguments);
    this.attributes = _objectSpread2(_objectSpread2({}, this.getAttributesFromBackdropAttribute()), this.attributes);
  },
  getAttributesFromBackdropAttribute: function getAttributesFromBackdropAttribute() {
    var backdrop = this.attributes.backdrop || {};

    if (backdrop.image && backdrop.image.toString().startsWith('#')) {
      return {
        backdropType: 'color',
        backdropColor: backdrop.image
      };
    } else if (backdrop.color) {
      return {
        backdropType: 'color',
        backdropColor: backdrop.color
      };
    } else if (backdrop.video) {
      return {
        backdropType: 'video',
        backdropVideo: backdrop.video
      };
    } else {
      return {
        backdropType: 'image',
        backdropImage: backdrop.image,
        backdropImageMobile: backdrop.imageMobile
      };
    }
  },
  set: function set(name, value) {
    if (name !== 'backdrop' && name.startsWith && name.startsWith('backdrop')) {
      Configuration.prototype.set.call(this, _defineProperty({
        backdrop: this.getBackdropAttribute(_objectSpread2(_objectSpread2({}, this.attributes), {}, _defineProperty({}, name, value)))
      }, name, value));
    } else {
      Configuration.prototype.set.apply(this, arguments);
    }
  },
  getBackdropAttribute: function getBackdropAttribute(nextAttributes) {
    switch (nextAttributes.backdropType) {
      case 'color':
        return {
          color: nextAttributes.backdropColor
        };

      case 'video':
        return {
          video: nextAttributes.backdropVideo,
          videoMotifArea: nextAttributes.backdropVideoMotifArea,
          videoInlineRightsHidden: nextAttributes.backdropVideoInlineRightsHidden,
          videoMobile: nextAttributes.backdropVideoMobile,
          videoMobileMotifArea: nextAttributes.backdropVideoMobileMotifArea,
          videoMobileInlineRightsHidden: nextAttributes.backdropVideoMobileInlineRightsHidden
        };

      default:
        return {
          image: nextAttributes.backdropImage,
          imageMotifArea: nextAttributes.backdropImageMotifArea,
          imageInlineRightsHidden: nextAttributes.backdropImageInlineRightsHidden,
          imageMobile: nextAttributes.backdropImageMobile,
          imageMobileMotifArea: nextAttributes.backdropImageMobileMotifArea,
          imageMobileInlineRightsHidden: nextAttributes.backdropImageMobileInlineRightsHidden
        };
    }
  }
});
var FileSelectionHandler = function FileSelectionHandler(options) {
  var section = options.entry.sections.get(options.id);

  this.call = function (file) {
    section.configuration.setReference(options.attributeName, file);
    section.configuration.set("".concat(options.attributeName, "MotifArea"), file.configuration.get('motifArea'));
  };

  this.getReferer = function () {
    return '/scrolled/sections/' + section.id;
  };
};
editor$1.registerFileSelectionHandler('sectionConfiguration', FileSelectionHandler);

var Section = Backbone$1.Model.extend({
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: ['position'],
    configurationModel: SectionConfiguration
  }), delayedDestroying, entryTypeEditorControllerUrls.forModel({
    resources: 'sections'
  }), failureTracking],
  initialize: function initialize(attributes, options) {
    this.contentElements = new ForeignKeySubsetCollection({
      parent: options.contentElements,
      parentModel: this,
      foreignKeyAttribute: 'sectionId',
      parentReferenceAttribute: 'section',
      autoConsolidatePositions: false
    });
  },
  chapterPosition: function chapterPosition() {
    return this.chapter && this.chapter.has('position') ? this.chapter.get('position') : -1;
  },
  getTransition: function getTransition() {
    var _this$chapter;

    var entry = (_this$chapter = this.chapter) === null || _this$chapter === void 0 ? void 0 : _this$chapter.entry;

    if (!entry) {
      return 'scroll';
    }

    var sectionIndex = entry.sections.indexOf(this);
    var previousSection = entry.sections.at(sectionIndex - 1);
    var availableTransitions = previousSection ? getAvailableTransitionNames(this.configuration.attributes, previousSection.configuration.attributes) : [];
    var transition = this.configuration.get('transition');

    if (availableTransitions.includes(transition)) {
      return transition;
    } else {
      return 'scroll';
    }
  }
});

var Chapter = Backbone$1.Model.extend({
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: ['position']
  }), delayedDestroying, entryTypeEditorControllerUrls.forModel({
    resources: 'chapters'
  }), failureTracking],
  initialize: function initialize(attributes, options) {
    this.sections = new ForeignKeySubsetCollection({
      parent: options.sections,
      parentModel: this,
      foreignKeyAttribute: 'chapterId',
      parentReferenceAttribute: 'chapter',
      autoConsolidatePositions: false
    });
    this.entry = options.entry;
  },
  addSection: function addSection(attributes) {
    var _this = this;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        select = _ref.select,
        options = _objectWithoutProperties(_ref, ["select"]);

    var section = this.sections.create(new Section(_objectSpread2({
      position: this.sections.length ? Math.max.apply(Math, _toConsumableArray(this.sections.pluck('position'))) + 1 : 0,
      chapterId: this.id,
      configuration: {
        transition: this.entry.metadata.configuration.get('defaultTransition')
      }
    }, attributes), {
      contentElements: this.entry.contentElements
    }), options);
    section.once('sync', function (model, response) {
      if (select) {
        _this.entry.trigger('selectSectionSettings', section);
      }

      _this.entry.trigger('scrollToSection', section);

      section.configuration.set(response.configuration, {
        autoSave: false
      });
      section.contentElements.add(response.contentElements);
    });
    return section;
  },
  insertSection: function insertSection(_ref2, options) {
    var before = _ref2.before,
        after = _ref2.after;
    var position = before ? before.get('position') : after.get('position') + 1;
    this.sections.each(function (section) {
      if (section.get('position') >= position) {
        section.set('position', section.get('position') + 1);
      }
    });
    var newSection = this.addSection({
      position: position
    }, options);
    this.sections.sort();
    return newSection;
  },
  duplicateSection: function duplicateSection(section) {
    var newSection = this.insertSection({
      after: section
    }, {
      url: "".concat(section.url(), "/duplicate")
    });
    return newSection;
  }
});

var ChaptersCollection = Backbone$1.Collection.extend({
  model: Chapter,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'chapters'
  }), orderedCollection],
  comparator: function comparator(chapter) {
    return chapter.get('position');
  }
});

var SectionsCollection = Backbone$1.Collection.extend({
  model: Section,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'sections'
  })],
  comparator: function comparator(sectionA, sectionB) {
    if (sectionA.chapterPosition() > sectionB.chapterPosition()) {
      return 1;
    } else if (sectionA.chapterPosition() < sectionB.chapterPosition()) {
      return -1;
    } else if (sectionA.get('position') > sectionB.get('position')) {
      return 1;
    } else if (sectionA.get('position') < sectionB.get('position')) {
      return -1;
    } else {
      return 0;
    }
  }
});

var widths = {
  xxs: -3,
  xs: -2,
  s: -1,
  md: 0,
  l: 1,
  xl: 2,
  full: 3
};
var ContentElement = Backbone$1.Model.extend({
  paramRoot: 'content_element',
  mixins: [configurationContainer({
    autoSave: true,
    includeAttributesInJSON: ['position', 'typeName']
  }), delayedDestroying, entryTypeEditorControllerUrls.forModel({
    resources: 'content_elements'
  }), failureTracking],
  initialize: function initialize() {
    var _this = this;

    this.transientState = new Backbone$1.Model(this.get('transientState'));
    this.listenTo(this, 'change:transientState', function () {
      return _this.transientState.set(_this.get('transientState'), {
        skipCommand: true
      });
    });
    this.listenTo(this.transientState, 'change', function (model, _ref) {
      var skipCommand = _ref.skipCommand;

      if (!skipCommand) {
        _this.postCommand({
          type: 'TRANSIENT_STATE_UPDATE',
          payload: model.changed
        });
      }
    });
  },
  getType: function getType(contentElement) {
    return editor.contentElementTypes.findByTypeName(this.get('typeName'));
  },
  postCommand: function postCommand(command) {
    this.trigger('postCommand', this.id, command);
  },
  getAdjacentContentElements: function getAdjacentContentElements() {
    var section = this.section;
    var index = section.contentElements.indexOf(this);
    return [section.contentElements.at(index - 1), section.contentElements.at(index + 1)];
  },
  applyDefaultConfiguration: function applyDefaultConfiguration(sibling) {
    var defaultConfig = _objectSpread2({}, this.getType().defaultConfig);

    var defaultPosition = sibling === null || sibling === void 0 ? void 0 : sibling.getPosition();
    var supportedPositions = this.getType().supportedPositions || [];

    if (defaultPosition && defaultPosition !== 'inline' && supportedPositions.includes(defaultPosition)) {
      defaultConfig.position = defaultPosition;
    }

    this.configuration.set(defaultConfig);
  },
  getPosition: function getPosition() {
    return this.configuration.get('position');
  },
  getResolvedPosition: function getResolvedPosition() {
    var position = this.getPosition();
    return this.getAvailablePositions().includes(position) ? position : 'inline';
  },
  getAvailablePositions: function getAvailablePositions() {
    var layout = this.section.configuration.get('layout');
    var supportedByLayout = layout === 'center' || layout === 'centerRagged' ? ['inline', 'left', 'right', 'standAlone'] : ['inline', 'sticky', 'standAlone'];
    var supportedByType = this.getType().supportedPositions;

    if (supportedByType) {
      return supportedByLayout.filter(function (position) {
        return supportedByType.includes(position);
      });
    } else {
      return supportedByLayout;
    }
  },
  getWidth: function getWidth() {
    return this.clampWidthByPosition(this.configuration.get('width') || 0);
  },
  getAvailableMinWidth: function getAvailableMinWidth() {
    var _this$getType$support;

    return this.clampWidthByPosition(widths[((_this$getType$support = this.getType().supportedWidthRange) === null || _this$getType$support === void 0 ? void 0 : _this$getType$support[0]) || 'md']);
  },
  getAvailableMaxWidth: function getAvailableMaxWidth() {
    var _this$getType$support2;

    return this.clampWidthByPosition(widths[((_this$getType$support2 = this.getType().supportedWidthRange) === null || _this$getType$support2 === void 0 ? void 0 : _this$getType$support2[1]) || 'md']);
  },
  clampWidthByPosition: function clampWidthByPosition(width) {
    if (['sticky', 'left', 'right'].includes(this.getResolvedPosition())) {
      return Math.min(Math.max(width, -2), 2);
    } else {
      return width;
    }
  }
});

var ContentElementsCollection = Backbone$1.Collection.extend({
  model: ContentElement,
  mixins: [entryTypeEditorControllerUrls.forCollection({
    resources: 'content_elements'
  })],
  comparator: 'position'
});

// persisting the changes to the server in a single request and
// applying them to the section once the requests succeeds.

function Batch(entry, section) {
  // Shallow copy of the section's list of content elements to store
  // ordering changes and newly inserted content elements.
  var contentElements = section.contentElements.toArray(); // Since contentElements is only a shallow copy, we cannot write
  // configuration changes to the actual content elements.

  var changedConfigurations = {}; // Content elements that have been removed from contentElements
  // and shall be deleted on the server.

  var markedForDeletion = []; // Track whether changes have been recorded which need to be
  // persisted to the server.

  var isDirty = false;
  return {
    getAdjacent: getAdjacent,
    getLength: getLength,
    split: split,
    maybeMerge: maybeMerge,
    insertBefore: insertBefore,
    insertAfter: insertAfter,
    markForUpdate: markForUpdate,
    markForDeletion: markForDeletion,
    remove: remove,
    save: save,
    saveIfDirty: saveIfDirty
  };

  function getAdjacent(contentElement) {
    var index = contentElements.indexOf(contentElement);
    return [contentElements[index - 1], contentElements[index + 1]];
  }

  function getLength(contentElement) {
    return contentElement.getType().getLength ? contentElement.getType().getLength(getCurrentConfiguration(contentElement)) : 0;
  } // Higher level transformations based on the more low level
  // transformations below:


  function split(contentElement, splitPoint) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        insertAt = _ref.insertAt;

    var _contentElement$getTy = contentElement.getType().split(getCurrentConfiguration(contentElement), splitPoint),
        _contentElement$getTy2 = _slicedToArray(_contentElement$getTy, 2),
        c1 = _contentElement$getTy2[0],
        c2 = _contentElement$getTy2[1];

    var splitOffContentElement;

    if (insertAt === 'before') {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: c1
      });
      insertBefore(contentElement, splitOffContentElement);
      markForUpdate(contentElement, c2);
    } else {
      splitOffContentElement = new ContentElement({
        typeName: contentElement.get('typeName'),
        configuration: c2
      });
      markForUpdate(contentElement, c1);
      insertAfter(contentElement, splitOffContentElement);
    }

    return splitOffContentElement;
  }

  function maybeMerge(before, after) {
    if (!before || !after || before.get('typeName') !== after.get('typeName') || !before.getType().merge) {
      return;
    }

    var mergedConfiguration = before.getType().merge(getCurrentConfiguration(before), getCurrentConfiguration(after)); // Update the aleady persisted content element, if one has not yet
    // been persisted. For example, let X be a content element in
    // between two text blocks T1 and T2:
    //
    //   T1
    //     paragraph A
    //     paragraph B
    //   X
    //   T2
    //     paragraph C
    //
    // When X shall be moved between the two paragraphs of T1, the
    // second paragraph of T1 will first be split off into a new
    // content element T3:
    //
    //   T1
    //     paragraph A
    //   T3
    //     paragraph B
    //   X
    //   T2
    //     paragraph C
    //
    // Then X will be moved:
    //
    //   T1
    //     paragraph A
    //   X
    //   T3
    //     paragraph B
    //   T2
    //     paragraph C
    //
    // T3 and T2 become adjacent and need to be merged. We now want to
    // update T2 instead of creating T3 and deleting T2. Final state:
    //
    //   T1
    //     paragraph A
    //   X
    //   T2
    //     paragraph B
    //     paragraph C
    //

    if (before.isNew() && !after.isNew()) {
      remove(before);
      markForUpdate(after, mergedConfiguration);
      return after;
    } else {
      markForUpdate(before, mergedConfiguration);
      remove(after);

      if (!after.isNew()) {
        markForDeletion(after);
      }

      return before;
    }
  }

  function insertBefore(sibling, contentElement) {
    isDirty = true;
    contentElements.splice(contentElements.indexOf(sibling), 0, contentElement);
  }

  function insertAfter(sibling, contentElement) {
    isDirty = true;
    contentElements.splice(contentElements.indexOf(sibling) + 1, 0, contentElement);
  }

  function markForUpdate(contentElement, configuration) {
    isDirty = true;

    if (contentElement.isNew()) {
      contentElement.configuration.set(configuration);
    } else {
      changedConfigurations[contentElement.id] = configuration;
    }
  }

  function markForDeletion(contentElement) {
    isDirty = true;
    markedForDeletion.push(contentElement);
  }

  function remove(contentElement) {
    // We do not mark the batch as dirty here to allow removing an
    // element and adding it to another section. We are fine with
    // the resulting gap in the position attributes of the section's
    // content elements.
    contentElements.splice(contentElements.indexOf(contentElement), 1);
  }

  function getCurrentConfiguration(contentElement) {
    return changedConfigurations[contentElement.id] || contentElement.configuration.attributes;
  } // Functionality to assemble and perform the batch request to
  // persist the recorded changes:


  function saveIfDirty(options) {
    if (isDirty) {
      save(options);
    }
  }

  function save() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _success = _ref2.success;

    isDirty = false;
    Backbone$1.sync('update', section, {
      url: "".concat(section.url(), "/content_elements/batch"),
      attrs: {
        content_elements: createBatchItems()
      },
      success: function success(response) {
        applyConfigurationChanges();
        applyPositions();
        applyAdditions(response);
        applyDeletions();
        section.contentElements.sort();

        if (_success) {
          _success();
        }
      }
    });
  }

  function createBatchItems() {
    return [].concat(_toConsumableArray(contentElements.map(function (contentElement) {
      if (contentElement.isNew()) {
        return {
          typeName: contentElement.get('typeName'),
          configuration: contentElement.configuration.attributes
        };
      } else if (changedConfigurations[contentElement.id]) {
        return {
          id: contentElement.id,
          configuration: changedConfigurations[contentElement.id]
        };
      } else {
        return contentElement.pick('id');
      }
    })), _toConsumableArray(markedForDeletion.map(function (contentElement) {
      return {
        id: contentElement.id,
        _delete: true
      };
    })));
  } // Functionality to apply the recorded changes to the underlying
  // section once the request succeeded:


  function applyAdditions(response) {
    contentElements.forEach(function (contentElement, index) {
      if (contentElement.isNew()) {
        section.contentElements.add(contentElement);
        contentElement.set({
          id: response[index].id,
          permaId: response[index].permaId
        });
      } else if (contentElement.section !== section) {
        contentElement.section.contentElements.remove(contentElement);
        section.contentElements.add(contentElement);
      }
    });
  }

  function applyDeletions() {
    markedForDeletion.forEach(function (contentElement) {
      return entry.contentElements.remove(contentElement);
    });
  }

  function applyPositions() {
    contentElements.forEach(function (contentElement, index) {
      return contentElement.set('position', index, {
        autoSave: false
      });
    });
  }

  function applyConfigurationChanges() {
    contentElements.forEach(function (contentElement) {
      if (changedConfigurations[contentElement.id]) {
        contentElement.configuration.set(changedConfigurations[contentElement.id], {
          autoSave: false
        });
      }
    });
  }
}

function maybeMergeWithAdjacent(batch, contentElement) {
  var _batch$getAdjacent = batch.getAdjacent(contentElement),
      _batch$getAdjacent2 = _slicedToArray(_batch$getAdjacent, 2),
      before = _batch$getAdjacent2[0],
      after = _batch$getAdjacent2[1];

  var range = createRange(batch, contentElement);
  var beforeLength = before ? batch.getLength(before) : 0;
  contentElement = batch.maybeMerge(contentElement, after) || contentElement;
  var mergedContentElement = batch.maybeMerge(before, contentElement);

  if (mergedContentElement) {
    return [mergedContentElement, translateRange(range, beforeLength)];
  }

  return [contentElement, range];
}

function createRange(batch, contentElement) {
  return batch.getLength(contentElement) ? [0, batch.getLength(contentElement)] : undefined;
}

function translateRange(range, delta) {
  return range && [range[0] + delta, range[1] + delta];
}

// element (e.g. between two paragraphs of a text block).

function insertContentElement(entry, sibling, attributes, _ref) {
  var at = _ref.at,
      splitPoint = _ref.splitPoint;
  var batch = new Batch(entry, sibling.section);

  if (at === 'split') {
    batch.split(sibling, splitPoint, {
      insertAt: 'after'
    });
  }

  var contentElement = new ContentElement(attributes);
  contentElement.applyDefaultConfiguration(sibling);

  if (at === 'before') {
    batch.insertBefore(sibling, contentElement);
  } else {
    batch.insertAfter(sibling, contentElement);
  }

  var targetRange;

  var _maybeMergeWithAdjace = maybeMergeWithAdjacent(batch, contentElement);

  var _maybeMergeWithAdjace2 = _slicedToArray(_maybeMergeWithAdjace, 2);

  contentElement = _maybeMergeWithAdjace2[0];
  targetRange = _maybeMergeWithAdjace2[1];
  batch.save({
    success: function success() {
      entry.trigger('selectContentElement', contentElement, {
        range: targetRange
      });
    }
  });
}

// moving content elements to "split points" inside content elements
// with custom split functions (e.g. between two paragraphs of a text
// block). Merge content elements of the same type that become
// adjacent by moving a content element away (e.g. two text blocks
// surrounding an image that is moved away).

function moveContentElement(entry, contentElement, _ref) {
  var range = _ref.range,
      sibling = _ref.sibling,
      at = _ref.at,
      splitPoint = _ref.splitPoint;
  var sourceBatch = new Batch(entry, contentElement.section); // If we move content elements between sections, merges will need to
  // be performed in the section where the content element came from.

  var targetBatch = sibling.section === contentElement.section ? sourceBatch : new Batch(entry, sibling.section);

  if (range && !rangeCoversWholeElement(sourceBatch, contentElement, range)) {
    if (contentElement === sibling && at === 'split') {
      // If we are moving part of a content element inside the content
      // element itself, we need to adjust the split point if the
      // moved range lies above the split point since moving a range
      // means first extracting/removing it from the source element.
      var delta = splitPoint > range[0] ? range[1] - range[0] : 0;
      splitPoint -= delta;
    }

    contentElement = extractRange(sourceBatch, contentElement, range);
  }

  if (at === 'split') {
    // When moving a content element to a split point in the adjacent
    // element below, insert split off element before sibling so that
    // is can directly be merged again. For example, let X be a
    // content element in between two text blocks T1 and T2:
    //
    //   T1
    //     paragraph A
    //   X
    //   T2
    //     paragraph B
    //     paragraph C
    //
    // When X shall be moved between the two paragraphs of T2, we want
    // to split off the first paragraph of T2 into a new content
    // element T3 and move X:
    //
    //   T1
    //     T1 paragraph A
    //   X
    //   T3
    //     T1 paragraph B
    //   T2
    //     T2 paragraph C
    //
    // T3 becomes the new sibling that we want to move X after:
    //
    //   T1
    //     T1 paragraph A
    //   T3
    //     T1 paragraph B
    //   X
    //   T2
    //     T2 paragraph C
    //
    // When we later merge T1 and T3, T1 will be updated making T3
    // disappear again without ever persisting it to the server:
    //
    //   T1
    //     T1 paragraph A
    //     T1 paragraph B
    //   X
    //   T2
    //     T2 paragraph C
    //
    if (sourceBatch.getAdjacent(contentElement)[1] === sibling) {
      sibling = targetBatch.split(sibling, splitPoint, {
        insertAt: 'before'
      });
    } else {
      targetBatch.split(sibling, splitPoint);
    }
  }

  var _sourceBatch$getAdjac = sourceBatch.getAdjacent(contentElement),
      _sourceBatch$getAdjac2 = _slicedToArray(_sourceBatch$getAdjac, 2),
      before = _sourceBatch$getAdjac2[0],
      after = _sourceBatch$getAdjac2[1];

  var targetRange; // Check if element was dragged to same position where it came from.

  if (!(at === 'before' && !range && sibling === after) && !(at === 'after' && !range && sibling === before)) {
    sourceBatch.remove(contentElement);

    if (at === 'before') {
      targetBatch.insertBefore(sibling, contentElement);
    } else {
      targetBatch.insertAfter(sibling, contentElement);
    }

    var _maybeMergeWithAdjace = maybeMergeWithAdjacent(targetBatch, contentElement);

    var _maybeMergeWithAdjace2 = _slicedToArray(_maybeMergeWithAdjace, 2);

    contentElement = _maybeMergeWithAdjace2[0];
    targetRange = _maybeMergeWithAdjace2[1];
    sourceBatch.maybeMerge(before, after);
  } // Dragging an element next to a sticky element, shall make the
  // moved element sticky as well.


  copyPositionIfAvailable(targetBatch, contentElement, sibling);
  targetBatch.saveIfDirty({
    success: function success() {
      entry.trigger('selectContentElement', contentElement, {
        range: targetRange
      });
    }
  });
  sourceBatch.saveIfDirty();
}

function rangeCoversWholeElement(batch, contentElement, range) {
  return range[0] === 0 && range[1] === batch.getLength(contentElement);
}

function extractRange(batch, contentElement, range) {
  var extracted = batch.split(contentElement, range[0]);
  var suffix = batch.split(extracted, range[1] - range[0]);
  batch.maybeMerge(contentElement, suffix);
  return extracted;
}

function copyPositionIfAvailable(batch, contentElement, sibling) {
  if (contentElement.getPosition() !== sibling.getPosition() && contentElement.getAvailablePositions().includes(sibling.getPosition())) {
    batch.markForUpdate(contentElement, _objectSpread2(_objectSpread2({}, contentElement.configuration.toJSON), {}, {
      position: sibling.getPosition()
    }));
  }
}

// (e.g. two text blocks surrounding a deleted image).

function deleteContentElement(entry, contentElement) {
  var batch = new Batch(entry, contentElement.section);

  var _batch$getAdjacent = batch.getAdjacent(contentElement),
      _batch$getAdjacent2 = _slicedToArray(_batch$getAdjacent, 2),
      before = _batch$getAdjacent2[0],
      after = _batch$getAdjacent2[1];

  batch.remove(contentElement);
  batch.markForDeletion(contentElement);
  batch.maybeMerge(before, after);
  batch.save();
}

var ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed: function setupFromEntryTypeSeed(seed) {
    this.consentVendors = new ConsentVendors({
      hostMatchers: seed.consentVendorHostMatchers
    });
    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
    this.sections = new SectionsCollection(seed.collections.sections, {
      contentElements: this.contentElements
    });
    this.chapters = new ChaptersCollection(seed.collections.chapters, {
      sections: this.sections,
      entry: this
    });
    this.chapters.parentModel = this;
    this.sections.sort();
    editor$1.failures.watch(this.contentElements);
    editor$1.failures.watch(this.sections);
    editor$1.failures.watch(this.chapters);
    editor$1.savingRecords.watch(this.contentElements);
    editor$1.savingRecords.watch(this.sections);
    editor$1.savingRecords.watch(this.chapters);
    this.scrolledSeed = seed;
  },
  addChapter: function addChapter(attributes) {
    this.chapters.create(_objectSpread2({
      position: this.chapters.length
    }, attributes), {
      entry: this,
      sections: this.sections
    });
  },
  insertContentElement: function insertContentElement$1(attributes, _ref) {
    var _this = this;

    var id = _ref.id,
        at = _ref.at,
        splitPoint = _ref.splitPoint;

    if (at === 'endOfSection') {
      var contentElement = new ContentElement(_objectSpread2({
        position: this.contentElements.length
      }, attributes));
      contentElement.applyDefaultConfiguration();
      this.sections.get(id).contentElements.add(contentElement);
      contentElement.save();
      contentElement.once('sync', function () {
        _this.trigger('selectContentElement', contentElement);
      });
    } else {
      insertContentElement(this, this.contentElements.get(id), attributes, {
        at: at,
        splitPoint: splitPoint
      });
    }
  },
  moveContentElement: function moveContentElement$1(_ref2, _ref3) {
    var movedId = _ref2.id,
        movedRange = _ref2.range;
    var id = _ref3.id,
        at = _ref3.at,
        splitPoint = _ref3.splitPoint;

    moveContentElement(this, this.contentElements.get(movedId), {
      range: movedRange,
      sibling: this.contentElements.get(id),
      at: at,
      splitPoint: splitPoint
    });
  },
  deleteContentElement: function deleteContentElement$1(id) {
    deleteContentElement(this, this.contentElements.get(id));
  },
  getTypographyVariants: function getTypographyVariants(_ref4) {
    var _this2 = this;

    var contentElement = _ref4.contentElement,
        prefix = _ref4.prefix;
    var typographyRuleNames = Object.keys(this.scrolledSeed.config.theme.options.typography || {});
    var legacyTypographyVariants = this.scrolledSeed.legacyTypographyVariants || {};
    var rulePrefix = [].concat(_toConsumableArray([contentElement.get('typeName'), prefix].filter(Boolean)), ['']).join('-');
    var ruleNames = typographyRuleNames.filter(function (name) {
      return name.indexOf(rulePrefix) === 0;
    }).filter(function (name) {
      return !legacyTypographyVariants[name.split('-').pop()];
    });
    var values = ruleNames.map(function (name) {
      return name.split('-').pop();
    });
    var texts = ruleNames.map(function (name) {
      return I18n.t("pageflow_scrolled.editor.themes.".concat(_this2.metadata.get('theme_name')) + ".typography_variants.".concat(name), {
        defaultValue: I18n.t("pageflow_scrolled.editor.typography_variants.".concat(name))
      });
    });
    return [values, texts];
  },
  createLegacyTypographyVariantDelegator: function createLegacyTypographyVariantDelegator(_ref5) {
    var model = _ref5.model,
        paletteColorPropertyName = _ref5.paletteColorPropertyName;
    var delegator = Object.create(model);
    var mapping = this.scrolledSeed.legacyTypographyVariants;

    delegator.get = function (name) {
      var result = model.get(name);

      if (name === 'typographyVariant') {
        return mapping[result] ? mapping[result].variant : result;
      } else if (name === paletteColorPropertyName) {
        var _mapping$model$get;

        return ((_mapping$model$get = mapping[model.get('typographyVariant')]) === null || _mapping$model$get === void 0 ? void 0 : _mapping$model$get.paletteColor) || result;
      }

      return result;
    };

    delegator.set = function (name, value) {
      if (name === paletteColorPropertyName && mapping[model.get('typographyVariant')]) {
        var _model$set;

        model.set((_model$set = {}, _defineProperty(_model$set, paletteColorPropertyName, value), _defineProperty(_model$set, "typographyVariant", mapping[model.get('typographyVariant')].variant), _model$set));
      } else {
        model.set.apply(this, arguments);
      }
    };

    return delegator;
  },
  getContentElementVariants: function getContentElementVariants(_ref6) {
    var _this3 = this;

    var contentElement = _ref6.contentElement;
    var scopeNames = Object.keys(this.scrolledSeed.config.theme.options.properties || {});
    var scopeNamePrefix = "".concat(contentElement.get('typeName'), "-");
    var matchingScopeNames = scopeNames.filter(function (name) {
      return name.indexOf(scopeNamePrefix) === 0;
    });
    var values = matchingScopeNames.map(function (name) {
      return name.replace(scopeNamePrefix, '');
    });
    var texts = matchingScopeNames.map(function (name) {
      return I18n.t("pageflow_scrolled.editor.themes.".concat(_this3.metadata.get('theme_name')) + ".content_element_variants.".concat(name), {
        defaultValue: I18n.t("pageflow_scrolled.editor.content_element_variants.".concat(name))
      });
    });
    return [values, texts];
  },
  getPaletteColors: function getPaletteColors() {
    var _this$scrolledSeed$co,
        _this4 = this;

    var values = Object.keys(((_this$scrolledSeed$co = this.scrolledSeed.config.theme.options.properties) === null || _this$scrolledSeed$co === void 0 ? void 0 : _this$scrolledSeed$co.root) || {}).filter(function (key) {
      return key.indexOf('paletteColor') === 0;
    }).map(function (key) {
      return dasherize(key.replace('paletteColor', ''));
    });
    var texts = values.map(underscore).map(function (name) {
      return I18n.t("pageflow_scrolled.editor.themes.".concat(_this4.metadata.get('theme_name')) + ".palette_colors.".concat(name), {
        defaultValue: I18n.t("pageflow_scrolled.editor.palette_colors.".concat(name))
      });
    });
    return [values, texts];
  },
  supportsSectionWidths: function supportsSectionWidths() {
    var _theme$options$proper;

    var theme = this.scrolledSeed.config.theme;
    return Object.keys(((_theme$options$proper = theme.options.properties) === null || _theme$options$proper === void 0 ? void 0 : _theme$options$proper.root) || {}).some(function (key) {
      return key.startsWith('narrowSection');
    });
  }
});

function dasherize(text) {
  return (text[0] + text.slice(1).replace(/[A-Z]/g, function (match) {
    return "-".concat(match);
  })).toLowerCase();
}

function underscore(dasherizedWord) {
  return dasherizedWord.replace(/-/g, '_');
}

var ContentElementFileSelectionHandler = function ContentElementFileSelectionHandler(options) {
  var contentElement = options.entry.contentElements.get(options.id);

  this.call = function (file) {
    contentElement.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function () {
    return '/scrolled/content_elements/' + contentElement.id;
  };
};

var css$4 = ".SectionThumbnailView-module_thumbnail__RcXov {\n  padding-top: 50%;\n  position: relative;\n  text-align: initial;\n  border: solid 1px var(--ui-on-surface-color-lightest);\n}\n";
var styles$4 = {"thumbnail":"SectionThumbnailView-module_thumbnail__RcXov"};
styleInject(css$4);

var SectionThumbnailView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <div class=".concat(styles$4.thumbnail, "></div>\n  ");
  },
  ui: cssModulesUtils.ui(styles$4, 'thumbnail'),
  modelEvents: {
    'change:id': 'renderThumbnail'
  },
  onRender: function onRender() {
    var _this = this;

    this.timeout = setTimeout(function () {
      _this.renderThumbnail();
    }, 100);
  },
  onClose: function onClose() {
    clearTimeout(this.timeout);
    ReactDOM.unmountComponentAtNode(this.ui.thumbnail[0]);
  },
  renderThumbnail: function renderThumbnail() {
    var _this2 = this;

    if (!this.model.isNew()) {
      ReactDOM.render(React.createElement(StandaloneSectionThumbnail, {
        sectionPermaId: this.model.get('permaId'),
        seed: this.options.entry.scrolledSeed,
        subscribe: function subscribe(dispatch) {
          return watchCollections(_this2.options.entry, {
            dispatch: dispatch
          });
        }
      }), this.ui.thumbnail[0]);
    }
  }
});

var img = "data:image/svg+xml,%3csvg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='random' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='hsla(197%2c 26%25%2c 23%25%2c 0.8)' d='M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z'%3e%3c/path%3e%3c/svg%3e";

var css$5 = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}@-webkit-keyframes animations-module_blink__32C5j {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n  100% {\n    opacity: 1;\n  }\n}@keyframes animations-module_blink__32C5j {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n  100% {\n    opacity: 1;\n  }\n}.animations-module_blink__32C5j {\n  -webkit-animation: animations-module_blink__32C5j 1.5s ease infinite;\n          animation: animations-module_blink__32C5j 1.5s ease infinite;\n}.outline-module_sectionWithTransition__21DW- {\n  margin-top: 20px;\n}.outline-module_chapter__2J-r6:first-child .outline-module_sectionWithTransition__21DW-:first-child {\n  margin-top: 0;\n}.outline-module_chapter__2J-r6:first-child .outline-module_sectionWithTransition__21DW-:first-child .outline-module_transition__2Re1s {\n  display: none;\n}.outline-module_indicator__2dw_X {\n  display: none;\n  position: absolute;\n  right: 14px;\n  top: 7px;\n  width: 30px;\n  height: 30px;\n  font-size: 19px;\n  color: var(--ui-primary-color-light);\n}.outline-module_creatingIndicator__3O7Rw {\n}.outline-module_destroyingIndicator__2-mKh {\n}.outline-module_failedIndicator__2QK1F {\n  color: var(--ui-error-color);\n}.outline-module_dragHandle__3ATeR {\n  opacity: 0.3;\n  cursor: move;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 30px;\n  transition: opacity 0.1s ease;\n  transition-delay: 0.2s;\n}\n\n.SectionItemView-module_root__1Pp0d {\n  position: relative;\n  border: solid 3px transparent;\n  border-radius: 0.25rem;\n  padding: 1px;\n  margin-left: -6px;\n  margin-right: -6px;\n  text-align: right;\n}\n\n.SectionItemView-module_withTransition__wCxlq {\n}\n\n.SectionItemView-module_selectable__ACpQE:hover,\n.SectionItemView-module_active__1tLN5 {\n  border: solid 3px var(--ui-selection-color);\n}\n\n.SectionItemView-module_thumbnailContainer__1Xe7C {\n  position: relative;\n}\n\n.SectionItemView-module_thumbnail__1ecBT {}\n\n.SectionItemView-module_clickMask__2JYEH {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  cursor: pointer;\n}\n\n.SectionItemView-module_dragHandle__nY7mf {\n  color: var(--ui-on-primary-color);\n  text-shadow: 0 0 2px #000;\n}\n\n.SectionItemView-module_invert__XRpuB .SectionItemView-module_dragHandle__nY7mf {\n  color: var(--ui-primary-color);\n  text-shadow: 0 0 2px #fff;\n}\n\n.SectionItemView-module_inner__MwFda:hover .SectionItemView-module_dragHandle__nY7mf {\n  opacity: 1;\n}\n\n.SectionItemView-module_dropDownButton__34CFJ {\n  position: absolute;\n  top: 4px;\n  right: 0;\n  z-index: 1;\n}\n\n.SectionItemView-module_dropDownButton__34CFJ button {\n  border: 0 !important;\n  color: var(--ui-on-primary-color) !important;\n  text-shadow: 0 0 2px #000;\n  box-shadow: none !important;\n  opacity: 0.3;\n  transition: opacity 0.1s ease;\n  transition-delay: 0.2s;\n}\n\n.SectionItemView-module_invert__XRpuB .SectionItemView-module_dropDownButton__34CFJ button {\n  color: var(--ui-primary-color) !important;\n  text-shadow: 0 0 2px #fff;\n}\n\n.SectionItemView-module_inner__MwFda:hover .SectionItemView-module_dropDownButton__34CFJ button,\n.SectionItemView-module_dropDownButton__34CFJ button.hover {\n  opacity: 1;\n}\n\n.SectionItemView-module_creating__3Pjx9 .SectionItemView-module_dropDownButton__34CFJ,\n.SectionItemView-module_destroying__1m53s .SectionItemView-module_dropDownButton__34CFJ,\n.SectionItemView-module_failed__1CR2R .SectionItemView-module_dropDownButton__34CFJ {\n  display: none;\n}\n\n.SectionItemView-module_editTransition__2L7ZU {\n  position: absolute;\n  bottom: 100%;\n  left: 1px;\n  width: 100%;\n  border: 0;\n  background: transparent;\n  padding: 5px 5px 5px 2px;\n  cursor: pointer;\n  color: var(--ui-on-surface-color-light);\n  opacity: 0.8;\n  text-align: left;\n  display: flex;\n  gap: 9px;\n}\n\n.SectionItemView-module_editTransition__2L7ZU:hover,\n.SectionItemView-module_editTransition__2L7ZU:focus {\n  opacity: 1;\n}\n\n.SectionItemView-module_editTransition__2L7ZU img {\n  vertical-align: top;\n}\n\n.SectionItemView-module_transition__8a57E {}\n\n.SectionItemView-module_creating__3Pjx9 .SectionItemView-module_creatingIndicator__1GnKq     { display: block; }\n.SectionItemView-module_destroying__1m53s .SectionItemView-module_destroyingIndicator__HtKWF { display: block; }\n.SectionItemView-module_failed__1CR2R .SectionItemView-module_failedIndicator__1HVHn         { display: block; }\n\n.SectionItemView-module_creatingIndicator__1GnKq   { }\n.SectionItemView-module_destroyingIndicator__HtKWF {  }\n.SectionItemView-module_failedIndicator__1HVHn     { }\n";
var styles$5 = {"selectionColor":"var(--ui-selection-color)","selectionWidth":"3px","root":"SectionItemView-module_root__1Pp0d","withTransition":"SectionItemView-module_withTransition__wCxlq outline-module_sectionWithTransition__21DW-","selectable":"SectionItemView-module_selectable__ACpQE","active":"SectionItemView-module_active__1tLN5","thumbnailContainer":"SectionItemView-module_thumbnailContainer__1Xe7C","thumbnail":"SectionItemView-module_thumbnail__1ecBT","clickMask":"SectionItemView-module_clickMask__2JYEH","dragHandle":"SectionItemView-module_dragHandle__nY7mf outline-module_dragHandle__3ATeR icons-module_drag__p7HUE icons-module_icon__16IVx","invert":"SectionItemView-module_invert__XRpuB","inner":"SectionItemView-module_inner__MwFda","dropDownButton":"SectionItemView-module_dropDownButton__34CFJ","creating":"SectionItemView-module_creating__3Pjx9","destroying":"SectionItemView-module_destroying__1m53s","failed":"SectionItemView-module_failed__1CR2R","editTransition":"SectionItemView-module_editTransition__2L7ZU outline-module_transition__2Re1s","transition":"SectionItemView-module_transition__8a57E","creatingIndicator":"SectionItemView-module_creatingIndicator__1GnKq outline-module_creatingIndicator__3O7Rw outline-module_indicator__2dw_X icons-module_arrowsCcw__3_nrJ icons-module_icon__16IVx animations-module_blink__32C5j","destroyingIndicator":"SectionItemView-module_destroyingIndicator__HtKWF outline-module_destroyingIndicator__2-mKh outline-module_indicator__2dw_X icons-module_trash__DH1EH icons-module_icon__16IVx animations-module_blink__32C5j","failedIndicator":"SectionItemView-module_failedIndicator__1HVHn outline-module_failedIndicator__2QK1F outline-module_indicator__2dw_X icons-module_attention__1sssG icons-module_icon__16IVx"};
styleInject(css$5);

var SectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: "".concat(styles$5.root, " ").concat(styles$5.withTransition),
  mixins: [modelLifecycleTrackingView({
    classNames: styles$5
  })],
  template: function template(data) {
    return "\n    <button class=\"".concat(styles$5.editTransition, "\">\n      <img src=\"").concat(img, "\" width=\"11\" height=\"16\">\n      <span class=\"").concat(styles$5.transition, "\">\xDCberblenden</span>\n    </button>\n    <div class=\"").concat(styles$5.inner, "\">\n      <div class=\"").concat(styles$5.thumbnailContainer, "\">\n        <div class=\"").concat(styles$5.dropDownButton, "\"></div>\n        <div class=\"").concat(styles$5.thumbnail, "\"></div>\n        <div class=\"").concat(styles$5.clickMask, "\">\n          <div class=\"").concat(styles$5.dragHandle, "\"\n               title=\"").concat(I18n.t('pageflow_scrolled.editor.section_item.drag_hint'), "\"></div>\n        </div>\n      </div>\n      <span class=\"").concat(styles$5.creatingIndicator, "\" />\n      <span class=\"").concat(styles$5.destroyingIndicator, "\" />\n      <span class=\"").concat(styles$5.failedIndicator, "\"\n            title=\"").concat(I18n.t('pageflow_scrolled.editor.section_item.save_error'), "\" />\n    </div>\n  ");
  },
  ui: cssModulesUtils.ui(styles$5, 'thumbnail', 'dropDownButton', 'editTransition', 'transition'),
  events: cssModulesUtils.events(styles$5, {
    'click clickMask': function clickClickMask() {
      this.options.entry.trigger('selectSection', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },
    'dblclick clickMask': function dblclickClickMask() {
      this.options.entry.trigger('selectSectionSettings', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    },
    'click editTransition': function clickEditTransition() {
      this.options.entry.trigger('selectSectionTransition', this.model);
      this.options.entry.trigger('scrollToSection', this.model);
    }
  }),
  initialize: function initialize() {
    var _this = this;

    this.listenTo(this.options.entry, 'change:currentSectionIndex', function () {
      var active = _this.updateActive();

      if (active) {
        _this.$el[0].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
    this.listenTo(this.options.entry.sections, 'add', function () {
      _this.updateActive();

      _this.updateTransition();
    });
  },
  onRender: function onRender() {
    var _this2 = this;

    this.updateTransition();

    if (this.updateActive()) {
      setTimeout(function () {
        return _this2.$el[0].scrollIntoView({
          block: 'nearest'
        });
      }, 10);
    }

    this.$el.toggleClass(styles$5.invert, !!this.model.configuration.get('invert'));
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
    var dropDownMenuItems = new Backbone$1.Collection();
    dropDownMenuItems.add(new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.section_item.duplicate')
    }, {
      selected: function selected() {
        return _this2.model.chapter.duplicateSection(_this2.model);
      }
    }));
    dropDownMenuItems.add(new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.section_item.insert_section_above')
    }, {
      selected: function selected() {
        return _this2.model.chapter.insertSection({
          before: _this2.model
        });
      }
    }));
    dropDownMenuItems.add(new MenuItem({
      label: I18n.t('pageflow_scrolled.editor.section_item.insert_section_below')
    }, {
      selected: function selected() {
        return _this2.model.chapter.insertSection({
          after: _this2.model
        });
      }
    }));
    this.appendSubview(new DropDownButtonView({
      items: dropDownMenuItems,
      alignMenu: 'right',
      ellipsisIcon: true,
      openOnClick: true
    }), {
      to: this.ui.dropDownButton
    });
  },
  updateTransition: function updateTransition() {
    this.ui.transition.text(I18n.t(this.model.getTransition(), {
      scope: 'pageflow_scrolled.editor.section_item.transitions'
    }));
  },
  updateActive: function updateActive() {
    var active = this.options.entry.sections.indexOf(this.model) === this.options.entry.get('currentSectionIndex');
    this.$el.toggleClass(styles$5.active, active);
    return active;
  }
});
var MenuItem = Backbone$1.Model.extend({
  initialize: function initialize(attributes, options) {
    this.options = options;
  },
  selected: function selected() {
    this.options.selected();
  }
});

var css$6 = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}@-webkit-keyframes animations-module_blink__32C5j {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n  100% {\n    opacity: 1;\n  }\n}@keyframes animations-module_blink__32C5j {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n  100% {\n    opacity: 1;\n  }\n}.animations-module_blink__32C5j {\n  -webkit-animation: animations-module_blink__32C5j 1.5s ease infinite;\n          animation: animations-module_blink__32C5j 1.5s ease infinite;\n}.outline-module_sectionWithTransition__21DW- {\n  margin-top: 20px;\n}.outline-module_chapter__2J-r6:first-child .outline-module_sectionWithTransition__21DW-:first-child {\n  margin-top: 0;\n}.outline-module_chapter__2J-r6:first-child .outline-module_sectionWithTransition__21DW-:first-child .outline-module_transition__2Re1s {\n  display: none;\n}.outline-module_indicator__2dw_X {\n  display: none;\n  position: absolute;\n  right: 14px;\n  top: 7px;\n  width: 30px;\n  height: 30px;\n  font-size: 19px;\n  color: var(--ui-primary-color-light);\n}.outline-module_creatingIndicator__3O7Rw {\n}.outline-module_destroyingIndicator__2-mKh {\n}.outline-module_failedIndicator__2QK1F {\n  color: var(--ui-error-color);\n}.outline-module_dragHandle__3ATeR {\n  opacity: 0.3;\n  cursor: move;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 30px;\n  transition: opacity 0.1s ease;\n  transition-delay: 0.2s;\n}.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}.buttons-module_addButton__2pN-g {\n}.buttons-module_cancelButton__1xJCN {\n}.buttons-module_saveButton__1M-qM {\n}.buttons-module_selectFileButton__khOoU {\n}\n\n.ChapterItemView-module_root__19GIF {\n  margin-bottom: 10px;\n  padding: 0 10px 10px 10px;\n  background-color: var(--ui-surface-color);\n  border: solid 1px var(--ui-on-surface-color-lighter);\n  border-radius: 0.5rem;\n}\n\n.ChapterItemView-module_root__19GIF.ui-sortable-helper {\n  box-shadow: var(--ui-box-shadow-xl);\n}\n\n.ChapterItemView-module_selectableHover__222px {\n  background-color: var(--ui-selection-color-lighter);\n}\n\n.ChapterItemView-module_link__2dj_z {\n  display: block;\n  margin: 0 -10px 0 -10px;\n  padding: 10px;\n}\n\n.ChapterItemView-module_outlineLink__1rY1x {\n  position: relative;\n  padding-left: 30px;\n}\n\n.ChapterItemView-module_link__2dj_z::before {\n  position: absolute;\n  right: 10px;\n  top: 7px;\n  font-size: 19px;\n  color: var(--ui-primary-color-light);\n}\n\n.ChapterItemView-module_dragHandle__GZ6T8 {\n  color: var(--ui-on-surface-color-light);\n}\n\n.ChapterItemView-module_link__2dj_z:hover .ChapterItemView-module_dragHandle__GZ6T8 {\n  opacity: 1;\n}\n\n.ChapterItemView-module_number__1GjyC {\n  font-weight: bold;\n}\n\n.ChapterItemView-module_title__3jVXE {}\n\n.ChapterItemView-module_sections__3zg2a {\n  margin: 10px 0 10px 0;\n  min-height: 20px;\n}\n\n.ChapterItemView-module_withTransitions__1t9Gv .ChapterItemView-module_sections__3zg2a {\n  margin-top: 20px;\n}\n\n.ChapterItemView-module_root__19GIF:first-child .ChapterItemView-module_sections__3zg2a {\n  margin-top: 10px;\n}\n\n.ChapterItemView-module_sections__3zg2a > .sortable-placeholder {\n  margin-top: 25px;\n  margin-bottom: 22px;\n}\n\n.ChapterItemView-module_root__19GIF:first-child .ChapterItemView-module_sections__3zg2a > li:first-child + .sortable-placeholder {\n  margin-top: 16px;\n}\n\n.ChapterItemView-module_creating__c1q2b .ChapterItemView-module_creatingIndicator__2zOEN     { display: block; }\n.ChapterItemView-module_destroying__2PP1l .ChapterItemView-module_destroyingIndicator__2YZaB { display: block; }\n.ChapterItemView-module_failed__2MtQW .ChapterItemView-module_failedIndicator__2s6Xk         { display: block; }\n\n\n.ChapterItemView-module_creatingIndicator__2zOEN   { }\n.ChapterItemView-module_destroyingIndicator__2YZaB {  }\n.ChapterItemView-module_failedIndicator__2s6Xk     { }\n\n.ChapterItemView-module_addSection__3XQvI {\n}\n";
var styles$6 = {"indicatorIconColor":"var(--ui-primary-color-light)","root":"ChapterItemView-module_root__19GIF outline-module_chapter__2J-r6","selectableHover":"ChapterItemView-module_selectableHover__222px","link":"ChapterItemView-module_link__2dj_z","outlineLink":"ChapterItemView-module_outlineLink__1rY1x icons-module_rightOpen__9vsOG icons-module_icon__16IVx ChapterItemView-module_link__2dj_z","dragHandle":"ChapterItemView-module_dragHandle__GZ6T8 outline-module_dragHandle__3ATeR icons-module_drag__p7HUE icons-module_icon__16IVx","number":"ChapterItemView-module_number__1GjyC","title":"ChapterItemView-module_title__3jVXE","sections":"ChapterItemView-module_sections__3zg2a","withTransitions":"ChapterItemView-module_withTransitions__1t9Gv","creating":"ChapterItemView-module_creating__c1q2b","creatingIndicator":"ChapterItemView-module_creatingIndicator__2zOEN outline-module_creatingIndicator__3O7Rw outline-module_indicator__2dw_X icons-module_arrowsCcw__3_nrJ icons-module_icon__16IVx animations-module_blink__32C5j","destroying":"ChapterItemView-module_destroying__2PP1l","destroyingIndicator":"ChapterItemView-module_destroyingIndicator__2YZaB outline-module_destroyingIndicator__2-mKh outline-module_indicator__2dw_X icons-module_trash__DH1EH icons-module_icon__16IVx animations-module_blink__32C5j","failed":"ChapterItemView-module_failed__2MtQW","failedIndicator":"ChapterItemView-module_failedIndicator__2s6Xk outline-module_failedIndicator__2QK1F outline-module_indicator__2dw_X icons-module_attention__1sssG icons-module_icon__16IVx","addSection":"ChapterItemView-module_addSection__3XQvI buttons-module_addButton__2pN-g buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_plusCircled__20FlJ icons-module_icon__16IVx"};
styleInject(css$6);

var ChapterItemView = Marionette.Layout.extend({
  tagName: 'li',
  className: "".concat(styles$6.root, " ").concat(styles$6.withTransitions),
  mixins: [modelLifecycleTrackingView({
    classNames: styles$6
  })],
  template: function template() {
    return "\n     <a class=\"".concat(styles$6.outlineLink, "\" href=\"\">\n       <span class=\"").concat(styles$6.dragHandle, "\"\n             title=\"").concat(I18n.t('pageflow_scrolled.editor.chapter_item.drag_hint'), "\"></span>\n       <span class=\"").concat(styles$6.number, "\"></span>\n       <span class=\"").concat(styles$6.title, "\"></span>\n       <span class=\"").concat(styles$6.creatingIndicator, "\" />\n       <span class=\"").concat(styles$6.destroyingIndicator, "\" />\n       <span class=\"").concat(styles$6.failedIndicator, "\"\n             title=\"").concat(I18n.t('pageflow_scrolled.editor.chapter_item.save_error'), "\" />\n     </a>\n\n     <ul class=\"").concat(styles$6.sections, "\"></ul>\n\n     <a href=\"\" class=\"").concat(styles$6.addSection, "\">").concat(I18n.t('pageflow_scrolled.editor.chapter_item.add_section'), "</a>\n  ");
  },
  ui: cssModulesUtils.ui(styles$6, 'title', 'number', 'sections'),
  events: cssModulesUtils.events(styles$6, {
    'click addSection': function clickAddSection() {
      this.model.addSection({}, {
        select: true
      });
    },
    'click link': function clickLink() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor$1.navigate('/scrolled/chapters/' + this.model.get('id'), {
          trigger: true
        });
      }

      return false;
    }
  }),
  modelEvents: {
    change: 'update'
  },
  onRender: function onRender() {
    this.subview(new SortableCollectionView({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SectionItemView,
      itemViewOptions: {
        entry: this.options.entry
      },
      connectWith: cssModulesUtils.selector(styles$6, 'sections')
    }));
    this.update();
  },
  update: function update() {
    this.ui.title.text(this.model.configuration.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  }
});

var css$7 = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}.buttons-module_addButton__2pN-g {\n}.buttons-module_cancelButton__1xJCN {\n}.buttons-module_saveButton__1M-qM {\n}.buttons-module_selectFileButton__khOoU {\n}\n\n.EntryOutlineView-module_root__3NBUB {}\n\n.EntryOutlineView-module_chapters__3Gr1l {}\n\n.EntryOutlineView-module_chapters__3Gr1l > .sortable-placeholder {\n  margin-bottom: 12px;\n  padding: 0 10px 10px 10px;\n  border-radius: 0.5rem;\n}\n\n.EntryOutlineView-module_addChapter__3_M-b {\n}\n";
var styles$7 = {"root":"EntryOutlineView-module_root__3NBUB","chapters":"EntryOutlineView-module_chapters__3Gr1l","addChapter":"EntryOutlineView-module_addChapter__3_M-b buttons-module_addButton__2pN-g buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_plusCircled__20FlJ icons-module_icon__16IVx"};
styleInject(css$7);

var EntryOutlineView = Marionette.Layout.extend({
  tagName: 'nav',
  className: styles$7.root,
  template: function template() {
    return "\n    <h2 class=\"sidebar-header\">".concat(I18n.t('pageflow_scrolled.editor.entry_outline.header'), "</h2>\n    <ul class=\"").concat(styles$7.chapters, "\"></ul>\n\n    <a class=\"").concat(styles$7.addChapter, "\" href=\"\">\n      ").concat(I18n.t('pageflow_scrolled.editor.entry_outline.add_chapter'), "\n    </a>\n  ");
  },
  ui: cssModulesUtils.ui(styles$7, 'chapters'),
  events: cssModulesUtils.events(styles$7, {
    'click addChapter': function clickAddChapter() {
      this.options.entry.addChapter();
    }
  }),
  onRender: function onRender() {
    this.subview(new SortableCollectionView({
      el: this.ui.chapters,
      collection: this.options.entry.chapters,
      itemViewConstructor: ChapterItemView,
      itemViewOptions: {
        entry: this.options.entry
      }
    }));
  }
});

var css$8 = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}.buttons-module_addButton__2pN-g {\n}.buttons-module_cancelButton__1xJCN {\n}.buttons-module_saveButton__1M-qM {\n}.buttons-module_selectFileButton__khOoU {\n}\n\n.dialogView-module_backdrop__2Goe6 {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 5;\n  background-color: var(--ui-backdrop-color);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.dialogView-module_box__1Tgag {\n  padding: 20px;\n  margin: 20px 0;\n  background-color: var(--ui-surface-color);\n  border-radius: 0.25rem;\n  box-shadow: var(--ui-box-shadow-md);\n}\n\n.dialogView-module_header__35Taz {\n  font-size: 17px;\n  font-weight: bold;\n  margin: 0 0 10px 0;\n}\n\n.dialogView-module_hint__2_hs9 {\n  margin-bottom: 10px;\n}\n\n.dialogView-module_footer__347pC {\n  margin-top: 10px;\n  clear: left;\n  text-align: right;\n}\n\n.dialogView-module_close__EwMQp {\n}\n";
var dialogViewStyles = {"backdrop":"dialogView-module_backdrop__2Goe6","box":"dialogView-module_box__1Tgag","header":"dialogView-module_header__35Taz","hint":"dialogView-module_hint__2_hs9","footer":"dialogView-module_footer__347pC","close":"dialogView-module_close__EwMQp buttons-module_cancelButton__1xJCN buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_cancel__1PjiX icons-module_icon__16IVx"};
styleInject(css$8);

var dialogView = {
  events: cssModulesUtils.events(dialogViewStyles, {
    'mousedown backdrop': function mousedownBackdrop() {
      this.close();
    },
    'mousedown box': function mousedownBox(event) {
      event.stopPropagation();
    },
    'click close': function clickClose() {
      this.close();
    }
  })
};

var css$9 = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}.buttons-module_addButton__2pN-g {\n}.buttons-module_cancelButton__1xJCN {\n}.buttons-module_saveButton__1M-qM {\n}.buttons-module_selectFileButton__khOoU {\n}\n\n.InsertContentElementDialogView-module_box__3sdFf {\n  max-width: 580px;\n  min-width: 200px;\n  width: 70%;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--ui-primary-color);\n  color: var(--ui-on-primary-color);\n}\n\n.InsertContentElementDialogView-module_categories__1MuZN {\n  padding: 0.25rem 0 0.25rem 0.25rem;\n  margin: -0.25rem 0 0.5rem -0.25rem;\n  overflow-y: auto;\n}\n\n.InsertContentElementDialogView-module_box__3sdFf .InsertContentElementDialogView-module_categoryName__m5BMX {\n  font-weight: 700;\n  border-bottom: solid 1px var(--ui-on-primary-color-lighter);\n  margin: 0.25rem 0;\n  padding-bottom: 0.25rem;\n}\n\n.InsertContentElementDialogView-module_types__1bK1J {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.InsertContentElementDialogView-module_item__2kSvL {\n  width: 33.3333%;\n}\n\n.InsertContentElementDialogView-module_type__27bal {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 0.5rem 0.5rem 0.5rem 2.5rem;\n  margin-bottom: 0.25rem;\n  color: inherit;\n  background-color: transparent;\n}\n\n.InsertContentElementDialogView-module_type__27bal:hover,\n.InsertContentElementDialogView-module_type__27bal:focus {\n  background-color: var(--ui-on-primary-color-lightest);\n}\n\n.InsertContentElementDialogView-module_typePictogram__1d_ak {\n  position: absolute;\n  top: 0.5rem;\n  left: 0.5rem;\n  opacity: 0.8;\n}\n\n.InsertContentElementDialogView-module_type__27bal:hover .InsertContentElementDialogView-module_typePictogram__1d_ak,\n.InsertContentElementDialogView-module_type__27bal:focus .InsertContentElementDialogView-module_typePictogram__1d_ak {\n  opacity: 1;\n}\n\n.InsertContentElementDialogView-module_typeName__1j6nc {\n  font-weight: 500;\n}\n\n.InsertContentElementDialogView-module_typeDescription__3yhqS {\n  display: block;\n  font-size: 11px;\n  color: var(--ui-on-primary-color-light);\n  margin-top: 0.25rem;\n}\n\n.InsertContentElementDialogView-module_box__3sdFf .InsertContentElementDialogView-module_close__18_6F {\n  color: inherit;\n  border-color: var(--ui-on-primary-color-lightest);\n}\n\n.InsertContentElementDialogView-module_box__3sdFf .InsertContentElementDialogView-module_close__18_6F:hover {\n  border-color: var(--ui-on-primary-color) !important;\n}\n";
var styles$8 = {"box":"InsertContentElementDialogView-module_box__3sdFf","categories":"InsertContentElementDialogView-module_categories__1MuZN","categoryName":"InsertContentElementDialogView-module_categoryName__m5BMX","types":"InsertContentElementDialogView-module_types__1bK1J","item":"InsertContentElementDialogView-module_item__2kSvL","type":"InsertContentElementDialogView-module_type__27bal buttons-module_unstyledButton__3m76W","typePictogram":"InsertContentElementDialogView-module_typePictogram__1d_ak","typeName":"InsertContentElementDialogView-module_typeName__1j6nc","typeDescription":"InsertContentElementDialogView-module_typeDescription__3yhqS","close":"InsertContentElementDialogView-module_close__18_6F"};
styleInject(css$9);

var img$1 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3c!--! Font Awesome Pro 6.1.1 by %40fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons%2c Inc. --%3e%3cpath fill='white' d='M411.4 175.5C417.4 185.4 417.5 197.7 411.8 207.8C406.2 217.8 395.5 223.1 384 223.1H192C180.5 223.1 169.8 217.8 164.2 207.8C158.5 197.7 158.6 185.4 164.6 175.5L260.6 15.54C266.3 5.897 276.8 0 288 0C299.2 0 309.7 5.898 315.4 15.54L411.4 175.5zM288 312C288 289.9 305.9 272 328 272H472C494.1 272 512 289.9 512 312V456C512 478.1 494.1 496 472 496H328C305.9 496 288 478.1 288 456V312zM0 384C0 313.3 57.31 256 128 256C198.7 256 256 313.3 256 384C256 454.7 198.7 512 128 512C57.31 512 0 454.7 0 384z'/%3e%3c/svg%3e";

var InsertContentElementDialogView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <div class=\"".concat(dialogViewStyles.backdrop, "\">\n      <div class=\"editor ").concat(dialogViewStyles.box, " ").concat(styles$8.box, "\">\n        <h1 class=\"").concat(dialogViewStyles.header, "\">").concat(I18n.t('pageflow_scrolled.editor.insert_content_element.header'), "</h1>\n        <ul class=\"").concat(styles$8.categories, "\"></ul>\n\n        <div class=\"").concat(dialogViewStyles.footer, "\">\n          <button class=\"").concat(dialogViewStyles.close, " ").concat(styles$8.close, "\">\n            ").concat(I18n.t('pageflow_scrolled.editor.insert_content_element.cancel'), "\n          </button>\n        </div>\n      </div>\n    </div>\n  ");
  },
  ui: cssModulesUtils.ui(styles$8, 'categories'),
  mixins: [dialogView],
  events: {
    'click li button': function clickLiButton() {
      this.close();
    }
  },
  onRender: function onRender() {
    this.subview(new CollectionView({
      el: this.ui.categories,
      collection: new Backbone$1.Collection(this.options.editor.contentElementTypes.groupedByCategory()),
      itemViewConstructor: CategoryView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  }
});
var CategoryView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles$8.category,
  template: function template(_ref) {
    var displayName = _ref.displayName;
    return "\n    <h2 class=\"".concat(styles$8.categoryName, "\">").concat(displayName, "</h2>\n    <ul class=\"").concat(styles$8.types, "\">\n    </ul>\n  ");
  },
  ui: cssModulesUtils.ui(styles$8, 'types'),
  onRender: function onRender() {
    this.subview(new CollectionView({
      el: this.ui.types,
      collection: new Backbone$1.Collection(this.model.get('contentElementTypes')),
      itemViewConstructor: ItemView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  }
});
var ItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles$8.item,
  template: function template(_ref2) {
    var displayName = _ref2.displayName,
        description = _ref2.description,
        pictogram = _ref2.pictogram;
    return "\n    <button class=\"".concat(styles$8.type, "\">\n      <img class=\"").concat(styles$8.typePictogram, "\" src=\"").concat(pictogram || img$1, "\" width=\"20\" height=\"20\" />\n      <span class=\"").concat(styles$8.typeName, "\">").concat(displayName, "</span>\n      <span class=\"").concat(styles$8.typeDescription, "\">").concat(description, "</span>\n    </button>\n  ");
  },
  events: {
    'click button': function clickButton() {
      this.options.entry.insertContentElement({
        typeName: this.model.get('typeName')
      }, this.options.insertOptions);
    }
  }
});

InsertContentElementDialogView.show = function (options) {
  var view = new InsertContentElementDialogView(options);
  app.dialogRegion.show(view.render());
};

var SelectableSectionItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: "".concat(styles$5.root, " ").concat(styles$5.selectable),
  template: function template(data) {
    return "\n  <div class=\"".concat(styles$5.thumbnailContainer, "\">\n    <div class=\"").concat(styles$5.thumbnail, "\"></div>\n    <a class=\"").concat(styles$5.clickMask, "\"\n       href=\"\"\n       title=\"").concat(I18n.t("pageflow_scrolled.editor.selectable_section_item.title"), "\">\n    </a>\n  </div>\n  ");
  },
  ui: cssModulesUtils.ui(styles$5, 'thumbnail'),
  events: _defineProperty({}, "click .".concat(styles$5.clickMask), function click(event) {
    event.preventDefault();
    this.options.onSelect(this.model);
  }),
  onRender: function onRender() {
    this.subview(new SectionThumbnailView({
      el: this.ui.thumbnail,
      model: this.model,
      entry: this.options.entry
    }));
  }
});

var SelectableChapterItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles$6.root,
  template: function template() {
    return "\n     <a class=\"".concat(styles$6.link, "\"\n        href=\"\"\n        title=\"").concat(I18n.t("pageflow_scrolled.editor.selectable_chapter_item.title"), "\">\n       <span class=\"").concat(styles$6.number, "\"></span>\n       <span class=\"").concat(styles$6.title, "\"></span>\n     </a>\n\n     <ul class=\"").concat(styles$6.sections, "\"></ul>\n     ");
  },
  ui: cssModulesUtils.ui(styles$6, 'title', 'number', 'sections'),
  events: cssModulesUtils.events(styles$6, {
    'click link': function clickLink(event) {
      event.preventDefault();
      return this.options.onSelectChapter(this.model);
    },
    'mouseenter link': function mouseenterLink() {
      this.$el.addClass(styles$6.selectableHover);
    },
    'mouseleave link': function mouseleaveLink() {
      this.$el.removeClass(styles$6.selectableHover);
    }
  }),
  modelEvents: {
    change: 'update'
  },
  onRender: function onRender() {
    this.subview(new CollectionView$1({
      el: this.ui.sections,
      collection: this.model.sections,
      itemViewConstructor: SelectableSectionItemView,
      itemViewOptions: {
        entry: this.options.entry,
        onSelect: this.options.onSelectSection
      }
    }));
    this.update();
  },
  update: function update() {
    this.ui.title.text(this.model.configuration.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  }
});

var css$a = ".SelectableEntryOutlineView-module_chapters__2v35W {\n  max-width: 300px;\n  margin: 0 auto;\n}\n";
var styles$9 = {"chapters":"SelectableEntryOutlineView-module_chapters__2v35W"};
styleInject(css$a);

var SelectableEntryOutlineView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <ul class=\"".concat(styles$9.chapters, "\"></ul>\n  ");
  },
  ui: cssModulesUtils.ui(styles$9, 'chapters'),
  onRender: function onRender() {
    this.subview(new CollectionView$1({
      el: this.ui.chapters,
      collection: this.options.entry.chapters,
      itemViewConstructor: SelectableChapterItemView,
      itemViewOptions: {
        entry: this.options.entry,
        onSelectChapter: this.options.onSelectChapter,
        onSelectSection: this.options.onSelectSection
      }
    }));
  }
});

var css$b = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}.buttons-module_addButton__2pN-g {\n}.buttons-module_cancelButton__1xJCN {\n}.buttons-module_saveButton__1M-qM {\n}.buttons-module_selectFileButton__khOoU {\n}\n\n.SelectLinkDestinationDialogView-module_box__1mIW3 {\n  display: flex;\n  flex-direction: column;\n  width: 40%;\n  min-width: 400px;\n  max-width: 700px;\n}\n\n.SelectLinkDestinationDialogView-module_urlContainer__2bty0 {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  white-space: nowrap;\n}\n\n.SelectLinkDestinationDialogView-module_urlContainer__2bty0 > :first-child {\n  width: 100%;\n}\n\n.SelectLinkDestinationDialogView-module_or__3U4Ky {\n  position: relative;\n  margin: 0 auto 1rem;\n  padding: 0 0.5rem;\n  color: var(--ui-on-surface-color-light);\n}\n\n.SelectLinkDestinationDialogView-module_or__3U4Ky::before,\n.SelectLinkDestinationDialogView-module_or__3U4Ky::after {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: 50%;\n  width: 2rem;\n  border-top: solid 1px var(--ui-on-surface-color-lighter);\n}\n\n.SelectLinkDestinationDialogView-module_or__3U4Ky::before {\n  right: 100%;\n}\n\n.SelectLinkDestinationDialogView-module_or__3U4Ky::after {\n  left: 100%;\n}\n\n.SelectLinkDestinationDialogView-module_urlContainer__2bty0,\n.SelectLinkDestinationDialogView-module_openInNewTabContainer__2R6Ev {\n  width: 100%;\n}\n\n.SelectLinkDestinationDialogView-module_createButton__KxILH {\n}\n\n.SelectLinkDestinationDialogView-module_outlineContainer__1niKf {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 0.5rem;\n  overflow: auto;\n}\n\n.SelectLinkDestinationDialogView-module_fileContainer__29VBM {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  margin-bottom: 1rem;\n}\n\n.SelectLinkDestinationDialogView-module_fileContainer__29VBM > :first-child {\n  flex: 1\n}\n\n.SelectLinkDestinationDialogView-module_fileTypeButtonContainer__2RVtt {}\n\n.SelectLinkDestinationDialogView-module_fileTypeButton__BWBxM {\n}\n";
var styles$a = {"box":"SelectLinkDestinationDialogView-module_box__1mIW3","urlContainer":"SelectLinkDestinationDialogView-module_urlContainer__2bty0","or":"SelectLinkDestinationDialogView-module_or__3U4Ky","openInNewTabContainer":"SelectLinkDestinationDialogView-module_openInNewTabContainer__2R6Ev","createButton":"SelectLinkDestinationDialogView-module_createButton__KxILH buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx","outlineContainer":"SelectLinkDestinationDialogView-module_outlineContainer__1niKf","fileContainer":"SelectLinkDestinationDialogView-module_fileContainer__29VBM","fileTypeButtonContainer":"SelectLinkDestinationDialogView-module_fileTypeButtonContainer__2RVtt","fileTypeButton":"SelectLinkDestinationDialogView-module_fileTypeButton__BWBxM buttons-module_selectFileButton__khOoU buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_rightOpen__9vsOG icons-module_icon__16IVx"};
styleInject(css$b);

var SelectLinkDestinationDialogView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <div class=\"".concat(dialogViewStyles.backdrop, "\">\n      <div class=\"editor ").concat(dialogViewStyles.box, " ").concat(styles$a.box, "\">\n        <h1 class=\"").concat(dialogViewStyles.header, "\">").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.header'), "</h1>\n\n        <form class=\"").concat(styles$a.urlContainer, " configuration_editor_tab\">\n          <div><button class=\"").concat(styles$a.createButton, "\">\n            ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.create'), "\n          </button></div>\n        </form>\n\n        <div class=\"").concat(styles$a.or, "\">\n          ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.or'), "\n        </div>\n\n        <div class=\"").concat(styles$a.fileContainer, "\">\n          <div>\n            <label><span class=\"name\">\n              ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.select_file'), "\n            </span></label>\n            <div>\n              ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.select_file_description'), "\n            </div>\n          </div>\n          <div class=\"").concat(styles$a.fileTypeButtonContainer, "\">\n          </div>\n        </div>\n\n        <div class=\"").concat(styles$a.or, "\">\n          ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.or'), "\n        </div>\n\n        <label><span class=\"name\">\n          ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.select_chapter_or_section'), "\n        </span></label>\n        <div class=\"").concat(styles$a.outlineContainer, "\"></div>\n\n        <div class=\"").concat(dialogViewStyles.footer, "\">\n          <button type=\"submit\" class=\"").concat(dialogViewStyles.close, " ").concat(styles$a.close, "\">\n            ").concat(I18n.t('pageflow_scrolled.editor.select_link_destination.cancel'), "\n          </button>\n        </div>\n      </div>\n    </div>\n  ");
  },
  ui: cssModulesUtils.ui(styles$a, 'urlContainer', 'outlineContainer', 'fileTypeButtonContainer'),
  mixins: [dialogView],
  events: cssModulesUtils.events(styles$a, {
    'submit urlContainer': function submitUrlContainer(event) {
      event.preventDefault();
      this.createExternalLink();
    }
  }),
  createExternalLink: function createExternalLink() {
    if (!this.externalLink.get('url')) {
      this.$el.find('input[type=text]').focus();
      return;
    }

    var link = {
      href: this.externalLink.get('url')
    };

    if (this.externalLink.get('openInNewTab')) {
      link.openInNewTab = true;
    }

    this.options.onSelect(link);
    this.close();
  },
  onRender: function onRender() {
    var _this = this;

    this.externalLink = new Backbone$1.Model();
    this.externalLink.modelName = 'externalLink';
    this.ui.urlContainer.prepend(this.subview(new CheckBoxInputView({
      model: this.externalLink,
      propertyName: 'openInNewTab',
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
    })).el);
    this.ui.urlContainer.prepend(this.subview(new TextInputView({
      model: this.externalLink,
      propertyName: 'url',
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.enter_url')
    })).el);
    this.ui.fileTypeButtonContainer.append(this.subview(new DropDownButtonView({
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.select_in_sidebar'),
      buttonClassName: styles$a.fileTypeButton,
      alignMenu: 'right',
      items: new FileTypeItemCollection(this.options.fileTypes.filter(function (fileType) {
        return fileType.topLevelType;
      }).map(function (fileType) {
        return {
          label: I18n.t("pageflow.editor.file_types.".concat(fileType.collectionName, ".name.one")),
          collectionName: fileType.collectionName
        };
      }), {
        onSelect: function onSelect(collectionName) {
          currentFileSelectionCallback = function currentFileSelectionCallback(file) {
            _this.options.onSelect({
              href: {
                file: {
                  permaId: file.get('perma_id'),
                  collectionName: utils.camelize(file.fileType().collectionName)
                }
              }
            });
          };

          editor$1.selectFile({
            defaultTab: collectionName
          }, 'linkDestination', {});

          _this.close();
        }
      })
    })).el);
    this.ui.outlineContainer.append(this.subview(new SelectableEntryOutlineView({
      entry: this.options.entry,
      onSelectChapter: function onSelectChapter(chapter) {
        _this.options.onSelect({
          href: {
            chapter: chapter.get("permaId")
          }
        });

        _this.close();
      },
      onSelectSection: function onSelectSection(section) {
        _this.options.onSelect({
          href: {
            section: section.get("permaId")
          }
        });

        _this.close();
      }
    })).el);
  }
});

SelectLinkDestinationDialogView.show = function (options) {
  var view = new SelectLinkDestinationDialogView(_objectSpread2({
    fileTypes: editor$1.fileTypes
  }, options));
  app.dialogRegion.show(view.render());
};

var currentFileSelectionCallback;

var FileSelectionHandler$1 = function FileSelectionHandler(options) {
  this.call = function (file) {
    currentFileSelectionCallback(file);
  };

  this.getReferer = function () {
    return '/';
  };
};

editor$1.registerFileSelectionHandler('linkDestination', FileSelectionHandler$1);
var FileTypeItemModel = Backbone$1.Model.extend({
  initialize: function initialize(attributes, options) {
    this.onSelect = options.onSelect;
  },
  selected: function selected() {
    this.onSelect(this.get('collectionName'));
  }
});
var FileTypeItemCollection = Backbone$1.Collection.extend({
  model: FileTypeItemModel
});

var PreviewMessageController = Object$1.extend({
  initialize: function initialize(_ref) {
    var entry = _ref.entry,
        iframeWindow = _ref.iframeWindow,
        editor = _ref.editor;
    this.entry = entry;
    this.iframeWindow = iframeWindow;
    this.editor = editor;
    this.listener = this.handleMessage.bind(this);
    window.addEventListener('message', this.listener);
  },
  dispose: function dispose() {
    window.removeEventListener('message', this.listener);
  },
  handleMessage: function handleMessage(message) {
    var _this = this;

    var postMessage = function postMessage(message) {
      _this.iframeWindow.postMessage(message, window.location.origin);
    };

    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'READY') {
        watchCollections(this.entry, {
          dispatch: function dispatch(action) {
            postMessage({
              type: 'ACTION',
              payload: action
            });
          }
        });
        this.listenTo(this.entry, 'scrollToSection', function (section) {
          return postMessage({
            type: 'SCROLL_TO_SECTION',
            payload: {
              index: _this.entry.sections.indexOf(section)
            }
          });
        });
        this.listenTo(this.entry.contentElements, 'postCommand', function (contentElementId, command) {
          return postMessage({
            type: 'CONTENT_ELEMENT_EDITOR_COMMAND',
            payload: {
              contentElementId: contentElementId,
              command: command
            }
          });
        });
        this.listenTo(this.entry, 'selectSection', function (section) {
          return postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'section'
            }
          });
        });
        this.listenTo(this.entry, 'selectSectionSettings', function (section) {
          return postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionSettings'
            }
          });
        });
        this.listenTo(this.entry, 'selectSectionTransition', function (section) {
          return postMessage({
            type: 'SELECT',
            payload: {
              id: section.id,
              type: 'sectionTransition'
            }
          });
        });
        this.listenTo(this.entry, 'selectContentElement', function (contentElement, options) {
          postMessage({
            type: 'SELECT',
            payload: {
              id: contentElement.id,
              range: options === null || options === void 0 ? void 0 : options.range,
              type: 'contentElement'
            }
          });
        });
        this.listenTo(this.entry, 'resetSelection', function (contentElement) {
          return postMessage({
            type: 'SELECT',
            payload: null
          });
        });
        this.listenTo(this.entry, 'change:emulation_mode', function (entry) {
          return postMessage({
            type: 'CHANGE_EMULATION_MODE',
            payload: _this.entry.get('emulation_mode')
          });
        });
        postMessage({
          type: 'ACK'
        });
      } else if (message.data.type === 'CHANGE_SECTION') {
        this.entry.set('currentSectionIndex', message.data.payload.index);
      } else if (message.data.type === 'SELECTED') {
        var _message$data$payload = message.data.payload,
            type = _message$data$payload.type,
            id = _message$data$payload.id;

        if (type === 'contentElement') {
          this.editor.navigate("/scrolled/content_elements/".concat(id), {
            trigger: true
          });
        } else if (type === 'sectionSettings') {
          this.editor.navigate("/scrolled/sections/".concat(id), {
            trigger: true
          });
        } else if (type === 'sectionTransition') {
          this.editor.navigate("/scrolled/sections/".concat(id, "/transition"), {
            trigger: true
          });
        } else {
          this.editor.navigate('/', {
            trigger: true
          });
        }
      } else if (message.data.type === 'SELECT_LINK_DESTINATION') {
        SelectLinkDestinationDialogView.show({
          entry: this.entry,
          onSelect: function onSelect(result) {
            postMessage({
              type: 'LINK_DESTINATION_SELECTED',
              payload: result
            });
          }
        });
      } else if (message.data.type === 'INSERT_CONTENT_ELEMENT') {
        var _message$data$payload2 = message.data.payload,
            _id = _message$data$payload2.id,
            at = _message$data$payload2.at,
            splitPoint = _message$data$payload2.splitPoint;
        InsertContentElementDialogView.show({
          entry: this.entry,
          insertOptions: {
            at: at,
            id: _id,
            splitPoint: splitPoint
          },
          editor: this.editor
        });
      } else if (message.data.type === 'MOVE_CONTENT_ELEMENT') {
        var _message$data$payload3 = message.data.payload,
            _id2 = _message$data$payload3.id,
            range = _message$data$payload3.range,
            to = _message$data$payload3.to;
        this.entry.moveContentElement({
          id: _id2,
          range: range
        }, to);
      } else if (message.data.type === 'UPDATE_CONTENT_ELEMENT') {
        var _message$data$payload4 = message.data.payload,
            _id3 = _message$data$payload4.id,
            configuration = _message$data$payload4.configuration;
        this.entry.contentElements.get(_id3).configuration.set(configuration, {
          ignoreInWatchCollection: true
        });
      } else if (message.data.type === 'UPDATE_TRANSIENT_CONTENT_ELEMENT_STATE') {
        var _message$data$payload5 = message.data.payload,
            _id4 = _message$data$payload5.id,
            state = _message$data$payload5.state;
        this.entry.contentElements.get(_id4).set('transientState', state);
      } else if (message.data.type === 'SAVED_SCROLL_POINT' && this.currentScrollPointCallback) {
        this.currentScrollPointCallback();
        this.currentScrollPointCallback = null;
        setTimeout(function () {
          return postMessage({
            type: 'RESTORE_SCROLL_POINT'
          });
        }, 100);
      }
    }
  },
  preserveScrollPoint: function preserveScrollPoint(callback) {
    this.currentScrollPointCallback = callback;
    this.iframeWindow.postMessage({
      type: 'SAVE_SCROLL_POINT'
    }, window.location.origin);
  }
});

var css$c = ".BlankEntryView-module_blankEntry__2FcvR {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background-color: #ffff;\n  color: #000;\n}\n";
var styles$b = {"blankEntry":"BlankEntryView-module_blankEntry__2FcvR"};
styleInject(css$c);

var BlankEntryView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <div class=\"blank_entry\">\n      <h2>".concat(t('pageflow_scrolled.editor.blank_entry.header'), "</h2>\n      <p>").concat(t('pageflow_scrolled.editor.blank_entry.intro'), "</p>\n      <ol>\n        <li>").concat(t('pageflow_scrolled.editor.blank_entry.create_chapter'), "</li>\n        <li>").concat(t('pageflow_scrolled.editor.blank_entry.create_section'), "</li>\n        <li>").concat(t('pageflow_scrolled.editor.blank_entry.create_content_element'), "</li>\n      </ol>\n      <p>").concat(t('pageflow_scrolled.editor.blank_entry.outro'), "</p>\n    </div>\n  ");
  },
  className: styles$b.blankEntry,
  onRender: function onRender() {
    this.listenTo(this.model.sections, 'add remove', this.update);
    this.update();
  },
  update: function update() {
    this.$el.toggle(!this.model.sections.length);
  }
});

var css$d = ".EntryPreviewView-module_root__1Nb6e {\n  height: 100%;\n  width: 100%;\n  background-color: #222;\n}\n\n.EntryPreviewView-module_iframe__1leJC {\n  border: none;\n  width: 100%;\n  height: 100%;\n}\n\n.EntryPreviewView-module_phoneEmulationMode__3YXy_ {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.EntryPreviewView-module_phoneEmulationMode__3YXy_ .EntryPreviewView-module_iframe__1leJC {\n  width: 400px;\n  height: 700px;\n  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 4px 0px;\n}\n";
var styles$c = {"root":"EntryPreviewView-module_root__1Nb6e","iframe":"EntryPreviewView-module_iframe__1leJC","phoneEmulationMode":"EntryPreviewView-module_phoneEmulationMode__3YXy_"};
styleInject(css$d);

var EntryPreviewView = Marionette.ItemView.extend({
  template: function template() {
    return "\n     <iframe class=\"".concat(styles$c.iframe, "\" />\n  ");
  },
  className: styles$c.root,
  ui: cssModulesUtils.ui(styles$c, 'iframe'),
  modelEvents: {
    'change:emulation_mode': 'updateEmulationMode'
  },
  onRender: function onRender() {
    this.appendSubview(new BlankEntryView({
      model: this.model
    }));
  },
  onShow: function onShow() {
    this.messageController = new PreviewMessageController({
      entry: this.model,
      editor: this.options.editor,
      iframeWindow: this.ui.iframe[0].contentWindow
    });
    inject(this.ui.iframe[0], unescape($('[data-template="iframe_seed"]').html()));
  },
  onClose: function onClose() {
    this.messageController.dispose();
  },
  updateEmulationMode: function updateEmulationMode() {
    var _this = this;

    this.messageController.preserveScrollPoint(function () {
      if (_this.model.previous('emulation_mode')) {
        _this.$el.removeClass(styles$c[_this.emulationModeClassName(_this.model.previous('emulation_mode'))]);
      }

      if (_this.model.get('emulation_mode')) {
        _this.$el.addClass(styles$c[_this.emulationModeClassName(_this.model.get('emulation_mode'))]);
      }
    });
  },
  emulationModeClassName: function emulationModeClassName(mode) {
    return "".concat(mode, "EmulationMode");
  }
});

function inject(iframe, html) {
  var doc = iframe.document || iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.writeln(html);
  doc.close();
}

function unescape(text) {
  return text.replace(/<\\\//g, '</');
}

var SideBarRouter = Marionette.AppRouter.extend({
  appRoutes: {
    'scrolled/chapters/:id': 'chapter',
    'scrolled/sections/:id/transition': 'sectionTransition',
    'scrolled/sections/:id': 'section',
    'scrolled/content_elements/:id': 'contentElement'
  }
});

var EditChapterView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_chapter',
  configure: function configure(configurationEditor) {
    configurationEditor.tab('chapter', function () {
      this.input('title', TextInputView);
      this.input('summary', TextAreaInputView, {
        disableLinks: true
      });
    });
  }
});

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

var TYPES = {
  blur: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'filter'
  },
  brightness: {
    minValue: -100,
    maxValue: 100,
    defaultValue: -20,
    kind: 'filter'
  },
  contrast: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  grayscale: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  saturate: {
    minValue: -100,
    maxValue: 100,
    defaultValue: 20,
    kind: 'filter'
  },
  sepia: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 100,
    kind: 'filter'
  },
  autoZoom: {
    minValue: 1,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  },
  scrollParallax: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    kind: 'animation'
  }
};
var Effect = Backbone$1.Model.extend({
  initialize: function initialize(_ref) {
    var name = _ref.name;

    if (!this.has('value')) {
      this.set('value', TYPES[name].defaultValue);
    }
  },
  label: function label() {
    return Effect.getLabel(this.get('name'));
  },
  minValue: function minValue() {
    return TYPES[this.get('name')].minValue;
  },
  maxValue: function maxValue() {
    return TYPES[this.get('name')].maxValue;
  }
});
Effect.names = Object.keys(TYPES);

Effect.getLabel = function (name) {
  return I18n.t("pageflow_scrolled.editor.backdrop_effects.".concat(name, ".label"));
};

Effect.getKind = function (name) {
  return TYPES[name].kind;
};

var EffectsCollection = Backbone$1.Collection.extend({
  model: Effect,
  getUnusedEffects: function getUnusedEffects() {
    var _this = this;

    var effects = this;
    var unusedEffects = new Backbone$1.Collection(Effect.names.filter(function (name) {
      return !_this.findWhere({
        name: name
      });
    }).map(function (name) {
      return {
        name: name
      };
    }), {
      comparator: function comparator(effect) {
        return Effect.names.indexOf(effect.get('name'));
      },
      model: Backbone$1.Model.extend({
        initialize: function initialize(_ref) {
          var name = _ref.name;
          this.set('label', Effect.getLabel(name));
        },
        selected: function selected() {
          effects.add({
            name: this.get('name')
          });
        }
      })
    });
    this.listenTo(this, 'add', function (effect) {
      return unusedEffects.remove(unusedEffects.findWhere({
        name: effect.get('name')
      }));
    });
    this.listenTo(this, 'remove', function (effect) {
      return unusedEffects.add({
        name: effect.get('name')
      });
    });
    this.listenTo(unusedEffects, 'add remove', function () {
      return updateSeparation(unusedEffects);
    });
    updateSeparation(unusedEffects);
    return unusedEffects;
  }
});

function updateSeparation(effects) {
  effects.reduce(function (previous, effect) {
    effect.set('separated', previous && Effect.getKind(effect.get('name')) !== Effect.getKind(previous.get('name')));
    return effect;
  }, null);
}

var css$e = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}\n\n.EffectListInputView-module_view__3mFXb {\n  position: relative;\n  margin-top: -0.25rem !important;\n}\n\n.EffectListInputView-module_view__3mFXb::before {\n  position: absolute;\n  bottom: 0.25rem;\n  right: 0.375rem;\n  color: var(--ui-primary-color);\n}\n\n.EffectListInputView-module_allUsed__1p1Re::before,\n.EffectListInputView-module_allUsed__1p1Re .drop_down_button {\n  display: none;\n}\n\n.EffectListInputView-module_view__3mFXb .drop_down_button button.has_icon_and_text {\n  font-size: 0.75rem;\n  font-weight: normal;\n  padding: 0.25rem;\n  text-align: left;\n  border-color: var(--ui-on-surface-color-lightest);\n  color: var(--ui-on-surface-color-light);\n}\n\n.EffectListInputView-module_view__3mFXb .drop_down_button button.hover {\n  border-color: var(--ui-primary-color-light) !important;\n}\n\n.EffectListInputView-module_item__1nXWR {\n  display: flex;\n  padding: 0.25rem 0 0.25rem 0.25rem;\n  border-radius: 0.25rem;\n  align-items: center;\n  border: solid 1px var(--ui-on-surface-color-lightest);\n  margin-bottom: 0.25rem;\n}\n\n.EffectListInputView-module_label__2Us_Y,\n.EffectListInputView-module_value__1i9Cv {\n  font-size: 0.75rem;\n}\n\n.EffectListInputView-module_label__2Us_Y {\n  margin-right: 0.5rem;\n  width: 33%;\n}\n\n.EffectListInputView-module_value__1i9Cv {\n  width: 3em;\n}\n\n.EffectListInputView-module_widget__gs7W6 {\n  margin: 0 0.5rem;\n  flex: 1;\n  height: 0.25rem;\n  position: relative;\n  border-color: var(--ui-on-surface-color-lighter);\n}\n\n.EffectListInputView-module_centerZero__3e86T::before,\n.EffectListInputView-module_centerZero__3e86T::after {\n  content: \"\";\n  position: absolute;\n  left: 50%;\n  height: 0.25rem;\n  border-left: solid 1px var(--ui-on-surface-color-lighter);\n}\n\n.EffectListInputView-module_centerZero__3e86T::before {\n  bottom: 155%;\n}\n\n.EffectListInputView-module_centerZero__3e86T::after {\n  top: 155%;\n}\n\n.EffectListInputView-module_widget__gs7W6 .ui-slider-handle {\n  left: 0%;\n  top: -0.3rem;\n  height: 0.75rem;\n  width: 0.75rem;\n  margin-left: -0.375rem;\n  outline-width: 2px;\n}\n\n.EffectListInputView-module_remove__2fiu5 {\n  padding: 0 0.5rem;\n  border: 0;\n  color: var(--ui-primary-color);\n  background-color: transparent;\n  cursor: pointer;\n  opacity: 0.7;\n}\n\n.EffectListInputView-module_remove__2fiu5:hover,\n.EffectListInputView-module_remove__2fiu5:focus {\n  opacity: 1;\n}\n";
var styles$d = {"view":"EffectListInputView-module_view__3mFXb icons-module_plusCircled__20FlJ icons-module_icon__16IVx","allUsed":"EffectListInputView-module_allUsed__1p1Re","item":"EffectListInputView-module_item__1nXWR","label":"EffectListInputView-module_label__2Us_Y","value":"EffectListInputView-module_value__1i9Cv","widget":"EffectListInputView-module_widget__gs7W6","centerZero":"EffectListInputView-module_centerZero__3e86T","remove":"EffectListInputView-module_remove__2fiu5 icons-module_cancel__1PjiX icons-module_icon__16IVx"};
styleInject(css$e);

var EffectListInputView = Marionette.ItemView.extend({
  className: styles$d.view,
  template: function template() {
    return '';
  },
  mixins: [inputView],
  initialize: function initialize() {
    var _this = this;

    this.effects = new EffectsCollection(this.model.get(this.options.propertyName));
    this.listenTo(this.effects, 'add remove change', function () {
      _this.model.set(_this.options.propertyName, _this.effects.toJSON());
    });
  },
  onRender: function onRender() {
    var _this2 = this;

    this.appendSubview(new CollectionView$1({
      itemViewConstructor: EffectListItemView,
      itemViewOptions: {
        effects: this.effects
      },
      collection: this.effects
    }));
    var unusedEffects = this.effects.getUnusedEffects();
    this.appendSubview(new DropDownButtonView({
      label: I18n.t('pageflow_scrolled.editor.effect_list_input.add'),
      fullWidth: true,
      openOnClick: true,
      items: unusedEffects
    }));

    var update = function update() {
      return _this2.$el.toggleClass(styles$d.allUsed, unusedEffects.length === 0);
    };

    update();
    this.listenTo(unusedEffects, 'add remove', update);
  }
});
var EffectListItemView = Marionette.ItemView.extend({
  className: styles$d.item,
  template: function template(data) {
    return "\n    <div class=\"".concat(styles$d.label, "\">").concat(data.label, "</div>\n    <div class=\"").concat(styles$d.value, "\"></div>\n    <div class=\"").concat(styles$d.widget, "\"></div>\n    <button class=\"").concat(styles$d.remove, "\"\n            title=\"").concat(I18n.t('pageflow_scrolled.editor.effect_list_input.remove'), "\">\n    </button>\n  ");
  },
  serializeData: function serializeData() {
    return {
      label: this.model.label()
    };
  },
  ui: cssModulesUtils.ui(styles$d, 'widget', 'value'),
  events: cssModulesUtils.events(styles$d, {
    'click remove': function clickRemove() {
      this.options.effects.remove(this.model);
    },
    'slidechange widget': function slidechangeWidget() {
      var value = this.ui.widget.slider('option', 'value');
      this.ui.value.text(value);
      this.model.set('value', value);
    }
  }),
  onRender: function onRender() {
    this.ui.widget.toggleClass(styles$d.centerZero, this.model.minValue() < 0);
    this.ui.widget.slider({
      animate: 'fast',
      min: this.model.minValue(),
      max: this.model.maxValue()
    });
    this.ui.widget.slider('option', 'value', this.model.get('value') || 50);
  }
});

var InlineFileRightsMenuItem = Backbone$1.Model.extend({
  defaults: {
    name: 'hideInlineFileRights',
    kind: 'checkBox'
  },
  initialize: function initialize(attributes, _ref) {
    var _this = this;

    var inputModel = _ref.inputModel,
        propertyName = _ref.propertyName,
        file = _ref.file;
    this.set('label', I18n.t('pageflow_scrolled.editor.inline_file_rights_menu_item.label'));
    var flagPropertyName = propertyName === 'id' ? 'inlineRightsHidden' : "".concat(propertyName.replace('Id', ''), "InlineRightsHidden");

    var update = function update() {
      _this.set('hidden', !file.get('rights') || file.configuration.get('rights_display') !== 'inline');

      _this.set('checked', !!inputModel.get(flagPropertyName));
    };

    this.listenTo(inputModel, "change:".concat(flagPropertyName), update);
    this.listenTo(file, 'change:rights', update);
    this.listenTo(file.configuration, "change:rights_display", update);
    update();

    this.selected = function () {
      inputModel.set(flagPropertyName, !inputModel.get(flagPropertyName));
    };
  }
});

var css$f = ".imgareaselect-border1,\n.imgareaselect-border2,\n.imgareaselect-border3,\n.imgareaselect-border4 {\n  opacity: 0.5;\n}\n\n.imgareaselect-handle {\n  background-color: #fff;\n  border: solid 1px #000;\n  opacity: 0.5;\n}\n\n.imgareaselect-outer {\n  background-color: #000;\n  opacity: 0.5;\n}\n";
styleInject(css$f);

// version 0.9.10
//
// Copyright (c) 2008-2013 Michal Wojciechowski (odyniec.net)
//
// Dual licensed under the MIT (MIT-LICENSE.txt)
// and GPL (GPL-LICENSE.txt) licenses.
//
// http://odyniec.net/projects/imgareaselect/

(function ($) {
  //
  // Math functions will be used extensively, so it's convenient to make a few
  // shortcuts
  //
  var abs = Math.abs,
      max = Math.max,
      min = Math.min,
      round = Math.round; //
  // Create a new HTML div element
  //
  // @return A jQuery object representing the new element
  //

  function div() {
    return $('<div/>');
  } //
  // imgAreaSelect initialization
  //
  // @param img
  //            A HTML image element to attach the plugin to
  // @param options
  //            An options object
  //


  $.imgAreaSelect = function (img, options) {
    var
    /* jQuery object representing the image */
    $img = $(img),

    /* Has the image finished loading? */
    imgLoaded,

    /* Plugin elements */

    /* Container box */
    $box = div(),

    /* Selection area */
    $area = div(),

    /* Border (four divs) */
    $border = div().add(div()).add(div()).add(div()),

    /* Outer area (four divs) */
    $outer = div().add(div()).add(div()).add(div()),

    /* Handles (empty by default, initialized in setOptions()) */
    $handles = $([]),

    /*
     * Additional element to work around a cursor problem in Opera
     * (explained later)
     */
    $areaOpera,

    /* Image position (relative to viewport) */
    left,
        top,

    /* Image offset (as returned by .offset()) */
    imgOfs = {
      left: 0,
      top: 0
    },

    /* Image dimensions (as returned by .width() and .height()) */
    imgWidth,
        imgHeight,
        gridX,
        gridY,
        gridSteps = 20,

    /*
     * jQuery object representing the parent element that the plugin
     * elements are appended to
     */
    $parent,

    /* Parent element offset (as returned by .offset()) */
    parOfs = {
      left: 0,
      top: 0
    },

    /* Base z-index for plugin elements */
    zIndex = 0,

    /* Plugin elements position */
    position = 'absolute',

    /* X/Y coordinates of the starting point for move/resize operations */
    startX,
        startY,

    /* Horizontal and vertical scaling factors */
    scaleX,
        scaleY,

    /* Current resize mode ("nw", "se", etc.) */
    resize,

    /* Selection area constraints */
    minWidth,
        minHeight,
        maxWidth,
        maxHeight,

    /* Aspect ratio to maintain (floating point number) */
    aspectRatio,

    /* Are the plugin elements currently displayed? */
    shown,

    /* Current selection (relative to parent element) */
    x1,
        y1,
        x2,
        y2,

    /* Current selection (relative to scaled image) */
    selection = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      width: 0,
      height: 0
    },

    /* Document element */
    docElem = document.documentElement,

    /* User agent */
    ua = navigator.userAgent,

    /* Various helper variables used throughout the code */
    $p,
        d,
        i,
        o,
        w,
        h,
        adjusted;
    /*
     * Translate selection coordinates (relative to scaled image) to viewport
     * coordinates (relative to parent element)
     */
    //
    // Translate selection X to viewport X
    //
    // @param x
    //            Selection X
    // @return Viewport X
    //

    function viewX(x) {
      return x + imgOfs.left - parOfs.left;
    } //
    // Translate selection Y to viewport Y
    //
    // @param y
    //            Selection Y
    // @return Viewport Y
    //


    function viewY(y) {
      return y + imgOfs.top - parOfs.top;
    }
    /*
     * Translate viewport coordinates to selection coordinates
     */
    //
    // Translate viewport X to selection X
    //
    // @param x
    //            Viewport X
    // @return Selection X
    //


    function selX(x) {
      return x - imgOfs.left + parOfs.left;
    } //
    // Translate viewport Y to selection Y
    //
    // @param y
    //            Viewport Y
    // @return Selection Y
    //


    function selY(y) {
      return y - imgOfs.top + parOfs.top;
    }
    /*
     * Translate event coordinates (relative to document) to viewport
     * coordinates
     */
    //
    // Get event X and translate it to viewport X
    //
    // @param event
    //            The event object
    // @return Viewport X
    //


    function evX(event) {
      return event.pageX - parOfs.left;
    } //
    // Get event Y and translate it to viewport Y
    //
    // @param event
    //            The event object
    // @return Viewport Y
    //


    function evY(event) {
      return event.pageY - parOfs.top;
    } //
    // Get the current selection
    //
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            returned selection
    // @return Selection object
    //


    function getSelection(noScale) {
      var sx = noScale || scaleX,
          sy = noScale || scaleY;
      return {
        x1: round(selection.x1 * sx),
        y1: round(selection.y1 * sy),
        x2: round(selection.x2 * sx),
        y2: round(selection.y2 * sy),
        width: round(selection.x2 * sx) - round(selection.x1 * sx),
        height: round(selection.y2 * sy) - round(selection.y1 * sy)
      };
    } //
    // Set the current selection
    //
    // @param x1
    //            X coordinate of the upper left corner of the selection area
    // @param y1
    //            Y coordinate of the upper left corner of the selection area
    // @param x2
    //            X coordinate of the lower right corner of the selection area
    // @param y2
    //            Y coordinate of the lower right corner of the selection area
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            new selection
    //


    function setSelection(x1, y1, x2, y2, noScale) {
      var sx = noScale || scaleX,
          sy = noScale || scaleY;
      selection = {
        x1: round(x1 / sx || 0),
        y1: round(y1 / sy || 0),
        x2: round(x2 / sx || 0),
        y2: round(y2 / sy || 0)
      };
      selection.width = selection.x2 - selection.x1;
      selection.height = selection.y2 - selection.y1;
    } //
    // Recalculate image and parent offsets
    //


    function adjust() {
      /*
       * Do not adjust if image has not yet loaded or if width is not a
       * positive number. The latter might happen when imgAreaSelect is put
       * on a parent element which is then hidden.
       */
      if (!imgLoaded || !$img.width()) return;
      /*
       * Get image offset. The .offset() method returns float values, so they
       * need to be rounded.
       */

      imgOfs = {
        left: round($img.offset().left),
        top: round($img.offset().top)
      };
      /* Get image dimensions */

      imgWidth = $img.innerWidth();
      imgHeight = $img.innerHeight();
      imgOfs.top += $img.outerHeight() - imgHeight >> 1;
      imgOfs.left += $img.outerWidth() - imgWidth >> 1;
      /* Set minimum and maximum selection area dimensions */

      minWidth = round(options.minWidth / scaleX) || 0;
      minHeight = round(options.minHeight / scaleY) || 0;
      maxWidth = round(min(options.maxWidth / scaleX || 1 << 24, imgWidth));
      maxHeight = round(min(options.maxHeight / scaleY || 1 << 24, imgHeight));

      if (imgWidth > imgHeight) {
        gridX = imgWidth / gridSteps;
        gridY = imgHeight < gridX ? imgHeight : gridX + imgHeight % gridX / Math.floor(imgHeight / gridX);
      } else {
        gridY = imgHeight / gridSteps;
        gridX = imgWidth < gridY ? imgWidth : gridY + imgWidth % gridY / Math.floor(imgWidth / gridY);
      }
      /*
       * Workaround for jQuery 1.3.2 incorrect offset calculation, originally
       * observed in Safari 3. Firefox 2 is also affected.
       */


      if ($().jquery == '1.3.2' && position == 'fixed' && !docElem['getBoundingClientRect']) {
        imgOfs.top += max(document.body.scrollTop, docElem.scrollTop);
        imgOfs.left += max(document.body.scrollLeft, docElem.scrollLeft);
      }
      /* Determine parent element offset */


      parOfs = /absolute|relative/.test($parent.css('position')) ? {
        left: round($parent.offset().left) - $parent.scrollLeft(),
        top: round($parent.offset().top) - $parent.scrollTop()
      } : position == 'fixed' ? {
        left: $(document).scrollLeft(),
        top: $(document).scrollTop()
      } : {
        left: 0,
        top: 0
      };
      left = viewX(0);
      top = viewY(0);
      /*
       * Check if selection area is within image boundaries, adjust if
       * necessary
       */

      if (selection.x2 > imgWidth || selection.y2 > imgHeight) doResize();
    } //
    // Update plugin elements
    //
    // @param resetKeyPress
    //            If set to <code>false</code>, this instance's keypress
    //            event handler is not activated
    //


    function update(resetKeyPress) {
      /* If plugin elements are hidden, do nothing */
      if (!shown) return;
      /*
       * Set the position and size of the container box and the selection area
       * inside it
       */

      $box.css({
        left: viewX(selection.x1),
        top: viewY(selection.y1)
      }).add($area).width(w = selection.width).height(h = selection.height);
      /*
       * Reset the position of selection area, borders, and handles (IE6/IE7
       * position them incorrectly if we don't do this)
       */

      $area.add($border).add($handles).css({
        left: 0,
        top: 0
      });
      /* Set border dimensions */

      $border.width(max(w - $border.outerWidth() + $border.innerWidth(), 0)).height(max(h - $border.outerHeight() + $border.innerHeight(), 0));
      /* Arrange the outer area elements */

      $($outer[0]).css({
        left: left,
        top: top,
        width: selection.x1,
        height: imgHeight
      });
      $($outer[1]).css({
        left: left + selection.x1,
        top: top,
        width: w,
        height: selection.y1
      });
      $($outer[2]).css({
        left: left + selection.x2,
        top: top,
        width: imgWidth - selection.x2,
        height: imgHeight
      });
      $($outer[3]).css({
        left: left + selection.x1,
        top: top + selection.y2,
        width: w,
        height: imgHeight - selection.y2
      });
      w -= $handles.outerWidth();
      h -= $handles.outerHeight();
      /* Arrange handles */

      switch ($handles.length) {
        case 8:
          $($handles[4]).css({
            left: w >> 1
          });
          $($handles[5]).css({
            left: w,
            top: h >> 1
          });
          $($handles[6]).css({
            left: w >> 1,
            top: h
          });
          $($handles[7]).css({
            top: h >> 1
          });

        case 4:
          $handles.slice(1, 3).css({
            left: w
          });
          $handles.slice(2, 4).css({
            top: h
          });
      }

      if (resetKeyPress !== false) {
        /*
         * Need to reset the document keypress event handler -- unbind the
         * current handler
         */
        if ($.imgAreaSelect.onKeyPress != docKeyPress) $(document).unbind($.imgAreaSelect.keyPress, $.imgAreaSelect.onKeyPress);
        if (options.keys)
          /*
           * Set the document keypress event handler to this instance's
           * docKeyPress() function
           */
          $(document)[$.imgAreaSelect.keyPress]($.imgAreaSelect.onKeyPress = docKeyPress);
      }
      /*
       * Internet Explorer displays 1px-wide dashed borders incorrectly by
       * filling the spaces between dashes with white. Toggling the margin
       * property between 0 and "auto" fixes this in IE6 and IE7 (IE8 is still
       * broken). This workaround is not perfect, as it requires setTimeout()
       * and thus causes the border to flicker a bit, but I haven't found a
       * better solution.
       *
       * Note: This only happens with CSS borders, set with the borderWidth,
       * borderOpacity, borderColor1, and borderColor2 options (which are now
       * deprecated). Borders created with GIF background images are fine.
       */


      if (msie && $border.outerWidth() - $border.innerWidth() == 2) {
        $border.css('margin', 0);
        setTimeout(function () {
          $border.css('margin', 'auto');
        }, 0);
      }
    } //
    // Do the complete update sequence: recalculate offsets, update the
    // elements, and set the correct values of x1, y1, x2, and y2.
    //
    // @param resetKeyPress
    //            If set to <code>false</code>, this instance's keypress
    //            event handler is not activated
    //


    function doUpdate(resetKeyPress) {
      adjust();
      update(resetKeyPress);
      x1 = viewX(selection.x1);
      y1 = viewY(selection.y1);
      x2 = viewX(selection.x2);
      y2 = viewY(selection.y2);
    } //
    // Hide or fade out an element (or multiple elements)
    //
    // @param $elem
    //            A jQuery object containing the element(s) to hide/fade out
    // @param fn
    //            Callback function to be called when fadeOut() completes
    //


    function hide($elem, fn) {
      options.fadeSpeed ? $elem.fadeOut(options.fadeSpeed, fn) : $elem.hide();
    } //
    // Selection area mousemove event handler
    //
    // @param event
    //            The event object
    //


    function areaMouseMove(event) {
      var x = selX(evX(event)) - selection.x1,
          y = selY(evY(event)) - selection.y1;

      if (!adjusted) {
        adjust();
        adjusted = true;
        $box.one('mouseout', function () {
          adjusted = false;
        });
      }
      /* Clear the resize mode */


      resize = '';

      if (options.resizable) {
        /*
         * Check if the mouse pointer is over the resize margin area and set
         * the resize mode accordingly
         */
        if (y <= options.resizeMargin) resize = 'n';else if (y >= selection.height - options.resizeMargin) resize = 's';
        if (x <= options.resizeMargin) resize += 'w';else if (x >= selection.width - options.resizeMargin) resize += 'e';
      }

      $box.css('cursor', resize ? resize + '-resize' : options.movable ? 'move' : '');
      if ($areaOpera) $areaOpera.toggle();
    } //
    // Document mouseup event handler
    //
    // @param event
    //            The event object
    //


    function docMouseUp(event) {
      /* Set back the default cursor */
      $('body').css('cursor', '');
      /*
       * If autoHide is enabled, or if the selection has zero width/height,
       * hide the selection and the outer area
       */

      if (options.autoHide || selection.width * selection.height == 0) hide($box.add($outer), function () {
        $(this).hide();
      });
      $(document).unbind('mousemove', selectingMouseMove);
      $box.mousemove(areaMouseMove);
      options.onSelectEnd(img, getSelection());
    } //
    // Selection area mousedown event handler
    //
    // @param event
    //            The event object
    // @return false
    //


    function areaMouseDown(event) {
      if (event.which != 1) return false;
      adjust();

      if (resize) {
        /* Resize mode is in effect */
        $('body').css('cursor', resize + '-resize');
        x1 = viewX(selection[/w/.test(resize) ? 'x2' : 'x1']);
        y1 = viewY(selection[/n/.test(resize) ? 'y2' : 'y1']);
        $(document).mousemove(selectingMouseMove).one('mouseup', docMouseUp);
        $box.unbind('mousemove', areaMouseMove);
      } else if (options.movable) {
        startX = left + selection.x1 - evX(event);
        startY = top + selection.y1 - evY(event);
        $box.unbind('mousemove', areaMouseMove);
        $(document).mousemove(movingMouseMove).one('mouseup', function () {
          options.onSelectEnd(img, getSelection());
          $(document).unbind('mousemove', movingMouseMove);
          $box.mousemove(areaMouseMove);
        });
      } else $img.mousedown(event);

      return false;
    } //
    // Adjust the x2/y2 coordinates to maintain aspect ratio (if defined)
    //
    // @param xFirst
    //            If set to <code>true</code>, calculate x2 first. Otherwise,
    //            calculate y2 first.
    //


    function fixAspectRatio(xFirst) {
      if (aspectRatio) if (xFirst) {
        x2 = max(left, min(left + imgWidth, x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1)));
        y2 = round(max(top, min(top + imgHeight, y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1))));
        x2 = round(x2);
      } else {
        y2 = max(top, min(top + imgHeight, y1 + abs(x2 - x1) / aspectRatio * (y2 > y1 || -1)));
        x2 = round(max(left, min(left + imgWidth, x1 + abs(y2 - y1) * aspectRatio * (x2 > x1 || -1))));
        y2 = round(y2);
      }
    } //
    // Resize the selection area respecting the minimum/maximum dimensions and
    // aspect ratio
    //


    function doResize() {
      /*
       * Make sure the top left corner of the selection area stays within
       * image boundaries (it might not if the image source was dynamically
       * changed).
       */
      x1 = min(x1, left + imgWidth);
      y1 = min(y1, top + imgHeight);

      if (abs(x2 - x1) < minWidth) {
        /* Selection width is smaller than minWidth */
        x2 = x1 - minWidth * (x2 < x1 || -1);
        if (x2 < left) x1 = left + minWidth;else if (x2 > left + imgWidth) x1 = left + imgWidth - minWidth;
      }

      if (abs(y2 - y1) < minHeight) {
        /* Selection height is smaller than minHeight */
        y2 = y1 - minHeight * (y2 < y1 || -1);
        if (y2 < top) y1 = top + minHeight;else if (y2 > top + imgHeight) y1 = top + imgHeight - minHeight;
      }

      x2 = max(left, min(x2, left + imgWidth));
      y2 = max(top, min(y2, top + imgHeight));
      fixAspectRatio(abs(x2 - x1) < abs(y2 - y1) * aspectRatio);

      if (abs(x2 - x1) > maxWidth) {
        /* Selection width is greater than maxWidth */
        x2 = x1 - maxWidth * (x2 < x1 || -1);
        fixAspectRatio();
      }

      if (abs(y2 - y1) > maxHeight) {
        /* Selection height is greater than maxHeight */
        y2 = y1 - maxHeight * (y2 < y1 || -1);
        fixAspectRatio(true);
      }

      snapToGrid();
      selection = {
        x1: selX(min(x1, x2)),
        x2: selX(max(x1, x2)),
        y1: selY(min(y1, y2)),
        y2: selY(max(y1, y2)),
        width: abs(x2 - x1),
        height: abs(y2 - y1)
      };
      update();
      options.onSelectChange(img, getSelection());
    } //
    // Mousemove event handler triggered when the user is selecting an area
    //
    // @param event
    //            The event object
    // @return false
    //


    function selectingMouseMove(event) {
      x2 = /w|e|^$/.test(resize) || aspectRatio ? evX(event) : viewX(selection.x2);
      y2 = /n|s|^$/.test(resize) || aspectRatio ? evY(event) : viewY(selection.y2);
      doResize();
      return false;
    } //
    // Move the selection area
    //
    // @param newX1
    //            New viewport X1
    // @param newY1
    //            New viewport Y1
    //


    function doMove(newX1, newY1) {
      x1 = newX1;
      y1 = newY1;
      snapToGrid();
      x2 = x1 + selection.width;
      y2 = y1 + selection.height;
      $.extend(selection, {
        x1: selX(x1),
        y1: selY(y1),
        x2: selX(x2),
        y2: selY(y2)
      });
      update();
      options.onSelectChange(img, getSelection());
    }

    function snapToGrid() {
      x1 = Math.round(x1 / gridX) * gridX;
      x2 = Math.round(x2 / gridX) * gridX;
      y1 = Math.round(y1 / gridY) * gridY;
      y2 = Math.round(y2 / gridY) * gridY;
    } //
    // Mousemove event handler triggered when the selection area is being moved
    //
    // @param event
    //            The event object
    // @return false
    //


    function movingMouseMove(event) {
      x1 = max(left, min(startX + evX(event), left + imgWidth - selection.width));
      y1 = max(top, min(startY + evY(event), top + imgHeight - selection.height));
      doMove(x1, y1);
      event.preventDefault();
      return false;
    } //
    // Start selection
    //


    function startSelection() {
      $(document).unbind('mousemove', startSelection);
      adjust();
      x2 = x1;
      y2 = y1;
      doResize();
      resize = '';
      if (!$outer.is(':visible'))
        /* Show the plugin elements */
        $box.add($outer).hide().fadeIn(options.fadeSpeed || 0);
      shown = true;
      $(document).unbind('mouseup', cancelSelection).mousemove(selectingMouseMove).one('mouseup', docMouseUp);
      $box.unbind('mousemove', areaMouseMove);
      options.onSelectStart(img, getSelection());
    } //
    // Cancel selection
    //


    function cancelSelection() {
      $(document).unbind('mousemove', startSelection).unbind('mouseup', cancelSelection);
      hide($box.add($outer));
      setSelection(selX(x1), selY(y1), selX(x1), selY(y1));
      /* If this is an API call, callback functions should not be triggered */

      if (!(this instanceof $.imgAreaSelect)) {
        options.onSelectChange(img, getSelection());
        options.onSelectEnd(img, getSelection());
      }
    } //
    // Image mousedown event handler
    //
    // @param event
    //            The event object
    // @return false
    //


    function imgMouseDown(event) {
      /* Ignore the event if animation is in progress */
      if (event.which != 1 || $outer.is(':animated')) return false;
      adjust();
      startX = x1 = evX(event);
      startY = y1 = evY(event);
      /* Selection will start when the mouse is moved */

      $(document).mousemove(startSelection).mouseup(cancelSelection);
      return false;
    } //
    // Window resize event handler
    //


    function windowResize() {
      doUpdate(false);
    } //
    // Image load event handler. This is the final part of the initialization
    // process.
    //


    function imgLoad() {
      imgLoaded = true;
      /* Set options */

      setOptions(options = $.extend({
        classPrefix: 'imgareaselect',
        movable: true,
        parent: 'body',
        resizable: true,
        resizeMargin: 10,
        onInit: function onInit() {},
        onSelectStart: function onSelectStart() {},
        onSelectChange: function onSelectChange() {},
        onSelectEnd: function onSelectEnd() {}
      }, options));
      $box.add($outer).css({
        visibility: ''
      });

      if (options.show) {
        shown = true;
        adjust();
        update();
        $box.add($outer).hide().fadeIn(options.fadeSpeed || 0);
      }
      /*
       * Call the onInit callback. The setTimeout() call is used to ensure
       * that the plugin has been fully initialized and the object instance is
       * available (so that it can be obtained in the callback).
       */


      setTimeout(function () {
        options.onInit(img, getSelection());
      }, 0);
    } //
    // Document keypress event handler
    //
    // @param event
    //            The event object
    // @return false
    //


    var docKeyPress = function docKeyPress(event) {
      var k = options.keys,
          d,
          t,
          key = event.keyCode;
      d = !isNaN(k.alt) && (event.altKey || event.originalEvent.altKey) ? k.alt : !isNaN(k.ctrl) && event.ctrlKey ? k.ctrl : !isNaN(k.shift) && event.shiftKey ? k.shift : !isNaN(k.arrows) ? k.arrows : 10;

      if (k.arrows == 'resize' || k.shift == 'resize' && event.shiftKey || k.ctrl == 'resize' && event.ctrlKey || k.alt == 'resize' && (event.altKey || event.originalEvent.altKey)) {
        /* Resize selection */
        switch (key) {
          case 37:
            /* Left */
            d = -d;

          case 39:
            /* Right */
            t = max(x1, x2);
            x1 = min(x1, x2);
            x2 = max(t + d, x1);
            fixAspectRatio();
            break;

          case 38:
            /* Up */
            d = -d;

          case 40:
            /* Down */
            t = max(y1, y2);
            y1 = min(y1, y2);
            y2 = max(t + d, y1);
            fixAspectRatio(true);
            break;

          default:
            return;
        }

        doResize();
      } else {
        /* Move selection */
        x1 = min(x1, x2);
        y1 = min(y1, y2);

        switch (key) {
          case 37:
            /* Left */
            doMove(max(x1 - d, left), y1);
            break;

          case 38:
            /* Up */
            doMove(x1, max(y1 - d, top));
            break;

          case 39:
            /* Right */
            doMove(x1 + min(d, imgWidth - selX(x2)), y1);
            break;

          case 40:
            /* Down */
            doMove(x1, y1 + min(d, imgHeight - selY(y2)));
            break;

          default:
            return;
        }
      }

      return false;
    }; //
    // Apply style options to plugin element (or multiple elements)
    //
    // @param $elem
    //            A jQuery object representing the element(s) to style
    // @param props
    //            An object that maps option names to corresponding CSS
    //            properties
    //


    function styleOptions($elem, props) {
      for (var option in props) {
        if (options[option] !== undefined) $elem.css(props[option], options[option]);
      }
    } //
    // Set plugin options
    //
    // @param newOptions
    //            The new options object
    //


    function setOptions(newOptions) {
      if (newOptions.parent) ($parent = $(newOptions.parent)).append($box.add($outer));
      /* Merge the new options with the existing ones */

      $.extend(options, newOptions);
      adjust();

      if (newOptions.handles != null) {
        /* Recreate selection area handles */
        $handles.remove();
        $handles = $([]);
        i = newOptions.handles ? newOptions.handles == 'corners' ? 4 : 8 : 0;

        while (i--) {
          $handles = $handles.add(div());
        }
        /* Add a class to handles and set the CSS properties */


        $handles.addClass(options.classPrefix + '-handle').css({
          position: 'absolute',

          /*
           * The font-size property needs to be set to zero, otherwise
           * Internet Explorer makes the handles too large
           */
          fontSize: 0,
          zIndex: zIndex + 1 || 1
        });
        /*
         * If handle width/height has not been set with CSS rules, set the
         * default 5px
         */

        if (!parseInt($handles.css('width')) >= 0) $handles.width(5).height(5);
        /*
         * If the borderWidth option is in use, add a solid border to
         * handles
         */

        if (o = options.borderWidth) $handles.css({
          borderWidth: o,
          borderStyle: 'solid'
        });
        /* Apply other style options */

        styleOptions($handles, {
          borderColor1: 'border-color',
          borderColor2: 'background-color',
          borderOpacity: 'opacity'
        });
      }
      /* Calculate scale factors */


      scaleX = options.imageWidth / imgWidth || 1;
      scaleY = options.imageHeight / imgHeight || 1;
      /* Set selection */

      if (newOptions.x1 != null) {
        setSelection(newOptions.x1, newOptions.y1, newOptions.x2, newOptions.y2);
        newOptions.show = !newOptions.hide;
      }

      if (newOptions.keys)
        /* Enable keyboard support */
        options.keys = $.extend({
          shift: 1,
          ctrl: 'resize'
        }, newOptions.keys);
      /* Add classes to plugin elements */

      $outer.addClass(options.classPrefix + '-outer');
      $area.addClass(options.classPrefix + '-selection');

      for (i = 0; i++ < 4;) {
        $($border[i - 1]).addClass(options.classPrefix + '-border' + i);
      }
      /* Apply style options */


      styleOptions($area, {
        selectionColor: 'background-color',
        selectionOpacity: 'opacity'
      });
      styleOptions($border, {
        borderOpacity: 'opacity',
        borderWidth: 'border-width'
      });
      styleOptions($outer, {
        outerColor: 'background-color',
        outerOpacity: 'opacity'
      });
      if (o = options.borderColor1) $($border[0]).css({
        borderStyle: 'solid',
        borderColor: o
      });
      if (o = options.borderColor2) $($border[1]).css({
        borderStyle: 'dashed',
        borderColor: o
      });
      /* Append all the selection area elements to the container box */

      $box.append($area.add($border).add($areaOpera)).append($handles);

      if (msie) {
        if (o = ($outer.css('filter') || '').match(/opacity=(\d+)/)) $outer.css('opacity', o[1] / 100);
        if (o = ($border.css('filter') || '').match(/opacity=(\d+)/)) $border.css('opacity', o[1] / 100);
      }

      if (newOptions.hide) hide($box.add($outer));else if (newOptions.show && imgLoaded) {
        shown = true;
        $box.add($outer).fadeIn(options.fadeSpeed || 0);
        doUpdate();
      }
      /* Calculate the aspect ratio factor */

      aspectRatio = (d = (options.aspectRatio || '').split(/:/))[0] / d[1];
      $img.add($outer).unbind('mousedown', imgMouseDown);

      if (options.disable || options.enable === false) {
        /* Disable the plugin */
        $box.unbind('mousemove', areaMouseMove).unbind('mousedown', areaMouseDown);
        $(window).unbind('resize', windowResize);
      } else {
        if (options.enable || options.disable === false) {
          /* Enable the plugin */
          if (options.resizable || options.movable) $box.mousemove(areaMouseMove).mousedown(areaMouseDown);
          $(window).resize(windowResize);
        }

        if (!options.persistent) $img.add($outer).mousedown(imgMouseDown);
      }

      options.enable = options.disable = undefined;
    } //
    // Remove plugin completely
    //


    this.remove = function () {
      /*
       * Call setOptions with { disable: true } to unbind the event handlers
       */
      setOptions({
        disable: true
      });
      $box.add($outer).remove();
    };
    /*
     * Public API
     */
    //
    // Get current options
    //
    // @return An object containing the set of options currently in use
    //


    this.getOptions = function () {
      return options;
    }; //
    // Set plugin options
    //
    // @param newOptions
    //            The new options object
    //


    this.setOptions = setOptions; //
    // Get the current selection
    //
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            returned selection
    // @return Selection object
    //

    this.getSelection = getSelection; //
    // Set the current selection
    //
    // @param x1
    //            X coordinate of the upper left corner of the selection area
    // @param y1
    //            Y coordinate of the upper left corner of the selection area
    // @param x2
    //            X coordinate of the lower right corner of the selection area
    // @param y2
    //            Y coordinate of the lower right corner of the selection area
    // @param noScale
    //            If set to <code>true</code>, scaling is not applied to the
    //            new selection
    //

    this.setSelection = setSelection; //
    // Cancel selection
    //

    this.cancelSelection = cancelSelection; //
    // Update plugin elements
    //
    // @param resetKeyPress
    //            If set to <code>false</code>, this instance's keypress
    //            event handler is not activated
    //

    this.update = doUpdate;
    /* Do the dreaded browser detection */

    var msie = (/msie ([\w.]+)/i.exec(ua) || [])[1],
        opera = /opera/i.test(ua),
        safari = /webkit/i.test(ua) && !/chrome/i.test(ua);
    /*
     * Traverse the image's parent elements (up to <body>) and find the
     * highest z-index
     */

    $p = $img;

    while ($p.length) {
      zIndex = max(zIndex, !isNaN($p.css('z-index')) ? $p.css('z-index') : zIndex);
      /* Also check if any of the ancestor elements has fixed position */

      if ($p.css('position') == 'fixed') position = 'fixed';
      $p = $p.parent(':not(body)');
    }
    /*
     * If z-index is given as an option, it overrides the one found by the
     * above loop
     */


    zIndex = options.zIndex || zIndex;
    if (msie) $img.attr('unselectable', 'on');
    /*
     * In MSIE and WebKit, we need to use the keydown event instead of keypress
     */

    $.imgAreaSelect.keyPress = msie || safari ? 'keydown' : 'keypress';
    /*
     * There is a bug affecting the CSS cursor property in Opera (observed in
     * versions up to 10.00) that prevents the cursor from being updated unless
     * the mouse leaves and enters the element again. To trigger the mouseover
     * event, we're adding an additional div to $box and we're going to toggle
     * it when mouse moves inside the selection area.
     */

    if (opera) $areaOpera = div().css({
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: zIndex + 2 || 2
    });
    /*
     * We initially set visibility to "hidden" as a workaround for a weird
     * behaviour observed in Google Chrome 1.0.154.53 (on Windows XP). Normally
     * we would just set display to "none", but, for some reason, if we do so
     * then Chrome refuses to later display the element with .show() or
     * .fadeIn().
     */

    $box.add($outer).css({
      visibility: 'hidden',
      position: position,
      overflow: 'hidden',
      zIndex: zIndex || '0'
    });
    $box.css({
      zIndex: zIndex + 2 || 2
    });
    $area.add($border).css({
      position: 'absolute',
      fontSize: 0
    });
    /*
     * If the image has been fully loaded, or if it is not really an image (eg.
     * a div), call imgLoad() immediately; otherwise, bind it to be called once
     * on image load event.
     */

    img.complete || img.readyState == 'complete' || !$img.is('img') ? imgLoad() : $img.one('load', imgLoad);
    /*
     * MSIE 9.0 doesn't always fire the image load event -- resetting the src
     * attribute seems to trigger it. The check is for version 7 and above to
     * accommodate for MSIE 9 running in compatibility mode.
     */

    if (!imgLoaded && msie && msie >= 7) img.src = img.src;
  }; //
  // Invoke imgAreaSelect on a jQuery object containing the image(s)
  //
  // @param options
  //            Options object
  // @return The jQuery object or a reference to imgAreaSelect instance (if the
  //         <code>instance</code> option was specified)
  //


  $.fn.imgAreaSelect = function (options) {
    options = options || {};
    this.each(function () {
      /* Is there already an imgAreaSelect instance bound to this element? */
      if ($(this).data('imgAreaSelect')) {
        /* Yes there is -- is it supposed to be removed? */
        if (options.remove) {
          /* Remove the plugin */
          $(this).data('imgAreaSelect').remove();
          $(this).removeData('imgAreaSelect');
        } else
          /* Reset options */
          $(this).data('imgAreaSelect').setOptions(options);
      } else if (!options.remove) {
        /* No exising instance -- create a new one */

        /*
         * If neither the "enable" nor the "disable" option is present, add
         * "enable" as the default
         */
        if (options.enable === undefined && options.disable === undefined) options.enable = true;
        $(this).data('imgAreaSelect', new $.imgAreaSelect(this, options));
      }
    });
    if (options.instance)
      /*
       * Return the imgAreaSelect instance bound to the first element in the
       * set
       */
      return $(this).data('imgAreaSelect');
    return this;
  };
})($);

var css$g = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}.buttons-module_addButton__2pN-g {\n}.buttons-module_cancelButton__1xJCN {\n}.buttons-module_saveButton__1M-qM {\n}.buttons-module_selectFileButton__khOoU {\n}\n\n.EditMotifAreaDialogView-module_box__1fwA5 {\n  width: -webkit-min-content;\n  width: -moz-min-content;\n  width: min-content;\n  min-height: 310px;\n  min-width: 400px;\n}\n\n.EditMotifAreaDialogView-module_wrapper__2uBFA {\n  display: flex;\n  justify-content: center;\n}\n\n.EditMotifAreaDialogView-module_helpLink__1Dv5E {\n  background-color: transparent;\n  color: var(--ui-primary-color);\n  float: left;\n  padding: 7px 0;\n}\n\n.EditMotifAreaDialogView-module_helpLink__1Dv5E::before {\n  color: var(--ui-primary-color-lighter);\n}\n\n.EditMotifAreaDialogView-module_thumbnail__dM9gN {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n}\n\n.EditMotifAreaDialogView-module_image__2-Iaj {\n  display: block;\n  height: calc(100vh - 200px);\n  max-height: 600px;\n  min-height: 200px;\n}\n\n.EditMotifAreaDialogView-module_blankSlate__3lvPl {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.5);\n  color: #fff;\n  display: none;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n}\n\n.EditMotifAreaDialogView-module_blank__yAuNx .EditMotifAreaDialogView-module_blankSlate__3lvPl {\n  display: flex;\n}\n\n.EditMotifAreaDialogView-module_reset__3YOxk {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  z-index: 10;\n  padding: 5px;\n  background-color: #000;\n  color: #fff;\n  border: solid 1px #fff;\n  border-radius: 3px;\n}\n\n.EditMotifAreaDialogView-module_blank__yAuNx .EditMotifAreaDialogView-module_reset__3YOxk {\n  display: none;\n}\n\n.EditMotifAreaDialogView-module_dragging__1Cx0- .EditMotifAreaDialogView-module_reset__3YOxk,\n.EditMotifAreaDialogView-module_dragging__1Cx0- .EditMotifAreaDialogView-module_blankSlate__3lvPl {\n  display: none;\n}\n\n.EditMotifAreaDialogView-module_save__1Qaw1 {\n}\n";
var styles$e = {"linkColor":"var(--ui-primary-color)","helpIconColor":"var(--ui-primary-color-lighter)","box":"EditMotifAreaDialogView-module_box__1fwA5","wrapper":"EditMotifAreaDialogView-module_wrapper__2uBFA","helpLink":"EditMotifAreaDialogView-module_helpLink__1Dv5E buttons-module_unstyledButton__3m76W icons-module_helpCircled__D_oKU icons-module_icon__16IVx","thumbnail":"EditMotifAreaDialogView-module_thumbnail__dM9gN","image":"EditMotifAreaDialogView-module_image__2-Iaj","blankSlate":"EditMotifAreaDialogView-module_blankSlate__3lvPl","blank":"EditMotifAreaDialogView-module_blank__yAuNx","reset":"EditMotifAreaDialogView-module_reset__3YOxk buttons-module_unstyledButton__3m76W","dragging":"EditMotifAreaDialogView-module_dragging__1Cx0-","save":"EditMotifAreaDialogView-module_save__1Qaw1 buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx"};
styleInject(css$g);

var EditMotifAreaDialogView = Marionette.ItemView.extend({
  template: function template() {
    return "\n    <div class=\"".concat(dialogViewStyles.backdrop, "\">\n      <div class=\"editor ").concat(dialogViewStyles.box, " ").concat(styles$e.box, "\">\n        <h1 class=\"").concat(dialogViewStyles.header, "\">\n          ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.header'), "\n        </h1>\n        <p class=\"").concat(dialogViewStyles.hint, "\">\n          ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.hint'), "\n        </p>\n\n        <div class=\"").concat(styles$e.wrapper, "\">\n          <div class=\"").concat(styles$e.thumbnail, "\">\n            <img class=\"").concat(styles$e.image, "\" />\n            <div class=\"").concat(styles$e.blankSlate, "\">\n              ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.blank_slate'), "\n            </div>\n            <button class=\"").concat(styles$e.reset, "\">\n              ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.reset'), "\n            </button>\n          </div>\n        </div>\n\n        <div class=\"").concat(dialogViewStyles.footer, "\">\n          <button class=\"").concat(styles$e.helpLink, "\">\n            ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.help_link'), "\n          </button>\n          <button class=\"").concat(styles$e.save, "\">\n            ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.save'), "\n          </button>\n          <button class=\"").concat(dialogViewStyles.close, "\">\n            ").concat(I18n.t('pageflow_scrolled.editor.edit_motif_area.cancel'), "\n          </button>\n        </div>\n      </div>\n    </div>\n  ");
  },
  mixins: [dialogView],
  ui: cssModulesUtils$1.ui(styles$e, 'image', 'thumbnail'),
  events: cssModulesUtils$1.events(styles$e, {
    'click helpLink': function clickHelpLink() {
      app.trigger('toggle-help', 'pageflow_scrolled.help_entries.motif_area');
    },
    'click reset': function clickReset() {
      this.motifArea = null;
      this.updateAreaSelect();
      this.updateBlankSlate();
    },
    'click save': function clickSave() {
      this.save();
      this.close();
    }
  }),
  save: function save() {
    var motifArea = this.getMotifAreaWithRoundedValues();
    this.model.set(this.getPropertyName(), motifArea);
    this.options.file.configuration.set('motifArea', motifArea);
  },
  onRender: function onRender() {
    this.ui.image.attr('src', this.options.file.getBackgroundPositioningImageUrl());
  },
  onShow: function onShow() {
    var _this = this;

    this.motifArea = this.model.get(this.getPropertyName());
    this.updateAreaSelect();
    this.updateBlankSlate();

    this.resizeListener = function () {
      return _this.updateAreaSelect();
    };

    $(window).on('resize', this.resizeListener);
  },
  getPropertyName: function getPropertyName() {
    return "".concat(this.options.propertyName, "MotifArea");
  },
  getMotifAreaWithRoundedValues: function getMotifAreaWithRoundedValues() {
    return this.motifArea && {
      left: Math.round(this.motifArea.left),
      top: Math.round(this.motifArea.top),
      width: Math.round(this.motifArea.width),
      height: Math.round(this.motifArea.height)
    };
  },
  updateAreaSelect: function updateAreaSelect() {
    var _this2 = this;

    var imageWidth = this.options.file.get('width');
    var imageHeight = this.options.file.get('height');
    this.ui.image.imgAreaSelect(_objectSpread2(_objectSpread2({
      parent: this.ui.thumbnail,
      handles: true,
      imageWidth: imageWidth,
      imageHeight: imageHeight
    }, this.getSelection(imageWidth, imageHeight)), {}, {
      onSelectStart: function onSelectStart() {
        _this2.$el.addClass(styles$e.dragging);
      },
      onSelectEnd: function onSelectEnd(img, selection) {
        _this2.$el.removeClass(styles$e.dragging);

        var motifArea = {
          left: selection.x1 / imageWidth * 100.0,
          top: selection.y1 / imageHeight * 100.0,
          width: (selection.x2 - selection.x1) / imageWidth * 100.0,
          height: (selection.y2 - selection.y1) / imageHeight * 100.0
        };

        if (motifArea.width > 0 && motifArea.height > 0) {
          _this2.motifArea = motifArea;
        } else {
          _this2.ui.image.imgAreaSelect(_objectSpread2({}, _this2.getSelection(imageWidth, imageHeight)));
        }

        _this2.updateBlankSlate();
      }
    }));
  },
  getSelection: function getSelection(imageWidth, imageHeight) {
    if (!this.motifArea) {
      return {
        hide: true
      };
    }

    var x1 = imageWidth * (this.motifArea.left / 100);
    var y1 = imageHeight * (this.motifArea.top / 100);
    var width = imageWidth * (this.motifArea.width / 100);
    var height = imageHeight * (this.motifArea.height / 100);
    return {
      x1: x1,
      x2: x1 + width,
      y1: y1,
      y2: y1 + height
    };
  },
  updateBlankSlate: function updateBlankSlate() {
    this.$el.toggleClass(styles$e.blank, !this.motifArea);
  },
  onBeforeClose: function onBeforeClose() {
    $(window).off('resize', this.resizeListener);
    this.ui.image.imgAreaSelect({
      remove: true
    });
  }
});

EditMotifAreaDialogView.show = function (options) {
  app.dialogRegion.show(new EditMotifAreaDialogView(options));
};

var EditSectionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section',
  configure: function configure(configurationEditor) {
    var entry = this.options.entry;
    var editMotifAreaMenuItem = {
      name: 'editMotifArea',
      label: I18n.t('pageflow_scrolled.editor.edit_section.edit_motif_area'),
      selected: function selected(_ref) {
        var inputModel = _ref.inputModel,
            propertyName = _ref.propertyName,
            file = _ref.file;
        EditMotifAreaDialogView.show({
          model: inputModel,
          propertyName: propertyName,
          file: file
        });
      }
    };
    configurationEditor.tab('section', function () {
      var _this = this;

      this.input('fullHeight', CheckBoxInputView);
      this.input('backdropType', SelectInputView, {
        values: ['image', 'video', 'color']
      });
      this.input('backdropImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('backdropVideo', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('backdropEffects', EffectListInputView, {
        visibleBinding: ['backdropType', 'backdropImage'],
        visible: function visible(_ref2) {
          var _ref3 = _slicedToArray(_ref2, 1),
              backdropType = _ref3[0];

          return backdropType === 'image' && _this.model.getReference('backdropImage', 'image_files') || backdropType === 'video' && _this.model.getReference('backdropVideo', 'video_files');
        }
      });
      this.input('backdropImageMobile', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'image',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('backdropVideoMobile', FileInputView, {
        collection: 'video_files',
        fileSelectionHandler: 'sectionConfiguration',
        visibleBinding: 'backdropType',
        visibleBindingValue: 'video',
        positioning: false,
        dropDownMenuItems: [editMotifAreaMenuItem, InlineFileRightsMenuItem]
      });
      this.input('backdropEffectsMobile', EffectListInputView, {
        visibleBinding: ['backdropType', 'backdropImageMobile'],
        visible: function visible(_ref4) {
          var _ref5 = _slicedToArray(_ref4, 1),
              backdropType = _ref5[0];

          return backdropType === 'image' && _this.model.getReference('backdropImageMobile', 'image_files') || backdropType === 'video' && _this.model.getReference('backdropVideoMobile', 'video_files');
        }
      });
      this.input('backdropColor', ColorInputView, {
        visibleBinding: 'backdropType',
        visibleBindingValue: 'color'
      });
      this.view(SeparatorView);
      this.input('layout', SelectInputView, {
        values: ['left', 'right', 'center', 'centerRagged']
      });

      if (entry.supportsSectionWidths()) {
        this.input('width', SelectInputView, {
          values: ['wide', 'narrow']
        });
      }

      this.input('appearance', SelectInputView, {
        values: ['shadow', 'cards', 'transparent']
      });
      this.input('invert', CheckBoxInputView);
      this.input('exposeMotifArea', CheckBoxInputView, {
        displayUncheckedIfDisabled: true,
        visibleBinding: ['backdropType'],
        visible: function visible(_ref6) {
          var _ref7 = _slicedToArray(_ref6, 1),
              backdropType = _ref7[0];

          return backdropType !== 'color';
        },
        disabledBinding: motifAreaDisabledBinding,
        disabled: motifAreaDisabled
      });
      this.input('staticShadowOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: 'appearance',
        visible: function visible(appearance) {
          return !appearance || appearance === 'shadow';
        }
      });
      this.input('dynamicShadowOpacity', SliderInputView, {
        defaultValue: 70,
        visibleBinding: ['backdropType', 'appearance'],
        visible: function visible(_ref8) {
          var _ref9 = _slicedToArray(_ref8, 2),
              backdropType = _ref9[0],
              appearance = _ref9[1];

          return backdropType !== 'color' && (!appearance || appearance === 'shadow');
        },
        disabledBinding: ['exposeMotifArea'].concat(motifAreaDisabledBinding),
        disabled: function disabled(_ref10) {
          var _ref11 = _toArray(_ref10),
              exposeMotifArea = _ref11[0],
              motifAreaDisabledBindingValues = _ref11.slice(1);

          return !exposeMotifArea || motifAreaDisabled(motifAreaDisabledBindingValues);
        }
      });
      this.view(SeparatorView);
      this.input('atmoAudioFileId', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'sectionConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
    });
  }
});
var motifAreaDisabledBinding = ['backdropType', 'backdropImageMotifArea', 'backdropImageMobileMotifArea', 'backdropVideoMotifArea', 'backdropImage', 'backdropImageMobile', 'backdropVideo'];

function motifAreaDisabled(_ref12) {
  var _ref13 = _slicedToArray(_ref12, 7),
      backdropType = _ref13[0],
      backdropImageMotifArea = _ref13[1],
      backdropImageMobileMotifArea = _ref13[2],
      backdropVideoMotifArea = _ref13[3],
      backdropImage = _ref13[4],
      backdropImageMobile = _ref13[5],
      backdropVideo = _ref13[6];

  if (backdropType === 'video') {
    return !backdropVideo || !backdropVideoMotifArea;
  } else if (backdropType !== 'color') {
    return (!backdropImage || !backdropImageMotifArea) && (!backdropImageMobile || !backdropImageMobileMotifArea);
  }

  return true;
}

var css$h = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}\n\n.EditSectionTransitionEffectView-module_disabled__1ZRYF {\n  pointer-events: none;\n  opacity: 0.5;\n}\n\n.EditSectionTransitionEffectView-module_active__3F2NM {\n  background: var(--ui-selection-color) !important;\n}\n\n.EditSectionTransitionEffectView-module_active__3F2NM,\n.EditSectionTransitionEffectView-module_active__3F2NM .EditSectionTransitionEffectView-module_transitionVariant__2H3bL,\n.EditSectionTransitionEffectView-module_active__3F2NM .EditSectionTransitionEffectView-module_transitionVariant__2H3bL .EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz,\n.EditSectionTransitionEffectView-module_active__3F2NM .EditSectionTransitionEffectView-module_defaultTransition__AQMO9 {\n  color: var(--ui-on-selection-color);\n}\n\n.EditSectionTransitionEffectView-module_active__3F2NM .EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz input {\n  border-color: var(--ui-on-selection-color);\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr {\n  position: relative;\n  border-radius: 0.5rem;\n  margin-bottom: 0.125rem;\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr:hover {\n  background: var(--ui-on-surface-color-lightest);\n}\n\n.EditSectionTransitionEffectView-module_defaultTransition__AQMO9 input,\n.EditSectionTransitionEffectView-module_input__3i8nA input {\n  position: absolute;\n  opacity: 0;\n  height: 0;\n}\n\n.EditSectionTransitionEffectView-module_input__3i8nA {\n  padding: 10px;\n}\n\n.EditSectionTransitionEffectView-module_transition__1HHuP {\n  display: flex;\n}\n\n.EditSectionTransitionEffectView-module_transitionLabel__3eI8W,\n.EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz {\n  margin: 0 !important;\n}\n\n.EditSectionTransitionEffectView-module_transitionLabel__3eI8W {\n  padding: 10px;\n}\n\n.EditSectionTransitionEffectView-module_transitionVariant__2H3bL {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.EditSectionTransitionEffectView-module_transitionVariant__2H3bL .EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz {\n  padding: 0 0 10px 10px;\n  display: inline-flex;\n  align-items: center;\n  text-transform: none;\n  font-size: 12px;\n  font-weight: normal;\n  color: var(--ui-on-surface-color-light);\n}\n\n.EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz input {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  flex-shrink: 0;\n  width: 14px;\n  height: 14px;\n  margin: 0 10px 0 2px;\n}\n\n.EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz input:checked {\n    background-image: url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\");\n}\n\n.EditSectionTransitionEffectView-module_defaultTransition__AQMO9 {\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr > .EditSectionTransitionEffectView-module_defaultTransition__AQMO9 {\n  position: absolute;\n  right: 5px;\n  bottom: 5px;\n  margin: 0;\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr > .EditSectionTransitionEffectView-module_defaultTransition__AQMO9 .EditSectionTransitionEffectView-module_defaultTransitionIcon___8vCp,\n.EditSectionTransitionEffectView-module_container__32mkr > .EditSectionTransitionEffectView-module_defaultTransition__AQMO9 .EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj {\n  padding: 5px;\n}\n\n.EditSectionTransitionEffectView-module_defaultTransitionIcon___8vCp,\n.EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj {\n  font-size: 18px;\n  font-weight: normal;\n  padding: 0 10px 10px 5px;\n}\n\n.EditSectionTransitionEffectView-module_defaultTransitionIcon___8vCp {\n  display: none;\n}\n\n.EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj {\n  opacity: 0.5;\n}\n\n.EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj:hover {\n  opacity: 1;\n}\n\ninput:checked + .EditSectionTransitionEffectView-module_defaultTransitionIcons__gGQxe .EditSectionTransitionEffectView-module_defaultTransitionIcon___8vCp {\n  display: block;\n}\n\ninput:checked + .EditSectionTransitionEffectView-module_defaultTransitionIcons__gGQxe .EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj {\n  display: none;\n}\n\n.EditSectionTransitionEffectView-module_upperSection__3p5PI,\n.EditSectionTransitionEffectView-module_lowerSection__2qKdg,\n.EditSectionTransitionEffectView-module_upperBackground__3bp0X,\n.EditSectionTransitionEffectView-module_lowerBackground__1UCTP {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-weight: normal;\n}\n\n.EditSectionTransitionEffectView-module_upperBackground__3bp0X::before {\n  content: \"A\";\n}\n\n.EditSectionTransitionEffectView-module_lowerBackground__1UCTP::before {\n  content: \"B\";\n}\n\n.EditSectionTransitionEffectView-module_upperSection__3p5PI {\n  background: var(--ui-primary-color);\n}\n\n.EditSectionTransitionEffectView-module_lowerSection__2qKdg {\n  background: var(--ui-error-color);\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_fade__XCRHM .EditSectionTransitionEffectView-module_upperSection__3p5PI {\n  -webkit-animation: EditSectionTransitionEffectView-module_FadeA__3u-VS 4s linear infinite;\n          animation: EditSectionTransitionEffectView-module_FadeA__3u-VS 4s linear infinite;\n}\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_fade__XCRHM .EditSectionTransitionEffectView-module_lowerSection__2qKdg {\n  -webkit-animation: EditSectionTransitionEffectView-module_FadeB__a1PxS 4s linear infinite;\n          animation: EditSectionTransitionEffectView-module_FadeB__a1PxS 4s linear infinite;\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_scroll__2RfMf .EditSectionTransitionEffectView-module_upperSection__3p5PI,\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_scroll__2RfMf .EditSectionTransitionEffectView-module_lowerSection__2qKdg,\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_scrollOver__3cJJ7 .EditSectionTransitionEffectView-module_lowerSection__2qKdg,\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_reveal__1_gtk .EditSectionTransitionEffectView-module_upperSection__3p5PI{\n  -webkit-animation: EditSectionTransitionEffectView-module_Translate__CLYTi 2s linear infinite;\n          animation: EditSectionTransitionEffectView-module_Translate__CLYTi 2s linear infinite;\n}\n\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_beforeAfter__3oeDi .EditSectionTransitionEffectView-module_upperSection__3p5PI {\n  -webkit-animation: EditSectionTransitionEffectView-module_Translate__CLYTi 2s linear infinite;\n          animation: EditSectionTransitionEffectView-module_Translate__CLYTi 2s linear infinite;\n}\n.EditSectionTransitionEffectView-module_container__32mkr:hover .EditSectionTransitionEffectView-module_beforeAfter__3oeDi .EditSectionTransitionEffectView-module_upperSection__3p5PI div {\n  -webkit-animation: EditSectionTransitionEffectView-module_TranslateYPositive__10FZp 2s linear infinite;\n          animation: EditSectionTransitionEffectView-module_TranslateYPositive__10FZp 2s linear infinite;\n}\n\n.EditSectionTransitionEffectView-module_animation__3PSoZ {\n  width: 75px;\n  height: 60px;\n  flex-shrink: 0;\n  border-radius: 5%;\n  color: #ffffff;\n  text-align: center;\n  font-size: 26px;\n  overflow: hidden;\n}\n\n.EditSectionTransitionEffectView-module_fade__XCRHM .EditSectionTransitionEffectView-module_animation__3PSoZ,\n.EditSectionTransitionEffectView-module_reveal__1_gtk .EditSectionTransitionEffectView-module_animation__3PSoZ,\n.EditSectionTransitionEffectView-module_beforeAfter__3oeDi .EditSectionTransitionEffectView-module_animation__3PSoZ {\n  position: relative;\n}\n\n.EditSectionTransitionEffectView-module_fade__XCRHM .EditSectionTransitionEffectView-module_lowerSection__2qKdg,\n.EditSectionTransitionEffectView-module_reveal__1_gtk .EditSectionTransitionEffectView-module_lowerSection__2qKdg,\n.EditSectionTransitionEffectView-module_beforeAfter__3oeDi .EditSectionTransitionEffectView-module_lowerSection__2qKdg {\n  position: absolute;\n}\n\n.EditSectionTransitionEffectView-module_reveal__1_gtk .EditSectionTransitionEffectView-module_upperSection__3p5PI,\n.EditSectionTransitionEffectView-module_beforeAfter__3oeDi .EditSectionTransitionEffectView-module_upperSection__3p5PI,\n.EditSectionTransitionEffectView-module_fade__XCRHM .EditSectionTransitionEffectView-module_upperSection__3p5PI {\n  position: absolute;\n  z-index: 1;\n}\n\n.EditSectionTransitionEffectView-module_beforeAfter__3oeDi .EditSectionTransitionEffectView-module_upperSection__3p5PI {\n  overflow: hidden;\n}\n\n@-webkit-keyframes EditSectionTransitionEffectView-module_Translate__CLYTi {\n  50% {\n    transform: translateY(-100%);\n  }\n}\n\n@keyframes EditSectionTransitionEffectView-module_Translate__CLYTi {\n  50% {\n    transform: translateY(-100%);\n  }\n}\n\n@-webkit-keyframes EditSectionTransitionEffectView-module_TranslateYPositive__10FZp {\n  50% {\n    transform: translateY(100%);\n  }\n}\n\n@keyframes EditSectionTransitionEffectView-module_TranslateYPositive__10FZp {\n  50% {\n    transform: translateY(100%);\n  }\n}\n\n@-webkit-keyframes EditSectionTransitionEffectView-module_FadeA__3u-VS {\n  25%,50% {\n    opacity: 0;\n    visibility: hidden;\n  }\n  10%, 80% {\n    visibility: visible;\n  }\n}\n\n@keyframes EditSectionTransitionEffectView-module_FadeA__3u-VS {\n  25%,50% {\n    opacity: 0;\n    visibility: hidden;\n  }\n  10%, 80% {\n    visibility: visible;\n  }\n}\n\n@-webkit-keyframes EditSectionTransitionEffectView-module_FadeB__a1PxS {\n  25%, 50% {\n    opacity: 1;\n  }\n  90% {\n    visibility: hidden;\n    opacity: 0;\n  }\n}\n\n@keyframes EditSectionTransitionEffectView-module_FadeB__a1PxS {\n  25%, 50% {\n    opacity: 1;\n  }\n  90% {\n    visibility: hidden;\n    opacity: 0;\n  }\n}\n";
var styles$f = {"selectionColor":"var(--ui-selection-color)","disabled":"EditSectionTransitionEffectView-module_disabled__1ZRYF","active":"EditSectionTransitionEffectView-module_active__3F2NM","transitionVariant":"EditSectionTransitionEffectView-module_transitionVariant__2H3bL","transitionVariantLabel":"EditSectionTransitionEffectView-module_transitionVariantLabel__2MuLz","defaultTransition":"EditSectionTransitionEffectView-module_defaultTransition__AQMO9","container":"EditSectionTransitionEffectView-module_container__32mkr","input":"EditSectionTransitionEffectView-module_input__3i8nA","transition":"EditSectionTransitionEffectView-module_transition__1HHuP","transitionLabel":"EditSectionTransitionEffectView-module_transitionLabel__3eI8W","defaultTransitionIcon":"EditSectionTransitionEffectView-module_defaultTransitionIcon___8vCp icons-module_star__1AEW6 icons-module_icon__16IVx","markAsDefaultTransitionIcon":"EditSectionTransitionEffectView-module_markAsDefaultTransitionIcon__3awuj icons-module_starOutlined__1TAng icons-module_icon__16IVx","defaultTransitionIcons":"EditSectionTransitionEffectView-module_defaultTransitionIcons__gGQxe","upperSection":"EditSectionTransitionEffectView-module_upperSection__3p5PI","lowerSection":"EditSectionTransitionEffectView-module_lowerSection__2qKdg","upperBackground":"EditSectionTransitionEffectView-module_upperBackground__3bp0X","lowerBackground":"EditSectionTransitionEffectView-module_lowerBackground__1UCTP","fade":"EditSectionTransitionEffectView-module_fade__XCRHM","FadeA":"EditSectionTransitionEffectView-module_FadeA__3u-VS","FadeB":"EditSectionTransitionEffectView-module_FadeB__a1PxS","scroll":"EditSectionTransitionEffectView-module_scroll__2RfMf","scrollOver":"EditSectionTransitionEffectView-module_scrollOver__3cJJ7","reveal":"EditSectionTransitionEffectView-module_reveal__1_gtk","Translate":"EditSectionTransitionEffectView-module_Translate__CLYTi","beforeAfter":"EditSectionTransitionEffectView-module_beforeAfter__3oeDi","TranslateYPositive":"EditSectionTransitionEffectView-module_TranslateYPositive__10FZp","-webkit-animation":"EditSectionTransitionEffectView-module_animation__3PSoZ","animation":"EditSectionTransitionEffectView-module_animation__3PSoZ"};
styleInject(css$h);

var EditSectionTransitionEffectView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: function template() {
    return "\n    <label>\n        <span class=\"name\"></span>\n        <span class=\"inline_help\"></span>\n    </label>\n    <div class=\"transitions_container\" />\n    ";
  },
  events: {
    'click input': 'save'
  },
  ui: {
    label: 'label',
    container: ".transitions_container"
  },
  onRender: function onRender() {
    this.ui.label.attr('for', this.cid);
    this.appendItems();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  appendItems: function appendItems() {
    this.ui.container.append([this.transitionItem({
      value: 'fade'
    }, [this.transitionVariant({
      value: 'fadeBg'
    }), this.transitionVariant({
      value: 'fade'
    })]), this.transitionItem({
      value: 'scroll'
    }), this.transitionItem({
      value: 'scrollOver'
    }), this.transitionItem({
      value: 'reveal'
    }), this.transitionItem({
      value: 'beforeAfter'
    })].join(''));
  },
  save: function save() {
    this.saveRadioInout('transition', this.model, this.options.propertyName);
    this.saveRadioInout('defaultTransition', this.options.defaultsModel, this.options.defaultPropertyName);
  },
  saveRadioInout: function saveRadioInout(name, model, propertyName) {
    var checkedInput = this.ui.container.find("input[name=\"".concat(name, "\"]:checked"));
    model.set(propertyName, checkedInput.attr('value'));
  },
  load: function load() {
    if (!this.isClosed) {
      this.loadRadioInput('defaultTransition', this.options.defaultsModel, this.options.defaultPropertyName);
      var input = this.loadRadioInput('transition', this.model, this.options.propertyName);
      this.$el.find(".".concat(styles$f.container)).removeClass(styles$f.active);
      input.parents(".".concat(styles$f.container)).addClass(styles$f.active);
      input.parents(".".concat(styles$f.container)).find(".".concat(styles$f.transitionLabel)).attr('for', input.attr('id'));
    }
  },
  loadRadioInput: function loadRadioInput(name, model, propertyName) {
    var value = model.get(propertyName);
    var input = this.ui.container.find("input[name=\"".concat(name, "\"][value=\"").concat(value, "\"]:enabled"));

    if (!input.length) {
      input = this.ui.container.find("input[name=\"".concat(name, "\"]:enabled")).first();
    }

    input.prop('checked', true);
    return input;
  },
  transitionItem: function transitionItem(_ref) {
    var value = _ref.value;
    var variants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return "\n      <div class='".concat(styles$f.container, "\n           ").concat(this.options.optionDisabled(value) ? styles$f.disabled : '', "'>\n        <label for='").concat(value, "' class=\"").concat(styles$f.transitionLabel, "\">\n          <div class='").concat(styles$f.transition, " ").concat(styles$f[value], "'>\n            ").concat(this.transitionPreview(), "\n            <div class='").concat(styles$f.input, "'>\n              ").concat(variants.length ? '' : this.transitionInput({
      value: value
    }), "\n              ").concat(this.transitionDisplayName(value), "\n            </div>\n          </div>\n        </label>\n        ").concat(variants.length ? variants.join('') : this.defaultTransitionField({
      value: value
    }), "\n      </div>\n    ");
  },
  transitionPreview: function transitionPreview() {
    return "\n      <div class='".concat(styles$f.animation, "'>\n        <div class='").concat(styles$f.upperSection, "'>\n          <div class='").concat(styles$f.upperBackground, "'></div>\n        </div>\n        <div class='").concat(styles$f.lowerSection, "'>\n          <div class='").concat(styles$f.lowerBackground, "'></div>\n        </div>\n      </div>\n    ");
  },
  transitionVariant: function transitionVariant(_ref2) {
    var value = _ref2.value;
    return "\n      <div class=\"".concat(styles$f.transitionVariant, "\">\n        <label for=").concat(value, " class=\"").concat(styles$f.transitionVariantLabel, "\">\n          ").concat(this.transitionInput({
      value: value
    }), "\n          ").concat(this.transitionVariantDisplayName(value), "\n        </label>\n        ").concat(this.defaultTransitionField({
      value: value
    }), "\n      </div>\n    ");
  },
  transitionInput: function transitionInput(_ref3) {
    var value = _ref3.value;
    return "\n      <input type='radio'\n             name='transition'\n             value='".concat(value, "'\n             id='").concat(value, "'\n             ").concat(this.options.optionDisabled(value) ? 'disabled' : '', " />\n    ");
  },
  defaultTransitionField: function defaultTransitionField(_ref4) {
    var value = _ref4.value;
    var markAsDefaultLabel = I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.mark_as_default_transition', {
      name: this.transitionDisplayName(value)
    });
    return "\n      <label class='".concat(styles$f.defaultTransition, "'\n             for='defaultTransition-").concat(value, "'>\n        <input type='radio'\n               id='defaultTransition-").concat(value, "'\n               name='defaultTransition'\n               value='").concat(value, "' aria-label=\"").concat(markAsDefaultLabel, "\" />\n        <div class='").concat(styles$f.defaultTransitionIcons, "'>\n          <div class='").concat(styles$f.defaultTransitionIcon, "'\n               title=\"").concat(I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.default_transition', {
      name: this.transitionDisplayName(value)
    }), "\" />\n          <div class='").concat(styles$f.markAsDefaultTransitionIcon, "'\n               title=\"").concat(markAsDefaultLabel, "\" />\n    </div>\n    </label>\n    ");
  },
  transitionDisplayName: function transitionDisplayName(value) {
    return I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.values.' + value);
  },
  transitionVariantDisplayName: function transitionVariantDisplayName(value) {
    return I18n.t(this.options.attributeTranslationKeyPrefixes + '.transition.variants.' + value);
  }
});

var EditSectionTransitionView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section_transition',
  configure: function configure(configurationEditor) {
    var entry = this.options.entry;
    var sectionIndex = entry.sections.indexOf(this.model);
    var previousSection = entry.sections.at(sectionIndex - 1);
    var availableTransitions = getAvailableTransitionNames(this.model.configuration.attributes, previousSection.configuration.attributes);
    configurationEditor.tab('transition', function () {
      this.input('transition', EditSectionTransitionEffectView, {
        defaultsModel: entry.metadata.configuration,
        defaultPropertyName: 'defaultTransition',
        optionDisabled: function optionDisabled(value) {
          return !availableTransitions.includes(value);
        }
      });
    });
  }
});

var EditContentElementView = EditConfigurationView.extend({
  translationKeyPrefix: function translationKeyPrefix() {
    return "pageflow_scrolled.editor.content_elements.".concat(this.model.get('typeName'));
  },
  configure: function configure(configurationEditor) {
    this.options.editor.contentElementTypes.setupConfigurationEditor(this.model.get('typeName'), configurationEditor, {
      entry: this.options.entry,
      contentElement: this.model
    });
  },
  destroyModel: function destroyModel() {
    var contentElementType = this.options.editor.contentElementTypes.findByTypeName(this.model.get('typeName'));

    if (contentElementType.handleDestroy) {
      var result = contentElementType.handleDestroy(this.model);

      if (result === false) {
        return false;
      }
    }

    this.options.entry.deleteContentElement(this.model);
  }
});

var SideBarController = Marionette.Controller.extend({
  initialize: function initialize(options) {
    this.region = options.region;
    this.entry = options.entry;
  },
  chapter: function chapter(id, tab) {
    this.region.show(new EditChapterView({
      entry: this.entry,
      model: this.entry.chapters.get(id),
      editor: editor$2
    }));
  },
  section: function section(id, tab) {
    this.region.show(new EditSectionView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      editor: editor$2
    }));
  },
  sectionTransition: function sectionTransition(id, tab) {
    this.region.show(new EditSectionTransitionView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      editor: editor$2
    }));
  },
  contentElement: function contentElement(id, tab) {
    this.region.show(new EditContentElementView({
      entry: this.entry,
      model: this.entry.contentElements.get(id),
      editor: editor$2
    }));
  }
});

var css$i = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}\n\n.BrowserNotSupportedView-module_main__TMVR7 {\n    height: 97vh;\n    width: 100vw;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.BrowserNotSupportedView-module_container__2FpC1 {\n    color: #000000;\n    height: auto;\n    width: 80%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n}\n\n.BrowserNotSupportedView-module_texts__3kcI1 {\n    display: flex;\n    height: auto;\n    flex-direction: column;\n    width: 80%;\n    align-items: center;\n    padding: 2%;\n}\n\n.BrowserNotSupportedView-module_texts__3kcI1 h2 {\n    text-align: center;\n}\n\n.BrowserNotSupportedView-module_texts__3kcI1 p {\n    margin-top: 0;\n    text-align: center;\n}\n\n.BrowserNotSupportedView-module_icons__3i7mG {\n    display: flex;\n    opacity: 0.65;\n    width: 80%;\n    height: auto;\n    flex-wrap: wrap;\n    justify-content: center;\n    padding: 1%;\n    background-color: #FAF9ED;\n}\n\n.BrowserNotSupportedView-module_child__1sr8s {\n    height: 100px;\n    width: 100px;\n    margin-left: 1%;\n}\n\n\n.BrowserNotSupportedView-module_chrome__1hS6F {    \n}\n\n.BrowserNotSupportedView-module_edge__1aaHV {\n}\n\n.BrowserNotSupportedView-module_firefox__1fM8y {\n}\n\n.BrowserNotSupportedView-module_safari__Y2ea8 {\n}\n\n/*Media Queries*/\n/*Small mobile devices in landscape.*/\n@media (max-width: 767px) and (orientation: landscape){\n    .BrowserNotSupportedView-module_texts__3kcI1 p {\n        font-size: 14px;\n    }\n    .BrowserNotSupportedView-module_icons__3i7mG, .BrowserNotSupportedView-module_texts__3kcI1 {\n        width: 100%;\n    }     \n}";
var styles$g = {"main":"BrowserNotSupportedView-module_main__TMVR7","container":"BrowserNotSupportedView-module_container__2FpC1","texts":"BrowserNotSupportedView-module_texts__3kcI1","icons":"BrowserNotSupportedView-module_icons__3i7mG","child":"BrowserNotSupportedView-module_child__1sr8s","chrome":"BrowserNotSupportedView-module_chrome__1hS6F icons-module_chrome__1XHpi","edge":"BrowserNotSupportedView-module_edge__1aaHV icons-module_edge__2KQ9q","firefox":"BrowserNotSupportedView-module_firefox__1fM8y icons-module_firefox__22UR1","safari":"BrowserNotSupportedView-module_safari__Y2ea8 icons-module_safari__3nzsc"};
styleInject(css$i);

var BrowserNotSupportedView = Marionette.ItemView.extend({
  template: function template() {
    return "\n     <div class=\"".concat(styles$g.main, "\" />\n  ");
  },
  className: styles$g.main,
  ui: cssModulesUtils.ui(styles$g, 'main'),
  onShow: function onShow() {
    this.appendOptions();
  },
  appendOptions: function appendOptions() {
    var container = "<div class='".concat(styles$g.container, "'>\n                        <div class='").concat(styles$g.texts, "'>\n                          <h2>").concat(I18n.t('pageflow_scrolled.editor.browser_not_supported.heading'), "</h2>\n                          <p>").concat(I18n.t('pageflow_scrolled.editor.browser_not_supported.text'), "</p>\n                        </div>\n                        <div class='").concat(styles$g.icons, "'>\n                          <span class='").concat(styles$g.chrome, " ").concat(styles$g.child, "'></span>\n                          <div class='").concat(styles$g.firefox, " ").concat(styles$g.child, "'></div>\n                          <div class='").concat(styles$g.safari, " ").concat(styles$g.child, "'></div>\n                          <div class='").concat(styles$g.edge, " ").concat(styles$g.child, "'></div>\n                        </div>\n                    </div>");
    this.ui.main.append($(container));
  }
});

editor.registerEntryType('scrolled', {
  entryModel: ScrolledEntry,
  previewView: function previewView(options) {
    return new EntryPreviewView(_objectSpread2(_objectSpread2({}, options), {}, {
      editor: editor
    }));
  },
  outlineView: EntryOutlineView,
  appearanceInputs: function appearanceInputs(tabView) {},
  supportsExtendedFileRights: true,
  isBrowserSupported: function isBrowserSupported() {
    return browser.agent.matchesDesktopChrome({
      minVersion: 20
    }) || browser.agent.matchesDesktopFirefox({
      minVersion: 20
    }) || browser.agent.matchesDesktopSafari({
      minVersion: 3
    }) || browser.agent.matchesDesktopEdge({
      minVersion: 20
    });
  },
  browserNotSupportedView: BrowserNotSupportedView
});
editor.registerSideBarRouting({
  router: SideBarRouter,
  controller: SideBarController
});
editor.registerFileSelectionHandler('contentElementConfiguration', ContentElementFileSelectionHandler);
editor.widgetTypes.registerRole('header', {
  isOptional: true
});
editor.widgetTypes.register('defaultNavigation', {
  configurationEditorView: ConfigurationEditorView.extend({
    configure: function configure() {
      this.tab('defaultNavigation', function () {
        this.input('hideToggleMuteButton', CheckBoxInputView);
        this.input('hideSharingButton', CheckBoxInputView);
        this.input('fixedOnDesktop', CheckBoxInputView);
      });
    }
  })
});

var css$j = ".icons-module_icon__16IVx::before,\n.icons-module_icon__16IVx::after {\n  font-family: \"entypo\";\n}.icons-module_arrowsCcw__3_nrJ,\n.icons-module_attention__1sssG,\n.icons-module_cancel__1PjiX,\n.icons-module_check__3Lkw9,\n.icons-module_drag__p7HUE,\n.icons-module_helpCircled__D_oKU,\n.icons-module_plusCircled__20FlJ,\n.icons-module_rightBold__21WdT,\n.icons-module_rightOpen__9vsOG,\n.icons-module_star__1AEW6,\n.icons-module_starOutlined__1TAng,\n.icons-module_trash__DH1EH {\n}.icons-module_arrowsCcw__3_nrJ::before {\n  content: \"\\1F504\";\n}.icons-module_attention__1sssG::before {\n  content: \"\\26A0\";\n}.icons-module_cancel__1PjiX::before {\n  content: \"\\2715\";\n}.icons-module_check__3Lkw9::before {\n  content: \"\\2713\";\n}.icons-module_drag__p7HUE {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  line-height: 10px;\n}.icons-module_drag__p7HUE::before {\n  content: \"\\E75F\";\n}.icons-module_drag__p7HUE::after {\n  content: \"\\E75C\";\n}.icons-module_helpCircled__D_oKU::before {\n  content: \"\\E704\";\n}.icons-module_plusCircled__20FlJ::before {\n  content: \"\\2795\";\n}.icons-module_rightBold__21WdT::before {\n  content: \"\\E4AE\";\n}.icons-module_rightOpen__9vsOG::before {\n  content: \"\\E75E\"\n}.icons-module_star__1AEW6::before {\n  content: \"\\2605\";\n}.icons-module_starOutlined__1TAng::before {\n  content: \"\\2606\";\n}.icons-module_trash__DH1EH::before {\n  content: \"\\E729\";\n}.icons-module_chrome__1XHpi {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM0LDI0YzAsNS41MjEtNC40NzksMTAtMTAsMTBzLTEwLTQuNDc5LTEwLTEwczQuNDc5LTEwLDEwLTEwUzM0LDE4LjQ3OSwzNCwyNHoiLz48bGluZWFyR3JhZGllbnQgaWQ9IlBheDhKY25Neml2dThmflNafmsxeWEiIHgxPSI1Ljc4OSIgeDI9IjMxLjMyNCIgeTE9IjM0LjM1NiIgeTI9IjIwLjc3OSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzRjYWY1MCIvPjxzdG9wIG9mZnNldD0iLjQ4OSIgc3RvcC1jb2xvcj0iIzRhYWY1MCIvPjxzdG9wIG9mZnNldD0iLjY2NSIgc3RvcC1jb2xvcj0iIzQzYWQ1MCIvPjxzdG9wIG9mZnNldD0iLjc5IiBzdG9wLWNvbG9yPSIjMzhhYTUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyIiBzdG9wLWNvbG9yPSIjMjdhNTUwIi8+PHN0b3Agb2Zmc2V0PSIuOTc4IiBzdG9wLWNvbG9yPSIjMTFhMDUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGE5ZTUwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWEpIiBkPSJNMzEuMzMsMjkuMjFsLTguMTYsMTQuNzdDMTIuNTEsNDMuNTUsNCwzNC43Niw0LDI0QzQsMTIuOTYsMTIuOTYsNCwyNCw0djExIGMtNC45NywwLTksNC4wMy05LDlzNC4wMyw5LDksOUMyNy4wMywzMywyOS43LDMxLjUxLDMxLjMzLDI5LjIxeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iUGF4OEpjbk16aXZ1OGZ+U1p+azF5YiIgeDE9IjMzLjU4IiB4Mj0iMzMuNTgiIHkxPSI2IiB5Mj0iMzQuNzk3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZkNzQ3Ii8+PHN0b3Agb2Zmc2V0PSIuNDgyIiBzdG9wLWNvbG9yPSIjZmZkNjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNjU1IiBzdG9wLWNvbG9yPSIjZmVkNDNlIi8+PHN0b3Agb2Zmc2V0PSIuNzc5IiBzdG9wLWNvbG9yPSIjZmNjZjMzIi8+PHN0b3Agb2Zmc2V0PSIuODc5IiBzdG9wLWNvbG9yPSIjZmFjOTIyIi8+PHN0b3Agb2Zmc2V0PSIuOTY0IiBzdG9wLWNvbG9yPSIjZjdjMTBjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjViYzAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWIpIiBkPSJNNDQsMjRjMCwxMS4wNS04Ljk1LDIwLTIwLDIwaC0wLjg0bDguMTctMTQuNzlDMzIuMzgsMjcuNzQsMzMsMjUuOTQsMzMsMjQgYzAtNC45Ny00LjAzLTktOS05VjRjNy44MSwwLDE0LjU1LDQuNDgsMTcuODUsMTFDNDMuMjEsMTcuNzEsNDQsMjAuNzYsNDQsMjR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXljIiB4MT0iMzYuMTI4IiB4Mj0iMTEuNTc0IiB5MT0iNDQuMjk3IiB5Mj0iMjguOTU0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjc1NzJmIi8+PHN0b3Agb2Zmc2V0PSIuNTIzIiBzdG9wLWNvbG9yPSIjZjc1NTJkIi8+PHN0b3Agb2Zmc2V0PSIuNzEyIiBzdG9wLWNvbG9yPSIjZjc1MDI2Ii8+PHN0b3Agb2Zmc2V0PSIuODQ2IiBzdG9wLWNvbG9yPSIjZjc0NjFiIi8+PHN0b3Agb2Zmc2V0PSIuOTU0IiBzdG9wLWNvbG9yPSIjZjczOTBhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjczMTAwIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1BheDhKY25Neml2dThmflNafmsxeWMpIiBkPSJNNDEuODQsMTVIMjRjLTQuOTcsMC05LDQuMDMtOSw5YzAsMS40OSwwLjM2LDIuODksMS4wMSw0LjEzSDE2TDcuMTYsMTMuMjZINy4xNCBDMTAuNjgsNy42OSwxNi45MSw0LDI0LDRDMzEuOCw0LDM4LjU1LDguNDgsNDEuODQsMTV6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJQYXg4SmNuTXppdnU4Zn5TWn5rMXlkIiB4MT0iMTkuMDUiIHgyPSIyOC45NSIgeTE9IjMwLjk1IiB5Mj0iMjEuMDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyYWE0ZjQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdhZDkiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjUGF4OEpjbk16aXZ1OGZ+U1p+azF5ZCkiIGQ9Ik0zMSwyNGMwLDMuODY3LTMuMTMzLDctNyw3cy03LTMuMTMzLTctN3MzLjEzMy03LDctN1MzMSwyMC4xMzMsMzEsMjR6Ii8+PC9zdmc+);\n}.icons-module_edge__2KQ9q {\n  background: url(data:image/png;base64,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);\n}.icons-module_firefox__22UR1 {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iIzAxNTc5QiIgZD0iTTI0IDVBMTkgMTkgMCAxIDAgMjQgNDNBMTkgMTkgMCAxIDAgMjQgNVoiLz48cGF0aCBmaWxsPSIjMDI3N0JEIiBkPSJNMzQsMjAuOGMwLTAuNiwwLTIuOS0xLjUtNC43Yy0wLjEtMC4xLTAuMi0wLjMtMC4yLTAuNGMtMC4xLTAuMS0wLjEtMC4yLTAuMi0wLjRMMzEuOSwxNWwtMC4yLTAuM2MtMC4yLTAuMy0wLjMtMC41LTAuMy0wLjVjLTAuNC0wLjYtMC41LTEuNC0wLjEtMi4xYzAuMS0wLjIsMC4zLTAuNCwwLjQtMC42Yy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMmMwLDAsMCwwLTAuMSwwYy0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNmwtMC43LTAuNWwwLDBDMjkuMyw5LjksMjksOS44LDI5LDkuN2MtMC43LTAuNC0xLjEtMS4xLTEtMS45YzAuMS0wLjgsMC42LTEuNSwxLjQtMS43YzAuMSwwLDAuMy0wLjEsMC41LTAuMWMwLDAsMCwwLTAuMS0wLjFDMjgsNS4zLDI2LDUsMjQsNUMxNi42LDUsMTAuMSw5LjMsNywxNS41YzAsMC4yLDAsMC4zLDAsMC41YzAsNy4yLDYuMywxMywxNCwxM0MyNi45LDI5LDMxLjksMjUuNiwzNCwyMC44eiIvPjxwYXRoIGZpbGw9IiNGRkYxNzYiIGQ9Ik0zMCw4YzAsMCwwLjMtMC4xLDAuOS0wLjFjMC4zLDAsMC42LDAsMSwwYzAuNCwwLDAuOCwwLjEsMS4zLDAuMmMwLjUsMC4xLDEsMC4zLDEuNSwwLjVjMC41LDAuMiwxLjEsMC41LDEuNiwwLjljMC41LDAuMywxLDAuOCwxLjUsMS4yYzAuNSwwLjQsMC45LDEsMS4zLDEuNWMwLjMsMC42LDAuNywxLjEsMSwxLjdjMC4zLDAuNiwwLjUsMS4yLDAuNywxLjhjMC4yLDAuNiwwLjMsMS4yLDAuNCwxLjdjMC4xLDAuNiwwLjEsMS4xLDAuMSwxLjVjMCwwLjIsMCwwLjUsMCwwLjdjMCwwLjIsMCwwLjQtMC4xLDAuNmMwLDAuNC0wLjEsMC43LTAuMSwxQzQxLjEsMjEuNyw0MSwyMiw0MSwyMnMtMC4yLTAuMy0wLjQtMC44Yy0wLjEtMC4yLTAuMy0wLjUtMC40LTAuOWMtMC4xLTAuMy0wLjMtMC43LTAuNS0xLjFjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4zYy0wLjItMC40LTAuNS0wLjktMC43LTEuNGMtMC4yLTAuNS0wLjUtMC45LTAuOC0xLjRjLTAuMy0wLjUtMC42LTAuOS0wLjktMS4zYy0wLjMtMC40LTAuNi0wLjktMS0xLjJjLTAuNC0wLjQtMC43LTAuOC0xLjEtMS4xYy0wLjMtMC40LTAuNy0wLjctMS4xLTFjLTAuNC0wLjMtMC43LTAuNi0xLjEtMC44Yy0wLjMtMC4zLTAuNy0wLjUtMS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC41QzMwLjMsOC4yLDMwLDgsMzAsOHoiLz48cGF0aCBmaWxsPSIjRkREODM1IiBkPSJNNDMuMSwxNy42Yy0wLjMtMi4yLTEuMi00LjItMi4yLTUuNmMtMC41LTAuNy0xLTEuMi0xLjMtMS41QzM5LjIsMTAuMiwzOSwxMCwzOSwxMHMwLDAuMywwLjEsMC44YzAuMSwwLjUsMC4xLDEuMSwwLjIsMS45YzAuMSwwLjQsMC4xLDAuOCwwLjIsMS4yYy0wLjQtMC42LTAuOS0xLjItMS40LTEuNmMtMC41LTAuNS0xLjEtMC44LTEuNC0xQzM2LjIsMTEuMSwzNiwxMSwzNiwxMXMwLjEsMC4yLDAuMiwwLjZjMC4xLDAuNCwwLjMsMC45LDAuNSwxLjZjMC4yLDAuNywwLjUsMS42LDAuOCwyLjVjLTAuNi0wLjctMS4yLTEuMy0xLjgtMS43Yy0wLjctMC40LTEuMy0wLjctMS44LTAuOEMzMy4zLDEzLDMzLDEzLDMzLDEzczAuMiwwLjIsMC40LDAuNmMwLjEsMC4yLDAuMywwLjQsMC40LDAuN2MwLjIsMC4zLDAuMywwLjYsMC41LDAuOWMwLjMsMC42LDAuNywxLjMsMSwyLjFjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjJjMC4xLDAuNCwwLjQsMC44LDAuNSwxLjNjMC4yLDAuNCwwLjMsMC44LDAuNSwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjNjMC4xLDAuNCwwLjMsMC44LDAuNCwxLjJjMC4xLDAuNCwwLjIsMC44LDAuNCwxLjFjMC4zLDAuNywwLjUsMS4zLDAuNywxLjdDMzguOSwyNi44LDM5LDI3LDM5LDI3czAuMS0wLjIsMC4zLTAuN2MwLjEtMC4yLDAuMi0wLjUsMC4yLTAuOGMwLjEtMC4zLDAuMi0wLjcsMC4yLTEuMWMwLTAuMywwLjEtMC42LDAuMS0wLjlDMzkuOSwyMy44LDQwLDI0LDQwLDI0czAuMS0wLjIsMC4zLTAuNmMwLjEtMC4yLDAuMi0wLjQsMC4zLTAuN2MwLDAsMC0wLjEsMC0wLjFjMCwwLjIsMCwwLjUsMC4xLDAuN2MwLDAuNCwwLjEsMC43LDAuMSwxYzAsMC4zLDAsMC42LDAsMC45YzAsMC41LDAuMSwwLjgsMC4xLDAuOHMwLjItMC4yLDAuNS0wLjZjMC4xLTAuMiwwLjMtMC40LDAuNS0wLjdjMC4yLTAuMywwLjMtMC42LDAuNS0xYzAuMi0wLjQsMC4zLTAuOCwwLjQtMS4zYzAuMS0wLjUsMC4yLTEsMC4zLTEuNWMwLjEtMC41LDAuMS0xLjEsMC4xLTEuNkM0My4zLDE4LjcsNDMuMiwxOC4xLDQzLjEsMTcuNnoiLz48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNNDQuMSwxOS44QzQ0LjEsMTkuMyw0NCwxOSw0NCwxOXMtMC4yLDAuMy0wLjUsMC43Yy0wLjMsMC41LTAuNiwxLjEtMSwxLjljLTAuMywwLjctMC43LDEuNS0xLjEsMi4zYzAtMC44LDAtMS41LTAuMS0yLjJjLTAuMS0wLjYtMC4yLTEuMS0wLjMtMS42Yy0wLjItMC41LTAuMy0xLTAuNS0xLjRjLTAuMy0wLjktMC43LTEuNS0xLTJDMzkuMiwxNi4yLDM5LDE2LDM5LDE2cy0wLjEsMS4yLTAuMSwzYzAsMC45LTAuMSwxLjgtMC4yLDIuOWMwLDAuNS0wLjEsMS0wLjEsMS42YzAsMC41LTAuMSwxLjEtMC4yLDEuNmMwLDAuMSwwLDAuMywwLDAuNGMtMC4xLTAuOS0wLjQtMS44LTAuOC0yLjRjLTAuMy0wLjctMC43LTEuMi0xLTEuNUMzNi4yLDIxLjEsMzYsMjEsMzYsMjFzMCwwLjMsMCwwLjdjMCwwLjQsMCwxLTAuMSwxLjdjLTAuMSwxLjMtMC4zLDMtMC41LDQuNmMtMC4xLDAuNC0wLjIsMC44LTAuMiwxLjJjLTAuMSwwLjQtMC4yLDAuOC0wLjIsMS4yYy0wLjEsMC40LTAuMiwwLjgtMC4zLDEuMWMtMC4xLDAuNC0wLjIsMC43LTAuMiwxYy0wLjEsMC4zLTAuMSwwLjctMC4yLDAuOWMtMC4xLDAuMy0wLjEsMC41LTAuMiwwLjhDMzQsMzQuNywzNCwzNSwzNCwzNXMwLjItMC4xLDAuNi0wLjRjMC40LTAuMywwLjktMC42LDEuNC0xLjJjMC4yLTAuMywwLjUtMC42LDAuOC0xYzAuMi0wLjQsMC41LTAuNywwLjctMS4xYzAsMC4zLTAuMSwwLjYtMC4xLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMiwwLjlDMzcsMzMuNywzNywzNCwzNywzNGMwLjEtMC4xLDAuNCwwLDAuNywwLjFjMCwwLjEtMC4xLDAuMi0wLjEsMC4yYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOUMzNy4xLDM1LjcsMzcsMzYsMzcsMzZzMC4zLTAuMSwwLjctMC40YzAuMi0wLjIsMC41LTAuMywwLjgtMC42YzAuMy0wLjIsMC42LTAuNSwwLjktMC45YzAuMy0wLjMsMC42LTAuNywxLTEuMWMwLjMtMC40LDAuNi0wLjksMC45LTEuNGMwLjYtMSwxLjEtMi4xLDEuNS0zLjJjMC40LTEuMSwwLjgtMi4zLDEtMy40YzAuMi0xLjEsMC4zLTIuMSwwLjQtM0M0NC4yLDIxLjEsNDQuMiwyMC40LDQ0LjEsMTkuOHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNNDEuNCwzMC40Yy0wLjQsMC4yLTAuOCwwLjYtMS40LDFjLTAuOCwwLjYtMS43LDEuNC0yLjYsMi4zYzAuMS0wLjMsMC4zLTAuNiwwLjQtMC45YzAuMy0wLjksMC40LTEuNywwLjUtMi40YzAtMC43LDAtMS4zLTAuMS0xLjdDMzguMSwyOC4yLDM4LDI4LDM4LDI4cy0wLjIsMC4yLTAuNCwwLjVjLTAuMiwwLjMtMC42LDAuOC0xLDEuM2MtMC40LDAuNS0wLjgsMS4yLTEuMiwxLjhjLTAuMSwwLjEtMC4xLDAuMi0wLjIsMC4zYzAuMi0wLjYsMC4yLTEuMywwLjItMS45YzAtMC44LTAuMi0xLjYtMC40LTIuMmMtMC4yLTAuNi0wLjUtMS4xLTAuNy0xLjRDMzQuMiwyNi4yLDM0LDI2LDM0LDI2cy0wLjEsMC4yLTAuMiwwLjZjLTAuMSwwLjMtMC4zLDAuOC0wLjUsMS40Yy0wLjIsMC41LTAuMywxLjEtMC41LDEuOGMtMC4xLDAuMy0wLjIsMC42LTAuMywxYy0wLjEsMC4zLTAuMiwwLjYtMC4zLDAuOGMtMS45LDEuOS00LjIsMi40LTYuNCwyLjVjLTEuMiwwLTIuMy0wLjItMy4zLTAuNWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMtMS41LTAuNS0yLjktMS40LTQuMi0yLjZjMS45LDAuMiwzLjctMC4yLDUuMi0wLjlsMi41LTEuNmwwLDBjMC4zLTAuMSwwLjYtMC4xLDAuOSwwYzAuNi0wLjEsMC44LTAuNCwwLjYtMWMtMC4zLTAuNC0wLjgtMC44LTEuMy0xLjFjLTEuMy0wLjctMi42LTAuNi00LDAuM2MtMS4zLDAuNy0yLjUsMC42LTMuOC0wLjFjLTMuMS0xLjYtMS45LTUuNywxLjQtMy42YzAuMi0xLTAuMS0yLjEtMC43LTMuMmMwLDAsMCwwLDAsMGMtMi45LTUuMywwLjQtOS42LDEuNS0xMC4zYy0yLDAuMi0zLjgsMS4xLTUuNCwyLjZDNC45LDEwLjksNCwyMC45LDQsMjFsMS4yLTEuMWMtMC40LDEuMS0wLjcsMi4yLTAuOCwzLjRDNCwyNy4yLDUuMSwzMSw3LjcsMzQuOEMxMS43LDM5LjksMTgsNDMsMjQsNDNjNi44LDAsMTEuMi0yLjUsMTQuMS01LjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZjMC42LTAuNywxLjItMS40LDEuNy0yLjJjMC41LTAuNywwLjgtMS41LDEuMS0yLjJjMC4yLTAuNywwLjQtMS4zLDAuNS0xLjdDNDIsMzAuMyw0MiwzMCw0MiwzMFM0MS44LDMwLjEsNDEuNCwzMC40eiIvPjxwYXRoIGZpbGw9IiNFRjZDMDAiIGQ9Ik0xMiwyOGMtMC4yLTcsNC4zLTYuNCw2LjYtNS42QzE3LDIyLjEsMTYuMywyMy42LDE3LDI1QzE2LjcsMjUsMTMuNiwyNC43LDEyLDI4eiBNMTguMywzMC45YzEuOSwwLjIsMy43LTAuMiw1LjItMC45bDIuNS0xLjZsMCwwYzAuMi0wLjEsMC41LTAuMSwwLjcsMGwwLDBjLTIuOS0xLjctNiwxLjktMTIuOCwwLjhDMTUuNiwzMC41LDE4LjMsMzAuOSwxOC4zLDMwLjl6IE0xOC4xLDE0LjVjLTAuMiwxLjUsMC4xLDMuMywxLjEsNS4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwQzIwLjYsMTguOSwyMiwxOCwyMiwxOHMyLTIsMC0yQzIwLjEsMTYsMTguOCwxNS4yLDE4LjEsMTQuNXogTTEwLjMsMTIuNEM5LjQsMTEuNiw4LDEwLDgsOGMwLDAtMi40LDMuOS0xLjUsN0M3LjQsMTMuOSw4LjcsMTMsMTAuMywxMi40eiIvPjxwYXRoIGZpbGw9IiNGRkNDODAiIGQ9Ik0xOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMTkuMiwxOS43LDE5LjIsMTkuNywxOS4yLDE5LjdDMjAuNiwxOC45LDIyLDE4LDIyLDE4czAuMi0wLjIsMC40LTAuNEwyMiwxN2gtMy44QzE4LjQsMTcuOSwxOC43LDE4LjgsMTkuMiwxOS43eiIvPjxwYXRoIGZpbGw9IiM1RDQwMzciIGQ9Ik0yMiwxNmMtMC4zLDAtMC42LDAtMC45LTAuMUwyMSwxNmMwLDAsMC44LDEuMywxLDJDMjIsMTgsMjQsMTYsMjIsMTZ6Ii8+PC9zdmc+);\n}.icons-module_safari__3nzsc {\n  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9Ijk2cHgiIGhlaWdodD0iOTZweCI+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTQ0LDI0YzAsMTEuMDQ0LTguOTU2LDIwLTIwLDIwUzQsMzUuMDQ0LDQsMjRTMTIuOTU2LDQsMjQsNFM0NCwxMi45NTYsNDQsMjR6Ii8+PHBhdGggZmlsbD0iIzQ0OGFmZiIgZD0iTTQxLDI0YzAsOS4zOTEtNy42MDksMTctMTcsMTdTNywzMy4zOTEsNywyNFMxNC42MDksNywyNCw3UzQxLDE0LjYwOSw0MSwyNHoiLz48cGF0aCBmaWxsPSIjZmYzZDAwIiBkPSJNMjEuODk4LDIxLjg5OGw0LjIwMyw0LjIwM2w5LjE5OS0xMy40MDJMMjEuODk4LDIxLjg5OHoiLz48cGF0aCBmaWxsPSIjYmYzNjBjIiBkPSJNMjQsMjRsMTEuMzAxLTExLjMwMWwtOS4xOTksMTMuNDAyTDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMS44OTgsMjEuODk4bC05LjE5OSwxMy40MDJsMTMuNDAyLTkuMTk5TDIxLjg5OCwyMS44OTh6Ii8+PHBhdGggZmlsbD0iI2JkYmRiZCIgZD0iTTI0LDI0TDEyLjY5OSwzNS4zMDFsMTMuNDAyLTkuMTk5TDI0LDI0eiIvPjxwYXRoIGZpbGw9IiNiYmRlZmIiIGQ9Ik0xNy4xMDIsMTAuNjk5YzAuNTk4LTAuMzAxLDEuMTk5LTAuNTk4LDEuNzk3LTAuODAxbDEuMjAzLDIuNzAzbC0xLjgwMSwwLjc5N0wxNy4xMDIsMTAuNjk5eiBNMzYsMjVoMi44OThjMC0wLjMwMSwwLjEwMi0wLjY5OSwwLjEwMi0xczAtMC42OTktMC4xMDItMUgzNlYyNXogTTEyLjY5OSwxNC4xMDJsMi4xMDIsMi4wOThsMS4zOTgtMS4zOThsLTIuMDk4LTIuMTAyQzEzLjYwMiwxMy4xOTksMTMuMTk5LDEzLjYwMiwxMi42OTksMTQuMTAyeiBNMjUsOS4xMDJDMjQuNjk5LDksMjQuMzAxLDksMjQsOXMtMC42OTksMC0xLDAuMTAyVjEyaDJWOS4xMDJ6IE0zMC4zOTgsMTAuNWMtMC41OTgtMC4zMDEtMS4xOTktMC41LTEuODk4LTAuNjk5bC0xLjEwMiwyLjgwMWwxLjkwMiwwLjY5OUwzMC4zOTgsMTAuNXogTTEyLjUsMjAuNWwwLjY5OS0xLjg5OEwxMC41LDE3LjVjLTAuMzAxLDAuNjAyLTAuNSwxLjE5OS0wLjY5OSwxLjg5OEwxMi41LDIwLjV6IE0xMiwyM0g5LjEwMkM5LDIzLjMwMSw5LDIzLjY5OSw5LDI0czAsMC42OTksMC4xMDIsMUgxMlYyM3ogTTM1LjUsMjcuNWwtMC42OTksMS44OThMMzcuNSwzMC41YzAuMzAxLTAuNjAyLDAuNS0xLjE5OSwwLjY5OS0xLjg5OEwzNS41LDI3LjV6IE0zOC4xMDIsMTguODk4Yy0wLjIwMy0wLjU5OC0wLjUtMS4xOTktMC44MDEtMS43OTdsLTIuNjk5LDEuMTk5bDAuNzk3LDEuODAxTDM4LjEwMiwxOC44OTh6IE0zNS4zMDEsMzMuODk4bC0yLjEwMi0yLjA5OGwtMS4zOTgsMS4zOThsMi4wOTgsMi4xMDJDMzQuMzk4LDM0LjgwMSwzNC44MDEsMzQuMzk4LDM1LjMwMSwzMy44OTh6IE0xMy4zOTgsMjkuNjk5bC0wLjc5Ny0xLjgwMWwtMi43MDMsMS4yMDNjMC4yMDMsMC41OTgsMC41LDEuMTk5LDAuODAxLDEuNzk3TDEzLjM5OCwyOS42OTl6IE0yOS42OTksMzQuNjAybC0xLjgwMSwwLjc5N2wxLjIwMywyLjcwM2MwLjU5OC0wLjIwMywxLjE5OS0wLjUsMS43OTctMC44MDFMMjkuNjk5LDM0LjYwMnogTTIwLjUsMzUuNWwtMS44OTgtMC42OTlMMTcuNSwzNy41YzAuNjAyLDAuMzAxLDEuMTk5LDAuNSwxLjg5OCwwLjY5OUwyMC41LDM1LjV6IE0yNSwzOC44OThWMzZoLTJ2Mi44OThjMC4zMDEsMCwwLjY5OSwwLjEwMiwxLDAuMTAyUzI0LjY5OSwzOSwyNSwzOC44OTh6Ii8+PC9zdmc+);\n}\n\n.buttons-module_primaryIconButton__KHPA9 {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}\n\n.buttons-module_secondaryIconButton__4LT0V {\n  /* see app/assets/stylesheets/pageflow/editor/composable.scss */\n}\n\n.buttons-module_unstyledButton__3m76W {\n  border: 0;\n  text-align: initial;\n}\n\n.buttons-module_addButton__2pN-g {\n}\n\n.buttons-module_cancelButton__1xJCN {\n}\n\n.buttons-module_saveButton__1M-qM {\n}\n\n.buttons-module_selectFileButton__khOoU {\n}\n";
var buttons_module = {"primaryIconButton":"buttons-module_primaryIconButton__KHPA9 primary_icon_button","secondaryIconButton":"buttons-module_secondaryIconButton__4LT0V secondary_icon_button","unstyledButton":"buttons-module_unstyledButton__3m76W","addButton":"buttons-module_addButton__2pN-g buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_plusCircled__20FlJ icons-module_icon__16IVx","cancelButton":"buttons-module_cancelButton__1xJCN buttons-module_secondaryIconButton__4LT0V secondary_icon_button icons-module_cancel__1PjiX icons-module_icon__16IVx","saveButton":"buttons-module_saveButton__1M-qM buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_check__3Lkw9 icons-module_icon__16IVx","selectFileButton":"buttons-module_selectFileButton__khOoU buttons-module_primaryIconButton__KHPA9 primary_icon_button icons-module_rightOpen__9vsOG icons-module_icon__16IVx"};
styleInject(css$j);

var css$k = ".NoOptionsHintView-module_hint__1etP_ {\n  color: var(--ui-on-surface-color-light);\n  text-align: center;\n  margin-top: 30px;\n}\n";
var styles$h = {"hint":"NoOptionsHintView-module_hint__1etP_"};
styleInject(css$k);

var NoOptionsHintView = Marionette.ItemView.extend({
  className: styles$h.hint,
  template: function template() {
    return I18n.t('pageflow_scrolled.editor.no_options');
  }
});

/*global pageflow*/
Object.assign(pageflow, globalInterop);

export { InlineFileRightsMenuItem, NoOptionsHintView, buttons_module as buttonStyles, editor };
