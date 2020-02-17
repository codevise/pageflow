import React from 'react';

import styles from './VideoEmbed.module.css';
import {InlineCaption} from "../inlineImage/InlineCaption";

export function VideoEmbed({configuration}) {
  return (
    <div className={styles.VideoEmbed}>
      <div className={styles.embedWrapper}>
        <iframe width="100%"
                height="100%"
                src={`${configuration.videoSource}?controls=${configuration.hideControls ? '0' : '1'}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope"
                allowFullScreen />
      </div>
      <InlineCaption text={configuration.caption} />
    </div>
  );
}
