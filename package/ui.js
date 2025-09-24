import Marionette from 'backbone.marionette';
import _ from 'underscore';
import $ from 'jquery';
import I18n$1 from 'i18n-js';
import Backbone from 'backbone';
import Sortable from 'sortablejs';
import ChildViewContainer from 'backbone.babysitter';
import IScroll from 'iscroll';
import 'jquery.minicolors';
import wysihtml5 from 'wysihtml5';
import 'jquery-ui';
import Cocktail from 'cocktail';

/*global JST*/

Marionette.Renderer.render = function (template, data) {
  if (_.isFunction(template)) {
    return template(data);
  }
  if (template.indexOf('templates/') === 0) {
    template = 'pageflow/editor/' + template;
  }
  if (!JST[template]) {
    throw "Template '" + template + "' not found!";
  }
  return JST[template](data);
};

/**
 * Returns an array of translation keys based on the `prefixes`
 * option and the given `keyName`.
 *
 * @param {string} keyName
 *   Suffix to append to prefixes.
 *
 * @param {string[]} [options.prefixes]
 *   Array of translation key prefixes.
 *
 * @param {string} [options.fallbackPrefix]
 *   Optional additional prefix to form a model based translation
 *   key of the form
 *   `prefix.fallbackModelI18nKey.propertyName.keyName`.
 *
 * @param {string} [options.fallbackModelI18nKey]
 *   Required if `fallbackPrefix` option is present.
 *
 * @return {string[]}
 * @memberof i18nUtils
 * @since 12.0
 */
function attributeTranslationKeys(attributeName, keyName, options) {
  var result = [];
  if (options.prefixes) {
    result = result.concat(_(options.prefixes).map(function (prefix) {
      return prefix + '.' + attributeName + '.' + keyName;
    }, this));
  }
  if (options && options.fallbackPrefix) {
    result.push(options.fallbackPrefix + '.' + options.fallbackModelI18nKey + '.' + attributeName);
  }
  return result;
}

/**
 * Takes the same parameters as {@link
 * #i18nutilsattributetranslationkeys attributeTranslationKeys}, but returns the first existing
 * translation.
 *
 * @return {string}
 * @memberof i18nUtils
 * @since 12.0
 */
function attributeTranslation(attributeName, keyName, options) {
  return findTranslation(attributeTranslationKeys(attributeName, keyName, options));
}

/**
 * Find the first key for which a translation exists and return the
 * translation.
 *
 * @param {string[]} keys
 *   Translation key candidates.
 *
 * @param {string} [options.defaultValue]
 *   Value to return if none of the keys has a translation. Is
 *   treated like an HTML translation if html flag is set.
 *
 * @param {boolean} [options.html]
 *   If true, also search for keys ending in '_html' and HTML-escape
 *   keys that do not end in 'html'
 *
 * @memberof i18nUtils
 * @return {string}
 */
function findTranslation(keys, options) {
  options = options || {};
  if (options.html) {
    keys = translationKeysWithSuffix(keys, 'html');
  }
  return _.chain(keys).reverse().reduce(function (result, key) {
    var unescapedTranslation = I18n$1.t(key, _.extend({}, options, {
      defaultValue: result
    }));
    if (!options.html || key.match(/_html$/) || result == unescapedTranslation) {
      return unescapedTranslation;
    } else {
      return $('<div />').text(unescapedTranslation).html();
    }
  }, options.defaultValue).value();
}

/**
 * Return the first key for which a translation exists. Returns the
 * first if non of the keys has a translation.
 *
 * @param {string[]} keys
 * Translation key candidates.
 *
 * @memberof i18nUtils
 * @return {string}
 */
function findKeyWithTranslation(keys) {
  var missing = '_not_translated';
  return _(keys).detect(function (key) {
    return I18n$1.t(key, {
      defaultValue: missing
    }) !== missing;
  }) || _.first(keys);
}
function translationKeysWithSuffix(keys, suffix) {
  return _.chain(keys).map(function (key) {
    return [key + '_' + suffix, key];
  }).flatten().value();
}

var i18nUtils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  attributeTranslationKeys: attributeTranslationKeys,
  attributeTranslation: attributeTranslation,
  findTranslation: findTranslation,
  findKeyWithTranslation: findKeyWithTranslation,
  translationKeysWithSuffix: translationKeysWithSuffix
});

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

/**
 * Create object that can be passed to Marionette ui property from CSS
 * module object.
 *
 * @param {Object} styles
 *   Class name mapping imported from `.module.css` file.
 *
 * @param {...string} classNames
 *   Keys from the styles object that shall be used in the ui object.
 *
 * @return {Object}
 *
 * @example
 *
 *     // MyView.module.css
 *
 *     .container {}
 *
 *     // MyView.js
 *
 *     import Marionette from 'marionette';
 *     import {cssModulesUtils} from 'pageflow/ui';
 *
 *     import styles from './MyView.module.css';
 *
 *     export const MyView = Marionette.ItemView({
 *       template: () => `
 *         <div class=${styles.container}></div>
 *       `,
 *
 *       ui: cssModulesUtils.ui(styles, 'container'),
 *
 *       onRender() {
 *         this.ui.container // => JQuery wrapper for container element
 *       }
 *     });
 *
 * @memberof cssModulesUtils
 */
function ui(styles) {
  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classNames[_key - 1] = arguments[_key];
  }
  return classNames.reduce(function (result, className) {
    result[className] = selector(styles, className);
    return result;
  }, {});
}

/**
 * Create object that can be passed to Marionette events property from CSS
 * module object.
 *
 * @param {Object} styles
 *   Class name mapping imported from `.module.css` file.
 *
 * @param {Object} mapping
 *   Events mapping using keys from the `styles` instead of CSS class names.
 *
 * @return {Object}
 *
 * @example
 *
 *     // MyView.module.css
 *
 *     .addButton {}
 *
 *     // MyView.js
 *
 *     import Marionette from 'marionette';
 *     import {cssModulesUtils} from 'pageflow/ui';
 *
 *     import styles from './MyView.module.css';
 *
 *     export const MyView = Marionette.ItemView({
 *       template: () => `
 *         <button class=${styles.addButton}></button>
 *       `,
 *
 *       events: cssModulesUtils.events(styles, {
 *         'click addButton': () => console.log('clicked add button');
 *       })
 *     });
 *
 * @memberof cssModulesUtils
 */
function events(styles, mapping) {
  return Object.keys(mapping).reduce(function (result, key) {
    var _key$split = key.split(' '),
      _key$split2 = _slicedToArray(_key$split, 2),
      event = _key$split2[0],
      className = _key$split2[1];
    result["".concat(event, " ").concat(selector(styles, className))] = mapping[key];
    return result;
  }, {});
}

/**
 * Generates a CSS selector from a CSS module rule.
 *
 * @param {Object} styles
 *   Class name mapping imported from `.module.css` file.
 *
 * @param {String} className
 *   Key from the `styles` object.
 *
 * @return {String} CSS Selector
 * @memberof cssModulesUtils
 */
function selector(styles, className) {
  var classNames = styles[className];
  if (!classNames) {
    throw new Error("Unknown class name ".concat(className, " in mapping. Knwon names: ").concat(Object.keys(styles).join(', '), "."));
  }
  return ".".concat(classNames.replace(/ /g, '.'));
}

var cssModulesUtils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ui: ui,
  events: events,
  selector: selector
});

// Class-y constructor by github.com/opensas
// https://github.com/jashkenas/backbone/issues/2601

function BaseObject(options) {
  this.initialize.apply(this, arguments);
}
_.extend(BaseObject.prototype, Backbone.Events, {
  initialize: function initialize(options) {}
});

// The self-propagating extend function that Backbone classes use.
BaseObject.extend = Backbone.Model.extend;

var serverSideValidation = {
  initialize: function initialize() {
    var _this = this;
    this.validationErrors = {};
    this.listenTo(this, 'error', function (model, request) {
      if (request.status === 422) {
        _this.validationErrors = JSON.parse(request.responseText).errors;
        _this.trigger('invalid');
      }
    });
    this.listenTo(this, 'sync', function () {
      _this.validationErrors = {};
    });
  }
};

var CollectionView = Marionette.View.extend({
  initialize: function initialize() {
    this.rendered = false;
    this.itemViews = new ChildViewContainer();
    this.collection.map(this.addItem, this);
    this.listenTo(this.collection, 'add', this.addItem);
    this.listenTo(this.collection, 'remove', this.removeItem);
    this.listenTo(this.collection, 'sort', this.sort);
    if (this.options.loadingViewConstructor) {
      this.listenTo(this.collection, 'request', function () {
        this.loading = true;
        this.togglePlaceHolder();
      });
      this.listenTo(this.collection, 'sync', function () {
        this.loading = false;
        this.togglePlaceHolder();
      });
    }
  },
  render: function render() {
    if (!this.rendered) {
      this.$el.append(this.itemViews.map(function (itemView) {
        itemView.$el.data('view', itemView);
        return itemView.render().el;
      }));
      this.togglePlaceHolder();
      this.rendered = true;
    }
    return this;
  },
  onClose: function onClose() {
    this.itemViews.call('close');
    this.closePlaceHolderView();
  },
  addItem: function addItem(item) {
    var view = new this.options.itemViewConstructor(_.extend({
      model: item
    }, this.getItemViewOptions(item)));
    this.itemViews.add(view);
    if (this.rendered) {
      var index = this.collection.indexOf(item);
      view.render();
      view.$el.data('view', view);
      if (index > 0) {
        this.$el.children().eq(index - 1).after(view.el);
      } else {
        this.$el.prepend(view.el);
      }
      this.togglePlaceHolder();
    }
  },
  removeItem: function removeItem(item) {
    var view = this.itemViews.findByModel(item);
    if (view) {
      this.itemViews.remove(view);
      view.close();
      this.togglePlaceHolder();
    }
  },
  sort: function sort() {
    var last = null;
    this.collection.each(function (item) {
      var itemView = this.itemViews.findByModel(item);
      var element;
      if (!itemView) {
        return;
      }
      element = itemView.$el;
      if (last) {
        last.after(element);
      } else {
        this.$el.prepend(element);
      }
      last = element;
    }, this);
  },
  getItemViewOptions: function getItemViewOptions(item) {
    if (typeof this.options.itemViewOptions === 'function') {
      return this.options.itemViewOptions(item);
    } else {
      return this.options.itemViewOptions || {};
    }
  },
  closePlaceHolderView: function closePlaceHolderView() {
    if (this.placeHolderView) {
      this.placeHolderView.close();
      this.placeHolderView = null;
    }
  },
  togglePlaceHolder: function togglePlaceHolder() {
    var lastPlaceholderConstructor = this.placeHolderConstructor;
    this.placeHolderConstructor = this.getPlaceHolderConstructor();
    if (this.itemViews.length || !this.placeHolderConstructor) {
      this.closePlaceHolderView();
    } else if (!this.placeHolderView || lastPlaceholderConstructor !== this.placeHolderConstructor) {
      this.closePlaceHolderView();
      this.placeHolderView = new this.placeHolderConstructor();
      this.$el.append(this.placeHolderView.render().el);
    }
  },
  getPlaceHolderConstructor: function getPlaceHolderConstructor() {
    if (this.loading && this.options.loadingViewConstructor) {
      return this.options.loadingViewConstructor;
    } else if (this.options.blankSlateViewConstructor) {
      return this.options.blankSlateViewConstructor;
    }
  }
});

