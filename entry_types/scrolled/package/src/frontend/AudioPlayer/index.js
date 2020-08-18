import React from 'react';
import classNames from 'classnames';

import {useFile} from '../../entryState';
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
 * @param {number} props.id - Perma id of the audio file.
 * @param {number} [props.posterId] - Perma id of the poster image file.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {String} [props.position] - Position of parent content element.
 * @param {boolean} [props.isPrepared] - Control lazy loading.
 */
export function AudioPlayer(props) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: props.id});
  const posterImage = useFile({collectionName: 'imageFiles', permaId: props.posterId});
  const textTracks = useTextTracks({
    file: audioFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });

  if (audioFile && audioFile.isReady) {
    return (
      <ViewportDependentPillarBoxes file={posterImage} position={props.position}>
        <div className={classNames(styles.spaceForTextTracks,
                                   {[styles.spaceForTextTracksActive]: !posterImage &&
                                     textTracks.files.length})}>
          <MediaPlayer className={styles.audioPlayer}
                       type={'audio'}
                       textTracks={textTracks}
                       filePermaId={props.id}
                       sources={processSources(audioFile)}
                       textTracksInset={props.position === 'full'}
                       posterImageUrl={posterImage && posterImage.isReady ? posterImage.urls.large : undefined}
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
