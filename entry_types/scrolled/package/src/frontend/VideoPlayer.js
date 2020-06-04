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
 * @param {number} [props.posterId] - Perma id of the poster image file.
 * @param {String} [props.fit] - `"contain"` (default) or `"cover"`.
 * @param {String} [props.position] - Position of parent content element.
 */
export function VideoPlayer(props) {
  let videoFile = useFile({collectionName: 'videoFiles', permaId: props.id});
  const posterImage = useFile({collectionName: 'imageFiles', permaId: props.posterId});

  if (videoFile && videoFile.isReady) {
    const processedSources = processSources(videoFile);
    return (
      <Positioner file={videoFile} fit={props.fit} position={props.position}>
        <MediaPlayer className={classNames(styles.videoPlayer, styles[props.fit])}
                     type={'video'}
                     sources={processedSources}
                     posterImageUrl={posterImage && posterImage.isReady ? posterImage.urls.large : undefined}
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

function Positioner({children, fit, file, position}) {
  if (fit === 'contain') {
    return (
      <ViewportDependentPillarBoxes file={file} position={position}>
        {children}
      </ViewportDependentPillarBoxes>
    );
  }
  else {
    return children;
  }
}
