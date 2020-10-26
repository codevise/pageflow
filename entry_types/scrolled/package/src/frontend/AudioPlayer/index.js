import React from 'react';
import classNames from 'classnames';

import {MediaPlayer} from '../MediaPlayer';
import {useTextTracks} from '../useTextTracks';
import {useMediaMuted} from '../useMediaMuted';
import {ViewportDependentPillarBoxes} from '../ViewportDependentPillarBoxes';
import {AudioStructuredData} from './AudioStructuredData';

import styles from '../AudioPlayer.module.css';

/**
 * Render audio file in MediaPlayer.
 *
 * @param {Object} props
 * @param {Object} props.audioFile - Audio file obtained via `useFile`.
 * @param {number} [props.posterImageFile] - Poster image file obtained via `useFile`.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {String} [props.position] - Position of parent content element.
 * @param {boolean} [props.isPrepared] - Control lazy loading.
 */
export function AudioPlayer({audioFile, posterImageFile, ...props}) {
  const textTracks = useTextTracks({
    file: audioFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });

  if (audioFile && audioFile.isReady) {
    return (
      <ViewportDependentPillarBoxes file={posterImageFile} position={props.position}>
        <div className={classNames(styles.spaceForTextTracks,
                                   {[styles.spaceForTextTracksActive]: !posterImageFile &&
                                     textTracks.files.length})}>
          <MediaPlayer className={styles.audioPlayer}
                       type={'audio'}
                       textTracks={textTracks}
                       filePermaId={audioFile.permaId}
                       sources={processSources(audioFile)}
                       textTracksInset={!!posterImageFile}
                       posterImageUrl={posterImageFile && posterImageFile.isReady ?
                                       posterImageFile.urls.large : undefined}
                       altText={audioFile.configuration.alt}
                       {...props} />
          <AudioStructuredData file={audioFile} />
        </div>
      </ViewportDependentPillarBoxes>
    );
  }

  return null;
}

AudioPlayer.defaultProps = {
  controls: true
};

export function processSources(audioFile){
  var sources = [];
  if (audioFile.urls['ogg']) {
    sources.push({type: 'audio/ogg', src: `${audioFile.urls['ogg']}?u=1`});
  }
  if (audioFile.urls['mp3']) {
    sources.push({type: 'audio/mp3', src: `${audioFile.urls['mp3']}?u=1`});
  }
  if (audioFile.urls['m4a']) {
    sources.push({type: 'audio/m4a', src: `${audioFile.urls['m4a']}?u=1`});
  }
  return sources;
}