var SortableCollectionView = CollectionView.extend({
  render: function render() {
    var _this = this;
    CollectionView.prototype.render.call(this);
    this.sortable = Sortable.create(this.el, {
      group: this.options.connectWith,
      animation: 150,
      ghostClass: 'sortable-placeholder',
      forceFallback: this.options.forceDraggableFallback,
      fallbackTolerance: 3,
      onEnd: function onEnd(event) {
        var item = $(event.item);
        if (item.parent().is(_this.el)) {
          _this.updateOrder();
        }
      },
      onRemove: function onRemove(event) {
        var view = $(event.item).data('view');
        _this.itemViews.remove(view);
        _this.collection.remove(view.model);
      },
      onSort: function onSort(event) {
        if (event.from !== event.to && event.to === _this.el) {
          var view = $(event.item).data('view');
          _this.reindexPositions();
          _this.itemViews.add(view);
          _this.collection.add(view.model);
          _this.collection.saveOrder();
        }
      }
    });
    return this;
  },
  onClose: function onClose() {
    CollectionView.prototype.onClose.call(this);
    this.sortable.destroy();
  },
  disableSorting: function disableSorting() {
    this.sortable.option('disabled', true);
  },
  enableSorting: function enableSorting() {
    this.sortable.option('disabled', false);
  },
  addItem: function addItem(item) {
    if (!this.itemViews.findByModel(item)) {
      CollectionView.prototype.addItem.call(this, item);
    }
  },
  removeItem: function removeItem(item) {
    if (this.itemViews.findByModel(item)) {
      CollectionView.prototype.removeItem.call(this, item);
    }
  },
  updateOrder: function updateOrder() {
    this.reindexPositions();
    this.collection.sort();
    this.collection.saveOrder();
  },
  reindexPositions: function reindexPositions() {
    this.$el.children().each(function (index) {
      $(this).data('view').model.set('position', index);
    });
  }
});

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

var _excluded = ["ignoreUndefined"];
var ConfigurationEditorTabView = Marionette.View.extend({
  className: 'configuration_editor_tab',
  initialize: function initialize() {
    this.inputs = new ChildViewContainer();
    this.groups = this.options.groups || ConfigurationEditorTabView.groups;
  },
  input: function input(propertyName, view, options) {
    this.view(view, _.extend({
      placeholderModel: this.options.placeholderModel,
      propertyName: propertyName,
      attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
    }, options || {}));
  },
  view: function view(_view, options) {
    this.inputs.add(new _view(_.extend({
      model: this.model,
      parentTab: this.options.tab
    }, options || {})));
  },
  group: function group(name, options) {
    this.groups.apply(name, this, options);
  },
  render: function render() {
    this.inputs.each(function (input) {
      this.$el.append(input.render().el);
    }, this);
    return this;
  },
  onClose: function onClose() {
    if (this.inputs) {
      this.inputs.call('close');
    }
  }
});
ConfigurationEditorTabView.Groups = function () {
  var groups = {};
  this.define = function (name, fn) {
    if (typeof fn !== 'function') {
      throw 'Group has to be function.';
    }
    groups[name] = fn;
  };
  this.apply = function (name, context) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      ignoreUndefined = _ref.ignoreUndefined,
      options = _objectWithoutProperties(_ref, _excluded);
    if (!(name in groups)) {
      if (ignoreUndefined) {
        return;
      }
      throw 'Undefined group named "' + name + '".';
    }
    groups[name].call(context, options || {});
  };
};
ConfigurationEditorTabView.groups = new ConfigurationEditorTabView.Groups();

function template(data) {
var __p = '';
__p += '<div class="tabs_view-scroller">\n  <ul class="tabs_view-headers"></ul>\n</div>\n<div class="tabs_view-container"></div>\n';
return __p
}

/*global pageflow*/

/**
 * Switch between different views using tabs.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.defaultTab]
 *   Name of the tab to enable by default.
 *
 * @param {string[]} [options.translationKeyPrefixes]
 *   List of prefixes to append tab name to. First exisiting translation is used as label.
 *
 * @param {string} [options.fallbackTranslationKeyPrefix]
 *   Translation key prefix to use if non of the `translationKeyPrefixes` result in an
 *   existing translation for a tab name.
 *
 * @param {string} [options.i18n]
 *   Legacy alias for `fallbackTranslationKeyPrefix`.
 *
 * @class
 */
