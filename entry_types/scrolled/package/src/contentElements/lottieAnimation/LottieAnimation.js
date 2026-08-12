import React, {useEffect, useRef, useState} from 'react';

import {
  ContentElementBox,
  ContentElementFigure,
  FilePlaceholder,
  FitViewport,
  InlineFileRights,
  processImageModifiers,
  useContentElementLifecycle,
  useFileWithInlineRights
} from 'pageflow-scrolled/frontend';

import {DotLottie} from './dotLottie';

import styles from './LottieAnimation.module.css';

export function LottieAnimation({configuration}) {
  const lottieFile = useFileWithInlineRights({
    configuration, collectionName: 'lottieFiles', propertyName: 'id'
  });

  const {shouldLoad, isVisible} = useContentElementLifecycle();
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
                       loop={configuration.playbackMode !== 'playOnce'}
                       play={isVisible}
                       fit={aspectRatio ? 'cover' : 'contain'}
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

function Player({lottieFile, loop, play, fit, onAspectRatioChange}) {
  const canvasRef = useRef();
  const dotLottieRef = useRef();

  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    const dotLottie = new DotLottie({
      canvas: canvasRef.current,
      src: lottieFile.urls.original,
      loop,
      layout: {fit},
      autoplay: false,
      renderConfig: {autoResize: true}
    });

    // Playback is only started here since the animation cannot be
    // played before it has been loaded.
    dotLottie.addEventListener('load', () => {
      const {width, height} = dotLottie.animationSize();

      if (width && height) {
        onAspectRatioChange(height / width);
      }

      if (playRef.current) {
        dotLottie.play();
      }
    });

    dotLottieRef.current = dotLottie;

    return () => {
      dotLottieRef.current = null;
      dotLottie.destroy();
    };
  }, [lottieFile.urls.original, loop, fit, onAspectRatioChange]);

  useEffect(() => {
    if (play) {
      dotLottieRef.current.play();
    }
    else {
      dotLottieRef.current.pause();
    }
  }, [play]);

  return (
    <canvas ref={canvasRef} className={styles.canvas} />
  );
}
