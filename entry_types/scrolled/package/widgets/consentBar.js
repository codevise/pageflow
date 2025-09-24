import { useI18n, ThemeIcon, useConsentRequested, useLocale, useLegalInfo, useDarkWidgets, frontend } from 'pageflow-scrolled/frontend';
import React, { useReducer, useState } from 'react';
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

var styles = {"toggle":"Toggle-module_toggle__2N5XY"};

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
var ToggleOnIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "60 170 90 157"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M150 297a50 50 0 0050-50 50 50 0 00-50-50H50a50 50 0 00-50 50 50 50 0 0050 50z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "-150",
    cy: "-247",
    fill: "currentColor",
    r: "40",
    transform: "scale(-1)"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "currentColor",
    strokeWidth: "6",
    d: "M87 227l-37 37-16-18",
    fill: "none"
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
var ToggleOffIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$1);
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "60 170 90 157"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M50 197a50 50 0 00-50 50 50 50 0 0050 50h100a50 50 0 0050-50 50 50 0 00-50-50H50z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "247",
    fill: "currentColor",
    r: "40"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "currentColor",
    strokeWidth: "6",
    d: "M110.103 271.897l49.795-49.794m-.001 49.794l-49.794-49.795",
    fill: "none"
  }));
});

function Toggle(_ref) {
  var id = _ref.id,
    checked = _ref.checked,
    onChange = _ref.onChange;
  var Icon = checked ? ToggleOnIcon : ToggleOffIcon;
  return /*#__PURE__*/React.createElement("button", {
    id: id,
    className: styles.toggle,
    role: "checkbox",
    "aria-checked": checked ? 'true' : 'false',
    onClick: onChange
  }, /*#__PURE__*/React.createElement(Icon, {
    width: 50,
    height: 35
  }));
}

var styles$1 = {"bar":"ConsentBar-module_bar__YiYoC widgets-module_translucentWidgetSurface__2WEIa","text":"ConsentBar-module_text__2GSPP","button":"ConsentBar-module_button__2LVnY","acceptAllButton":"ConsentBar-module_acceptAllButton__1rSdh ConsentBar-module_button__2LVnY","saveButton":"ConsentBar-module_saveButton__16b97 ConsentBar-module_button__2LVnY","configureButton":"ConsentBar-module_configureButton__1VBqX ConsentBar-module_button__2LVnY","vendorsBox":"ConsentBar-module_vendorsBox__Jckbl","vendorList":"ConsentBar-module_vendorList__3Z4jU","vendor":"ConsentBar-module_vendor__2hPAk","expandVendor":"ConsentBar-module_expandVendor__hSkAD","decisionButtons":"ConsentBar-module_decisionButtons__I4T8q"};

