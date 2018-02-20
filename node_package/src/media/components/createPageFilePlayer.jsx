import {connectInPage} from 'pages';
import {pageIsPrepared, pageAttribute} from 'pages/selectors';

import {combineSelectors} from 'utils';

export default function(FilePlayer) {
  function PageFilePlayer(props) {
    if (props.file &&
        props.file.isReady &&
        props.pageIsPrepared) {
      return (
        <FilePlayer file={props.file}
                    posterImageFile={props.posterImageFile}
                    playerState={props.playerState}
                    playerActions={props.playerActions}
                    atmoDuringPlayback={props.atmoDuringPlayback}
                    fit={props.fit}
                    position={props.position}
                    loop={props.loop}
                    muted={props.muted}
                    playAudioViaContext={props.playAudioViaContext}
                    playsInline={props.playsInline}
                    defaultTextTrackFileId={props.defaultTextTrackFileId}
                    textTracksEnabled={props.textTracksEnabled} />
      );
    }
    else {
      return null;
    }
  }

  return connectInPage(combineSelectors({
    pageIsPrepared: pageIsPrepared(),
    atmoDuringPlayback: pageAttribute('atmoDuringPlayback'),
    defaultTextTrackFileId: pageAttribute('defaultTextTrackFileId')
  }))(PageFilePlayer);
}
