import React, {useMemo} from 'react';
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
  let fileUrl = undefined;
  if (videoFile && videoFile.isReady) {
    fileUrl = videoFile.urls['high'];
  }
  const processedSources = useMemo(()=>processSources(fileUrl), [fileUrl]);
  
  if (processedSources) {
    return (
      <div className={styles.root}>
        <MediaPlayer className={classNames(styles.video_player, {[styles.backdrop]: !props.interactive})}
                     type={'video'}
                     playsInline={true}
                     autoplay={props.autoplay}
                     loop={!props.interactive}
                     controls={props.controls}
                     interactive={props.interactive}
                     sources={processedSources}
                     />
      </div>
    );
  }
  else{
    return null;
  }
}

VideoPlayer.defaultProps = {
  interactive: false,
  controls: true
};


function processSources(fileUrl) {
  if (!fileUrl) {
    return undefined;
  };
  return [
    {
      type: 'video/mp4',
      src: `${fileUrl}?u=1`
    }
  ];
}