var TabsView = Marionette.Layout.extend( /* @lends TabView.prototype */{
  template: template,
  className: 'tabs_view',
  ui: {
    headers: '.tabs_view-headers',
    scroller: '.tabs_view-scroller'
  },
  regions: {
    container: '.tabs_view-container'
  },
  events: {
    'click .tabs_view-headers > li': function clickTabs_viewHeadersLi(event) {
      this.changeTab($(event.target).data('tab-name'));
    }
  },
  initialize: function initialize() {
    this.tabFactoryFns = {};
    this.tabNames = [];
    this.currentTabName = null;
    this._refreshScrollerOnSideBarResize();
  },
  tab: function tab(name, factoryFn) {
    this.tabFactoryFns[name] = factoryFn;
    this.tabNames.push(name);
  },
  onRender: function onRender() {
    _.each(this.tabNames, function (name) {
      var label = findTranslation(this._labelTranslationKeys(name));
      this.ui.headers.append($('<li />').attr('data-tab-name', name).text(label));
    }, this);
    this.scroller = new IScroll(this.ui.scroller[0], {
      scrollX: true,
      scrollY: false,
      bounce: false,
      mouseWheel: true,
      preventDefault: false
    });
    this.changeTab(this.defaultTab());
  },
  changeTab: function changeTab(name) {
    this.container.show(this.tabFactoryFns[name]());
    this._updateActiveHeader(name);
    this.currentTabName = name;
  },
  defaultTab: function defaultTab() {
    if (_.include(this.tabNames, this.options.defaultTab)) {
      return this.options.defaultTab;
    } else {
      return _.first(this.tabNames);
    }
  },
  /**
   * Rerender current tab.
   */
  refresh: function refresh() {
    this.changeTab(this.currentTabName);
  },
  /**
   * Adjust tabs scroller to changed width of view.
   */
  refreshScroller: function refreshScroller() {
    this.scroller.refresh();
  },
  toggleSpinnerOnTab: function toggleSpinnerOnTab(name, visible) {
    this.$('[data-tab-name=' + name + ']').toggleClass('spinner', visible);
  },
  _labelTranslationKeys: function _labelTranslationKeys(name) {
    var result = _.map(this.options.translationKeyPrefixes, function (prefix) {
      return prefix + '.' + name;
    });
    if (this.options.i18n) {
      result.push(this.options.i18n + '.' + name);
    }
    if (this.options.fallbackTranslationKeyPrefix) {
      result.push(this.options.fallbackTranslationKeyPrefix + '.' + name);
    }
    return result;
  },
  _updateActiveHeader: function _updateActiveHeader(activeTabName) {
    var scroller = this.scroller;
    this.ui.headers.children().each(function () {
      if ($(this).data('tab-name') === activeTabName) {
        scroller.scrollToElement(this, 200, true);
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  },
  _refreshScrollerOnSideBarResize: function _refreshScrollerOnSideBarResize() {
    if (pageflow.app) {
      this.listenTo(pageflow.app, 'resize', function () {
        this.scroller.refresh();
      });
    }
  }
});

/**
 * Render a inputs on multiple tabs.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.model]
 *   Backbone model to use for input views.
 *
 * @param {string} [options.placeholderModel]
 *   Backbone model to read placeholder values from.

 * @param {string} [options.tab]
 *   Name of the tab to enable by default.
 *
 * @param {string[]} [options.attributeTranslationKeyPrefixes]
 *   List of prefixes to use in input views for attribute based transltions.
 *
 * @param {string[]} [options.tabTranslationKeyPrefixes]
 *   List of prefixes to append tab name to. First exisiting translation is used as label.
 *
 * @param {string} [options.tabTranslationKeyPrefix]
 *   Prefixes to append tab name to.
 *
 * @class
 */
var ConfigurationEditorView = Marionette.View.extend({
  className: 'configuration_editor',
  initialize: function initialize() {
    this.tabsView = new TabsView({
      translationKeyPrefixes: this.options.tabTranslationKeyPrefixes || [this.options.tabTranslationKeyPrefix],
      fallbackTranslationKeyPrefix: 'pageflow.ui.configuration_editor.tabs',
      defaultTab: this.options.tab
    });
    this.configure();
  },
  configure: function configure() {},
  tab: function tab(name, callbackOrOptions, callback) {
    callback = callback || callbackOrOptions;
    var options = callback ? callbackOrOptions : {};
    this.tabsView.tab(name, _.bind(function () {
      var tabView = new ConfigurationEditorTabView({
        model: options.model || this.model,
        placeholderModel: this.options.placeholderModel,
        tab: name,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      });
      callback.call(tabView);
      return tabView;
    }, this));
  },
  /**
   * Rerender current tab.
   */
  refresh: function refresh() {
    this.tabsView.refresh();
  },
  /**
   * Adjust tabs scroller to changed width of view.
   */
  refreshScroller: function refreshScroller() {
    this.tabsView.refreshScroller();
  },
  render: function render() {
    this.$el.append(this.subview(this.tabsView).el);
    return this;
  }
});
_.extend(ConfigurationEditorView, {
  repository: {},
  register: function register(pageTypeName, prototype) {
    this.repository[pageTypeName] = ConfigurationEditorView.extend(prototype);
  }
});

function template$1(data) {
var __p = '';
__p += '';
return __p
}

/**
 * Base class for table cell views.
 *
 * Inside sub classes the name of the column options are available as
 * `this.options.column`. Override the `update` method to populate the
 * element.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.className]
 *   Class attribute to apply to the cell element.
 *
 * @since 12.0
 */
var TableCellView = Marionette.ItemView.extend({
  tagName: 'td',
  template: template$1,
  className: function className() {
    return this.options.className;
  },
  onRender: function onRender() {
    this.listenTo(this.getModel(), 'change:' + this.options.column.name, this.update);
    this.setupContentBinding();
    this.update();
  },
  /**
   * Override in concrete cell view.
   */
  update: function update() {
    throw 'Not implemented';
  },
  /**
   * Returns the column attribute's value in the row model.
   */
  attributeValue: function attributeValue() {
    if (typeof this.options.column.value == 'function') {
      return this.options.column.value(this.model);
    } else {
      return this.getModel().get(this.options.column.name);
    }
  },
  getModel: function getModel() {
    if (this.options.column.configurationAttribute) {
      return this.model.configuration;
    } else {
      return this.model;
    }
  },
  /**
   * Look up attribute specific translations based on
   * `attributeTranslationKeyPrefixes` of the the parent `TableView`.
   *
   * @param {Object} [options]
   *   Interpolations to apply to the translation.
   *
   * @param {string} [options.defaultValue]
   *   Fallback value if no translation is found.
   *
   * @protected
   *
   * @example
   *
   * this.attribute.attributeTranslation("cell_title");
   * // Looks for keys of the form:
   * // <table_view_translation_key_prefix>.<column_attribute>.cell_title
   */
  attributeTranslation: function attributeTranslation(keyName, options) {
    return findTranslation(this.attributeTranslationKeys(keyName), options);
  },
  attributeTranslationKeys: function attributeTranslationKeys(keyName) {
    return _(this.options.attributeTranslationKeyPrefixes || []).map(function (prefix) {
      return prefix + '.' + this.options.column.name + '.' + keyName;
    }, this);
  },
  /**
   * Set up content binding to update this view upon change of
   * specified attribute on this.getModel().
   *
   * @param {string} [options.column.contentBinding]
   *   Name of the attribute to which this cell's update is bound
   *
   * @protected
   */
  setupContentBinding: function setupContentBinding() {
    if (this.options.column.contentBinding) {
      this.listenTo(this.getModel(), 'change:' + this.options.column.contentBinding, this.update);
      this.update();
    }
  }
});

var TableHeaderCellView = TableCellView.extend({
  tagName: 'th',
  render: function render() {
    this.$el.text(this.options.column.headerText || this.attributeTranslation('column_header'));
    this.$el.data('columnName', this.options.column.name);
    return this;
  }
});

var TableRowView = Marionette.View.extend({
  tagName: 'tr',
  events: {
    'click': function click() {
      if (this.options.selection) {
        this.options.selection.set(this.selectionAttribute(), this.model);
      }
    }
  },
  initialize: function initialize() {
    if (this.options.selection) {
      this.listenTo(this.options.selection, 'change', this.updateClassName);
    }
  },
  render: function render() {
    _(this.options.columns).each(function (column) {
      this.appendSubview(new column.cellView(_.extend({
        model: this.model,
        column: column,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      }, column.cellViewOptions || {})));
    }, this);
    this.updateClassName();
    return this;
  },
  updateClassName: function updateClassName() {
    this.$el.toggleClass('is_selected', this.isSelected());
  },
  isSelected: function isSelected() {
    return this.options.selection && this.options.selection.get(this.selectionAttribute()) === this.model;
  },
  selectionAttribute: function selectionAttribute() {
    return this.options.selectionAttribute || 'current';
  }
});

function template$2(data) {
var __p = '';
__p += '<table>\n  <thead>\n    <tr></tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n';
return __p
}

function blankSlateTemplate(data) {
var __t, __p = '';
__p += '<td colspan="' +
((__t = ( data.colSpan )) == null ? '' : __t) +
'">\n  ' +
((__t = ( data.blankSlateText )) == null ? '' : __t) +
'\n</td>\n';
return __p
}

var TableView = Marionette.ItemView.extend({
  tagName: 'table',
  className: 'table_view',
  template: template$2,
  ui: {
    headRow: 'thead tr',
    body: 'tbody'
  },
  onRender: function onRender() {
    var view = this;
    _(this.options.columns).each(function (column) {
      this.ui.headRow.append(this.subview(new TableHeaderCellView({
        column: column,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      })).el);
    }, this);
    this.subview(new CollectionView({
      el: this.ui.body,
      collection: this.collection,
      itemViewConstructor: TableRowView,
      itemViewOptions: {
        columns: this.options.columns,
        selection: this.options.selection,
        selectionAttribute: this.options.selectionAttribute,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      },
      blankSlateViewConstructor: Marionette.ItemView.extend({
        tagName: 'tr',
        className: 'blank_slate',
        template: blankSlateTemplate,
        serializeData: function serializeData() {
          return {
            blankSlateText: view.options.blankSlateText,
            colSpan: view.options.columns.length
          };
        }
      })
    }));
  }
});

function template$3(data) {
var __p = '';
__p += '<span class="label">\n</span>\n';
return __p
}

var TooltipView = Marionette.ItemView.extend({
  template: template$3,
  className: 'tooltip',
  ui: {
    label: '.label'
  },
  hide: function hide() {
    this.visible = false;
    clearTimeout(this.timeout);
    this.$el.removeClass('visible');
  },
  show: function show(text, position, options) {
    options = options || {};
    this.visible = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(_.bind(function () {
      var offsetTop;
      var offsetLeft;
      this.ui.label.text(text);
      this.$el.toggleClass('align_bottom_right', options.align === 'bottom right');
      this.$el.toggleClass('align_bottom_left', options.align === 'bottom left');
      this.$el.toggleClass('align_top_center', options.align === 'top center');
      if (options.align === 'bottom right' || options.align === 'bottom left') {
        offsetTop = 10;
        offsetLeft = 0;
      } else if (options.align === 'top center') {
        offsetTop = -10;
        offsetLeft = 0;
      } else {
        offsetTop = -17;
        offsetLeft = 10;
      }
      this.$el.css({
        top: position.top + offsetTop + 'px',
        left: position.left + offsetLeft + 'px'
      });
      this.$el.addClass('visible');
    }, this), 200);
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

var attributeBinding = {
  setupBooleanAttributeBinding: function setupBooleanAttributeBinding(optionName, updateMethod) {
    this.setupAttributeBinding(optionName, updateMethod, Boolean);
  },
  getBooleanAttributBoundOption: function getBooleanAttributBoundOption(optionName) {
    return this.getAttributeBoundOption(optionName, Boolean);
  },
  setupAttributeBinding: function setupAttributeBinding(optionName, updateMethod) {
    var _this = this;
    var normalize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (value) {
      return value;
    };
    var binding = this.options["".concat(optionName, "Binding")];
    var model = this.options["".concat(optionName, "BindingModel")] || this.model;
    var view = this;
    if (binding) {
      _.flatten([binding]).forEach(function (attribute) {
        _this.listenTo(model, 'change:' + attribute, update);
      });
    }
    update();
    function update() {
      updateMethod.call(view, view.getAttributeBoundOption(optionName, normalize));
    }
  },
  getAttributeBoundOption: function getAttributeBoundOption(optionName) {
    var normalize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value) {
      return value;
    };
    var binding = this.options["".concat(optionName, "Binding")];
    var model = this.options["".concat(optionName, "BindingModel")] || this.model;
    var bindingValueOptionName = "".concat(optionName, "BindingValue");
    var value = Array.isArray(binding) ? binding.map(function (attribute) {
      return model.get(attribute);
    }) : model.get(binding);
    if (bindingValueOptionName in this.options) {
      return value === this.options[bindingValueOptionName];
    } else if (typeof this.options[optionName] === 'function') {
      return normalize(this.options[optionName](value));
    } else if (optionName in this.options) {
      return normalize(this.options[optionName]);
    } else if (binding) {
      return normalize(value);
    }
  }
};

/**
 * Mixin for input views handling common concerns like labels,
 * inline help, visiblity and disabling.
 *
 * ## Label and Inline Help Translations
 *
 * By default `#labelText` and `#inlineHelpText` are defined through
 * translations. If no `attributeTranslationKeyPrefixes` are given,
 * translation keys for labels and inline help are constructed from
 * the `i18nKey` of the model and the given `propertyName`
 * option. Suppose the model's `i18nKey` is "page" and the
 * `propertyName` option is "title". Then the key
 *
 *     activerecord.attributes.page.title
 *
 * will be used for the label. And the key
 *
 *     pageflow.ui.inline_help.page.title_html
 *     pageflow.ui.inline_help.page.title
 *
 * will be used for the inline help.
 *
 * ### Attribute Translation Key Prefixes
 *
 * The `attributeTranslationKeyPrefixes` option can be used to supply
 * an array of scopes in which label and inline help translations
 * shall be looked up based on the `propertyName` option.
 *
 * Suppose the array `['some.attributes', 'fallback.attributes']` is
 * given as `attributeTranslationKeyPrefixes` option. Then, in the
 * example above, the first existing translation key is used as label:
 *
 *     some.attributes.title.label
 *     fallback.attributes.title.label
 *     activerecord.attributes.post.title
 *
 * Accordingly, for the inline help:
 *
 *     some.attributes.title.inline_help_html
 *     some.attributes.title.inline_help
 *     fallback.attributes.title.inline_help_html
 *     fallback.attributes.title.inline_help
 *     pageflow.ui.inline_help.post.title_html
 *     pageflow.ui.inline_help.post.title
 *
 * This setup allows to keep all translation keys for an attribute
 * to share a common prefix:
 *
 *     some:
 *       attributes:
 *         title:
 *           label: "Label"
 *           inline_help: "..."
 *           inline_help_disabled: "..."
 *
 * ### Inline Help for Disabled Inputs
 *
 * For each inline help translation key, a separate key with an
 * `"_disabled"` suffix can be supplied, which provides a help string
 * that shall be displayed when the input is disabled. More specific
 * attribute translation key prefixes take precedence over suffixed
 * keys:
 *
 *     some.attributes.title.inline_help_html
 *     some.attributes.title.inline_help
 *     some.attributes.title.inline_help_disabled_html
 *     some.attributes.title.inline_help_disabled
 *     fallback.attributes.title.inline_help_html
 *     fallback.attributes.title.inline_help
 *     fallback.attributes.title.inline_help_disabled_html
 *     fallback.attributes.title.inline_help_disabled
 *     pageflow.ui.inline_help.post.title_html
 *     pageflow.ui.inline_help.post.title
 *     pageflow.ui.inline_help.post.title_disabled_html
 *     pageflow.ui.inline_help.post.title_disabled
 *
 * @param {string} options
 *   Common constructor options for all views that include this mixin.
 *
 * @param {string} options.propertyName
 *   Name of the attribute on the model to display and edit.
 *
 * @param {string} [options.label]
 *   Label text for the input.
 *
 * @param {string[]} [options.attributeTranslationKeyPrefixes]
 *   An array of prefixes to lookup translations for labels and
 *   inline help texts based on attribute names.
 *
 * @param {string} [options.additionalInlineHelpText]
 *   A text that will be appended to the translation based inline
 *   text.
 *
 * @param {string|string[]} [options.disabledBinding]
 *   Name of an attribute to control whether the input is disabled. If
 *   the `disabled` and `disabledBinding` options are not set,
 *   input will be disabled whenever this attribute has a truthy value.
 *   When multiple attribute names are passed, the function passed to
 *   the `disabled` option will receive an array of values in the same
 *   order.
 *
 * @param {function|boolean} [options.disabled]
 *   Render input as disabled. A Function taking the value of the
 *  `disabledBinding` attribute as parameter. Input will be disabled
 *  only if function returns `true`.
 *
 * @param {any} [options.disabledBindingValue]
 *   Input will be disabled whenever the value of the `disabledBinding`
 *   attribute equals the value of this option.
 *
 * @param {Backbone.Model} [options.disabledBindingModel]
 *   Alternative model to bind to.
 *
 * @param {string|string[]} [options.visibleBinding]
 *   Name of an attribute to control whether the input is visible. If
 *   the `visible` and `visibleBindingValue` options are not set,
 *   input will be visible whenever this attribute has a truthy value.
 *   When multiple attribute names are passed, the function passed to
 *   the `visible` option will receive an array of values in the same
 *   order.
 *
 * @param {function|boolean} [options.visible]
 *   A Function taking the value of the `visibleBinding` attribute as
 *   parameter. Input will be visible only if function returns `true`.
 *
 * @param {any} [options.visibleBindingValue]
 *   Input will be visible whenever the value of the `visibleBinding`
 *   attribute equals the value of this option.
 *
 * @param {Backbone.Model} [options.visibleBindingModel]
 *   Alternative model to bind to.
 *
 * @mixin
 */
var inputView = _objectSpread2(_objectSpread2({}, attributeBinding), {}, {
  ui: {
    label: 'label',
    labelText: 'label .name',
    inlineHelp: 'label .inline_help'
  },
  /**
   * Returns an array of translation keys based on the
   * `attributeTranslationKeyPrefixes` option and the given keyName.
   *
   * Combined with {@link #i18nutils
   * i18nUtils.findTranslation}, this can be used inside input views
   * to obtain additional translations with the same logic as for
   * labels and inline help texts.
   *
   * findTranslation(this.attributeTranslationKeys('default_value'));
   *
   * @param {string} keyName
   * Suffix to append to prefixes.
   *
   * @param {string} [options.fallbackPrefix]
   *   Optional additional prefix to form a model based translation
   *   key of the form `prefix.modelI18nKey.propertyName.keyName
   *
   * @return {string[]}
   * @since 0.9
   * @member
   */
  attributeTranslationKeys: function attributeTranslationKeys$1(keyName, options) {
    return attributeTranslationKeys(this.options.propertyName, keyName, _.extend({
      prefixes: this.options.attributeTranslationKeyPrefixes,
      fallbackModelI18nKey: this.model.i18nKey
    }, options || {}));
  },
  onRender: function onRender() {
    this.$el.addClass('input');
    this.$el.addClass(this.model.modelName + '_' + this.options.propertyName);
    this.$el.data('inputPropertyName', this.options.propertyName);
    this.$el.data('labelText', this.labelText());
    this.$el.data('inlineHelpText', this.inlineHelpText());
    this.ui.labelText.text(this.labelText());
    this.updateInlineHelp();
    this.setLabelFor();
    this.setupBooleanAttributeBinding('disabled', this.updateDisabled);
    this.setupBooleanAttributeBinding('visible', this.updateVisible);
  },
  /**
   * The label to display in the form.
   * @return {string}
   */
  labelText: function labelText() {
    return this.options.label || this.localizedAttributeName();
  },
  localizedAttributeName: function localizedAttributeName() {
    return findTranslation(this.attributeTranslationKeys('label', {
      fallbackPrefix: 'activerecord.attributes'
    }));
  },
  updateInlineHelp: function updateInlineHelp() {
    this.ui.inlineHelp.html(this.inlineHelpText());
    if (!this.inlineHelpText()) {
      this.ui.inlineHelp.hide();
    }
  },
  /**
   * The inline help text for the form field.
   * @return {string}
   */
  inlineHelpText: function inlineHelpText() {
    var keys = this.attributeTranslationKeys('inline_help', {
      fallbackPrefix: 'pageflow.ui.inline_help'
    });
    if (this.isDisabled()) {
      keys = translationKeysWithSuffix(keys, 'disabled');
    }
    return _.compact([findTranslation(keys, {
      defaultValue: '',
      html: true
    }), this.options.additionalInlineHelpText]).join(' ');
  },
  setLabelFor: function setLabelFor() {
    if (this.ui.input && this.ui.label.length === 1 && !this.ui.input.attr('id')) {
      var id = 'input_' + this.model.modelName + '_' + this.options.propertyName;
      this.ui.input.attr('id', id);
      this.ui.label.attr('for', id);
    }
  },
  isDisabled: function isDisabled() {
    return this.getBooleanAttributBoundOption('disabled');
  },
  updateDisabled: function updateDisabled() {
    this.$el.toggleClass('input-disabled', !!this.isDisabled());
    this.updateInlineHelp();
    if (this.ui.input) {
      this.updateDisabledAttribute(this.ui.input);
    }
  },
  updateDisabledAttribute: function updateDisabledAttribute(element) {
    if (this.isDisabled()) {
      element.attr('disabled', true);
    } else {
      element.removeAttr('disabled');
    }
  },
  updateVisible: function updateVisible() {
    this.$el.toggleClass('hidden_via_binding', this.getBooleanAttributBoundOption('visible') === false);
  }
});

function template$4(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<div class="check_boxes_container" />\n';
return __p
}

/**
 * Input view for attributes storing configuration hashes with boolean values.
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @class
 */
var CheckBoxGroupInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: template$4,
  className: 'check_box_group_input',
  events: {
    'change': 'save'
  },
  ui: {
    label: 'label',
    container: '.check_boxes_container'
  },
  initialize: function initialize() {
    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = this.options.translationKeyPrefix || findKeyWithTranslation(this.attributeTranslationKeys('values', {
          fallbackPrefix: 'activerecord.values'
        }));
        this.options.translationKeys = _.map(this.options.values, function (value) {
          return translationKeyPrefix + '.' + value;
        }, this);
      }
      this.options.texts = _.map(this.options.translationKeys, function (key) {
        return I18n$1.t(key);
      });
    }
  },
  onRender: function onRender() {
    this.ui.label.attr('for', this.cid);
    this.appendOptions();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  appendOptions: function appendOptions() {
    _.each(this.options.values, function (value, index) {
      var option = '<div class="check_box">' + '<label><input type="checkbox" name="' + value + '" />' + this.options.texts[index] + '</label></div>';
      this.ui.container.append($(option));
    }, this);
  },
  save: function save() {
    var configured = {};
    _.each(this.ui.container.find('input'), function (input) {
      configured[$(input).attr('name')] = $(input).prop('checked');
    });
    this.model.set(this.options.propertyName, configured);
  },
  load: function load() {
    if (!this.isClosed) {
      _.each(this.options.values, function (value) {
        this.ui.container.find('input[name="' + value + '"]').prop('checked', this.model.get(this.options.propertyName)[value]);
      }, this);
    }
  }
});

function template$5(data) {
var __t, __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<a class="original" href="#" download target="_blank">\n  ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.url_display.link_text') )) == null ? '' : __t) +
'\n</a>\n';
return __p
}

/**
 * Display view for a link to a URL, to be used like an input view.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {string} [options.propertyName]
 *   Target URL for link
 *
 * @class
 */
var UrlDisplayView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: template$5,
  ui: {
    link: 'a'
  },
  modelEvents: {
    'change': 'update'
  },
  events: {
    'click a': function clickA(event) {
      // Ensure default is not prevented by parent event listener.
      event.stopPropagation();
    }
  },
  onRender: function onRender() {
    this.update();
  },
  update: function update() {
    var url = this.model.get(this.options.propertyName || 'original_url');
    this.$el.toggle(this.model.isUploaded() && !_.isEmpty(url));
    this.ui.link.attr('href', url);
  }
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
 * Input view for a number.
 *
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.locale]
 * Locale used to fomat and parse numbers.
 *
 * @class
 */
var NumberInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: function template() {
    return "\n    <label>\n      <span class=\"name\"></span>\n      <span class=\"inline_help\"></span>\n    </label>\n    <input type=\"text\" dir=\"auto\" />\n  ";
  },
  ui: {
    input: 'input'
  },
  events: {
    'change': 'onChange'
  },
  initialize: function initialize() {
    this.parser = new NumberParser(this.options.locale);
  },
  onRender: function onRender() {
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  onChange: function onChange() {
    this.save();
    this.load();
  },
  onClose: function onClose() {
    this.save();
  },
  save: function save() {
    var inputValue = this.ui.input.val();
    this.model.set(this.options.propertyName, this.parser.parse(inputValue) || 0);
  },
  load: function load() {
    var input = this.ui.input;
    var value = this.model.get(this.options.propertyName) || 0;
    input.val(value.toLocaleString(this.options.locale, {
      useGrouping: false
    }));
  },
  displayValidationError: function displayValidationError(message) {
    this.$el.addClass('invalid');
    this.ui.input.attr('title', message);
  },
  resetValidationError: function resetValidationError(message) {
    this.$el.removeClass('invalid');
    this.ui.input.attr('title', '');
  }
});
var NumberParser = /*#__PURE__*/function () {
  function NumberParser(locale) {
    _classCallCheck(this, NumberParser);
    var format = new Intl.NumberFormat(locale);
    var parts = format.formatToParts(12345.6);
    var numerals = Array.from({
      length: 10
    }).map(function (_, i) {
      return format.format(i);
    });
    var index = new Map(numerals.map(function (d, i) {
      return [d, i];
    }));
    this._group = new RegExp("[".concat(parts.find(function (d) {
      return d.type === "group";
    }).value, "]"), "g");
    this._decimal = new RegExp("[".concat(parts.find(function (d) {
      return d.type === "decimal";
    }).value, "]"));
    this._numeral = new RegExp("[".concat(numerals.join(""), "]"), "g");
    this._index = function (d) {
      return index.get(d);
    };
  }
  _createClass(NumberParser, [{
    key: "parse",
    value: function parse(string) {
      string = string.trim().replace(this._group, "").replace(this._decimal, ".").replace(this._numeral, this._index);
      return string ? +string : NaN;
    }
  }]);
  return NumberParser;
}();

