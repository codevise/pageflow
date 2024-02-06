import React, {useEffect, useContext, useRef} from 'react';
import classNames from 'classnames';

import PlayerContainer from './PlayerContainer';
import ScrollToSectionContext from "../ScrollToSectionContext";
import {watchPlayer} from './watchPlayer';
import {applyPlayerState} from './applyPlayerState';
import {updatePlayerState} from './updatePlayerState';
import {updateObjectPosition} from './updateObjectPosition';

import {useEventContextData} from '../useEventContextData';
import {useIsStaticPreview} from '../useScrollPositionLifecycle';

import {getTextTrackSources, updateTextTracksMode} from './textTracks';
import textTrackStyles from './textTracks.module.css';
import styles from '../MediaPlayer.module.css';

export * from './usePlayerState';

export function MediaPlayer(props) {
  const isStaticPreview = useIsStaticPreview();
  const load = props.load === 'auto' && isStaticPreview ? 'poster' : props.load;

  return (
    <div className={classNames(styles.wrapper,
                               styles[props.fit],
                               {[textTrackStyles.inset]: props.textTracksInset})}>
      {load === 'auto' && <PreparedMediaPlayer {...props} />}
      {load !== 'none' && <Poster imageUrl={props.posterImageUrl}
                                        objectPosition={props.objectPosition}
                                        hide={props.type === 'video' &&
                                              load !== 'poster' &&
                                              props.playerState.dataLoaded &&
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
  let unwatchPlayer;

  let onSetup = (newPlayer)=>{
    playerRef.current = newPlayer;
    newPlayer.on('ended', () => props.nextSectionOnEnd && scrollToSection('next'));

    unwatchPlayer = watchPlayer(newPlayer, props.playerActions);
    applyPlayerState(newPlayer, props.playerState, props.playerActions)
    updateObjectPosition(newPlayer, props.objectPosition.x, props.objectPosition.y)
  }

  let onDispose = ()=>{
    unwatchPlayer();
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

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      updateObjectPosition(player, props.objectPosition.x, props.objectPosition.y);
    }
  }, [props.objectPosition.x, props.objectPosition.y]);

  return (
    <PlayerContainer type={props.type}
                     sources={appendSuffix(props.sources, props.sourceUrlSuffix)}
                     textTrackSources={getTextTrackSources(props.textTracks.files, props.textTracksDisabled)}
                     filePermaId={props.filePermaId}
                     loop={props.loop}
                     controls={props.controls}
                     playsInline={props.playsInline}
                     mediaEventsContextData={eventContextData}
                     atmoDuringPlayback={props.atmoDuringPlayback}
                     onSetup={onSetup}
                     onDispose={onDispose}
                     altText={props.altText} />
  );
};

PreparedMediaPlayer.defaultProps = {
  objectPosition: {},
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
