import { useIsomorphicLayoutEffect, frontend } from 'pageflow-scrolled/frontend';
import React, { useState, useRef } from 'react';
import classNames from 'classnames';

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

var styles = {"inactive":"MainStorylineSheet-module_inactive__1Ji-y","scaler":"MainStorylineSheet-module_scaler__jscn7"};

function MainStorylineSheet(_ref) {
  var activeExcursion = _ref.activeExcursion,
    children = _ref.children;
  var excursionActive = !!activeExcursion;
  var activeExcursionId = activeExcursion === null || activeExcursion === void 0 ? void 0 : activeExcursion.id;
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    previousScrollY = _useState2[0],
    setPreviousScrollY = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    inactive = _useState4[0],
    setInactive = _useState4[1];
  var previousThemeColorRef = useRef();
  useIsomorphicLayoutEffect(function () {
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (excursionActive) {
      setPreviousScrollY(window.scrollY);
      setInactive(true);
      previousThemeColorRef.current = themeColorMeta.getAttribute('content');
      themeColorMeta.setAttribute('content', '#000');
    } else {
      setInactive(false);
      themeColorMeta.setAttribute('content', previousThemeColorRef.current);
    }
  }, [excursionActive]);
  useIsomorphicLayoutEffect(function () {
    if (activeExcursionId) {
      window.scrollTo(0, 0);
    } else {
      setPreviousScrollY(function (previousScrollY) {
        window.queueMicrotask(function () {
          return window.scrollTo(0, previousScrollY);
        });
        return previousScrollY;
      });
    }
  }, [activeExcursionId]);
  return /*#__PURE__*/React.createElement("div", {
    inert: inactive ? 'true' : undefined,
    style: {
      '--previous-scroll-y': "".concat(previousScrollY, "px")
    },
    className: classNames(styles.wrapper, _defineProperty({}, styles.inactive, inactive))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.scaler
  }, children));
}

frontend.widgetTypes.register('mainStorylineSheet', {
  component: MainStorylineSheet
});
