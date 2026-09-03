import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  ContentElementBox,
  ContentElementFigure,
  FilePlaceholder,
  FitViewport,
  InlineFileRights,
  processImageModifiers,
  useContentElementLifecycle,
  useContentElementViewTimelineProgress,
  useFileWithInlineRights
} from 'pageflow-scrolled/frontend';

import {DotLottie} from './dotLottie';

import styles from './LottieAnimation.module.css';

export function LottieAnimation({configuration}) {
  const lottieFile = useFileWithInlineRights({
    configuration, collectionName: 'lottieFiles', propertyName: 'id'
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

  const {shouldLoad, isVisible} = useContentElementLifecycle({
    onActivate: startTrigger === 'onActivate' ? start : undefined,
    onVisible: startTrigger === 'onVisible' ? start : undefined,

    // Without forgetting that playback has started, the animation would resume
    // as soon as the element becomes visible again, even though its trigger
    // has not been reached since.
    onInvisible: () => setHasStarted(false)
  });

  const [animationAspectRatio, setAnimationAspectRatio] = useState();

  const {aspectRatio, rounded} = processImageModifiers(configuration.imageModifiers);
  const isCircleCrop = rounded === 'circle';

  return (
    <FitViewport aspectRatio={aspectRatio || animationAspectRatio}
                 fallbackAspectRatio={1}>
      <ContentElementBox borderRadius={isCircleCrop ? 'none' : rounded}
                         configuration={isCircleCrop ? undefined : configuration}>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <ContentElementBox borderRadius={isCircleCrop ? 'circle' : 'none'}
                               configuration={isCircleCrop ? configuration : undefined}
                               positioned={isCircleCrop}>
              <FilePlaceholder file={lottieFile} />
              {lottieFile && shouldLoad &&
               <Player lottieFile={lottieFile}
                       alt={lottieFile.configuration.alt}
                       loop={playbackMode === 'loop'}
                       play={isVisible && hasStarted}
                       seekOnScroll={playbackMode === 'scroll'}
                       scrollRange={scrollRange}
                       fit={aspectRatio ? 'cover' : 'contain'}
                       cropPositionX={configuration.cropPosition?.x}
                       cropPositionY={configuration.cropPosition?.y}
                       onAspectRatioChange={setAnimationAspectRatio} />}
            </ContentElementBox>
            <InlineFileRights configuration={configuration}
                              context="insideElement"
                              items={[{file: lottieFile}]} />
          </FitViewport.Content>
        </ContentElementFigure>
      </ContentElementBox>
      <InlineFileRights configuration={configuration}
                        context="afterElement"
                        items={[{file: lottieFile}]} />
    </FitViewport>
  );
}

function Player({
  lottieFile, alt, loop, play, seekOnScroll, scrollRange, fit,
  cropPositionX = 50, cropPositionY = 50, onAspectRatioChange
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
      layout: {fit, align: [cropPositionX / 100, cropPositionY / 100]},
      autoplay: false,
      renderConfig: {autoResize: true}
    });

    // Playback is only started here since the animation cannot be
    // played or seeked before it has been loaded.
    dotLottie.addEventListener('load', () => {
      const {width, height} = dotLottie.animationSize();

      if (width && height) {
        onAspectRatioChange(height / width);
      }

      isLoadedRef.current = true;

      if (seekOnScroll) {
        seek(progressRef.current);
      }
      else if (playRef.current) {
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
    }
    else {
      dotLottieRef.current.pause();
    }
  }, [play, seekOnScroll]);

  // A canvas has no alt attribute.
  return (
    <canvas ref={canvasRef}
            className={styles.canvas}
            role={alt ? 'img' : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true} />
  );
}