/**
 * Text based input view that can display a placeholder.
 *
 * @param {Object} [options]
 *
 * @param {string|function} [options.placeholder]
 *   Display a placeholder string if the input is blank. Either a
 *   string or a function taking the model as a first parameter and
 *   returning a string.
 *
 * @param {string} [options.placeholderBinding]
 *   Name of an attribute. Recompute the placeholder function whenever
 *   this attribute changes.
 *
 * @param {boolean} [options.hidePlaceholderIfDisabled]
 *   Do not display the placeholder if the input is disabled.
 *
 * @param {Backbone.Model} [options.placeholderModel]
 *   Obtain placeholder by looking up the configured `propertyName`
 *   inside a given model.
 */
var inputWithPlaceholderText = {
  onRender: function onRender() {
    this.updatePlaceholder();
    if (this.options.placeholderBinding) {
      this.listenTo(this.model, 'change:' + this.options.placeholderBinding, this.updatePlaceholder);
    }
  },
  updateDisabled: function updateDisabled() {
    this.updatePlaceholder();
  },
  updatePlaceholder: function updatePlaceholder() {
    this.ui.input.attr('placeholder', this.placeholderText());
  },
  placeholderText: function placeholderText() {
    if (!this.isDisabled() || !this.options.hidePlaceholderIfDisabled) {
      if (this.options.placeholder) {
        if (typeof this.options.placeholder == 'function') {
          return this.options.placeholder(this.model);
        } else {
          return this.options.placeholder;
        }
      } else {
        return this.placeholderModelValue();
      }
    }
    return '';
  },
  placeholderModelValue: function placeholderModelValue() {
    return this.options.placeholderModel && this.options.placeholderModel.get(this.options.propertyName);
  }
};

var viewWithValidationErrorMessages = {
  onRender: function onRender() {
    this.listenTo(this.model, 'invalid sync', this.updateValidationErrorMessages);
    this.updateValidationErrorMessages();
  },
  updateValidationErrorMessages: function updateValidationErrorMessages() {
    var _this = this;
    var errors = this.model.validationErrors && this.model.validationErrors[this.options.propertyName] || [];
    if (errors.length) {
      this.validationErrorList = this.validationErrorList || $('<ul class="validation_error_messages" />').appendTo(this.el);
      this.validationErrorList.html('');
      errors.forEach(function (error) {
        return _this.validationErrorList.append("<li>".concat(error, "</li>"));
      });
      this.$el.addClass('invalid');
    } else if (this.validationErrorList) {
      this.validationErrorList.remove();
      this.validationErrorList = null;
      this.$el.removeClass('invalid');
    }
  }
};

function template$6(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<input type="text" dir="auto" />\n';
return __p
}

/**
 * Input view for a single line of text.
 *
 * See {@link inputWithPlaceholderText} for placeholder related
 * further options.  See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {boolean} [options.required=false]
 * Display an error if the input is blank.
 *
 * @param {number} [options.maxLength=255]
 *   Maximum length of characters for this input.  To support legacy
 *   data which consists of more characters than the specified
 *   maxLength, the option will only take effect for data which is
 *   shorter than the specified maxLength.
 *
 * @class
 */
