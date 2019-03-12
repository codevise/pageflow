import VideoFilePlayer, {VideoFilePlayerPreload} from './VideoFilePlayer';
import VideoStructuredData from './VideoStructuredData';
import PageFilePlayer from './PageFilePlayer';
import {muted as backgroundMediaMuted} from 'backgroundMedia/selectors';
import {file} from 'files/selectors';
import {prop} from 'selectors';
import {camelize, combineSelectors} from 'utils';

import {connect} from 'react-redux';

function PageVideoFilePlayer(props) {
  return (
    <PageFilePlayer {...props}
                    playerComponent={VideoFilePlayer}
                    preloadComponent={VideoFilePlayerPreload}
                    structuredDataComponent={VideoStructuredData} />
  );
}

export const VideoPlayer = connect(combineSelectors({
  file: file('videoFiles', {id: prop('videoFileId')}),
  posterImageFile: file('imageFiles', {id: prop('posterImageFileId')}),
  muted
}))(PageVideoFilePlayer);

function muted(state, props) {
  return props.muted || backgroundMediaMuted(state);
}

export default function PageVideoPlayer(props) {
  const page = props.page;

  const videoProperty = camelize.concat(props.propertyNamePrefix, props.videoPropertyBaseName);
  const posterProperty = camelize.concat(props.propertyNamePrefix, props.posterImagePropertyBaseName);

  return (
    <VideoPlayer videoFileId={page[`${videoProperty}Id`]}
                 posterImageFileId={page[`${posterProperty}Id`]}
                 playerState={props.playerState}
                 playerActions={props.playerActions}
                 fit={props.fit}
                 position={[page[`${videoProperty}X`], page[`${videoProperty}Y`]]}
                 textTracksEnabled={props.textTracksEnabled}
                 loop={props.loop}
                 muted={props.muted}
                 playsInline={props.playsInline} />
  );
}

PageVideoPlayer.defaultProps = {
  videoPropertyBaseName: 'videoFile',
  posterImagePropertyBaseName: 'posterImage',
  fit: 'smart_contain'
};
