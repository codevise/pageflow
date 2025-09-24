this.pageflow = this.pageflow || {};
this.pageflow._uiGlobalInterop = (function (exports, Marionette, _, $, I18n$1, Backbone, ChildViewContainer, IScroll, jquery_minicolors, wysihtml5, jqueryUi, Cocktail) {
  'use strict';

  Marionette = Marionette && Marionette.hasOwnProperty('default') ? Marionette['default'] : Marionette;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  I18n$1 = I18n$1 && I18n$1.hasOwnProperty('default') ? I18n$1['default'] : I18n$1;
  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  ChildViewContainer = ChildViewContainer && ChildViewContainer.hasOwnProperty('default') ? ChildViewContainer['default'] : ChildViewContainer;
  IScroll = IScroll && IScroll.hasOwnProperty('default') ? IScroll['default'] : IScroll;
  wysihtml5 = wysihtml5 && wysihtml5.hasOwnProperty('default') ? wysihtml5['default'] : wysihtml5;
  Cocktail = Cocktail && Cocktail.hasOwnProperty('default') ? Cocktail['default'] : Cocktail;

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

  /**!
   * Sortable 1.15.3
   * @author	RubaXa   <trash@rubaxa.org>
   * @author	owenm    <owen23355@gmail.com>
   * @license MIT
   */
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
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
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }
    return _typeof(obj);
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
  function _extends() {
    _extends = Object.assign || function (target) {
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

  var version = "1.15.3";

  function userAgent(pattern) {
    if (typeof window !== 'undefined' && window.navigator) {
      return !! /*@__PURE__*/navigator.userAgent.match(pattern);
    }
  }
  var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
  var Edge = userAgent(/Edge/i);
  var FireFox = userAgent(/firefox/i);
  var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
  var IOS = userAgent(/iP(ad|od|hone)/i);
  var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

  var captureMode = {
    capture: false,
    passive: false
  };
  function on(el, event, fn) {
    el.addEventListener(event, fn, !IE11OrLess && captureMode);
  }
  function off(el, event, fn) {
    el.removeEventListener(event, fn, !IE11OrLess && captureMode);
  }
  function matches( /**HTMLElement*/el, /**String*/selector) {
    if (!selector) return;
    selector[0] === '>' && (selector = selector.substring(1));
    if (el) {
      try {
        if (el.matches) {
          return el.matches(selector);
        } else if (el.msMatchesSelector) {
          return el.msMatchesSelector(selector);
        } else if (el.webkitMatchesSelector) {
          return el.webkitMatchesSelector(selector);
        }
      } catch (_) {
        return false;
      }
    }
    return false;
  }
  function getParentOrHost(el) {
    return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
  }
  function closest( /**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx, includeCTX) {
    if (el) {
      ctx = ctx || document;
      do {
        if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
          return el;
        }
        if (el === ctx) break;
        /* jshint boss:true */
      } while (el = getParentOrHost(el));
    }
    return null;
  }
  var R_SPACE = /\s+/g;
  function toggleClass(el, name, state) {
    if (el && name) {
      if (el.classList) {
        el.classList[state ? 'add' : 'remove'](name);
      } else {
        var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
        el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
      }
    }
  }
  function css(el, prop, val) {
    var style = el && el.style;
    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }
        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style) && prop.indexOf('webkit') === -1) {
          prop = '-webkit-' + prop;
        }
        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }
  function matrix(el, selfOnly) {
    var appliedTransforms = '';
    if (typeof el === 'string') {
      appliedTransforms = el;
    } else {
      do {
        var transform = css(el, 'transform');
        if (transform && transform !== 'none') {
          appliedTransforms = transform + ' ' + appliedTransforms;
        }
        /* jshint boss:true */
      } while (!selfOnly && (el = el.parentNode));
    }
    var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
    /*jshint -W056 */
    return matrixFn && new matrixFn(appliedTransforms);
  }
  function find(ctx, tagName, iterator) {
    if (ctx) {
      var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;
      if (iterator) {
        for (; i < n; i++) {
          iterator(list[i], i);
        }
      }
      return list;
    }
    return [];
  }
  function getWindowScrollingElement() {
    var scrollingElement = document.scrollingElement;
    if (scrollingElement) {
      return scrollingElement;
    } else {
      return document.documentElement;
    }
  }

  /**
   * Returns the "bounding client rect" of given element
   * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
   * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
   * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
   * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
   * @param  {[HTMLElement]} container              The parent the element will be placed in
   * @return {Object}                               The boundingClientRect of el, with specified adjustments
   */
  function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
    if (!el.getBoundingClientRect && el !== window) return;
    var elRect, top, left, bottom, right, height, width;
    if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
      elRect = el.getBoundingClientRect();
      top = elRect.top;
      left = elRect.left;
      bottom = elRect.bottom;
      right = elRect.right;
      height = elRect.height;
      width = elRect.width;
    } else {
      top = 0;
      left = 0;
      bottom = window.innerHeight;
      right = window.innerWidth;
      height = window.innerHeight;
      width = window.innerWidth;
    }
    if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
      // Adjust for translate()
      container = container || el.parentNode;

      // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
      // Not needed on <= IE11
      if (!IE11OrLess) {
        do {
          if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
            var containerRect = container.getBoundingClientRect();

            // Set relative to edges of padding box of container
            top -= containerRect.top + parseInt(css(container, 'border-top-width'));
            left -= containerRect.left + parseInt(css(container, 'border-left-width'));
            bottom = top + elRect.height;
            right = left + elRect.width;
            break;
          }
          /* jshint boss:true */
        } while (container = container.parentNode);
      }
    }
    if (undoScale && el !== window) {
      // Adjust for scale()
      var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;
      if (elMatrix) {
        top /= scaleY;
        left /= scaleX;
        width /= scaleX;
        height /= scaleY;
        bottom = top + height;
        right = left + width;
      }
    }
    return {
      top: top,
      left: left,
      bottom: bottom,
      right: right,
      width: width,
      height: height
    };
  }

  /**
   * Checks if a side of an element is scrolled past a side of its parents
   * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
   * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
   * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
   * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
   */
  function isScrolledPast(el, elSide, parentSide) {
    var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];

    /* jshint boss:true */
    while (parent) {
      var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;
      if (parentSide === 'top' || parentSide === 'left') {
        visible = elSideVal >= parentSideVal;
      } else {
        visible = elSideVal <= parentSideVal;
      }
      if (!visible) return parent;
      if (parent === getWindowScrollingElement()) break;
      parent = getParentAutoScrollElement(parent, false);
    }
    return false;
  }

  /**
   * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
   * and non-draggable elements
   * @param  {HTMLElement} el       The parent element
   * @param  {Number} childNum      The index of the child
   * @param  {Object} options       Parent Sortable's options
   * @return {HTMLElement}          The child at index childNum, or null if not found
   */
  function getChild(el, childNum, options, includeDragEl) {
    var currentChild = 0,
      i = 0,
      children = el.children;
    while (i < children.length) {
      if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
        if (currentChild === childNum) {
          return children[i];
        }
        currentChild++;
      }
      i++;
    }
    return null;
  }

  /**
   * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
   * @param  {HTMLElement} el       Parent element
   * @param  {selector} selector    Any other elements that should be ignored
   * @return {HTMLElement}          The last child, ignoring ghostEl
   */
  function lastChild(el, selector) {
    var last = el.lastElementChild;
    while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
      last = last.previousElementSibling;
    }
    return last || null;
  }

  /**
   * Returns the index of an element within its parent for a selected set of
   * elements
   * @param  {HTMLElement} el
   * @param  {selector} selector
   * @return {number}
   */
  function index(el, selector) {
    var index = 0;
    if (!el || !el.parentNode) {
      return -1;
    }

    /* jshint boss:true */
    while (el = el.previousElementSibling) {
      if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
        index++;
      }
    }
    return index;
  }

  /**
   * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
   * The value is returned in real pixels.
   * @param  {HTMLElement} el
   * @return {Array}             Offsets in the format of [left, top]
   */
  function getRelativeScrollOffset(el) {
    var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();
    if (el) {
      do {
        var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
        offsetLeft += el.scrollLeft * scaleX;
        offsetTop += el.scrollTop * scaleY;
      } while (el !== winScroller && (el = el.parentNode));
    }
    return [offsetLeft, offsetTop];
  }

  /**
   * Returns the index of the object within the given array
   * @param  {Array} arr   Array that may or may not hold the object
   * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
   * @return {Number}      The index of the object in the array, or -1
   */
  function indexOfObject(arr, obj) {
    for (var i in arr) {
      if (!arr.hasOwnProperty(i)) continue;
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
      }
    }
    return -1;
  }
  function getParentAutoScrollElement(el, includeSelf) {
    // skip to window
    if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
    var elem = el;
    var gotSelf = false;
    do {
      // we don't need to get elem css if it isn't even overflowing in the first place (performance)
      if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
        var elemCSS = css(elem);
        if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
          if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
          if (gotSelf || includeSelf) return elem;
          gotSelf = true;
        }
      }
      /* jshint boss:true */
    } while (elem = elem.parentNode);
    return getWindowScrollingElement();
  }
  function extend(dst, src) {
    if (dst && src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dst[key] = src[key];
        }
      }
    }
    return dst;
  }
  function isRectEqual(rect1, rect2) {
    return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
  }
  var _throttleTimeout;
  function throttle(callback, ms) {
    return function () {
      if (!_throttleTimeout) {
        var args = arguments,
          _this = this;
        if (args.length === 1) {
          callback.call(_this, args[0]);
        } else {
          callback.apply(_this, args);
        }
        _throttleTimeout = setTimeout(function () {
          _throttleTimeout = void 0;
        }, ms);
      }
    };
  }
  function cancelThrottle() {
    clearTimeout(_throttleTimeout);
    _throttleTimeout = void 0;
  }
  function scrollBy(el, x, y) {
    el.scrollLeft += x;
    el.scrollTop += y;
  }
  function clone(el) {
    var Polymer = window.Polymer;
    var $ = window.jQuery || window.Zepto;
    if (Polymer && Polymer.dom) {
      return Polymer.dom(el).cloneNode(true);
    } else if ($) {
      return $(el).clone(true)[0];
    } else {
      return el.cloneNode(true);
    }
  }
  function getChildContainingRectFromElement(container, options, ghostEl) {
    var rect = {};
    Array.from(container.children).forEach(function (child) {
      var _rect$left, _rect$top, _rect$right, _rect$bottom;
      if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl) return;
      var childRect = getRect(child);
      rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
      rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
      rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
      rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
    });
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }
  var expando = 'Sortable' + new Date().getTime();

  function AnimationStateManager() {
    var animationStates = [],
      animationCallbackId;
    return {
      captureAnimationState: function captureAnimationState() {
        animationStates = [];
        if (!this.options.animation) return;
        var children = [].slice.call(this.el.children);
        children.forEach(function (child) {
          if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
          animationStates.push({
            target: child,
            rect: getRect(child)
          });
          var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);

          // If animating: compensate for current animation
          if (child.thisAnimationDuration) {
            var childMatrix = matrix(child, true);
            if (childMatrix) {
              fromRect.top -= childMatrix.f;
              fromRect.left -= childMatrix.e;
            }
          }
          child.fromRect = fromRect;
        });
      },
      addAnimationState: function addAnimationState(state) {
        animationStates.push(state);
      },
      removeAnimationState: function removeAnimationState(target) {
        animationStates.splice(indexOfObject(animationStates, {
          target: target
        }), 1);
      },
      animateAll: function animateAll(callback) {
        var _this = this;
        if (!this.options.animation) {
          clearTimeout(animationCallbackId);
          if (typeof callback === 'function') callback();
          return;
        }
        var animating = false,
          animationTime = 0;
        animationStates.forEach(function (state) {
          var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);
          if (targetMatrix) {
            // Compensate for current animation
            toRect.top -= targetMatrix.f;
            toRect.left -= targetMatrix.e;
          }
          target.toRect = toRect;
          if (target.thisAnimationDuration) {
            // Could also check if animatingRect is between fromRect and toRect
            if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) &&
            // Make sure animatingRect is on line between toRect & fromRect
            (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
              // If returning to same place as started from animation and on same axis
              time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
            }
          }

          // if fromRect != toRect: animate
          if (!isRectEqual(toRect, fromRect)) {
            target.prevFromRect = fromRect;
            target.prevToRect = toRect;
            if (!time) {
              time = _this.options.animation;
            }
            _this.animate(target, animatingRect, toRect, time);
          }
          if (time) {
            animating = true;
            animationTime = Math.max(animationTime, time);
            clearTimeout(target.animationResetTimer);
            target.animationResetTimer = setTimeout(function () {
              target.animationTime = 0;
              target.prevFromRect = null;
              target.fromRect = null;
              target.prevToRect = null;
              target.thisAnimationDuration = null;
            }, time);
            target.thisAnimationDuration = time;
          }
        });
        clearTimeout(animationCallbackId);
        if (!animating) {
          if (typeof callback === 'function') callback();
        } else {
          animationCallbackId = setTimeout(function () {
            if (typeof callback === 'function') callback();
          }, animationTime);
        }
        animationStates = [];
      },
      animate: function animate(target, currentRect, toRect, duration) {
        if (duration) {
          css(target, 'transition', '');
          css(target, 'transform', '');
          var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
          target.animatingX = !!translateX;
          target.animatingY = !!translateY;
          css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
          this.forRepaintDummy = repaint(target); // repaint

          css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
          css(target, 'transform', 'translate3d(0,0,0)');
          typeof target.animated === 'number' && clearTimeout(target.animated);
          target.animated = setTimeout(function () {
            css(target, 'transition', '');
            css(target, 'transform', '');
            target.animated = false;
            target.animatingX = false;
            target.animatingY = false;
          }, duration);
        }
      }
    };
  }
  function repaint(target) {
    return target.offsetWidth;
  }
  function calculateRealTime(animatingRect, fromRect, toRect, options) {
    return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
  }

  var plugins = [];
  var defaults = {
    initializeByDefault: true
  };
  var PluginManager = {
    mount: function mount(plugin) {
      // Set default static properties
      for (var option in defaults) {
        if (defaults.hasOwnProperty(option) && !(option in plugin)) {
          plugin[option] = defaults[option];
        }
      }
      plugins.forEach(function (p) {
        if (p.pluginName === plugin.pluginName) {
          throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
        }
      });
      plugins.push(plugin);
    },
    pluginEvent: function pluginEvent(eventName, sortable, evt) {
      var _this = this;
      this.eventCanceled = false;
      evt.cancel = function () {
        _this.eventCanceled = true;
      };
      var eventNameGlobal = eventName + 'Global';
      plugins.forEach(function (plugin) {
        if (!sortable[plugin.pluginName]) return;
        // Fire global events if it exists in this sortable
        if (sortable[plugin.pluginName][eventNameGlobal]) {
          sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
            sortable: sortable
          }, evt));
        }

        // Only fire plugin event if plugin is enabled in this sortable,
        // and plugin has event defined
        if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
          sortable[plugin.pluginName][eventName](_objectSpread2({
            sortable: sortable
          }, evt));
        }
      });
    },
    initializePlugins: function initializePlugins(sortable, el, defaults, options) {
      plugins.forEach(function (plugin) {
        var pluginName = plugin.pluginName;
        if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
        var initialized = new plugin(sortable, el, sortable.options);
        initialized.sortable = sortable;
        initialized.options = sortable.options;
        sortable[pluginName] = initialized;

        // Add default options from plugin
        _extends(defaults, initialized.defaults);
      });
      for (var option in sortable.options) {
        if (!sortable.options.hasOwnProperty(option)) continue;
        var modified = this.modifyOption(sortable, option, sortable.options[option]);
        if (typeof modified !== 'undefined') {
          sortable.options[option] = modified;
        }
      }
    },
    getEventProperties: function getEventProperties(name, sortable) {
      var eventProperties = {};
      plugins.forEach(function (plugin) {
        if (typeof plugin.eventProperties !== 'function') return;
        _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
      });
      return eventProperties;
    },
    modifyOption: function modifyOption(sortable, name, value) {
      var modifiedValue;
      plugins.forEach(function (plugin) {
        // Plugin must exist on the Sortable
        if (!sortable[plugin.pluginName]) return;

        // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
        if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
          modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
        }
      });
      return modifiedValue;
    }
  };

  function dispatchEvent(_ref) {
    var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
    sortable = sortable || rootEl && rootEl[expando];
    if (!sortable) return;
    var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
    // Support for new CustomEvent feature
    if (window.CustomEvent && !IE11OrLess && !Edge) {
      evt = new CustomEvent(name, {
        bubbles: true,
        cancelable: true
      });
    } else {
      evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
    }
    evt.to = toEl || rootEl;
    evt.from = fromEl || rootEl;
    evt.item = targetEl || rootEl;
    evt.clone = cloneEl;
    evt.oldIndex = oldIndex;
    evt.newIndex = newIndex;
    evt.oldDraggableIndex = oldDraggableIndex;
    evt.newDraggableIndex = newDraggableIndex;
    evt.originalEvent = originalEvent;
    evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;
    var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
    for (var option in allEventProperties) {
      evt[option] = allEventProperties[option];
    }
    if (rootEl) {
      rootEl.dispatchEvent(evt);
    }
    if (options[onName]) {
      options[onName].call(sortable, evt);
    }
  }

  var _excluded = ["evt"];
  var pluginEvent = function pluginEvent(eventName, sortable) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, _excluded);
    PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
      dragEl: dragEl,
      parentEl: parentEl,
      ghostEl: ghostEl,
      rootEl: rootEl,
      nextEl: nextEl,
      lastDownEl: lastDownEl,
      cloneEl: cloneEl,
      cloneHidden: cloneHidden,
      dragStarted: moved,
      putSortable: putSortable,
      activeSortable: Sortable.active,
      originalEvent: originalEvent,
      oldIndex: oldIndex,
      oldDraggableIndex: oldDraggableIndex,
      newIndex: newIndex,
      newDraggableIndex: newDraggableIndex,
      hideGhostForTarget: _hideGhostForTarget,
      unhideGhostForTarget: _unhideGhostForTarget,
      cloneNowHidden: function cloneNowHidden() {
        cloneHidden = true;
      },
      cloneNowShown: function cloneNowShown() {
        cloneHidden = false;
      },
      dispatchSortableEvent: function dispatchSortableEvent(name) {
        _dispatchEvent({
          sortable: sortable,
          name: name,
          originalEvent: originalEvent
        });
      }
    }, data));
  };
  function _dispatchEvent(info) {
    dispatchEvent(_objectSpread2({
      putSortable: putSortable,
      cloneEl: cloneEl,
      targetEl: dragEl,
      rootEl: rootEl,
      oldIndex: oldIndex,
      oldDraggableIndex: oldDraggableIndex,
      newIndex: newIndex,
      newDraggableIndex: newDraggableIndex
    }, info));
  }
  var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
    ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)

    _silent = false,
    savedInputChecked = [];

  /** @const */
  var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
    supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
      if (!documentExists) return;
      // false when <= IE11
      if (IE11OrLess) {
        return false;
      }
      var el = document.createElement('x');
      el.style.cssText = 'pointer-events:auto';
      return el.style.pointerEvents === 'auto';
    }(),
    _detectDirection = function _detectDirection(el, options) {
      var elCSS = css(el),
        elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
        child1 = getChild(el, 0, options),
        child2 = getChild(el, 1, options),
        firstChildCSS = child1 && css(child1),
        secondChildCSS = child2 && css(child2),
        firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
        secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
      if (elCSS.display === 'flex') {
        return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
      }
      if (elCSS.display === 'grid') {
        return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
      }
      if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
        var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
        return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
      }
      return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
    },
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
      var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
        dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
        dragElOppLength = vertical ? dragRect.width : dragRect.height,
        targetS1Opp = vertical ? targetRect.left : targetRect.top,
        targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
        targetOppLength = vertical ? targetRect.width : targetRect.height;
      return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
    },
    /**
     * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
     * @param  {Number} x      X position
     * @param  {Number} y      Y position
     * @return {HTMLElement}   Element of the first found nearest Sortable
     */
    _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
      var ret;
      sortables.some(function (sortable) {
        var threshold = sortable[expando].options.emptyInsertThreshold;
        if (!threshold || lastChild(sortable)) return;
        var rect = getRect(sortable),
          insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
          insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
        if (insideHorizontally && insideVertically) {
          return ret = sortable;
        }
      });
      return ret;
    },
    _prepareGroup = function _prepareGroup(options) {
      function toFn(value, pull) {
        return function (to, from, dragEl, evt) {
          var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
          if (value == null && (pull || sameGroup)) {
            // Default pull value
            // Default pull and put value if same group
            return true;
          } else if (value == null || value === false) {
            return false;
          } else if (pull && value === 'clone') {
            return value;
          } else if (typeof value === 'function') {
            return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
          } else {
            var otherGroup = (pull ? to : from).options.group.name;
            return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
          }
        };
      }
      var group = {};
      var originalGroup = options.group;
      if (!originalGroup || _typeof(originalGroup) != 'object') {
        originalGroup = {
          name: originalGroup
        };
      }
      group.name = originalGroup.name;
      group.checkPull = toFn(originalGroup.pull, true);
      group.checkPut = toFn(originalGroup.put);
      group.revertClone = originalGroup.revertClone;
      options.group = group;
    },
    _hideGhostForTarget = function _hideGhostForTarget() {
      if (!supportCssPointerEvents && ghostEl) {
        css(ghostEl, 'display', 'none');
      }
    },
    _unhideGhostForTarget = function _unhideGhostForTarget() {
      if (!supportCssPointerEvents && ghostEl) {
        css(ghostEl, 'display', '');
      }
    };

  // #1184 fix - Prevent click event on fallback if dragged but item not changed position
  if (documentExists && !ChromeForAndroid) {
    document.addEventListener('click', function (evt) {
      if (ignoreNextClick) {
        evt.preventDefault();
        evt.stopPropagation && evt.stopPropagation();
        evt.stopImmediatePropagation && evt.stopImmediatePropagation();
        ignoreNextClick = false;
        return false;
      }
    }, true);
  }
  var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
    if (dragEl) {
      evt = evt.touches ? evt.touches[0] : evt;
      var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
      if (nearest) {
        // Create imitation event
        var event = {};
        for (var i in evt) {
          if (evt.hasOwnProperty(i)) {
            event[i] = evt[i];
          }
        }
        event.target = event.rootEl = nearest;
        event.preventDefault = void 0;
        event.stopPropagation = void 0;
        nearest[expando]._onDragOver(event);
      }
    }
  };
  var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
    if (dragEl) {
      dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
    }
  };

  /**
   * @class  Sortable
   * @param  {HTMLElement}  el
   * @param  {Object}       [options]
   */
  function Sortable(el, options) {
    if (!(el && el.nodeType && el.nodeType === 1)) {
      throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
    }
    this.el = el; // root element
    this.options = options = _extends({}, options);

    // Export instance
    el[expando] = this;
    var defaults = {
      group: null,
      sort: true,
      disabled: false,
      store: null,
      handle: null,
      draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
      swapThreshold: 1,
      // percentage; 0 <= x <= 1
      invertSwap: false,
      // invert always
      invertedSwapThreshold: null,
      // will be set to same as swapThreshold if default
      removeCloneOnHide: true,
      direction: function direction() {
        return _detectDirection(el, this.options);
      },
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      ignore: 'a, img',
      filter: null,
      preventOnFilter: true,
      animation: 0,
      easing: null,
      setData: function setData(dataTransfer, dragEl) {
        dataTransfer.setData('Text', dragEl.textContent);
      },
      dropBubble: false,
      dragoverBubble: false,
      dataIdAttr: 'data-id',
      delay: 0,
      delayOnTouchOnly: false,
      touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
      forceFallback: false,
      fallbackClass: 'sortable-fallback',
      fallbackOnBody: false,
      fallbackTolerance: 0,
      fallbackOffset: {
        x: 0,
        y: 0
      },
      supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari,
      emptyInsertThreshold: 5
    };
    PluginManager.initializePlugins(this, el, defaults);

    // Set default options
    for (var name in defaults) {
      !(name in options) && (options[name] = defaults[name]);
    }
    _prepareGroup(options);

    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    // Setup drag mode
    this.nativeDraggable = options.forceFallback ? false : supportDraggable;
    if (this.nativeDraggable) {
      // Touch start threshold cannot be greater than the native dragstart threshold
      this.options.touchStartThreshold = 1;
    }

    // Bind events
    if (options.supportPointer) {
      on(el, 'pointerdown', this._onTapStart);
    } else {
      on(el, 'mousedown', this._onTapStart);
      on(el, 'touchstart', this._onTapStart);
    }
    if (this.nativeDraggable) {
      on(el, 'dragover', this);
      on(el, 'dragenter', this);
    }
    sortables.push(this.el);

    // Restore sorting
    options.store && options.store.get && this.sort(options.store.get(this) || []);

    // Add animation state manager
    _extends(this, AnimationStateManager());
  }
  Sortable.prototype = /** @lends Sortable.prototype */{
    constructor: Sortable,
    _isOutsideThisEl: function _isOutsideThisEl(target) {
      if (!this.el.contains(target) && target !== this.el) {
        lastTarget = null;
      }
    },
    _getDirection: function _getDirection(evt, target) {
      return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
    },
    _onTapStart: function _onTapStart( /** Event|TouchEvent */evt) {
      if (!evt.cancelable) return;
      var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;
      _saveInputCheckedState(el);

      // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
      if (dragEl) {
        return;
      }
      if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
        return; // only left button and enabled
      }

      // cancel dnd if original target is content editable
      if (originalTarget.isContentEditable) {
        return;
      }

      // Safari ignores further event handling after mousedown
      if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
        return;
      }
      target = closest(target, options.draggable, el, false);
      if (target && target.animated) {
        return;
      }
      if (lastDownEl === target) {
        // Ignoring duplicate `down`
        return;
      }

      // Get the index of the dragged element within its parent
      oldIndex = index(target);
      oldDraggableIndex = index(target, options.draggable);

      // Check filter
      if (typeof filter === 'function') {
        if (filter.call(this, evt, target, this)) {
          _dispatchEvent({
            sortable: _this,
            rootEl: originalTarget,
            name: 'filter',
            targetEl: target,
            toEl: el,
            fromEl: el
          });
          pluginEvent('filter', _this, {
            evt: evt
          });
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return; // cancel dnd
        }
      } else if (filter) {
        filter = filter.split(',').some(function (criteria) {
          criteria = closest(originalTarget, criteria.trim(), el, false);
          if (criteria) {
            _dispatchEvent({
              sortable: _this,
              rootEl: criteria,
              name: 'filter',
              targetEl: target,
              fromEl: el,
              toEl: el
            });
            pluginEvent('filter', _this, {
              evt: evt
            });
            return true;
          }
        });
        if (filter) {
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return; // cancel dnd
        }
      }
      if (options.handle && !closest(originalTarget, options.handle, el, false)) {
        return;
      }

      // Prepare `dragstart`
      this._prepareDragStart(evt, touch, target);
    },
    _prepareDragStart: function _prepareDragStart( /** Event */evt, /** Touch */touch, /** HTMLElement */target) {
      var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;
      if (target && !dragEl && target.parentNode === el) {
        var dragRect = getRect(target);
        rootEl = el;
        dragEl = target;
        parentEl = dragEl.parentNode;
        nextEl = dragEl.nextSibling;
        lastDownEl = target;
        activeGroup = options.group;
        Sortable.dragged = dragEl;
        tapEvt = {
          target: dragEl,
          clientX: (touch || evt).clientX,
          clientY: (touch || evt).clientY
        };
        tapDistanceLeft = tapEvt.clientX - dragRect.left;
        tapDistanceTop = tapEvt.clientY - dragRect.top;
        this._lastX = (touch || evt).clientX;
        this._lastY = (touch || evt).clientY;
        dragEl.style['will-change'] = 'all';
        dragStartFn = function dragStartFn() {
          pluginEvent('delayEnded', _this, {
            evt: evt
          });
          if (Sortable.eventCanceled) {
            _this._onDrop();
            return;
          }
          // Delayed drag has been triggered
          // we can re-enable the events: touchmove/mousemove
          _this._disableDelayedDragEvents();
          if (!FireFox && _this.nativeDraggable) {
            dragEl.draggable = true;
          }

          // Bind the events: dragstart/dragend
          _this._triggerDragStart(evt, touch);

          // Drag start event
          _dispatchEvent({
            sortable: _this,
            name: 'choose',
            originalEvent: evt
          });

          // Chosen item
          toggleClass(dragEl, options.chosenClass, true);
        };

        // Disable "draggable"
        options.ignore.split(',').forEach(function (criteria) {
          find(dragEl, criteria.trim(), _disableDraggable);
        });
        on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
        on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
        on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
        on(ownerDocument, 'mouseup', _this._onDrop);
        on(ownerDocument, 'touchend', _this._onDrop);
        on(ownerDocument, 'touchcancel', _this._onDrop);

        // Make dragEl draggable (must be before delay for FireFox)
        if (FireFox && this.nativeDraggable) {
          this.options.touchStartThreshold = 4;
          dragEl.draggable = true;
        }
        pluginEvent('delayStart', this, {
          evt: evt
        });

        // Delay is impossible for native DnD in Edge or IE
        if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
          if (Sortable.eventCanceled) {
            this._onDrop();
            return;
          }
          // If the user moves the pointer or let go the click or touch
          // before the delay has been reached:
          // disable the delayed drag
          on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
          on(ownerDocument, 'touchend', _this._disableDelayedDrag);
          on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
          on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
          on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
          options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
          _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
        } else {
          dragStartFn();
        }
      }
    },
    _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler( /** TouchEvent|PointerEvent **/e) {
      var touch = e.touches ? e.touches[0] : e;
      if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
        this._disableDelayedDrag();
      }
    },
    _disableDelayedDrag: function _disableDelayedDrag() {
      dragEl && _disableDraggable(dragEl);
      clearTimeout(this._dragStartTimer);
      this._disableDelayedDragEvents();
    },
    _disableDelayedDragEvents: function _disableDelayedDragEvents() {
      var ownerDocument = this.el.ownerDocument;
      off(ownerDocument, 'mouseup', this._disableDelayedDrag);
      off(ownerDocument, 'touchend', this._disableDelayedDrag);
      off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
      off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
      off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
      off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
    },
    _triggerDragStart: function _triggerDragStart( /** Event */evt, /** Touch */touch) {
      touch = touch || evt.pointerType == 'touch' && evt;
      if (!this.nativeDraggable || touch) {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._onTouchMove);
        } else if (touch) {
          on(document, 'touchmove', this._onTouchMove);
        } else {
          on(document, 'mousemove', this._onTouchMove);
        }
      } else {
        on(dragEl, 'dragend', this);
        on(rootEl, 'dragstart', this._onDragStart);
      }
      try {
        if (document.selection) {
          // Timeout neccessary for IE9
          _nextTick(function () {
            document.selection.empty();
          });
        } else {
          window.getSelection().removeAllRanges();
        }
      } catch (err) {}
    },
    _dragStarted: function _dragStarted(fallback, evt) {
      awaitingDragStarted = false;
      if (rootEl && dragEl) {
        pluginEvent('dragStarted', this, {
          evt: evt
        });
        if (this.nativeDraggable) {
          on(document, 'dragover', _checkOutsideTargetEl);
        }
        var options = this.options;

        // Apply effect
        !fallback && toggleClass(dragEl, options.dragClass, false);
        toggleClass(dragEl, options.ghostClass, true);
        Sortable.active = this;
        fallback && this._appendGhost();

        // Drag start event
        _dispatchEvent({
          sortable: this,
          name: 'start',
          originalEvent: evt
        });
      } else {
        this._nulling();
      }
    },
    _emulateDragOver: function _emulateDragOver() {
      if (touchEvt) {
        this._lastX = touchEvt.clientX;
        this._lastY = touchEvt.clientY;
        _hideGhostForTarget();
        var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        var parent = target;
        while (target && target.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
          if (target === parent) break;
          parent = target;
        }
        dragEl.parentNode[expando]._isOutsideThisEl(target);
        if (parent) {
          do {
            if (parent[expando]) {
              var inserted = void 0;
              inserted = parent[expando]._onDragOver({
                clientX: touchEvt.clientX,
                clientY: touchEvt.clientY,
                target: target,
                rootEl: parent
              });
              if (inserted && !this.options.dragoverBubble) {
                break;
              }
            }
            target = parent; // store last element
          }
          /* jshint boss:true */ while (parent = getParentOrHost(parent));
        }
        _unhideGhostForTarget();
      }
    },
    _onTouchMove: function _onTouchMove( /**TouchEvent*/evt) {
      if (tapEvt) {
        var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);

        // only set the status to dragging, when we are actually dragging
        if (!Sortable.active && !awaitingDragStarted) {
          if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
            return;
          }
          this._onDragStart(evt, true);
        }
        if (ghostEl) {
          if (ghostMatrix) {
            ghostMatrix.e += dx - (lastDx || 0);
            ghostMatrix.f += dy - (lastDy || 0);
          } else {
            ghostMatrix = {
              a: 1,
              b: 0,
              c: 0,
              d: 1,
              e: dx,
              f: dy
            };
          }
          var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
          css(ghostEl, 'webkitTransform', cssMatrix);
          css(ghostEl, 'mozTransform', cssMatrix);
          css(ghostEl, 'msTransform', cssMatrix);
          css(ghostEl, 'transform', cssMatrix);
          lastDx = dx;
          lastDy = dy;
          touchEvt = touch;
        }
        evt.cancelable && evt.preventDefault();
      }
    },
    _appendGhost: function _appendGhost() {
      // Bug if using scale(): https://stackoverflow.com/questions/2637058
      // Not being adjusted for
      if (!ghostEl) {
        var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options;

        // Position absolutely
        if (PositionGhostAbsolutely) {
          // Get relatively positioned parent
          ghostRelativeParent = container;
          while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
            ghostRelativeParent = ghostRelativeParent.parentNode;
          }
          if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
            if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
            rect.top += ghostRelativeParent.scrollTop;
            rect.left += ghostRelativeParent.scrollLeft;
          } else {
            ghostRelativeParent = getWindowScrollingElement();
          }
          ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
        }
        ghostEl = dragEl.cloneNode(true);
        toggleClass(ghostEl, options.ghostClass, false);
        toggleClass(ghostEl, options.fallbackClass, true);
        toggleClass(ghostEl, options.dragClass, true);
        css(ghostEl, 'transition', '');
        css(ghostEl, 'transform', '');
        css(ghostEl, 'box-sizing', 'border-box');
        css(ghostEl, 'margin', 0);
        css(ghostEl, 'top', rect.top);
        css(ghostEl, 'left', rect.left);
        css(ghostEl, 'width', rect.width);
        css(ghostEl, 'height', rect.height);
        css(ghostEl, 'opacity', '0.8');
        css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
        css(ghostEl, 'zIndex', '100000');
        css(ghostEl, 'pointerEvents', 'none');
        Sortable.ghost = ghostEl;
        container.appendChild(ghostEl);

        // Set transform-origin
        css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
      }
    },
    _onDragStart: function _onDragStart( /**Event*/evt, /**boolean*/fallback) {
      var _this = this;
      var dataTransfer = evt.dataTransfer;
      var options = _this.options;
      pluginEvent('dragStart', this, {
        evt: evt
      });
      if (Sortable.eventCanceled) {
        this._onDrop();
        return;
      }
      pluginEvent('setupClone', this);
      if (!Sortable.eventCanceled) {
        cloneEl = clone(dragEl);
        cloneEl.removeAttribute("id");
        cloneEl.draggable = false;
        cloneEl.style['will-change'] = '';
        this._hideClone();
        toggleClass(cloneEl, this.options.chosenClass, false);
        Sortable.clone = cloneEl;
      }

      // #1143: IFrame support workaround
      _this.cloneId = _nextTick(function () {
        pluginEvent('clone', _this);
        if (Sortable.eventCanceled) return;
        if (!_this.options.removeCloneOnHide) {
          rootEl.insertBefore(cloneEl, dragEl);
        }
        _this._hideClone();
        _dispatchEvent({
          sortable: _this,
          name: 'clone'
        });
      });
      !fallback && toggleClass(dragEl, options.dragClass, true);

      // Set proper drop events
      if (fallback) {
        ignoreNextClick = true;
        _this._loopId = setInterval(_this._emulateDragOver, 50);
      } else {
        // Undo what was set in _prepareDragStart before drag started
        off(document, 'mouseup', _this._onDrop);
        off(document, 'touchend', _this._onDrop);
        off(document, 'touchcancel', _this._onDrop);
        if (dataTransfer) {
          dataTransfer.effectAllowed = 'move';
          options.setData && options.setData.call(_this, dataTransfer, dragEl);
        }
        on(document, 'drop', _this);

        // #1276 fix:
        css(dragEl, 'transform', 'translateZ(0)');
      }
      awaitingDragStarted = true;
      _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
      on(document, 'selectstart', _this);
      moved = true;
      if (Safari) {
        css(document.body, 'user-select', 'none');
      }
    },
    // Returns true - if no further action is needed (either inserted or another condition)
    _onDragOver: function _onDragOver( /**Event*/evt) {
      var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;
      if (_silent) return;
      function dragOverEvent(name, extra) {
        pluginEvent(name, _this, _objectSpread2({
          evt: evt,
          isOwner: isOwner,
          axis: vertical ? 'vertical' : 'horizontal',
          revert: revert,
          dragRect: dragRect,
          targetRect: targetRect,
          canSort: canSort,
          fromSortable: fromSortable,
          target: target,
          completed: completed,
          onMove: function onMove(target, after) {
            return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
          },
          changed: changed
        }, extra));
      }

      // Capture animation state
      function capture() {
        dragOverEvent('dragOverAnimationCapture');
        _this.captureAnimationState();
        if (_this !== fromSortable) {
          fromSortable.captureAnimationState();
        }
      }

      // Return invocation when dragEl is inserted (or completed)
      function completed(insertion) {
        dragOverEvent('dragOverCompleted', {
          insertion: insertion
        });
        if (insertion) {
          // Clones must be hidden before folding animation to capture dragRectAbsolute properly
          if (isOwner) {
            activeSortable._hideClone();
          } else {
            activeSortable._showClone(_this);
          }
          if (_this !== fromSortable) {
            // Set ghost class to new sortable's ghost class
            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
            toggleClass(dragEl, options.ghostClass, true);
          }
          if (putSortable !== _this && _this !== Sortable.active) {
            putSortable = _this;
          } else if (_this === Sortable.active && putSortable) {
            putSortable = null;
          }

          // Animation
          if (fromSortable === _this) {
            _this._ignoreWhileAnimating = target;
          }
          _this.animateAll(function () {
            dragOverEvent('dragOverAnimationComplete');
            _this._ignoreWhileAnimating = null;
          });
          if (_this !== fromSortable) {
            fromSortable.animateAll();
            fromSortable._ignoreWhileAnimating = null;
          }
        }

        // Null lastTarget if it is not inside a previously swapped element
        if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
          lastTarget = null;
        }

        // no bubbling and not fallback
        if (!options.dragoverBubble && !evt.rootEl && target !== document) {
          dragEl.parentNode[expando]._isOutsideThisEl(evt.target);

          // Do not detect for empty insert if already inserted
          !insertion && nearestEmptyInsertDetectEvent(evt);
        }
        !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
        return completedFired = true;
      }

      // Call when dragEl has been inserted
      function changed() {
        newIndex = index(dragEl);
        newDraggableIndex = index(dragEl, options.draggable);
        _dispatchEvent({
          sortable: _this,
          name: 'change',
          toEl: el,
          newIndex: newIndex,
          newDraggableIndex: newDraggableIndex,
          originalEvent: evt
        });
      }
      if (evt.preventDefault !== void 0) {
        evt.cancelable && evt.preventDefault();
      }
      target = closest(target, options.draggable, el, true);
      dragOverEvent('dragOver');
      if (Sortable.eventCanceled) return completedFired;
      if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
        return completed(false);
      }
      ignoreNextClick = false;
      if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
      : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
        vertical = this._getDirection(evt, target) === 'vertical';
        dragRect = getRect(dragEl);
        dragOverEvent('dragOverValid');
        if (Sortable.eventCanceled) return completedFired;
        if (revert) {
          parentEl = rootEl; // actualization
          capture();
          this._hideClone();
          dragOverEvent('revert');
          if (!Sortable.eventCanceled) {
            if (nextEl) {
              rootEl.insertBefore(dragEl, nextEl);
            } else {
              rootEl.appendChild(dragEl);
            }
          }
          return completed(true);
        }
        var elLastChild = lastChild(el, options.draggable);
        if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
          // Insert to end of list

          // If already at end of list: Do not insert
          if (elLastChild === dragEl) {
            return completed(false);
          }

          // if there is a last element, it is the target
          if (elLastChild && el === evt.target) {
            target = elLastChild;
          }
          if (target) {
            targetRect = getRect(target);
          }
          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
            capture();
            if (elLastChild && elLastChild.nextSibling) {
              // the last draggable element is not the last node
              el.insertBefore(dragEl, elLastChild.nextSibling);
            } else {
              el.appendChild(dragEl);
            }
            parentEl = el; // actualization

            changed();
            return completed(true);
          }
        } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
          // Insert to start of list
          var firstChild = getChild(el, 0, options, true);
          if (firstChild === dragEl) {
            return completed(false);
          }
          target = firstChild;
          targetRect = getRect(target);
          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
            capture();
            el.insertBefore(dragEl, firstChild);
            parentEl = el; // actualization

            changed();
            return completed(true);
          }
        } else if (target.parentNode === el) {
          targetRect = getRect(target);
          var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
          if (lastTarget !== target) {
            targetBeforeFirstSwap = targetRect[side1];
            pastFirstInvertThresh = false;
            isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
          }
          direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
          var sibling;
          if (direction !== 0) {
            // Check if target is beside dragEl in respective direction (ignoring hidden elements)
            var dragIndex = index(dragEl);
            do {
              dragIndex -= direction;
              sibling = parentEl.children[dragIndex];
            } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
          }
          // If dragEl is already beside target: Do not insert
          if (direction === 0 || sibling === target) {
            return completed(false);
          }
          lastTarget = target;
          lastDirection = direction;
          var nextSibling = target.nextElementSibling,
            after = false;
          after = direction === 1;
          var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
          if (moveVector !== false) {
            if (moveVector === 1 || moveVector === -1) {
              after = moveVector === 1;
            }
            _silent = true;
            setTimeout(_unsilent, 30);
            capture();
            if (after && !nextSibling) {
              el.appendChild(dragEl);
            } else {
              target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
            }

            // Undo chrome's scroll adjustment (has no effect on other browsers)
            if (scrolledPastTop) {
              scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
            }
            parentEl = dragEl.parentNode; // actualization

            // must be done before animation
            if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
              targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
            }
            changed();
            return completed(true);
          }
        }
        if (el.contains(dragEl)) {
          return completed(false);
        }
      }
      return false;
    },
    _ignoreWhileAnimating: null,
    _offMoveEvents: function _offMoveEvents() {
      off(document, 'mousemove', this._onTouchMove);
      off(document, 'touchmove', this._onTouchMove);
      off(document, 'pointermove', this._onTouchMove);
      off(document, 'dragover', nearestEmptyInsertDetectEvent);
      off(document, 'mousemove', nearestEmptyInsertDetectEvent);
      off(document, 'touchmove', nearestEmptyInsertDetectEvent);
    },
    _offUpEvents: function _offUpEvents() {
      var ownerDocument = this.el.ownerDocument;
      off(ownerDocument, 'mouseup', this._onDrop);
      off(ownerDocument, 'touchend', this._onDrop);
      off(ownerDocument, 'pointerup', this._onDrop);
      off(ownerDocument, 'touchcancel', this._onDrop);
      off(document, 'selectstart', this);
    },
    _onDrop: function _onDrop( /**Event*/evt) {
      var el = this.el,
        options = this.options;

      // Get the index of the dragged element within its parent
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      pluginEvent('drop', this, {
        evt: evt
      });
      parentEl = dragEl && dragEl.parentNode;

      // Get again after plugin event
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      if (Sortable.eventCanceled) {
        this._nulling();
        return;
      }
      awaitingDragStarted = false;
      isCircumstantialInvert = false;
      pastFirstInvertThresh = false;
      clearInterval(this._loopId);
      clearTimeout(this._dragStartTimer);
      _cancelNextTick(this.cloneId);
      _cancelNextTick(this._dragStartId);

      // Unbind events
      if (this.nativeDraggable) {
        off(document, 'drop', this);
        off(el, 'dragstart', this._onDragStart);
      }
      this._offMoveEvents();
      this._offUpEvents();
      if (Safari) {
        css(document.body, 'user-select', '');
      }
      css(dragEl, 'transform', '');
      if (evt) {
        if (moved) {
          evt.cancelable && evt.preventDefault();
          !options.dropBubble && evt.stopPropagation();
        }
        ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
        if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
          // Remove clone(s)
          cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
        }
        if (dragEl) {
          if (this.nativeDraggable) {
            off(dragEl, 'dragend', this);
          }
          _disableDraggable(dragEl);
          dragEl.style['will-change'] = '';

          // Remove classes
          // ghostClass is added in dragStarted
          if (moved && !awaitingDragStarted) {
            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
          }
          toggleClass(dragEl, this.options.chosenClass, false);

          // Drag stop event
          _dispatchEvent({
            sortable: this,
            name: 'unchoose',
            toEl: parentEl,
            newIndex: null,
            newDraggableIndex: null,
            originalEvent: evt
          });
          if (rootEl !== parentEl) {
            if (newIndex >= 0) {
              // Add event
              _dispatchEvent({
                rootEl: parentEl,
                name: 'add',
                toEl: parentEl,
                fromEl: rootEl,
                originalEvent: evt
              });

              // Remove event
              _dispatchEvent({
                sortable: this,
                name: 'remove',
                toEl: parentEl,
                originalEvent: evt
              });

              // drag from one list and drop into another
              _dispatchEvent({
                rootEl: parentEl,
                name: 'sort',
                toEl: parentEl,
                fromEl: rootEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
            putSortable && putSortable.save();
          } else {
            if (newIndex !== oldIndex) {
              if (newIndex >= 0) {
                // drag & drop within the same list
                _dispatchEvent({
                  sortable: this,
                  name: 'update',
                  toEl: parentEl,
                  originalEvent: evt
                });
                _dispatchEvent({
                  sortable: this,
                  name: 'sort',
                  toEl: parentEl,
                  originalEvent: evt
                });
              }
            }
          }
          if (Sortable.active) {
            /* jshint eqnull:true */
            if (newIndex == null || newIndex === -1) {
              newIndex = oldIndex;
              newDraggableIndex = oldDraggableIndex;
            }
            _dispatchEvent({
              sortable: this,
              name: 'end',
              toEl: parentEl,
              originalEvent: evt
            });

            // Save sorting
            this.save();
          }
        }
      }
      this._nulling();
    },
    _nulling: function _nulling() {
      pluginEvent('nulling', this);
      rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
      savedInputChecked.forEach(function (el) {
        el.checked = true;
      });
      savedInputChecked.length = lastDx = lastDy = 0;
    },
    handleEvent: function handleEvent( /**Event*/evt) {
      switch (evt.type) {
        case 'drop':
        case 'dragend':
          this._onDrop(evt);
          break;
        case 'dragenter':
        case 'dragover':
          if (dragEl) {
            this._onDragOver(evt);
            _globalDragOver(evt);
          }
          break;
        case 'selectstart':
          evt.preventDefault();
          break;
      }
    },
    /**
     * Serializes the item into an array of string.
     * @returns {String[]}
     */
    toArray: function toArray() {
      var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;
      for (; i < n; i++) {
        el = children[i];
        if (closest(el, options.draggable, this.el, false)) {
          order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
        }
      }
      return order;
    },
    /**
     * Sorts the elements according to the array.
     * @param  {String[]}  order  order of the items
     */
    sort: function sort(order, useAnimation) {
      var items = {},
        rootEl = this.el;
      this.toArray().forEach(function (id, i) {
        var el = rootEl.children[i];
        if (closest(el, this.options.draggable, rootEl, false)) {
          items[id] = el;
        }
      }, this);
      useAnimation && this.captureAnimationState();
      order.forEach(function (id) {
        if (items[id]) {
          rootEl.removeChild(items[id]);
          rootEl.appendChild(items[id]);
        }
      });
      useAnimation && this.animateAll();
    },
    /**
     * Save the current sorting
     */
    save: function save() {
      var store = this.options.store;
      store && store.set && store.set(this);
    },
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @param   {HTMLElement}  el
     * @param   {String}       [selector]  default: `options.draggable`
     * @returns {HTMLElement|null}
     */
    closest: function closest$1(el, selector) {
      return closest(el, selector || this.options.draggable, this.el, false);
    },
    /**
     * Set/get option
     * @param   {string} name
     * @param   {*}      [value]
     * @returns {*}
     */
    option: function option(name, value) {
      var options = this.options;
      if (value === void 0) {
        return options[name];
      } else {
        var modifiedValue = PluginManager.modifyOption(this, name, value);
        if (typeof modifiedValue !== 'undefined') {
          options[name] = modifiedValue;
        } else {
          options[name] = value;
        }
        if (name === 'group') {
          _prepareGroup(options);
        }
      }
    },
    /**
     * Destroy
     */
    destroy: function destroy() {
      pluginEvent('destroy', this);
      var el = this.el;
      el[expando] = null;
      off(el, 'mousedown', this._onTapStart);
      off(el, 'touchstart', this._onTapStart);
      off(el, 'pointerdown', this._onTapStart);
      if (this.nativeDraggable) {
        off(el, 'dragover', this);
        off(el, 'dragenter', this);
      }
      // Remove draggable attributes
      Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
        el.removeAttribute('draggable');
      });
      this._onDrop();
      this._disableDelayedDragEvents();
      sortables.splice(sortables.indexOf(this.el), 1);
      this.el = el = null;
    },
    _hideClone: function _hideClone() {
      if (!cloneHidden) {
        pluginEvent('hideClone', this);
        if (Sortable.eventCanceled) return;
        css(cloneEl, 'display', 'none');
        if (this.options.removeCloneOnHide && cloneEl.parentNode) {
          cloneEl.parentNode.removeChild(cloneEl);
        }
        cloneHidden = true;
      }
    },
    _showClone: function _showClone(putSortable) {
      if (putSortable.lastPutMode !== 'clone') {
        this._hideClone();
        return;
      }
      if (cloneHidden) {
        pluginEvent('showClone', this);
        if (Sortable.eventCanceled) return;

        // show clone at dragEl or original position
        if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
          rootEl.insertBefore(cloneEl, dragEl);
        } else if (nextEl) {
          rootEl.insertBefore(cloneEl, nextEl);
        } else {
          rootEl.appendChild(cloneEl);
        }
        if (this.options.group.revertClone) {
          this.animate(dragEl, cloneEl);
        }
        css(cloneEl, 'display', '');
        cloneHidden = false;
      }
    }
  };
  function _globalDragOver( /**Event*/evt) {
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'move';
    }
    evt.cancelable && evt.preventDefault();
  }
  function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
    var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal;
    // Support for new CustomEvent feature
    if (window.CustomEvent && !IE11OrLess && !Edge) {
      evt = new CustomEvent('move', {
        bubbles: true,
        cancelable: true
      });
    } else {
      evt = document.createEvent('Event');
      evt.initEvent('move', true, true);
    }
    evt.to = toEl;
    evt.from = fromEl;
    evt.dragged = dragEl;
    evt.draggedRect = dragRect;
    evt.related = targetEl || toEl;
    evt.relatedRect = targetRect || getRect(toEl);
    evt.willInsertAfter = willInsertAfter;
    evt.originalEvent = originalEvent;
    fromEl.dispatchEvent(evt);
    if (onMoveFn) {
      retVal = onMoveFn.call(sortable, evt, originalEvent);
    }
    return retVal;
  }
  function _disableDraggable(el) {
    el.draggable = false;
  }
  function _unsilent() {
    _silent = false;
  }
  function _ghostIsFirst(evt, vertical, sortable) {
    var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
    var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
    var spacer = 10;
    return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
  }
  function _ghostIsLast(evt, vertical, sortable) {
    var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
    var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
    var spacer = 10;
    return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
  }
  function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
    var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;
    if (!invertSwap) {
      // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
      if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
        // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
        // check if past first invert threshold on side opposite of lastDirection
        if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
          // past first invert threshold, do not restrict inverted threshold to dragEl shadow
          pastFirstInvertThresh = true;
        }
        if (!pastFirstInvertThresh) {
          // dragEl shadow (target move distance shadow)
          if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
          : mouseOnAxis > targetS2 - targetMoveDistance) {
            return -lastDirection;
          }
        } else {
          invert = true;
        }
      } else {
        // Regular
        if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
          return _getInsertDirection(target);
        }
      }
    }
    invert = invert || invertSwap;
    if (invert) {
      // Invert of regular
      if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
        return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
      }
    }
    return 0;
  }

  /**
   * Gets the direction dragEl must be swapped relative to target in order to make it
   * seem that dragEl has been "inserted" into that element's position
   * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
   * @return {Number}                   Direction dragEl must be swapped
   */
  function _getInsertDirection(target) {
    if (index(dragEl) < index(target)) {
      return 1;
    } else {
      return -1;
    }
  }

  /**
   * Generate id
   * @param   {HTMLElement} el
   * @returns {String}
   * @private
   */
  function _generateId(el) {
    var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;
    while (i--) {
      sum += str.charCodeAt(i);
    }
    return sum.toString(36);
  }
  function _saveInputCheckedState(root) {
    savedInputChecked.length = 0;
    var inputs = root.getElementsByTagName('input');
    var idx = inputs.length;
    while (idx--) {
      var el = inputs[idx];
      el.checked && savedInputChecked.push(el);
    }
  }
  function _nextTick(fn) {
    return setTimeout(fn, 0);
  }
  function _cancelNextTick(id) {
    return clearTimeout(id);
  }

  // Fixed #973:
  if (documentExists) {
    on(document, 'touchmove', function (evt) {
      if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
        evt.preventDefault();
      }
    });
  }

  // Export utils
  Sortable.utils = {
    on: on,
    off: off,
    css: css,
    find: find,
    is: function is(el, selector) {
      return !!closest(el, selector, el, false);
    },
    extend: extend,
    throttle: throttle,
    closest: closest,
    toggleClass: toggleClass,
    clone: clone,
    index: index,
    nextTick: _nextTick,
    cancelNextTick: _cancelNextTick,
    detectDirection: _detectDirection,
    getChild: getChild,
    expando: expando
  };

  /**
   * Get the Sortable instance of an element
   * @param  {HTMLElement} element The element
   * @return {Sortable|undefined}         The instance of Sortable
   */
  Sortable.get = function (element) {
    return element[expando];
  };

  /**
   * Mount a plugin to Sortable
   * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
   */
  Sortable.mount = function () {
    for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins[_key] = arguments[_key];
    }
    if (plugins[0].constructor === Array) plugins = plugins[0];
    plugins.forEach(function (plugin) {
      if (!plugin.prototype || !plugin.prototype.constructor) {
        throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
      }
      if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
      PluginManager.mount(plugin);
    });
  };

  /**
   * Create sortable instance
   * @param {HTMLElement}  el
   * @param {Object}      [options]
   */
  Sortable.create = function (el, options) {
    return new Sortable(el, options);
  };

  // Export
  Sortable.version = version;

  var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;
  function AutoScrollPlugin() {
    function AutoScroll() {
      this.defaults = {
        scroll: true,
        forceAutoScrollFallback: false,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        bubbleScroll: true
      };

      // Bind all private methods
      for (var fn in this) {
        if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
          this[fn] = this[fn].bind(this);
        }
      }
    }
    AutoScroll.prototype = {
      dragStarted: function dragStarted(_ref) {
        var originalEvent = _ref.originalEvent;
        if (this.sortable.nativeDraggable) {
          on(document, 'dragover', this._handleAutoScroll);
        } else {
          if (this.options.supportPointer) {
            on(document, 'pointermove', this._handleFallbackAutoScroll);
          } else if (originalEvent.touches) {
            on(document, 'touchmove', this._handleFallbackAutoScroll);
          } else {
            on(document, 'mousemove', this._handleFallbackAutoScroll);
          }
        }
      },
      dragOverCompleted: function dragOverCompleted(_ref2) {
        var originalEvent = _ref2.originalEvent;
        // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
        if (!this.options.dragOverBubble && !originalEvent.rootEl) {
          this._handleAutoScroll(originalEvent);
        }
      },
      drop: function drop() {
        if (this.sortable.nativeDraggable) {
          off(document, 'dragover', this._handleAutoScroll);
        } else {
          off(document, 'pointermove', this._handleFallbackAutoScroll);
          off(document, 'touchmove', this._handleFallbackAutoScroll);
          off(document, 'mousemove', this._handleFallbackAutoScroll);
        }
        clearPointerElemChangedInterval();
        clearAutoScrolls();
        cancelThrottle();
      },
      nulling: function nulling() {
        touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
        autoScrolls.length = 0;
      },
      _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
        this._handleAutoScroll(evt, true);
      },
      _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
        var _this = this;
        var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
        touchEvt$1 = evt;

        // IE does not seem to have native autoscroll,
        // Edge's autoscroll seems too conditional,
        // MACOS Safari does not have autoscroll,
        // Firefox and Chrome are good
        if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
          autoScroll(evt, this.options, elem, fallback);

          // Listener for pointer element change
          var ogElemScroller = getParentAutoScrollElement(elem, true);
          if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
            pointerElemChangedInterval && clearPointerElemChangedInterval();
            // Detect for pointer elem change, emulating native DnD behaviour
            pointerElemChangedInterval = setInterval(function () {
              var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
              if (newElem !== ogElemScroller) {
                ogElemScroller = newElem;
                clearAutoScrolls();
              }
              autoScroll(evt, _this.options, newElem, fallback);
            }, 10);
            lastAutoScrollX = x;
            lastAutoScrollY = y;
          }
        } else {
          // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
          if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
            clearAutoScrolls();
            return;
          }
          autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
        }
      }
    };
    return _extends(AutoScroll, {
      pluginName: 'scroll',
      initializeByDefault: true
    });
  }
  function clearAutoScrolls() {
    autoScrolls.forEach(function (autoScroll) {
      clearInterval(autoScroll.pid);
    });
    autoScrolls = [];
  }
  function clearPointerElemChangedInterval() {
    clearInterval(pointerElemChangedInterval);
  }
  var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
    // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    if (!options.scroll) return;
    var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
    var scrollThisInstance = false,
      scrollCustomFn;

    // New scroll root, set scrollEl
    if (scrollRootEl !== rootEl) {
      scrollRootEl = rootEl;
      clearAutoScrolls();
      scrollEl = options.scroll;
      scrollCustomFn = options.scrollFn;
      if (scrollEl === true) {
        scrollEl = getParentAutoScrollElement(rootEl, true);
      }
    }
    var layersOut = 0;
    var currentParent = scrollEl;
    do {
      var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;
      if (el === winScroller) {
        canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
        canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
      } else {
        canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
        canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
      }
      var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
      var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
      if (!autoScrolls[layersOut]) {
        for (var i = 0; i <= layersOut; i++) {
          if (!autoScrolls[i]) {
            autoScrolls[i] = {};
          }
        }
      }
      if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
        autoScrolls[layersOut].el = el;
        autoScrolls[layersOut].vx = vx;
        autoScrolls[layersOut].vy = vy;
        clearInterval(autoScrolls[layersOut].pid);
        if (vx != 0 || vy != 0) {
          scrollThisInstance = true;
          /* jshint loopfunc:true */
          autoScrolls[layersOut].pid = setInterval(function () {
            // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
            if (isFallback && this.layer === 0) {
              Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely
            }
            var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
            var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
            if (typeof scrollCustomFn === 'function') {
              if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
                return;
              }
            }
            scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
          }.bind({
            layer: layersOut
          }), 24);
        }
      }
      layersOut++;
    } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
    scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
  }, 30);

  var drop = function drop(_ref) {
    var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
    if (!originalEvent) return;
    var toSortable = putSortable || activeSortable;
    hideGhostForTarget();
    var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
    var target = document.elementFromPoint(touch.clientX, touch.clientY);
    unhideGhostForTarget();
    if (toSortable && !toSortable.el.contains(target)) {
      dispatchSortableEvent('spill');
      this.onSpill({
        dragEl: dragEl,
        putSortable: putSortable
      });
    }
  };
  function Revert() {}
  Revert.prototype = {
    startIndex: null,
    dragStart: function dragStart(_ref2) {
      var oldDraggableIndex = _ref2.oldDraggableIndex;
      this.startIndex = oldDraggableIndex;
    },
    onSpill: function onSpill(_ref3) {
      var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
      this.sortable.captureAnimationState();
      if (putSortable) {
        putSortable.captureAnimationState();
      }
      var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
      if (nextSibling) {
        this.sortable.el.insertBefore(dragEl, nextSibling);
      } else {
        this.sortable.el.appendChild(dragEl);
      }
      this.sortable.animateAll();
      if (putSortable) {
        putSortable.animateAll();
      }
    },
    drop: drop
  };
  _extends(Revert, {
    pluginName: 'revertOnSpill'
  });
  function Remove() {}
  Remove.prototype = {
    onSpill: function onSpill(_ref4) {
      var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
      var parentSortable = putSortable || this.sortable;
      parentSortable.captureAnimationState();
      dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
      parentSortable.animateAll();
    },
    drop: drop
  };
  _extends(Remove, {
    pluginName: 'removeOnSpill'
  });

  Sortable.mount(new AutoScrollPlugin());
  Sortable.mount(Remove, Revert);

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

  function _objectWithoutPropertiesLoose$1(source, excluded) {
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

  function _objectWithoutProperties$1(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$1(source, excluded);
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

  var _excluded$1 = ["ignoreUndefined"];
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
        options = _objectWithoutProperties$1(_ref, _excluded$1);
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

  function _defineProperty$1(obj, key, value) {
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

  function ownKeys$1(object, enumerableOnly) {
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

  function _objectSpread2$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$1(Object(source), true).forEach(function (key) {
          _defineProperty$1(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(Object(source)).forEach(function (key) {
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
  var inputView = _objectSpread2$1(_objectSpread2$1({}, attributeBinding), {}, {
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
        _this2.model.set(_defineProperty$1(_defineProperty$1({}, _this2.options.displayPropertyName, value), _this2.options.propertyName, transformedValue));
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

  exports.CheckBoxGroupInputView = CheckBoxGroupInputView;
  exports.CheckBoxInputView = CheckBoxInputView;
  exports.CollectionView = CollectionView;
  exports.ColorInputView = ColorInputView;
  exports.ConfigurationEditorTabView = ConfigurationEditorTabView;
  exports.ConfigurationEditorView = ConfigurationEditorView;
  exports.DeleteRowTableCellView = DeleteRowTableCellView;
  exports.EnumTableCellView = EnumTableCellView;
  exports.ExtendedSelectInputView = ExtendedSelectInputView;
  exports.FileNameInputView = FileNameInputView;
  exports.IconTableCellView = IconTableCellView;
  exports.JsonInputView = JsonInputView;
  exports.LabelOnlyView = LabelOnlyView;
  exports.NumberInputView = NumberInputView;
  exports.Object = BaseObject;
  exports.PresenceTableCellView = PresenceTableCellView;
  exports.ProxyUrlInputView = ProxyUrlInputView;
  exports.SelectInputView = SelectInputView;
  exports.SeparatorView = SeparatorView;
  exports.SliderInputView = SliderInputView;
  exports.SortableCollectionView = SortableCollectionView;
  exports.TableCellView = TableCellView;
  exports.TableHeaderCellView = TableHeaderCellView;
  exports.TableRowView = TableRowView;
  exports.TableView = TableView;
  exports.TabsView = TabsView;
  exports.TextAreaInputView = TextAreaInputView;
  exports.TextInputView = TextInputView;
  exports.TextTableCellView = TextTableCellView;
  exports.TooltipView = TooltipView;
  exports.UrlDisplayView = UrlDisplayView;
  exports.UrlInputView = UrlInputView;
  exports.attributeBinding = attributeBinding;
  exports.cssModulesUtils = cssModulesUtils;
  exports.i18nUtils = i18nUtils;
  exports.inputView = inputView;
  exports.inputWithPlaceholderText = inputWithPlaceholderText;
  exports.serverSideValidation = serverSideValidation;
  exports.subviewContainer = subviewContainer;
  exports.tooltipContainer = tooltipContainer;
  exports.viewWithValidationErrorMessages = viewWithValidationErrorMessages;

  return exports;

}({}, Backbone.Marionette, _, jQuery, I18n, Backbone, Backbone.ChildViewContainer, IScroll, jQuery, wysihtml5, jQuery, Cocktail));
