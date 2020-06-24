import React, {useEffect, useContext, useRef} from 'react';
import classNames from 'classnames';

import PlayerContainer from './PlayerContainer';
import ScrollToSectionContext from "../ScrollToSectionContext";
import watchPlayer, {unwatchPlayer} from './watchPlayer';
import {applyPlayerState} from './applyPlayerState';
import {updatePlayerState} from './updatePlayerState';

import {getTextTrackSources, updateTextTracksMode} from './textTracks';
import textTrackStyles from './textTracks.module.css';

export * from './usePlayerState';

export function MediaPlayer(props) {
  if (!props.isPrepared) {
    return null;
  }

  return (
    <PreparedMediaPlayer {...props} />
  );
}

MediaPlayer.defaultProps = {
  isPrepared: true
};

function PreparedMediaPlayer(props){
  let playerRef = useRef();
  let previousPlayerState = useRef(props.playerState);
  let scrollToSection = useContext(ScrollToSectionContext);

  let onSetup = (newPlayer)=>{
    playerRef.current = newPlayer;
    newPlayer.on('ended', () => props.nextSectionOnEnd && scrollToSection('next'));

    watchPlayer(newPlayer, props.playerActions);
    applyPlayerState(newPlayer, props.playerState, props.playerActions)
  }

  let onDispose = ()=>{
    unwatchPlayer(playerRef.current, props.playerActions);
    playerRef.current = undefined;
  }

  useEffect(() => {
    let player = playerRef.current
    if (player) {
      updatePlayerState(player, previousPlayerState.current, props.playerState, props.playerActions);
    }
    previousPlayerState.current = props.playerState;
  }, [props.playerState, props.playerActions]);

  useEffect(() => {
    let player = playerRef.current
    if (player) {
      updateTextTracksMode(player, props.textTracks.activeFileId);
    }
  }, [props.textTracks.activeFileId]);

  return (
    <PlayerContainer className={classNames(props.className, {[textTrackStyles.inset]: props.textTracksInset})}
                     type={props.type}
                     sources={props.sources}
                     textTrackSources={getTextTrackSources(props.textTracks.files)}
                     filePermaId={props.filePermaId}
                     poster={props.posterImageUrl}
                     loop={props.loop}
                     controls={props.controls}
                     playsInline={props.playsInline}
                     onSetup={onSetup}
                     onDispose={onDispose} />
  );
};

PreparedMediaPlayer.defaultProps = {
  textTracks: {
    files: []
  }
}
