import React, {useEffect, useContext, useRef} from 'react';
import classNames from 'classnames';

import PlayerContainer from './PlayerContainer';
import ScrollToSectionContext from "../ScrollToSectionContext";
import watchPlayer, {unwatchPlayer} from './watchPlayer';
import {applyPlayerState} from './applyPlayerState';
import {updatePlayerState} from './updatePlayerState';

import {useEventContextData} from '../useEventContextData';

import {getTextTrackSources, updateTextTracksMode} from './textTracks';
import textTrackStyles from './textTracks.module.css';
import styles from '../MediaPlayer.module.css';

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
  let eventContextData = useEventContextData();

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
    <>
      <PlayerContainer className={classNames(props.className, {[textTrackStyles.inset]: props.textTracksInset})}
                       type={props.type}
                       sources={appendSuffix(props.sources, props.sourceUrlSuffix)}
                       textTrackSources={getTextTrackSources(props.textTracks.files, props.textTracksDisabled)}
                       filePermaId={props.filePermaId}
                       poster={props.posterImageUrl}
                       loop={props.loop}
                       controls={props.controls}
                       playsInline={props.playsInline}
                       mediaEventsContextData={eventContextData}
                       atmoDuringPlayback={props.atmoDuringPlayback}
                       onSetup={onSetup}
                       onDispose={onDispose} />
      <div className={styles.mask} onClick={props.onClick} />
    </>
  );
};

PreparedMediaPlayer.defaultProps = {
  textTracks: {
    files: []
  }
}

function appendSuffix(sources, suffix) {
  if (!suffix) {
    return sources;
  }

  return sources.map(source => ({
    ...source,
    src: `${source.src}${suffix}`
  }));
}