var TextInputView = Marionette.ItemView.extend({
  mixins: [inputView, inputWithPlaceholderText, viewWithValidationErrorMessages],
  template: template$6,
  ui: {
    input: 'input'
  },
  events: {
    'change': 'onChange'
  },
  onRender: function onRender() {
    this.load();
    this.validate();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  onChange: function onChange() {
    if (this.validate()) {
      this.save();
    }
  },
  onClose: function onClose() {
    if (this.validate()) {
      this.save();
    }
  },
  save: function save() {
    this.model.set(this.options.propertyName, this.ui.input.val());
  },
  load: function load() {
    var input = this.ui.input;
    input.val(this.model.get(this.options.propertyName));

    // set mysql varchar length as default for non-legacy data
    this.options.maxLength = this.options.maxLength || 255;
    // do not validate legacy data which length exceeds the specified maximum
    // for new and maxLength-conforming data: add validation
    this.validateMaxLength = input.val().length <= this.options.maxLength;
  },
  validate: function validate() {
    var input = this.ui.input;
    if (this.options.required && !input.val()) {
      this.displayValidationError(I18n$1.t('pageflow.ui.views.inputs.text_input_view.required_field'));
      return false;
    }
    if (this.validateMaxLength && input.val().length > this.options.maxLength) {
      this.displayValidationError(I18n$1.t('pageflow.ui.views.inputs.text_input_view.max_characters_exceeded', {
        max_length: this.options.maxLength
      }));
      return false;
    } else {
      this.resetValidationError();
      return true;
    }
  },
  displayValidationError: function displayValidationError(message) {
    this.$el.addClass('invalid');
    this.ui.input.attr('title', message);
  },
  resetValidationError: function resetValidationError(message) {
    this.$el.removeClass('invalid');
    this.ui.input.attr('title', '');
  }
});

function template$7(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<div class="file_name_input-wrapper">\n  <input type="text" dir="auto" />\n  <span class="file_name_input-extension"></span>\n</div>\n';
return __p
}

var FileNameInputView = TextInputView.extend({
  template: template$7,
  className: 'file_name_input',
  ui: Object.assign({}, TextInputView.prototype.ui, {
    extension: '.file_name_input-extension'
  }),
  onRender: function onRender() {
    TextInputView.prototype.onRender.call(this);
  },
  save: function save() {
    var baseName = this.ui.input.val();
    var extension = this.ui.extension.text();
    this.model.set(this.options.propertyName, baseName + extension);
  },
  load: function load() {
    var fullName = this.model.get(this.options.propertyName) || '';
    var match = fullName.match(/^(.*?)(\.[^.]+)?$/);
    var baseName = match ? match[1] : fullName;
    var extension = match && match[2] ? match[2] : '';
    this.ui.input.val(baseName);
    this.ui.extension.text(extension);
    this.options.maxLength = this.options.maxLength || 255;
  }
});

function template$8(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<input type="text" dir="auto" autocomplete="off" />\n';
return __p
}

/**
 * Input view for a color value in hex representation.
 *
 * See {@link inputWithPlaceholderText} for placeholder related
 * further options.  See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {string|function} [options.defaultValue]
 *   Color value to display by default. The corresponding value is not
 *   stored in the model. Selecting the default value when a different
 *   value was set before, unsets the attribute in the model.
 *
 * @param {string} [options.defaultValueBinding]
 *   Name of an attribute the default value depends on. If a function
 *   is used as defaultValue option, it will be passed the value of the
 *   defaultValueBinding attribute each time it changes. If no
 *   defaultValue option is set, the value of the defaultValueBinding
 *   attribute will be used as default value.
 *
 * @param {string|function} [options.placeholderColor]
 *   Color to display in swatch by default.
 *
 * @param {string} [options.placeholderColorBinding]
 *   Name of an attribute the placeholder color depends on. If a function
 *   is used as placeholderColor option, it will be passed the value of the
 *   placeholderColorBinding attribute each time it changes.
 *
 * @param {string[]} [options.swatches]
 *   Preset color values to be displayed inside the picker drop
 *   down. The default value, if present, is always used as the
 *   first swatch automatically.
 *
 * @class
 */
var ColorInputView = Marionette.ItemView.extend({
  mixins: [inputView, inputWithPlaceholderText],
  template: template$8,
  className: 'color_input',
  ui: {
    input: 'input'
  },
  events: {
    'mousedown': 'refreshPicker'
  },
  onRender: function onRender() {
    this.setupAttributeBinding('placeholderColor', this.updatePlaceholderColor);
    this.ui.input.minicolors({
      changeDelay: 200,
      change: _.bind(function (color) {
        this._saving = true;
        if (color === this.defaultValue()) {
          this.model.unset(this.options.propertyName);
        } else {
          this.model.set(this.options.propertyName, color);
        }
        this._saving = false;
      }, this)
    });
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
    if (this.options.defaultValueBinding) {
      this.listenTo(this.model, 'change:' + this.options.defaultValueBinding, this.updateSettings);
    }
    this.updateSettings();
  },
  updatePlaceholderColor: function updatePlaceholderColor(value) {
    this.el.style.setProperty('--placeholder-color', value);
  },
  updateSettings: function updateSettings() {
    this.resetSwatchesInStoredSettings();
    this.ui.input.minicolors('settings', {
      defaultValue: this.defaultValue(),
      swatches: this.getSwatches()
    });
    this.load();
  },
  // see https://github.com/claviska/jquery-minicolors/issues/287
  resetSwatchesInStoredSettings: function resetSwatchesInStoredSettings() {
    var settings = this.ui.input.data('minicolors-settings');
    if (settings) {
      delete settings.swatches;
      this.ui.input.data('minicolors-settings', settings);
    }
  },
  load: function load() {
    if (!this._saving) {
      this.ui.input.minicolors('value', this.model.get(this.options.propertyName) || this.defaultValue());
    }
    this.$el.toggleClass('is_default', !this.model.has(this.options.propertyName));
  },
  refreshPicker: function refreshPicker() {
    this.ui.input.minicolors('value', {});
  },
  getSwatches: function getSwatches() {
    return _.chain([this.defaultValue(), this.options.swatches]).flatten().uniq().compact().value();
  },
  defaultValue: function defaultValue() {
    var bindingValue;
    if (this.options.defaultValueBinding) {
      bindingValue = this.model.get(this.options.defaultValueBinding);
    }
    if (typeof this.options.defaultValue === 'function') {
      return this.options.defaultValue(bindingValue);
    } else if ('defaultValue' in this.options) {
      return this.options.defaultValue;
    } else {
      return bindingValue;
    }
  }
});

function template$9(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<select></select>';
return __p
}

/**
 * A drop down with support for grouped items.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {string[]} [options.values]
 *   List of possible values to persist in the attribute.
 *
 * @param {number} [options.defaultValue]
 *   Default value to display if property is not set.
 *
 * @param {string[]} [options.texts]
 *   List of display texts for drop down items.
 *
 * @param {string[]} [options.translationKeys]
 *   Translation keys to obtain item texts from.
 *
 * @param {string[]} [options.translationKeyPrefix]
 *   Obtain texts for items from translations by appending the item
 *   value to this prefix separated by a dot. By default the
 *   [`attributeTranslationKeyPrefixes` option]{@link inputView}
 *   is used by appending the suffix `.values` to each candidate.
 *
 * @param {string[]} [options.groups]
 *   Array of same length as `values` array, containing the display
 *   name of a group header each item shall be grouped under.
 *
 * @param {Backbone.Model[]} [options.collection]
 *   Create items for each model in the collection. Use the
 *   `*Property` options to extract values and texts for each items
 *   from the models.
 *
 * @param {string} [options.valueProperty]
 *   Attribute to use as item value.
 *
 * @param {string} [options.textProperty]
 *   Attribute to use as item display text.
 *
 * @param {string} [options.groupProperty]
 *   Attribute to use as item group name.
 *
 * @param {string} [options.translationKeyProperty]
 *   Attribute to use as translation key to obtain display text.
 *
 * @param {string} [options.groupTranslationKeyProperty]
 *   Attribute to use as translation key to obtain group name.
 *
 * @param {boolean} [options.ensureValueDefined]
 *   Set the attribute to the first value on view creation.
 *
 * @param {boolean} [options.includeBlank]
 *   Include an item that sets the value of the attribute to a blank
 *   string.
 *
 * @param {string} [options.blankText]
 *   Display text for the blank item.
 *
 * @param {string} [options.blankTranslationKey]
 *   Translation key to obtain display text for blank item. If neither
 *   `blankText` nor `blankTranslationKey` are provided, the blank text
 *   will be determined using `attributeTranslationKeyPrefixes` with
 *   the suffix `blank`, similar to how labels are determined.
 *
 * @param {string} [options.placeholderValue]
 *   Include an item that sets the value of the attribute to a blank
 *   string and indicate that the attribute is set to a default
 *   value. Include the display name of the given value, in the
 *   text. This option can be used if a fallback to the
 *   `placeholderValue` occurs whenever the attribute is blank.
 *
 * @param {Backbone.Model} [options.placeholderModel]
 *   Behaves like `placeholderValue`, but obtains the value by looking
 *   up the `propertyName` attribute inside the given model. This
 *   option can be used if a fallback to the corresponding attribute
 *   value of the `placeholderModel` occurs whenever the attribute is
 *   blank.
 *
 * @param {function} [options.optionDisabled]
 *   Receives value and has to return boolean indicating whether
 *   option is disabled.
 *
 * @class
 */
var SelectInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: template$9,
  events: {
    'change': 'save'
  },
  ui: {
    select: 'select',
    input: 'select'
  },
  initialize: function initialize() {
    if (this.options.collection) {
      this.options.values = _.pluck(this.options.collection, this.options.valueProperty);
      if (this.options.textProperty) {
        this.options.texts = _.pluck(this.options.collection, this.options.textProperty);
      } else if (this.options.translationKeyProperty) {
        this.options.translationKeys = _.pluck(this.options.collection, this.options.translationKeyProperty);
      }
      if (this.options.groupProperty) {
        this.options.groups = _.pluck(this.options.collection, this.options.groupProperty);
      } else if (this.options.groupTranslationKeyProperty) {
        this.options.groupTanslationKeys = _.pluck(this.options.collection, this.options.groupTranslationKeyProperty);
      }
    }
    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix = this.options.translationKeyPrefix || findKeyWithTranslation(this.attributeTranslationKeys('values', {
          fallbackPrefix: 'activerecord.values'
        }));
        this.options.translationKeys = _.map(this.options.values, function (value) {
          return translationKeyPrefix + '.' + value;
        }, this);
      }
      this.options.texts = _.map(this.options.translationKeys, function (key) {
        return I18n$1.t(key);
      });
    }
    if (!this.options.groups) {
      this.options.groups = _.map(this.options.groupTanslationKeys, function (key) {
        return I18n$1.t(key);
      });
    }
    this.optGroups = {};
  },
  onRender: function onRender() {
    this.appendBlank();
    this.appendPlaceholder();
    this.appendOptions();
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
    if (this.options.ensureValueDefined && !this.model.has(this.options.propertyName)) {
      this.save();
    }
  },
  appendBlank: function appendBlank() {
    if (!this.options.includeBlank) {
      return;
    }
    var blankText = this.options.blankText;
    if (this.options.blankTranslationKey) {
      blankText = I18n$1.t(this.options.blankTranslationKey);
    } else if (!blankText) {
      blankText = findTranslation(this.attributeTranslationKeys('blank'), {
        defaultValue: I18n$1.t('pageflow.ui.views.inputs.select_input_view.none')
      });
    }
    var option = document.createElement('option');
    option.value = '';
    option.text = blankText;
    this.ui.select.append(option);
  },
  appendPlaceholder: function appendPlaceholder() {
    if (!this.options.placeholderModel && !this.options.placeholderValue) {
      return;
    }
    var placeholderValue = this.options.placeholderValue || this.options.placeholderModel.get(this.options.propertyName);
    var placeholderIndex = this.options.values.indexOf(placeholderValue);
    if (placeholderIndex >= 0) {
      var option = document.createElement('option');
      option.value = '';
      option.text = I18n$1.t('pageflow.ui.views.inputs.select_input_view.placeholder', {
        text: this.options.texts[placeholderIndex]
      });
      this.ui.select.append(option);
    }
  },
  appendOptions: function appendOptions() {
    _.each(this.options.values, function (value, index) {
      var option = document.createElement('option');
      var group = this.options.groups[index];
      option.value = value;
      option.text = this.options.texts[index];
      if (this.options.optionDisabled && this.options.optionDisabled(value)) {
        option.setAttribute('disabled', true);
      }
      if (group) {
        option.setAttribute('data-group', group);
        this.findOrCreateOptGroup(group).append(option);
      } else {
        this.ui.select.append(option);
      }
    }, this);
  },
  findOrCreateOptGroup: function findOrCreateOptGroup(label) {
    if (!this.optGroups[label]) {
      this.optGroups[label] = $('<optgroup />', {
        label: label
      }).appendTo(this.ui.select);
    }
    return this.optGroups[label];
  },
  save: function save() {
    var value = this.ui.select.val();
    if ('defaultValue' in this.options && value === this.options.defaultValue) {
      this.model.unset(this.options.propertyName);
    } else {
      this.model.set(this.options.propertyName, value);
    }
  },
  load: function load() {
    if (!this.isClosed) {
      var value = this.model.get(this.options.propertyName);
      if (this.model.has(this.options.propertyName) && this.ui.select.find('option[value="' + value + '"]:not([disabled])').length) {
        this.ui.select.val(value);
      } else if ('defaultValue' in this.options) {
        this.ui.select.val(this.options.defaultValue);
      } else {
        this.ui.select.val(this.ui.select.find('option:not([disabled]):first').val());
      }
    }
  }
});

