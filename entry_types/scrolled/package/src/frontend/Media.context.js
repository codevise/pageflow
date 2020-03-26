import React, { useState, useEffect} from 'react';
import createPageflowPlayer from "./mediaPlayer/createPageflowPlayer";
import {playerActions} from './mediaPlayer/actions';
import watchPlayer from './mediaPlayer/watchPlayer';

export const MediaContext = React.createContext();

export function MediaProvider(props) {
  const [muted, setAudioMuted] = useState(true);
  const [mediaOff, setMediaOff] = useState(true);
  const [audioContext, setAudioContext] = useState(undefined);
  const [players] = useState([]);

  const setPlayersMuted = function (player) {
    player.muted(muted);
    player.playerState.muted = muted;
  }

  const defaultPlayerState = function (playerComponent) {
    return {
      isPlaying: false,
      firstPlay: false,
      muted: muted,
      isLoading: true,
      canPlay: false,
      playFailed: false,
      bufferUnderrun: undefined,
      scrubbingAt: undefined,
      currentTime: 0,
      mediaElementId: undefined,
      shouldSeekTo: undefined,
      userHoveringControls: false,
      focusInsideControls: false,
      controlsHidden: false,
      actions: playerActions(playerComponent)
    };
  }
  const media = {
    muted: muted,
    setMuted: function (muted) {
      setAudioMuted(muted);
      players.forEach(setPlayersMuted);
    },
    mediaOff: mediaOff,
    setMediaOff: setMediaOff,
    createAudioContext: function () {
      setAudioContext(pageflow.audioContext.get());
    },
    defaultPlayerState: function(playerComponent){
      return defaultPlayerState(playerComponent);
    },
    createPageflowPlayer: function (playerComponent, element, options) {
      options.mediaContext = audioContext;
      var player = createPageflowPlayer(element, options);
      player.playerState = defaultPlayerState(playerComponent);
      player.playerState.mediaElementId = element.id;
      watchPlayer(player);
      players.push(player);
      return player;
    },
    updatePlayerState: function(player) {
      player.playerState.actions.updatePlayer();
    },
    removePlayer: function (player) {
      var index = players.indexOf(player);
      if (index !== -1) {
        players.splice(index, 1);
      }
      player.dispose();
    }
  };

  return (
    <MediaContext.Provider 
      value={media}
    >
      {props.children}    
    </MediaContext.Provider>
  )
}
