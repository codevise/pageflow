import React, {useRef} from 'react';
import classNames from 'classnames';

import {AudioPlayer, useOnScreen, usePlayerState, MediaPlayerControls} from 'pageflow-scrolled/frontend';

import styles from './InlineAudio.module.css';

export function InlineAudio({sectionProps, configuration}) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');
  const [playerState, playerActions] = usePlayerState();

  return (
    <div ref={ref}>
      <AudioPlayer autoplay={configuration.autoplay}
                   controls={configuration.controls}
                   playerState={playerState}
                   playerActions={playerActions}
                   id={configuration.id}
                   state={onScreen ? 'active' : 'inactive'}
                   quality={'high'}
                   interactive={true}
                   playsInline={true}/>

      <MediaPlayerControls playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>
    </div>
  )
}