function reducer(state, vendorName) {
  return _objectSpread2(_objectSpread2({}, state), {}, _defineProperty({}, vendorName, !state[vendorName]));
}
function VendorsBox(_ref) {
  var vendors = _ref.vendors,
    save = _ref.save,
    _ref$defaultExpanded = _ref.defaultExpanded,
    defaultExpanded = _ref$defaultExpanded === void 0 ? false : _ref$defaultExpanded;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var _useReducer = useReducer(reducer, vendors.reduce(function (result, vendor) {
      return _objectSpread2(_objectSpread2({}, result), {}, _defineProperty({}, vendor.name, vendor.state === 'accepted'));
    }, {})),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    vendorStates = _useReducer2[0],
    dispatch = _useReducer2[1];
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.vendorsBox
  }, /*#__PURE__*/React.createElement("h3", null, t('pageflow_scrolled.public.consent_settings')), /*#__PURE__*/React.createElement("div", {
    className: styles$1.vendorList
  }, renderVendors({
    vendors: vendors,
    vendorStates: vendorStates,
    t: t,
    defaultExpanded: defaultExpanded,
    onToggle: dispatch
  })), /*#__PURE__*/React.createElement("button", {
    className: styles$1.saveButton,
    onClick: function onClick() {
      return save(vendorStates);
    }
  }, t('pageflow_scrolled.public.consent_save')));
}
function renderVendors(_ref2) {
  var vendors = _ref2.vendors,
    vendorStates = _ref2.vendorStates,
    t = _ref2.t,
    defaultExpanded = _ref2.defaultExpanded,
    onToggle = _ref2.onToggle;
  if (!vendors.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "consent_vendor_list-blank"
    }, t('pageflow_scrolled.public.consent_no_vendors'));
  }
  return vendors.map(function (vendor) {
    return /*#__PURE__*/React.createElement(Vendor, {
      key: vendor.name,
      vendor: vendor,
      state: vendorStates[vendor.name],
      t: t,
      defaultExpanded: defaultExpanded,
      onToggle: onToggle
    });
  });
}
function Vendor(_ref3) {
  var vendor = _ref3.vendor,
    state = _ref3.state,
    onToggle = _ref3.onToggle,
    t = _ref3.t,
    defaultExpanded = _ref3.defaultExpanded;
  var _useState = useState(defaultExpanded),
    _useState2 = _slicedToArray(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var id = "consent-vendor-".concat(vendor.name);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.vendor
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, vendor.displayName), /*#__PURE__*/React.createElement(Toggle, {
    id: id,
    checked: state,
    onChange: function onChange() {
      return onToggle(vendor.name);
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: styles$1.expandVendor,
    title: t('pageflow_scrolled.public.consent_expand_vendor'),
    onClick: function onClick() {
      return setExpanded(!expanded);
    }
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "information",
    width: 30,
    height: 34
  })), expanded && /*#__PURE__*/React.createElement("p", {
    dangerouslySetInnerHTML: {
      __html: vendor.description
    }
  }));
}

function ConsentBar(_ref) {
  var _ref$configuration = _ref.configuration,
    configuration = _ref$configuration === void 0 ? {} : _ref$configuration;
  var _useConsentRequested = useConsentRequested(),
    vendors = _useConsentRequested.vendors,
    acceptAll = _useConsentRequested.acceptAll,
    denyAll = _useConsentRequested.denyAll,
    save = _useConsentRequested.save;
  var _useState = useState(configuration.defaultExpanded),
    _useState2 = _slicedToArray(_useState, 2),
    expanded = _useState2[0],
    setExpanded = _useState2[1];
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var locale = useLocale();
  var privacyLinkUrl = useLegalInfo().privacy.url;
  var darkWidgets = useDarkWidgets();
  if (vendors) {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$1.bar, {
        'scope-dark': darkWidgets
      })
    }, renderText({
      privacyLinkUrl: privacyLinkUrl,
      t: t,
      locale: locale,
      vendors: vendors
    }), !expanded && /*#__PURE__*/React.createElement("button", {
      className: styles$1.configureButton,
      onClick: function onClick() {
        return setExpanded(true);
      }
    }, /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "gear",
      width: 15,
      height: 15
    }), t('pageflow_scrolled.public.consent_configure')), expanded && /*#__PURE__*/React.createElement(VendorsBox, {
      vendors: vendors,
      save: save,
      t: t,
      defaultExpanded: configuration.defaultExpanded
    }), /*#__PURE__*/React.createElement("div", {
      className: styles$1.decisionButtons
    }, /*#__PURE__*/React.createElement("button", {
      className: styles$1.button,
      onClick: denyAll
    }, t('pageflow_scrolled.public.consent_deny_all')), /*#__PURE__*/React.createElement("button", {
      className: styles$1.acceptAllButton,
      onClick: acceptAll
    }, t('pageflow_scrolled.public.consent_accept_all'))));
  }
  return null;
}
function renderText(_ref2) {
  var privacyLinkUrl = _ref2.privacyLinkUrl,
    t = _ref2.t,
    locale = _ref2.locale,
    vendors = _ref2.vendors;
  var vendorNames = vendors.map(function (vendor) {
    return vendor.name;
  }).join(',');
  var text = t('pageflow_scrolled.public.consent_prompt_html', {
    privacyLinkUrl: "".concat(privacyLinkUrl, "?lang=").concat(locale, "&vendors=").concat(vendorNames, "#consent")
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.text,
    dangerouslySetInnerHTML: {
      __html: text
    }
  });
}

frontend.widgetTypes.register('consentBar', {
  component: ConsentBar
});
