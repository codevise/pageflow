import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';
import classNames from 'classnames';

import {
  InlineCaption,
  useContentElementLifecycle,
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

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
    <div className={styles.VideoEmbed}>

      <div className={classNames(styles.embedWrapper, styles[configuration.aspectRatio])}
           style={{pointerEvents: isEditable && !isSelected ? 'none' : undefined}}>
        {renderPlayer()}
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  );
}
