import React from 'react';
import {useFile} from '../entryState';
import {MediaPlayer} from './MediaPlayer';

import classNames from 'classnames';
import styles from "./VideoPlayer.module.css";
import {ViewportDependentPillarBoxes} from "./ViewportDependentPillarBoxes";

/**
 * Render video file in MediaPlayer.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the video file.
 * @param {String} [props.fit] - `"contain"` (default) or `"cover"`.
 */
export function VideoPlayer(props) {
  let videoFile = useFile({collectionName: 'videoFiles', permaId: props.id});

  if (videoFile && videoFile.isReady) {
    const processedSources = processSources(videoFile);
    return (
      <Positioner file={videoFile} fit={props.fit}>
        <MediaPlayer className={classNames(styles.videoPlayer, styles[props.fit])}
                     type={'video'}
                     sources={processedSources}
                     {...props}/>
      </Positioner>
    );
  } else {
    return null;
  }
}

VideoPlayer.defaultProps = {
  fit: 'contain',
  interactive: false,
  controls: true
};

function processSources(videoFile) {
  return [
    {
      type: 'video/mp4',
      src: `${videoFile.urls['high']}?u=1`
    }
  ];
}

function Positioner({children, fit, file}) {
  if (fit === 'contain') {
    return (
      <ViewportDependentPillarBoxes file={file}>
        {children}
      </ViewportDependentPillarBoxes>
    );
  }
  else {
    return children;
  }
}
