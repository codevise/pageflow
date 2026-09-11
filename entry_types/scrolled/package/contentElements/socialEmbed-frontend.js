import { useContentElementEditorState, useContentElementLifecycle, ContentElementBox, ThirdPartyOptIn, ThirdPartyOptOutInfo, frontend } from 'pageflow-scrolled/frontend';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames';

const loadedScripts = new Set();
const loadingScripts = new Map();
function loadScript(src) {
  if (loadedScripts.has(src)) {
    return Promise.resolve();
  }
  if (loadingScripts.has(src)) {
    return loadingScripts.get(src);
  }
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => {
      loadedScripts.add(src);
      loadingScripts.delete(src);
      resolve();
    });
    script.addEventListener('error', () => {
      loadingScripts.delete(src);
      reject(new Error(`Failed to load script: ${src}`));
    });
    document.head.appendChild(script);
  });
  loadingScripts.set(src, promise);
  return promise;
}
function reloadScript(src) {
  const scripts = document.querySelectorAll(`script[src="${src}"]`);
  scripts.forEach(script => script.remove());
  loadedScripts.delete(src);
  loadingScripts.delete(src);
  return loadScript(src);
}

var styles = {"wrapper":"XPlaceholder-module_wrapper__1IvCE","row":"XPlaceholder-module_row__1Ty9F","item":"XPlaceholder-module_item__2AlY9 placeholder-module_item__2i0eO","avatar":"XPlaceholder-module_avatar__1TfhZ XPlaceholder-module_item__2AlY9 placeholder-module_item__2i0eO","info":"XPlaceholder-module_info__32nNs","name":"XPlaceholder-module_name__1Gj6h XPlaceholder-module_item__2AlY9 placeholder-module_item__2i0eO","handle":"XPlaceholder-module_handle__1UTKA XPlaceholder-module_item__2AlY9 placeholder-module_item__2i0eO","text":"XPlaceholder-module_text__lvrT3 XPlaceholder-module_item__2AlY9 placeholder-module_item__2i0eO"};

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

function XPlaceholder({
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

const xProvider = {
  name: 'x',
  Placeholder: XPlaceholder,
  embedScript: 'https://platform.twitter.com/widgets.js',
  Seed: () => /*#__PURE__*/React.createElement("div", null),
  process({
    element,
    url,
    configuration
  }) {
    var _window$twttr;
    const postId = url ? url.split('/')[5] : undefined;
    if (!postId || !((_window$twttr = window.twttr) === null || _window$twttr === void 0 ? void 0 : _window$twttr.widgets)) {
      return Promise.reject(new Error('Invalid post URL or X widgets not loaded'));
    }
    const options = {
      cards: configuration.hideMedia ? 'hidden' : '',
      conversation: configuration.hideConversation ? 'none' : ''
    };
    return window.twttr.widgets.createTweet(postId, element, options);
  }
};

var styles$1 = {"wrapper":"InstagramPlaceholder-module_wrapper__1RYie","item":"InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","header":"InstagramPlaceholder-module_header__3sU6C","avatar":"InstagramPlaceholder-module_avatar__BDRaM InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","username":"InstagramPlaceholder-module_username__26OVQ InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","imageContainer":"InstagramPlaceholder-module_imageContainer__16taa","content":"InstagramPlaceholder-module_content__TxvEV InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","footer":"InstagramPlaceholder-module_footer__1ebKe","textLine":"InstagramPlaceholder-module_textLine__1difc InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","textLineShort":"InstagramPlaceholder-module_textLineShort__1qzJX InstagramPlaceholder-module_textLine__1difc InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","textLineMedium":"InstagramPlaceholder-module_textLineMedium__1WvN4 InstagramPlaceholder-module_textLine__1difc InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO","textLineLong":"InstagramPlaceholder-module_textLineLong__x20k2 InstagramPlaceholder-module_textLine__1difc InstagramPlaceholder-module_item__1qjTR placeholder-module_item__2i0eO"};

function InstagramPlaceholder({
  children,
  minHeight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.wrapper,
    style: {
      minHeight
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$1.header
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$1.avatar
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$1.username
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$1.imageContainer
  }, children || /*#__PURE__*/React.createElement("div", {
    className: styles$1.content
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$1.footer
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$1.textLineShort
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$1.textLineMedium
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$1.textLineLong
  })));
}

function waitForIframeMessage(element) {
  return new Promise(resolve => {
    const checkForIframe = () => {
      const iframe = element.querySelector('iframe');
      if (iframe) {
        const handleMessage = event => {
          if (event.source === iframe.contentWindow) {
            const hasHeight = typeof event.data === 'object' ? event.data && 'height' in event.data : typeof event.data === 'string' && event.data.includes('height');
            if (hasHeight) {
              window.removeEventListener('message', handleMessage);
              resolve();
            }
          }
        };
        window.addEventListener('message', handleMessage);
      } else {
        setTimeout(checkForIframe, 50);
      }
    };
    checkForIframe();
  });
}

const instagramProvider = {
  name: 'instagram',
  Placeholder: InstagramPlaceholder,
  embedScript: 'https://www.instagram.com/embed.js',
  Seed: ({
    url
  }) => /*#__PURE__*/React.createElement("blockquote", {
    className: "instagram-media",
    "data-instgrm-captioned": true,
    "data-instgrm-permalink": url,
    "data-instgrm-version": "14"
  }, /*#__PURE__*/React.createElement("a", {
    href: url
  }, "View this post on Instagram")),
  process() {
    var _window$instgrm;
    if (!((_window$instgrm = window.instgrm) === null || _window$instgrm === void 0 ? void 0 : _window$instgrm.Embeds)) {
      return Promise.reject(new Error('Instagram embed script not loaded'));
    }
    window.instgrm.Embeds.process();
  },
  ready({
    element
  }) {
    return waitForIframeMessage(element);
  }
};

var styles$2 = {"wrapper":"BlueskyPlaceholder-module_wrapper__3YNT8","item":"BlueskyPlaceholder-module_item__2KUVd placeholder-module_item__2i0eO","header":"BlueskyPlaceholder-module_header__30fsg","avatar":"BlueskyPlaceholder-module_avatar__2TZGS BlueskyPlaceholder-module_item__2KUVd placeholder-module_item__2i0eO","info":"BlueskyPlaceholder-module_info__2qIqO","name":"BlueskyPlaceholder-module_name__1lhlW BlueskyPlaceholder-module_item__2KUVd placeholder-module_item__2i0eO","handle":"BlueskyPlaceholder-module_handle__4ghgn BlueskyPlaceholder-module_item__2KUVd placeholder-module_item__2i0eO","content":"BlueskyPlaceholder-module_content__1TrLN BlueskyPlaceholder-module_item__2KUVd placeholder-module_item__2i0eO"};

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
var Icon$1 = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 320 286"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M69.364 19.146c36.687 27.806 76.147 84.186 90.636 114.439 14.489-30.253 53.948-86.633 90.636-114.439C277.107-.917 320-16.44 320 32.957c0 9.865-5.603 82.875-8.889 94.729-11.423 41.208-53.045 51.719-90.071 45.357 64.719 11.12 81.182 47.953 45.627 84.785-80 82.874-106.667-44.333-106.667-44.333s-26.667 127.207-106.667 44.333c-35.555-36.832-19.092-73.665 45.627-84.785-37.026 6.362-78.648-4.149-90.071-45.357C5.603 115.832 0 42.822 0 32.957 0-16.44 42.893-.917 69.364 19.147z"
})));

