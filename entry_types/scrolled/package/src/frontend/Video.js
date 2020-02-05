import React, {useRef, useEffect, useContext} from 'react';
import classNames from 'classnames';

import ScrollToSectionContext from './ScrollToSectionContext';
import MutedContext from './MutedContext';

import styles from './Video.module.css';

export default function Video(props) {
  const awsBucket = '//s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/presentation-videos/';

  const videoBoatSunset  = awsBucket+'floodplain-clean.mp4';
  const poster_videoBoatSunset  = awsBucket+'posterframes/poster_katerchen.jpeg';
  const videoBoatDark  = awsBucket+'floodplain-dirty.mp4';
  const poster_videoBoatDark  = awsBucket+'posterframes/poster_katerchen.jpeg';
  const videoKaterchen  = awsBucket+'katerchen.mp4';
  const poster_videoKaterchen  = awsBucket+'posterframes/poster_katerchen.jpeg';
  const videoGarzweilerLoop1  = awsBucket+'braunkohle_loop1.mp4';
  const poster_videoGarzweilerLoop1  = awsBucket+'posterframes/poster_braunkohle_loop1.jpeg';
  const videoGarzweilerLoop2  = awsBucket+'braunkohle_loop2.mp4';
  const poster_videoGarzweilerLoop2  = awsBucket+'posterframes/poster_braunkohle_loop2.jpeg';
  const videoGarzweilerDrohne  = awsBucket+'braunkohle_drone.mp4';
  const poster_videoGarzweilerDrohne  = awsBucket+'posterframes/poster_braunkohle_drone.jpeg';
  const videoInselInterviewToni  = awsBucket+'pageflow_insel_interview_toni02.mp4';
  const poster_videoInselInterviewToni  = awsBucket+'posterframes/poster_pageflow_insel_interview_toni02.jpg';

  const videoUrl = {
    videoBoatSunset,
    videoBoatDark,
    videoKaterchen,
    videoGarzweilerLoop1,
    videoGarzweilerLoop2,
    videoGarzweilerDrohne,
    videoInselInterviewToni
  }[props.id];

  const posterUrl = {
    poster_videoBoatSunset,
    poster_videoBoatDark,
    poster_videoKaterchen,
    poster_videoGarzweilerLoop1,
    poster_videoGarzweilerLoop2,
    poster_videoGarzweilerDrohne,
    poster_videoInselInterviewToni
  }['poster_'+props.id];

  const videoRef = useRef();
  const state = props.state;

  const mutedSettings = useContext(MutedContext);
  const {mediaOff} = mutedSettings;

  useEffect(() => {
    const video = videoRef.current;
    if (video && !mediaOff) {
      if (state === 'active') {
        if (video.readyState > 0) {
          video.play();
        }
        else {
          video.addEventListener('loadedmetadata', play);
          return () => video.removeEventListener('loadedmetadata', play);
        }
      }
      else {
        video.pause();
      }
    }

    function play() {
      video.play();
    }
  }, [state, videoRef, mediaOff]);

  return (
    <div className={styles.root}>
      <ScrollToSectionContext.Consumer>
        {scrollToSection =>
          <video src={videoUrl}
                 ref={videoRef}
                 className={classNames(styles.video, {[styles.backdrop]: !props.interactive})}
                 controls={props.controls}
                 playsInline
                 onEnded={() => props.nextSectionOnEnd && scrollToSection('next')}
                 loop={!props.interactive}
                 muted={mutedSettings.muted}
                 poster={posterUrl} />
        }
      </ScrollToSectionContext.Consumer>
    </div>
  )
}

Video.defaultProps = {
  interactive: false,
  controls: false
};
