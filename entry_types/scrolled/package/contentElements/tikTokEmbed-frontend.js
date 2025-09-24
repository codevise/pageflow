import { useContentElementEditorState, useContentElementLifecycle, useIsStaticPreview, ContentElementBox, ThirdPartyOptIn, ThirdPartyOptOutInfo, frontend } from 'pageflow-scrolled/frontend';
import React from 'react';
import Embed from 'react-tiny-oembed';

var styles = {"wrapper":"TikTokEmbed-module_wrapper__3WY_5","inner":"TikTokEmbed-module_inner__2pH02"};

var tikTokProvider = {
  provider_name: "TikTok",
  provider_url: "http://www.tiktok.com/",
  endpoints: [{
    schemes: ["https://www.tiktok.com/*", "https://www.tiktok.com/*/video/*"],
    url: "https://www.tiktok.com/oembed"
  }]
};
function TikTokEmbed(_ref) {
  var configuration = _ref.configuration;
  var url = configuration.url;
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable,
    isSelected = _useContentElementEdi.isSelected;
  var _useContentElementLif = useContentElementLifecycle(),
    shouldLoad = _useContentElementLif.shouldLoad;
  var isStaticPreview = useIsStaticPreview();
  return /*#__PURE__*/React.createElement(ContentElementBox, null, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, shouldLoad && url && !isStaticPreview && /*#__PURE__*/React.createElement(ThirdPartyOptIn, {
    providerName: "tiktok"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.inner,
    "data-percy": "hide"
  }, /*#__PURE__*/React.createElement(Embed, {
    key: url,
    url: url,
    providers: [tikTokProvider]
  })))), /*#__PURE__*/React.createElement(ThirdPartyOptOutInfo, {
    inset: true,
    providerName: "tiktok"
  })));
}

frontend.contentElementTypes.register('tikTokEmbed', {
  component: TikTokEmbed,
  lifecycle: true,
  customMargin: true,
  consentVendors: function consentVendors(_ref) {
    var t = _ref.t;
    var prefix = 'pageflow_scrolled.public.tiktok';
    return [{
      name: 'tiktok',
      displayName: t("".concat(prefix, ".consent_vendor_name")),
      description: t("".concat(prefix, ".consent_vendor_description")),
      paradigm: 'lazy opt-in'
    }];
  }
});
