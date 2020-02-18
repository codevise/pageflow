import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';
import classNames from 'classnames';
import {InlineCaption} from 'pageflow-scrolled/frontend';

export function VideoEmbed({configuration}) {
  // base64-encoded configuration
  // => make component re-render on configuration changes
  function keyFromConfiguration(config) {
    return btoa(JSON.stringify(config))
  }

  return (
    <div className={styles.VideoEmbed}>
      <div className={classNames(styles.embedWrapper, styles[configuration.aspectRatio])}>
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
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  );
}
