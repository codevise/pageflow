import { useI18n, ThemeIcon, useIsomorphicLayoutEffect, SectionIntersectionObserver, frontend } from 'pageflow-scrolled/frontend';
import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

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

var styles = {"button":"CloseButton-module_button__3aQ6f","invert":"CloseButton-module_invert__3C788"};

function CloseButton(_ref) {
  var invert = _ref.invert,
    onClick = _ref.onClick;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles.button, _defineProperty({}, styles.invert, invert)),
    "aria-label": t('pageflow_scrolled.public.close'),
    title: t('pageflow_scrolled.public.close'),
    onClick: onClick
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "close",
    width: 30,
    height: 30
  }));
}

function useScrollCenter() {
  var parentRef = useRef();
  var childRef = useRef();
  useEffect(function () {
    function onScroll() {
      var parentRect = parentRef.current.getBoundingClientRect();
      childRef.current.style.transform = "translate(-50%, calc((100lvh - ".concat(parentRect.top, "px) * 0.3 - 50%)");
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
    return function () {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return [parentRef, childRef];
}

var styles$1 = {"wrapper":"ReturnButton-module_wrapper__3rzAj","button":"ReturnButton-module_button__1SKjN"};

function ReturnButton(_ref) {
  var label = _ref.label,
    onClose = _ref.onClose,
    children = _ref.children;
  var _useScrollCenter = useScrollCenter(),
    _useScrollCenter2 = _slicedToArray(_useScrollCenter, 2),
    wrapperRef = _useScrollCenter2[0],
    buttonRef = _useScrollCenter2[1];
  useIsomorphicLayoutEffect(function () {
    var timeline = new window.ViewTimeline({
      subject: wrapperRef.current
    });
    var animation = buttonRef.current.animate({
      opacity: ['0', '1']
    }, {
      timeline: timeline,
      fill: 'both',
      rangeStart: 'entry 10%',
      rangeEnd: 'entry 50%'
    });
    return function () {
      return animation.cancel();
    };
  }, []);
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.wrapper,
    ref: wrapperRef,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$1.button,
    ref: buttonRef
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "back",
    width: 30,
    height: 30
  }), label || t('pageflow_scrolled.public.exit_excursion')));
}

var styles$2 = {"container":"ExcursionSheet-module_container__2NpY_ colors-module_contentColorScope__1Oidv","backdrop":"ExcursionSheet-module_backdrop__3RyMJ","content":"ExcursionSheet-module_content__3pYqz","probe":"ExcursionSheet-module_probe__3xetc"};

function ExcursionSheet(_ref) {
  var excursion = _ref.excursion,
    onClose = _ref.onClose,
    children = _ref.children;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    intersectingSectionInverted = _useState2[0],
    setIntersectingSectionInverted = _useState2[1];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles$2.backdrop,
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    key: excursion.id,
    className: styles$2.container
  }, /*#__PURE__*/React.createElement(CloseButton, {
    invert: intersectingSectionInverted,
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$2.content
  }, /*#__PURE__*/React.createElement(SectionIntersectionObserver, {
    sections: excursion.sections,
    probeClassName: styles$2.probe,
    onChange: function onChange(section) {
      return setIntersectingSectionInverted(section === null || section === void 0 ? void 0 : section.invert);
    }
  }, children)), /*#__PURE__*/React.createElement(ReturnButton, {
    label: excursion.returnButtonLabel,
    onClose: onClose
  })));
}

frontend.widgetTypes.register('excursionSheet', {
  component: ExcursionSheet
});
