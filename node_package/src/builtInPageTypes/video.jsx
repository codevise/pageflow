import {Page as MediaPage,
        MobilePageVideoPoster,
        PageVideoPlayer,
        reduxModule as mediaReduxModule} from 'media';

import registerPageType from 'registerPageType';

import {connectInPage} from 'pages';

import {playerState, playerActions} from 'media/selectors';
import {pageAttributes, pageAttribute} from 'pages/selectors';
import {t} from 'i18n/selectors';
import {file} from 'files/selectors';
import {has} from 'utils/selectors';

import {combine, combineSelectors} from 'utils';

const qualities = ['auto', '4k', 'fullhd', 'medium'];

function VideoPage(props) {
  return (
    <MediaPage className="video_page supports_text_position_center"
               page={props.page}
               file={props.videoFile}
               qualities={qualities}
               playerState={props.playerState}
               playerActions={props.playerActions}
               controlBarText={props.t('pageflow.public.start_video')}
               autoplayWhenBackgroundMediaMuted={true}>

      <PageVideoPlayer page={props.page}
                       playerState={props.playerState}
                       playerActions={props.playerActions}/>
      <MobilePageVideoPoster page={props.page} />
    </MediaPage>
  );
}

export function register() {
  registerPageType('video', {

    component: connectInPage(
      combineSelectors({
        page: pageAttributes(),
        videoFile: file('videoFiles', {id: pageAttribute('videoFileId')}),
        playerState: playerState(),
        t
      }),
      combine({
        playerActions: playerActions()
      })
    )(VideoPage),

    reduxModules: [
      mediaReduxModule({
        hideControls: true,
        autoplayWhenBackgroundMediaMuted: true,
        playsInNativePlayer: has('native video player')
      })
    ]
  });
}
