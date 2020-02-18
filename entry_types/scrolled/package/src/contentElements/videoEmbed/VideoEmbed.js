import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoEmbed.module.css';
import {InlineCaption} from "../inlineImage/InlineCaption";

export function VideoEmbed({configuration}) {
  return (
    <div className={styles.VideoEmbed}>
      <div className={styles.embedWrapper} key={configuration}>
        <ReactPlayer className={styles.embedPlayer}
                     key={btoa(JSON.stringify(configuration))}
                     url={configuration.videoSource}
                     width='100%'
                     height='100%'
                     controls={!configuration.hideControls}
                     config={{
                       youtube: {
                         playerVars: {
                           showinfo: !configuration.hideInfo}
                       },
                       vimeo: {
                         playerOptions: {
                           byline: !configuration.hideInfo
                         }
                       }
                     }}/>
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  );
}
