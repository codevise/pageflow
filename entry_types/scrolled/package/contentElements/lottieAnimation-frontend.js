import { useFileWithInlineRights, useContentElementLifecycle, processImageModifiers, FitViewport, ContentElementBox, ContentElementFigure, FilePlaceholder, InlineFileRights, useContentElementViewTimelineProgress, frontend } from 'pageflow-scrolled/frontend';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm';

// Prevent the player from fetching its WebAssembly module from a CDN.
// Frontend and editor run in separate bundles and thus each need to
// point the player at the module emitted by their own build.
DotLottie.setWasmUrl(wasmUrl);

var styles = {"canvas":"LottieAnimation-module_canvas__2znAi"};

function LottieAnimation({
  configuration
}) {
  var _configuration$cropPo, _configuration$cropPo2;
  const lottieFile = useFileWithInlineRights({
    configuration,
    collectionName: 'lottieFiles',
    propertyName: 'id'
  });
  const {
    playbackMode = 'loop',
    scrollRange = 'cover',
    startAnimationTrigger = 'onActivate'
  } = configuration;

  // Loops and scroll coupled animations start as soon as they are visible, so
  // a trigger left over from switching playback modes must not hold them back.
  const startTrigger = playbackMode === 'playOnce' ? startAnimationTrigger : 'onVisible';
  const [hasStarted, setHasStarted] = useState(false);
  const start = useCallback(() => setHasStarted(true), []);
  const {
    shouldLoad,
    isVisible
  } = useContentElementLifecycle({
    onActivate: startTrigger === 'onActivate' ? start : undefined,
    onVisible: startTrigger === 'onVisible' ? start : undefined,
    // Without forgetting that playback has started, the animation would resume
    // as soon as the element becomes visible again, even though its trigger
    // has not been reached since.
    onInvisible: () => setHasStarted(false)
  });
  const [animationAspectRatio, setAnimationAspectRatio] = useState();
  const {
    aspectRatio,
    rounded
  } = processImageModifiers(configuration.imageModifiers);
  const isCircleCrop = rounded === 'circle';
  return /*#__PURE__*/React.createElement(FitViewport, {
    aspectRatio: aspectRatio || animationAspectRatio,
    fallbackAspectRatio: 1
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    borderRadius: isCircleCrop ? 'none' : rounded,
    configuration: isCircleCrop ? undefined : configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement(ContentElementBox, {
    borderRadius: isCircleCrop ? 'circle' : 'none',
    configuration: isCircleCrop ? configuration : undefined,
    positioned: isCircleCrop
  }, /*#__PURE__*/React.createElement(FilePlaceholder, {
    file: lottieFile
  }), lottieFile && shouldLoad && /*#__PURE__*/React.createElement(Player, {
    lottieFile: lottieFile,
    alt: lottieFile.configuration.alt,
    loop: playbackMode === 'loop',
    play: isVisible && hasStarted,
    seekOnScroll: playbackMode === 'scroll',
    scrollRange: scrollRange,
    fit: aspectRatio ? 'cover' : 'contain',
    cropPositionX: (_configuration$cropPo = configuration.cropPosition) === null || _configuration$cropPo === void 0 ? void 0 : _configuration$cropPo.x,
    cropPositionY: (_configuration$cropPo2 = configuration.cropPosition) === null || _configuration$cropPo2 === void 0 ? void 0 : _configuration$cropPo2.y,
    onAspectRatioChange: setAnimationAspectRatio
  })), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "insideElement",
    items: [{
      file: lottieFile
    }]
  })))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: [{
      file: lottieFile
    }]
  }));
}
function Player({
  lottieFile,
  alt,
  loop,
  play,
  seekOnScroll,
  scrollRange,
  fit,
  cropPositionX = 50,
  cropPositionY = 50,
  onAspectRatioChange
}) {
  const canvasRef = useRef();
  const dotLottieRef = useRef();
  const isLoadedRef = useRef(false);
  const playRef = useRef(play);
  playRef.current = play;
  const progressRef = useRef(0);
  const seek = useCallback(progress => {
    progressRef.current = progress;
    if (isLoadedRef.current) {
      const dotLottie = dotLottieRef.current;
      dotLottie.setFrame(progress * (dotLottie.totalFrames - 1));
    }
  }, []);
  useContentElementViewTimelineProgress({
    range: scrollRange,
    onProgress: seekOnScroll ? seek : null
  });
  useEffect(() => {
    const dotLottie = new DotLottie({
      canvas: canvasRef.current,
      src: lottieFile.urls.original,
      loop,
      layout: {
        fit,
        align: [cropPositionX / 100, cropPositionY / 100]
      },
      autoplay: false,
      renderConfig: {
        autoResize: true
      }
    });

    // Playback is only started here since the animation cannot be
    // played or seeked before it has been loaded.
    dotLottie.addEventListener('load', () => {
      const {
        width,
        height
      } = dotLottie.animationSize();
      if (width && height) {
        onAspectRatioChange(height / width);
      }
      isLoadedRef.current = true;
      if (seekOnScroll) {
        seek(progressRef.current);
      } else if (playRef.current) {
        dotLottie.play();
      }
    });
    dotLottieRef.current = dotLottie;
    return () => {
      isLoadedRef.current = false;
      dotLottieRef.current = null;
      dotLottie.destroy();
    };
  }, [lottieFile.urls.original, loop, fit, seekOnScroll, seek, cropPositionX, cropPositionY, onAspectRatioChange]);
  useEffect(() => {
    if (seekOnScroll) {
      return;
    }
    if (play) {
      dotLottieRef.current.play();
    } else {
      dotLottieRef.current.pause();
    }
  }, [play, seekOnScroll]);

  // A canvas has no alt attribute.
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: styles.canvas,
    role: alt ? 'img' : undefined,
    "aria-label": alt || undefined,
    "aria-hidden": alt ? undefined : true
  });
}

frontend.contentElementTypes.register('lottieAnimation', {
  component: LottieAnimation,
  lifecycle: true,
  viewTimeline: true
});
