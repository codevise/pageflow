import React, {useRef, useEffect, useContext} from 'react';
import classNames from 'classnames';
import styles from "./Video.module.css";

import ScrollToSectionContext from "./ScrollToSectionContext";
import MutedContext from "./MutedContext";
import {useFile} from '../entryState';

/**
 * Render a video file.
 *
 * @param {Object} props
 * @param {number} props.id - Perma id of the video file.
 * @param {Boolean} props.autoplay - Flag indicating whether the video should start playing automatically.
 * @param {Boolean} props.interactive - Flag indicating whether the video can be interacted with
 *   or whether it is a background element.
 * @param {Boolean} props.controls - Flag indicating whether the video controls should be shown.
 */
export function Video(props) {
  const videoFile = useFile({collectionName: 'videoFiles', permaId: props.id});

  if (videoFile && videoFile.isReady) {
    return <VideoPlayer videoFile={videoFile} {...props} />;
  }

  return null;
}

function VideoPlayer(props) {
  const videoFile = props.videoFile;

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
          <video role="img"
                 src={videoFile.urls.high}
                 ref={playerRef}
                 className={classNames(styles.video, {[styles.backdrop]: !props.interactive})}
                 controls={props.controls}
                 playsInline
                 onEnded={() => props.nextSectionOnEnd && scrollToSection('next')}
                 loop={!props.interactive}
                 poster={videoFile.urls.poster_large}/>
        }
      </ScrollToSectionContext.Consumer>
    </div>
  )
}

Video.defaultProps = {
  interactive: false,
  controls: false
};
