import React from 'react';
import {useFile} from '../entryState';
import {MediaPlayer} from './MediaPlayer';

import styles from "./AudioPlayer.module.css";

/**
 * Render audio file in MediaPlayer.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the audio file.
 */
export function AudioPlayer(props) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: props.id});
  
  if (audioFile && audioFile.isReady) {
    const processedSources = processSources(audioFile);
    return (
      <div className={styles.root}>
        <MediaPlayer className={styles.audio_player}
                     type={'audio'}
                     sources={processedSources}
                     {...props}
                     />
      </div>
    );
  }

  return null;
}

AudioPlayer.defaultProps = {
  interactive: false,
  controls: true
};

function processSources(audioFile){
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