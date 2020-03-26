import React from 'react';
import MediaTag from './MediaTag';
import {
  initTextTracks,
  updateTextTracks,
  textTracksFromFiles
} from './textTracks';

import {MediaPlayerControls} from './mediaPlayerControls';

export default class MediaPlayer extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.player = undefined;
    
    this.displaysTextTracksInNativePlayer = this.props.hasNativeVideoPlayer && tagName == 'video';
    this.initiallyMuted = this.props.mediaSettings.muted;
    this.props.textTracks.files = this.props.textFiles
    this.props.textTracks.mode = 'auto';
    this.updateAtmoSettings();

    this.setupMediaTag = element => {
      this.player = props.mediaSettings.createPageflowPlayer(this, element, {
        emulateTextTracksDisplay: props.emulateTextTracksDisplay,
        atmoSettings: this.atmoSettings,
        playsInline: props.playsInline
      }); 
      this.updateState();
      this.player.ready(() => {
        if (!this.displaysTextTracksInNativePlayer) {
          initTextTracks(this.player,
                          () => this.props.textTracks.activeFileId,
                          () => this.textTrackPosition());
        }
        this.prevFileId = this.props.file.id;
      }, true);
    };
  
    this.disposeMediaTag = () => {
      if (this.player) {
        this.props.mediaSettings.removePlayer(this.player);
        this.player = undefined;
      }
    };
  } //constructor
  updateState(){
    this.setState(this.player.playerState);
  }
  componentDidUpdate(prevProps){
    if (!this.player) {
      return;
    }
    this.props.mediaSettings.updatePlayerState(this.player);
    this.player.ready(() =>  {
      // updatePlayerVolumeFactor(this.player,
      //                           prevProps.playerState.volumeFactor,
      //                           this.props.playerState.volumeFactor,
      //                           this.props.playerState.volumeFactorFadeDuration);
    }, true);

    if (!this.displaysTextTracksInNativePlayer) {
      updateTextTracks(this.player,
                        prevProps.textTracks.activeFileId,
                        this.props.textTracks.activeFileId,
                        this.textTrackPosition());
    }

    this.updateAtmoSettings();
  }
  textTrackPosition() {
    var playerControlVariant = this.props.player_controls ? this.props.player_controls : 'classic';
    if (playerControlVariant=='waveform') {
      return 'top';
    }
    return 'auto';
  }
  updateAtmoSettings() {
    this.atmoSettings = this.atmoSettings || {};
    this.atmoSettings['atmo_during_playback'] = this.props.atmoDuringPlayback;
  }
  render() {
    var tracks = undefined;
    if (this.props.textTracks) {
      tracks = textTracksFromFiles(this.props.textTracks.files, this.props.textTracksEnabled)
    }
    var playerState = this.player ? this.player.playerState : this.props.mediaSettings.defaultPlayerState(this)
    return (
      <div style={{height: 100+'%', position: 'relative'}}>
        <MediaTag tagName={this.props.tagName}
                  sources={this.props.sources}
                  tracks={tracks}
                  poster={this.props.poster}
                  loop={this.props.loop}
                  muted={this.initiallyMuted}
                  playsInline={this.props.playsInline}
                  alt={this.props.alt}
                  onSetup={this.setupMediaTag}
                  onDispose={this.disposeMediaTag} />
        <MediaPlayerControls isLoading={playerState.isLoading || playerState.bufferUnderrun}
                        isPlaying={playerState.isPlaying}
                        canPlay={playerState.canPlay}
                        firstPlay={playerState.firstPlay}
                        currentTime={playerState.scrubbingAt !== undefined ? playerState.scrubbingAt : playerState.currentTime}
                        bufferedEnd={playerState.bufferedEnd}
                        duration={playerState.duration}
                        hasProgress={true}
                        mediaElementId={playerState.mediaElementId}
                        controlBarText={this.props.t('pageflow_scrolled.public.media_player.start_audio')}
                        onPlayButtonClick={playerState.actions.togglePlaying}
                        onScrub={playerState.actions.scrubTo}
                        onSeek={playerState.actions.seekTo}

                        onMouseEnter={playerState.actions.controlsEntered}
                        onMouseLeave={playerState.actions.controlsLeft}
                        onFocus={playerState.actions.focusEnteredControls}
                        onBlur={playerState.actions.focusLeftControls}

                        watchVisibility={playerState.isPlaying}
                        onHidden={playerState.actions.controlsHidden}

                        qualityMenuItems={qualityMenuItems(this.props.qualities,
                                                           this.props.file,
                                                           this.props.activeQuality,
                                                           this.props.t)}

                        qualityMenuButtonTitle={this.props.t('pageflow.public.media_quality')}
                        onQualityMenuItemClick={this.props.updateVideoQualitySetting}

                        textTracksMenuItems={textTracksMenuItems(this.props.textTracks, this.props.t)}
                        textTracksMenuButtonTitle={this.props.t('pageflow_scrolled.public.media_player.text_tracks.title')}
                        onTextTracksMenuItemClick={playerState.actions.updateTextTrackSettings}
                        {...this.props} />
      </div>
    );
  }
}

MediaPlayer.defaultProps = {
  textTracksEnabled: true,
  textTracks: {
    files: []
  }
};

function updatePlayerVolumeFactor(player, prevVolumeFactor, volumeFactor, fadeDuration) {
  if (prevVolumeFactor !== volumeFactor) {
    player.changeVolumeFactor(volumeFactor, fadeDuration);
  }
}


function textTracksMenuItems(textTracks, t) {
  if (!textTracks.files.length) {
    return [];
  }

  const offItem = {
    value: 'off',
    label: t('pageflow_scrolled.public.media_player.text_tracks.none'),
    active: textTracks.mode == 'off'
  };

  const autoItem = {
    value: 'auto',
    label: textTracks.autoFile ?
           t('pageflow_scrolled.public.media_player.text_tracks.auto', {
             label: textTracks.configuration.label
           }) :
           t('pageflow_scrolled.public.media_player.text_tracks.auto_off'),
    active: textTracks.mode == 'auto'
  };

  return [autoItem, offItem].concat(textTracks.files.map(textTrackFile => {
    return {
      value: textTrackFile.id,
      label: textTrackFile.configuration.label, 
      active: textTracks.mode == 'user' &&
              textTrackFile.id == textTracks.activeFileId,
    };
  }));
}

function qualityMenuItems(qualities, videoFile, activeQuality, t) {
  activeQuality = activeQuality || 'auto';
  if (!qualities) {
    return [];
  }
  return availableQualities(qualities, videoFile).map(value => ({
    value,
    label: t(`pageflow.public.video_qualities.labels.${value}`),
    annotation: t(`pageflow.public.video_qualities.annotations.${value}`,
                  {defaultValue: ''}),
    active: value == activeQuality
  }));
}

function availableQualities(qualities, videoFile) {
  if (!videoFile) {
    return [];
  }

  return qualities.filter(quality => (!!videoFile.urls[quality] || quality == 'auto'));
}
