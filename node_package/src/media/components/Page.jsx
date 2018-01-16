import {
  PageWrapper,
  PageBackground,
  PageShadow,
  PageForeground,
  PageScroller,
  PageHeader,
  PageText
} from 'components';

import {
  PagePrintImage
} from 'media';

import MediaPlayerControls from './PlayerControls';
import NonJsLinks from './NonJsLinks';
import playerStateClassNames from './playerStateClassNames';
import {combine, combineSelectors} from 'utils';
import {prop, has} from 'utils/selectors';
import {textTracks} from 'media/selectors';

import classNames from 'classnames';
import {connect} from 'react-redux';

export function MediaPage(props) {
  const page = props.page;
  const playerState = props.playerState;

  const infoBox = {
    title: page.additionalTitle,
    description: page.additionalDescription
  };

  return (
    <PageWrapper className={pageWraperClassName(props.className,
                                                (props.page.autoplay !== false),
                                                props.textTracks,
                                                playerState)}>
      <PageBackground pageHasPlayerControls={true}>
        {props.children}
        <PageShadow page={page} className={playerStateClassNames(playerState)} />
      </PageBackground>

      <PageForeground onInteraction={() => playerState.userIsIdle &&
                                         props.playerActions.userInteraction()}
                      classNames={playerStateClassNames(playerState)}>


        <MediaPlayerControls file={props.file}
                             textTracks={props.textTracks}
                             playerState={playerState}
                             playerActions={props.playerActions}
                             qualities={props.qualities}
                             controlBarText={props.controlBarText}
                             infoBox={infoBox} />

        <PageScroller className={playerStateClassNames(playerState)}>
          <PageHeader page={page} />
          <PagePrintImage page={page} />
          <PageText page={page}>
            <NonJsLinks file={props.file} />
          </PageText>
        </PageScroller>
      </PageForeground>
    </PageWrapper>
  );
}

export default connect(combineSelectors({
  textTracks: textTracks({
    file: prop('file'),
    defaultTextTrackFileId: prop('page.defaultTextTrackFileId')
  })
}))(MediaPage);

function pageWraperClassName(className, autoplay, textTracks, playerState) {
  return classNames(className, {
    'has_text_tracks': !!textTracks.activeFileId,
    'is_idle': playerState.isPlaying && playerState.userIsIdle,
    'is_control_bar_focused': playerState.focusInsideControls,
    'is_control_bar_hovered': playerState.userHoveringControls,
    'is_control_bar_hidden': playerState.controlsHidden,
    'unplayed': playerState.unplayed && !autoplay,
    'has_played': playerState.hasPlayed
  });
}