var ExtendedSelectInputView = SelectInputView.extend({
  className: 'extended_select_input',
  initialize: function initialize() {
    SelectInputView.prototype.initialize.apply(this, arguments);
    if (this.options.collection) {
      if (this.options.descriptionProperty) {
        this.options.descriptions = _.pluck(this.options.collection, this.options.descriptionProperty);
      } else if (this.options.descriptionTranslationKeyProperty) {
        this.options.descriptionTanslationKeys = _.pluck(this.options.collection, this.options.descriptionTranslationKeyProperty);
      }
    }
    if (!this.options.descriptions) {
      this.options.descriptions = _.map(this.options.descriptionTanslationKeys, function (key) {
        return I18n$1.t(key);
      });
    }
  },
  onRender: function onRender() {
    var view = this,
      options = this.options;
    SelectInputView.prototype.onRender.apply(this, arguments);
    $.widget("custom.extendedselectmenu", $.ui.selectmenu, {
      _renderItem: function _renderItem(ul, item) {
        var widget = this;
        var li = $('<li>', {
          "class": item.value
        });
        var container = $('<div>', {
          "class": 'text-container'
        }).appendTo(li);
        var index = options.values.indexOf(item.value);
        if (item.disabled) {
          li.addClass('ui-state-disabled');
        }
        if (options.pictogramClass) {
          $('<span>', {
            "class": options.pictogramClass
          }).prependTo(li);
        }
        $('<p>', {
          text: item.label,
          "class": 'item-text'
        }).appendTo(container);
        $('<p>', {
          text: options.descriptions[index],
          "class": 'item-description'
        }).appendTo(container);
        if (options.helpLinkClicked) {
          $('<a>', {
            href: '#',
            title: I18n$1.t('pageflow.ui.views.extended_select_input_view.display_help')
          }).on('click', function () {
            widget.close();
            options.helpLinkClicked(item.value);
            return false;
          }).appendTo(li);
        }
        return li.appendTo(ul);
      },
      _resizeMenu: function _resizeMenu() {
        this.menuWrap.addClass('extended_select_input_menu');
        var menuHeight = this.menu.height(),
          menuOffset = this.button.offset().top + this.button.outerHeight(),
          bodyHeight = $('body').height();
        if (menuHeight + menuOffset > bodyHeight) {
          this.menuWrap.outerHeight(bodyHeight - menuOffset - 5).css({
            'overflow-y': 'scroll'
          });
        } else {
          this.menuWrap.css({
            height: 'initial',
            'overflow-y': 'initial'
          });
        }
      }
    });
    this.ui.select.extendedselectmenu({
      select: view.select.bind(view),
      width: '100%',
      position: {
        my: 'right top',
        at: 'right bottom'
      }
    });
  },
  select: function select(event, ui) {
    this.ui.select.val(ui.item.value);
    this.save();
  }
});

function template$a(data) {
var __t, __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n\n<!-- inline style for wysihtml5 to pick up -->\n<textarea style="width: 100%;" dir="auto"></textarea>\n\n<div class="toolbar">\n  <a data-wysihtml5-command="bold" title="' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.bold') )) == null ? '' : __t) +
'"></a>\n  <a data-wysihtml5-command="italic" title="' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.italic') )) == null ? '' : __t) +
'"></a>\n  <a data-wysihtml5-command="underline" title="' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.underline') )) == null ? '' : __t) +
'"></a>\n  <a data-wysihtml5-command="createLink" class="link_button" title="' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.create_link') )) == null ? '' : __t) +
'"></a>\n  <a data-wysihtml5-command="insertOrderedList" title="' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.insert_ordered_list') )) == null ? '' : __t) +
'"></a>\n  <a data-wysihtml5-command="insertUnorderedList" title="' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.insert_unordered_list') )) == null ? '' : __t) +
'"></a>\n\n  <div data-wysihtml5-dialog="createLink" class="dialog link_dialog" style="display: none;">\n    <div class="link_type_select">\n      <label>\n        <input type="radio" name="link_type" class="url_link_radio_button">\n        ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.link_type.url') )) == null ? '' : __t) +
'\n      </label>\n      <label>\n        <input type="radio" name="link_type" class="fragment_link_radio_button">\n        ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.link_type.page_link') )) == null ? '' : __t) +
'\n      </label>\n    </div>\n    <div class="url_link_panel">\n      <label>\n        <span>\n          ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.target') )) == null ? '' : __t) +
'\n        </span>\n      </label>\n      <input type="text" class="display_url">\n      <div class="open_in_new_tab_section">\n        <label>\n          <input type="checkbox" class="open_in_new_tab">\n          ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.open_in_new_tab') )) == null ? '' : __t) +
'\n        </label>\n        <span class="inline_help">\n          ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.open_in_new_tab_help') )) == null ? '' : __t) +
'\n        </span>\n      </div>\n    </div>\n    <div class="fragment_link_panel">\n      <!-- LinkInputView is inserted here -->\n    </div>\n\n    <!-- wysihtml5 does not handle hidden fields correctly -->\n    <div class="internal">\n      <input type="text" data-wysihtml5-dialog-field="href" class="current_url" value="">\n      <input type="text" data-wysihtml5-dialog-field="target" class="current_target" value="_blank">\n    </div>\n\n    <a class="button" data-wysihtml5-dialog-action="save">\n      ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.save') )) == null ? '' : __t) +
'\n    </a>\n    <a class="button" data-wysihtml5-dialog-action="cancel">\n      ' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.cancel') )) == null ? '' : __t) +
'\n    </a>\n\n    <a data-wysihtml5-command="removeLink">' +
((__t = ( I18n.t('pageflow.ui.templates.inputs.text_area_input.remove_link') )) == null ? '' : __t) +
'</a>\n  </div>\n</div>\n';
return __p
}

/**
 * Input view for multi line text with simple formatting options.
 * See {@link inputWithPlaceholderText} for placeholder related options.
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.size="normal"]
 *   Pass `"short"` to reduce the text area height.
 *
 * @param {boolean} [options.disableLinks=false]
 *   Do not allow links inside the text.
 *
 * @param {boolean} [options.disableRichtext=false]
 *   Do not provide text formatting options.
 *
 * @param {Backbone.View} [options.fragmentLinkInputView]
 *   A view to select an id to use in links which only consist
 *   of a url fragment. Will receive a model with a `linkId`
 *   attribute.
 *
 * @class
 */
var TextAreaInputView = Marionette.ItemView.extend({
  mixins: [inputView, inputWithPlaceholderText],
  template: template$a,
  className: 'text_area_input',
  ui: {
    input: 'textarea',
    toolbar: '.toolbar',
    linkButton: '.link_button',
    linkDialog: '.link_dialog',
    urlInput: '.current_url',
    targetInput: '.current_target',
    linkTypeSelection: '.link_type_select',
    urlLinkRadioButton: '.url_link_radio_button',
    fragmentLinkRadioButton: '.fragment_link_radio_button',
    urlLinkPanel: '.url_link_panel',
    displayUrlInput: '.display_url',
    openInNewTabCheckBox: '.open_in_new_tab',
    fragmentLinkPanel: '.fragment_link_panel'
  },
  events: {
    'change textarea': 'save',
    'click .url_link_radio_button': 'showUrlLinkPanel',
    'click .fragment_link_radio_button': 'showFragmentLinkPanel',
    'change .open_in_new_tab': 'setTargetFromOpenInNewTabCheckBox',
    'change .display_url': 'setUrlFromDisplayUrl'
  },
  onRender: function onRender() {
    this.ui.input.addClass(this.options.size);
    this.load();
    this.updatePlaceholder();
    this.editor = new wysihtml5.Editor(this.ui.input[0], {
      toolbar: this.ui.toolbar[0],
      autoLink: this.options.disableLinks ? 0 : 1,
      parserRules: {
        tags: {
          em: {
            unwrap: this.options.disableRichtext ? 1 : 0,
            rename_tag: "i"
          },
          strong: {
            unwrap: this.options.disableRichtext ? 1 : 0,
            rename_tag: "b"
          },
          u: {
            unwrap: this.options.disableRichtext ? 1 : 0
          },
          b: {
            unwrap: this.options.disableRichtext ? 1 : 0
          },
          i: {
            unwrap: this.options.disableRichtext ? 1 : 0
          },
          ol: {
            unwrap: this.options.enableLists ? 0 : 1
          },
          ul: {
            unwrap: this.options.enableLists ? 0 : 1
          },
          li: {
            unwrap: this.options.enableLists ? 0 : 1
          },
          br: {},
          a: {
            unwrap: this.options.disableLinks ? 1 : 0,
            check_attributes: {
              href: 'href',
              target: 'any'
            },
            set_attributes: {
              rel: 'nofollow'
            }
          }
        }
      }
    });
    if (this.options.disableRichtext) {
      this.ui.toolbar.find('a[data-wysihtml5-command="bold"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="italic"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="underline"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="insertOrderedList"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="insertUnorderedList"]').hide();
    }
    if (!this.options.enableLists) {
      this.ui.toolbar.find('a[data-wysihtml5-command="insertOrderedList"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="insertUnorderedList"]').hide();
    }
    if (this.options.disableLinks) {
      this.ui.toolbar.find('a[data-wysihtml5-command="createLink"]').hide();
    } else {
      this.setupUrlLinkPanel();
      this.setupFragmentLinkPanel();
    }
    this.editor.on('change', _.bind(this.save, this));
    this.editor.on('aftercommand:composer', _.bind(this.save, this));
  },
  onClose: function onClose() {
    this.editor.fire('destroy:composer');
  },
  save: function save() {
    this.model.set(this.options.propertyName, this.editor.getValue());
  },
  load: function load() {
    this.ui.input.val(this.model.get(this.options.propertyName));
  },
  setupUrlLinkPanel: function setupUrlLinkPanel() {
    this.editor.on('show:dialog', _.bind(function () {
      this.ui.linkDialog.toggleClass('for_existing_link', this.ui.linkButton.hasClass('wysihtml5-command-active'));
      var currentUrl = this.ui.urlInput.val();
      if (currentUrl.startsWith('#')) {
        this.ui.displayUrlInput.val('');
        this.ui.openInNewTabCheckBox.prop('checked', true);
      } else {
        this.ui.displayUrlInput.val(currentUrl);
        this.ui.openInNewTabCheckBox.prop('checked', this.ui.targetInput.val() !== '_self');
      }
    }, this));
  },
  setupFragmentLinkPanel: function setupFragmentLinkPanel() {
    if (this.options.fragmentLinkInputView) {
      this.fragmentLinkModel = new Backbone.Model();
      this.listenTo(this.fragmentLinkModel, 'change', function (model, options) {
        if (!options.skipCurrentUrlUpdate) {
          this.setInputsFromFragmentLinkModel();
        }
      });
      this.editor.on('show:dialog', _.bind(function () {
        var currentUrl = this.ui.urlInput.val();
        var id = currentUrl.startsWith('#') ? currentUrl.substr(1) : null;
        this.fragmentLinkModel.set('linkId', id, {
          skipCurrentUrlUpdate: true
        });
        this.initLinkTypePanels(!id);
      }, this));
      var fragmentLinkInput = new this.options.fragmentLinkInputView({
        model: this.fragmentLinkModel,
        propertyName: 'linkId',
        label: I18n$1.t('pageflow.ui.templates.inputs.text_area_input.target'),
        hideUnsetButton: true
      });
      this.ui.fragmentLinkPanel.append(fragmentLinkInput.render().el);
    } else {
      this.ui.linkTypeSelection.hide();
      this.ui.fragmentLinkPanel.hide();
    }
  },
  initLinkTypePanels: function initLinkTypePanels(isUrlLink) {
    if (isUrlLink) {
      this.ui.urlLinkRadioButton.prop('checked', true);
    } else {
      this.ui.fragmentLinkRadioButton.prop('checked', true);
    }
    this.ui.toolbar.toggleClass('fragment_link_panel_active', !isUrlLink);
  },
  showUrlLinkPanel: function showUrlLinkPanel() {
    this.ui.toolbar.removeClass('fragment_link_panel_active');
    this.setUrlFromDisplayUrl();
    this.setTargetFromOpenInNewTabCheckBox();
  },
  showFragmentLinkPanel: function showFragmentLinkPanel() {
    this.ui.toolbar.addClass('fragment_link_panel_active');
    this.setInputsFromFragmentLinkModel();
  },
  setInputsFromFragmentLinkModel: function setInputsFromFragmentLinkModel() {
    this.ui.urlInput.val('#' + (this.fragmentLinkModel.get('linkId') || ''));
    this.ui.targetInput.val('_self');
  },
  setUrlFromDisplayUrl: function setUrlFromDisplayUrl() {
    this.ui.urlInput.val(this.ui.displayUrlInput.val());
  },
  setTargetFromOpenInNewTabCheckBox: function setTargetFromOpenInNewTabCheckBox() {
    this.ui.targetInput.val(this.ui.openInNewTabCheckBox.is(':checked') ? '_blank' : '_self');
  }
});

