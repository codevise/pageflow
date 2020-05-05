import React, {useRef, useEffect, useContext} from 'react';
import classNames from 'classnames';
import styles from "./Audio.module.css";

import ScrollToSectionContext from "./ScrollToSectionContext";
import MutedContext from "./MutedContext";
import {useFile} from '../entryState';

/**
 * Render an audio file.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the video file.
 * @param {Boolean} props.autoplay - Flag indicating whether the video should start playing automatically.
 * @param {Boolean} props.controls - Flag indicating whether the video controls should be shown.
 */
export function Audio(props) {
  const audioFile = useFile({collectionName: 'audioFiles', permaId: props.id});

  if (audioFile && audioFile.isReady) {
    return <AudioPlayer audioFile={audioFile} {...props} />;
  }

  return null;
}

function AudioPlayer(props) {
  const audioFile = props.audioFile;

  const playerRef = useRef();
  const state = props.state;

  const mutedSettings = useContext(MutedContext);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    player.muted = mutedSettings.muted

    if (!mutedSettings.mediaOff && props.autoplay !== false) {
      if (state === 'active') {
        if (player.readyState > 0) {
          player.play();
        } else {
          player.addEventListener('loadedmetadata', play);
          return () => player.removeEventListener('loadedmetadata', play);
        }
      } else {
        player.pause();
      }
    }

    function play() {
      player.play();
    }
  }, [state, mutedSettings.mediaOff, mutedSettings.muted, props.autoplay]);

  return (
    <div className={styles.root}>
      <ScrollToSectionContext.Consumer>
        {scrollToSection =>
          <audio role="audio"
                 src={audioFile.urls.mp3}
                 ref={playerRef}
                 controls={props.controls}
                 playsInline
                 onEnded={() => props.nextSectionOnEnd && scrollToSection('next')}
                 loop={!props.interactive}/>
        }
      </ScrollToSectionContext.Consumer>
    </div>
  )
}

Audio.defaultProps = {
  interactive: false,
  controls: true
};
