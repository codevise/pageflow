import React from 'react';
import classNames from 'classnames';

import {useFile} from '../../entryState';
import {MediaPlayer} from '../MediaPlayer';
import {useTextTracks} from '../useTextTracks';
import {useMediaMuted} from '../useMediaMuted';
import {useVideoQualitySetting} from '../useVideoQualitySetting';
import {sources} from './sources'
import styles from '../VideoPlayer.module.css';
import {ViewportDependentPillarBoxes} from '../ViewportDependentPillarBoxes';

/**
 * Render video file in MediaPlayer.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the video file.
 * @param {number} [props.posterId] - Perma id of the poster image file.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {boolean} [props.isPrepared] - Control lazy loading.
 * @param {String} [props.fit] - `"contain"` (default) or `"cover"`.
 * @param {String} [props.position] - Position of parent content element.
 */
export function VideoPlayer(props) {
  const [activeQuality] = useVideoQualitySetting();
  const videoFile = useFile({collectionName: 'videoFiles', permaId: props.id});
  const posterImage = useFile({collectionName: 'imageFiles', permaId: props.posterId});
  const textTracks = useTextTracks({
    file: videoFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });

  if (videoFile && videoFile.isReady) {
    return (
      <Positioner file={videoFile} fit={props.fit} position={props.position}>
        <MediaPlayer className={classNames(styles.videoPlayer, styles[props.fit])}
                     type={'video'}
                     textTracks={textTracks}
                     filePermaId={props.id}
                     sources={sources(videoFile, activeQuality)}
                     textTracksInset={props.position === 'full'}
                     posterImageUrl={posterImage && posterImage.isReady ? posterImage.urls.large : undefined}
                     {...props} />
      </Positioner>
    );
  } else {
    return null;
  }
}

VideoPlayer.defaultProps = {
  fit: 'contain',
  controls: true
};

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
