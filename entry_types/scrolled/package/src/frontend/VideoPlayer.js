import React from 'react';
import {useFile} from '../entryState';
import {MediaPlayer} from './MediaPlayer';

import classNames from 'classnames';
import styles from "./VideoPlayer.module.css";


/**
 * Render video file in MediaPlayer.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the video file.
 */
export function VideoPlayer(props) {
  let videoFile = useFile({collectionName: 'videoFiles', permaId: props.id});

  if (videoFile && videoFile.isReady) {
    const processedSources = processSources(videoFile);
    const css = calculatePadding(videoFile, props.position);

    return (
      <div style={{paddingTop: css.paddingTop}}>
        <div className={styles.inner}
             style={{left: css.leftRight, right: css.leftRight}}>
          <MediaPlayer className={classNames(styles.video_player, {[styles.backdrop]: !props.interactive})}
                       type={'video'}
                       sources={processedSources}
                       {...props}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

VideoPlayer.defaultProps = {
  interactive: false,
  controls: true
};

function calculatePadding(videoFile, position) {
  const videoAR = (videoFile.height / videoFile.width);
  let baseCss = {
    paddingTop: (videoAR * 100) + '%',
    leftRight: 0
  }

  if (position === 'full') {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const viewPortAR = (viewportHeight / viewportWidth);
    if (viewPortAR < videoAR) {
      const leftRight = (viewportWidth - (viewportHeight / videoAR)) / 2;
      baseCss.paddingTop = (viewPortAR * 100) + '%';
      baseCss.leftRight = leftRight + 'px'
    }
  }

  return baseCss;
}

function processSources(videoFile) {
  return [
    {
      type: 'video/mp4',
      src: `${videoFile.urls['high']}?u=1`
    }
  ];
}