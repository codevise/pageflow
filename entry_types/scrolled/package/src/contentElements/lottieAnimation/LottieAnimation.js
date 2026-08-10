import React, {useEffect, useRef, useState} from 'react';
import {DotLottie} from '@lottiefiles/dotlottie-web';
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm';

import {
  ContentElementBox,
  ContentElementFigure,
  FilePlaceholder,
  FitViewport,
  InlineFileRights,
  useContentElementLifecycle,
  useFileWithInlineRights
} from 'pageflow-scrolled/frontend';

import styles from './LottieAnimation.module.css';

// Prevent the player from fetching its WebAssembly module from a CDN.
DotLottie.setWasmUrl(wasmUrl);

export function LottieAnimation({configuration}) {
  const lottieFile = useFileWithInlineRights({
    configuration, collectionName: 'lottieFiles', propertyName: 'id'
  });

  const {shouldLoad, isVisible} = useContentElementLifecycle();
  const [aspectRatio, setAspectRatio] = useState();

  return (
    <FitViewport aspectRatio={aspectRatio} fallbackAspectRatio={1}>
      <ContentElementBox configuration={configuration}>
        <ContentElementFigure configuration={configuration}>
          <FitViewport.Content>
            <FilePlaceholder file={lottieFile} />
            {lottieFile && shouldLoad &&
             <Player lottieFile={lottieFile}
                     loop={configuration.playbackMode !== 'playOnce'}
                     play={isVisible}
                     onAspectRatioChange={setAspectRatio} />}
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

function Player({lottieFile, loop, play, onAspectRatioChange}) {
  const canvasRef = useRef();
  const dotLottieRef = useRef();

  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    const dotLottie = new DotLottie({
      canvas: canvasRef.current,
      src: lottieFile.urls.original,
      loop,
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
  }, [lottieFile.urls.original, loop, onAspectRatioChange]);

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
