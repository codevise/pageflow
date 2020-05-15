import React, {useEffect, useContext, useRef} from 'react';
import PlayerContainer from './PlayerContainer';
import ScrollToSectionContext from "../ScrollToSectionContext";
import {useMediaSettings} from '../useMediaSettings';

export function MediaPlayer(props){
  let playerRef = useRef();
  let scrollToSection = useContext(ScrollToSectionContext);
  let mediaSettings = useMediaSettings();

  let onSetup = (newPlayer)=>{
    playerRef.current = newPlayer;
    newPlayer.on('ended', () => props.nextSectionOnEnd && scrollToSection('next'));
  }
  let onDispose = ()=>{
    playerRef.current = undefined;
  }

  useEffect( () => {
    let player = playerRef.current
    if (player && !mediaSettings.mediaOff && props.autoplay === true) {
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
  }, [mediaSettings.mediaOff, props.autoplay, props.state, playerRef]);

  return (
    <PlayerContainer  className={props.className}
                      type={props.type}
                      sources={props.sources}
                      poster={props.poster}
                      loop={props.loop}
                      controls={props.controls}
                      playsInline={props.playsInline}
                      onSetup={onSetup}
                      onDispose={onDispose} />
  );
};