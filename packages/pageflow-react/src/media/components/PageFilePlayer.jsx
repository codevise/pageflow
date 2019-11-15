import {connectInPage} from 'pages';
import {pageIsPrepared, pageIsPreloaded, pageAttribute} from 'pages/selectors';

import {combineSelectors} from 'utils';

export function PageFilePlayer(props) {
  const fileReady = props.file && props.file.isReady;

  if (fileReady) {
    const StructuredDataComponent = props.structuredDataComponent || function() { return null; };

    return (
      <div style={{height: '100%'}}>
        {renderFile(props)}
        <StructuredDataComponent file={props.file} />
      </div>
    );
  }
  else {
    return <noscript />;
  }
}

function renderFile(props) {
  if (props.pageIsPrepared) {
    const FilePlayer = props.playerComponent;

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
                  playsInline={props.playsInline}
                  defaultTextTrackFileId={props.defaultTextTrackFileId}
                  textTracksEnabled={props.textTracksEnabled}
                  textTrackPosition={props.textTrackPosition} />
    );
  }
  else if (props.preloadComponent && props.pageIsPreloaded) {
    const Preload = props.preloadComponent;

    return (
      <Preload file={props.file}
               posterImageFile={props.posterImageFile} />
    );
  }
  else {
    return <noscript />;
  }
}

export default connectInPage(combineSelectors({
  pageIsPrepared: pageIsPrepared(),
  pageIsPreloaded: pageIsPreloaded(),
  atmoDuringPlayback: pageAttribute('atmoDuringPlayback'),
  defaultTextTrackFileId: pageAttribute('defaultTextTrackFileId')
}))(PageFilePlayer);
