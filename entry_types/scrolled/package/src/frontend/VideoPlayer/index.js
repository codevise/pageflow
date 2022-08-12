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
import {VideoStructuredData} from './VideoStructuredData';

/**
 * Render video file in MediaPlayer.
 *
 * @param {Object} props
 * @param {Object} props.videoFile - Video file obtained via `useFile`.
 * @param {number} [props.posterId] - Perma id of the poster image file.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {boolean} [props.isPrepared] - Control lazy loading.
 * @param {String} [props.fit] - `"contain"` (default) or `"cover"`.
 * @param {String} [props.position] - Position of parent content element.
 */
export function VideoPlayer({videoFile, ...props}) {
  const [activeQuality] = useVideoQualitySetting();
  const posterImage = useFile({collectionName: 'imageFiles', permaId: props.posterId});
  const textTracks = useTextTracks({
    file: videoFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });

  function renderPlayer() {
    if (videoFile && videoFile.isReady) {
      return (
        <>
          <MediaPlayer className={classNames(styles.videoPlayer, styles[props.fit])}
                       type={'video'}
                       textTracks={textTracks}
                       filePermaId={videoFile.permaId}
                       sources={sources(videoFile, activeQuality)}
                       textTracksInset={true}
                       posterImageUrl={posterImage && posterImage.isReady ? posterImage.urls.large : undefined}
                       altText={videoFile.configuration.alt}
                       objectPosition={props.fit === 'cover' ? videoFile.cropPosition : undefined}
                       {...props} />
          <VideoStructuredData file={videoFile} />
        </>
      );
    }
    else {
      return null;
    }
  }

  return (
    <Positioner file={videoFile} fit={props.fit} position={props.position}>
      {renderPlayer()}
    </Positioner>
  );
}

VideoPlayer.defaultProps = {
  fit: 'contain',
  controls: true
};

const fallbackAspectRatio = 0.5625;

function Positioner({children, fit, file, position}) {
  if (fit === 'contain') {
    return (
      <ViewportDependentPillarBoxes file={file}
                                    aspectRatio={file ? undefined : fallbackAspectRatio}
                                    position={position}
                                    opaque>
        {children}
      </ViewportDependentPillarBoxes>
    );
  }
  else {
    return children;
  }
}