function template$b(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<input type="text" />\n<div class="validation"></div>\n';
return __p
}

/**
 * Input view for URLs.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {string[]} options.supportedHosts
 *   List of allowed url prefixes.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the url is blank.
 *
 * @param {boolean} [options.permitHttps=false]
 *   Allow urls with https protocol.
 *
 * @class
 */
var UrlInputView = Marionette.Layout.extend( /** @lends UrlInputView.prototype */{
  mixins: [inputView],
  template: template$b,
  ui: {
    input: 'input',
    validation: '.validation'
  },
  events: {
    'change': 'onChange'
  },
  onRender: function onRender() {
    this.ui.validation.hide();
    this.load();
    this.validate();
  },
  onChange: function onChange() {
    var _this = this;
    this.validate().then(function () {
      return _this.save();
    }, function () {
      return _this.saveDisplayProperty();
    });
  },
  saveDisplayProperty: function saveDisplayProperty() {
    this.model.unset(this.options.propertyName, {
      silent: true
    });
    this.model.set(this.options.displayPropertyName, this.ui.input.val());
  },
  save: function save() {
    var _this2 = this;
    var value = this.ui.input.val();
    $.when(this.transformPropertyValue(value)).then(function (transformedValue) {
      _this2.model.set(_defineProperty(_defineProperty({}, _this2.options.displayPropertyName, value), _this2.options.propertyName, transformedValue));
    });
  },
  load: function load() {
    this.ui.input.val(this.model.has(this.options.displayPropertyName) ? this.model.get(this.options.displayPropertyName) : this.model.get(this.options.propertyName));
    this.onLoad();
  },
  /**
   * Override to be notified when the input has been loaded.
   */
  onLoad: function onLoad() {},
  /**
   * Override to validate the untransformed url. Validation error
   * message can be passed as rejected promise. Progress notifications
   * are displayed. Only valid urls are stored in the configuration.
   *
   * @return Promise
   */
  validateUrl: function validateUrl(url) {
    return $.Deferred().resolve().promise();
  },
  /**
   * Override to transform the property value before it is stored.
   *
   * @return Promise | String
   */
  transformPropertyValue: function transformPropertyValue(value) {
    return value;
  },
  /**
   * Override to change the list of supported host names.
   */
  supportedHosts: function supportedHosts() {
    return this.options.supportedHosts;
  },
  // Host names used to be expected to include protocols. Remove
  // protocols for backwards compatilbity. Since supportedHosts
  // is supposed to be overridden in subclasses, we do it in a
  // separate method.
  supportedHostsWithoutLegacyProtocols: function supportedHostsWithoutLegacyProtocols() {
    return _.map(this.supportedHosts(), function (host) {
      return host.replace(/^https?:\/\//, '');
    });
  },
  validate: function validate(success) {
    var view = this;
    var options = this.options;
    var value = this.ui.input.val();
    if (options.required && !value) {
      displayValidationError(I18n$1.t('pageflow.ui.views.inputs.url_input_view.required_field'));
    } else if (value && !isValidUrl(value)) {
      var errorMessage = I18n$1.t('pageflow.ui.views.inputs.url_input_view.url_hint');
      if (options.permitHttps) {
        errorMessage = I18n$1.t('pageflow.ui.views.inputs.url_input_view.url_hint_https');
      }
      displayValidationError(errorMessage);
    } else if (value && !hasSupportedHost(value)) {
      displayValidationError(I18n$1.t('pageflow.ui.views.inputs.url_input_view.supported_vendors') + _.map(view.supportedHosts(), function (url) {
        return '<li>' + url + '</li>';
      }).join(''));
    } else {
      return view.validateUrl(value).progress(function (message) {
        displayValidationPending(message);
      }).done(function () {
        resetValidationError();
      }).fail(function (error) {
        displayValidationError(error);
      });
    }
    return $.Deferred().reject().promise();
    function isValidUrl(url) {
      return options.permitHttps ? url.match(/^https?:\/\//i) : url.match(/^http:\/\//i);
    }
    function hasSupportedHost(url) {
      return _.any(view.supportedHostsWithoutLegacyProtocols(), function (host) {
        return url.match(new RegExp('^https?://' + host));
      });
    }
    function displayValidationError(message) {
      view.$el.addClass('invalid');
      view.ui.input.attr('aria-invalid', 'true');
      view.ui.validation.removeClass('pending').addClass('failed').html(message).show();
    }
    function displayValidationPending(message) {
      view.$el.removeClass('invalid');
      view.ui.input.removeAttr('aria-invalid');
      view.ui.validation.removeClass('failed').addClass('pending').html(message).show();
    }
    function resetValidationError(message) {
      view.$el.removeClass('invalid');
      view.ui.input.attr('aria-invalid', 'false');
      view.ui.validation.hide();
    }
  }
});

/**
 * Input view that verifies that a certain URL is reachable via a
 * proxy. To conform with same origin restrictions, this input view
 * lets the user enter some url and saves a rewritten url where the
 * domain is replaced with some path segment.
 *
 * That way, when `/example` is setup to proxy requests to
 * `http://example.com`, the user can enter an url of the form
 * `http://example.com/some/path` but the string `/example/some/path`
 * is persisited to the database.
 *
 * See {@link inputView} for further options
 *
 * @param {Object} options
 *
 * @param {string} options.displayPropertyName
 *   Attribute name to store the url entered by the user.
 *
 * @param {Object[]} options.proxies
 *   List of supported proxies.
 *
 * @param {string} options.proxies[].url
 *   Supported prefix of an url that can be entered by the user.
 *
 * @param {string} options.proxies[].base_path
 *   Path to replace the url prefix with.
 *
 * @param {boolean} [options.required=false]
 *   Display an error if the url is blank.
 *
 * @param {boolean} [options.permitHttps=false]
 *   Allow urls with https protocol.
 *
 * @example
 *
 * this.input('url, ProxyUrlInputView, {
 *   proxies: [
 *     {
 *       url: 'http://example.com',
 *       base_path: '/example'
 *     }
 *   ]
 * });
 *
 * @class
 */
var ProxyUrlInputView = UrlInputView.extend( /** @lends ProxyUrlInputView.prototype */{
  // @override
  validateUrl: function validateUrl(url) {
    var view = this;
    return $.Deferred(function (deferred) {
      deferred.notify(I18n$1.t('pageflow.ui.views.inputs.proxy_url_input_view.url_validation'));
      $.ajax({
        url: view.rewriteUrl(url),
        dataType: 'html'
      }).done(deferred.resolve).fail(function (xhr) {
        deferred.reject(I18n$1.t('pageflow.ui.views.inputs.proxy_url_input_view.http_error', {
          status: xhr.status
        }));
      });
    }).promise();
  },
  // override
  transformPropertyValue: function transformPropertyValue(url) {
    return this.rewriteUrl(url);
  },
  // override
  supportedHosts: function supportedHosts() {
    return _.pluck(this.options.proxies, 'url');
  },
  rewriteUrl: function rewriteUrl(url) {
    _.each(this.options.proxies, function (proxy) {
      url = url.replace(new RegExp('^' + proxy.url + '/?'), proxy.base_path + '/');
    });
    return url;
  }
});

function template$c(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<div class="value"></div>\n<div class="slider"></div>\n';
return __p
}

/**
 * A slider for numeric inputs.
 * See {@link inputView} for options
 *
 * @param {Object} [options]
 *
 * @param {number} [options.defaultValue]
 *   Default value to display if property is not set.
 *
 * @param {number} [options.minValue=0]
 *   Value when dragging slider to the very left.
 *
 * @param {number} [options.maxValue=100]
 *   Value when dragging slider to the very right.
 *
 * @param {string} [options.unit="%"]
 *   Unit to display after value.
 *
 * @param {function} [options.displayText]
 *   Function that receives value and returns custom text to display as value.
 *
 * @param {boolean} [options.saveOnSlide]
 *   Already update the model while dragging the handle - not only after
 *   handle has been released.
 *
 * @class
 */
var SliderInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: 'slider_input',
  template: template$c,
  ui: {
    widget: '.slider',
    value: '.value'
  },
  events: {
    'slidechange': 'save',
    'slide': 'handleSlide'
  },
  onRender: function onRender() {
    var _this = this;
    this.ui.widget.slider({
      animate: 'fast'
    });
    this.setupAttributeBinding('minValue', function (value) {
      return _this.updateSliderOption('min', value || 0);
    });
    this.setupAttributeBinding('maxValue', function (value) {
      return _this.updateSliderOption('max', value !== undefined ? value : 100);
    });
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  updateSliderOption: function updateSliderOption(name, value) {
    this.ui.widget.slider('option', name, value);
    this.updateText(this.ui.widget.slider('value'));
  },
  updateDisabled: function updateDisabled(disabled) {
    this.$el.toggleClass('disabled', !!disabled);
    if (disabled) {
      this.ui.widget.slider('disable');
    } else {
      this.ui.widget.slider('enable');
    }
  },
  handleSlide: function handleSlide(event, ui) {
    this.updateText(ui.value);
    if (this.options.saveOnSlide) {
      this.save(event, ui);
    }
  },
  save: function save(event, ui) {
    this.model.set(this.options.propertyName, ui.value);
  },
  load: function load() {
    var value;
    if (this.model.has(this.options.propertyName)) {
      value = this.model.get(this.options.propertyName);
    } else {
      value = 'defaultValue' in this.options ? this.options.defaultValue : 0;
    }
    this.ui.widget.slider('option', 'value', this.clampValue(value));
    this.updateText(value);
  },
  clampValue: function clampValue(value) {
    var min = this.ui.widget.slider('option', 'min');
    var max = this.ui.widget.slider('option', 'max');
    return Math.min(max, Math.max(min, value));
  },
  updateText: function updateText(value) {
    var unit = 'unit' in this.options ? this.options.unit : '%';
    var text = 'displayText' in this.options ? this.options.displayText(value) : value + unit;
    this.ui.value.text(text);
  }
});

function template$d(data) {
var __p = '';
__p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n\n<textarea></textarea>\n';
return __p
}

var JsonInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: template$d,
  className: 'json_input',
  ui: {
    input: 'textarea'
  },
  events: {
    'change': 'onChange',
    'keyup': 'validate'
  },
  onRender: function onRender() {
    this.load();
    this.validate();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  onChange: function onChange() {
    if (this.validate()) {
      this.save();
    }
  },
  onClose: function onClose() {
    if (this.validate()) {
      this.save();
    }
  },
  save: function save() {
    this.model.set(this.options.propertyName, this.ui.input.val() ? JSON.parse(this.ui.input.val()) : null);
  },
  load: function load() {
    var input = this.ui.input;
    var value = this.model.get(this.options.propertyName);
    input.val(value ? JSON.stringify(value, null, 2) : '');
  },
  validate: function validate() {
    var input = this.ui.input;
    if (input.val() && !this.isValidJson(input.val())) {
      this.displayValidationError(I18n$1.t('pageflow.ui.views.inputs.json_input_view.invalid'));
      return false;
    } else {
      this.resetValidationError();
      return true;
    }
  },
  displayValidationError: function displayValidationError(message) {
    this.$el.addClass('invalid');
    this.ui.input.attr('title', message);
  },
  resetValidationError: function resetValidationError(message) {
    this.$el.removeClass('invalid');
    this.ui.input.attr('title', '');
  },
  isValidJson: function isValidJson(text) {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }
});

