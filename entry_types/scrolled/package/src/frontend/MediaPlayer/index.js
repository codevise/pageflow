import React, {useEffect, useRef, useContext} from 'react';
import {media} from 'pageflow/frontend';

import ScrollToSectionContext from "../ScrollToSectionContext";

export function MediaPlayer(props){
  const playerWrapperRef = useRef(null);
  let scrollToSection = useContext(ScrollToSectionContext);

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
      
      return () => {
        media.releasePlayer(player);
        playerWrapper.innerHTML = '';
        player.dispose();
      }
    }
  }, [scrollToSection, props.sources, props.poster, props.type, props.playsInline,
  props.loop, props.controls, props.nextSectionOnEnd]);

  return (
    <div className={props.className} ref={playerWrapperRef}>
    </div>
  );
}