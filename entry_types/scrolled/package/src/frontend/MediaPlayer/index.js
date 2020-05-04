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
        tagName: props.type
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
  }, [props.sources, props.poster, props.type, props.nextSectionOnEnd, scrollToSection]);

  return (
    <div className={props.className} ref={playerWrapperRef}>
    </div>
  );
}