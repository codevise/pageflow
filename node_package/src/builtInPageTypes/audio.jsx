import {Page as MediaPage,
        PageBackgroundAsset,
        reduxModule as mediaReduxModule,
        pageBackgroundReduxModule as mediaPageBackgroundReduxModule} from 'media';

import PageAudioFilePlayer from 'media/components/PageAudioFilePlayer';

import registerPageType from 'registerPageType';

import {connectInPage} from 'pages';

import {playerState, playerActions} from 'media/selectors';
import {pageAttributes, pageAttribute} from 'pages/selectors';
import {t} from 'i18n/selectors';
import {file} from 'files/selectors';

import {combine} from 'utils';

function AudioPage(props) {
  return (
    <MediaPage className="audioPage"
               page={props.page}
               file={props.audioFile}
               playerState={props.playerState}
               playerActions={props.playerActions}
               controlBarText={props.t('pageflow.public.start_audio')}>

      <PageBackgroundAsset />
      <PageAudioFilePlayer file={props.audioFile}
                           playerState={props.playerState}
                           playerActions={props.playerActions} />
    </MediaPage>
  );
}

export function register() {
  registerPageType('audio', {

    component: connectInPage(
      combine({
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
      mediaReduxModule(),
      mediaPageBackgroundReduxModule
    ]
  });
}
