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
  return (
    <div className={classNames(styles.wrapper, styles[props.fit], {[textTrackStyles.inset]: props.textTracksInset})}>
      {props.load === 'auto' && <PreparedMediaPlayer {...props} />}
      {props.load !== 'none' && <Poster imageUrl={props.posterImageUrl}
                                        objectPosition={props.objectPosition}
                                        hide={props.type === 'video' &&
                                              props.load !== 'poster' &&
                                              !props.playerState.unplayed} />}
    </div>
  );
}

MediaPlayer.defaultProps = {
  load: 'auto'
};

function Poster({imageUrl, objectPosition, hide}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <img src={imageUrl}
         alt=""
         style={{
           display: hide ? 'none' : undefined,
           objectPosition: objectPosition && `${objectPosition.x}% ${objectPosition.y}%`
         }} />
  );
}

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
    <PlayerContainer type={props.type}
                     sources={appendSuffix(props.sources, props.sourceUrlSuffix)}
                     textTrackSources={getTextTrackSources(props.textTracks.files, props.textTracksDisabled)}
                     filePermaId={props.filePermaId}
                     loop={props.loop}
                     controls={props.controls}
                     playsInline={props.playsInline}
                     objectPosition={props.objectPosition}
                     mediaEventsContextData={eventContextData}
                     atmoDuringPlayback={props.atmoDuringPlayback}
                     onSetup={onSetup}
                     onDispose={onDispose}
                     altText={props.altText} />
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
