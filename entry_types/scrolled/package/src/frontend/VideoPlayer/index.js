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
 * @param {String} [props.adaptiveMinQuality] - Pass "high" or "fullhd" to use HLS/Dash playlists
 *   with at least given quality.
 */
export function VideoPlayer({videoFile, posterImageFile, adaptiveMinQuality, ...props}) {
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
                     sources={sources(videoFile, {quality: activeQuality, adaptiveMinQuality})}
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

  return null;
}

VideoPlayer.defaultProps = {
  fit: 'contain',
  controls: true
};
