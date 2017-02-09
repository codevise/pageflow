import VideoFilePlayer from './VideoFilePlayer';
import createPageFilePlayer from './createPageFilePlayer';
import {file} from 'files/selectors';
import {prop} from 'selectors';
import {camelize, combine} from 'utils';

import {connect} from 'react-redux';

export const VideoPlayer = connect(combine({
  file: file('videoFiles', {id: prop('videoFileId')}),
  posterImageFile: file('imageFiles', {id: prop('posterImageFileId')})
}))(createPageFilePlayer(VideoFilePlayer));

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
