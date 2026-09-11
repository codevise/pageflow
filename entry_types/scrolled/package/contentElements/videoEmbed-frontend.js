import { useContentElementEditorState, useContentElementLifecycle, FitViewport, ContentElementBox, ContentElementFigure, ThirdPartyOptOutInfo, useAudioFocus, useFile, ThirdPartyOptIn, useAtmo, frontend } from 'pageflow-scrolled/frontend';
import React, { useState, useMemo } from 'react';
import ReactPlayer from 'react-player';

const youtubeMatcher = /youtube\.com\/|youtu\.be\//;
const vimeoMatcher = /vimeo\.com\//;
const facebookMatcher = /facebook\.com\//;
function getProviderName(url) {
  if (youtubeMatcher.test(url)) {
    return 'youtube';
  } else if (vimeoMatcher.test(url)) {
    return 'vimeo';
  } else if (facebookMatcher.test(url)) {
    return 'facebook';
  }
  return null;
}

var styles = {"embedPlayer":"VideoEmbed-module_embedPlayer__54NKG"};

const aspectRatios = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};
function VideoEmbed({
  contentElementId,
  configuration
}) {
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const [playerState, setPlayerState] = useState('unplayed');
  const providerName = getProviderName(configuration.videoSource);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, /*#__PURE__*/React.createElement(FitViewport, {
    aspectRatio: aspectRatios[configuration.aspectRatio || 'wide']
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, shouldLoad && /*#__PURE__*/React.createElement(PreparedPlayer, {
    playerState: playerState,
    setPlayerState: setPlayerState,
    contentElementId: contentElementId,
    configuration: configuration,
    providerName: providerName
  })), /*#__PURE__*/React.createElement(ThirdPartyOptOutInfo, {
    providerName: providerName,
    hide: playerState === 'playing'
  })))));
}
function PreparedPlayer({
  contentElementId,
  configuration,
  playerState,
  setPlayerState,
  providerName
}) {
  useAudioFocus({
    key: contentElementId,
    request: playerState === 'playing',
    onLost() {
      setPlayerState('paused');
    }
  });
  useContentElementLifecycle({
    onInvisible() {
      setPlayerState('paused');
    }
  });
  const posterImageFile = useFile({
    collectionName: 'imageFiles',
    permaId: configuration.posterId
  });
  const posterUrl = (posterImageFile === null || posterImageFile === void 0 ? void 0 : posterImageFile.isReady) && posterImageFile.urls.large;

  // React player does not re-create player when controls or config
  // prop changes. Ensure key changes to force React to re-mount
  // component.
  function keyFromConfiguration(config) {
    return [config.hideControls, config.hideInfo].join('');
  }
  const atmoHooks = useAtmoHooks(configuration.atmoDuringPlayback);
  function onPlay() {
    setPlayerState('playing');
    atmoHooks.before();
  }
  function onPauseOrEnd() {
    setPlayerState('paused');
    atmoHooks.after();
  }
  return /*#__PURE__*/React.createElement(ThirdPartyOptIn, {
    providerName: providerName
  }, ({
    consentedHere
  }) => /*#__PURE__*/React.createElement(ReactPlayer, {
    className: styles.embedPlayer,
    key: keyFromConfiguration(configuration),
    url: configuration.videoSource,
    playing: playerState !== 'paused',
    onPlay: onPlay,
    onPause: onPauseOrEnd,
    onEnded: onPauseOrEnd,
    light: !consentedHere && playerState === 'unplayed' ? posterUrl || true : false,
    width: "100%",
    height: "100%",
    controls: !configuration.hideControls,
    config: {
      // ReactPlayer does not rerender when only
      // event handler props change. Since event
      // handlers depend on latest value of
      // atmoDuringPlayback, we force a render by
      // changing this unused config option.
      _unused: configuration.atmoDuringPlayback,
      youtube: {
        playerVars: {
          showinfo: !configuration.hideInfo
        }
      },
      vimeo: {
        playerOptions: {
          byline: !configuration.hideInfo
        }
      }
    }
  }));
}
function useAtmoHooks(atmoDuringPlayback) {
  const atmo = useAtmo();
  return useMemo(() => {
    const {
      before,
      after
    } = atmo.createMediaPlayerHooks(atmoDuringPlayback) || {
      before() {},
      after() {}
    };
    let timeout;
    return {
      before() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        } else {
          before();
        }
      },
      after() {
        // When seeking in the video pause and play events
        // fired. Prevent briefly fading the atmo back in.
        timeout = setTimeout(() => {
          after();
          timeout = null;
        }, 1000);
      }
    };
  }, [atmo, atmoDuringPlayback]);
}

frontend.contentElementTypes.register('videoEmbed', {
  component: VideoEmbed,
  lifecycle: true,
  consentVendors({
    configuration,
    t
  }) {
    const provider = getProviderName(configuration.videoSource);
    if (provider) {
      const prefix = 'pageflow_scrolled.public.video_embed.consent';
      return [{
        name: provider,
        displayName: t(`${prefix}.${provider}.vendor_name`),
        description: t(`${prefix}.${provider}.vendor_description`),
        paradigm: 'lazy opt-in'
      }];
    }
    return [];
  }
});
