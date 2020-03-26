
export function playerActions(playerComponent) {

  const isReady = function () {
    return playerComponent.player !== undefined;
  }

  var actions = {
    
    updatePlayer: function () {
      if (isReady()) {
        var state = playerComponent.player.playerState;
        if (state.shouldSeekTo !== undefined) {
          playerComponent.player.currentTime(state.shouldSeekTo);
          state.shouldSeekTo = undefined;
        }
      }
    },
    updateTextTrackSettings: function (value) {
      var textTrack = undefined;
      if (value !== 'off') {
        textTrack = playerComponent.props.textTracks.files.find(textTrackFile => {
          return textTrackFile.id == value;
        });
        playerComponent.props.textTracks.mode = 'user';
        playerComponent.props.textTracks.activeFileId = textTrack.id;
      }
      else{
        playerComponent.props.textTracks.mode = 'off';
      }
    },
    controlsEntered: function () {
      if (isReady()) {
        playerComponent.player.playerState.userHoveringControls = true;
        playerComponent.updateState();
      }
    },
    controlsLeft: function () {
      if (isReady()) {
        playerComponent.player.playerState.userHoveringControls = false;
        playerComponent.updateState();
      }
    },
    focusEnteredControls: function () {
      if (isReady()) {
        playerComponent.player.playerState.focusInsideControls = true;
        playerComponent.updateState();
      }
    },
    focusLeftControls: function () {
      if (isReady()) {
        playerComponent.player.playerState.focusInsideControls = false;
        playerComponent.updateState();
      }
    },
    controlsHidden: function () {
      if (isReady()) {
        playerComponent.player.playerState.controlsHidden = true;
        playerComponent.updateState();
      }
    },
    canPlay: function () {
      if (isReady()) {
        playerComponent.player.playerState.canPlay = true;
        playerComponent.updateState();
      }
    },
    togglePlaying: function (event) {
      if (isReady()) {
        if (playerComponent.player.playerState.isPlaying) {
          playerComponent.player.pause(); 
        }
        else{
          if (playerComponent.player.playerState.canPlay) {
            playerComponent.player.play();
          }
        }
        playerComponent.updateState();
      }
    },
    playing: function () {
      if (isReady()) {
        var state = playerComponent.player.playerState;
        state.isLoading = false;
        state.firstPlay = true;
        state.isPlaying = true;
        state.playFailed = false;
        playerComponent.updateState();
      }
    },
    scrubTo: function (time) {
      if (isReady()) {
        playerComponent.player.playerState.scrubbingAt = time;
        playerComponent.updateState();
      }
    },
    seekTo: function (time) {
      if (isReady()) {
        playerComponent.player.playerState.shouldSeekTo = time;
        playerComponent.updateState();
      }
    },
    metaDataLoaded: function ({currentTime, duration}) {
      if (isReady()) {
        var state = playerComponent.player.playerState;
        state.currentTime = currentTime;
        state.duration = duration;
        playerComponent.updateState();
      }
    },
    progress: function ({bufferedEnd}) {
      if (isReady()) {
        playerComponent.player.playerState.bufferedEnd = bufferedEnd;
        playerComponent.updateState();
      }
    },
    playFailed: function (event) {
      if (isReady()) {
        console.log("play failed", event);
        var state = playerComponent.player.playerState;
        state.isLoading = true;
        state.isPlaying = false;
        state.playFailed = true;
        playerComponent.updateState();
      }
    },
    playingMuted: function () {
      if (isReady()) {
        playerComponent.player.playerState.muted = true;
        playerComponent.updateState();
      }
    },
    paused: function () {
      if (isReady()) {
        playerComponent.player.playerState.isPlaying = false;
        playerComponent.updateState();
      }
    },
    waiting: function () {
      if (isReady()) {
        playerComponent.player.playerState.isLoading = true;
        playerComponent.updateState();
      }
    },
    seeking: function () {
      if (isReady()) {
        playerComponent.player.playerState.isLoading = true;
        playerComponent.updateState();
      }
    },
    seeked: function () {
      if (isReady()) {
        var state = playerComponent.player.playerState;
        state.isLoading = false;
        state.scrubbingAt = undefined;
        playerComponent.updateState();
      }
    },
    bufferUnderrun: function () {
      if (isReady()) {
        playerComponent.player.playerState.bufferUnderrun = true;
        playerComponent.updateState();
      }
    },
    bufferUnderrunContinue: function () {
      if (isReady()) {
        playerComponent.player.playerState.bufferUnderrun = true;
        playerComponent.updateState();
      }
    },
    timeUpdate: function ({currentTime, duration}) {
      if (isReady()) {
        var state = playerComponent.player.playerState;
        state.currentTime = currentTime;
        state.duration = duration;
        playerComponent.updateState();
      }
    },
    ended: function () {
      if (isReady()) {
        playerComponent.player.playerState.isPlaying = false;
        playerComponent.updateState();
      }
    }
  };
  
  return actions
}