function BlueskyPlaceholder({
  children,
  minHeight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$2.wrapper,
    style: {
      minHeight
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.header
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.avatar
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$2.info
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.name
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$2.handle
  })), /*#__PURE__*/React.createElement(Icon$1, null)), children || /*#__PURE__*/React.createElement("div", {
    className: styles$2.content
  }));
}

const blueskyProvider = {
  name: 'bluesky',
  Placeholder: BlueskyPlaceholder,
  embedScript: 'https://embed.bsky.app/static/embed.js',
  Seed: ({
    url
  }) => /*#__PURE__*/React.createElement("div", {
    "data-bluesky-uri": url
  }),
  process() {
    var _window$bluesky;
    if (!((_window$bluesky = window.bluesky) === null || _window$bluesky === void 0 ? void 0 : _window$bluesky.scan)) {
      return Promise.reject(new Error('Bluesky embed script not loaded'));
    }
    window.bluesky.scan();
  },
  ready({
    element
  }) {
    return waitForIframeMessage(element);
  }
};

var styles$3 = {"container":"TiktokPlaceholder-module_container__1gzeV","item":"TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","header":"TiktokPlaceholder-module_header__1HXzc","avatar":"TiktokPlaceholder-module_avatar__1YOKi TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","userInfo":"TiktokPlaceholder-module_userInfo__2SgqH","username":"TiktokPlaceholder-module_username__17Vr3 TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","displayName":"TiktokPlaceholder-module_displayName__RAhw3 TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","viewProfileButton":"TiktokPlaceholder-module_viewProfileButton__1Xzg1 TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","videoArea":"TiktokPlaceholder-module_videoArea__1Ij87","video":"TiktokPlaceholder-module_video__3oO4p TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","watchBar":"TiktokPlaceholder-module_watchBar__1qoOk TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","footer":"TiktokPlaceholder-module_footer__1Nrg-","textLine":"TiktokPlaceholder-module_textLine__3jh0B TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","textLineShort":"TiktokPlaceholder-module_textLineShort__2oels TiktokPlaceholder-module_textLine__3jh0B TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","textLineMedium":"TiktokPlaceholder-module_textLineMedium__3MI-M TiktokPlaceholder-module_textLine__3jh0B TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO","textLineLong":"TiktokPlaceholder-module_textLineLong__2Zuwg TiktokPlaceholder-module_textLine__3jh0B TiktokPlaceholder-module_item__2N_wf placeholder-module_item__2i0eO"};

