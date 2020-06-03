import React, {useRef} from 'react';

import {VideoPlayer, useOnScreen, InlineCaption, usePlayerState} from 'pageflow-scrolled/frontend';
import {MediaPlayerControls} from 'pageflow-scrolled/frontend';

export function InlineVideo({sectionProps, configuration}) {
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

      <MediaPlayerControls playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>

      <InlineCaption text={configuration.caption}/>
    </div>
  )
}
