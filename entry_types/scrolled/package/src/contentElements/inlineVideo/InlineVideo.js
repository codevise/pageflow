import React, {useRef} from 'react';

import {VideoPlayer, useOnScreen, InlineCaption, usePlayerState} from 'pageflow-scrolled/frontend';

import styles from './InlineVideo.module.css';

export function InlineVideo({configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');
  const [playerState, playerActions] = usePlayerState();

  return (
    <div ref={ref}>
      <VideoPlayer position={configuration.position}
                   autoplay={configuration.autoplay}
                   controls={configuration.controls}
                   playerState={playerState}
                   playerActions={playerActions}
                   id={configuration.id}
                   state={onScreen ? 'active' : 'inactive'}
                   quality={'high'}
                   interactive={true}
                   playsInline={true}/>

      <InlineCaption text={configuration.caption}/>
    </div>
  )
}