function TiktokPlaceholder({
  children,
  minHeight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$3.container,
    style: minHeight ? {
      minHeight: `${minHeight}px`
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.header
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.avatar
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.userInfo
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.username
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.displayName
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$3.viewProfileButton
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$3.videoArea
  }, children || /*#__PURE__*/React.createElement("div", {
    className: styles$3.video
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$3.watchBar
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.footer
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.textLineShort
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.textLineMedium
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$3.textLineLong
  })));
}

const tiktokProvider = {
  name: 'tiktok',
  Placeholder: TiktokPlaceholder,
  embedScript: 'https://www.tiktok.com/embed.js',
  Seed: ({
    url
  }) => {
    var _url$split$;
    const videoId = url ? (_url$split$ = url.split('/video/')[1]) === null || _url$split$ === void 0 ? void 0 : _url$split$.split('?')[0] : undefined;
    return /*#__PURE__*/React.createElement("blockquote", {
      className: "tiktok-embed",
      cite: url,
      "data-video-id": videoId,
      style: {
        width: '325px'
      }
    }, /*#__PURE__*/React.createElement("section", null));
  },
  ready({
    element
  }) {
    return waitForIframeMessage(element);
  }
};

const defaultProviders = [xProvider, instagramProvider, blueskyProvider, tiktokProvider];

var styles$4 = {"wrapper":"SocialEmbed-module_wrapper__3gYhR","loadingContainer":"SocialEmbed-module_loadingContainer__2xlmf","container":"SocialEmbed-module_container__PlMW4"};

function SocialEmbed({
  configuration,
  providers = defaultProviders
}) {
  const {
    provider: providerName
  } = configuration;
  const provider = providers.find(p => p.name === providerName);
  return /*#__PURE__*/React.createElement(SocialEmbedWithProvider, {
    configuration: configuration,
    provider: provider
  });
}
function SocialEmbedWithProvider({
  configuration,
  provider
}) {
  const {
    url
  } = configuration;
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const [minHeight, setMinHeight] = useState({});
  const key = [url, JSON.stringify(configuration)].join('-');
  const onLoad = useCallback(({
    height
  }) => {
    setMinHeight({
      [key]: height
    });
  }, [key]);
  const Placeholder = provider.Placeholder;
  return /*#__PURE__*/React.createElement(ContentElementBox, null, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, shouldLoad && url ? /*#__PURE__*/React.createElement(ThirdPartyOptIn, {
    icon: false,
    wrapper: children => /*#__PURE__*/React.createElement(Placeholder, null, children)
  }, /*#__PURE__*/React.createElement(Embed, {
    key: key,
    provider: provider,
    url: url,
    configuration: configuration,
    minHeight: minHeight[key],
    onLoad: onLoad
  })) : /*#__PURE__*/React.createElement(Placeholder, {
    minHeight: minHeight[key]
  }), /*#__PURE__*/React.createElement(ThirdPartyOptOutInfo, null)));
}
function Embed({
  provider,
  url,
  configuration,
  minHeight,
  onLoad
}) {
  const ref = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const Placeholder = provider.Placeholder;
  useEffect(() => {
    let isComponentMounted = true;
    const loadAndProcess = async () => {
      try {
        if (provider.process) {
          await loadScript(provider.embedScript);
          if (isComponentMounted) {
            await provider.process({
              element: ref.current,
              url,
              configuration
            });
          }
        } else {
          await reloadScript(provider.embedScript);
        }
        if (isComponentMounted && provider.ready) {
          await provider.ready({
            element: ref.current
          });
        }
        if (isComponentMounted) {
          var _ref$current;
          setScriptLoaded(true);
          onLoad({
            height: ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.clientHeight) - 20
          });
        }
      } catch (error) {
        console.error(`Failed to load ${provider.name} embed:`, error);
      }
    };
    loadAndProcess();
    return () => {
      isComponentMounted = false;
    };
  }, [provider, url, configuration, onLoad]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$4.wrapper
  }, !scriptLoaded && /*#__PURE__*/React.createElement(Placeholder, {
    minHeight: minHeight
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$4.container, {
      [styles$4.loadingContainer]: !scriptLoaded
    }),
    ref: ref
  }, /*#__PURE__*/React.createElement(provider.Seed, {
    url: url,
    configuration: configuration
  })));
}

frontend.contentElementTypes.register('socialEmbed', {
  component: SocialEmbed,
  lifecycle: true
});
