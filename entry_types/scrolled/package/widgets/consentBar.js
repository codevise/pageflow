import { useI18n, ThemeIcon, useConsentRequested, usePrivacyLink, useDarkWidgets, frontend } from 'pageflow-scrolled/frontend';
import React, { useReducer, useState } from 'react';
import classNames from 'classnames';

var styles = {"toggle":"Toggle-module_toggle__2N5XY"};

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
var ToggleOnIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
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
})));

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
var ToggleOffIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
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
})));

function Toggle({
  id,
  checked,
  onChange
}) {
  const Icon = checked ? ToggleOnIcon : ToggleOffIcon;
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
  return {
    ...state,
    [vendorName]: !state[vendorName]
  };
}
function VendorsBox({
  vendors,
  save,
  defaultExpanded = false
}) {
  const {
    t
  } = useI18n();
  const [vendorStates, dispatch] = useReducer(reducer, vendors.reduce((result, vendor) => ({
    ...result,
    [vendor.name]: vendor.state === 'accepted'
  }), {}));
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.vendorsBox
  }, /*#__PURE__*/React.createElement("h3", null, t('pageflow_scrolled.public.consent_settings')), /*#__PURE__*/React.createElement("div", {
    className: styles$1.vendorList
  }, renderVendors({
    vendors,
    vendorStates,
    t,
    defaultExpanded,
    onToggle: dispatch
  })), /*#__PURE__*/React.createElement("button", {
    className: styles$1.saveButton,
    onClick: () => save(vendorStates)
  }, t('pageflow_scrolled.public.consent_save')));
}
function renderVendors({
  vendors,
  vendorStates,
  t,
  defaultExpanded,
  onToggle
}) {
  if (!vendors.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "consent_vendor_list-blank"
    }, t('pageflow_scrolled.public.consent_no_vendors'));
  }
  return vendors.map(vendor => /*#__PURE__*/React.createElement(Vendor, {
    key: vendor.name,
    vendor: vendor,
    state: vendorStates[vendor.name],
    t: t,
    defaultExpanded: defaultExpanded,
    onToggle: onToggle
  }));
}
function Vendor({
  vendor,
  state,
  onToggle,
  t,
  defaultExpanded
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const id = `consent-vendor-${vendor.name}`;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.vendor
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, vendor.displayName), /*#__PURE__*/React.createElement(Toggle, {
    id: id,
    checked: state,
    onChange: () => onToggle(vendor.name)
  }), /*#__PURE__*/React.createElement("button", {
    className: styles$1.expandVendor,
    title: t('pageflow_scrolled.public.consent_expand_vendor'),
    onClick: () => setExpanded(!expanded)
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

function ConsentBar({
  configuration = {}
}) {
  const {
    vendors,
    acceptAll,
    denyAll,
    save
  } = useConsentRequested();
  const [expanded, setExpanded] = useState(configuration.defaultExpanded);
  const {
    t
  } = useI18n();
  const {
    url: privacyLinkUrl
  } = usePrivacyLink({
    vendors: (vendors || []).map(vendor => vendor.name).join(',')
  });
  const darkWidgets = useDarkWidgets();
  if (vendors) {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$1.bar, {
        'scope-dark': darkWidgets
      })
    }, renderText({
      privacyLinkUrl,
      t
    }), !expanded && /*#__PURE__*/React.createElement("button", {
      className: styles$1.configureButton,
      onClick: () => setExpanded(true)
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
function renderText({
  privacyLinkUrl,
  t
}) {
  const text = t('pageflow_scrolled.public.consent_prompt_html', {
    privacyLinkUrl
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
