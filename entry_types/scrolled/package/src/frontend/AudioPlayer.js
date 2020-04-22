import React, {useMemo} from 'react';
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
  let oggUrl = undefined;
  let m4aUrl = undefined;
  let mp3Url = undefined;
  if (audioFile && audioFile.isReady) {
    oggUrl = audioFile.urls['ogg'];
    m4aUrl = audioFile.urls['m4a'];
    mp3Url = audioFile.urls['mp3'];
  }
  const processedSources = useMemo(()=>processSources(oggUrl, m4aUrl, mp3Url), [oggUrl, m4aUrl, mp3Url]);

  if (processedSources) {
    return (
      <div className={styles.root}>
        <MediaPlayer className={styles.audio_player}
                     type={'audio'}
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

  return null;
}

AudioPlayer.defaultProps = {
  interactive: false,
  controls: true
};

function processSources(ogg, m4a, mp3){
  if (ogg===undefined && m4a===undefined && mp3===undefined) {
    return undefined;
  }
  var sources = [];
  if (ogg) {
    sources.push({type: 'audio/ogg', src: `${ogg}?u=1`});
  }
  if (mp3) {
    sources.push({type: 'audio/mp3', src: `${mp3}?u=1`});
  }
  if (m4a) {
    sources.push({type: 'audio/mp4', src: `${m4a}?u=1`});
  }
  return sources;
}