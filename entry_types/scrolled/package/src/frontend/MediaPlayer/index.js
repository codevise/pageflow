import React, {useEffect, useRef, useContext} from 'react';
import {media} from 'pageflow/frontend';

import ScrollToSectionContext from "../ScrollToSectionContext";
import {useMediaSettings} from '../useMediaSettings';

export function MediaPlayer(props){
  const playerWrapperRef = useRef(null);
  let scrollToSection = useContext(ScrollToSectionContext);
  let mediaSettings = useMediaSettings();

  useEffect( () => {
    let playerWrapper = playerWrapperRef.current;
    
    if (props.sources) {
      let player = media.getPlayer(props.sources, {
        poster: props.poster,
        tagName: props.type,
        playsInline: props.playsInline,
        loop: props.loop,
        controls: props.controls
      });
      player.on('ended', function () {
        props.nextSectionOnEnd && scrollToSection('next');
      });
      let playerElement = player.el();      
      playerWrapper.appendChild(playerElement);
      
      if (!mediaSettings.mediaOff && props.autoplay !== false) {
        if (props.state === 'active') {
          if (player.readyState() > 0) {
            player.play();
          } else {
            player.on('loadedmetadata', player.play);
          }
        } else {
          player.pause();
        }
      }

      return () => {
        media.releasePlayer(player);
        playerWrapper.innerHTML = '';
        player.dispose();
      }
    }
  }, [scrollToSection, props.autoplay, props.state, props.sources, props.poster, props.type,
      props.loop, props.controls, props.nextSectionOnEnd, props.playsInline]);

  return (
    <div className={props.className} ref={playerWrapperRef}>
    </div>
  );
}