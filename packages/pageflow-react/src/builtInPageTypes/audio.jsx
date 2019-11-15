import {Page as MediaPage,
        PageBackgroundAsset,
        PageAudioFilePlayer,
        WaveformPlayerControls,
        reduxModule as mediaReduxModule,
        pageBackgroundReduxModule as mediaPageBackgroundReduxModule} from 'media';

import {PlayerControls} from 'components';

import registerPageType from 'registerPageType';

import {connectInPage} from 'pages';

import {playerState, playerActions} from 'media/selectors';
import {pageAttributes, pageAttribute} from 'pages/selectors';
import {t} from 'i18n/selectors';
import {file} from 'files/selectors';

import {combine, combineSelectors} from 'utils';

function AudioPage(props) {
  const playerControlsVariant = props.page.audioPlayerControlsVariant;

  return (
    <MediaPage className="audio_page supports_text_position_center"
               page={props.page}
               file={props.audioFile}
               playerState={props.playerState}
               playerActions={props.playerActions}
               controlBarText={props.t('pageflow.public.start_audio')}
               playerControlsComponent={playerControlsComponent(playerControlsVariant)}
               dynamicPageScrollerMargin={playerControlsVariant == 'waveform'}
               autoplayWhenBackgroundMediaMuted={false}>

      <PageBackgroundAsset />
      <PageAudioFilePlayer file={props.audioFile}
                           playerState={props.playerState}
                           playerActions={props.playerActions}
                           textTrackPosition={textTrackPosition(playerControlsVariant)} />
    </MediaPage>
  );
}

function playerControlsComponent(variant) {
  if (variant == 'waveform') {
    return WaveformPlayerControls;
  }
  else {
    return PlayerControls;
  }
}

function textTrackPosition(variant) {
  if (variant == 'waveform') {
    return 'top';
  }
}

export function register() {
  registerPageType('audio', {

    component: connectInPage(
      combineSelectors({
        page: pageAttributes(),
        audioFile: file('audioFiles', {id: pageAttribute('audioFileId')}),
        playerState: playerState(),
        t
      }),
      combine({
        playerActions: playerActions()
      })
    )(AudioPage),

    reduxModules: [
      mediaReduxModule({
        retryOnUnmute: true
      }),
      mediaPageBackgroundReduxModule
    ]
  });
}