function template$e(data) {
var __p = '';
__p += '<input type="checkbox" />\n<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>';
return __p
}

/**
 * Input view for boolean values.
 * See {@link inputView} for further options
 *
 * @param {Object} [options]
 *
 * @param {boolean} [options.displayUncheckedIfDisabled=false]
 *   Ignore the attribute value if the input is disabled and display
 *   an unchecked check box.
 *
 * @param {boolean} [options.displayCheckedIfDisabled=false]
 *   Ignore the attribute value if the input is disabled and display
 *   an checked check box.
 *
 * @param {string} [options.storeInverted]
 *   Display checked by default and store true in given attribute when
 *   unchecked. The property name passed to `input` is only used for
 *   translations.
 *
 * @class
 */
var CheckBoxInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: template$e,
  className: 'check_box_input',
  events: {
    'change': 'save'
  },
  ui: {
    input: 'input',
    label: 'label'
  },
  onRender: function onRender() {
    this.ui.label.attr('for', this.cid);
    this.ui.input.attr('id', this.cid);
    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },
  updateDisabled: function updateDisabled() {
    this.load();
  },
  save: function save() {
    if (!this.isDisabled()) {
      var value = this.ui.input.is(':checked');
      if (this.options.storeInverted) {
        this.model.set(this.options.storeInverted, !value);
      } else {
        this.model.set(this.options.propertyName, value);
      }
    }
  },
  load: function load() {
    if (!this.isClosed) {
      this.ui.input.prop('checked', !!this.displayValue());
    }
  },
  displayValue: function displayValue() {
    if (this.isDisabled() && this.options.displayUncheckedIfDisabled) {
      return false;
    } else if (this.isDisabled() && this.options.displayCheckedIfDisabled) {
      return true;
    } else if (this.options.storeInverted) {
      return !this.model.get(this.options.storeInverted);
    } else {
      return this.model.get(this.options.propertyName);
    }
  }
});

/**
 * Render a separator in a {@link ConfigurationEditorView} tab.
 *
 * @example
 *
 * this.view(SeparatorView);
 *
 * @class
 */
var SeparatorView = Marionette.View.extend({
  className: 'separator'
});

/**
 * Render an input that is only a label. Can be used to render
 * additional inline help.
 *
 * See {@link inputView} for further options
 *
 * @class
 */
var LabelOnlyView = Marionette.ItemView.extend({
  mixins: [inputView],
  template: function template() {
    return "\n    <label>\n      <span class=\"name\"></span>\n      <span class=\"inline_help\"></span>\n    </label>\n  ";
  },
  ui: {
    label: 'label'
  }
});

/**
 * A table cell mapping column attribute values to a list of
 * translations.
 *
 * ## Attribute Translations
 *
 * The following attribute translations are used:
 *
 * - `.cell_text.<attribute_value>` - Used as cell content.
 * - `.cell_text.blank` - Used as cell content if attribute is blank.
 * - `.cell_title.<attribute_value>` - Used as title attribute.
 * - `.cell_title.blank` - Used as title attribute if attribute is blank.
 *
 * @since 12.0
 */
var EnumTableCellView = TableCellView.extend({
  className: 'enum_table_cell',
  update: function update() {
    this.$el.text(this.attributeTranslation('cell_text.' + (this.attributeValue() || 'blank')));
    this.$el.attr('title', this.attributeTranslation('cell_title.' + (this.attributeValue() || 'blank'), {
      defaultValue: ''
    }));
  }
});

function template$f(data) {
var __t, __p = '';
__p += '<a class="remove" title="' +
((__t = ( I18n.t('pageflow.editor.templates.row.destroy') )) == null ? '' : __t) +
'"></a>\n';
return __p
}

/**
 * A table cell providing a button which destroys the model that the
 * current row refers to.
 *
 * ## Attribute Translations
 *
 * The following attribute translation is used:
 *
 * - `.cell_title` - Used as title attribute.
 *
 * @param {Object} [options]
 *
 * @param {function} [options.toggleDeleteButton]
 *   A function with boolean return value to be called on
 *   this.getModel(). Delete button will be visible only if the
 *   function returns a truthy value.
 *
 * @param {boolean} [options.invertToggleDeleteButton]
 *   Invert the return value of `toggleDeleteButton`?
 *
 * @since 12.0
 */
var DeleteRowTableCellView = TableCellView.extend({
  className: 'delete_row_table_cell',
  template: template$f,
  ui: {
    removeButton: '.remove'
  },
  events: {
    'click .remove': 'destroy',
    'click': function click() {
      return false;
    }
  },
  showButton: function showButton() {
    if (this.options.toggleDeleteButton) {
      var context = this.getModel();
      var toggle = context[this.options.toggleDeleteButton].apply(context);
      if (this.options.invertToggleDeleteButton) {
        return !toggle;
      } else {
        return !!toggle;
      }
    } else {
      return true;
    }
  },
  update: function update() {
    this.ui.removeButton.toggleClass('remove', this.showButton());
    this.ui.removeButton.attr('title', this.attributeTranslation('cell_title'));
  },
  destroy: function destroy() {
    this.getModel().destroy();
  }
});

/**
 * A table cell representing whether the column attribute is present
 * on the row model.
 *
 * ## Attribute Translations
 *
 * The following attribute translations are used:
 *
 * - `.cell_title.present` - Used as title attribute if the attribute
 *   is present. The current attribute value is provided as
 *   interpolation `%{value}`.
 * - `.cell_title.blank` - Used as title attribute if the
 *   attribute is blank.
 *
 * @since 12.0
 */
var PresenceTableCellView = TableCellView.extend({
  className: 'presence_table_cell',
  update: function update() {
    var isPresent = !!this.attributeValue();
    this.$el.attr('title', isPresent ? this.attributeTranslation('cell_title.present', {
      value: this.attributeValue()
    }) : this.attributeTranslation('cell_title.blank'));
    this.$el.toggleClass('is_present', isPresent);
  }
});

/**
 * A table cell mapping column attribute values to icons.
 *
 * ## Attribute Translations
 *
 * The following attribute translations are used:
 *
 * - `.cell_title.<attribute_value>` - Used as title attribute.
 * - `.cell_title.blank` - Used as title attribute if attribute is blank.
 *
 * @param {Object} [options]
 *
 * @param {string[]} [options.icons]
 *   An array of all possible attribute values to be mapped to HTML
 *   classes of the same name. A global mapping from those classes to
 *   icon mixins is provided in
 *   pageflow/ui/table_cells/icon_table_cell.scss.
 *
 * @since 12.0
 */
var IconTableCellView = TableCellView.extend({
  className: 'icon_table_cell',
  update: function update() {
    var icon = this.attributeValue();
    var isPresent = !!this.attributeValue();
    this.removeExistingIcons();
    this.$el.attr('title', isPresent ? this.attributeTranslation('cell_title.' + icon, {
      value: this.attributeValue()
    }) : this.attributeTranslation('cell_title.blank'));
    this.$el.addClass(icon);
  },
  removeExistingIcons: function removeExistingIcons() {
    this.$el.removeClass(this.options.icons.join(' '));
  }
});

/**
 * A table cell using the row model's value of the column attribute as
 * text. If attribute value is empty, use most specific default
 * available.
 *
 * @param {Object} [options]
 *
 * @param {function|string} [options.column.default]
 *   A function returning a default value for display if attribute
 *   value is empty.
 *
 * @param {string} [options.column.contentBinding]
 *   If this is provided, the function `options.column.default`
 *   receives the values of `options.column.contentBinding` and of
 *   this.getModel() via its options hash. No-op if
 *   `options.column.default` is not a function.
 *
 * @since 12.0
 */
var TextTableCellView = TableCellView.extend({
  className: 'text_table_cell',
  update: function update() {
    this.$el.text(this._updateText());
  },
  _updateText: function _updateText() {
    if (this.attributeValue()) {
      return this.attributeValue();
    } else if (typeof this.options.column["default"] === 'function') {
      var options = {};
      if (this.options.column.contentBinding) {
        options = {
          contentBinding: this.options.column.contentBinding,
          model: this.getModel()
        };
      }
      return this.options.column["default"](options);
    } else if ('default' in this.options.column) {
      return this.options.column["default"];
    } else {
      return I18n$1.t('pageflow.ui.text_table_cell_view.empty');
    }
  }
});

var subviewContainer = {
  subview: function subview(view) {
    this.subviews = this.subviews || new ChildViewContainer();
    this.subviews.add(view.render());
    return view;
  },
  appendSubview: function appendSubview(view) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      to = _ref.to;
    return (to || this.$el).append(this.subview(view).el);
  },
  onClose: function onClose() {
    if (this.subviews) {
      this.subviews.call('close');
    }
  }
};
if (!Marionette.View.prototype.appendSubview) {
  Cocktail.mixin(Marionette.View, subviewContainer);
}

var tooltipContainer = {
  events: {
    'mouseover [data-tooltip]': function mouseoverDataTooltip(event) {
      if (!this.tooltip.visible) {
        var target = $(event.currentTarget);
        var key = target.attr('data-tooltip');
        var position;
        if (target.data('tooltipAlign') === 'bottom left') {
          position = {
            left: target.position().left,
            top: target.position().top + target.outerHeight()
          };
        } else if (target.data('tooltipAlign') === 'bottom right') {
          position = {
            left: target.position().left + target.outerWidth(),
            top: target.position().top + target.outerHeight()
          };
        } else if (target.data('tooltipAlign') === 'top center') {
          position = {
            left: target.position().left + target.outerWidth() / 2,
            top: target.position().top + 2
          };
        } else {
          position = {
            left: target.position().left + target.outerWidth(),
            top: target.position().top + target.outerHeight() / 2
          };
        }
        this.tooltip.show(I18n$1.t(key), position, {
          align: target.data('tooltipAlign')
        });
      }
    },
    'mouseleave [data-tooltip]': function mouseleaveDataTooltip() {
      this.tooltip.hide();
    }
  },
  onRender: function onRender() {
    this.appendSubview(this.tooltip = new TooltipView());
  }
};

export { CheckBoxGroupInputView, CheckBoxInputView, CollectionView, ColorInputView, ConfigurationEditorTabView, ConfigurationEditorView, DeleteRowTableCellView, EnumTableCellView, ExtendedSelectInputView, FileNameInputView, IconTableCellView, JsonInputView, LabelOnlyView, NumberInputView, BaseObject as Object, PresenceTableCellView, ProxyUrlInputView, SelectInputView, SeparatorView, SliderInputView, SortableCollectionView, TableCellView, TableHeaderCellView, TableRowView, TableView, TabsView, TextAreaInputView, TextInputView, TextTableCellView, TooltipView, UrlDisplayView, UrlInputView, attributeBinding, cssModulesUtils, i18nUtils, inputView, inputWithPlaceholderText, serverSideValidation, subviewContainer, tooltipContainer, viewWithValidationErrorMessages };
