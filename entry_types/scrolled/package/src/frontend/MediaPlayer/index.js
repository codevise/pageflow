import React, {useEffect, useRef} from 'react';
import {media} from 'pageflow/frontend';

export function MediaPlayer(props){
  const playerWrapperRef = useRef(null);
  
  useEffect( () => {
    let playerWrapper = playerWrapperRef.current;
    if (props.sources) {
      let player = media.getPlayer(props.sources, {
        poster: props.poster,
        tagName: props.type
      });
      playerWrapper.appendChild(player.el());
      return () => {
        media.releasePlayer(player);
        playerWrapper.innerHTML = '';
        player.dispose();
      }
    }
  }, [props.sources, props.poster, props.type]);

  return (
    <div ref={playerWrapperRef}></div>
  );
}