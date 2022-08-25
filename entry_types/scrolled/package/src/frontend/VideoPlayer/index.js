import React from 'react';

import {MediaPlayer} from '../MediaPlayer';
import {useTextTracks} from '../useTextTracks';
import {useMediaMuted} from '../useMediaMuted';
import {useVideoQualitySetting} from '../useVideoQualitySetting';
import {sources} from './sources'
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
 */
export function VideoPlayer({videoFile, posterImageFile, ...props}) {
  const [activeQuality] = useVideoQualitySetting();
  const textTracks = useTextTracks({
    file: videoFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });

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
                     {...props} />
        <VideoStructuredData file={videoFile} />
      </>
    );
  }

  return null;
}

VideoPlayer.defaultProps = {
  fit: 'contain',
  controls: true
};
