import { useContentElementEditorState, useContentElementLifecycle, ContentElementBox, ThirdPartyOptIn, ThirdPartyOptOutInfo, frontend } from 'pageflow-scrolled/frontend';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';

var styles = {"wrapper":"Placeholder-module_wrapper__jRFYE","row":"Placeholder-module_row__1SBRB","item":"Placeholder-module_item__RozmQ","load":"Placeholder-module_load__uFpxr","avatar":"Placeholder-module_avatar__2VeHz Placeholder-module_item__RozmQ","info":"Placeholder-module_info__37csK","name":"Placeholder-module_name__2T6as Placeholder-module_item__RozmQ","handle":"Placeholder-module_handle__2WwoF Placeholder-module_item__RozmQ","text":"Placeholder-module_text__DWLME Placeholder-module_item__RozmQ"};

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
var Icon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  viewBox: "0 0 512 512",
  "aria-hidden": "true"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z"
})));

function Placeholder({
  children,
  minHeight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper,
    style: {
      minHeight
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.row
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.avatar
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.info
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.name
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.handle
  })), /*#__PURE__*/React.createElement(Icon, {
    width: 24,
    height: 24
  })), children || /*#__PURE__*/React.createElement("div", {
    className: styles.text
  }));
}

var styles$1 = {"loadingContainer":"TwitterEmbed-module_loadingContainer__3Ozs_","container":"TwitterEmbed-module_container__380cX"};

function TwitterEmbed({
  configuration
}) {
  const {
    url,
    hideConversation,
    hideMedia
  } = configuration;
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const [minHeight, setMinHeight] = useState({});
  const key = [url, hideConversation, hideMedia].join('-');
  const onLoad = useCallback(({
    height
  }) => {
    setMinHeight({
      [key]: height
    });
  }, [key]);
  return /*#__PURE__*/React.createElement(ContentElementBox, null, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, shouldLoad ? /*#__PURE__*/React.createElement(ThirdPartyOptIn, {
    providerName: "twitter",
    icon: false,
    wrapper: children => /*#__PURE__*/React.createElement(Placeholder, null, children)
  }, /*#__PURE__*/React.createElement(Tweet, {
    key: key,
    url: url,
    hideConversation: hideConversation,
    hideMedia: hideMedia,
    minHeight: minHeight[key],
    onLoad: onLoad
  })) : /*#__PURE__*/React.createElement(Placeholder, {
    minHeight: minHeight[key]
  }), /*#__PURE__*/React.createElement(ThirdPartyOptOutInfo, {
    providerName: "twitter"
  })));
}
function scriptLoaded() {
  const promise = new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.addEventListener('load', resolve);
    document.head.appendChild(script);
  });
  return promise;
}
function Tweet({
  url,
  hideConversation,
  hideMedia,
  minHeight,
  onLoad
}) {
  const ref = useRef(null);
  const tweetId = url ? url.split('/')[5] : undefined;
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let isComponentMounted = true;
    const options = {
      cards: hideMedia ? "hidden" : "",
      conversation: hideConversation ? "none" : ""
    };
    scriptLoaded().then(() => {
      if (window.twttr.widgets && tweetId) {
        if (isComponentMounted) {
          if (window.twttr.widgets['createTweetEmbed']) {
            window.twttr.widgets.createTweet(tweetId, ref.current, options).then(() => {
              var _ref$current;
              setLoaded(true);
              onLoad({
                height: (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.clientHeight
              });
            });
          }
        }
      }
    });
    return () => isComponentMounted = false;
  }, [hideMedia, hideConversation, tweetId, onLoad]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, !loaded && /*#__PURE__*/React.createElement(Placeholder, {
    minHeight: minHeight
  }), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$1.container, {
      [styles$1.loadingContainer]: !loaded
    })
  }));
}

frontend.contentElementTypes.register('twitterEmbed', {
  component: TwitterEmbed,
  lifecycle: true,
  consentVendors({
    t
  }) {
    const prefix = 'pageflow_scrolled.public.twitter';
    return [{
      name: 'twitter',
      displayName: t(`${prefix}.consent_vendor_name`),
      description: t(`${prefix}.consent_vendor_description`),
      paradigm: 'lazy opt-in'
    }];
  }
});
