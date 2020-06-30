import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';

import {
  Figure,
  ViewportDependentPillarBoxes,
  useContentElementLifecycle,
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

const aspectRatios = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};

export function VideoEmbed({configuration}) {
  const {isPrepared} = useContentElementLifecycle();
  const {isEditable, isSelected} = useContentElementEditorState();

  // base64-encoded configuration
  // => make component re-render on configuration changes
  function keyFromConfiguration(config) {
    return btoa(JSON.stringify(config))
  }

  function renderPlayer() {
    if (!isPrepared) {
      return null;
    }

    return (
      <ReactPlayer className={styles.embedPlayer}
                   key={keyFromConfiguration(configuration)}
                   url={configuration.videoSource}
                   playing={true}
                   light={true}
                   width='100%'
                   height='100%'
                   controls={!configuration.hideControls}
                   config={{
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
                   }} />
    );
  }

  return (
    <div className={styles.VideoEmbed}
         style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
      <Figure caption={configuration.caption}>
        <ViewportDependentPillarBoxes aspectRatio={aspectRatios[configuration.aspectRatio || 'wide']}
                                      position={configuration.position}
                                      opaque={!!configuration.caption}>
          {renderPlayer()}
        </ViewportDependentPillarBoxes>
      </Figure>
    </div>
  );
}
