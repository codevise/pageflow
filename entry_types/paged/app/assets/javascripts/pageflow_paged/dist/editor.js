var pageflow_paged = (function (exports, Backbone, _, Marionette, $, I18n$1, ChildViewContainer, IScroll, jquery_minicolors, wysihtml5, jqueryUi, Cocktail, frontend, frontend$1) {
  'use strict';

  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  Marionette = Marionette && Marionette.hasOwnProperty('default') ? Marionette['default'] : Marionette;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  I18n$1 = I18n$1 && I18n$1.hasOwnProperty('default') ? I18n$1['default'] : I18n$1;
  ChildViewContainer = ChildViewContainer && ChildViewContainer.hasOwnProperty('default') ? ChildViewContainer['default'] : ChildViewContainer;
  IScroll = IScroll && IScroll.hasOwnProperty('default') ? IScroll['default'] : IScroll;
  wysihtml5 = wysihtml5 && wysihtml5.hasOwnProperty('default') ? wysihtml5['default'] : wysihtml5;
  Cocktail = Cocktail && Cocktail.hasOwnProperty('default') ? Cocktail['default'] : Cocktail;

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
    return __p;
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
    return __p;
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
    return __p;
  }
  function blankSlateTemplate(data) {
    var __t,
      __p = '';
    __p += '<td colspan="' + ((__t = data.colSpan) == null ? '' : __t) + '">\n  ' + ((__t = data.blankSlateText) == null ? '' : __t) + '\n</td>\n';
    return __p;
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
    return __p;
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
    return __p;
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
    var __t,
      __p = '';
    __p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<a class="original" href="#" download target="_blank">\n  ' + ((__t = I18n.t('pageflow.ui.templates.inputs.url_display.link_text')) == null ? '' : __t) + '\n</a>\n';
    return __p;
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
    return __p;
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
    return __p;
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
    return __p;
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
    return __p;
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
    var __t,
      __p = '';
    __p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n\n<!-- inline style for wysihtml5 to pick up -->\n<textarea style="width: 100%;" dir="auto"></textarea>\n\n<div class="toolbar">\n  <a data-wysihtml5-command="bold" title="' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.bold')) == null ? '' : __t) + '"></a>\n  <a data-wysihtml5-command="italic" title="' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.italic')) == null ? '' : __t) + '"></a>\n  <a data-wysihtml5-command="underline" title="' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.underline')) == null ? '' : __t) + '"></a>\n  <a data-wysihtml5-command="createLink" class="link_button" title="' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.create_link')) == null ? '' : __t) + '"></a>\n  <a data-wysihtml5-command="insertOrderedList" title="' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.insert_ordered_list')) == null ? '' : __t) + '"></a>\n  <a data-wysihtml5-command="insertUnorderedList" title="' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.insert_unordered_list')) == null ? '' : __t) + '"></a>\n\n  <div data-wysihtml5-dialog="createLink" class="dialog link_dialog" style="display: none;">\n    <div class="link_type_select">\n      <label>\n        <input type="radio" name="link_type" class="url_link_radio_button">\n        ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.link_type.url')) == null ? '' : __t) + '\n      </label>\n      <label>\n        <input type="radio" name="link_type" class="fragment_link_radio_button">\n        ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.link_type.page_link')) == null ? '' : __t) + '\n      </label>\n    </div>\n    <div class="url_link_panel">\n      <label>\n        <span>\n          ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.target')) == null ? '' : __t) + '\n        </span>\n      </label>\n      <input type="text" class="display_url">\n      <div class="open_in_new_tab_section">\n        <label>\n          <input type="checkbox" class="open_in_new_tab">\n          ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.open_in_new_tab')) == null ? '' : __t) + '\n        </label>\n        <span class="inline_help">\n          ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.open_in_new_tab_help')) == null ? '' : __t) + '\n        </span>\n      </div>\n    </div>\n    <div class="fragment_link_panel">\n      <!-- LinkInputView is inserted here -->\n    </div>\n\n    <!-- wysihtml5 does not handle hidden fields correctly -->\n    <div class="internal">\n      <input type="text" data-wysihtml5-dialog-field="href" class="current_url" value="">\n      <input type="text" data-wysihtml5-dialog-field="target" class="current_target" value="_blank">\n    </div>\n\n    <a class="button" data-wysihtml5-dialog-action="save">\n      ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.save')) == null ? '' : __t) + '\n    </a>\n    <a class="button" data-wysihtml5-dialog-action="cancel">\n      ' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.cancel')) == null ? '' : __t) + '\n    </a>\n\n    <a data-wysihtml5-command="removeLink">' + ((__t = I18n.t('pageflow.ui.templates.inputs.text_area_input.remove_link')) == null ? '' : __t) + '</a>\n  </div>\n</div>\n';
    return __p;
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
    return __p;
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
    return __p;
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
    return __p;
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
    return __p;
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
    var __t,
      __p = '';
    __p += '<a class="remove" title="' + ((__t = I18n.t('pageflow.editor.templates.row.destroy')) == null ? '' : __t) + '"></a>\n';
    return __p;
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
  function _defineProperty$2(obj, key, value) {
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
  function ownKeys$2(object, enumerableOnly) {
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
  function _objectSpread2$2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys$2(Object(source), true).forEach(function (key) {
          _defineProperty$2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$2(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  var CommonPageConfigurationTabs = BaseObject.extend({
    initialize: function initialize() {
      this.configureFns = {};
    },
    register: function register(name, configureFn) {
      this.configureFns[name] = configureFn;
    },
    apply: function apply(configurationEditorView) {
      _.each(this.configureFns, function (configureFn, name) {
        configurationEditorView.tab(name, function () {
          configureFn.call(prefixInputDecorator(name, this));
        });
      });
      function prefixInputDecorator(name, dsl) {
        return {
          input: function input(propertyName, view, options) {
            return dsl.input(name + '_' + propertyName, view, options);
          }
        };
      }
    }
  });
  var DropDownMenuItems = BaseObject.extend({
    initialize: function initialize() {
      this.menuItems = {};
    },
    register: function register(menuItem, _ref) {
      var menuName = _ref.menuName;
      this.menuItems[menuName] = this.menuItems[menuName] || [];
      this.menuItems[menuName].push(menuItem);
    },
    findAllByMenuName: function findAllByMenuName(menuName) {
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
  var Failure = BaseObject.extend({
    canRetry: true,
    type: 'Failure',
    initialize: function initialize(model) {
      this.model = model;
    },
    retry: function retry() {
      if (this.canRetry) {
        return this.retryAction();
      }
    },
    retryAction: function retryAction() {
      return this.model.save();
    },
    key: function key() {
      return this.model.cid + '-' + this.type;
    }
  });
  var SavingFailure = Failure.extend({
    type: 'SavingFailure'
  });
  var OrderingFailure = Failure.extend({
    type: 'OrderingFailure',
    initialize: function initialize(model, collection) {
      Failure.prototype.initialize.call(this, model);
      this.collection = collection;
    },
    retryAction: function retryAction() {
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
  var FailuresAPI = BaseObject.extend( /** @lends Failures.prototype */{
    initialize: function initialize() {
      this.failures = {};
      this.length = 0;
    },
    /**
     * Listen to the `error` and `sync` events of a collection and
     * create failure objects.
     */
    watch: function watch(collection) {
      this.listenTo(collection, 'sync', this.remove);
      this.listenTo(collection, 'error', function (model) {
        if (!model.isNew()) {
          this.add(new SavingFailure(model));
        }
      });
    },
    retry: function retry() {
      _.each(this.failures, function (failure, key) {
        this.remove(key);
        failure.retry();
      }, this);
    },
    isEmpty: function isEmpty() {
      return _.size(this.failures) === 0;
    },
    /**
     * Record that a failure occured.
     *
     * @param {Failure} failure
     * The failure object to add.
     */
    add: function add(failure) {
      this.failures[failure.key()] = failure;
      this.length = _.size(this.failures);
    },
    remove: function remove(key) {
      delete this.failures[key];
      this.length = _.size(this.failures);
    },
    count: function count() {
      return this.length;
    }
  });
  _.extend(FailuresAPI.prototype, Backbone.Events);
  var UploadError = BaseObject.extend({
    setMessage: function setMessage(options) {
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
  var UnmatchedUploadError = UploadError.extend({
    name: 'UnmatchedUploadError',
    initialize: function initialize(upload) {
      this.setMessage({
        upload: upload,
        translationKey: 'pageflow.editor.errors.unmatched_upload_error'
      });
    }
  });
  var validFileTypeTranslationList = {
    validFileTypeTranslations: function validFileTypeTranslations(validFileTypes) {
      return validFileTypes.map(function (validFileType) {
        return I18n$1.t('activerecord.models.' + validFileType.i18nKey + '.other');
      }).join(', ');
    }
  };
  var NestedTypeError = UploadError.extend({
    name: 'NestedTypeError',
    initialize: function initialize(upload, options) {
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
  var InvalidNestedTypeError = UploadError.extend({
    name: 'InvalidNestedTypeError',
    initialize: function initialize(upload, options) {
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
  var FileTypesCollection = BaseObject.extend({
    initialize: function initialize(fileTypes) {
      this._fileTypes = fileTypes;
    },
    findByUpload: function findByUpload(upload) {
      var result = this.find(function (fileType) {
        return fileType.matchUpload(upload);
      });
      if (!result) {
        throw new UnmatchedUploadError(upload);
      }
      return result;
    },
    findByCollectionName: function findByCollectionName(collectionName) {
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
  var FileType = BaseObject.extend({
    initialize: function initialize(options) {
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
    setupModelNaming: function setupModelNaming() {
      this.model.prototype.modelName = this.model.prototype.modelName || this.paramKey;
      this.model.prototype.paramRoot = this.model.prototype.paramRoot || this.paramKey;
      this.model.prototype.i18nKey = this.model.prototype.i18nKey || this.i18nKey;
    },
    setNestedFileTypes: function setNestedFileTypes(fileTypesCollection) {
      this.nestedFileTypes = fileTypesCollection;
    },
    getFilter: function getFilter(name) {
      var result = _(this.filters).find(function (filter) {
        return filter.name === name;
      });
      if (!result) {
        throw new Error('Unknown filter "' + name + '" for file type "' + this.collectionName + '".');
      }
      return result;
    }
  });
  var FileTypes = BaseObject.extend({
    modifyableProperties: ['configurationEditorInputs', 'configurationUpdaters', 'confirmUploadTableColumns', 'filters'],
    initialize: function initialize() {
      this.clientSideConfigs = [];
      this.clientSideConfigModifications = {};
      this.commonSettingsDialogTabs = [];
      this.commonMetaDataAttributes = [];
    },
    register: function register(name, config) {
      if (this._setup) {
        throw 'File types already set up. Register file types before initializers run.';
      }
      this.clientSideConfigs[name] = config;
    },
    modify: function modify(name, config) {
      if (this._setup) {
        throw 'File types already set up. Modify file types before initializers run.';
      }
      this.clientSideConfigModifications[name] = this.clientSideConfigModifications[name] || [];
      this.clientSideConfigModifications[name].push(config);
    },
    setup: function setup(serverSideConfigs) {
      var _this = this;
      var clientSideConfigs = this.clientSideConfigs;
      this._setup = true;
      var configs = _.chain(serverSideConfigs).map(function (serverSideConfig) {
        var clientSideConfig = clientSideConfigs[serverSideConfig.collectionName];
        if (!clientSideConfig) {
          throw 'Missing client side config for file type "' + serverSideConfig.collectionName + '"';
        }
        _this.applyCommonConfig(clientSideConfig);
        _this.applyModifications(serverSideConfig, clientSideConfig);
        return _.extend({}, serverSideConfig, clientSideConfig);
      }).sortBy(function (config) {
        return config.priority || 10;
      }).value();
      this.collection = new FileTypesCollection(_.map(configs, function (config) {
        return new FileType(config);
      }));
      var those = this;
      _.map(serverSideConfigs, function (serverSideConfig) {
        var fileType = those.findByCollectionName(serverSideConfig.collectionName);
        fileType.setNestedFileTypes(new FileTypesCollection(_.map(serverSideConfig.nestedFileTypes, function (nestedFileType) {
          return those.findByCollectionName(nestedFileType.collectionName);
        })));
      });
    },
    applyCommonConfig: function applyCommonConfig(clientSideConfig) {
      clientSideConfig.settingsDialogTabs = this.commonSettingsDialogTabs.concat(clientSideConfig.settingsDialogTabs || []);
      clientSideConfig.metaDataAttributes = this.commonMetaDataAttributes.concat(clientSideConfig.metaDataAttributes || []);
    },
    applyModifications: function applyModifications(serverSideConfig, clientSideConfig) {
      _(this.clientSideConfigModifications[serverSideConfig.collectionName]).each(function (modification) {
        this.lintModification(modification, serverSideConfig.collectionName);
        this.applyModification(clientSideConfig, modification);
      }, this);
    },
    lintModification: function lintModification(modification, collectionName) {
      var unmodifyableProperties = _.difference(_.keys(modification), this.modifyableProperties);
      if (unmodifyableProperties.length) {
        throw 'Only the following properties are allowed in FileTypes#modify: ' + this.modifyableProperties.join(', ') + '. Given in modification for ' + collectionName + ': ' + unmodifyableProperties.join(', ') + '.';
      }
    },
    applyModification: function applyModification(target, modification) {
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
  var FileImporters = BaseObject.extend({
    initialize: function initialize() {
      this.importers = {};
    },
    register: function register(name, config) {
      if (this._setup) {
        throw 'File importers setup is already finished. Register file importers before setup is finished';
      }
      this.importers[name] = config;
      config.key = name;
    },
    setup: function setup(serverSideConfigs) {
      this._setup = true;
      var registeredImporters = this.importers;
      var importers = {};
      serverSideConfigs.forEach(function (importer) {
        var regImporter = registeredImporters[importer.importerName];
        regImporter['authenticationRequired'] = importer.authenticationRequired;
        regImporter['authenticationProvider'] = importer.authenticationProvider;
        regImporter['logoSource'] = importer.logoSource;
        importers[importer.importerName] = regImporter;
      });
      this.importers = importers;
    },
    find: function find(name) {
      if (!this.importers[name]) {
        throw 'Could not find file importer with name "' + name + '"';
      }
      return this.importers[name];
    },
    keys: function keys() {
      return _.keys(this.importers);
    },
    values: function values() {
      return _.values(this.importers);
    }
  });
  var PageLinkConfigurationEditorView = ConfigurationEditorView.extend({
    configure: function configure() {
      this.tab('general', function () {
        this.group('page_link');
      });
    }
  });
  var PageType = BaseObject.extend({
    initialize: function initialize(name, options, seed) {
      this.name = name;
      this.options = options;
      this.seed = seed;
    },
    translationKey: function translationKey() {
      return this.seed.translation_key;
    },
    thumbnailCandidates: function thumbnailCandidates() {
      return this.seed.thumbnail_candidates;
    },
    pageLinks: function pageLinks(configuration) {
      if ('pageLinks' in this.options) {
        return this.options.pageLinks(configuration);
      }
    },
    configurationEditorView: function configurationEditorView() {
      return this.options.configurationEditorView || ConfigurationEditorView.repository[this.name];
    },
    embeddedViews: function embeddedViews() {
      return this.options.embeddedViews;
    },
    createConfigurationEditorView: function createConfigurationEditorView(options) {
      var constructor = this.configurationEditorView();
      options.pageType = this.seed;
      return new constructor(_.extend({
        tabTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_configuration_tabs', 'pageflow.common_page_configuration_tabs'],
        attributeTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_attributes', 'pageflow.common_page_attributes']
      }, options));
    },
    createPageLinkConfigurationEditorView: function createPageLinkConfigurationEditorView(options) {
      var constructor = this.options.pageLinkConfigurationEditorView || PageLinkConfigurationEditorView;
      return new constructor(_.extend({
        tabTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_link_configuration_tabs', 'pageflow.common_page_link_configuration_tabs'],
        attributeTranslationKeyPrefixes: [this.seed.translation_key_prefix + '.page_link_attributes', 'pageflow.common_page_link_attributes']
      }, options));
    },
    supportsPhoneEmulation: function supportsPhoneEmulation() {
      return !!this.options.supportsPhoneEmulation;
    }
  });
  var PageTypes = BaseObject.extend({
    initialize: function initialize() {
      this.clientSideConfigs = {};
    },
    register: function register(name, config) {
      if (this._setup) {
        throw 'Page types already set up. Register page types before initializers run.';
      }
      this.clientSideConfigs[name] = config;
    },
    setup: function setup(serverSideConfigs) {
      var clientSideConfigs = this.clientSideConfigs;
      this._setup = true;
      this.pageTypes = _.map(serverSideConfigs, function (serverSideConfig) {
        var clientSideConfig = clientSideConfigs[serverSideConfig.name] || {};
        return new PageType(serverSideConfig.name, clientSideConfig, serverSideConfig);
      });
    },
    findByName: function findByName(name) {
      var result = this.find(function (pageType) {
        return pageType.name === name;
      });
      if (!result) {
        throw 'Could not find page type with name "' + name + '"';
      }
      return result;
    },
    findByPage: function findByPage(page) {
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
  var MultiCollection = function MultiCollection() {
    this.records = {};
    this.length = 0;
  };
  _.extend(MultiCollection.prototype, {
    add: function add(record) {
      if (!this.records[record.cid]) {
        this.records[record.cid] = record;
        this.length = _.keys(this.records).length;
        this.trigger('add', record);
      }
    },
    remove: function remove(record) {
      if (this.records[record.cid]) {
        delete this.records[record.cid];
        this.length = _.keys(this.records).length;
        this.trigger('remove', record);
      }
    },
    isEmpty: function isEmpty() {
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
  var SavingRecordsCollection = MultiCollection.extend({
    /**
     * Listen to events of models in collection to track when they are
     * being saved.
     *
     * @param {Backbone.Collection} collection - Collection to watch.
     */
    watch: function watch(collection) {
      var that = this;
      this.listenTo(collection, 'request', function (model, xhr) {
        that.add(model);
        xhr.always(function () {
          that.remove(model);
        });
      });
    }
  });
  var WidgetType = BaseObject.extend({
    initialize: function initialize(serverSideConfig, clientSideConfig) {
      this.name = serverSideConfig.name;
      this.translationKey = serverSideConfig.translationKey;
      this.insertPoint = serverSideConfig.insertPoint;
      this.configurationEditorView = clientSideConfig.configurationEditorView;
      this.configurationEditorTabViewGroups = clientSideConfig.configurationEditorTabViewGroups || {};
      this.isOptional = clientSideConfig.isOptional;
    },
    hasConfiguration: function hasConfiguration() {
      return !!this.configurationEditorView;
    },
    createConfigurationEditorView: function createConfigurationEditorView(options) {
      var constructor = this.configurationEditorView;
      return new constructor(_.extend({
        attributeTranslationKeyPrefixes: ['pageflow.editor.widgets.attributes.' + this.name, 'pageflow.editor.widgets.common_attributes']
      }, options));
    },
    defineStubConfigurationEditorTabViewGroups: function defineStubConfigurationEditorTabViewGroups(groups) {
      _.each(this.configurationEditorTabViewGroups, function (fn, name) {
        return groups.define(name, function () {});
      });
    },
    defineConfigurationEditorTabViewGroups: function defineConfigurationEditorTabViewGroups(groups) {
      _.each(this.configurationEditorTabViewGroups, function (fn, name) {
        return groups.define(name, fn);
      });
    }
  });
  var WidgetTypes = BaseObject.extend({
    initialize: function initialize() {
      this._clientSideConfigs = {};
      this._optionalRoles = {};
    },
    register: function register(name, config) {
      if (this._setup) {
        throw 'Widget types already set up. Register widget types before initializers run.';
      }
      this._clientSideConfigs[name] = config;
    },
    setup: function setup(serverSideConfigsByRole) {
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
    findAllByRole: function findAllByRole(role) {
      return this._widgetTypesByRole[role] || [];
    },
    findByName: function findByName(name) {
      if (!this._widgetTypesByName[name]) {
        throw 'Could not find widget type with name "' + name + '"';
      }
      return this._widgetTypesByName[name];
    },
    registerRole: function registerRole(role, options) {
      this._optionalRoles[role] = options.isOptional;
    },
    isOptional: function isOptional(role) {
      return !!this._optionalRoles[role];
    },
    defineStubConfigurationEditorTabViewGroups: function defineStubConfigurationEditorTabViewGroups(groups) {
      _.each(this._widgetTypesByName, function (widgetType) {
        return widgetType.defineStubConfigurationEditorTabViewGroups(groups);
      });
    }
  });
  var app = new Marionette.Application();
  var state = window.pageflow || {};

  /**
   * Interface for engines providing editor extensions.
   * @alias editor
   */
  var EditorApi = BaseObject.extend( /** @lends editor */{
    initialize: function initialize(options) {
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
    registerEntryType: function registerEntryType(name, options) {
      this.entryType = _objectSpread2$2({
        name: name
      }, options);
    },
    createEntryModel: function createEntryModel(seed, options) {
      var entry = new this.entryType.entryModel(seed.entry, options);
      if (entry.setupFromEntryTypeSeed) {
        entry.setupFromEntryTypeSeed(seed.entry_type, state);
      }
      return entry;
    },
    /**
     *  Display Backbone/Marionette View inside the main panel
     *  of the editor.
     */
    showViewInMainPanel: function showViewInMainPanel(view) {
      app.mainRegion.show(view);
    },
    /**
     *  Display the Pageflow-Preview inside the main panel.
     */
    showPreview: function showPreview() {
      app.mainRegion.$el.empty();
    },
    /**
     * Register additional router and controller for sidebar.
     *
     * Supported options:
     * - router: constructor function of Backbone Marionette app router
     * - controller: constructor function of Backbone Marionette controller
     */
    registerSideBarRouting: function registerSideBarRouting(options) {
      this.sideBarRoutings.push(options);
    },
    /**
     * Set the file that is the parent of nested files when they are
     * uploaded. This value is automatically set and unset upon
     * navigating towards the appropriate views.
     */
    setUploadTargetFile: function setUploadTargetFile(file) {
      this.nextUploadTargetFile = file;
    },
    /**
     * Set the name of the help entry that shall be selected by
     * default when the help view is opened. This value is
     * automatically reset when navigation occurs.
     */
    setDefaultHelpEntry: function setDefaultHelpEntry(name) {
      this.nextDefaultHelpEntry = name;
    },
    applyDefaultHelpEntry: function applyDefaultHelpEntry(name) {
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
    registerMainMenuItem: function registerMainMenuItem(options) {
      this.mainMenuItems.push(options);
    },
    /**
     * Register additional inputs to show in the appearance tab under
     * title and options. Passed callback receives tabView and options
     * with entry.
     *
     * @since 17.1
     */
    registerAppearanceInputs: function registerAppearanceInputs(callback) {
      this.appearanceInputsCallbacks.push(callback);
    },
    /**
     * Register a custom initializer which will be run before the boot
     * initializer of the editor.
     */
    addInitializer: function addInitializer(fn) {
      this.initializers.push(fn);
    },
    /**
     * Navigate to the given path.
     */
    navigate: function navigate(path, options) {
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
    registerPageConfigurationMixin: function registerPageConfigurationMixin(mixin) {
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
    registerFileSelectionHandler: function registerFileSelectionHandler(name, handler) {
      this.fileSelectionHandlers[name] = handler;
    },
    /**
     * Trigger selection of the given file type with the given
     * handler. Payload hash is passed to selection handler as options.
     *
     * @param {string|{name: string, filter: string}|{defaultTab: string, filter: string}} fileType
     *   Either collection name of a file type or and object containing
     *   the collection name a file type and a the name of a file type
     *   filter or an object containingn a defaultTab property that controls
     *   which tab will visible initially, while allowing selecting files of
     *   any type.
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
    selectFile: function selectFile(fileType, handlerName, payload) {
      if (typeof fileType === 'string') {
        fileType = {
          name: fileType
        };
      }
      this.navigate('/files/' + (fileType.defaultTab ? "".concat(fileType.defaultTab, ":default") : fileType.name) + '?handler=' + handlerName + '&payload=' + encodeURIComponent(JSON.stringify(payload)) + (fileType.filter ? '&filter=' + fileType.filter : ''), {
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
    selectPage: function selectPage(options) {
      return this.pageSelectionView.selectPage(_objectSpread2$2(_objectSpread2$2({}, options), {}, {
        entry: state.entry
      }));
    },
    createFileSelectionHandler: function createFileSelectionHandler(handlerName, encodedPayload) {
      if (!this.fileSelectionHandlers[handlerName]) {
        throw 'Unknown FileSelectionHandler ' + handlerName;
      }
      var payloadJson = JSON.parse(decodeURIComponent(encodedPayload));
      return new this.fileSelectionHandlers[handlerName](_objectSpread2$2(_objectSpread2$2({}, payloadJson), {}, {
        entry: state.entry
      }));
    },
    createPageConfigurationEditorView: function createPageConfigurationEditorView(page, options) {
      var view = this.pageTypes.findByPage(page).createConfigurationEditorView(_.extend(options, {
        model: page.configuration
      }));
      this.commonPageConfigurationTabs.apply(view);
      return view;
    },
    ensureBrowserSupport: function ensureBrowserSupport(start) {
      if (this.entryType.isBrowserSupported) {
        var isBrowserSupported = this.entryType.isBrowserSupported();
        if (isBrowserSupported) {
          start();
        } else {
          var browserNotSupportedView = new this.entryType.browserNotSupportedView();
          app.mainRegion.show(browserNotSupportedView);
        }
      } else {
        start();
      }
    }
  });
  var editor = new EditorApi();
  var startEditor = function startEditor(options) {
    // In Webpack builds, I18n object from the i18n-js module is not
    // identical to window.I18n which is provided by the i18n-js gem via
    // the asset pipeline. Make translations provided via the asset
    // pipeline available in Webpack bundle.
    I18n$1.defaultLocale = window.I18n.defaultLocale;
    I18n$1.locale = window.I18n.locale;
    I18n$1.translations = window.I18n.translations;
    $(function () {
      editor.ensureBrowserSupport(function () {
        Promise.all([$.getJSON('/editor/entries/' + options.entryId + '/seed'), frontend.browser.detectFeatures()]).then(function (result) {
          return app.start(result[0]);
        }, function () {
          return alert('Error while starting editor.');
        });
      });
    });
  };

  /**
   * Mixins for Backbone models and collections that use entry type
   * specific editor controllers registered via the `editor_app` entry
   * type option.
   */
  var entryTypeEditorControllerUrls = {
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
    forCollection: function forCollection(_ref) {
      var resources = _ref.resources;
      return {
        url: function url() {
          return entryTypeEditorControllerUrl(resources);
        },
        urlSuffix: function urlSuffix() {
          return "/".concat(resources);
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
    forModel: function forModel(_ref2) {
      var resources = _ref2.resources;
      return {
        urlRoot: function urlRoot() {
          return this.isNew() ? this.collection.url() : entryTypeEditorControllerUrl(resources);
        }
      };
    }
  };
  function entryTypeEditorControllerUrl(resources) {
    return [state.entry.url(), editor.entryType.name, resources].join('/');
  }
  var formDataUtils = {
    fromModel: function fromModel(model) {
      var object = {};
      object[model.modelName] = model.toJSON();
      return this.fromObject(object);
    },
    fromObject: function fromObject(object) {
      var queryString = $.param(object).replace(/\+/g, '%20');
      return _(queryString.split('&')).reduce(function (result, param) {
        var pair = param.split('=');
        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        return result;
      }, {});
    }
  };
  var stylesheet = {
    reload: function reload(name) {
      var link = this.selectLink(name);
      if (!link.data('originalHref')) {
        link.data('originalHref', link.attr('href'));
      }
      link.attr('href', link.data('originalHref') + '&reload=' + new Date().getTime());
    },
    update: function update(name, stylesheetPath) {
      var link = this.selectLink(name);
      if (link.attr('href') !== stylesheetPath) {
        link.attr('href', stylesheetPath);
      }
    },
    selectLink: function selectLink(name) {
      return $('head link[data-name=' + name + ']');
    }
  };
  var SubsetCollection = Backbone.Collection.extend({
    constructor: function constructor(options) {
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
    clear: function clear() {
      this.parent.remove(this.models);
      this.reset();
    },
    url: function url() {
      return this.parentModel.url() + (_.result(this.parent, 'urlSuffix') || _.result(this.parent, 'url'));
    },
    dispose: function dispose() {
      this.stopListening();
      this.reset();
    },
    updateFilter: function updateFilter(predicate) {
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
  var FilesCollection = Backbone.Collection.extend({
    initialize: function initialize(models, options) {
      options = options || {};
      this.entry = options.entry;
      this.fileType = options.fileType;
      this.name = options.fileType.collectionName;
    },
    comparator: function comparator(file) {
      var fileName = file.get('file_name');
      return fileName && fileName.toLowerCase ? fileName.toLowerCase() : fileName;
    },
    url: function url() {
      return '/editor/entries/' + this.getEntry().get('id') + '/files/' + this.name;
    },
    fetch: function fetch(options) {
      options = _.extend({
        fileType: this.fileType
      }, options || {});
      return Backbone.Collection.prototype.fetch.call(this, options);
    },
    findOrCreateBy: function findOrCreateBy(attributes) {
      return this.findWhere(attributes) || this.create(attributes, {
        fileType: this.fileType,
        queryParams: {
          no_upload: true
        }
      });
    },
    getByPermaId: function getByPermaId(permaId) {
      return this.findWhere({
        perma_id: parseInt(permaId, 10)
      });
    },
    getEntry: function getEntry() {
      return this.entry || state.entry;
    },
    confirmable: function confirmable() {
      return new SubsetCollection({
        parent: this,
        watchAttribute: 'state',
        filter: function filter(item) {
          return item.get('state') === 'waiting_for_confirmation';
        }
      });
    },
    uploadable: function uploadable() {
      this._uploadableSubsetCollection = this._uploadableSubsetCollection || new SubsetCollection({
        parent: this,
        watchAttribute: 'state',
        filter: function filter(item) {
          return item.get('state') === 'uploadable';
        }
      });
      return this._uploadableSubsetCollection;
    },
    withFilter: function withFilter(filterName) {
      return new SubsetCollection({
        parent: this,
        watchAttribute: 'configuration',
        filter: this.fileType.getFilter(filterName).matches
      });
    }
  });
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
  var OtherEntry = Backbone.Model.extend({
    paramRoot: 'entry',
    urlRoot: '/entries',
    modelName: 'entry',
    i18nKey: 'pageflow/entry',
    initialize: function initialize() {
      this.files = {};
    },
    getFileCollection: function getFileCollection(fileType) {
      if (!this.files[fileType.collectionName]) {
        this.files[fileType.collectionName] = FilesCollection.createForFileType(fileType, [], {
          entry: this
        });
      }
      return this.files[fileType.collectionName];
    },
    titleOrSlug: function titleOrSlug() {
      return this.get('title') || this.get('slug');
    }
  });
  var EditLock = Backbone.Model.extend({
    paramRoot: 'edit_lock',
    url: function url() {
      return '/entries/' + state.entry.get('id') + '/edit_lock?timestamp=' + new Date().getTime();
    },
    toJSON: function toJSON() {
      return {
        id: this.id,
        force: this.get('force')
      };
    }
  });
  var transientReferences = {
    initialize: function initialize() {
      this.transientReferences = {};
      this.pendingReferences = {};
    },
    getReference: function getReference(attribute, collection) {
      if (typeof collection === 'string') {
        var fileType = editor.fileTypes.findByCollectionName(collection);
        collection = state.entry.getFileCollection(fileType);
      }
      return this.transientReferences[attribute] || collection.getByPermaId(this.get(attribute));
    },
    setReference: function setReference(attribute, record) {
      this._cleanUpReference(attribute);
      this._setReference(attribute, record);
      this._listenForReady(attribute, record);
    },
    unsetReference: function unsetReference(attribute) {
      this._cleanUpReference(attribute);
      this.set(attribute, null);
    },
    _setReference: function _setReference(attribute, record) {
      if (record.isNew()) {
        this.transientReferences[attribute] = record;
        this.set(attribute, null);
        this._setPermaIdOnceSynced(attribute, record);
      } else {
        this.set(attribute, record.get('perma_id'));
      }
    },
    _setPermaIdOnceSynced: function _setPermaIdOnceSynced(attribute, record) {
      record.once('change:perma_id', function () {
        this._onceRecordCanBeFoundInCollection(record, function () {
          delete this.transientReferences[attribute];
          this.set(attribute, record.get('perma_id'));
        });
      }, this);
    },
    _onceRecordCanBeFoundInCollection: function _onceRecordCanBeFoundInCollection(record, callback) {
      // Backbone collections update their modelsById map in the change
      // event which is dispatched after the `change:<attribute>`
      // events.
      record.once('change', _.bind(callback, this));
    },
    _listenForReady: function _listenForReady(attribute, record) {
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
    _cleanUpReference: function _cleanUpReference(attribute) {
      this._cleanUpSaveListener(attribute);
      this._cleanUpReadyListener(attribute);
    },
    _cleanUpSaveListener: function _cleanUpSaveListener(attribute) {
      if (this.transientReferences[attribute]) {
        this.stopListening(this.transientReferences[attribute], 'change:perma_id');
        delete this.transientReferences[attribute];
      }
    },
    _cleanUpReadyListener: function _cleanUpReadyListener(attribute) {
      if (this.pendingReferences[attribute]) {
        this.stopListening(this.pendingReferences[attribute], 'change:state');
        delete this.pendingReferences[attribute];
      }
    }
  };
  var Configuration = Backbone.Model.extend({
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
    getRoutableId: function getRoutableId() {
      return this.parent.id;
    },
    getImageFileUrl: function getImageFileUrl(attribute, options) {
      options = options || {};
      var file = this.getImageFile(attribute);
      if (file && file.isReady()) {
        return file.get(options.styleGroup ? options.styleGroup + '_url' : 'url');
      }
      return '';
    },
    getImageFile: function getImageFile(attribute) {
      return this.getReference(attribute, 'image_files');
    },
    getFilePosition: function getFilePosition(attribute, coord) {
      var propertyName = this.filePositionProperty(attribute, coord);
      return this.has(propertyName) ? this.get(propertyName) : 50;
    },
    setFilePosition: function setFilePosition(attribute, coord, value) {
      var propertyName = this.filePositionProperty(attribute, coord);
      this.set(propertyName, value);
    },
    setFilePositions: function setFilePositions(attribute, x, y) {
      var attributes = {};
      attributes[this.filePositionProperty(attribute, 'x')] = x;
      attributes[this.filePositionProperty(attribute, 'y')] = y;
      this.set(attributes);
    },
    filePositionProperty: function filePositionProperty(attribute, coord) {
      return attribute.replace(/_id$/, '_' + coord);
    },
    getVideoFileSources: function getVideoFileSources(attribute) {
      var file = this.getVideoFile(attribute);
      if (file && file.isReady()) {
        return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
      }
      return '';
    },
    getVideoFile: function getVideoFile(attribute) {
      return this.getReference(attribute, 'video_files');
    },
    getAudioFileSources: function getAudioFileSources(attribute) {
      var file = this.getAudioFile(attribute);
      if (file && file.isReady()) {
        return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
      }
      return '';
    },
    getAudioFile: function getAudioFile(attribute) {
      return this.getReference(attribute, 'audio_files');
    },
    getVideoPosterUrl: function getVideoPosterUrl() {
      var posterFile = this.getReference('poster_image_id', 'image_files'),
        videoFile = this.getReference('video_file_id', 'video_files');
      if (posterFile) {
        return posterFile.get('url');
      } else if (videoFile) {
        return videoFile.get('poster_url');
      }
      return null;
    },
    _appendSuffix: function _appendSuffix(sources) {
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
  app.on('mixin:configuration', function (mixin) {
    Cocktail.mixin(Configuration, mixin);
  });

  /**
   * Remove model from collection only after the `DELETE` request has
   * succeeded. Still allow tracking that the model is being destroyed
   * by triggering a `destroying` event and adding a `isDestroying`
   * method.
   */
  var delayedDestroying = {
    initialize: function initialize() {
      this._destroying = false;
      this._destroyed = false;
    },
    /**
     * Trigger `destroying` event and send `DELETE` request. Only remove
     * model from collection once the request is done.
     */
    destroyWithDelay: function destroyWithDelay() {
      var model = this;
      this._destroying = true;
      this.trigger('destroying', this);
      return Backbone.Model.prototype.destroy.call(this, {
        wait: true,
        success: function success() {
          model._destroying = false;
          model._destroyed = true;
        },
        error: function error() {
          model._destroying = false;
        }
      });
    },
    /**
     * Get whether the model is currently being destroyed.
     */
    isDestroying: function isDestroying() {
      return this._destroying;
    },
    /**
     * Get whether the model has been destroyed.
     */
    isDestroyed: function isDestroyed() {
      return this._destroyed;
    }
  };

  /**
   * Mixin for Backbone models that shall be watched by {@link
   * modelLifecycleTrackingView} mixin.
   */
  var failureTracking = {
    initialize: function initialize() {
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
    isFailed: function isFailed() {
      return this._saveFailed;
    },
    getFailureMessage: function getFailureMessage() {
      return this._failureMessage;
    },
    translateStatus: function translateStatus(xhr) {
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
  function configurationContainer() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      configurationModel = _ref.configurationModel,
      autoSave = _ref.autoSave,
      includeAttributesInJSON = _ref.includeAttributesInJSON,
      afterInitialize = _ref.afterInitialize;
    configurationModel = configurationModel || Configuration.extend({
      defaults: {}
    });
    return {
      initialize: function initialize() {
        this.configuration = new configurationModel(this.get('configuration'));
        this.configuration.parent = this;
        this.listenTo(this.configuration, 'change', function (model, options) {
          if (!this.isNew() && (!this.isDestroying || !this.isDestroying()) && (!this.isDestroyed || !this.isDestroyed()) && autoSave && options.autoSave !== false) {
            this.save();
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
      toJSON: function toJSON() {
        var attributes = {};
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
  var Page = Backbone.Model.extend({
    modelName: 'page',
    paramRoot: 'page',
    i18nKey: 'pageflow/page',
    defaults: function defaults() {
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
      afterInitialize: function afterInitialize() {
        this.configuration.page = this;
        this.listenTo(this.configuration, 'change:title', function () {
          this.trigger('change:title');
        });
      }
    }), failureTracking, delayedDestroying],
    initialize: function initialize() {
      this.listenTo(this, 'change:template', function () {
        this.save();
      });
    },
    urlRoot: function urlRoot() {
      return this.isNew() ? this.collection.url() : '/pages';
    },
    storylinePosition: function storylinePosition() {
      return this.chapter && this.chapter.storylinePosition() || -1;
    },
    chapterPosition: function chapterPosition() {
      return this.chapter && this.chapter.has('position') ? this.chapter.get('position') : -1;
    },
    isFirstPage: function isFirstPage() {
      return this.isChapterBeginning() && this.chapterPosition() === 0 && this.storylinePosition() === 1;
    },
    isChapterBeginning: function isChapterBeginning() {
      return this.get('position') === 0;
    },
    title: function title() {
      return this.configuration.get('title') || this.configuration.get('additional_title') || '';
    },
    thumbnailFile: function thumbnailFile() {
      var configuration = this.configuration;
      return _.reduce(this.pageType().thumbnailCandidates(), function (result, candidate) {
        if (candidate.condition && !conditionMet(candidate.condition, configuration)) {
          return result;
        }
        return result || configuration.getReference(candidate.attribute, candidate.file_collection);
      }, null);
    },
    pageLinks: function pageLinks() {
      return this.pageType().pageLinks(this.configuration);
    },
    pageType: function pageType() {
      return editor.pageTypes.findByName(this.get('template'));
    },
    destroy: function destroy() {
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
  var Scaffold = BaseObject.extend({
    initialize: function initialize(parent, options) {
      this.parent = parent;
      this.options = options || {};
    },
    create: function create() {
      var scaffold = this;
      var query = this.options.depth ? '?depth=' + this.options.depth : '';
      this.model = this.build();
      Backbone.sync('create', this.model, {
        url: this.model.url() + '/scaffold' + query,
        success: function success(response) {
          scaffold.load(response);
          scaffold.model.trigger('sync', scaffold.model, response, {});
        }
      });
    },
    build: function build() {},
    load: function load() {}
  });
  var StorylineScaffold = Scaffold.extend({
    build: function build() {
      this.storyline = this.parent.buildStoryline(this.options.storylineAttributes);
      this.chapter = this.storyline.buildChapter();
      if (this.options.depth === 'page') {
        this.page = this.chapter.buildPage();
      }
      editor.trigger('scaffold:storyline', this.storyline);
      return this.storyline;
    },
    load: function load(response) {
      this.storyline.set(response.storyline);
      this.chapter.set(response.chapter);
      if (this.page) {
        this.page.set(response.page);
      }
    }
  });
  var FileReuse = Backbone.Model.extend({
    modelName: 'file_reuse',
    paramRoot: 'file_reuse',
    initialize: function initialize(attributes, options) {
      this.entry = options.entry;
      this.collectionName = options.fileType.collectionName;
    },
    url: function url() {
      return '/editor/entries/' + this.entry.get('id') + '/files/' + this.collectionName + '/reuse';
    }
  });
  FileReuse.submit = function (otherEntry, file, options) {
    new FileReuse({
      other_entry_id: otherEntry.get('id'),
      file_id: file.get('id')
    }, {
      entry: options.entry,
      fileType: file.fileType()
    }).save(null, options);
  };
  var FileConfiguration = Configuration.extend({
    defaults: {},
    applyUpdaters: function applyUpdaters(updaters, newAttributes) {
      _(updaters).each(function (updater) {
        updater(this, newAttributes);
      }, this);
    }
  });
  var NestedFilesCollection = SubsetCollection.extend({
    constructor: function constructor(options) {
      var parent = options.parent;
      var parentFile = options.parentFile;
      var modelType = parentFile.fileType().typeName;
      var nestedFilesOrder = parent.fileType.nestedFilesOrder;
      SubsetCollection.prototype.constructor.call(this, {
        parent: parent,
        parentModel: parentFile,
        filter: function filter(item) {
          return item.get('parent_file_id') === parentFile.get('id') && item.get('parent_file_model_type') === modelType;
        },
        comparator: nestedFilesOrder && nestedFilesOrder.comparator
      });
      if (nestedFilesOrder) {
        this.listenTo(this, 'change:configuration:' + nestedFilesOrder.binding, this.sort);
      }
    },
    getByPermaId: function getByPermaId(permaId) {
      return this.findWhere({
        perma_id: parseInt(permaId, 10)
      });
    }
  });
  var retryable = {
    retry: function retry(options) {
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
  var FileStage = Backbone.Model.extend({
    initialize: function initialize(attributes, options) {
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
    update: function update() {
      this.updateState();
      this.updateProgress();
      this.updateErrorMessage();
    },
    updateState: function updateState() {
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
    updateProgress: function updateProgress() {
      this.set('progress', this.file.get(this.get('name') + '_progress'));
    },
    updateErrorMessage: function updateErrorMessage() {
      var errorMessageAttribute = this.get('name') + '_error_message';
      this.set('error_message', this.file.get(errorMessageAttribute));
    },
    localizedDescription: function localizedDescription() {
      var prefix = 'pageflow.editor.files.stages.';
      var suffix = this.get('name') + '.' + this.get('state');
      return I18n$1.t(prefix + this.file.i18nKey + '.' + suffix, {
        defaultValue: I18n$1.t(prefix + suffix)
      });
    }
  });
  var stageProvider = {
    initialize: function initialize() {
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
        filter: function filter(stage) {
          return !stage.get('finished');
        }
      });
    },
    currentStage: function currentStage() {
      return this.stages.find(function (stage) {
        return stage.get('active') || stage.get('action_required') || stage.get('failed');
      });
    }
  };
  var ReusableFile = Backbone.Model.extend({
    mixins: [configurationContainer({
      autoSave: true,
      configurationModel: FileConfiguration,
      includeAttributesInJSON: ['file_name', 'display_name', 'rights', 'parent_file_id', 'parent_file_model_type', 'content_type', 'file_size'],
      afterInitialize: function afterInitialize() {
        this.configuration.i18nKey = this.i18nKey;
      }
    }), stageProvider, retryable],
    initialize: function initialize(attributes, options) {
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
      this.listenTo(this, 'change:original_url change:display_name', this.updateDownloadUrl);
      this.updateDownloadUrl();
      this.listenTo(this, 'change', function (model, options) {
        if (options.applyConfigurationUpdaters) {
          this.configuration.applyUpdaters(this.fileType().configurationUpdaters, this.attributes.configuration);
        }
      });
    },
    urlRoot: function urlRoot() {
      return this.collection.url();
    },
    fileType: function fileType() {
      return this.options.fileType;
    },
    title: function title() {
      return this.get('display_name') || this.get('file_name');
    },
    thumbnailFile: function thumbnailFile() {
      return this;
    },
    nestedFiles: function nestedFiles(supersetCollection) {
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
    isUploading: function isUploading() {
      return this.get('state') === 'uploading';
    },
    isUploaded: function isUploaded() {
      return this.get('state') !== 'uploading' && this.get('state') !== 'uploading_failed';
    },
    isPending: function isPending() {
      return !this.isReady() && !this.isFailed();
    },
    isReady: function isReady() {
      return this.get('state') === this.readyState;
    },
    isFailed: function isFailed() {
      return this.get('state') && !!this.get('state').match(/_failed$/);
    },
    isRetryable: function isRetryable() {
      return !!this.get('retryable');
    },
    isConfirmable: function isConfirmable() {
      return false;
    },
    isPositionable: function isPositionable() {
      return false;
    },
    cancelUpload: function cancelUpload() {
      if (this.get('state') === 'uploading') {
        this.trigger('uploadCancelled');
        this.destroy();
      }
    },
    uploadFailed: function uploadFailed() {
      this.set('state', 'uploading_failed');
      this.unset('uploading_progress');
      this.trigger('uploadFailed');
    },
    publish: function publish() {
      this.save({}, {
        url: this.url() + '/publish'
      });
    },
    updateDownloadUrl: function updateDownloadUrl() {
      var originalUrl = this.get('original_url');
      var displayName = this.get('display_name');
      if (originalUrl && displayName) {
        var separator = originalUrl.includes('?') ? '&' : '?';
        this.set('download_url', "".concat(originalUrl).concat(separator, "download=").concat(encodeURIComponent(displayName)));
      } else {
        this.unset('download_url');
      }
    }
  });
  var UploadableFile = ReusableFile.extend({
    stages: function stages() {
      return [{
        name: 'uploading',
        activeStates: ['uploading'],
        failedStates: ['uploading_failed']
      }].concat(_.result(this, 'processingStages'));
    },
    processingStages: [],
    readyState: 'uploaded'
  });
  var EncodedFile = UploadableFile.extend({
    processingStages: function processingStages() {
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
    isConfirmable: function isConfirmable() {
      return this.get('state') === 'waiting_for_confirmation';
    },
    isPositionable: function isPositionable() {
      return false;
    }
  });
  var VideoFile = EncodedFile.extend({
    getBackgroundPositioningImageUrl: function getBackgroundPositioningImageUrl() {
      return this.get('poster_url');
    },
    isPositionable: function isPositionable() {
      return this.isReady();
    }
  });
  var WidgetConfigurationFileSelectionHandler = function WidgetConfigurationFileSelectionHandler(options) {
    var widget = state.entry.widgets.get(options.id);
    this.call = function (file) {
      widget.configuration.setReference(options.attributeName, file);
    };
    this.getReferer = function () {
      return '/widgets/' + widget.id;
    };
  };
  editor.registerFileSelectionHandler('widgetConfiguration', WidgetConfigurationFileSelectionHandler);
  var EncodingConfirmation = Backbone.Model.extend({
    paramRoot: 'encoding_confirmation',
    initialize: function initialize() {
      this.videoFiles = new Backbone.Collection();
      this.audioFiles = new Backbone.Collection();
      this.updateEmpty();
      this.watchCollections();
    },
    watchCollections: function watchCollections() {
      this.listenTo(this.videoFiles, 'add remove', this.check);
      this.listenTo(this.audioFiles, 'add remove', this.check);
      this.listenTo(this.videoFiles, 'reset', this.updateEmpty);
      this.listenTo(this.audioFiles, 'reset', this.updateEmpty);
    },
    check: function check() {
      var model = this;
      model.updateEmpty();
      model.set('checking', true);
      model.save({}, {
        url: model.url() + '/check',
        success: function success() {
          model.set('checking', false);
        },
        error: function error() {
          model.set('checking', false);
        }
      });
    },
    saveAndReset: function saveAndReset() {
      var model = this;
      model.save({}, {
        success: function success() {
          model.set('summary_html', '');
          model.videoFiles.reset();
          model.audioFiles.reset();
        }
      });
    },
    updateEmpty: function updateEmpty() {
      this.set('empty', this.videoFiles.length === 0 && this.audioFiles.length === 0);
    },
    url: function url() {
      return '/editor/entries/' + state.entry.get('id') + '/encoding_confirmations';
    },
    toJSON: function toJSON() {
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
  var Theme = Backbone.Model.extend({
    title: function title() {
      return I18n$1.t('pageflow.' + this.get('name') + '_theme.name');
    },
    thumbnailUrl: function thumbnailUrl() {
      return this.get('preview_thumbnail_url');
    },
    hasHomeButton: function hasHomeButton() {
      return this.get('home_button');
    },
    hasOverviewButton: function hasOverviewButton() {
      return this.get('overview_button');
    },
    supportsEmphasizedPages: function supportsEmphasizedPages() {
      return this.get('emphasized_pages');
    },
    supportsScrollIndicatorModes: function supportsScrollIndicatorModes() {
      return this.get('scroll_indicator_modes');
    },
    supportsHideLogoOnPages: function supportsHideLogoOnPages() {
      return this.get('hide_logo_option');
    }
  });
  var WidgetConfiguration = Configuration.extend({
    i18nKey: 'pageflow/widget',
    defaults: {}
  });
  var AudioFile = EncodedFile.extend({
    thumbnailPictogram: 'audio',
    getSources: function getSources(attribute) {
      if (this.isReady()) {
        return this.get('sources') ? this.get('sources') : '';
      }
      return '';
    }
  });
  var EntryMetadataConfiguration = Configuration.extend({
    modelName: 'entry_metadata_configuration',
    i18nKey: 'pageflow/entry_metadata_configuration',
    defaults: {}
  });
  var EntryMetadata = Configuration.extend({
    modelName: 'entry',
    i18nKey: 'pageflow/entry',
    defaults: {},
    initialize: function initialize(attributes, options) {
      Configuration.prototype.initialize.apply(this, attributes, options);
      this.configuration = new EntryMetadataConfiguration(_.clone(attributes.configuration) || {});
      this.listenTo(this.configuration, 'change', function (model, options) {
        this.trigger('change', model, options);
        this.trigger('change:configuration', this, undefined, options);
        this.parent.save();
      });
    },
    // Pageflow Scrolled only synchronizes saved records to entry state.
    isNew: function isNew() {
      return false;
    }
  });
  var StorylineConfiguration = Configuration.extend({
    modelName: 'storyline',
    i18nKey: 'pageflow/storyline',
    defaults: {},
    initialize: function initialize() {
      this.listenTo(this, 'change:main', function (model, value) {
        if (value) {
          this.unset('parent_page_perma_id');
        }
      });
    }
  });
  var TextTrackFile = UploadableFile.extend({
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
    initialize: function initialize(attributes, options) {
      ReusableFile.prototype.initialize.apply(this, arguments);
      if (this.isNew() && !this.configuration.get('srclang')) {
        this.configuration.set('srclang', this.extractLanguageCodeFromFilename());
      }
    },
    displayLabel: function displayLabel() {
      return this.configuration.get('label') || this.inferredLabel() || I18n$1.t('pageflow.editor.text_track_files.label_missing');
    },
    inferredLabel: function inferredLabel() {
      var srclang = this.configuration.get('srclang');
      if (srclang) {
        return I18n$1.t('pageflow.languages.' + srclang, {
          defaultValue: ''
        });
      }
    },
    extractLanguageCodeFromFilename: function extractLanguageCodeFromFilename() {
      var matches = /\S+\.([a-z]{2})_[A-Z]{2}\.[a-z]+/.exec(this.get('file_name'));
      return matches && matches[1];
    }
  });
  TextTrackFile.displayLabelBinding = 'srclang';
  var StorylineOrdering = function StorylineOrdering(storylines, pages) {
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
  var PageConfigurationFileSelectionHandler = function PageConfigurationFileSelectionHandler(options) {
    var page = state.pages.get(options.id);
    this.call = function (file) {
      page.configuration.setReference(options.attributeName, file);
    };
    this.getReferer = function () {
      return '/pages/' + page.id + '/' + (options.returnToTab || 'files');
    };
  };
  editor.registerFileSelectionHandler('pageConfiguration', PageConfigurationFileSelectionHandler);
  var ImageFile = ReusableFile.extend({
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
    getBackgroundPositioningImageUrl: function getBackgroundPositioningImageUrl() {
      return this.get('url');
    },
    isPositionable: function isPositionable() {
      return this.isReady();
    }
  });
  var EntryMetadataFileSelectionHandler = function EntryMetadataFileSelectionHandler(options) {
    this.call = function (file) {
      state.entry.metadata.setReference(options.attributeName, file);
    };
    this.getReferer = function () {
      return '/meta_data/' + (options.returnToTab || 'general');
    };
  };
  editor.registerFileSelectionHandler('entryMetadata', EntryMetadataFileSelectionHandler);
  var EntryPublication = Backbone.Model.extend({
    paramRoot: 'entry_publication',
    quota: function quota() {
      return new Backbone.Model(this.get('quota') || {});
    },
    check: function check() {
      var model = this;
      this.set('checking', true);
      this.save({}, {
        url: this.url() + '/check',
        success: function success() {
          model.set('checking', false);
        },
        error: function error() {
          model.set('checking', false);
        }
      });
    },
    publish: function publish(attributes) {
      return this.save(attributes, {
        success: function success(model) {
          state.entry.parse(model.get('entry'));
        },
        error: function error(model, xhr) {
          model.set(xhr.responseJSON);
        }
      });
    },
    url: function url() {
      return '/editor/entries/' + state.entry.get('id') + '/entry_publications';
    }
  });
  var ChapterScaffold = Scaffold.extend({
    build: function build() {
      this.chapter = this.parent.buildChapter(this.options.chapterAttributes);
      this.page = this.chapter.buildPage();
      return this.chapter;
    },
    load: function load(response) {
      this.chapter.set(response.chapter);
      this.page.set(response.page);
    }
  });
  var EditLockContainer = Backbone.Model.extend({
    initialize: function initialize() {
      this.storageKey = 'pageflow.edit_lock.' + state.entry.id;
    },
    acquire: function acquire(options) {
      options = options || {};
      var container = this;
      var lock = new EditLock({
        id: options.force ? null : sessionStorage[this.storageKey],
        force: options.force
      });
      lock.save(null, {
        polling: !!options.polling,
        success: function success(lock) {
          sessionStorage[container.storageKey] = lock.id;
          container.lock = lock;
          container.trigger('acquired');
          container.startPolling();
        }
      });
    },
    startPolling: function startPolling() {
      if (!this.pollingInteval) {
        this.pollingInteval = setInterval(_.bind(function () {
          this.acquire({
            polling: true
          });
        }, this), state.config.editLockPollingIntervalInSeconds * 1000);
      }
    },
    stopPolling: function stopPolling() {
      if (this.pollingInteval) {
        clearInterval(this.pollingInteval);
        this.pollingInteval = null;
      }
    },
    watchForErrors: function watchForErrors() {
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
    release: function release() {
      if (this.lock) {
        var promise = this.lock.destroy();
        delete sessionStorage[this.storageKey];
        this.lock = null;
        return promise;
      }
    },
    handleConflict: function handleConflict(xhr, settings) {
      this.lock = null;
      this.trigger('locked', xhr.responseJSON || {}, {
        context: settings.url.match(/\/edit_lock/) && !settings.polling ? 'acquire' : 'other'
      });
      this.stopPolling();
    },
    handleUnauthenticated: function handleUnauthenticated() {
      this.stopPolling();
      this.trigger('unauthenticated');
    },
    handleError: function handleError() {}
  });
  var Site = Backbone.Model.extend({
    modelName: 'site',
    i18nKey: 'pageflow/site',
    collectionName: 'sites'
  });
  var ChapterConfiguration = Configuration.extend({
    modelName: 'chapter',
    i18nKey: 'pageflow/chapter',
    defaults: {}
  });
  var Widget = Backbone.Model.extend({
    paramRoot: 'widget',
    i18nKey: 'pageflow/widget',
    initialize: function initialize(attributes, options) {
      this.widgetTypes = options.widgetTypes;
      this.configuration = new WidgetConfiguration(this.get('configuration') || {});
      this.configuration.parent = this;
      this.listenTo(this.configuration, 'change', function () {
        this.trigger('change:configuration', this);
      });
    },
    widgetType: function widgetType() {
      return this.get('type_name') && this.widgetTypes.findByName(this.get('type_name'));
    },
    defineConfigurationEditorTabViewGroups: function defineConfigurationEditorTabViewGroups(groups) {
      this.widgetType() && this.widgetType().defineConfigurationEditorTabViewGroups(groups);
    },
    hasConfiguration: function hasConfiguration() {
      return !!(this.widgetType() && this.widgetType().hasConfiguration());
    },
    role: function role() {
      return this.id;
    },
    urlRoot: function urlRoot() {
      return this.collection.url();
    },
    toJSON: function toJSON() {
      return {
        role: this.role(),
        type_name: this.get('type_name'),
        configuration: this.configuration.toJSON()
      };
    }
  });
  var Search = Backbone.Model.extend({
    defaults: {
      term: '',
      order: 'alphabetical'
    },
    initialize: function initialize(attrs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.attribute = options.attribute;
      this.storageKey = options.storageKey;
      this.comparators = {
        alphabetical: function alphabetical(file) {
          var fileName = file.get('display_name');
          return fileName && fileName.toLowerCase ? fileName.toLowerCase() : fileName;
        },
        most_recent: function most_recent(file) {
          var date = file.get('created_at');
          return date ? -new Date(date).getTime() : -file.id;
        }
      };
      this.orderAttributes = {
        alphabetical: 'display_name',
        most_recent: 'created_at'
      };
      if (this.storageKey) {
        var storage = this.getLocalStorage();
        if (storage && storage[this.storageKey]) {
          this.set('order', storage[this.storageKey]);
        }
        this.on('change:order', function () {
          var storage = this.getLocalStorage();
          if (storage) {
            storage[this.storageKey] = this.get('order');
          }
        });
      }
    },
    getLocalStorage: function getLocalStorage() {
      try {
        return window.localStorage;
      } catch (e) {
        return null;
      }
    },
    matches: function matches(model) {
      var term = (this.get('term') || '').toLowerCase();
      var value = (model.get(this.attribute) || '').toLowerCase();
      return value.indexOf(term) >= 0;
    },
    applyTo: function applyTo(collection) {
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
  var ListHighlight = Backbone.Model.extend({
    defaults: {
      active: false
    },
    initialize: function initialize(attrs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.collection = options.collection;
    },
    next: function next() {
      this._move(1);
    },
    previous: function previous() {
      this._move(-1);
    },
    triggerSelect: function triggerSelect() {
      var id = this.get('currentId');
      if (id != null) {
        this.trigger("selected:".concat(id));
      }
    },
    _move: function _move(delta) {
      var collection = this.collection;
      var length = collection.length;
      if (!length) {
        return;
      }
      var currentId = this.get('currentId');
      var currentModel = currentId != null ? collection.get(currentId) : null;
      var index = currentModel ? collection.indexOf(currentModel) : -1;
      if (index === -1) {
        index = delta > 0 ? 0 : length - 1;
      } else {
        index = (index + delta + length) % length;
      }
      this.set('currentId', collection.at(index).id);
    }
  });
  var StorylineTransitiveChildPages = function StorylineTransitiveChildPages(storyline, storylines, pages) {
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
  var FileUploader = BaseObject.extend({
    initialize: function initialize(options) {
      this.fileTypes = options.fileTypes;
      this.entry = options.entry;
      this.deferreds = [];
    },
    add: function add(upload, options) {
      options = options || {};
      var editor$1 = options.editor || editor;
      var fileType = this.fileTypes.findByUpload(upload);
      var file = new fileType.model({
        state: 'uploadable',
        file_name: upload.name,
        display_name: upload.name,
        content_type: upload.type,
        file_size: upload.size
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
    submit: function submit() {
      _(this.deferreds).invoke('resolve');
      this.deferreds = [];
    },
    abort: function abort() {
      _(this.deferreds).invoke('reject');
      this.deferreds = [];
    }
  });
  var orderedCollection = {
    initialize: function initialize() {
      if (this.autoConsolidatePositions !== false) {
        this.listenTo(this, 'remove', function () {
          this.consolidatePositions();
          this.saveOrder();
        });
      }
    },
    consolidatePositions: function consolidatePositions() {
      this.each(function (item, index) {
        item.set('position', index);
      });
    },
    saveOrder: function saveOrder() {
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
        success: function success(response) {
          parentModel.trigger('sync', parentModel, response, {});
          parentModel.trigger('sync:order', parentModel, response, {});
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          editor.failures.add(new OrderingFailure(parentModel, collection));
        }
      });
    }
  };
  var ChapterPagesCollection = SubsetCollection.extend({
    mixins: [orderedCollection],
    constructor: function constructor(options) {
      var chapter = options.chapter;
      SubsetCollection.prototype.constructor.call(this, {
        parent: options.pages,
        parentModel: chapter,
        filter: function filter(item) {
          return !chapter.isNew() && item.get('chapter_id') === chapter.id;
        },
        comparator: function comparator(item) {
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
  var Chapter = Backbone.Model.extend({
    modelName: 'chapter',
    paramRoot: 'chapter',
    i18nKey: 'pageflow/chapter',
    mixins: [configurationContainer({
      autoSave: true,
      includeAttributesInJSON: true,
      configurationModel: ChapterConfiguration
    }), failureTracking, delayedDestroying],
    initialize: function initialize(attributes, options) {
      this.pages = new ChapterPagesCollection({
        pages: options.pages || state.pages,
        chapter: this
      });
      this.listenTo(this, 'change:title', function () {
        this.save();
      });
    },
    urlRoot: function urlRoot() {
      return this.isNew() ? this.collection.url() : '/chapters';
    },
    storylinePosition: function storylinePosition() {
      return this.storyline && this.storyline.get('position') || -1;
    },
    addPage: function addPage(attributes) {
      var page = this.buildPage(attributes);
      page.save();
      return page;
    },
    buildPage: function buildPage(attributes) {
      var defaults = {
        chapter_id: this.id,
        position: this.pages.length
      };
      return this.pages.addAndReturnModel(_.extend(defaults, attributes));
    },
    toJSON: function toJSON() {
      return _.extend(_.clone(this.attributes), {
        configuration: this.configuration.toJSON()
      });
    },
    destroy: function destroy() {
      this.destroyWithDelay();
    }
  });
  var StorylineChaptersCollection = SubsetCollection.extend({
    mixins: [orderedCollection],
    constructor: function constructor(options) {
      var storyline = options.storyline;
      SubsetCollection.prototype.constructor.call(this, {
        parent: options.chapters,
        parentModel: storyline,
        filter: function filter(item) {
          return !storyline.isNew() && item.get('storyline_id') === storyline.id;
        },
        comparator: function comparator(item) {
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
  var Storyline = Backbone.Model.extend({
    modelName: 'storyline',
    paramRoot: 'storyline',
    i18nKey: 'pageflow/storyline',
    mixins: [configurationContainer({
      autoSave: true,
      configurationModel: StorylineConfiguration
    }), failureTracking, delayedDestroying],
    initialize: function initialize(attributes, options) {
      this.chapters = new StorylineChaptersCollection({
        chapters: options.chapters || state.chapters,
        storyline: this
      });
      this.listenTo(this, 'change:configuration:main', function (model, value) {
        this.trigger('change:main', this, value);
      });
    },
    urlRoot: function urlRoot() {
      return this.isNew() ? this.collection.url() : '/storylines';
    },
    displayTitle: function displayTitle() {
      return _([this.title() || !this.isMain() && I18n$1.t('pageflow.storylines.untitled'), this.isMain() && I18n$1.t('pageflow.storylines.main')]).compact().join(' - ');
    },
    title: function title() {
      return this.configuration.get('title');
    },
    isMain: function isMain() {
      return !!this.configuration.get('main');
    },
    lane: function lane() {
      return this.configuration.get('lane');
    },
    row: function row() {
      return this.configuration.get('row');
    },
    parentPagePermaId: function parentPagePermaId() {
      return this.configuration.get('parent_page_perma_id');
    },
    parentPage: function parentPage() {
      return state.pages.getByPermaId(this.parentPagePermaId());
    },
    transitiveChildPages: function transitiveChildPages() {
      return new StorylineTransitiveChildPages(this, state.storylines, state.pages);
    },
    addChapter: function addChapter(attributes) {
      var chapter = this.buildChapter(attributes);
      chapter.save();
      return chapter;
    },
    buildChapter: function buildChapter(attributes) {
      var defaults = {
        storyline_id: this.id,
        title: '',
        position: this.chapters.length
      };
      return this.chapters.addAndReturnModel(_.extend(defaults, attributes));
    },
    scaffoldChapter: function scaffoldChapter(options) {
      var scaffold = new ChapterScaffold(this, options);
      scaffold.create();
      return scaffold;
    },
    destroy: function destroy() {
      this.destroyWithDelay();
    }
  });
  var PageLink = Backbone.Model.extend({
    mixins: [transientReferences],
    i18nKey: 'pageflow/page_link',
    targetPage: function targetPage() {
      return state.pages.getByPermaId(this.get('target_page_id'));
    },
    label: function label() {
      return this.get('label');
    },
    editPath: function editPath() {
      return '/page_links/' + this.id;
    },
    getPageId: function getPageId() {
      return this.collection.page.id;
    },
    toSerializedJSON: function toSerializedJSON() {
      return _.omit(this.attributes, 'highlighted', 'position');
    },
    highlight: function highlight() {
      this.set('highlighted', true);
    },
    resetHighlight: function resetHighlight() {
      this.unset('highlighted');
    },
    remove: function remove() {
      this.collection.remove(this);
    }
  });
  var PageLinkFileSelectionHandler = function PageLinkFileSelectionHandler(options) {
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
  var persistedPromise = {
    persisted: function persisted() {
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
  var filesCountWatcher = {
    watchFileCollection: function watchFileCollection(name, collection) {
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
    updateFilesCounts: function updateFilesCounts(name, collection) {
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
    updateFilesCount: function updateFilesCount(trait, name, collection, filter) {
      this.set(trait + '_' + name + '_count', collection.filter(filter).length);
      this.set(trait + '_files_count', _.reduce(this.watchedFileCollectionNames, function (sum, name) {
        return sum + this.get(trait + '_' + name + '_count');
      }, 0, this));
    }
  };
  var fileWithType = {};
  var polling = {
    togglePolling: function togglePolling(enabled) {
      if (enabled) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    },
    startPolling: function startPolling() {
      if (!this.pollingInterval) {
        this.pollingInterval = setInterval(_.bind(function () {
          this.fetch();
        }, this), 1000);
      }
    },
    stopPolling: function stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    }
  };
  var Entry = Backbone.Model.extend({
    paramRoot: 'entry',
    urlRoot: '/editor/entries',
    modelName: 'entry',
    i18nKey: 'pageflow/entry',
    collectionName: 'entries',
    mixins: [filesCountWatcher, polling, failureTracking],
    initialize: function initialize(attributes, options) {
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
      this.fileTypes = options.fileTypes || editor.fileTypes;
      this.storylines = options.storylines || state.storylines;
      this.storylines.parentModel = this;
      this.chapters = options.chapters || state.chapters;
      this.chapters.parentModel = this;
      this.pages = state.pages;
      this.widgets = options.widgets;
      this.imageFiles = state.imageFiles;
      this.videoFiles = state.videoFiles;
      this.audioFiles = state.audioFiles;
      this.fileTypes.each(function (fileType) {
        this.watchFileCollection(fileType.collectionName, this.getFileCollection(fileType));
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
    getTheme: function getTheme() {
      return this.themes.findByName(this.metadata.get('theme_name'));
    },
    supportsPhoneEmulation: function supportsPhoneEmulation() {
      return true;
    },
    addStoryline: function addStoryline(attributes) {
      var storyline = this.buildStoryline(attributes);
      storyline.save();
      return storyline;
    },
    buildStoryline: function buildStoryline(attributes) {
      var defaults = {
        title: ''
      };
      return this.storylines.addAndReturnModel(_.extend(defaults, attributes));
    },
    scaffoldStoryline: function scaffoldStoryline(options) {
      var scaffold = new StorylineScaffold(this, options);
      scaffold.create();
      return scaffold;
    },
    addChapterInNewStoryline: function addChapterInNewStoryline(options) {
      return this.scaffoldStoryline(_.extend({
        depth: 'chapter'
      }, options)).chapter;
    },
    addPageInNewStoryline: function addPageInNewStoryline(options) {
      return this.scaffoldStoryline(_.extend({
        depth: 'page'
      }, options)).page;
    },
    reuseFile: function reuseFile(otherEntry, file) {
      var entry = this;
      FileReuse.submit(otherEntry, file, {
        entry: entry,
        success: function success(model, response) {
          entry._setFiles(response, {
            merge: false,
            remove: false
          });
          entry.trigger('use:files');
        }
      });
    },
    getFileCollection: function getFileCollection(fileTypeOrFileTypeName) {
      return this.files[fileTypeOrFileTypeName.collectionName || fileTypeOrFileTypeName];
    },
    pollForPendingFiles: function pollForPendingFiles() {
      this.listenTo(this, 'change:pending_files_count', function (model, value) {
        this.togglePolling(value > 0);
      });
      this.togglePolling(this.get('pending_files_count') > 0);
    },
    parse: function parse(response, options) {
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
    _setFiles: function _setFiles(response, options) {
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
    toJSON: function toJSON() {
      var metadataJSON = this.metadata.toJSON();
      var configJSON = this.metadata.configuration.toJSON();
      metadataJSON.configuration = configJSON;
      return metadataJSON;
    }
  });
  var AuthenticationProvider = BaseObject.extend({
    authenticate: function authenticate(parent, provider) {
      this.authenticationPopup('/auth/' + provider, 800, 600);
      this.authParent = parent;
    },
    authenticationPopup: function authenticationPopup(linkUrl, width, height) {
      var sep = linkUrl.indexOf('?') !== -1 ? '&' : '?',
        url = linkUrl + sep + 'popup=true',
        left = (screen.width - width) / 2 - 16,
        top = (screen.height - height) / 2 - 50,
        windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
      return window.open(url, 'authPopup', windowFeatures);
    },
    authenticateCallback: function authenticateCallback() {
      this.authParent.authenticateCallback();
    }
  });
  var authenticationProvider = new AuthenticationProvider();
  var FileImport = Backbone.Model.extend({
    modelName: 'file_import',
    action: 'search',
    url: function url() {
      var slug = this.get('currentEntry').get('slug');
      return '/editor/entries/' + slug + '/file_import/' + this.importer.key + '/' + this.action;
    },
    initialize: function initialize(options) {
      this.importer = options.importer;
      this.set('selectedFiles', []);
      this.set('currentEntry', options.currentEntry);
      this.authenticationInterval = setInterval(this.authenticate.bind(this), 2000);
    },
    authenticate: function authenticate() {
      if (!this.popUped) {
        if (this.importer.authenticationRequired) {
          authenticationProvider.authenticate(this, this.importer.authenticationProvider);
          this.popUped = true;
        } else {
          this.authenticateCallback();
        }
      }
    },
    authenticateCallback: function authenticateCallback() {
      clearInterval(this.authenticationInterval);
      this.set('isAuthenticated', true);
      this.importer.authenticationRequired = false;
      this.popUped = false;
    },
    createFileImportDialogView: function createFileImportDialogView() {
      return this.importer.createFileImportDialogView(this);
    },
    select: function select(options) {
      if (options instanceof Backbone.Model) {
        this.get('selectedFiles').push(options);
        this.trigger('change');
      }
    },
    unselect: function unselect(options) {
      var index = this.get('selectedFiles').indexOf(options);
      this.get('selectedFiles').splice(index, 1);
      this.trigger('change');
    },
    clearSelections: function clearSelections() {
      this.set('selectedFiles', []);
    },
    search: function search(query) {
      this.action = 'search/?query=' + query;
      return this.fetchData();
    },
    fetchData: function fetchData(options) {
      return this.fetch(options).then(function (data) {
        if (data && data.data) {
          return data.data;
        }
      });
    },
    getFilesMetaData: function getFilesMetaData(options) {
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
    cancelImport: function cancelImport(collectionName) {
      var selections = state.files[collectionName].uploadable();
      selections.each(function (selection) {
        selection.destroy();
      });
      selections.clear();
    },
    startImportJob: function startImportJob(collectionName) {
      this.action = 'start_import_job';
      var fileType = editor.fileTypes.findByCollectionName(collectionName);
      var currentEntry = this.get('currentEntry');
      var selections = currentEntry.getFileCollection(fileType).uploadable();
      this.sync('create', this, {
        attrs: {
          collection: collectionName,
          files: selections.toJSON().map(function (item, index) {
            return _objectSpread2$2(_objectSpread2$2({}, item), {}, {
              url: selections.at(index).get('source_url')
            });
          })
        },
        success: function success(items) {
          items.forEach(function (item) {
            var file = selections.find(function (file) {
              return file.get('source_url') == item.source_url;
            });
            if (file) {
              file.set(item.attributes);
            }
          });
        }
      });
    }
  });
  var ChaptersCollection = Backbone.Collection.extend({
    model: Chapter,
    url: '/chapters',
    comparator: function comparator(chapter) {
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
  var ForeignKeySubsetCollection = SubsetCollection.extend({
    mixins: [orderedCollection],
    constructor: function constructor(options) {
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
        parent: parent,
        parentModel: parentModel,
        filter: function filter(item) {
          return !parentModel.isNew() && item.get(options.foreignKeyAttribute) === parentModel.id;
        },
        comparator: function comparator(item) {
          return item.get('position');
        }
      });
      this.listenTo(parentModel, 'destroy dependentDestroy', function () {
        this.invoke('trigger', 'dependentDestroy');
        this.clear();
      });
      if (options.parentReferenceAttribute) {
        this.each(function (model) {
          return model[options.parentReferenceAttribute] = parentModel;
        });
        this.listenTo(this, 'remove', function (model) {
          model[options.parentReferenceAttribute] = null;
        });
      }
    }
  });
  var PageLinksCollection = Backbone.Collection.extend({
    model: PageLink,
    initialize: function initialize(models, options) {
      this.configuration = options.configuration;
      this.page = options.configuration.page;
      this.load();
      this.listenTo(this, 'add remove change', this.save);
      this.listenTo(this.configuration, 'change:page_links', this.load);
    },
    addLink: function addLink(targetPageId) {
      this.addWithPosition(this.defaultPosition(), targetPageId);
    },
    canAddLink: function canAddLink(targetPageId) {
      return true;
    },
    updateLink: function updateLink(link, targetPageId) {
      link.set('target_page_id', targetPageId);
    },
    removeLink: function removeLink(link) {
      this.remove(link);
    },
    addWithPosition: function addWithPosition(position, targetPageId) {
      this.add(this.pageLinkAttributes(position, targetPageId));
    },
    removeByPosition: function removeByPosition(position) {
      this.remove(this.findByPosition(position));
    },
    findByPosition: function findByPosition(position) {
      return this.findWhere({
        position: position
      });
    },
    load: function load() {
      this.set(this.pageLinksAttributes());
    },
    save: function save() {
      this.configuration.set('page_links', this.map(function (pageLink) {
        return pageLink.toSerializedJSON();
      }));
    },
    defaultPosition: function defaultPosition() {
      return Math.max(0, _.max(this.map(function (pageLink) {
        return pageLink.get('position');
      }))) + 1;
    },
    pageLinksAttributes: function pageLinksAttributes() {
      return this.configuration.get('page_links') || [];
    },
    pageLinkAttributes: function pageLinkAttributes(position, targetPageId, id) {
      return {
        id: id || this.getUniqueId(),
        target_page_id: targetPageId,
        position: position
      };
    },
    /** @private */
    getUniqueId: function getUniqueId() {
      var maxId = Math.max(0, _.max(this.map(function (pageLink) {
        return parseInt(pageLink.id.split(':').pop(), 10);
      })));
      return this.configuration.page.get('perma_id') + ':' + (maxId + 1);
    }
  });
  var OtherEntriesCollection = Backbone.Collection.extend({
    model: OtherEntry,
    url: '/editor/entries',
    initialize: function initialize(models, options) {
      options = options || {};
      this.excludeEntry = options.excludeEntry;
    },
    // override parse method to exclude the entry being edited. This is the collection
    // of the "other" entries, after all.
    parse: function parse(response) {
      var excludeEntry = this.getExcludeEntry(),
        filteredResponse = _.filter(response, function (entry) {
          return entry.id != excludeEntry.id;
        });
      return Backbone.Collection.prototype.parse.call(this, filteredResponse);
    },
    getExcludeEntry: function getExcludeEntry() {
      return this.excludeEntry || state.entry;
    }
  });
  var StorylinesCollection = Backbone.Collection.extend({
    autoConsolidatePositions: false,
    mixins: [orderedCollection],
    model: Storyline,
    url: function url() {
      return '/entries/' + state.entry.get('id') + '/storylines';
    },
    initialize: function initialize() {
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
    main: function main() {
      return this.find(function (storyline) {
        return storyline.configuration.get('main');
      }) || this.first();
    },
    comparator: function comparator(chapter) {
      return chapter.get('position');
    }
  });
  var OrderedPageLinksCollection = PageLinksCollection.extend({
    comparator: 'position',
    saveOrder: function saveOrder() {
      this.save();
    }
  });
  var PagesCollection = Backbone.Collection.extend({
    model: Page,
    url: '/pages',
    comparator: function comparator(pageA, pageB) {
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
    getByPermaId: function getByPermaId(permaId) {
      return this.findWhere({
        perma_id: parseInt(permaId, 10)
      });
    },
    persisted: function persisted() {
      if (!this._persisted) {
        this._persisted = new SubsetCollection({
          parent: this,
          sortOnParentSort: true,
          filter: function filter(page) {
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
  var ThemesCollection = Backbone.Collection.extend({
    model: Theme,
    findByName: function findByName(name) {
      var theme = this.findWhere({
        name: name
      });
      if (!theme) {
        throw new Error('Found no theme by name ' + name);
      }
      return theme;
    }
  });
  var WidgetsCollection = Backbone.Collection.extend({
    model: Widget,
    initialize: function initialize(widgets, options) {
      this.widgetTypes = options.widgetTypes;
      this.listenTo(this, 'change:type_name change:configuration', function () {
        this.batchSave();
      });
    },
    url: function url() {
      return '/editor/subjects/entries/' + this.subject.id + '/widgets';
    },
    batchSave: function batchSave(options) {
      var subject = this.subject;
      return Backbone.sync('patch', subject, _.extend(options || {}, {
        url: this.url() + '/batch',
        attrs: {
          widgets: this.map(function (widget) {
            return widget.toJSON();
          })
        },
        success: function success(response) {
          subject.trigger('sync:widgets', subject, response, {});
        }
      }));
    },
    setupConfigurationEditorTabViewGroups: function setupConfigurationEditorTabViewGroups(groups) {
      var _this = this;
      this.defineConfigurationEditorTabViewGroups(groups);
      this.listenTo(this, 'change:type_name', function () {
        return _this.defineConfigurationEditorTabViewGroups(groups);
      });
    },
    defineConfigurationEditorTabViewGroups: function defineConfigurationEditorTabViewGroups(groups) {
      this.widgetTypes.defineStubConfigurationEditorTabViewGroups(groups);
      this.each(function (widget) {
        return widget.defineConfigurationEditorTabViewGroups(groups);
      });
    },
    withInsertPoint: function withInsertPoint(insertPoint) {
      return new SubsetCollection({
        parent: this,
        watchAttribute: 'type_name',
        filter: function filter(widget) {
          return widget.widgetType() && widget.widgetType().insertPoint === insertPoint;
        }
      });
    }
  });
  var addAndReturnModel = {
    // Backbone's add does not return the added model. push returns the
    // model but does not trigger sort.
    addAndReturnModel: function addAndReturnModel(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    }
  };
  Cocktail.mixin(Backbone.Collection, addAndReturnModel);
  var SidebarRouter = Marionette.AppRouter.extend({
    appRoutes: {
      'widgets/:id': 'widget',
      'files/:collectionName?handler=:handler&payload=:payload&filter=:filter': 'files',
      'files/:collectionName?handler=:handler&payload=:payload': 'files',
      'files/:collectionName': 'files',
      'files': 'files',
      'confirmable_files?type=:type&id=:id': 'confirmableFiles',
      'confirmable_files': 'confirmableFiles',
      'meta_data': 'metaData',
      'meta_data/:tab': 'metaData',
      'publish': 'publish',
      '?storyline=:id': 'index',
      '.*': 'index'
    }
  });
  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit$1(arr, i) {
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
  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }
  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
  }
  function template$g(data) {
    var __t,
      __p = '';
    __p += '<a class="back">' + ((__t = I18n.t('pageflow.editor.templates.back_button_decorator.outline')) == null ? '' : __t) + '</a>\n<div class="outlet"></div>\n';
    return __p;
  }
  var BackButtonDecoratorView = Marionette.Layout.extend({
    template: template$g,
    className: 'back_button_decorator',
    events: {
      'click a.back': 'goBack'
    },
    regions: {
      outlet: '.outlet'
    },
    onRender: function onRender() {
      this.outlet.show(this.options.view);
    },
    goBack: function goBack() {
      this.options.view.onGoBack && this.options.view.onGoBack();
      editor.navigate('/', {
        trigger: true
      });
    }
  });
  function template$1$1(data) {
    var __t,
      __p = '';
    __p += '<input type="checkbox">\n<label class="file_name"></label>\n<span class="duration"></span>\n\n<div class="actions">\n  <a class="remove" title="' + ((__t = I18n.t('pageflow.editor.templates.confirmable_file_item.remove')) == null ? '' : __t) + '"></a>\n</div>\n';
    return __p;
  }
  var ConfirmableFileItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: template$1$1,
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
    onRender: function onRender() {
      this.ui.label.attr('for', this.cid);
      this.ui.checkBox.attr('id', this.cid);
      this.ui.checkBox.prop('checked', this.options.selectedFiles.contains(this.model));
      this.ui.fileName.text(this.model.title());
      this.ui.duration.text(this.model.get('duration') || '-');
    },
    destroy: function destroy() {
      if (confirm("Datei wirklich wirklich löschen?")) {
        this.model.destroy();
      }
    },
    updateSelection: function updateSelection() {
      if (this.ui.checkBox.is(':checked')) {
        this.options.selectedFiles.add(this.model);
      } else {
        this.options.selectedFiles.remove(this.model);
      }
    }
  });
  function template$2$1(data) {
    var __t,
      __p = '';
    __p += '<div class="blank_slate">\n  <p>\n      ' + ((__t = I18n.t('pageflow.editor.templates.confirm_encoding.all_released')) == null ? '' : __t) + '\n  </p>\n  <p>\n      ' + ((__t = I18n.t('pageflow.editor.templates.confirm_encoding.link_to_progress', {
      link: '<a href="#/files/video_files">' + I18n.t('pageflow.editor.templates.confirm_encoding.manage_files') + '</a>'
    })) == null ? '' : __t) + '\n  </p>\n</div>\n\n<div class="intro">\n</div>\n\n<div class="video_files_panel">\n  <h2 class="sidebar-header">\n    ' + ((__t = I18n.t('pageflow.editor.templates.confirm_encoding.videos_tab')) == null ? '' : __t) + '\n  </h2>\n</div>\n\n<div class="audio_files_panel">\n  <h2 class="sidebar-header">\n    ' + ((__t = I18n.t('pageflow.editor.templates.confirm_encoding.audios_tab')) == null ? '' : __t) + '\n  </h2>\n</div>\n\n<div class="summary">\n</div>\n<button class="confirm">' + ((__t = I18n.t('pageflow.editor.templates.confirm_encoding.confirm_button')) == null ? '' : __t) + '</button>\n';
    return __p;
  }
  var ConfirmEncodingView = Marionette.ItemView.extend({
    template: template$2$1,
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
      'click button': function clickButton() {
        this.model.saveAndReset();
      }
    },
    initialize: function initialize() {
      this.confirmableVideoFiles = state.videoFiles.confirmable();
      this.confirmableAudioFiles = state.audioFiles.confirmable();
    },
    onRender: function onRender() {
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
    update: function update() {
      this.updateBlankSlate();
      this.updateSummary();
    },
    updateBlankSlate: function updateBlankSlate() {
      this.ui.blankSlate.toggle(!this.confirmableVideoFiles.length && !this.confirmableAudioFiles.length);
      this.ui.intro.toggle(!!this.confirmableVideoFiles.length || !!this.confirmableAudioFiles.length);
      this.ui.videoFilesPanel.toggle(!!this.confirmableVideoFiles.length);
      this.ui.audioFilesPanel.toggle(!!this.confirmableAudioFiles.length);
    },
    updateSummary: function updateSummary(enabled) {
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
  function modelLifecycleTrackingView(_ref) {
    var classNames = _ref.classNames;
    return {
      events: _defineProperty$2({}, "click .".concat(classNames.retryButton), function click() {
        editor.failures.retry();
        return false;
      }),
      initialize: function initialize() {
        var _this = this;
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
          this.listenTo(this.model, 'change:failed', function () {
            return _this.updateFailIndicator();
          });
        }
      },
      render: function render() {
        if (this.model.isNew()) {
          this.$el.addClass(classNames.creating);
        }
        if (this.model.isDestroying && this.model.isDestroying()) {
          this.$el.addClass(classNames.destroying);
        }
        this.updateFailIndicator();
      },
      updateFailIndicator: function updateFailIndicator() {
        if (classNames.failed) {
          this.$el.toggleClass(classNames.failed, this.model.isFailed());
        }
        if (classNames.failureMessage) {
          this.$el.find(".".concat(classNames.failureMessage)).text(this.model.getFailureMessage());
        }
      }
    };
  }
  var failureIndicatingView = modelLifecycleTrackingView({
    classNames: {
      failed: 'failed',
      failureMessage: 'failure .message',
      retryButton: 'retry'
    }
  });
  function template$3$1(data) {
    var __t,
      __p = '';
    __p += '<a class="close" href="#">' + ((__t = I18n.t('pageflow.editor.templates.edit_entry.close')) == null ? '' : __t) + '</a>\n<a class="publish" href="#" data-tooltip-align="bottom right">\n  ' + ((__t = I18n.t('pageflow.editor.templates.edit_entry.publish')) == null ? '' : __t) + '\n</a>\n\n<ul class="menu">\n  <li>\n    <a class="edit_entry_meta_data" href="#" data-path="/meta_data">' + ((__t = I18n.t('pageflow.editor.templates.edit_entry.metadata')) == null ? '' : __t) + '</a>\n    <span class="failure_icon" title="' + ((__t = I18n.t('pageflow.editor.templates.edit_entry.save_error')) == null ? '' : __t) + '" />\n  </li>\n  <li>\n    <a class="manage_files" href="#" data-path="/files">' + ((__t = I18n.t('pageflow.editor.templates.edit_entry.manage_files')) == null ? '' : __t) + '</a>\n  </li>\n</ul>\n\n<div class="edit_entry_outline_region"></div>\n';
    return __p;
  }
  var EditEntryView = Marionette.Layout.extend({
    template: template$3$1,
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
      'click a.close': function clickAClose() {
        $.when(state.editLock.release()).then(function () {
          window.location = '/admin/entries/' + state.entry.id;
        });
      },
      'click a.publish': function clickAPublish() {
        if (!this.ui.publishButton.hasClass('disabled')) {
          editor.navigate('/publish', {
            trigger: true
          });
        }
        return false;
      },
      'click .menu a': function clickMenuA(event) {
        editor.navigate($(event.target).data('path'), {
          trigger: true
        });
        return false;
      }
    },
    onRender: function onRender() {
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
    _updatePublishButton: function _updatePublishButton() {
      var disabled = !this.model.get('publishable');
      this.ui.publishButton.toggleClass('disabled', disabled);
      if (disabled) {
        this.ui.publishButton.attr('data-tooltip', 'pageflow.editor.views.edit_entry_view.cannot_publish');
      } else {
        this.ui.publishButton.removeAttr('data-tooltip');
      }
    },
    _addMenuItems: function _addMenuItems() {
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
        view.ui.menu.append(item);
      });
    }
  });
  function template$4$1(data) {
    var __t,
      __p = '';
    __p += '<div class="widget_type">\n</div>\n<a class="settings" title="' + ((__t = I18n.t('pageflow.editor.templates.widget_item.settings')) == null ? '' : __t) + '"></a>\n';
    return __p;
  }
  var WidgetItemView = Marionette.Layout.extend({
    template: template$4$1,
    tagName: 'li',
    className: 'widget_item',
    regions: {
      widgetTypeContainer: '.widget_type'
    },
    modelEvents: {
      'change:type_name': 'update'
    },
    events: {
      'click .settings': function clickSettings() {
        editor.navigate('/widgets/' + this.model.role(), {
          trigger: true
        });
        return false;
      }
    },
    onRender: function onRender() {
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
    update: function update() {
      this.$el.toggleClass('has_settings', this.model.hasConfiguration());
    }
  });
  function template$5$1(data) {
    var __p = '';
    __p += '<ol class="widgets">\n</ol>\n';
    return __p;
  }
  var EditWidgetsView = Marionette.Layout.extend({
    template: template$5$1,
    ui: {
      widgets: '.widgets'
    },
    onRender: function onRender() {
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
  function template$6$1(data) {
    var __p = '';
    __p += '<div class="image"></div>\n<div class="label"></div>\n';
    return __p;
  }
  var BackgroundPositioningPreviewView = Marionette.ItemView.extend({
    template: template$6$1,
    className: 'preview',
    modelEvents: {
      change: 'update'
    },
    ui: {
      image: '.image',
      label: '.label'
    },
    onRender: function onRender() {
      this.update();
    },
    update: function update() {
      var ratio = this.options.ratio;
      var max = this.options.maxSize;
      var width = ratio > 1 ? max : max * ratio;
      var height = ratio > 1 ? max / ratio : max;
      this.ui.image.css({
        width: width + 'px',
        height: height + 'px',
        backgroundImage: this.imageValue(),
        backgroundPosition: this.model.getFilePosition(this.options.propertyName, 'x') + '% ' + this.model.getFilePosition(this.options.propertyName, 'y') + '%'
      });
      this.ui.label.text(this.options.label);
    },
    imageValue: function imageValue() {
      var file = this.model.getReference(this.options.propertyName, this.options.filesCollection);
      return file ? 'url("' + file.getBackgroundPositioningImageUrl() + '")' : 'none';
    }
  });
  function template$7$1(data) {
    var __p = '';
    __p += '<div class="container">\n  <div class="slider horizontal">\n  </div>\n  <div class="slider vertical">\n  </div>\n  <div class="percent horizontal">\n    <input type="number" min="0" max="100">\n    %\n  </div>\n  <div class="percent vertical">\n    <input type="number" min="0" max="100">\n    %\n  </div>\n</div>\n';
    return __p;
  }
  var BackgroundPositioningSlidersView = Marionette.ItemView.extend({
    template: template$7$1,
    className: '',
    ui: {
      container: '.container',
      sliderHorizontal: '.horizontal.slider',
      sliderVertical: '.vertical.slider',
      inputHorizontal: '.percent.horizontal input',
      inputVertical: '.percent.vertical input'
    },
    events: {
      'mousedown img': function mousedownImg(event) {
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
      'dragstart img': function dragstartImg(event) {
        event.preventDefault();
      }
    },
    modelEvents: {
      change: 'update'
    },
    onRender: function onRender() {
      var view = this;
      var file = this.model.getReference(this.options.propertyName, this.options.filesCollection),
        image = $('<img />').attr('src', file.getBackgroundPositioningImageUrl());
      this.ui.container.append(image);
      this.ui.sliderVertical.slider({
        orientation: 'vertical',
        change: function change(event, ui) {
          view.save('y', 100 - ui.value);
        },
        slide: function slide(event, ui) {
          view.save('y', 100 - ui.value);
        }
      });
      this.ui.sliderHorizontal.slider({
        orientation: 'horizontal',
        change: function change(event, ui) {
          view.save('x', ui.value);
        },
        slide: function slide(event, ui) {
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
    update: function update() {
      var x = this.model.getFilePosition(this.options.propertyName, 'x');
      var y = this.model.getFilePosition(this.options.propertyName, 'y');
      this.ui.sliderVertical.slider('value', 100 - y);
      this.ui.sliderHorizontal.slider('value', x);
      this.ui.inputVertical.val(y);
      this.ui.inputHorizontal.val(x);
    },
    saveFromEvent: function saveFromEvent(event) {
      var x = event.pageX - this.ui.container.offset().left;
      var y = event.pageY - this.ui.container.offset().top;
      this.save('x', Math.round(x / this.ui.container.width() * 100));
      this.save('y', Math.round(y / this.ui.container.width() * 100));
    },
    save: function save(coord, value) {
      this.model.setFilePosition(this.options.propertyName, coord, Math.min(100, Math.max(0, value)));
    }
  });
  var dialogView = {
    events: {
      'mousedown': function mousedown(event) {
        if (!event.target.closest(".box")) {
          this.close();
        }
      },
      'click .close': function clickClose() {
        this.close();
      },
      'click .box': function clickBox() {
        return false;
      }
    }
  };
  function template$8$1(data) {
    var __t,
      __p = '';
    __p += '<div class="box">\n  <div class="content">\n    <h2 class="dialog-header">' + ((__t = I18n.t('pageflow.editor.templates.background_positioning.title')) == null ? '' : __t) + '</h2>\n    <p class="dialog-hint">' + ((__t = I18n.t('pageflow.editor.templates.background_positioning.help')) == null ? '' : __t) + '</p>\n\n    <div class="wrapper">\n    </div>\n\n    <h3>' + ((__t = I18n.t('pageflow.editor.templates.background_positioning.preview_title')) == null ? '' : __t) + '</h3>\n    <div class="previews">\n      <div>\n      </div>\n    </div>\n  </div>\n\n  <div class="footer">\n    <a href="" class="save">' + ((__t = I18n.t('pageflow.editor.templates.background_positioning.save')) == null ? '' : __t) + '</a>\n    <a href="" class="close">' + ((__t = I18n.t('pageflow.editor.templates.background_positioning.cancel')) == null ? '' : __t) + '</a>\n  </div>\n</div>\n';
    return __p;
  }
  var BackgroundPositioningView = Marionette.ItemView.extend({
    template: template$8$1,
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
      'click .save': function clickSave() {
        this.save();
        this.close();
      }
    },
    initialize: function initialize() {
      this.transientModel = this.model.clone();
    },
    onRender: function onRender() {
      this.ui.wrapper.append(this.subview(new BackgroundPositioningSlidersView({
        model: this.transientModel,
        propertyName: this.options.propertyName,
        filesCollection: this.options.filesCollection
      })).el);
      this.createPreviews();
    },
    save: function save() {
      this.model.setFilePositions(this.options.propertyName, this.transientModel.getFilePosition(this.options.propertyName, 'x'), this.transientModel.getFilePosition(this.options.propertyName, 'y'));
    },
    createPreviews: function createPreviews() {
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
  function template$9$1(data) {
    var __p = '';
    __p += '<div class="label"></div>\n<a href="#"></a>\n';
    return __p;
  }
  var DropDownButtonItemView = Marionette.ItemView.extend({
    template: template$9$1,
    tagName: 'li',
    className: 'drop_down_button_item',
    ui: {
      link: '> a',
      label: '> .label'
    },
    events: {
      'click > a': function clickA(event) {
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
    onRender: function onRender() {
      this.update();
      if (this.model.get('items')) {
        this.appendSubview(new this.options.listView({
          items: this.model.get('items')
        }));
      }
    },
    update: function update() {
      this.ui.link.text(this.model.get('label'));
      this.ui.label.text(this.model.get('label'));
      this.$el.toggleClass('is_selectable', !!this.model.selected);
      this.$el.toggleClass('is_disabled', !!this.model.get('disabled'));
      this.$el.toggleClass('is_hidden', !!this.model.get('hidden'));
      this.$el.toggleClass('has_check_box', this.model.get('kind') === 'checkBox');
      this.$el.toggleClass('has_radio', this.model.get('kind') === 'radio');
      this.$el.toggleClass('is_checked', !!this.model.get('checked'));
      this.$el.toggleClass('separated', !!this.model.get('separated'));
      this.$el.data('name', this.model.get('name'));
    }
  });
  var DropDownButtonItemListView = function DropDownButtonItemListView(options) {
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
  function template$a$1(data) {
    var __p = '';
    __p += '<button></button>\n\n<div class="drop_down_button_menu">\n</div>\n';
    return __p;
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
   * - `checked` - Display a check mark in front of the item
   * - `items` - A Backbone collection of nested menu items.
   *
   * If the menu item model provdised a `selected` method, it is called
   * when the menu item is clicked.
   *
   * @class
   */
  var DropDownButtonView = Marionette.ItemView.extend({
    template: template$a$1,
    className: 'drop_down_button',
    ui: {
      button: '> button',
      menu: '.drop_down_button_menu'
    },
    events: function events() {
      return _defineProperty$2(_defineProperty$2({}, this.options.openOnClick ? 'click' : 'mouseenter', function () {
        this.positionMenu();
        this.showMenu();
      }), 'mouseleave', function mouseleave() {
        this.scheduleHideMenu();
      });
    },
    onRender: function onRender() {
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
        'mouseenter': function mouseenter() {
          view.showMenu();
        },
        'mouseleave': function mouseleave() {
          view.scheduleHideMenu();
        },
        'click': function click() {
          view.hideMenu();
        }
      });
      this.ui.menu.appendTo('#editor_menu_container');
    },
    onClose: function onClose() {
      this.ui.menu.remove();
    },
    positionMenu: function positionMenu() {
      var offset = this.$el.offset();
      this.ui.menu.css({
        top: offset.top + this.$el.height(),
        left: this.options.alignMenu === 'right' ? offset.left + this.$el.width() - this.ui.menu.outerWidth() : offset.left,
        width: this.options.fullWidth ? this.$el.width() : null
      });
    },
    showMenu: function showMenu() {
      this.ensureOnlyOneDropDownButtonShowsMenu();
      clearTimeout(this.hideMenuTimeout);
      this.ui.menu.addClass('is_visible');
      this.ui.button.addClass('hover');
    },
    ensureOnlyOneDropDownButtonShowsMenu: function ensureOnlyOneDropDownButtonShowsMenu() {
      if (DropDownButtonView.currentlyShowingMenu) {
        DropDownButtonView.currentlyShowingMenu.hideMenu();
      }
      DropDownButtonView.currentlyShowingMenu = this;
    },
    hideMenu: function hideMenu() {
      clearTimeout(this.hideMenuTimeout);
      if (!this.isClosed) {
        this.ui.button.removeClass('hover');
        this.ui.menu.removeClass('is_visible');
      }
    },
    scheduleHideMenu: function scheduleHideMenu() {
      this.hideMenuTimeout = setTimeout(_.bind(this.hideMenu, this), 300);
    }
  });
  function template$b$1(data) {
    var __t,
      __p = '';
    __p += '<div class="box">\n  <div class="content">\n    <h1 class="dialog-header"></h1>\n  </div>\n\n  <div class="footer">\n    <a href="" class="close">\n      ' + ((__t = I18n.t('pageflow.editor.templates.file_settings_dialog.close')) == null ? '' : __t) + '\n    </a>\n  </div>\n</div>\n';
    return __p;
  }
  var FileSettingsDialogView = Marionette.ItemView.extend({
    template: template$b$1,
    className: 'file_settings_dialog editor dialog',
    mixins: [dialogView],
    ui: {
      content: '.content',
      header: '.dialog-header'
    },
    onRender: function onRender() {
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
  function template$c$1(data) {
    var __p = '';
    __p += '<div class="pictogram"></div>\n';
    return __p;
  }
  var FileThumbnailView = Marionette.ItemView.extend({
    className: 'file_thumbnail',
    template: template$c$1,
    modelEvents: {
      'change:state': 'update'
    },
    ui: {
      pictogram: '.pictogram'
    },
    onRender: function onRender() {
      this.update();
    },
    update: function update() {
      if (this.model) {
        var stage = this.model.currentStage();
        if (stage) {
          this.setStageClassName(stage.get('name'));
          this.ui.pictogram.toggleClass('action_required', stage.get('action_required'));
          this.ui.pictogram.toggleClass('failed', stage.get('failed'));
        } else {
          this.ui.pictogram.removeClass(this.model.stages.pluck('name').join(' '));
        }
        this.ui.pictogram.addClass(this.model.thumbnailPictogram);
        this.$el.css('background-image', this._imageUrl() ? 'url(' + this._imageUrl() + ')' : '');
        this.$el.removeClass('empty').toggleClass('always_picogram', !!this.model.thumbnailPictogram).toggleClass('ready', this.model.isReady());
      } else {
        this.$el.css('background-image', '');
        this.$el.removeClass('ready');
        this.ui.pictogram.addClass('empty');
      }
    },
    setStageClassName: function setStageClassName(name) {
      if (!this.$el.hasClass(name)) {
        this.ui.pictogram.removeClass('empty');
        this.ui.pictogram.removeClass(this.model.stages.pluck('name').join(' '));
        this.ui.pictogram.addClass(name);
      }
    },
    _imageUrl: function _imageUrl() {
      return this.model.get(this.options.imageUrlPropertyName || 'thumbnail_url');
    }
  });

  /**
   * Input view to reference a file.
   *
   * @class
   */
  var FileInputView = Marionette.ItemView.extend({
    mixins: [inputView],
    template: function template() {
      return "\n    <label>\n      <span class=\"name\"></span>\n      <span class=\"inline_help\"></span>\n    </label>\n    <div class=\"file_thumbnail\"></div>\n    <div class=\"file_name\"></div>\n\n    <a href=\"\"\n       class=\"unset\"\n       title=\"".concat(I18n$1.t('pageflow.ui.templates.inputs.file_input.reset'), "\">\n    </a>\n    <a href=\"\"\n       class=\"choose\"\n       title=\"").concat(I18n$1.t('pageflow.ui.templates.inputs.file_input.edit'), "\">\n    </a>\n  ");
    },
    className: 'file_input',
    ui: {
      fileName: '.file_name',
      thumbnail: '.file_thumbnail'
    },
    events: {
      'click .choose': function clickChoose() {
        editor.selectFile({
          name: this.options.collection.name,
          filter: this.options.filter
        }, this.options.fileSelectionHandler || 'pageConfiguration', _.extend({
          id: this.model.getRoutableId ? this.model.getRoutableId() : this.model.id,
          attributeName: this.options.propertyName,
          returnToTab: this.options.parentTab
        }, this.options.fileSelectionHandlerOptions || {}));
        return false;
      },
      'click .unset': function clickUnset() {
        this.model.unsetReference(this.options.propertyName);
        return false;
      }
    },
    initialize: function initialize() {
      this.options = _.extend({
        positioning: true,
        textTrackFiles: state.textTrackFiles
      }, this.options);
      if (typeof this.options.collection === 'string') {
        this.options.collection = state.entry.getFileCollection(editor.fileTypes.findByCollectionName(this.options.collection));
      }
      this.textTrackMenuItems = new Backbone.Collection();
    },
    onRender: function onRender() {
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
    update: function update() {
      var file = this._getFile();
      this._listenToNestedTextTrackFiles(file);
      this.$el.toggleClass('is_unset', !file);
      this.ui.fileName.text(file ? file.title() : I18n$1.t('pageflow.ui.views.inputs.file_input_view.none'));
      this.subview(new FileThumbnailView({
        el: this.ui.thumbnail,
        model: file
      }));
    },
    _updatePositioning: function _updatePositioning(positioning) {
      if (this.positioningMenuItem) {
        this.positioningMenuItem.set('hidden', !positioning);
      }
    },
    _dropDownMenuItems: function _dropDownMenuItems() {
      var _this = this;
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
        _.each(this.options.dropDownMenuItems, function (item) {
          items.add(_this._createCustomMenuItem(file, item));
        });
        if (this.options.dropDownMenuName) {
          var customItems = editor.dropDownMenuItems.findAllByMenuName(this.options.dropDownMenuName);
          _.each(customItems, function (item) {
            items.add(_this._createCustomMenuItem(file, item));
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
    _createCustomMenuItem: function _createCustomMenuItem(file, item) {
      var _this2 = this;
      var options = {
        inputModel: this.model,
        propertyName: this.options.propertyName,
        file: file
      };
      if (typeof item === 'function') {
        return new item({}, options);
      } else {
        return new FileInputView.CustomMenuItem({
          name: item.name,
          label: item.label,
          checked: item.checked,
          items: item.items && new Backbone.Collection(item.items.map(function (item) {
            return _this2._createCustomMenuItem(file, item);
          }))
        }, _objectSpread2$2(_objectSpread2$2({}, options), {}, {
          selected: item.selected,
          items: item.items
        }));
      }
    },
    _listenToNestedTextTrackFiles: function _listenToNestedTextTrackFiles(file) {
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
    _getFile: function _getFile() {
      return this.model.getReference(this.options.propertyName, this.options.collection);
    }
  });
  FileInputView.EditBackgroundPositioningMenuItem = Backbone.Model.extend({
    initialize: function initialize(attributes, options) {
      this.options = options;
    },
    selected: function selected() {
      var positioningOptions = this.options.positioningOptions;
      if (typeof positioningOptions === 'function') {
        positioningOptions = positioningOptions();
      }
      BackgroundPositioningView.open(_objectSpread2$2({
        model: this.options.inputModel,
        propertyName: this.options.propertyName,
        filesCollection: this.options.filesCollection
      }, positioningOptions));
    }
  });
  FileInputView.CustomMenuItem = Backbone.Model.extend({
    initialize: function initialize(attributes, options) {
      this.options = options;
    },
    selected: function selected() {
      this.options.selected({
        inputModel: this.options.inputModel,
        propertyName: this.options.propertyName,
        file: this.options.file
      });
    }
  });
  FileInputView.EditFileSettingsMenuItem = Backbone.Model.extend({
    initialize: function initialize(attributes, options) {
      this.options = options;
    },
    selected: function selected() {
      FileSettingsDialogView.open({
        model: this.options.file
      });
    }
  });
  FileInputView.DefaultTextTrackFileMenuItem = Backbone.Model.extend({
    initialize: function initialize(attributes, options) {
      this.options = options;
      this.listenTo(this.options.inputModel, 'change:' + this.options.propertyName, this.update);
      if (this.options.textTrackFile) {
        this.listenTo(this.options.textTrackFile, 'change:configuration', this.update);
      }
      this.update();
    },
    update: function update() {
      this.set('kind', 'radio');
      this.set('checked', this.options.textTrackFile == this.getDefaultTextTrackFile());
      this.set('name', this.options.textTrackFile ? null : 'no_default_text_track');
      this.set('label', this.options.textTrackFile ? this.options.textTrackFile.displayLabel() : this.options.textTrackFiles.length ? I18n$1.t('pageflow.editor.views.inputs.file_input.auto_default_text_track') : I18n$1.t('pageflow.editor.views.inputs.file_input.no_default_text_track'));
    },
    selected: function selected() {
      if (this.options.textTrackFile) {
        this.options.inputModel.setReference(this.options.propertyName, this.options.textTrackFile);
      } else {
        this.options.inputModel.unsetReference(this.options.propertyName);
      }
    },
    getDefaultTextTrackFile: function getDefaultTextTrackFile() {
      return this.options.inputModel.getReference(this.options.propertyName, this.options.textTrackFiles);
    }
  });
  function template$d$1(data) {
    var __p = '';
    __p += '<div class="spinner">\n  <div class="rect1"></div>\n  <div class="rect2"></div>\n  <div class="rect3"></div>\n  <div class="rect4"></div>\n  <div class="rect5"></div>\n</div>\n';
    return __p;
  }
  var LoadingView = Marionette.ItemView.extend({
    template: template$d$1,
    className: 'loading',
    tagName: 'li'
  });
  var selectableView = {
    initialize: function initialize() {
      this.selectionAttribute = this.selectionAttribute || this.model.modelName;
      this.listenTo(this.options.selection, 'change:' + this.selectionAttribute, function (selection, selectedModel) {
        this.$el.toggleClass('active', selectedModel === this.model);
      });
      this.$el.toggleClass('active', this.options.selection.get(this.selectionAttribute) === this.model);
    },
    select: function select() {
      this.options.selection.set(this.selectionAttribute, this.model);
    },
    onClose: function onClose() {
      if (this.options.selection.get(this.selectionAttribute) === this.model) {
        this.options.selection.set(this.selectionAttribute, null);
      }
    }
  };
  function template$e$1(data) {
    var __t,
      __p = '';
    __p += '<span class="theme_name"></span>\n<span class="button_or_checkmark">\n  <p class="theme_in_use"></p>\n  <a class="use_theme">' + ((__t = I18n.t('pageflow.editor.templates.theme.use')) == null ? '' : __t) + '</a>\n</span>\n';
    return __p;
  }
  var ThemeItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: template$e$1,
    className: 'theme_item',
    mixins: [selectableView],
    selectionAttribute: 'theme',
    ui: {
      themeName: '.theme_name',
      useButton: '.use_theme',
      inUseRegion: '.theme_in_use'
    },
    events: {
      'click .use_theme': function clickUse_theme() {
        this.options.onUse(this.model);
      },
      'mouseenter': 'select',
      'click': 'select'
    },
    onRender: function onRender() {
      this.$el.data('themeName', this.model.get('name'));
      this.ui.themeName.text(this.model.title());
      if (this.inUse()) {
        this.ui.inUseRegion.text('✓');
      }
      this.ui.useButton.toggle(!this.inUse());
    },
    inUse: function inUse() {
      return this.model.get('name') === this.options.themeInUse;
    }
  });
  function template$f$1(data) {
    var __t,
      __p = '';
    __p += '<div class="box">\n  <h1 class="dialog-header">\n    ' + ((__t = I18n.t('pageflow.editor.templates.change_theme_dialog.header')) == null ? '' : __t) + '\n  </h1>\n  <div class="panels">\n    <div class="themes_panel">\n    </div>\n    <div class="preview_panel">\n      <h2 class="dialog-sub_header">\n        ' + ((__t = I18n.t('pageflow.editor.templates.change_theme_dialog.preview_header_prefix')) == null ? '' : __t) + '\n        <span class="preview_header_theme_name"></span>\n        ' + ((__t = I18n.t('pageflow.editor.templates.change_theme_dialog.preview_header_suffix')) == null ? '' : __t) + '\n      </h2>\n      <div class="preview_image_region">\n        <img class="preview_image" src="default_template.png">\n      </div>\n    </div>\n  </div>\n  <div class="footer">\n    <a href="" class="close">\n      ' + ((__t = I18n.t('pageflow.editor.templates.change_theme_dialog.close')) == null ? '' : __t) + '\n    </a>\n  </div>\n</div>\n';
    return __p;
  }
  var ChangeThemeDialogView = Marionette.ItemView.extend({
    template: template$f$1,
    className: 'change_theme dialog editor',
    mixins: [dialogView],
    ui: {
      themesPanel: '.themes_panel',
      previewPanel: '.preview_panel',
      previewImageRegion: '.preview_image_region',
      previewImage: '.preview_image',
      previewHeaderThemeName: '.preview_header_theme_name'
    },
    initialize: function initialize(options) {
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
    onRender: function onRender() {
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
    update: function update() {
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
  function template$g$1(data) {
    var __p = '';
    __p += '\n';
    return __p;
  }
  var StaticThumbnailView = Marionette.ItemView.extend({
    template: template$g$1,
    className: 'static_thumbnail',
    modelEvents: {
      'change:configuration': 'update'
    },
    onRender: function onRender() {
      this.update();
    },
    update: function update() {
      this.$el.css('background-image', 'url(' + this._imageUrl() + ')');
    },
    _imageUrl: function _imageUrl() {
      return this.model.thumbnailUrl();
    }
  });

  /**
   * Base thumbnail view for models supporting a `thumbnailFile` method.
   *
   * @class
   */
  var ModelThumbnailView = Marionette.View.extend({
    className: 'model_thumbnail',
    modelEvents: {
      'change:configuration': 'update'
    },
    render: function render() {
      this.update();
      return this;
    },
    update: function update() {
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
  function template$h(data) {
    var __p = '';
    __p += '<label>\n  <span class="name"></span>\n  <span class="inline_help"></span>\n</label>\n<div class="title"></div>\n<button class="unset"></button>\n<button class="choose"></button>\n';
    return __p;
  }

  /**
   * Base class for input views that reference models.
   *
   * @class
   */
  var ReferenceInputView = Marionette.ItemView.extend( /** @lends ReferenceInputView.prototype */{
    mixins: [inputView],
    template: template$h,
    className: 'reference_input',
    ui: {
      title: '.title',
      chooseButton: '.choose',
      unsetButton: '.unset',
      buttons: 'button'
    },
    events: {
      'click .choose': function clickChoose() {
        var view = this;
        this.chooseValue().then(function (id) {
          view.model.set(view.options.propertyName, id);
        });
        return false;
      },
      'click .unset': function clickUnset() {
        this.model.unset(this.options.propertyName);
        return false;
      }
    },
    initialize: function initialize() {
      this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
    },
    onRender: function onRender() {
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
    chooseValue: function chooseValue() {
      return this.choose().then(function (model) {
        return model.get('perma_id');
      });
    },
    choose: function choose() {
      throw 'Not implemented: Override ReferenceInputView#choose to return a promise';
    },
    getTarget: function getTarget(targetId) {
      throw 'Not implemented: Override ReferenceInputView#getTarget';
    },
    createThumbnailView: function createThumbnailView(target) {
      return new ModelThumbnailView({
        model: target
      });
    },
    update: function update() {
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
  var ThemeInputView = ReferenceInputView.extend({
    options: function options() {
      return {
        chooseButtonTitle: I18n$1.t('pageflow.editor.views.inputs.theme_input_view.choose'),
        hideUnsetButton: true
      };
    },
    choose: function choose() {
      return ChangeThemeDialogView.changeTheme({
        model: this.model,
        themes: this.options.themes,
        themeInUse: this.model.get(this.options.propertyName)
      });
    },
    chooseValue: function chooseValue() {
      return this.choose().then(function (model) {
        return model.get('name');
      });
    },
    getTarget: function getTarget(themeName) {
      return this.options.themes.findByName(themeName);
    }
  });
  function template$i(data) {
    var __t,
      __p = '';
    __p += '<a class="back">' + ((__t = I18n.t('pageflow.editor.templates.edit_meta_data.outline')) == null ? '' : __t) + '</a>\n\n<div class="failure">\n  <p>' + ((__t = I18n.t('pageflow.editor.templates.edit_meta_data.save_error')) == null ? '' : __t) + '</p>\n  <p class="message"></p>\n  <a class="retry" href="">' + ((__t = I18n.t('pageflow.editor.templates.edit_meta_data.retry')) == null ? '' : __t) + '</a>\n</div>\n\n<div class="form_fields"></div>\n';
    return __p;
  }
  var EditMetaDataView = Marionette.Layout.extend({
    template: template$i,
    className: 'edit_meta_data',
    mixins: [failureIndicatingView],
    regions: {
      formContainer: '.form_fields'
    },
    events: {
      'click a.back': 'goBack'
    },
    onRender: function onRender() {
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
      });
      configurationEditor.tab('widgets', function () {
        var _this = this;
        editor.entryType.appearanceInputs && editor.entryType.appearanceInputs(this, {
          entry: entry,
          site: state.site
        });
        editor.appearanceInputsCallbacks.forEach(function (callback) {
          callback(_this, {
            entry: entry
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
    goBack: function goBack() {
      this.options.editor.navigate('/', {
        trigger: true
      });
    }
  });
  function template$j(data) {
    var __t,
      __p = '';
    __p += '<a class="back">' + ((__t = I18n.t('pageflow.editor.templates.edit_widget.back')) == null ? '' : __t) + '</a>\n';
    return __p;
  }
  var EditWidgetView = Marionette.ItemView.extend({
    template: template$j,
    className: 'edit_widget',
    events: {
      'click a.back': function clickABack() {
        editor.navigate('/meta_data/widgets', {
          trigger: true
        });
      }
    },
    initialize: function initialize() {
      this.model.set('editing', true);
    },
    onClose: function onClose() {
      Marionette.ItemView.prototype.onClose.call(this);
      this.model.set('editing', false);
    },
    onRender: function onRender() {
      var configurationEditor = this.model.widgetType().createConfigurationEditorView({
        model: this.model.configuration,
        entry: this.options.entry,
        tab: this.options.tab
      });
      this.appendSubview(configurationEditor);
    }
  });
  var loadable = modelLifecycleTrackingView({
    classNames: {
      creating: 'creating',
      destroying: 'destroying'
    }
  });
  function template$k(data) {
    var __p = '';
    __p += '<span class="file_thumbnail"></span>\n\n<span class="file_name"></span>\n';
    return __p;
  }
  var ExplorerFileItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: template$k,
    mixins: [loadable, selectableView],
    selectionAttribute: 'file',
    ui: {
      fileName: '.file_name',
      thumbnail: '.file_thumbnail'
    },
    events: {
      'click': function click() {
        if (!this.$el.hasClass('disabled')) {
          this.select();
        }
      }
    },
    modelEvents: {
      'change': 'update'
    },
    onRender: function onRender() {
      this.update();
      this.subview(new FileThumbnailView({
        el: this.ui.thumbnail,
        model: this.model
      }));
    },
    update: function update() {
      if (this.isDisabled()) {
        this.$el.addClass('disabled');
      }
      this.$el.attr('data-id', this.model.id);
      this.ui.fileName.text(this.model.title());
    },
    isDisabled: function isDisabled() {
      return this.options.disabledIds && _.contains(this.options.disabledIds, this.model.get('id'));
    }
  });
  function template$l(data) {
    var __p = '';
    __p += '<a href="">\n  <span class="title"></span>\n</a>\n';
    return __p;
  }
  var OtherEntryItemView = Marionette.ItemView.extend({
    template: template$l,
    className: 'other_entry_item',
    tagName: 'li',
    mixins: [selectableView],
    ui: {
      title: '.title'
    },
    events: {
      'click': 'select'
    },
    onRender: function onRender() {
      this.ui.title.text(this.model.titleOrSlug());
    }
  });
  function template$m(data) {
    var __t,
      __p = '';
    __p += ((__t = I18n.t('pageflow.editor.templates.other_entries_blank_slate.none_available')) == null ? '' : __t) + '\n';
    return __p;
  }
  var OtherEntriesCollectionView = Marionette.View.extend({
    initialize: function initialize() {
      this.otherEntries = new OtherEntriesCollection();
      this.listenTo(this.otherEntries, 'sync', function () {
        if (this.otherEntries.length === 1) {
          this.options.selection.set('entry', this.otherEntries.first());
        }
      });
    },
    render: function render() {
      this.subview(new CollectionView({
        el: this.el,
        collection: this.otherEntries,
        itemViewConstructor: OtherEntryItemView,
        itemViewOptions: {
          selection: this.options.selection
        },
        blankSlateViewConstructor: Marionette.ItemView.extend({
          template: template$m,
          tagName: 'li',
          className: 'blank_slate'
        }),
        loadingViewConstructor: LoadingView
      }));
      this.otherEntries.fetch();
      return this;
    }
  });
  function template$n(data) {
    var __t,
      __p = '';
    __p += '<div class="box">\n  <h1 class="dialog-header">\n    ' + ((__t = I18n.t('pageflow.editor.templates.files_explorer.reuse_files')) == null ? '' : __t) + '\n  </h1>\n\n  <div class="panels">\n    <ul class="entries_panel">\n    </ul>\n\n    <div class="files_panel">\n    </div>\n  </div>\n\n  <div class="footer">\n    <button class="ok">' + ((__t = I18n.t('pageflow.editor.templates.files_explorer.ok')) == null ? '' : __t) + '</button>\n    <button class="close">' + ((__t = I18n.t('pageflow.editor.templates.files_explorer.cancel')) == null ? '' : __t) + '</button>\n  </div>\n</div>\n';
    return __p;
  }
  function filesGalleryBlankSlateTemplate(data) {
    var __t,
      __p = '';
    __p += '<li class="blank_slate">' + ((__t = I18n.t('pageflow.editor.templates.files_gallery_blank_slate.no_files')) == null ? '' : __t) + '<li>\n';
    return __p;
  }
  function filesExplorerBlankSlateTemplate(data) {
    var __t,
      __p = '';
    __p += '<li class="blank_slate">' + ((__t = I18n.t('pageflow.editor.templates.files_explorer_blank_slate.choose_hint')) == null ? '' : __t) + '<li>\n';
    return __p;
  }
  var FilesExplorerView = Marionette.ItemView.extend({
    template: template$n,
    className: 'files_explorer editor dialog',
    mixins: [dialogView],
    ui: {
      entriesPanel: '.entries_panel',
      filesPanel: '.files_panel',
      okButton: '.ok'
    },
    events: {
      'click .ok': function clickOk() {
        if (this.options.callback) {
          this.options.callback(this.selection.get('entry'), this.selection.get('file'));
        }
        this.close();
      }
    },
    initialize: function initialize() {
      this.selection = new Backbone.Model();
      this.listenTo(this.selection, 'change:entry', function () {
        this.tabsView.refresh();
      });

      // check if the OK button should be enabled.
      this.listenTo(this.selection, 'change', function (selection, options) {
        this.ui.okButton.prop('disabled', !this.selection.get('file'));
      });
    },
    onRender: function onRender() {
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
    tab: function tab(fileType) {
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
    _collection: function _collection(fileType) {
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
    _blankSlateConstructor: function _blankSlateConstructor() {
      return Marionette.ItemView.extend({
        template: this.selection.get('entry') ? filesGalleryBlankSlateTemplate : filesExplorerBlankSlateTemplate
      });
    }
  });
  FilesExplorerView.open = function (options) {
    app.dialogRegion.show(new FilesExplorerView(options));
  };
  function template$o(data) {
    var __p = '';
    __p += '<th></th>\n<td></td>';
    return __p;
  }
  var FileMetaDataItemView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: template$o,
    ui: {
      label: 'th',
      value: 'td'
    },
    onRender: function onRender() {
      this.appendSubview(new this.options.valueView(_.extend({
        model: this.model,
        name: this.options.name
      }, this.options.valueViewOptions || {})), {
        to: this.ui.value
      });
      this.ui.label.text(this.labelText());
    },
    labelText: function labelText() {
      return i18nUtils.attributeTranslation(this.options.name, 'label', {
        prefixes: ['pageflow.editor.files.attributes.' + this.model.fileType().collectionName, 'pageflow.editor.files.common_attributes'],
        fallbackPrefix: 'activerecord.attributes',
        fallbackModelI18nKey: this.model.i18nKey
      });
    }
  });
  function template$p(data) {
    var __p = '';
    __p += '<p class="percent"></p>\n<p class="description"></p>\n<p class="error_message"></p>';
    return __p;
  }
  var FileStageItemView = Marionette.ItemView.extend({
    tagName: 'li',
    className: 'file_stage_item',
    template: template$p,
    ui: {
      description: '.description',
      percent: '.percent',
      errorMessage: '.error_message'
    },
    modelEvents: {
      'change': 'update'
    },
    onRender: function onRender() {
      this.update();
      this.$el.addClass(this.model.get('name'));
      if (this.options.standAlone) {
        this.$el.addClass('stand_alone');
      } else {
        this.$el.addClass('indented');
      }
    },
    update: function update() {
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
    _translatedErrorMessage: function _translatedErrorMessage() {
      return this.model.get('error_message') && I18n$1.t(this.model.get('error_message'), {
        defaultValue: this.model.get('error_message')
      });
    }
  });
  function template$q(data) {
    var __t,
      __p = '';
    __p += '<span class="value"></span>\n<button class="edit" type="button" title="' + ((__t = I18n.t('pageflow.editor.templates.file_meta_data_item_value_view.edit')) == null ? '' : __t) + '">\n</button>\n\n';
    return __p;
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
  var FileMetaDataItemValueView = Marionette.ItemView.extend({
    template: template$q,
    className: 'value_wrapper',
    ui: {
      value: '.value',
      editLink: '.edit'
    },
    events: {
      'click .edit': function clickEdit() {
        FileSettingsDialogView.open({
          model: this.model,
          tabName: this.options.settingsDialogTabLink
        });
      }
    },
    modelEvents: {
      'change': 'toggleEditLink'
    },
    onRender: function onRender() {
      this.listenTo(this.model, 'change:' + this.options.name, this.update);
      this.toggleEditLink();
      this.update();
    },
    update: function update() {
      this.ui.value.text(this.getText() || I18n$1.t('pageflow.editor.views.file_meta_data_item_value_view.blank'));
    },
    getText: function getText() {
      throw new Error('Not implemented');
    },
    toggleEditLink: function toggleEditLink() {
      this.ui.editLink.toggle(!!this.options.settingsDialogTabLink && !this.model.isNew());
    }
  });
  var TextFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
    getText: function getText() {
      var model;
      if (this.options.fromConfiguration) {
        model = this.model.configuration;
      } else {
        model = this.model;
      }
      var value = model.get(this.options.name);
      if (value && this.options.formatValue) {
        return this.options.formatValue(value);
      }
      return value;
    }
  });
  function template$r(data) {
    var __t,
      __p = '';
    __p += '<button class="file_thumbnail_button" type="button">\n  <span class="file_thumbnail"></span>\n</button>\n\n<span class="file_name"></span>\n<button class="select" type="button">' + ((__t = I18n.t('pageflow.editor.templates.file_item.select')) == null ? '' : __t) + '</button>\n\n<div class="actions">\n  <button class="settings" type="button" title="' + ((__t = I18n.t('pageflow.editor.templates.file_item.settings')) == null ? '' : __t) + '"></button>\n  <button class="confirm" type="button" title="' + ((__t = I18n.t('pageflow.editor.templates.file_item.confirm')) == null ? '' : __t) + '"></button>\n  <button class="retry" type="button" title="' + ((__t = I18n.t('pageflow.editor.templates.file_item.retry')) == null ? '' : __t) + '"></button>\n  <button class="remove" type="button" title="' + ((__t = I18n.t('pageflow.editor.templates.file_item.destroy')) == null ? '' : __t) + '"></button>\n  <button class="cancel" type="button" title="' + ((__t = I18n.t('pageflow.editor.templates.file_item.cancel')) == null ? '' : __t) + '"></button>\n</div>\n\n<div class="details">\n  <ul class="file_stage_items"></ul>\n\n  <div class="file_meta_data">\n    <table cellpadding="0" cellspacing="0">\n      <tbody class="attributes">\n      </tbody>\n      <tbody class="downloads">\n        <tr>\n          <th>' + ((__t = I18n.t('pageflow.editor.templates.file_item.source')) == null ? '' : __t) + '</th>\n          <td><a class="original" href="#" download target="_blank">' + ((__t = I18n.t('pageflow.editor.templates.file_item.download')) == null ? '' : __t) + '</a></td>\n        </tr>\n      <tbody>\n    </table>\n  </div>\n</div>\n';
    return __p;
  }
  var FileItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: template$r,
    mixins: [loadable],
    ui: {
      fileName: '.file_name',
      selectButton: '.select',
      settingsButton: '.settings',
      removeButton: '.remove',
      confirmButton: '.confirm',
      cancelButton: '.cancel',
      retryButton: '.retry',
      thumbnail: '.file_thumbnail',
      thumbnailButton: '.file_thumbnail_button',
      stageItems: '.file_stage_items',
      details: '.details',
      metaData: 'tbody.attributes',
      downloads: 'tbody.downloads',
      downloadLink: 'a.original'
    },
    events: {
      'click .select': 'select',
      'click .settings': function clickSettings() {
        FileSettingsDialogView.open({
          model: this.model
        });
      },
      'click .cancel': 'cancel',
      'click .confirm': 'confirm',
      'click .remove': 'destroy',
      'click .retry': 'retry',
      'click .file_thumbnail_button': 'toggleExpanded'
    },
    initialize: function initialize() {
      var _this = this;
      if (this.options.listHighlight) {
        this.listenTo(this.options.listHighlight, 'change:currentId change:active', function () {
          if (_this.updateHighlight()) {
            _this.el.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth'
            });
          }
        });
        this.listenTo(this.options.listHighlight, 'selected:' + this.model.id, this.select);
      }
    },
    modelEvents: {
      'change': 'update'
    },
    onRender: function onRender() {
      this.update();
      this.setupAriaAttributes();
      this.subview(new FileThumbnailView({
        el: this.ui.thumbnail,
        model: this.model
      }));
      this.subview(new CollectionView({
        el: this.ui.stageItems,
        collection: this.model.stages,
        itemViewConstructor: FileStageItemView
      }));
      _.each(this.metaDataViews(), function (view) {
        this.ui.metaData.append(this.subview(view).el);
      }, this);
      this.updateHighlight();
    },
    update: function update() {
      if (this.isClosed) {
        return;
      }
      this.$el.attr('data-id', this.model.id);
      this.ui.fileName.text(this.model.title());
      this.ui.downloadLink.attr('href', this.model.get('download_url'));
      this.ui.downloads.toggle(this.model.isUploaded() && !_.isEmpty(this.model.get('download_url')));
      this.ui.selectButton.toggle(!!this.options.selectionHandler);
      this.ui.settingsButton.toggle(!this.model.isNew());
      this.ui.cancelButton.toggle(this.model.isUploading());
      this.ui.confirmButton.toggle(this.model.isConfirmable());
      this.ui.removeButton.toggle(!this.model.isUploading());
      this.ui.retryButton.toggle(this.model.isRetryable());
      this.updateToggleTitle();
    },
    metaDataViews: function metaDataViews() {
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
    toggleExpanded: function toggleExpanded() {
      this.$el.toggleClass('expanded');
      this.updateToggleTitle();
    },
    setupAriaAttributes: function setupAriaAttributes() {
      var uniqueId = this.model.get('id') || this.model.cid;
      var detailsId = 'file-details-' + uniqueId;
      this.ui.thumbnailButton.attr('aria-controls', detailsId);
      this.ui.details.attr('id', detailsId);
    },
    updateToggleTitle: function updateToggleTitle() {
      var isExpanded = this.$el.hasClass('expanded');
      var titleText = I18n$1.t(isExpanded ? 'pageflow.editor.templates.file_item.collapse_details' : 'pageflow.editor.templates.file_item.expand_details');
      this.ui.thumbnailButton.attr('aria-expanded', isExpanded.toString());
      this.ui.thumbnailButton.attr('title', titleText);
      this.ui.thumbnailButton.attr('aria-label', titleText);
    },
    destroy: function destroy() {
      if (confirm("Datei wirklich wirklich löschen?")) {
        this.model.destroy();
      }
    },
    cancel: function cancel() {
      this.model.cancelUpload();
    },
    confirm: function confirm() {
      editor.navigate('/confirmable_files?type=' + this.model.modelName + '&id=' + this.model.id, {
        trigger: true
      });
    },
    retry: function retry() {
      this.model.retry();
    },
    select: function select() {
      var result = this.options.selectionHandler.call(this.model);
      if (result !== false) {
        editor.navigate(this.options.selectionHandler.getReferer(), {
          trigger: true
        });
      }
      return false;
    },
    updateHighlight: function updateHighlight() {
      if (!this.options.listHighlight) {
        return false;
      }
      var highlighted = this.options.listHighlight.get('currentId') === this.model.id && this.options.listHighlight.get('active');
      this.$el.toggleClass('keyboard_highlight', highlighted);
      this.$el.attr('aria-selected', highlighted ? 'true' : null);
      return highlighted;
    }
  });
  function template$s(data) {
    var __t,
      __p = '';
    __p += '<input type="text"\n       class="list_search_field-term"\n       aria-label="' + ((__t = I18n.t('pageflow.editor.templates.list_search_field.placeholder')) == null ? '' : __t) + '" />\n<span class="list_search_field-placeholder">\n  ' + ((__t = I18n.t('pageflow.editor.templates.list_search_field.hint', {
      hotkey: '<kbd>/</kbd>'
    })) == null ? '' : __t) + '\n</span>\n<a href=""\n   class="list_search_field-reset"\n   title="' + ((__t = I18n.t('pageflow.editor.templates.list_search_field.reset')) == null ? '' : __t) + '"></a>\n';
    return __p;
  }
  var ListSearchFieldView = Marionette.ItemView.extend({
    template: template$s,
    className: 'list_search_field',
    ui: {
      input: '.list_search_field-term'
    },
    events: {
      'input .list_search_field-term': 'changeTerm',
      'click .list_search_field-reset': 'reset',
      'keydown .list_search_field-term': 'handleInputKeyDown',
      'focus .list_search_field-term': 'handleInputFocus',
      'blur .list_search_field-term': 'handleInputBlur'
    },
    initialize: function initialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.search = options.search;
      this.listHighlight = options.listHighlight;
    },
    onRender: function onRender() {
      var _this = this;
      this.toggleReset();
      if (this.options.ariaControlsId) {
        this.ui.input.attr('aria-controls', this.options.ariaControlsId);
      }
      this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
      $(document).on('keydown', this.handleDocumentKeyDown);
      if (this.options.autoFocus) {
        setTimeout(function () {
          return _this.ui.input.focus();
        }, 0);
      }
    },
    onClose: function onClose() {
      $(document).off('keydown', this.handleDocumentKeyDown);
    },
    changeTerm: function changeTerm() {
      this.search.set('term', this.ui.input.val());
      this.toggleReset();
    },
    reset: function reset(event) {
      this.ui.input.val('');
      this.search.set('term', '');
      this.toggleReset();
      this.ui.input.focus();
      if (event) {
        event.preventDefault();
      }
    },
    handleDocumentKeyDown: function handleDocumentKeyDown(event) {
      var active = document.activeElement;
      if (event.key === '/' && !/input|textarea/i.test(active.tagName)) {
        this.ui.input.focus();
        event.preventDefault();
      }
    },
    handleInputKeyDown: function handleInputKeyDown(event) {
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
    handleInputFocus: function handleInputFocus() {
      this.$el.addClass('focus');
      if (this.listHighlight) {
        this.listHighlight.set('active', true);
      }
    },
    handleInputBlur: function handleInputBlur() {
      this.$el.removeClass('focus');
      if (this.listHighlight) {
        this.listHighlight.set('active', false);
      }
    },
    toggleReset: function toggleReset() {
      this.$el.toggleClass('has_value', !!this.search.get('term'));
    }
  });
  function template$t(data) {
    var __t,
      __p = '';
    __p += '<div class="filtered_files-banner">\n  <span class="filtered_files-banner_prefix">\n    ' + ((__t = I18n.t('pageflow.editor.views.filtered_files_view.banner_prefix')) == null ? '' : __t) + '\n  </span>\n  <span class="filtered_files-filter_name"></span>\n  <a href=""\n     class="filtered_files-reset_filter"\n     title="' + ((__t = I18n.t('pageflow.editor.views.filtered_files_view.reset_filter')) == null ? '' : __t) + '">\n  </a>\n</div>\n<div class="filtered_files-filter_bar">\n</div>\n';
    return __p;
  }
  function blankSlateTemplate$1(data) {
    var __t,
      __p = '';
    __p += '<li class="blank_slate">' + ((__t = data.text) == null ? '' : __t) + '</li>\n';
    return __p;
  }
  var FilteredFilesView = Marionette.ItemView.extend({
    template: template$t,
    className: 'filtered_files',
    ui: {
      banner: '.filtered_files-banner',
      filterName: '.filtered_files-filter_name',
      filterBar: '.filtered_files-filter_bar',
      sort: '.filtered_files-sort'
    },
    events: {
      'click .filtered_files-reset_filter': function clickFiltered_filesReset_filter() {
        editor.navigate('/files/' + this.options.fileType.collectionName, {
          trigger: true
        });
        return false;
      }
    },
    initialize: function initialize() {
      this.search = new Search({}, {
        attribute: 'display_name',
        storageKey: 'pageflow.filtered_files.sort_order'
      });
      var collection = this.options.entry.getFileCollection(this.options.fileType);
      if (this.options.filterName) {
        collection = this.filteredCollection = collection.withFilter(this.options.filterName);
      }
      this.searchFilteredCollection = this.search.applyTo(collection);
      if (this.options.selectionHandler) {
        this.listHighlight = new ListHighlight({}, {
          collection: this.searchFilteredCollection
        });
      }
    },
    onRender: function onRender() {
      this.renderNamedFilter();
      this.renderSearchField();
      this.renderSortMenu();
      this.renderCollectionView();
    },
    renderNamedFilter: function renderNamedFilter() {
      this.ui.banner.toggle(!!this.options.filterName);
      if (this.options.filterName) {
        this.ui.filterName.text(this.filterTranslation('name'));
      }
    },
    renderSearchField: function renderSearchField() {
      this.searchFieldView = this.appendSubview(new ListSearchFieldView({
        search: this.search,
        listHighlight: this.listHighlight,
        ariaControlsId: 'filtered_files',
        autoFocus: !!this.options.selectionHandler
      }), {
        to: this.ui.filterBar
      });
    },
    renderSortMenu: function renderSortMenu() {
      this.appendSubview(new DropDownButtonView({
        title: I18n$1.t('pageflow.editor.views.filtered_files_view.sort_button_label'),
        alignMenu: 'right',
        openOnClick: true,
        items: new SortMenuItemsCollection([{
          name: 'alphabetical'
        }, {
          name: 'most_recent'
        }], {
          search: this.search
        })
      }), {
        to: this.ui.filterBar
      });
    },
    renderCollectionView: function renderCollectionView() {
      var blankSlateText = this.options.filterName ? this.filterTranslation('blank_slate') : I18n$1.t('pageflow.editor.templates.files_blank_slate.no_files');
      this.appendSubview(this.subview(new CollectionView({
        tagName: 'ul',
        id: 'filtered_files',
        className: 'files expandable',
        collection: this.searchFilteredCollection,
        itemViewConstructor: FileItemView,
        itemViewOptions: {
          metaDataAttributes: this.options.fileType.metaDataAttributes,
          selectionHandler: this.options.selectionHandler,
          listHighlight: this.listHighlight
        },
        blankSlateViewConstructor: Marionette.ItemView.extend({
          template: blankSlateTemplate$1,
          serializeData: function serializeData() {
            return {
              text: blankSlateText
            };
          }
        })
      })));
    },
    filterTranslation: function filterTranslation(keyName, options) {
      var filterName = this.options.filterName;
      var entryTypeName = editor.entryType.name;
      return i18nUtils.findTranslation(['pageflow.entry_types.' + entryTypeName + '.editor.files.filters.' + this.options.fileType.collectionName + '.' + filterName + '.' + keyName, 'pageflow.entry_types.' + entryTypeName + '.editor.files.common_filters.' + keyName, 'pageflow.editor.files.filters.' + this.options.fileType.collectionName + '.' + filterName + '.' + keyName, 'pageflow.editor.files.common_filters.' + keyName], options);
    },
    onClose: function onClose() {
      var _this$filteredCollect;
      Marionette.ItemView.prototype.onClose.call(this);
      (_this$filteredCollect = this.filteredCollection) === null || _this$filteredCollect === void 0 ? void 0 : _this$filteredCollect.dispose();
      this.searchFilteredCollection.dispose();
    }
  });
  var SortMenuItem = Backbone.Model.extend({
    initialize: function initialize(attributes, options) {
      var _this = this;
      this.search = options.search;
      this.set('label', I18n$1.t("pageflow.editor.views.filtered_files_view.sort.".concat(this.get('name'))));
      this.set('kind', 'radio');
      var updateChecked = function updateChecked() {
        _this.set('checked', _this.search.get('order') === _this.get('name'));
      };
      this.listenTo(this.search, 'change:order', updateChecked);
      updateChecked();
    },
    selected: function selected() {
      this.search.set('order', this.get('name'));
    }
  });
  var SortMenuItemsCollection = Backbone.Collection.extend({
    model: SortMenuItem
  });
  function template$u(data) {
    var __t,
      __p = '';
    __p += '<div class="box choose_importer_box">\n  <h1 class="dialog-header">' + ((__t = I18n.t('pageflow.editor.views.files_view.importer.heading')) == null ? '' : __t) + '</h1>\n\n  <div class="content">\n    <ul class="importers_panel">\n    </ul>\n  </div>\n\n  <div class="footer">\n    <button class="close">' + ((__t = I18n.t('pageflow.editor.templates.files_explorer.cancel')) == null ? '' : __t) + '</button>\n  </div>\n</div>\n';
    return __p;
  }
  function template$v(data) {
    var __t,
      __p = '';
    __p += '<button class=\'importer\' data-key=\'' + ((__t = data.fileImporter.key) == null ? '' : __t) + '\'>\n  <div class="logo">\n    <img alt="Free high resolution images" src="' + ((__t = data.fileImporter.logoSource) == null ? '' : __t) + '">\n  </div>\n  <div class="text">\n    <h3 class="name">' + ((__t = I18n.t('pageflow.editor.file_importers.' + data.fileImporter.key + '.select_title')) == null ? '' : __t) + '</h3>\n    <p class="select_label">' + ((__t = I18n.t('pageflow.editor.file_importers.' + data.fileImporter.key + '.select_label')) == null ? '' : __t) + '</p>\n  </div>\n</button>';
    return __p;
  }
  var ImporterSelectView = Marionette.ItemView.extend({
    template: template$v,
    className: 'importer_select',
    tagName: 'li',
    events: {
      'click .importer': function clickImporter(event) {
        this.options.parentView.importerSelected(this.options.importer);
      }
    },
    initialize: function initialize(options) {},
    serializeData: function serializeData() {
      return {
        fileImporter: this.options.importer
      };
    }
  });
  var ChooseImporterView = Marionette.ItemView.extend({
    template: template$u,
    className: 'choose_importer editor dialog',
    mixins: [dialogView],
    ui: {
      importersList: '.importers_panel',
      closeButton: '.close'
    },
    events: {
      'click .close': function clickClose() {
        this.close();
      }
    },
    importerSelected: function importerSelected(importer) {
      if (this.options.callback) {
        this.options.callback(importer);
      }
      this.close();
    },
    onRender: function onRender() {
      var self = this;
      editor.fileImporters.values().forEach(function (fileImporter) {
        var importerSelectView = new ImporterSelectView({
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
  function template$w(data) {
    var __t,
      __p = '';
    __p += '<div class="box file_importer_box">\n  <h1 class="dialog-header">' + ((__t = I18n.t('pageflow.editor.file_importers.' + data.importerKey + '.dialog_label')) == null ? '' : __t) + '</h1>\n\n  <div class="content_panel">\n    \n  </div>\n\n  <div class="footer">\n    <div class="disclaimer">\n      ' + ((__t = I18n.t('pageflow.editor.file_importers.' + data.importerKey + '.disclaimer')) == null ? '' : __t) + '\n    </div>\n    <button class="import" disabled>' + ((__t = I18n.t('pageflow.editor.views.files_view.import')) == null ? '' : __t) + '</button>\n    <button class="close">' + ((__t = I18n.t('pageflow.editor.templates.files_explorer.cancel')) == null ? '' : __t) + '</button>\n  </div>\n</div>\n';
    return __p;
  }
  function template$x(data) {
    var __t,
      __p = '';
    __p += '<div class="box">\n  <h1 class="dialog-header">' + ((__t = I18n.t('pageflow.editor.templates.confirm_upload.header')) == null ? '' : __t) + '</h1>\n  <p class="dialog-hint">' + ((__t = I18n.t('pageflow.editor.templates.confirm_upload.hint')) == null ? '' : __t) + '</p>\n\n  <div class="panels">\n    <div class="files_panel">\n    </div>\n\n    <div class="selected_file_panel">\n      <h2 class="dialog-sub_header">' + ((__t = I18n.t('pageflow.editor.templates.confirm_upload.edit_file_header')) == null ? '' : __t) + '</h2>\n      <div class="selected_file_region">\n      </div>\n    </div>\n  </div>\n\n  <div class="footer">\n    <button class="upload">' + ((__t = I18n.t('pageflow.editor.templates.confirm_upload.upload')) == null ? '' : __t) + '</button>\n    <button class="close">' + ((__t = I18n.t('pageflow.editor.templates.confirm_upload.close')) == null ? '' : __t) + '</button>\n  </div>\n</div>\n';
    return __p;
  }
  function template$y(data) {
    var __p = '';
    __p += '';
    return __p;
  }
  var EditFileView = Marionette.ItemView.extend({
    template: template$y,
    className: 'edit_file',
    onRender: function onRender() {
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
          texts: state.config.availableFileLicenses.map(function (name) {
            return I18n$1.t("pageflow.file_licenses.".concat(name, ".name"));
          })
        });
        tab.input('rights_display', SelectInputView, {
          values: ['credits', 'inline']
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
    fileTypeInputs: function fileTypeInputs() {
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
  var UploadableFilesView = Marionette.View.extend({
    className: 'uploadable_files',
    initialize: function initialize() {
      this.uploadableFiles = this.collection.uploadable();
      if (!this.options.selection.has('file')) {
        this.options.selection.set('file', this.uploadableFiles.first());
      }
    },
    render: function render() {
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
    update: function update() {
      this.$el.toggleClass('is_empty', this.uploadableFiles.length === 0);
    },
    commonColumns: function commonColumns(options) {
      return [{
        name: 'display_name',
        headerText: options.fileTypeDisplayName,
        cellView: TextTableCellView
      }, {
        name: 'rights',
        cellView: PresenceTableCellView
      }];
    },
    fileTypeColumns: function fileTypeColumns() {
      return _(this.options.fileType.confirmUploadTableColumns).map(function (column) {
        return _.extend({}, column, {
          configurationAttribute: true
        });
      });
    }
  });
  var ConfirmFileImportUploadView = Marionette.Layout.extend({
    template: template$x,
    className: 'confirm_upload editor dialog',
    mixins: [dialogView],
    regions: {
      selectedFileRegion: '.selected_file_region'
    },
    ui: {
      filesPanel: '.files_panel'
    },
    events: {
      'click .upload': function clickUpload() {
        this.onImport();
      },
      'click .close': function clickClose() {
        this.closeMe();
      }
    },
    getSelectedFiles: function getSelectedFiles() {
      var files = [];
      _.each(state.files, function (collection) {
        if (collection.length > 0) {
          files = files.concat(collection.toJSON());
        }
      });
      return files;
    },
    initialize: function initialize() {
      this.selection = new Backbone.Model();
      this.listenTo(this.selection, 'change', this.update);
    },
    onRender: function onRender() {
      this.options.fileTypes.each(function (fileType) {
        this.ui.filesPanel.append(this.subview(new UploadableFilesView({
          collection: this.options.files[fileType.collectionName],
          fileType: fileType,
          selection: this.selection
        })).el);
      }, this);
      this.update();
    },
    onImport: function onImport() {
      var cName = this.options.fileImportModel.get('metaData').collection;
      this.options.fileImportModel.get('importer').startImportJob(cName);
      this.close();
    },
    closeMe: function closeMe() {
      var cName = this.options.fileImportModel.get('metaData').collection;
      this.options.fileImportModel.get('importer').cancelImport(cName);
      this.close();
    },
    update: function update() {
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
  var FilesImporterView = Marionette.ItemView.extend({
    template: template$w,
    className: 'files_importer editor dialog',
    mixins: [dialogView],
    ui: {
      contentPanel: '.content_panel',
      spinner: '.lds-spinner',
      importButton: '.import',
      closeButton: '.close'
    },
    events: {
      'click .import': function clickImport() {
        this.getMetaData();
      }
    },
    initialize: function initialize(options) {
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
    updateAuthenticationView: function updateAuthenticationView() {
      var importer = this.model.get('importer');
      if (importer.get('isAuthenticated')) {
        this.ui.contentPanel.empty();
        this.ui.contentPanel.append(this.model.get('importer').createFileImportDialogView().render().el);
        this.isInitialized = true;
      }
    },
    updateImportButton: function updateImportButton() {
      var importer = this.model.get('importer');
      this.ui.importButton.prop('disabled', importer.get('selectedFiles').length < 1);
    },
    getMetaData: function getMetaData() {
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
    onRender: function onRender() {
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
  function template$z(data) {
    var __t,
      __p = '';
    __p += '<button class="">\n  <span class="label">' + ((__t = I18n.t('pageflow.editor.templates.select_button.select')) == null ? '' : __t) + '</span>\n</button>\n\n<div class="dropdown">\n  <ul class="dropdown-menu" role="menu">\n  </ul>\n</div>\n';
    return __p;
  }
  var SelectButtonView = Marionette.ItemView.extend({
    template: template$z,
    className: 'select_button',
    ui: {
      button: 'button',
      label: 'button .label',
      menu: '.dropdown-menu',
      dropdown: '.dropdown'
    },
    events: {
      'click .dropdown-menu li': function clickDropdownMenuLi(e, x) {
        e.preventDefault();
        var index = getClickedIndex(e.target);
        this.model.get('options')[index].handler();
        function getClickedIndex(target) {
          var $target = $(target),
            index = parseInt($target.data('index'), 10);
          if (isNaN(index)) {
            index = parseInt($target.find('a').data('index'), 10);
          }
          return index;
        }
      }
    },
    onRender: function onRender() {
      this.ui.label.text(this.model.get('label'));
      this.model.get('options').forEach(this.addOption.bind(this));
    },
    addOption: function addOption(option, index) {
      this.ui.menu.append('<li><a href="#" data-index="' + index + '">' + option.label + '</a></li>');
    }
  });
  function template$A(data) {
    var __t,
      __p = '';
    __p += '<a class="back">' + ((__t = I18n.t('pageflow.editor.templates.files.back')) == null ? '' : __t) + '</a>\n';
    return __p;
  }
  var FilesView = Marionette.ItemView.extend({
    template: template$A,
    className: 'manage_files',
    events: {
      'click a.back': 'goBack',
      'file-selected': 'updatePage'
    },
    onRender: function onRender() {
      var menuOptions = [{
        label: I18n$1.t('pageflow.editor.views.files_view.upload'),
        handler: this.upload.bind(this)
      }, {
        label: I18n$1.t('pageflow.editor.views.files_view.reuse'),
        handler: function handler() {
          FilesExplorerView.open({
            callback: function callback(otherEntry, file) {
              state.entry.reuseFile(otherEntry, file);
            }
          });
        }
      }];
      if (editor.fileImporters.keys().length > 0) {
        menuOptions.push({
          label: I18n$1.t('pageflow.editor.views.files_view.import'),
          handler: function handler() {
            ChooseImporterView.open({
              callback: function callback(importer) {
                FilesImporterView.open({
                  importer: importer
                });
              }
            });
          }
        });
      }
      this.addFileModel = new Backbone.Model({
        label: I18n$1.t('pageflow.editor.views.files_view.add'),
        options: menuOptions
      });
      this.$el.append(this.subview(new SelectButtonView({
        model: this.addFileModel
      })).el);
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
      this.$el.append(this.subview(this.tabsView).el);
    },
    tab: function tab(fileType) {
      var selectionMode = this.options.allowSelectingAny || this.options.tabName === fileType.collectionName;
      this.tabsView.tab(fileType.collectionName, _.bind(function () {
        return new FilteredFilesView({
          entry: state.entry,
          fileType: fileType,
          selectionHandler: selectionMode && this.options.selectionHandler,
          filterName: selectionMode && this.options.filterName
        });
      }, this));
      this.listenTo(this.model, 'change:uploading_' + fileType.collectionName + '_count', function (model, value) {
        this.tabsView.toggleSpinnerOnTab(fileType.collectionName, value > 0);
      });
    },
    goBack: function goBack() {
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
    upload: function upload() {
      app.trigger('request-upload');
    }
  });
  function template$B(data) {
    var __p = '';
    __p += '<div class="quota_state">\n</div>\n<div class="outlet">\n</div>\n<div class="exhausted_message">\n</div>\n';
    return __p;
  }
  var EntryPublicationQuotaDecoratorView = Marionette.Layout.extend({
    template: template$B,
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
    onRender: function onRender() {
      this.model.check();
    },
    update: function update() {
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
  function template$C(data) {
    var __t,
      __p = '';
    __p += '<div class="files_pending notice">\n  <p>' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.files_pending_notice')) == null ? '' : __t) + '</p>\n  <p><a href="#files">' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.show_files')) == null ? '' : __t) + '</a></p>\n</div>\n\n<div>\n  <div class="published notice">\n    <p>' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.published_notice')) == null ? '' : __t) + '</p>\n    <p><a href="" target="_blank">' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.view_revisions')) == null ? '' : __t) + '</a></p>\n  </div>\n\n  <div class="not_published notice">\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.not_published_notice')) == null ? '' : __t) + '\n  </div>\n\n  <h2 class="sidebar-header">\n    ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.publish_current')) == null ? '' : __t) + '\n  </h2>\n\n  <div class="radio_input">\n    <input id="publish_entry_forever" type="radio" name="mode" value="publish_forever">\n    <label for="publish_entry_forever">' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.unlimited')) == null ? '' : __t) + '</label>\n  </div>\n\n  <div class="radio_input">\n    <input id="publish_entry_until" type="radio" name="mode" value="publish_until">\n    <label for="publish_entry_until">' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.until_including')) == null ? '' : __t) + '</label>\n  </div>\n\n  <div class="publish_until_fields disabled">\n    <label>\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.date')) == null ? '' : __t) + '\n      <input type="text" name="publish_until">\n    </label>\n\n    <label>\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.time')) == null ? '' : __t) + '\n      <input type="text" name="publish_until_time" value="00:00">\n    </label>\n  </div>\n\n  <div class="check_box_input">\n    <input id="publish_with_noindex" type="checkbox" name="noindex" value="1">\n    <label for="publish_with_noindex">\n      <span class="name">\n        ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.noindex')) == null ? '' : __t) + '\n      </span>\n      <span class="inline_help">\n        ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.noindex_help')) == null ? '' : __t) + '\n      </span>\n    </label>\n  </div>\n\n  <div class="check_box_input">\n    <input id="publish_password_protected" type="checkbox" name="password_protected" value="1">\n    <label for="publish_password_protected">\n      <span class="name">\n        ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.password_protected')) == null ? '' : __t) + '\n      </span>\n      <span class="inline_help">\n        ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.password_help')) == null ? '' : __t) + '\n      </span>\n    </label>\n  </div>\n\n  <div class="password_fields disabled">\n    <label>\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.user_name')) == null ? '' : __t) + '\n      <input type="text" name="user_name" disabled>\n    </label>\n\n    <label>\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.password')) == null ? '' : __t) + '\n      <input type="text" name="password">\n    </label>\n\n    <p class="already_published_with_password">\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.already_published_with_password_help')) == null ? '' : __t) + '\n    </p>\n    <p class="previously_published_with_password">\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.previously_published_with_password_help')) == null ? '' : __t) + '\n    </p>\n    <p class="already_published_without_password">\n      ' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.already_published_without_password_help')) == null ? '' : __t) + '\n    </p>\n  </div>\n\n  <button class="save" disabled>' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.publish')) == null ? '' : __t) + '</a>\n</div>\n\n<div class="success notice">\n  <p>' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.publish_success')) == null ? '' : __t) + '</p>\n  <p>' + ((__t = I18n.t('pageflow.editor.templates.publish_entry.published_url_hint')) == null ? '' : __t) + '</p>\n  <p><a href="" target="_blank"></a></p>\n</div>\n';
    return __p;
  }
  var PublishEntryView = Marionette.ItemView.extend({
    template: template$C,
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
      'change:published': function changePublished(model, value) {
        if (value) {
          this.ui.publishedNotice.effect('highlight', {
            duration: 'slow'
          });
        }
      }
    },
    onRender: function onRender() {
      this.ui.publishUntilField.datepicker({
        dateFormat: 'dd.mm.yy',
        constrainInput: true,
        defaultDate: new Date(),
        minDate: new Date()
      });
      this.update();
    },
    update: function update() {
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
    save: function save() {
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
    defaultPublishedUntilDate: function defaultPublishedUntilDate() {
      var date = new Date();
      date.setMonth(date.getMonth() + this.options.config.defaultPublishedUntilDurationInMonths);
      return date;
    },
    enableSave: function enableSave() {
      this.ui.saveButton.removeAttr('disabled');
    },
    disableSave: function disableSave() {
      this.ui.saveButton.attr('disabled', true);
    },
    enablePublishUntilFields: function enablePublishUntilFields() {
      this.ui.publishForeverRadioBox[0].checked = false;
      this.ui.publishUntilRadioBox[0].checked = true;
      this.ui.publishUntilFields.removeClass('disabled');
      this.checkForm();
    },
    disablePublishUntilFields: function disablePublishUntilFields() {
      this.ui.publishUntilRadioBox[0].checked = false;
      this.ui.publishUntilFields.addClass('disabled');
      this.checkForm();
      if (!this.checkPublishUntilTime()) {
        this.ui.publishUntilTimeField.val('00:00');
      }
      this.ui.publishUntilTimeField.removeClass('invalid');
      this.ui.publishUntilField.removeClass('invalid');
    },
    enablePublishForever: function enablePublishForever() {
      this.disablePublishUntilFields();
      this.ui.publishForeverRadioBox[0].checked = true;
      this.enableSave();
    },
    checkForm: function checkForm() {
      if (_.all([this.checkPublishUntil(), this.checkPassword()])) {
        this.enableSave();
      } else {
        this.disableSave();
      }
    },
    checkPublishUntil: function checkPublishUntil() {
      return this.ui.publishForeverRadioBox.is(':checked') || this.ui.publishUntilRadioBox.is(':checked') && _.all([this.checkPublishUntilDate(), this.checkPublishUntilTime()]);
    },
    checkPublishUntilDate: function checkPublishUntilDate() {
      if (this.ui.publishUntilField.datepicker('getDate')) {
        this.ui.publishUntilField.removeClass('invalid');
        return true;
      } else {
        this.ui.publishUntilField.addClass('invalid');
        return false;
      }
    },
    checkPublishUntilTime: function checkPublishUntilTime() {
      if (!this.ui.publishUntilTimeField.val().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        this.ui.publishUntilTimeField.addClass('invalid');
        return false;
      }
      this.ui.publishUntilTimeField.removeClass('invalid');
      return true;
    },
    togglePasswordFields: function togglePasswordFields() {
      this.ui.passwordFields.toggleClass('disabled', !this.ui.passwordProtectedCheckBox.is(':checked'));
      this.checkForm();
    },
    checkPassword: function checkPassword() {
      if (this.ui.passwordField.val().length === 0 && !this.model.get('password_protected') && this.ui.passwordProtectedCheckBox.is(':checked')) {
        this.ui.passwordField.addClass('invalid');
        return false;
      } else {
        this.ui.passwordField.removeClass('invalid');
        return true;
      }
    },
    randomPassword: function randomPassword() {
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
  var SidebarController = Marionette.Controller.extend({
    initialize: function initialize(options) {
      this.region = options.region;
      this.entry = options.entry;
    },
    index: function index(storylineId) {
      this.region.show(new EditEntryView({
        model: this.entry,
        storylineId: storylineId
      }));
    },
    files: function files(collectionName, handler, payload, filterName) {
      var _split = (collectionName || '').split(':'),
        _split2 = _slicedToArray$1(_split, 2),
        tabName = _split2[0],
        suffix = _split2[1];
      this.region.show(new FilesView({
        model: this.entry,
        selectionHandler: handler && editor.createFileSelectionHandler(handler, payload),
        tabName: tabName,
        allowSelectingAny: suffix === 'default',
        filterName: filterName
      }));
      editor.setDefaultHelpEntry('pageflow.help_entries.files');
    },
    confirmableFiles: function confirmableFiles(preselectedFileType, preselectedFileId) {
      var model = EncodingConfirmation.createWithPreselection({
        fileType: preselectedFileType,
        fileId: preselectedFileId
      });
      model.check();
      this.region.show(ConfirmEncodingView.create({
        model: model
      }));
    },
    metaData: function metaData(tab) {
      this.region.show(new EditMetaDataView({
        model: this.entry,
        tab: tab,
        state: state,
        features: frontend.features,
        editor: editor
      }));
    },
    publish: function publish() {
      this.region.show(PublishEntryView.create({
        model: this.entry,
        account: state.account,
        entryPublication: new EntryPublication(),
        config: state.config
      }));
      editor.setDefaultHelpEntry('pageflow.help_entries.publish');
    },
    widget: function widget(id) {
      var model = this.entry.widgets.get(id);
      this.region.show(new EditWidgetView({
        entry: this.entry,
        model: model
      }));
      this.entry.trigger('selectWidget', model);
    }
  });
  var UploaderView = Marionette.View.extend({
    el: 'form#upload',
    initialize: function initialize() {
      this.listenTo(app, 'request-upload', this.openFileDialog);
    },
    render: function render() {
      var that = this;
      this.$el.fileupload({
        type: 'POST',
        paramName: 'file',
        dataType: 'XML',
        acceptFileTypes: new RegExp('(\\.|\\/)(bmp|gif|jpe?g|png|ti?f|wmv|mp4|mpg|mov|asf|asx|avi|' + 'm?v|mpeg|qt|3g2|3gp|3ivx|divx|3vx|vob|flv|dvx|xvid|mkv|vtt)$', 'i'),
        add: function add(event, data) {
          try {
            state.fileUploader.add(data.files[0]).then(function (record) {
              data.record = record;
              record.save(null, {
                success: function success() {
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
        progress: function progress(event, data) {
          data.record.set('uploading_progress', parseInt(data.loaded / data.total * 100, 10));
        },
        done: function done(event, data) {
          data.record.unset('uploading_progress');
          data.record.publish();
        },
        fail: function fail(event, data) {
          if (data.errorThrown !== 'abort') {
            data.record.uploadFailed();
          }
        },
        always: function always(event, data) {
          that.stopListening(data.record);
        }
      });
      return this;
    },
    openFileDialog: function openFileDialog() {
      this.$('input:file').click();
    }
  });
  var ScrollingView = Marionette.View.extend({
    events: {
      scroll: function scroll() {
        if (this._isChapterView()) {
          this.scrollpos = this.$el.scrollTop();
        }
      }
    },
    initialize: function initialize() {
      this.scrollpos = 0;
      this.listenTo(this.options.region, 'show', function () {
        if (this._isChapterView()) {
          this.$el.scrollTop(this.scrollpos);
        }
      });
    },
    _isChapterView: function _isChapterView() {
      return !Backbone.history.getFragment();
    }
  });
  function template$D(data) {
    var __t,
      __p = '';
    __p += '<div class="box">\n  <h2>' + ((__t = I18n.t('pageflow.editor.templates.help.title')) == null ? '' : __t) + '</h2>\n\n  <div class="placeholder"></div>\n\n  <div class="footer">\n    <a class="close" href="">' + ((__t = I18n.t('pageflow.editor.templates.help.close')) == null ? '' : __t) + '</a>\n  </div>\n</div>\n';
    return __p;
  }
  var HelpView = Marionette.ItemView.extend({
    template: template$D,
    className: 'help',
    ui: {
      placeholder: '.placeholder',
      sections: 'section',
      menuItems: 'li'
    },
    events: {
      'click .close': function clickClose() {
        this.toggle();
      },
      'click .expandable > a': function clickExpandableA(event) {
        $(event.currentTarget).parents('.expandable').toggleClass('expanded');
      },
      'click a': function clickA(event) {
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
      'click .box': function clickBox() {
        return false;
      },
      'click': function click() {
        this.toggle();
      }
    },
    initialize: function initialize() {
      this.listenTo(app, 'toggle-help', function (name) {
        this.toggle();
        this.showSection(name || editor.defaultHelpEntry || this.defaultHelpEntry(), {
          scrollIntoView: true
        });
      });
    },
    onRender: function onRender() {
      this.ui.placeholder.replaceWith($('#help_entries_seed').html());
      this.bindUIElements();
    },
    toggle: function toggle() {
      this.$el.toggle();
    },
    defaultHelpEntry: function defaultHelpEntry() {
      return this.ui.sections.first().data('name');
    },
    showSection: function showSection(name, options) {
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
  var PageThumbnailView = ModelThumbnailView.extend({
    className: 'model_thumbnail page_thumbnail'
  });
  function template$E(data) {
    var __t,
      __p = '';
    __p += '<div>\n  <span class="missing_page_thumbnail"></span>\n  <span class="page_thumbnail"></span>\n  <div class="title"></div>\n  <div class="label"></div>\n  <a class="remove" title="' + ((__t = I18n.t('pageflow.editor.templates.page_link_item.remove')) == null ? '' : __t) + '"></a>\n  <a class="edit" title="' + ((__t = I18n.t('pageflow.editor.templates.page_link_item.edit')) == null ? '' : __t) + '"></a>\n<div>\n';
    return __p;
  }
  var PageLinkItemView = Marionette.ItemView.extend({
    template: template$E,
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
      'click .edit': function clickEdit() {
        editor.navigate(this.model.editPath(), {
          trigger: true
        });
        return false;
      },
      'mouseenter': function mouseenter() {
        this.model.highlight(true);
      },
      'mouseleave': function mouseleave() {
        this.model.resetHighlight(false);
      },
      'click .remove': function clickRemove() {
        if (confirm(I18n$1.t('pageflow.internal_links.editor.views.edit_page_link_view.confirm_destroy'))) {
          this.model.remove();
        }
      }
    },
    onRender: function onRender() {
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
  function template$F(data) {
    var __t,
      __p = '';
    __p += '<label>\n  <span class="name">' + ((__t = I18n.t('pageflow.editor.templates.page_links.label')) == null ? '' : __t) + '</span>\n</label>\n<ul class="links outline"></ul>\n\n<a href="" class="add_link">' + ((__t = I18n.t('pageflow.editor.templates.page_links.add')) == null ? '' : __t) + '</a>\n';
    return __p;
  }
  var PageLinksView = Marionette.ItemView.extend({
    template: template$F,
    className: 'page_links',
    ui: {
      links: 'ul.links',
      addButton: '.add_link'
    },
    events: {
      'click .add_link': function clickAdd_link() {
        var view = this;
        editor.selectPage().then(function (page) {
          view.model.pageLinks().addLink(page.get('perma_id'));
        });
        return false;
      }
    },
    onRender: function onRender() {
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
    updateAddButton: function updateAddButton(pageLinks) {
      this.ui.addButton.css('display', pageLinks.canAddLink() ? 'inline-block' : 'none');
    }
  });
  function template$G(data) {
    var __p = '';
    __p += '<div class="emulation_mode_button-wrapper"\n     data-tooltip-align="top center">\n  <div class="emulation_mode_button-desktop_icon"/>\n  <div class="emulation_mode_button-phone_icon"/>\n  <div class="emulation_mode_button-track" />\n  <div class="emulation_mode_button-thumb" />\n</div>\n';
    return __p;
  }
  var EmulationModeButtonView = Marionette.ItemView.extend({
    template: template$G,
    className: 'emulation_mode_button',
    mixins: [tooltipContainer],
    ui: {
      wrapper: '.emulation_mode_button-wrapper',
      desktopIcon: '.emulation_mode_button-desktop_icon',
      phoneIcon: '.emulation_mode_button-phone_icon'
    },
    events: {
      'click': function click() {
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
    onRender: function onRender() {
      this.update();
    },
    update: function update() {
      this.$el.toggleClass('disabled', !!this.model.get('emulation_mode_disabled'));
      this.$el.toggleClass('active', this.model.has('emulation_mode'));
      this.ui.wrapper.attr('data-tooltip', this.model.get('emulation_mode_disabled') ? 'pageflow.editor.templates.emulation_mode_button.disabled_hint' : 'pageflow.editor.templates.emulation_mode_button.tooltip');
    }
  });
  function template$H(data) {
    var __t,
      __p = '';
    __p += (__t = I18n.t('pageflow.editor.templates.help_button.open_help')) == null ? '' : __t;
    return __p;
  }
  var HelpButtonView = Marionette.ItemView.extend({
    template: template$H,
    className: 'help_button',
    events: {
      'click': function click() {
        app.trigger('toggle-help');
      }
    }
  });
  var SidebarFooterView = Marionette.View.extend({
    className: 'sidebar_footer',
    render: function render() {
      if (this.model.supportsPhoneEmulation()) {
        this.appendSubview(new EmulationModeButtonView({
          model: this.model
        }));
      }
      this.appendSubview(new HelpButtonView());
      return this;
    }
  });
  var HelpImageView = Marionette.View.extend({
    tagName: 'img',
    className: 'help_image',
    render: function render() {
      this.$el.attr('src', state.editorAssetUrls.help[this.options.imageName]);
      return this;
    }
  });
  var InfoBoxView = Marionette.View.extend({
    className: 'info_box',
    mixins: [attributeBinding],
    initialize: function initialize() {
      this.setupBooleanAttributeBinding('visible', this.updateVisible);
    },
    updateVisible: function updateVisible() {
      this.$el.toggleClass('hidden_via_binding', this.getBooleanAttributBoundOption('visible') === false);
    },
    render: function render() {
      this.$el.addClass(this.options.level);
      this.$el.html(this.options.text);
      return this;
    }
  });
  function template$I(data) {
    var __t,
      __p = '';
    __p += '<span class="list_item_thumbnail"></span>\n<span class="list_item_missing_thumbnail"></span>\n<span class="list_item_type_pictogram type_pictogram"></span>\n\n<div class="list_item_title"></div>\n<div class="list_item_description"></div>\n\n<div class="list_item_buttons">\n  <a class="list_item_edit_button" title="' + ((__t = I18n.t('pageflow.editor.templates.list_item.edit')) == null ? '' : __t) + '"></a>\n  <a class="list_item_remove_button" title="' + ((__t = I18n.t('pageflow.editor.templates.list_item.remove')) == null ? '' : __t) + '"></a>\n</div>\n';
    return __p;
  }
  var ListItemView = Marionette.ItemView.extend({
    template: template$I,
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
      'click .list_item_edit_button': function clickList_item_edit_button() {
        this.options.onEdit(this.model);
        return false;
      },
      'click .list_item_remove_button': function clickList_item_remove_button() {
        this.options.onRemove(this.model);
        return false;
      },
      'mouseenter': function mouseenter() {
        if (this.options.highlight) {
          this.model.highlight();
        }
      },
      'mouseleave': function mouseleave() {
        if (this.options.highlight) {
          this.model.resetHighlight();
        }
      }
    },
    modelEvents: {
      'change': 'update'
    },
    onRender: function onRender() {
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
    update: function update() {
      this.ui.typePictogram.attr('title', this.typeDescription());
      this.ui.title.text(this.model.title() || I18n$1.t('pageflow.editor.views.page_link_item_view.unnamed'));
      this.ui.description.text(this.description());
      this.ui.description.toggle(!!this.description());
      this.$el.toggleClass('is_invalid', !!this.getOptionResult('isInvalid'));
    },
    onClose: function onClose() {
      if (this.options.highlight) {
        this.model.resetHighlight();
      }
    },
    description: function description() {
      return this.getOptionResult('description');
    },
    typeName: function typeName() {
      return this.getOptionResult('typeName');
    },
    typeDescription: function typeDescription() {
      return this.getOptionResult('typeDescription');
    },
    getOptionResult: function getOptionResult(name) {
      return typeof this.options[name] === 'function' ? this.options[name](this.model) : this.options[name];
    }
  });
  function template$J(data) {
    var __t,
      __p = '';
    __p += '<div class="checking notice editor">\n  <p>' + ((__t = I18n.t('pageflow.editor.templates.locked.loading')) == null ? '' : __t) + '</p>\n\n  <a class="close" href="#">' + ((__t = I18n.t('pageflow.editor.templates.locked.close')) == null ? '' : __t) + '</a>\n</div>\n\n<div class="error notice editor">\n  <p class="message"></p>\n\n  <a class="close" href="#">' + ((__t = I18n.t('pageflow.editor.templates.locked.close')) == null ? '' : __t) + '</a>\n  <a class="break" href="#">' + ((__t = I18n.t('pageflow.editor.templates.locked.open_here')) == null ? '' : __t) + '</a>\n</div>\n\n';
    return __p;
  }
  var LockedView = Marionette.ItemView.extend({
    template: template$J,
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
    breakLock: function breakLock() {
      this.model.acquire({
        force: true
      });
    },
    goBack: function goBack() {
      window.location = "/admin/entries/" + state.entry.id;
    },
    show: function show(info, options) {
      var key = info.error + '.' + options.context;
      this.ui.message.html(I18n$1.t('pageflow.edit_locks.errors.' + key + '_html', {
        user_name: info.held_by
      }));
      this.ui.message.attr('data-error', key);
      this.ui.breakButton.text(I18n$1.t('pageflow.edit_locks.break_action.acquire'));
      this.$el.removeClass('checking');
      this.$el.show();
    },
    hide: function hide() {
      this.ui.message.attr('data-error', null);
      this.$el.removeClass('checking');
      this.$el.hide();
    }
  });
  var EditorView = Backbone.View.extend({
    events: {
      'click a': function clickA(event) {
        // prevent default for all links
        if (!$(event.currentTarget).attr('target') && !$(event.currentTarget).attr('download') && !$(event.currentTarget).attr('href')) {
          return false;
        }
      }
    },
    initialize: function initialize() {
      $(window).on('beforeunload', function (event) {
        if (state.entry.get('uploading_files_count') > 0) {
          return I18n$1.t('pageflow.editor.views.editor_views.files_pending_warning');
        }
      });
    },
    render: function render() {
      this.$el.layout({
        minSize: 300,
        togglerTip_closed: I18n$1.t('pageflow.editor.views.editor_views.show_editor'),
        togglerTip_open: I18n$1.t('pageflow.editor.views.editor_views.hide_editor'),
        resizerTip: I18n$1.t('pageflow.editor.views.editor_views.resize_editor'),
        enableCursorHotkey: false,
        fxName: 'none',
        maskIframesOnResize: true,
        onresize: function onresize() {
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
  var BackgroundImageEmbeddedView = Marionette.View.extend({
    modelEvents: {
      'change': 'update'
    },
    render: function render() {
      this.update();
      return this;
    },
    update: function update() {
      if (this.options.useInlineStyles !== false) {
        this.updateInlineStyle();
      } else {
        this.updateClassName();
      }
      if (this.options.dataSizeAttributes) {
        this.updateDataSizeAttributes();
      }
    },
    updateClassName: function updateClassName() {
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
    updateInlineStyle: function updateInlineStyle() {
      this.$el.css({
        backgroundImage: this.imageValue(),
        backgroundPosition: this.model.getFilePosition(this.options.propertyName, 'x') + '% ' + this.model.getFilePosition(this.options.propertyName, 'y') + '%'
      });
    },
    updateDataSizeAttributes: function updateDataSizeAttributes() {
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
    imageValue: function imageValue() {
      var url = this.model.getImageFileUrl(this.options.propertyName, {
        styleGroup: this.$el.data('styleGroup')
      });
      return url ? 'url("' + url + '")' : 'none';
    }
  });
  var LazyVideoEmbeddedView = Marionette.View.extend({
    modelEvents: {
      'change': 'update'
    },
    render: function render() {
      this.videoPlayer = this.$el.data('videoPlayer');
      this.videoPlayer.ready(_.bind(function () {
        this.videoPlayer.src(this.model.getVideoFileSources(this.options.propertyName));
      }, this));
      this.update();
      return this;
    },
    update: function update() {
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
  function template$K(data) {
    var __t,
      __p = '';
    __p += '<li class="uploading"><span class="count">0</span>' + ((__t = I18n.t('pageflow.editor.templates.notification.upload_pending')) == null ? '' : __t) + '</li>\n<li class="failed"><span class="count">0</span> <span class="description">' + ((__t = I18n.t('pageflow.editor.templates.notification.save_error')) == null ? '' : __t) + '</span> <a class="retry">' + ((__t = I18n.t('pageflow.editor.templates.notification.retry')) == null ? '' : __t) + '</a></li>\n<li class="saving">' + ((__t = I18n.t('pageflow.editor.templates.notification.saving')) == null ? '' : __t) + '</li>\n<li class="saved">' + ((__t = I18n.t('pageflow.editor.templates.notification.saved')) == null ? '' : __t) + '</li>\n\n<li class="confirmable_files">\n  ' + ((__t = I18n.t('pageflow.editor.templates.notification.approve_files', {
      num_files: '<span class="count">0</span>'
    })) == null ? '' : __t) + '\n  <a href="#/confirmable_files" class="display_confirmable_files">' + ((__t = I18n.t('pageflow.editor.templates.notification.show')) == null ? '' : __t) + '</a>\n</li>\n';
    return __p;
  }
  var NotificationsView = Marionette.ItemView.extend({
    className: 'notifications',
    tagName: 'ul',
    template: template$K,
    ui: {
      failedCount: '.failed .count',
      uploadingCount: '.uploading .count',
      confirmableFilesCount: '.confirmable_files .count'
    },
    events: {
      'click .retry': function clickRetry() {
        editor.failures.retry();
      }
    },
    onRender: function onRender() {
      this.listenTo(state.entry, 'change:uploading_files_count', this.notifyUploadCount);
      this.listenTo(state.entry, 'change:confirmable_files_count', this.notifyConfirmableFilesCount);
      this.listenTo(editor.savingRecords, 'add', this.update);
      this.listenTo(editor.savingRecords, 'remove', this.update);
      this.listenTo(editor.failures, 'add', this.update);
      this.listenTo(editor.failures, 'remove', this.update);
      this.update();
      this.notifyConfirmableFilesCount();
    },
    update: function update() {
      this.$el.toggleClass('failed', !editor.failures.isEmpty());
      this.$el.toggleClass('saving', !editor.savingRecords.isEmpty());
      this.ui.failedCount.text(editor.failures.count());
    },
    notifyUploadCount: function notifyUploadCount(model, uploadCount) {
      this.$el.toggleClass('uploading', uploadCount > 0);
      this.ui.uploadingCount.text(uploadCount);
    },
    notifyConfirmableFilesCount: function notifyConfirmableFilesCount() {
      var confirmableFilesCount = state.entry.get('confirmable_files_count');
      this.$el.toggleClass('has_confirmable_files', confirmableFilesCount > 0);
      this.ui.confirmableFilesCount.text(confirmableFilesCount);
    }
  });
  var FileProcessingStateDisplayView = Marionette.View.extend({
    className: 'file_processing_state_display',
    mixins: [inputView],
    initialize: function initialize() {
      if (typeof this.options.collection === 'string') {
        this.options.collection = state.entry.getFileCollection(editor.fileTypes.findByCollectionName(this.options.collection));
      }
      this.listenTo(this.model, 'change:' + this.options.propertyName, this._update);
    },
    render: function render() {
      this._update();
      return this;
    },
    _update: function _update() {
      if (this.fileStagesView) {
        this.stopListening(this.file.unfinishedStages);
        this.fileStagesView.close();
        this.fileStagesView = null;
      }
      this.file = this._getFile();
      if (this.file) {
        this.listenTo(this.file.unfinishedStages, 'add remove', this._updateClassNames);
        this.fileStagesView = new CollectionView({
          tagName: 'ul',
          collection: this.file.unfinishedStages,
          itemViewConstructor: FileStageItemView,
          itemViewOptions: {
            standAlone: true
          }
        });
        this.appendSubview(this.fileStagesView);
      }
      this._updateClassNames();
    },
    _updateClassNames: function _updateClassNames() {
      this.$el.toggleClass('file_processing_state_display-empty', !this._hasItems());
    },
    _hasItems: function _hasItems() {
      return this.file && this.file.unfinishedStages.length;
    },
    _getFile: function _getFile() {
      return this.model.getReference(this.options.propertyName, this.options.collection);
    }
  });
  var NestedFilesView = Marionette.View.extend({
    className: 'nested_files',
    initialize: function initialize() {
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
    render: function render() {
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
    update: function update() {
      this.$el.toggleClass('is_empty', this.collection.length === 0);
    },
    columns: function columns(fileType) {
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
    selectNewFile: function selectNewFile(file) {
      this.options.selection.set('file', file);
      this.setNextFile();
    },
    selectNextFileIfSelectionDeleted: function selectNextFileIfSelectionDeleted() {
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
  function template$L(data) {
    var __t,
      __p = '';
    __p += '<div class="text_tracks_container">\n  <div class="files_upload_panel">\n    <div class="files_panel">\n    </div>\n    <a class="upload" href="">' + ((__t = I18n.t('pageflow.editor.templates.text_tracks.upload')) == null ? '' : __t) + '</a>\n  </div>\n\n  <div class="selected_file_panel">\n    <h2 class="selected_file_header dialog-sub_header">' + ((__t = I18n.t('pageflow.editor.templates.text_tracks.edit_file_header')) == null ? '' : __t) + '</h2>\n    <div class="selected_file_region">\n    </div>\n  </div>\n</div>\n';
    return __p;
  }
  var TextTracksView = Marionette.Layout.extend({
    template: template$L,
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
    initialize: function initialize(options) {
      this.options = options || {};
      this.selection = new Backbone.Model();
      this.listenTo(this.selection, 'change', this.update);
    },
    onRender: function onRender() {
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
    onClose: function onClose() {
      editor.setUploadTargetFile(undefined);
    },
    update: function update() {
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
    upload: function upload() {
      app.trigger('request-upload');
    }
  });
  var TextTracksFileMetaDataItemValueView = FileMetaDataItemValueView.extend({
    initialize: function initialize() {
      this.textTrackFiles = this.model.nestedFiles(state.textTrackFiles);
      this.listenTo(this.textTrackFiles, 'add remove change:configuration', this.update);
    },
    getText: function getText() {
      return this.textTrackFiles.map(function (textTrackFile) {
        return textTrackFile.displayLabel();
      }).join(', ');
    }
  });
  function template$M(data) {
    var __p = '';
    __p += '<label>\n  <span class="list_label"></span>\n</label>\n\n<ul class="list_items"></ul>\n';
    return __p;
  }
  function blankSlateTemplate$1$1(data) {
    var __t,
      __p = '';
    __p += ((__t = I18n.t('pageflow.editor.templates.list_blank_slate.text')) == null ? '' : __t) + '\n';
    return __p;
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
  var ListView = Marionette.ItemView.extend({
    template: template$M,
    className: 'list',
    ui: {
      label: '.list_label',
      items: '.list_items'
    },
    onRender: function onRender() {
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
          template: blankSlateTemplate$1$1
        })
      }));
      this.ui.label.text(this.options.label);
      this.$el.toggleClass('with_type_pictogram', !!this.options.itemTypeName);
    }
  });
  var ConfirmUploadView = Marionette.Layout.extend({
    template: template$x,
    className: 'confirm_upload editor dialog',
    mixins: [dialogView],
    regions: {
      selectedFileRegion: '.selected_file_region'
    },
    ui: {
      filesPanel: '.files_panel'
    },
    events: {
      'click .upload': function clickUpload() {
        this.options.fileUploader.submit();
        this.close();
      }
    },
    initialize: function initialize() {
      this.selection = new Backbone.Model();
      this.listenTo(this.selection, 'change', this.update);
    },
    onRender: function onRender() {
      this.options.fileTypes.each(function (fileType) {
        this.ui.filesPanel.append(this.subview(new UploadableFilesView({
          collection: this.options.files[fileType.collectionName],
          fileType: fileType,
          selection: this.selection
        })).el);
      }, this);
      this.update();
    },
    onClose: function onClose() {
      this.options.fileUploader.abort();
    },
    update: function update() {
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
   * * `<translationKeyPrefix>.destroy` (optional): Destroy button
   *   label.
   *
   * * `<translationKeyPrefix>.confirm_destroy` (optional): Confirm
   *   message displayed before destroying.
   *
   * * `<translationKeyPrefix>.save_error` (optional): Header of the
   *   failure message that is displayed if the model cannot be saved.
   *
   * * `<translationKeyPrefix>.retry` (optional): Label of the retry
   *   button of the failure message.
   *
   * Override the `destroyModel` method to customize destroy behavior.
   * Calls `destroyWithDelay` by default.
   *
   * Override the `goBackPath` property or method to customize the path
   * that the back button navigates to. Defaults to `/`.
   *
   * Set the `hideDestroyButton` property to `true` to hide the destroy
   * button.
   *
   * @param {Object} options
   * @param {Backbone.Model} options.model -
   *   Model including the {@link configurationContainer},
   *   {@link failureTracking} and {@link delayedDestroying} mixins.
   *
   * @since 15.1
   */
  var EditConfigurationView = Marionette.Layout.extend({
    className: 'edit_configuration_view',
    template: function template(_ref) {
      var t = _ref.t,
        backLabel = _ref.backLabel,
        hideDestroyButton = _ref.hideDestroyButton;
      return "\n    <a class=\"back\">".concat(backLabel, "</a>\n    ").concat(hideDestroyButton ? '' : "<a class=\"destroy\">".concat(t('destroy'), "</a>"), "\n\n    <div class=\"failure\">\n      <p>").concat(t('save_error'), "</p>\n      <p class=\"message\"></p>\n      <a class=\"retry\" href=\"\">").concat(t('retry'), "</a>\n    </div>\n\n    <div class=\"configuration_container\"></div>\n  ");
    },
    serializeData: function serializeData() {
      var _this = this;
      return {
        t: function t(key) {
          return _this.t(key);
        },
        backLabel: this.getBackLabel(),
        hideDestroyButton: _.result(this, 'hideDestroyButton')
      };
    },
    mixins: [failureIndicatingView],
    regions: {
      configurationContainer: '.configuration_container'
    },
    events: {
      'click a.back': 'goBack',
      'click a.destroy': 'destroy'
    },
    onRender: function onRender() {
      var translationKeyPrefix = _.result(this, 'translationKeyPrefix');
      this.configurationEditor = new ConfigurationEditorView({
        tabTranslationKeyPrefix: "".concat(translationKeyPrefix, ".tabs"),
        attributeTranslationKeyPrefixes: ["".concat(translationKeyPrefix, ".attributes")],
        model: this.model.configuration
      });
      this.configure(this.configurationEditor);
      this.configurationContainer.show(this.configurationEditor);
    },
    onShow: function onShow() {
      this.configurationEditor.refreshScroller();
    },
    destroy: function destroy() {
      if (window.confirm(this.t('confirm_destroy'))) {
        if (this.destroyModel() !== false) {
          this.goBack();
        }
      }
    },
    destroyModel: function destroyModel() {
      this.model.destroyWithDelay();
    },
    goBack: function goBack() {
      var path = _.result(this, 'goBackPath') || '/';
      editor.navigate(path, {
        trigger: true
      });
    },
    getBackLabel: function getBackLabel() {
      return this.t(_.result(this, 'goBackPath') ? 'back' : 'outline');
    },
    t: function t(suffix) {
      var translationKeyPrefix = _.result(this, 'translationKeyPrefix');
      return I18n$1.t("".concat(translationKeyPrefix, ".").concat(suffix), {
        defaultValue: I18n$1.t("pageflow.editor.views.edit_configuration.".concat(suffix))
      });
    }
  });
  editor.widgetTypes.register('classic_loading_spinner', {
    configurationEditorView: ConfigurationEditorView.extend({
      configure: function configure() {
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
      configure: function configure() {
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
      configure: function configure() {
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
      configure: function configure() {
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
      configure: function configure() {
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
      configure: function configure() {
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
    frontend.features.enable('editor', options.entry.enabled_feature_names);
  });
  app.addInitializer(function (options) {
    frontend.Audio.setup({
      getSources: function getSources(audioFileId) {
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
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
  }
  var OtherFile = UploadableFile.extend({
    thumbnailPictogram: 'other'
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
      editor.fileTypes.commonMetaDataAttributes = [].concat(_toConsumableArray(editor.fileTypes.commonMetaDataAttributes), [{
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
          formatValue: function formatValue(value) {
            return I18n$1.t("pageflow.file_licenses.".concat(value, ".name"));
          },
          settingsDialogTabLink: 'general'
        }
      }]);
    }
    editor.fileTypes.commonSettingsDialogTabs = [{
      name: 'general',
      view: EditFileView
    }];
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
        supersetCollection: function supersetCollection() {
          return state.textTrackFiles;
        }
      }
    };
    var altMetaDataAttribute = {
      name: 'alt',
      valueView: TextFileMetaDataItemValueView,
      valueViewOptions: {
        fromConfiguration: true,
        settingsDialogTabLink: 'general'
      }
    };
    var altConfigurationEditorInput = {
      name: 'alt',
      inputView: TextInputView,
      inputViewOptions: {
        maxLength: 5000
      }
    };
    editor.fileTypes.register('image_files', {
      model: ImageFile,
      metaDataAttributes: ['dimensions', altMetaDataAttribute],
      matchUpload: /^image/,
      configurationEditorInputs: [altConfigurationEditorInput]
    });
    editor.fileTypes.register('video_files', {
      model: VideoFile,
      metaDataAttributes: ['format', 'dimensions', 'duration', textTracksMetaDataAttribute, altMetaDataAttribute],
      matchUpload: /^video/,
      configurationEditorInputs: [altConfigurationEditorInput],
      settingsDialogTabs: [textTracksSettingsDialogTab]
    });
    editor.fileTypes.register('audio_files', {
      model: AudioFile,
      metaDataAttributes: ['format', 'duration', textTracksMetaDataAttribute, altMetaDataAttribute],
      matchUpload: /^audio/,
      configurationEditorInputs: [altConfigurationEditorInput],
      settingsDialogTabs: [textTracksSettingsDialogTab]
    });
    editor.fileTypes.register('text_track_files', {
      model: TextTrackFile,
      matchUpload: function matchUpload(upload) {
        return upload.name.match(/\.vtt$/) || upload.name.match(/\.srt$/);
      },
      skipUploadConfirmation: true,
      noExtendedFileRights: true,
      configurationEditorInputs: [{
        name: 'label',
        inputView: TextInputView,
        inputViewOptions: {
          placeholder: function placeholder(configuration) {
            var textTrackFile = configuration.parent;
            return textTrackFile.inferredLabel();
          },
          placeholderBinding: TextTrackFile.displayLabelBinding
        }
      }, {
        name: 'kind',
        inputView: SelectInputView,
        inputViewOptions: {
          values: state.config.availableTextTrackKinds,
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
        value: function value(textTrackFile) {
          return textTrackFile.displayLabel();
        },
        contentBinding: TextTrackFile.displayLabelBinding
      }, {
        name: 'srclang',
        cellView: TextTableCellView,
        "default": I18n$1.t('pageflow.editor.text_track_files.srclang_missing')
      }, {
        name: 'kind',
        cellView: IconTableCellView,
        cellViewOptions: {
          icons: state.config.availableTextTrackKinds
        }
      }],
      nestedFilesOrder: {
        comparator: function comparator(textTrackFile) {
          return textTrackFile.displayLabel().toLowerCase();
        },
        binding: 'label'
      }
    });
    editor.fileTypes.register('other_files', {
      model: OtherFile,
      metaDataAttributes: [altMetaDataAttribute],
      matchUpload: function matchUpload() {
        return true;
      },
      priority: 100,
      configurationEditorInputs: [{
        name: 'alt',
        inputView: TextInputView
      }]
    });
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
    widgets.subject = state.entry;
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
    editor.savingRecords.watch(state.pages);
    editor.savingRecords.watch(state.chapters);
    frontend.events.trigger('seed:loaded');
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
      fn.call(context, _objectSpread2$2(_objectSpread2$2({}, args), {}, {
        entry: state.entry
      }));
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

  var PreviewEntryData = frontend$1.EntryData.extend({
    initialize: function initialize(options) {
      this.entry = options.entry;
      this.storylines = options.storylines;
      this.chapters = options.chapters;
      this.pages = options.pages;
    },
    getSiteOption: function getSiteOption(name) {
      return this.entry.getTheme().get(name);
    },
    getFile: function getFile(collectionName, permaId) {
      var file = this.entry.getFileCollection(collectionName).getByPermaId(permaId);
      return file && file.attributes;
    },
    getStorylineConfiguration: function getStorylineConfiguration(id) {
      var storyline = this.storylines.get(id);
      return storyline ? storyline.configuration.attributes : {};
    },
    getChapterConfiguration: function getChapterConfiguration(id) {
      var chapter = this.chapters.get(id);
      return chapter ? chapter.configuration.attributes : {};
    },
    getChapterPosition: function getChapterPosition(id) {
      var chapter = this.chapters.get(id);
      return this.chapters.indexOf(chapter);
    },
    getChapterPagePermaIds: function getChapterPagePermaIds(id) {
      var chapter = this.chapters.get(id);
      return chapter ? chapter.pages.pluck('perma_id') : [];
    },
    getStorylineIdByChapterId: function getStorylineIdByChapterId(id) {
      var chapter = this.chapters.get(id);
      return chapter && chapter.get('storyline_id');
    },
    getChapterIdByPagePermaId: function getChapterIdByPagePermaId(permaId) {
      var page = this.pages.getByPermaId(permaId);
      return page && page.get('chapter_id');
    },
    getPageConfiguration: function getPageConfiguration(permaId) {
      var page = this.pages.getByPermaId(permaId);
      return page ? page.configuration.attributes : {};
    },
    getPagePosition: function getPagePosition(permaId) {
      return this.pages.indexOf(this.pages.getByPermaId(permaId));
    }
  });

  var PagedEntry = Entry.extend({
    setupFromEntryTypeSeed: function setupFromEntryTypeSeed(seed, state) {
      state.entryData = new PreviewEntryData({
        entry: this,
        storylines: state.storylines,
        chapters: state.chapters,
        pages: state.pages
      });
    },
    supportsPhoneEmulation: function supportsPhoneEmulation() {
      return frontend.features.isEnabled('editor_emulation_mode');
    }
  });

  function template$N(data) {
  var __t, __p = '';
  __p += '<a href="">\n  <span class="type_pictogram"></span>\n  <span class="page_thumbnail"></span>\n  <span class="title"></span>\n  <span class="failure_icon" title="' +
  ((__t = ( I18n.t('pageflow.editor.templates.page_item.save_error') )) == null ? '' : __t) +
  '" />\n</a>\n';
  return __p
  }

  var PageItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: template$N,
    ui: {
      title: '.title',
      pictogram: '.type_pictogram',
      pageThumbnail: '.page_thumbnail'
    },
    modelEvents: {
      'change:title': 'update',
      'change:active': 'update'
    },
    onRender: function onRender() {
      this.subview(new PageThumbnailView({
        el: this.ui.pageThumbnail,
        model: this.model
      }));
      this.update();
    },
    update: function update() {
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-perma-id', this.model.get('perma_id'));
      this.$el.attr('title', this._getItemTitle());
      this.$el.toggleClass('active', this.model.get('active'));
      this.$el.toggleClass('disabled', !!(this.options.isDisabled && this.options.isDisabled(this.model)));
      this.$el.toggleClass('hide_in_navigation', !this.model.configuration.get('display_in_navigation'));
      this.$el.removeClass(editor.pageTypes.pluck('name').join(' ')).addClass(this.model.get('template'));
      this.ui.pictogram.attr('title', this._getPictogramTitle());
      this.ui.title.text(this._getTitle());
    },
    _getPictogramTitle: function _getPictogramTitle() {
      return I18n$1.t(this.model.pageType().translationKey()) + ' Seite';
    },
    _getItemTitle: function _getItemTitle() {
      if (this.options.displayInNavigationHint && !this.model.configuration.get('display_in_navigation')) {
        return 'nicht in Navigationsleiste';
      }
      return '';
    },
    _getTitle: function _getTitle() {
      var result = this.model.title() || I18n$1.t('pageflow.editor.views.page_item_view.unnamed');
      if (this.options.displayInNavigationHint && !this.model.configuration.get('display_in_navigation')) {
        return "(".concat(result, ")");
      }
      return result;
    }
  });

  var NavigatablePageItemView = PageItemView.extend({
    mixins: [loadable, failureIndicatingView],
    className: 'draggable',
    events: {
      'click': function click() {
        if (!this.model.isNew() && !this.model.isDestroying()) {
          editor.navigate('/pages/' + this.model.get('id'), {
            trigger: true
          });
        }
        return false;
      }
    }
  });

  function template$O(data) {
  var __t, __p = '';
  __p += '<a class="edit_chapter" href="">\n  <span class="drag_handle"></span>\n  <span class="number"></span>\n  <span class="title"></span>\n  <span class="failure_icon" title=' +
  ((__t = ( I18n.t('pageflow.editor.templates.chapter_item.save_error') )) == null ? '' : __t) +
  ' />\n</a>\n\n<ul class="pages outline"></ul>\n\n<a href="" class="add_page">' +
  ((__t = ( I18n.t('pageflow.editor.templates.chapter_item.new_page') )) == null ? '' : __t) +
  '</a>\n';
  return __p
  }

  var ChapterItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: template$O,
    ui: {
      title: '> a > .title',
      number: '> a > .number',
      pages: 'ul.pages'
    },
    modelEvents: {
      change: 'update'
    },
    onRender: function onRender() {
      var collectionView = this.options.sortable ? SortableCollectionView : CollectionView;
      this.subview(new collectionView({
        el: this.ui.pages,
        collection: this.model.pages,
        itemViewConstructor: this.options.pageItemView || NavigatablePageItemView,
        itemViewOptions: this.options.pageItemViewOptions,
        connectWith: 'ul.pages'
      }));
      this.update();
    },
    update: function update() {
      this.ui.title.text(this.model.get('title') || I18n$1.t('pageflow.editor.views.chapter_item_view.unnamed'));
      this.ui.number.text(I18n$1.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
    }
  });

  var NavigatableChapterItemView = ChapterItemView.extend({
    mixins: [loadable, failureIndicatingView],
    className: 'draggable',
    events: {
      'click a.add_page': function clickAAdd_page() {
        this.model.addPage();
      },
      'click a.edit_chapter': function clickAEdit_chapter() {
        if (!this.model.isNew() && !this.model.isDestroying()) {
          editor.navigate('/chapters/' + this.model.get('id'), {
            trigger: true
          });
        }
        return false;
      }
    }
  });

  function template$P(data) {
  var __t, __p = '';
  __p += '<h2 class="sidebar-header">\n  ' +
  ((__t = ( I18n.t('pageflow.editor.templates.storyline_outline.header') )) == null ? '' : __t) +
  '\n</h2>\n<ul class="storyline_outline_chapters chapters outline"></ul>\n\n<a class="add_chapter" href="">' +
  ((__t = ( I18n.t('pageflow.editor.templates.storyline_outline.new_chapter') )) == null ? '' : __t) +
  '</a>\n';
  return __p
  }

  var StorylineOutlineView = Marionette.Layout.extend({
    template: template$P,
    className: 'storyline_outline',
    ui: {
      chapters: 'ul.storyline_outline_chapters'
    },
    events: {
      'click a.add_chapter': function clickAAdd_chapter() {
        this.model.scaffoldChapter();
      }
    },
    onRender: function onRender() {
      this.ui.chapters.toggleClass('navigatable', !!this.options.navigatable);
      var collectionView = this.options.sortable ? SortableCollectionView : CollectionView;
      new collectionView({
        el: this.ui.chapters,
        collection: this.model.chapters,
        itemViewConstructor: this.options.navigatable ? NavigatableChapterItemView : ChapterItemView,
        itemViewOptions: {
          sortable: this.options.sortable,
          pageItemView: this.options.navigatable ? NavigatablePageItemView : PageItemView,
          pageItemViewOptions: _.extend({
            displayInNavigationHint: this.options.displayInNavigationHint
          }, this.options.pageItemViewOptions || {})
        }
      }).render();
    }
  });

  function template$Q(data) {
  var __t, __p = '';
  __p += '<div class="storyline_picker_storylines">\n  <div class="storyline_picker_select_region"></div>\n  <a href="" class="add_storyline" title="' +
  ((__t = ( I18n.t('pageflow.editor.templates.storyline_picker.add') )) == null ? '' : __t) +
  '"></a>\n  <a href="" class="edit_storyline" title="' +
  ((__t = ( I18n.t('pageflow.editor.templates.storyline_picker.edit') )) == null ? '' : __t) +
  '"></a>\n</div>\n\n<div class="storyline_picker_main_region"></div>\n';
  return __p
  }

  var StorylinePickerView = Marionette.Layout.extend({
    template: template$Q,
    className: 'storyline_picker',
    regions: {
      selectRegion: '.storyline_picker_select_region',
      mainRegion: '.storyline_picker_main_region'
    },
    ui: {
      storylines: '.storyline_picker_storylines'
    },
    events: {
      'click .add_storyline': function clickAdd_storyline() {
        var storyline = this.options.entry.scaffoldStoryline({
          depth: 'page'
        }).storyline;
        this.listenToOnce(storyline, 'sync', function () {
          this.updateSelect();
          this.model.set('storyline_id', storyline.id);
        });
        return false;
      },
      'click .edit_storyline': function clickEdit_storyline() {
        editor.navigate('storylines/' + this.model.get('storyline_id'), {
          trigger: true
        });
        return false;
      }
    },
    initialize: function initialize() {
      this.model = new Backbone.Model({
        storyline_id: this.defaultStorylineId()
      });
      this.listenTo(this.options.entry.storylines, 'add sort remove', this.updateSelect);
      this.listenTo(this.model, 'change', this.load);
    },
    onRender: function onRender() {
      this.$el.toggleClass('editable', !!this.options.editable);
      this.ui.storylines.toggle(!!frontend.features.isEnabled('storylines'));
      this.updateSelect();
      this.load();
    },
    updateSelect: function updateSelect() {
      var storylines = this.options.entry.storylines;
      this.selectRegion.show(new SelectInputView({
        model: this.model,
        label: I18n$1.t('pageflow.editor.views.storylines_picker_view.label'),
        propertyName: 'storyline_id',
        values: storylines.pluck('id'),
        texts: storylines.map(function (storyline) {
          return this.indentation(storyline) + storyline.displayTitle();
        }, this),
        groups: storylines.reduce(function (result, storyline) {
          if (storyline.isMain() || storyline.parentPage()) {
            result.push(_.last(result));
          } else {
            result.push(I18n$1.t('pageflow.editor.views.storylines_picker_view.without_parent_page'));
          }
          return result;
        }, [])
      }));
    },
    load: function load() {
      var storyline = this.options.entry.storylines.get(this.model.get('storyline_id'));
      this.saveRememberedStorylineId(storyline.id);
      this.mainRegion.show(new StorylineOutlineView({
        model: storyline,
        navigatable: this.options.navigatable,
        sortable: this.options.editable,
        chapterItemView: this.options.chapterItemView,
        pageItemView: this.options.pageItemView,
        pageItemViewOptions: this.options.pageItemViewOptions,
        displayInNavigationHint: this.options.displayInNavigationHint
      }));
    },
    defaultStorylineId: function defaultStorylineId() {
      var storyline = this.options.entry.storylines.get(this.options.storylineId) || this.options.entry.storylines.get(this.rememberedStorylineId()) || this.options.entry.storylines.first();
      return storyline.id;
    },
    rememberedStorylineId: function rememberedStorylineId() {
      if (this.options.rememberLastSelection) {
        return StorylinePickerView._rememberedStorylineId;
      }
    },
    saveRememberedStorylineId: function saveRememberedStorylineId(id) {
      if (this.options.rememberLastSelection) {
        StorylinePickerView._rememberedStorylineId = id;
      }
    },
    indentation: function indentation(storyline) {
      return _(storyline.get('level') || 0).times(function () {
        return "\xA0\xA0\xA0";
      }).join('');
    }
  });

  var EntryOutlineView = function EntryOutlineView(options) {
    return new StorylinePickerView(_.extend({
      navigatable: true,
      editable: true,
      displayInNavigationHint: true,
      rememberLastSelection: true
    }, options));
  };

  function template$R(data) {
  var __t, __p = '';
  __p += '<h2>' +
  ((__t = ( I18n.t('pageflow.editor.blank_entry.header') )) == null ? '' : __t) +
  '</h2>\n<p>' +
  ((__t = ( I18n.t('pageflow.editor.blank_entry.intro') )) == null ? '' : __t) +
  '</p>\n<ol>\n  <li>' +
  ((__t = ( I18n.t('pageflow.editor.blank_entry.create_chapter') )) == null ? '' : __t) +
  '</li>\n  <li>' +
  ((__t = ( I18n.t('pageflow.editor.blank_entry.create_page') )) == null ? '' : __t) +
  '</li>\n  <li>' +
  ((__t = ( I18n.t('pageflow.editor.blank_entry.edit_page') )) == null ? '' : __t) +
  '</li>\n</ol>\n<p>' +
  ((__t = ( I18n.t('pageflow.editor.blank_entry.outro') )) == null ? '' : __t) +
  '</p>\n';
  return __p
  }

  var BlankEntryView = Marionette.ItemView.extend({
    template: template$R,
    className: 'blank_entry'
  });

  var PagePreviewView = Marionette.View.extend({
    tagName: 'section',
    className: 'page',
    modelEvents: {
      'change:template': 'updateTemplate',
      'change:configuration': 'update',
      'change:position': 'updatePositionClassNames',
      'change:id': function changeId() {
        this.$el.attr('data-id', this.model.id);
        this.$el.attr('data-perma-id', this.model.get('perma_id'));
        this.$el.attr('id', this.model.get('perma_id'));
      }
    },
    events: {
      pageactivate: function pageactivate() {
        this.model.set('active', true);
      },
      pagedeactivate: function pagedeactivate() {
        this.model.set('active', false);
      }
    },
    render: function render() {
      this.$el.html(this.pageTemplate());
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-perma-id', this.model.get('perma_id'));
      this.$el.attr('id', this.model.get('perma_id'));
      this.$el.attr('data-chapter-id', this.model.get('chapter_id'));
      this.$el.data('template', this.model.get('template'));
      this.$el.data('configuration', this.model.get('configuration'));
      this.$el.on('pageenhanced', _.bind(function () {
        this.update();
        this.initEmbeddedViews();
        this.$el.page('reactivate');
      }, this));
      return this;
    },
    onClose: function onClose() {
      this.$el.page('cleanup');
    },
    updateTemplate: function updateTemplate() {
      this.$el.page('cleanup');
      this.$el.html(this.pageTemplate());
      this.$el.data('template', this.model.get('template'));
      setTimeout(_.bind(function () {
        this.$el.page('reinit');
      }, this), 0);
    },
    update: function update() {
      this.$el.page('update', this.model.configuration);
      frontend.events.trigger('page:update', this.model);
      this.refreshScroller();
      this.updatePositionClassNames();
    },
    updatePositionClassNames: function updatePositionClassNames() {
      this.$el.toggleClass('chapter_beginning', this.model.isChapterBeginning());
      this.$el.toggleClass('first_page', this.model.isFirstPage());
    },
    pageTypeHooks: function pageTypeHooks() {
      return frontend$1.pageType.get(this.model.get('template'));
    },
    pageTemplate: function pageTemplate() {
      return this._unescape($('script[data-template="' + this.model.get('template') + '_page"]').html());
    },
    refreshScroller: function refreshScroller() {
      this.$el.page('refreshScroller');
    },
    initEmbeddedViews: function initEmbeddedViews() {
      var view = this;
      if (view.embeddedViews) {
        view.embeddedViews.call('close');
      }
      view.embeddedViews = new ChildViewContainer();
      _.each(view.embeddedViewDefinitions(), function (item, selector) {
        view.$(selector).each(function () {
          view.embeddedViews.add(new item.view(_.extend(item.options || {}, {
            el: this,
            model: view.model.configuration,
            container: view
          })).render());
        });
      });
    },
    embeddedViewDefinitions: function embeddedViewDefinitions() {
      return _.extend({}, this.pageTypeHooks().embeddedEditorViews() || {}, this.model.pageType().embeddedViews());
    },
    _unescape: function _unescape(text) {
      return $('<div/>').html(text).text();
    }
  });

  function template$S(data) {
  var __t, __p = '';
  __p += '<div class="container">\n  <div class="header"></div>\n  <div class="overview"></div>\n\n  <div class="entry"></div>\n</div>\n<div class="navigation_disabled_hint">\n  ' +
  ((__t = ( I18n.t('pageflow.editor.templates.entry_preview.navigation_disabled_hint') )) == null ? '' : __t) +
  '\n</div>\n';
  return __p
  }

  var EntryPreviewView = Marionette.ItemView.extend({
    template: template$S,
    className: 'entry_preview',
    ui: {
      container: '> .container',
      header: '> .container > .header',
      entry: '> .container > .entry',
      overview: '> .container > .overview',
      navigationDisabledHint: '.navigation_disabled_hint'
    },
    initialize: function initialize() {
      this.pages = this.model.pages.persisted();
      this.widgets = $();
      this.debouncedFetchWidgets = _.debounce(this.fetchWidgets, 200);
    },
    onRender: function onRender() {
      this.pageViews = this.subview(new CollectionView({
        el: this.ui.entry,
        collection: this.pages,
        itemViewConstructor: PagePreviewView,
        blankSlateViewConstructor: BlankEntryView
      }));
      this.ui.entry.append($('#indicators_seed > *'));
      this.update();
      this.listenTo(this.model, 'sync:order sync:widgets', this.update);
      this.listenTo(this.model, 'change:metadata', function () {
        this.model.once('sync', this.update, this);
      });
      this.listenTo(this.model, 'change:emulation_mode', this.updateEmulationMode);
      this.listenTo(this.model.storylines, 'sync', this.update);
      this.listenTo(this.model.chapters, 'sync', this.update);
      this.listenTo(this.model.pages, 'sync', this.update);
      this.listenTo(this.model.audioFiles, 'sync', this.update);
      this.listenTo(this.model.imageFiles, 'sync', this.update);
      this.listenTo(this.model.videoFiles, 'sync', this.update);
      this.listenTo(frontend.events, 'page:changing', function (event) {
        if (this.model.get('emulation_mode')) {
          this.ui.navigationDisabledHint.css('opacity', 1);
          clearTimeout(this.navigationDisabledHintTimeout);
          this.navigationDisabledHintTimeout = setTimeout(_.bind(function () {
            this.ui.navigationDisabledHint.css('opacity', 0);
          }, this), 2000);
          event.cancel();
        }
      });
      this.listenTo(frontend.events, 'page:change', function (page) {
        this.updateEmulationModeSupport(page.getPermaId());
      });
    },
    onShow: function onShow() {
      var slideshow = this.slideshow = frontend$1.Slideshow.setup({
        element: this.ui.entry,
        enabledFeatureNames: this.model.get('enabled_feature_names'),
        simulateHistory: true
      });
      frontend$1.delayedStart.perform();
      this.listenTo(this.pages, 'add', function () {
        slideshow.update();
      });
      this.listenTo(this.pages, 'remove', function () {
        slideshow.update();
      });
      this.listenTo(this.pages, 'edit', function (model) {
        if (this.lastEditedPage != model) {
          this.model.unset('emulation_mode');
        }
        this.lastEditedPage = model;
        slideshow.goTo(this.pageViews.itemViews.findByModel(model).$el);
      });
      this.listenTo(app, 'resize', function () {
        slideshow.triggerResizeHooks();
        this.updateSimulatedMediaQueryClasses();
      });
      this.listenTo(this.model.pages, 'change:template', function () {
        this.updateEmulationModeSupport(slideshow.currentPagePermaId());
      });
      this.updateSimulatedMediaQueryClasses();
    },
    updateEmulationModeSupport: function updateEmulationModeSupport(permaId) {
      var model = this.model.pages.getByPermaId(permaId);
      this.model.set('emulation_mode_disabled', !model || !model.pageType().supportsPhoneEmulation());
    },
    updateSimulatedMediaQueryClasses: function updateSimulatedMediaQueryClasses() {
      var width = this.ui.container.width();
      var height = this.ui.container.height();
      var portrait = width < height;
      $('html').toggleClass('simulate_mobile', width <= 900).toggleClass('simulate_phone', portrait && width <= 500 || !portrait && height <= 500).toggleClass('simulate_desktop', portrait && width > 500 || !portrait && height > 500).toggleClass('simulate_narrow_desktop', width <= 1200).toggleClass('simulate_wide_desktop', width > 1600).toggleClass('simulate_pad_portrait', width <= 768 && portrait).toggleClass('simulate_phone_portrait', width <= 500 && portrait);
    },
    update: function update() {
      this.debouncedFetchWidgets();
      this.$el.toggleClass('emphasize_chapter_beginning', !!this.model.metadata.get('emphasize_chapter_beginning'));
    },
    fetchWidgets: function fetchWidgets() {
      var view = this;
      $.ajax(this.model.url() + '/paged/partials').success(function (response) {
        var partials = $('<div />').html(response);
        view.ui.header.replaceWith(partials.find('> .header'));
        view.ui.overview.replaceWith(partials.find('> .overview'));
        view.bindUIElements();
        view.updateWidgets(partials);
        view.ui.header.header({
          slideshow: view.slideshow
        });
        view.ui.overview.overview();
      });
    },
    updateWidgets: function updateWidgets(partials) {
      var widgets = partials.find('[data-widget]');
      this.updatePresentWidgetsCssClasses(widgets);
      this.widgets.remove();
      this.widgets = widgets;
      this.ui.entry.before(this.widgets);
      frontend$1.widgetTypes.enhance(this.$el);
    },
    updatePresentWidgetsCssClasses: function updatePresentWidgetsCssClasses(newWidgets) {
      var previousClasses = this.widgetNames(this.widgets);
      var newClasses = this.widgetNames(newWidgets);
      var removedClasses = _.difference(previousClasses, newClasses);
      var addedClasses = _.difference(newClasses, previousClasses);
      this.$el.addClass('widgets_present');
      this.$el.removeClass(removedClasses.join(' '));
      this.$el.addClass(addedClasses.join(' '));
      if (removedClasses.length || addedClasses.length) {
        frontend.events.trigger('widgets:update');
      }
    },
    widgetNames: function widgetNames(widgets) {
      return widgets.map(function () {
        return 'widget_' + $(this).data('widget') + '_present';
      }).get();
    },
    updateEmulationMode: function updateEmulationMode() {
      if (this.model.previous('emulation_mode')) {
        this.$el.removeClass(this.emulationModeClassName(this.model.previous('emulation_mode')));
      }
      if (this.model.get('emulation_mode')) {
        this.$el.addClass(this.emulationModeClassName(this.model.get('emulation_mode')));
      }
      app.trigger('resize');
    },
    emulationModeClassName: function emulationModeClassName(mode) {
      return 'emulation_mode_' + mode;
    }
  });

  var appearanceInputs = function appearanceInputs(tabView, options) {
    var entry = options.entry;
    var theme = entry.getTheme();
    var site = options.site;
    tabView.input('manual_start', CheckBoxInputView);
    tabView.input('emphasize_chapter_beginning', CheckBoxInputView);
    tabView.input('emphasize_new_pages', CheckBoxInputView);
    tabView.input('home_button_enabled', CheckBoxInputView, {
      disabled: !theme.hasHomeButton(),
      displayUncheckedIfDisabled: true
    });
    tabView.input('overview_button_enabled', CheckBoxInputView, {
      disabled: !theme.hasOverviewButton(),
      displayUncheckedIfDisabled: true
    });
    if (theme.hasHomeButton()) {
      tabView.input('home_url', TextInputView, {
        placeholder: site.get('pretty_url'),
        visibleBinding: 'home_button_enabled'
      });
    }
  };

  function template$T(data) {
  var __t, __p = '';
  __p += '<div class="box">\n  <h1 class="dialog-header">\n    ' +
  ((__t = ( I18n.t('pageflow.editor.templates.page_selection.title') )) == null ? '' : __t) +
  '\n  </h1>\n\n  <div class="content">\n    <div class="storyline_picker">\n    </div>\n  </div>\n\n  <div class="footer">\n    <a href="" class="close">' +
  ((__t = ( I18n.t('pageflow.editor.templates.page_selection.cancel') )) == null ? '' : __t) +
  '</a>\n  </div>\n</div>\n';
  return __p
  }

  var PageSelectionView = Marionette.ItemView.extend({
    template: template$T,
    className: 'page_selection dialog editor',
    mixins: [dialogView],
    ui: {
      storylines: '.storyline_picker',
      chapters: '.chapters'
    },
    events: {
      'click ul.pages li': function clickUlPagesLi(event) {
        this.options.onSelect(this.model.pages.get($(event.currentTarget).data('id')));
        this.close();
      }
    },
    onRender: function onRender() {
      var options = this.options;
      this.subview(new StorylinePickerView({
        el: this.ui.storylines,
        entry: this.model,
        pageItemViewOptions: {
          isDisabled: function isDisabled(page) {
            return options.isAllowed && !options.isAllowed(page);
          }
        }
      }));
    }
  });
  PageSelectionView.selectPage = function (options) {
    return $.Deferred(function (deferred) {
      var view = new PageSelectionView({
        model: options.entry,
        onSelect: deferred.resolve,
        isAllowed: options && options.isAllowed
      });
      view.on('close', function () {
        deferred.reject();
      });
      app.dialogRegion.show(view.render());
    }).promise();
  };
  editor.pageSelectionView = PageSelectionView;

  var SideBarRouter = Marionette.AppRouter.extend({
    appRoutes: {
      'page_links/:id': 'pageLink',
      'pages/:id': 'page',
      'pages/:id/:tab': 'page',
      'chapters/:id': 'chapter',
      'storylines/:id': 'storyline'
    }
  });

  function template$U(data) {
  var __t, __p = '';
  __p += '<a class="back">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_chapter.outline') )) == null ? '' : __t) +
  '</a>\n<a class="destroy">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_chapter.destroy') )) == null ? '' : __t) +
  '</a>\n\n<div class="failure">\n  <p>' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_chapter.save_error') )) == null ? '' : __t) +
  '</p>\n  <p class="message"></p>\n  <a class="retry" href="">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_chapter.retry') )) == null ? '' : __t) +
  '</a>\n</div>\n\n<div class="form_container"></div>';
  return __p
  }

  var EditChapterView = Marionette.Layout.extend({
    template: template$U,
    className: 'edit_chapter',
    mixins: [failureIndicatingView],
    regions: {
      formContainer: '.form_container'
    },
    events: {
      'click a.back': 'goBack',
      'click a.destroy': 'destroy'
    },
    onRender: function onRender() {
      var configurationEditor = new ConfigurationEditorView({
        model: this.model.configuration
      });
      this.configure(configurationEditor);
      this.formContainer.show(configurationEditor);
    },
    configure: function configure(configurationEditor) {
      var view = this;
      configurationEditor.tab('general', function () {
        this.input('title', TextInputView, {
          model: view.model
        });
        if (frontend.features.isEnabled('chapter_hierachy')) {
          this.input('display_parent_page_button', CheckBoxInputView);
        }
      });
    },
    destroy: function destroy() {
      if (confirm(I18n$1.t('pageflow.editor.views.edit_chapter_view.confirm_destroy'))) {
        this.model.destroy();
        this.goBack();
      }
    },
    goBack: function goBack() {
      editor.navigate('/', {
        trigger: true
      });
    }
  });

  function template$V(data) {
  var __t, __p = '';
  __p += '<a class="back">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_page_link.back') )) == null ? '' : __t) +
  '</a>\n<a class="destroy">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_page_link.destroy') )) == null ? '' : __t) +
  '</a>\n<div class="form_container"></div>\n';
  return __p
  }

  var EditPageLinkView = Marionette.Layout.extend({
    template: template$V,
    regions: {
      formContainer: '.form_container'
    },
    ui: {
      backButton: 'a.back'
    },
    events: {
      'click a.back': 'goBack',
      'click a.destroy': 'destroy'
    },
    onRender: function onRender() {
      var pageType = this.options.api.pageTypes.findByPage(this.options.page);
      var configurationEditor = pageType.createPageLinkConfigurationEditorView({
        model: this.model,
        page: this.options.page
      });
      this.formContainer.show(configurationEditor);
      this.highlight();
    },
    highlight: function highlight() {
      this.model.highlight();
      this.listenTo(this, 'close', function () {
        this.model.resetHighlight();
      });
    },
    destroy: function destroy() {
      if (confirm(I18n$1.t('pageflow.internal_links.editor.views.edit_page_link_view.confirm_destroy'))) {
        this.model.remove();
        this.goBack();
      }
    },
    goBack: function goBack() {
      editor.navigate('/pages/' + this.options.page.id + '/links', {
        trigger: true
      });
    }
  });

  function template$W(data) {
  var __t, __p = '';
  __p += '<a class="back">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_page.outline') )) == null ? '' : __t) +
  '</a>\n<a class="destroy">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_page.destroy') )) == null ? '' : __t) +
  '</a>\n\n<div class="failure">\n  <p>' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_page.save_error') )) == null ? '' : __t) +
  '</p>\n  <p class="message"></p>\n  <a class="retry" href="">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_page.retry') )) == null ? '' : __t) +
  '</a>\n</div>\n\n<div class="page_type"></div>\n\n<div class="configuration_container"></div>';
  return __p
  }

  var EditPageView = Marionette.Layout.extend({
    template: template$W,
    className: 'edit_page',
    mixins: [failureIndicatingView],
    regions: {
      pageTypeContainer: '.page_type',
      configurationContainer: '.configuration_container'
    },
    events: {
      'click a.back': 'goBack',
      'click a.destroy': 'destroy'
    },
    modelEvents: {
      'change:template': 'load'
    },
    onRender: function onRender() {
      var _this = this;
      this.pageTypeContainer.show(new ExtendedSelectInputView({
        model: this.model,
        propertyName: 'template',
        collection: this.options.api.pageTypes.pluck('seed'),
        valueProperty: 'name',
        translationKeyProperty: 'translation_key',
        groupTranslationKeyProperty: 'category_translation_key',
        descriptionTranslationKeyProperty: 'description_translation_key',
        pictogramClass: 'type_pictogram',
        helpLinkClicked: function helpLinkClicked(value) {
          var pageType = _this.options.api.pageTypes.findByName(value);
          app.trigger('toggle-help', pageType.seed.help_entry_translation_key);
        }
      }));
      this.load();
      this.model.trigger('edit', this.model);
    },
    onShow: function onShow() {
      this.configurationEditor.refreshScroller();
    },
    load: function load() {
      this.configurationEditor = this.options.api.createPageConfigurationEditorView(this.model, {
        tab: this.options.tab
      });
      this.configurationContainer.show(this.configurationEditor);
    },
    destroy: function destroy() {
      if (confirm(I18n$1.t('pageflow.editor.views.edit_page_view.confirm_destroy'))) {
        this.model.destroy();
        this.goBack();
      }
    },
    goBack: function goBack() {
      editor.navigate('/', {
        trigger: true
      });
    }
  });

  var state$1 = window.pageflow || {};

  var PageLinkInputView = ReferenceInputView.extend({
    choose: function choose() {
      return editor.selectPage({
        isAllowed: this.options.isAllowed
      });
    },
    getTarget: function getTarget(permaId) {
      return state$1.pages.getByPermaId(permaId);
    }
  });

  function template$X(data) {
  var __t, __p = '';
  __p += '<a class="back">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_storyline.outline') )) == null ? '' : __t) +
  '</a>\n<a class="destroy" data-tooltip-align="bottom right">\n  ' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_storyline.destroy') )) == null ? '' : __t) +
  '\n</a>\n\n<div class="failure">\n  <p>' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_storyline.save_error') )) == null ? '' : __t) +
  '</p>\n  <p class="message"></p>\n  <a class="retry" href="">' +
  ((__t = ( I18n.t('pageflow.editor.templates.edit_storyline.retry') )) == null ? '' : __t) +
  '</a>\n</div>\n\n<div class="form_container"></div>\n';
  return __p
  }

  var EditStorylineView = Marionette.Layout.extend({
    template: template$X,
    className: 'edit_storyline',
    mixins: [failureIndicatingView, tooltipContainer],
    regions: {
      formContainer: '.form_container'
    },
    ui: {
      destroyButton: 'a.destroy'
    },
    events: {
      'click a.back': 'goBack',
      'click a.destroy': 'destroy'
    },
    onRender: function onRender() {
      var configurationEditor = new ConfigurationEditorView({
        model: this.model.configuration,
        attributeTranslationKeyPrefixes: ['pageflow.storyline_attributes']
      });
      this.configure(configurationEditor, this.model.transitiveChildPages());
      this.formContainer.show(configurationEditor);
      this.updateDestroyButton();
    },
    updateDestroyButton: function updateDestroyButton() {
      var disabled = this.model.chapters.length > 0;
      this.ui.destroyButton.toggleClass('disabled', disabled);
      if (disabled) {
        this.ui.destroyButton.attr('data-tooltip', 'pageflow.editor.views.edit_storyline_view.cannot_destroy');
      } else {
        this.ui.destroyButton.removeAttr('data-tooltip');
      }
    },
    configure: function configure(configurationEditor, storylineChildPages) {
      configurationEditor.tab('general', function () {
        this.input('title', TextInputView);
        this.input('main', CheckBoxInputView, {
          disabled: true,
          visibleBinding: 'main'
        });
        this.group('page_transitions', {
          includeBlank: true
        });
        this.input('main', CheckBoxInputView, {
          visibleBinding: 'main',
          visible: function visible(isMain) {
            return !isMain;
          }
        });
        this.input('parent_page_perma_id', PageLinkInputView, {
          visibleBinding: 'main',
          visible: function visible(isMain) {
            return !isMain && state$1.storylines.length > 1;
          },
          isAllowed: function isAllowed(page) {
            return !storylineChildPages.contain(page);
          }
        });
        this.input('scroll_successor_id', PageLinkInputView);
        if (frontend.features.isEnabled('chapter_hierachy')) {
          this.input('navigation_bar_mode', SelectInputView, {
            values: frontend$1.ChapterFilter.strategies
          });
        }
      });
    },
    destroy: function destroy() {
      if (this.model.chapters.length) {
        return;
      }
      if (confirm(I18n$1.t('pageflow.editor.views.edit_storyline_view.confirm_destroy'))) {
        this.model.destroy();
        this.goBack();
      }
    },
    goBack: function goBack() {
      editor.navigate('/?storyline=' + this.model.id, {
        trigger: true
      });
    }
  });

  var SideBarController = Marionette.Controller.extend({
    initialize: function initialize(options) {
      this.region = options.region;
      this.entry = options.entry;
    },
    storyline: function storyline(id) {
      this.region.show(new EditStorylineView({
        model: this.entry.storylines.get(id)
      }));
    },
    chapter: function chapter(id) {
      this.region.show(new EditChapterView({
        model: this.entry.chapters.get(id)
      }));
    },
    page: function page(id, tab) {
      var page = this.entry.pages.get(id);
      this.region.show(new EditPageView({
        model: page,
        api: editor,
        tab: tab
      }));
      editor.setDefaultHelpEntry(page.pageType().help_entry_translation_key);
    },
    pageLink: function pageLink(linkId) {
      var pageId = linkId.split(':')[0];
      var page = this.entry.pages.getByPermaId(pageId);
      this.region.show(new EditPageLinkView({
        model: page.pageLinks().get(linkId),
        page: page,
        api: editor
      }));
    }
  });

  ConfigurationEditorView.register('audio', {
    configure: function configure() {
      this.tab('general', function () {
        this.group('general', {
          supportsTextPositionCenter: true
        });
        this.input('additional_title', TextInputView);
        this.input('additional_description', TextAreaInputView, {
          size: 'short'
        });
      });
      this.tab('files', function () {
        this.input('audio_file_id', FileInputView, {
          collection: state$1.audioFiles,
          defaultTextTrackFilePropertyName: 'default_text_track_file_id'
        });
        this.group('background');
        this.input('thumbnail_image_id', FileInputView, {
          collection: state$1.imageFiles,
          positioning: false
        });
      });
      this.tab('options', function () {
        if (frontend.features.isEnabled('waveform_player_controls')) {
          this.input('audio_player_controls_variant', SelectInputView, {
            values: ['default', 'waveform']
          });
        }
        this.input('waveform_color', ColorInputView, {
          visibleBinding: 'audio_player_controls_variant',
          visibleBindingValue: 'waveform',
          defaultValue: frontend$1.theme.mainColor(),
          swatches: usedWaveformColors()
        });
        this.input('autoplay', CheckBoxInputView);
        this.group('options', {
          canPauseAtmo: true
        });
      });
      function usedWaveformColors() {
        return _.chain(state$1.pages.map(function (page) {
          return page.configuration.get('waveform_color');
        })).uniq().compact().value();
      }
    }
  });

  ConfigurationEditorView.register('background_image', {
    configure: function configure() {
      this.tab('general', function () {
        this.group('general', {
          supportsTextPositionCenter: true
        });
      });
      this.tab('files', function () {
        this.group('background');
        this.input('thumbnail_image_id', FileInputView, {
          collection: state$1.imageFiles,
          positioning: false
        });
      });
      this.tab('options', function () {
        this.group('options');
      });
    }
  });

  ConfigurationEditorView.register('video', {
    configure: function configure() {
      this.tab('general', function () {
        this.group('general', {
          supportsTextPositionCenter: true
        });
        this.input('additional_title', TextInputView);
        this.input('additional_description', TextAreaInputView, {
          size: 'short'
        });
      });
      this.tab('files', function () {
        this.input('video_file_id', FileInputView, {
          collection: state$1.videoFiles,
          positioning: false,
          defaultTextTrackFilePropertyName: 'default_text_track_file_id'
        });
        this.input('poster_image_id', FileInputView, {
          collection: state$1.imageFiles,
          positioning: false
        });
        this.input('mobile_poster_image_id', FileInputView, {
          collection: state$1.imageFiles,
          positioning: true
        });
        this.input('thumbnail_image_id', FileInputView, {
          collection: state$1.imageFiles,
          positioning: false
        });
      });
      this.tab('options', function () {
        this.input('autoplay', CheckBoxInputView);
        this.input('smart_contain', CheckBoxInputView, {
          storeInverted: 'contain'
        });
        if (frontend.features.isEnabled('auto_change_page')) {
          this.input('auto_change_page_on_ended', CheckBoxInputView);
        }
        this.group('options', {
          canPauseAtmo: true
        });
      });
    }
  });

  ConfigurationEditorTabView.groups.define('background', function (options) {
    options = options || {};
    var prefix = options.propertyNamePrefix ? options.propertyNamePrefix + '_' : '';
    var backgroundTypeProperty = prefix + 'background_type';
    this.input(backgroundTypeProperty, SelectInputView, {
      values: ['image', 'video'],
      ensureValueDefined: true
    });
    this.input(prefix + 'background_image_id', FileInputView, {
      collection: state$1.imageFiles,
      visibleBinding: backgroundTypeProperty,
      visibleBindingValue: 'image',
      fileSelectionHandlerOptions: options
    });
    this.input(prefix + 'video_file_id', FileInputView, {
      collection: state$1.videoFiles,
      visibleBinding: backgroundTypeProperty,
      visibleBindingValue: 'video',
      fileSelectionHandlerOptions: options
    });
    this.input(prefix + 'poster_image_id', FileInputView, {
      collection: state$1.imageFiles,
      visibleBinding: backgroundTypeProperty,
      visibleBindingValue: 'video',
      fileSelectionHandlerOptions: options
    });
    this.input(prefix + 'mobile_poster_image_id', FileInputView, {
      collection: state$1.imageFiles,
      visibleBinding: backgroundTypeProperty,
      visibleBindingValue: 'video',
      fileSelectionHandlerOptions: options
    });
  });

  ConfigurationEditorTabView.groups.define('general', function (options) {
    this.input('title', TextInputView, {
      required: true,
      maxLength: 5000
    });
    this.input('hide_title', CheckBoxInputView);
    this.input('tagline', TextInputView, {
      maxLength: 5000
    });
    this.input('subtitle', TextInputView, {
      maxLength: 5000
    });
    this.input('text', TextAreaInputView, {
      fragmentLinkInputView: PageLinkInputView,
      enableLists: true
    });
    this.input('text_position', SelectInputView, {
      values: options.supportsTextPositionCenter ? Page.textPositions : Page.textPositionsWithoutCenterOption
    });
    this.input('gradient_opacity', SliderInputView);
    this.input('invert', CheckBoxInputView);
  });

  ConfigurationEditorTabView.groups.define('page_link', function () {
    this.input('label', TextInputView);
    this.input('target_page_id', PageLinkInputView);
    this.group('page_transitions', {
      includeBlank: true
    });
  });

  ConfigurationEditorTabView.groups.define('page_transitions', function (options) {
    var inputOptions = {
      translationKeyPrefix: 'pageflow.page_transitions',
      blankTranslationKey: 'pageflow.page_transitions.default',
      values: frontend$1.pageTransitions.names()
    };
    if (frontend$1.navigationDirection.isHorizontalOnPhone()) {
      inputOptions.additionalInlineHelpText = I18n$1.t('pageflow.editor.phone_horizontal_slideshow_mode.page_transitions_inline_help');
    }
    this.input(options.propertyName || 'page_transition', SelectInputView, _.extend(inputOptions, options));
  });

  ConfigurationEditorTabView.groups.define('options', function (options) {
    var theme = state$1.entry.getTheme();
    this.input('display_in_navigation', CheckBoxInputView);
    if (theme.supportsEmphasizedPages()) {
      this.input('emphasize_in_navigation', CheckBoxInputView);
    }
    this.group('page_transitions', {
      propertyName: 'transition'
    });
    if (frontend.features.isEnabled('delayed_text_fade_in')) {
      this.input('delayed_text_fade_in', SelectInputView, {
        values: Page.delayedTextFadeIn
      });
    }
    this.input('description', TextAreaInputView, {
      size: 'short',
      disableLinks: true
    });
    this.input('atmo_audio_file_id', FileInputView, {
      collection: state$1.audioFiles
    });
    if (theme.supportsHideLogoOnPages()) {
      this.input('hide_logo', CheckBoxInputView);
    }
    if (options.canPauseAtmo) {
      this.input('atmo_during_playback', SelectInputView, {
        values: frontend$1.Atmo.duringPlaybackModes
      });
    }
    if (theme.supportsScrollIndicatorModes()) {
      this.input('scroll_indicator_mode', SelectInputView, {
        values: Page.scrollIndicatorModes
      });
      this.input('scroll_indicator_orientation', SelectInputView, {
        values: Page.scrollIndicatorOrientations
      });
    }
  });

  editor.addInitializer(function () {
    var scrollNavigationKeys = _.values({
      pageUp: 33,
      pageDown: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40
    });
    $('sidebar').on('keydown', function (event) {
      if (scrollNavigationKeys.indexOf(event.which) >= 0) {
        event.stopPropagation();
      }
    });
  });

  editor.addInitializer(function (options) {
    var KEY_A = 65;
    var KEY_X = 88;
    $(document).on('keydown', function (event) {
      if (event.altKey && event.which === KEY_A) {
        if (state$1.atmo.disabled) {
          state$1.atmo.enable();
        } else {
          state$1.atmo.disable();
        }
      } else if (event.altKey && event.which === KEY_X) {
        editor.navigate('pages/' + state$1.slides.currentPage().data('id'), {
          trigger: true
        });
      }
    });
  });

  var DisabledAtmoIndicatorView = Marionette.View.extend({
    className: 'disabled_atmo_indicator',
    events: {
      'click': function click() {
        state$1.atmo.enable();
      }
    },
    initialize: function initialize() {
      this.listenTo(frontend.events, 'atmo:disabled', function () {
        this.$el.show();
      });
      this.listenTo(frontend.events, 'atmo:enabled', function () {
        this.$el.hide();
      });
      this.$el.toggle(state$1.atmo.disabled);
    },
    render: function render() {
      this.$el.attr('title', I18n$1.t('pageflow.editor.atmo.disabled'));
      return this;
    }
  });

  // Use app instead of editor here to append initializer after
  // pageflow/editora's boot initializer. DisabledAtmoIndicatorView
  // depends on state.atmo`which is only available after the entry
  // preview has been created.
  app.addInitializer(function (options) {
    app.indicatorsRegion.show(new DisabledAtmoIndicatorView());
  });

  editor.addInitializer(function (options) {
    state$1.entry.on('change:pending_files_count', function (model, value) {
      if (value < state$1.entry.previous('pending_files_count')) {
        stylesheet.reload('entry');
      }
    });
    state$1.entry.on('use:files', function () {
      stylesheet.reload('entry');
    });
    state$1.entry.metadata.on('change:theme_name', function () {
      var theme = state$1.entry.getTheme();
      stylesheet.update('theme', theme.get('stylesheet_path'));
    });
  });

  editor.registerEntryType('paged', {
    entryModel: PagedEntry,
    previewView: EntryPreviewView,
    outlineView: EntryOutlineView,
    appearanceInputs: appearanceInputs
  });
  editor.registerSideBarRouting({
    router: SideBarRouter,
    controller: SideBarController
  });

  exports.AudioFile = AudioFile;
  exports.BackButtonDecoratorView = BackButtonDecoratorView;
  exports.BackgroundImageEmbeddedView = BackgroundImageEmbeddedView;
  exports.BackgroundPositioningPreviewView = BackgroundPositioningPreviewView;
  exports.BackgroundPositioningSlidersView = BackgroundPositioningSlidersView;
  exports.BackgroundPositioningView = BackgroundPositioningView;
  exports.ChangeThemeDialogView = ChangeThemeDialogView;
  exports.Chapter = Chapter;
  exports.ChapterConfiguration = ChapterConfiguration;
  exports.ChapterPagesCollection = ChapterPagesCollection;
  exports.ChapterScaffold = ChapterScaffold;
  exports.ChaptersCollection = ChaptersCollection;
  exports.CheckBoxGroupInputView = CheckBoxGroupInputView;
  exports.CheckBoxInputView = CheckBoxInputView;
  exports.ChooseImporterView = ChooseImporterView;
  exports.CollectionView = CollectionView;
  exports.ColorInputView = ColorInputView;
  exports.Configuration = Configuration;
  exports.ConfigurationEditorTabView = ConfigurationEditorTabView;
  exports.ConfigurationEditorView = ConfigurationEditorView;
  exports.ConfirmEncodingView = ConfirmEncodingView;
  exports.ConfirmFileImportUploadView = ConfirmFileImportUploadView;
  exports.ConfirmUploadView = ConfirmUploadView;
  exports.ConfirmableFileItemView = ConfirmableFileItemView;
  exports.DeleteRowTableCellView = DeleteRowTableCellView;
  exports.DropDownButtonItemListView = DropDownButtonItemListView;
  exports.DropDownButtonItemView = DropDownButtonItemView;
  exports.DropDownButtonView = DropDownButtonView;
  exports.EditConfigurationView = EditConfigurationView;
  exports.EditEntryView = EditEntryView;
  exports.EditFileView = EditFileView;
  exports.EditLock = EditLock;
  exports.EditLockContainer = EditLockContainer;
  exports.EditMetaDataView = EditMetaDataView;
  exports.EditWidgetView = EditWidgetView;
  exports.EditWidgetsView = EditWidgetsView;
  exports.EditorApi = EditorApi;
  exports.EditorView = EditorView;
  exports.EmulationModeButtonView = EmulationModeButtonView;
  exports.EncodedFile = EncodedFile;
  exports.EncodingConfirmation = EncodingConfirmation;
  exports.Entry = Entry;
  exports.EntryMetadata = EntryMetadata;
  exports.EntryMetadataFileSelectionHandler = EntryMetadataFileSelectionHandler;
  exports.EntryPublication = EntryPublication;
  exports.EntryPublicationQuotaDecoratorView = EntryPublicationQuotaDecoratorView;
  exports.EnumTableCellView = EnumTableCellView;
  exports.ExplorerFileItemView = ExplorerFileItemView;
  exports.ExtendedSelectInputView = ExtendedSelectInputView;
  exports.Failure = Failure;
  exports.FileConfiguration = FileConfiguration;
  exports.FileImport = FileImport;
  exports.FileInputView = FileInputView;
  exports.FileItemView = FileItemView;
  exports.FileMetaDataItemValueView = FileMetaDataItemValueView;
  exports.FileMetaDataItemView = FileMetaDataItemView;
  exports.FileNameInputView = FileNameInputView;
  exports.FileProcessingStateDisplayView = FileProcessingStateDisplayView;
  exports.FileReuse = FileReuse;
  exports.FileSettingsDialogView = FileSettingsDialogView;
  exports.FileStage = FileStage;
  exports.FileStageItemView = FileStageItemView;
  exports.FileThumbnailView = FileThumbnailView;
  exports.FileTypes = FileTypes;
  exports.FileTypesCollection = FileTypesCollection;
  exports.FileUploader = FileUploader;
  exports.FilesCollection = FilesCollection;
  exports.FilesExplorerView = FilesExplorerView;
  exports.FilesImporterView = FilesImporterView;
  exports.FilesView = FilesView;
  exports.FilteredFilesView = FilteredFilesView;
  exports.ForeignKeySubsetCollection = ForeignKeySubsetCollection;
  exports.HelpButtonView = HelpButtonView;
  exports.HelpImageView = HelpImageView;
  exports.HelpView = HelpView;
  exports.IconTableCellView = IconTableCellView;
  exports.ImageFile = ImageFile;
  exports.InfoBoxView = InfoBoxView;
  exports.InvalidNestedTypeError = InvalidNestedTypeError;
  exports.JsonInputView = JsonInputView;
  exports.LabelOnlyView = LabelOnlyView;
  exports.LazyVideoEmbeddedView = LazyVideoEmbeddedView;
  exports.ListHighlight = ListHighlight;
  exports.ListItemView = ListItemView;
  exports.ListView = ListView;
  exports.LoadingView = LoadingView;
  exports.LockedView = LockedView;
  exports.ModelThumbnailView = ModelThumbnailView;
  exports.NestedFilesCollection = NestedFilesCollection;
  exports.NestedFilesView = NestedFilesView;
  exports.NestedTypeError = NestedTypeError;
  exports.NotificationsView = NotificationsView;
  exports.NumberInputView = NumberInputView;
  exports.Object = BaseObject;
  exports.OrderedPageLinksCollection = OrderedPageLinksCollection;
  exports.OtherEntriesCollection = OtherEntriesCollection;
  exports.OtherEntriesCollectionView = OtherEntriesCollectionView;
  exports.OtherEntry = OtherEntry;
  exports.OtherEntryItemView = OtherEntryItemView;
  exports.Page = Page;
  exports.PageConfigurationFileSelectionHandler = PageConfigurationFileSelectionHandler;
  exports.PageLink = PageLink;
  exports.PageLinkConfigurationEditorView = PageLinkConfigurationEditorView;
  exports.PageLinkFileSelectionHandler = PageLinkFileSelectionHandler;
  exports.PageLinkInputView = PageLinkInputView;
  exports.PageLinkItemView = PageLinkItemView;
  exports.PageLinksCollection = PageLinksCollection;
  exports.PageLinksView = PageLinksView;
  exports.PageThumbnailView = PageThumbnailView;
  exports.PagesCollection = PagesCollection;
  exports.PresenceTableCellView = PresenceTableCellView;
  exports.PreviewEntryData = PreviewEntryData;
  exports.ProxyUrlInputView = ProxyUrlInputView;
  exports.PublishEntryView = PublishEntryView;
  exports.ReferenceInputView = ReferenceInputView;
  exports.ReusableFile = ReusableFile;
  exports.Scaffold = Scaffold;
  exports.ScrollingView = ScrollingView;
  exports.Search = Search;
  exports.SelectButtonView = SelectButtonView;
  exports.SelectInputView = SelectInputView;
  exports.SeparatorView = SeparatorView;
  exports.SidebarController = SidebarController;
  exports.SidebarFooterView = SidebarFooterView;
  exports.SidebarRouter = SidebarRouter;
  exports.Site = Site;
  exports.SliderInputView = SliderInputView;
  exports.SortableCollectionView = SortableCollectionView;
  exports.StaticThumbnailView = StaticThumbnailView;
  exports.Storyline = Storyline;
  exports.StorylineChaptersCollection = StorylineChaptersCollection;
  exports.StorylineConfiguration = StorylineConfiguration;
  exports.StorylineOrdering = StorylineOrdering;
  exports.StorylineScaffold = StorylineScaffold;
  exports.StorylineTransitiveChildPages = StorylineTransitiveChildPages;
  exports.StorylinesCollection = StorylinesCollection;
  exports.SubsetCollection = SubsetCollection;
  exports.TableCellView = TableCellView;
  exports.TableHeaderCellView = TableHeaderCellView;
  exports.TableRowView = TableRowView;
  exports.TableView = TableView;
  exports.TabsView = TabsView;
  exports.TextAreaInputView = TextAreaInputView;
  exports.TextFileMetaDataItemValueView = TextFileMetaDataItemValueView;
  exports.TextInputView = TextInputView;
  exports.TextTableCellView = TextTableCellView;
  exports.TextTrackFile = TextTrackFile;
  exports.TextTracksFileMetaDataItemValueView = TextTracksFileMetaDataItemValueView;
  exports.TextTracksView = TextTracksView;
  exports.Theme = Theme;
  exports.ThemeInputView = ThemeInputView;
  exports.ThemeItemView = ThemeItemView;
  exports.ThemesCollection = ThemesCollection;
  exports.TooltipView = TooltipView;
  exports.UnmatchedUploadError = UnmatchedUploadError;
  exports.UploadError = UploadError;
  exports.UploadableFile = UploadableFile;
  exports.UploadableFilesView = UploadableFilesView;
  exports.UploaderView = UploaderView;
  exports.UrlDisplayView = UrlDisplayView;
  exports.UrlInputView = UrlInputView;
  exports.VideoFile = VideoFile;
  exports.Widget = Widget;
  exports.WidgetConfiguration = WidgetConfiguration;
  exports.WidgetConfigurationFileSelectionHandler = WidgetConfigurationFileSelectionHandler;
  exports.WidgetItemView = WidgetItemView;
  exports.WidgetTypes = WidgetTypes;
  exports.WidgetsCollection = WidgetsCollection;
  exports.addAndReturnModel = addAndReturnModel;
  exports.app = app;
  exports.attributeBinding = attributeBinding;
  exports.authenticationProvider = authenticationProvider;
  exports.configurationContainer = configurationContainer;
  exports.cssModulesUtils = cssModulesUtils;
  exports.delayedDestroying = delayedDestroying;
  exports.dialogView = dialogView;
  exports.editor = editor;
  exports.entryTypeEditorControllerUrls = entryTypeEditorControllerUrls;
  exports.failureIndicatingView = failureIndicatingView;
  exports.failureTracking = failureTracking;
  exports.fileWithType = fileWithType;
  exports.filesCountWatcher = filesCountWatcher;
  exports.formDataUtils = formDataUtils;
  exports.i18nUtils = i18nUtils;
  exports.inputView = inputView;
  exports.inputWithPlaceholderText = inputWithPlaceholderText;
  exports.loadable = loadable;
  exports.modelLifecycleTrackingView = modelLifecycleTrackingView;
  exports.orderedCollection = orderedCollection;
  exports.persistedPromise = persistedPromise;
  exports.polling = polling;
  exports.retryable = retryable;
  exports.selectableView = selectableView;
  exports.serverSideValidation = serverSideValidation;
  exports.stageProvider = stageProvider;
  exports.startEditor = startEditor;
  exports.state = state;
  exports.stylesheet = stylesheet;
  exports.subviewContainer = subviewContainer;
  exports.tooltipContainer = tooltipContainer;
  exports.transientReferences = transientReferences;
  exports.validFileTypeTranslationList = validFileTypeTranslationList;
  exports.viewWithValidationErrorMessages = viewWithValidationErrorMessages;

  return exports;

}({}, Backbone, _, Backbone.Marionette, jQuery, I18n, Backbone.ChildViewContainer, IScroll, jQuery, wysihtml5, jQuery, Cocktail, pageflow, pageflow));
