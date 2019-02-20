import MediaTag from './MediaTag';
import createPageflowPlayer from './createPageflowPlayer';
import watchPlayer from './watchPlayer';
import {updateTextTrackSettings} from 'media/actions';

import {
  initPlayer as initPlayerFromPlayerState,
  updatePlayer as updatePlayerFromPlayerState
} from './handlePlayerState';

import {
  initTextTracks,
  updateTextTracks,
  textTracksFromFiles
} from './textTracks';

import {textTracks} from 'media/selectors';
import {setting} from 'settings/selectors';
import {prop} from 'selectors';
import {has} from 'utils/selectors';
import {widgetPresent} from 'widgetPresence/selectors';

import React from 'react';
import {combineSelectors} from 'utils';
import {connect} from 'react-redux';

export default function({
  tagName,
  sources,
  poster = () => {},
  emulateTextTracksDisplay = false,
  createPlayer = createPageflowPlayer
}) {
  class FilePlayer extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.displaysTextTracksInNativePlayer =
        this.props.hasNativeVideoPlayer && tagName == 'video';

      this.initiallyMuted = this.props.muted;

      this.updateAtmoSettings();

      this.setupMediaTag = element => {
        this.player = createPlayer(element, {
          emulateTextTracksDisplay,
          atmoSettings: this.atmoSettings,
          mediaContext: this.context.mediaContext,
          playsInline: props.playsInline
        });

        this.player.ready(() => {
          this.props.playerActions.saveMediaElementId(element.id);

          initPlayerFromPlayerState(this.player,
                                    () => this.props.playerState,
                                    this.props.playerActions,
                                    this.prevFileId,
                                    this.props.file.id);

          if (!this.displaysTextTracksInNativePlayer) {
            initTextTracks(this.player,
                           () => this.props.textTracks.activeFileId,
                           () => this.props.textTrackPosition);
          }

          watchPlayer(this.player, this.props.playerActions);

          this.prevFileId = this.props.file.id;
        }, true);
      };

      this.disposeMediaTag = () => {
        this.player.dispose();
        this.player = null;

        this.props.playerActions.discardMediaElementId();
      };
    }

    componentDidUpdate(prevProps) {
      if (!this.player) {
        return;
      }

      this.player.ready(() =>  {
        updatePlayerMuted(this.player,
                          prevProps.muted,
                          this.props.muted);

        updatePlayerVolumeFactor(this.player,
                                 prevProps.playerState.volumeFactor,
                                 this.props.playerState.volumeFactor,
                                 this.props.playerState.volumeFactorFadeDuration);

        updatePlayerFromPlayerState(this.player,
                                    prevProps.playerState,
                                    this.props.playerState,
                                    this.props.playerActions);
      }, true);

      if (!this.displaysTextTracksInNativePlayer) {
        updateTextTracks(this.player,
                         prevProps.textTracks.activeFileId,
                         this.props.textTracks.activeFileId,
                         this.props.textTrackPosition);
      }

      this.updateAtmoSettings();
    }

    updateAtmoSettings() {
      this.atmoSettings = this.atmoSettings || {};
      this.atmoSettings['atmo_during_playback'] = this.props.atmoDuringPlayback;
    }

    render() {
      return (
        <MediaTag tagName={tagName}

                  sources={sources(this.props.file,
                                   this.props.quality,
                                   {hasHighBandwidth: this.props.hasHighBandwidth})}
                  tracks={textTracksFromFiles(this.props.textTracks.files,
                                              this.props.textTracksEnabled)}
                  poster={poster(this.props.file, this.props.posterImageFile)}
                  loop={this.props.loop}
                  muted={this.initiallyMuted}
                  playsInline={this.props.playsInline}
                  alt={this.props.file.alt}

                  onSetup={this.setupMediaTag}
                  onDispose={this.disposeMediaTag} />
      );
    }
  }

  FilePlayer.contextTypes = {
    mediaContext: React.PropTypes.object
  };

  FilePlayer.defaultProps = {
    textTracksEnabled: true,
    textTracks: {
      files: []
    }
  };

  FilePlayer.propTypes = {
    file: React.PropTypes.object.isRequired
  };

  const result = connect(
    combineSelectors({
      textTracks: textTracks({
        file: prop('file'),
        defaultTextTrackFileId: prop('defaultTextTrackFileId')
      }),
      quality: setting({property: 'videoQuality'}),
      hasNativeVideoPlayer: has('native video player'),
      hasHighBandwidth: has('high bandwidth'),
      textTrackPosition
    }),
    {
      updateTextTrackSettings
    }
  )(FilePlayer);

  result.WrappedComponent = FilePlayer;

  return result;
}

const slimPlayerControlsPresent = widgetPresent('slimPlayerControls');

function textTrackPosition(state, {playerState, textTrackPosition}) {
  if (textTrackPosition) {
    return textTrackPosition;
  }

  if (slimPlayerControlsPresent(state)) {
    // see pageflow.VideoPlayer#updateCueLineSettings for explanation of values.
    if (playerState.controlsHidden) {
      return 'auto.lazy';
    }
    else {
      return 'auto.translated';
    }
  }
  else {
    return playerState.controlsHidden ? 'auto.lazy' : 'top';
  }
}

function updatePlayerMuted(player, prevMuted, muted) {
  if (prevMuted !== muted) {
    player.muted(muted);
  }
}

function updatePlayerVolumeFactor(player, prevVolumeFactor, volumeFactor, fadeDuration) {
  if (prevVolumeFactor !== volumeFactor) {
    player.changeVolumeFactor(volumeFactor, fadeDuration);
  }
}
