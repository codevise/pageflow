import React from 'react';

import {MediaPlayer} from '../MediaPlayer';
import {useTextTracks} from '../useTextTracks';
import {useMediaMuted} from '../useMediaMuted';
import {useVideoQualitySetting} from '../useVideoQualitySetting';
import {sources} from './sources'
import {ViewportDependentPillarBoxes} from '../ViewportDependentPillarBoxes';
import {VideoStructuredData} from './VideoStructuredData';

/**
 * Render video file in MediaPlayer.
 *
 * @param {Object} props
 * @param {Object} props.videoFile - Video file obtained via `useFile`.
 * @param {number} [props.posterImageFile] - Poster image file obtained via `useFile`.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {string} [props.load] - Control lazy loading. `"auto"` (default), `"poster"` or `"none"`.
 * @param {String} [props.fit] - `"contain"` (default) or `"cover"`.
 * @param {String} [props.position] - Position of parent content element.
 */
export function VideoPlayer({videoFile, posterImageFile, ...props}) {
  const [activeQuality] = useVideoQualitySetting();
  const textTracks = useTextTracks({
    file: videoFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });

  function renderPlayer() {
    if (videoFile && videoFile.isReady) {
      return (
        <>
          <MediaPlayer type={'video'}
                       fit={props.fit}
                       textTracks={textTracks}
                       filePermaId={videoFile.permaId}
                       sources={sources(videoFile, activeQuality)}
                       textTracksInset={true}
                       posterImageUrl={posterImageFile && posterImageFile.isReady ?
                                       posterImageFile.urls.large : videoFile.urls.posterLarge}
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
